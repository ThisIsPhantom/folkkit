import { createPandocInstance } from 'pandoc-wasm/core'
import { DOCUMENT_LIMITS as L, documentError } from './documentConstants.js'
import { capWasmMemory } from './documentSafety.js'
const WASM_SIZE = 58_580_800
const WASM_HASH = 'b47c9de52b5b45f103c2dac6fea52591aeafe3dd6cafed13331b67575233a2ff'
// The upstream shim allocates JS arrays outside the WASM heap. Check before it runs.
export function configureDocumentWasi(wasi) {
  let written = 0, opens = 0, allocated = 0n
  const allocations = new Map()
  const max = BigInt(L.output)
  const assertSize = size => { if (size < 0n || size > max) throw documentError('document_too_large') }
  const reserve = (fd, size) => {
    assertSize(size)
    const file = wasi.fds[fd]?.file
    if (!file) return
    const previous = allocations.get(file) || 0n
    const next = size > previous ? size : previous
    if (allocated + next - previous > max * 2n) throw documentError('document_too_large')
    allocated += next - previous; allocations.set(file, next)
  }
  const wrap = (name, check) => { const original = wasi.wasiImport[name]; wasi.wasiImport[name] = (...args) => { check(...args); return original(...args) } }
  const io = (fd, pointer, count, offset) => {
    if (count < 0 || count > 1024) throw documentError('document_too_large')
    const view = new DataView(wasi.inst.exports.memory.buffer)
    let bytes = 0
    for (let i = 0; i < count; i++) bytes += view.getUint32(pointer + i * 8 + 4, true)
    written += bytes
    if (written > L.output * 4) throw documentError('document_too_large')
    assertSize(BigInt(bytes)); reserve(fd, (offset ?? wasi.fds[fd]?.file_pos ?? 0n) + BigInt(bytes))
  }
  wrap('fd_write', (fd, ptr, count) => io(fd, ptr, count))
  wrap('fd_pwrite', (fd, ptr, count, offset) => io(fd, ptr, count, offset))
  wrap('fd_allocate', (fd, offset, length) => reserve(fd, offset + length))
  wrap('fd_filestat_set_size', (fd, size) => reserve(fd, size))
  const open = () => { if (++opens > 4096) throw documentError('document_too_large') }
  wrap('path_open', open); wrap('path_create_directory', open)
}
export async function loadDocumentRuntime() {
  try {
    const response = await fetch('/vendor/pandoc/pandoc.wasm', { credentials: 'omit', redirect: 'error' })
    assertRuntimeResponse(response)
    const bytes = new Uint8Array(WASM_SIZE), reader = response.body.getReader()
    let offset = 0
    try { while (true) { const { done, value } = await reader.read(); if (done) break; if (offset + value.length > WASM_SIZE) throw documentError('document_runtime_unavailable'); bytes.set(value, offset); offset += value.length } } finally { await reader.cancel() }
    if (offset !== WASM_SIZE) throw documentError('document_runtime_unavailable')
    const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), b => b.toString(16).padStart(2, '0')).join('')
    if (hash !== WASM_HASH) throw documentError('document_runtime_unavailable')
    const runtime = await createPandocInstance(capWasmMemory(bytes), configureDocumentWasi)
    if (runtime.query({ query: 'version' }) !== '3.10') throw documentError('document_runtime_unavailable')
    return runtime
  } catch { throw documentError('document_runtime_unavailable') }
}


export function assertRuntimeResponse(response) {
  const encoding = response.headers.get('content-encoding')?.trim().toLowerCase()
  const identity = !encoding || encoding === 'identity'
  if (!response.ok || !response.body || (identity && response.headers.get('content-length') && Number(response.headers.get('content-length')) !== WASM_SIZE)) throw documentError('document_runtime_unavailable')
}
