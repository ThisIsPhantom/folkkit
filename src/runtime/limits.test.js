import { describe, expect, test } from 'vitest'
import { MIB, TEXT_LIMIT, TOOL_LIMITS, validateFiles } from './limits'

function fileOfSize(name, type, size) {
  return { name, type, size }
}

describe('validateFiles', () => {
  test('rejects a file whose MIME type and extension are outside the tool contract', () => {
    const result = validateFiles(
      { acceptTypes: 'application/pdf,.pdf', limits: TOOL_LIMITS.pdf },
      [fileOfSize('photo.jpg', 'image/jpeg', 128)],
      { deviceMemory: 8, viewportWidth: 1280 },
    )

    expect(result).toEqual({ ok: false, code: 'unsupported_type', messageKey: 'errors.unsupportedType' })
  })

  test('rejects conflicting PNG MIME and JPEG extension before decoding', () => {
    const result = validateFiles(
      { acceptTypes: 'image/*', limits: TOOL_LIMITS.images },
      [fileOfSize('photo.jpg', 'image/png', 128)],
      { deviceMemory: 8, viewportWidth: 1280 },
    )

    expect(result).toEqual({ ok: false, code: 'unsupported_type', messageKey: 'errors.unsupportedType' })
  })

  test('uses the low-memory PDF per-file limit at four GiB of device memory', () => {
    const result = validateFiles(
      { acceptTypes: 'application/pdf,.pdf', limits: TOOL_LIMITS.pdf },
      [fileOfSize('document.pdf', 'application/pdf', 25 * MIB + 1)],
      { deviceMemory: 4, viewportWidth: 1280 },
    )

    expect(result).toEqual({ ok: false, code: 'too_large', messageKey: 'errors.tooLarge' })
  })

  test('uses the low-memory tier below a 768 pixel viewport', () => {
    const result = validateFiles(
      { acceptTypes: 'video/*', limits: TOOL_LIMITS.media },
      [fileOfSize('clip.mp4', 'video/mp4', 75 * MIB + 1)],
      { deviceMemory: 8, viewportWidth: 767 },
    )

    expect(result).toEqual({ ok: false, code: 'too_large', messageKey: 'errors.tooLarge' })
  })

  test('does not invent a media total beyond the specified per-file limit', () => {
    const files = [
      fileOfSize('one.mp4', 'video/mp4', 60 * MIB),
      fileOfSize('two.mp4', 'video/mp4', 60 * MIB),
    ]

    expect(validateFiles(
      { acceptTypes: 'video/*', limits: TOOL_LIMITS.media },
      files,
      { deviceMemory: 4, viewportWidth: 1280 },
    )).toEqual({ ok: true })
  })

  test('rejects a multi-file total even when every PDF is below the per-file limit', () => {
    const files = Array.from({ length: 3 }, (_, index) => (
      fileOfSize(`part-${index + 1}.pdf`, 'application/pdf', 21 * MIB)
    ))

    expect(validateFiles(
      { acceptTypes: 'application/pdf,.pdf', limits: TOOL_LIMITS.pdf },
      files,
      { deviceMemory: 2, viewportWidth: 1280 },
    )).toEqual({ ok: false, code: 'too_large', messageKey: 'errors.tooLarge' })
  })

  test('publishes the exact conservative text limit', () => {
    expect(TEXT_LIMIT).toBe(5 * MIB)
  })
})
