import { expect, test } from 'vitest'
import { attachMediaProgress, createMediaDownloadResult } from './media'

test('media conversion results retain the Blob without allocating a download URL', () => {
  const blob = new Blob(['media-result'], { type: 'audio/mpeg' })

  expect(createMediaDownloadResult(blob, 'result.mp3')).toEqual({
    kind: 'download',
    blob,
    filename: 'result.mp3',
  })
})

test('media progress stops reaching the UI after its detach function runs', () => {
  const listeners = new Set()
  const ffmpeg = {
    on: (_event, listener) => listeners.add(listener),
    off: (_event, listener) => listeners.delete(listener),
  }
  const progress = []
  const detach = attachMediaProgress(ffmpeg, (value) => progress.push(value))

  for (const listener of listeners) listener({ progress: 0.4 })
  detach()
  for (const listener of listeners) listener({ progress: 0.9 })

  expect(progress).toEqual([40])
})
