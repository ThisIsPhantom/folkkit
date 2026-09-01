import { expect, test } from '@playwright/test'

test('loads the released merge-pdf tool without cross-origin runtime requests', async ({ page }) => {
  const crossOriginRequests = []
  const testServerOrigin = new URL(test.info().project.use.baseURL).origin

  page.on('request', (request) => {
    if (new URL(request.url()).origin !== testServerOrigin) {
      crossOriginRequests.push(request.url())
    }
  })

  await page.goto('./?tool=merge-pdf', { waitUntil: 'domcontentloaded' })

  await expect(page.getByRole('button', { name: 'PDFs zusammenführen' })).toBeVisible()
  expect(crossOriginRequests).toEqual([])
})
