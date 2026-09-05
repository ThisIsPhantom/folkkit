# Folkkit Studio: Umsetzung des freigegebenen Plans

Status: vom Benutzer am 5. September 2026 zur lokalen Umsetzung freigegeben.

## Verbindlicher Umfang

Folkkit erhält drei eigene Arbeitsbereiche unter `/qr`, `/pdf` und `/convert` sowie einen neuen, kompakten Website-Auftritt. Alle Dateiinhalte bleiben im Browser. React, Vite, plain CSS, Deutsch und Englisch, AGPL, selbst gehostete Laufzeitdateien und der bestehende Veröffentlichungsschutz bleiben bestehen. Dieser Plan ersetzt die alte visuelle Vorgabe durch ein modernes helles Tool-Studio mit Graphit, Akzentfarben, serifenloser Typografie und optionalem Dunkelmodus.

1. PDF-Machbarkeit zuerst: `@embedpdf/pdfium@2.15.0` in einem eigenen Worker. Unterstützte Textobjekte tatsächlich ändern, PDF exportieren und unabhängig erneut öffnen. Kein Überdecken als Ersatz. Danach Seitenvorschau, Text/Bilder hinzufügen und bearbeiten, Highlight, Unterstreichen, Zeichnungen, Notizen, Formen, Unterschrift als Bild/Zeichnung, Seiten umsortieren/drehen/duplizieren/löschen/extrahieren, Merge, leere Seiten, Undo/Redo, Zoom, Suche, Download und Schutz ungespeicherter Änderungen. Keine OCR, Absatzrekonstruktion, Formularerstellung oder kryptografischen Signaturen.
2. Website: drei unmittelbar sichtbare Einstiege mit Vorschauen; Navigation QR-Codes, PDF, Konvertieren, Weitere Werkzeuge; reduzierte Texte; bestehende Deep Links erhalten. Mehrfache Erklärungen werden durch kurze kontextbezogene Hinweise ersetzt.
3. QR: Live-Vorschau, Inhalt/Design/Logo, Text und URL, Farben, Modul- und Eckstile, Rand/Grösse, lokales PNG/JPEG/WebP-Logo mit Zuschnitt/Grösse/Abstand, PNG/SVG-Export mit eingebettetem Bild. Standard schwarz auf weiss unabhängig vom UI-Theme. Fehlerkorrektur und Lesbarkeit beachten. Gepinntes `qr-code-styling` verwenden.
4. Konverter: Auswahl/Drop mehrerer Dateien, Typ erkennen, gemeinsames oder individuelles Ziel, Einstellungen, ausdrücklicher Start, sequenzielle Warteschlange, Fortschritt/Abbruch/Fehler/Retry, Einzel-Download und ZIP. PNG/JPEG/WebP untereinander und zu PDF; PDF-Seiten zu PNG/JPEG; MP3/WAV/FLAC/OGG-Vorbis untereinander; MP4/WebM untereinander; MOV zu MP4/WebM; diese Videos zusätzlich zu GIF/MP3. Nur geprüfte Container/Codecs. Standards: Originalbildgrösse, weisser JPEG-Hintergrund, PDF-Raster 144 dpi, MP3 192 kbit/s, Video maximal 1080p ohne Upscaling, GIF expliziter Ausschnitt bis 30 Sekunden.
5. Gemeinsame Grenzen, Fehlermeldungen, Downloads und Speicherfreigabe. Ergebnisbudget für Medien einheitlich 64 MiB; keine pauschale Anhebung für Text. PDF-Konvertierung verwendet dieselbe PDFium-Engine wie der Editor. Neue Dateiprofile und Warteschlange sind vom alten Textkonverter getrennt.

## Abnahme

- PDF: echter Text ersetzt, Export unabhängig geöffnet, Pixel ausserhalb editierter Bereiche erhalten; einfache und eingebettete Fonts, nicht unterstützte Fonts, Scan, Rotation und fehlerhafte Dateien geprüft.
- QR: unabhängiges Decoding der Exporte mit und ohne Logo, PNG/SVG-Integrität, keine externen Referenzen, Limits und Cleanup.
- Konverter: jedes freigegebene Paar mit echten Fixtures und unabhängig geprüften Ergebnissen; individuelle Ziele, Mehrseiten-/ZIP-Ausgabe, Abbruch und Retry.
- Alle Bereiche: DE/EN, Desktop/Mobil, Tastatur, Kontrast, reduzierte Bewegung, Offline, same-origin-Netzwerk und CSP, Datenschutz, Ressourcenfreigabe.
- Lint, Unit-/Vertragstests, Build, Browserprüfungen, Notices und Hosting-Artefaktprüfungen müssen bestehen.

## Lokale Arbeitsaufteilung

- Root: PDF-Engine und Editor, Integration, Abnahme und Dokumentation.
- UI: Website-Shell, Home, Navigation, Designsystem und deren Tests.
- QR: eigenes QR-Modul, Oberfläche, Übersetzungen und Tests.
- Konverter: Dateiprofile, Engine, Warteschlange, Oberfläche, Übersetzungen und Tests.

Abhängigkeiten und zentrale Übersetzungsimporte werden durch Root koordiniert. Keine Commits, Pushes oder Deployments sind durch diesen Umsetzungsauftrag freigegeben.

## Im laufenden Auftrag ergänzte Wünsche

Der Benutzer hat nach Sichtung der lokalen Vorschau folgende Erweiterungen beauftragt:

- Den grünen Punkt mitsamt «Lokal verarbeitet» aus der Oberfläche entfernen.
- Im QR-Design zusätzlich zur freien Farbauswahl vorbelegte Farbpaletten für Vordergrund und Hintergrund anbieten.
- Berechnungen unter `/calculate` mit eigenem Navigationspunkt «Rechner» und Startseiteneinstieg bündeln. Der Prozentrechner erhält beschriftete Zahlenfelder. Dreisatz, Pythagoras, Kreis mit Pi, Flächen, Volumen und Einheiten ergänzen ihn. Die bisherigen Rechnerlinks bleiben erreichbar; Rechner erscheinen im eigenen Bereich statt unter «Weitere Werkzeuge».

Auch diese Ergänzungen bleiben lokal, zweisprachig, mit Tastatur bedienbar und ohne Veröffentlichung.

## Weitere Freigaben am 5. September 2026

- Seitenverhältnis, Kreditrate und BMI erhalten vollständige Formulare in der Rechnerauswahl. Der zusätzliche Block «Weitere Rechner» entfällt; alte Links öffnen die integrierten Formulare.
- Der QR-Logoausschnitt lässt sich direkt mit Maus und Finger verschieben und per Button zentrieren. Die zwei Positionsregler entfallen; Zoom und Tastaturbedienung bleiben verfügbar.
- Nach bestandener Abnahme hat der Benutzer ausdrücklich die Veröffentlichung des vollständigen Quellstands auf `main` und des daraus erzeugten Hosting-Stands auf `plesk` freigegeben. Der bestehende geprüfte Publishing-Vertrag gilt. Ein separater Live-Eingriff auf dem Hosting-Server ist weiterhin nicht beauftragt.
