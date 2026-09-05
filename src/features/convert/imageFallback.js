import { getFFmpeg, terminateMediaExecution } from '../../converters/media.js'
import { CONVERT_LIMITS, FORMAT_MIME, IMAGE_FORMATS, conversionError } from './profiles.js'
import { detectFile, readBytes } from './detection.js'
import { imageDimensions, resolveImageSize, validateDimensions } from './imageOperations.js'

// WebKit environments without OffscreenCanvas use the existing terminable,
// same-origin FFmpeg worker. No DOM-canvas work is left running after abort.
export function buildImageFallbackArgs(input, output, dimensions, target, quality, raw = false) {
  validateDimensions(dimensions)
  if (!IMAGE_FORMATS.includes(target)) throw conversionError('unsupported_pair')
  const value = quality == null || quality === '' ? (target === 'jpeg' ? 92 : 90) : Number(quality)
  if (!Number.isFinite(value) || value < 10 || value > 100) throw conversionError('invalid_settings')
  const { width, height } = dimensions
  const args = ['-hide_banner','-nostdin','-protocol_whitelist','file,pipe','-filter_threads','1','-filter_complex_threads','1']
  if (raw) args.push('-f','rawvideo','-pixel_format','rgba','-video_size',`${width}x${height}`)
  args.push('-i',input,'-map_metadata','-1','-frames:v','1')
  if (target === 'jpeg') {
    args.push('-filter_complex',`[0:v]scale=${width}:${height}:flags=lanczos,format=rgba[fg];color=c=white:s=${width}x${height}:r=1[bg];[bg][fg]overlay=shortest=1:format=auto,format=yuvj444p[out]`,'-map','[out]','-c:v','mjpeg','-q:v',String(Math.max(2,Math.round(31 - value * 0.29))),'-f','image2')
  } else {
    args.push('-vf',`scale=${width}:${height}:flags=lanczos,format=rgba`,'-c:v',target === 'webp' ? 'libwebp' : 'png')
    if (target === 'webp') args.push('-quality',String(value))
    args.push('-f',target === 'webp' ? 'webp' : 'image2')
  }
  return [...args,'-threads','1','-fs',String(CONVERT_LIMITS.output),output]
}

async function executeImage(bytes, args, target, signal) {
  if (signal?.aborted) throw conversionError('cancelled')
  const abort = () => terminateMediaExecution()
  signal?.addEventListener('abort',abort,{ once:true })
  let timer, timedOut = false
  const work = async () => {
    const ffmpeg = await getFFmpeg()
    if (signal?.aborted) throw conversionError('cancelled')
    await ffmpeg.writeFile(args[args.indexOf('-i') + 1],bytes)
    const code = await ffmpeg.exec(args,CONVERT_LIMITS.timeout)
    if (code !== 0) throw conversionError('conversion_failed')
    const output = await ffmpeg.readFile(args.at(-1))
    if (!output.length || output.length >= CONVERT_LIMITS.output) throw conversionError('resource_limit')
    return new Blob([output],{ type:FORMAT_MIME[target] })
  }
  try {
    return await Promise.race([work(),new Promise((_resolve,reject) => {
      timer = setTimeout(() => { timedOut = true; abort(); reject(conversionError('resource_limit')) },CONVERT_LIMITS.timeout)
    })])
  } catch (error) {
    if (signal?.aborted) throw conversionError('cancelled')
    if (timedOut) throw conversionError('resource_limit')
    throw error
  } finally {
    clearTimeout(timer); signal?.removeEventListener('abort',abort)
    // Termination also releases input/output virtual files and the WASM heap.
    terminateMediaExecution()
  }
}

export async function convertImageFallback(file, target, settings = {}, signal) {
  const from = await detectFile(file)
  if (!IMAGE_FORMATS.includes(from)) throw conversionError('unsupported_type')
  const source = validateDimensions(imageDimensions(await readBytes(file.slice(0,64 * 1024))))
  const dimensions = resolveImageSize(source,settings)
  const args = buildImageFallbackArgs(`input.${from}`,`output.${target}`,dimensions,target,settings.quality)
  return executeImage(await readBytes(file),args,target,signal)
}

export async function preparePdfImages(files, settings, signal) {
  if (files.length > CONVERT_LIMITS.maxFiles) throw conversionError('resource_limit')
  let pixels = 0
  // Preflight all resized images before retaining any converted PNG buffer.
  for (const [index,file] of files.entries()) {
    const source = validateDimensions(imageDimensions(await readBytes(file.slice(0,64 * 1024))))
    const dimensions = resolveImageSize(source,Array.isArray(settings) ? settings[index] : settings)
    pixels += dimensions.width * dimensions.height
    if (pixels > 60_000_000) throw conversionError('resource_limit')
  }
  const images = []
  let bytes = 0
  for (const [index,file] of files.entries()) {
    const png = await convertImageFallback(file,'png',Array.isArray(settings) ? settings[index] : settings,signal)
    bytes += png.size
    if (bytes > CONVERT_LIMITS.totalOutput) throw conversionError('resource_limit')
    images.push(png)
  }
  return images
}

export async function encodePixelsFallback(rendered, target, signal) {
  validateDimensions(rendered)
  if (!ArrayBuffer.isView(rendered.pixels) || rendered.pixels.byteLength !== rendered.width * rendered.height * 4) throw conversionError('invalid_file')
  const args = buildImageFallbackArgs('input.rgba',`output.${target}`,rendered,target,92,true)
  return executeImage(new Uint8Array(rendered.pixels),args,target,signal)
}
