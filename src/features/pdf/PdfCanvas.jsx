import { useEffect, useRef, useState } from 'react'
import { appendStrokePoint, prepareStroke, viewBounds } from './pdfGeometry.js'
import { objectTransform, transformedBounds } from './pdfInteraction.js'

export default function PdfCanvas({ frame, page, objects, selected, onSelect, onEdit, onTransform, tool, onPlace, disabled, t, zoom }) {
  const canvas = useRef(null), overlay = useRef(null), gesture = useRef(null), lastPointerObject = useRef(null)
  const [trail, setTrail] = useState([]), [preview, setPreview] = useState(null)
  useEffect(() => {
    if (!frame || !canvas.current) return
    canvas.current.getContext('2d').putImageData(new ImageData(frame.pixels, frame.width, frame.height), 0, 0)
  }, [frame])
  useEffect(() => () => { gesture.current = null }, [])
  function point(event, clamp = false) {
    const bounds = overlay.current.getBoundingClientRect()
    const point = [(event.clientX - bounds.left) / bounds.width * page.width, (event.clientY - bounds.top) / bounds.height * page.height]
    return clamp ? [Math.max(0, Math.min(page.width, point[0])), Math.max(0, Math.min(page.height, point[1]))] : point
  }
  function clear() {
    const active = gesture.current
    gesture.current = null; setTrail([]); setPreview(null)
    if (active && overlay.current?.hasPointerCapture(active.pointerId)) overlay.current.releasePointerCapture(active.pointerId)
    return active
  }
  function start(event, item, corner) {
    if (disabled || gesture.current || event.button !== 0 || event.isPrimary === false) return
    if (tool === 'select' && (!item || !item.editable)) return
    event.preventDefault(); event.stopPropagation()
    const start = point(event, tool !== 'select')
    const mode = tool !== 'select' ? 'draw' : corner ? 'scale' : 'move'
    let anchor
    if (item) {
      lastPointerObject.current = item
      onSelect(item)
      const bounds = viewBounds(item.bounds, page)
      if (corner) anchor = [bounds.x + (corner.includes('w') ? bounds.width : 0), bounds.y + (corner.includes('n') ? bounds.height : 0)]
    }
    gesture.current = { pointerId: event.pointerId, mode, item, start, anchor, points: [start], page, tool }
    overlay.current.setPointerCapture(event.pointerId)
    if (mode === 'draw') setTrail([start])
  }
  function move(event) {
    const active = gesture.current
    if (!active || active.pointerId !== event.pointerId) return
    if (disabled || active.page !== page || active.tool !== tool) { clear(); return }
    const next = point(event, active.mode === 'draw')
    if (active.mode !== 'draw') {
      const transform = objectTransform({ ...active, bounds: active.item.bounds, end: next })
      setPreview(transform ? { index: active.item.index, bounds: transformedBounds(active.item.bounds, transform) } : null)
    } else {
      if (tool === 'underline') next[1] = active.start[1]
      active.points = ['draw', 'signature'].includes(tool) ? appendStrokePoint(active.points, next) : [active.start, next]
      setTrail(active.points)
    }
  }
  function finish(event) {
    const active = gesture.current
    if (!active || active.pointerId !== event.pointerId) return
    clear()
    if (disabled || active.page !== page || active.tool !== tool) return
    if (active.mode !== 'draw') {
      const transform = objectTransform({ ...active, bounds: active.item.bounds, end: point(event) })
      if (transform) onTransform(active.item.index, transform)
    } else {
      if (active.points.length === 1) active.points.push(point(event, true))
      onPlace(prepareStroke(active.points, page, tool))
    }
  }
  function cancel(event) { if (gesture.current?.pointerId === event.pointerId) clear() }
  const selectionBounds = selected && viewBounds(preview?.index === selected.index ? preview.bounds : selected.bounds, page)
  return <div className="pdf-stage" data-zoom={zoom}>
    <div className="pdf-sheet" data-tool={tool} aria-busy={disabled}>
      <canvas ref={canvas} width={frame?.width || 1} height={frame?.height || 1} aria-label={t('preview')} />
      <svg ref={overlay} className="pdf-overlay" viewBox={`0 0 ${page.width} ${page.height}`} aria-label={t('document')} onPointerDown={event => { lastPointerObject.current = null; start(event) }} onDoubleClick={() => { const item = lastPointerObject.current; if (!disabled && item?.type === 'text' && item.editable) onEdit?.(item) }} onPointerMove={move} onPointerUp={finish} onPointerCancel={cancel} onLostPointerCapture={cancel} onKeyDown={event => { if (event.key === 'Escape') clear() }}>
        {tool === 'select' && objects.filter(item => ['text', 'image'].includes(item.type)).map(item => <g key={item.index} role="button" tabIndex={disabled ? -1 : 0} aria-label={`${t('selectedObject', { type: t(item.type === 'text' ? 'objectText' : 'objectImage'), number: item.index + 1 })}${item.type === 'text' && item.text ? `: ${item.text.replace(/\s+/g, ' ').slice(0, 60)}` : ''}`} aria-pressed={selected?.index === item.index} className={`pdf-object ${selected?.index === item.index ? 'is-selected' : ''} ${!item.editable ? 'is-unsupported' : 'is-editable'}`} onPointerDown={event => start(event, item)} onClick={() => !disabled && onSelect(item)} onDoubleClick={event => { event.stopPropagation(); if (!disabled && item.type === 'text' && item.editable) onEdit?.(item) }} onKeyDown={event => { if (['Enter', ' '].includes(event.key)) { event.preventDefault(); if (!disabled) onSelect(item) } }}>
          <rect {...viewBounds(preview?.index === item.index ? preview.bounds : item.bounds, page)} />
        </g>)}
        {tool === 'select' && selected?.editable && selectionBounds && ['nw', 'ne', 'sw', 'se'].map(corner => <g key={corner} className={`pdf-resize-handle pdf-resize-${corner}`} role="button" aria-label={t('resize', { corner: t(`corner.${corner}`) })} tabIndex={disabled ? -1 : 0} onPointerDown={event => start(event, selected, corner)} onKeyDown={event => {
          if (!disabled && ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft', '+', '-'].includes(event.key)) { event.preventDefault(); onTransform(selected.index, { scale: ['ArrowUp', 'ArrowRight', '+'].includes(event.key) ? 1.1 : 0.9 }) }
        }}><rect x={selectionBounds.x + (corner.includes('e') ? selectionBounds.width : 0) - 6} y={selectionBounds.y + (corner.includes('s') ? selectionBounds.height : 0) - 6} width={12} height={12} /></g>)}
        {trail.length > 1 && <polyline className="pdf-draw-preview" points={trail.map(item => item.join(',')).join(' ')} />}
      </svg>
    </div>
  </div>
}
