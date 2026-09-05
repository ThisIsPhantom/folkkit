import { readFile } from 'node:fs/promises'
import { Buffer } from 'node:buffer'
import { expect, test } from '@playwright/test'
import jsQR from 'jsqr'
import { PNG } from 'pngjs'

const LOGO_ACCEPT = 'image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp'
const WEBP_LOGOS = Object.freeze([
  {
    name: 'lossy-vp8.webp',
    base64: 'UklGRkYAAABXRUJQVlA4IDoAAABQAwCdASogABgAPm0ylUekIqIhKAgAgA2JZQB2APwAAIMoIAD+54v//+LORiOzzf//PTNeYP6aAAAA',
  },
  {
    name: 'lossless-vp8l.webp',
    base64: 'UklGRh4AAABXRUJQVlA4TBEAAAAvH8AFAAdQqPoWpf+BiOh/AAA=',
  },
])

function decodePng(buffer) {
  const png = PNG.sync.read(buffer)
  const result = jsQR(new Uint8ClampedArray(png.data), png.width, png.height, {
    inversionAttempts: 'attemptBoth',
  })
  return { png, value: result?.data || null }
}

function makeLogoPng() {
  const png = new PNG({ width: 160, height: 96 })
  for (let y = 0; y < png.height; y += 1) {
    for (let x = 0; x < png.width; x += 1) {
      const offset = (y * png.width + x) * 4
      const centre = x > 48 && x < 112 && y > 22 && y < 74
      png.data[offset] = centre ? 255 : 182
      png.data[offset + 1] = centre ? 250 : 111
      png.data[offset + 2] = centre ? 243 : 74
      png.data[offset + 3] = 255
    }
  }
  return PNG.sync.write(png)
}

async function downloadFrom(page, name) {
  const pending = page.waitForEvent('download')
  await page.getByRole('button', { name }).click()
  const download = await pending
  return {
    filename: download.suggestedFilename(),
    buffer: await readFile(await download.path()),
  }
}

async function waitForPreview(page) {
  await expect(page.getByRole('img', { name: 'QR-Code-Vorschau' })).toBeVisible()
  await expect(page.locator('.qr-preview-frame')).toHaveAttribute('aria-busy', 'false')
}

async function rasterizeSvg(page, svgText) {
  const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svgText).toString('base64')}`
  await page.setContent(`<main><img id="qr-export" alt="QR export" src="${dataUrl}" width="512" height="512"></main>`)
  const image = page.locator('#qr-export')
  await expect(image).toBeVisible()
  return image.screenshot()
}

test('exports a styled PNG that independently decodes and keeps a white output background', async ({ page }) => {
  const payload = 'https://folkkit.test/qr/styled'
  await page.goto('./qr')
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'))
  await page.getByRole('textbox', { name: 'Inhalt' }).fill(payload)
  const stylePresets = [
    { dots: 'square', frame: 'square', corner: 'square' },
    { dots: 'rounded', frame: 'extra-rounded', corner: 'dot' },
    { dots: 'extra-rounded', frame: 'dot', corner: 'square' },
  ]
  for (const preset of stylePresets) {
    await page.getByRole('tab', { name: 'Design' }).click()
    await page.getByLabel('Modulstil').selectOption(preset.dots)
    await page.getByLabel('Eckrahmen').selectOption(preset.frame)
    await page.getByLabel('Eckpunkt').selectOption(preset.corner)
    await waitForPreview(page)
    const download = await downloadFrom(page, 'PNG herunterladen')
    const decoded = decodePng(download.buffer)
    expect(download.filename).toBe('folkkit-qr.png')
    expect(decoded.value, `Unreadable preset: ${JSON.stringify(preset)}`).toBe(payload)
    expect(Array.from(decoded.png.data.subarray(0, 4))).toEqual([255, 255, 255, 255])
  }
})

test('colour presets update the controls and exported pixels @matrix', async ({ page }) => {
  const payload = 'Folkkit Farbpalette'
  await page.goto('./qr')
  await page.getByRole('textbox', { name: 'Inhalt', exact: true }).fill(payload)
  await page.getByRole('tab', { name: 'Design' }).click()
  const blue = page.getByRole('button', { name: 'Blau als Vordergrund wählen', exact: true })
  await blue.click()
  await page.getByRole('button', { name: 'Mint als Hintergrund wählen', exact: true }).click()
  await expect(blue).toHaveAttribute('aria-pressed', 'true')
  const bounds = await blue.boundingBox()
  expect(Math.min(bounds.width, bounds.height)).toBeGreaterThanOrEqual(44)
  await waitForPreview(page)
  const { png, value } = decodePng((await downloadFrom(page, 'PNG herunterladen')).buffer)
  expect(value).toBe(payload)
  expect(Array.from(png.data.subarray(0, 4))).toEqual([236, 253, 245, 255])
  let bluePixels = 0
  for (let offset = 0; offset < png.data.length; offset += 4) {
    if (png.data[offset] === 29 && png.data[offset + 1] === 78 && png.data[offset + 2] === 216) bluePixels++
  }
  expect(bluePixels).toBeGreaterThan(100)
})

test('embeds a cropped logo and independently decodes both PNG and SVG exports', async ({ page }) => {
  const payload = 'Folkkit QR logo fixture 2026'
  await page.goto('./qr')
  await page.getByRole('textbox', { name: 'Inhalt' }).fill(payload)
  await page.getByRole('tab', { name: 'Logo' }).click()
  const logoInput = page.getByLabel('Logo auswählen')
  await expect(logoInput).toHaveAttribute('accept', LOGO_ACCEPT)
  await logoInput.setInputFiles({ name: 'folkkit-logo.png', mimeType: 'image/png', buffer: makeLogoPng() })
  await expect(page.getByText(/Fehlerkorrektur H/).first()).toBeVisible()
  await page.getByLabel('Logogrösse').fill('18')
  await page.getByLabel('Ausschnitt vergrössern').fill('1.4')
  const cropControl = page.getByRole('group', { name: 'Logo-Ausschnitt verschieben' })
  await cropControl.focus()
  await cropControl.press('ArrowRight')
  await expect(page.getByRole('button', { name: 'Zentrieren' })).toBeEnabled()
  await page.getByRole('button', { name: 'Zentrieren' }).click()
  await expect(page.getByLabel('Ausschnitt vergrössern')).toHaveValue('1.4')
  await expect(page.getByRole('button', { name: 'Zentrieren' })).toBeDisabled()

  const cropBounds = await cropControl.boundingBox()
  if (!cropBounds) throw new Error('Crop control has no bounds')
  await page.mouse.move(cropBounds.x + cropBounds.width / 2, cropBounds.y + cropBounds.height / 2)
  await page.mouse.down()
  await page.mouse.move(cropBounds.x + cropBounds.width * 0.75, cropBounds.y + cropBounds.height / 2)
  await page.mouse.up()
  await expect(page.getByRole('button', { name: 'Zentrieren' })).toBeEnabled()

  const stylePresets = [
    { dots: 'square', frame: 'square', corner: 'square' },
    { dots: 'rounded', frame: 'extra-rounded', corner: 'dot' },
    { dots: 'extra-rounded', frame: 'dot', corner: 'square' },
  ]
  for (const preset of stylePresets) {
    await page.getByRole('tab', { name: 'Design' }).click()
    await page.getByLabel('Modulstil').selectOption(preset.dots)
    await page.getByLabel('Eckrahmen').selectOption(preset.frame)
    await page.getByLabel('Eckpunkt').selectOption(preset.corner)
    await waitForPreview(page)
    const pngDownload = await downloadFrom(page, 'PNG herunterladen')
    expect(decodePng(pngDownload.buffer).value, `Unreadable preset: ${JSON.stringify(preset)}`).toBe(payload)
  }

  await page.getByRole('tab', { name: 'Logo' }).click()
  await page.getByRole('button', { name: 'Zentrieren' }).click()
  await expect(page.getByLabel('Ausschnitt vergrössern')).toHaveValue('1.4')
  await waitForPreview(page)
  const svgDownload = await downloadFrom(page, 'SVG herunterladen')
  const svgText = svgDownload.buffer.toString('utf8')
  expect(svgDownload.filename).toBe('folkkit-qr.svg')
  expect(svgText).toMatch(/<image\b[^>]+(?:href|xlink:href)="data:image\/png;base64,/)
  expect(svgText).not.toMatch(/(?:href|xlink:href)="(?:https?:|blob:)/)
  const rasterizedSvg = await rasterizeSvg(page, svgText)
  expect(decodePng(rasterizedSvg).value).toBe(payload)
})

test('preserves UTF-8 content exactly in independently decoded PNG and SVG exports', async ({ page }) => {
  const payloads = [
    'Grüsse für Jörg',
    '漢字 😀',
    'Text, Zürich, 漢字 und 😀',
  ]
  await page.goto('./qr')
  const input = page.getByRole('textbox', { name: 'Inhalt' })
  for (const payload of payloads) {
    await input.fill(payload)
    await waitForPreview(page)
    const pngDownload = await downloadFrom(page, 'PNG herunterladen')
    expect(decodePng(pngDownload.buffer).value).toBe(payload)

    const svgDownload = await downloadFrom(page, 'SVG herunterladen')
    const svgText = svgDownload.buffer.toString('utf8')
    const rasterizedSvg = await rasterizeSvg(page, svgText)
    expect(decodePng(rasterizedSvg).value).toBe(payload)
    await page.goto('./qr')
  }
})

test('accepts and embeds actual VP8 and VP8L WebP logos', async ({ page }) => {
  const payload = 'Folkkit WebP logo fixture'
  await page.goto('./qr')
  await page.getByRole('textbox', { name: 'Inhalt' }).fill(payload)
  await page.getByRole('tab', { name: 'Logo' }).click()
  const logoInput = page.getByLabel('Logo auswählen')

  for (const fixture of WEBP_LOGOS) {
    await logoInput.setInputFiles({
      name: fixture.name,
      mimeType: 'image/webp',
      buffer: Buffer.from(fixture.base64, 'base64'),
    })
    await expect(page.getByText(`Ausgewählt: ${fixture.name}`)).toBeVisible()
    await waitForPreview(page)
    const download = await downloadFrom(page, 'PNG herunterladen')
    expect(decodePng(download.buffer).value).toBe(payload)
  }
})

test('rejects malformed and oversized logos before changing the preview', async ({ page }) => {
  await page.goto('./qr')
  await page.getByRole('textbox', { name: 'Inhalt' }).fill('Folkkit validation fixture')
  await waitForPreview(page)
  const previewBefore = await page.getByRole('img', { name: 'QR-Code-Vorschau' }).getAttribute('src')
  await page.getByRole('tab', { name: 'Logo' }).click()

  const logoInput = page.getByLabel('Logo auswählen')
  await logoInput.setInputFiles({ name: 'malformed.png', mimeType: 'image/png', buffer: Buffer.from([1, 2, 3]) })
  await expect(page.getByRole('alert')).toContainText('kein gültiges PNG-, JPEG- oder WebP-Bild')
  expect(await page.getByRole('img', { name: 'QR-Code-Vorschau' }).getAttribute('src')).toBe(previewBefore)

  await logoInput.setInputFiles({
    name: 'oversized.png',
    mimeType: 'image/png',
    buffer: Buffer.alloc((4 * 1024 * 1024) + 1),
  })
  await expect(page.getByRole('alert')).toContainText('Das Logo ist zu gross')
})

test('revokes the generated preview when the designer is reset', async ({ page }) => {
  await page.addInitScript(() => {
    const createObjectURL = URL.createObjectURL.bind(URL)
    const revokeObjectURL = URL.revokeObjectURL.bind(URL)
    window.__qrRevokedUrls = []
    URL.createObjectURL = blob => createObjectURL(blob)
    URL.revokeObjectURL = (url) => {
      window.__qrRevokedUrls.push(url)
      revokeObjectURL(url)
    }
  })
  await page.goto('./qr')
  await page.getByRole('textbox', { name: 'Inhalt' }).fill('Folkkit cleanup fixture')
  await waitForPreview(page)
  const previewUrl = await page.getByRole('img', { name: 'QR-Code-Vorschau' }).getAttribute('src')

  await page.getByRole('button', { name: 'Zurücksetzen' }).click()
  await expect(page.getByRole('img', { name: 'QR-Code-Vorschau' })).toHaveCount(0)
  expect(await page.evaluate(url => window.__qrRevokedUrls.includes(url), previewUrl)).toBe(true)
  await expect(page.getByRole('button', { name: 'PNG herunterladen' })).toBeDisabled()
})

test('@matrix keeps the QR controls keyboard-operable without horizontal page overflow', async ({ page }) => {
  await page.goto('./qr')
  const contentTab = page.getByRole('tab', { name: 'Inhalt' })
  await contentTab.focus()
  await contentTab.press('ArrowRight')
  await expect(page.getByRole('tab', { name: 'Design' })).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByRole('tab', { name: 'Design' })).toBeFocused()
  await page.getByRole('tab', { name: 'Design' }).press('End')
  await expect(page.getByRole('tab', { name: 'Logo' })).toBeFocused()

  const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  expect(horizontalOverflow).toBeLessThanOrEqual(1)
})
