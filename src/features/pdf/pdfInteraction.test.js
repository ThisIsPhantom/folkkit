import { expect, test } from 'vitest'
import * as interaction from './pdfInteraction.js'
import { toPdfPoint, toViewPoint } from './pdfGeometry.js'

test.each([0, 1, 2, 3])('object gesture moves and scales about the opposite screen corner at rotation %s', rotation => {
  const page = { width: 300, height: 220, rotation }
  const bounds = [40, 50, 100, 90]
  const start = [100, 100], end = [130, 120]
  const move = interaction.objectTransform({ bounds, page, start, end, mode: 'move' })
  const origin = toPdfPoint(start, page), target = toPdfPoint(end, page)
  expect(move).toEqual({ dx: target[0] - origin[0], dy: target[1] - origin[1] })
  const anchor = toViewPoint([bounds[0], bounds[1]], page)
  const scale = interaction.objectTransform({ bounds, page, start: [anchor[0] + 60, anchor[1] + 40], end: [anchor[0] + 90, anchor[1] + 60], mode: 'scale', anchor })
  expect(scale.scale).toBeCloseTo(1.5)
  expect(scale.dx).toBeCloseTo(0); expect(scale.dy).toBeCloseTo(0)
  expect(interaction.objectTransform({ bounds, page, start, end: start, mode: 'move' })).toBeNull()
})

test('noncontiguous selection is moved as a block in document order and normalised', () => {
  expect(interaction.pageOrder(5, [3, 1], 0)).toEqual([1, 3, 0, 2, 4])
  expect(interaction.pageOrder(5, [1, 3], 3)).toEqual([0, 1, 2, 3, 4])
  expect(interaction.normalisePages([3, 1, 3, 9, -1], 5)).toEqual([1, 3])
})
