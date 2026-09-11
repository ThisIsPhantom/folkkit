import { readFileSync } from 'node:fs'

// A resolved play() promise proves startup, not successful decoding to EOF.
export async function nativeAudioCapability(page) {
  const bytes = Array.from(readFileSync(new URL('../file-converter-fixtures/sample.mp3', import.meta.url)))
  await page.evaluate(bytes => {
    const media = document.createElement('audio'), button = document.createElement('button')
    const url = URL.createObjectURL(new Blob([Uint8Array.from(bytes)], { type: 'audio/mpeg' }))
    let settled = false, deadline, endCheck
    globalThis.__nativeAudioCapabilityResult = null
    const finish = result => {
      if (settled) return
      settled = true; clearTimeout(deadline); clearTimeout(endCheck)
      globalThis.__nativeAudioCapabilityResult = result
    }
    const failure = () => {
      const code = media.error?.code || 0
      finish([3,4].includes(code) ? { supported: false, code } : { failure: 'media_error', code })
    }
    const ended = () => {
      // Recheck the final MediaError after the queued ended/error notifications.
      endCheck = setTimeout(() => {
        if (media.error) failure()
        else finish(media.ended ? { supported: true } : { failure: 'incomplete' })
      }, 0)
    }
    media.addEventListener('error', failure); media.addEventListener('ended', ended)
    button.id = 'folkkit-native-audio-capability'; button.textContent = 'Check native audio'
    button.onclick = () => {
      deadline = setTimeout(() => finish({ failure: 'timeout' }), 5000)
      media.preload = 'auto'; media.src = url
      try {
        Promise.resolve(media.play()).catch(() => {
          if (media.error) failure()
          else finish({ failure: 'play_rejected' })
        })
      } catch { if (media.error) failure(); else finish({ failure: 'play_rejected' }) }
    }
    document.body.append(button)
    globalThis.__readNativeAudioCapability = () => {
      const result = globalThis.__nativeAudioCapabilityResult, code = media.error?.code || 0
      if (result?.supported === true && code) return [3,4].includes(code) ? { supported: false, code } : { failure: 'media_error', code }
      return result
    }
    globalThis.__cleanupNativeAudioCapability = () => {
      clearTimeout(deadline); clearTimeout(endCheck)
      media.removeEventListener('error', failure); media.removeEventListener('ended', ended)
      media.pause(); media.removeAttribute('src'); media.load(); URL.revokeObjectURL(url); button.remove()
    }
  }, bytes)
  try {
    await page.locator('#folkkit-native-audio-capability').click({ timeout: 3000 })
    // Media completion must remain observable when animation frames are not delivered.
    await page.waitForFunction(() => globalThis.__nativeAudioCapabilityResult !== null, null, { timeout: 6000, polling: 100 })
    const result = await page.evaluate(() => globalThis.__readNativeAudioCapability())
    if (result.supported === true) return { supported: true }
    if (result.supported === false && [3,4].includes(result.code)) return { supported: false, code: result.code }
    // Network/abort/startup errors and timeouts must never exempt a playback test.
    throw new Error(`native_audio_capability_${['media_error','incomplete','timeout','play_rejected'].includes(result.failure) ? result.failure : 'unexpected'}`)
  } finally {
    await page.evaluate(() => { globalThis.__cleanupNativeAudioCapability?.(); delete globalThis.__cleanupNativeAudioCapability; delete globalThis.__nativeAudioCapabilityResult; delete globalThis.__readNativeAudioCapability }).catch(() => {})
  }
}
