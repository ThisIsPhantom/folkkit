import { test, expect } from '@playwright/test'
import process from 'node:process'
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { PDFDocument } from 'pdf-lib'
import { unzipSync } from 'fflate'
import { FILE_PROFILES } from '../../src/features/convert/profiles.js'

const fixture = type => fileURLToPath(new URL(`./file-converter-fixtures/sample.${type === 'jpeg' ? 'jpg' : type}`, import.meta.url))
const probeBinary = process.env.FOLKKIT_TEST_FFPROBE || 'ffprobe'
const decodeBinary = process.env.FOLKKIT_TEST_FFMPEG || probeBinary.replace(/ffprobe(?=\.exe$|$)/, 'ffmpeg')
function probe(path) {
  const result = spawnSync(probeBinary, ['-v','error','-show_streams','-show_format','-of','json',path], { encoding:'utf8', windowsHide:true })
  expect(result.status, result.stderr || result.error?.message).toBe(0)
  const decoded = spawnSync(decodeBinary, ['-v','error','-i',path,'-f','null','-'], { encoding:'utf8', windowsHide:true })
  expect(decoded.status, decoded.stderr || decoded.error?.message).toBe(0)
  return JSON.parse(result.stdout)
}
async function open(page) {
  await page.addInitScript(() => localStorage.setItem('folkkit:locale', 'en'))
  await page.goto('/convert')
  await expect(page.getByRole('heading', { name: 'Convert files' })).toBeVisible()
}
for (const profile of FILE_PROFILES) {
  test(`file converter actual ${profile.from} to ${profile.to}`, async ({ page }, testInfo) => {
    test.setTimeout(120000)
    await open(page)
    await page.getByLabel('Choose files', { exact:true }).setInputFiles(fixture(profile.from))
    await expect(page.getByText('Ready', { exact:true })).toBeVisible()
    await page.getByLabel(/^Output format:/).selectOption(profile.to)
    if (profile.to === 'gif') await page.getByLabel('Clip length (seconds)').fill('1')
    if (profile.from === 'pdf') {
      await page.getByText('Settings', { exact:true }).click()
      await page.getByLabel('PDF pages', { exact:true }).fill('1')
    }
    await page.getByRole('button', { name:'Convert files', exact:true }).click()
    await expect(page.locator('.converter-file').first()).toHaveAttribute('data-status', /done|error|cancelled/, { timeout:100000 })
    expect(await page.locator('.converter-file').first().innerText()).not.toContain('Failed')
    await expect(page.getByText('Done', { exact:true })).toBeVisible()
    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('button', { name:/^Download result:/ }).click()
    const download = await downloadPromise
    const path = testInfo.outputPath(download.suggestedFilename())
    await download.saveAs(path)
    const bytes = readFileSync(path)
    expect(bytes.length).toBeGreaterThan(60)
    if (profile.to === 'pdf') {
      const pdf = await PDFDocument.load(bytes)
      expect(pdf.getPageCount()).toBe(1)
      expect(pdf.getPage(0).getSize()).toEqual({ width:72, height:48 })
    } else {
      const output = probe(path)
      const expectedCodec = { png:'png', jpeg:'mjpeg', webp:'webp', mp3:'mp3', wav:'pcm_s16le', flac:'flac', ogg:'vorbis', mp4:'h264', webm:'vp8', gif:'gif' }[profile.to]
      expect(output.streams.some(stream => stream.codec_name === expectedCodec)).toBe(true)
      if (['png','jpeg','webp'].includes(profile.to)) {
        expect(output.streams[0].width).toBe(profile.from === 'pdf' ? 192 : 96)
        expect(output.streams[0].height).toBe(profile.from === 'pdf' ? 128 : 64)
        if (profile.from === 'png' && profile.to === 'jpeg') {
          const decoded = spawnSync(decodeBinary, ['-v','error','-i',path,'-frames:v','1','-f','rawvideo','-pix_fmt','rgba','-'], { windowsHide:true })
          expect(decoded.status).toBe(0)
          const pixel = Array.from(decoded.stdout.subarray((32 * 96 + 74) * 4, (32 * 96 + 74) * 4 + 4))
          // Half-transparent green must be composited on white, not silently made black.
          expect(Math.abs(pixel[0] - 142)).toBeLessThan(15)
          expect(Math.abs(pixel[1] - 197)).toBeLessThan(15)
          expect(Math.abs(pixel[2] - 167)).toBeLessThan(15)
          expect(pixel[3]).toBe(255)
        }
      } else {
        expect(Number(output.format.duration)).toBeGreaterThan(0.75)
        expect(Number(output.format.duration)).toBeLessThan(1.3)
      }
      if (profile.to === 'mp4') expect(output.streams.some(stream => stream.codec_name === 'aac')).toBe(true)
      if (profile.to === 'webm') expect(output.streams.some(stream => stream.codec_name === 'opus')).toBe(true)
    }
  })
}
test('file converter multi-file targets, combined PDF, duplicate ZIP names and selected PDF pages', async ({ page }) => {
  await open(page)
  await page.getByLabel('Choose files', { exact:true }).setInputFiles([fixture('png'),fixture('png')])
  await expect(page.getByText('Ready', { exact:true })).toHaveCount(2)
  await page.getByLabel('Output for all files').selectOption('pdf')
  await page.getByLabel('Combine images into one PDF in this order').check()
  await page.getByRole('button', { name:'Convert files', exact:true }).click()
  await expect(page.getByText('Done', { exact:true })).toHaveCount(2)
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name:/^Download result:/ }).click()
  const download = await downloadPromise
  const pdf = await PDFDocument.load(readFileSync(await download.path()))
  expect(pdf.getPageCount()).toBe(2)
  await page.getByRole('button', { name:'Clear files', exact:true }).click()
  await page.getByLabel('Choose files', { exact:true }).setInputFiles(fixture('pdf'))
  await expect(page.getByText('Ready', { exact:true })).toBeVisible()
  await page.getByRole('button', { name:'Convert files', exact:true }).click()
  await expect(page.getByText('Done', { exact:true })).toBeVisible()
  await expect(page.getByRole('button', { name:'Download results as ZIP: sample.pdf (file 1)', exact:true })).toHaveCount(1)
  await expect(page.getByRole('button', { name:'Download all as ZIP', exact:true })).toHaveCount(1)
  const zipPromise = page.waitForEvent('download')
  await page.getByRole('button', { name:'Download all as ZIP', exact:true }).click()
  const zip = await zipPromise
  const entries = unzipSync(readFileSync(await zip.path()))
  expect(Object.keys(entries)).toEqual(['sample-page-1.png','sample-page-2.png'])
})
test('file converter rejects an actual unsupported OGG codec without producing a download', async ({ page }) => {
  await open(page)
  await page.getByLabel('Choose files', { exact:true }).setInputFiles(fileURLToPath(new URL('./file-converter-fixtures/unsupported-opus.ogg', import.meta.url)))
  await expect(page.getByText('Ready', { exact:true })).toBeVisible()
  await page.getByRole('button', { name:'Convert files', exact:true }).click()
  await expect(page.getByText('The actual audio or video codec is not supported.')).toBeVisible({ timeout:60000 })
  await expect(page.getByRole('button', { name:/^Download result:/ })).toHaveCount(0)
  await expect(page.getByRole('button', { name:'Retry', exact:true })).toBeVisible()
})
test('file converter cancels a real media worker and retries successfully', async ({ page }) => {
  test.setTimeout(120000)
  await open(page)
  await page.getByLabel('Choose files', { exact:true }).setInputFiles(fixture('wav'))
  await expect(page.getByText('Ready', { exact:true })).toBeVisible()
  await page.getByRole('button', { name:'Convert files', exact:true }).click()
  await page.getByRole('button', { name:'Cancel conversion', exact:true }).click()
  await expect(page.getByText('Cancelled', { exact:true })).toBeVisible()
  await expect(page.getByRole('button', { name:/^Download result:/ })).toHaveCount(0)
  await page.getByRole('button', { name:'Retry', exact:true }).click()
  await page.getByRole('button', { name:'Convert files', exact:true }).click()
  await expect(page.getByText('Done', { exact:true })).toBeVisible({ timeout:90000 })
})
test('file converter settings change actual dimensions, printable page size, DPI, bitrate and video clip', async ({ page }, testInfo) => {
  test.setTimeout(150000)
  await open(page)
  async function choose(path, target) {
    if (await page.getByRole('button', { name:'Clear files', exact:true }).count()) await page.getByRole('button', { name:'Clear files', exact:true }).click()
    await page.getByLabel('Choose files', { exact:true }).setInputFiles(path)
    await expect(page.getByText('Ready', { exact:true })).toBeVisible()
    await page.getByLabel(/^Output format:/).selectOption(target)
    await page.getByText('Settings', { exact:true }).click()
  }
  async function convertAndDownload(name) {
    await page.getByRole('button', { name:'Convert files', exact:true }).click()
    await expect(page.locator('.converter-file').first()).toHaveAttribute('data-status', /done|error|cancelled/, { timeout:100000 })
    await expect(page.getByText('Done', { exact:true })).toBeVisible()
    const pending = page.waitForEvent('download')
    await page.getByRole('button', { name:/^Download result:/ }).click()
    const download = await pending
    const path = testInfo.outputPath(name)
    await download.saveAs(path)
    return path
  }
  await choose(fixture('png'), 'jpeg')
  await page.getByLabel('Width (px)').fill('48')
  const image = probe(await convertAndDownload('resized.jpg'))
  expect([image.streams[0].width,image.streams[0].height]).toEqual([48,32])
  await choose(fixture('png'), 'pdf')
  await page.getByLabel('PDF page size').selectOption('letter')
  await page.getByRole('combobox', { name:'Orientation', exact:true }).selectOption('landscape')
  const pdf = await PDFDocument.load(readFileSync(await convertAndDownload('letter.pdf')))
  expect(pdf.getPage(0).getSize()).toEqual({ width:792, height:612 })
  await choose(fixture('pdf'), 'png')
  await page.getByLabel('PDF pages', { exact:true }).fill('1')
  await page.getByRole('combobox', { name:'PDF resolution', exact:true }).selectOption('300')
  const raster = probe(await convertAndDownload('300dpi.png'))
  expect([raster.streams[0].width,raster.streams[0].height]).toEqual([400,267])
  await choose(fixture('wav'), 'mp3')
  await page.getByRole('combobox', { name:'MP3 bitrate', exact:true }).selectOption('320')
  const audio = probe(await convertAndDownload('320k.mp3'))
  expect(Number(audio.streams[0].bit_rate)).toBe(320000)
  await choose(fileURLToPath(new URL('./file-converter-fixtures/large.mp4', import.meta.url)), 'webm')
  await page.getByRole('combobox', { name:'Video resolution', exact:true }).selectOption('480')
  await page.getByLabel('Choose a video clip', { exact:true }).check()
  await page.getByLabel('Clip start (seconds)').fill('0.2')
  await page.getByLabel('Clip length (seconds)').fill('0.5')
  const video = probe(await convertAndDownload('480p-clip.webm'))
  const stream = video.streams.find(stream => stream.codec_type === 'video')
  expect([stream.width,stream.height]).toEqual([720,480])
  expect(Number(video.format.duration)).toBeGreaterThanOrEqual(0.45)
  expect(Number(video.format.duration)).toBeLessThan(0.7)
})
test('file converter rejects HEVC inside a real MOV container', async ({ page }) => {
  await open(page)
  await page.getByLabel('Choose files', { exact:true }).setInputFiles(fileURLToPath(new URL('./file-converter-fixtures/unsupported-hevc.mov', import.meta.url)))
  await expect(page.getByText('Ready', { exact:true })).toBeVisible()
  await page.getByRole('button', { name:'Convert files', exact:true }).click()
  await expect(page.getByText('The actual audio or video codec is not supported.')).toBeVisible({ timeout:60000 })
})
test('combined PDF rebuilds after reordering and discards stale output after settings and removal', async ({ page }) => {
  await open(page)
  await page.getByLabel('Choose files', { exact:true }).setInputFiles([fixture('png'),fixture('jpeg')])
  await expect(page.getByText('Ready', { exact:true })).toHaveCount(2)
  await page.getByLabel('Output for all files').selectOption('pdf')
  const rows = page.locator('.converter-file')
  for (const [index, size] of ['letter','a4'].entries()) {
    await rows.nth(index).getByText('Settings', { exact:true }).click()
    await rows.nth(index).getByRole('combobox', { name:'PDF page size', exact:true }).selectOption(size)
  }
  const combine = page.getByLabel('Combine images into one PDF in this order')
  await combine.check()
  async function downloadSizes() {
    await page.getByRole('button', { name:'Convert files', exact:true }).click()
    await expect(page.getByText('Done', { exact:true })).toHaveCount(2)
    const pending = page.waitForEvent('download')
    await page.getByRole('button', { name:/^Download result:/ }).click()
    const result = await pending
    const pdf = await PDFDocument.load(readFileSync(await result.path()))
    return pdf.getPages().map(page => [page.getWidth(),page.getHeight()])
  }
  expect(await downloadSizes()).toEqual([[612,792],[595.28,841.89]])
  await combine.uncheck()
  await expect(page.getByText('Ready', { exact:true })).toHaveCount(2)
  await expect(page.getByRole('button', { name:/^Download result:/ })).toHaveCount(0)
  await combine.check()
  await downloadSizes()
  await rows.nth(1).getByRole('button', { name:'Move up', exact:true }).click()
  await expect(page.getByText('Ready', { exact:true })).toHaveCount(2)
  await expect(page.getByRole('button', { name:/^Download result:/ })).toHaveCount(0)
  expect(await downloadSizes()).toEqual([[595.28,841.89],[612,792]])
  await rows.nth(0).getByRole('combobox', { name:'PDF page size', exact:true }).selectOption('original')
  await expect(page.getByText('Ready', { exact:true })).toHaveCount(2)
  await expect(page.getByRole('button', { name:/^Download result:/ })).toHaveCount(0)
  await rows.nth(0).getByRole('button', { name:/^Remove:/ }).click()
  await expect(rows).toHaveCount(1)
  await expect(page.getByRole('button', { name:'Convert files', exact:true })).toBeEnabled()
})
