import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { unzipSync } from 'fflate'

test('@matrix file converter drop, individual targets, local ZIP and accessible mobile controls', async ({ page }, testInfo) => {
  const requests = []
  page.on('request', request => requests.push({ url: request.url(), method: request.method(), body: request.postData() }))
  await page.addInitScript(() => localStorage.setItem('folkkit:locale', 'en'))
  await page.goto('/convert')
  await expect(page.locator('.converter-drop')).toBeVisible()
  const png = Array.from(readFileSync(fileURLToPath(new URL('./file-converter-fixtures/sample.png', import.meta.url))))
  await page.evaluate(bytes => {
    const transfer = new DataTransfer()
    for (const name of ['drop-a.png','drop-b.png']) transfer.items.add(new File([new Uint8Array(bytes)], name, { type:'image/png' }))
    document.querySelector('.converter-drop').dispatchEvent(new DragEvent('drop', { bubbles:true, dataTransfer:transfer }))
  }, png)
  await expect(page.getByText('Ready', { exact:true })).toHaveCount(2)
  await page.getByLabel('Output for all files').selectOption('webp')
  await page.getByLabel('Output format: drop-b.png', { exact:true }).selectOption('jpeg')
  await page.getByRole('button', { name:'Convert files', exact:true }).click()
  await expect(page.getByText('Done', { exact:true })).toHaveCount(2)
  const pending = page.waitForEvent('download')
  await page.getByRole('button', { name:'Download all as ZIP', exact:true }).click()
  const download = await pending
  const entries = unzipSync(readFileSync(await download.path()))
  expect(Object.keys(entries)).toEqual(['drop-a.webp','drop-b.jpg'])
  expect(String.fromCharCode(...entries['drop-a.webp'].subarray(0,4))).toBe('RIFF')
  expect(Array.from(entries['drop-b.jpg'].subarray(0,3))).toEqual([255,216,255])
  const origin = new URL(page.url()).origin
  expect(requests.every(request => new URL(request.url).origin === origin && ['GET','HEAD'].includes(request.method) && !request.body)).toBe(true)
  await page.evaluate(() => window.scrollTo({ top:0, behavior:'instant' }))
  await page.screenshot({ path:testInfo.outputPath('converter-desktop.png'), fullPage:true })
  await page.setViewportSize({ width:390, height:844 })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  expect((await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa']).analyze()).violations).toEqual([])
  await page.evaluate(() => window.scrollTo({ top:0, behavior:'instant' }))
  await page.screenshot({ path:testInfo.outputPath('converter-mobile.png'), fullPage:true })
  await page.getByRole('button', { name:'Clear files', exact:true }).focus()
  await page.keyboard.press('Enter')
  await expect(page.getByText('drop-a.png', { exact:true })).toHaveCount(0)
})
