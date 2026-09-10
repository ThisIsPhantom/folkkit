import { PDF_LIMITS } from './pdfEngine.js'
import { toPdfPoint, toPdfVector } from './pdfGeometry.js'

export function objectTransform({ bounds, page, start, end, mode, anchor }) {
  if (Math.hypot(end[0] - start[0], end[1] - start[1]) < 0.1) return null
  if (mode === 'move') {
    const [dx, dy] = toPdfVector([end[0] - start[0], end[1] - start[1]], page)
    return { dx, dy }
  }
  const vector = [start[0] - anchor[0], start[1] - anchor[1]]
  const denominator = vector[0] ** 2 + vector[1] ** 2
  if (!denominator) return null
  const scale = Math.max(0.05, Math.min(10, ((end[0] - anchor[0]) * vector[0] + (end[1] - anchor[1]) * vector[1]) / denominator))
  if (Math.abs(scale - 1) < 0.001) return null
  const fixed = toPdfPoint(anchor, page)
  return { scale, dx: (fixed[0] - bounds[0]) * (1 - scale), dy: (fixed[1] - bounds[1]) * (1 - scale) }
}

export function transformedBounds(bounds, { dx = 0, dy = 0, scale = 1 }) {
  return [bounds[0] + dx, bounds[1] + dy, bounds[0] + dx + (bounds[2] - bounds[0]) * scale, bounds[1] + dy + (bounds[3] - bounds[1]) * scale]
}
export function normalisePages(indices, count) {
  return [...new Set(indices)].filter(index => Number.isInteger(index) && index >= 0 && index < count).sort((a, b) => a - b)
}
export function pageOrder(count, indices, target) {
  const order = Array.from({ length: count }, (_, index) => index)
  const selected = normalisePages(indices, count)
  if (!selected.length || selected.includes(target) || target < 0 || target >= count) return order
  const rest = order.filter(index => !selected.includes(index))
  rest.splice(rest.indexOf(target) + (target > selected.at(-1) ? 1 : 0), 0, ...selected)
  return rest
}


// Editor selections always follow document order, independently of converter output order.
export function parseEditorPages(value, count) {
  if (typeof value !== 'string' || value.length > 1200 || !Number.isInteger(count) || count < 1 || count > PDF_LIMITS.pages) return null
  const pages = new Set()
  for (const part of value.split(',')) {
    const match = part.trim().match(/^(\d+)(?:\s*[-–]\s*(\d+))?$/)
    if (!match) return null
    const start = Number(match[1]), end = Number(match[2] || match[1])
    if (start < 1 || end < start || end > count) return null
    for (let page = start; page <= end; page++) pages.add(page - 1)
  }
  return [...pages].sort((a, b) => a - b)
}

export function formatEditorPages(indices) {
  const parts = []
  for (let index = 0; index < indices.length; index++) {
    const start = indices[index] + 1
    while (index + 1 < indices.length && indices[index + 1] === indices[index] + 1) index++
    const end = indices[index] + 1
    parts.push(start === end ? String(start) : `${start}–${end}`)
  }
  return parts.join(', ')
}
