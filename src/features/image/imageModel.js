export const IMAGE_LIMITS = Object.freeze({
  originalBytes: 32 * 1024 * 1024,
  originalPixels: 24_000_000,
  maxAxis: 8192,
  watermarkBytes: 8 * 1024 * 1024,
  watermarkPixels: 4_000_000,
  watermarkAggregateBytes: 32 * 1024 * 1024,
  outputBytes: 64 * 1024 * 1024,
  historyStates: 30,
  elements: 20,
  textCharacters: 500,
  previewAxis: 1600,
  timeoutMs: 120_000,
})

export function imageError(code = 'invalid_file') {
  return Object.assign(new Error(code), { code })
}

export const identityMatrix = () => [1, 0, 0, 1, 0, 0]

export function multiplyMatrix(left, right) {
  const [a, b, c, d, e, f] = left
  const [g, h, i, j, k, l] = right
  return [
    a * g + c * h,
    b * g + d * h,
    a * i + c * j,
    b * i + d * j,
    a * k + c * l + e,
    b * k + d * l + f,
  ].map(value => Object.is(value, -0) ? 0 : value)
}

export function transformPoint(matrix, point) {
  return {
    x: matrix[0] * point.x + matrix[2] * point.y + matrix[4],
    y: matrix[1] * point.x + matrix[3] * point.y + matrix[5],
  }
}

function cleanNumber(value) {
  const rounded = Math.round(value * 1e8) / 1e8
  return Object.is(rounded, -0) ? 0 : rounded
}

export function transformedBounds(element) {
  const points = [
    transformPoint(element.matrix, { x: 0, y: 0 }),
    transformPoint(element.matrix, { x: element.width, y: 0 }),
    transformPoint(element.matrix, { x: 0, y: element.height }),
    transformPoint(element.matrix, { x: element.width, y: element.height }),
  ]
  const xs = points.map(point => point.x), ys = points.map(point => point.y)
  const left = Math.min(...xs), top = Math.min(...ys)
  return {
    x: cleanNumber(left), y: cleanNumber(top),
    width: cleanNumber(Math.max(...xs) - left), height: cleanNumber(Math.max(...ys) - top),
  }
}

export function assertImageDescriptor(descriptor, role = 'original') {
  const { size, width, height } = descriptor || {}
  const bytes = role === 'watermark' ? IMAGE_LIMITS.watermarkBytes : IMAGE_LIMITS.originalBytes
  const pixels = role === 'watermark' ? IMAGE_LIMITS.watermarkPixels : IMAGE_LIMITS.originalPixels
  if (!Number.isSafeInteger(size) || size < 1 || size > bytes
    || !Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1
    || width > IMAGE_LIMITS.maxAxis || height > IMAGE_LIMITS.maxAxis
    || !Number.isSafeInteger(width * height) || width * height > pixels) {
    throw imageError('resource_limit')
  }
  return { size, width, height }
}

export function createImageState({ width, height }) {
  assertImageDescriptor({ size: 1, width, height }, 'original')
  return {
    width,
    height,
    sourceTransform: identityMatrix(),
    elements: [],
    selectedId: null,
    cropDraft: { x: 0, y: 0, width, height },
    dirty: false,
  }
}

function cloneState(state) {
  return {
    ...state,
    sourceTransform: [...state.sourceTransform],
    cropDraft: { ...state.cropDraft },
    elements: state.elements.map(element => ({ ...element, matrix: [...element.matrix] })),
  }
}

function normalizeElement(input) {
  if (!input || !['text', 'image'].includes(input.type) || typeof input.id !== 'string' || !input.id) throw imageError()
  if (input.type === 'text' && (typeof input.text !== 'string' || input.text.length > IMAGE_LIMITS.textCharacters)) throw imageError('text_limit')
  if (input.type === 'image' && (typeof input.resourceId !== 'string' || !input.resourceId)) throw imageError()
  const width = Number(input.width), height = Number(input.height), x = Number(input.x ?? 0), y = Number(input.y ?? 0)
  const opacity = Number(input.opacity ?? 1)
  if (![width, height, x, y, opacity].every(Number.isFinite) || width <= 0 || height <= 0 || opacity < 0 || opacity > 1) throw imageError('invalid_settings')
  if (input.type === 'text' && (!Number.isFinite(Number(input.fontSize)) || Number(input.fontSize) < 6 || Number(input.fontSize) > 512)) throw imageError('invalid_settings')
  return {
    ...input,
    width,
    height,
    opacity,
    matrix: input.matrix ? [...input.matrix] : [1, 0, 0, 1, x, y],
    ...(input.type === 'text' ? { color: input.color || '#111111', fontSize: Number(input.fontSize) } : {}),
  }
}

export function addElement(state, input) {
  if (state.elements.length >= IMAGE_LIMITS.elements) throw imageError('element_limit')
  if (state.elements.some(element => element.id === input?.id)) throw imageError('invalid_settings')
  const element = normalizeElement(input)
  return { ...cloneState(state), elements: [...state.elements.map(item => ({ ...item, matrix: [...item.matrix] })), element], selectedId: element.id, dirty: true }
}

export function updateElement(state, id, changes) {
  let found = false
  const elements = state.elements.map((element) => {
    if (element.id !== id) return { ...element, matrix: [...element.matrix] }
    found = true
    const next = { ...element, ...changes, id: element.id, type: element.type }
    const bounds = transformedBounds(element)
    if ('width' in changes || 'height' in changes) {
      const targetWidth = Number(changes.width ?? bounds.width), targetHeight = Number(changes.height ?? bounds.height)
      const [a, b, c, d] = element.matrix.map(Math.abs)
      if (a >= c) {
        next.width = targetWidth / (a || 1)
        next.height = targetHeight / (d || 1)
      } else {
        next.height = targetWidth / (c || 1)
        next.width = targetHeight / (b || 1)
      }
    }
    let normalized = normalizeElement(next)
    if ('x' in changes || 'y' in changes || 'width' in changes || 'height' in changes) {
      const resizedBounds = transformedBounds(normalized)
      const dx = Number(changes.x ?? bounds.x) - resizedBounds.x, dy = Number(changes.y ?? bounds.y) - resizedBounds.y
      normalized = { ...normalized, matrix: multiplyMatrix([1, 0, 0, 1, dx, dy], normalized.matrix) }
    }
    delete normalized.x; delete normalized.y
    return normalized
  })
  if (!found) throw imageError('invalid_settings')
  return { ...cloneState(state), elements, dirty: true }
}

export function removeElement(state, id) {
  if (!state.elements.some(element => element.id === id)) return state
  return { ...cloneState(state), elements: state.elements.filter(element => element.id !== id).map(element => ({ ...element, matrix: [...element.matrix] })), selectedId: state.selectedId === id ? null : state.selectedId, dirty: true }
}

export function centreElement(state, id) {
  const element = state.elements.find(item => item.id === id)
  if (!element) return state
  const bounds = transformedBounds(element)
  return updateElement(state, id, { x: (state.width - bounds.width) / 2, y: (state.height - bounds.height) / 2 })
}

export function resizeElement(state, id, width, height) {
  return updateElement(state, id, { width: Math.max(1, Number(width)), height: Math.max(1, Number(height)) })
}

function transformState(state, operation, width, height) {
  const elements = state.elements.map(element => ({ ...element, matrix: multiplyMatrix(operation, element.matrix) }))
  return {
    ...cloneState(state), width, height,
    sourceTransform: multiplyMatrix(operation, state.sourceTransform),
    elements,
    cropDraft: { x: 0, y: 0, width, height },
    dirty: true,
  }
}

export function applyCrop(state, crop) {
  const x = Number(crop?.x), y = Number(crop?.y), width = Number(crop?.width), height = Number(crop?.height)
  if (![x, y, width, height].every(Number.isInteger) || x < 0 || y < 0 || width < 1 || height < 1 || x + width > state.width || y + height > state.height) throw imageError('invalid_crop')
  if (x === 0 && y === 0 && width === state.width && height === state.height) return state
  return transformState(state, [1, 0, 0, 1, -x, -y], width, height)
}

export function rotateState(state, quarterTurns = 1) {
  let next = state
  const turns = ((Number(quarterTurns) % 4) + 4) % 4
  if (!Number.isInteger(turns)) throw imageError('invalid_settings')
  for (let turn = 0; turn < turns; turn += 1) {
    next = transformState(next, [0, 1, -1, 0, next.height, 0], next.height, next.width)
  }
  return next
}

export function mirrorState(state, axis) {
  if (axis === 'horizontal') return transformState(state, [-1, 0, 0, 1, state.width, 0], state.width, state.height)
  if (axis === 'vertical') return transformState(state, [1, 0, 0, -1, 0, state.height], state.width, state.height)
  throw imageError('invalid_settings')
}

export function mapSourcePixel(state, point) {
  const mapped = transformPoint(state.sourceTransform, { x: Number(point.x) + 0.5, y: Number(point.y) + 0.5 })
  return { x: Math.floor(mapped.x), y: Math.floor(mapped.y) }
}

export function createHistory(initial) {
  return { past: [], present: cloneState(initial), future: [] }
}

export function commitHistory(history, next) {
  return {
    past: [...history.past, cloneState(history.present)].slice(-IMAGE_LIMITS.historyStates),
    present: cloneState(next),
    future: [],
  }
}

export function undoHistory(history) {
  if (!history.past.length) return history
  return {
    past: history.past.slice(0, -1),
    present: cloneState(history.past.at(-1)),
    future: [cloneState(history.present), ...history.future].slice(0, IMAGE_LIMITS.historyStates),
  }
}

export function redoHistory(history) {
  if (!history.future.length) return history
  return {
    past: [...history.past, cloneState(history.present)].slice(-IMAGE_LIMITS.historyStates),
    present: cloneState(history.future[0]),
    future: history.future.slice(1),
  }
}

export function referencedResourceIds(history) {
  const ids = new Set()
  for (const state of [...history.past, history.present, ...history.future]) {
    for (const element of state.elements) if (element.type === 'image') ids.add(element.resourceId)
  }
  return ids
}

export function referencedResourceBytes(history, registry, candidate) {
  const ids = referencedResourceIds(history)
  if (candidate?.id) ids.add(candidate.id)
  let total = 0
  for (const id of ids) {
    const resource = candidate?.id === id ? candidate : registry.get(id)
    const size = resource?.file?.size
    if (!Number.isSafeInteger(size) || size < 1) throw imageError('invalid_file')
    total += size
    if (total > IMAGE_LIMITS.watermarkAggregateBytes) throw imageError('watermark_budget')
  }
  return total
}

export function releaseUnreferencedResources(history, registry) {
  const ids = referencedResourceIds(history)
  for (const id of registry.keys()) if (!ids.has(id)) registry.delete(id)
}
