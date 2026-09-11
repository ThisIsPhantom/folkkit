import { expect, test } from '@playwright/test'
import { nativeAudioCapability } from './helpers/nativeAudioCapability.js'

test('native audio capability completes without animation-frame delivery @matrix', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => {
    const original = window.requestAnimationFrame
    const stopFrames = event => {
      if (event.target.id === 'folkkit-native-audio-capability') window.requestAnimationFrame = () => 0
    }
    document.addEventListener('click', stopFrames, true)
    window.restoreProbeFrames = () => {
      window.requestAnimationFrame = original
      document.removeEventListener('click', stopFrames, true)
    }
  })
  try {
    const result = await nativeAudioCapability(page)
    expect(typeof result.supported).toBe('boolean')
    if (!result.supported) expect([3, 4]).toContain(result.code)
    await expect(page.locator('#folkkit-native-audio-capability')).toHaveCount(0)
    expect(await page.evaluate(() => Object.hasOwn(window, '__nativeAudioCapabilityResult'))).toBe(false)
  } finally {
    await page.evaluate(() => { window.restoreProbeFrames(); delete window.restoreProbeFrames })
  }
})


for (const [mode, expected] of [['pending', 'timeout'], ['rejected', 'play_rejected']]) {
  test(`native audio capability never exempts a ${mode} startup`, async ({ page }) => {
    await page.goto('/')
    await page.evaluate(mode => {
      const play = HTMLMediaElement.prototype.play
      HTMLMediaElement.prototype.play = () => mode === 'pending' ? new Promise(() => {}) : Promise.reject(new DOMException('Denied', 'NotAllowedError'))
      window.restoreProbePlay = () => { HTMLMediaElement.prototype.play = play }
    }, mode)
    try {
      await expect(nativeAudioCapability(page)).rejects.toThrow(`native_audio_capability_${expected}`)
      await expect(page.locator('#folkkit-native-audio-capability')).toHaveCount(0)
    } finally {
      await page.evaluate(() => { window.restoreProbePlay(); delete window.restoreProbePlay })
    }
  })
}
