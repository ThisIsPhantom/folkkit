# Folkkit Studio: lokale Umsetzung und Verifikation

Stand: 5. September 2026. Entwicklung und lokale Abnahme im Worktree `codex/folkkit-studio`, ausgehend von `fa309fb06475bdb7cf79d66ee029b2b2e005fec4`. Der Benutzer hat anschliessend die Veröffentlichung auf `main` und des daraus erzeugten Hosting-Stands auf `plesk` freigegeben. Ein separater Live-Eingriff auf dem Hosting-Server ist nicht Teil dieses Auftrags.

## Arbeitsbereiche

Die Startseite führt direkt zu `/qr`, `/pdf` und `/convert`. Die bisherigen Werkzeuglinks unter `/workspace` bleiben erreichbar. Deutsch und Englisch sowie Hell- und Dunkelmodus sind eingebunden. Die drei Einstiege passen bei 390 × 844 Pixeln auf den ersten Bildschirm. Der grüne Hinweis «Lokal verarbeitet» wurde auf Wunsch aus Startseite und Navigation entfernt.

Der zusätzlich beauftragte Bereich `/calculate` bündelt Prozentrechnung, Dreisatz, Pythagoras, Kreis, Flächen, Volumen, Einheitenumrechnung, Seitenverhältnis, Kreditrate und BMI mit passenden Eingabefeldern. Der zusätzliche Block «Weitere Rechner» entfällt. Alle alten Rechnerlinks öffnen die entsprechenden neuen Formulare.

Seitenverhältnisse werden exakt gekürzt; beim Skalieren werden halbe Pixel über ganzzahlige BigInt-Rechnung zuverlässig aufgerundet. Der Kreditrechner verwendet einen gleichbleibenden nominalen Jahreszins und monatliche Zahlungen am Monatsende, ohne Gebühren; die Formelkonvention entspricht [Microsoft PMT](https://support.microsoft.com/en-us/excel/functions/pmt-function). Der BMI verwendet Gewicht in Kilogramm und die quadrierte Grösse in Metern; er gibt keine gesundheitliche Einstufung aus. Formelgrundlage: [CDC BMI](https://www.cdc.gov/bmi/about/index.html).

Der QR-Designer bietet Inhalt, Design, zugeschnittene PNG-/JPEG-/WebP-Logos sowie PNG- und SVG-Downloads. SVG-Bilder sind eingebettet. Mindestens vier freie Randmodule, begrenzte Logoabdeckung, hohe Fehlerkorrektur bei Logos und Kontrastwarnungen schützen die Lesbarkeit. Die angebotenen Modul- und Eckstile wurden unabhängig decodiert. Ein dokumentierter Bun-Patch korrigiert UTF-8 in der privaten Encoder-Kopie von `qr-code-styling@1.9.2`.

Je fünf vorbelegte Vordergrund- und Hintergrundfarben ergänzen den freien Farbwähler. Alle 25 Kombinationen erreichen mindestens 6,047:1 Kontrast. Die Auswahl ist auf Deutsch und Englisch beschriftet und mit Tastatur und Touch bedienbar.

Der Logoausschnitt lässt sich direkt mit Maus, Finger und Pfeiltasten bewegen. «Zentrieren» erhält den Zoom. Die beiden Positionsregler entfallen. Der Ausschnitt bleibt innerhalb des Bildes, und ein abgebrochener Drag stellt die Ausgangsposition wieder her. Zusätzliche Finger oder deren Capture-Ereignisse unterbrechen den aktiven Drag nicht.

Der PDF-Editor verwendet `@embedpdf/pdfium@2.15.0` in einem eigenen Worker. Unterstützte Textobjekte werden nativ geändert. Export und erneutes Öffnen enthalten den neuen Text; der alte Text wird nicht durch eine Fläche verdeckt. Hinzu kommen Texte, Bilder, Markierungen, Unterstreichungen, Zeichnungen, Notizen, Formen, sichtbare Unterschriften, Seitenoperationen, Suche, Zoom, Undo/Redo und Schutz ungespeicherter Änderungen.

Der Dateikonverter verarbeitet Aufträge erst nach dem Start und nacheinander. Er bietet gemeinsame und individuelle Zielformate, formatspezifische Einstellungen, Abbruch, Wiederholung sowie Einzel- und ZIP-Downloads. Alle 33 vorgesehenen Formatpaare wurden mit echten synthetischen Dateien konvertiert und unabhängig geöffnet.

## Nachweise

Abschliessender Unit-Lauf: 681 Tests bestanden. Nach Integration der letzten drei Rechner und der direkten Logo-Bedienung bestanden zusätzlich 16 betroffene Browserfälle unter Produktions-CSP. Die frühere gemeinsame Abnahme umfasste 29 CSP-Fälle und zwölf Firefox-Matrixfälle. Der vorherige Lauf mit Chromium Desktop/Mobil und WebKit deckte 112 unterschiedliche Fälle ab; fünf anfängliche Fehler wurden behoben und gezielt nachgeprüft. Die vollständige Medien-Formatmatrix war bereits zuvor mit echten Dateien bestanden.

Der lokale Vorab-Build enthält 50 Dateien. Fehlende Pflichtdateien und verbotene Dateien: jeweils null. Sein geprüfter Baum hat SHA-256 `125803a8e10f7ed2cc621e708cf7c510c35a8f8e8392079b319a65ae65c8e9e5`. Dieser lokale Prüfstand ist vom späteren operatorgebundenen Release-Artefakt zu unterscheiden; dessen Quellrevision und Hash werden im GitHub-Publishing-Workflow gebunden und geprüft.

- Der vollständige Unit- und Vertragstestlauf besteht mit 72 Testdateien und 681 Tests, einschliesslich Farbpalette, direkter Logo-Bedienung, Rechnern, Navigation und Formularzuständen.
- Lint, Produktionsbuild, Bundle-Budgets, Laufzeitdateien, Lizenzhinweise und der Hosting-Dateivertrag wurden geprüft. Der Website-Build enthält keine verbotenen Quelldateien oder Entwicklungsartefakte.
- QR: `pngjs` öffnet PNG-Dateien; `jsQR` decodiert PNG und gerasterte SVG-Ausgaben. Enthalten sind deutsche Umlaute, CJK, Emoji, Logos, verschiedene WebP-Varianten und die angebotenen Stile.
- PDF: PDF.js liest geänderten Text unabhängig aus exportierten Dateien. PDF-lib prüft Seiten, Metadaten und vorhandene Formularwerte. Pixelvergleiche bestätigen unveränderte Bereiche ausserhalb des ersetzten Textobjekts. CropBox, Seitenrotation, Miniaturen, Worker-Abbruch und Wiederherstellung sind abgedeckt.
- Konverter: Natives FFprobe und vollständiges FFmpeg-Decoding prüfen Medienausgaben. PDF-lib und fflate prüfen PDFs und ZIPs. Bildmasse, weisser JPEG-Hintergrund, PDF-Seitengrösse/DPI, Audioqualität und Videoausschnitt werden am Ergebnis geprüft. EXIF 6/8 bestehen mit beiden TIFF-Byteordnungen, Originalgrösse, Resize und unabhängiger Pixelprüfung unter Chromium und WebKit.
- Browser: Chromium Desktop/Mobil, Firefox und WebKit wurden geprüft. Die vollständige Formatpaar-Matrix wurde unter Chromium ausgeführt. PDF, Bilder, EXIF und ausgewählte Bedienungsabläufe besitzen zusätzliche Browserabdeckung; eine vollständige Medienmatrix pro Browser wird damit nicht behauptet.
- Rechner: 68 Modelltests sowie zusätzliche Formular- und Routingtests prüfen alle Formeln, acht Einheitenkategorien, Dezimalkomma, Unter-/Überlauf und unzulässige Eingaben. Der Kreditbetrag wird zusätzlich über eine unabhängige monatliche Tilgungsrechnung nachgerechnet. Eigene formatierte Zahlen können ohne missverständliche Tausendertrennzeichen erneut eingegeben werden. Alte Rechnerlinks und erhaltene Formulare bei Browser-Zurück sind abgedeckt.
- Automatisierte Axe-Prüfungen erfassen die drei Einstiegsseiten in beiden Sprachen und Themes sowie den geöffneten PDF-Editor und die Konverter-Warteschlange. Tastatur, mobile Breite und reduzierte Bewegung sind zusätzlich geprüft.
- Die zusätzliche Rechnerseite ist ebenfalls in beiden Sprachen und Themes geprüft. Bei reduzierter Bewegung stehen CSS-Übergänge auf null Sekunden; dadurch bleiben Text- und Hintergrundfarben auch in WebKit beim Theme-Wechsel synchron.
- Produktions-CSP: Die unveränderten Sicherheitsheader aus `hosting/.htaccess` werden im lokalen Hosting-Preview ausgeliefert. PDF, QR einschliesslich Logo sowie Konvertierungen funktionieren damit.

## Offline und Dateiverarbeitung

Nutzdateien bleiben im Arbeitsspeicher des Browsers. Die beobachteten HTTP-Anfragen für PDF- und Konvertierungsabläufe gehen ausschliesslich an denselben Ursprung und enthalten keine Dateiinhalte. Das Service-Worker-Cache speichert keine Nutzerdateien.

Die drei Studio-Oberflächen und ihre Kernmodule werden vorgehalten. Der grosse FFmpeg-Core wird beim ersten Online-Einsatz geladen und danach gezielt im versionierten Cache gespeichert. Das betrifft Audio/Video und in Browsern ohne OffscreenCanvas auch den Bild-Fallback. Ein frischer Browser benötigt diesen ersten Online-Abruf. Anschliessend funktionieren erneut geöffnete Bildkonvertierungen auch bei ausgefallenem Server.

Der dauerhafte Offline-Regressionstest trennt die tatsächlichen Serververbindungen und prüft Reload, neue JPEG-Konvertierung und Download. Dies umgeht keine Produktbeschränkung: Playwrights emuliertes `context.setOffline(true)` verweigert unter der getesteten WebKit-Version bereits eine minimale gecachte Navigation vor dem Service Worker. Acht Kontrollfälle grenzen dieses Verhalten ein. Der reale Serverausfalltest besteht unter WebKit.

## Bewusste Grenzen

PDF-Textänderungen bleiben auf unterstützte einzelne Textobjekte beschränkt. Teilmengen-Schriften, fehlende Glyphen, komplexe oder gedrehte Textobjekte und Scans können ausgeschlossen sein. OCR, Absatzrekonstruktion, Formularerstellung und kryptografische Signaturen sind nicht enthalten. Unsichere Seitenoperationen an vorhandenen Formularstrukturen werden vor einer Änderung abgelehnt.

Der PDF-Editor begrenzt Eingaben auf 32 MiB und 200 Seiten; Undo/Redo hält höchstens acht Schritte innerhalb des gemeinsamen Speicherbudgets. Der Konverter nimmt höchstens 20 Dateien mit zusammen 250 MiB an. PDF-Eingaben bleiben auch dort auf 32 MiB begrenzt. Einzelne Ergebnisse sind auf 64 MiB, gleichzeitig gehaltene Ergebnisse auf 128 MiB begrenzt. Weitere Pixel-, Seiten- und Laufzeitgrenzen werden vor der Verarbeitung geprüft.

Für die ausdrücklich freigegebene GitHub-Veröffentlichung gelten weiterhin der saubere Git-Stand, die vorhandenen geschützten Betreiberangaben und der bestehende Release-Vertrag. `main` enthält den vollständigen Quellstand; `plesk` wird ausschliesslich aus dem geprüften Release-Artefakt erzeugt.

## Wiederholen

```sh
bun install --frozen-lockfile
bun run lint
bun run test:run --maxWorkers=1
bun run build
bun run test:e2e
bun run build:site
```

Für die unabhängige Medienprüfung benötigen die Tests natives `ffmpeg` und `ffprobe` im `PATH` oder die Umgebungsvariablen `FOLKKIT_TEST_FFMPEG` und `FOLKKIT_TEST_FFPROBE`. Diese Programme werden nicht an Website-Nutzer ausgeliefert. Browser-Sicherheitsheader werden mit `FOLKKIT_E2E_HOSTING_HEADERS=1` gegen den zuvor erzeugten Hosting-Build geprüft.

Einzelberichte, Testlogs und Screenshots liegen im ignorierten Arbeitsverzeichnis `.superpowers/sdd/2026-09-05-folkkit-studio/`.
