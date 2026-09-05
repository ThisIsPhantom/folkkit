# Folkkit: Auswahl aus NoSignups

Stand: 5. September 2026. Dies sind Vorschläge auf die Frage, welche Funktionen aus [NoSignups](https://nosignups.net/) zu Folkkit passen. Sie erweitern den bereits freigegebenen Umsetzungsplan nicht.

## Empfohlene Reihenfolge

| Priorität | Funktion | Umfang für Folkkit | Grundlage |
| --- | --- | --- | --- |
| 1 | Bildeditor | Zuschneiden, drehen, spiegeln, Text und Wasserzeichen; Anschluss an die Bildoptimierung | [ToolsForImage](https://github.com/mlbrothers/ToolsForImage-OSS) als Funktionsvorbild; eigener Browser-Code |
| 2 | Dokumentkonvertierung | DOCX, Markdown und HTML; klare Grenzen bei komplexen Layouts | [Pandoc WASM](https://github.com/pandoc/pandoc-wasm) |
| 3 | Audio schneiden | Wellenform, Ausschnitt wählen und exportieren; später Lautstärke und Ein-/Ausblenden | [AudioMass](https://github.com/pkalogiros/AudioMass) als Bedienvorbild; bestehende Folkkit-Audioverarbeitung |
| 4 | Screenshots gestalten | Hintergrund, Fensterrahmen, Pfeile, Beschriftungen und verdeckte Bereiche | [Screenshot Studio](https://github.com/opennookorg/screenshot-studio) |
| 5 | PDF-Komfortfunktionen | Automatische Seitenzahlen, Wasserzeichen, Kopf- und Fusszeilen | [BentoPDF](https://github.com/alam00000/bentopdf) als Funktionsvorbild; bestehende PDFium-Engine |
| 6 | Druckvorbereitung | Grösse in Millimetern festlegen und grosse Motive auf mehrere A4-Seiten verteilen | [Planar](https://github.com/Mason363/Planar) |

Die Priorität ist eine Einschätzung aus Folkkits bestehendem Code und den geprüften Projektbeschreibungen. Für die direkte Übernahme fremden Codes sind die konkrete Version, Lizenz, Browser-Unterstützung und Laufzeitdateien noch zu prüfen.

## Technische Grenzen aus den Primärquellen

- ToolsForImage verwendet Flask und Python. Seine Funktionen passen als Vorbild; eine unveränderte Integration würde einen Server einführen.
- Pandoc WASM unterstützt Browser-Konvertierungen, liefert aber keine direkte PDF-Ausgabe. DOCX-Konvertierung bedeutet keine unveränderte Wiedergabe beliebiger Word-Seitenlayouts.
- [VERT](https://github.com/VERT-sh/VERT) nutzt für Video auf seiner offiziellen Instanz auch einen Server. Die Aussage «ohne Anmeldung» genügt deshalb nicht als Beleg für reine Browser-Verarbeitung.
- BentoPDF lädt manche Engines standardmässig von externen CDNs. Folkkit würde alle tatsächlich benötigten Laufzeitdateien selbst hosten.
- OCR und lokale Hintergrundentfernung bleiben mögliche spätere Schritte. Modellgrösse, Qualität und Verhalten auf schwächeren Geräten brauchen dafür einen eigenen Machbarkeitsnachweis.

Die erste Sichtung empfiehlt Bildeditor, Dokumentkonvertierung und Audio-Schnitt nach Abschluss des laufenden Ausbaus. Es wurden keine fremden Apps eingebettet oder zusätzliche Dienste eingerichtet.
