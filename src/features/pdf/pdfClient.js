import { PDF_LIMITS, pdfError } from './pdfEngine.js'

export class PdfWorkerClient {
  constructor({ WorkerCtor, timeoutMs = 45000 } = {}) {
    if (!WorkerCtor && typeof Worker !== 'function') throw pdfError('unsupported_browser')
    this.worker = WorkerCtor ? new WorkerCtor() : new Worker(new URL('./pdfStudioWorker.js', import.meta.url), { type: 'module', name: 'folkkit-pdf-studio' })
    this.pending = new Map(); this.nextId = 1; this.timeoutMs = timeoutMs; this.disposed = false
    this.worker.onmessage = ({ data }) => {
      const pending = this.pending.get(data?.id)
      if (!pending) return
      clearTimeout(pending.timer); this.pending.delete(data.id)
      if (data.ok) pending.resolve(data.result)
      else pending.reject(pdfError(['resource_limit', 'unsupported_text', 'unsupported_structure', 'last_page'].includes(data.code) ? data.code : 'invalid_file'))
    }
    this.worker.onerror = () => this.dispose('invalid_file')
  }
  call(method, args = []) {
    if (this.disposed) return Promise.reject(pdfError('cancelled'))
    const id = this.nextId++
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => this.dispose('resource_limit'), this.timeoutMs)
      this.pending.set(id, { resolve, reject, timer })
      try { this.worker.postMessage({ id, method, args }) } catch { this.dispose('invalid_file') }
    })
  }
  open(bytes) {
    if (!(bytes instanceof Uint8Array) || bytes.length > PDF_LIMITS.bytes) return Promise.reject(pdfError('resource_limit'))
    return this.call('open', [bytes])
  }
  metadata() { return this.call('metadata') }
  render(pageIndex, options) { return this.call('render', [pageIndex, options]) }
  objects(pageIndex) { return this.call('objects', [pageIndex]) }
  change(method, ...args) { return this.call('change', [method, args]) }
  undo() { return this.call('undo') }
  redo() { return this.call('redo') }
  save() { return this.call('save') }
  original() { return this.call('original') }
  extract(indices) { return this.call('extract', [indices]) }
  markSaved() { return this.call('markSaved') }
  checkpoint() { return this.call('checkpoint') }
  restore(checkpoint) { return this.call('restore', [checkpoint]) }
  close() { this.dispose() }
  dispose(code = 'cancelled') {
    if (this.disposed) return
    this.disposed = true
    this.worker.terminate()
    for (const pending of this.pending.values()) { clearTimeout(pending.timer); pending.reject(pdfError(code)) }
    this.pending.clear()
  }
}
