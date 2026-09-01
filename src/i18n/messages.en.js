const messagesEn = Object.freeze({
  catalog: Object.freeze({
    toolCount: '{count} tools',
  }),
  labels: Object.freeze({
    experimental: 'Experimental',
  }),
  categories: Object.freeze({
    encode: 'QR and encoding',
    document: 'PDF and documents',
  }),
  tools: Object.freeze({
    textToQr: Object.freeze({
      name: 'Text to QR code',
      description: 'Create a QR code from text or a link',
    }),
    qrToText: Object.freeze({
      name: 'Read QR code',
      description: 'Read text from a QR code image',
    }),
    imagesToPdf: Object.freeze({
      name: 'Images to PDF',
      description: 'Combine several images into one PDF',
    }),
    mergePdf: Object.freeze({
      name: 'Merge PDFs',
      description: 'Combine several PDF files into one file',
    }),
    pdfPageCount: Object.freeze({
      name: 'Count PDF pages',
      description: 'Find the number of pages in a PDF file',
    }),
    pdfSplit: Object.freeze({
      name: 'Extract PDF page',
      description: 'Extract one page from a PDF file',
    }),
    pdfExtractRange: Object.freeze({
      name: 'Extract PDF pages',
      description: 'Extract a page range from a PDF file',
    }),
    textToPdf: Object.freeze({
      name: 'Text to PDF',
      description: 'Convert plain text into a simple PDF document',
    }),
    pdfMetadata: Object.freeze({
      name: 'PDF metadata',
      description: 'View a PDF title, author, and other metadata',
    }),
    pdfRotate: Object.freeze({
      name: 'Rotate PDF pages',
      description: 'Rotate every page in a PDF file',
    }),
  }),
})

export default messagesEn
