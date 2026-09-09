// Test-only evidence from the actual preview, before product cleanup clears MediaError.
export async function observePreviewMediaErrors(page) {
  await page.evaluate(() => {
    globalThis.__takePreviewMediaErrors?.()
    const codes = new Set(), tracked = new Map()
    const originalCreate = document.createElement, originalPlay = HTMLMediaElement.prototype.play
    const descriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'error')
    if (typeof descriptor?.get !== 'function') throw new Error('preview_error_observation_unavailable')
    let closed = false
    const record = value => { if (!closed && [1,2,3,4].includes(value?.code)) codes.add(value.code) }
    const track = media => {
      if (closed || tracked.has(media)) return
      const own = Object.getOwnPropertyDescriptor(media, 'error')
      const get = function () { const value = descriptor.get.call(this); record(value); return value }
      const capture = () => record(descriptor.get.call(media))
      Object.defineProperty(media, 'error', { configurable: true, enumerable: descriptor.enumerable, get })
      for (const event of ['error','pause','ended']) media.addEventListener(event, capture, true)
      tracked.set(media, { own, get, capture })
      capture()
    }
    const create = function (...args) {
      const element = originalCreate.apply(this, args)
      if (element instanceof HTMLAudioElement) track(element)
      return element
    }
    const play = function (...args) { if (this instanceof HTMLAudioElement) track(this); return originalPlay.apply(this, args) }
    document.createElement = create; HTMLMediaElement.prototype.play = play
    globalThis.__takePreviewMediaErrors = () => {
      for (const media of tracked.keys()) record(descriptor.get.call(media))
      closed = true
      for (const [media, previous] of tracked) {
        for (const event of ['error','pause','ended']) media.removeEventListener(event, previous.capture, true)
        if (Object.getOwnPropertyDescriptor(media, 'error')?.get === previous.get) {
          if (previous.own) Object.defineProperty(media, 'error', previous.own)
          else delete media.error
        }
      }
      if (document.createElement === create) document.createElement = originalCreate
      if (HTMLMediaElement.prototype.play === play) HTMLMediaElement.prototype.play = originalPlay
      tracked.clear()
      return [...codes].sort()
    }
  })
}

export async function takePreviewMediaErrors(page) {
  return page.evaluate(() => {
    const take = globalThis.__takePreviewMediaErrors
    delete globalThis.__takePreviewMediaErrors
    return take ? take() : []
  })
}
