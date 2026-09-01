import { readFile } from 'node:fs/promises'
import { expect, test } from '@playwright/test'

test('generates a local QR image download from text', async ({ page }) => {
  await page.goto('./workspace?tool=text-to-qr')
  await page.getByRole('textbox', { name: 'Werkzeugeingabe' }).fill('Folkkit QR fixture')

  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('link', { name: 'Herunterladen' }).click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toBe('folkkit-qr.svg')
  expect(await readFile(await download.path(), 'utf8')).toContain('<svg')
})

test('keeps the QR reader hidden when a direct URL requests it', async ({ page }) => {
  await page.goto('./workspace?tool=qr-to-text')

  await expect(page.getByRole('heading', { name: 'Datei lokal bearbeiten' })).toBeVisible()
  await expect(page.getByText('QR-Code lesen', { exact: true })).toHaveCount(0)
  await expect(page.getByLabel('Datei auswählen')).toHaveCount(0)
})
