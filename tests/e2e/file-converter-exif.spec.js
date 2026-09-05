import { test, expect } from '@playwright/test'
import process from 'node:process'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { PDFDocument } from 'pdf-lib'
import { PNG } from 'pngjs'

const decoder = process.env.FOLKKIT_TEST_FFMPEG || 'ffmpeg'
function checkPixels(pngBytes, width, height, orientation) {
  const image = PNG.sync.read(pngBytes)
  expect([image.width,image.height]).toEqual([width,height])
  const pixel = y => image.data.subarray((Math.floor(y) * width + Math.floor(width / 2)) * 4,(Math.floor(y) * width + Math.floor(width / 2)) * 4 + 4)
  const top = pixel(height / 4), bottom = pixel(height * 3 / 4)
  const red = orientation === 6 ? top : bottom, green = orientation === 6 ? bottom : top
  expect(red[0] - red[1]).toBeGreaterThan(80)
  expect(green[1] - green[0]).toBeGreaterThan(60)
}

for (const orientation of [6,8]) {
  test(`@matrix file converter EXIF${orientation} preserves upright pixels, resize and PDF geometry`, async ({ page },testInfo) => {
    test.setTimeout(150000)
    await page.addInitScript(() => localStorage.setItem('folkkit:locale','en'))
    await page.goto('/convert')
    await expect(page.locator('.converter-drop')).toBeVisible()
    const original = fileURLToPath(new URL(`./file-converter-fixtures/exif-${orientation}.jpg`,import.meta.url))
    async function convert(path,target,width,name) {
      const clear = page.getByRole('button',{ name:'Clear files',exact:true })
      if (await clear.count()) await clear.click()
      await page.getByLabel('Choose files',{ exact:true }).setInputFiles(path)
      await expect(page.getByText('Ready',{ exact:true })).toBeVisible()
      await page.getByLabel(/^Output format:/).selectOption(target)
      if (width) {
        await page.getByText('Settings',{ exact:true }).click()
        await page.getByLabel('Width (px)',{ exact:true }).fill(String(width))
      }
      await page.getByRole('button',{ name:'Convert files',exact:true }).click()
      await expect(page.locator('.converter-file')).toHaveAttribute('data-status',/done|error/,{ timeout:100000 })
      await expect(page.getByText('Done',{ exact:true })).toBeVisible()
      const pending = page.waitForEvent('download')
      await page.getByRole('button',{ name:'Download',exact:true }).click()
      const output = testInfo.outputPath(name)
      await (await pending).saveAs(output)
      return output
    }
    for (const resized of [false,true]) {
      const width = resized ? 32 : 64, height = resized ? 48 : 96
      for (const target of ['png','webp','pdf']) {
        const path = await convert(original,target,resized ? 32 : null,`exif-${orientation}-${width}.${target}`)
        if (target === 'png') checkPixels(readFileSync(path),width,height,orientation)
        if (target === 'webp') {
          // Decode stored pixels independently, ignoring any orientation metadata.
          const decoded = spawnSync(decoder,['-v','error','-noautorotate','-i',path,'-frames:v','1','-f','image2pipe','-c:v','png','-'],{ windowsHide:true,maxBuffer:4 * 1024 * 1024 })
          expect(decoded.status,decoded.stderr?.toString() || decoded.error?.message).toBe(0)
          checkPixels(decoded.stdout,width,height,orientation)
        }
        if (target === 'pdf') {
          const pdf = await PDFDocument.load(readFileSync(path))
          expect(pdf.getPage(0).getSize()).toEqual({ width:width * 0.75,height:height * 0.75 })
          // Creation uses pdf-lib; the independent PDFium renderer reopens it.
          const raster = await convert(path,'png',null,`exif-${orientation}-${width}-pdf-render.png`)
          checkPixels(readFileSync(raster),width * 1.5,height * 1.5,orientation)
        }
      }
    }
  })
}
