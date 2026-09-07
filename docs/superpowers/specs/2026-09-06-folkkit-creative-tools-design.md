# Folkkit: Bild, Dokumente und Audio

Freigabe: «Gut, mach weiter» vom 6. September 2026 bestätigt die drei unmittelbar zuvor empfohlenen Erweiterungen. Die GitHub-Freigabe für main und generiertes plesk gilt weiter. Kein Figma und kein manueller Live-Eingriff. Basis ist der vollständig geprüfte Commit 9a65c83b06a7d002e16ace9f3995e9cb2e49758e.

## Umfang und Einbindung

1. Bildeditor für PNG, JPEG und WebP: Zuschneiden, Vierteldrehungen, horizontal/vertikal spiegeln, Text und ein eigenes Bild als Wasserzeichen. Direkte Vorschau, verschiebbare Elemente, Grössen-/Deckkraftfelder, Löschen, Zentrieren, Rückgängig/Wiederholen und PNG/JPEG/WebP-Download.
2. Dokumentkonvertierung zwischen DOCX, Markdown und HTML, alle sechs gerichteten Formatpaare, über die vorhandene Dateiwarteschlange. Pandoc WASM als selbst gehostete, gepinnte Engine. Semantische Inhalte, Tabellen, Listen und eingebettete unterstützte Bilder erhalten; keine Zusage für identische Word-Seitenlayouts. Keine direkte PDF-Ausgabe.
3. Audiozuschnitt für MP3, WAV, FLAC und OGG/Vorbis: Wellenform mit verschiebbaren Auswahlgrenzen und Zahlenfeldern, Auswahl abspielen/pausieren, Ein-/Ausblenden, Rückgängig/Wiederholen und Export in eines dieser vier Formate, auch im Ursprungsformat.

Eigene Routen /image und /audio, über Startseite, Konverter und Katalog erreichbar. Die bestehende Hauptnavigation bleibt kompakt; keine zwei zusätzlichen gleichrangigen Headerlinks. Dokumente nutzen /convert und die bestehende Queue. Alte Links, Rechner, QR und PDF bleiben funktionsfähig.

## Gemeinsamer Vertrag

- React, Vite, plain CSS, vorhandene Systemschriften, Tabler-Icons und Studio-Tokens. Deutsche und englische Texte, heller und dunkler Modus, 390px-Mobilansicht und Tastaturbedienung.
- Dateiinhalte, Vorschauen und Resultate bleiben im Browser und nur im Arbeitsspeicher. Keine Telemetrie, externen Laufzeitdienste, CDNs oder neue Inhaltschronik.
- Verarbeitung beginnt nach ausdrücklicher Dateiauswahl beziehungsweise Konvertieren/Export. Bei Bereichswechsel bleiben Editorzustände erhalten; laufende Arbeit und Audiowiedergabe werden beendet. Reset, Dateiersatz und Unmount lösen URLs, Listener, Worker und grosse Puffer.
- Originale bleiben erhalten. Jede abgeschlossene Geste erzeugt genau einen Undo-Schritt; Escape, Pointer-Cancel und fremde Pointer dürfen keine Änderung speichern. Zahlenfelder sind vollwertige Tastaturalternativen. Historie ist auf 30 Metadatenzustände begrenzt; keine Kopien grosser Originaldateien je Zustand.
- Keine bestehenden Grenzwerte erhöhen. Neue Enginegrenzen stehen unten und werden vor teuren Allokationen geprüft. Fehlermeldungen enthalten weder Dateiinhalte noch rohe Engine-Logs.
- Heavy Engines laden erst bei Nutzung. Pandoc-WASM und FFmpeg werden nicht durch den Startseitenbesuch vorab heruntergeladen. Nach erster erfolgreicher Nutzung müssen ihre selbst gehosteten Assets offline verfügbar sein, solange der Browsercache sie behalten hat. Fehlende Offline-Assets ergeben eine konkrete Meldung, keinen externen Ersatz.
- Shell, Abhängigkeiten, Notices, PWA und zentrale Routing-/Katalog-/Übersetzungsimporte gehören Root. Jede Teilimplementierung und die gesamte Änderung werden unabhängig geprüft. Normale Veröffentlichung auf main, danach repositoryeigener plesk-Workflow; kein Force-Push oder manuelles Kopieren auf plesk.

## Bildeditor

Die Hauptfläche zeigt das Bild, daneben kompakte Bereiche für Zuschnitt, Drehung/Spiegelung und Elemente. Auf Mobilgeräten stehen Datei und aktive Einstellungen vor ergänzenden Optionen. Export ist erreichbar, ohne lange Erklärungen zu durchlaufen.

- Eingabe höchstens 32 MiB, 24 Millionen Pixel und 8192 Pixel pro Achse. Signatur-/MIME-Prüfung, EXIF und PNG-Transparenz über bestehende Bildvalidierung. Wasserzeichen höchstens 8 MiB und 4 Millionen Pixel; nur PNG/JPEG/WebP.
- Zuschnitt frei oder 1:1, 4:3, 16:9. Auswahl verschieben/verändern und pixelgenaue Felder; explizit anwenden. Das Modell speichert den Ausschnitt und Transformationen, nicht neu codierte Zwischenbilder. Neue Dateiauswahl setzt den Bearbeitungsverlauf zurück.
- Bis 20 Elemente insgesamt. Text bis 500 Zeichen pro Element, Systemschrift, Farbe, Grösse, Deckkraft und Position. Ein Bildwasserzeichen aus derselben Dateiauswahl kann mehrfach eingesetzt werden; Ressourcen werden unabhängig von der Metadatenhistorie verwaltet und bei vollständigem Reset freigegeben. Alle Wasserzeichendateien einschliesslich Undo-/Redo-Referenzen dürfen zusammen höchstens 32 MiB belegen. Nicht mehr referenzierte Ressourcen werden freigegeben; bei Überschreitung wird der neue Upload abgelehnt und vorhandene Arbeit bleibt erhalten. Rasterressourcen werden beim Rendern nacheinander geladen und freigegeben.
- Elementpositionen liegen im aktuellen Bildkoordinatensystem. Zuschnitt/Rotation/Spiegelung transformieren Bild und vorhandene Elemente konsistent. Auswahl, Griffe und Hilfslinien gehören nur zur Oberfläche.
- Vorschau auf höchstens 1600 Pixel längste Achse begrenzen; Export aus dem Original mit denselben Transformationen in voller Zielauflösung. JPEG erhält weissen Hintergrund. Qualitätswahl nur für JPEG/WebP; keine Hochskalierung durch den Editor. Ausgabe höchstens 64 MiB, endlicher Timeout 120 Sekunden.
- Canvas-Export in einem eigenen beendbaren Worker, sofern OffscreenCanvas verfügbar ist; geprüfter Canvas-Fallback mit Abort-/Late-Result-Schutz. Systemschrift kann je Gerät anders aussehen; Vorschau und Export desselben Geräts müssen übereinstimmen.

## Dokumente

Pandoc-Wrapper 1.1.0 ist im npm-Register verifiziert (GPL-2.0-or-later); verpackte Laufzeit etwa 58.6 MB. Zuerst eine echte Browserprobe unter Folkkits CSP mit DOCX, Markdown und HTML. Nur den geprüften Browserpfad übernehmen, alle Laufzeitdateien lokal bündeln, keine Node-/Netzwerk-Fallbacks. Die Browserprobe bestätigt WASM3.10. Die ursprüngliche Binärdatei hat 58 580 800 Bytes und SHA-256 b47c9de52b5b45f103c2dac6fea52591aeafe3dd6cafed13331b67575233a2ff. Ein dokumentierter Wrapper-Patch entfernt Diagnoselogs, begrenzt den GHC-Heap und ermöglicht die Begrenzung des virtuellen Dateisystems; die geladene WASM-Speichergrenze wird vor der Instanziierung auf 512 MiB begrenzt.

- DOCX höchstens 20 MiB, Markdown/HTML höchstens 2 MiB, Ergebnis höchstens 64 MiB, Timeout 60 Sekunden pro Datei. DOCX-ZIP vor dem Entpacken auf Pfade, Eintragszahl (höchstens 1000), expandierte Summe (höchstens 64 MiB), Verschlüsselung und notwendige Word-XML-Teile prüfen. Kein beliebiges ZIP als DOCX akzeptieren.
- Text strikt als UTF-8 lesen; ungültige Bytes und Binärdateien ablehnen. HTML und Markdown anhand der ausdrücklich passenden Dateiendung/MIME zuordnen. Native Codecs und vorhandene Bild-/Medienerkennung bleiben unverändert.
- Ein eigener Worker je Konvertierung, bei Erfolg/Fehler/Abbruch/Timeout beenden. Pandoc erhält feste, erlaubte Optionen und ein begrenztes virtuelles Dateisystem. Eingaben dürfen weder Optionen noch beliebige Dateipfade oder Netzwerkzugriffe steuern. Keine externen Filter, Includes oder Lua-Ausführung.
- Keine HTML-Vorschau mit ausführbarem Nutzercode. Generiertes HTML enthält keine Scripts, Eventhandler, Frames, Formulare, aktive SVGs, externen Styles oder automatisch geladenen externen Ressourcen. Explizite HTTP(S)-Textlinks dürfen erhalten bleiben. Externe Bilder werden ausgelassen und mit einer generischen Warnung gemeldet.
- Eingebettete PNG/JPEG/WebP-Bilder erhalten. HTML-Ausgabe möglichst als einzelne selbstständige Datei mit eingebetteten Bildern. Markdown mit Bildern als ZIP aus Markdown und lokalen Ressourcen, mit gültigen relativen Bildverweisen. DOCX-Bilder als interne Beziehungen. Weitere Bildtypen werden verständlich ausgelassen, niemals heimlich extern geladen.
- Markdown-Ausgabe enthält keinen ausführbaren rohen HTML-Code. Keine originalen Dateipfade/Engine-Meldungen in Warnungen. Bestehende Queue übernimmt Fortschritt, Abbruch, Retry und Downloads; Dokumente erhalten einen kurzen Hinweis zur Layoutgrenze bei ihren Einstellungen.

## Audio

AudioMass dient als Funktionsvorbild; Folkkit nutzt eigene UI und seine vorhandene FFmpeg-Laufzeit. Keine zusätzliche AudioMass-App und keine fremde Runtime einbetten.

- Eingang höchstens 100 MiB und 30 Minuten. Bestehende Container-/Codecprüfung wiederverwenden. Datei- und Codecvalidierung vor der Verarbeitung; Ausgabebudget 64 MiB und Timeout 120 Sekunden beibehalten.
- Eigene FFmpeg-Runtime-Instanz für einen Audioauftrag, aus der bestehenden getesteten Runtime-Fabrik. Ein abgebrochener Konverter darf keinen späteren Audioauftrag beenden und umgekehrt. Bestehende globale Media-API bleibt kompatibel.
- Wellenform aus vollständigen Min-/Max-Fenstern des Audiosignals, vor der Verdichtung. Höchstens 2048 sichtbare Buckets; hohe Töne und gegenphasiges Stereo dürfen nicht als Stille erscheinen. FFmpeg berechnet die Fenster als begrenzte Analysemetadaten; höchstens 512 KiB Analyseausgabe. Eine tief heruntergerechnete Mono-Tonspur allein ist keine ausreichende Wellenformgrundlage. Eine lokale MP3-Vorschau mit 128 kbit/s ermöglicht Wiedergabe in den unterstützten Browsern. Technische Hilfsdateien werden nach dem Erzeugen entfernt und der WASM-Heap freigegeben.
- Start/Ende auf echte Dokumentdauer begrenzen, mindestens 0.05 Sekunden Auswahl. Zeiteingaben mit Millisekunden. Auswahlgrenzen dürfen nicht kreuzen. Zoom zur Auswahl und ganze Datei sind erlaubt, falls sie die Bedienung vereinfachen.
- Fade-in und Fade-out jeweils 0 bis 10 Sekunden und zusammen höchstens Auswahlzeit. Auswahlwiedergabe stoppt am Ende, reagiert auf neue Einstellungen und pausiert bei Verlassen. Fade-Effekt bei der Auswahlwiedergabe berücksichtigen; AudioContext nur nach Nutzergeste.
- Export immer aus der Originaldatei: Auswahl schneiden, Zeitstempel zurücksetzen, Fade-Filter auf die Auswahl anwenden. Feste sichere FFmpeg-Argumente, erlaubte Codecs und Ausgabeprofile. MP3 standardmässig 192 kbit/s, WAV PCM16, FLAC Stufe5, OGG/Vorbis Qualität5. Abgeschnittene Dateien durch Outputlimit nicht als Erfolg ausgeben; exportierte Dauer prüfen.

## Abnahme

- Dokumente: alle sechs Paare mit echten Dateien, Tabellen/Unicode/Bildern; DOCX unabhängig als ZIP/Word-XML, HTML mit DOMParser und Markdown-Ressourcenpfade prüfen. Malformed-ZIP, externe Bilder, rohe HTML-Inhalte, Abbruch/Timeout, Offline und echter CSP-Test.
- Bild: reale Pixel prüfen, kombinierte Rotation/Spiegelung/Zuschnitt/Elemente, JPEG-Hintergrund/PNG-Alpha/EXIF, Undo/Redo, echte Maus-/Touchgesten und Tastatur; Export ohne Auswahlgriffe. Worker und Fallback unabhängig prüfen.
- Audio: echte MP3/WAV/FLAC/OGG, alle vier Eingänge und Ausgänge mit unabhängiger ffprobe/ffmpeg-Kontrolle, Auswahlzeit, Fade-Amplitude und unverändertes Original. Wiedergabegrenzen, Abbruch, Wiederverwendung und gegenseitige Runtime-Isolation.
- Alle vorhandenen Tests weiterhin erfüllen. Frischer Gesamtbuild, Codeprüfung, Unit-/Vertragstests, Desktop-/Mobilbrowsermatrix, Barrierefreiheit, Netzwerkkontrolle, Notices, Hosting-Allowlist und sauberer Release-Archiv-Build.

## Vorgehensentscheid

Die drei Funktionen erweitern dieselbe bestehende Browser-App und teilen Routing, Dateien, Worker-Lebenszyklus und Releasevertrag. Deshalb ein Integrationsplan mit drei separat geprüften Featureaufgaben und einer Shell-/Abnahmeaufgabe. Der Benutzer hat die konkrete Dreierauswahl bestätigt; Details innerhalb dieses Rahmens werden umgesetzt, ohne eine zweite Freigaberunde zu verlangen. Weitere NoSignups-Ideen bleiben ausserhalb dieser Runde.
