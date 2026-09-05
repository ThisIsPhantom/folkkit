import { describe, expect, it, vi } from 'vitest'
import { createQrReader, safeHttpUrl, validateQrImageFile } from './qrReader.js'

function pngFile({ width = 128, height = 128, name = 'code.png', type = 'image/png' } = {}) {
  const bytes = new Uint8Array(24)
  bytes.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  new DataView(bytes.buffer).setUint32(16, width)
  new DataView(bytes.buffer).setUint32(20, height)
  return new File([bytes], name, { type })
}

function fakeWorker() {
  const listeners = new Map()
  return {
    addEventListener: vi.fn((name, listener) => listeners.set(name, listener)),
    removeEventListener: vi.fn((name, listener) => {
      if (listeners.get(name) === listener) listeners.delete(name)
    }),
    postMessage: vi.fn(),
    terminate: vi.fn(),
    emit(name, data) { listeners.get(name)?.({ data }) },
  }
}

describe('local QR reader', () => {
  it('reuses signature and dimensions validation before starting a worker', async () => {
    await expect(validateQrImageFile(pngFile())).resolves.toMatchObject({ kind: 'png', width: 128, height: 128 })
    await expect(validateQrImageFile(new File([Uint8Array.from([1, 2, 3])], 'code.png', { type: 'image/png' }))).rejects.toMatchObject({ code: 'invalid_file' })
    await expect(validateQrImageFile(pngFile({ width: 5000, height: 5000 }))).rejects.toMatchObject({ code: 'too_large' })
  })

  it('terminates its bounded worker after a successful decode', async () => {
    const worker = fakeWorker()
    const reader = createQrReader({ createWorker: () => worker, timeoutMs: 1000 })
    const pending = reader.read(pngFile())
    await vi.waitFor(() => expect(worker.postMessage).toHaveBeenCalledWith(expect.objectContaining({ type: 'decode-file' })))
    worker.emit('message', { type: 'result', value: 'Folkkit local' })

    await expect(pending).resolves.toBe('Folkkit local')
    expect(worker.terminate).toHaveBeenCalledOnce()
  })

  it('falls back to bounded main-thread image decoding when the worker cannot decode images', async () => {
    const worker = fakeWorker()
    const decodeFallback = vi.fn().mockResolvedValue({ data: new Uint8ClampedArray(16), width: 2, height: 2 })
    const reader = createQrReader({ createWorker: () => worker, decodeFallback, timeoutMs: 1000 })
    const pending = reader.read(pngFile())
    await vi.waitFor(() => expect(worker.postMessage).toHaveBeenCalledTimes(1))
    worker.emit('message', { type: 'fallback' })
    await vi.waitFor(() => expect(worker.postMessage).toHaveBeenCalledTimes(2))
    expect(worker.postMessage.mock.calls[1][0]).toMatchObject({ type: 'decode-pixels', width: 2, height: 2 })
    worker.emit('message', { type: 'result', value: 'Fallback result' })

    await expect(pending).resolves.toBe('Fallback result')
    expect(decodeFallback).toHaveBeenCalledOnce()
    expect(worker.terminate).toHaveBeenCalledOnce()
  })

  it('rejects no-result scans and ignores late replies after cancellation', async () => {
    const worker = fakeWorker()
    const reader = createQrReader({ createWorker: () => worker, timeoutMs: 1000 })
    const controller = new AbortController()
    const pending = reader.read(pngFile(), { signal: controller.signal })
    await vi.waitFor(() => expect(worker.postMessage).toHaveBeenCalledOnce())
    controller.abort()
    worker.emit('message', { type: 'result', value: 'late private payload' })

    await expect(pending).rejects.toMatchObject({ code: 'cancelled' })
    expect(worker.terminate).toHaveBeenCalledOnce()

    const secondWorker = fakeWorker()
    const secondReader = createQrReader({ createWorker: () => secondWorker, timeoutMs: 1000 })
    const noResult = secondReader.read(pngFile())
    await vi.waitFor(() => expect(secondWorker.postMessage).toHaveBeenCalledOnce())
    secondWorker.emit('message', { type: 'result', value: null })
    await expect(noResult).rejects.toMatchObject({ code: 'not_found' })
  })

  it('times out and terminates a worker that never replies', async () => {
    vi.useFakeTimers()
    const worker = fakeWorker()
    const reader = createQrReader({ createWorker: () => worker, timeoutMs: 25 })
    const pending = reader.read(pngFile())
    const rejection = expect(pending).rejects.toMatchObject({ code: 'timeout' })
    await vi.advanceTimersByTimeAsync(25)
    await rejection
    expect(worker.terminate).toHaveBeenCalledOnce()
    vi.useRealTimers()
  })

  it('offers only explicit HTTP(S) links', () => {
    expect(safeHttpUrl('https://example.test/a?b=1')).toBe('https://example.test/a?b=1')
    expect(safeHttpUrl('http://example.test')).toBe('http://example.test/')
    expect(safeHttpUrl('javascript:alert(1)')).toBeNull()
    expect(safeHttpUrl('WIFI:T:WPA;S:Home;P:secret;;')).toBeNull()
  })
})
