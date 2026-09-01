import { PDFDocument } from 'pdf-lib'
import { expect, test } from 'vitest'
import { PDF_WORK_LIMITS } from '../runtime/workBudgets'
import { runPdfOperation } from './pdfWorkerOperations'

test('PDF worker rejects excessive page complexity immediately after parsing', async () => {
  const document = await PDFDocument.create()
  for (let page = 0; page <= PDF_WORK_LIMITS.maxPages; page += 1) document.addPage([1, 1])
  const bytes = await document.save()

  await expect(runPdfOperation({
    operation: 'page-count',
    files: [{ name: 'excessive.pdf', type: 'application/pdf', bytes }],
  })).rejects.toMatchObject({ code: 'resource_limit' })
})

test('PDF worker maps corrupt parser input to a content-free stable code', async () => {
  await expect(runPdfOperation({
    operation: 'metadata',
    files: [{ name: 'private-marker.pdf', type: 'application/pdf', bytes: new TextEncoder().encode('%PDF-corrupt') }],
  })).rejects.toMatchObject({ code: 'invalid_file', message: 'invalid_file' })
})
