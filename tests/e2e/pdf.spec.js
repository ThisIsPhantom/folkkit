import { expect, test } from '@playwright/test'
import { PDFDocument } from 'pdf-lib'
import { fixtureFile, onePagePdfBase64, secondOnePagePdfBase64 } from '../fixtures/coreFixtures'
import { downloadFromButton, openOnePagePdfFixtures } from './helpers/studioJourneys.js'

test('merges two checked-in PDF fixtures through the old link into a two-page download', async ({ page }) => {
  await page.goto('./workspace?tool=merge-pdf')
  await expect(page).toHaveURL(/\/pdf\?action=merge$/)
  await openOnePagePdfFixtures(page, [fixtureFile('one.pdf', 'application/pdf', onePagePdfBase64), fixtureFile('two.pdf', 'application/pdf', secondOnePagePdfBase64)])
  const { download, bytes } = await downloadFromButton(page, 'PDF herunterladen')
  expect(download.suggestedFilename()).toBe('folkkit-edited.pdf')
  expect((await PDFDocument.load(bytes)).getPageCount()).toBe(2)
})

test('extracts the first page and rotates a PDF through the old tool links', async ({ page }) => {
  await page.goto('./workspace?tool=pdf-split')
  await openOnePagePdfFixtures(page, [fixtureFile('one.pdf', 'application/pdf', onePagePdfBase64)])
  await page.getByRole('checkbox', { name: 'Seite 1 auswählen', exact: true }).check()
  let downloaded = await downloadFromButton(page, 'Seite herunterladen')
  expect(downloaded.download.suggestedFilename()).toBe('folkkit-pages.pdf')
  expect((await PDFDocument.load(downloaded.bytes)).getPageCount()).toBe(1)

  await page.goto('./workspace?tool=pdf-rotate')
  await openOnePagePdfFixtures(page, [fixtureFile('one.pdf', 'application/pdf', onePagePdfBase64)])
  await page.getByRole('checkbox', { name: 'Seite 1 auswählen', exact: true }).check()
  await page.getByRole('button', { name: 'Seite drehen', exact: true }).click()
  downloaded = await downloadFromButton(page, 'PDF herunterladen')
  expect((await PDFDocument.load(downloaded.bytes)).getPage(0).getRotation().angle).toBe(90)
})
