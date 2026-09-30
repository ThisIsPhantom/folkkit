# Folkkit Bewerbungs-Studio

Status: Am 30. September 2026 vom Benutzer schriftlich zur Implementierungsplanung freigegeben.

## Ziel und bestehender Kontext

Ein neuer Arbeitsbereich `/application` erstellt Lebensläufe und Bewerbungsanschreiben. Die gelieferten Referenzbilder bestimmen die Bedienung: Formulare neben einer Dokumentvorschau, aufklappbare Inhaltsabschnitte und umfangreiche Gestaltungseinstellungen. Das Ergebnis soll professionell wirken und deutlich mehr Kontrolle als ein einfacher Vorlagenfüller bieten.

Die Umsetzung erweitert die vorhandene React-19/Vite-App. Es gelten der aktuelle helle Folkkit-Studio-Stil, optionales dunkles UI, Deutsch/Englisch, lokale Verarbeitung und selbst gehostete Assets. Die ursprüngliche V1-Ausnahme für Lebenslaufeditoren wird durch diese ausdrücklich beauftragte Erweiterung aufgehoben. Bestehende Werkzeuge bleiben funktionsfähig.

## Bedienung und visuelle Richtung

- Kopfbereich mit Dokumentwechsel Lebenslauf/Anschreiben, Projekt öffnen/speichern, Rückgängig/Wiederholen und PDF-Download.
- Linke Bearbeitungsfläche mit den Bereichen Inhalt, Vorlagen, Gestaltung und Textbausteine. Rechts eine massstabsgetreue, mehrseitige Vorschau mit Zoom und Seitenzahl.
- Texte werden ausschliesslich in beschrifteten Formularfeldern links geändert. Ein Klick auf einen Abschnitt in der Vorschau darf dessen Einstellungen auswählen, macht das Dokument aber nicht zu einer editierbaren Textfläche.
- Auf Mobilgeräten umschaltbare Ansichten Bearbeiten/Vorschau; keine unbedienbar verkleinerte Desktopoberfläche.
- Ruhige weisse Karten, Graphit, zurückhaltende Akzentfarben, klare Typografie und kleine Dokument-Miniaturen. Keine externen Fonts, Neon- oder KI-Dekoration.

## Inhaltsmodell

Ein Bewerbungsprojekt enthält gemeinsame Personendaten sowie eigenständige Lebenslauf- und Anschreibendokumente. Inhalte, Reihenfolge, Sichtbarkeit und Gestaltung sind getrennte Datenbereiche. Vorlagenwechsel verändert nur Gestaltungsvorgaben.

Gemeinsame Personendaten: Name, Berufstitel, E-Mail, Telefon, Ort/Adresse, Website, LinkedIn, optionale Staatsangehörigkeit und optionales Foto. Leere Angaben erscheinen nicht in der Ausgabe. Fotoauswahl ist lokal und entfernbar.

Lebenslaufabschnitte: Profil, Berufserfahrung, Ausbildung, Kenntnisse, Sprachen, Projekte sowie Engagement/Verantwortung. Eigene Abschnitte ergänzen diese. Wiederholbare Einträge besitzen stabile IDs und passende Felder für Titel, Organisation, Ort, Zeitraum und Beschreibung. Beschreibungen unterstützen Absätze und Aufzählungspunkte. Jeder Abschnitt und Eintrag kann hinzugefügt, dupliziert, verschoben, ausgeblendet oder gelöscht werden. Reihenfolgeänderungen bieten Tastaturbuttons zusätzlich zu einer möglichen Drag-Bedienung. Abschnittstitel sind editierbar.

Anschreiben: Absender aus gemeinsamen Daten, Empfänger, Ort/Datum, Betreff, Anrede, Textabsätze, Grussformel und ausgeschriebener Name. Inhalt und individuelle Absatzgestaltung bleiben getrennt. Datumsvorgabe ist der aktuelle Tag der Sitzung; Projektimport erhält das gespeicherte Datum.

Es werden ausdrücklich als Beispiel gekennzeichnete fiktive Daten angeboten. Die personenbezogenen Daten aus den Referenzbildern werden nicht als Produktstandard übernommen.

## Vorlagen

Vier lokale, originale Vorlagen mit abgestimmtem Lebenslauf und Anschreiben:

1. ATS Pur: eine Spalte, klare Standardüberschriften, keine Layouttabellen, keine dekorativen Icons oder Foto im Standard.
2. Modern: klare serifenlose Schrift, Akzentlinien und kompakter Kopfbereich.
3. Editorial: Serifentypografie und markante Überschriften mit ruhigen Trennlinien.
4. Swiss Classic: sachlicher Kopf, übersichtliche Datumsspalte und optionales Foto.

Alle Vorlagen liefern echten PDF-Text. ATS Pur ist die empfohlene Variante für automatische Bewerbungssysteme. Es gibt keine universelle ATS-Garantie und keinen erfundenen ATS-Score. Der Export wird unabhängig auf Textinhalt und Lesereihenfolge geprüft. Mehrspaltige Gestaltung wird als mögliche Einschränkung für Parser erklärt.

## Gestaltung unabhängig vom Inhalt

Globale Optionen pro Dokument: A4/Letter, Seitenränder, Fontfamilie aus verfügbaren lokalen bzw. PDF-einbettbaren Schriften, Grundschriftgrösse, Zeilenhöhe, Absatzabstand, Abschnittsabstand, Akzentfarbe, Textfarbe und Kopfgestaltung. Lebenslaufoptionen ergänzen Datumsspaltenbreite und Eintragsabstand. Fotogrösse und runde/rechteckige Form sind einstellbar.

Abschnittsoptionen: Überschriftgrösse, Schriftgewicht, Grossschreibung, Farbe, Ausrichtung, Trennlinie mit Stärke und Abständen sowie Abstand davor/danach. Beschreibungstext bzw. Anschreibenabsätze können eigene Schriftgrösse, Ausrichtung und Abstände erhalten. Die Seitenleiste zeigt eindeutig, für welches Element die Einstellungen gelten.

Leere Abschnitte lassen sich im Formular gestalten, auch wenn sie in der finalen Ausgabe keinen Platz einnehmen. Ein ausdrücklich hinzugefügter Abstandhalter oder Trenner ist ein eigenständiges Formelement ohne Textinhalt; er besitzt Höhe bzw. Liniengestaltung und kann verschoben/entfernt werden. Ein Design-Reset verändert keinen Inhalt. Ungültige Zahlen, unlesbare Farben und Einstellungen ausserhalb des zulässigen Layoutbereichs werden an den betreffenden Feldern erklärt.

## Textbausteine und Hilfen

Lokale Textbausteine für Profil, messbare Leistungen, Tätigkeiten und Anschreibenabsätze. Auswahl bietet zunächst eine Vorschau und wird erst durch Übernehmen eingefügt. Vorlagen enthalten klar erkennbare Platzhalter statt erfundener Leistungen.

Lokale Checkliste für fehlende Kontaktdaten, offene Platzhalter, leere Pflichtbestandteile und überlange Dokumente. Keine automatische Behauptung fachlicher Eignung. Ein optionales manuell eingefügtes Stelleninserat kann für einen einfachen lokal berechneten Keyword-Vergleich verwendet werden; dieser ist kein ATS-Score. Cloud-KI und externe Bewerbungsdienste gehören nicht zur Umsetzung, da sie dem bestehenden Inhaltsdatenschutz widersprechen. Geeignete lokale Bibliotheken werden nach Funktion, Lizenz, Grösse und Datenschutz gewählt.

## Vorschau, Seitenumbrüche und PDF

Ein gemeinsames Layoutmodell berechnet Schriftmetriken, Zeilenumbrüche und Positionen in Dokumentkoordinaten. Vorschau und PDF verwenden dieselben fertigen Seiten und Textläufe; kein Screenshot-PDF und kein separater Browserdruck als Hauptausgabe.

Seiten entstehen automatisch. Überschriften bleiben mit dem Beginn ihres Inhalts zusammen. Einträge bleiben zusammen, wenn sie auf eine Seite passen; längere Beschreibungen dürfen mit Fortsetzung umbrechen. Keine abgeschnittenen Inhalte, stillen Überläufe oder automatisch verkleinerten Schriften. Manuelle Seitenumbrüche sind als Formelement möglich. Die Vorschau zeigt sämtliche Seiten und stimmt mit den Exportkoordinaten überein.

PDF-Export nutzt bevorzugt das vorhandene `pdf-lib`, erweitert nur bei notwendiger Schrifteinbettung. Text bleibt auswählbar; sichtbare Web-/E-Mail-Links werden als passende PDF-Links exportiert. Ein optionales Foto wird lokal eingebettet. ATS Pur wird ohne unnötige Layoutgrafiken ausgegeben. Lebenslauf und Anschreiben sind einzeln exportierbar; ein gemeinsames Bewerbungs-PDF bewahrt die Dokumentreihenfolge.

## Technische Grenzen und Datenfluss

Das neue Feature liegt unter `src/features/application/` und wird lazy geladen. Modell/Validierung, Vorlagen, Layout, PDF-Ausgabe und UI besitzen getrennte Module. Übersetzungen werden über das vorhandene i18n-System integriert. Route, Navigation und freigegebener Studiokatalog erhalten den neuen Einstieg.

Eingabe → validiertes Projektmodell → deterministisches Layout → Live-Vorschau/PDF. Dokumentinhalte bleiben im Sitzungsspeicher und bei interner Navigation erhalten. Ausgeblendete Sitzungen lösen keine laufenden Vorschaujobs aus. Spätere Ergebnisse dürfen neuere Bearbeitungen nicht überschreiben.

Rückgängig/Wiederholen betrifft Inhalte und Gestaltung. Zusammenhängende Texteingaben werden sinnvoll gruppiert; eine Einfüge-, Lösch-, Vorlagen- oder Verschiebeaktion ist ein Schritt. History ist begrenzt und bleibt im Speicher.

Projekt speichern lädt eine versionierte JSON-Datei lokal herunter. Projekt öffnen validiert Version, Struktur, Textlängen und Gestaltungswerte vor dem Ersetzen des aktiven Projekts. Fehler erhalten das bisherige Projekt. Keine automatische Speicherung in localStorage/IndexedDB. Vollständiges Zurücksetzen löscht Sitzung, Bilder und Undo-Verlauf nach einer konkreten Warnung.

Startgrenzen: Projektdatei 5 MiB, Foto 5 MiB und 12 Megapixel, maximal 100 Einträge und 100.000 Textzeichen im Projekt. Layout maximal 20 Seiten; Überschreitungen werden sichtbar gemeldet und blockieren den Export, ohne Inhalte zu löschen. Grenzen werden durch Tests abgesichert. Import übernimmt ausschliesslich erlaubte Felder; beliebiges HTML, Scripts und externe Bildressourcen werden nicht verarbeitet.

## Fehler und Datenschutz

Import-, Foto-, Layout- und Exportfehler erscheinen lokalisiert und ohne Dokumentinhalte in Logs. Ein Exportfehler verwirft keinen Text. Object-URLs und temporäre Bildressourcen werden bei Ersetzen, Zurücksetzen und Unmount freigegeben. Downloads sind ausdrückliche Benutzeraktionen. Keine Telemetrie und keine Inhaltsübertragung an Dritte.

## Abnahme

- Unit-/Vertragstests für Modellvalidierung, Vorlagenwechsel ohne Inhaltsverlust, Undo/Redo, Seitenumbrüche, Grenzfälle und PDF-Textreihenfolge.
- Komponententests für getrennte Inhalts-/Formbearbeitung, Eintragsverwaltung, Sichtbarkeit, Importfehler und vollständige DE/EN-Texte.
- Browserabläufe: beide Dokumenttypen erstellen, gestalten, Projekt speichern/öffnen und PDF exportieren; Navigation erhält die Sitzung.
- Unabhängiges PDF-Wiederöffnen mit vorhandenem PDF.js-Testwerkzeug: Text, Seitenzahl, Lesereihenfolge, Links und eingebettetes Foto kontrollieren. Mehrseitige lange Texte dürfen weder fehlen noch abgeschnitten sein.
- Desktop/Mobil, Tastatur, sichtbarer Fokus, Zoom, Kontrast, reduzierte Bewegung und axe-Prüfung.
- Netzwerk-/Storageprüfung unter Produktions-CSP: keine externen Laufzeitrequests oder ungewollte Speicherung von Inhalten.
- Lint, Unit-/Vertragstests, Produktionsbuild und passende Browser-/Datenschutzchecks müssen vor einer Fertigmeldung bestehen. Neue Abhängigkeiten benötigen vollständige Notices.

## Umsetzung und Veröffentlichung

Nach Freigabe dieser Spezifikation folgt ein reviewbarer Implementierungsplan. Umsetzung, Verifikation und Dokumentation erfolgen im Repository. GitHub-Publikation und Live-Deployment werden durch diese Spezifikation nicht zusätzlich freigegeben; dafür gilt der bestehende Veröffentlichungskontext.
