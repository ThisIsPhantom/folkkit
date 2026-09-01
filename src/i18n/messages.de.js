const messagesDe = Object.freeze({
  shell: Object.freeze({
    skip: 'Zum Inhalt springen',
    home: 'Startseite',
    tools: 'Werkzeuge',
    privacyStatus: 'Lokale Verarbeitung',
    localeLabel: 'Sprache wählen',
    themeLight: 'Helles Design',
    themeDark: 'Dunkles Design',
    menuOpen: 'Menü öffnen',
    menuClose: 'Menü schliessen',
    mobileNavigation: 'Mobile Navigation',
    primaryNavigation: 'Hauptnavigation',
    privacy: 'Datenschutz',
    openSource: 'Open Source',
    licenses: 'Lizenzen',
    terms: 'Nutzungsbedingungen',
    contact: 'Kontakt',
    source: 'Quellcode',
    footerNote: 'Folkkit verarbeitet Dateiinhalte lokal in deinem Browser.',
  }),
  home: Object.freeze({
    eyebrow: 'Werkzeuge für den Alltag',
    title: 'Dateien bearbeiten, ohne sie hochzuladen.',
    intro: 'PDFs ordnen, QR-Codes erstellen und Formate umwandeln. Die Verarbeitung läuft direkt auf deinem Gerät.',
    privacyTitle: 'Deine Dateien bleiben in diesem Browser.',
    privacyBody: 'Folkkit überträgt keine Dateiinhalte zur Verarbeitung. Der statische Webhost kann beim Seitenaufruf technische Zugriffsdaten erhalten.',
    pdfTitle: 'PDF bearbeiten',
    pdfBody: 'PDFs zusammenführen, Seiten extrahieren oder drehen.',
    qrTitle: 'QR-Code erstellen',
    qrBody: 'Text oder einen Link lokal in einen QR-Code umwandeln.',
    convertTitle: 'Datei konvertieren',
    convertBody: 'Mit einer einfachen Formatumwandlung beginnen.',
    catalogLink: 'Alle freigegebenen Werkzeuge ansehen',
  }),
  catalog: Object.freeze({
    toolCount: '{count} Werkzeuge',
    eyebrow: 'Werkzeugkatalog',
    title: 'Alle freigegebenen Werkzeuge',
    intro: 'Hier erscheinen nur Werkzeuge, die den aktuellen Freigabestatus erfüllen.',
    openTool: '{name} öffnen',
  }),
  workspace: Object.freeze({
    eyebrow: 'Lokaler Arbeitsbereich',
    title: 'Datei lokal bearbeiten',
    intro: 'Wähle eine Eingabe. Verarbeitung und Ergebnis bleiben in dieser Sitzung auf deinem Gerät.',
    dropOverlay: 'Datei zum Konvertieren ablegen',
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
