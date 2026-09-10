import { expect, test, vi } from 'vitest'
import * as qr from './qrGenerator.js'

function fixture() {
  const items = []
  class Item { constructor(data) { this.data = data; items.push(this) } }
  const clipboard = { write: vi.fn(async values => { await values[0].data['image/png'] }) }
  return { Item, clipboard, items }
}

test('clipboard receives a promise in the original user gesture, before image generation', async () => {
  expect(qr.copyQrPng).toBeTypeOf('function')
  const { Item, clipboard } = fixture()
  const generate = vi.fn(async () => new Blob(['png'], { type: 'image/png' }))
  const copied = qr.copyQrPng(generate, () => true, clipboard, Item)
  expect(clipboard.write).toHaveBeenCalledTimes(1)
  expect(generate).not.toHaveBeenCalled()
  await copied
  expect(generate).toHaveBeenCalledTimes(1)
})

test('a reset before PNG completion rejects the queued clipboard payload', async () => {
  expect(qr.copyQrPng).toBeTypeOf('function')
  const { Item, clipboard } = fixture()
  let finish, current = true
  const generated = new Promise(resolve => { finish = resolve })
  const copied = qr.copyQrPng(() => generated, () => current, clipboard, Item)
  await Promise.resolve()
  current = false
  finish(new Blob(['png'], { type: 'image/png' }))
  await expect(copied).rejects.toThrow('cancelled')
})

test('unsupported clipboard avoids image generation', async () => {
  expect(qr.copyQrPng).toBeTypeOf('function')
  const generate = vi.fn()
  await expect(qr.copyQrPng(generate, () => true, {}, undefined)).rejects.toThrow('clipboard_unavailable')
  expect(generate).not.toHaveBeenCalled()
})

test('a non-PNG result cannot be advertised as clipboard PNG', async () => {
  expect(qr.copyQrPng).toBeTypeOf('function')
  const { Item, clipboard } = fixture()
  await expect(qr.copyQrPng(async () => new Blob(['svg'], { type: 'image/svg+xml' }), () => true, clipboard, Item)).rejects.toThrow('generation_failed')
})
