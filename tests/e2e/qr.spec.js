import { readFile } from 'node:fs/promises'
import { expect, test } from '@playwright/test'
import { fixtureFile, qrPngBase64 } from '../fixtures/coreFixtures'

test('generates a local QR image download from text', async ({ page }) => {
  await page.goto('./workspace?tool=text-to-qr')
  await page.getByRole('textbox', { name: 'Tool input text' }).fill('Folkkit QR fixture')

  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('link', { name: 'Herunterladen' }).click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toBe('folkkit-qr.svg')
  expect(await readFile(await download.path(), 'utf8')).toContain('<svg')
})

test('reads the checked-in QR fixture where BarcodeDetector is supported', async ({ page }) => {
  await page.goto('./workspace?tool=qr-to-text')
  const supportsReader = await page.evaluate(() => (
    typeof globalThis.BarcodeDetector === 'function' && typeof globalThis.createImageBitmap === 'function'
  ))
  await page.getByLabel('Datei auswählen').setInputFiles(
    fixtureFile('folkkit-qr.png', 'image/png', qrPngBase64),
  )

  if (supportsReader) {
    await expect(page.getByText('Folkkit QR fixture')).toBeVisible()
  } else {
    await expect(page.getByRole('alert')).toContainText('QR-Codes können in diesem Browser nicht gelesen werden.')
  }
})
