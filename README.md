# Folkkit

Folkkit is a bilingual, local-first browser utility suite for everyday PDF, QR, and file conversion work. It is derived from [Convert Everything](https://github.com/MercuriusDream/convert-everything) and preserves its full Git history under AGPL-3.0-only.

## Current status

Das Repository ist öffentlich. Dateien werden im Browser verarbeitet; eine dauerhafte Inhaltschronik gibt es nur nach ausdrücklicher Aktivierung. Sprache und Design können lokal gespeichert werden. Öffentliche Builds benötigen weiterhin die freigegebenen Betreiberangaben und bestandene Releaseprüfungen. Der GitHub-Workflow aktualisiert den Hosting-Branch; ein manueller Live-Eingriff bleibt ein separater Schritt.

The canonical design is [docs/superpowers/specs/2026-08-31-folkkit-design.md](docs/superpowers/specs/2026-08-31-folkkit-design.md).

Die freigegebene [Studio-Erweiterung](docs/superpowers/plans/2026-09-05-folkkit-studio.md) ergänzt eigene Arbeitsbereiche und ersetzt die bisherige visuelle Richtung:

- `/qr`: QR-Designer für Text, Links, WLAN, Kontakte, E-Mail und SMS. Farben, Formen und Logo lassen sich anpassen. Ausgabe als PNG/SVG; QR-Codes aus lokalen PNG-, JPEG- und WebP-Bildern lesen.
- `/pdf`: native Textobjekt-Bearbeitung, direktes Verschieben/Skalieren, Ergänzungen und Seitenverwaltung mit Mehrfachauswahl. Unterstützte lateinische Textobjekte sind bearbeitbar; OCR, Absatzrekonstruktion und Formularerstellung sind ausgenommen. Unsichere Operationen an vorhandenen Formularstrukturen werden vorab verweigert.
- `/convert`: Dateiwarteschlange mit 33 Formatpaaren, Bildoptimierung, Vorher-/Nachher-Vorschau, Einstellungen, Abbruch, Einzel- und ZIP-Downloads.
- `/calculate`: Prozentfelder, Dreisatz, Pythagoras, Kreis, Flächen, Volumen, Einheiten, Seitenverhältnis, Kreditrate, BMI, Datum und Zeitspannen. Eigene Formulare, Beispiele und kopierbare Ergebnisse; alte Links bleiben erreichbar.

Der [freigegebene Bedienausbau](docs/superpowers/plans/2026-09-05-folkkit-usability.md) ergänzt ausserdem Katalogsuche, Kategorien und Werkzeugfavoriten. QR-, Rechner- und Konvertersitzungen bleiben beim internen Bereichswechsel im Arbeitsspeicher erhalten.

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

React 19 · Vite 7 · Vanilla CSS · PDFium WASM · pdf-lib · qr-code-styling · jsQR · qrcode · FFmpeg WASM · fflate

## Documentation

Full docs live in [`docs/`](docs/): [product overview](docs/01-product-overview.md), [architecture](docs/02-architecture.md), [converter catalog](docs/03-converter-catalog.md), [security & privacy](docs/06-security-and-privacy.md), [developer guide](docs/09-developer-guide.md), [contributing](docs/10-governance-and-contributing.md), [FAQ](docs/11-faq.md), and more.

## Upstream and attribution

The `upstream` remote is `MercuriusDream/convert-everything`. Preserve upstream copyright notices, modification history, the AGPL license, and all applicable third-party notices.

## Contributing

See [Contributing](docs/10-governance-and-contributing.md) and [Developer Guide](docs/09-developer-guide.md).

## License

[AGPL-3.0-only](LICENSE)
