import { init } from '@embedpdf/pdfium'
import wasmUrl from '@embedpdf/pdfium/pdfium.wasm?url'
import { PdfEngine, pdfError } from './pdfEngine.js'
import { PdfSession } from './pdfSession.js'

let sessionPromise
function session() {
  sessionPromise ??= init({ locateFile: () => wasmUrl, print: () => {}, printErr: () => {} }).then(api => new PdfSession(new PdfEngine(api)))
  return sessionPromise
}
const allowed = new Set(['open', 'metadata', 'render', 'objects', 'change', 'undo', 'redo', 'save', 'original', 'extract', 'markSaved', 'close', 'checkpoint', 'restore'])
let queue = Promise.resolve()
globalThis.onmessage = ({ data }) => {
  queue = queue.then(async () => {
    const id = data?.id
    try {
      if (!Number.isSafeInteger(id) || !allowed.has(data.method) || !Array.isArray(data.args)) throw pdfError()
      const state = await session()
      let result
      switch (data.method) {
        case 'open': result = state.open(...data.args); break
        case 'metadata': result = state.state(); break
        case 'change': result = state.change(...data.args); break
        case 'undo': result = state.undo(); break
        case 'redo': result = state.redo(); break
        case 'markSaved': result = state.markSaved(); break
        case 'checkpoint': result = state.checkpoint(); break
        case 'restore': result = state.restore(...data.args); break
        case 'original': result = state.original?.slice(); break
        case 'close': state.close(); result = null; break
        default: result = state.engine[data.method](...data.args)
      }
      const transfer = result instanceof Uint8Array ? [result.buffer] : result?.pixels ? [result.pixels.buffer] : []
      globalThis.postMessage({ id, ok: true, result }, transfer)
    } catch (error) {
      const code = ['resource_limit', 'unsupported_text', 'unsupported_structure', 'last_page'].includes(error?.code) ? error.code : 'invalid_file'
      globalThis.postMessage({ id, ok: false, code })
    }
  })
}
