// @vitest-environment node
import { expect, test, vi } from 'vitest'
import { createConversionQueue } from './queue.js'

const file = (name) => new File(['fixture'], name)
const detect = async file => { if (file.name.endsWith('.bad')) throw new Error('invalid_file'); return file.name.endsWith('.jpg') ? 'jpeg' : 'png' }
const convert = async item => [{ name: `${item.file.name}.result`, blob: new Blob(['result']) }]

test('applies settings only to changed recipients with the same task and format pair', async () => {
  const run = vi.fn(convert), queue = createConversionQueue({ detect, convert: run })
  await queue.add([file('source.png'), file('recipient.png'), file('different.png'), file('other.jpg')])
  const [source, recipient, different, other] = queue.snapshot().items
  queue.configure(source.id, { settings: { width: '640', quality: '80' } })
  queue.configure(different.id, { target: 'webp' })
  await queue.start()
  const originalResults = queue.snapshot().items.map(item => item.results)
  const listener = vi.fn(); queue.subscribe(listener)
  expect(queue.applySettings(source.id)).toBe(1)
  const rows = queue.snapshot().items
  expect(rows[1]).toMatchObject({ id: recipient.id, settings: { width: '640', quality: '80' }, status: 'ready', results: [] })
  expect(rows[1].settings).not.toBe(rows[0].settings)
  expect(rows[0].results).toBe(originalResults[0])
  expect(rows[2].results).toBe(originalResults[2]); expect(rows[3].results).toBe(originalResults[3])
  expect(rows[3].id).toBe(other.id); expect(run).toHaveBeenCalledTimes(4); expect(listener).toHaveBeenCalledOnce()
  queue.configure(source.id, { settings: { width: '320' } })
  expect(queue.snapshot().items[1].settings.width).toBe('640')
})

test('copying identical settings leaves completed results intact', async () => {
  const queue = createConversionQueue({ detect, convert })
  await queue.add([file('a.png'), file('b.png')]); await queue.start()
  const before = queue.snapshot().items, listener = vi.fn(); queue.subscribe(listener)
  expect(queue.applySettings(before[0].id)).toBe(0)
  expect(queue.snapshot().items).toEqual(before); expect(listener).not.toHaveBeenCalled()
})

test('copying settings invalidates an entire combined result without changing other format settings', async () => {
  const queue = createConversionQueue({ detect, convert })
  await queue.add([file('a.png'), file('b.png'), file('c.jpg')])
  const [a,b,c] = queue.snapshot().items
  for (const item of [a,b,c]) queue.configure(item.id, { target: 'pdf' })
  queue.configure(a.id, { settings: { pageSize: 'a4' } })
  queue.configure(c.id, { settings: { pageSize: 'letter' } })
  await queue.start({ combineImages: true })
  expect(queue.applySettings(a.id)).toBe(1)
  const rows = queue.snapshot().items
  expect(rows.map(row => row.status)).toEqual(['ready','ready','ready'])
  expect(rows.flatMap(row => row.results)).toHaveLength(0)
  expect(rows.every(row => !row.combinedWith)).toBe(true)
  expect(rows[1].settings.pageSize).toBe('a4'); expect(rows[2].settings.pageSize).toBe('letter')
})

test('removing completed jobs preserves ready files and detection failures', async () => {
  const queue = createConversionQueue({ detect, convert })
  await queue.add([file('a.png'),file('b.png')]); for (const row of queue.snapshot().items) queue.configure(row.id,{ target:'pdf' })
  await queue.start({ combineImages:true })
  await queue.add([file('pending.png'),file('unknown.bad')])
  const remaining = queue.snapshot().items.slice(2)
  expect(queue.removeCompleted()).toBe(2)
  expect(queue.snapshot().items).toEqual(remaining)
  expect(queue.snapshot().items.map(item => item.status)).toEqual(['ready','error'])
  expect(queue.removeCompleted()).toBe(0)
})

test('bulk actions cannot change the queue during intake or conversion', async () => {
  let finishDetection, finishConversion
  const queue = createConversionQueue({ detect: async file => file.name === 'pending.png' ? new Promise(resolve => { finishDetection = resolve }) : 'png', convert: async () => new Promise(resolve => { finishConversion = () => resolve([{ name:'out',blob:new Blob(['ok']) }]) }) })
  await queue.add([file('a.png'),file('b.png')]); const id = queue.snapshot().items[0].id
  queue.configure(id,{ settings:{ width:'640' } })
  const add = queue.add([file('pending.png')]); const before = queue.snapshot().items
  expect(queue.applySettings(id)).toBe(0); expect(queue.removeCompleted()).toBe(0); expect(queue.snapshot().items).toEqual(before)
  finishDetection('png'); await add
  const run = queue.start(); const running = queue.snapshot().items
  expect(queue.applySettings(id)).toBe(0); expect(queue.removeCompleted()).toBe(0); expect(queue.snapshot().items).toEqual(running)
  queue.cancel(); finishConversion(); await run
})


test('shares optimization settings while retaining its same-format output contract', async () => {
  const queue = createConversionQueue({ detect, convert })
  await queue.add([file('a.jpg'),file('b.jpg'),file('c.png')], from => ({ task:'optimize',target:from,allowedTargets:[from],settings:{ qualityPreset:'balanced' } }))
  const [source] = queue.snapshot().items
  queue.configure(source.id,{ settings:{ qualityPreset:'small',width:'640' } })
  expect(queue.applySettings(source.id)).toBe(1)
  expect(queue.snapshot().items[1]).toMatchObject({ task:'optimize',target:'jpeg',settings:{ qualityPreset:'small',width:'640' } })
  expect(queue.snapshot().items[2]).toMatchObject({ task:'optimize',target:'png',settings:{ qualityPreset:'balanced' } })
})
