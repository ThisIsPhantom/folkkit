// Lazy-load pdf-lib only when a PDF converter is used

import { IMAGE_ACCEPT_TYPES, TOOL_LIMITS } from '../runtime/limits.js'
import { assertTextPdfBudget } from '../runtime/workBudgets.js'
import { runPdfWorkerTask, terminatePdfWorkers } from '../runtime/pdfWorkerClient.js'

async function loadPdfLib() {
  const { PDFDocument } = await import('pdf-lib')
  return PDFDocument
}

function pdfWorkerConverter(operation, hasTextInput = false) {
  if (hasTextInput) {
    return (files, textInput, context) => runPdfWorkerTask({ operation, files: Array.isArray(files) ? files : [files], textInput, signal: context?.signal })
  }
  return (files, _onProgress, context) => runPdfWorkerTask({ operation, files: Array.isArray(files) ? files : [files], signal: context?.signal })
}

export const pdfConverters = [
  {
    id: 'images-to-pdf',
    name: 'Images to PDF',
    category: 'document',
    description: 'Combine multiple images into a single PDF — drop or select image files',
    acceptsFile: true,
    acceptTypes: IMAGE_ACCEPT_TYPES,
    multipleFiles: true,
    isMediaConverter: true,
    fileConvert: async (files) => {
      if (!files || files.length === 0) throw new Error('No files')
      const PDFDocument = await loadPdfLib()

      const pdfDoc = await PDFDocument.create()

      for (const file of files) {
        const bytes = await file.arrayBuffer()
        const uint8 = new Uint8Array(bytes)

        let image
        if (file.type === 'image/png') {
          image = await pdfDoc.embedPng(uint8)
        } else if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
          image = await pdfDoc.embedJpg(uint8)
        } else {
          const bitmap = await createImageBitmap(file)
          try {
            const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
            const ctx = canvas.getContext('2d')
            ctx.drawImage(bitmap, 0, 0)
            const blob = await canvas.convertToBlob({ type: 'image/png' })
            const pngBytes = new Uint8Array(await blob.arrayBuffer())
            image = await pdfDoc.embedPng(pngBytes)
          } finally {
            bitmap.close?.()
          }
        }

        const page = pdfDoc.addPage([image.width, image.height])
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        })
      }

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      return { kind: 'download', blob, filename: 'combined.pdf' }
    },
  },
  {
    id: 'merge-pdf',
    name: 'Merge PDFs',
    category: 'document',
    description: 'Merge multiple PDF files into one',
    acceptsFile: true,
    acceptTypes: 'application/pdf,.pdf',
    multipleFiles: true,
    isMediaConverter: true,
    fileConvert: pdfWorkerConverter('merge'),
  },
  {
    id: 'pdf-page-count',
    name: 'PDF Page Count',
    category: 'document',
    description: 'Get the number of pages in a PDF file',
    acceptsFile: true,
    acceptTypes: 'application/pdf,.pdf',
    isMediaConverter: true,
    fileConvert: pdfWorkerConverter('page-count'),
  },
  {
    id: 'pdf-split',
    name: 'PDF Split (Extract Page)',
    category: 'document',
    description: 'Extract a single page from a PDF — enter page number in text field',
    acceptsFile: true,
    acceptTypes: 'application/pdf,.pdf',
    isMediaConverter: true,
    hasTextInput: true,
    textPlaceholder: 'Page number (e.g. 1)',
    fileConvert: pdfWorkerConverter('split', true),
  },
  {
    id: 'pdf-extract-range',
    name: 'PDF Extract Pages',
    category: 'document',
    description: 'Extract a range of pages from a PDF — enter range like 1-5 or 1,3,5',
    acceptsFile: true,
    acceptTypes: 'application/pdf,.pdf',
    isMediaConverter: true,
    hasTextInput: true,
    textPlaceholder: 'Page range (e.g. 1-5 or 1,3,5)',
    fileConvert: pdfWorkerConverter('extract-range', true),
  },
  {
    id: 'text-to-pdf',
    name: 'Text to PDF',
    category: 'document',
    description: 'Convert plain text into a simple PDF document',
    convert: async (input) => {
      if (!input.trim()) return ''
      assertTextPdfBudget(input)
      const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib')
      const pdfDoc = await PDFDocument.create()
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
      const fontSize = 11
      const margin = 50
      const lineHeight = fontSize * 1.4

      const lines = input.split('\n')
      const wrappedLines = []
      const maxWidth = 595 - margin * 2 // A4 width

      for (const line of lines) {
        if (!line.trim()) { wrappedLines.push(''); continue }
        const words = line.split(' ')
        let currentLine = ''
        for (const word of words) {
          const testLine = currentLine ? currentLine + ' ' + word : word
          if (font.widthOfTextAtSize(testLine, fontSize) > maxWidth && currentLine) {
            wrappedLines.push(currentLine)
            currentLine = word
          } else {
            currentLine = testLine
          }
        }
        if (currentLine) wrappedLines.push(currentLine)
      }

      let page = pdfDoc.addPage([595, 842]) // A4
      let y = 842 - margin
      for (const line of wrappedLines) {
        if (y < margin + lineHeight) {
          page = pdfDoc.addPage([595, 842])
          y = 842 - margin
        }
        if (line) {
          page.drawText(line, { x: margin, y, size: fontSize, font, color: rgb(0.1, 0.1, 0.1) })
        }
        y -= lineHeight
      }

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const pageCount = Math.max(1, Math.ceil(wrappedLines.length * lineHeight / (842 - margin * 2)))
      return {
        kind: 'download',
        blob,
        filename: 'folkkit-text.pdf',
        info: `PDF generated (${wrappedLines.length} lines, ${pageCount} pages)`,
      }
    },
  },
  {
    id: 'pdf-metadata',
    name: 'PDF Metadata',
    category: 'document',
    description: 'View metadata of a PDF file (title, author, dates, etc.)',
    acceptsFile: true,
    acceptTypes: 'application/pdf,.pdf',
    isMediaConverter: true,
    fileConvert: pdfWorkerConverter('metadata'),
  },
  {
    id: 'pdf-rotate',
    name: 'PDF Rotate Pages',
    category: 'document',
    description: 'Rotate all pages in a PDF — enter degrees (90, 180, 270)',
    acceptsFile: true,
    acceptTypes: 'application/pdf,.pdf',
    isMediaConverter: true,
    hasTextInput: true,
    textPlaceholder: 'Degrees: 90, 180, or 270',
    fileConvert: pdfWorkerConverter('rotate', true),
  },
].map((converter) => ({
  ...converter,
  limits: converter.id === 'images-to-pdf' ? TOOL_LIMITS.images : TOOL_LIMITS.pdf,
  ...(converter.id.startsWith('pdf-') || converter.id === 'merge-pdf' ? { terminate: terminatePdfWorkers } : {}),
}))
