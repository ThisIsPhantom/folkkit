import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { resizeCropDraft, transformedBounds, updateElement } from './imageModel.js'
import { fitPreviewDisplay, paintImageDocument } from './imageRenderer.js'
import { createImagePreviewController } from './imagePreviewController.js'

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value))
}

function DynamicBox({ className, box, imageDocument, children, ...props }) {
  const ref = useRef(null)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    node.style.setProperty('--image-left', `${box.x / imageDocument.width * 100}%`)
    node.style.setProperty('--image-top', `${box.y / imageDocument.height * 100}%`)
    node.style.setProperty('--image-width', `${box.width / imageDocument.width * 100}%`)
    node.style.setProperty('--image-height', `${box.height / imageDocument.height * 100}%`)
  }, [box.x, box.y, box.width, box.height, imageDocument.width, imageDocument.height])
  return <div ref={ref} className={className} {...props}>{children}</div>
}

export default function ImageCanvas({
  active = true,
  document: imageDocument,
  source,
  resources,
  selectedId,
  onSelect,
  onElementCommit,
  cropDraft,
  onCropDraft,
  cropAspect = null,
  showCrop = false,
  renderPreview = paintImageDocument,
  t,
}) {
  const canvasRef = useRef(null), frameRef = useRef(null), stageRef = useRef(null), gestureRef = useRef(null)
  const onSelectRef = useRef(onSelect)
  const [visual, setVisual] = useState(null)
  const visualRef = useRef(null), previewRef = useRef(null), committedScopeRef = useRef(null)
  const paintDocument = useMemo(() => ({ width: imageDocument.width, height: imageDocument.height, sourceTransform: imageDocument.sourceTransform, elements: imageDocument.elements }), [imageDocument.width, imageDocument.height, imageDocument.sourceTransform, imageDocument.elements])
  const scope = useMemo(() => ({ active, document: paintDocument, source, resources, renderPreview }), [active, paintDocument, source, resources, renderPreview])
  const shownVisual = active && visual?.scope === scope ? visual : null
  const showVisual = value => { visualRef.current = value; setVisual(value) }
  const elementChanges = value => value.mode === 'resize'
    ? { width: Math.max(1, Math.round(value.width)), height: Math.max(1, Math.round(value.height)) }
    : { x: Math.round(value.x), y: Math.round(value.y) }

  useEffect(() => { onSelectRef.current = onSelect }, [onSelect])

  useEffect(() => {
    const frame = frameRef.current, stage = stageRef.current
    if (!frame || !stage) return undefined
    const fit = () => {
      const availableWidth = frame.clientWidth || imageDocument.width
      const availableHeight = Math.max(240, Math.round((globalThis.innerHeight || imageDocument.height) * 0.72))
      const display = fitPreviewDisplay(imageDocument.width, imageDocument.height, availableWidth, availableHeight)
      stage.style.setProperty('--image-display-width', `${display.width}px`)
      stage.style.setProperty('--image-display-height', `${display.height}px`)
    }
    fit()
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(fit) : null
    observer?.observe(frame)
    globalThis.addEventListener?.('resize', fit)
    return () => { observer?.disconnect(); globalThis.removeEventListener?.('resize', fit) }
  }, [imageDocument.width, imageDocument.height])

  useEffect(() => {
    if (!scope.active || !canvasRef.current || !scope.source) return undefined
    const stage = stageRef.current
    const painter = createImagePreviewController({ canvas: canvasRef.current, document: scope.document, source: scope.source, resources: scope.resources, render: scope.renderPreview, onError: () => console.error('image preview failed') })
    previewRef.current = painter
    return () => {
      if (committedScopeRef.current !== scope) painter.rollback()
      painter.dispose()
      if (previewRef.current === painter) previewRef.current = null
      if (visualRef.current?.scope === scope) visualRef.current = null
      const gesture = gestureRef.current
      if (gesture?.scope === scope) {
        gestureRef.current = null
        if (stage?.hasPointerCapture?.(gesture.pointerId)) stage.releasePointerCapture(gesture.pointerId)
      }
    }
  }, [scope])

  useEffect(() => {
    const painter = previewRef.current
    if (!painter) return
    if (shownVisual?.kind === 'element') painter.preview(updateElement(scope.document, shownVisual.id, elementChanges(shownVisual)))
    else painter.rollback()
  }, [scope, shownVisual])

  const elements = useMemo(() => imageDocument.elements.map(element => ({ element, bounds: transformedBounds(element) })), [imageDocument])

  function stagePoint(event) {
    const rect = stageRef.current.getBoundingClientRect()
    return {
      x: (event.clientX - rect.left) / rect.width * imageDocument.width,
      y: (event.clientY - rect.top) / rect.height * imageDocument.height,
    }
  }

  const cleanup = useCallback((restore = true) => {
    const gesture = gestureRef.current
    gestureRef.current = null
    if (gesture && stageRef.current?.hasPointerCapture?.(gesture.pointerId)) stageRef.current.releasePointerCapture(gesture.pointerId)
    if (restore) previewRef.current?.rollback()
    visualRef.current = null; setVisual(null)
    return gesture
  }, [])

  function beginElement(event, element, mode = 'move') {
    if (!active || gestureRef.current || event.button !== 0 || event.isPrimary === false) return
    event.preventDefault(); event.stopPropagation(); showVisual(null); committedScopeRef.current = null; onSelect?.(element.id)
    const start = stagePoint(event), bounds = transformedBounds(element)
    gestureRef.current = { scope, pointerId: event.pointerId, kind: 'element', mode, id: element.id, start, bounds }
    stageRef.current.setPointerCapture?.(event.pointerId)
  }

  function beginCrop(event, mode = 'move') {
    if (!active || gestureRef.current || event.button !== 0 || event.isPrimary === false || !cropDraft) return
    event.preventDefault(); event.stopPropagation(); showVisual(null); committedScopeRef.current = null
    gestureRef.current = { scope, pointerId: event.pointerId, kind: 'crop', mode, start: stagePoint(event), bounds: { ...cropDraft } }
    stageRef.current.setPointerCapture?.(event.pointerId)
  }

  function move(event) {
    const gesture = gestureRef.current
    if (!gesture || event.pointerId !== gesture.pointerId) return
    if (!active || gesture.scope !== scope) { cleanup(); return }
    const point = stagePoint(event), dx = point.x - gesture.start.x, dy = point.y - gesture.start.y
    if (gesture.kind === 'crop') {
      if (gesture.mode === 'resize') showVisual({ scope, kind: 'crop', ...resizeCropDraft(gesture.bounds, imageDocument, cropAspect, gesture.bounds.width + dx, gesture.bounds.height + dy) })
      else showVisual({ scope, kind: 'crop', x: clamp(gesture.bounds.x + dx, 0, imageDocument.width - gesture.bounds.width), y: clamp(gesture.bounds.y + dy, 0, imageDocument.height - gesture.bounds.height), width: gesture.bounds.width, height: gesture.bounds.height })
      return
    }
    if (gesture.mode === 'resize') {
      showVisual({ scope, kind: 'element', mode: gesture.mode, id: gesture.id, x: gesture.bounds.x, y: gesture.bounds.y, width: clamp(gesture.bounds.width + dx, 1, imageDocument.width), height: clamp(gesture.bounds.height + dy, 1, imageDocument.height) })
    } else {
      showVisual({ scope, kind: 'element', mode: gesture.mode, id: gesture.id, x: clamp(gesture.bounds.x + dx, -gesture.bounds.width + 1, imageDocument.width - 1), y: clamp(gesture.bounds.y + dy, -gesture.bounds.height + 1, imageDocument.height - 1), width: gesture.bounds.width, height: gesture.bounds.height })
    }
  }

  function finish(event) {
    const gesture = gestureRef.current
    if (!gesture || event.pointerId !== gesture.pointerId) return
    if (!active || gesture.scope !== scope) { cleanup(); return }
    const next = visualRef.current
    if (!next || next.scope !== scope || next.kind !== gesture.kind || (gesture.kind === 'element' && next.id !== gesture.id)) { cleanup(); return }
    committedScopeRef.current = scope
    cleanup(false)
    if (gesture.kind === 'crop') onCropDraft?.({ x: Math.round(next.x), y: Math.round(next.y), width: Math.round(next.width), height: Math.round(next.height) })
    else onElementCommit?.(gesture.id, elementChanges(next))
  }

  function cancel(event) {
    const gesture = gestureRef.current
    if (!gesture || (event?.pointerId != null && event.pointerId !== gesture.pointerId)) return
    cleanup()
  }

  useEffect(() => {
    if (!active) return undefined
    const stage = stageRef.current
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return
      if (gestureRef.current) {
        event.preventDefault()
        cleanup()
      }
      else onSelectRef.current?.(null)
    }
    document.addEventListener('keydown', onKeyDown, true)
    return () => {
      document.removeEventListener('keydown', onKeyDown, true)
      const gesture = gestureRef.current
      gestureRef.current = null
      if (gesture && stage?.hasPointerCapture?.(gesture.pointerId)) stage.releasePointerCapture(gesture.pointerId)
    }
  }, [active, cleanup])

  useEffect(() => () => cleanup(), [cleanup])

  const displayCrop = shownVisual?.kind === 'crop' ? shownVisual : cropDraft
  return (
    <div ref={frameRef} className="image-canvas-frame">
      <div
        ref={stageRef}
        className="image-canvas-stage"
        role="application"
        aria-label={t('studioImage.canvas')}
        onPointerMove={move}
        onPointerUp={finish}
        onPointerCancel={cancel}
        onLostPointerCapture={cancel}
      >
        <canvas ref={canvasRef} role="img" aria-label={t('studioImage.preview')} />
        <div className="image-canvas-overlay" aria-hidden={showCrop ? undefined : false}>
          {elements.map(({ element, bounds }) => {
            const shown = shownVisual?.kind === 'element' && shownVisual.id === element.id ? shownVisual : bounds
            return (
              <DynamicBox key={element.id} className="image-element-wrap" box={shown} imageDocument={imageDocument}>
                <button
                  type="button"
                  className="image-element-target"
                  aria-label={t('studioImage.element', { name: element.type === 'text' ? element.text : resources.get(element.resourceId)?.name || element.resourceId })}
                  aria-pressed={selectedId === element.id}
                  onPointerDown={event => beginElement(event, element)}
                />
                {selectedId === element.id && <button type="button" className="image-element-resize" aria-label={t('studioImage.resize')} onPointerDown={event => beginElement(event, element, 'resize')} />}
              </DynamicBox>
            )
          })}
          {showCrop && displayCrop && (
            <DynamicBox
              className="image-crop-selection"
              box={displayCrop}
              imageDocument={imageDocument}
              role="group"
              aria-label={t('studioImage.cropSelection')}
            >
              <button type="button" className="image-crop-move" aria-label={t('studioImage.cropSelection')} onPointerDown={event => beginCrop(event, 'move')} />
              <button type="button" className="image-crop-resize" aria-label={t('studioImage.cropResize')} onPointerDown={event => beginCrop(event, 'resize')} />
            </DynamicBox>
          )}
        </div>
      </div>
    </div>
  )
}
