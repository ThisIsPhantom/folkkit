import { expect, test } from '@playwright/test'

test('navigates the German shell, switches language, and restores routes', async ({ page }) => {
  await page.goto('./')

  await expect(page.locator('html')).toHaveAttribute('lang', 'de')
  await expect(page.getByRole('banner')).toBeVisible()
  await expect(page.getByRole('main')).toBeVisible()
  await expect(page.getByRole('contentinfo')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Zum Inhalt springen' })).toBeAttached()
  await expect(page.getByText('Deine Dateien bleiben in diesem Browser.')).toBeVisible()

  await page.getByRole('link', { name: 'Werkzeuge' }).click()
  await expect(page).toHaveURL(/\/tools$/)
  await expect(page.getByRole('heading', { name: 'Alle freigegebenen Werkzeuge' })).toBeVisible()

  await page.goBack()
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole('heading', { name: 'Dateien bearbeiten, ohne sie hochzuladen.' })).toBeVisible()

  await page.goForward()
  await expect(page).toHaveURL(/\/tools$/)

  await page.getByRole('button', { name: 'English' }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.getByRole('heading', { name: 'All released tools' })).toBeVisible()

  await page.getByRole('link', { name: 'Privacy' }).click()
  await expect(page).toHaveURL(/\/privacy$/)
  await expect(page.getByRole('heading', { name: 'Privacy' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Local file processing' })).toBeVisible()
})

test('keeps keyboard focus visible and exposes mobile navigation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('./')

  await page.keyboard.press('Tab')
  const skipLink = page.getByRole('link', { name: 'Zum Inhalt springen' })
  await expect(skipLink).toBeFocused()
  await expect(skipLink).toBeVisible()

  const menuButton = page.getByRole('button', { name: 'Menü öffnen' })
  await expect(menuButton).toBeVisible()
  await menuButton.click()
  await expect(page.getByRole('navigation', { name: 'Mobile Navigation' })).toBeVisible()
  await page.getByRole('link', { name: 'Werkzeuge' }).click()
  await expect(page).toHaveURL(/\/tools$/)
})

test('keeps the theme usable when reduced motion is requested', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('./')

  await page.getByRole('button', { name: 'Dunkles Design' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

  const transitionDuration = await page.getByRole('button', { name: 'Dunkles Design' }).evaluate((element) => (
    Number.parseFloat(getComputedStyle(element).transitionDuration)
  ))
  expect(transitionDuration).toBeLessThanOrEqual(0.00001)
})
