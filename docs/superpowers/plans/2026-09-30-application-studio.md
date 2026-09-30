# Bewerbungs-Studio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Ein lokal arbeitendes Bewerbungs-Studio für professionell gestaltbare Lebensläufe und Anschreiben mit separater Formularbearbeitung und überprüfbarem PDF-Export.

**Architecture:** Ein versioniertes Projektmodell trennt Inhalt von Gestaltung. Ein gemeinsamer Layoutservice produziert fertige Seiten mit positionierten Textläufen, Linien und Bildern für SVG-Vorschau und PDF. Die neue Route wird lazy geladen und erhält die Sitzung bei interner Navigation.

**Tech Stack:** React 19, Vite 7, Vanilla CSS, vorhandene Tabler-Icons, pdf-lib, Vitest, Testing Library, Playwright, axe und PDF.js als unabhängiger Testleser. PDF-Schriften zunächst Helvetica und Times in regulär/fett/kursiv; Vorschautext wird aus denselben PDF-Schriftmetriken positioniert. Eine später notwendige zusätzliche Schrifteinbettung erfordert dokumentierte lokale Assets und Notices.

**Spec:** `docs/superpowers/specs/2026-09-30-application-studio-design.md`

## Global Constraints

- Keine Inhaltsübertragung, externen Assets, Cloud-KI, Telemetrie oder automatische Inhaltsspeicherung.
- Sessioninhalt bleibt beim internen Bereichswechsel erhalten; Projekte werden ausdrücklich als lokale JSON-Datei gespeichert.
- Deutsch und Englisch über das bestehende i18n-System, responsive, Tastatur, Kontrast und reduzierte Bewegung.
- Projektdatei 5 MiB, Foto 5 MiB und 12 Megapixel, maximal 100 Einträge und 100.000 Textzeichen im Projekt, maximal 20 Layoutseiten.
- Vorlagenwechsel und Design-Reset verändern keinen Inhalt. Keine stillen Überläufe oder automatische Schriftverkleinerung.
- PDF enthält echten auswählbaren Text. ATS Pur hat eine Spalte und keine Layouttabellen; keine ATS-Garantie oder erfundene Scores.
- Kein eigenständiger Push/Deployment. Commits nur gemäss bestehender Sitzungsautorisierung; diese Planung erstellt keinen Veröffentlichungsschritt.

## Review Focus

1. Nicht mit PDF-Standardschriften darstellbare Unicodezeichen werden benannt und blockieren den Export, statt Inhalte zu verstümmeln (Task 3).
2. Sehr lange ungetrennte URLs/Wörter werden umgebrochen und bleiben vollständig innerhalb der Seite (Task 3).
3. Manipulierte Projektdateien, unbekannte Felder und gefährliche URL-Schemata dürfen keine Scripts oder externen Bildrequests auslösen (Tasks 1 und 4).
4. Schnelle Bearbeitung während Fotoimport/Layout/Export und Wechsel des Projekts dürfen keine alten Ergebnisse übernehmen (Tasks 4 und 6).
5. UI-Sprachwechsel übersetzt Bedienung und lokale Beispiele, verändert jedoch keinen bestehenden Bewerbungstext (Tasks 5 und 7).

## Dateistruktur und Verträge

Neue Dateien liegen unter `src/features/application/`: `applicationModel.js`, `applicationHistory.js`, `applicationTemplates.js`, `applicationLayout.js`, `applicationPdf.js`, `applicationFiles.js`, `applicationTextTools.js`, `ApplicationStudioPage.jsx`, `ApplicationContentPanel.jsx`, `ApplicationDesignPanel.jsx`, `ApplicationTemplatePanel.jsx`, `ApplicationTextPanel.jsx`, `ApplicationPreview.jsx`, `application-studio.css`, `messages.de.js`, `messages.en.js` und zugehörige Tests.

Projektformat: `{version:1, person, resume:{sections,design}, letter:{recipient,date,place,subject,salutation,paragraphs,closing,design}, photo:null|{mime,data,width,height}}`. `person` enthält ausschliesslich Strings für name, title, email, phone, address, website, linkedin, citizenship. Abschnitte: `{id,type,title,visible,entries,style}`; Einträge: `{id,title,organization,location,start,end,description,visible,style}`. Formelemente verwenden `type:'spacer'|'rule'|'pageBreak'`, ohne Beschreibung. Letter-Absätze besitzen `{id,text,style}`. Alle IDs sind lokal generierte Strings.

Design: `{template,pageFormat,margins:{top,right,bottom,left},font,fontSize,lineHeight,paragraphGap,sectionGap,entryGap,dateWidth,accent,textColor,header,photoSize,photoShape}`. Masse sind PDF-Punkte; Seite A4 595.28 × 841.89, Letter 612 × 792. Abschnitt-/Textstil verwendet optionale Overrides für fontSize, weight, color, align, uppercase, before, after, ruleWidth, ruleGap.

Layout: `{pages:[{width,height,runs,lines,images}],issues}`. Textlauf `{text,x,y,font,size,color,link?,sectionId?,entryId?}`, mit y von oben und Baseline-Koordinate. Linien `{x1,y1,x2,y2,width,color}`; Bilder `{x,y,width,height,shape,photo}`. Issues `{code,target,blocking}`. Die Reihenfolge der Runs ist zugleich die logische PDF-Lesereihenfolge.

## Task 1: Validiertes Projekt und Vorlagen

**Files:** Create `applicationModel.js`, `applicationTemplates.js` und beide `.test.js`.

**Interfaces:** `createApplicationProject(locale, date) -> Project`; `validateApplicationProject(value) -> {ok,project?,issues}`; `updateApplicationProject(project, action) -> Project`; `applyApplicationTemplate(project, documentKind, templateId) -> Project`. Aktionen sind explizite Datenaktionen, keine frei auswertbaren Pfade. Vorlagen-IDs: ats, modern, editorial, swiss.

- [x] Failing tests: vier Vorlagen; `applyApplicationTemplate` erhält person, sections, paragraphs und IDs unverändert; duplizieren erzeugt neue IDs; verschieben verändert nur Reihenfolge; verstecken erhält Text; Formelemente besitzen keinen Beschreibungstext.
- [x] Failing tests: 101 Einträge, 100001 Zeichen, NaN-Ränder, doppelte IDs, unbekannte Version und nicht erlaubte Bildressourcen führen zu `{ok:false}`; unbekannte Felder werden nicht übernommen.
- [x] Run `bun run test:run src/features/application/applicationModel.test.js src/features/application/applicationTemplates.test.js`; erwarteter erster Lauf scheitert an fehlenden Modulen.
- [x] Implement defaults und strikt allowlist-basierten Validator. Fonts helvetica/times; fontSize 8–18, lineHeight 1–2, Ränder 18–90, Abstände 0–60, dateWidth 60–150, photoSize 36–110. Farben #RRGGBB mit mindestens 4.5:1 gegen Weiss für Text. Headinggrösse 8–28. Kein stilles Reparieren importierter ungültiger Werte.
- [x] Run dieselben Tests; alle müssen bestehen. Diff auf Inhaltsverlust bei Template-/Resetaktionen prüfen.

## Task 2: Rückgängig/Wiederholen und Textbausteine

**Files:** Create `applicationHistory.js`, `applicationTextTools.js` und Tests.

**Interfaces:** `createApplicationHistory(project) -> History`; `applicationHistoryReducer(history,{type,project?,group?}) -> History` für commit/undo/redo/reset. `getApplicationTextBlocks(locale,target) -> [{id,label,text}]`; `checkApplicationProject(project,jobText='') -> {issues,keywords}`.

- [x] Failing tests: undo/redo stellt Inhalt und Form wieder her; neuer Commit löscht Redo; identische Commits erzeugen keinen Schritt; gleiche Textgruppe wird zusammengefasst, blur beendet Gruppierung; maximal 50 Undo-Snapshots; reset löscht beide Stapel.
- [x] Failing tests: Platzhalter `[Ergebnis]` wird gemeldet; fehlender Name/E-Mail und Betreff werden benannt; Keywordvergleich ist case-insensitive, lokal und nennt keinen ATS-Score; Textbausteinauswahl verändert das Projekt erst beim Übernehmen.
- [x] Run `bun run test:run src/features/application/applicationHistory.test.js src/features/application/applicationTextTools.test.js`; dann implementieren und denselben Lauf vollständig bestehen lassen.
- [x] Implement Vorlagen in DE/EN mit klaren Platzhaltern, sachlicher Checkliste und normalisierten Keywords ohne Bewertung fachlicher Eignung.

## Task 3: Gemeinsames Layout und Seitenumbrüche

**Files:** Create `applicationLayout.js`, `applicationLayout.test.js`.

**Interfaces:** `createApplicationFonts() -> Promise<FontMetrics>`; `layoutApplication(project, documentKind, fonts) -> Layout`. FontMetrics bietet PDF-Standardschriftobjekte für regulär/fett/kursiv und Breitenmessung; keine Abhängigkeit von DOM-Schriftmessung.

- [x] Failing tests: A4/Letter haben exakte Masse; ATS ist einspaltig; bei 2000 Wörtern entstehen mehrere Seiten und jedes Wort erscheint exakt einmal; alle Textrechtecke liegen innerhalb der Ränder; Abschnittsüberschrift bleibt mit mindestens einer folgenden Zeile zusammen.
- [x] Failing tests: überlange Einträge teilen sich über Seiten ohne Verlust; Spacer/Rule verändern nur Geometrie; pageBreak startet neue Seite; lange URL ohne Leerzeichen bleibt vollständig erhalten; nicht darstellbare Zeichen ergeben blocking issue mit Ziel-ID; 21. Seite ergibt pageLimit issue.
- [x] Run `bun run test:run src/features/application/applicationLayout.test.js`, bestätige red vor Implementierung.
- [x] Implement wortbasiertes Wrapping mit Zeichenfallback für überlange Tokens, Fontmetriken für Baselines, Eintragshöhen-Vorberechnung und seitenweiser Fortsetzung. Bilder und Überschriften reservieren Höhe. Die Datumsspalte wird ausserhalb ATS verwendet; Laufreihenfolge bleibt Eintrag für Eintrag lesbar.
- [x] Run denselben Testsatz. Vergleichsfälle für alle vier Vorlagen und beide Dokumente müssen bestehen.

## Task 4: Lokale Dateien, Foto und echter PDF-Export

**Files:** Create `applicationFiles.js`, `applicationPdf.js`, zugehörige Tests; bei Bedarf vorhandene Downloads-/Object-URL-Helpers wiederverwenden.

**Interfaces:** `readApplicationProject(file) -> Promise<Project>`; `serializeApplicationProject(project) -> Blob`; `readApplicationPhoto(file) -> Promise<Photo>`; `exportApplicationPdf(project,kinds,fonts) -> Promise<Uint8Array>`. kinds ist resume, letter oder beide in dieser Reihenfolge. Export ruft Task-3-Layout auf und verweigert blocking issues.

- [x] Failing tests: Roundtrip erhält Inhalt/Form/Foto; 5-MiB-Grenzen vor teuren Reads; Fotoheaders validieren Format und 12 MP vor Decoding; PNG/JPEG/WebP lokal normalisieren; ungültiger Import verändert keinen aktiven Zustand.
- [x] Failing tests: PDF.js extrahiert Namen, Absätze und Aufzählungen in logischer Reihenfolge; Seitenzahl entspricht Layout; PDF hat Linkannotationen für https/mailto/tel, keine javascript/file/data-Links; Foto ist eingebettet; combined PDF besitzt resume vor letter.
- [x] Run `bun run test:run src/features/application/applicationFiles.test.js src/features/application/applicationPdf.test.js`, dann implementieren und grün prüfen.
- [x] Render PDF mit pdf-lib aus fertigen Runs/Lines/Images. Datum und Texte nicht erneut separat umbrechen. Exportfehler enthalten keine Benutzertexte. Lokale Downloads verwenden revokierbare Object-URLs.

## Task 5: Inhaltseditor und zweisprachige Texte

**Files:** Create `ApplicationContentPanel.jsx`, `messages.de.js`, `messages.en.js`, `ApplicationContentPanel.test.jsx`; modify `src/i18n/messages.de.js`, `src/i18n/messages.en.js`.

**Interfaces:** `<ApplicationContentPanel project documentKind onAction onSelectStyle />`; Übersetzungsnamespace `studioApplication`. Panels erhalten das Projekt read-only und liefern Task-1-Aktionen.

- [x] Failing component tests in DE/EN: Personendaten editieren; Lebenslaufabschnitt hinzufügen; Eintrag duplizieren/verschieben/ausblenden/löschen; Heading ändern; Anschreibenempfänger/Betreff/Absätze bearbeiten; alle Felder beschriftet, Vorschau kein contenteditable.
- [x] Failing test: Sprachwechsel verändert kein bestehendes person.name, description oder paragraph.text; Beispiel wird erst durch expliziten Button geladen und enthält fiktive Daten.
- [x] Run `bun run test:run src/features/application/ApplicationContentPanel.test.jsx src/i18n/i18n.test.js`.
- [x] Implement fokussierte Unterkomponenten für Kontaktfelder, Abschnitte und Einträge. Accordion benutzt buttons mit aria-expanded; Reihenfolgebuttons liefern klare Namen. Gelöschte Elemente geben Fokus an nächsten Eintrag/Abschnitt zurück.
- [x] Run dieselben Tests; keine fehlenden Übersetzungsschlüssel.

## Task 6: Gestaltung, Vorlagen, Vorschau und Studiozustand

**Files:** Create `ApplicationStudioPage.jsx`, `ApplicationDesignPanel.jsx`, `ApplicationTemplatePanel.jsx`, `ApplicationTextPanel.jsx`, `ApplicationPreview.jsx`, `application-studio.css`, `ApplicationStudioPage.test.jsx`.

**Interfaces:** `<ApplicationStudioPage active />`; `<ApplicationPreview layout zoom onSelectStyle />`; Designpanel erhält `{project,documentKind,selection,onAction}`. Templatepanel liefert templateId; Textpanel liefert explizite Einfügeaktionen.

- [x] Failing tests: Formularänderung erscheint in Preview; Abschnittsauswahl öffnet dessen Formoptionen; Schrift-/Abstand-/Linienänderung verändert Geometrie, erhält Inhalt; Designreset erhält Text; leere Abschnitte können gestaltet werden; Templatewechsel, Undo/Redo und Formelemente funktionieren.
- [x] Failing tests: Projektimport/Layout/Foto mit verspätetem Ergebnis nach neuem Projekt ignorieren; Export arbeitet mit eingefrorenem aktuellen Snapshot; Fehler erhält Eingaben; active=false stoppt Previewarbeit; Reset leert Foto und Historie.
- [x] Run `bun run test:run src/features/application/ApplicationStudioPage.test.jsx`.
- [x] Implement zentrale History plus UI-Auswahl als getrennten Zustand. Layout mit Revisions-ID, maximal einem aktiven und einem neuesten wartenden Auftrag; Status lokalisiert. PDF-Export blockiert bei ungeklärten Layoutissues. Kein Effekt schreibt Inhalte in Web Storage.
- [x] Implement SVG-Seiten aus Layoutkoordinaten; Text bleibt DOM-Text, Auswahl und Zoom sind tastaturbedienbar. Farbe/Schrift und Zeilenbaselines entsprechen Exportmodell. Desktop zweispaltig, mobil Bearbeiten/Vorschau-Schalter, dunkle UI behält weisses Dokument. Template-Miniaturen verwenden dasselbe Layout für fiktive Beispieldaten.
- [x] Run Komponenten-/i18n-Tests; alle grün.

## Task 7: Appintegration und komplette Browserreise

**Files:** Modify `src/App.jsx`, `src/routing/studioRoutes.js`, `src/components/shell/Header.jsx`, `src/catalog/studioCatalog.js`, zugehörige Tests, `src/i18n/messages.de.js`, `src/i18n/messages.en.js`; create `tests/e2e/application-studio.spec.js`.

**Interfaces:** `/application` resolves application; tool ID application-studio erhält diese Route. Feature wird separat lazy geladen und wie QR-Sitzung retained, nicht als Bild-/Audioeditor registriert. Navigationseintrag Bewerbungen/Applications.

- [x] Failing route/catalog tests: neue Destination, eindeutige katalog-ID und echte DE/EN-Namen; alte Ziele unverändert. Komponententest: navigation away/back erhält Dokument und Formeinstellungen.
- [x] Run `bun run test:run src/routing/studioRoutes.test.js src/catalog/studioCatalog.test.js src/components/shell/Header.studio.test.jsx`.
- [x] Implement Integration und Katalogzählung aus Definitionen. Import-/Exportbuttons behalten eindeutige Übersetzungen; App-Titel lokalisiert.
- [x] Browsertest `@matrix`: leeres Projekt ausfüllen, Vorlage wechseln, Abschnitt/Spacer ändern, Anschreiben erstellen, JSON speichern/importieren, PDF herunterladen und unabhängig prüfen. Zweiter Test mit langen Inhalten prüft Mehrseitigkeit. DE/EN und 390px: Formular zugänglich, keine horizontale UI-Überbreite, Vorschau separat erreichbar.
- [x] Run `bun run build` und `bun run test:e2e -- tests/e2e/application-studio.spec.js`; alle konfigurierte Matrixfälle müssen grün sein, fehlende Browserumgebung wird präzise berichtet.

## Task 8: Zugänglichkeit, Datenschutz und Abschlussprüfung

**Files:** Extend `tests/e2e/application-studio.spec.js`, bei CSP-relevanten Änderungen `tests/e2e/hosting-csp.spec.js`; update `README.md`, `docs/folkkit-studio-verifikation.md`, `PROJECT_MEMORY.md`; Notices nur bei neuer Laufzeitabhängigkeit.

- [x] Add browser assertions: axe keine serious/critical violations, Tastaturfluss durch Tabs und Akkordeons, Fokus nach Delete, Zoom 200%, reduced-motion und dark theme. Dokument bleibt bei UI-Sprachwechsel inhaltlich identisch.
- [x] Add privacy assertions: Unique sentinel im Dokument erscheint in keinen Requests, localStorage/IndexedDB/Cache Storage; keine Third-Party-Requests. Projekt-JSON wird ausschliesslich als Download ausgegeben. Foto-URL wird nach Ersetzen/Reset freigegeben.
- [x] Run `bun run lint`, `bun run test:run`, `bun run build`, `bun run check:notices`, `bun run test:runtime-artifacts`; kein ignorierter Fehler. Danach `bun run test:e2e -- tests/e2e/application-studio.spec.js` sowie passende bestehende Shell-/Navigation-/CSP-Fälle.
- [x] Unabhängiger Abschlussreview gegen Spezifikation, besonders Inhaltsverlust, PDF-Textreihenfolge, lange Inhalte und Importvalidierung. Findings beheben und betroffene Tests wiederholen.
- [x] Dokumentiere tatsächlich ausgeführte Prüfungen und verbleibende Einschränkungen: Standardschriften/Unicodegrenzen, ATS-Pur-Empfehlung und lokale Speicherung. Keine Fertigmeldung ohne überprüfte Ausgaben und keine unbelegte Hostingbehauptung.

## Selbstprüfung des Plans

Alle Spezifikationsbereiche sind Aufgaben zugeordnet: Inhalt/Vorlagen (1,5), Form/History (1,2,6), Bausteine/Checkliste (2,6), Layout/PDF (3,4), Dateien/Fotos/Privacy (4,6,8), Route/Sitzung/DE-EN/Responsive (5–8). Interfaces verwenden durchgehend Project, documentKind, Layout und dieselben Action-Verträge. Die fünf zusätzlichen Fehlerszenarien besitzen konkrete Prüfungen. Keine Implementierung oder Veröffentlichung wurde mit dieser Planung begonnen.


## Ausführungsstand

Am 30. September 2026 direkt im bereitgestellten Workspace umgesetzt. Vollständige Suite 114 Dateien/1.027 Tests, Lint, Build, Notices und Runtime-Prüfung bestanden. Die Browserabnahme umfasst Chromium Desktop/Mobil und die Produktions-CSP; Firefox/WebKit-Downloads waren durch die Netzwerkregel blockiert. Der unabhängige Review und sechs mit RED→GREEN abgesicherte Reparaturen sind im Verifikationsdokument beschrieben. Keine Veröffentlichung und keine zusätzliche Worktree-/Branchintegration.
