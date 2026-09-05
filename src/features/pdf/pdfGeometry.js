export function toViewPoint([x, y], page) {
  if (page.viewToPdf) {
    const [a, b, c, d, e, f] = page.viewToPdf
    const determinant = a * d - b * c
    return [(d * (x - e) - c * (y - f)) / determinant, (-b * (x - e) + a * (y - f)) / determinant]
  }
  const { width, height, rotation = 0 } = page
  if (rotation === 1) return [y, x]
  if (rotation === 2) return [width - x, y]
  if (rotation === 3) return [width - y, height - x]
  return [x, height - y]
}
export function toPdfPoint([x, y], page) {
  if (page.viewToPdf) {
    const [a, b, c, d, e, f] = page.viewToPdf
    return [a * x + c * y + e, b * x + d * y + f]
  }
  const { width, height, rotation = 0 } = page
  if (rotation === 1) return [y, x]
  if (rotation === 2) return [width - x, y]
  if (rotation === 3) return [height - y, width - x]
  return [x, height - y]
}
export function viewBounds(bounds, page) {
  const a = toViewPoint([bounds[0], bounds[1]], page)
  const b = toViewPoint([bounds[2], bounds[3]], page)
  return { x: Math.min(a[0], b[0]), y: Math.min(a[1], b[1]), width: Math.max(8, Math.abs(a[0] - b[0])), height: Math.max(8, Math.abs(a[1] - b[1])) }
}

export function appendStrokePoint(points, point) {
  const next = [...points, point]
  if (next.length <= 2000) return next
  return [next[0], ...next.slice(1, -1).filter((_, index) => index % 2 === 0), next.at(-1)]
}

export function prepareStroke(points, page, tool) {
  const aligned = tool === 'underline' && points.length > 1 ? [points[0], [points.at(-1)[0], points[0][1]]] : points
  return aligned.map(point => toPdfPoint(point, page))
}
export function toPdfVector([dx, dy], page) {
  if (page.viewToPdf) {
    const [a, b, c, d] = page.viewToPdf
    return [a * dx + c * dy, b * dx + d * dy]
  }
  const origin = toPdfPoint([0, 0], page), end = toPdfPoint([dx, dy], page)
  return [end[0] - origin[0], end[1] - origin[1]]
}
