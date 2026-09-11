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

async function centreImageControl(control) {
  // Wait for settled geometry before sending raw pointer coordinates.
  await control.evaluate(async node => { await document.fonts.ready; node.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'instant' }) })
  let previous = null
  await expect.poll(async () => {
    const box = await control.boundingBox()
    const stable = box !== null && JSON.stringify(box) === JSON.stringify(previous)
    previous = box
    return stable
  }, { message: 'Canvas pointer coordinates must be stable after scrolling.', intervals: [50, 100, 200] }).toBe(true)
}

async function revealImageControl(control) {
  // Protocol scrollIntoViewIfNeeded can place a canvas control beneath the sticky header.
  await centreImageControl(control)
  await expect.poll(() => control.evaluate(node => {
    const box = node.getBoundingClientRect()
    const hit = document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2)
    return hit === node || node.contains(hit)
  }), { message: 'Pointer gestures must start on the visible canvas control.' }).toBe(true)
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
  await revealImageControl(target)
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

test('portrait preview, numeric crop and pointer resize preserve their selected aspect @matrix', async ({ page }, testInfo) => {
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
  await revealImageControl(resize)
  const resizeBounds = await resize.boundingBox()
  await page.mouse.move(resizeBounds.x + resizeBounds.width / 2, resizeBounds.y + resizeBounds.height / 2)
  await page.mouse.down(); await page.mouse.move(resizeBounds.x + resizeBounds.width / 2 + 80, resizeBounds.y + resizeBounds.height / 2 + 20, { steps: 5 }); await page.mouse.up()
  expect(await page.getByLabel('Breite des Ausschnitts').inputValue()).toBe(await page.getByLabel('Höhe des Ausschnitts').inputValue())
  await expect(page.getByRole('button', { name: '1:1', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await page.screenshot({ path: testInfo.outputPath('image-portrait.png'), fullPage: true })
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

test('colour, asynchronous watermark, undo and Escape remain separate history steps', async ({ page }) => {
  await page.addInitScript(() => {
    const nativeCreateImageBitmap = createImageBitmap.bind(globalThis)
    globalThis.createImageBitmap = (source, options) => {
      if (source?.name === 'async-colour-watermark.png') return new Promise((resolve, reject) => {
        window.__releaseColourWatermark = async () => {
          try { resolve(await nativeCreateImageBitmap(source, options)) } catch (error) { reject(error) }
        }
      })
      return nativeCreateImageBitmap(source, options)
    }
  })
  await page.goto('/image')
  await page.getByLabel('Bild auswählen', { exact: true }).setInputFiles(imageFixture())
  await page.getByLabel('Textinhalt', { exact: true }).fill('Original')
  await page.getByRole('button', { name: 'Text hinzufügen', exact: true }).click()
  await page.getByLabel('Wasserzeichen hinzufügen').setInputFiles({ ...watermarkFixture(), name: 'async-colour-watermark.png' })
  await expect.poll(() => page.evaluate(() => typeof window.__releaseColourWatermark)).toBe('function')
  await page.getByLabel('Farbe').focus()
  await page.getByLabel('Farbe').fill('#224466')
  await page.evaluate(() => window.__releaseColourWatermark())
  await expect(page.getByRole('button', { name: 'Wasserzeichen: async-colour-watermark.png' })).toBeVisible()
  await page.getByRole('button', { name: 'Rückgängig', exact: true }).click()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('button', { name: 'Wasserzeichen: async-colour-watermark.png' })).toHaveCount(0)
  await page.getByRole('button', { name: 'Text: Original', exact: true }).click()
  await expect(page.getByLabel('Farbe')).toHaveValue('#224466')
  await page.getByRole('button', { name: 'Rückgängig', exact: true }).click()
  await expect(page.getByLabel('Farbe')).toHaveValue('#111111')
})

test('one opacity or colour gesture creates one undo step and Escape cancels the draft @matrix', async ({ page }) => {
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

  await opacity.focus()
  await page.keyboard.down('ArrowLeft')
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.up('ArrowLeft')
  await expect(opacity).toHaveValue('98')
  await page.getByRole('button', { name: 'Rückgängig', exact: true }).click()
  await expect(opacity).toHaveValue('100')
  await page.getByRole('button', { name: 'Wiederholen', exact: true }).click()
  await expect(opacity).toHaveValue('98')
  await page.getByRole('button', { name: 'Rückgängig', exact: true }).click()

  const colour = page.getByLabel('Farbe')
  await colour.focus(); await colour.fill('#224466'); await colour.fill('#446688'); await colour.blur()
  await page.getByRole('button', { name: 'Rückgängig', exact: true }).click()
  await expect(page.getByLabel('Farbe')).toHaveValue('#111111')
  await colour.focus(); await colour.fill('#224466')
  await opacity.scrollIntoViewIfNeeded()
  const afterColour = await opacity.boundingBox()
  await page.mouse.move(afterColour.x + afterColour.width - 3, afterColour.y + afterColour.height / 2)
  await page.mouse.down()
  await page.mouse.move(afterColour.x + afterColour.width * 0.39, afterColour.y + afterColour.height / 2, { steps: 4 })
  await page.mouse.up()
  expect(Number(await opacity.inputValue())).toBeLessThan(60)
  await page.getByRole('button', { name: 'Rückgängig', exact: true }).click()
  await expect(opacity).toHaveValue('100')
  await expect(colour).toHaveValue('#224466')
  await page.getByRole('button', { name: 'Rückgängig', exact: true }).click()
  await expect(colour).toHaveValue('#111111')
  await page.getByLabel('Farbe').focus(); await page.getByLabel('Farbe').fill('#224466'); await page.keyboard.press('Escape')
  await page.getByRole('button', { name: 'Text: Gesture history', exact: true }).click()
  await expect(page.getByLabel('Farbe')).toHaveValue('#111111')
})


test('image file pickers show a visible label indicator through real Tab focus @matrix', async ({ page }, testInfo) => {
  await page.goto('/image')
  async function tabToPicker(id) {
    const input = page.locator(`#${id}`)
    for (let step = 0; step < 80; step += 1) {
      await page.keyboard.press('Tab')
      if (await input.evaluate(element => element === document.activeElement)) break
    }
    await expect(input).toBeFocused()
    expect(await input.evaluate(element => element.matches(':focus-visible'))).toBe(true)
    const label = page.locator(`label[for="${id}"]`)
    await expect(label).toBeVisible()
    const indicator = await label.evaluate(element => {
      const style = getComputedStyle(element)
      return { style: style.outlineStyle, width: parseFloat(style.outlineWidth), color: style.outlineColor }
    })
    expect(indicator.style).not.toBe('none')
    expect(indicator.width).toBeGreaterThanOrEqual(2)
    expect(indicator.color).not.toBe('rgba(0, 0, 0, 0)')
  }
  await tabToPicker('image-editor-file')
  await page.screenshot({ path: testInfo.outputPath('initial-image-picker-focus.png'), fullPage: true })
  await page.locator('#image-editor-file').setInputFiles(imageFixture())
  await expect(page.getByText('300 × 200 px', { exact: true })).toBeVisible()
  await tabToPicker('image-editor-file')
  await tabToPicker('image-watermark-file')
})

test('opacity rejects a real second touch and Escape blocks late owner movement @matrix', async ({ page, browserName }, testInfo) => {
  test.skip(browserName !== 'chromium', 'Two simultaneous touches use the Chromium CDP input API.')
  const requests = []
  await page.addInitScript(() => {
    window.__imageCspViolations = []
    window.__opacityEvents = []
    for (const type of ['pointerdown', 'pointerup', 'pointercancel', 'lostpointercapture', 'touchstart', 'touchend', 'input', 'blur', 'keydown']) {
      document.addEventListener(type, event => {
        window.__opacityEvents.push({ type, pointerId: event.pointerId, isPrimary: event.isPrimary, key: event.key, target: event.target.name || event.target.tagName, value: document.querySelector('[name=opacity]')?.value })
      }, true)
    }
    document.addEventListener('securitypolicyviolation', event => window.__imageCspViolations.push(event.violatedDirective))
  })
  page.on('request', request => requests.push(request.url()))
  await page.goto('/image')
  await page.getByLabel('Bild auswählen', { exact: true }).setInputFiles(imageFixture())
  await page.getByLabel('Textinhalt', { exact: true }).fill('Touch owner')
  await page.getByRole('button', { name: 'Text hinzufügen', exact: true }).click()
  const opacity = page.getByLabel('Deckkraft')
  await opacity.scrollIntoViewIfNeeded()
  const box = await opacity.boundingBox()
  const point = (fraction, id) => ({ x: box.x + box.width * fraction, y: box.y + box.height / 2, id })
  const session = await page.context().newCDPSession(page)
  const touch = (type, touchPoints) => session.send('Input.dispatchTouchEvent', { type, touchPoints })
  try {
    await touch('touchStart', [point(0.98, 1)])
    await touch('touchMove', [point(0.3, 1)])
    const ownedValue = await opacity.inputValue()
    expect(Number(ownedValue)).toBeLessThan(45)
    await touch('touchStart', [point(0.3, 1), point(0.72, 2)])
    await expect(opacity).toHaveValue(ownedValue)
    await touch('touchEnd', [point(0.72, 2)])
    expect(await page.evaluate(() => window.__opacityEvents.filter(event => event.type === 'pointerup').at(-1))).toMatchObject({ pointerId: 3, isPrimary: false })
    await expect(opacity).toHaveValue(ownedValue)
    await page.keyboard.press('Escape')
    await expect(opacity).toHaveValue('100')
    await touch('touchMove', [point(0.6, 1)])
    await expect(opacity).toHaveValue('100')
    await touch('touchEnd', [])
    await expect(opacity).toHaveValue('100')
    await page.getByRole('button', { name: 'Rückgängig', exact: true }).click()
    await expect(page.getByRole('button', { name: 'Text: Touch owner', exact: true })).toHaveCount(0)
    await page.getByRole('button', { name: 'Wiederholen', exact: true }).click()
    await expect(opacity).toHaveValue('100')
    await expect(page.getByRole('button', { name: 'Wiederholen', exact: true })).toBeDisabled()
    expect(await page.evaluate(() => window.__imageCspViolations)).toEqual([])
    expect(requests.filter(url => /^https?:/.test(url) && new URL(url).origin !== new URL(page.url()).origin)).toEqual([])
    await testInfo.attach('two-touch-result', { body: JSON.stringify({ ownedValue, afterEscapeAndRelease: await opacity.inputValue(), cspViolations: [], externalRequests: [] }), contentType: 'application/json' })
  } finally {
    await testInfo.attach('opacity-events', { body: JSON.stringify(await page.evaluate(() => window.__opacityEvents), null, 2), contentType: 'application/json' })
    await touch('touchEnd', []).catch(() => {})
    await session.detach()
  }
})


for (const kind of ['watermark', 'text']) test(`image pixels follow a ${kind} gesture before commit and Escape restores them @matrix`, async ({ page }, testInfo) => {
  await page.addInitScript(() => localStorage.setItem('folkkit:locale', 'de'))
  await page.goto('/image')
  const white = new PNG({ width: 320, height: 200 }); white.data.fill(255)
  await page.getByLabel('Bild auswählen', { exact: true }).setInputFiles({ name: 'white.png', mimeType: 'image/png', buffer: PNG.sync.write(white) })
  await expect(page.getByText('320 × 200 px', { exact: true })).toBeVisible()
  if (kind === 'watermark') await page.getByLabel('Wasserzeichen hinzufügen', { exact: true }).setInputFiles(watermarkFixture())
  else { await page.getByLabel('Textinhalt', { exact: true }).fill('Text in Bewegung'); await page.getByRole('button', { name: 'Text hinzufügen', exact: true }).click() }
  const canvas = page.locator('.image-canvas-stage canvas')
  await expect.poll(() => canvas.evaluate(node => {
    const data = node.getContext('2d').getImageData(0, 0, node.width, node.height).data
    let ink = 0
    for (let i = 0; i < data.length; i += 4) if (data[i + 1] < 250) ink++
    return ink
  })).toBeGreaterThan(50)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  const original = await canvas.evaluate(node => node.toDataURL())
  const x = page.getByLabel('X-Position', { exact: true }), initialX = await x.inputValue()
  const target = page.getByRole('button', { name: kind === 'watermark' ? 'local-watermark.png auswählen' : 'Text in Bewegung auswählen', exact: true })
  await page.screenshot({ path: testInfo.outputPath('image-before-gesture.png'), fullPage: true })
  await revealImageControl(target)
  const box = await target.boundingBox(), stage = await page.locator('.image-canvas-stage').boundingBox()
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  try {
    await page.mouse.move(box.x + box.width / 2 + stage.width * .15, box.y + box.height / 2 + stage.height * .1, { steps: 8 })
    await expect.poll(async () => await canvas.evaluate(node => node.toDataURL()) !== original, { message: 'Actual element pixels must move while the pointer is held.' }).toBe(true)
    await page.screenshot({ path: testInfo.outputPath('image-during-gesture.png') })
    await expect(x).toHaveValue(initialX)
    await page.keyboard.press('Escape')
    await expect.poll(async () => await canvas.evaluate(node => node.toDataURL()) === original).toBe(true)
  } finally { await page.mouse.up() }
  await expect(x).toHaveValue(initialX)
  const again = await target.boundingBox()
  await page.mouse.move(again.x + again.width / 2, again.y + again.height / 2)
  await page.mouse.down(); await page.mouse.move(again.x + again.width / 2 + stage.width * .1, again.y + again.height / 2, { steps: 4 }); await page.mouse.up()
  await expect(x).not.toHaveValue(initialX)
  await expect.poll(async () => await canvas.evaluate(node => node.toDataURL()) !== original).toBe(true)
  const exported = PNG.sync.read((await downloadImage(page, 'PNG herunterladen')).bytes)
  const preview = PNG.sync.read(Buffer.from((await canvas.evaluate(node => node.toDataURL())).split(',')[1], 'base64'))
  expect(exported.width).toBe(preview.width); expect(exported.height).toBe(preview.height)
  expect(exported.data.equals(preview.data), 'Final preview and original-based export must agree').toBe(true)
  await page.getByRole('button', { name: 'Rückgängig', exact: true }).click()
  await expect(x).toHaveValue(initialX)
  await expect.poll(async () => await canvas.evaluate(node => node.toDataURL()) === original).toBe(true)
  await page.getByRole('button', { name: 'Rückgängig', exact: true }).click()
  await expect(target).toHaveCount(0)
})


test('rotated image pixels resize live and navigation discards an unfinished gesture @matrix', async ({ page }, testInfo) => {
  await page.addInitScript(() => localStorage.setItem('folkkit:locale', 'de'))
  await page.goto('/image')
  await page.getByLabel('Bild auswählen', { exact: true }).setInputFiles(imageFixture())
  await expect(page.getByText('300 × 200 px', { exact: true })).toBeVisible()
  await page.getByLabel('Wasserzeichen hinzufügen', { exact: true }).setInputFiles(watermarkFixture())
  await expect(page.getByRole('button', { name: 'local-watermark.png auswählen', exact: true })).toBeVisible()
  await page.getByRole('button', { name: '90° nach rechts drehen', exact: true }).click()
  const canvas = page.locator('.image-canvas-stage canvas')
  await expect.poll(() => canvas.evaluate(node => [node.width, node.height])).toEqual([200, 300])
  const original = await canvas.evaluate(node => node.toDataURL())
  const width = page.getByLabel('Breite', { exact: true }), initialWidth = await width.inputValue()
  const handle = page.getByRole('button', { name: 'Elementgrösse ändern', exact: true })
  await revealImageControl(handle)
  const box = await handle.boundingBox(), stage = await page.locator('.image-canvas-stage').boundingBox()
  const x = box.x + box.width / 2, y = box.y + box.height / 2
  const touch = testInfo.project.name.includes('mobile') ? await page.context().newCDPSession(page) : null
  if (touch) {
    await touch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y, id: 1 }] })
    await touch.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + stage.width * .1, y: y + stage.height * .08, id: 1 }] })
  } else {
    await page.mouse.move(x, y); await page.mouse.down()
    await page.mouse.move(x + stage.width * .1, y + stage.height * .08, { steps: 6 })
  }
  try {
    await expect.poll(async () => await canvas.evaluate(node => node.toDataURL()) !== original).toBe(true)
    await expect(width).toHaveValue(initialWidth)
    // Keyboard navigation leaves the pointer gesture unfinished.
    const menu = page.getByRole('button', { name: 'Menü öffnen', exact: true })
    if (await menu.isVisible()) { await menu.focus(); await menu.press('Enter') }
    const link = page.locator('.site-nav:visible').getByRole('link', { name: 'Konvertieren', exact: true })
    await link.focus(); await link.press('Enter')
    await expect(page).toHaveURL(/\/convert$/)
    await page.goBack()
    await expect(page).toHaveURL(/\/image$/)
    await expect.poll(async () => await canvas.evaluate(node => node.toDataURL()) === original).toBe(true)
  } finally {
    if (touch) { await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await touch.detach() }
    else await page.mouse.up()
  }
  await expect(width).toHaveValue(initialWidth)
  const cropX = page.getByLabel('X-Position des Ausschnitts', { exact: true })
  const cropY = page.getByLabel('Y-Position des Ausschnitts', { exact: true })
  const cropWidth = page.getByLabel('Breite des Ausschnitts', { exact: true })
  const cropHeight = page.getByLabel('Höhe des Ausschnitts', { exact: true })
  const cropBefore = await Promise.all([cropX, cropY, cropWidth, cropHeight].map(field => field.inputValue()))
  await page.getByRole('button', { name: 'Ausschnitt verschieben', exact: true }).click({ position: { x: 8, y: 8 } })
  await expect(cropX).toHaveValue(cropBefore[0])
  await expect(cropY).toHaveValue(cropBefore[1])
  await expect(cropWidth).toHaveValue(cropBefore[2])
  await expect(cropHeight).toHaveValue(cropBefore[3])
})


test('image export precedes settings and mobile controls use the available width @matrix', async ({ page }, testInfo) => {
  await page.addInitScript(() => localStorage.setItem('folkkit:locale', 'de'))
  await page.goto('/image')
  await page.getByLabel('Bild auswählen', { exact: true }).setInputFiles(imageFixture())
  const exportPanel = page.locator('.image-export-panel'), cropPanel = page.locator('.image-inspector details').first()
  await expect(exportPanel).toBeVisible()
  const exportBox = await exportPanel.boundingBox(), cropBox = await cropPanel.boundingBox()
  expect(exportBox.y + exportBox.height).toBeLessThanOrEqual(cropBox.y + 1)
  if (testInfo.project.name.includes('mobile')) {
    expect((await page.locator('.image-toolbar').boundingBox()).height).toBeLessThanOrEqual(160)
    for (const field of await page.locator('.image-inspector input[type="number"], .image-inspector select, .image-inspector textarea').all()) {
      expect(await field.evaluate(node => parseFloat(getComputedStyle(node).fontSize))).toBeGreaterThanOrEqual(16)
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
  expect(PNG.sync.read((await downloadImage(page, 'PNG herunterladen')).bytes)).toMatchObject({ width: 300, height: 200 })
})

test('image resize handles stay reachable at canvas edges and on tiny elements @matrix', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('folkkit:locale', 'de'))
  await page.goto('/image')
  await page.getByLabel('Bild auswählen', { exact: true }).setInputFiles(imageFixture())
  const stage = page.locator('.image-canvas-stage')
  async function handleBox(handle) {
    await revealImageControl(handle)
    const box = await handle.boundingBox(), canvas = await stage.boundingBox()
    expect(box.width).toBeGreaterThanOrEqual(44)
    expect(box.height).toBeGreaterThanOrEqual(44)
    expect(box.x).toBeGreaterThanOrEqual(canvas.x - 1)
    expect(box.y).toBeGreaterThanOrEqual(canvas.y - 1)
    expect(box.x + box.width).toBeLessThanOrEqual(canvas.x + canvas.width + 1)
    expect(box.y + box.height).toBeLessThanOrEqual(canvas.y + canvas.height + 1)
    expect(await handle.evaluate(node => {
      const box = node.getBoundingClientRect()
      return document.elementFromPoint(box.x + 6, box.y + 6) === node
    })).toBe(true)
    return box
  }
  const crop = page.getByRole('button', { name: 'Ausschnittsgrösse ändern', exact: true })
  const cropBox = await handleBox(crop)
  await page.mouse.move(cropBox.x + 6, cropBox.y + 6); await page.mouse.down()
  await page.mouse.move(cropBox.x - 14, cropBox.y - 14, { steps: 4 }); await page.mouse.up()
  expect(Number(await page.getByLabel('Breite des Ausschnitts', { exact: true }).inputValue())).toBeLessThan(300)
  await page.getByLabel('Textinhalt', { exact: true }).fill('Klein')
  await page.getByRole('button', { name: 'Text hinzufügen', exact: true }).click()
  const width = page.getByLabel('Breite', { exact: true })
  await width.fill('12'); await page.getByLabel('Höhe', { exact: true }).fill('12')
  await page.getByLabel('X-Position', { exact: true }).fill('0'); await page.getByLabel('Y-Position', { exact: true }).fill('0')
  const handle = page.getByRole('button', { name: 'Elementgrösse ändern', exact: true })
  const smallBox = await handleBox(handle)
  await page.mouse.move(smallBox.x + smallBox.width / 2, smallBox.y + smallBox.height / 2); await page.mouse.down()
  await page.mouse.move(smallBox.x + smallBox.width / 2 + 20, smallBox.y + smallBox.height / 2 + 20, { steps: 4 }); await page.mouse.up()
  expect(Number(await width.inputValue())).toBeGreaterThan(12)
  await page.getByRole('button', { name: 'Rückgängig', exact: true }).click()
  await expect(width).toHaveValue('12')
  await page.getByLabel('X-Position', { exact: true }).fill('288'); await page.getByLabel('Y-Position', { exact: true }).fill('188')
  await handleBox(handle)
})


test('small image elements and crop areas keep direct move separate from resize @matrix', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 })
  await page.addInitScript(() => localStorage.setItem('folkkit:locale', 'de'))
  await page.goto('/image')
  await page.getByLabel('Bild auswählen', { exact: true }).setInputFiles(imageFixture())
  async function dragBody(control, handle) {
    await centreImageControl(control)
    const box = await control.boundingBox(), grip = await handle.boundingBox()
    const radius = await handle.evaluate(node => Math.min(parseFloat(getComputedStyle(node, '::after').width), parseFloat(getComputedStyle(node, '::after').height)) / 2)
    const x = box.x + 1, y = box.y + 1
    expect(Math.hypot(x - grip.x - grip.width / 2, y - grip.y - grip.height / 2), 'Move starts outside the visible resize circle').toBeGreaterThan(radius + 1)
    await page.mouse.move(x, y); await page.mouse.down()
    await page.mouse.move(x + 20, y + 20, { steps: 4 }); await page.mouse.up()
  }
  const cropWidth = page.getByLabel('Breite des Ausschnitts', { exact: true }), cropHeight = page.getByLabel('Höhe des Ausschnitts', { exact: true })
  const cropX = page.getByLabel('X-Position des Ausschnitts', { exact: true }), cropY = page.getByLabel('Y-Position des Ausschnitts', { exact: true })
  await cropWidth.fill('24'); await cropHeight.fill('24'); await cropX.fill('100'); await cropY.fill('70')
  await dragBody(page.getByRole('button', { name: 'Ausschnitt verschieben', exact: true }), page.getByRole('button', { name: 'Ausschnittsgrösse ändern', exact: true }))
  await expect(cropWidth).toHaveValue('24'); await expect(cropHeight).toHaveValue('24')
  expect(Number(await cropX.inputValue())).toBeGreaterThan(100); expect(Number(await cropY.inputValue())).toBeGreaterThan(70)
  await page.getByLabel('Textinhalt', { exact: true }).fill('Klein')
  await page.getByRole('button', { name: 'Text hinzufügen', exact: true }).click()
  const width = page.getByLabel('Breite', { exact: true }), height = page.getByLabel('Höhe', { exact: true })
  const x = page.getByLabel('X-Position', { exact: true }), y = page.getByLabel('Y-Position', { exact: true })
  await width.fill('12'); await height.fill('12'); await x.fill('100'); await y.fill('70')
  await dragBody(page.getByRole('button', { name: 'Klein auswählen', exact: true }), page.getByRole('button', { name: 'Elementgrösse ändern', exact: true }))
  await expect(width).toHaveValue('12'); await expect(height).toHaveValue('12')
  expect(Number(await x.inputValue())).toBeGreaterThan(100); expect(Number(await y.inputValue())).toBeGreaterThan(70)
  await page.getByRole('button', { name: 'Rückgängig', exact: true }).click()
  await expect(x).toHaveValue('100'); await expect(y).toHaveValue('70')
  const handle = page.getByRole('button', { name: 'Elementgrösse ändern', exact: true })
  await revealImageControl(handle)
  const box = await handle.boundingBox()
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await page.mouse.down()
  await page.mouse.move(box.x + box.width / 2 + 20, box.y + box.height / 2 + 20, { steps: 4 }); await page.mouse.up()
  expect(Number(await width.inputValue())).toBeGreaterThan(12); await expect(x).toHaveValue('100')
  await page.getByRole('button', { name: 'Rückgängig', exact: true }).click(); await expect(width).toHaveValue('12')
})


test('image layer order and duplicates preserve exported pixels, style and undo @matrix', async ({ page }, info) => {
  const requests = []
  page.on('request', request => requests.push(request))
  await page.goto('/image')
  await page.getByLabel('Bild auswählen', { exact: true }).setInputFiles(imageFixture())
  await expect(page.getByText('300 × 200 px', { exact: true })).toBeVisible()
  const list = page.locator('.image-element-list')
  for (const [name, color] of [['red.png', [255, 0, 0, 255]], ['blue.png', [0, 0, 255, 255]]]) {
    const png = new PNG({ width: 32, height: 32 })
    for (let offset = 0; offset < png.data.length; offset += 4) png.data.set(color, offset)
    await page.getByLabel('Wasserzeichen hinzufügen', { exact: true }).setInputFiles({ name, mimeType: 'image/png', buffer: PNG.sync.write(png) })
    await expect(list.getByRole('button', { name: `Wasserzeichen: ${name}`, exact: true })).toBeVisible()
    for (const [field, value] of [['width', 64], ['height', 64], ['x', 30], ['y', 30]]) await page.locator(`[name="element-${field}"]`).fill(String(value))
    const opacity = page.getByRole('slider', { name: 'Deckkraft', exact: true })
    await opacity.focus(); await page.keyboard.press('End')
    await expect(opacity).toHaveValue('100')
  }
  await expect(list.getByRole('button').first()).toHaveText('Wasserzeichen: blue.png')
  let output = PNG.sync.read((await downloadImage(page, 'PNG herunterladen')).bytes)
  expect(pixelAt(output, 50, 50)).toEqual([0, 0, 255, 255])
  await list.getByRole('button', { name: 'Wasserzeichen: red.png', exact: true }).click()
  const forward = page.getByRole('button', { name: 'Nach vorne', exact: true })
  await forward.focus(); await page.keyboard.press('Enter')
  await expect(forward).toBeFocused()
  await expect(forward).toHaveAttribute('aria-disabled', 'true')
  await page.keyboard.press('Enter')
  output = PNG.sync.read((await downloadImage(page, 'PNG herunterladen')).bytes)
  expect(pixelAt(output, 50, 50)).toEqual([255, 0, 0, 255])
  await expect(list.getByRole('button').first()).toHaveText('Wasserzeichen: red.png')
  await page.getByRole('button', { name: 'Rückgängig', exact: true }).click()
  output = PNG.sync.read((await downloadImage(page, 'PNG herunterladen')).bytes)
  expect(pixelAt(output, 50, 50)).toEqual([0, 0, 255, 255])
  await page.getByRole('button', { name: 'Wiederholen', exact: true }).click()
  await list.getByRole('button', { name: 'Wasserzeichen: blue.png', exact: true }).click()
  const duplicate = page.getByRole('button', { name: 'Auswahl duplizieren', exact: true })
  await duplicate.focus(); await page.keyboard.press('Enter')
  await expect(duplicate).toBeFocused()
  await expect(list.getByRole('button')).toHaveCount(3)
  await expect(page.locator('[name="element-x"]')).toHaveValue('46')
  await expect(page.locator('[name="element-y"]')).toHaveValue('46')
  await expect(page.locator('[name="element-width"]')).toHaveValue('64')
  await expect(page.getByRole('slider', { name: 'Deckkraft', exact: true })).toHaveValue('100')
  output = PNG.sync.read((await downloadImage(page, 'PNG herunterladen')).bytes)
  expect(pixelAt(output, 50, 50)).toEqual([0, 0, 255, 255])
  expect(pixelAt(output, 100, 100)).toEqual([0, 0, 255, 255])
  expect(pixelAt(output, 35, 35)).toEqual([255, 0, 0, 255])
  expect(pixelAt(output, 20, 100)).toEqual(sourcePixel(20, 100))
  await page.getByRole('button', { name: 'Rückgängig', exact: true }).click()
  await expect(list.getByRole('button')).toHaveCount(2)
  await page.getByRole('button', { name: 'Wiederholen', exact: true }).click()
  await expect(list.getByRole('button')).toHaveCount(3)
  await page.getByRole('button', { name: 'English', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Duplicate selection', exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Bring forward', exact: true })).toHaveAttribute('aria-disabled', 'true')
  expect((await new AxeBuilder({ page }).include('.image-editor').analyze()).violations).toEqual([])
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false)
  expect(requests.every(request => request.method() === 'GET' && !request.postData())).toBe(true)
  expect(requests.filter(request => /^https?:/.test(request.url())).every(request => new URL(request.url()).origin === new URL(page.url()).origin)).toBe(true)
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({ path: info.outputPath('image-layer-controls.png'), fullPage: true })
})
