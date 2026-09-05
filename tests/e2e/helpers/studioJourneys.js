import { readFile } from 'node:fs/promises'
import { expect } from '@playwright/test'

export async function openOnePagePdfFixtures(page, files) {
  await page.getByLabel('PDF auswählen', { exact: true }).setInputFiles(files[0])
  await expect(page.locator('.pdf-page-card')).toHaveCount(1)
  await expect(page.getByRole('button', { name: 'PDF herunterladen', exact: true })).toBeEnabled()
  for (let index = 1; index < files.length; index++) {
    await page.getByLabel('Weiteres PDF anfügen', { exact: true }).setInputFiles(files[index])
    await expect(page.locator('.pdf-page-card')).toHaveCount(index + 1)
    await expect(page.getByRole('button', { name: 'PDF herunterladen', exact: true })).toBeEnabled()
  }
}

export async function downloadFromButton(page, name) {
  const button = page.getByRole('button', { name, exact: typeof name === 'string' })
  await expect(button).toBeEnabled({ timeout: 30000 })
  const pending = page.waitForEvent('download')
  await button.click()
  const download = await pending
  return { download, bytes: await readFile(await download.path()) }
}

export async function convertAndDownload(page) {
  await page.getByRole('button', { name: 'Dateien konvertieren', exact: true }).click()
  return downloadFromButton(page, /^Ergebnis herunterladen:/)
}
