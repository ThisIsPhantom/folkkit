import { expect, test } from '@playwright/test'

test('loads the converter shell at the local base URL', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Convert Everything' })).toBeVisible()
  await expect(page.getByRole('textbox', { name: 'Input text' })).toBeVisible()
})
