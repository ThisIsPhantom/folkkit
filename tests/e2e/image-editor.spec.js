import { readFile } from 'node:fs/promises'
import { Buffer } from 'node:buffer'
import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { PNG } from 'pngjs'
import { withJpegOrientation } from './file-converter-fixtures/exif.mjs'

function pixelAt(png, x, y) {
  return Array.from(png.data.subarray((y * png.width + x) * 4, (y * png.width + x) * 4 + 4))
}

function sourcePixel(x, y) {
  return [x % 256, y % 256, (x + y) % 256, x < 20 && y < 20 ? 0 : 255]
}

function imageFixture(width = 300, height = 200) {
  const png = new PNG({ width, height })
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) png.data.set(sourcePixel(x, y), (y * width + x) * 4)
  }
  return { name: 'non-square-alpha.png', mimeType: 'image/png', buffer: PNG.sync.write(png) }
}

function watermarkFixture() {
  const png = new PNG({ width: 60, height: 30 })
  for (let offset = 0; offset < png.data.length; offset += 4) png.data.set([237, 42, 142, 192], offset)
  return { name: 'local-watermark.png', mimeType: 'image/png', buffer: PNG.sync.write(png) }
}

async function downloadImage(page, name) {
  const pending = page.waitForEvent('download')
  await page.getByRole('button', { name, exact: true }).click()
  const download = await pending
  return { name: download.suggestedFilename(), bytes: await readFile(await download.path()) }
}

test('crop, clockwise rotation and mirror map original pixels exactly through the worker', async ({ page }) => {
  await page.goto('/image')
  await page.getByLabel('Bild auswählen', { exact: true }).setInputFiles(imageFixture())
  await expect(page.getByText('300 × 200 px', { exact: true })).toBeVisible()
  await page.getByLabel('X-Position des Ausschnitts').fill('50')
  await page.getByLabel('Y-Position des Ausschnitts').fill('20')
  await page.getByLabel('Breite des Ausschnitts').fill('100')
  await page.getByLabel('Höhe des Ausschnitts').fill('80')
  await page.getByRole('button', { name: 'Ausschnitt anwenden', exact: true }).click()
  await page.getByRole('button', { name: '90° nach rechts drehen', exact: true }).click()
  let output = PNG.sync.read((await downloadImage(page, 'PNG herunterladen')).bytes)
  expect({ width: output.width, height: output.height }).toEqual({ width: 80, height: 100 })
  expect(pixelAt(output, 79, 0)).toEqual(sourcePixel(50, 20))

  await page.getByRole('button', { name: 'Horizontal spiegeln', exact: true }).click()
  output = PNG.sync.read((await downloadImage(page, 'PNG herunterladen')).bytes)
  expect(pixelAt(output, 0, 0)).toEqual(sourcePixel(50, 20))
})

test('PNG keeps alpha, JPEG composites white, and the main-thread fallback exports independently', async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(globalThis, 'OffscreenCanvas', { configurable: true, value: undefined }) })
  await page.goto('/image')
  await page.getByLabel('Bild auswählen', { exact: true }).setInputFiles(imageFixture(120, 80))
  const png = PNG.sync.read((await downloadImage(page, 'PNG herunterladen')).bytes)
  expect(pixelAt(png, 0, 0)[3]).toBe(0)
  await page.getByLabel('Dateiformat').selectOption('jpeg')
  const jpegDownload = await downloadImage(page, 'JPEG herunterladen')
  expect(jpegDownload.name).toBe('non-square-alpha-folkkit.jpg')
  const white = await page.evaluate(async (base64) => {
    const bytes = Uint8Array.from(atob(base64), character => character.charCodeAt(0))
    const bitmap = await createImageBitmap(new Blob([bytes], { type: 'image/jpeg' }))
    const canvas = document.createElement('canvas'); canvas.width = bitmap.width; canvas.height = bitmap.height
    const context = canvas.getContext('2d'); context.drawImage(bitmap, 0, 0); bitmap.close()
    return Array.from(context.getImageData(0, 0, 1, 1).data)
  }, jpegDownload.bytes.toString('base64'))
  expect(white.slice(0, 3).every(channel => channel > 245)).toBe(true)
})

test('the reviewed production CSP permits the local image worker and export', async ({ page }) => {
  const htaccess = await readFile(new URL('../../hosting/.htaccess', import.meta.url), 'utf8')
  const policy = htaccess.match(/^\s*Header always set Content-Security-Policy "([^"]*)"\s*$/m)?.[1]
  expect(policy).toBeTruthy()
  const violations = []
  page.on('console', message => {
    if (/content security policy|refused to (?:load|execute|create)/i.test(message.text())) violations.push(message.text())
  })
  await page.route('**/*', async (route) => {
    const response = await route.fetch()
    const headers = response.headers()
    if (headers['content-type']?.startsWith('text/html')) headers['content-security-policy'] = policy
    await route.fulfill({ response, headers })
  })
  await page.goto('/image')
  await page.getByLabel('Bild auswählen', { exact: true }).setInputFiles(imageFixture(120, 80))
  expect(PNG.sync.read((await downloadImage(page, 'PNG herunterladen')).bytes)).toMatchObject({ width: 120, height: 80 })
  expect(violations).toEqual([])
})

test('text and watermark gestures create one undo step, Escape cancels, and export excludes controls', async ({ page }) => {
  await page.goto('/image')
  await page.getByLabel('Bild auswählen', { exact: true }).setInputFiles(imageFixture())
  await page.getByLabel('Textinhalt', { exact: true }).fill('Grüsse für Jörg')
  await page.getByRole('button', { name: 'Text hinzufügen', exact: true }).click()
  const x = page.getByLabel('X-Position', { exact: true })
  const initialX = Number(await x.inputValue())
  const stage = page.getByRole('application', { name: 'Bild und Elemente bearbeiten' })
  const target = page.getByRole('button', { name: 'Grüsse für Jörg auswählen' })
  await target.scrollIntoViewIfNeeded()
  const box = await target.boundingBox()
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down(); await page.mouse.move(box.x + box.width / 2 + 30, box.y + box.height / 2 + 15, { steps: 6 }); await page.mouse.up()
  const movedX = Number(await x.inputValue())
  expect(movedX).toBeGreaterThan(initialX)
  await page.getByRole('button', { name: 'Rückgängig', exact: true }).click()
  await expect(x).toHaveValue(String(initialX))
  await page.getByRole('button', { name: 'Wiederholen', exact: true }).click()
  await expect(x).toHaveValue(String(movedX))

  const moved = await target.boundingBox()
  await page.mouse.move(moved.x + 5, moved.y + 5); await page.mouse.down(); await page.mouse.move(moved.x + 55, moved.y + 25, { steps: 4 })
  await page.keyboard.press('Escape'); await page.mouse.up()
  await expect(x).toHaveValue(String(movedX))

  await page.getByLabel('Wasserzeichen hinzufügen').setInputFiles(watermarkFixture())
  await expect(page.getByRole('button', { name: 'Wasserzeichen: local-watermark.png' })).toBeVisible()
  await page.getByRole('button', { name: 'Zentrieren', exact: true }).click()
  const exported = PNG.sync.read((await downloadImage(page, 'PNG herunterladen')).bytes)
  let watermarkPixels = 0
  for (let offset = 0; offset < exported.data.length; offset += 4) {
    if (exported.data[offset] > 180 && exported.data[offset + 2] > 100 && exported.data[offset + 1] < 100) watermarkPixels += 1
  }
  expect(watermarkPixels).toBeGreaterThan(100)
  await expect(stage).toBeVisible()
})

test('EXIF dimensions, invalid files, English dark mobile layout and accessibility pass @matrix', async ({ page }, testInfo) => {
  const requests = []
  page.on('request', request => requests.push(request.url()))
  await page.addInitScript(() => { localStorage.setItem('folkkit:locale', 'en'); localStorage.setItem('folkkit:theme', 'dark') })
  await page.goto('/image')
  const jpeg = await readFile(new URL('./file-converter-fixtures/sample.jpg', import.meta.url))
  await page.getByLabel('Choose image', { exact: true }).setInputFiles({ name: 'oriented.jpg', mimeType: 'image/jpeg', buffer: Buffer.from(withJpegOrientation(jpeg, 6)) })
  await expect(page.getByText('64 × 96 px', { exact: true })).toBeVisible()
  const previewBounds = await page.getByRole('application', { name: 'Edit image and elements' }).boundingBox()
  expect(previewBounds.width / previewBounds.height).toBeCloseTo(64 / 96, 2)
  expect(PNG.sync.read((await downloadImage(page, 'Download PNG')).bytes)).toMatchObject({ width: 64, height: 96 })
  if (testInfo.project.name.includes('mobile')) {
    await page.getByRole('button', { name: '1:1', exact: true }).tap()
    const crop = page.getByRole('button', { name: 'Move crop area', exact: true })
    await crop.scrollIntoViewIfNeeded()
    const cropBounds = await crop.boundingBox()
    const session = await page.context().newCDPSession(page)
    const x = cropBounds.x + cropBounds.width / 2, y = cropBounds.y + cropBounds.height / 2
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y, id: 1 }] })
    await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y + 10, id: 1 }] })
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
    await expect(page.getByLabel('Crop Y position')).not.toHaveValue('16')
  }
  expect((await new AxeBuilder({ page }).include('.image-editor').analyze()).violations).toEqual([])
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false)
  expect(requests.filter(url => /^https?:/.test(url)).every(url => new URL(url).origin === new URL(page.url()).origin)).toBe(true)
  await page.screenshot({ path: testInfo.outputPath('image-editor.png'), fullPage: true })

  await page.getByLabel('Choose image', { exact: true }).setInputFiles({ name: 'bad.png', mimeType: 'image/png', buffer: Buffer.from('private-image-content') })
  await expect(page.getByRole('alert')).toContainText('file format is unsupported')
  await expect(page.getByRole('alert')).not.toContainText('private-image-content')
})

test('portrait preview, numeric crop and pointer resize preserve their selected aspect', async ({ page }) => {
  await page.goto('/image')
  await page.getByLabel('Bild auswählen', { exact: true }).setInputFiles(imageFixture(600, 1200))
  const stage = page.getByRole('application', { name: 'Bild und Elemente bearbeiten' })
  const stageBounds = await stage.boundingBox()
  expect(stageBounds.width / stageBounds.height).toBeCloseTo(0.5, 2)
  expect(PNG.sync.read((await downloadImage(page, 'PNG herunterladen')).bytes)).toMatchObject({ width: 600, height: 1200 })

  await page.getByRole('button', { name: '1:1', exact: true }).click()
  await page.getByLabel('Breite des Ausschnitts').fill('300')
  await expect(page.getByLabel('Höhe des Ausschnitts')).toHaveValue('300')
  const resize = page.getByRole('button', { name: 'Ausschnittsgrösse ändern', exact: true })
  await resize.scrollIntoViewIfNeeded()
  const resizeBounds = await resize.boundingBox()
  await page.mouse.move(resizeBounds.x + resizeBounds.width / 2, resizeBounds.y + resizeBounds.height / 2)
  await page.mouse.down(); await page.mouse.move(resizeBounds.x + resizeBounds.width / 2 + 80, resizeBounds.y + resizeBounds.height / 2 + 20, { steps: 5 }); await page.mouse.up()
  expect(await page.getByLabel('Breite des Ausschnitts').inputValue()).toBe(await page.getByLabel('Höhe des Ausschnitts').inputValue())
  await expect(page.getByRole('button', { name: '1:1', exact: true })).toHaveAttribute('aria-pressed', 'true')
})

test('cancelled and superseded exports release busy state without clearing newer edits', async ({ page }) => {
  await page.addInitScript(() => {
    const NativeWorker = Worker
    window.__stallImageExport = false
    window.Worker = class extends NativeWorker {
      postMessage(message, ...args) {
        if (window.__stallImageExport && message?.command === 'render') {
          window.__heldImageExport = { worker: this, message, args }
          return
        }
        return NativeWorker.prototype.postMessage.call(this, message, ...args)
      }
    }
    window.__releaseImageExport = () => {
      const held = window.__heldImageExport
      window.__heldImageExport = null
      NativeWorker.prototype.postMessage.call(held.worker, held.message, ...held.args)
    }
  })
  await page.goto('/image')
  await page.getByLabel('Bild auswählen', { exact: true }).setInputFiles(imageFixture())
  await page.evaluate(() => { window.__stallImageExport = true })
  await page.getByRole('button', { name: 'PNG herunterladen', exact: true }).click()
  await expect(page.getByText('Bild wird exportiert …', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Abbrechen', exact: true }).click()
  await expect(page.getByText('Bild wird exportiert …', { exact: true })).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'PNG herunterladen', exact: true })).toBeEnabled()

  await page.evaluate(() => { window.__stallImageExport = false })
  await downloadImage(page, 'PNG herunterladen')
  await page.evaluate(() => { window.__stallImageExport = true })
  await page.getByRole('button', { name: 'PNG herunterladen', exact: true }).click()
  await page.getByRole('button', { name: '90° nach rechts drehen', exact: true }).click()
  const download = page.waitForEvent('download')
  await page.evaluate(() => window.__releaseImageExport())
  await download
  await expect(page.getByText('Ungespeicherte Änderungen', { exact: true })).toBeVisible()
})

test('watermark generation rejects late reset results, preserves newer edits and reuses one selection', async ({ page }) => {
  await page.addInitScript(() => {
    const nativeCreateImageBitmap = createImageBitmap.bind(globalThis)
    window.__delayWatermark = false
    globalThis.createImageBitmap = (source, options) => {
      if (window.__delayWatermark && source?.name === 'delayed-watermark.png') return new Promise((resolve, reject) => {
        window.__releaseWatermark = async () => {
          window.__releaseWatermark = null
          try { resolve(await nativeCreateImageBitmap(source, options)) } catch (error) { reject(error) }
        }
      })
      return nativeCreateImageBitmap(source, options)
    }
  })
  await page.goto('/image')
  await page.getByLabel('Bild auswählen', { exact: true }).setInputFiles(imageFixture())
  await page.evaluate(() => { window.__delayWatermark = true })
  const watermark = { ...watermarkFixture(), name: 'delayed-watermark.png' }
  await page.getByLabel('Wasserzeichen hinzufügen').setInputFiles(watermark)
  await expect.poll(() => page.evaluate(() => typeof window.__releaseWatermark)).toBe('function')
  await page.getByRole('button', { name: 'Zurücksetzen', exact: true }).click()
  await page.evaluate(() => window.__releaseWatermark())
  await expect(page.locator('.image-element-list button')).toHaveCount(0)

  await page.getByLabel('Wasserzeichen hinzufügen').setInputFiles(watermark)
  await expect.poll(() => page.evaluate(() => typeof window.__releaseWatermark)).toBe('function')
  await page.getByRole('button', { name: '90° nach rechts drehen', exact: true }).click()
  await page.evaluate(() => window.__releaseWatermark())
  await expect(page.getByText('200 × 300 px', { exact: true })).toBeVisible()
  await expect(page.locator('.image-element-list button')).toHaveCount(1)
  await page.getByRole('button', { name: 'Wasserzeichen erneut einfügen', exact: true }).click()
  await expect(page.locator('.image-element-list button')).toHaveCount(2)
})

test('one opacity or colour gesture creates one undo step and Escape cancels the draft', async ({ page }) => {
  await page.goto('/image')
  await page.getByLabel('Bild auswählen', { exact: true }).setInputFiles(imageFixture())
  await page.getByLabel('Textinhalt', { exact: true }).fill('Gesture history')
  await page.getByRole('button', { name: 'Text hinzufügen', exact: true }).click()
  const opacity = page.getByLabel('Deckkraft')
  await opacity.scrollIntoViewIfNeeded()
  const opacityBounds = await opacity.boundingBox()
  await page.mouse.move(opacityBounds.x + opacityBounds.width - 3, opacityBounds.y + opacityBounds.height / 2)
  await page.mouse.down(); await page.mouse.move(opacityBounds.x + opacityBounds.width * 0.39, opacityBounds.y + opacityBounds.height / 2, { steps: 8 }); await page.mouse.up()
  expect(Number(await opacity.inputValue())).toBeLessThan(60)
  await page.getByRole('button', { name: 'Rückgängig', exact: true }).click()
  await expect(opacity).toHaveValue('100')

  const colour = page.getByLabel('Farbe')
  await colour.focus(); await colour.fill('#224466'); await colour.fill('#446688'); await colour.blur()
  await page.getByRole('button', { name: 'Rückgängig', exact: true }).click()
  await expect(page.getByLabel('Farbe')).toHaveValue('#111111')
  await page.getByLabel('Farbe').focus(); await page.getByLabel('Farbe').fill('#224466'); await page.keyboard.press('Escape')
  await page.getByRole('button', { name: 'Text: Gesture history', exact: true }).click()
  await expect(page.getByLabel('Farbe')).toHaveValue('#111111')
})
