export function createLatestPreview({
  generate,
  createUrl,
  revokeUrl,
  onReady,
  onError,
  onPending = () => {},
  onClear = () => {},
  delay = 180,
  schedule = setTimeout,
  cancel = clearTimeout,
}) {
  let sequence = 0
  let timer = null
  let activeUrl = null
  let disposed = false

  const update = (request) => {
    const requestSequence = ++sequence
    onPending()
    if (timer !== null) cancel(timer)
    timer = schedule(async () => {
      timer = null
      try {
        const blob = await generate(request)
        if (disposed || requestSequence !== sequence) return
        const nextUrl = createUrl(blob)
        if (activeUrl) revokeUrl(activeUrl)
        activeUrl = nextUrl
        onReady(nextUrl)
      } catch (error) {
        if (!disposed && requestSequence === sequence) onError(error)
      }
    }, delay)
  }

  const clear = (notify = true) => {
    sequence += 1
    if (timer !== null) cancel(timer)
    timer = null
    if (activeUrl) revokeUrl(activeUrl)
    activeUrl = null
    if (notify) onClear()
  }

  const dispose = () => {
    if (disposed) return
    disposed = true
    clear(false)
  }

  return Object.freeze({ update, clear, dispose })
}
