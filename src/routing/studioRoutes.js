const legalRoutes = Object.freeze({
  '/privacy': 'privacy', '/open-source': 'openSource', '/licenses': 'licenses',
  '/terms': 'terms', '/contact': 'contact',
})

export const coreDestinations = Object.freeze({
  pdf: '/pdf',
  qr: '/qr',
  convert: '/convert',
  calculate: '/calculate',
})

const legacyCalculatorMap = Object.freeze({ 'percentage-calc': 'percent', 'aspect-ratio': 'aspect-ratio', 'bmi-calc': 'bmi', 'loan-calc': 'loan' })
export const legacyCalculatorIds = Object.freeze(Object.keys(legacyCalculatorMap))

export function legacyCalculatorTool({ search = '', hash = '' }) {
  const id = new URLSearchParams(search).get('tool') || (hash.startsWith('#tool/') ? hash.slice(6) : '')
  return legacyCalculatorIds.includes(id) ? id : null
}

export function calculatorSelection({ search = '', hash = '' }) {
  const legacy = legacyCalculatorTool({ search, hash })
  if (legacy) return legacyCalculatorMap[legacy]
  const value = new URLSearchParams(search).get('calculator')
  return ['percent', 'rule-of-three', 'pythagoras', 'circle', 'area', 'volume', 'units', 'aspect-ratio', 'loan', 'bmi', 'date', 'duration'].includes(value) ? value : 'percent'
}

const toolDestinations = Object.freeze({
  'text-to-qr': '/qr', 'qr-to-text': '/qr?mode=read', 'qr-reader': '/qr?mode=read', 'image-optimize': '/convert?mode=optimize',
  'merge-pdf': '/pdf?action=merge', 'pdf-split': '/pdf?action=extract', 'pdf-extract-range': '/pdf?action=extract',
  'pdf-rotate': '/pdf?action=rotate', 'pdf-page-count': '/pdf?action=count',
  'images-to-pdf': '/convert?target=pdf&combine=1', 'png-to-jpg': '/convert?target=jpeg',
  'jpg-to-png': '/convert?target=png', 'audio-to-mp3': '/convert?target=mp3',
})

export function toolStudioHref(id) {
  if (Object.hasOwn(legacyCalculatorMap, id)) return `/calculate?calculator=${legacyCalculatorMap[id]}`
  return Object.hasOwn(toolDestinations, id) ? toolDestinations[id] : null
}

export function legacyStudioHref({ pathname = '/', search = '', hash = '' }) {
  if (!['/', '/workspace'].includes(pathname)) return null
  const id = new URLSearchParams(search).get('tool') || (hash.startsWith('#tool/') ? hash.slice(6) : '')
  return toolStudioHref(id)
}

export function studioOptions(route, location) {
  const legacy = legacyStudioHref(location)
  const params = new URLSearchParams(legacy ? legacy.split('?')[1] || '' : location.search || '')
  if (route === 'calculate') return { calculator: calculatorSelection({ search: params.toString() }) }
  if (route === 'qr') return { mode: params.get('mode') === 'read' ? 'read' : 'create' }
  if (route === 'pdf') return { action: ['merge', 'extract', 'rotate', 'count', 'organize'].includes(params.get('action')) ? params.get('action') : 'edit' }
  if (route === 'convert') {
    const target = ['png', 'jpeg', 'webp', 'pdf', 'mp3', 'wav', 'flac', 'ogg', 'mp4', 'webm', 'gif'].includes(params.get('target')) ? params.get('target') : undefined
    return { mode: params.get('mode') === 'optimize' ? 'optimize' : 'convert', target, combine: target === 'pdf' && params.get('combine') === '1' }
  }
  return {}
}

export function resolveAppRoute({ pathname = '/', search = '', hash = '' }) {
  if (Object.values(coreDestinations).includes(pathname)) return pathname.slice(1)
  if (legalRoutes[pathname]) return `legal:${legalRoutes[pathname]}`
  if (pathname === '/tools') return 'catalog'
  const legacy = legacyStudioHref({ pathname, search, hash })
  if (legacy) return legacy.slice(1).split('?')[0]
  if (pathname === '/workspace' || search || hash.startsWith('#tool/')) return 'workspace'
  return 'home'
}
