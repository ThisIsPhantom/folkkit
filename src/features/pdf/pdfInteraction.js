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
