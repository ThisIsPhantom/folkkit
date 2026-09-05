import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, resolve, sep } from 'node:path'

const mimeTypes = Object.freeze({
  '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.png': 'image/png',
  '.svg': 'image/svg+xml', '.wasm': 'application/wasm',
  '.webp': 'image/webp', '.woff': 'font/woff', '.woff2': 'font/woff2',
})

// Own the preview lifecycle and cut actual server connections. WebKit's
// emulated offline mode rejects cached navigations before the worker runs.
export async function createOfflinePreview({ directory = 'dist' } = {}) {
  const root = resolve(directory)
  let htaccess
  try { htaccess = await readFile(resolve(root, '.htaccess'), 'utf8') }
  catch (error) {
    if (error.code !== 'ENOENT') throw error
    // Ordinary Vite E2E builds use the identical checked-in hosting policy.
    htaccess = await readFile(resolve('hosting', '.htaccess'), 'utf8')
  }
  const headers = Object.fromEntries([...htaccess.matchAll(/^\s*Header always set (\S+) "([^"]*)"\s*$/gm)]
    .map(([, name, value]) => [name, value]))
  if (!headers['Content-Security-Policy']) throw new Error('dist/.htaccess has no Content-Security-Policy header.')
  let offline = false
  let deniedRequests = 0
  const server = createServer(async (request, response) => {
    if (offline) {
      deniedRequests += 1
      request.socket.destroy()
      return
    }
    try {
      const url = new URL(request.url || '/', `http://${request.headers.host || '127.0.0.1'}`)
      const requested = resolve(root, `.${decodeURIComponent(url.pathname)}`)
      if (requested !== root && !requested.startsWith(`${root}${sep}`)) {
        response.writeHead(403).end('Forbidden')
        return
      }
      let filePath = requested
      try { if (!(await stat(filePath)).isFile()) filePath = resolve(root, 'index.html') }
      catch { filePath = resolve(root, 'index.html') }
      const content = await readFile(filePath)
      response.writeHead(200, {
        ...headers,
        'Cache-Control': 'no-store',
        'Content-Type': mimeTypes[extname(filePath).toLowerCase()] || 'application/octet-stream',
      })
      response.end(request.method === 'HEAD' ? undefined : content)
    } catch (error) {
      response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' }).end(error.message)
    }
  })
  await new Promise((resolveListen, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => { server.removeListener('error', reject); resolveListen() })
  })
  return Object.freeze({
    url: `http://127.0.0.1:${server.address().port}`,
    get deniedRequests() { return deniedRequests },
    setOffline() { offline = true; server.closeAllConnections() },
    close() {
      return new Promise((resolveClose, reject) => {
        server.close(error => error ? reject(error) : resolveClose())
        server.closeAllConnections()
      })
    },
  })
}
