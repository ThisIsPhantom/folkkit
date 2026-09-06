import { processDocument } from './documentPipeline.js'
import { DOCUMENT_ERRORS } from './documentConstants.js'
self.postMessage({ ready: true })
self.onmessage = async ({ data }) => {
  try { const result = await processDocument(data.file, data.from, data.to, progress => self.postMessage({ progress })); self.postMessage({ result }) }
  catch (error) { self.postMessage({ error: DOCUMENT_ERRORS.includes(error?.code) ? error.code : 'conversion_failed' }) }
}
