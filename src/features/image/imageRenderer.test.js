import { describe, expect, it, vi } from 'vitest'
import { addElement, applyCrop, createImageState, rotateState } from './imageModel.js'
import { computePreviewSize, renderImageDocument } from './imageRenderer.js'

function fakeCanvas() {
  const calls = []
  const context = {
    save: () => calls.push(['save']), restore: () => calls.push(['restore']),
    setTransform: (...args) => calls.push(['setTransform', ...args]), clearRect: (...args) => calls.push(['clearRect', ...args]),
    fillRect: (...args) => calls.push(['fillRect', ...args]), drawImage: (...args) => calls.push(['drawImage', ...args]),
    fillText: (...args) => calls.push(['fillText', ...args]), beginPath: () => {}, rect: () => {}, clip: () => {},
    set globalAlpha(value) { calls.push(['globalAlpha', value]) }, set fillStyle(value) { calls.push(['fillStyle', value]) },
    set font(value) { calls.push(['font', value]) }, set textBaseline(value) { calls.push(['textBaseline', value]) },
  }
  return { width: 0, height: 0, calls, getContext: () => context, convertToBlob: async options => new Blob(['pixels'], { type: options.type }) }
}

describe('image renderer', () => {
  it('bounds previews without upscaling and retains non-square aspect', () => {
    expect(computePreviewSize(3200, 1200)).toEqual({ width: 1600, height: 600, scale: 0.5 })
    expect(computePreviewSize(640, 480)).toEqual({ width: 640, height: 480, scale: 1 })
  })

  it('uses one transform plan for the original background and sequential watermark decoding', async () => {
    let document = createImageState({ width: 300, height: 200 })
    document = applyCrop(document, { x: 50, y: 20, width: 100, height: 80 })
    document = rotateState(document, 1)
    document = addElement(document, { id: 'w1', type: 'image', resourceId: 'a', x: 10, y: 10, width: 20, height: 10, opacity: 0.5 })
    document = addElement(document, { id: 'w2', type: 'image', resourceId: 'b', x: 40, y: 30, width: 10, height: 20, opacity: 1 })
    const source = { width: 300, height: 200 }
    const bitmaps = []
    const bitmapFactory = vi.fn(async file => {
      expect(bitmaps.some(bitmap => !bitmap.closed)).toBe(false)
      const bitmap = { file, width: 10, height: 10, closed: false, close() { this.closed = true } }
      bitmaps.push(bitmap)
      return bitmap
    })
    const canvas = fakeCanvas()
    const resources = new Map([['a', { file: { name: 'a.png' } }], ['b', { file: { name: 'b.png' } }]])

    const result = await renderImageDocument({ document, source, resources, format: 'png', canvasFactory: () => canvas, bitmapFactory })

    expect({ width: result.width, height: result.height }).toEqual({ width: 80, height: 100 })
    expect(canvas.calls.find(call => call[0] === 'setTransform' && call[5] === 100)).toEqual(['setTransform', 0, 1, -1, 0, 100, -50])
    expect(bitmapFactory.mock.calls.map(([file]) => file.name)).toEqual(['a.png', 'b.png'])
    expect(bitmaps.every(bitmap => bitmap.closed)).toBe(true)
  })

  it('fills JPEG white and rejects an aborted render before producing a blob', async () => {
    const document = createImageState({ width: 2, height: 1 })
    const jpegCanvas = fakeCanvas()
    await renderImageDocument({ document, source: { width: 2, height: 1 }, resources: new Map(), format: 'jpeg', canvasFactory: () => jpegCanvas })
    expect(jpegCanvas.calls).toContainEqual(['fillStyle', '#ffffff'])
    expect(jpegCanvas.calls).toContainEqual(['fillRect', 0, 0, 2, 1])
    const controller = new AbortController(); controller.abort()
    await expect(renderImageDocument({ document, source: { width: 2, height: 1 }, resources: new Map(), signal: controller.signal, canvasFactory: fakeCanvas })).rejects.toMatchObject({ code: 'cancelled' })
  })
})
