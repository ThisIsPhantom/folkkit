import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { Buffer } from 'node:buffer'
import { fileURLToPath } from 'node:url'
import { unzipSync, strFromU8 } from 'fflate'

const raster = ['png', 'jpg', 'webp'].map(extension => ({ extension, mime: extension === 'jpg' ? 'image/jpeg' : `image/${extension}`, bytes: readFileSync(fileURLToPath(new URL(`./file-converter-fixtures/sample.${extension}`, import.meta.url))) }))
const images = raster.map(image => `data:${image.mime};base64,${image.bytes.toString('base64')}`)
const markdown = `# Grüezi 世界 {#custom-section}\n\n[Zum Abschnitt](#custom-section)\n\n| Ort | Wert |\n|---|---|\n| Zürich | 42 |\n\n${images.map((url, i) => `![Bild ${i + 1}](${url})`).join('\n\n')}`
const html = `<h1 id="custom-section">Grüezi 世界</h1><a href="#custom-section">Zum Abschnitt</a><table><thead><tr><th>Ort</th><th>Wert</th></tr></thead><tbody><tr><td>Zürich</td><td>42</td></tr></tbody></table>${images.map(url => `<img src="${url}" alt="Bild">`).join('')}<script>window.documentCanary=true</script><img src="https://document-external.invalid/image.png" onerror="window.documentCanary=true"><iframe src="https://document-external.invalid/frame"></iframe><a href="https://example.com">Link</a>`
async function convert(page, file, to) {
  if (await page.getByRole('button', { name: 'Clear files', exact: true }).isVisible()) await page.getByRole('button', { name: 'Clear files', exact: true }).click()
  await page.getByLabel('Choose files', { exact: true }).setInputFiles(file)
  await expect(page.getByText('Ready', { exact: true })).toBeVisible()
  await page.getByLabel(`Output format: ${file.name}`, { exact: true }).selectOption(to)
  await page.getByRole('button', { name: 'Convert files', exact: true }).click()
  await expect(page.getByText('Done', { exact: true })).toBeVisible({ timeout: 65_000 })
  const pending = page.waitForEvent('download')
  await page.getByRole('button', { name: /^Download result:/ }).click()
  const download = await pending
  return { name: download.suggestedFilename(), bytes: readFileSync(await download.path()) }
}
function checkDocx(bytes) {
  const entries = unzipSync(bytes)
  const xml = strFromU8(entries['word/document.xml'])
  expect(xml).toContain('Grüezi'); expect(xml).toContain('世界'); expect(xml).toContain('w:tbl')
  const media = Object.keys(entries).filter(name => name.startsWith('word/media/'))
  expect(media).toHaveLength(3)
  expect(strFromU8(entries['word/_rels/document.xml.rels'])).not.toContain('document-external.invalid')
}
const documentPairs = ['markdown', 'html', 'docx'].flatMap(from => ['markdown', 'html', 'docx'].filter(to => to !== from).map(to => ({ from, to })))
for (const { from, to } of documentPairs) test(`@matrix documents convert ${from} to ${to} with Unicode, tables and three local raster formats`, async ({ page }, testInfo) => {
  // Each conversion keeps its own 65-second assertion and 60-second engine cap.
  // DOCX inputs additionally need one verified seed conversion.
  test.setTimeout(from === 'docx' ? 150_000 : 90_000)
  const requests = [], errors = []
  page.on('request', request => requests.push({ url: request.url(), method: request.method(), body: request.postData() }))
  page.on('pageerror', error => errors.push(error.message))
  await page.addInitScript(() => localStorage.setItem('folkkit:locale', 'en'))
  await page.goto('/convert')
  expect(requests.some(request => request.url.includes('pandoc.wasm'))).toBe(false)
  const fixtures = { markdown: { name: 'fixture.md', mimeType: 'text/markdown', buffer: Buffer.from(markdown) }, html: { name: 'fixture.html', mimeType: 'text/html', buffer: Buffer.from(html) } }
  if (from === 'docx') {
    const seed = await convert(page, fixtures.markdown, 'docx')
    checkDocx(seed.bytes)
    fixtures.docx = { name: 'fixture.docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', buffer: seed.bytes }
  }
  const result = await convert(page, fixtures[from], to)
  if (to === 'docx') checkDocx(result.bytes)
  else if (to === 'markdown') {
    expect(result.name).toBe('fixture.zip')
    const entries = unzipSync(result.bytes), md = strFromU8(entries['document.md'])
    expect(md).toContain('Grüezi'); expect(md).toContain('世界'); expect(md).not.toContain('<script')
    for (const image of ['image-1.png', 'image-2.jpg', 'image-3.webp']) { expect(entries[image]).toBeTruthy(); expect(md).toContain(image) }
  } else {
    const document = await page.evaluate(text => {
      const dom = new DOMParser().parseFromString(text, 'text/html')
      return { anchors: [...dom.querySelectorAll('a[href^="#"]')].map(link => ({ href: link.getAttribute('href'), target: Boolean(dom.getElementById(link.getAttribute('href').slice(1))) })), text: dom.body.textContent, tables: dom.querySelectorAll('table').length, images: [...dom.images].map(img => img.src), active: dom.querySelectorAll('script,iframe,form,svg,style,[onerror],[onclick]').length }
    }, result.bytes.toString('utf8'))
    // The pinned DOCX reader regenerates heading IDs and drops custom bookmarks.
    // Preserve IDs that reach the AST from Markdown/HTML; do not claim a DOCX bookmark round-trip.
    if (from !== 'docx') { expect(document.anchors.length).toBeGreaterThan(0); expect(document.anchors.every(anchor => anchor.target)).toBe(true) }
    expect(document.text).toContain('Grüezi'); expect(document.text).toContain('世界'); expect(document.tables).toBe(1); expect(document.active).toBe(0)
    expect(document.images).toHaveLength(3); expect(document.images.every(src => /^data:image\/(png|jpeg|webp);base64,/.test(src))).toBe(true)
  }
  if (from === 'html') await expect(page.getByText('Externally linked or missing images were omitted.', { exact: true })).toBeVisible()
  expect(await page.evaluate(() => window.documentCanary)).toBeUndefined()
  const origin = new URL(page.url()).origin
  expect(requests.every(request => new URL(request.url).origin === origin && ['GET', 'HEAD'].includes(request.method) && !request.body)).toBe(true)
  expect(errors).toEqual([])
  await page.setViewportSize({ width: 390, height: 844 })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({ path: testInfo.outputPath(`documents-${from}-to-${to}-mobile.png`), fullPage: true })
})

test.describe('documents cancellation', () => {
  test.use({ serviceWorkers: 'block' })

test('documents reject invalid UTF-8, cancel a stalled runtime and retry cleanly', async ({ page }) => {
  test.setTimeout(100_000)
  await page.addInitScript(() => localStorage.setItem('folkkit:locale', 'en'))
  await page.goto('/convert')
  await page.getByLabel('Choose files', { exact: true }).setInputFiles({ name: 'broken.md', mimeType: 'text/markdown', buffer: Buffer.from([255]) })
  await expect(page.getByText('The document is damaged or does not match its file type.', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Clear files', exact: true }).click()
  let intercepted
  const stalled = new Promise(resolve => { intercepted = resolve })
  await page.route('**/vendor/pandoc/pandoc.wasm', async route => { intercepted(route) })
  await page.getByLabel('Choose files', { exact: true }).setInputFiles({ name: 'retry.md', mimeType: 'text/markdown', buffer: Buffer.from('# Retry') })
  await expect(page.getByText('Ready', { exact: true })).toBeVisible()
  await page.getByLabel('Output format: retry.md', { exact: true }).selectOption('html')
  await page.getByRole('button', { name: 'Convert files', exact: true }).click()
  const route = await stalled
  await page.getByRole('button', { name: 'Cancel conversion', exact: true }).click()
  await expect(page.getByText('Cancelled', { exact: true })).toBeVisible()
  await route.abort().catch(() => {})
  await page.unroute('**/vendor/pandoc/pandoc.wasm')
  await page.getByRole('button', { name: 'Retry', exact: true }).click()
  await page.getByRole('button', { name: 'Convert files', exact: true }).click()
  await expect(page.getByText('Done', { exact: true })).toBeVisible({ timeout: 65_000 })
})

})

test('documents reuse cached runtime after a real offline reload @matrix', async ({ page }) => {
  test.setTimeout(150_000)
  const { createOfflinePreview } = await import('./helpers/offline-preview.mjs')
  const preview = await createOfflinePreview()
  try {
    await page.addInitScript(() => localStorage.setItem('folkkit:locale', 'en'))
    await page.goto(preview.url + '/convert')
    await page.evaluate(async () => {
      await navigator.serviceWorker.ready
      if (!navigator.serviceWorker.controller) await new Promise(resolve => navigator.serviceWorker.addEventListener('controllerchange', resolve, { once:true }))
    })
    const file = { name:'offline.md',mimeType:'text/markdown',buffer:Buffer.from('# Offline Grüezi') }
    await convert(page,file,'html')
    await expect.poll(() => page.evaluate(async () => Boolean(await caches.match('/vendor/pandoc/pandoc.wasm')))).toBe(true)
    await page.evaluate(() => { window.documentReloadMarker = 'before' })
    preview.setOffline()
    await page.reload()
    expect(await page.evaluate(() => window.documentReloadMarker)).toBeUndefined()
    const result = await convert(page,file,'html')
    expect(result.bytes.toString('utf8')).toContain('Offline Grüezi')
    expect(preview.deniedRequests).toBeGreaterThan(0)
  } finally { await preview.close() }
})

test.describe('documents unavailable runtime', () => {
  test.use({ serviceWorkers: 'block' })
  test('documents explain unavailable runtime without an external fallback', async ({ page }) => {
    test.setTimeout(80_000)
    const requests = []
    page.on('request', request => requests.push(request.url()))
    await page.addInitScript(() => localStorage.setItem('folkkit:locale', 'en'))
    await page.route('**/vendor/pandoc/pandoc.wasm', route => route.fulfill({ status: 404, contentType: 'text/plain', body: 'Not found' }))
    await page.goto('/convert')
    expect(requests.some(url => url.includes('pandoc.wasm'))).toBe(false)
    await page.getByLabel('Choose files', { exact: true }).setInputFiles({ name: 'missing.md', mimeType: 'text/markdown', buffer: Buffer.from('# Missing runtime') })
    await expect(page.getByText('Ready', { exact: true })).toBeVisible()
    await page.getByLabel('Output format: missing.md', { exact: true }).selectOption('html')
    await page.getByRole('button', { name: 'Convert files', exact: true }).click()
    await expect(page.getByText('The document module is unavailable. Connect once to load it, then retry.', { exact: true })).toBeVisible({ timeout: 65_000 })
    expect(requests.every(url => new URL(url).origin === new URL(page.url()).origin)).toBe(true)
  })
})
