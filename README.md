# Folkkit

Folkkit is a bilingual, local-first browser utility suite for everyday PDF, QR, and file conversion work. It is derived from [Convert Everything](https://github.com/MercuriusDream/convert-everything) and preserves its full Git history under AGPL-3.0-only.

## Current status

Das Repository ist öffentlich. Dateien werden im Browser verarbeitet; eine dauerhafte Inhaltschronik gibt es nur nach ausdrücklicher Aktivierung. Sprache und Design können lokal gespeichert werden. Öffentliche Builds benötigen weiterhin die freigegebenen Betreiberangaben und bestandene Releaseprüfungen. Der GitHub-Workflow aktualisiert den Hosting-Branch; ein manueller Live-Eingriff bleibt ein separater Schritt.

The canonical design is [docs/superpowers/specs/2026-08-31-folkkit-design.md](docs/superpowers/specs/2026-08-31-folkkit-design.md).

Die freigegebene [Studio-Erweiterung](docs/superpowers/plans/2026-09-05-folkkit-studio.md) ergänzt eigene Arbeitsbereiche und ersetzt die bisherige visuelle Richtung:

- `/qr`: QR-Designer für Text, Links, WLAN, Kontakte, E-Mail und SMS. Farben, Formen und Logo lassen sich anpassen. Ausgabe als PNG/SVG oder als Bild in die Zwischenablage kopieren. Das Design lässt sich separat zurücksetzen; Inhalt und Logo bleiben erhalten. QR-Codes aus lokalen PNG-, JPEG- und WebP-Bildern lesen.
- `/pdf`: native Textobjekt-Bearbeitung, direktes Verschieben/Skalieren, Ergänzungen und Seitenverwaltung mit Mehrfachauswahl, Bereichen wie «1–3, 7» und direktem Seitensprung. Unterstützte lateinische Textobjekte sind bearbeitbar; OCR, Absatzrekonstruktion und Formularerstellung sind ausgenommen. Unsichere Operationen an vorhandenen Formularstrukturen werden vorab verweigert.
- `/convert`: Dateiwarteschlange mit 39 Formatpaaren, darunter alle sechs Richtungen zwischen DOCX, Markdown und HTML. Bildoptimierung, Vorher-/Nachher-Vorschau, übertragbare Einstellungen für gleiche Formatpaare, Abbruch, Einzel- und ZIP-Downloads. Fertige Aufträge lassen sich gemeinsam entfernen.
- `/calculate`: Prozentfelder, Dreisatz, Pythagoras, Kreis, Flächen, Volumen, Einheiten, Seitenverhältnis, Kreditrate, BMI, Datum und Zeitspannen. Eigene Formulare, Beispiele und kopierbare Ergebnisse; alte Links bleiben erreichbar. Der Prozentrechner berechnet auch Rabatt, Aufschlag und Endpreis.

Die [Erweiterung für Bilder, Dokumente und Audio](docs/superpowers/specs/2026-09-06-folkkit-creative-tools-design.md) ergänzt zwei Editoren und die Dokumentformate im Konverter:

- `/image`: PNG, JPEG und WebP zuschneiden, drehen und spiegeln; eigene Texte und Wasserzeichen mit direkter Vorschau verschieben und vergrössern. Ausgewählte Texte und Wasserzeichen lassen sich duplizieren und in ihrer Reihenfolge ändern. Rückgängig, Wiederholen und Export verwenden das unveränderte Original als Grundlage.
- `/audio`: MP3, WAV, FLAC und OGG/Vorbis per Dateiauswahl oder Drag-and-drop öffnen, zuschneiden, mit Ein-/Ausblenden anhören und exportieren. Enter übernimmt Zeiteingaben, Escape verwirft den Entwurf; der Fokus bleibt im Feld. Unveränderte Werte erhalten den fertigen Download.
- DOCX/Markdown/HTML: Texte, Listen, Tabellen und unterstützte eingebettete Bilder konvertieren. Word-Seitenlayouts werden nicht identisch nachgebildet; eigene Word-Sprungmarken können verloren gehen. HTML-Ausgaben sind passiv; externe Bilder werden ausgelassen. Markdown mit Bildern wird als ZIP ausgegeben.

Das Bewerbungs-Studio unter `/application` erstellt Lebenslauf und Anschreiben mit gemeinsamen Kontaktdaten. Inhalte werden in Formularen neben einer mehrseitigen Live-Vorschau bearbeitet. Sechs originale Vorlagen (ATS Pur, Modern, Editorial, Swiss Classic, Folio, Compact), globale und individuelle Schrift-/Abstandseinstellungen, Trennlinien, Abstandhalter, Seitenumbrüche, Fotos und Textbausteine sind enthalten. Abschnitte und Einträge lassen sich duplizieren, verschieben und ausblenden. Rückgängig/Wiederholen bleibt in der Sitzung; Projekte werden ausdrücklich als lokale JSON-Datei gespeichert und wieder geöffnet. PDF-Ausgaben enthalten echten Text und Links; beide Dokumente können einzeln oder zusammen exportiert werden.

ATS Pur verwendet eine Spalte; die tatsächliche Verarbeitung hängt vom Bewerbungssystem ab. Unter «Gestaltung → Spaltenlayout» gibt es eine oder zwei echte Inhaltsspalten mit veränderbarem Abstand und Breitenverhältnis. Abschnitte können unter «Inhalt → Abschnittsbreite» automatisch, links, rechts oder über die ganze Breite angeordnet werden, auch bei einspaltiger Dokumentvorgabe. «Neuen Spaltenbereich beginnen» setzt beide Spalten unter dem bisherigen Inhalt fort. Volle Breite führt beide Spalten zusammen; darunter sind erneut zwei Spalten möglich. Fotos lassen sich links/rechts platzieren, von 24 bis 180 pt skalieren und mit separaten Rand-/Höhenabständen verschieben. «Foto gestalten» öffnet die Regler direkt. Acht Schriftfamilien stehen bereit: Helvetica, Times, Courier sowie lokal eingebundene Open Sans, Noto Sans, Noto Serif, Source Sans 3 und Source Serif 4. Die zusätzlichen Schriften werden bedarfsgerecht geladen und im PDF eingebettet. Nicht darstellbare Zeichen werden gemeldet und blockieren den PDF-Export. Projekt-/Fotodateien sind auf 5 MiB begrenzt, eingelesene Fotos auf 24 Megapixel; Projekte enthalten maximal 100 Einträge und 100.000 Textzeichen, Dokumente maximal 20 Seiten. Textbausteine und Wortvergleich laufen lokal und erzeugen keine KI- oder Eignungsbewertung.

Die Audiovorschau verwendet den nativen Decoder des Browsers. Fehler können auch nach einem erfolgreichen Start auftreten. Folkkit zeigt sie an; Bearbeiten und Exportieren bleiben verfügbar.

Bildoriginale sind auf 32 MiB und 24 Megapixel begrenzt, Audiodateien auf 100 MiB und 30 Minuten. DOCX darf 20 MiB, Markdown oder HTML 2 MiB gross sein. Die Dokumentengine Pandoc 3.10 (Wrapper 1.1.0, rund 58.6 MB WASM) und die Audioengine laden erst bei der Nutzung; nach erfolgreichem Laden können sie aus dem Browsercache auch offline arbeiten.

Der [freigegebene Bedienausbau](docs/superpowers/plans/2026-09-05-folkkit-usability.md) ergänzt ausserdem Katalogsuche, Kategorien und Werkzeugfavoriten. Aktive Filter lassen sich jederzeit zurücksetzen; beim Entfernen von Favoriten bleibt ein passender Tastaturfokus erhalten. QR-, Rechner-, Konverter- und Editorsitzungen bleiben beim internen Bereichswechsel im Arbeitsspeicher erhalten.

Alte `/workspace`-Links führen für passende Werkzeuge in die Studios. Der Textarbeitsbereich bleibt für die weiteren Text- und Datenwerkzeuge verfügbar. Dateiinhalte bleiben im Browser und werden in diesen Arbeitsbereichen nicht dauerhaft gespeichert. Die QR-Abhängigkeit erhält einen dokumentierten [UTF-8-Patch](patches/README.md).

Die [lokale Verifikation](docs/folkkit-studio-verifikation.md) dokumentiert geprüfte Ausgaben, Browserabdeckung und Einschränkungen.

## Development

```bash
git clone https://github.com/ThisIsPhantom/folkkit.git
cd folkkit
bun install && bun run dev
```

Entwicklung und Verifikation verwenden Bun 1.3.3 sowie Node.js 22.13+ innerhalb der 22er-Reihe oder Node.js 24+. PDF.js ist ausschliesslich eine Testabhängigkeit zur unabhängigen Kontrolle der PDF-Ausgaben.

Die Browserprüfungen der Dateikonvertierung benötigen zusätzlich `ffmpeg` und `ffprobe` im `PATH`. Alternativ können `FOLKKIT_TEST_FFMPEG` und `FOLKKIT_TEST_FFPROBE` auf die vorhandenen Programme zeigen. Diese nativen Programme dienen ausschliesslich der unabhängigen Testauswertung und gehören nicht zum ausgelieferten Browserprogramm.

### Public release configuration

Copy `.env.example` to a local environment file and replace every example value with the approved public operator details:

```text
VITE_PUBLIC_OPERATOR_NAME=
VITE_PUBLIC_CONTACT_EMAIL=
```

`bun run build:release` rejects a missing name or contact email as well as unchanged example values and requires an exact clean Git `HEAD`. It archives that validated commit into a temporary source tree, installs the committed lockfile from scratch with lifecycle scripts disabled, verifies the committed notices, synchronizes the exact runtime assets, and builds with the validated commit. Only the resulting `dist` directory is copied back. Do not commit real operator details to the repository.

## Hosttech and `plesk` contract

`bun run build:site` creates a non-public validation artifact in `dist`. It synchronizes the same-origin runtime assets, checks the committed third-party notices, runs Vite, generates the service worker, applies the bundle budgets, removes build-only manifests, and copies the reviewed `hosting/.htaccess`. This command does not satisfy the public operator gate and does not publish anything.

Validate a clean local feature revision without changing a branch, ref, or working file:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/Publish-PleskBranch.ps1 -SourceRef feature/folkkit-v1 -TargetBranch plesk -Remote origin -ValidateOnly
```

The validator builds an isolated `git archive`, installs `bun.lock` with lifecycle scripts disabled, checks the runtime-only allowlist, compares the Git tree with `dist`, and reports its file count and SHA-256 tree hash.

`-Push` is a separate, manual operation. It accepts only a clean local `main` that tracks and exactly matches `origin/main`. It uses `build:release`, so approved public operator values and the exact archived commit remain mandatory. It creates the hosting commit with a temporary Git index and pushes without force. It does not log in to Hosttech, upload files, change DNS, or perform a live deployment.

`bun run generate:notices` regenerates `THIRD_PARTY_NOTICES.md` deterministically from the locked runtime dependency graph and `scripts/runtime-assets.json`. Commit that exact output before a release build. Normal development builds do not rewrite the tracked notice file.

## Stack

React 19 · Vite 7 · Vanilla CSS · PDFium WASM · pdf-lib · qr-code-styling · jsQR · qrcode · FFmpeg WASM · Pandoc WASM · parse5 · fflate

## Documentation

Full docs live in [`docs/`](docs/): [product overview](docs/01-product-overview.md), [architecture](docs/02-architecture.md), [converter catalog](docs/03-converter-catalog.md), [security & privacy](docs/06-security-and-privacy.md), [developer guide](docs/09-developer-guide.md), [contributing](docs/10-governance-and-contributing.md), [FAQ](docs/11-faq.md), and more.

## Upstream and attribution

The `upstream` remote is `MercuriusDream/convert-everything`. Preserve upstream copyright notices, modification history, the AGPL license, and all applicable third-party notices.

## Contributing

See [Contributing](docs/10-governance-and-contributing.md) and [Developer Guide](docs/09-developer-guide.md).

## License

[AGPL-3.0-only](LICENSE)
