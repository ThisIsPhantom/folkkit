import { describe, expect, it } from 'vitest'
import {
  IMAGE_LIMITS,
  addElement,
  applyCrop,
  assertImageDescriptor,
  commitHistory,
  commitResourceElement,
  createHistory,
  createImageState,
  mapSourcePixel,
  mirrorState,
  redoHistory,
  referencedResourceBytes,
  rotateState,
  transformedBounds,
  undoHistory,
  updateElement,
  updateCropField,
} from './imageModel.js'

describe('image geometry', () => {
  it('maps a non-square cropped source and an off-centre overlay through clockwise rotation and mirroring', () => {
    let state = createImageState({ width: 300, height: 200 })
    state = addElement(state, {
      id: 'caption', type: 'text', text: 'edge', x: 60, y: 30, width: 20, height: 10,
      fontSize: 10, color: '#111111', opacity: 1,
    })
    state = applyCrop(state, { x: 50, y: 20, width: 100, height: 80 })
    state = rotateState(state, 1)

    expect({ width: state.width, height: state.height }).toEqual({ width: 80, height: 100 })
    expect(mapSourcePixel(state, { x: 50, y: 20 })).toEqual({ x: 79, y: 0 })
    expect(transformedBounds(state.elements[0])).toEqual({ x: 60, y: 10, width: 10, height: 20 })

    state = mirrorState(state, 'horizontal')
    expect(mapSourcePixel(state, { x: 50, y: 20 })).toEqual({ x: 0, y: 0 })
    expect(transformedBounds(state.elements[0])).toEqual({ x: 10, y: 10, width: 10, height: 20 })
  })

  it('keeps a non-square watermark transform aligned through vertical mirror and rotation', () => {
    let state = createImageState({ width: 320, height: 180 })
    state = addElement(state, {
      id: 'mark', type: 'image', resourceId: 'wm', x: 230, y: 110, width: 60, height: 30, opacity: 0.5,
    })
    state = mirrorState(state, 'vertical')
    state = rotateState(state, 1)
    expect({ width: state.width, height: state.height }).toEqual({ width: 180, height: 320 })
    expect(transformedBounds(state.elements[0])).toEqual({ x: 110, y: 230, width: 30, height: 60 })
  })

  it('treats inspector width and height as current canvas bounds after a quarter rotation', () => {
    let state = createImageState({ width: 320, height: 180 })
    state = addElement(state, { id: 'mark', type: 'image', resourceId: 'wm', x: 230, y: 110, width: 60, height: 30, opacity: 1 })
    state = rotateState(state, 1)
    expect(transformedBounds(state.elements[0])).toEqual({ x: 40, y: 230, width: 30, height: 60 })
    state = updateElement(state, 'mark', { width: 60, height: 30 })
    expect(transformedBounds(state.elements[0])).toEqual({ x: 40, y: 230, width: 60, height: 30 })
  })

  it('keeps an active crop ratio when width or height changes', () => {
    const bounds = { width: 600, height: 1200 }
    const square = { x: 0, y: 300, width: 600, height: 600 }
    expect(updateCropField(square, bounds, 1, 'width', 300)).toEqual({ x: 0, y: 300, width: 300, height: 300 })
    expect(updateCropField(square, bounds, 1, 'height', 240)).toEqual({ x: 0, y: 300, width: 240, height: 240 })
    expect(updateCropField({ x: 10, y: 10, width: 400, height: 300 }, { width: 500, height: 330 }, 4 / 3, 'width', 500)).toEqual({ x: 10, y: 10, width: 427, height: 320 })
  })
})

describe('image limits and history', () => {
  it('enforces original and watermark byte, pixel and axis limits before decode', () => {
    expect(assertImageDescriptor({ size: IMAGE_LIMITS.originalBytes, width: 6000, height: 4000 }, 'original')).toEqual({ size: IMAGE_LIMITS.originalBytes, width: 6000, height: 4000 })
    expect(() => assertImageDescriptor({ size: IMAGE_LIMITS.originalBytes + 1, width: 1, height: 1 }, 'original')).toThrow('resource_limit')
    expect(() => assertImageDescriptor({ size: 1, width: 8193, height: 1 }, 'original')).toThrow('resource_limit')
    expect(() => assertImageDescriptor({ size: 1, width: 6001, height: 4000 }, 'original')).toThrow('resource_limit')
    expect(() => assertImageDescriptor({ size: IMAGE_LIMITS.watermarkBytes + 1, width: 1, height: 1 }, 'watermark')).toThrow('resource_limit')
    expect(() => assertImageDescriptor({ size: 1, width: 2001, height: 2000 }, 'watermark')).toThrow('resource_limit')
  })

  it('keeps at most 30 metadata undo states and never copies resource files into snapshots', () => {
    let history = createHistory(createImageState({ width: 300, height: 200 }))
    for (let index = 0; index < 35; index += 1) {
      history = commitHistory(history, { ...history.present, cropDraft: { x: index, y: 0, width: 100, height: 80 } })
    }
    expect(history.past).toHaveLength(30)
    expect(history.present.cropDraft.x).toBe(34)
    expect(JSON.stringify(history)).not.toContain('File')
    history = undoHistory(history)
    expect(history.present.cropDraft.x).toBe(33)
    history = redoHistory(history)
    expect(history.present.cropDraft.x).toBe(34)
  })

  it('counts unique watermark files referenced anywhere in undo and redo and rejects only the new upload', () => {
    const registry = new Map([
      ['a', { file: { size: 20 * 1024 * 1024 } }],
      ['b', { file: { size: 12 * 1024 * 1024 } }],
      ['c', { file: { size: 1 } }],
    ])
    const initial = addElement(createImageState({ width: 100, height: 80 }), { id: 'a1', type: 'image', resourceId: 'a', x: 0, y: 0, width: 10, height: 10, opacity: 1 })
    let history = createHistory(initial)
    history = commitHistory(history, addElement(history.present, { id: 'b1', type: 'image', resourceId: 'b', x: 10, y: 10, width: 10, height: 10, opacity: 1 }))
    history = undoHistory(history)

    expect(referencedResourceBytes(history, registry)).toBe(32 * 1024 * 1024)
    expect(() => referencedResourceBytes(history, registry, { id: 'c', file: registry.get('c').file })).toThrow('watermark_budget')
    expect(history.present.elements.map(item => item.resourceId)).toEqual(['a'])
  })

  it('rejects a twenty-first element and text longer than 500 characters', () => {
    let state = createImageState({ width: 100, height: 80 })
    for (let index = 0; index < 20; index += 1) {
      state = addElement(state, { id: String(index), type: 'text', text: 'x', x: 0, y: 0, width: 10, height: 10, fontSize: 10, color: '#111111', opacity: 1 })
    }
    expect(() => addElement(state, { id: '20', type: 'text', text: 'x', x: 0, y: 0, width: 10, height: 10, fontSize: 10, color: '#111111', opacity: 1 })).toThrow('element_limit')
    expect(() => addElement(createImageState({ width: 10, height: 10 }), { id: 'long', type: 'text', text: 'x'.repeat(501), x: 0, y: 0, width: 10, height: 10, fontSize: 10, color: '#111111', opacity: 1 })).toThrow('text_limit')
  })

  it('registers a watermark only with its successful history commit and reuses one resource for duplicates', () => {
    let state = createImageState({ width: 100, height: 80 })
    for (let index = 0; index < 20; index += 1) state = addElement(state, { id: String(index), type: 'text', text: 'x', x: 0, y: 0, width: 10, height: 10, fontSize: 10, color: '#111111', opacity: 1 })
    const full = createHistory(state), emptyRegistry = new Map()
    const resource = { id: 'wm', file: { size: 8 * 1024 * 1024 }, name: 'mark.png', width: 20, height: 10 }
    expect(() => commitResourceElement(full, emptyRegistry, resource, { id: 'failed', x: 0, y: 0, width: 20, height: 10, opacity: 1 })).toThrow('element_limit')
    expect(emptyRegistry.size).toBe(0)

    const available = createHistory(createImageState({ width: 100, height: 80 }))
    const first = commitResourceElement(available, emptyRegistry, resource, { id: 'first', x: 0, y: 0, width: 20, height: 10, opacity: 1 })
    const second = commitResourceElement(first.history, first.resources, resource, { id: 'second', x: 20, y: 20, width: 20, height: 10, opacity: 1 })
    expect(second.resources.size).toBe(1)
    expect(second.history.present.elements.map(element => element.resourceId)).toEqual(['wm', 'wm'])
  })
})


import * as imageModel from './imageModel.js'

describe('image layer duplication and ordering', () => {
  it('duplicates transformed text without changing its style or the original matrix', () => {
    expect(imageModel.duplicateElement).toBeTypeOf('function')
    let state = addElement(createImageState({ width: 300, height: 200 }), {
      id: 'text', type: 'text', text: 'Title', x: 50, y: 40, width: 80, height: 30,
      fontSize: 22, color: '#166534', opacity: .4,
    })
    state = rotateState(mirrorState(state, 'horizontal'))
    const original = structuredClone(state)
    const copy = imageModel.duplicateElement(state, 'text', 'copy')
    expect(state).toEqual(original)
    expect(copy.elements[1]).toMatchObject({ id: 'copy', text: 'Title', fontSize: 22, color: '#166534', opacity: .4 })
    expect(copy.elements[1].matrix.slice(0, 4)).toEqual(state.elements[0].matrix.slice(0, 4))
    expect(copy.elements[1].matrix).not.toBe(state.elements[0].matrix)
    const bounds = transformedBounds(state.elements[0]), copiedBounds = transformedBounds(copy.elements[1])
    expect(copiedBounds).toEqual({ ...bounds, x: bounds.x + 16, y: Math.min(bounds.y + 16, state.height - bounds.height) })
    expect(copy.selectedId).toBe('copy')
    expect(copy.dirty).toBe(true)
  })

  it('keeps a duplicated watermark inside the image and reuses its resource through undo/redo', () => {
    expect(imageModel.duplicateElement).toBeTypeOf('function')
    const state = addElement(createImageState({ width: 100, height: 80 }), { id: 'mark', type: 'image', resourceId: 'wm', x: 75, y: 55, width: 20, height: 20, opacity: .75 })
    const copied = imageModel.duplicateElement(state, 'mark', 'copy')
    expect(transformedBounds(copied.elements[1])).toEqual({ x: 80, y: 60, width: 20, height: 20 })
    const registry = new Map([['wm', { file: { size: 1024 } }]])
    const history = commitHistory(createHistory(state), copied)
    expect(referencedResourceBytes(history, registry)).toBe(1024)
    expect(undoHistory(history).present.elements).toHaveLength(1)
    expect(redoHistory(undoHistory(history)).present.elements).toEqual(copied.elements)
  })

  it('moves a layer one step while preserving geometry, selection and boundary no-ops', () => {
    expect(imageModel.moveElement).toBeTypeOf('function')
    let state = createImageState({ width: 100, height: 80 })
    for (const id of ['a', 'b', 'c']) state = addElement(state, { id, type: 'image', resourceId: id, x: 5, y: 10, width: 20, height: 20, opacity: .6 })
    state = { ...state, selectedId: 'b' }
    const moved = imageModel.moveElement(state, 'b', 1)
    expect(moved.elements.map(element => element.id)).toEqual(['a', 'c', 'b'])
    expect(moved.selectedId).toBe('b')
    expect(moved.elements[2]).toEqual(state.elements[1])
    expect(moved.elements[2].matrix).not.toBe(state.elements[1].matrix)
    expect(imageModel.moveElement(moved, 'b', 1)).toBe(moved)
    expect(imageModel.moveElement(state, 'a', -1)).toBe(state)
    expect(imageModel.moveElement(moved, 'b', -1).elements.map(element => element.id)).toEqual(['a', 'b', 'c'])
    expect(() => imageModel.moveElement(state, 'b', 2)).toThrow('invalid_settings')
  })

  it('keeps the existing twenty-element limit when duplicating', () => {
    expect(imageModel.duplicateElement).toBeTypeOf('function')
    let state = addElement(createImageState({ width: 100, height: 80 }), { id: 'a', type: 'image', resourceId: 'wm', x: 0, y: 0, width: 10, height: 10 })
    for (let index = 1; index < IMAGE_LIMITS.elements; index++) state = imageModel.duplicateElement(state, 'a', String(index))
    expect(() => imageModel.duplicateElement(state, 'a', 'extra')).toThrow('element_limit')
    expect(state.elements).toHaveLength(20)
  })
})
