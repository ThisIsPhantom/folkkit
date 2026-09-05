# Folkkit: freigegebene Bedienverbesserungen und Erweiterungen

Freigabe: «umsetzen, kein figma». Grundlage ist die unmittelbar zuvor gezeigte UX-Durchsicht des veröffentlichten Stands 117f880. Die bestehende Freigabe für `main` und den generierten `plesk`-Branch gilt weiter. Kein Figma, kein separater Live-Eingriff.

## Global Constraints

- React, Vite und plain CSS; bestehende helle Studio-Gestaltung, Dunkelmodus, Deutsch/Englisch und AGPL beibehalten.
- Dateien und persönliche Inhalte bleiben im Browser. Keine externen Laufzeitdienste, CDNs, Telemetrie oder automatische dauerhafte Inhaltsablage.
- Inhalte der laufenden QR-, Rechner- und Konverter-Sitzung bleiben bei interner Navigation im Arbeitsspeicher erhalten. Zurücksetzen/Dateien entfernen und Tab-Schliessen geben sie frei. PDF behält seinen bestehenden Schutz ungespeicherter Änderungen.
- Alle bisherigen Formatpaare, Grenzen und sicheren Exportregeln bleiben erhalten. PDF verwendet ausschliesslich die vorhandene PDFium-Engine.
- Produktive Abhängigkeiten und zentrale Übersetzungsimporte, Navigation und PWA werden nur durch Root geändert. Keine unnötigen neuen Abhängigkeiten.
- Implementer bearbeiten nur ihre zugewiesenen Dateien. Root koordiniert Git-Operationen, Gesamtprüfung und Veröffentlichung. Jede Teilaufgabe erhält eine unabhängige Prüfung.
- OCR und PDF-Komprimierung sind spätere Ausbaustufen. Diese Umsetzung umfasst die vier im Schlussvorschlag genannten Erweiterungen: QR-Inhaltstypen/Lesen, Bildoptimierung, PDF-Seitenübersicht und Datum/Zeit.

## Task 1: Konverter und Bildoptimierung

Zuständig: Implementer, nur `src/features/convert/**` sowie zugehörige Konverter-E2E-Tests. Root bearbeitet keine Dateien in diesem Bereich während der Implementierung.

1. Nach Dateiauswahl die grosse Ablagefläche zu einer kompakten Aktion «Dateien hinzufügen» verkürzen. Bei leerer Liste bleibt die grosse Drop-Fläche. Laufende Warteschlange und nächste Hauptaktion müssen auf Mobilgeräten gut erreichbar bleiben.
2. Dateigrössen in passenden Einheiten anzeigen, etwa Bytes/KiB/MiB statt 0.00 MiB. Pro Ergebnis den endgültigen Dateinamen und die Ergebnisgrösse anzeigen; bei Bildern Original und Ergebnis als begrenzte Vorschau mit Vorher-/Nachher-Beschriftung sowie Grössenvergleich. Downloads besitzen eindeutige Namen in ihren zugänglichen Labels. Bestehende Nummerierung gleicher Dateinamen erhalten.
3. Eigenen Modus «Bilder verkleinern» im Konverter anbieten. `FileConverterPage` erhält optional `initialMode='convert'`, `onModeChange`, `initialTarget`, `initialCombine=false` und `active=true`. Gültige Modi sind `convert` und `optimize`; Root bindet `/convert?mode=optimize` sowie Zielvorwahl für alte Links ein. Ohne Callback funktioniert die Auswahl lokal. Nicht bei jedem Render zurücksetzen.
4. Bildoptimierung verarbeitet PNG/JPEG/WebP auch ohne Formatwechsel. Drei verständliche Qualitätsstufen für verlustbehaftete Formate, proportionale Grössenänderung ohne Hochskalierung und klarer Vorher-/Nachher-Vergleich. PNG braucht keine wirkungslose Qualitätsregelung. Bei unveränderten Abmessungen und einem grösseren Re-Encode das Original behalten und diesen Ausgang verständlich anzeigen; keine pauschale Verkleinerung oder Verlustfreiheit versprechen.
5. Dateiinhalt anhand vorhandener Signatur- und Dimensionsprüfung erkennen. Wiederverwende Bildworker und den bestehenden WebKit-Fallback. Die 33 bestehenden Konvertierungspaare dürfen nicht pauschal um unkontrollierte Selbstkonvertierung erweitert werden; Optimierung ist ein klar validierter separater Auftrag.
6. Eine ausdrückliche Startaktion, sequenzielle Jobs, Abbruch/Retry, ZIP, Ergebnisgrenzen und Cleanup beibehalten. Moduswechsel bewahrt Originaldateien; nicht mehr passende Ergebnisse/Einstellungen werden erkennbar ungültig. Keine unerwartete Verdopplung der Ergebnisbudgets durch zwei unabhängige Warteschlangen. Root hält den Arbeitsbereich bei Navigation montiert.
7. Zielvorwahl wird auf neu hinzugefügte kompatible Dateien angewendet, niemals auf unpassende Formate. `initialCombine` erleichtert den alten Bilder-zu-PDF-Einstieg. Ein Modus-/Zielwechsel aus URL/Zurück muss sinnvoll reagieren, ohne bestehende Dateien still zu verlieren.

Abnahme: echte Bilder für gleiche Formate, JPEG-Qualität und Resize; Ergebnisdateien unabhängig lesen; Alpha und EXIF-Drehung erhalten; grösseren Output nicht als Erfolg der Komprimierung ausgeben; Abbruch/Cleanup und Namen prüfen. Bestehende betroffene Bild-/PDF-Paare, DE/EN, Mobil und Produktions-CSP prüfen. Fokussierte Tests zuerst. Keine gemeinsamen `dist`-Builds ohne Absprache mit Root; isolierte Ausgaben im Plan-Arbeitsverzeichnis verwenden.

## Task 2: Direkte PDF-Bedienung und Seitenübersicht

Zuständig: Implementer, nur `src/features/pdf/**` und `tests/e2e/pdf-editor.spec.js`. Neue helper Dateien im selben Feature sind erlaubt. PDF-Engine-Vertrag für den Konverter bleibt unverändert.

1. Ausgewählte unterstützte Text- und Bildobjekte direkt mit Maus/Touch verschieben und über sichtbare Griffe proportional skalieren. Bestehende Buttons als Tastaturalternative erhalten. Doppelklick auf bearbeitbaren Text fokussiert dessen Textfeld oder öffnet eine zugängliche direkte Bearbeitung; kein Überdecken statt echtem Ersetzen.
2. Gesten arbeiten in der bestehenden PDF-/Viewport-Transformation, einschliesslich Rotation und CropBox. Pointer-Capture, Cancel/Rollback, fremde Pointer ignorieren. Während des Ziehens nur eine Vorschau; pro abgeschlossener Geste genau eine Engine-Änderung und ein Undo-Schritt. Unveränderte oder abgebrochene Gesten erzeugen keinen neuen Stand.
3. Objektnamen für Screenreader um einen kurzen Textanfang ergänzen. Das vollständige Bild und Inhalte werden nicht in Logs oder URLs geschrieben.
4. Seitenübersicht mit Mehrfachauswahl, «Alle auswählen», gemeinsamem Drehen/Löschen/Extrahieren und Drag-and-drop-Sortierung. Tastaturknöpfe für Sortierung bleiben erhalten. Ausgewählte Seiten sind klar vom gerade angezeigten Blatt unterscheidbar. Keine letzte Seite löschen, Auswahl nach Operationen begrenzen, Undo/Redo und Suchnavigation bewahren.
5. Mehrseitige Engine-Operationen sind transaktional und erhalten bestehende Dokumentstrukturen; Schutz vor unsicheren Formular-Operationen bleibt bestehen. Keine Rasterisierung des ganzen Dokuments als Ersatz. Nicht zusammenhängende Auswahlen müssen beim Export korrekt und in Dokumentreihenfolge erscheinen.
6. Editorhöhe und Scrollbereiche ordnen: Werkzeugleiste erreichbar, Seiten und Eigenschaften kompakt, Dokumentfläche sinnvoll gross. Mobil Seitenübersicht/Eigenschaften einklappbar; keine überbreite Gesamtseite.
7. `PdfEditorPage` erhält optional `initialAction` für `edit`, `merge`, `extract`, `rotate`, `count` und `organize`. Root bindet alte geeignete PDF-Links an diese Aktionen. Die gewählte Absicht wird vor/nach Dateiauswahl verständlich; insbesondere Mehrfachauswahl bei Extrahieren/Seitenordnen. Bestehende Standardnutzung ohne Prop bleibt intakt.

8. Zur Migration des bisherigen globalen Datei-Drops optional `fileRequest` (`{ id, file }`) und `onFileRequestConsumed(id)` entgegennehmen. Dieselbe Dateiprüfung und derselbe Verlassensschutz gelten. Jede Anfrage höchstens einmal verarbeiten, auch unter StrictMode; Root nach Annahme/Abschluss quittieren, damit die zusätzliche File-Referenz freigegeben wird. Root setzt diese Schnittstelle für den Konverter um.

Abnahme: echte Pointer-Gesten und Export mit unabhängiger Text-/Bildgeometrieprüfung; Rotation 0/90/180/270 und CropBox; ein Undo pro Geste; Capture-Abbruch; mehrere nicht zusammenhängende Seiten, Seitenreihenfolge und Formular-Schutz. DOM/Tastatur/Mobil, Cleanup und CSP belegen. Keine neuen Engines, kein OCR und keine PDF-Komprimierung.

## Task 3: QR-Inhalte, QR-Leser und mobile Bedienung

Zuständig: Implementer, nur `src/features/qr/**` und `tests/e2e/qr-designer.spec.js` beziehungsweise neue QR-E2E-Dateien.

1. Text und URL um WLAN, Kontaktkarte (vCard), E-Mail und SMS mit passenden Feldern ergänzen. Inhalte korrekt maskieren/serialisieren, Steuerzeichen begrenzen, QR-Kapazität weiterhin aus tatsächlich codierten UTF-8-Bytes ermitteln. Fehler und fehlende Pflichtfelder direkt zuordnen. QR-Payload oder Passwörter nie in URL, Logs oder Storage schreiben.
2. QR-Leser für lokale PNG-/JPEG-/WebP-Bilder. Vorhandene Bild-Signatur-/Dimensionsprüfung wiederverwenden. Nur auf ausdrückliche Dateiauswahl lesen, Fortschritt/Abbruch und verständliches «Kein QR-Code gefunden». Root verschiebt das bereits gepinnte `jsqr@1.4.0` von devDependencies in dependencies und regeneriert die Notices.
3. Decoding in einem begrenzten, beendbaren Worker. Name des Workers und dynamische Assets an Root melden, damit Offline/PWA dieselben Dateien vorhält. Begrenzte Pixelmenge, endlicher Timeout und robuste Bereinigung bei Austausch/Reset/Unmount; `active=false` beendet einen laufenden Leseschritt. Ergebnis als Text plus Kopieren. Keine automatische Navigation. Ein optionaler Link wird nur nach HTTP(S)-Validierung und ausdrücklichem Klick geöffnet.
4. Mobil Inhalt/Design/Logo vor einer kleineren Vorschau anzeigen oder die Vorschau kompakt einblendbar machen. Die erste Inhaltseingabe darf nicht unter einer grossen leeren Vorschau verschwinden. PNG-/SVG-Export, Farben, Logo-Zuschnitt mit direktem Drag/Zentrieren und Sicherheitsgrenzen erhalten.
5. `QrDesignerPage` erhält optional `initialMode='create'`, `onModeChange` und `active=true`; Modi `create` und `read`. Root bindet `/qr?mode=read` und Sitzungserhalt durch montierte, bei Navigation verborgene Arbeitsbereiche ein. Keine eigene dauerhafte Speicherung der Eingaben.

Abnahme: Payloads unabhängig decodieren (inklusive WLAN-Sonderzeichen, Unicode und vCard-Zeilenumbrüchen); tatsächliches Lesen gültiger Bilddateien und Fehlfälle; Abbruch/late response; kein fremder Request; mobile Eingabe sofort erreichbar; Tastatur/DE/EN und Produktions-CSP. Keine Kamera-Freigabe anfordern und keine Browsererkennung als einzige QR-Engine verwenden.

## Task 4: Gemeinsame Bedienung, Katalog und Rechner

Zuständig: Root, alle gemeinsamen Dateien sowie `src/features/calculate/**`.

1. Open-Source-Texte dem jetzt öffentlichen Repository anpassen und interne Freigabetexte aus dem öffentlichen Hauptinhalt entfernen. AGPL, Herkunft und exakte Revision bleiben korrekt erreichbar. Veröffentlichungsregeln in internen Projektdateien bleiben bestehen.
2. QR, Konverter und Rechner nach dem ersten Besuch während der offenen App-Sitzung montiert halten und auf anderen Routen aus der Darstellung und Zugänglichkeit entfernen. Keine Inhalte in localStorage/sessionStorage. Den bestehenden PDF-Verlassensschutz beibehalten. Reset/Clear sowie Tab-Schliessen geben Daten frei. Tests für Bereichswechsel und Zurück ergänzen.
3. Katalog: Suche, Kategorienfilter, leere Trefferlage und Favoriten. Favoriten speichern nur bekannte Tool-IDs unter einem eigenen Präferenzschlüssel. Zahlen aus sichtbaren freigegebenen Einträgen ableiten. Hauptfunktionen auf die neuen Bereiche führen; Spezial-Textwerkzeuge bleiben generisch. Alte QR-/Konverter-/geeignete PDF-URLs ebenfalls auf passende aktuelle Bereiche abbilden.
4. Konkrete Haupt-Aliase: `text-to-qr` nach `/qr`; `merge-pdf`, `pdf-split`, `pdf-extract-range`, `pdf-rotate`, `pdf-page-count` nach PDF mit passender Aktion; `images-to-pdf`, `png-to-jpg`, `jpg-to-png`, `audio-to-mp3` nach Konverter mit passender Zielvorwahl. Text-zu-PDF und reine Metadatenabfrage bleiben bei den weiter verfügbaren Spezialwerkzeugen, sofern sie nicht ohne Funktionsverlust in den Editor passen.
5. Rechner: direktes Kopieren mit Erfolgs-/Fehlerrückmeldung; hilfreiche Feldbeispiele; Formeln optional aufklappbar. Mobil kompakte Rechnerauswahl statt dauerhaft zehn grosser Kacheln vor den Feldern.
6. Neue Datum-/Zeitrechner: Datumsabstand, Tage zu einem Datum addieren/subtrahieren und mehrere Zeitspannen summieren. Strikte echte Kalenderdaten, Schaltjahre, keine DST-Abweichung bei Kalendertagen, negative Abstände verständlich. Zeitspannen als Stunden/Minuten/Sekunden; ungültige Eingaben und Überlauf begrenzen. Keine Feiertagsdatenbank oder externe Quelle.
7. Gemeinsame Routenparameter, PWA/Workergraph, aktuelle Notices und Texte integrieren. Umfangreiche Formel-/Worker-Hinweise aus dem unmittelbaren Ablauf nehmen, nötige Grenzen bei den Einstellungen lassen.

## Task 5: Abnahme und Veröffentlichung

1. Jede Teilaufgabe auf Spezifikation und Qualität prüfen; konkrete Befunde beheben. Baseline ist der saubere, bereits in CI geprüfte Commit `117f88046d411ec1624ec58f703c1dca17eb85c9` mit 682 Unit-/Vertragstests.
2. Fokussierte rote/grüne Regressionen für Änderungen; abschliessend Lint, gesamte Unit-/Vertragstests, Build, relevante Browsermatrix, CSP, Offline, Netzwerk-/Datei-Privacy, Notices und Hosting-Vertrag.
3. Windows-Releasepfade kanonisch halten. Frischer Release-Archiv-Build muss funktionieren; vorhandene Pfadalias-Regressionsprüfung bleibt Pflicht. Beim Archivvergleich `git -c core.autocrlf=false archive` verwenden.
4. Vollständigen geprüften Quellstand normal auf `main` pushen. Den bestehenden operatorgebundenen Workflow `publish-plesk.yml` verwenden; keine manuelle Hosting-Branch-Kopie. Beide Workflow-Ergebnisse und den veröffentlichten Dateibaum gegen das vorbereitete Artefakt prüfen. Keine Änderung der Sichtbarkeit, kein Live-Hosting-Eingriff.

