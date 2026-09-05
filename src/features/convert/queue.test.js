// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createConversionQueue, uniqueFilename } from './queue.js'

async function groupedQueue() {
  const queue = createConversionQueue({ detect: async () => 'png', convert: async item => [{ name:'combined.pdf', blob:new Blob([(item.combinedFiles || [item.file]).map(file => file.name).join(',')]) }] })
  await queue.add([new File(['a'],'a.png'), new File(['b'],'b.png')])
  for (const item of queue.snapshot().items) queue.configure(item.id, { target:'pdf' })
  await queue.start({ combineImages:true })
  return queue
}

describe('sequential conversion queue', () => {
  it('invalidates the whole combined result when its rows are reordered and rebuilds in the new order', async () => {
    const queue = await groupedQueue()
    expect(await queue.snapshot().items[0].results[0].blob.text()).toBe('a.png,b.png')
    queue.move(queue.snapshot().items[1].id, -1)
    expect(queue.snapshot().items.map(item => item.status)).toEqual(['ready','ready'])
    expect(queue.snapshot().items.flatMap(item => item.results)).toHaveLength(0)
    await queue.start({ combineImages:true })
    expect(await queue.snapshot().items[0].results[0].blob.text()).toBe('b.png,a.png')
  })
  it('invalidates all combined members when any member settings or target change', async () => {
    for (const patch of [{ settings:{ pageSize:'letter' } }, { target:'jpeg' }]) {
      const queue = await groupedQueue()
      const id = queue.snapshot().items[1].id
      queue.configure(id, patch)
      expect(queue.snapshot().items.map(item => item.status)).toEqual(['ready','ready'])
      expect(queue.snapshot().items.flatMap(item => item.results)).toHaveLength(0)
      expect(queue.snapshot().items.every(item => !item.combinedWith)).toBe(true)
      expect(queue.snapshot().items[1]).toMatchObject(patch)
    }
  })
  it('invalidates the result after removing either the leader or another combined member', async () => {
    for (const index of [0,1]) {
      const queue = await groupedQueue()
      queue.remove(queue.snapshot().items[index].id)
      expect(queue.snapshot().items).toHaveLength(1)
      expect(queue.snapshot().items[0]).toMatchObject({ status:'ready', results:[] })
      expect(queue.snapshot().items[0].combinedWith).toBeFalsy()
      await queue.start()
      expect(queue.snapshot().items[0].status).toBe('done')
    }
  })
  it('combines ordered images only on explicit start and returns a single PDF result', async () => {
    let received, receivedSettings
    const queue = createConversionQueue({ detect: async () => 'png', convert: async (item) => {
      received = item.combinedFiles.map(file => file.name)
      receivedSettings = item.combinedSettings
      return [{ name: 'combined.pdf', blob: new Blob(['pdf']) }]
    } })
    await queue.add([new File(['a'], 'a.png'), new File(['b'], 'b.png')])
    for (const item of queue.snapshot().items) queue.configure(item.id, { target: 'pdf', settings: { pageSize: item.file.name === 'a.png' ? 'letter' : 'a4' } })
    queue.move(queue.snapshot().items[1].id, -1)
    await queue.start({ combineImages: true })
    expect(received).toEqual(['b.png', 'a.png'])
    expect(receivedSettings).toEqual([{ pageSize: 'a4' }, { pageSize: 'letter' }])
    expect(queue.snapshot().items.map(i => i.status)).toEqual(['done', 'done'])
    expect(queue.snapshot().items.flatMap(i => i.results)).toHaveLength(1)
  })
  it('retains duplicate inputs, waits for start, and gives each output a unique safe name', async () => {
    const calls = []
    const queue = createConversionQueue({ detect: async () => 'png', convert: async (item) => {
      calls.push(item.id)
      return [{ name: 'same.jpg', blob: new Blob(['result']) }]
    } })
    await queue.add([new File(['a'], 'same.png'), new File(['b'], 'same.png')])
    expect(queue.snapshot().items).toHaveLength(2)
    expect(calls).toHaveLength(0)
    await queue.start()
    expect(calls).toHaveLength(2)
    expect(queue.snapshot().items.map(i => i.status)).toEqual(['done', 'done'])
    expect(queue.snapshot().items.map(i => i.results[0].name)).toEqual(['same.jpg', 'same (2).jpg'])
    expect(uniqueFilename('../bad/name.png', new Set())).toBe('_bad_name.png')
  })
  it('continues after an error and can retry only the failed row', async () => {
    let attempts = 0
    const queue = createConversionQueue({ detect: async () => 'png', convert: async () => {
      if (++attempts === 1) throw new Error('invalid_file')
      return [{ name: 'result.png', blob: new Blob(['ok']) }]
    } })
    await queue.add([new File(['a'], 'a.png'), new File(['b'], 'b.png')])
    await queue.start()
    expect(queue.snapshot().items.map(i => i.status)).toEqual(['error', 'done'])
    queue.retry(queue.snapshot().items[0].id)
    await queue.start()
    expect(queue.snapshot().items.map(i => i.status)).toEqual(['done', 'done'])
    expect(attempts).toBe(3)
  })
  it('does not retain results after the aggregate output cap is reached', async () => {
    const blob = new Blob([new Uint8Array(45 * 1024 * 1024)])
    const queue = createConversionQueue({ detect: async () => 'png', convert: async () => [{ name: 'large.png', blob }] })
    await queue.add([new File(['a'], 'a.png'), new File(['b'], 'b.png'), new File(['c'], 'c.png')])
    await queue.start()
    expect(queue.snapshot().items.map(item => item.status)).toEqual(['done', 'done', 'error'])
    expect(queue.snapshot().items[2].error).toBe('resource_limit')
    expect(queue.snapshot().items[2].results).toHaveLength(0)
  })
  it('aborts the real signal and never starts subsequent work after cancellation', async () => {
    let signal
    const queue = createConversionQueue({ detect: async () => 'png', convert: async (_item, options) => {
      signal = options.signal
      await new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(new DOMException('cancelled', 'AbortError'))))
    } })
    await queue.add([new File(['a'], 'a.png'), new File(['b'], 'b.png')])
    const run = queue.start()
    await Promise.resolve()
    queue.cancel()
    await run
    expect(signal.aborted).toBe(true)
    expect(queue.snapshot().items.map(i => i.status)).toEqual(['cancelled', 'ready'])
  })
  it('retargets the same queue without losing source files and invalidates stale results', async () => {
    const queue = createConversionQueue({ detect: async file => file.name.endsWith('.png') ? 'png' : 'pdf', convert: async item => [{ name:`result.${item.target}`,blob:new Blob(['ok']) }] })
    await queue.add([new File(['a'],'a.png'),new File(['b'],'b.pdf')])
    await queue.start()
    queue.reset(item => item.from === 'png'
      ? { task:'optimize',target:'png',allowedTargets:['png'],settings:{ qualityPreset:'balanced' } }
      : { task:'optimize',target:'',allowedTargets:[],settings:{} })
    expect(queue.snapshot().items.map(item => item.file.name)).toEqual(['a.png','b.pdf'])
    expect(queue.snapshot().items.map(item => item.status)).toEqual(['ready','unsupported'])
    expect(queue.snapshot().items.flatMap(item => item.results)).toHaveLength(0)
    expect(queue.snapshot().items[0]).toMatchObject({ task:'optimize',target:'png',settings:{ qualityPreset:'balanced' } })
  })
  it('prepares only newly added rows without invalidating completed results', async () => {
    const queue = createConversionQueue({ detect: async file => file.name.endsWith('.png') ? 'png' : 'pdf', convert: async item => [{ name:`result.${item.target}`,blob:new Blob(['ok']) }] })
    const prepare = from => from === 'png' ? { task:'optimize',target:'png',allowedTargets:['png'] } : { task:'optimize',allowedTargets:[] }
    await queue.add([new File(['a'],'a.png')],prepare)
    await queue.start()
    await queue.add([new File(['b'],'b.pdf')],prepare)
    expect(queue.snapshot().items[0]).toMatchObject({ status:'done',target:'png',task:'optimize' })
    expect(queue.snapshot().items[0].results).toHaveLength(1)
    expect(queue.snapshot().items[1]).toMatchObject({ status:'unsupported',target:'',task:'optimize' })
  })
})
