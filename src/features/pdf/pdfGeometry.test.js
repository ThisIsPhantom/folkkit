import { expect, test } from 'vitest'

test('maps canvas positions to PDF space and back through all page rotations', async () => {
  const modulePath = './pdfGeometry.js'
  const geometry = await import(/* @vite-ignore */ modulePath).catch(() => null)
  expect(geometry?.toPdfPoint).toBeTypeOf('function')
  for (let rotation = 0; rotation < 4; rotation++) {
    const page = { rotation, width: rotation % 2 ? 800 : 600, height: rotation % 2 ? 600 : 800 }
    for (const point of [[0, 0], [40, 100], [page.width, page.height]]) {
      expect(geometry.toViewPoint(geometry.toPdfPoint(point, page), page)).toEqual(point)
    }
  }
})

test('long freehand strokes retain their beginning and endpoint within the point budget', async () => {
  const geometry = await import('./pdfGeometry.js')
  expect(geometry.appendStrokePoint).toBeTypeOf('function')
  let points = [[0, 0]]
  for (let index = 1; index < 10000; index++) points = geometry.appendStrokePoint(points, [index, index % 31])
  expect(points.length).toBeLessThanOrEqual(2000)
  expect(points[0]).toEqual([0, 0])
  expect(points.at(-1)).toEqual([9999, 9999 % 31])
})

test('horizontal viewport underlines and movement vectors use native rotated crop matrices', async () => {
  const geometry = await import('./pdfGeometry.js')
  expect(geometry.prepareStroke).toBeTypeOf('function')
  expect(geometry.toPdfVector).toBeTypeOf('function')
  for (const matrix of [[0, 1, 1, 0, 20, 30], [-1, 0, 0, 1, 320, 30], [0, -1, -1, 0, 320, 230]]) {
    const page = { width: 300, height: 200, viewToPdf: matrix }
    const points = geometry.prepareStroke([[40, 50], [140, 80]], page, 'underline')
    const first = geometry.toViewPoint(points[0], page), last = geometry.toViewPoint(points.at(-1), page)
    expect(first[0]).toBeCloseTo(40); expect(first[1]).toBeCloseTo(50)
    expect(last[0]).toBeCloseTo(140); expect(last[1]).toBeCloseTo(50)
    for (const vector of [[10, 0], [-10, 0], [0, 10], [0, -10]]) {
      const origin = geometry.toPdfPoint([40, 50], page)
      const delta = geometry.toPdfVector(vector, page)
      const moved = geometry.toViewPoint([origin[0] + delta[0], origin[1] + delta[1]], page)
      expect(moved[0]).toBeCloseTo(40 + vector[0]); expect(moved[1]).toBeCloseTo(50 + vector[1])
    }
  }
})
