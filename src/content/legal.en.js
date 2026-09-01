const legalEn = Object.freeze({
  privacy: Object.freeze({
    testId: 'privacy',
    eyebrow: 'Transparent data processing',
    title: 'Privacy',
    intro: 'Folkkit processes selected content in the browser. Technical access data may still arise when the website loads. This notice separates those two processes.',
    operatorTitle: 'Controller',
    operatorMissing: 'The public operator details have not yet been approved for this private pre-release. A release build remains blocked until the approved name, postal address, and contact email are provided.',
    sourcesLabel: 'Official guidance',
    sources: Object.freeze([
      Object.freeze({
        id: 'edoeb-privacy-statements',
        label: 'FDPIC: Privacy policies on the internet',
        url: 'https://www.edoeb.admin.ch/de/datenschutzerklaerungen-im-internet',
      }),
      Object.freeze({
        id: 'edoeb-information-duty',
        label: 'FDPIC: Duty to provide information',
        url: 'https://www.edoeb.admin.ch/de/informationspflicht',
      }),
    ]),
    sections: Object.freeze([
      Object.freeze({
        id: 'local-processing',
        title: 'Local file processing',
        paragraphs: Object.freeze([
          'Folkkit processes selected files, pasted content, previews, and results locally in the browser on your device. It does not transfer that content to an application server for processing.',
          'Processing may use memory, processor capacity, and local browser features. When you discard or reset work or leave a tool, Folkkit removes its temporary object URLs and memory references as far as the browser permits.',
        ]),
      }),
      Object.freeze({
        id: 'same-origin-cache',
        title: 'Website files and offline cache',
        paragraphs: Object.freeze([
          'The browser loads HTML, JavaScript, CSS, the manifest, the favicon, and, when needed, PDF, QR, and FFmpeg modules including WebAssembly from the same origin as the website.',
          'A service worker may store these application files in Cache Storage for offline use. Selected files, inputs, previews, results, and optional content history are not stored in that offline cache.',
        ]),
      }),
      Object.freeze({
        id: 'history',
        title: 'Optional local content history',
        paragraphs: Object.freeze([
          'Content is available only for the current session by default. Local content history stores limited inputs and outputs in this browser\'s Local Storage only after you explicitly enable it.',
          'You can delete individual entries, clear all content history, or withdraw consent. When you withdraw consent, Folkkit removes the stored content history from this device.',
        ]),
      }),
      Object.freeze({
        id: 'host-logs',
        title: 'Technical access logs at Hosttech',
        paragraphs: Object.freeze([
          'For a later Hosttech deployment, technical access logs may arise after the actually active hosting configuration has been checked. They may include IP address, timestamp, requested path, referrer, and user agent.',
          'The scope, purpose, and retention period must be confirmed against the active Hosttech configuration before public release. This pre-release does not claim that such a configuration has already been verified.',
        ]),
      }),
      Object.freeze({
        id: 'no-tracking',
        title: 'No analytics, advertising, or telemetry',
        paragraphs: Object.freeze([
          'Folkkit V1 contains no analytics, telemetry, advertising scripts, or ads. Passive AdSense ownership metadata in the HTML head merely identifies a possible future owner account. The metadata itself causes no network connection, cookies, or advertising runtime.',
          'External links to the FDPIC, GNU, GitHub, or FFmpeg are opened only when you follow them. The destination\'s privacy terms then apply.',
        ]),
      }),
      Object.freeze({
        id: 'preferences-rights',
        title: 'Preferences and requests',
        paragraphs: Object.freeze([
          'Language, theme, favourites, recent tool IDs, and the content history choice may be stored locally in the browser. By default, these preferences contain no selected files or converted results.',
          'Privacy questions and requests for access, correction, or deletion can be submitted through the operator address published on the contact page once approved details are configured for public release.',
        ]),
      }),
    ]),
  }),
  source: Object.freeze({
    testId: 'open-source',
    eyebrow: 'Verifiable build',
    title: 'Open source',
    intro: 'Folkkit identifies every build with the full Git commit from which it was created.',
    revisionLabel: 'Build revision',
    revisionLink: 'Open exact revision on GitHub',
    availabilityNote: 'The revision link does not by itself mean that the repository is publicly accessible. Before public deployment, this exact revision must be available without signing in. The repository remains private during this pre-release development.',
    sourcesLabel: 'Project sources',
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
        title: 'Folkkit license',
        paragraphs: Object.freeze([
          'Folkkit as a whole is released exclusively under AGPL-3.0-only. The full license text is stored in the repository as LICENSE.',
          'The visible source link prepares access to the Corresponding Source for the exact public build. A public website may be released only when the linked commit is actually publicly accessible.',
        ]),
      }),
      Object.freeze({
        id: 'upstream',
        title: 'Origin and modifications',
        paragraphs: Object.freeze([
          'Folkkit is based on Convert Everything by MercuriusDream. The Git history, copyright notices, and upstream reference remain intact.',
          'Folkkit adds the bilingual interface, local privacy controls, runtime limits, offline behaviour, and these legal and source surfaces, among other changes.',
        ]),
      }),
    ]),
  }),
  licenses: Object.freeze({
    testId: 'licenses',
    eyebrow: 'License records',
    title: 'Licenses',
    intro: 'Folkkit and its bundled runtime components are subject to their respective licenses. The generated notices come from the locked dependency graph and the manually maintained runtime asset register.',
    noticesTitle: 'Generated third-party notices',
    noticesIntro: 'The following file is generated deterministically from bun.lock and scripts/runtime-assets.json. It covers direct and transitive runtime packages, the favicon, the absence of embedded font files, and the FFmpeg JavaScript and WebAssembly assets.',
    sourcesLabel: 'Primary license sources',
    sources: Object.freeze([
      Object.freeze({
        id: 'gnu-agpl',
        label: 'GNU Affero General Public License 3.0',
        url: 'https://www.gnu.org/licenses/agpl-3.0.html',
      }),
      Object.freeze({
        id: 'ffmpeg-legal',
        label: 'FFmpeg: License and legal considerations',
        url: 'https://ffmpeg.org/legal.html',
      }),
    ]),
    sections: Object.freeze([
      Object.freeze({
        id: 'folkkit',
        title: 'Folkkit and upstream',
        paragraphs: Object.freeze([
          'Folkkit remains AGPL-3.0-only. The license permits use, modification, and redistribution under its conditions and includes warranty and liability disclaimers to the extent permitted by law.',
          'The origin in MercuriusDream/convert-everything, its history, and its notices remain part of the project.',
        ]),
      }),
      Object.freeze({
        id: 'ffmpeg',
        title: 'FFmpeg and ffmpeg.wasm',
        paragraphs: Object.freeze([
          'FFmpeg is mostly licensed under LGPL-2.1-or-later, while optional parts may be covered by GPL-2.0-or-later. The shipped @ffmpeg/core 0.12.10 package declares GPL-2.0-or-later. The generated notices list the concrete package and asset metadata.',
          'FFmpeg core files are served as same-origin JavaScript and WebAssembly. Registering them outside the JavaScript dependency list prevents the WASM asset from being missed during license review.',
        ]),
      }),
    ]),
  }),
  terms: Object.freeze({
    testId: 'terms',
    eyebrow: 'Terms of use',
    title: 'Terms',
    intro: 'These terms describe the technical purpose and limits of Folkkit V1. They do not promise fitness for a particular use.',
    sourcesLabel: 'License basis',
    sources: Object.freeze([
      Object.freeze({
        id: 'gnu-agpl',
        label: 'GNU Affero General Public License 3.0',
        url: 'https://www.gnu.org/licenses/agpl-3.0.html',
      }),
      Object.freeze({
        id: 'source',
        label: 'Source code and build revision',
        url: '/open-source',
      }),
    ]),
    sections: Object.freeze([
      Object.freeze({
        id: 'scope',
        title: 'Purpose and availability',
        paragraphs: Object.freeze([
          'Folkkit provides free, accountless browser tools for occasional file, text, PDF, QR, and calculation tasks. There is no entitlement to continuous availability, error-free operation, or support for a particular browser or file format.',
          'Tools may reject input because of file size, format, device memory, or missing browser capabilities. Experimental media tools may require substantial memory and processor capacity.',
        ]),
      }),
      Object.freeze({
        id: 'responsibility',
        title: 'Your responsibility',
        paragraphs: Object.freeze([
          'You are responsible for having the right to process files and content and for checking results before further use. Keep important originals and backups outside Folkkit.',
          'Folkkit does not check whether output meets a particular legal requirement and gives no guarantee that output is legally effective or compliant.',
        ]),
      }),
      Object.freeze({
        id: 'medical',
        title: 'Health calculation aid',
        paragraphs: Object.freeze([
          'The BMI calculator is a general calculation aid only. It is not medical advice, a diagnosis, or a treatment recommendation. Discuss health questions with a qualified professional.',
          'A calculation does not account for individual medical history, body composition, or other medical factors.',
        ]),
      }),
      Object.freeze({
        id: 'finance',
        title: 'Financial calculation aid',
        paragraphs: Object.freeze([
          'The loan calculator is a simplified calculation aid only. It is not financial advice, a credit decision, or an offer. Terms, fees, taxes, rounding, and payment schedules may differ in practice.',
          'Do not make a financial decision based only on a Folkkit result. Check the relevant contract documents and obtain professional advice if needed.',
        ]),
      }),
      Object.freeze({
        id: 'license',
        title: 'Open-source license and third-party components',
        paragraphs: Object.freeze([
          'Folkkit is provided under AGPL-3.0-only. The conditions and notices shown on the licenses page apply to third-party components.',
          'To the extent permitted by applicable law, the warranty and liability terms of the respective open-source licenses apply. Mandatory statutory rights remain unaffected.',
        ]),
      }),
    ]),
  }),
  contact: Object.freeze({
    testId: 'contact',
    eyebrow: 'Operator and requests',
    title: 'Contact',
    intro: 'The public contact page may display only approved operator details.',
    operatorTitle: 'Public operator details',
    operatorMissing: 'The public operator details have not yet been approved for this private pre-release. A release build remains blocked until the name, postal address, and contact email are provided.',
    emailLabel: 'Send email',
    sourcesLabel: 'More information',
    sources: Object.freeze([
      Object.freeze({
        id: 'privacy',
        label: 'Privacy notice',
        url: '/privacy',
      }),
      Object.freeze({
        id: 'source',
        label: 'Source code and build revision',
        url: '/open-source',
      }),
    ]),
    sections: Object.freeze([
      Object.freeze({
        id: 'requests',
        title: 'Requests',
        paragraphs: Object.freeze([
          'Use the published contact address for questions about operation, privacy, or the exercise of data protection rights.',
          'Do not send confidential file contents, health data, financial data, or credentials by unencrypted email.',
        ]),
      }),
      Object.freeze({
        id: 'tool-support',
        title: 'Technical information',
        paragraphs: Object.freeze([
          'For a technical problem, state the tool, browser, approximate file size, and displayed error message. Send the affected file only after an explicit arrangement through a suitable secure channel.',
          'Folkkit contains no telemetry. The operator therefore receives no automatic information about failed processing operations.',
        ]),
      }),
    ]),
  }),
})

export default legalEn
