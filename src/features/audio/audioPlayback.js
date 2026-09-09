import { AUDIO_LIMITS, audioError } from './audioModel.js'

// Local playback must either start or report a failure within a bounded time.
// Two seconds allow normal device initialization before trying native playback.
const WEB_AUDIO_START_MS = 2000
const NATIVE_START_MS = 2000

export function selectionGain(time, { start, end, fadeIn, fadeOut }) {
  if (time < start || time >= end) return 0
  return Math.min(1, fadeIn > 0 ? (time - start) / fadeIn : 1, fadeOut > 0 ? (end - time) / fadeOut : 1)
}

function waitForStart(promise, milliseconds, signal) {
  return new Promise(resolve => {
    let settled = false
    const finish = result => {
      if (settled) return
      settled = true; clearTimeout(timer); signal.removeEventListener('abort', cancel); resolve(result)
    }
    const cancel = () => finish({ state: 'cancelled' })
    const timer = setTimeout(() => finish({ state: 'timeout' }), milliseconds)
    signal.addEventListener('abort', cancel, { once: true })
    if (signal.aborted) cancel()
    Promise.resolve(promise).then(
      () => finish({ state: 'ready' }),
      error => finish({ state: 'error', error }),
    )
  })
}

export function createAudioPlayback(blob, {
  createMedia = () => document.createElement('audio'),
  createContext = () => {
    const Context = globalThis.AudioContext || globalThis.webkitAudioContext
    return Context ? new Context() : null
  },
  urlApi = URL, onState = () => {}, onTime = () => {},
} = {}) {
  if (!blob?.size || blob.size > AUDIO_LIMITS.preview) throw audioError('resource_limit')
  const url = urlApi.createObjectURL(blob)
  let channel = null, active = null, dead = false, nativeOnly = false, position = 0

  function makeChannel() {
    const media = createMedia()
    media.preload = 'metadata'; media.src = url; media.volume = 0
    return { media, context: null, source: null, gain: null, bound: false, released: false }
  }
  function closeGraph(target) {
    for (const node of [target.source, target.gain]) {
      try { node?.disconnect() } catch { /* A browser may have already released the graph. */ }
    }
    target.source = null; target.gain = null
    const context = target.context; target.context = null
    try { Promise.resolve(context?.close()).catch(() => {}) } catch { /* Already closed. */ }
  }
  function releaseChannel(target) {
    if (!target || target.released) return
    target.released = true
    target.media.pause(); target.media.removeAttribute('src'); target.media.load()
    closeGraph(target)
  }
  function setGain(target, value) {
    if (target.gain) target.gain.gain.value = value
    else target.media.volume = value
  }
  const owns = run => !dead && active === run && !run.controller.signal.aborted

  function pause() {
    const run = active; active = null
    run?.controller.abort(); clearInterval(run?.timer)
    if (run?.onEnded) run.channel.media.removeEventListener('ended', run.onEnded)
    if (channel) {
      if (Number.isFinite(channel.media.currentTime)) position = channel.media.currentTime
      channel.media.pause(); setGain(channel, 0)
      // A pending native play can resolve later; it must never share a retry's element.
      if (run && !run.started) { releaseChannel(channel); channel = null }
    }
    onState(false)
  }
  function tick(run) {
    if (!owns(run)) return false
    const time = run.channel.media.currentTime
    onTime(time)
    if (time >= run.selection.end) { pause(); return false }
    setGain(run.channel, selectionGain(time, run.selection))
    return true
  }

  async function startGraph(run) {
    if (nativeOnly) return
    const target = run.channel
    let outcome
    try {
      target.context ||= createContext()
      if (!target.context) { nativeOnly = true; return }
      outcome = await waitForStart(target.context.resume(), WEB_AUDIO_START_MS, run.controller.signal)
    } catch { outcome = { state: 'error' } }
    if (!owns(run)) return
    if (outcome.state === 'ready') {
      try {
        if (!target.bound) {
          // Binding is irreversible for this element, so wait until the context starts.
          target.bound = true
          target.source = target.context.createMediaElementSource(target.media)
          target.gain = target.context.createGain()
          target.gain.gain.value = 0
          target.source.connect(target.gain); target.gain.connect(target.context.destination)
        }
        target.media.volume = 1
        return
      } catch { /* A graph failure can still leave the element bound. Replace it below. */ }
    }
    nativeOnly = true
    closeGraph(target)
    if (target.bound) {
      releaseChannel(target); channel = makeChannel(); run.channel = channel
      channel.media.currentTime = run.position
    }
  }

  async function play(settings) {
    if (dead) return
    if (active) pause()
    channel ||= makeChannel()
    const start = position < settings.start || position >= settings.end - .02 ? settings.start : position
    const run = { channel, controller: new AbortController(), selection: { ...settings }, position: start, started: false }
    active = run
    try {
      setGain(channel, 0); channel.media.currentTime = start
      await startGraph(run)
      if (!owns(run)) return
      const media = run.channel.media
      const pendingPlay = media.play()
      Promise.resolve(pendingPlay).then(() => {
        if (!owns(run)) media.pause()
      }, () => {})
      const outcome = await waitForStart(pendingPlay, NATIVE_START_MS, run.controller.signal)
      if (!owns(run)) return
      if (outcome.state !== 'ready') throw outcome.error || audioError('playback_unavailable')
      if (media.currentTime >= run.selection.end) throw audioError('playback_unavailable')
      run.started = true
      run.onEnded = () => { if (owns(run) && media.ended) pause() }
      media.addEventListener('ended', run.onEnded)
      run.timer = setInterval(() => tick(run), 15)
      if (tick(run)) onState(true)
    } catch (error) {
      if (owns(run)) {
        pause()
        throw error?.name === 'NotSupportedError' ? audioError('playback_unavailable') : error
      }
    }
  }
  function dispose() {
    if (dead) return
    dead = true; pause(); releaseChannel(channel); channel = null
    urlApi.revokeObjectURL(url)
  }
  return { play, pause, dispose }
}
