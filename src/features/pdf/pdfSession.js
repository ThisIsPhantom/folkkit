import { PDF_LIMITS, ensure, pdfError } from './pdfEngine.js'

const changes = new Set(['replaceText', 'addText', 'addImage', 'addDrawing', 'addNote', 'transformObject', 'removeObject', 'pageAction', 'merge'])
export class PdfSession {
  constructor(engine) { this.engine = engine; this.history = []; this.future = []; this.original = null; this.revision = 0; this.savedRevision = 0; this.nextRevision = 1 }
  open(bytes) {
    this.engine.open(bytes)
    this.original = bytes.slice()
    this.history = []; this.future = []; this.revision = 0; this.savedRevision = 0; this.nextRevision = 1
    return this.state()
  }
  state() { return { ...this.engine.metadata(), dirty: this.revision !== this.savedRevision, canUndo: this.history.length > 0, canRedo: this.future.length > 0 } }
  trimHistory(currentBytes = this.engine.save()) {
    const budget = () => this.history.concat(this.future).reduce((sum, item) => sum + item.bytes.length, (this.original?.length || 0) + currentBytes.length)
    while (this.history.length > 8 || (budget() > PDF_LIMITS.output && this.history.length)) this.history.shift()
    while (budget() > PDF_LIMITS.output && this.future.length) this.future.shift()
    ensure(budget() <= PDF_LIMITS.output, 'resource_limit')
  }
  checkpoint() {
    const bytes = this.engine.save()
    this.trimHistory(bytes)
    return { bytes, original: this.original.slice(), history: this.history.map(item => ({ ...item, bytes: item.bytes.slice() })), future: this.future.map(item => ({ ...item, bytes: item.bytes.slice() })), revision: this.revision, savedRevision: this.savedRevision, nextRevision: this.nextRevision }
  }
  restore(checkpoint) {
    ensure(checkpoint?.bytes instanceof Uint8Array && checkpoint.original instanceof Uint8Array)
    ensure(Array.isArray(checkpoint.history) && Array.isArray(checkpoint.future) && checkpoint.history.length + checkpoint.future.length <= 8)
    const snapshots = [...checkpoint.history, ...checkpoint.future]
    ensure(snapshots.every(item => item.bytes instanceof Uint8Array && Number.isSafeInteger(item.revision)))
    ensure(snapshots.reduce((sum, item) => sum + item.bytes.length, checkpoint.bytes.length + checkpoint.original.length) <= PDF_LIMITS.output, 'resource_limit')
    this.engine.open(checkpoint.bytes)
    this.original = checkpoint.original.slice(); this.history = checkpoint.history; this.future = checkpoint.future
    this.revision = checkpoint.revision; this.savedRevision = checkpoint.savedRevision; this.nextRevision = checkpoint.nextRevision
    return this.state()
  }
  change(method, args) {
    ensure(changes.has(method) && Array.isArray(args))
    const before = this.engine.save()
    try {
      this.engine[method](...args)
      const after = this.engine.save()
      this.engine.open(after)
      if (method === 'replaceText') {
        const object = this.engine.objects(args[0]).find(item => item.index === args[1])
        ensure(object?.text === args[2], 'unsupported_text')
      }
    } catch (error) {
      this.engine.open(before)
      throw pdfError(['unsupported_text', 'unsupported_structure', 'resource_limit', 'last_page'].includes(error?.code) ? error.code : 'invalid_file')
    }
    this.history.push({ bytes: before, revision: this.revision })
    this.future = []
    this.revision = this.nextRevision++
    this.trimHistory()
    return this.state()
  }
  travel(from, to) {
    if (!from.length) return this.state()
    const target = from.pop()
    to.push({ bytes: this.engine.save(), revision: this.revision })
    this.engine.open(target.bytes); this.revision = target.revision
    return this.state()
  }
  undo() { return this.travel(this.history, this.future) }
  redo() { return this.travel(this.future, this.history) }
  markSaved() { this.savedRevision = this.revision; return this.state() }
  close() { this.engine.close(); this.original = null; this.history = []; this.future = [] }
}
