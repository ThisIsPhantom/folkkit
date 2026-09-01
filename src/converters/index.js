import { textConverters } from './text'
import { hashConverters } from './hash'
import { dataConverters } from './data'
import { numberConverters } from './number'
import { colorConverters } from './color'
import { utilityConverters } from './utility'
import { imageConverters } from './image'
import { imageFormatConverters } from './imageFormat'
import { mediaConverters } from './media'
import { pdfConverters } from './pdf'
import { qrConverters } from './qr'
import { cryptoConverters } from './crypto'
import { webConverters } from './web'

export const converters = [
  ...textConverters,
  ...qrConverters,
  ...imageConverters,
  ...hashConverters,
  ...cryptoConverters,
  ...dataConverters,
  ...webConverters,
  ...numberConverters,
  ...colorConverters,
  ...utilityConverters,
  ...imageFormatConverters,
  ...mediaConverters,
  ...pdfConverters,
]

export const categories = [
  { id: 'all', name: 'All' },
  { id: 'encode', name: 'Encode / Decode' },
  { id: 'hash', name: 'Hash' },
  { id: 'data', name: 'Data' },
  { id: 'web', name: 'Web' },
  { id: 'number', name: 'Number' },
  { id: 'color', name: 'Color' },
  { id: 'utility', name: 'Utility' },
  { id: 'image', name: 'Image' },
  { id: 'media', name: 'Media' },
  { id: 'document', name: 'Document' },
]

const converterById = new Map(converters.map(converter => [converter.id, converter]))

export function findConverter(id) {
  return converterById.get(id) || null
}
