import { expect, test } from '@playwright/test'
import { assertNoExternalRuntimeOrigins } from '../../scripts/assert-runtime-artifacts.mjs'

const cases = [
  ['url', String.raw`.probe{background-image:url(https:\2f\2f attacker.example/url.png)}`],
  ['image-set', String.raw`.probe{background-image:image-set(url(https:\2f\2f attacker.example/image-set.png) 1x)}`],
  ['@import', String.raw`@import url(https:\2f\2f attacker.example/import.css);`],
]

for (const [label, css] of cases) {
  test(`Chromium resolves escaped external CSS in ${label}, while the release gate rejects it`, async ({ page }) => {
    const requests = []
    await page.route('https://attacker.example/**', async route => {
      requests.push(route.request().url())
      await route.abort()
    })

    await page.setContent(`<style>${css}</style><div class="probe">probe</div>`)

    await expect.poll(() => requests.length).toBeGreaterThan(0)
    expect(() => assertNoExternalRuntimeOrigins('reviewer.css', css)).toThrow(/external runtime origin/i)
  })
}
