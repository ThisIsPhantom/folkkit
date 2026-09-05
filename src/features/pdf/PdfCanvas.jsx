import { useEffect, useRef, useState } from 'react'
import { appendStrokePoint, prepareStroke, viewBounds } from './pdfGeometry.js'

export default function PdfCanvas({ frame, page, objects, selected, onSelect, tool, onPlace, disabled, t, zoom }) {
  const canvas = useRef(null)
  const stroke = useRef([])
  const [trail, setTrail] = useState([])
  useEffect(() => {
    if (!frame || !canvas.current) return
    canvas.current.getContext('2d').putImageData(new ImageData(frame.pixels, frame.width, frame.height), 0, 0)
  }, [frame])
  function point(event) {
    const bounds = event.currentTarget.getBoundingClientRect()
    return [Math.max(0, Math.min(page.width, (event.clientX - bounds.left) / bounds.width * page.width)), Math.max(0, Math.min(page.height, (event.clientY - bounds.top) / bounds.height * page.height))]
  }
  function start(event) {
    if (disabled || tool === 'select' || event.button !== 0) return
    event.currentTarget.setPointerCapture(event.pointerId)
    stroke.current = [point(event)]; setTrail(stroke.current)
  }
  function move(event) {
    if (!stroke.current.length) return
    const next = point(event)
    if (tool === 'underline') next[1] = stroke.current[0][1]
    stroke.current = ['draw', 'signature'].includes(tool) ? appendStrokePoint(stroke.current, next) : [stroke.current[0], next]
    setTrail(stroke.current)
  }
  function finish(event) {
    if (!stroke.current.length) return
    const points = [...stroke.current]
    if (points.length === 1) points.push(point(event))
    stroke.current = []; setTrail([])
    onPlace(prepareStroke(points, page, tool))
  }
  return <div className="pdf-stage" data-zoom={zoom}>
    <div className="pdf-sheet" data-tool={tool} aria-busy={disabled}>
      <canvas ref={canvas} width={frame?.width || 1} height={frame?.height || 1} aria-label={t('preview')} />
      <svg className="pdf-overlay" viewBox={`0 0 ${page.width} ${page.height}`} aria-label={t('document')} onPointerDown={start} onPointerMove={move} onPointerUp={finish} onPointerCancel={() => { stroke.current = []; setTrail([]) }}>
        {tool === 'select' && objects.filter(item => ['text', 'image'].includes(item.type)).map(item => <g key={item.index} role="button" tabIndex={disabled ? -1 : 0} aria-label={t('selectedObject', { type: t(item.type === 'text' ? 'objectText' : 'objectImage'), number: item.index + 1 })} aria-pressed={selected?.index === item.index} className={`pdf-object ${selected?.index === item.index ? 'is-selected' : ''} ${!item.editable ? 'is-unsupported' : ''}`} onClick={() => !disabled && onSelect(item)} onKeyDown={event => { if (['Enter', ' '].includes(event.key)) { event.preventDefault(); if (!disabled) onSelect(item) } }}>
          <rect {...viewBounds(item.bounds, page)} />
        </g>)}
        {trail.length > 1 && <polyline className="pdf-draw-preview" points={trail.map(item => item.join(',')).join(' ')} />}
      </svg>
    </div>
  </div>
}
