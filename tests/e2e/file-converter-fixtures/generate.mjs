import { spawnSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { PNG } from 'pngjs'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { withJpegOrientation } from './exif.mjs'

const directory = fileURLToPath(new URL('.', import.meta.url))
const ffmpeg = process.env.FOLKKIT_TEST_FFMPEG || 'ffmpeg'
function run(args) {
  const result = spawnSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { encoding: 'utf8', windowsHide: true })
  if (result.status !== 0) throw new Error(result.stderr || result.error?.message || 'Fixture generation failed')
}
const png = new PNG({ width: 96, height: 64 })
for (let y = 0; y < 64; y++) for (let x = 0; x < 96; x++) {
  const offset = (y * 96 + x) * 4
  png.data.set(x < 48 ? [220, 40, 30, 255] : [30, 140, 80, 128], offset)
}
writeFileSync(join(directory, 'sample.png'), PNG.sync.write(png))
run(['-i', join(directory, 'sample.png'), '-frames:v', '1', '-q:v', '2', join(directory, 'sample.jpg')])
for (const orientation of [6,8]) writeFileSync(join(directory,`exif-${orientation}.jpg`),withJpegOrientation(readFileSync(join(directory,'sample.jpg')),orientation,orientation === 6))
run(['-i', join(directory, 'sample.png'), '-frames:v', '1', '-c:v', 'libwebp', '-quality', '90', join(directory, 'sample.webp')])
run(['-f', 'lavfi', '-i', 'sine=frequency=440:sample_rate=44100:duration=1', '-c:a', 'pcm_s16le', join(directory, 'sample.wav')])
for (const [extension, codec] of [['mp3', ['-c:a','libmp3lame','-b:a','192k']], ['flac', ['-c:a','flac','-compression_level','5']], ['ogg', ['-c:a','libvorbis','-q:a','5']]]) run(['-i', join(directory, 'sample.wav'), ...codec, join(directory, `sample.${extension}`)])
for (const [extension, video, audio] of [['mp4', 'libx264', 'aac'], ['mov', 'libx264', 'aac'], ['webm', 'libvpx', 'libopus']]) {
  run(['-f','lavfi','-i','testsrc2=size=96x64:rate=12:duration=1','-i',join(directory,'sample.wav'),'-c:v',video,'-pix_fmt','yuv420p','-c:a',audio,'-shortest',join(directory,`sample.${extension}`)])
}
run(['-i', join(directory, 'sample.wav'), '-c:a', 'libopus', join(directory, 'unsupported-opus.ogg')])
run(['-f','lavfi','-i','testsrc2=size=960x640:rate=12:duration=1','-i',join(directory,'sample.wav'),'-c:v','libx264','-pix_fmt','yuv420p','-c:a','aac','-shortest',join(directory,'large.mp4')])
run(['-i',join(directory,'sample.mp4'),'-c:v','libx265','-x265-params','log-level=error','-c:a','aac',join(directory,'unsupported-hevc.mov')])
const pdf = await PDFDocument.create()
const font = await pdf.embedFont(StandardFonts.Helvetica)
for (const [width, height] of [[96,64], [48,48]]) {
  const page = pdf.addPage([width,height])
  page.drawRectangle({ x:0, y:0, width, height, color:rgb(0.9,0.9,0.9) })
  page.drawText('Folkkit', { x:4, y:20, size:10, font, color:rgb(0.2,0.2,0.2) })
}
writeFileSync(join(directory,'sample.pdf'), await pdf.save())
console.log('Generated 16 synthetic file-converter fixtures.')
