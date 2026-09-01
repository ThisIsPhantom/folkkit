import { readFile } from 'node:fs/promises'
import { expect, test } from '@playwright/test'
import { fixtureFile, onePixelJpegBase64, onePixelPngBase64 } from '../fixtures/coreFixtures'

test('shows the derived released count and excludes hidden entries', async ({ page }) => {
  await page.goto('./tools')

  await expect(page.getByText('63 Werkzeuge')).toBeVisible()
  await expect(page.locator('.catalog-list > li')).toHaveCount(63)
  await expect(page.getByText('Random Password', { exact: true })).toHaveCount(0)
})

test('loads only the owning converter module after released metadata selection', async ({ page }) => {
  const requests = []
  page.on('request', request => requests.push(request.url()))

  await page.goto('./?tool=base64-encode')
  await page.getByRole('textbox', { name: 'Tool input text' }).fill('Folkkit')
  await expect(page.getByRole('textbox', { name: 'Tool output text' })).toHaveValue('Rm9sa2tpdA==')

  expect(requests.some(url => url.includes('/src/converters/text.js'))).toBe(true)
  expect(requests.some(url => url.includes('/src/converters/data.js'))).toBe(false)
  expect(requests.some(url => url.includes('/src/converters/media.js'))).toBe(false)
})

test('converts a real PNG fixture to a runtime-owned JPEG download', async ({ page }) => {
  const png = fixtureFile('catalog-private.png', 'image/png', onePixelPngBase64)
  await page.goto('./?tool=png-to-jpg')

  await page.getByLabel('Datei auswählen').setInputFiles(png)
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('link', { name: 'Herunterladen' }).click()
  const download = await downloadPromise
  const bytes = await readFile(await download.path())

  expect(download.suggestedFilename()).toBe('catalog-private.jpg')
  expect([...bytes.subarray(0, 3)]).toEqual([0xff, 0xd8, 0xff])
})

test('converts a real JPEG fixture to a runtime-owned PNG download', async ({ page }) => {
  const jpeg = fixtureFile('catalog-private.jpg', 'image/jpeg', onePixelJpegBase64)
  await page.goto('./?tool=jpg-to-png')

  await page.getByLabel('Datei auswählen').setInputFiles(jpeg)
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('link', { name: 'Herunterladen' }).click()
  const download = await downloadPromise
  const bytes = await readFile(await download.path())

  expect(download.suggestedFilename()).toBe('catalog-private.png')
  expect([...bytes.subarray(0, 8)]).toEqual([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
})
