# Folkkit V1 Release-Checkliste

## Status

Der lokale V1-Kandidat ist technisch geprüft, aber nicht öffentlich freigegeben. Geprüfter Codekandidat nach Fixrunde 1: `65ba8ee0a80102c39f1c3902474b026021959377`. Die unabhängige Re-Review dieser Fixrunde steht aus.

Es erfolgten kein Push, kein Merge, keine Änderung der Repository-Sichtbarkeit, kein Hosttech-Zugriff, kein DNS-Eingriff, kein Domainkauf und kein Deployment.

## Automatisierte Evidenz

| Gate | Ergebnis |
| --- | --- |
| ESLint | bestanden |
| Unit- und Vertragstests | 38 Testdateien, 388 Tests bestanden |
| Chromium Desktop | 36 von 36 E2E-Tests bestanden |
| WebKit Desktop | Kernmatrix 1 von 1 bestanden |
| Chromium Mobile 390 x 844 | Kernmatrix 1 von 1 bestanden |
| Firefox Desktop | lokal blockiert, siehe Browsermatrix |
| Axe | Home, Katalog, PDF, QR, Konvertierung, Verlaufseinwilligung, Datenschutz, Lizenzen und Fehlerzustand ohne automatisierte Verletzung |
| Privacy-Taint | Marker in Dateiname und Inhalt blieb aus Requests, Headern, Bodies, Konsole, Fehlern, Cache Storage, URL, Local Storage und Session Storage entfernt |
| Malformed Inputs | Beschädigte, doppelt endende, zu grosse, zu zahlreiche und zu komplexe Eingaben wurden mit inhaltsfreien Fehlern abgewiesen |
| Produktions-CSP | reale MP3-Konvertierung 1 von 1 bestanden |
| Offline | Shell, Text, QR und PDF bestanden; fehlendes FFmpeg-Modul wurde nach Wiederverbindung erfolgreich nachgeladen |
| Katalogaudit | 499 Konverter, 49 freigegeben und 450 verborgen; 223 Formate, 18 freigegeben und 205 verborgen |
| Formatpaare | 19 freigegebene Paare, 19 `compatible`, 0 `incompatible-but-implemented` |
| Bundle | initial 160.6 KiB gzip von 200 KiB; PDF-Worker 174.6 KiB gzip von 220 KiB |
| Drittanbieterhinweise | aktuell; SHA-256 `33aa224672d4e5101feac51cd085c19c2727547c0715bbd5cec74bb0cadecd1e` |
| Supply Chain | `bun audit --audit-level=high` ohne Befund |
| Secret-Scan | 204 getrackte Dateien, 0 Kandidaten beim letzten Kandidatenlauf |
| Plesk-Vertrag | Bare-Remote-Verträge bestanden |
| Plesk `ValidateOnly` | 30 Dateien, 0 verboten, Baumhash `90a34a15df128a914c07dd5a0124d3103670c8cfd9fcb2133ff3b5e5d40c4847` |

## Browsermatrix

- Chromium Desktop: vollständig bestanden.
- WebKit Desktop: DE- und EN-Kernjourneys für Text, QR und PDF bestanden.
- Chromium Mobile 390 x 844: DE- und EN-Kernjourneys bestanden.
- Firefox 1538 wurde mit Playwright installiert. Der Start scheitert auf diesem Windows-Host mit `browserType.launch: spawn UNKNOWN`. Der direkte versteckte Start bestätigt: `Diese Anwendung konnte nicht gestartet werden, da die Side-by-Side-Konfiguration ungültig ist.` Dieser lokale Umgebungsfall ist offen und wurde nicht als bestandener Browserlauf gewertet.

## Security-Scan und Remediation

Der historische Standardscan `d182b66a-b0a8-45f4-93b5-3784092bde95` gilt ausschliesslich für `98d58ed1cd9926a33ec1ee6f94d2fb28b4705f4e`. Seine Artefakte wurden nicht verändert oder als Nachscan bezeichnet. Er deckte 185 von 185 getrackten Dateien ab und meldete 11 validierte Befunde, 4 mittel und 7 niedrig, ohne hohe oder kritische Befunde.

Der aktuelle Kandidat enthält Korrekturen und gezielte Nachweise für alle 11 Befunde. Die neue unabhängige Re-Review steht noch aus:

1. Actions sind an vollständige SHAs gebunden.
2. Artefaktaufbau und schreibberechtigter Push sind getrennt; Archiv, Baum und Quellcommit sind mit SHA-256 gebunden.
3. Verlauf ohne gültige Einwilligung wird beim Start und vor erneuter Aktivierung gelöscht.
4. HTTP wird vor dem SPA-Fallback permanent auf HTTPS umgeleitet; HTTPS erhält konservatives HSTS ohne Subdomain- oder Preload-Behauptung.
5. Werkzeugfreigaben enthalten nur Beschreibung und inhaltsfreie URL.
6. Der finale Build prüft JavaScript-Sinks per AST sowie HTML, CSS, SVG und Manifest auf externe Laufzeitursprünge.
7. CSV, Batch, QR, Text-PDF, Ausgabegrösse, Zeilennummern und Base58 haben feste Budgets.
8. PNG- und JPEG-Dimensionen werden vor dem Decoder geprüft und nach dem Decodieren erneut begrenzt.
9. Freigegebene PDF-Dateioperationen laufen in einem hart terminierbaren Worker mit Datei-, Seiten-, Gesamtseiten- und Zeitbudget.
10. Audio zu MP3 prüft zuverlässige WAV-Dauer, FFmpeg-Zeitbudget, CPU-Backstop, Ausgabegrösse und echte Terminierung.
11. Dateianzahl wird vor React-Zustand und erneut im Runtime-Vertrag begrenzt; die Dateinamenvorschau ist beschränkt.

Fixrunde 1 ergänzt folgende Nachweise, jeweils mit ausstehender Re-Review:

1. Der vorbereitete Hostingstand ist zusätzlich an einen unabhängigen Workflow-Output-Digest über kanonische Manifestbytes und Archivbytes gebunden.
2. Der Same-Origin-Gate verfolgt Konstanten, Verkettungen, Templates, `new URL`, Worker und `setAttribute`; externe Navigation ist nur für exakt geprüfte Rechts- und Quellziele erlaubt.
3. CSV-Ausgabeverstärkung wird vor Zeilenarrays und Objektgraphen geschätzt. Zeilen werden für die UI mit einem begrenzten Scanner gezählt.
4. Alle akzeptierten Audioformate benötigen zuverlässige Dauermetadaten; Objekt-URLs werden bei Erfolg, Fehler und Timeout entfernt. FFmpeg erhält `-t` und `-fs` als zusätzliche Backstops.
5. Jedes der 19 freigegebenen Formatpaare deklariert seinen Zustand einzeln. Eine Rückkehr zu einem früher bestätigten Paar beginnt wieder unbestätigt.
6. Der offizielle Playwright-Installationsvertrag umfasst Chromium, Firefox und WebKit.
7. Der Clipboard-Fallback kopiert ausschliesslich die inhaltsfreie Werkzeug-URL.
8. Checkliste und Projektmemory verwenden ausschliesslich post-fix Evidenz und bezeichnen die Re-Review als ausstehend.

## Formatkompatibilität

Der aktuelle Audit fand kein evidenzgeprüftes Paar für `incompatible-but-implemented`. Deshalb wurde keine solche Konvertierung veröffentlicht. Der datengetriebene Zukunftsvertrag ist dennoch getestet:

- `compatible` läuft normal.
- `incompatible-but-implemented` setzt eine echte Evidenz und Implementierung voraus. Die Ausführung bleibt bis zur unmarkierten, paarbezogenen Bestätigung gesperrt.
- Die Bestätigung bleibt nur im React-Sitzungszustand, wird bei Paarwechsel unwirksam und erscheint weder in URL noch Verlauf oder Local Storage.
- `unsupported` bleibt gesperrt und kann durch keine Bestätigung einen Erfolg vortäuschen.

## Absichtliche und externe Gates

- `build:release` stoppt ohne erfundene Werte mit den drei fehlenden Variablen `VITE_PUBLIC_OPERATOR_NAME`, `VITE_PUBLIC_OPERATOR_ADDRESS` und `VITE_PUBLIC_CONTACT_EMAIL`.
- Der komplette Befehl `bun run verify:release` kann auf diesem Host wegen Firefox Side-by-Side und danach wegen des Betreiber-Gates nicht vollständig grün enden. Die einzelnen unterstützten Gates wurden separat ausgeführt und oben ausgewiesen.
- Der bekannte `pdf-lib`-Rest bleibt: Ein PDF-Worker kann bei Zeitüberschreitung hart beendet werden, aber `pdf-lib` bietet keine separate Obergrenze für bereits decodierte Streams innerhalb des Workers.
- Ein manueller Screenreader-Smoke-Test ist nicht automatisiert erfolgt.
- Die Live-Abnahme von HTTPS-Redirect und HSTS auf Hosttech bleibt bis zu einem ausdrücklich freigegebenen Deployment offen.
- Repository-Veröffentlichung, `plesk`-Push, Hosttech-Deployment, DNS und Domainkauf benötigen weiterhin eine ausdrückliche Freigabe.
