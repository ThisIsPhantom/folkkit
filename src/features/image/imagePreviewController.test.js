import { describe, expect, it, vi } from 'vitest'
import { createImagePreviewController } from './imagePreviewController.js'

function harness(render) {
  let nextFrame = 0
  const frames = new Map(), created = []
  const context = { setTransform: vi.fn(), clearRect: vi.fn(), drawImage: vi.fn() }
  const canvas = { width: 0, height: 0, getContext: () => context, ownerDocument: { createElement: () => {
    const scratch = { width: 0, height: 0 }; created.push(scratch); return scratch
  } } }
  const renderFrame = vi.fn(async args => {
    args.canvas.width = 300; args.canvas.height = 200; args.canvas.label = args.document.label
    if (render) await render(args)
    return { canvas: args.canvas }
  })
  const preview = createImagePreviewController({ canvas, document: { label: 'base' }, source: {}, resources: new Map(), render: renderFrame,
    requestFrame: callback => { const id = ++nextFrame; frames.set(id, callback); return id }, cancelFrame: id => frames.delete(id),
  })
  const next = () => { const [id, callback] = frames.entries().next().value; frames.delete(id); return callback() }
  return { preview, canvas, context, frames, created, renderFrame, next }
}

describe('image preview scheduling', () => {
  it('keeps one paint in flight and collapses queued positions to the latest', async () => {
    let finish
    const h = harness(args => args.document.label === 'first' ? new Promise(resolve => { finish = resolve }) : undefined)
    await h.next()
    h.preview.preview({ label: 'first' }); const painting = h.next()
    for (let i = 0; i < 30; i++) h.preview.preview({ label: `position-${i}` })
    expect(h.frames.size).toBe(0); expect(h.renderFrame).toHaveBeenCalledTimes(2)
    finish(); await painting
    expect(h.frames.size).toBe(1)
    await h.next()
    expect(h.renderFrame.mock.calls.map(([args]) => args.document.label)).toEqual(['base', 'first', 'position-29'])
    expect(h.renderFrame.mock.calls.every(([args]) => args.maxAxis === 1600)).toBe(true)
    h.preview.dispose()
    expect(h.created.every(canvas => canvas.width === 0 && canvas.height === 0)).toBe(true)
  })

  it('restores the cached baseline immediately and ignores a late cancelled draft', async () => {
    let finish, signal
    const h = harness(args => {
      if (args.document.label === 'late') { signal = args.signal; return new Promise(resolve => { finish = resolve }) }
    })
    await h.next(); const base = h.created[0]
    h.preview.preview({ label: 'shown' }); await h.next()
    h.preview.preview({ label: 'late' }); const painting = h.next()
    h.preview.rollback()
    expect(h.context.drawImage).toHaveBeenLastCalledWith(base, 0, 0)
    expect(signal.aborted).toBe(true); expect(h.created.at(-1).width).toBe(0)
    const count = h.context.drawImage.mock.calls.length
    finish(); await painting
    expect(h.context.drawImage).toHaveBeenCalledTimes(count)
    h.preview.dispose()
  })

  it('never exposes an incomplete frame and frees a pending render on disposal', async () => {
    let finish
    const h = harness(() => new Promise(resolve => { finish = resolve }))
    const painting = h.next()
    expect(h.context.drawImage).not.toHaveBeenCalled()
    h.preview.dispose()
    expect(h.created[0].width).toBe(0); expect(h.frames.size).toBe(0)
    finish(); await painting
    expect(h.context.drawImage).not.toHaveBeenCalled(); expect(h.frames.size).toBe(0)
  })
})
