import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { fixtureFile, onePixelPngBase64 } from '../fixtures/coreFixtures.js'

test.setTimeout(60000)

async function navigate(page, label) {
  const menu = page.getByRole('button', { name: 'Menü öffnen', exact: true })
  if (await menu.isVisible()) await menu.click()
  await page.getByRole('link', { name: label, exact: true }).click()
}

test('keeps real QR content, converter files and calculator values across studio navigation @matrix', async ({ page }) => {
  await page.goto('/qr')
  await page.getByRole('textbox', { name: 'Inhalt', exact: true }).fill('Folkkit session fixture')
  await expect(page.getByRole('button', { name: 'PNG herunterladen', exact: true })).toBeEnabled()
  await navigate(page, 'Konvertieren')
  await page.getByLabel('Dateien auswählen', { exact: true }).setInputFiles(fixtureFile('session-image.png', 'image/png', onePixelPngBase64))
  await expect(page.getByText('Bereit', { exact: true })).toBeVisible()
  await navigate(page, 'Rechner')
  await page.getByRole('textbox', { name: 'Prozentsatz', exact: true }).fill('20')
  await page.getByLabel('Grundwert', { exact: true }).fill('150')
  await expect(page.getByTestId('result-result')).toHaveText('30')
  await navigate(page, 'QR-Codes')
  await expect(page.getByRole('textbox', { name: 'Inhalt', exact: true })).toHaveValue('Folkkit session fixture')
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
  await expect(page.getByRole('textbox', { name: 'Grundwert', exact: true })).toHaveCount(0)
  await navigate(page, 'Konvertieren')
  await expect(page.locator('.converter-file-name')).toContainText('session-image.png')
  await expect(page.locator('.converter-files > li')).toHaveCount(1)
  await page.getByRole('button', { name: 'Dateien entfernen', exact: true }).click()
  await expect(page.locator('.converter-files > li')).toHaveCount(0)
  await navigate(page, 'Rechner')
  await expect(page.getByLabel('Grundwert', { exact: true })).toHaveValue('150')
  const persisted = await page.evaluate(() => JSON.stringify({ local: { ...localStorage }, session: { ...sessionStorage } }))
  expect(persisted).not.toMatch(/Folkkit session fixture|session-image\.png/)
})

test('calendar and duration forms stay accessible in mobile DE/EN and both themes @matrix', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/calculate?calculator=date')
  await expect(page.getByRole('combobox', { name: 'Rechner wählen', exact: true })).toBeVisible()
  await expect(page.getByRole('group', { name: 'Rechner wählen', exact: true })).toHaveCount(0)
  await page.getByLabel('Startdatum', { exact: true }).fill('2024-02-28')
  await page.getByLabel('Enddatum', { exact: true }).fill('2024-03-01')
  await expect(page.getByTestId('result-days')).toHaveText('2')
  await page.getByRole('combobox', { name: 'Berechnung', exact: true }).selectOption('add')
  await page.getByLabel('Anzahl Tage', { exact: true }).fill('-1')
  await expect(page.getByTestId('result-date')).toHaveText('2024-02-27')
  await page.getByRole('combobox', { name: 'Rechner wählen', exact: true }).selectOption('duration')
  await page.getByRole('button', { name: 'Beispiel', exact: true }).click()
  await expect(page.getByTestId('result-duration')).toHaveText('2:16:15')
  for (const locale of ['de', 'en']) {
    if (locale === 'en') await page.getByRole('button', { name: 'English', exact: true }).click()
    for (const theme of ['light', 'dark']) {
      const toggle = page.locator('.theme-button')
      if (await toggle.getAttribute('aria-pressed') !== String(theme === 'dark')) await toggle.click()
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1)
    }
  }
})

test('catalog search and favorites work with keyboard, reload and empty results @matrix', async ({ page }) => {
  await page.goto('/tools')
  const search = page.getByRole('searchbox', { name: 'Werkzeuge suchen', exact: true })
  await search.fill('JSON')
  await expect(page.locator('.catalog-list > li')).toHaveCount(5)
  await page.getByRole('button', { name: 'JSON formatieren zu Favoriten hinzufügen', exact: true }).focus()
  await page.keyboard.press('Enter')
  await page.getByRole('button', { name: 'Nur Favoriten', exact: true }).click()
  await expect(page.locator('.catalog-list > li')).toHaveCount(1)
  await page.reload()
  await page.getByRole('button', { name: 'Nur Favoriten', exact: true }).click()
  await expect(page.locator('.catalog-list > li')).toHaveCount(1)
  await expect(page.getByRole('button', { name: 'JSON formatieren aus Favoriten entfernen', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('combobox', { name: 'Kategorie', exact: true }).selectOption('image')
  await expect(page.getByRole('heading', { name: 'Keine passenden Werkzeuge', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Filter zurücksetzen', exact: true }).click()
  await expect(page.getByRole('status')).toHaveText('47 von 47 Werkzeugen')
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
})

test('copies a calculator result without units and exposes the optional formula', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/calculate')
  await page.getByRole('button', { name: 'Beispiel', exact: true }).click()
  await page.getByRole('button', { name: 'Ergebnis kopieren', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Ergebnis kopieren', exact: true })).toHaveText('Kopiert')
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('36')
  await expect(page.locator('.calc-formula')).not.toHaveAttribute('open', '')
  await page.locator('.calc-formula summary').click()
  await expect(page.locator('.calc-formula')).toHaveAttribute('open', '')
})

test('keeps mobile calculator selection focused for consecutive arrow-key choices @matrix', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/calculate')
  const selector = page.getByRole('combobox', { name: 'Rechner wählen', exact: true })
  await selector.focus()
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('Enter')
  await expect(selector).toHaveValue('rule-of-three')
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
  await expect(selector).toBeFocused()
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('Enter')
  await expect(selector).toHaveValue('pythagoras')
})

test('clears unconsented legacy content when opening a studio directly', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('folkkit:content-history', JSON.stringify([{ input: 'UNCONSENTED-STUDIO-FIXTURE' }]))
    localStorage.setItem('convert-everything-history', JSON.stringify([{ input: 'UNCONSENTED-STUDIO-FIXTURE' }]))
  })
  await page.goto('/calculate')
  await expect(page.getByRole('heading', { level: 1, name: 'Rechner', exact: true })).toBeVisible()
  const stored = await page.evaluate(() => ({ current: localStorage.getItem('folkkit:content-history'), legacy: localStorage.getItem('convert-everything-history') }))
  expect(stored).toEqual({ current: null, legacy: null })
})

test('an existing converter session honours the images-to-PDF catalog entry and history', async ({ page }) => {
  await page.goto('/convert?target=pdf')
  await page.getByLabel('Dateien auswählen', { exact: true }).setInputFiles([
    fixtureFile('route-one.png', 'image/png', onePixelPngBase64),
    fixtureFile('route-two.png', 'image/png', onePixelPngBase64),
  ])
  const combine = page.getByRole('checkbox', { name: 'Bilder in dieser Reihenfolge zu einem PDF verbinden', exact: true })
  await expect(combine).not.toBeChecked()
  await navigate(page, 'Weitere Werkzeuge')
  await page.getByRole('button', { name: 'Bilder in PDF öffnen', exact: true }).click()
  await expect(page).toHaveURL(/\/convert\?target=pdf&combine=1$/)
  await expect(combine).toBeChecked()
  await expect(page.locator('.converter-files > li')).toHaveCount(2)
  await page.goBack()
  await page.goBack()
  await expect(page).toHaveURL(/\/convert\?target=pdf$/)
  await expect(combine).not.toBeChecked()
  await expect(page.locator('.converter-files > li')).toHaveCount(2)
})
