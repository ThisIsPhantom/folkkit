import { readFile } from 'node:fs/promises'
import { expect, test } from '@playwright/test'

test('generates a local QR image download from text', async ({ page }) => {
  await page.goto('./workspace?tool=text-to-qr')
  await page.getByRole('textbox', { name: 'Inhalt', exact: true }).fill('Folkkit QR fixture')

  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'SVG herunterladen', exact: true }).click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toBe('folkkit-qr.svg')
  expect(await readFile(await download.path(), 'utf8')).toContain('<svg')
})

test('opens the implemented QR reader through its legacy URL', async ({ page }) => {
  await page.goto('./workspace?tool=qr-to-text')

  await expect(page).toHaveURL(/\/qr\?mode=read$/)
  await expect(page.getByRole('heading', { name: 'QR-Code lesen', exact: true })).toBeVisible()
  await expect(page.getByLabel('QR-Bild auswählen', { exact: true })).toBeAttached()
  await expect(page.getByRole('textbox', { name: 'Werkzeugeingabe', exact: true })).toHaveCount(0)
})
