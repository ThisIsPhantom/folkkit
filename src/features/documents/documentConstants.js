export const DOCUMENT_FORMATS = Object.freeze(['docx', 'markdown', 'html'])
export const DOCUMENT_LIMITS = Object.freeze({ text: 2 * 1024 ** 2, docx: 20 * 1024 ** 2, output: 64 * 1024 ** 2, entries: 1000, timeout: 60_000, image: 8 * 1024 ** 2, nodes: 100_000, depth: 128 })
export const DOCUMENT_ERRORS = Object.freeze(['invalid_document', 'document_too_large', 'document_timeout', 'unsafe_document', 'unsupported_type', 'cancelled', 'conversion_failed', 'document_runtime_unavailable'])
export function documentError(code) { return Object.assign(new Error(DOCUMENT_ERRORS.includes(code) ? code : 'conversion_failed'), { code: DOCUMENT_ERRORS.includes(code) ? code : 'conversion_failed' }) }
