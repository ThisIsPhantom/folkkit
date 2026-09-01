const messagesEn = Object.freeze({
  shell: Object.freeze({
    skip: 'Skip to content',
    home: 'Home',
    tools: 'Tools',
    privacyStatus: 'Local processing',
    localeLabel: 'Choose language',
    themeLight: 'Light theme',
    themeDark: 'Dark theme',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    mobileNavigation: 'Mobile navigation',
    primaryNavigation: 'Primary navigation',
    privacy: 'Privacy',
    openSource: 'Open source',
    licenses: 'Licenses',
    terms: 'Terms',
    contact: 'Contact',
    source: 'Source code',
    footerNote: 'Folkkit processes file contents locally in your browser.',
  }),
  home: Object.freeze({
    eyebrow: 'Everyday tools',
    title: 'Work with files without uploading them.',
    intro: 'Organize PDFs, create QR codes, and change formats. Processing runs directly on your device.',
    privacyTitle: 'Your files stay in this browser.',
    privacyBody: 'Folkkit does not send file contents away for processing. The static web host may receive technical access data when you open the site.',
    pdfTitle: 'Edit PDF',
    pdfBody: 'Merge PDFs, extract pages, or rotate them.',
    qrTitle: 'Create QR code',
    qrBody: 'Turn text or a link into a QR code locally.',
    convertTitle: 'Convert file',
    convertBody: 'Start with a straightforward format conversion.',
    catalogLink: 'View all released tools',
  }),
  catalog: Object.freeze({
    toolCount: '{count} tools',
    eyebrow: 'Tool catalog',
    title: 'All released tools',
    intro: 'Only tools that meet the current release status appear here.',
    openTool: 'Open {name}',
  }),
  workspace: Object.freeze({
    eyebrow: 'Local workspace',
    title: 'Work with a file locally',
    intro: 'Choose an input. Processing and results stay on your device for this session.',
    dropOverlay: 'Drop the file to convert it',
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
