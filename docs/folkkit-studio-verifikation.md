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


## Erweiterung für Bilder, Dokumente und Audio vom 7. September 2026

Die erste lokale Abnahme dieser Erweiterung umfasste 908 Unit- und Vertragstests, 282 Browserfälle in Chromium, Firefox, WebKit und Chromium-Mobile sowie 119 zusätzliche Fälle unter den Hosting-Headern. Alle genannten Prüfungen bestanden.

- Bildeditor: PNG/JPEG/WebP, Zuschnitt, Drehung, Spiegelung, Texte und wiederverwendbare Wasserzeichen. Pixelvergleiche prüfen Originalgeometrie, Transparenz, weissen JPEG-Hintergrund und Exporte ohne Auswahlgriffe. Initiales Einlesen ist abbrechbar; verspätete Bitmaps überschreiben keinen neuen Versuch. Auf Mobilgeräten steht die Vorschau vor den zusätzlichen Einstellungen.
- Dokumentkonvertierung: alle sechs Richtungen zwischen DOCX, Markdown und HTML. Word-XML, Tabellen, Unicode und eingebettete PNG-/JPEG-/WebP-Dateien wurden unabhängig geprüft. HTML bleibt passiv; Markdown mit Bildern wird als ZIP ausgegeben. Sichere Überschriften-IDs aus Markdown/HTML bleiben erhalten. Eigene Word-Sprungmarken können beim DOCX-Rundlauf bereits in der Engine verloren gehen; identische Word-Seitenlayouts sind nicht zugesagt.
- Audio: alle 16 Ein-/Ausgabepaare von MP3, WAV, FLAC und OGG/Vorbis, einschliesslich Bearbeitung im gleichen Format. Natives FFprobe und vollständiges FFmpeg-Decoding prüfen Codec, Dauer und Fade-Amplituden. Ein echter 8-kHz-MPEG-2.5-Eingang wird anhand validierter Frame- und Encoderangaben mit seiner decodierten Dauer verarbeitet. Hohe Töne und gegenphasiges Stereo bleiben in der Wellenform sichtbar.
- Integration: Originale und Konvertergebnisse lassen sich im passenden Editor öffnen. Auswahl und Dateien bleiben bei interner Navigation erhalten; Audio pausiert beim Verlassen. Fehler beim Dateiersatz bewahren die bestehende Audioauswahl. Tastatur, Touch, beide Sprachen/Themes, Axe und Netzwerkgrenzen sind abgedeckt.
- Offline: UI und Bildeditor funktionieren nach einer Startseiteninstallation. Pandoc und FFmpeg werden erst bei Verwendung geladen und danach aus dem Browsercache genutzt. Die Prüfungen schliessen tatsächliche Serververbindungen und laden die Seite neu. Die grossen Engines werden nicht beim Startseitenbesuch vorab geladen.

Die Windows-WebKit-Testumgebung kann auch unveränderte WAV-, MP3- und OGG-Fixtures nativ nicht abspielen. Dort wurden die konkrete Fehlermeldung, Bearbeitung und Export geprüft. Tatsächliche Auswahlwiedergabe und Endstopp bestehen in Chromium, Firefox und Chromium-Mobile. Daraus wird keine Safari-Einschränkung abgeleitet.

Der normale Browser-Testbuild behält das Vite-Manifest für die bisherigen Testwerkzeuge. Das Hosting-Artefakt enthält es weiterhin nicht. Die zusätzlichen Audio-CSP-Belege finden ihre Module direkt in den generierten Assets. Die Hosting-Allowlist und der CSP wurden nicht gelockert.

## Audiowiedergabe vom 9. September 2026

Der Player begrenzt Web-Audio- und native Startphase auf jeweils zwei Sekunden. Bei ausstehendem Web-Audio-Start verwendet er die lokale Audioelement-Wiedergabe. Eine versteckte Metadata-Spur mit `VTTCue.pauseOnExit` schützt das Auswahlende auch bei verspäteten Fortschrittstimern. Cue und Listener werden auf dem endgültigen Kanal vor dem Sprung zur Startposition eingerichtet und bei Pause, Abbruch, Fehler oder Freigabe entfernt.

Auch Decoderfehler nach einem aufgelösten `play()`-Promise werden behandelt. Der Player stoppt den aktuellen Versuch, verwirft den defekten Kanal und meldet den Fehler einmal. Nur die aktuelle, aktive Editorinstanz darf die Meldung anzeigen. Ein neuer Versuch löscht sie; Dateiauswahl, Bearbeitung und Export bleiben nutzbar.

Der Windows-Firefox-Runner meldete bei drei unabhängigen nativen Referenzwiedergaben Fehlercode 3. Das bedeutet einen Fehler beim Dekodieren, auch wenn das Medium zuvor als nutzbar galt ([MediaError.code](https://developer.mozilla.org/en-US/docs/Web/API/MediaError/code)). Die Prüfung der Browserfähigkeit spielt deshalb eine unveränderte MP3-Referenz vollständig ab und kontrolliert auch den endgültigen Fehlerzustand. Eine tatsächlich angezeigte Preview-Fehlermeldung gilt nur dann als Plattformfall, wenn sowohl das betroffene Preview-Audioelement als auch die unabhängige Referenz ausdrücklich native Fehler 3 oder 4 liefern. Die tatsächlichen Preview-Codes werden vor der Bereinigung erfasst; eine leere Codeliste, Abbruch, Netzwerkfehler oder Timeout bleiben Fehler der Abnahme. Erfolgreiche Wiedergaben müssen weiterhin die normalen Start-, End- und Zeitgrenzen erfüllen. Daraus wird keine allgemeine Firefox- oder Safari-Einschränkung abgeleitet.

Ein eigener Regressionstest hält den Fortschrittstimer an und prüft die Auswahl von 0,2 bis 0,8 Sekunden mit unveränderter Obergrenze unter 0,95 Sekunden. Der bisherige Timerplayer scheitert daran. Weitere Fälle prüfen Fades, erneutes Abspielen, Navigation, Dateiwechsel, verspätete Promises und die einmalige Freigabe von Ressourcen. Endmessungen werden am Ereignis festgehalten, weil die lokale Firefox-Probe beim späteren Lesen trotz pausiertem Element weiterlaufende Medienzeitwerte zeigte.

Der manuell auslösbare Workflow `Verify audio playback` prüft die Wiedergabe gezielt auf dem Windows-Firefox-Runner. Die optionale Vergleichsprobe schreibt höchstens drei begrenzte Zustandsdatensätze zu festen synthetischen Dateien in das Testlog. Der Workflow hat ausschliesslich Leserechte und lädt keine Testartefakte hoch. Vor der Veröffentlichung bleibt die vollständige reguläre Abnahme erforderlich.

Nach der Behandlung später Decoderfehler bestanden 933 Unit- und Vertragstests sowie die vollständige Codeprüfung.

## Direkte Bildvorschau vom 9. September 2026

Der Bildeditor zeigte beim Ziehen zunächst nur den bewegten Auswahlrahmen. Ein Komponententest und ein echter Browser-Pixelvergleich belegten diesen Fehler. Die Vorschau zeichnet nun Text und Wasserzeichen während der Geste neu. Langsame Renderaufträge werden nicht aufgestaut; nur die jeweils neueste wartende Position bleibt erhalten. Fertige Frames werden vollständig angezeigt, abgebrochene oder veraltete Frames verworfen.

Die lokale Prüfung umfasst 54 Bild-Komponenten-/Logiktests und 37 Browserfälle in Chromium, Firefox, WebKit und Chromium-Mobile; zwei bereits bestehende CDP-Touch-Prüfungen werden auf Firefox/WebKit übersprungen. Geprüft wurden sichtbare Pixel vor dem Loslassen, Escape ohne zusätzlichen Undo-Schritt, die pixelgenaue Gleichheit von fertiger Vorschau und PNG-Export, Text und Wasserzeichen sowie Resize nach Drehung. Ein echter Touch-Resize auf dem mobilen Chromium und ein Bereichswechsel mit noch gehaltener Geste bestätigen das Zurücksetzen auf den gespeicherten Zustand. Die vorherige Datei bleibt unverändert.

Die unabhängige Prüfung fand einen alten Elemententwurf, der nach einem Bereichs-, Dokument- oder Dateiwechsel bei einem Crop-Klick ohne Bewegung übernommen werden konnte. Drei zuerst fehlschlagende Regressionstests belegen den Fall. Scope-Cleanup, Gestenbeginn und Abschluss verwerfen beziehungsweise prüfen jetzt den Entwurf. Ein anschliessender echter Zuschnitt bleibt nutzbar.

Nach der Reviewkorrektur bestanden 941 Unit-/Vertragstests und die vollständige Codeprüfung. Die ergänzte Browserfolge mit Crop-Klick nach Navigation bestand erneut in allen vier Browserprojekten.

## Mobile Bildbearbeitung vom 10. September 2026

Nach der Dateiauswahl entfallen die wiederholte Einführung und die vierzeilige mobile Aktionsleiste. Die vorhandenen Exportfelder stehen vor den übrigen Einstellungen. Zwei Spalten nutzen die Breite für Aktionen und Zuschnittfelder; die Vorschau erhält auf Mobilgeräten keine zusätzliche Mindesthöhe. Bei einem synthetischen Bild mit 600 × 400 Pixeln in einer Ansicht von 390 × 844 Pixeln sank die Höhe der Aktionsleiste von 248 auf 136 Pixel. Der Export beginnt bei rund 582 statt 2137 Pixeln. Deutsch, Englisch, helle und dunkle Ansicht sowie 320 Pixel Breite wurden betrachtet. Die bestehende Eingabeschrift mit 16 Pixeln bleibt erhalten.

Zuschnitt und ausgewählte Elemente erhalten eigene Trefferflächen von bis zu 48 × 48 Pixeln. Die Flächen werden auf die sichtbare Bildfläche begrenzt; der sichtbare Griff bleibt klein. Bei extrem schmalen Bildflächen begrenzt die verfügbare Breite beziehungsweise Höhe die Trefferfläche. Zahlenfelder bleiben die präzise Alternative. Die Änderungen betreffen die Oberfläche; Bildkoordinaten, Original, Export und die Undo-Historie verwenden weiterhin dieselben Funktionen.

Die Bildeditor-Browserprüfung deckt Chromium, Firefox, WebKit und Chromium-Mobile ab; zwei bestehende CDP-Fälle werden auf Firefox/WebKit übersprungen. Die neuen Fälle belegen den früheren Exportzugang, erreichbare Griffe bei winzigen Elementen an beiden Bildecken sowie eine reale Grössenänderung mit anschliessendem Undo. Die bisherigen Pixel-, Escape-, Touch-, Export-, Tastatur-, Axe- und Netzwerkkontrollen bleiben bestehen. Scrollabstände verhindern verdeckte Ziele unter Kopfzeile und Statusmeldung. WebKits Protokoll-Scroll setzte einen Griff in drei Diagnosefällen unter die Kopfzeile; Pointertests zentrieren das Ziel deshalb ausdrücklich und prüfen vor dem Ziehen das tatsächlich getroffene Element. Die Erfolgsbedingungen für Pixel und Export wurden nicht gelockert. Die feste Statusleiste berücksichtigt zusätzlich den unteren Safe-Area-Abstand; ein physisches Gerät mit Aussparung war nicht Teil der lokalen Prüfung.

Die unabhängige Prüfung fand einen Konflikt der erweiterten Trefferfläche mit sehr kleinen Objekten: Ein Drag am Text oder Zuschnitt wurde als Grössenänderung behandelt. Innerhalb kleiner Objekte hat das Verschieben deshalb Vorrang, ausser auf dem sichtbaren runden Griff. Ein zuvor fehlgeschlagener Regressionstest prüft Text, Zuschnitt, Grössenänderung und Undo in einer 320 Pixel breiten Ansicht. Die gezielte Korrekturprüfung bestand in allen vier Browserprojekten.

Abschliessend bestanden 49 Bildeditor-Browserfälle, 941 Unit- und Vertragstests sowie die vollständige Codeprüfung. Die zwei bestehenden CDP-Ausnahmen bleiben unverändert. Pointertests warten nach dem Scrollen auf eine stabile Zielgeometrie; der Test für kleine Objekte prüft zusätzlich den Abstand zum sichtbaren Griff, bevor er eine Move-Geste beginnt.

## Konverter und Preisberechnung vom 10. September 2026

Der Konverter überträgt Einstellungen erst nach einem ausdrücklichen Klick auf Dateien desselben Eingangs-/Zielformats und Arbeitsmodus. Die Empfänger erhalten eigene Einstellungsobjekte. Identische Werte lösen keine erneute Berechnung aus; betroffene bestehende Ergebnisse werden verworfen. Bei kombinierten PDFs gilt das für die gesamte Gruppe. Übertragen und gemeinsames Entfernen fertiger Aufträge sind während Dateiprüfung oder Verarbeitung gesperrt. Das Entfernen erhält wartende und fehlerhafte Dateien und gibt die zugehörigen Bildvorschau-URLs frei. Der Tastaturfokus kehrt sichtbar zum verbleibenden Dateibereich beziehungsweise zur Dateiauswahl zurück.

Im bestehenden Prozentrechner ergänzen Rabatt und Aufschlag die bisherigen drei Modi. Originalpreis und Prozentsatz liefern Änderungsbetrag und Endpreis. Ein Preis von 120 mit 20 Prozent Rabatt ergibt 24 und 96; mit Aufschlag 24 und 144. Negative Werte und Rabatt über 100 Prozent werden am Feld abgewiesen. Die bestehende Bereichsprüfung verhindert nicht endliche oder unterlaufende Ergebnisse. Es werden keine Steuersätze oder feste Währungen vorgegeben.

Gezielte rote und grüne Tests prüfen die Queue, kombinierte Ergebnisse, unveränderte Ausgaben, Einstellungen, Fokus und Formeln. Echte Browserfälle prüfen zwei gleich konfigurierte JPEG-Ausgaben und eine unveränderte WebP-Konvertierung im selben ZIP; die Abmessungen werden unabhängig mit ffprobe gelesen. Wartende und nicht unterstützte Dateien bleiben nach dem Aufräumen vorhanden. Die neuen Abläufe bestehen in Chromium, Firefox, WebKit und Chromium-Mobile. Für echtes Kopieren und Lesen der Zwischenablage erhält ausschliesslich der isolierte Chromium-Testkontext die erforderliche Berechtigung; Firefox und WebKit prüfen Berechnung, Werteübernahme, Fehler und Sprachwechsel. Deutsch/Englisch, helle/dunkle Ansicht, Mobilansicht, Axe und Netzwerkanfragen wurden zusätzlich kontrolliert.

Der bestehende Integrationstest für eine vollständig eingebettete Schrift erreichte in zwei GitHub-Läufen das standardmässige Zeitlimit von fünf Sekunden; jeweils 954 andere Tests bestanden. Die isolierte lokale Wiederholung bestand mit allen neun PDF-Engine-Fällen. Dieser einzelne Test mit echter PDFium-Verarbeitung und unabhängiger PDF.js-Prüfung erhält deshalb ein begrenztes Zeitfenster von 15 Sekunden. Alle Assertions, Fehlerfälle und Laufzeitgrenzen der Anwendung bleiben unverändert.


## PDF-Seitennavigation vom 10. September 2026

Seitennummer, Vorwärts- und Rückwärtsknopf wechseln die angezeigte Seite, ohne die Auswahl für gemeinsame Seitenaktionen zu verändern. Das Bereichsfeld übernimmt einzelne Seiten und Bereiche, etwa «1–3, 7». Doppelte Angaben werden entfernt; die Auswahl folgt der Dokumentreihenfolge. Ungültige Eingaben lassen die bestätigte Auswahl und Ansicht unverändert. Dokument-, Revisions- und Auswahlwechsel verwerfen alte Eingabeentwürfe, ohne die Felder neu einzuhängen. Während einer Verarbeitung sind die neuen Aktionen gesperrt.

Die scrollbare Dokumentfläche ist auch auf leeren Seiten als benannte Region mit der Tastatur erreichbar. Ein echter Browserfall prüft das Scrollen in der vorhandenen Überlaufrichtung. Der bestehende Firefox-Gestentest richtet sein Objekt nach der Auswahl erneut sichtbar aus: Die Diagnose belegte zuvor eine Zielmitte ausserhalb des Viewports und deshalb keinen Pointer-Capture. Seine Prüfungen für Rücknahme und abgeschlossene Gesten bleiben bestehen.

Lokal bestanden 971 Unit- und Vertragstests, die vollständige Codeprüfung, 34 PDF-Editor-Browserfälle und acht zusätzliche Fälle unter den produktiven Hosting-Headern. Die neuen Fälle prüfen Chromium, Firefox, WebKit und Chromium-Mobile, DE/EN, Axe, Seitenlöschung und Undo sowie einen unabhängig geöffneten PDF-Auszug mit den erwarteten Seitengrössen und Rotationen. Die Verarbeitung bleibt im Offline-Test nutzbar; beobachtete HTTP-Anfragen sind ausschliesslich lesend und gleichursprünglich. Desktop- und Mobilansicht wurden zusätzlich visuell geprüft. Eine unabhängige Codeprüfung fand keine weiteren Fehler. Die Veröffentlichung wird separat anhand des konkreten Quellstands und der Workflow-Ergebnisse geprüft.


Der erste GitHub-Lauf für die Seitennavigation bestand 338 Browserfälle; ein älterer Miniaturtest wartete auf eine unsichtbare, absichtlich noch nicht neu gerenderte Miniatur. Derselbe Fehler wurde lokal mit 600 Pixel Ansichtshöhe reproduziert. Der Test bringt die Miniatur vor der Pixelprüfung nun in den sichtbaren Bereich und prüft das ausdrücklich. Orientierung, sichtbarer Inhalt und exportierte Rotation werden weiterhin kontrolliert. Die Anwendung und ihre bedarfsgesteuerte Miniaturdarstellung bleiben dabei unverändert.


Im zweiten GitHub-Lauf bestand die korrigierte Miniaturprüfung; 338 Browserfälle bestanden erneut. Eine andere bestehende Prüfung erzeugte beim Ziehen keine Umsortierung. Fünf lokale Wiederholungen des alten Ablaufs bestanden, ein direkter Wechsel auf `dragTo` erzeugte dagegen in drei Browserprojekten keinen Drag-Start. Der Test beginnt deshalb am tatsächlich angefahrenen Punkt der Seitenkarte und wartet vor dem Scrollen zum Ziel auf ein natives `dragstart`. Zwei Zielbewegungen lösen den browserübergreifenden `dragover` aus. Native Start-/Drop-Ereignisse und die vollständige exportierte Reihenfolge «Page 2, Page 4, Before, Page 3» werden ausdrücklich geprüft. Damit werden die vorherigen Erfolgskriterien erweitert. Anwendungslogik, Zeitlimits und Prüfungen der übrigen Arbeitsbereiche bleiben unverändert. Der genaue Auslöser des einzelnen GitHub-Ausfalls war ohne dessen Browsertrace nicht abschliessend feststellbar; die neue Ablaufprüfung macht eine fehlende Start-/Drop-Phase unmittelbar sichtbar. Grundlage für die Zielbewegungen ist die [Playwright-Dokumentation](https://playwright.dev/docs/input#dragging-manually).


Die anschliessende WebKit-Diagnose zeigte im problematischen Ablauf native Dragover-Ereignisse nur über der Quelle, keine über dem Ziel und keinen Drop. Zusätzliches Warten nach dem Loslassen änderte das nicht. Die Teststeuerung ermittelt deshalb nach dem Scrollen einen mit `elementFromPoint` bestätigten Zielpunkt, bewegt den Zeiger ausdrücklich dorthin und wartet auf das native Dragover der Zielkarte, bevor sie loslässt. Die vollständige Start-/Drop-Folge wird innerhalb des bestehenden Assertion-Zeitfensters geprüft. Damit bestanden alle vier Projekte auch mit Hosting-Headern. Die Anwendung wurde für diese Teststeuerung nicht verändert.


## QR-Ausgabe und Katalogbedienung vom 11. September 2026

Der QR-Designer kopiert den Stand beim Klick als PNG in die Zwischenablage. `ClipboardItem` erhält ein Promise, sodass `clipboard.write()` innerhalb der Benutzeraktion beginnt. Fehlende Unterstützung und verweigerter Zugriff verweisen auf den weiterhin verfügbaren PNG-Download. Vollreset und Unmount verwerfen eine noch ausstehende Bilderzeugung; ein blosser Bereichswechsel darf den angeforderten Stand wie beim Download fertigstellen. Rückmeldungen sind an den zugehörigen QR-Request gebunden. Ein beschäftigter Kopierbutton verwendet `aria-disabled` und einen Aufrufschutz, damit der Tastaturfokus bestehen bleibt und kein zweiter Auftrag startet.

«Design zurücksetzen» stellt Farben, Formen, Rand und Ausgabegrösse zurück. Inhaltsart, Eingaben sowie Logo, Zuschnitt, Logogrösse und Abstand bleiben erhalten. Im Werkzeugkatalog ist das Zurücksetzen aktiver Filter auch bei vorhandenen Treffern erreichbar. Danach liegt der Fokus im Suchfeld. Wird ein Favorit aus der gefilterten Liste entfernt, wandert der Fokus zum nächsten beziehungsweise vorherigen Stern oder zum Favoritenfilter. Ein neuer Fokus und das Verlassen der Seite werden berücksichtigt.

Lokal bestanden 982 Unit- und Vertragstests, die vollständige Codeprüfung, 47 QR-/Katalog-Browserfälle und zwölf zusätzliche Fälle unter den Hosting-Headern. Die Zwischenablage-Ausgabe wird in Chromium unabhängig als PNG gelesen und decodiert; die synthetischen Logopixel werden zusätzlich geprüft. In den übrigen Browsern werden native Kopierbestätigung beziehungsweise die tatsächlich fehlende API-Unterstützung, Download und Bedienung geprüft. Die bestehende Exportkontrolle decodiert weiterhin echte Dateien. Deutsch/Englisch, Tastatur, Mobilansicht, Axe und die bestehenden Netzwerkprüfungen sind enthalten. Desktop- und Mobilansicht wurden visuell geprüft. Die unabhängige Codeprüfung samt Fokus-Nachprüfung fand keine weiteren Befunde.


## Bildebenen vom 11. September 2026

Texte und Wasserzeichen lassen sich innerhalb der bestehenden Bildsitzung duplizieren sowie jeweils eine Ebene nach vorne oder hinten verschieben. Die Elementliste zeigt das oberste Element zuerst. Eine Kopie behält Text, Schriftgrösse, Farbe, Deckkraft, Ausrichtung und Ressourcen-ID. Ihre Position wird zunächst um 16 Bildpixel versetzt und auf jeder passenden Achse auf den Bildbereich begrenzt. Überdimensionierte Elemente behalten ihre bisherige Lage auf der betroffenen Achse. Wasserzeichen referenzieren weiterhin dieselbe Quelldatei. Die Grenze von 20 Elementen und das gemeinsame Ressourcenbudget bleiben bestehen.

Jede ausgeführte Aktion bildet einen eigenen Undo-Schritt. Die Grenzknöpfe bleiben über `aria-disabled` fokussierbar; ihr Aufrufschutz verhindert leere Verlaufseinträge. Die bestehende Funktion zum erneuten Einfügen eines ursprünglichen Wasserzeichens bleibt verfügbar. Vorschau und Export verwenden dieselbe Elementreihenfolge.

Lokal bestanden 987 Unit- und Vertragstests, die vollständige Codeprüfung sowie 53 Bildeditor-Browserfälle. Zwei bestehende CDP-Ausnahmen blieben unverändert. Vier zusätzliche Fälle mit Hosting-Headern bestanden ebenfalls. Der neue Fall vergleicht unabhängig gelesene PNG-Pixel von überlappenden roten und blauen Wasserzeichen vor und nach Umsortierung, Kopie und Undo/Redo. Unveränderte Quellpixel, Kopienposition, Grösse und Deckkraft werden geprüft. Tastaturfokus, DE/EN, Axe, Mobilansicht und ausschliesslich lesende Same-Origin-Anfragen sind enthalten. Desktop- und Mobilansicht wurden betrachtet. Die unabhängige Prüfung bestätigte unveränderte Quellzustände, separate Matrixarrays, erhaltene Ressourcenreferenzen und die UI-Grenzguards ohne Befunde.


Der GitHub-Lauf 34577814117 bestand die reguläre Browsermatrix und wurde erst im anschliessenden Hosting-Header-Block wegen der Jobgrenze von 30 Minuten beendet. Der vollständige Verify-Job erhält deshalb 45 Minuten. Testfälle, Assertions, einzelne Testzeitlimits, Verarbeitungs- und Speichergrenzen der Anwendung sowie Workflow-Berechtigungen bleiben unverändert.
