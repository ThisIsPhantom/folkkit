import { IMAGE_LIMITS } from './imageModel.js'

// One paint in flight and one latest draft, regardless of pointer event frequency.
// Detached canvases prevent a partially decoded frame from clearing the preview.
export function createImagePreviewController({ canvas, document, source, resources, render, onError = () => {},
  requestFrame = callback => globalThis.requestAnimationFrame ? requestAnimationFrame(callback) : setTimeout(callback, 0),
  cancelFrame = id => globalThis.cancelAnimationFrame ? cancelAnimationFrame(id) : clearTimeout(id),
}) {
  let disposed = false, revision = 0, frame = null, flight = null
  let needsBase = true, draft = null, hasDraft = false, baseline = null
  const release = target => { if (target) { target.width = 0; target.height = 0 } }
  const show = target => {
    if (canvas.width !== target.width) canvas.width = target.width
    if (canvas.height !== target.height) canvas.height = target.height
    const context = canvas.getContext('2d')
    if (!context) return
    context.setTransform(1, 0, 0, 1, 0, 0); context.globalAlpha = 1
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.drawImage(target, 0, 0)
  }
  function schedule() {
    if (!disposed && !flight && frame === null && (needsBase || draft)) frame = requestFrame(paint)
  }
  async function paint() {
    frame = null
    if (disposed || flight || (!needsBase && !draft)) return
    const base = needsBase, next = base ? document : draft
    if (base) needsBase = false
    else draft = null
    const job = { revision, controller: new AbortController(), canvas: canvas.ownerDocument.createElement('canvas') }
    flight = job
    try {
      const result = await render({ document: next, source, resources, canvas: job.canvas, maxAxis: IMAGE_LIMITS.previewAxis, signal: job.controller.signal })
      if (disposed || job.revision !== revision || job.controller.signal.aborted) return
      if (result?.canvas === job.canvas) {
        if (base) { release(baseline); baseline = job.canvas }
        show(job.canvas)
      }
    } catch (error) {
      if (!disposed && job.revision === revision && !job.controller.signal.aborted && error?.code !== 'cancelled') onError(error)
    } finally {
      if (job.canvas !== baseline) release(job.canvas)
      flight = null
      schedule()
    }
  }
  function preview(next) {
    if (disposed) return
    hasDraft = true; draft = next
    schedule()
  }
  function rollback() {
    if (disposed || !hasDraft) return
    hasDraft = false; draft = null; revision++
    flight?.controller.abort()
    if (flight) release(flight.canvas)
    if (frame !== null) { cancelFrame(frame); frame = null }
    if (baseline) show(baseline)
    else needsBase = true
    schedule()
  }
  function dispose() {
    if (disposed) return
    disposed = true; revision++; draft = null
    if (frame !== null) cancelFrame(frame)
    flight?.controller.abort()
    if (flight) release(flight.canvas)
    release(baseline); baseline = null
  }
  schedule()
  return { preview, rollback, dispose }
}
