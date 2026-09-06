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
