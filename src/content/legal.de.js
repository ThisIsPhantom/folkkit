const legalDe = Object.freeze({
  privacy: Object.freeze({
    testId: 'privacy',
    eyebrow: 'Transparente Datenbearbeitung',
    title: 'Datenschutz',
    intro: 'Folkkit verarbeitet ausgewählte Inhalte im Browser. Beim Laden der Website können trotzdem technische Zugriffsdaten anfallen. Diese Erklärung trennt beide Vorgänge.',
    operatorTitle: 'Verantwortliche Stelle',
    operatorMissing: 'Die öffentlichen Betreiberangaben wurden für diesen privaten Vorabstand noch nicht freigegeben. Ein Release-Build bleibt gesperrt, bis Name und Kontakt-E-Mail genehmigt und hinterlegt sind.',
    sourcesLabel: 'Offizielle Orientierung',
    sources: Object.freeze([
      Object.freeze({
        id: 'edoeb-privacy-statements',
        label: 'EDÖB: Datenschutzerklärungen im Internet',
        url: 'https://www.edoeb.admin.ch/de/datenschutzerklaerungen-im-internet',
      }),
      Object.freeze({
        id: 'edoeb-information-duty',
        label: 'EDÖB: Informationspflicht',
        url: 'https://www.edoeb.admin.ch/de/informationspflicht',
      }),
    ]),
    sections: Object.freeze([
      Object.freeze({
        id: 'local-processing',
        title: 'Lokale Dateiverarbeitung',
        paragraphs: Object.freeze([
          'Ausgewählte Dateien, eingefügte Inhalte, Vorschauen und Ergebnisse verarbeitet Folkkit lokal im Browser auf deinem Gerät. Diese Inhalte werden nicht zur Bearbeitung an einen Anwendungsserver übertragen.',
          'Die Verarbeitung kann Arbeitsspeicher, Prozessor und lokale Browserfunktionen beanspruchen. Beim Verwerfen, Zurücksetzen oder Verlassen eines Werkzeugs entfernt Folkkit seine temporären Objekt-URLs und Arbeitsspeicherverweise, soweit der Browser dies zulässt.',
        ]),
      }),
      Object.freeze({
        id: 'same-origin-cache',
        title: 'Website-Dateien und Offline-Cache',
        paragraphs: Object.freeze([
          'Der Browser lädt HTML, JavaScript, CSS, Manifest, Favicon sowie bei Bedarf PDF-, QR- und FFmpeg-Module inklusive WebAssembly vom gleichen Ursprung wie die Website.',
          'Ein Service Worker kann diese Anwendungsdateien für die Offline-Nutzung im Cache Storage speichern. Ausgewählte Dateien, Eingaben, Vorschauen, Ergebnisse und die optionale Inhaltschronik werden nicht in diesem Offline-Cache gespeichert.',
        ]),
      }),
      Object.freeze({
        id: 'history',
        title: 'Optionale lokale Inhaltschronik',
        paragraphs: Object.freeze([
          'Inhalte bleiben standardmässig nur während der aktuellen Sitzung verfügbar. Eine lokale Inhaltschronik speichert begrenzte Ein- und Ausgaben im Local Storage dieses Browsers erst, wenn du sie ausdrücklich aktivierst.',
          'Du kannst einzelne Einträge löschen, die ganze Inhaltschronik löschen oder die Einwilligung widerrufen. Beim Widerruf entfernt Folkkit die gespeicherte Inhaltschronik auf diesem Gerät.',
        ]),
      }),
      Object.freeze({
        id: 'host-logs',
        title: 'Technische Zugriffsprotokolle bei Hosttech',
        paragraphs: Object.freeze([
          'Ob Hosttech technische Zugriffsprotokolle erstellt und welche Daten sie enthalten, hängt von der aktiven Hosting-Konfiguration ab. Mögliche Felder sind IP-Adresse, Zeitpunkt, angeforderter Pfad, Referrer und User-Agent.',
          'Umfang, Zweck und Aufbewahrungsdauer müssen vor der öffentlichen Veröffentlichung anhand dieser Konfiguration bestätigt werden. Für diese Vorabversion liegt dazu keine verifizierte Konfiguration vor.',
        ]),
      }),
      Object.freeze({
        id: 'no-tracking',
        title: 'Keine Analytik, Werbung oder Telemetrie',
        paragraphs: Object.freeze([
          'Folkkit V1 enthält keine Analytik, keine Telemetrie, keine Werbeskripte und keine Anzeigen. Das passive AdSense-Metadatum im HTML-Head bezeichnet lediglich ein mögliches künftiges Eigentümerkonto. Dieses Metadatum löst selbst keine Netzwerkverbindung, Cookies oder Anzeigenlaufzeit aus.',
          'Externe Links zu EDÖB, GNU, GitHub oder FFmpeg werden erst aufgerufen, wenn du ihnen folgst. Dann gelten die Datenschutzbestimmungen des jeweiligen Ziels.',
        ]),
      }),
      Object.freeze({
        id: 'preferences-rights',
        title: 'Einstellungen und Anliegen',
        paragraphs: Object.freeze([
          'Sprache, Design, Favoriten, zuletzt verwendete Werkzeug-IDs und die Entscheidung zur Inhaltschronik können lokal im Browser gespeichert werden. Diese Einstellungen enthalten standardmässig keine ausgewählten Dateien oder konvertierten Ergebnisse.',
          'Datenschutzanliegen und Begehren zu Auskunft, Berichtigung oder Löschung können über die auf der Kontaktseite veröffentlichte Kontakt-E-Mail eingereicht werden, sobald die genehmigten Angaben für den öffentlichen Release hinterlegt sind.',
        ]),
      }),
    ]),
  }),
  source: Object.freeze({
    testId: 'open-source',
    eyebrow: 'Offener Quellcode',
    title: 'Open Source',
    intro: 'Der Code hinter Folkkit ist öffentlich. Du kannst ihn lesen und unter den Lizenzbedingungen weiterverwenden.',
    revisionLabel: 'Diese Version',
    revisionLink: 'Exakte Revision auf GitHub öffnen',
    availabilityNote: 'Der vollständige Quellcode ist auf GitHub ohne Anmeldung einsehbar. Der Link führt zum Stand dieser Version.',
    sourcesLabel: 'Projektquellen',
    sources: Object.freeze([
      Object.freeze({
        id: 'upstream',
        label: 'Upstream: MercuriusDream/convert-everything',
        url: 'https://github.com/MercuriusDream/convert-everything',
      }),
      Object.freeze({
        id: 'gnu-agpl',
        label: 'GNU Affero General Public License 3.0',
        url: 'https://www.gnu.org/licenses/agpl-3.0.html',
      }),
    ]),
    sections: Object.freeze([
      Object.freeze({
        id: 'license',
        title: 'Folkkit-Lizenz',
        paragraphs: Object.freeze([
          'Folkkit ist als Gesamtwerk ausschliesslich unter AGPL-3.0-only veröffentlicht. Der vollständige Lizenztext liegt im Repository in der Datei LICENSE.',
        ]),
      }),
      Object.freeze({
        id: 'upstream',
        title: 'Herkunft und Änderungen',
        paragraphs: Object.freeze([
          'Folkkit basiert auf Convert Everything von MercuriusDream. Die Git-Historie, Urheberhinweise und der Upstream-Verweis bleiben erhalten.',
          'Folkkit ergänzt unter anderem die zweisprachige Oberfläche, lokale Datenschutzkontrollen, Laufzeitgrenzen, Offline-Verhalten sowie diese Rechts- und Quellcodeflächen.',
        ]),
      }),
    ]),
  }),
  licenses: Object.freeze({
    testId: 'licenses',
    eyebrow: 'Lizenznachweise',
    title: 'Lizenzen',
    intro: 'Folkkit und die mitgelieferten Laufzeitkomponenten unterliegen ihren jeweiligen Lizenzen. Die generierten Hinweise stammen aus der gesperrten Abhängigkeitsstruktur und dem manuellen Laufzeit-Asset-Register.',
    noticesTitle: 'Generierte Hinweise zu Drittkomponenten',
    noticesIntro: 'Die folgende Datei wird deterministisch aus bun.lock und scripts/runtime-assets.json erzeugt. Sie umfasst direkte und transitive Laufzeitpakete, das Favicon, den Verzicht auf eingebettete Schriftdateien sowie FFmpeg-JavaScript und WebAssembly.',
    sourcesLabel: 'Primäre Lizenzquellen',
    sources: Object.freeze([
      Object.freeze({
        id: 'gnu-agpl',
        label: 'GNU Affero General Public License 3.0',
        url: 'https://www.gnu.org/licenses/agpl-3.0.html',
      }),
      Object.freeze({
        id: 'ffmpeg-legal',
        label: 'FFmpeg: Lizenz und rechtliche Hinweise',
        url: 'https://ffmpeg.org/legal.html',
      }),
    ]),
    sections: Object.freeze([
      Object.freeze({
        id: 'folkkit',
        title: 'Folkkit und Upstream',
        paragraphs: Object.freeze([
          'Folkkit bleibt AGPL-3.0-only. Die Lizenz erlaubt Nutzung, Änderung und Weitergabe unter ihren Bedingungen und enthält Haftungs- und Gewährleistungsausschlüsse im gesetzlich zulässigen Umfang.',
          'Die Herkunft von MercuriusDream/convert-everything sowie dessen Historie und Hinweise bleiben Teil des Projekts.',
        ]),
      }),
      Object.freeze({
        id: 'ffmpeg',
        title: 'FFmpeg und ffmpeg.wasm',
        paragraphs: Object.freeze([
          'FFmpeg steht überwiegend unter LGPL-2.1-or-later; optionale Bestandteile können GPL-2.0-or-later unterliegen. Das ausgelieferte Paket @ffmpeg/core 0.12.10 deklariert GPL-2.0-or-later. Die erzeugten Hinweise führen die konkreten Paket- und Asset-Angaben auf.',
          'Die FFmpeg-Core-Dateien werden als JavaScript und WebAssembly vom gleichen Ursprung ausgeliefert. Ihre Registrierung ausserhalb der JavaScript-Abhängigkeitsliste verhindert, dass WASM bei der Lizenzprüfung übersehen wird.',
        ]),
      }),
    ]),
  }),
  terms: Object.freeze({
    testId: 'terms',
    eyebrow: 'Rahmen der Nutzung',
    title: 'Nutzungsbedingungen',
    intro: 'Diese Bedingungen beschreiben den technischen Zweck und die Grenzen von Folkkit V1. Sie sind keine Zusicherung für einen bestimmten Verwendungszweck.',
    sourcesLabel: 'Lizenzgrundlage',
    sources: Object.freeze([
      Object.freeze({
        id: 'gnu-agpl',
        label: 'GNU Affero General Public License 3.0',
        url: 'https://www.gnu.org/licenses/agpl-3.0.html',
      }),
      Object.freeze({
        id: 'source',
        label: 'Quellcode und Build-Revision',
        url: '/open-source',
      }),
    ]),
    sections: Object.freeze([
      Object.freeze({
        id: 'scope',
        title: 'Zweck und Verfügbarkeit',
        paragraphs: Object.freeze([
          'Folkkit stellt kostenlose, kontolose Browserwerkzeuge für gelegentliche Datei-, Text-, PDF-, QR- und Rechenaufgaben bereit. Es besteht kein Anspruch auf dauernde Verfügbarkeit, Fehlerfreiheit oder Unterstützung eines bestimmten Browsers oder Dateiformats.',
          'Werkzeuge können Eingaben wegen Dateigrösse, Format, Gerätespeicher oder fehlender Browserfunktionen ablehnen. Experimentelle Medienwerkzeuge können besonders viel Arbeitsspeicher und Rechenleistung benötigen.',
        ]),
      }),
      Object.freeze({
        id: 'responsibility',
        title: 'Eigene Verantwortung',
        paragraphs: Object.freeze([
          'Du bist dafür verantwortlich, dass du Dateien und Inhalte bearbeiten darfst und Ergebnisse vor ihrer weiteren Verwendung prüfst. Bewahre wichtige Originale und Sicherungskopien ausserhalb von Folkkit auf.',
          'Folkkit prüft nicht, ob ein Ergebnis für einen bestimmten rechtlichen Zweck genügt, und übernimmt keine Gewähr dafür, dass ein Ergebnis rechtlich wirksam oder konform ist.',
        ]),
      }),
      Object.freeze({
        id: 'medical',
        title: 'Gesundheitsbezogene Rechenhilfe',
        paragraphs: Object.freeze([
          'Der BMI-Rechner ist nur eine allgemeine Rechenhilfe und keine medizinische Beratung, Diagnose oder Behandlungsempfehlung. Besprich gesundheitliche Fragen mit einer qualifizierten Fachperson.',
          'Ein Rechenergebnis berücksichtigt keine individuelle Krankengeschichte, keine Körperzusammensetzung und keine weiteren medizinischen Faktoren.',
        ]),
      }),
      Object.freeze({
        id: 'finance',
        title: 'Finanzbezogene Rechenhilfe',
        paragraphs: Object.freeze([
          'Der Kreditrechner ist nur eine vereinfachte Rechenhilfe und keine Finanzberatung, Kreditzusage oder Offerte. Konditionen, Gebühren, Steuern, Rundungen und Zahlungspläne können in der Praxis abweichen.',
          'Triff keine finanzielle Entscheidung allein aufgrund eines Folkkit-Ergebnisses. Prüfe die massgeblichen Vertragsunterlagen und hole bei Bedarf fachliche Beratung ein.',
        ]),
      }),
      Object.freeze({
        id: 'license',
        title: 'Open-Source-Lizenz und Drittkomponenten',
        paragraphs: Object.freeze([
          'Folkkit wird unter AGPL-3.0-only bereitgestellt. Für Drittkomponenten gelten die auf der Lizenzseite aufgeführten Bedingungen und Hinweise.',
          'Soweit das anwendbare Recht es zulässt, gelten die Gewährleistungs- und Haftungsregeln der jeweiligen Open-Source-Lizenzen. Zwingende gesetzliche Rechte bleiben unberührt.',
        ]),
      }),
    ]),
  }),
  contact: Object.freeze({
    testId: 'contact',
    eyebrow: 'Betreiber und Anfragen',
    title: 'Kontakt',
    intro: 'Die öffentliche Kontaktseite darf nur genehmigte Betreiberangaben anzeigen.',
    operatorTitle: 'Öffentliche Betreiberangaben',
    operatorMissing: 'Die öffentlichen Betreiberangaben wurden für diesen privaten Vorabstand noch nicht freigegeben. Ein Release-Build bleibt bis zur Hinterlegung von Name und Kontakt-E-Mail gesperrt.',
    emailLabel: 'E-Mail schreiben',
    sourcesLabel: 'Weitere Informationen',
    sources: Object.freeze([
      Object.freeze({
        id: 'privacy',
        label: 'Datenschutzerklärung',
        url: '/privacy',
      }),
      Object.freeze({
        id: 'source',
        label: 'Quellcode und Build-Revision',
        url: '/open-source',
      }),
    ]),
    sections: Object.freeze([
      Object.freeze({
        id: 'requests',
        title: 'Anliegen',
        paragraphs: Object.freeze([
          'Nutze die veröffentlichte Kontakt-E-Mail für Fragen zum Betrieb, zum Datenschutz oder zur Ausübung datenschutzrechtlicher Rechte.',
          'Übermittle keine vertraulichen Dateiinhalte, Gesundheitsdaten, Finanzdaten oder Zugangsdaten per unverschlüsselter E-Mail.',
        ]),
      }),
      Object.freeze({
        id: 'tool-support',
        title: 'Technische Hinweise',
        paragraphs: Object.freeze([
          'Nenne bei einem technischen Problem das Werkzeug, den Browser, die ungefähre Dateigrösse und die angezeigte Fehlermeldung. Sende die betroffene Datei nur nach einer ausdrücklichen und geeigneten sicheren Absprache.',
          'Folkkit enthält keine Telemetrie. Der Betreiber erhält deshalb nicht automatisch Informationen über fehlgeschlagene Verarbeitungsvorgänge.',
        ]),
      }),
    ]),
  }),
})

export default legalDe
