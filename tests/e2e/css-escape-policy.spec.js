import { expect, test } from '@playwright/test'
import { assertNoExternalRuntimeOrigins } from '../../scripts/assert-runtime-artifacts.mjs'

const cases = [
  ['url with escaped backslashes', String.raw`.probe{background-image:url(https:\5c\5c attacker.example/url-backslash.png)}`],
  ['url with a slashless escaped scheme', String.raw`.probe{background-image:url(h\74tps:attacker.example/url-scheme.png)}`],
  ['image-set with escaped backslashes', String.raw`.probe{background-image:image-set(url(https:\5c\5c attacker.example/image-set-backslash.png) 1x)}`],
  ['image-set with a slashless escaped scheme', String.raw`.probe{background-image:image-set(url(h\74tps:attacker.example/image-set-scheme.png) 1x)}`],
  ['@import with escaped backslashes', String.raw`@import url(https:\5c\5c attacker.example/import-backslash.css);`],
  ['@import with a slashless escaped scheme', String.raw`@import url(h\74tps:attacker.example/import-scheme.css);`],
  ['nested -webkit-cross-fade URL', '.probe{background-image:-webkit-cross-fade(url(https://attacker.example/cross-fade.png),url(/local.png),50%)}'],
  ['escaped tab inside the HTTPS scheme', String.raw`.probe{background-image:url(h\9 ttps:\2f\2f attacker.example/tab-in-scheme.png)}`],
  ['custom property inside image-set', String.raw`.probe{--remote:"https://attacker.example/custom-property.png";background-image:image-set(var(--remote) 1x)}`],
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
