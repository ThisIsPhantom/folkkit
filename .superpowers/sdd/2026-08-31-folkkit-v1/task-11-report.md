# Task 11 Report

## Ergebnis

Task 11 ist lokal umgesetzt und geprüft. Die 11 Befunde des historischen Scans wurden nicht erlassen. Die Originalartefakte des Scans blieben unverändert. Der öffentliche Release bleibt wegen fehlender freigegebener Betreiberwerte absichtlich gesperrt. Firefox blieb auf diesem Windows-Host wegen einer ungültigen Side-by-Side-Konfiguration ungeprüft.

## Lokale Commits

- `752c980` mit `fix: harden Folkkit release security contracts`
- `1a2207f` mit `fix: bound Folkkit browser workloads`
- `7694bd9` mit `fix: cache isolated PDF worker`
- `24b9e41` mit `fix: keep PDF worker statically auditable`
- `c462e10` mit `fix: address Task 11 security rereview`
- `65ba8ee` mit `chore: update audited Browserslist`
- `24cdede` mit `fix: close Task 11 P1 rereview gaps`
- `0bb64dc` mit `fix: close Task 11 residual security gaps`
- `50cf8fd` mit `test: verify Folkkit V1 release candidate`
- `a1f7399` mit `fix: close Task 11 round 4 residuals`
- `c62891c` mit `test: verify Folkkit V1 release candidate`
- `87a3eb3` mit `fix: close final Task 11 CSS escape gap`
- `e2368b8` mit `test: verify Folkkit V1 release candidate`

Der abschliessende Evidenzcommit `e2368b8ebbf08e4123cdfac2f2d9e2cbcc947e66` verwendet die verlangte Nachricht `test: verify Folkkit V1 release candidate`.

## Befunde

1. `ci.mutable-action-tags`: Addressed.
2. `ci.persisted-write-credential`: Addressed.
3. `privacy.stale-history-without-consent`: Addressed.
4. `transport.https-first-contact`: Addressed; Live-Readback bleibt extern.
5. `privacy.tool-share-includes-result`: Addressed.
6. `release.incomplete-same-origin-artifact-gate`: Addressed.
7. `resource.unbounded-text-amplification`: Addressed.
8. `resource.unbounded-decoded-image-dimensions`: Addressed.
9. `resource.unbounded-pdf-complexity`: Addressed; decodierte Streams bleiben innerhalb des terminierbaren Workers eine dokumentierte Bibliotheksgrenze.
10. `resource.unbounded-media-work`: Addressed.
11. `resource.unbounded-multifile-count`: Addressed.

Implementierungsstatus: 11 Addressed, 0 bewusst erlassen. Die unabhängige Re-Review der finalen Fixrunde 5 steht aus; deshalb wird noch kein endgültiger Fixed-Status behauptet. Externe Release- und Umgebungs-Gates stehen separat in `docs/release-checklist.md`.

## Fixrunde 1

1. Unabhängiger Prepared-Digest: Addressed in implementation, Re-Review pending.
2. Same-Origin-Datenfluss und Legal-Allowlist: Addressed in implementation, Re-Review pending.
3. CSV-Ausgabeschätzung und begrenzter Newline-Scan: Addressed in implementation, Re-Review pending.
4. Nicht-WAV-Metadaten, URL-Cleanup und FFmpeg-Backstops: Addressed in implementation, Re-Review pending.
5. Explizite Paarzustände und Rückkehr-Reset: Addressed in implementation, Re-Review pending.
6. Chromium-, Firefox- und WebKit-Installation in CI: Addressed in implementation, Re-Review pending.
7. Inhaltsfreier Clipboard-Fallback: Addressed in implementation, Re-Review pending.
8. Post-fix Evidenz in Checkliste und Projektmemory: Addressed in implementation, Re-Review pending.

## Fixrunde 2

1. Fail-closed Same-Origin-Literalpolicy und Browser-Pruning: Addressed in implementation, Re-Review pending.
2. Konservative CSV-JSON-Schätzung und begrenzter Zeilenscan: Addressed in implementation, Re-Review pending.
3. Fail-closed Audiodauer, FFmpeg-Rückgabecode und Trunkierungsgrenze: Addressed in implementation, Re-Review pending.

## Fixrunde 3

1. Späte Arraymutationen im Pruner und exakter 49-von-499-Artefaktvertrag: Addressed in implementation, Re-Review pending.
2. Exakte URL-Pfade, vollständige `new URL`-Auflösung, HTML-Attribute und Gate im normalen Build: Addressed in implementation, Re-Review pending.
3. Kein produktives `output.split('\n')` und begrenzte Anzeige `5000+`: Addressed in implementation, Re-Review pending.
4. WAV-Chunkgrenzen gegen höchstens 64 KiB Header und die echte Dateigrösse: Addressed in implementation, Re-Review pending.

## Fixrunde 4

1. Kanonisches 49er-Pruningmanifest in normalem, Hosting- und Release-Build vor Vite: Addressed in implementation, Re-Review pending.
2. Quote-aware HTML-Parserpolicy, Duplicate-Tokenizer und rohe CSS-Literalprüfung: Addressed in implementation, Re-Review pending.
3. Rohes CSV-Newlinebudget vor jeder Zeilenaufteilung: Addressed in implementation, Re-Review pending.
4. Konsistente WAV-`fmt `-Validierung für PCM und IEEE-Float: Addressed in implementation, Re-Review pending.

## Fixrunde 5

1. Standardsnahe CSS-Escape-Decodierung vor der globalen externen URL-Prüfung: Addressed in implementation, Re-Review pending.

## TDD-Evidenz

Die Remediation begann jeweils mit einem reproduzierten RED-Vertrag. Beispiele: sechs fehlgeschlagene Verlaufspurge-Tests, fehlende Workflow-Sicherheitsprüfung, fehlender SHA-256-Artefaktvertrag, fehlende HTTPS/HSTS-Felder, Ergebnistext in nativer Freigabe, externe Laufzeitsinks, fehlende Kompatibilitätsklassifikation, fehlende Ressourcenbudgets, fehlender PDF-Worker, fehlende Medien-Preflight- und Zeitgrenzen sowie drei reale PDF-Worker-E2E-Regressionen. In Fixrunde 5 waren acht CSS-Escape-/Malformed-Verträge RED. Drei Chromium-PoCs belegten dabei einen realen externen Requestversuch für `url()`, `image-set()` und `@import`, bevor das Gate anschliessend GREEN wurde.

## Vollständige Evidenz

- ESLint: bestanden.
- Vitest: 40 Dateien, 438 Tests bestanden.
- Chromium: 39 von 39 bestanden.
- WebKit: Kernmatrix bestanden.
- Chromium 390 x 844: Kernmatrix bestanden.
- Firefox: `spawn UNKNOWN`; direkter Start meldet ungültige Windows Side-by-Side-Konfiguration.
- Axe: alle vorgesehenen Routen und der Fehlerzustand ohne automatisierte Verletzung.
- Produktions-CSP: reale MP3-Konvertierung bestanden.
- Katalog: 49 von 499 Konvertern und 18 von 223 Formaten freigegeben.
- Formatpaare: 19 `compatible`, 0 `incompatible-but-implemented`.
- Bundle: 166.8 KiB initial; PDF-Worker 178.1 KiB gzip.
- Notice-SHA-256: `33aa224672d4e5101feac51cd085c19c2727547c0715bbd5cec74bb0cadecd1e`.
- High-Audit: ohne Befund.
- Secret-Scan: 213 getrackte Dateien, 0 Kandidaten.
- Plesk `ValidateOnly` für den finalen Evidenzcommit `e2368b8`: 30 Dateien, 0 verboten, Baumhash `fa278965f5ff3613d991b9d525d131be7a5055924b1e672c2e1def60725011a6`.
- Finaler Hosting-Smoke: exakte Quellrevision und Rechtstexte sowie reale MP3-Konvertierung unter Produktions-CSP, 6 von 6 bestanden.
- `build:release`: korrekter Abbruch wegen fehlendem Betreibername, Adresse und E-Mail.

## Grenzen

Es erfolgten kein Push, kein Merge, keine Veröffentlichung, kein Sichtbarkeitswechsel, kein Hosttech-Zugriff, kein DNS-Eingriff, kein Domainkauf und kein Deployment.

## Abschliessende ganze Branch-Fixwelle

### Evidenzmodell und geprüfter Stand

Der unveränderlich geprüfte Code-Kandidat ist `C = 09504747e6f548754587c893c3542eb93a3e3b4c` auf `feature/folkkit-v1`. Der frühere Zwischenkandidat `281fe1c5e5454701a49a2c9f8a100485707f7e92` bestand die erste vollständige Chromium-Runde nur mit 47 von 49 Tests. Er ist deshalb ausdrücklich kein validierter Kandidat. Die zwei reproduzierten Restpunkte wurden im nachfolgenden Codecommit `0950474` behoben; danach begann die vollständige Evidenz für `C` von null.

Der Commit, der diesen Abschnitt hinzufügt, ist der reine Dokumentationscommit `D`. Sein Hash kann nicht Bestandteil seiner eigenen Nutzlast sein. Sämtliche unten aufgeführten Nachweise wurden auf `C`, nicht auf `D` oder einem späteren `HEAD`, erzeugt. `D` muss vor einer Veröffentlichung erneut vollständig validiert werden.

### Lokale Fixcommits nach dem geprüften Ausgangsstand

- `bbe21ac94225204e53ded08f7da4db8e54825607` mit `fix: normalize CSS special-scheme URLs`
- `e0a392f6962e5fe709e24aa2221366e0469eb048` mit `fix: synchronize workspace URL and drop routes`
- `9e71aefde9109ac2c22b3346c343b1bdd60d62a1` mit `fix: complete localized accessible workspace controls`
- `281fe1c5e5454701a49a2c9f8a100485707f7e92` mit `fix: restore accessible file and navigation focus`
- `09504747e6f548754587c893c3542eb93a3e3b4c` mit `fix: stabilize picker contrast evidence`

### Status der elf Punkte des Final-Fix-Briefs

| Nr. | Punkt | Status auf `C` | Nachweis oder verbleibende Grenze |
|---:|---|---|---|
| 1 | CSS-Sonderschema-Normalisierung | Addressed | Escape-Decodierung, URL-Kontext-Tokenisierung und HTTP(S)-Normalisierung decken Backslashes sowie Schemata ohne `//` ab. Sechs reale Chromium-PoCs für `url()`, `image-set()` und `@import` bestanden. Die frühere falsche Abschlussaussage in `docs/release-checklist.md` ist korrigiert. |
| 2 | Inhaltsfreie URL-Synchronisierung | Addressed | Formatwahl und Verlaufwiederverwendung schreiben nur `{from,to}` beziehungsweise `{tool}`. Reload, Back und Forward bestanden im Browser. Eingabe und Ergebnis erscheinen nicht in der URL. |
| 3 | Vollständige DE/EN-Release-Lokalisierung | Addressed | Verlauf, ToolPicker, ConvertPanel, ErrorBoundary, Steuerelemente, Toasts, Parameter-Platzhalter, Formatnamen und Accessibility-Texte sind in beiden Sprachen geprüft. |
| 4 | Zugänglicher primärer Datei-Auslöser | Addressed | Der sichtbare native Auslöser ist ein echter Button, mindestens 44 px gross, tastaturbedienbar und mit Fokusring. Drag-and-drop bleibt erhalten. Axe und ein realer Keyboard-Filechooser-Test bestanden. |
| 5 | Zugänglicher ToolPicker | Addressed | Lokalisierter Combobox-/Listbox-Vertrag mit `aria-expanded`, `aria-controls`, `aria-activedescendant`, Optionsrollen, Auswahlzustand, Tastaturwahl, Escape und Fokuswiederherstellung. Die Eingangsanimation verändert keine Deckkraft mehr, damit der Kontrast in jeder Seitenposition stabil bleibt. |
| 6 | Storage-Normalisierung und Favoritenmigration | Addressed | Nicht kanonische Verlaufswerte werden einmal auf erlaubte Felder, 120 Zeichen und 30 Einträge begrenzt zurückgeschrieben. `convert-everything-fav-pairs` wird bereinigt nach `folkkit:favorites` migriert und entfernt. |
| 7 | Verlauf ohne verschachtelte Button-Rolle | Addressed | Liste, Listeneintrag und Artikel ersetzen die klickbare Zeile. Kopieren, Wiederverwenden und Entfernen sind getrennte echte Aktionen mit mindestens 44 px; Entfernen wird bei Fokus sichtbar. |
| 8 | Ehrliche globale Drop-Routen | Addressed | PNG und JPEG öffnen nur die jeweils freigegebene Gegenkonvertierung. SVG, andere Bilder und Video zeigen einen lokalisierten Unsupported-Zustand, statt verborgene IDs anzusteuern. |
| 9 | Hosttech-Protokollierung | Addressed | DE und EN erklären, dass Protokollierung und Felder von der aktiven Hosting-Konfiguration abhängen. Der Text behauptet keine spätere Prüfung als zeitliche Ursache. |
| 10 | SPA-Fokus und mobile Eingaben | Addressed | SPA-Navigation und Popstate fokussieren `#main-content`; der initiale Seitenaufruf übernimmt keinen Fokus. Sichtbare mobile Eingaben bleiben bei mindestens `1rem`. |
| 11 | Selbstkonsistente Release-Evidenz | Addressed | Alle Erfolgsnachweise beziehen sich ausdrücklich auf `C`. Dieser Abschnitt definiert den hinzufügenden Dokumentationscommit als `D` und verlangt dessen Revalidierung vor jeder Veröffentlichung. |

Ergebnis innerhalb des Briefs: 11 Addressed, 0 Open. Die unten genannten externen Gates sind keine erlassenen Briefpunkte.

### TDD- und Restpunkt-Evidenz

- CSS: sechs neue Unit-Verträge und sechs echte Chromium-PoCs waren auf dem Ausgangsstand RED. Danach bestanden 67 fokussierte Runtime-Artefakttests und alle sechs Browser-PoCs.
- URL und Drops: sieben fokussierte Workspace-Tests waren RED und danach 7 von 7 GREEN. Die fokussierte Regression bestand 42 von 42 Tests; Navigation, Reload, Back, Forward, Verlauf und Drops bestanden im Browser.
- Lokalisierung, ToolPicker, Verlauf und Storage: 21 fokussierte Tests waren RED und danach 57 von 57 GREEN. Die anschliessende vollständige Suite bestand 466 Tests.
- Datei-Auslöser, SPA-Fokus und mobile Schriftgrösse: zwei fokussierte Unit-Tests und drei Chromium-Verträge waren RED. Danach bestanden 16 von 16 fokussierte Unit-Tests sowie alle drei Browser-Verträge.
- Die erste vollständige Chromium-Abnahme des Zwischenkandidaten meldete zwei Restpunkte: einen transienten Axe-Kontrastfehler durch die Deckkraftanimation des ToolPickers und einen veralteten Legal-Testmatcher. Beide waren reproduzierbar und bestanden nach der Korrektur 2 von 2 fokussierte Chromium-Tests.

### Vollständige Evidenz auf `C`

- `bun run verify`: ESLint ohne Befund; Vitest 44 Dateien und 468 von 468 Tests; Produktionsbuild, Katalogaudit, Bundle-Budget und beide Runtime-Artefaktprüfungen bestanden.
- Katalog: 499 Konverter, davon 49 freigegeben und 450 verborgen; 223 Formate, davon 18 freigegeben und 205 verborgen. Der Paargraph bleibt bei 19 `compatible` und 0 `incompatible-but-implemented`.
- Bundle: initiales JavaScript 169.3 KiB gzip bei einem Budget von 200.0 KiB; PDF-Worker 178.1 KiB gzip.
- Chromium Desktop: 49 von 49 Tests bestanden. Enthalten sind sechs reale CSS-PoCs, Axe, URL-Navigation, Privacy-Taint, fehlerhafte Eingaben, PDF, QR, Medien, Offline und PWA.
- WebKit Desktop: Kernmatrix 1 von 1 bestanden.
- Chromium Mobile 390 x 844: Kernmatrix 1 von 1 bestanden.
- Produktions-CSP: Nach `bun run build:site` bestand die reale MP3-Konvertierung unter den exakten Hosting-Headern 1 von 1. Die sechs abschliessenden Hosting-/Legal-Smokes ergeben zusammen 6 von 6.
- Notice-Prüfung: `THIRD_PARTY_NOTICES.md` ist aktuell; SHA-256 `33aa224672d4e5101feac51cd085c19c2727547c0715bbd5cec74bb0cadecd1e`.
- Dependency-Audit: `bun audit --audit-level=high` beendete sich mit Exitcode 0 und ohne High-Befund.
- Secret-Scan: 217 getrackte Dateien, 0 Kandidaten.
- `build:release`: erwarteter Abbruch, weil `VITE_PUBLIC_OPERATOR_NAME`, `VITE_PUBLIC_OPERATOR_ADDRESS` und `VITE_PUBLIC_CONTACT_EMAIL` fehlen. Es wurde kein öffentlicher Release gebaut.
- Plesk `ValidateOnly` für `C`: 30 Dateien, 0 verbotene Dateien, Baumhash `4c68c0bb309bd50a4b14c66e457bc7b6a9e9b60bed87532fe3278d3ef1f0dc76`. Der isoliert erzeugte, nicht referenzierte Hostingcommit ist `549c21c66b7aa10aaf07ece95693a8b13f2b5c0a`. Branch, Refs und Worktree blieben unverändert.
- Abschlusszustand auf `C`: `HEAD` blieb `09504747e6f548754587c893c3542eb93a3e3b4c`; `git status --short`, `git diff --exit-code` und `git diff --cached --exit-code` waren leer beziehungsweise erfolgreich.

### Externe und absichtliche Gates

- Firefox Desktop bleibt lokal ungeprüft. Playwright meldete erneut `spawn UNKNOWN`; der direkte Start von `firefox.exe` bestätigte eine ungültige Windows-Side-by-Side-Konfiguration.
- Ein manueller Screenreader-Smoke steht aus.
- Ein Live-Readback der tatsächlichen Hosttech-Header steht aus und war nicht autorisiert.
- Der reale öffentliche Release bleibt bis zur Freigabe von Betreibername, Postadresse und Kontakt-E-Mail gesperrt.

Es erfolgten weiterhin kein Push, kein Merge, keine Veröffentlichung, kein Sichtbarkeitswechsel, kein Hosttech-Zugriff, kein DNS-Eingriff, kein Domainkauf und kein Deployment.

## Autorisierte Abschlussfortsetzung vom 2. September 2026

### Anlass und Ergebnis

Die finale Gesamtprüfung nach dem ersten Dokumentationscommit fand zwei tragende Restpunkte: verschachtelte CSS-Bildfunktionen wurden nicht rekursiv auf externe URLs geprüft, und Tastaturhilfe sowie Formatpaar-Metadaten blieben im deutschen Modus teilweise englisch. Der Benutzer autorisierte die Fortsetzung ausdrücklich mit `Gut, weiter`.

Der unveränderlich geprüfte neue Codekandidat ist `C = 5812da09f06790cfe5fbd8773789ffef421641d4`. Er schliesst beide Restpunkte. Die einmalige unabhängige Patch-Review fand drei äquivalente Fälle: ein per CSS-Escape eingeschobenes Tabulatorzeichen im HTTPS-Schema, ein dynamischer Bildwert über eine CSS Custom Property und das wirkungslose Grossbuchstaben-Kopierkürzel. Alle drei wurden gegen vorher rote Tests geschlossen.

### Sicherheitsgrenze

- Jede CSS-Funktion ausser dem terminalen `url()` wird rekursiv nach verschachtelten URL-Sinks untersucht.
- Direkte URL-Strings werden nur in `image()`, `image-set()` und `-webkit-image-set()` als Bildquellen behandelt. Strings in Funktionen wie `type()` bleiben normale Werte.
- URL-tragende CSS Custom Properties in Bildfunktionen stoppen fail-closed. ASCII-URL-Steuerzeichen werden vor der HTTP(S)-Prüfung entfernt.
- Eingebettete `<style>`-Blöcke, `style`-Attribute und URL-tragende SVG-Darstellungsattribute verwenden dieselbe CSS-Prüfung.
- Tiefe lokale `calc()`-Ausdrücke ohne URL-Sink, relative Pfade und externer Text ausserhalb eines URL-Kontexts bleiben zulässig.

### Lokalisierung und Interaktion

- Die Tastaturhilfe bezieht sämtliche sichtbaren Texte aus den DE/EN-Wörterbüchern.
- Sie besitzt Dialogsemantik, fokussiert eine sichtbare Schliessen-Aktion und stellt den vorherigen Fokus beim Schliessen wieder her.
- Ctrl und Command werden gemeinsam angezeigt. Das Kürzel Ctrl/Command + Shift + C verarbeitet Gross- und Kleinbuchstaben und kopiert das aktuelle Ergebnis.
- Escape schliesst die Hilfe, ohne einen aktiven Werkzeugpfad zu verlassen.
- Formatpaar-Titel, Beschreibung und Open-Graph-Metadaten verwenden sprachabhängige Vorlagen. Deutsch zeigt beispielsweise `Text in Base64 · Folkkit`, Englisch `Text to Base64 · Folkkit`.

### RED und GREEN

- Erste RED-Suite: 13 von 88 fokussierten Tests scheiterten genau an den verschachtelten CSS-Sinks, Inline-CSS, fehlender Hilfe-Lokalisierung, Dialogsemantik und englischen Formatmetadaten.
- Zweite RED-Suite nach unabhängiger Patch-Review: vier Tests scheiterten an URL-Steuerzeichen, Custom-Property-Indirektion, tiefer lokaler Verschachtelung und Grossbuchstaben-Shortcut.
- Fokussiertes GREEN: vier Testdateien, 100 von 100 Tests bestanden.
- Reale Browsergrenze: 9 von 9 Chromium-PoCs erzeugten den externen Requestversuch und wurden anschliessend vom Release-Gate abgewiesen.

### Vollständige Evidenz auf neuem `C`

- `bun run verify`: ESLint ohne Befund; Vitest 45 Dateien und 488 von 488 Tests; Produktionsbuild, Katalogaudit, Bundle-Budget und Runtime-Artefaktprüfung bestanden.
- Katalog: 499 Konverter, davon 49 freigegeben und 450 verborgen; 223 Formate, davon 18 freigegeben und 205 verborgen.
- Bundle: initiales JavaScript 169.7 KiB gzip bei einem Budget von 200.0 KiB; PDF-Worker 178.1 KiB gzip.
- Chromium Desktop: 52 von 52 Tests bestanden.
- WebKit Desktop und Chromium Mobile 390 x 844: Kernmatrix je 1 von 1 bestanden.
- Produktions-CSP: reale MP3-Konvertierung 1 von 1 bestanden.
- Dependency-Audit: Exitcode 0 ohne High-Befund.
- Drittanbieterhinweise: aktuell; SHA-256 `33aa224672d4e5101feac51cd085c19c2727547c0715bbd5cec74bb0cadecd1e`.
- Secret-Scan: 219 getrackte Dateien, 0 Kandidaten.
- `build:release`: erwarteter Abbruch vor dem Build wegen fehlendem Betreibername, fehlender Postadresse und fehlender Kontakt-E-Mail.
- Plesk `ValidateOnly`: 30 Dateien, 0 verbotene Dateien, Baumhash `71bc4be9bc49e53dfdf9c7ad6ced03dae18fccbea093c32a2b9a603f9d79ef8f`. Der isolierte, nicht referenzierte Hostingcommit war `2d1d472f37eca0c5aa6af6fcf5ff5b5228879a2c`.

Der nachfolgende reine Dokumentationscommit `D` zeichnet diese Evidenz auf. `D` ist selbst kein validierter Releasequellstand und muss vor einer Veröffentlichung erneut vollständig geprüft werden. Die externen Gates für Firefox, manuellen Screenreader-Smoke und Live-Hosttech-Header bleiben unverändert bestehen.
