import { fireEvent, render, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ImageCanvas from './ImageCanvas.jsx'
import { addElement, createImageState, transformedBounds, updateElement } from './imageModel.js'

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

  it('keeps the selected crop ratio during a direct pointer resize', () => {
    const onCropDraft = vi.fn(), documentState = createImageState({ width: 600, height: 1200 })
    const result = render(<ImageCanvas active document={documentState} source={{}} resources={new Map()} selectedId={null} onSelect={() => {}} onElementCommit={() => {}} cropDraft={{ x: 0, y: 300, width: 600, height: 600 }} cropAspect={1} onCropDraft={onCropDraft} showCrop renderPreview={async () => {}} t={key => key} />)
    const stage = result.getByRole('application')
    stage.getBoundingClientRect = () => ({ left: 0, top: 0, width: 600, height: 1200, right: 600, bottom: 1200 })
    stage.setPointerCapture = vi.fn(); stage.hasPointerCapture = vi.fn(() => true); stage.releasePointerCapture = vi.fn()
    const resize = result.getByRole('button', { name: 'studioImage.cropResize' })
    fireEvent.pointerDown(resize, { pointerId: 1, button: 0, isPrimary: true, clientX: 600, clientY: 900 })
    fireEvent.pointerMove(stage, { pointerId: 1, clientX: 300, clientY: 900 })
    fireEvent.pointerUp(stage, { pointerId: 1, clientX: 300, clientY: 900 })
    expect(onCropDraft).toHaveBeenCalledWith({ x: 0, y: 300, width: 300, height: 300 })
  })
})


it('previews draft element geometry without committing, then restores it on Escape', async () => {
  const renderPreview = vi.fn(async () => {}), commit = vi.fn(), model = imageDocument()
  const view = render(<ImageCanvas document={model} source={{}} resources={new Map()} selectedId="caption" onElementCommit={commit} renderPreview={renderPreview} t={key => key} />)
  const stage = view.getByRole('application')
  stage.getBoundingClientRect = () => ({ left: 0, top: 0, width: 300, height: 200 })
  fireEvent.pointerDown(view.getByRole('button', { name: 'studioImage.element' }), { pointerId: 1, button: 0, isPrimary: true, clientX: 60, clientY: 50 })
  fireEvent.pointerMove(stage, { pointerId: 1, clientX: 90, clientY: 70 })
  await waitFor(() => expect(transformedBounds(renderPreview.mock.calls.at(-1)[0].document.elements[0])).toMatchObject({ x: 80, y: 60 }))
  expect(commit).not.toHaveBeenCalled()
  expect(transformedBounds(model.elements[0])).toMatchObject({ x: 50, y: 40 })
  fireEvent.keyDown(document, { key: 'Escape' })
  await waitFor(() => expect(transformedBounds(renderPreview.mock.calls.at(-1)[0].document.elements[0])).toMatchObject({ x: 50, y: 40 }))
  fireEvent.pointerUp(stage, { pointerId: 1 })
  expect(commit).not.toHaveBeenCalled()
})


it('discards unfinished geometry when hidden or when the document changes', async () => {
  const commit = vi.fn(), renderPreview = vi.fn(async () => {}), source = {}, resources = new Map(), model = imageDocument()
  const props = { source, resources, selectedId: 'caption', onElementCommit: commit, renderPreview, t: key => key }
  const view = render(<ImageCanvas {...props} active document={model} />)
  const stage = view.getByRole('application')
  stage.getBoundingClientRect = () => ({ left: 0, top: 0, width: 300, height: 200 })
  const target = view.getByRole('button', { name: 'studioImage.element' })
  const begin = () => { fireEvent.pointerDown(target, { pointerId: 1, button: 0, isPrimary: true, clientX: 60, clientY: 50 }); fireEvent.pointerMove(stage, { pointerId: 1, clientX: 90, clientY: 70 }) }
  begin()
  view.rerender(<ImageCanvas {...props} active={false} document={model} />)
  view.rerender(<ImageCanvas {...props} active document={model} />)
  expect(target.parentElement.style.getPropertyValue('--image-left')).toBe(`${50 / 300 * 100}%`)
  fireEvent.pointerUp(stage, { pointerId: 1 }); expect(commit).not.toHaveBeenCalled()
  begin()
  const changed = updateElement(model, 'caption', { x: 10 })
  view.rerender(<ImageCanvas {...props} active document={changed} />)
  fireEvent.pointerUp(stage, { pointerId: 1 }); expect(commit).not.toHaveBeenCalled()
  await waitFor(() => expect(transformedBounds(renderPreview.mock.calls.at(-1)[0].document.elements[0]).x).toBe(10))
})
