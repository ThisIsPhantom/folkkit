import { releaseCatalog } from '../catalog/releaseCatalog'

const moduleLoaders = new Map([
  ['text', () => import('./text')],
  ['qr', () => import('./qr')],
  ['image', () => import('./image')],
  ['hash', () => import('./hash')],
  ['crypto', () => import('./crypto')],
  ['data', () => import('./data')],
  ['web', () => import('./web')],
  ['number', () => import('./number')],
  ['color', () => import('./color')],
  ['utility', () => import('./utility')],
  ['imageFormat', () => import('./imageFormat')],
  ['media', () => import('./media')],
  ['pdf', () => import('./pdf')],
])

function selectModuleConverters(moduleId, loadedModule) {
  switch (moduleId) {
    case 'text': return loadedModule.textConverters
    case 'qr': return loadedModule.qrConverters
    case 'image': return loadedModule.imageConverters
    case 'hash': return loadedModule.hashConverters
    case 'crypto': return loadedModule.cryptoConverters
    case 'data': return loadedModule.dataConverters
    case 'web': return loadedModule.webConverters
    case 'number': return loadedModule.numberConverters
    case 'color': return loadedModule.colorConverters
    case 'utility': return loadedModule.utilityConverters
    case 'imageFormat': return loadedModule.imageFormatConverters
    case 'media': return loadedModule.mediaConverters
    case 'pdf': return loadedModule.pdfConverters
    default: return null
  }
}

function adaptConverter(converter, moduleId, loadedModule) {
  const adapted = { ...converter }
  if (typeof converter.convert === 'function') {
    adapted.convert = async (...args) => {
      const result = await converter.convert(...args)
      return typeof result === 'string' ? { kind: 'text', text: result } : result
    }
  }
  if (moduleId === 'media') adapted.onRuntimeStatus = loadedModule.onFFmpegLoad
  return adapted
}

export function createConverterLoader(loaders = moduleLoaders) {
  return async function resolveConverter(id) {
    if (typeof id !== 'string') return null
    const entry = releaseCatalog.find(tool => tool.id === id && tool.tier !== 'hidden')
    if (!entry) return null

    const loadModule = loaders.get(entry.module)
    if (!loadModule) throw new Error(`Missing converter module loader: ${entry.module}`)
    const loadedModule = await loadModule()
    const moduleConverters = selectModuleConverters(entry.module, loadedModule)
    const converter = moduleConverters?.find(candidate => candidate.id === entry.id)
    if (!converter) throw new Error(`Missing released converter implementation: ${entry.id}`)
    return adaptConverter(converter, entry.module, loadedModule)
  }
}

export const loadConverter = createConverterLoader()
