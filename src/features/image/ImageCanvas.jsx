import { useEffect, useMemo, useRef, useState } from 'react'
import { transformedBounds } from './imageModel.js'
import { paintImageDocument } from './imageRenderer.js'

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
  showCrop = false,
  renderPreview = paintImageDocument,
  t,
}) {
  const canvasRef = useRef(null), stageRef = useRef(null), gestureRef = useRef(null)
  const onSelectRef = useRef(onSelect)
  const [visual, setVisual] = useState(null)

  useEffect(() => { onSelectRef.current = onSelect }, [onSelect])

  useEffect(() => {
    if (stageRef.current) {
      stageRef.current.style.aspectRatio = `${imageDocument.width} / ${imageDocument.height}`
      stageRef.current.style.setProperty('--image-preview-width', `${Math.min(1600, imageDocument.width)}px`)
    }
  }, [imageDocument.width, imageDocument.height])

  useEffect(() => {
    if (!active || !canvasRef.current || !source) return undefined
    const controller = new AbortController()
    Promise.resolve(renderPreview({
      document: imageDocument, source, resources, canvas: canvasRef.current,
      maxAxis: 1600, signal: controller.signal,
    })).catch(error => { if (error?.code !== 'cancelled') console.error('image preview failed') })
    return () => controller.abort()
  }, [active, imageDocument, source, resources, renderPreview])

  const elements = useMemo(() => imageDocument.elements.map(element => ({ element, bounds: transformedBounds(element) })), [imageDocument])

  function stagePoint(event) {
    const rect = stageRef.current.getBoundingClientRect()
    return {
      x: (event.clientX - rect.left) / rect.width * imageDocument.width,
      y: (event.clientY - rect.top) / rect.height * imageDocument.height,
    }
  }

  function cleanup() {
    const gesture = gestureRef.current
    gestureRef.current = null
    if (gesture && stageRef.current?.hasPointerCapture?.(gesture.pointerId)) stageRef.current.releasePointerCapture(gesture.pointerId)
    setVisual(null)
    return gesture
  }

  function beginElement(event, element, mode = 'move') {
    if (!active || gestureRef.current || event.button !== 0 || event.isPrimary === false) return
    event.preventDefault(); event.stopPropagation(); setVisual(null); onSelect?.(element.id)
    const start = stagePoint(event), bounds = transformedBounds(element)
    gestureRef.current = { pointerId: event.pointerId, kind: 'element', mode, id: element.id, start, bounds }
    stageRef.current.setPointerCapture?.(event.pointerId)
  }

  function beginCrop(event, mode = 'move') {
    if (!active || gestureRef.current || event.button !== 0 || event.isPrimary === false || !cropDraft) return
    event.preventDefault(); event.stopPropagation()
    gestureRef.current = { pointerId: event.pointerId, kind: 'crop', mode, start: stagePoint(event), bounds: { ...cropDraft } }
    stageRef.current.setPointerCapture?.(event.pointerId)
  }

  function move(event) {
    const gesture = gestureRef.current
    if (!gesture || event.pointerId !== gesture.pointerId) return
    const point = stagePoint(event), dx = point.x - gesture.start.x, dy = point.y - gesture.start.y
    if (gesture.kind === 'crop') {
      if (gesture.mode === 'resize') setVisual({ kind: 'crop', x: gesture.bounds.x, y: gesture.bounds.y, width: clamp(gesture.bounds.width + dx, 1, imageDocument.width - gesture.bounds.x), height: clamp(gesture.bounds.height + dy, 1, imageDocument.height - gesture.bounds.y) })
      else setVisual({ kind: 'crop', x: clamp(gesture.bounds.x + dx, 0, imageDocument.width - gesture.bounds.width), y: clamp(gesture.bounds.y + dy, 0, imageDocument.height - gesture.bounds.height), width: gesture.bounds.width, height: gesture.bounds.height })
      return
    }
    if (gesture.mode === 'resize') {
      setVisual({ kind: 'element', id: gesture.id, x: gesture.bounds.x, y: gesture.bounds.y, width: clamp(gesture.bounds.width + dx, 1, imageDocument.width), height: clamp(gesture.bounds.height + dy, 1, imageDocument.height) })
    } else {
      setVisual({ kind: 'element', id: gesture.id, x: clamp(gesture.bounds.x + dx, -gesture.bounds.width + 1, imageDocument.width - 1), y: clamp(gesture.bounds.y + dy, -gesture.bounds.height + 1, imageDocument.height - 1), width: gesture.bounds.width, height: gesture.bounds.height })
    }
  }

  function finish(event) {
    const gesture = gestureRef.current
    if (!gesture || event.pointerId !== gesture.pointerId) return
    const next = visual
    cleanup()
    if (!next) return
    if (gesture.kind === 'crop') onCropDraft?.({ x: Math.round(next.x), y: Math.round(next.y), width: Math.round(next.width), height: Math.round(next.height) })
    else if (gesture.mode === 'resize') onElementCommit?.(gesture.id, { width: Math.max(1, Math.round(next.width)), height: Math.max(1, Math.round(next.height)) })
    else onElementCommit?.(gesture.id, { x: Math.round(next.x), y: Math.round(next.y) })
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
        const gesture = gestureRef.current
        gestureRef.current = null
        if (stage?.hasPointerCapture?.(gesture.pointerId)) stage.releasePointerCapture(gesture.pointerId)
        setVisual(null)
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
  }, [active])

  useEffect(() => () => cleanup(), [])

  const displayCrop = visual?.kind === 'crop' ? visual : cropDraft
  return (
    <div className="image-canvas-frame">
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
            const shown = visual?.kind === 'element' && visual.id === element.id ? visual : bounds
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
