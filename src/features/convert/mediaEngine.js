import { getFFmpeg, attachMediaProgress, terminateMediaExecution } from '../../converters/media.js'
import { buildMediaArgs, CONVERT_LIMITS, conversionError, FORMAT_MIME, validateMediaProbe } from './profiles.js'
import { readBytes } from './detection.js'

export function parseProbeLog(lines) {
  const durationMatch = lines.join('\n').match(/Duration:\s*(\d+):(\d+):([\d.]+)/)
  const duration = durationMatch ? Number(durationMatch[1]) * 3600 + Number(durationMatch[2]) * 60 + Number(durationMatch[3]) : NaN
  const streams = []
  for (const line of lines) {
    if (!/Stream #/.test(line)) continue
    const match = line.match(/(Video|Audio):\s*([\w]+)/)
    if (!match) continue
    if (match[1] === 'Audio') streams.push({ type: 'audio', codec: match[2] })
    else {
      const dimensions = line.match(/,\s*([1-9]\d{0,5})x([1-9]\d{0,5})\b/)
      streams.push({ type: 'video', codec: match[2], width: Number(dimensions?.[1]), height: Number(dimensions?.[2]), attached: line.includes('attached pic') })
    }
  }
  return { duration, streams }
}

async function probeMedia(ffmpeg, filename) {
  const lines = []
  const listener = ({ message }) => {
    // Keep only bounded technical stream metadata. Never forward filenames or payload logs.
    if (lines.length < 64 && (/Duration:/.test(message) || /Stream #.*(?:Audio|Video):/.test(message))) lines.push(message.slice(0, 2048))
  }
  ffmpeg.on('log', listener)
  try {
    await ffmpeg.exec(['-hide_banner', '-protocol_whitelist', 'file,pipe', '-i', filename], 10000)
    return parseProbeLog(lines)
  } finally { ffmpeg.off('log', listener) }
}

export async function convertMediaFile(file, profile, settings, { signal, onProgress } = {}) {
  if (signal?.aborted) throw conversionError('cancelled')
  const abort = () => terminateMediaExecution()
  signal?.addEventListener('abort', abort, { once: true })
  let timer, timedOut = false, ffmpeg, detach = () => {}
  const input = `studio-input.${profile.from}`, output = `studio-output.${profile.to}`
  const work = async () => {
    ffmpeg = await getFFmpeg()
    if (signal?.aborted) throw conversionError('cancelled')
    await ffmpeg.writeFile(input, await readBytes(file))
    const probe = validateMediaProbe(profile.from, profile.to, await probeMedia(ffmpeg, input))
    const args = buildMediaArgs(profile, input, output, settings)
    const clipped = profile.to === 'gif' || settings.trim === true
    if (clipped && Number(settings.start) + Number(settings.duration) > probe.duration + 0.02) throw conversionError('invalid_clip')
    detach = attachMediaProgress(ffmpeg, onProgress)
    const exitCode = await ffmpeg.exec(args, CONVERT_LIMITS.timeout)
    if (exitCode !== 0) throw conversionError('conversion_failed')
    const bytes = await ffmpeg.readFile(output)
    if (!bytes.length || bytes.length >= CONVERT_LIMITS.output) throw conversionError('resource_limit')
    if (profile.to !== 'gif') {
      const resultProbe = await probeMedia(ffmpeg, output)
      const expectedDuration = clipped ? Number(settings.duration) : probe.duration
      if (!Number.isFinite(resultProbe.duration) || resultProbe.duration < expectedDuration - 0.35) throw conversionError('resource_limit')
    }
    return new Blob([bytes], { type: FORMAT_MIME[profile.to] })
  }
  try {
    return await Promise.race([work(), new Promise((_resolve, reject) => {
      timer = setTimeout(() => { timedOut = true; abort(); reject(conversionError('resource_limit')) }, CONVERT_LIMITS.timeout)
    })])
  } catch (error) {
    if (signal?.aborted) throw conversionError('cancelled')
    if (timedOut) throw conversionError('resource_limit')
    throw error
  } finally {
    clearTimeout(timer); signal?.removeEventListener('abort', abort); detach()
    if (ffmpeg && !signal?.aborted && !timedOut) {
      for (const name of [input, output]) { try { await ffmpeg.deleteFile(name) } catch { /* An early failure can leave no output. */ } }
    }
    // Release the WASM heap between queued files, including errors and cancellation.
    terminateMediaExecution()
  }
}
