import { imageError } from './imageModel.js'
import { renderImageDocument } from './imageRenderer.js'

globalThis.onmessage = async ({ data }) => {
  const id = data?.id
  try {
    if (typeof id !== 'string' || data.command !== 'render' || !['png', 'jpeg', 'webp'].includes(data.format)
      || !data.source || !data.document || !Array.isArray(data.resources)) throw imageError()
    const resources = new Map(data.resources.map(resource => [resource.id, resource]))
    const { blob } = await renderImageDocument({
      source: data.source,
      document: data.document,
      resources,
      format: data.format,
      quality: data.quality,
      canvasFactory: (width, height) => new OffscreenCanvas(width, height),
    })
    globalThis.postMessage({ id, ok: true, blob })
  } catch (error) {
    const code = ['resource_limit', 'invalid_settings', 'unsupported_browser'].includes(error?.code) ? error.code : 'invalid_file'
    globalThis.postMessage({ id, ok: false, code })
  }
}
