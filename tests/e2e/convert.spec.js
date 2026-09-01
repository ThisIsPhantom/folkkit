import { expect, test } from '@playwright/test'

test('converts text to base64 and restores plain text from base64', async ({ page }) => {
  await page.goto('./workspace?from=text&to=base64')
  await page.getByRole('textbox', { name: 'Eingabetext' }).fill('Folkkit')
  await expect(page.getByRole('textbox', { name: 'Konvertierungsergebnis' })).toHaveValue('Rm9sa2tpdA==')

  await page.goto('./workspace?from=base64&to=text')
  await page.getByRole('textbox', { name: 'Eingabetext' }).fill('Rm9sa2tpdA==')
  await expect(page.getByRole('textbox', { name: 'Konvertierungsergebnis' })).toHaveValue('Folkkit')
})
