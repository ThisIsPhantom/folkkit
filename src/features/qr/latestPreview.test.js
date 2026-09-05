import { describe, expect, it, vi } from 'vitest'
import { createLatestPreview } from './latestPreview.js'

function deferred() {
  let resolve
  const promise = new Promise(next => { resolve = next })
  return { promise, resolve }
}

describe('latest QR preview', () => {
  it('debounces rapid updates and renders only the latest request', async () => {
    vi.useFakeTimers()
    const generated = []
    const preview = createLatestPreview({
      delay: 180,
      generate: async value => new Blob([value]),
      createUrl: blob => `blob:${blob.size}`,
      revokeUrl: vi.fn(),
      onReady: url => generated.push(url),
      onError: vi.fn(),
    })

    preview.update('first')
    preview.update('latest')
    await vi.advanceTimersByTimeAsync(180)

    expect(generated).toEqual(['blob:6'])
    preview.dispose()
    vi.useRealTimers()
  })

  it('discards an outdated async result and revokes replaced object URLs', async () => {
    vi.useFakeTimers()
    const first = deferred()
    const ready = []
    const revoked = []
    const preview = createLatestPreview({
      delay: 10,
      generate: value => value === 'first' ? first.promise : Promise.resolve(new Blob(['latest'])),
      createUrl: blob => `blob:${blob.size}:${ready.length}`,
      revokeUrl: url => revoked.push(url),
      onReady: url => ready.push(url),
      onError: vi.fn(),
    })

    preview.update('first')
    await vi.advanceTimersByTimeAsync(10)
    preview.update('latest')
    await vi.advanceTimersByTimeAsync(10)
    first.resolve(new Blob(['outdated']))
    await Promise.resolve()

    expect(ready).toEqual(['blob:6:0'])
    expect(revoked).toEqual([])

    preview.update('newest')
    await vi.advanceTimersByTimeAsync(10)
    expect(revoked).toEqual(['blob:6:0'])
    preview.dispose()
    expect(revoked).toEqual(['blob:6:0', 'blob:6:1'])
    vi.useRealTimers()
  })

  it('cancels pending work and releases the active URL when disposed', async () => {
    vi.useFakeTimers()
    const ready = []
    const revoked = []
    const preview = createLatestPreview({
      delay: 50,
      generate: async value => new Blob([value]),
      createUrl: () => 'blob:active',
      revokeUrl: url => revoked.push(url),
      onReady: url => ready.push(url),
      onError: vi.fn(),
    })

    preview.update('active')
    await vi.advanceTimersByTimeAsync(50)
    preview.update('never')
    preview.dispose()
    await vi.advanceTimersByTimeAsync(50)

    expect(ready).toEqual(['blob:active'])
    expect(revoked).toEqual(['blob:active'])
    vi.useRealTimers()
  })

  it('clears the current preview and remains reusable after a reset', async () => {
    vi.useFakeTimers()
    const ready = []
    const revoked = []
    const preview = createLatestPreview({
      delay: 10,
      generate: async value => new Blob([value]),
      createUrl: blob => `blob:${blob.size}:${ready.length}`,
      revokeUrl: url => revoked.push(url),
      onReady: url => ready.push(url),
      onError: vi.fn(),
    })

    preview.update('first')
    await vi.advanceTimersByTimeAsync(10)
    preview.clear()
    preview.update('second')
    await vi.advanceTimersByTimeAsync(10)

    expect(ready).toEqual(['blob:5:0', 'blob:6:1'])
    expect(revoked).toEqual(['blob:5:0'])
    preview.dispose()
    vi.useRealTimers()
  })
})
