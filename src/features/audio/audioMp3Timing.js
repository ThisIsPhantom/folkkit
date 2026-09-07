import { AUDIO_LIMITS } from './audioModel.js'

const MPEG1_BITRATES = [0,32,40,48,56,64,80,96,112,128,160,192,224,256,320,0]
const MPEG2_BITRATES = [0,8,16,24,32,40,48,56,64,80,96,112,128,144,160,0]

function frameHeader(bytes, offset) {
  if (offset + 4 > bytes.length || bytes[offset] !== 255 || (bytes[offset + 1] & 224) !== 224) return null
  const version = (bytes[offset + 1] >> 3) & 3
  if (version === 1 || ((bytes[offset + 1] >> 1) & 3) !== 1) return null
  const rateIndex = (bytes[offset + 2] >> 2) & 3
  if (rateIndex === 3) return null
  const sampleRate = [44100,48000,32000][rateIndex] / (version === 3 ? 1 : version === 2 ? 2 : 4)
  const bitrate = (version === 3 ? MPEG1_BITRATES : MPEG2_BITRATES)[bytes[offset + 2] >> 4]
  if (!bitrate) return null
  const samples = version === 3 ? 1152 : 576
  const length = Math.floor((version === 3 ? 144000 : 72000) * bitrate / sampleRate) + ((bytes[offset + 2] >> 1) & 1)
  const mono = (bytes[offset + 3] >> 6) === 3
  const sideInfo = version === 3 ? (mono ? 17 : 32) : (mono ? 9 : 17)
  const crc = (bytes[offset + 1] & 1) === 0 ? 2 : 0
  return { version, sampleRate, samples, length, infoOffset: offset + 4 + crc + sideInfo }
}

// Trust gapless timing only when its declared frame count matches every complete
// MPEG frame in the input. A guessed global MP3 allowance could hide lost windows.
export function mp3DecodedTiming(bytes, containerDuration = null) {
  if (!(bytes instanceof Uint8Array) || bytes.length > AUDIO_LIMITS.input || (containerDuration !== null && !Number.isFinite(containerDuration))) return null
  const text = (offset, length) => String.fromCharCode(...bytes.subarray(offset, offset + length))
  let offset = 0
  if (text(0, 3) === 'ID3') {
    if (bytes.length < 10 || bytes.subarray(6, 10).some(value => value & 128)) return null
    offset = 10 + bytes[6] * 2097152 + bytes[7] * 16384 + bytes[8] * 128 + bytes[9]
    if (bytes[3] === 4 && (bytes[5] & 16)) offset += 10
    if (offset >= bytes.length) return null
  }
  const searchEnd = Math.min(bytes.length - 4, offset + 64 * 1024)
  let first
  for (; offset <= searchEnd; offset++) {
    first = frameHeader(bytes, offset)
    if (first) break
  }
  if (!first) return null
  const start = offset, firstEnd = start + first.length, info = first.infoOffset
  if (firstEnd > bytes.length || info + 8 > firstEnd || !['Xing','Info'].includes(text(info, 4))) return null
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const flags = view.getUint32(info + 4)
  if (!(flags & 1) || (flags & ~15)) return null
  let cursor = info + 8
  if (cursor + 4 + ((flags & 2) ? 4 : 0) > firstEnd) return null
  const frames = view.getUint32(cursor); cursor += 4
  const declaredBytes = flags & 2 ? view.getUint32(cursor) : null
  if (flags & 2) cursor += 4
  if (flags & 4) cursor += 100
  if (flags & 8) cursor += 4
  if (cursor + 24 > firstEnd || !['LAME','Lavc'].includes(text(cursor, 4))) return null
  const delay = (bytes[cursor + 21] << 4) | (bytes[cursor + 22] >> 4)
  const padding = ((bytes[cursor + 22] & 15) << 8) | bytes[cursor + 23]
  // Known LAME-compatible encoder tags can use at most three codec frames here.
  if (delay > first.samples || padding > 2 * first.samples || delay + padding > 3 * first.samples) return null
  const encodedSamples = frames * first.samples
  const encodedDuration = encodedSamples / first.sampleRate
  if (!frames || encodedDuration > AUDIO_LIMITS.duration || (containerDuration !== null && Math.abs(encodedDuration - containerDuration) > .011)) return null
  let count = 0
  while (offset < bytes.length && count <= frames) {
    const frame = frameHeader(bytes, offset)
    if (!frame || frame.version !== first.version || frame.sampleRate !== first.sampleRate || offset + frame.length > bytes.length) return null
    offset += frame.length; count++
  }
  // Xing counts audio frames, excluding its own metadata frame.
  if (count !== frames + 1 || (declaredBytes !== null && declaredBytes !== offset - start)) return null
  if (offset !== bytes.length && !(bytes.length - offset === 128 && text(offset, 3) === 'TAG')) return null
  const duration = (encodedSamples - delay - padding) / first.sampleRate
  if (duration < .05 || duration > AUDIO_LIMITS.duration) return null
  return { duration, sampleRate: first.sampleRate, encodedSamples, delay, padding, tolerance: Math.max(2 / first.sampleRate, 2 / 44100) }
}
