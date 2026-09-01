import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { Buffer } from 'node:buffer'

async function expectNoAxeViolations(page, label) {
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations, `${label}: ${JSON.stringify(results.violations, null, 2)}`).toEqual([])
}

test('home, catalog, core tools, consent and legal routes have no automated axe violations', async ({ page }) => {
  const routes = [
    ['./', 'home'],
    ['./tools', 'catalog'],
    ['./workspace?tool=merge-pdf', 'PDF'],
    ['./workspace?tool=text-to-qr', 'QR'],
    ['./workspace?from=text&to=base64', 'conversion and history consent'],
    ['./privacy', 'privacy'],
    ['./licenses', 'licences'],
  ]
  for (const [route, label] of routes) {
    await page.goto(route)
    await expectNoAxeViolations(page, label)
  }
})

test('error state remains accessible and content-free', async ({ page }) => {
  await page.goto('./workspace?tool=pdf-page-count')
  await page.getByLabel('Datei auswählen').setInputFiles({ name: 'PRIVATE-error.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-corrupt') })
  await expect(page.getByRole('alert')).toHaveText('Die Datei ist beschädigt oder ungültig.')
  await expectNoAxeViolations(page, 'error state')
})

test('keyboard, reduced motion and 200 percent zoom keep the core conversion operable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('./workspace?from=text&to=base64')
  await page.keyboard.press('Tab')
  await expect(page.locator(':focus')).not.toHaveJSProperty('tagName', 'BODY')
  await page.getByRole('textbox', { name: 'Input text' }).focus()
  await page.keyboard.type('Folkkit')
  await expect(page.getByRole('textbox', { name: 'Conversion output' })).toHaveValue('Rm9sa2tpdA==')
  expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true)
  await page.evaluate(() => { document.documentElement.style.zoom = '2' })
  await expect(page.getByRole('textbox', { name: 'Input text' })).toBeVisible()
  await expect(page.getByRole('textbox', { name: 'Conversion output' })).toBeVisible()
})
