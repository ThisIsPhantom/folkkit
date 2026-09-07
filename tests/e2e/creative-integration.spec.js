import { readFile } from 'node:fs/promises'
import { Buffer } from 'node:buffer'
import { expect, test } from '@playwright/test'
import { PNG } from 'pngjs'
import { createOfflinePreview } from './helpers/offline-preview.mjs'

function imageFixture() {
  const png = new PNG({ width: 120, height: 80 })
  for (let i = 0; i < png.data.length; i += 4) png.data.set([20, 120, 200, 255], i)
  return { name: 'private-handoff.png', mimeType: 'image/png', buffer: PNG.sync.write(png) }
}

async function navigateToConverter(page) {
  const menu = page.getByRole('button', { name: 'Open menu', exact: true })
  if (await menu.isVisible()) await menu.click()
  await page.getByRole('link', { name: 'Convert', exact: true }).click()
}

async function downloadPng(page) {
  const pending = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download PNG', exact: true }).click()
  return PNG.sync.read(await readFile(await (await pending).path()))
}

test('converter hands original and result to the retained image editor without losing rejected replacement edits @matrix', async ({ page }) => {
  test.setTimeout(90000)
  await page.addInitScript(() => localStorage.setItem('folkkit:locale', 'en'))
  await page.goto('/convert')
  await page.getByLabel('Choose files', { exact: true }).setInputFiles(imageFixture())
  await expect(page.getByText('Ready', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Edit original: private-handoff.png', exact: true }).click()
  await expect(page).toHaveURL(/\/image$/)
  await expect(page.getByText('120 × 80 px', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Rotate 90° right', exact: true }).click()
  await expect(page.getByText('80 × 120 px', { exact: true })).toBeVisible()
  await navigateToConverter(page)
  await expect(page.getByText('Ready', { exact: true })).toBeVisible()
  await page.getByRole('combobox', { name: /^Output format:/ }).selectOption('jpeg')
  await page.locator('.converter-settings summary').click()
  await page.getByLabel('Width (px)', { exact: true }).fill('60')
  await page.getByLabel('Height (px)', { exact: true }).fill('40')
  await page.getByRole('button', { name: 'Convert files', exact: true }).click()
  await expect(page.getByText('Done', { exact: true })).toBeVisible()
  page.once('dialog', dialog => dialog.dismiss())
  await page.getByRole('button', { name: /^Edit result:/ }).click()
  await expect(page.getByText('80 × 120 px', { exact: true })).toBeVisible()
  await expect(page.getByText('Unsaved changes', { exact: true })).toBeVisible()
  await navigateToConverter(page)
  page.once('dialog', dialog => dialog.accept())
  await page.getByRole('button', { name: /^Edit result:/ }).click()
  await expect(page.getByText('60 × 40 px', { exact: true })).toBeVisible()
  expect(await downloadPng(page)).toMatchObject({ width: 60, height: 40 })
  await page.goBack()
  await expect(page).toHaveURL(/\/convert$/)
  await expect(page.locator('.converter-files > li')).toHaveCount(1)
  await expect(page.getByText('Done', { exact: true })).toBeVisible()
  const stored = await page.evaluate(() => JSON.stringify({ local: { ...localStorage }, session: { ...sessionStorage } }))
  expect(stored).not.toContain('private-handoff')
})

test('home installation opens the image editor and exports after a real offline navigation @matrix', async ({ page }) => {
  test.setTimeout(90000)
  const preview = await createOfflinePreview()
  const requests = []
  page.on('request', request => requests.push(request.url()))
  try {
    await page.addInitScript(() => localStorage.setItem('folkkit:locale', 'en'))
    await page.goto(preview.url)
    await page.evaluate(async () => {
      await navigator.serviceWorker.ready
      if (!navigator.serviceWorker.controller) await new Promise(resolve => navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true }))
    })
    preview.setOffline()
    await page.goto(preview.url + '/image')
    await page.getByLabel('Choose image', { exact: true }).setInputFiles(imageFixture())
    await page.getByRole('button', { name: 'Rotate 90° right', exact: true }).click()
    expect(await downloadPng(page)).toMatchObject({ width: 80, height: 120 })
    expect(preview.deniedRequests).toBeGreaterThan(0)
    expect(requests.filter(url => /^https?:/.test(url)).every(url => new URL(url).origin === preview.url)).toBe(true)
    const cached = await page.evaluate(async () => {
      const names = await caches.keys()
      return (await Promise.all(names.map(async name => (await (await caches.open(name)).keys()).map(request => request.url)))).flat()
    })
    expect(cached.some(url => /private-handoff|blob:|data:|vendor\/(?:pandoc|ffmpeg)/.test(url))).toBe(false)
  } finally { await preview.close() }
})


function audioFixture() {
  const rate = 8000, samples = rate * 8, bytes = Buffer.alloc(44 + samples * 2)
  bytes.write('RIFF', 0); bytes.writeUInt32LE(bytes.length - 8, 4); bytes.write('WAVEfmt ', 8)
  bytes.writeUInt32LE(16, 16); bytes.writeUInt16LE(1, 20); bytes.writeUInt16LE(1, 22)
  bytes.writeUInt32LE(rate, 24); bytes.writeUInt32LE(rate * 2, 28); bytes.writeUInt16LE(2, 32); bytes.writeUInt16LE(16, 34)
  bytes.write('data', 36); bytes.writeUInt32LE(samples * 2, 40)
  for (let n = 0; n < samples; n++) bytes.writeInt16LE(Math.round(10000 * Math.sin(2 * Math.PI * 440 * n / rate)), 44 + n * 2)
  return { name: 'private-audio-handoff.wav', mimeType: 'audio/wav', buffer: bytes }
}

async function setAudioTime(page, label, value) {
  const field = page.getByLabel(label, { exact: true })
  await field.fill(value)
  await field.press('Tab')
}

async function nativeAudioCapability(page) {
  const original = await readFile(new URL('./file-converter-fixtures/sample.mp3', import.meta.url))
  return page.evaluate(base64 => new Promise(resolve => {
    const bytes = Uint8Array.from(atob(base64), char => char.charCodeAt(0))
    const url = URL.createObjectURL(new Blob([bytes], { type: 'audio/mpeg' }))
    const audio = new Audio(url)
    let ended = false
    const finish = result => {
      if (ended) return
      ended = true; clearTimeout(timer); audio.pause(); audio.removeAttribute('src'); audio.load(); URL.revokeObjectURL(url); resolve(result)
    }
    const timer = setTimeout(() => finish({ timeout: true }), 5000)
    audio.addEventListener('error', () => finish({ supported: false, code: audio.error?.code }), { once: true })
    audio.play().then(() => finish({ supported: true })).catch(error => finish({ supported: false, code: audio.error?.code, name: error.name }))
  }), original.toString('base64'))
}

test('converter audio handoffs retain the selection, pause hidden playback and open the actual converted result @matrix', async ({ page }, testInfo) => {
  test.setTimeout(150000)
  await page.addInitScript(() => localStorage.setItem('folkkit:locale', 'en'))
  await page.goto('/convert')
  await page.getByLabel('Choose files', { exact: true }).setInputFiles(audioFixture())
  await expect(page.getByText('Ready', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Edit original: private-audio-handoff.wav', exact: true }).click()
  await expect(page).toHaveURL(/\/audio$/)
  await expect(page.getByRole('slider', { name: 'Selection start', exact: true }).or(page.locator('.audio-editor').getByRole('alert')).first()).toBeVisible({ timeout: 65000 })
  await expect(page.locator('.audio-editor').getByRole('alert')).toHaveCount(0)
  await setAudioTime(page, 'Start (seconds)', '1')
  await setAudioTime(page, 'End (seconds)', '6')
  await page.getByRole('button', { name: 'Play selection', exact: true }).click()
  const pause = page.getByRole('button', { name: 'Pause', exact: true })
  await expect(pause.or(page.locator('.audio-editor').getByRole('alert')).first()).toBeVisible()
  if (await pause.isVisible()) await expect(page.locator('.audio-editor').getByRole('alert')).toHaveCount(0)
  else {
    // Exempt only a proven native decoder failure, never a Folkkit preview failure.
    // This Windows WebKit build reports MP3 support but rejects original fixtures.
    const capability = await nativeAudioCapability(page)
    expect(capability).toMatchObject({ supported: false, code: 4 })
    testInfo.annotations.push({ type: 'platform', description: 'Native audio playback unavailable; confirmed with an independent original MP3.' })
  }
  await navigateToConverter(page)
  await expect(page.getByText('Ready', { exact: true })).toBeVisible()
  await page.goBack()
  await expect(page.getByRole('button', { name: 'Play selection', exact: true })).toBeVisible()
  await expect(page.getByLabel('Start (seconds)', { exact: true })).toHaveValue('1')
  await expect(page.getByLabel('End (seconds)', { exact: true })).toHaveValue('6')
  await navigateToConverter(page)
  await page.getByRole('combobox', { name: /^Output format:/ }).selectOption('mp3')
  await page.getByRole('button', { name: 'Convert files', exact: true }).click()
  await expect(page.getByText('Done', { exact: true })).toBeVisible({ timeout: 65000 })
  await page.getByRole('button', { name: /^Edit result:/ }).click()
  await expect(page.locator('.audio-filename').filter({ hasText: /\.mp3$/ }).or(page.locator('.audio-editor').getByRole('alert')).first()).toBeVisible({ timeout: 65000 })
  await expect(page.locator('.audio-editor').getByRole('alert')).toHaveCount(0)
  await expect(page.locator('.audio-filename')).toContainText('.mp3')
  await expect(page.getByLabel('Start (seconds)', { exact: true })).toHaveValue('0')
  await expect(page.getByRole('slider', { name: 'Selection end', exact: true })).toHaveAttribute('aria-valuenow', /^(8|8\.\d+)$/)
  const stored = await page.evaluate(() => JSON.stringify({ local: { ...localStorage }, session: { ...sessionStorage } }))
  expect(stored).not.toContain('private-audio-handoff')
})
