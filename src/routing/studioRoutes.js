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
  return ['percent', 'rule-of-three', 'pythagoras', 'circle', 'area', 'volume', 'units', 'aspect-ratio', 'loan', 'bmi'].includes(value) ? value : 'percent'
}

export function resolveAppRoute({ pathname = '/', search = '', hash = '' }) {
  if (Object.values(coreDestinations).includes(pathname)) return pathname.slice(1)
  if (legalRoutes[pathname]) return `legal:${legalRoutes[pathname]}`
  if (pathname === '/tools') return 'catalog'
  if (legacyCalculatorTool({ search, hash })) return 'calculate'
  if (pathname === '/workspace' || search || hash.startsWith('#tool/')) return 'workspace'
  return 'home'
}
