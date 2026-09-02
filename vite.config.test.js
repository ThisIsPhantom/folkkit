// @vitest-environment node
import { expect, test } from 'vitest'
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
