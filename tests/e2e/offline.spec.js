import { expect, test } from '@playwright/test'
import { fixtureFile, onePagePdfBase64, secondOnePagePdfBase64, tinyWavFixture } from '../fixtures/coreFixtures'

async function installFromHome(page) {
  await page.goto('./')
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready
    if (!navigator.serviceWorker.controller) {
      await new Promise(resolve => navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true }))
    }
  })
}

test('opens the home shell offline after its first load', async ({ page, context }) => {
  await installFromHome(page)
  await context.setOffline(true)

  await page.goto('./')
  await expect(page.getByRole('heading', { name: 'Dateien bearbeiten, ohne sie hochzuladen.' })).toBeVisible()
})

test('runs core text, QR, and PDF workflows offline after the first load', async ({ page, context }) => {
  await installFromHome(page)
  await context.setOffline(true)

  await page.goto('./workspace?from=text&to=base64')
  await page.getByRole('textbox', { name: 'Input text' }).fill('Folkkit offline')
  await expect(page.getByRole('textbox', { name: 'Conversion output' })).toHaveValue('Rm9sa2tpdCBvZmZsaW5l')

  await page.goto('./workspace?tool=text-to-qr')
  await page.getByRole('textbox', { name: 'Tool input text' }).fill('Folkkit offline QR')
  await expect(page.getByRole('link', { name: 'Herunterladen' })).toHaveAttribute('href', /^blob:/)

  await page.goto('./workspace?tool=merge-pdf')
  await page.getByLabel('PDF-Dateien auswählen').setInputFiles([
    fixtureFile('offline-one.pdf', 'application/pdf', onePagePdfBase64),
    fixtureFile('offline-two.pdf', 'application/pdf', secondOnePagePdfBase64),
  ])
  await expect(page.getByRole('link', { name: 'Herunterladen' })).toHaveAttribute('href', /^blob:/)
})

test('identifies an uncached media module and offers recovery without claiming offline support', async ({ page, context }) => {
  await installFromHome(page)
  await context.setOffline(true)

  await page.goto('./workspace?tool=audio-to-mp3')
  await expect(page.getByRole('alert')).toContainText('Das Medienmodul ist offline noch nicht verfügbar.')
  await expect(page.getByRole('button', { name: 'Erneut versuchen' })).toBeVisible()

  await context.setOffline(false)
  await page.getByRole('button', { name: 'Erneut versuchen' }).click()
  await expect(page.getByLabel('Datei auswählen')).toBeVisible()
  await page.getByLabel('Datei auswählen').setInputFiles(tinyWavFixture('recovered.wav'))
})
