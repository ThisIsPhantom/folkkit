# Folkkit Studio: lokale Umsetzung und Verifikation

Stand: 5. September 2026. Entwicklung und lokale Abnahme im Worktree `codex/folkkit-studio`, ausgehend von `fa309fb06475bdb7cf79d66ee029b2b2e005fec4`. Der Benutzer hat anschliessend die VerÃ¶ffentlichung auf `main` und des daraus erzeugten Hosting-Stands auf `plesk` freigegeben. Ein separater Live-Eingriff auf dem Hosting-Server ist nicht Teil dieses Auftrags.

## Arbeitsbereiche

Die Startseite fÃ¼hrt direkt zu `/qr`, `/pdf` und `/convert`. Die bisherigen Werkzeuglinks unter `/workspace` bleiben erreichbar. Deutsch und Englisch sowie Hell- und Dunkelmodus sind eingebunden. Die drei Einstiege passen bei 390 Ã— 844 Pixeln auf den ersten Bildschirm. Der grÃ¼ne Hinweis Â«Lokal verarbeitetÂ» wurde auf Wunsch aus Startseite und Navigation entfernt.

Der zusÃ¤tzlich beauftragte Bereich `/calculate` bÃ¼ndelt Prozentrechnung, Dreisatz, Pythagoras, Kreis, FlÃ¤chen, Volumen, Einheitenumrechnung, SeitenverhÃ¤ltnis, Kreditrate und BMI mit passenden Eingabefeldern. Der zusÃ¤tzliche Block Â«Weitere RechnerÂ» entfÃ¤llt. Alle alten Rechnerlinks Ã¶ffnen die entsprechenden neuen Formulare.

SeitenverhÃ¤ltnisse werden exakt gekÃ¼rzt; beim Skalieren werden halbe Pixel Ã¼ber ganzzahlige BigInt-Rechnung zuverlÃ¤ssig aufgerundet. Der Kreditrechner verwendet einen gleichbleibenden nominalen Jahreszins und monatliche Zahlungen am Monatsende, ohne GebÃ¼hren; die Formelkonvention entspricht [Microsoft PMT](https://support.microsoft.com/en-us/excel/functions/pmt-function). Der BMI verwendet Gewicht in Kilogramm und die quadrierte GrÃ¶sse in Metern; er gibt keine gesundheitliche Einstufung aus. Formelgrundlage: [CDC BMI](https://www.cdc.gov/bmi/about/index.html).

Der QR-Designer bietet Inhalt, Design, zugeschnittene PNG-/JPEG-/WebP-Logos sowie PNG- und SVG-Downloads. SVG-Bilder sind eingebettet. Mindestens vier freie Randmodule, begrenzte Logoabdeckung, hohe Fehlerkorrektur bei Logos und Kontrastwarnungen schÃ¼tzen die Lesbarkeit. Die angebotenen Modul- und Eckstile wurden unabhÃ¤ngig decodiert. Ein dokumentierter Bun-Patch korrigiert UTF-8 in der privaten Encoder-Kopie von `qr-code-styling@1.9.2`.

Je fÃ¼nf vorbelegte Vordergrund- und Hintergrundfarben ergÃ¤nzen den freien FarbwÃ¤hler. Alle 25 Kombinationen erreichen mindestens 6,047:1 Kontrast. Die Auswahl ist auf Deutsch und Englisch beschriftet und mit Tastatur und Touch bedienbar.

Der Logoausschnitt lÃ¤sst sich direkt mit Maus, Finger und Pfeiltasten bewegen. Â«ZentrierenÂ» erhÃ¤lt den Zoom. Die beiden Positionsregler entfallen. Der Ausschnitt bleibt innerhalb des Bildes, und ein abgebrochener Drag stellt die Ausgangsposition wieder her. ZusÃ¤tzliche Finger oder deren Capture-Ereignisse unterbrechen den aktiven Drag nicht.

Der PDF-Editor verwendet `@embedpdf/pdfium@2.15.0` in einem eigenen Worker. UnterstÃ¼tzte Textobjekte werden nativ geÃ¤ndert. Export und erneutes Ã–ffnen enthalten den neuen Text; der alte Text wird nicht durch eine FlÃ¤che verdeckt. Hinzu kommen Texte, Bilder, Markierungen, Unterstreichungen, Zeichnungen, Notizen, Formen, sichtbare Unterschriften, Seitenoperationen, Suche, Zoom, Undo/Redo und Schutz ungespeicherter Ã„nderungen.

Der Dateikonverter verarbeitet AuftrÃ¤ge erst nach dem Start und nacheinander. Er bietet gemeinsame und individuelle Zielformate, formatspezifische Einstellungen, Abbruch, Wiederholung sowie Einzel- und ZIP-Downloads. Alle 33 vorgesehenen Formatpaare wurden mit echten synthetischen Dateien konvertiert und unabhÃ¤ngig geÃ¶ffnet.

## Nachweise

Abschliessender Unit-Lauf: 681 Tests bestanden. Nach Integration der letzten drei Rechner und der direkten Logo-Bedienung bestanden zusÃ¤tzlich 16 betroffene BrowserfÃ¤lle unter Produktions-CSP. Die frÃ¼here gemeinsame Abnahme umfasste 29 CSP-FÃ¤lle und zwÃ¶lf Firefox-MatrixfÃ¤lle. Der vorherige Lauf mit Chromium Desktop/Mobil und WebKit deckte 112 unterschiedliche FÃ¤lle ab; fÃ¼nf anfÃ¤ngliche Fehler wurden behoben und gezielt nachgeprÃ¼ft. Die vollstÃ¤ndige Medien-Formatmatrix war bereits zuvor mit echten Dateien bestanden.

Der lokale Vorab-Build enthÃ¤lt 50 Dateien. Fehlende Pflichtdateien und verbotene Dateien: jeweils null. Sein geprÃ¼fter Baum hat SHA-256 `125803a8e10f7ed2cc621e708cf7c510c35a8f8e8392079b319a65ae65c8e9e5`. Dieser lokale PrÃ¼fstand ist vom spÃ¤teren operatorgebundenen Release-Artefakt zu unterscheiden; dessen Quellrevision und Hash werden im GitHub-Publishing-Workflow gebunden und geprÃ¼ft.

- Der vollstÃ¤ndige Unit- und Vertragstestlauf besteht mit 72 Testdateien und 681 Tests, einschliesslich Farbpalette, direkter Logo-Bedienung, Rechnern, Navigation und FormularzustÃ¤nden.
- Lint, Produktionsbuild, Bundle-Budgets, Laufzeitdateien, Lizenzhinweise und der Hosting-Dateivertrag wurden geprÃ¼ft. Der Website-Build enthÃ¤lt keine verbotenen Quelldateien oder Entwicklungsartefakte.
- QR: `pngjs` Ã¶ffnet PNG-Dateien; `jsQR` decodiert PNG und gerasterte SVG-Ausgaben. Enthalten sind deutsche Umlaute, CJK, Emoji, Logos, verschiedene WebP-Varianten und die angebotenen Stile.
- PDF: PDF.js liest geÃ¤nderten Text unabhÃ¤ngig aus exportierten Dateien. PDF-lib prÃ¼ft Seiten, Metadaten und vorhandene Formularwerte. Pixelvergleiche bestÃ¤tigen unverÃ¤nderte Bereiche ausserhalb des ersetzten Textobjekts. CropBox, Seitenrotation, Miniaturen, Worker-Abbruch und Wiederherstellung sind abgedeckt.
- Konverter: Natives FFprobe und vollstÃ¤ndiges FFmpeg-Decoding prÃ¼fen Medienausgaben. PDF-lib und fflate prÃ¼fen PDFs und ZIPs. Bildmasse, weisser JPEG-Hintergrund, PDF-SeitengrÃ¶sse/DPI, AudioqualitÃ¤t und Videoausschnitt werden am Ergebnis geprÃ¼ft. EXIF 6/8 bestehen mit beiden TIFF-Byteordnungen, OriginalgrÃ¶sse, Resize und unabhÃ¤ngiger PixelprÃ¼fung unter Chromium und WebKit.
- Browser: Chromium Desktop/Mobil, Firefox und WebKit wurden geprÃ¼ft. Die vollstÃ¤ndige Formatpaar-Matrix wurde unter Chromium ausgefÃ¼hrt. PDF, Bilder, EXIF und ausgewÃ¤hlte BedienungsablÃ¤ufe besitzen zusÃ¤tzliche Browserabdeckung; eine vollstÃ¤ndige Medienmatrix pro Browser wird damit nicht behauptet.
- Rechner: 68 Modelltests sowie zusÃ¤tzliche Formular- und Routingtests prÃ¼fen alle Formeln, acht Einheitenkategorien, Dezimalkomma, Unter-/Ãœberlauf und unzulÃ¤ssige Eingaben. Der Kreditbetrag wird zusÃ¤tzlich Ã¼ber eine unabhÃ¤ngige monatliche Tilgungsrechnung nachgerechnet. Eigene formatierte Zahlen kÃ¶nnen ohne missverstÃ¤ndliche Tausendertrennzeichen erneut eingegeben werden. Alte Rechnerlinks und erhaltene Formulare bei Browser-ZurÃ¼ck sind abgedeckt.
- Automatisierte Axe-PrÃ¼fungen erfassen die drei Einstiegsseiten in beiden Sprachen und Themes sowie den geÃ¶ffneten PDF-Editor und die Konverter-Warteschlange. Tastatur, mobile Breite und reduzierte Bewegung sind zusÃ¤tzlich geprÃ¼ft.
- Die zusÃ¤tzliche Rechnerseite ist ebenfalls in beiden Sprachen und Themes geprÃ¼ft. Bei reduzierter Bewegung stehen CSS-ÃœbergÃ¤nge auf null Sekunden; dadurch bleiben Text- und Hintergrundfarben auch in WebKit beim Theme-Wechsel synchron.
- Produktions-CSP: Die unverÃ¤nderten Sicherheitsheader aus `hosting/.htaccess` werden im lokalen Hosting-Preview ausgeliefert. PDF, QR einschliesslich Logo sowie Konvertierungen funktionieren damit.

## Offline und Dateiverarbeitung

Nutzdateien bleiben im Arbeitsspeicher des Browsers. Die beobachteten HTTP-Anfragen fÃ¼r PDF- und KonvertierungsablÃ¤ufe gehen ausschliesslich an denselben Ursprung und enthalten keine Dateiinhalte. Das Service-Worker-Cache speichert keine Nutzerdateien.

Die drei Studio-OberflÃ¤chen und ihre Kernmodule werden vorgehalten. Der grosse FFmpeg-Core wird beim ersten Online-Einsatz geladen und danach gezielt im versionierten Cache gespeichert. Das betrifft Audio/Video und in Browsern ohne OffscreenCanvas auch den Bild-Fallback. Ein frischer Browser benÃ¶tigt diesen ersten Online-Abruf. Anschliessend funktionieren erneut geÃ¶ffnete Bildkonvertierungen auch bei ausgefallenem Server.

Der dauerhafte Offline-Regressionstest trennt die tatsÃ¤chlichen Serververbindungen und prÃ¼ft Reload, neue JPEG-Konvertierung und Download. Dies umgeht keine ProduktbeschrÃ¤nkung: Playwrights emuliertes `context.setOffline(true)` verweigert unter der getesteten WebKit-Version bereits eine minimale gecachte Navigation vor dem Service Worker. Acht KontrollfÃ¤lle grenzen dieses Verhalten ein. Der reale Serverausfalltest besteht unter WebKit.

## Bewusste Grenzen

PDF-TextÃ¤nderungen bleiben auf unterstÃ¼tzte einzelne Textobjekte beschrÃ¤nkt. Teilmengen-Schriften, fehlende Glyphen, komplexe oder gedrehte Textobjekte und Scans kÃ¶nnen ausgeschlossen sein. OCR, Absatzrekonstruktion, Formularerstellung und kryptografische Signaturen sind nicht enthalten. Unsichere Seitenoperationen an vorhandenen Formularstrukturen werden vor einer Ã„nderung abgelehnt.

Der PDF-Editor begrenzt Eingaben auf 32 MiB und 200 Seiten; Undo/Redo hÃ¤lt hÃ¶chstens acht Schritte innerhalb des gemeinsamen Speicherbudgets. Der Konverter nimmt hÃ¶chstens 20 Dateien mit zusammen 250 MiB an. PDF-Eingaben bleiben auch dort auf 32 MiB begrenzt. Einzelne Ergebnisse sind auf 64 MiB, gleichzeitig gehaltene Ergebnisse auf 128 MiB begrenzt. Weitere Pixel-, Seiten- und Laufzeitgrenzen werden vor der Verarbeitung geprÃ¼ft.

FÃ¼r die ausdrÃ¼cklich freigegebene GitHub-VerÃ¶ffentlichung gelten weiterhin der saubere Git-Stand, die vorhandenen geschÃ¼tzten Betreiberangaben und der bestehende Release-Vertrag. `main` enthÃ¤lt den vollstÃ¤ndigen Quellstand; `plesk` wird ausschliesslich aus dem geprÃ¼ften Release-Artefakt erzeugt.

## Wiederholen

```sh
bun install --frozen-lockfile
bun run lint
bun run test:run --maxWorkers=1
bun run build
bun run test:e2e
bun run build:site
```

FÃ¼r die unabhÃ¤ngige MedienprÃ¼fung benÃ¶tigen die Tests natives `ffmpeg` und `ffprobe` im `PATH` oder die Umgebungsvariablen `FOLKKIT_TEST_FFMPEG` und `FOLKKIT_TEST_FFPROBE`. Diese Programme werden nicht an Website-Nutzer ausgeliefert. Browser-Sicherheitsheader werden mit `FOLKKIT_E2E_HOSTING_HEADERS=1` gegen den zuvor erzeugten Hosting-Build geprÃ¼ft.

Einzelberichte, Testlogs und Screenshots liegen im ignorierten Arbeitsverzeichnis `.superpowers/sdd/2026-09-05-folkkit-studio/`.


## Erweiterung fÃ¼r Bilder, Dokumente und Audio vom 7. September 2026

Die erste lokale Abnahme dieser Erweiterung umfasste 908 Unit- und Vertragstests, 282 BrowserfÃ¤lle in Chromium, Firefox, WebKit und Chromium-Mobile sowie 119 zusÃ¤tzliche FÃ¤lle unter den Hosting-Headern. Alle genannten PrÃ¼fungen bestanden.

- Bildeditor: PNG/JPEG/WebP, Zuschnitt, Drehung, Spiegelung, Texte und wiederverwendbare Wasserzeichen. Pixelvergleiche prÃ¼fen Originalgeometrie, Transparenz, weissen JPEG-Hintergrund und Exporte ohne Auswahlgriffe. Initiales Einlesen ist abbrechbar; verspÃ¤tete Bitmaps Ã¼berschreiben keinen neuen Versuch. Auf MobilgerÃ¤ten steht die Vorschau vor den zusÃ¤tzlichen Einstellungen.
- Dokumentkonvertierung: alle sechs Richtungen zwischen DOCX, Markdown und HTML. Word-XML, Tabellen, Unicode und eingebettete PNG-/JPEG-/WebP-Dateien wurden unabhÃ¤ngig geprÃ¼ft. HTML bleibt passiv; Markdown mit Bildern wird als ZIP ausgegeben. Sichere Ãœberschriften-IDs aus Markdown/HTML bleiben erhalten. Eigene Word-Sprungmarken kÃ¶nnen beim DOCX-Rundlauf bereits in der Engine verloren gehen; identische Word-Seitenlayouts sind nicht zugesagt.
- Audio: alle 16 Ein-/Ausgabepaare von MP3, WAV, FLAC und OGG/Vorbis, einschliesslich Bearbeitung im gleichen Format. Natives FFprobe und vollstÃ¤ndiges FFmpeg-Decoding prÃ¼fen Codec, Dauer und Fade-Amplituden. Ein echter 8-kHz-MPEG-2.5-Eingang wird anhand validierter Frame- und Encoderangaben mit seiner decodierten Dauer verarbeitet. Hohe TÃ¶ne und gegenphasiges Stereo bleiben in der Wellenform sichtbar.
- Integration: Originale und Konvertergebnisse lassen sich im passenden Editor Ã¶ffnen. Auswahl und Dateien bleiben bei interner Navigation erhalten; Audio pausiert beim Verlassen. Fehler beim Dateiersatz bewahren die bestehende Audioauswahl. Tastatur, Touch, beide Sprachen/Themes, Axe und Netzwerkgrenzen sind abgedeckt.
- Offline: UI und Bildeditor funktionieren nach einer Startseiteninstallation. Pandoc und FFmpeg werden erst bei Verwendung geladen und danach aus dem Browsercache genutzt. Die PrÃ¼fungen schliessen tatsÃ¤chliche Serververbindungen und laden die Seite neu. Die grossen Engines werden nicht beim Startseitenbesuch vorab geladen.

Die Windows-WebKit-Testumgebung kann auch unverÃ¤nderte WAV-, MP3- und OGG-Fixtures nativ nicht abspielen. Dort wurden die konkrete Fehlermeldung, Bearbeitung und Export geprÃ¼ft. TatsÃ¤chliche Auswahlwiedergabe und Endstopp bestehen in Chromium, Firefox und Chromium-Mobile. Daraus wird keine Safari-EinschrÃ¤nkung abgeleitet.

Der normale Browser-Testbuild behÃ¤lt das Vite-Manifest fÃ¼r die bisherigen Testwerkzeuge. Das Hosting-Artefakt enthÃ¤lt es weiterhin nicht. Die zusÃ¤tzlichen Audio-CSP-Belege finden ihre Module direkt in den generierten Assets. Die Hosting-Allowlist und der CSP wurden nicht gelockert.

## Audiowiedergabe vom 9. September 2026

Der Player begrenzt Web-Audio- und native Startphase auf jeweils zwei Sekunden. Bei ausstehendem Web-Audio-Start verwendet er die lokale Audioelement-Wiedergabe. Eine versteckte Metadata-Spur mit `VTTCue.pauseOnExit` schÃ¼tzt das Auswahlende auch bei verspÃ¤teten Fortschrittstimern. Cue und Listener werden auf dem endgÃ¼ltigen Kanal vor dem Sprung zur Startposition eingerichtet und bei Pause, Abbruch, Fehler oder Freigabe entfernt.

Auch Decoderfehler nach einem aufgelÃ¶sten `play()`-Promise werden behandelt. Der Player stoppt den aktuellen Versuch, verwirft den defekten Kanal und meldet den Fehler einmal. Nur die aktuelle, aktive Editorinstanz darf die Meldung anzeigen. Ein neuer Versuch lÃ¶scht sie; Dateiauswahl, Bearbeitung und Export bleiben nutzbar.

Der Windows-Firefox-Runner meldete bei drei unabhÃ¤ngigen nativen Referenzwiedergaben Fehlercode 3. Das bedeutet einen Fehler beim Dekodieren, auch wenn das Medium zuvor als nutzbar galt ([MediaError.code](https://developer.mozilla.org/en-US/docs/Web/API/MediaError/code)). Die PrÃ¼fung der BrowserfÃ¤higkeit spielt deshalb eine unverÃ¤nderte MP3-Referenz vollstÃ¤ndig ab und kontrolliert auch den endgÃ¼ltigen Fehlerzustand. Eine tatsÃ¤chlich angezeigte Preview-Fehlermeldung gilt nur dann als Plattformfall, wenn sowohl das betroffene Preview-Audioelement als auch die unabhÃ¤ngige Referenz ausdrÃ¼cklich native Fehler 3 oder 4 liefern. Die tatsÃ¤chlichen Preview-Codes werden vor der Bereinigung erfasst; eine leere Codeliste, Abbruch, Netzwerkfehler oder Timeout bleiben Fehler der Abnahme. Erfolgreiche Wiedergaben mÃ¼ssen weiterhin die normalen Start-, End- und Zeitgrenzen erfÃ¼llen. Daraus wird keine allgemeine Firefox- oder Safari-EinschrÃ¤nkung abgeleitet.

Ein eigener Regressionstest hÃ¤lt den Fortschrittstimer an und prÃ¼ft die Auswahl von 0,2 bis 0,8 Sekunden mit unverÃ¤nderter Obergrenze unter 0,95 Sekunden. Der bisherige Timerplayer scheitert daran. Weitere FÃ¤lle prÃ¼fen Fades, erneutes Abspielen, Navigation, Dateiwechsel, verspÃ¤tete Promises und die einmalige Freigabe von Ressourcen. Endmessungen werden am Ereignis festgehalten, weil die lokale Firefox-Probe beim spÃ¤teren Lesen trotz pausiertem Element weiterlaufende Medienzeitwerte zeigte.

Der manuell auslÃ¶sbare Workflow `Verify audio playback` prÃ¼ft die Wiedergabe gezielt auf dem Windows-Firefox-Runner. Die optionale Vergleichsprobe schreibt hÃ¶chstens drei begrenzte ZustandsdatensÃ¤tze zu festen synthetischen Dateien in das Testlog. Der Workflow hat ausschliesslich Leserechte und lÃ¤dt keine Testartefakte hoch. Vor der VerÃ¶ffentlichung bleibt die vollstÃ¤ndige regulÃ¤re Abnahme erforderlich.

Nach der Behandlung spÃ¤ter Decoderfehler bestanden 933 Unit- und Vertragstests sowie die vollstÃ¤ndige CodeprÃ¼fung.

## Direkte Bildvorschau vom 9. September 2026

Der Bildeditor zeigte beim Ziehen zunÃ¤chst nur den bewegten Auswahlrahmen. Ein Komponententest und ein echter Browser-Pixelvergleich belegten diesen Fehler. Die Vorschau zeichnet nun Text und Wasserzeichen wÃ¤hrend der Geste neu. Langsame RenderauftrÃ¤ge werden nicht aufgestaut; nur die jeweils neueste wartende Position bleibt erhalten. Fertige Frames werden vollstÃ¤ndig angezeigt, abgebrochene oder veraltete Frames verworfen.

Die lokale PrÃ¼fung umfasst 51 Bild-Komponenten-/Logiktests und 37 BrowserfÃ¤lle in Chromium, Firefox, WebKit und Chromium-Mobile; zwei bereits bestehende CDP-Touch-PrÃ¼fungen werden auf Firefox/WebKit Ã¼bersprungen. GeprÃ¼ft wurden sichtbare Pixel vor dem Loslassen, Escape ohne zusÃ¤tzlichen Undo-Schritt, die pixelgenaue Gleichheit von fertiger Vorschau und PNG-Export, Text und Wasserzeichen sowie Resize nach Drehung. Ein echter Touch-Resize auf dem mobilen Chromium und ein Bereichswechsel mit noch gehaltener Geste bestÃ¤tigen das ZurÃ¼cksetzen auf den gespeicherten Zustand. Die vorherige Datei bleibt unverÃ¤ndert.

Die unabhängige Prüfung fand einen alten Elemententwurf, der nach einem Bereichs-, Dokument- oder Dateiwechsel bei einem Crop-Klick ohne Bewegung übernommen werden konnte. Drei zuerst fehlschlagende Regressionstests belegen den Fall. Scope-Cleanup, Gestenbeginn und Abschluss verwerfen beziehungsweise prüfen jetzt den Entwurf. Ein anschliessender echter Zuschnitt bleibt nutzbar.
