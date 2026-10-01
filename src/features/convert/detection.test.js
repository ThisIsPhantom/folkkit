// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { detectFile } from './detection.js'

const wavHeader = Uint8Array.of(
  0x52, 0x49, 0x46, 0x46, 0x24, 0x00, 0x00, 0x00,
  0x57, 0x41, 0x56, 0x45,
)

describe('file conversion type detection', () => {
  it('accepts a signed WAV with the WebKit audio/vnd.wave MIME type', async () => {
    const file = new File([wavHeader], 'recording.wav', { type: 'audio/vnd.wave' })

    await expect(detectFile(file)).resolves.toBe('wav')
  })

  it('rejects audio/vnd.wave when the RIFF/WAVE signature is absent', async () => {
    const forgedHeader = Uint8Array.of(
      0x52, 0x49, 0x46, 0x46, 0x24, 0x00, 0x00, 0x00,
      0x4e, 0x4f, 0x50, 0x45,
    )
    const file = new File([forgedHeader], 'recording.wav', { type: 'audio/vnd.wave' })

    await expect(detectFile(file)).rejects.toMatchObject({ code: 'unsupported_type' })
  })

  it('rejects a signed WAV when its declared filename extension is for another format', async () => {
    const file = new File([wavHeader], 'recording.mp3', { type: 'audio/vnd.wave' })

    await expect(detectFile(file)).rejects.toMatchObject({ code: 'type_mismatch' })
  })
})
