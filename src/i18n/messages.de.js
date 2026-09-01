const messagesDe = Object.freeze({
  catalog: Object.freeze({
    toolCount: '{count} Werkzeuge',
  }),
  labels: Object.freeze({
    experimental: 'Experimentell',
  }),
  categories: Object.freeze({
    encode: 'QR und Codierung',
    document: 'PDF und Dokumente',
  }),
  tools: Object.freeze({
    textToQr: Object.freeze({
      name: 'Text in QR-Code',
      description: 'QR-Code aus Text oder einem Link erstellen',
    }),
    qrToText: Object.freeze({
      name: 'QR-Code lesen',
      description: 'Text aus einem QR-Code-Bild lesen',
    }),
    imagesToPdf: Object.freeze({
      name: 'Bilder in PDF',
      description: 'Mehrere Bilder zu einem PDF zusammenführen',
    }),
    mergePdf: Object.freeze({
      name: 'PDFs zusammenführen',
      description: 'Mehrere PDF-Dateien zu einer Datei zusammenführen',
    }),
    pdfPageCount: Object.freeze({
      name: 'PDF-Seiten zählen',
      description: 'Anzahl Seiten einer PDF-Datei ermitteln',
    }),
    pdfSplit: Object.freeze({
      name: 'PDF-Seite extrahieren',
      description: 'Eine einzelne Seite aus einer PDF-Datei extrahieren',
    }),
    pdfExtractRange: Object.freeze({
      name: 'PDF-Seiten extrahieren',
      description: 'Einen Seitenbereich aus einer PDF-Datei extrahieren',
    }),
    textToPdf: Object.freeze({
      name: 'Text in PDF',
      description: 'Klartext in ein einfaches PDF-Dokument umwandeln',
    }),
    pdfMetadata: Object.freeze({
      name: 'PDF-Metadaten',
      description: 'Titel, Autor und weitere PDF-Metadaten anzeigen',
    }),
    pdfRotate: Object.freeze({
      name: 'PDF-Seiten drehen',
      description: 'Alle Seiten einer PDF-Datei drehen',
    }),
  }),
})

export default messagesDe
