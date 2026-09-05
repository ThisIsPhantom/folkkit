// @vitest-environment node
import { expect, it } from 'vitest'
import { buildImageFallbackArgs } from './imageFallback.js'
it('builds bounded PNG/JPEG/WebP profiles with resizing and real white JPEG compositing', () => {
  for (const target of ['png','jpeg','webp']) {
    const args = buildImageFallbackArgs('input','output',{ width:48,height:32 },target,92)
    expect(args).toContain('-frames:v')
    expect(args).toContain('-fs')
    expect(args).toContain('-c:v')
    expect(args.at(-1)).toBe('output')
  }
  expect(buildImageFallbackArgs('in','out',{ width:48,height:32 },'jpeg',92).join(' ')).toContain('color=c=white:s=48x32')
  expect(buildImageFallbackArgs('in','out',{ width:48,height:32 },'webp',90)).toContain('libwebp')
  expect(() => buildImageFallbackArgs('in','out',{ width:48000,height:32 },'png')).toThrow('resource_limit')
  expect(() => buildImageFallbackArgs('in','out',{ width:48,height:32 },'svg')).toThrow('unsupported_pair')
})
