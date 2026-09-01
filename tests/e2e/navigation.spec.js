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

test('keeps format selection synchronized across URL, reload, back and forward without content', async ({ page }) => {
  await page.goto('./workspace?from=text&to=base64')

  await page.locator('.picker-trigger').first().click()
  await page.locator('[data-picker-item]').filter({ hasText: /^Base64$/ }).first().click()
  await expect(page).toHaveURL(/\/workspace\?from=base64&to=text$/)

  await page.goBack()
  await expect(page).toHaveURL(/\/workspace\?from=text&to=base64$/)

  await page.goForward()
  await expect(page).toHaveURL(/\/workspace\?from=base64&to=text$/)

  await page.reload()
  await expect(page.locator('.picker-trigger').first()).toContainText('Base64')
  expect(page.url()).not.toContain('input=')
  expect(page.url()).not.toContain('output=')
})

test('history reuse changes only URL identifiers and does not survive reload as content', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('folkkit:history-enabled', 'true')
    localStorage.setItem('folkkit:content-history', JSON.stringify([{
      from: 'base64',
      to: 'text',
      input: 'UFJJVkFURQ==',
      output: 'PRIVATE',
      timestamp: Date.now(),
    }]))
  })
  await page.goto('./workspace?from=text&to=base64')

  await page.getByRole('button', { name: 'Wiederverwenden', exact: true }).click()
  await expect(page).toHaveURL(/\/workspace\?from=base64&to=text$/)
  await expect(page.getByRole('textbox', { name: 'Eingabetext' })).toHaveValue('UFJJVkFURQ==')
  expect(page.url()).not.toContain('UFJJVkFURQ')

  await page.reload()
  await expect(page.getByRole('textbox', { name: 'Eingabetext' })).toHaveValue('')
  await expect(page).toHaveURL(/\/workspace\?from=base64&to=text$/)
})

test('global image drops use released converters or show an honest unsupported state', async ({ page }) => {
  await page.goto('./workspace?from=text&to=base64')

  await page.evaluate(() => {
    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(new File(['png'], 'photo.png', { type: 'image/png' }))
    document.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer }))
  })
  await expect(page).toHaveURL(/\/workspace\?tool=png-to-jpg$/)

  await page.goto('./workspace?from=text&to=base64')
  await page.evaluate(() => {
    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(new File(['svg'], 'graphic.svg', { type: 'image/svg+xml' }))
    document.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer }))
  })
  await expect(page.getByRole('alert')).toHaveText('Dieser Dateityp kann hier nicht automatisch geöffnet werden. Wähle ein freigegebenes Werkzeug.')
  await expect(page).toHaveURL(/\/workspace\?from=text&to=base64$/)
})
