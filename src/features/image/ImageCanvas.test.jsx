import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ImageCanvas from './ImageCanvas.jsx'
import { addElement, createImageState } from './imageModel.js'

function imageDocument() {
  return addElement(createImageState({ width: 300, height: 200 }), {
    id: 'caption', type: 'text', text: 'Text', x: 50, y: 40, width: 80, height: 30,
    fontSize: 20, color: '#111111', opacity: 1,
  })
}

describe('image canvas gestures', () => {
  it('commits one primary-pointer drag and ignores foreign pointer endings', () => {
    const onElementCommit = vi.fn(), renderPreview = vi.fn(async () => {})
    const t = (key, vars) => key === 'studioImage.element' ? `element.${vars.name}` : key
    const result = render(<ImageCanvas active document={imageDocument()} source={{}} resources={new Map()} selectedId="caption" onSelect={() => {}} onElementCommit={onElementCommit} renderPreview={renderPreview} t={t} />)
    const stage = result.getByRole('application')
    stage.getBoundingClientRect = () => ({ left: 0, top: 0, width: 300, height: 200, right: 300, bottom: 200 })
    stage.setPointerCapture = vi.fn(); stage.hasPointerCapture = vi.fn(() => true); stage.releasePointerCapture = vi.fn()
    const element = result.getByRole('button', { name: 'element.Text' })

    fireEvent.pointerDown(element, { pointerId: 1, button: 0, isPrimary: true, clientX: 60, clientY: 50 })
    fireEvent.pointerMove(stage, { pointerId: 1, clientX: 90, clientY: 70 })
    fireEvent.pointerUp(stage, { pointerId: 2, clientX: 90, clientY: 70 })
    expect(onElementCommit).not.toHaveBeenCalled()
    fireEvent.pointerUp(stage, { pointerId: 1, clientX: 90, clientY: 70 })
    expect(onElementCommit).toHaveBeenCalledOnce()
    expect(onElementCommit).toHaveBeenCalledWith('caption', { x: 80, y: 60 })
  })

  it('cancels a gesture from document Escape without committing and ignores Escape while inactive', () => {
    const onElementCommit = vi.fn(), onSelect = vi.fn()
    const t = (key, vars) => key === 'studioImage.element' ? `element.${vars.name}` : key
    const result = render(<ImageCanvas active document={imageDocument()} source={{}} resources={new Map()} selectedId="caption" onSelect={onSelect} onElementCommit={onElementCommit} renderPreview={async () => {}} t={t} />)
    const stage = result.getByRole('application')
    stage.getBoundingClientRect = () => ({ left: 0, top: 0, width: 300, height: 200, right: 300, bottom: 200 })
    stage.setPointerCapture = vi.fn(); stage.hasPointerCapture = vi.fn(() => true); stage.releasePointerCapture = vi.fn()
    fireEvent.pointerDown(result.getByRole('button', { name: 'element.Text' }), { pointerId: 1, button: 0, isPrimary: true, clientX: 60, clientY: 50 })
    fireEvent.pointerMove(stage, { pointerId: 1, clientX: 90, clientY: 70 })
    fireEvent.keyDown(document, { key: 'Escape' })
    fireEvent.pointerUp(stage, { pointerId: 1, clientX: 90, clientY: 70 })
    expect(onElementCommit).not.toHaveBeenCalled()

    const selections = onSelect.mock.calls.length
    result.rerender(<ImageCanvas active={false} document={imageDocument()} source={{}} resources={new Map()} selectedId="caption" onSelect={onSelect} onElementCommit={onElementCommit} renderPreview={async () => {}} t={t} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onSelect).toHaveBeenCalledTimes(selections)
  })
})
