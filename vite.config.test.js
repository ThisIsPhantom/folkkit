import { mkdtemp,mkdir,writeFile,rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
// @vitest-environment node
import { expect, test, vi } from 'vitest'
import viteConfig from './vite.config.js'

const ownershipMeta = '<meta name="google-adsense-account" content="ca-pub-7877827162675091">'

test('ownership metadata is validated from the generated bundle without reading dist from disk', () => {
  const plugin = viteConfig.plugins.find(entry => entry?.name === 'assert-built-ownership-metadata')
  expect(plugin).toBeDefined()
  expect(plugin.writeBundle).toBeTypeOf('function')

  expect(() => plugin.writeBundle({}, {
    'index.html': { type: 'asset', fileName: 'index.html', source: `<!doctype html><head>${ownershipMeta}</head>` },
  })).not.toThrow()
})


test('serves only the reviewed generated FFmpeg core import in development',async()=>{
  const root=await mkdtemp(join(tmpdir(),'folkkit-core-dev-'))
  try{
    await mkdir(join(root,'vendor/ffmpeg'),{recursive:true})
    await writeFile(join(root,'vendor/ffmpeg/ffmpeg-core.js'),'export default function trustedCore(){}')
    const plugin=viteConfig.plugins.find(entry=>entry?.name==='serve-generated-ffmpeg-core')
    expect(plugin).toBeDefined()
    expect(plugin.apply).toBe('serve')
    let handler
    plugin.configureServer({config:{publicDir:root},middlewares:{use:fn=>{handler=fn}}})
    const next=vi.fn(),response={setHeader:vi.fn(),end:vi.fn(),statusCode:0}
    handler({method:'GET',url:'/vendor/ffmpeg/ffmpeg-core.js?import'},response,next)
    expect(response.statusCode).toBe(200)
    expect(response.end.mock.calls[0][0].toString()).toBe('export default function trustedCore(){}')
    expect(next).not.toHaveBeenCalled()
    for(const request of [{method:'POST',url:'/vendor/ffmpeg/ffmpeg-core.js?import'},{method:'GET',url:'/vendor/pandoc/arbitrary.js?import'},{method:'GET',url:'/vendor/ffmpeg/ffmpeg-core.wasm?import'},{method:'GET',url:'/vendor/ffmpeg/ffmpeg-core.js?private=file'}])handler(request,response,next)
    expect(next).toHaveBeenCalledTimes(4)
  }finally{await rm(root,{recursive:true,force:true})}
})
