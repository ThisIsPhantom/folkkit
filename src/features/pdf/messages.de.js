export default {

  "resize": "Skalieren: {corner}",
  "corner": {
    "nw": "oben links",
    "ne": "oben rechts",
    "sw": "unten links",
    "se": "unten rechts"
  },
  "properties": "Eigenschaften",
  "allPages": "Alle auswählen",
  "clearPages": "Auswahl aufheben",
  "selectedPages": "{count} ausgewählt",
  "selectPage": "Seite {number} auswählen",
  "viewing": "Angezeigt",
  "pageSelectionHint": "Seiten für gemeinsame Aktionen ankreuzen. Ausgewählte Seiten zum Sortieren ziehen.",
  "rotateSelected": "Ausgewählte Seiten drehen",
  "deleteSelected": "Ausgewählte Seiten löschen",
  "extractSelected": "Ausgewählte Seiten herunterladen",
  "actions": {
    "edit": {
      "title": "PDF bearbeiten",
      "before": "Wähle ein PDF, um Text, Bilder und Seiten zu bearbeiten.",
      "after": "Unterstützte Objekte ziehen oder an den Eckgriffen skalieren. Text zum Bearbeiten doppelt anklicken."
    },
    "merge": {
      "title": "PDFs zusammenführen",
      "before": "Wähle das erste PDF. Hänge danach weitere PDFs in der gewünschten Reihenfolge an.",
      "after": "Wähle «Weiteres PDF anfügen» für jede weitere Datei. Lade danach das zusammengeführte PDF herunter."
    },
    "extract": {
      "title": "PDF-Seiten extrahieren",
      "before": "Wähle ein PDF und kreuze die Seiten an, die du herunterladen möchtest.",
      "after": "Kreuze eine oder mehrere, auch getrennte Seiten an. Der Download folgt der Dokumentreihenfolge."
    },
    "rotate": {
      "title": "PDF-Seiten drehen",
      "before": "Wähle ein PDF und danach die Seiten zum Drehen.",
      "after": "Kreuze die gewünschten Seiten an. Jede Aktion dreht alle ausgewählten Seiten um 90 Grad im Uhrzeigersinn."
    },
    "count": {
      "title": "PDF-Seiten zählen",
      "before": "Wähle ein PDF, um die Seitenzahl zu sehen.",
      "after": "Dieses PDF enthält {count} Seiten."
    },
    "organize": {
      "title": "PDF-Seiten ordnen",
      "before": "Wähle ein PDF, um Seiten auszuwählen, zu sortieren oder zu entfernen.",
      "after": "Kreuze Seiten für gemeinsame Aktionen an. Ziehe sie in die gewünschte Reihenfolge oder nutze die Verschiebeknöpfe."
    }
  }
,
  recover: 'Letzten Bearbeitungsstand wiederherstellen',
  title: 'PDF bearbeiten', intro: 'Texte anpassen, Seiten ordnen und Ergänzungen einfügen.',
  choose: 'PDF auswählen', drop: 'PDF hier ablegen', limits: 'Bis 32 MiB und 200 Seiten. Deine Datei bleibt in diesem Browser.',
  working: 'PDF wird verarbeitet …', cancel: 'Abbrechen', download: 'PDF herunterladen', original: 'Original herunterladen',
  undo: 'Rückgängig', redo: 'Wiederholen', saved: 'Änderungen heruntergeladen', unsaved: 'Ungespeicherte Änderungen',
  discard: 'Ungespeicherte Änderungen verwerfen?', page: 'Seite {number}', pages: 'Seiten',
  select: 'Auswählen', text: 'Text', image: 'Bild', highlight: 'Markieren', underline: 'Unterstreichen',
  draw: 'Zeichnen', note: 'Notiz', rectangle: 'Rechteck', ellipse: 'Ellipse', line: 'Linie', signature: 'Unterschrift zeichnen', signatureImage: 'Unterschrift als Bild',
  tools: 'Werkzeuge', content: 'Textinhalt', apply: 'Übernehmen', insert: 'Einfügen', fontSize: 'Schriftgrösse',
  color: 'Farbe', stroke: 'Linienstärke', x: 'X-Position', y: 'Y-Position', width: 'Breite', height: 'Höhe',
  placement: 'Position ab linker unterer Seitenecke in PDF-Punkten. Du kannst auch direkt auf der Seite platzieren oder zeichnen.',
  selectHint: 'Wähle ein Text- oder Bildobjekt auf der Seite.', textHint: 'Unterstützte Textobjekte werden im PDF ersetzt. Es gibt keinen automatischen Absatzumbruch.',
  unsupportedText: 'Dieses Textobjekt lässt sich hier nicht zuverlässig ersetzen. Nutze bei Bedarf neuen Text an einer freien Stelle.',
  scan: 'Auf dieser Seite wurde kein bearbeitbarer Text gefunden. Für Scans ist keine Texterkennung enthalten.',
  fontHint: 'Lateinische Zeichen mit Umlauten. Vollständige eingebettete Schriften und Standardschriften werden unterstützt, Teilmengen und gedrehte Textobjekte können ausgeschlossen sein.',
  signatureHint: 'Eine sichtbare Unterschrift als Bild oder Zeichnung, ohne kryptografische Signatur.',
  selectedObject: '{type} {number}', objectText: 'Textobjekt', objectImage: 'Bildobjekt', removeObject: 'Objekt löschen',
  moveLeft: 'Nach links', moveRight: 'Nach rechts', moveUp: 'Nach oben', moveDown: 'Nach unten', grow: 'Vergrössern', shrink: 'Verkleinern',
  rotate: 'Seite drehen', duplicate: 'Seite duplizieren', deletePage: 'Seite löschen', previous: 'Seite nach vorne', next: 'Seite nach hinten',
  blank: 'Leere Seite', merge: 'Weiteres PDF anfügen', extract: 'Seite herunterladen', zoom: 'Zoom',
  search: 'Text suchen', searchAction: 'Suchen', noResults: 'Kein Text gefunden.', matches: '{count} Treffer',
  preview: 'PDF-Seitenvorschau', document: 'PDF-Dokument', close: 'Dokument schliessen', addHint: 'Wähle ein Werkzeug. Klicken platziert Text und Notizen; Ziehen erstellt Formen und Zeichnungen.',
  errors: { unsupported_structure: 'Vorhandene Formularstrukturen lassen sich bei diesem Vorgang nicht zuverlässig erhalten. Das PDF wurde nicht verändert.', invalid_file: 'Das PDF konnte nicht verarbeitet werden. Wähle eine gültige, unverschlüsselte Datei.', resource_limit: 'Die Datei oder dieser Arbeitsschritt überschreitet das lokale Limit. Verwende eine kleinere Datei oder einen tieferen Zoom.', unsupported_text: 'Diese Schrift, Zeichen oder Textausrichtung wird nicht unterstützt. Die Änderung wurde verworfen.', last_page: 'Die letzte Seite kann nicht gelöscht werden.', cancelled: 'Verarbeitung abgebrochen.', unsupported_browser: 'Dieser Browser unterstützt den PDF-Arbeitsbereich nicht.' },
}
