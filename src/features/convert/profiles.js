import { MEDIA_LIMITS } from '../../runtime/workBudgets.js'

export const IMAGE_FORMATS = Object.freeze(['png', 'jpeg', 'webp'])
export const AUDIO_FORMATS = Object.freeze(['mp3', 'wav', 'flac', 'ogg'])
export const VIDEO_FORMATS = Object.freeze(['mp4', 'webm', 'mov'])
export const FORMAT_MIME = Object.freeze({ png: 'image/png', jpeg: 'image/jpeg', webp: 'image/webp', pdf: 'application/pdf', mp3: 'audio/mpeg', wav: 'audio/wav', flac: 'audio/flac', ogg: 'audio/ogg', mp4: 'video/mp4', webm: 'video/webm', mov: 'video/quicktime', gif: 'image/gif' })
export const CONVERT_LIMITS = Object.freeze({ maxFiles: 20, perFile: 100 * 1024 * 1024, pdfInput: 32 * 1024 * 1024, pdfPixels: 16 * 1024 * 1024, totalInput: 250 * 1024 * 1024, totalOutput: 128 * 1024 * 1024, output: MEDIA_LIMITS.maxOutputBytes, maxPages: 100, maxPixels: 24_000_000, maxDimension: 8192, timeout: 120000 })

const pairs = [
  ...IMAGE_FORMATS.flatMap(from => [...IMAGE_FORMATS.filter(to => to !== from), 'pdf'].map(to => ({ from, to, engine: 'image' }))),
  ...['png', 'jpeg'].map(to => ({ from: 'pdf', to, engine: 'pdf' })),
  ...AUDIO_FORMATS.flatMap(from => AUDIO_FORMATS.filter(to => to !== from).map(to => ({ from, to, engine: 'media' }))),
  ...VIDEO_FORMATS.flatMap(from => [...['mp4', 'webm'].filter(to => to !== from), 'gif', 'mp3'].map(to => ({ from, to, engine: 'media' }))),
]
// Every released pair is exercised by file-converter-matrix.spec.js against real fixtures.
export const FILE_PROFILES = Object.freeze(pairs.map(pair => Object.freeze({ ...pair, id: `${pair.from}-${pair.to}`, released: true })))
export function conversionError(code) { return Object.assign(new Error(code), { code }) }
export function assertArchiveBudget(entries) {
  if (!Array.isArray(entries) || !entries.length) throw conversionError('invalid_file')
  if (entries.length > CONVERT_LIMITS.maxFiles * CONVERT_LIMITS.maxPages) throw conversionError('resource_limit')
  let total = 0
  for (const entry of entries) {
    const size = entry?.blob?.size
    if (!Number.isSafeInteger(size) || size < 0 || size > CONVERT_LIMITS.output) throw conversionError('resource_limit')
    total += size
    if (total > CONVERT_LIMITS.totalOutput) throw conversionError('resource_limit')
  }
  return total
}
export function getProfile(from, to) {
  const profile = FILE_PROFILES.find(p => p.released && p.from === from && p.to === to)
  if (!profile) throw conversionError('unsupported_pair')
  return profile
}
export function targetsFor(from) { return FILE_PROFILES.filter(p => p.released && p.from === from).map(p => p.to) }
function choice(value, fallback, choices) {
  const number = value == null || value === '' ? fallback : Number(value)
  if (!choices.includes(number)) throw conversionError('invalid_settings')
  return number
}
export function resolvePdfScale(dpi) { return choice(dpi, 144, [72, 144, 300]) / 72 }

export function parsePageSelection(value, count) {
  if (!Number.isInteger(count) || count < 1 || count > CONVERT_LIMITS.maxPages) throw conversionError('resource_limit')
  if (!String(value || '').trim()) return Array.from({ length: count }, (_, i) => i)
  const pages = new Set()
  for (const part of String(value).split(',')) {
    const match = part.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/)
    if (!match) throw conversionError('invalid_pages')
    const start = Number(match[1]), end = Number(match[2] || match[1])
    if (start < 1 || end < start || end > count) throw conversionError('invalid_pages')
    for (let page = start; page <= end; page++) pages.add(page - 1)
  }
  return [...pages]
}

export function validateMediaProbe(from, to, probe) {
  if (!Number.isFinite(probe.duration) || probe.duration <= 0 || probe.duration > MEDIA_LIMITS.maxDurationSeconds) throw conversionError('resource_limit')
  const audio = probe.streams.filter(s => s.type === 'audio')
  const video = probe.streams.filter(s => s.type === 'video' && !s.attached)
  const audioCodecs = { mp3: ['mp3'], wav: ['pcm_s16le', 'pcm_s24le', 'pcm_s32le', 'pcm_u8', 'pcm_f32le'], flac: ['flac'], ogg: ['vorbis'], mp4: ['aac'], mov: ['aac'], webm: ['opus', 'vorbis'] }
  if (audio.some(s => !audioCodecs[from]?.includes(s.codec))) throw conversionError('unsupported_codec')
  if (VIDEO_FORMATS.includes(from)) {
    if (!video.length || video.some(s => !(from === 'webm' ? ['vp8', 'vp9'] : ['h264']).includes(s.codec))) throw conversionError('unsupported_codec')
    for (const stream of video) {
      if (!Number.isFinite(stream.width * stream.height) || stream.width < 1 || stream.height < 1 || stream.width * stream.height > CONVERT_LIMITS.maxPixels || stream.width > CONVERT_LIMITS.maxDimension || stream.height > CONVERT_LIMITS.maxDimension) throw conversionError('resource_limit')
    }
  } else if (video.length) throw conversionError('unsupported_codec')
  if ((AUDIO_FORMATS.includes(from) || to === 'mp3') && !audio.length) throw conversionError('no_audio')
  return probe
}

export function buildMediaArgs(profile, input, output, options = {}) {
  getProfile(profile.from, profile.to)
  const base = ['-hide_banner', '-nostdin', '-protocol_whitelist', 'file,pipe', '-i', input, '-map_metadata', '-1', '-map_chapters', '-1']
  let duration = MEDIA_LIMITS.maxDurationSeconds
  let codec
  if (options.trim && VIDEO_FORMATS.includes(profile.from) && profile.to !== 'gif') {
    const start = Number(options.start), seconds = Number(options.duration)
    if (!Number.isFinite(start) || start < 0 || !Number.isFinite(seconds) || seconds <= 0 || seconds > MEDIA_LIMITS.maxDurationSeconds) throw conversionError('invalid_clip')
    base.splice(base.indexOf('-i'), 0, '-ss', String(start), '-t', String(seconds)); duration = seconds
  }
  const audio = { mp3: ['-c:a', 'libmp3lame', '-b:a', `${choice(options.bitrate, 192, [128,192,256,320])}k`, '-f', 'mp3'], wav: ['-c:a', 'pcm_s16le', '-f', 'wav'], flac: ['-c:a', 'flac', '-compression_level', String(choice(options.flacLevel, 5, [0,1,2,3,4,5,6,7,8])), '-f', 'flac'], ogg: ['-c:a', 'libvorbis', '-q:a', String(choice(options.vorbisQuality, 5, [2,5,8])), '-f', 'ogg'] }
  if (audio[profile.to]) codec = ['-map', '0:a:0', '-vn', '-ac', '2', '-ar', '44100', ...audio[profile.to]]
  else if (profile.to === 'gif') {
    const start = Number(options.start), seconds = Number(options.duration)
    if (!Number.isFinite(start) || start < 0 || !Number.isFinite(seconds) || seconds <= 0 || seconds > 30) throw conversionError('invalid_clip')
    duration = seconds
    base.splice(base.indexOf('-i'), 0, '-ss', String(start), '-t', String(seconds))
    codec = ['-an', '-filter_complex', "[0:v:0]fps=12,scale='min(720,iw)':-2:flags=lanczos,split[a][b];[a]palettegen=max_colors=256:stats_mode=diff[p];[b][p]paletteuse=dither=sierra2_4a", '-loop', '0', '-f', 'gif']
  } else {
    const resolution = choice(options.resolution, 1080, [480,720,1080])
    const width = Math.floor(resolution * 16 / 9 / 2) * 2
    codec = ['-map', '0:v:0', '-map', '0:a:0?', '-vf', `scale=w='min(${width},iw)':h='min(${resolution},ih)':force_original_aspect_ratio=decrease:force_divisible_by=2`, '-pix_fmt', 'yuv420p', '-ac', '2', '-ar', '48000']
    if (profile.to === 'mp4') codec.push('-c:v', 'libx264', '-crf', '23', '-preset', 'fast', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', '-f', 'mp4')
    // The pinned WASM libopus traps at its default complexity on AAC input.
    // Complexity0 is independently decoded in the real MP4/MOV-to-WebM matrix.
    else codec.push('-c:v', 'libvpx', '-crf', '10', '-b:v', '1500k', '-deadline', 'good', '-cpu-used', '4', '-c:a', 'libopus', '-compression_level:a', '0', '-b:a', '96k', '-f', 'webm')
  }
  return [...base, ...codec, '-threads', '1', '-t', String(duration), '-fs', String(CONVERT_LIMITS.output), output]
}
