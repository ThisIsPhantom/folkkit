import { describe, expect, it, vi } from 'vitest'
import { exportImage } from './imageClient.js'

class FakeWorker {
  static instances = []
  constructor() { this.messages = []; this.terminated = false; FakeWorker.instances.push(this) }
  postMessage(message) { this.messages.push(message) }
  terminate() { this.terminated = true }
}

describe('image export client', () => {
  it('uses the named worker contract and terminates it after success', async () => {
    const pending = exportImage({ source: { name: 'source.png' }, document: { width: 1, height: 1, elements: [] }, resources: new Map(), format: 'png', WorkerCtor: FakeWorker, workerSupported: true })
    const worker = FakeWorker.instances.at(-1)
    expect(worker.messages[0]).toMatchObject({ command: 'render', format: 'png' })
    worker.onmessage({ data: { id: worker.messages[0].id, ok: true, blob: new Blob(['ok'], { type: 'image/png' }) } })
    await expect(pending).resolves.toMatchObject({ type: 'image/png' })
    expect(worker.terminated).toBe(true)
  })

  it('falls back on the main thread and ignores a late result after abort', async () => {
    const fallback = vi.fn(async () => ({ blob: new Blob(['ok'], { type: 'image/webp' }) }))
    await expect(exportImage({ source: {}, document: {}, resources: new Map(), format: 'webp', workerSupported: false, renderer: fallback })).resolves.toMatchObject({ type: 'image/webp' })
    expect(fallback).toHaveBeenCalledOnce()
    let release
    const slow = vi.fn(() => new Promise(resolve => { release = resolve }))
    const controller = new AbortController()
    const pending = exportImage({ source: {}, document: {}, resources: new Map(), format: 'png', workerSupported: false, renderer: slow, signal: controller.signal })
    controller.abort(); release({ blob: new Blob(['late'], { type: 'image/png' }) })
    await expect(pending).rejects.toMatchObject({ code: 'cancelled' })
  })
})
