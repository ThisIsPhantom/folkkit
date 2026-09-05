import { expect, test } from 'vitest'
import { executeTool } from './toolRuntime.js'
import { TOOL_LIMITS } from './limits.js'
test('allows actual media outputs up to64MiB but retains16MiB text and generic output limits', async () => {
  const blob = new Blob([new Uint8Array(17 * 1024 * 1024)])
  const convert = async () => ({ kind: 'download', blob, filename: 'audio.wav' })
  await expect(executeTool({ tool: { limits: TOOL_LIMITS.media, convert } })).resolves.toMatchObject({ blob })
  await expect(executeTool({ tool: { isMediaConverter: true, convert } })).rejects.toMatchObject({ code: 'resource_limit' })
  await expect(executeTool({ tool: { limits: TOOL_LIMITS.media, convert: async () => ({ kind: 'text', text: 'x'.repeat(17 * 1024 * 1024) }) } })).rejects.toMatchObject({ code: 'resource_limit' })
})
