import { PDFDocument, degrees } from 'pdf-lib'
import { OUTPUT_LIMIT_BYTES, PDF_WORK_LIMITS, resourceLimitError } from '../runtime/workBudgets'

function invalidFileError() {
  const error = new Error('invalid_file')
  error.code = 'invalid_file'
  return error
}

function assertPageBudget(count, aggregate = count) {
  if (!Number.isInteger(count) || count < 0 || count > PDF_WORK_LIMITS.maxPages || aggregate > PDF_WORK_LIMITS.maxPages) {
    throw resourceLimitError()
  }
}

function assertOutputBytes(bytes) {
  if (bytes.byteLength > OUTPUT_LIMIT_BYTES) throw resourceLimitError()
  return bytes
}

async function loadDocument(file) {
  try {
    const document = await PDFDocument.load(file.bytes)
    const pageCount = document.getPageCount()
    assertPageBudget(pageCount)
    return { document, pageCount }
  } catch (error) {
    if (error?.code === 'resource_limit') throw error
    throw invalidFileError()
  }
}

function firstFile(files) {
  if (!Array.isArray(files) || files.length !== 1) throw invalidFileError()
  return files[0]
}

function pdfDownload(bytes, filename, info) {
  return {
    kind: 'download', bytes: assertOutputBytes(bytes), mimeType: 'application/pdf', filename,
    ...(info ? { info } : {}),
  }
}

export async function runPdfOperation({ operation, files, textInput = '' }) {
  if (!Array.isArray(files) || files.length < 1) throw invalidFileError()
  if (operation === 'merge') {
    const merged = await PDFDocument.create()
    let aggregatePages = 0
    for (const file of files) {
      const { document, pageCount } = await loadDocument(file)
      aggregatePages += pageCount
      assertPageBudget(pageCount, aggregatePages)
      const pages = await merged.copyPages(document, document.getPageIndices())
      pages.forEach(page => merged.addPage(page))
    }
    return pdfDownload(await merged.save(), 'merged.pdf')
  }

  const file = firstFile(files)
  const { document, pageCount } = await loadDocument(file)
  if (operation === 'page-count') return { kind: 'text', text: `${file.name}: ${pageCount} page${pageCount !== 1 ? 's' : ''}` }
  if (operation === 'split') {
    const pageNumber = Number.parseInt(textInput, 10) || 1
    if (pageNumber < 1 || pageNumber > pageCount) throw invalidFileError()
    const output = await PDFDocument.create()
    const [page] = await output.copyPages(document, [pageNumber - 1])
    output.addPage(page)
    return pdfDownload(await output.save(), file.name.replace(/\.pdf$/i, '') + `_page${pageNumber}.pdf`, `Extracted page ${pageNumber} of ${pageCount}`)
  }
  if (operation === 'extract-range') {
    const pages = new Set()
    for (const part of (textInput.trim() || '1').split(',')) {
      const range = part.trim().match(/^(\d+)(?:-(\d+))?$/)
      if (!range) throw invalidFileError()
      const start = Number(range[1])
      const end = Number(range[2] || range[1])
      if (start < 1 || end < start || end > pageCount || end - start + 1 > PDF_WORK_LIMITS.maxPages) throw resourceLimitError()
      for (let page = start; page <= end; page += 1) pages.add(page - 1)
    }
    if (pages.size < 1 || pages.size > PDF_WORK_LIMITS.maxPages) throw resourceLimitError()
    const indices = [...pages].sort((a, b) => a - b)
    const output = await PDFDocument.create()
    const copied = await output.copyPages(document, indices)
    copied.forEach(page => output.addPage(page))
    return pdfDownload(await output.save(), file.name.replace(/\.pdf$/i, '') + '_pages.pdf', `Extracted ${indices.length} page(s) from ${pageCount}`)
  }
  if (operation === 'metadata') {
    const info = [
      `File: ${file.name}`, `Pages: ${pageCount}`, `Title: ${document.getTitle() || '(none)'}`,
      `Author: ${document.getAuthor() || '(none)'}`, `Subject: ${document.getSubject() || '(none)'}`,
      `Creator: ${document.getCreator() || '(none)'}`, `Producer: ${document.getProducer() || '(none)'}`,
      `Created: ${document.getCreationDate()?.toISOString() || '(unknown)'}`,
      `Modified: ${document.getModificationDate()?.toISOString() || '(unknown)'}`,
    ]
    if (pageCount > 0) {
      const { width, height } = document.getPage(0).getSize()
      info.push(`Page 1 size: ${Math.round(width)} x ${Math.round(height)} pts`)
    }
    return { kind: 'text', text: info.join('\n') }
  }
  if (operation === 'rotate') {
    const rotation = Number.parseInt(textInput, 10) || 90
    if (![90, 180, 270].includes(rotation)) throw invalidFileError()
    const pages = document.getPages()
    pages.forEach(page => page.setRotation(degrees(page.getRotation().angle + rotation)))
    return pdfDownload(await document.save(), file.name.replace(/\.pdf$/i, '') + `_rotated${rotation}.pdf`, `Rotated ${pages.length} pages by ${rotation} degrees`)
  }
  throw invalidFileError()
}
