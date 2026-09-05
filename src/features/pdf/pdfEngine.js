// Folkkit modifications, 2026. Native PDF objects; document content stays in memory.
export const PDF_LIMITS = Object.freeze({ bytes: 32 * 1024 * 1024, output: 64 * 1024 * 1024, pages: 200, pixels: 16 * 1024 * 1024, objects: 10000, text: 4000 })
export function pdfError(code = 'invalid_file') { return Object.assign(new Error(code), { code }) }
export const ensure = (value, code) => { if (!value) throw pdfError(code); return value }
const latinText = text => typeof text === 'string' && /^[\x20-\x7e\xa0-\xff]*$/.test(text) && text.length <= PDF_LIMITS.text
const colorBytes = color => { ensure(/^#[0-9a-f]{6}$/i.test(color)); return [1, 3, 5].map(offset => parseInt(color.slice(offset, offset + 2), 16)) }
const coordinate = value => ensure(Number.isFinite(value) && Math.abs(value) <= 20000, 'resource_limit')

export class PdfEngine {
  constructor(api) {
    this.api = api
    this.heap = api.pdfium
    this.document = 0
    this.input = 0
    api.FPDF_InitLibrary()
  }
  allocation(size, callback) {
    ensure(Number.isInteger(size) && size > 0 && size <= PDF_LIMITS.output, 'resource_limit')
    const pointer = ensure(this.heap._malloc(size), 'resource_limit')
    try { return callback(pointer) } finally { this.heap._free(pointer) }
  }
  close() {
    if (this.document) this.api.FPDF_CloseDocument(this.document)
    if (this.input) this.heap._free(this.input)
    this.document = this.input = 0
  }
  open(bytes) {
    ensure(bytes instanceof Uint8Array && bytes.length >= 8 && bytes.length <= PDF_LIMITS.bytes, 'resource_limit')
    ensure(new TextDecoder().decode(bytes.subarray(0, 5)) === '%PDF-')
    const input = ensure(this.heap._malloc(bytes.length), 'resource_limit')
    this.heap.HEAPU8.set(bytes, input)
    const document = this.api.FPDF_LoadMemDocument(input, bytes.length, '')
    if (!document) { this.heap._free(input); throw pdfError() }
    const count = this.api.FPDF_GetPageCount(document)
    if (count < 1 || count > PDF_LIMITS.pages) {
      this.api.FPDF_CloseDocument(document); this.heap._free(input); throw pdfError('resource_limit')
    }
    this.close()
    this.document = document
    this.input = input
    return this.metadata()
  }
  page(index, callback) {
    ensure(this.document && Number.isInteger(index) && index >= 0 && index < this.api.FPDF_GetPageCount(this.document))
    const page = ensure(this.api.FPDF_LoadPage(this.document, index))
    try { return callback(page) } finally { this.api.FPDF_ClosePage(page) }
  }
  metadata() {
    const pages = Array.from({ length: this.api.FPDF_GetPageCount(this.document) }, (_, index) => this.page(index, page => {
      const width = this.api.FPDF_GetPageWidthF(page), height = this.api.FPDF_GetPageHeightF(page)
      ensure(width > 0 && height > 0 && width <= 20000 && height <= 20000, 'resource_limit')
      const screenWidth = Math.round(width * 1000), screenHeight = Math.round(height * 1000)
      const devicePoint = (x, y) => this.allocation(16, pointer => {
        ensure(this.api.FPDF_DeviceToPage(page, 0, 0, screenWidth, screenHeight, 0, x, y, pointer, pointer + 8))
        return [this.heap.HEAPF64[pointer / 8], this.heap.HEAPF64[pointer / 8 + 1]]
      })
      const origin = devicePoint(0, 0), horizontal = devicePoint(screenWidth, 0), vertical = devicePoint(0, screenHeight)
      const viewToPdf = [(horizontal[0] - origin[0]) / width, (horizontal[1] - origin[1]) / width, (vertical[0] - origin[0]) / height, (vertical[1] - origin[1]) / height, ...origin]
      return { width, height, rotation: this.api.FPDFPage_GetRotation(page), viewToPdf }
    }))
    return { pages }
  }
  readText(object, textPage) {
    const length = this.api.FPDFTextObj_GetText(object, textPage, 0, 0)
    if (length <= 2) return ''
    ensure(length <= PDF_LIMITS.text * 2 + 2, 'resource_limit')
    return this.allocation(length, pointer => {
      this.api.FPDFTextObj_GetText(object, textPage, pointer, length)
      return new TextDecoder('utf-16le').decode(this.heap.HEAPU8.slice(pointer, pointer + length - 2))
    })
  }
  objects(index) {
    return this.page(index, page => {
      const count = this.api.FPDFPage_CountObjects(page)
      ensure(count <= PDF_LIMITS.objects, 'resource_limit')
      const textPage = ensure(this.api.FPDFText_LoadPage(page))
      try {
        return Array.from({ length: count }, (_, objectIndex) => {
          const object = this.api.FPDFPage_GetObject(page, objectIndex)
          const type = this.api.FPDFPageObj_GetType(object)
          return this.allocation(48, pointer => {
            this.api.FPDFPageObj_GetBounds(object, pointer, pointer + 4, pointer + 8, pointer + 12)
            const bounds = Array.from(this.heap.HEAPF32.subarray(pointer / 4, pointer / 4 + 4))
            if (type !== 1) return { index: objectIndex, type: type === 3 ? 'image' : 'other', bounds, editable: type === 3 }
            this.api.FPDFPageObj_GetMatrix(object, pointer + 16)
            const matrix = Array.from(this.heap.HEAPF32.subarray((pointer + 16) / 4, (pointer + 40) / 4))
            const font = this.api.FPDFTextObj_GetFont(object)
            const embedded = this.api.FPDFFont_GetIsEmbedded(font) === 1
            const nameLength = this.api.FPDFFont_GetBaseFontName(font, 0, 0)
            const fontName = nameLength > 0 && nameLength < 512 ? this.allocation(nameLength, namePointer => {
              this.api.FPDFFont_GetBaseFontName(font, namePointer, nameLength)
              return new TextDecoder().decode(this.heap.HEAPU8.slice(namePointer, namePointer + nameLength - 1))
            }) : ''
            const clip = this.api.FPDFPageObj_GetClipPath(object)
            const text = this.readText(object, textPage)
            this.api.FPDFTextObj_GetFontSize(object, pointer + 40)
            const fontSize = this.heap.HEAPF32[(pointer + 40) / 4]
            // Conservative gate: horizontal visible simple fonts, no explicit clipping.
            const reusableFont = embedded ? !fontName.includes('+') : /^(Helvetica|Times|Courier)(-|$)/.test(fontName)
            const editable = reusableFont && Math.abs(matrix[1]) < 0.001 && Math.abs(matrix[2]) < 0.001 && matrix[0] > 0 && matrix[3] > 0
              && (!clip || this.api.FPDFClipPath_CountPaths(clip) <= 0) && this.api.FPDFTextObj_GetTextRenderMode(object) === 0 && latinText(text)
            return { index: objectIndex, type: 'text', bounds, text, fontSize, editable, embedded, fontName }
          })
        })
      } finally { this.api.FPDFText_ClosePage(textPage) }
    })
  }
  replaceText(index, objectIndex, text) {
    const info = this.objects(index).find(object => object.index === objectIndex)
    ensure(info?.type === 'text' && info.editable, 'unsupported_text')
    ensure(latinText(text), 'unsupported_text')
    return this.page(index, page => {
      const object = this.api.FPDFPage_GetObject(page, objectIndex)
      this.allocation((text.length + 1) * 2, pointer => {
        for (let i = 0; i <= text.length; i++) this.heap.HEAPU16[pointer / 2 + i] = text.charCodeAt(i) || 0
        ensure(this.api.FPDFText_SetText(object, pointer), 'unsupported_text')
      })
      ensure(this.api.FPDFPage_GenerateContent(page))
    })
  }
  addText(index, { text, x, y, size = 16, color = '#000000' }) {
    ensure(latinText(text), 'unsupported_text')
    coordinate(x); coordinate(y); ensure(size >= 4 && size <= 200, 'resource_limit')
    const rgb = colorBytes(color)
    this.page(index, page => {
      const object = ensure(this.api.FPDFPageObj_NewTextObj(this.document, 'Helvetica', size))
      let inserted = false
      try {
        this.allocation((text.length + 1) * 2, pointer => {
          for (let i = 0; i <= text.length; i++) this.heap.HEAPU16[pointer / 2 + i] = text.charCodeAt(i) || 0
          ensure(this.api.FPDFText_SetText(object, pointer), 'unsupported_text')
        })
        this.api.FPDFPageObj_SetFillColor(object, ...rgb, 255)
        this.api.FPDFPageObj_Transform(object, 1, 0, 0, 1, x, y)
        this.api.FPDFPage_InsertObject(page, object); inserted = true
        ensure(this.api.FPDFPage_GenerateContent(page))
      } finally { if (!inserted) this.api.FPDFPageObj_Destroy(object) }
    })
  }
  addDrawing(index, { kind, points, color = '#000000', width = 2 }) {
    ensure(['rectangle', 'ellipse', 'line', 'draw', 'highlight', 'underline', 'signature'].includes(kind))
    ensure(Array.isArray(points) && points.length >= 2 && points.length <= 2000, 'resource_limit')
    points.forEach(point => { ensure(Array.isArray(point) && point.length === 2); point.forEach(coordinate) })
    ensure(width > 0 && width <= 100, 'resource_limit')
    const rgb = colorBytes(color)
    this.page(index, page => {
      const [[x, y], [endX, endY]] = points
      let object
      if (kind === 'rectangle' || kind === 'highlight') {
        object = ensure(this.api.FPDFPageObj_CreateNewRect(Math.min(x, endX), Math.min(y, endY), Math.abs(endX - x), Math.abs(endY - y)))
      } else {
        object = ensure(this.api.FPDFPageObj_CreateNewPath(x, y))
        if (kind === 'ellipse') {
          for (let step = 0; step <= 48; step++) {
            const angle = step / 48 * Math.PI * 2
            const px = (x + endX) / 2 + Math.abs(endX - x) / 2 * Math.cos(angle)
            const py = (y + endY) / 2 + Math.abs(endY - y) / 2 * Math.sin(angle)
            if (step === 0) this.api.FPDFPath_MoveTo(object, px, py)
            else this.api.FPDFPath_LineTo(object, px, py)
          }
          this.api.FPDFPath_Close(object)
        } else points.slice(1).forEach(point => this.api.FPDFPath_LineTo(object, ...point))
      }
      this.api.FPDFPageObj_SetStrokeColor(object, ...rgb, 255)
      this.api.FPDFPageObj_SetStrokeWidth(object, width)
      this.api.FPDFPageObj_SetFillColor(object, ...rgb, kind === 'highlight' ? 70 : 255)
      if (kind === 'highlight') this.api.FPDFPageObj_SetBlendMode(object, 'Multiply')
      this.api.FPDFPath_SetDrawMode(object, kind === 'highlight' ? 2 : 0, kind !== 'highlight')
      this.api.FPDFPage_InsertObject(page, object)
      ensure(this.api.FPDFPage_GenerateContent(page))
    })
  }
  addNote(index, { text, x, y }) {
    ensure(typeof text === 'string' && text.length <= PDF_LIMITS.text)
    coordinate(x); coordinate(y)
    this.page(index, page => {
      const annotation = ensure(this.api.FPDFPage_CreateAnnot(page, 1))
      try {
        this.allocation(16, pointer => {
          this.heap.HEAPF32.set([x, y + 24, x + 24, y], pointer / 4)
          ensure(this.api.FPDFAnnot_SetRect(annotation, pointer))
        })
        this.allocation((text.length + 1) * 2, pointer => {
          for (let i = 0; i <= text.length; i++) this.heap.HEAPU16[pointer / 2 + i] = text.charCodeAt(i) || 0
          ensure(this.api.FPDFAnnot_SetStringValue(annotation, 'Contents', pointer))
        })
        this.api.FPDFAnnot_SetColor(annotation, 0, 245, 190, 60, 255)
      } finally { this.api.FPDFPage_CloseAnnot(annotation) }
    })
  }
  addImage(index, { pixels, width, height, x, y, displayWidth, displayHeight }) {
    ensure(Number.isInteger(width) && Number.isInteger(height) && width > 0 && height > 0 && width * height <= PDF_LIMITS.pixels, 'resource_limit')
    ensure(pixels?.length === width * height * 4)
    ;[x, y, displayWidth, displayHeight].forEach(coordinate)
    ensure(displayWidth > 0 && displayHeight > 0)
    this.page(index, page => {
      const bitmap = ensure(this.api.FPDFBitmap_Create(width, height, 1))
      const object = ensure(this.api.FPDFPageObj_NewImageObj(this.document))
      let inserted = false
      try {
        const pointer = this.api.FPDFBitmap_GetBuffer(bitmap)
        for (let i = 0; i < pixels.length; i += 4) {
          this.heap.HEAPU8.set([pixels[i + 2], pixels[i + 1], pixels[i], pixels[i + 3]], pointer + i)
        }
        ensure(this.api.FPDFImageObj_SetBitmap(0, 0, object, bitmap))
        this.api.FPDFPageObj_Transform(object, displayWidth, 0, 0, displayHeight, x, y)
        this.api.FPDFPage_InsertObject(page, object); inserted = true
        ensure(this.api.FPDFPage_GenerateContent(page))
      } finally {
        this.api.FPDFBitmap_Destroy(bitmap)
        if (!inserted) this.api.FPDFPageObj_Destroy(object)
      }
    })
  }
  transformObject(index, objectIndex, { dx = 0, dy = 0, scale = 1 }) {
    coordinate(dx); coordinate(dy); ensure(scale >= 0.001 && scale <= 10)
    const info = this.objects(index).find(object => object.index === objectIndex)
    ensure(info?.editable, 'unsupported_text')
    this.page(index, page => {
      const object = this.api.FPDFPage_GetObject(page, objectIndex)
      this.api.FPDFPageObj_Transform(object, scale, 0, 0, scale, dx + info.bounds[0] * (1 - scale), dy + info.bounds[1] * (1 - scale))
      ensure(this.api.FPDFPage_GenerateContent(page))
    })
  }
  removeObject(index, objectIndex) {
    ensure(this.objects(index).some(object => object.index === objectIndex))
    this.page(index, page => {
      const object = this.api.FPDFPage_GetObject(page, objectIndex)
      ensure(this.api.FPDFPage_RemoveObject(page, object))
      this.api.FPDFPageObj_Destroy(object)
      ensure(this.api.FPDFPage_GenerateContent(page))
    })
  }
  formType() { return this.api.FPDF_GetFormType(this.document) }
  pageHasWidget(index) {
    return this.page(index, page => {
      const count = this.api.FPDFPage_GetAnnotCount(page)
      ensure(count >= 0 && count <= PDF_LIMITS.objects, 'resource_limit')
      for (let i = 0; i < count; i++) {
        const annotation = ensure(this.api.FPDFPage_GetAnnot(page, i))
        try { if (this.api.FPDFAnnot_GetSubtype(annotation) === 20) return true }
        finally { this.api.FPDFPage_CloseAnnot(annotation) }
      }
      return false
    })
  }
  extract(indices) {
    ensure(this.formType() === 0, 'unsupported_structure')
    const count = this.api.FPDF_GetPageCount(this.document)
    ensure(Array.isArray(indices) && indices.length > 0 && indices.length <= PDF_LIMITS.pages)
    indices.forEach(index => ensure(Number.isInteger(index) && index >= 0 && index < count))
    const document = ensure(this.api.FPDF_CreateNewDocument())
    try {
      ensure(this.api.FPDF_ImportPages(document, this.document, indices.map(index => index + 1).join(','), 0))
      return this.saveDocument(document)
    } finally { this.api.FPDF_CloseDocument(document) }
  }
  pageAction(action, index, target) {
    const count = this.api.FPDF_GetPageCount(this.document)
    ensure(Number.isInteger(index) && index >= 0 && index <= count)
    ensure(this.formType() === 0 || this.formType() === 1, 'unsupported_structure')
    if (action === 'blank') {
      ensure(count < PDF_LIMITS.pages, 'resource_limit')
      const page = ensure(this.api.FPDFPage_New(this.document, index, 595, 842))
      this.api.FPDFPage_GenerateContent(page); this.api.FPDF_ClosePage(page)
    } else if (action === 'rotate') {
      this.page(index, page => this.api.FPDFPage_SetRotation(page, (this.api.FPDFPage_GetRotation(page) + 1) % 4))
    } else {
      ensure(index < count)
      if (action === 'duplicate') {
        ensure(this.formType() === 0, 'unsupported_structure')
        ensure(count < PDF_LIMITS.pages, 'resource_limit')
        ensure(this.api.FPDF_ImportPages(this.document, this.document, String(index + 1), index + 1))
      } else if (action === 'delete') {
        ensure(count > 1, 'last_page')
        ensure(!this.pageHasWidget(index), 'unsupported_structure')
        this.api.FPDFPage_Delete(this.document, index)
      } else if (action === 'move') {
        ensure(Number.isInteger(target) && target >= 0 && target < count)
        if (index !== target) this.allocation(4, pointer => {
          this.heap.HEAP32[pointer / 4] = index
          ensure(this.api.FPDF_MovePages(this.document, pointer, 1, target))
        })
      } else throw pdfError()
    }
    return this.metadata()
  }
  merge(bytes) {
    const other = new PdfEngine(this.api)
    try {
      other.open(bytes)
      ensure(other.formType() === 0 && (this.formType() === 0 || this.formType() === 1), 'unsupported_structure')
      const count = this.api.FPDF_GetPageCount(this.document)
      ensure(count + this.api.FPDF_GetPageCount(other.document) <= PDF_LIMITS.pages, 'resource_limit')
      ensure(this.api.FPDF_ImportPages(this.document, other.document, '', count))
    } finally { other.close() }
    return this.metadata()
  }
  save() { return this.saveDocument(this.document) }
  saveDocument(document) {
    const writer = ensure(this.api.PDFiumExt_OpenFileWriter())
    try {
      ensure(this.api.PDFiumExt_SaveAsCopy(document, writer))
      const size = this.api.PDFiumExt_GetFileWriterSize(writer)
      return this.allocation(size, pointer => {
        ensure(this.api.PDFiumExt_GetFileWriterData(writer, pointer, size))
        return this.heap.HEAPU8.slice(pointer, pointer + size)
      })
    } finally { this.api.PDFiumExt_CloseFileWriter(writer) }
  }
  render(index, { scale = 1 } = {}) {
    ensure(Number.isFinite(scale) && scale >= 0.001 && scale <= 300 / 72, 'resource_limit')
    return this.page(index, page => {
      const width = Math.ceil(this.api.FPDF_GetPageWidthF(page) * scale)
      const height = Math.ceil(this.api.FPDF_GetPageHeightF(page) * scale)
      ensure(width > 0 && height > 0 && width * height <= PDF_LIMITS.pixels, 'resource_limit')
      const bitmap = ensure(this.api.FPDFBitmap_Create(width, height, 1), 'resource_limit')
      try {
        this.api.FPDFBitmap_FillRect(bitmap, 0, 0, width, height, 0xffffffff)
        this.api.FPDF_RenderPageBitmap(bitmap, page, 0, 0, width, height, 0, 1)
        const pointer = this.api.FPDFBitmap_GetBuffer(bitmap)
        const stride = this.api.FPDFBitmap_GetStride(bitmap)
        const pixels = new Uint8ClampedArray(width * height * 4)
        for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
          const source = pointer + y * stride + x * 4
          const target = (y * width + x) * 4
          pixels[target] = this.heap.HEAPU8[source + 2]; pixels[target + 1] = this.heap.HEAPU8[source + 1]
          pixels[target + 2] = this.heap.HEAPU8[source]; pixels[target + 3] = this.heap.HEAPU8[source + 3]
        }
        return { width, height, pixels }
      } finally { this.api.FPDFBitmap_Destroy(bitmap) }
    })
  }
}
