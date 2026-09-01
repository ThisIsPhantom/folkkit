import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { Buffer } from 'node:buffer'
import { fixtureFile, onePagePdfBase64 } from '../fixtures/coreFixtures'

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
  await page.getByRole('textbox', { name: 'Eingabetext' }).focus()
  await page.keyboard.type('Folkkit')
  await expect(page.getByRole('textbox', { name: 'Konvertierungsergebnis' })).toHaveValue('Rm9sa2tpdA==')
  expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true)
  await page.evaluate(() => { document.documentElement.style.zoom = '2' })
  await expect(page.getByRole('textbox', { name: 'Eingabetext' })).toBeVisible()
  await expect(page.getByRole('textbox', { name: 'Konvertierungsergebnis' })).toBeVisible()
})

test('tool picker exposes a localized combobox and restores trigger focus', async ({ page }) => {
  await page.goto('./workspace?from=text&to=base64')
  const germanTrigger = page.getByRole('button', { name: 'Eingabe auswählen: Text' })
  await germanTrigger.click()

  const germanSearch = page.getByRole('combobox', { name: 'Konvertierungen durchsuchen' })
  const listboxId = await germanSearch.getAttribute('aria-controls')
  await expect(germanSearch).toHaveAttribute('aria-expanded', 'true')
  await expect(page.locator(`[id="${listboxId}"]`)).toHaveRole('listbox')
  await germanSearch.fill('Base64')
  await expect(germanSearch).not.toHaveAttribute('aria-activedescendant', '')
  await expect(page.getByRole('option').first()).toHaveAttribute('aria-selected')
  await expectNoAxeViolations(page, 'German tool picker')

  await germanSearch.press('Enter')
  await expect(page).toHaveURL(/\/workspace\?from=base64&to=text$/)
  await expect(page.locator('.picker-trigger').first()).toBeFocused()

  await page.getByRole('button', { name: 'English' }).click()
  const englishTrigger = page.getByRole('button', { name: 'Choose input: Base64' })
  await englishTrigger.click()
  await expect(page.getByRole('combobox', { name: 'Search conversions' })).toBeFocused()
  await expectNoAxeViolations(page, 'English tool picker')
  await page.keyboard.press('Escape')
  await expect(englishTrigger).toBeFocused()
})

test('history uses separate 44 pixel actions and reveals remove on keyboard focus', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('folkkit:history-enabled', 'true')
    localStorage.setItem('folkkit:content-history', JSON.stringify([{
      from: 'text',
      to: 'base64',
      input: 'private input',
      output: 'cHJpdmF0ZQ==',
      timestamp: Date.now(),
    }]))
  })
  await page.goto('./workspace?from=text&to=base64')

  await expect(page.getByRole('list', { name: 'Letzte Konvertierungen' })).toBeVisible()
  await expect(page.getByRole('article')).toHaveCount(1)
  const actionButtons = page.getByRole('article').getByRole('button')
  await expect(actionButtons).toHaveCount(3)
  for (let index = 0; index < await actionButtons.count(); index += 1) {
    const box = await actionButtons.nth(index).boundingBox()
    expect(box.width).toBeGreaterThanOrEqual(44)
    expect(box.height).toBeGreaterThanOrEqual(44)
  }

  const remove = page.getByRole('button', { name: 'Aus Verlauf entfernen' })
  await remove.focus()
  await expect(remove).toBeFocused()
  await expect.poll(() => remove.evaluate(element => Number.parseFloat(getComputedStyle(element).opacity))).toBeGreaterThanOrEqual(0.65)
  await expectNoAxeViolations(page, 'history actions')
})

test('the primary file selector is a visible 44 pixel keyboard button with a focus ring', async ({ page }) => {
  await page.goto('./workspace?tool=merge-pdf')
  const chooseButton = page.getByRole('button', { name: 'PDF-Dateien auswählen' })
  const box = await chooseButton.boundingBox()
  expect(box.width).toBeGreaterThanOrEqual(44)
  expect(box.height).toBeGreaterThanOrEqual(44)

  await chooseButton.focus()
  await expect(chooseButton).toBeFocused()
  const focusStyle = await chooseButton.evaluate(element => ({
    style: getComputedStyle(element).outlineStyle,
    width: Number.parseFloat(getComputedStyle(element).outlineWidth),
  }))
  expect(focusStyle.style).not.toBe('none')
  expect(focusStyle.width).toBeGreaterThanOrEqual(2)

  const chooserPromise = page.waitForEvent('filechooser')
  await page.keyboard.press('Enter')
  const chooser = await chooserPromise
  await chooser.setFiles([
    fixtureFile('one.pdf', 'application/pdf', onePagePdfBase64),
    fixtureFile('two.pdf', 'application/pdf', onePagePdfBase64),
  ])
  await expect(page.getByText('one.pdf')).toBeVisible()
  await expect(page.getByText('two.pdf')).toBeVisible()
  await expectNoAxeViolations(page, 'keyboard file selector')
})

test('mobile text inputs keep a 16 pixel font size to avoid automatic zoom', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('./workspace?from=text&to=base64')
  await page.getByRole('button', { name: 'Eingabe auswählen: Text' }).click()
  await expect(page.getByRole('combobox', { name: 'Konvertierungen durchsuchen' })).toBeVisible()

  const workspaceFontSizes = await page.locator('textarea, input:not([type="file"]), select').evaluateAll(elements => (
    elements
      .filter(element => element.getClientRects().length > 0)
      .map(element => Number.parseFloat(getComputedStyle(element).fontSize))
  ))
  expect(workspaceFontSizes.length).toBeGreaterThan(0)
  expect(workspaceFontSizes.every(size => size >= 16)).toBe(true)

  await page.goto('./workspace?tool=pdf-split')
  const parameterInput = page.getByRole('textbox', { name: 'Werkzeugparameter' })
  await expect(parameterInput).toBeVisible()
  expect(await parameterInput.evaluate(element => Number.parseFloat(getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(16)
})
