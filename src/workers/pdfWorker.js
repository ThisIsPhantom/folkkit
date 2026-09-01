import { runPdfOperation } from './pdfWorkerOperations'

self.onmessage = async ({ data }) => {
  try {
    const result = await runPdfOperation(data)
    const transfer = result?.bytes?.buffer instanceof ArrayBuffer ? [result.bytes.buffer] : []
    self.postMessage({ ok: true, result }, transfer)
  } catch (error) {
    self.postMessage({ ok: false, code: error?.code === 'resource_limit' ? 'resource_limit' : 'invalid_file' })
  }
}
