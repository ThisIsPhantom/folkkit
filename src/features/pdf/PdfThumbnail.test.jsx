import { act, render, waitFor } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
afterEach(() => vi.unstubAllGlobals())
test('only renders a thumbnail when its sidebar item becomes visible', async () => {
  const path = './PdfThumbnail.jsx'
  const module = await import(/* @vite-ignore */ path).catch(() => null)
  expect(module?.default).toBeTypeOf('function')
  let intersect
  const disconnect = vi.fn()
  vi.stubGlobal('IntersectionObserver', class { constructor(callback) { intersect = callback } observe() {} disconnect() { disconnect() } })
  vi.stubGlobal('ImageData', class { constructor(pixels, width, height) { this.data = pixels; this.width = width; this.height = height } })
  const putImageData = vi.fn()
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({ putImageData })
  const client = { render: vi.fn().mockResolvedValue({ width: 2, height: 3, pixels: new Uint8ClampedArray(24) }) }
  const Component = module.default
  const screen = render(<Component client={client} index={0} page={{ width: 300, height: 400 }} revision={1} />)
  expect(client.render).not.toHaveBeenCalled()
  act(() => intersect([{ isIntersecting: true }]))
  await waitFor(() => expect(putImageData).toHaveBeenCalledTimes(1))
  expect(client.render).toHaveBeenCalledTimes(1)
  expect(disconnect).toHaveBeenCalled()
  screen.unmount()
  vi.restoreAllMocks()
})
