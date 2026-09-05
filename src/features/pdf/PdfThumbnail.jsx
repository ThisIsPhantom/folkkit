import { useEffect, useRef } from 'react'
export default function PdfThumbnail({ client, index, page, revision }) {
  const canvas = useRef(null)
  useEffect(() => {
    let active = true, started = false
    const element = canvas.current
    const observer = new IntersectionObserver(entries => {
      if (started || !entries.some(entry => entry.isIntersecting)) return
      started = true; observer.disconnect()
      client.render(index, { scale: Math.min(0.18, 96 / Math.max(page.width, page.height)) }).then(frame => {
        if (!active || !element) return
        element.width = frame.width; element.height = frame.height
        element.getContext('2d').putImageData(new ImageData(frame.pixels, frame.width, frame.height), 0, 0)
      }).catch(() => { /* Main preview owns the content-free document error. */ })
    }, { rootMargin: '24px' })
    observer.observe(element)
    return () => { active = false; observer.disconnect() }
  }, [client, index, page.width, page.height, revision])
  return <canvas ref={canvas} width={1} height={1} aria-hidden="true" />
}
