# Bewerbungsstudio: schrittweiser Ausbau

## Lokale Ausbaustufe vom 1. Oktober 2026

Der beauftragte Ausbau erweitert das vorhandene Projektmodell und dieselbe Layoutberechnung für Vorschau und PDF. Es entsteht kein zweites Dokumentformat.

- Abschnittsbreite `column`: `auto`, `full`, `left`, `right`. Explizite Einstellungen gelten auch bei einspaltiger Dokumentvorgabe.
- `newBand: true` beginnt vor einem Abschnitt unter dem Ende beider bisheriger Spalten einen neuen Bereich. `full` führt beide Spalten zusammen; danach können erneut linke und rechte Abschnitte folgen.
- Bestehende Projektdateien der Version 1 erhalten `newBand: false`. IDs, Texte, Reihenfolge und bestehende Spaltenangaben bleiben erhalten. Leere/ausgeblendete Inhaltsabschnitte erzeugen keinen Platzhalter; Abstandhalter und Seitenumbrüche bleiben ausdrücklich auswählbar.
- Rohfotos: weiterhin maximal 5 MiB, neu maximal 24 Megapixel. Der lokale mittige Zuschnitt erzeugt ein PNG mit 512 × 512 Pixeln. Die bisherige Grenze für bereits gespeicherte Projektbilder bleibt unverändert.
- Zwei weitere originale Vorlagen und lokal ausgelieferte Source Sans 3 / Source Serif 4. Die genaue Herkunft der Schriftdateien steht in `scripts/application-font-sources.json`; Lizenztexte bleiben im Repository.

## Späterer MCP-Server – geplant, noch nicht implementiert

Der nächste Schritt kann ein lokaler MCP-Adapter sein, der das bestehende Modell und den PDF-Export wiederverwendet. Die Webseite bleibt eine eigenständige Browseranwendung.

Vorgesehene Reihenfolge:

1. Zuerst reine Werkzeuge für Vorlagen-/Schriftkatalog und Projektvalidierung. Strukturierte Eingaben werden mit `validateApplicationProject` geprüft; keine freien Dateipfade oder Netzabrufe als Werkzeugeingaben.
2. Danach explizite Projektänderungen über die vorhandenen Modellaktionen (`updateApplicationProject`): Abschnitt anlegen, Texte ändern, Breite und neuen Spaltenbereich wählen. Ungültige Aktionen müssen als Fehler gemeldet werden; der aktuelle UI-Vertrag, unveränderte Projekte zurückzugeben, reicht dafür alleine nicht.
3. PDF-Erstellung mit denselben Schriften, Grenzen und Layoutfunktionen. Ein hostseitiger Adapter muss Fonts aus fest erlaubten lokalen Assets laden und den Browserdownload durch eine kontrollierte Artefaktausgabe ersetzen.
4. Erst danach eine optionale Verbindung zur geöffneten Sitzung. Dabei müssen Datenfreigabe, eindeutige Projektzuordnung, Änderungsvorschau und Rückgängig-Verhalten festgelegt werden.

Vor Implementierung festlegen: Soll der Server lokale Projektdateien bearbeiten oder eine geöffnete Browsersitzung steuern? Ein lokaler Prozess benötigt andere Vertrauensgrenzen als die heutige ausschliessliche Browserverarbeitung. Kein automatisches Auslesen oder Übertragen bestehender Bewerbungsinhalte. Kein HTTP-Port, Autostart, MCP-Client-Eintrag oder externer Dienst wird durch diese Ausbaustufe eingerichtet.

## Verifikation

Regressionen prüfen gemischte Spalten, gemeinsame Fortsetzung nach mehrseitigen Bereichen, Import alter Projekte, Foto-Limits und Fehlerzustände. Fonttests prüfen echte eingebettete Schriften und PDF-Text. Die lokale Abschlussprüfung umfasst Lint, Unit-/Vertragstests, Build und Browserkontrollen; ausgeführte Ergebnisse werden im Abschlussbericht genannt.
