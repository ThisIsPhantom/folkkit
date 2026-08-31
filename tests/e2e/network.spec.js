import { expect, test } from '@playwright/test'

test('loads the audio-to-mp3 tool without cross-origin runtime requests', async ({ page }) => {
  const crossOriginRequests = []
  const testServerOrigin = new URL(test.info().project.use.baseURL).origin

  page.on('request', (request) => {
    if (new URL(request.url()).origin !== testServerOrigin) {
      crossOriginRequests.push(request.url())
    }
  })

  await page.goto('./?tool=audio-to-mp3', { waitUntil: 'domcontentloaded' })

  await expect(page.getByRole('button', { name: 'Audio to MP3' })).toBeVisible()
  expect(crossOriginRequests).toEqual([])
})
