const definitions = Object.freeze([
  ['qr-reader','qrReader'],['image-optimize','imageOptimize'],
  ['image-editor','imageEditor','image'],['audio-trim','audioTrim','audio'],['document-convert','documentConvert'],
])

export function getStudioTools(t) {
  return definitions.map(([id,key,editor]) => ({
    id, editor, name:t(`catalog.${key}`), description:t(`catalog.${key}Description`),
    category:'studio', categoryName:t('catalog.studioCategory'),
  }))
}
