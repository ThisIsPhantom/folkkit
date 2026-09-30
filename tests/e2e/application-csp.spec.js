import process from 'node:process'
import {test,expect} from '@playwright/test'
import {fixtureFile,onePixelPngBase64} from '../fixtures/coreFixtures.js'

test('application preview, local photo and PDF run under production CSP',async({page,context})=>{
 test.skip(process.env.FOLKKIT_E2E_HOSTING_HEADERS!=='1','Requires hosting-header preview')
 await context.addInitScript(()=>{globalThis.__applicationCsp=[];document.addEventListener('securitypolicyviolation',e=>globalThis.__applicationCsp.push({directive:e.violatedDirective,uri:e.blockedURI}))})
 const errors=[];page.on('pageerror',e=>errors.push(e.message))
 const response=await page.goto('/application');expect(response.headers()['content-security-policy']).toContain("style-src 'self'")
 await page.getByRole('button',{name:'Mit Beispiel ausprobieren'}).click()
 await page.locator('input[accept="image/png,image/jpeg,image/webp"]').setInputFiles(fixtureFile('photo.png','image/png',onePixelPngBase64))
 await expect(page.locator('.app-photo-control img')).toBeVisible();await expect(page.locator('.app-preview image')).toHaveCount(1)
 await page.getByRole('tab',{name:'Gestaltung',exact:true}).click();await page.getByLabel('Fotoform').selectOption('rectangle');await expect(page.locator('.app-preview clipPath rect')).toHaveCount(1)
 const download=page.waitForEvent('download');await page.getByRole('button',{name:'PDF herunterladen',exact:true}).click();expect((await download).suggestedFilename()).toBe('lebenslauf.pdf')
 await expect(page.locator('[style]')).toHaveCount(0);expect(await page.evaluate(()=>globalThis.__applicationCsp)).toEqual([]);expect(errors).toEqual([])
})
