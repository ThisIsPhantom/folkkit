# Task 8 Report: Generated privacy-safe offline PWA and bundle budgets

## Status

Task 8 ist lokal umgesetzt und verifiziert. Es erfolgten kein Push, kein Merge, keine Veröffentlichung und kein Deployment.

## Scope und erhaltene Verträge

- Die 49 freigegebenen Werkzeuge, 18 freigegebenen Formatpaare und die Lazy-Loader-Struktur aus Task 7 bleiben erhalten.
- Die passive AdSense-Metadatei, die Same-Origin-FFmpeg-Laufzeit, die Inhaltsfreiheit der Präferenzen, die Opt-in-Historie sowie die Abort- und Object-URL-Lebenszyklen wurden nicht erweitert.
- Die deutsche und englische Oberfläche bleibt aktiv. Neue Recovery-Texte sind über das gemeinsame Lokalisierungssystem in beiden Sprachen vorhanden.
- Der frühere Cache `convert-everything-v2` wird beim Upgrade gezielt entfernt. Die aktuelle Identität lautet `folkkit-app-<12-stelliger Build-Hash>`.

## RED und GREEN

### RED

1. Die ersten fünf Build-Vertragstests scheiterten an den fehlenden Generator- und Budgetfunktionen, an dynamisch importierten QR/PDF-Abhängigkeiten, an Shared-Lazy-Chunks ohne `isDynamicEntry` und an einem nicht im Manifest aufgeführten Worker.
2. Der Workspace-Test scheiterte, weil ein fehlender Medienchunk nur im Ladezustand blieb und weder Modul noch Recovery benannte.
3. Die ersten PWA-/Offline-Tests scheiterten am statischen geerbten Service Worker und an fehlenden Offline-Kernabhängigkeiten.
4. Ein späterer Regressionstest zeigte, dass ein ESLint-Kommentar die Generator-Platzhalter vor den eigentlichen Konstanten verbrauchte. Der Generator ersetzt deshalb jetzt jede Platzhalter-Fundstelle und der Test lehnt verbleibende Platzhalter ab.

### GREEN

- `tests/build/pwa-build.test.js`: 5/5 bestanden.
- `src/pages/WorkspacePage.offline.test.jsx`: 1/1 bestanden.
- Zwei vollständige direkte Node-Läufe von `pwa.spec.js` und `offline.spec.js` auf `FOLKKIT_E2E_PORT=4178`: je 6/6 bestanden.
- `bun run verify`: ESLint bestanden, 27 Testdateien mit 246/246 Tests bestanden, Produktionsbuild bestanden, Runtime-Artefakte ausschliesslich Same-Origin.

## Generierter Precache

`scripts/generate-service-worker.mjs` liest `dist/.vite/manifest.json`, erzeugt `dist/sw.js` und leitet die Cacheversion aus der sortierten Precache-Liste ab. Der letzte Build erzeugte `folkkit-app-141039324550` mit 12 URLs:

- App-Shell: `/`, `/index.html`, `/manifest.json`, `/favicon.svg`, `/theme-init.js`
- Entry und CSS: `index-tlhuVpx4.js`, `index-BurNAho4.css`
- QR-Kern: `qr-Difu5cYx.js`, `browser-CWKGGv8Z.js`, `qrcode-DgLtAz-0.js`
- PDF-Kern: `pdf-7vsEB97M.js`, `pdf-lib-BYCLJ2U_.js`

Der Generator lehnt absolute und protokollrelative URLs ab. Source Maps, Tests, experimentelle Chunks, Medienmodule und FFmpeg-Artefakte werden ausgeschlossen. Dynamische Abhängigkeiten werden nur für die QR- und PDF-Kernwurzeln verfolgt. Ein Rückweg über den App-Entry zieht deshalb keine übrigen Werkzeugchunks in den Precache.

## Runtime-Cache und Upgrade

- Navigation verwendet Network-first und fällt offline auf den gecachten Root-Shell zurück.
- Bereits precachte Shell- und Kernassets werden direkt aus dem versionierten Cache gelesen.
- Neu geladene Runtime-Antworten dürfen nur Same-Origin-GET-Anfragen auf gehashte `/assets/`-Pfade cachen.
- Cross-Origin-Anfragen, Blob-URLs, POST-Anfragen, Query-Varianten und unbekannte Pfade werden nicht gecacht.
- Die Aktivierung entfernt alte `folkkit-app-*`-Versionen und `convert-everything-v2`, lässt fremde Cache-Namensräume aber unangetastet.

Die Browsertests prüfen Cache Storage nach unbekanntem GET, POST mit privater Testeingabe und Blob-Fetch. Im Cache verbleiben ausschliesslich Same-Origin-Anwendungsassets. Weder Medien- noch FFmpeg-Artefakte sind enthalten.

## Offline- und Recovery-Verhalten

- Startseite: nach dem ersten Laden offline verfügbar.
- Text: `text` nach `base64` läuft offline.
- QR: ein lokaler SVG-Download wird offline erzeugt.
- PDF: zwei lokale PDF-Fiksturen werden offline zusammengeführt.
- Medien: das nicht precachte Medienmodul meldet ehrlich, dass es offline noch nicht verfügbar ist. Nach wiederhergestellter Verbindung lädt `Erneut versuchen` die Seite neu, damit der Browser einen zuvor fehlgeschlagenen ES-Modulimport erneut abrufen kann.
- Es gibt keine universelle Offline-Zusage und keinen CDN-Fallback.

## Gemessene Bundlegrössen

Die Grenzen bleiben unverändert: initial höchstens 200 KiB gzip, jeder nicht zu FFmpeg gehörende Lazy- oder Worker-Chunk höchstens 220 KiB gzip. Es gibt keine Allowlist-Ausnahme.

| Bereich | Gzip |
| --- | ---: |
| Initial JavaScript | 121.1 KiB |
| pdf-lib | 179.5 KiB |
| web | 51.7 KiB |
| utility | 43.7 KiB |
| text | 17.3 KiB |
| number | 15.6 KiB |
| qrcode | 10.1 KiB |
| data | 10.1 KiB |
| color | 10.0 KiB |
| crypto | 3.1 KiB |
| imageFormat | 3.0 KiB |
| media wrapper | 2.3 KiB |
| PDF wrapper | 2.3 KiB |
| Worker | 1.1 KiB |
| FFmpeg wrapper | 1.2 KiB, ausdrücklich ausgenommen |
| FFmpeg util wrapper | 0.9 KiB, ausdrücklich ausgenommen |
| QR wrapper | 0.9 KiB |
| hash | 0.7 KiB |
| image | 0.5 KiB |
| browser helper | 0.4 KiB |

Der Budgetprüfer misst die vollständige initiale Importkette, alle übrigen JavaScript-Dateien aus dem Manifest sowie emittierte JavaScript-Dateien wie Worker, die Vite nicht im Manifest aufführt.

## Dateien

- Geändert: `package.json`, `playwright.config.js`, `vite.config.js`, `public/manifest.json`, `src/main.jsx`, `src/pages/WorkspacePage.jsx`, `src/i18n/messages.de.js`, `src/i18n/messages.en.js`
- Ersetzt: `public/sw.js` durch `public/sw.template.js`
- Erstellt: `scripts/generate-service-worker.mjs`, `scripts/check-bundle-budget.mjs`, `tests/build/pwa-build.test.js`, `tests/e2e/pwa.spec.js`, `tests/e2e/offline.spec.js`, `src/pages/WorkspacePage.offline.test.jsx`

## Writing-Check

Vor den neuen UI- und Berichtstexten wurden `writing-natural-de-ch` und das Registerprofil Technik geladen. Deutsche Texte verwenden Schweizer Standarddeutsch; die explizit erforderlichen englischen UI-Texte sind separat lokalisiert. Der deterministische Schreibcheck wird vor dem Commit ausgeführt.

## Bedenken und Grenzen

- Port 4173 blieb unangetastet. Alle Browserläufe verwendeten Port 4178 mit `strictPort` und `reuseExistingServer: false`.
- Playwright wurde für die Beweisläufe direkt mit dem bereitgestellten Node.js-Binary gestartet. `bun run` ersetzt in dieser Umgebung einen `node`-Aufruf teilweise durch Bun und führte beim Chromium-Start zu Timeouts; dies betrifft die getestete Anwendung nicht.
- Medien- und FFmpeg-Assets sind absichtlich nicht offline verfügbar. Die Oberfläche benennt diesen Zustand und bietet eine Recovery nach Wiederherstellung der Verbindung.
