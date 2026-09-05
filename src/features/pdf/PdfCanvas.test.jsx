import { expect, test, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import PdfCanvas from './PdfCanvas.jsx'

function setup() {
  const onTransform = vi.fn(), onSelect = vi.fn(), onEdit = vi.fn()
  const object = { index: 0, type: 'text', text: 'Before private text', editable: true, bounds: [40, 50, 100, 90] }
  const result = render(<PdfCanvas frame={null} page={{ width: 300, height: 200 }} objects={[object]} selected={object} onSelect={onSelect} onEdit={onEdit} onTransform={onTransform} tool="select" onPlace={vi.fn()} t={(key, vars) => key === 'selectedObject' ? `${vars.type} ${vars.number}` : key} zoom={100} />)
  const svg = result.container.querySelector('svg')
  svg.getBoundingClientRect = () => ({ left: 0, top: 0, width: 300, height: 200 })
  svg.setPointerCapture = vi.fn(); svg.releasePointerCapture = vi.fn(); svg.hasPointerCapture = () => true
  const target = screen.getByRole('button', { name: /objectText 1/ })
  function pointer(element, type, x, y, id = 1) {
    const event = new Event(type, { bubbles: true })
    Object.assign(event, { clientX: x, clientY: y, pointerId: id, button: 0, isPrimary: true })
    fireEvent(element, event)
  }
  return { ...result, svg, target, pointer, onTransform, onEdit }
}
test('pointer movement previews only, ignores foreign pointers and commits one native transform', () => {
  const { svg, target, pointer, onTransform } = setup()
  pointer(target, 'pointerdown', 60, 120)
  expect(svg.setPointerCapture).toHaveBeenCalledWith(1)
  pointer(svg, 'pointermove', 180, 180, 2)
  pointer(svg, 'pointerup', 180, 180, 2)
  expect(onTransform).not.toHaveBeenCalled()
  pointer(svg, 'pointermove', 90, 140)
  expect(onTransform).not.toHaveBeenCalled()
  pointer(svg, 'pointerup', 90, 140)
  expect(onTransform).toHaveBeenCalledExactlyOnceWith(0, { dx: 30, dy: -20 })
})
test.each(['pointercancel', 'lostpointercapture'])('%s rolls back preview and unchanged gestures make no edit', cancel => {
  const { svg, target, pointer, onTransform } = setup()
  pointer(target, 'pointerdown', 60, 120); pointer(svg, 'pointermove', 90, 140)
  pointer(svg, cancel, 90, 140); pointer(svg, 'pointerup', 90, 140)
  expect(onTransform).not.toHaveBeenCalled()
  pointer(target, 'pointerdown', 60, 120); pointer(svg, 'pointerup', 60, 120)
  expect(onTransform).not.toHaveBeenCalled()
})
test('object accessible name includes a short text start and double click requests text editing', () => {
  const { target, onEdit } = setup()
  expect(target).toHaveAccessibleName('objectText 1: Before private text')
  fireEvent.doubleClick(target)
  expect(onEdit).toHaveBeenCalledTimes(1)
  expect(screen.getAllByRole('button', { name: /resize/ })).toHaveLength(4)
})
