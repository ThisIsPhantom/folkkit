import { expect, test } from '@playwright/test'

test('loads the Folkkit shell at the local base URL', async ({ page }) => {
  await page.goto('./')

  await expect(page.getByRole('heading', { name: 'Was möchtest du machen?' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Datei konvertieren' })).toBeVisible()
})
