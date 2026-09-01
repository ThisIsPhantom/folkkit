// Lazy-load pdf-lib only when a PDF converter is used

import { TOOL_LIMITS } from '../runtime/limits'

async function loadPdfLib() {
  const { PDFDocument } = await import('pdf-lib')
  return PDFDocument
}

export const pdfConverters = [
  {
    id: 'images-to-pdf',
    name: 'Images to PDF',
    category: 'document',
    description: 'Combine multiple images into a single PDF — drop or select image files',
    acceptsFile: true,
    acceptTypes: 'image/*',
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
    fileConvert: async (files) => {
      if (!files || files.length === 0) throw new Error('No files')
      const PDFDocument = await loadPdfLib()

      const merged = await PDFDocument.create()

      for (const file of files) {
        const bytes = await file.arrayBuffer()
        const pdf = await PDFDocument.load(bytes)
        const pages = await merged.copyPages(pdf, pdf.getPageIndices())
        pages.forEach((page) => merged.addPage(page))
      }

      const pdfBytes = await merged.save()
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      return { kind: 'download', blob, filename: 'merged.pdf' }
    },
  },
  {
    id: 'pdf-page-count',
    name: 'PDF Page Count',
    category: 'document',
    description: 'Get the number of pages in a PDF file',
    acceptsFile: true,
    acceptTypes: 'application/pdf,.pdf',
    isMediaConverter: true,
    fileConvert: async (files) => {
      const PDFDocument = await loadPdfLib()
      const file = Array.isArray(files) ? files[0] : files
      const bytes = await file.arrayBuffer()
      const pdf = await PDFDocument.load(bytes)
      const count = pdf.getPageCount()
      return { kind: 'text', text: `${file.name}: ${count} page${count !== 1 ? 's' : ''}` }
    },
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
    fileConvert: async (files, textInput) => {
      const PDFDocument = await loadPdfLib()
      const file = Array.isArray(files) ? files[0] : files
      const pageNum = parseInt(textInput) || 1
      const bytes = await file.arrayBuffer()
      const src = await PDFDocument.load(bytes)
      const total = src.getPageCount()

      if (pageNum < 1 || pageNum > total) {
        throw new Error(`Page ${pageNum} doesn't exist (PDF has ${total} pages)`)
      }

      const newPdf = await PDFDocument.create()
      const [page] = await newPdf.copyPages(src, [pageNum - 1])
      newPdf.addPage(page)
      const pdfBytes = await newPdf.save()
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const name = file.name.replace(/\.pdf$/i, '') + `_page${pageNum}.pdf`
      return { kind: 'download', blob, filename: name, info: `Extracted page ${pageNum} of ${total}` }
    },
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
    fileConvert: async (files, textInput) => {
      const PDFDocument = await loadPdfLib()
      const file = Array.isArray(files) ? files[0] : files
      const bytes = await file.arrayBuffer()
      const src = await PDFDocument.load(bytes)
      const total = src.getPageCount()
      const range = textInput.trim() || '1'

      // Parse page range
      const pages = new Set()
      for (const part of range.split(',')) {
        const trimmed = part.trim()
        if (trimmed.includes('-')) {
          const [start, end] = trimmed.split('-').map(Number)
          for (let i = start; i <= end && i <= total; i++) {
            if (i >= 1) pages.add(i - 1)
          }
        } else {
          const n = parseInt(trimmed)
          if (n >= 1 && n <= total) pages.add(n - 1)
        }
      }

      if (pages.size === 0) throw new Error('No valid pages in range')
      const indices = [...pages].sort((a, b) => a - b)

      const newPdf = await PDFDocument.create()
      const copied = await newPdf.copyPages(src, indices)
      copied.forEach(page => newPdf.addPage(page))
      const pdfBytes = await newPdf.save()
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const name = file.name.replace(/\.pdf$/i, '') + `_pages.pdf`
      return { kind: 'download', blob, filename: name, info: `Extracted ${indices.length} page(s) from ${total}` }
    },
  },
  {
    id: 'text-to-pdf',
    name: 'Text to PDF',
    category: 'document',
    description: 'Convert plain text into a simple PDF document',
    convert: async (input) => {
      if (!input.trim()) return ''
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
    fileConvert: async (files) => {
      const PDFDocument = await loadPdfLib()
      const file = Array.isArray(files) ? files[0] : files
      const bytes = await file.arrayBuffer()
      const pdf = await PDFDocument.load(bytes)
      const info = [
        `File: ${file.name}`,
        `Pages: ${pdf.getPageCount()}`,
        `Title: ${pdf.getTitle() || '(none)'}`,
        `Author: ${pdf.getAuthor() || '(none)'}`,
        `Subject: ${pdf.getSubject() || '(none)'}`,
        `Creator: ${pdf.getCreator() || '(none)'}`,
        `Producer: ${pdf.getProducer() || '(none)'}`,
        `Created: ${pdf.getCreationDate()?.toISOString() || '(unknown)'}`,
        `Modified: ${pdf.getModificationDate()?.toISOString() || '(unknown)'}`,
      ]
      const page1 = pdf.getPage(0)
      const { width, height } = page1.getSize()
      info.push(`Page 1 size: ${Math.round(width)} x ${Math.round(height)} pts`)
      return { kind: 'text', text: info.join('\n') }
    },
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
    fileConvert: async (files, textInput) => {
      const PDFDocument = await loadPdfLib()
      const { degrees } = await import('pdf-lib')
      const file = Array.isArray(files) ? files[0] : files
      const deg = parseInt(textInput) || 90
      const bytes = await file.arrayBuffer()
      const pdf = await PDFDocument.load(bytes)
      const pages = pdf.getPages()
      for (const page of pages) {
        page.setRotation(degrees(page.getRotation().angle + deg))
      }
      const pdfBytes = await pdf.save()
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const name = file.name.replace(/\.pdf$/i, '') + `_rotated${deg}.pdf`
      return { kind: 'download', blob, filename: name, info: `Rotated ${pages.length} pages by ${deg} degrees` }
    },
  },
].map((converter) => ({
  ...converter,
  limits: converter.id === 'images-to-pdf' ? TOOL_LIMITS.images : TOOL_LIMITS.pdf,
}))
