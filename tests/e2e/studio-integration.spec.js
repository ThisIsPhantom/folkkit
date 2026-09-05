import { expect, test } from '@playwright/test'
import { Buffer } from 'node:buffer'
import { readFile } from 'node:fs/promises'
import { PDFDocument, StandardFonts } from 'pdf-lib'
import { PNG } from 'pngjs'
import jsQR from 'jsqr'
import AxeBuilder from '@axe-core/playwright'
import { fixtureFile, onePagePdfBase64, onePixelPngBase64 } from '../fixtures/coreFixtures.js'

test.setTimeout(90000)

function cachedImageFixture() {
  const png = new PNG({ width: 32, height: 24 })
  for (let offset = 0; offset < png.data.length; offset += 4) png.data.set([30, 140, 80, 255], offset)
  return { name: 'cached.png', mimeType: 'image/png', buffer: PNG.sync.write(png) }
}

async function installFromHome(page) {
  await page.goto('/')
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready
    if (!navigator.serviceWorker.controller) await new Promise(resolve => navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true }))
  })
}

test('studio entry screens stay accessible in both themes and languages', async ({ page }) => {
  const violations = []
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  for (const locale of ['de', 'en']) {
    await page.evaluate(value => localStorage.setItem('folkkit:locale', value), locale)
    for (const route of ['/qr', '/pdf', '/convert', '/calculate']) {
      await page.goto(route)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      await expect(page.locator('.studio-loading')).toHaveCount(0)
      for (const theme of ['light', 'dark']) {
        const toggle = page.locator('.theme-button')
        if (await toggle.getAttribute('aria-pressed') !== String(theme === 'dark')) await toggle.click()
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
        const result = await new AxeBuilder({ page }).analyze()
        if (result.violations.length) violations.push({ route, locale, theme, violations: result.violations })
      }
    }
  }
  expect(violations).toEqual([])
})

test('all three studio entries fit the first mobile screen @matrix', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  for (const name of ['QR-Code erstellen', 'PDF bearbeiten', 'Datei konvertieren']) {
    const action = page.getByRole('button', { name, exact: true })
    await expect(action).toBeVisible()
    const bounds = await action.boundingBox()
    expect(bounds.y).toBeGreaterThanOrEqual(0)
    expect(bounds.y + bounds.height).toBeLessThanOrEqual(844)
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1)
})

test('a home-only installation opens every studio offline, including the image-to-PDF worker import', async ({ page, context }) => {
  await installFromHome(page)
  await context.setOffline(true)
  await page.goto('/qr')
  await page.getByRole('textbox', { name: 'Inhalt', exact: true }).fill('Offline Grüsse 😀')
  await expect(page.getByRole('img', { name: 'QR-Code-Vorschau' })).toBeVisible()
  let pending = page.waitForEvent('download')
  await page.getByRole('button', { name: 'PNG herunterladen' }).click()
  const png = PNG.sync.read(await readFile(await (await pending).path()))
  expect(jsQR(new Uint8ClampedArray(png.data), png.width, png.height)?.data).toBe('Offline Grüsse 😀')

  await page.goto('/pdf')
  await page.getByLabel('PDF auswählen', { exact: true }).setInputFiles(fixtureFile('offline-private.pdf', 'application/pdf', onePagePdfBase64))
  await expect(page.getByRole('button', { name: 'PDF herunterladen', exact: true })).toBeEnabled({ timeout: 45000 })
  pending = page.waitForEvent('download')
  await page.getByRole('button', { name: 'PDF herunterladen', exact: true }).click()
  expect((await PDFDocument.load(await readFile(await (await pending).path()))).getPageCount()).toBe(1)

  await page.goto('/convert')
  await page.getByLabel('Dateien auswählen', { exact: true }).setInputFiles(fixtureFile('offline-private.png', 'image/png', onePixelPngBase64))
  await expect(page.getByText('Bereit', { exact: true })).toBeVisible()
  await page.getByRole('combobox', { name: /^Zielformat:/ }).selectOption('jpeg')
  await page.getByRole('button', { name: 'Dateien konvertieren', exact: true }).click()
  await expect(page.getByText('Fertig', { exact: true })).toBeVisible()
  await page.getByRole('combobox', { name: /^Zielformat:/ }).selectOption('pdf')
  await page.getByRole('button', { name: 'Dateien konvertieren', exact: true }).click()
  await expect(page.getByText('Fertig', { exact: true })).toBeVisible()
  pending = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Herunterladen', exact: true }).click()
  expect((await PDFDocument.load(await readFile(await (await pending).path()))).getPageCount()).toBe(1)

  const cacheUrls = await page.evaluate(async () => {
    const names = await caches.keys()
    const requests = await Promise.all(names.filter(name => name.startsWith('folkkit-app-')).map(async name => (await caches.open(name)).keys()))
    return requests.flat().map(request => request.url)
  })
  expect(cacheUrls.some(url => /offline-private|blob:|data:/.test(url))).toBe(false)
  await context.setOffline(false)
})

test('cancelling navigation and browser back preserves unsaved PDF contents', async ({ page }) => {
  const pdf = await PDFDocument.create()
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  pdf.addPage([300, 220]).drawText('Before', { font, size: 20, x: 40, y: 130 })
  await page.goto('/')
  await page.getByRole('button', { name: 'PDF bearbeiten', exact: true }).click()
  await page.getByLabel('PDF auswählen', { exact: true }).setInputFiles({ name: 'guard.pdf', mimeType: 'application/pdf', buffer: Buffer.from(await pdf.save()) })
  await page.getByRole('button', { name: 'Textobjekt 1', exact: true }).click()
  await page.getByLabel('Textinhalt', { exact: true }).fill('Keep this edit')
  await page.getByRole('button', { name: 'Übernehmen', exact: true }).click()
  await expect(page.getByText('Ungespeicherte Änderungen', { exact: true })).toBeVisible()
  page.once('dialog', dialog => dialog.dismiss())
  await page.getByRole('link', { name: 'Konvertieren', exact: true }).click()
  await expect(page).toHaveURL(/\/pdf$/)
  page.once('dialog', dialog => dialog.dismiss())
  await page.goBack()
  await expect(page).toHaveURL(/\/pdf$/)
  await page.getByRole('button', { name: 'Textobjekt 1', exact: true }).click()
  await expect(page.getByLabel('Textinhalt', { exact: true })).toHaveValue('Keep this edit')
  page.once('dialog', dialog => dialog.accept())
  await page.getByRole('link', { name: 'Konvertieren', exact: true }).click()
  await expect(page).toHaveURL(/\/convert$/)
})

test('used image modules remain available after an offline reload @matrix', async ({ page }) => {
  const { createOfflinePreview } = await import('./helpers/offline-preview.mjs')
  const preview = await createOfflinePreview()
  try {
    await page.addInitScript(() => localStorage.setItem('folkkit:locale', 'en'))
    await page.goto(preview.url)
    await page.evaluate(async () => {
      await navigator.serviceWorker.ready
      if (!navigator.serviceWorker.controller) await new Promise(resolve => navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true }))
    })
    await page.goto(preview.url + '/convert')
    await expect(page.locator('.converter-drop')).toBeVisible()
    const needsFallback = await page.evaluate(() => typeof OffscreenCanvas !== 'function')
    await page.getByLabel('Choose files', { exact: true }).setInputFiles(cachedImageFixture())
    await expect(page.getByText('Ready', { exact: true })).toBeVisible()
    await page.getByRole('combobox', { name: /^Output format:/ }).selectOption('webp')
    await page.getByRole('button', { name: 'Convert files', exact: true }).click()
    await expect(page.getByText('Done', { exact: true })).toBeVisible({ timeout: 45000 })
    const cached = await page.evaluate(async () => {
      const name = (await caches.keys()).find(key => key.startsWith('folkkit-app-'))
      return (await (await caches.open(name)).keys()).map(request => new URL(request.url).pathname)
    })
    if (needsFallback) {
      expect(cached).toContain('/vendor/ffmpeg/ffmpeg-core.js')
      expect(cached).toContain('/vendor/ffmpeg/ffmpeg-core.wasm')
    } else {
      expect(cached).not.toContain('/vendor/ffmpeg/ffmpeg-core.wasm')
    }
    await page.evaluate(() => { window.offlineReloadMarker = 'previous document' })
    // Keep browser networking enabled: the owned server denies every request.
    // This exercises the real SW fallback on Chromium and WebKit alike.
    preview.setOffline()
    await page.reload()
    expect(await page.evaluate(() => window.offlineReloadMarker)).toBeUndefined()
    await expect(page.locator('.converter-drop')).toBeVisible()
    await page.getByLabel('Choose files', { exact: true }).setInputFiles(cachedImageFixture())
    await expect(page.getByText('Ready', { exact: true })).toBeVisible()
    await page.getByRole('combobox', { name: /^Output format:/ }).selectOption('jpeg')
    await page.getByRole('button', { name: 'Convert files', exact: true }).click()
    await expect(page.getByText('Done', { exact: true })).toBeVisible({ timeout: 45000 })
    const pending = page.waitForEvent('download')
    await page.getByRole('button', { name: 'Download', exact: true }).click()
    expect((await readFile(await (await pending).path())).subarray(0, 3)).toEqual(Buffer.from([255, 216, 255]))
    expect(preview.deniedRequests).toBeGreaterThan(0)
  } finally { await preview.close() }
})
