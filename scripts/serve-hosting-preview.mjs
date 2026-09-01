import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, resolve, sep } from 'node:path'
import process from 'node:process'

const root = resolve('dist')
const portIndex = process.argv.indexOf('--port')
const port = Number.parseInt(portIndex >= 0 ? process.argv[portIndex + 1] : '4182', 10)
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('A valid --port is required.')

const htaccess = await readFile(resolve(root, '.htaccess'), 'utf8')
const hostingHeaders = Object.fromEntries([...htaccess.matchAll(/^\s*Header always set (\S+) "([^"]*)"\s*$/gm)]
  .map(([, name, value]) => [name, value]))
if (!hostingHeaders['Content-Security-Policy']) throw new Error('dist/.htaccess has no Content-Security-Policy header.')

const mimeTypes = Object.freeze({
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.wasm': 'application/wasm',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
})

async function existingFile(path) {
  try {
    const details = await stat(path)
    return details.isFile()
  } catch {
    return false
  }
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url || '/', `http://${request.headers.host || '127.0.0.1'}`)
    const pathname = decodeURIComponent(url.pathname)
    const requested = resolve(root, `.${pathname}`)
    if (requested !== root && !requested.startsWith(`${root}${sep}`)) {
      response.writeHead(403).end('Forbidden')
      return
    }
    const filePath = await existingFile(requested) ? requested : resolve(root, 'index.html')
    const content = await readFile(filePath)
    response.writeHead(200, {
      ...hostingHeaders,
      'Cache-Control': 'no-store',
      'Content-Type': mimeTypes[extname(filePath).toLowerCase()] || 'application/octet-stream',
    })
    response.end(request.method === 'HEAD' ? undefined : content)
  } catch (error) {
    response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
    response.end(error.message)
  }
})

server.listen(port, '127.0.0.1', () => {
  console.log(`Hosting-header preview listening on http://127.0.0.1:${port}/`)
})

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close(() => process.exit(0)))
}
