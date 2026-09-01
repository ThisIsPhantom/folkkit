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

## Review-Fixrunde 1 von 5

### Status der sieben Important Findings

1. Der reale Medien-Test lädt den Medien- und die FFmpeg-Wrapper vor, trennt danach das Netz und lässt Vendor-Core sowie WASM bewusst fehlen. Eine echte WAV-Datei löst den lokalisierten Fehler `FFmpeg-Core und WASM sind offline nicht verfügbar.` aus. Nach der Wiederverbindung startet `Erneut versuchen` dieselbe Auswahl erneut. Der Test lädt eine echte MP3-Datei herunter und prüft Dateiname, Mindestgrösse sowie ID3- oder MPEG-Frame-Signatur.
2. Der Budgetprüfer akzeptiert nur noch `distDir`. `allowlist`, `initialLimit`, `lazyLimit` und andere Zusatzoptionen werden als nicht unterstützte Budgetoptionen abgelehnt. Die Grenzen sind unveränderlich 200 KiB gzip initial und 220 KiB gzip für jeden nicht zu FFmpeg gehörenden übrigen JavaScript-Chunk.
3. Die Budgetprüfung läuft rekursiv über jede emittierte `.js`-Datei unter `dist`. `theme-init.js` zählt zur initialen Summe. Root-, Nested-, Worker-, Service-Worker-, Template- und Vendor-JavaScript werden erfasst. Gehashte FFmpeg-Wrapper werden über ihre Manifest-Quellschlüssel erkannt.
4. Navigation und Runtime-Assets lesen ausschliesslich aus dem geöffneten aktuellen `CACHE_NAME`. Es gibt kein globales `caches.match` mehr. Ein fremder Cache mit denselben Root- und Entry-Schlüsseln bleibt erhalten, kann Folkkit offline aber nicht beantworten.
5. Die Cacheversion hasht für jede sortierte Precache-URL sowohl den Pfad als auch die tatsächlichen Datei-Bytes. Identischer Inhalt erzeugt byteidentisches `sw.js`; eine Änderung am Favicon bei unverändertem Pfad ändert Cache-ID und Service-Worker-Ausgabe.
6. Der Browser-Datenschutztest prüft unbekannten Pfad, Query-Variante mit privatem Marker, POST-Body, Blob-URL und einen echten zweiten lokalen HTTP-Origin. Keine dieser Anfragen erscheint im aktuellen Folkkit-Cache. Fremde Cache-Schlüssel werden getrennt gelesen und zählen nicht als Folkkit-Inhalt.
7. `skipWaiting()` und `clients.claim()` liegen innerhalb der jeweiligen `waitUntil`-Promise. Ein testexklusiver alter Service Worker wird per Preview-Middleware installiert, aktiviert und danach auf den generierten Folkkit-Worker aktualisiert. Alte eigene und Legacy-Caches verschwinden, der aktuelle Cache bleibt, ein fremder Cache bleibt unangetastet und der Client wird vom neuen Worker kontrolliert. Ein Artifact-Gate verbietet den Test-Worker im gebauten `dist`.

### Review RED

- `bun run test:run tests/build/pwa-build.test.js src/converters/media.test.js src/components/workspace/workspace.test.jsx`: 5 erwartete Fehler für Path-only-Versionierung, Budget-Overrides, ungezählte JavaScript-Dateien, generische FFmpeg-Fehler und fehlende Retry-Oberfläche.
- Direkter Node-Lauf `playwright test tests/e2e/pwa.spec.js`: Der alte Worker wurde zunächst als HTML statt JavaScript beantwortet; der fremde Cache übernahm offline Root und Entry.
- Direkter Node-Lauf `playwright test tests/e2e/offline.spec.js --grep 'missing FFmpeg core'`: Der reale Core-Ausfall erschien zunächst als generischer Verarbeitungsfehler.
- Der präzisierte Lifecycle-Test zeigte, dass das Install-Promise vor dem noch offenen `skipWaiting()` aufgelöst wurde.
- Der Artifact-Test zeigte, dass ein testexklusiver alter Worker vor der neuen Sperre nicht abgelehnt wurde.

### Review GREEN und exakte Abschlussbefehle

```text
& 'C:\Codex-Workspaces\folkkit\.worktrees\folkkit-v1\.superpowers\tools\bun-v1.3.3\bun-windows-x64\bun.exe' run test:run tests/build/pwa-build.test.js src/converters/media.test.js src/components/workspace/workspace.test.jsx
Ergebnis: 3 Testdateien, 23/23 Tests bestanden.

& 'C:\Codex-Workspaces\folkkit\.worktrees\folkkit-v1\.superpowers\tools\bun-v1.3.3\bun-windows-x64\bun.exe' run verify
Ergebnis: ESLint bestanden; 27 Testdateien, 255/255 Tests bestanden; Build bestanden; Runtime-Artefakte ausschliesslich Same-Origin und ohne testexklusiven alten Worker.

$env:FOLKKIT_E2E_PORT='4178'
& 'C:\Users\igorr\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\node_modules\playwright\cli.js' test tests/e2e/pwa.spec.js tests/e2e/offline.spec.js
Ergebnis Lauf 1: 6/6 bestanden in 4.5 s.
Ergebnis Lauf 2: 6/6 bestanden in 4.3 s.
```

Der finale Build erzeugte `folkkit-app-a912dbc94ef5` mit 12 Precache-URLs. Die initiale JavaScript-Summe beträgt 121.4 KiB gzip. Der grösste nicht zu FFmpeg gehörende übrige Chunk ist `pdf-lib` mit 179.5 KiB gzip. Es gibt keine Budget-Allowlist und keinen Limit-Override.

### Listener- und Scope-Cleanup

Die zweite lokale HTTP-Origin-Instanz wird in `test.afterAll` geschlossen. Playwright stoppt den Previewserver nach jedem Lauf. Nach den Browserläufen lauschte kein Prozess mehr auf Port 4178. Port 4173 blieb unangetastet.
