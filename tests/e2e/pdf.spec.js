import { readFile } from 'node:fs/promises'
import { expect, test } from '@playwright/test'
import { PDFDocument } from 'pdf-lib'
import { fixtureFile, onePagePdfBase64, secondOnePagePdfBase64 } from '../fixtures/coreFixtures'

async function downloadBytes(page) {
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('link', { name: 'Herunterladen' }).click()
  const download = await downloadPromise
  return { download, bytes: await readFile(await download.path()) }
}

test('merges two checked-in PDF fixtures into a two-page download', async ({ page }) => {
  await page.goto('./workspace?tool=merge-pdf')
  await page.getByLabel('PDF-Dateien auswählen').setInputFiles([
    fixtureFile('one.pdf', 'application/pdf', onePagePdfBase64),
    fixtureFile('two.pdf', 'application/pdf', secondOnePagePdfBase64),
  ])

  const { download, bytes } = await downloadBytes(page)
  expect(download.suggestedFilename()).toBe('merged.pdf')
  expect((await PDFDocument.load(bytes)).getPageCount()).toBe(2)
})

test('extracts the first page and rotates a PDF through the released workspaces', async ({ page }) => {
  await page.goto('./workspace?tool=pdf-split')
  await page.getByLabel('Datei auswählen').setInputFiles(
    fixtureFile('one.pdf', 'application/pdf', onePagePdfBase64),
  )
  let downloaded = await downloadBytes(page)
  expect(downloaded.download.suggestedFilename()).toBe('one_page1.pdf')
  expect((await PDFDocument.load(downloaded.bytes)).getPageCount()).toBe(1)

  await page.goto('./workspace?tool=pdf-rotate')
  await page.getByLabel('Datei auswählen').setInputFiles(
    fixtureFile('one.pdf', 'application/pdf', onePagePdfBase64),
  )
  downloaded = await downloadBytes(page)
  expect(downloaded.download.suggestedFilename()).toBe('one_rotated90.pdf')
  expect((await PDFDocument.load(downloaded.bytes)).getPage(0).getRotation().angle).toBe(90)
})
