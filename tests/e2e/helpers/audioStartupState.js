// Test-only, content-free diagnostics. Never included in the application build.
export async function installAudioStartupState(page) {
  await page.addInitScript(() => {
    let context = null, media = null, resumeState = 'not_called', playState = 'not_called'
    let resumeGeneration = 0, playGeneration = 0
    const Context = globalThis.AudioContext || globalThis.webkitAudioContext
    if (Context) {
      const originalSource = Context.prototype.createMediaElementSource
      Context.prototype.createMediaElementSource = function (element) {
        context = this; media = element; playState = 'not_called'; playGeneration++
        return originalSource.call(this, element)
      }
      const originalResume = Context.prototype.resume
      Context.prototype.resume = function () {
        context = this; resumeState = 'pending'; const generation = ++resumeGeneration
        try {
          const result = originalResume.call(this)
          Promise.resolve(result).then(
            () => { if (resumeGeneration === generation) resumeState = 'resolved' },
            () => { if (resumeGeneration === generation) resumeState = 'rejected' },
          )
          return result
        } catch (error) { resumeState = 'rejected'; throw error }
      }
    }
    const originalPlay = HTMLMediaElement.prototype.play
    HTMLMediaElement.prototype.play = function () {
      media = this; playState = 'pending'; const generation = ++playGeneration
      try {
        const result = originalPlay.call(this)
        Promise.resolve(result).then(
          () => { if (playGeneration === generation) playState = 'resolved' },
          () => { if (playGeneration === generation) playState = 'rejected' },
        )
        return result
      } catch (error) { playState = 'rejected'; throw error }
    }
    const finiteTime = value => Number.isFinite(value) && value >= 0 ? Math.round(value * 1000) / 1000 : 0
    globalThis.__folkkitReadAudioStartup = () => ({
      hasAudioContext: !!Context,
      contextState: ['suspended','running','closed','interrupted'].includes(context?.state) ? context.state : 'not_created',
      contextCurrentTime: finiteTime(context?.currentTime),
      resumeState,
      hasMedia: !!media,
      playState,
      mediaReadyState: [0,1,2,3,4].includes(media?.readyState) ? media.readyState : 0,
      mediaCurrentTime: finiteTime(media?.currentTime),
      mediaPaused: media ? media.paused === true : true,
    })
  })
}

export async function readAudioStartupState(page) {
  return page.evaluate(() => globalThis.__folkkitReadAudioStartup?.() || { contextState: 'diagnostic_unavailable' })
}

export async function logAudioStartupFailure(page) {
  // Exactly one small state, without exception text, names, paths, URLs or content.
  let state
  try { state = await readAudioStartupState(page) }
  catch { state = { contextState: 'diagnostic_unavailable' } }
  console.log(`AUDIO_STARTUP_STATE ${JSON.stringify(state)}`)
}
