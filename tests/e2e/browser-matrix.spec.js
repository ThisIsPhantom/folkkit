import { expect, test } from '@playwright/test'
import { fixtureFile, onePagePdfBase64 } from '../fixtures/coreFixtures'

test('@matrix runs DE and EN core journeys in every supported browser profile', async ({ page }) => {
  await page.goto('./workspace?from=text&to=base64')
  await page.getByRole('textbox', { name: 'Eingabetext' }).fill('Folkkit')
  await expect(page.getByRole('textbox', { name: 'Konvertierungsergebnis' })).toHaveValue('Rm9sa2tpdA==')

  await page.goto('./workspace?tool=text-to-qr')
  await page.getByRole('textbox', { name: 'Werkzeugeingabe' }).fill('Folkkit matrix')
  await expect(page.getByRole('link', { name: 'Herunterladen' })).toBeVisible()

  await page.goto('./workspace?tool=pdf-page-count')
  await page.getByLabel('Datei auswählen').setInputFiles(fixtureFile('one.pdf', 'application/pdf', onePagePdfBase64))
  await expect(page.locator('.workspace-text-result')).toContainText('1 page')

  await page.getByRole('button', { name: 'English' }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.getByRole('button', { name: 'English' })).toHaveAttribute('aria-pressed', 'true')
  await page.goto('./workspace?from=base64&to=text')
  await page.getByRole('textbox', { name: 'Input text' }).fill('Rm9sa2tpdA==')
  await expect(page.getByRole('textbox', { name: 'Conversion result' })).toHaveValue('Folkkit')
})
