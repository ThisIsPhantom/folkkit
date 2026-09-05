import { CONVERT_LIMITS, IMAGE_FORMATS, conversionError, targetsFor } from './profiles.js'
import { detectFile } from './detection.js'

export function uniqueFilename(name, used) {
  const safe = Array.from(String(name || 'result'), character => character.charCodeAt(0) < 32 ? '_' : character).join('').replace(/\.{2,}/g, '').replace(/[\\/<>:"|?*]/g, '_').replace(/^\.+/, '').slice(0, 180) || 'result'
  const dot = safe.lastIndexOf('.')
  const stem = dot > 0 ? safe.slice(0, dot) : safe, extension = dot > 0 ? safe.slice(dot) : ''
  let candidate = safe, number = 1
  while (used.has(candidate.toLowerCase())) candidate = `${stem} (${++number})${extension}`
  used.add(candidate.toLowerCase())
  return candidate
}
const knownErrors = new Set(['unsupported_type','type_mismatch','unsupported_pair','too_large','resource_limit','invalid_file','invalid_settings','unsupported_codec','invalid_pages','invalid_clip','no_audio','media_runtime_unavailable','conversion_failed','cancelled'])
function errorCode(error) { const code = error?.code || error?.message; return knownErrors.has(code) ? code : 'conversion_failed' }

export function createConversionQueue({ detect = detectFile, convert } = {}) {
  let items = [], running = false, controller = null, nextId = 0, disposed = false, adding = 0
  const listeners = new Set()
  const snapshot = () => ({ items: [...items], running, adding: adding > 0 })
  const emit = () => { if (!disposed) for (const listener of listeners) listener(snapshot()) }
  const update = (id, patch) => { items = items.map(item => item.id === id ? { ...item, ...patch } : item); emit() }
  function invalidateCombined(id) {
    const item = items.find(row => row.id === id)
    const leader = item?.combinedWith || (items.some(row => row.combinedWith === id) ? id : null)
    if (!leader) return
    items = items.map(row => row.id === leader || row.combinedWith === leader
      ? { ...row, status:'ready', results:[], progress:null, error:null, combinedWith:null }
      : row)
  }
  async function add(files) {
    if (running || disposed) return
    const selected = Array.from(files)
    if (items.length + selected.length > CONVERT_LIMITS.maxFiles) throw conversionError('resource_limit')
    if ([...items.map(item => item.file), ...selected].reduce((n, file) => n + file.size, 0) > CONVERT_LIMITS.totalInput) throw conversionError('too_large')
    const rows = selected.map(file => ({ id: ++nextId, file, from: null, target: '', status: 'detecting', settings: {}, progress: null, results: [], error: null }))
    items = [...items, ...rows]; adding++; emit()
    try {
      for (const row of rows) {
        try {
          const from = await detect(row.file)
          update(row.id, { from, target: targetsFor(from)[0] || '', status: 'ready' })
        } catch (error) { update(row.id, { status: 'error', error: errorCode(error) }) }
      }
    } finally { adding--; emit() }
  }
  function configure(id, patch) {
    if (running) return
    const item = items.find(item => item.id === id)
    if (!item?.from) return
    if (patch.target && !targetsFor(item.from).includes(patch.target)) return
    invalidateCombined(id)
    update(id, { ...patch, status: 'ready', results: [], progress: null, error: null })
  }
  async function start({ combineImages = false } = {}) {
    if (running || adding || disposed) return
    running = true; controller = new AbortController(); emit()
    const signal = controller.signal
    const used = new Set(items.flatMap(item => item.results.map(result => result.name.toLowerCase())))
    let bytes = items.flatMap(item => item.results).reduce((sum, result) => sum + result.blob.size, 0)
    try {
      const pending = items.filter(item => item.status === 'ready')
      const group = combineImages && pending.length > 1 && pending.every(item => IMAGE_FORMATS.includes(item.from) && item.target === 'pdf') ? pending : null
      for (const item of group ? [group[0]] : pending) {
        if (signal.aborted) break
        update(item.id, { status: 'running', progress: null, error: null })
        try {
          const results = await convert(group ? { ...item, combinedFiles: group.map(row => row.file), combinedSettings: group.map(row => row.settings) } : item, { signal, onProgress: progress => { if (!signal.aborted) update(item.id, { progress: Math.max(0, Math.min(100, Math.round(progress))) }) } })
          if (signal.aborted) throw conversionError('cancelled')
          const size = results.reduce((sum, result) => sum + result.blob.size, 0)
          if (size > CONVERT_LIMITS.output || bytes + size > CONVERT_LIMITS.totalOutput) throw conversionError('resource_limit')
          bytes += size
          update(item.id, { status: 'done', progress: 100, results: results.map(result => ({ ...result, name: uniqueFilename(result.name, used) })) })
          if (group) for (const row of group.slice(1)) update(row.id, { status: 'done', progress: 100, results: [], combinedWith: item.id })
        } catch (error) { update(item.id, { status: signal.aborted ? 'cancelled' : 'error', error: signal.aborted ? 'cancelled' : errorCode(error), progress: null }) }
      }
    } finally { running = false; controller = null; emit() }
  }
  return Object.freeze({ snapshot, add, start, configure,
    subscribe(listener) { disposed = false; listeners.add(listener); return () => listeners.delete(listener) },
    cancel() { controller?.abort() },
    retry(id) { const item = items.find(item => item.id === id); if (item?.from && ['error','cancelled'].includes(item.status)) configure(id, {}) },
    remove(id) { if (!running) { invalidateCombined(id); items = items.filter(item => item.id !== id); emit() } },
    move(id, direction) { if (running) return; const index = items.findIndex(item => item.id === id), target = index + direction; if (index < 0 || target < 0 || target >= items.length) return; invalidateCombined(id); items = [...items]; [items[index], items[target]] = [items[target], items[index]]; emit() },
    clear() { if (!running) { items = []; emit() } },
    dispose() { disposed = true; controller?.abort(); items = []; listeners.clear() },
  })
}
