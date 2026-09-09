import { readFileSync } from 'node:fs'
import { builtModulePath } from './builtArtifact.js'

const CASES = ['short_fixture', 'short_preview', 'long_preview']
const emit = state => console.log(`NATIVE_CUE_DIAGNOSTIC ${JSON.stringify(state)}`)

// Opt-in runner diagnostics: fixed synthetic inputs, at most three small states.
// This probe uses a native audio element and cue, never the Folkkit player.
export async function logNativeCueComparison(page) {
  try {
    await page.evaluate(async ({ moduleUrl, fixtureBytes }) => {
      const { prepareAudio } = await import(moduleUrl)
      const wave = seconds => {
        const rate = 44100, count = rate * seconds, bytes = new Uint8Array(44 + count * 2)
        const view = new DataView(bytes.buffer), text = (offset, value) => bytes.set(new TextEncoder().encode(value), offset)
        text(0, 'RIFF'); view.setUint32(4, bytes.length - 8, true); text(8, 'WAVEfmt ')
        view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true)
        view.setUint32(24, rate, true); view.setUint32(28, rate * 2, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true)
        text(36, 'data'); view.setUint32(40, count * 2, true)
        for (let i = 0; i < count; i++) view.setInt16(44 + i * 2, Math.round(.5 * 32767 * Math.sin(2 * Math.PI * 440 * i / rate)), true)
        return new File([bytes], 'synthetic.wav', { type: 'audio/wav' })
      }
      const short = await prepareAudio(wave(1)), long = await prepareAudio(wave(6))
      globalThis.__nativeCueInputs = {
        short_fixture: new Blob([Uint8Array.from(fixtureBytes)], { type: 'audio/mpeg' }),
        short_preview: short.preview,
        long_preview: long.preview,
      }
    }, { moduleUrl: builtModulePath('audioEngine'), fixtureBytes: Array.from(readFileSync(new URL('../file-converter-fixtures/sample.mp3', import.meta.url))) })
  } catch {
    for (const kind of CASES) emit({ case: kind, phase: 'prepare_failed' })
    return
  }
  try {
    for (const kind of CASES) {
      let phase = 'observed'
      try {
        await page.evaluate(kind => {
          const audio = document.createElement('audio'), button = document.createElement('button')
          const url = URL.createObjectURL(globalThis.__nativeCueInputs[kind])
          const state = { case: kind, ready: false, cueSupported: false, playState: 'not_called', pauseSeen: false, cueEntered: false, cueExited: false, cueExitTime: 0, pauseTime: 0, pausePlayedEnd: 0, pauseEnded: false, errorCode: 0 }
          const finite = value => Number.isFinite(value) ? Math.round(value * 1e6) / 1e6 : 0
          const playedEnd = () => audio.played.length ? finite(audio.played.end(audio.played.length - 1)) : 0
          const ready = () => { state.ready = true }
          const error = () => { state.errorCode = [1,2,3,4].includes(audio.error?.code) ? audio.error.code : 0 }
          const paused = () => { if (!state.pauseSeen) Object.assign(state, { pauseSeen: true, pauseTime: finite(audio.currentTime), pausePlayedEnd: playedEnd(), pauseEnded: audio.ended }) }
          audio.addEventListener('loadedmetadata', ready); audio.addEventListener('error', error); audio.addEventListener('pause', paused)
          audio.preload = 'auto'; audio.src = url
          let track, cue
          try {
            track = audio.addTextTrack('metadata'); track.mode = 'hidden'
            cue = new VTTCue(.2, .8, ''); cue.pauseOnExit = true
            cue.onenter = () => { state.cueEntered = true }
            cue.onexit = () => { state.cueExited = true; state.cueExitTime = finite(audio.currentTime) }
            track.addCue(cue); state.cueSupported = cue.pauseOnExit === true
          } catch { state.cueSupported = false }
          button.id = 'folkkit-native-cue-diagnostic'; button.textContent = 'Native audio probe'
          button.onclick = async () => {
            audio.currentTime = .2; state.playState = 'pending'
            try { await audio.play(); state.playState = 'resolved' } catch { state.playState = 'rejected' }
          }
          document.body.append(button)
          globalThis.__readNativeCueProbe = () => ({ ...state, readyState: audio.readyState, currentTime: finite(audio.currentTime), playedEnd: playedEnd(), paused: audio.paused, ended: audio.ended, duration: finite(audio.duration) })
          globalThis.__cleanupNativeCueProbe = () => {
            audio.removeEventListener('loadedmetadata', ready); audio.removeEventListener('error', error); audio.removeEventListener('pause', paused)
            if (cue) { cue.onenter = null; cue.onexit = null; try { track.removeCue(cue) } catch { /* Already removed. */ } }
            audio.pause(); audio.removeAttribute('src'); audio.load(); URL.revokeObjectURL(url); button.remove()
          }
        }, kind)
        try { await page.waitForFunction(() => { const state = globalThis.__readNativeCueProbe(); return state.ready || state.errorCode > 0 }, null, { timeout: 5000 }) }
        catch { phase = 'metadata_timeout' }
        const ready = await page.evaluate(() => globalThis.__readNativeCueProbe())
        if (ready.ready && ready.cueSupported) {
          await page.locator('#folkkit-native-cue-diagnostic').click({ timeout: 3000 })
          try { await page.waitForFunction(() => { const state = globalThis.__readNativeCueProbe(); return state.pauseSeen || state.playState === 'rejected' || state.errorCode > 0 }, null, { timeout: 4000 }) }
          catch { phase = 'pause_timeout' }
          // Compare the immediate event snapshot with the known later clock drift.
          await page.waitForTimeout(500)
        }
        emit({ phase, ...await page.evaluate(() => globalThis.__readNativeCueProbe()) })
      } catch { emit({ case: kind, phase: 'probe_failed' }) }
      finally { await page.evaluate(() => globalThis.__cleanupNativeCueProbe?.()).catch(() => {}) }
    }
  } finally {
    await page.evaluate(() => { delete globalThis.__nativeCueInputs; delete globalThis.__readNativeCueProbe; delete globalThis.__cleanupNativeCueProbe }).catch(() => {})
  }
}
