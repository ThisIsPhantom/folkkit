export default {
  layoutHint: 'Inhalte, Listen und Tabellen werden übernommen. Seitenlayout und Formatierung können sich ändern.',
  limits: 'DOCX bis 20 MiB · Markdown und HTML bis 2 MiB',
  errors: {
    invalid_document: 'Das Dokument ist beschädigt oder passt nicht zum Dateityp.',
    document_too_large: 'Das Dokument überschreitet die lokale Verarbeitungsgrenze.',
    document_timeout: 'Die Verarbeitung hat zu lange gedauert. Versuche ein kleineres Dokument.',
    unsafe_document: 'Dieses Dokument enthält eine nicht unterstützte oder unsichere Struktur.',
    document_runtime_unavailable: 'Das Dokumentmodul ist nicht verfügbar. Lade es einmal mit Internetverbindung und versuche es erneut.',
  },
  warnings: {
    external_resources_omitted: 'Extern verknüpfte oder fehlende Bilder wurden ausgelassen.',
    unsupported_images_omitted: 'Nicht unterstützte Bilder wurden ausgelassen. PNG, JPEG und WebP werden übernommen.',
    layout_changed: 'Seitenlayout und Formatierung können vom Original abweichen.',
  },
}
