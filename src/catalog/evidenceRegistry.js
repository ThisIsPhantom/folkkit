import { BASE58_TEXT_LIMIT, TEXT_LIMIT } from '../runtime/limits'

export const evidenceLimitBytes = Object.freeze({
  'text-5-mib': TEXT_LIMIT,
  'text-64-kib': BASE58_TEXT_LIMIT,
})

function formatEvidence({ formatId, from, to, input, expected, additionalCases = [], inputLimitClass = 'text-5-mib', nameDe, nameEn, descriptionDe, descriptionEn }) {
  return Object.freeze({
    evidenceId: `format:${formatId}`,
    subjectKind: 'format',
    subjectId: formatId,
    formatId,
    executor: 'format-exact',
    from,
    to,
    input,
    expected,
    additionalCases: Object.freeze(additionalCases.map(item => Object.freeze({ ...item }))),
    inputLimitClass,
    category: 'format',
    tier: 'advanced',
    runtimeClass: 'main-thread',
    outputNaming: 'inline-text',
    nameDe,
    nameEn,
    descriptionDe,
    descriptionEn,
  })
}

export const formatEvidenceRegistry = Object.freeze([
  formatEvidence({
    formatId: 'text', from: 'text', to: 'base64', input: 'Folkkit', expected: 'Rm9sa2tpdA==',
    nameDe: 'Text', nameEn: 'Text', descriptionDe: 'Text lokal in ein belegtes Zielformat umwandeln.', descriptionEn: 'Convert text locally to an evidenced target format.',
  }),
  formatEvidence({
    formatId: 'base64', from: 'base64', to: 'text', input: 'Rm9sa2tpdA==', expected: 'Folkkit',
    nameDe: 'Base64', nameEn: 'Base64', descriptionDe: 'Base64 lokal in Text decodieren.', descriptionEn: 'Decode Base64 to text locally.',
  }),
  formatEvidence({
    formatId: 'base58', from: 'text', to: 'base58', input: 'Folkkit', expected: '3fp86L69TR', inputLimitClass: 'text-64-kib',
    additionalCases: [{ from: 'base58', to: 'text', input: '3fp86L69TR', expected: 'Folkkit' }],
    nameDe: 'Base58', nameEn: 'Base58', descriptionDe: 'Base58 bis 64 KiB lokal in Text decodieren.', descriptionEn: 'Decode Base58 up to 64 KiB to text locally.',
  }),
  formatEvidence({
    formatId: 'url', from: 'url', to: 'text', input: 'Folkkit%20lokal', expected: 'Folkkit lokal',
    nameDe: 'URL-Codierung', nameEn: 'URL encoding', descriptionDe: 'Percent-codierten URL-Text lokal decodieren.', descriptionEn: 'Decode percent-encoded URL text locally.',
  }),
  formatEvidence({
    formatId: 'html-ent', from: 'text', to: 'html-ent', input: '<b>&', expected: '&lt;b&gt;&amp;',
    nameDe: 'HTML-Entities', nameEn: 'HTML entities', descriptionDe: 'HTML-Sonderzeichen lokal als Entities codieren.', descriptionEn: 'Encode HTML special characters as entities locally.',
  }),
  formatEvidence({
    formatId: 'hex', from: 'hex', to: 'text', input: '46 6f 6c 6b 6b 69 74', expected: 'Folkkit',
    nameDe: 'Hexadezimal', nameEn: 'Hexadecimal', descriptionDe: 'Hexadezimalwerte lokal in Text decodieren.', descriptionEn: 'Decode hexadecimal values to text locally.',
  }),
  formatEvidence({
    formatId: 'binary', from: 'binary', to: 'text', input: '01000110 01101111 01101100 01101011 01101011 01101001 01110100', expected: 'Folkkit',
    nameDe: 'Binär', nameEn: 'Binary', descriptionDe: 'Binärwerte lokal in Text decodieren.', descriptionEn: 'Decode binary values to text locally.',
  }),
  formatEvidence({
    formatId: 'unicode', from: 'unicode', to: 'text', input: '\\u0046\\u006f\\u006c\\u006b\\u006b\\u0069\\u0074', expected: 'Folkkit',
    nameDe: 'Unicode-Escapes', nameEn: 'Unicode escapes', descriptionDe: 'Unicode-Escape-Sequenzen lokal in Text decodieren.', descriptionEn: 'Decode Unicode escape sequences to text locally.',
  }),
  formatEvidence({
    formatId: 'uppercase', from: 'uppercase', to: 'lowercase', input: 'FOLKKIT', expected: 'folkkit',
    nameDe: 'GROSSBUCHSTABEN', nameEn: 'UPPERCASE', descriptionDe: 'Grossbuchstaben lokal in Kleinbuchstaben umwandeln.', descriptionEn: 'Convert uppercase text to lowercase locally.',
  }),
  formatEvidence({
    formatId: 'lowercase', from: 'lowercase', to: 'uppercase', input: 'folkkit', expected: 'FOLKKIT',
    nameDe: 'kleinbuchstaben', nameEn: 'lowercase', descriptionDe: 'Kleinbuchstaben lokal in Grossbuchstaben umwandeln.', descriptionEn: 'Convert lowercase text to uppercase locally.',
  }),
  formatEvidence({
    formatId: 'json', from: 'json', to: 'json-min', input: '{"name": "Folkkit"}', expected: '{"name":"Folkkit"}',
    nameDe: 'JSON', nameEn: 'JSON', descriptionDe: 'JSON lokal minimieren.', descriptionEn: 'Minify JSON locally.',
  }),
  formatEvidence({
    formatId: 'json-min', from: 'json-min', to: 'json', input: '{"name":"Folkkit"}', expected: '{\n  "name": "Folkkit"\n}',
    nameDe: 'Minimiertes JSON', nameEn: 'Minified JSON', descriptionDe: 'Minimiertes JSON lokal formatieren.', descriptionEn: 'Format minified JSON locally.',
  }),
  formatEvidence({
    formatId: 'decimal', from: 'decimal', to: 'numhex', input: '255', expected: '0xFF',
    nameDe: 'Dezimal', nameEn: 'Decimal', descriptionDe: 'Eine Dezimalzahl lokal in Hexadezimal umwandeln.', descriptionEn: 'Convert a decimal number to hexadecimal locally.',
  }),
  formatEvidence({
    formatId: 'numhex', from: 'numhex', to: 'decimal', input: '0xFF', expected: '255',
    nameDe: 'Hexadezimalzahl', nameEn: 'Hexadecimal number', descriptionDe: 'Eine Hexadezimalzahl lokal in Dezimal umwandeln.', descriptionEn: 'Convert a hexadecimal number to decimal locally.',
  }),
  formatEvidence({
    formatId: 'numbin', from: 'numbin', to: 'decimal', input: '0b1010', expected: '10',
    nameDe: 'Binärzahl', nameEn: 'Binary number', descriptionDe: 'Eine Binärzahl lokal in Dezimal umwandeln.', descriptionEn: 'Convert a binary number to decimal locally.',
  }),
  formatEvidence({
    formatId: 'numoct', from: 'numoct', to: 'decimal', input: '0o10', expected: '8',
    nameDe: 'Oktalzahl', nameEn: 'Octal number', descriptionDe: 'Eine Oktalzahl lokal in Dezimal umwandeln.', descriptionEn: 'Convert an octal number to decimal locally.',
  }),
  formatEvidence({
    formatId: 'color-hex', from: 'color-hex', to: 'color-rgb', input: '#ff0000', expected: 'rgb(255, 0, 0)',
    nameDe: 'Farbe HEX', nameEn: 'Color HEX', descriptionDe: 'Einen HEX-Farbwert lokal in RGB umwandeln.', descriptionEn: 'Convert a HEX color value to RGB locally.',
  }),
  formatEvidence({
    formatId: 'color-rgb', from: 'color-rgb', to: 'color-hex', input: 'rgb(255, 0, 0)', expected: '#ff0000',
    nameDe: 'Farbe RGB', nameEn: 'Color RGB', descriptionDe: 'Einen RGB-Farbwert lokal in HEX umwandeln.', descriptionEn: 'Convert an RGB color value to HEX locally.',
  }),
])

function toolEvidence(subjectId, executor, details = {}) {
  return Object.freeze({
    evidenceId: `tool:${subjectId}`,
    subjectKind: 'tool',
    subjectId,
    executor,
    ...details,
  })
}

const exactToolCases = [
  ['base64-encode', 'Folkkit', 'Rm9sa2tpdA=='],
  ['base64-decode', 'Rm9sa2tpdA==', 'Folkkit'],
  ['url-encode', 'Folkkit & lokal', 'Folkkit%20%26%20lokal'],
  ['url-decode', 'Folkkit%20%26%20lokal', 'Folkkit & lokal'],
  ['html-encode', '<b>&</b>', '&lt;b&gt;&amp;&lt;/b&gt;'],
  ['html-decode', '&lt;b&gt;&amp;&lt;/b&gt;', '<b>&</b>'],
  ['hex-encode', 'Hi', '48 69'],
  ['hex-decode', '48 69', 'Hi'],
  ['binary-encode', 'Hi', '01001000 01101001'],
  ['binary-decode', '01001000 01101001', 'Hi'],
  ['unicode-escape', 'Hi ✓', '\\u0048\\u0069\\u0020\\u2713'],
  ['unicode-unescape', '\\u0048\\u0069', 'Hi'],
  ['rot13', 'Folkkit', 'Sbyxxvg'],
  ['atbash', 'Abc', 'Zyx'],
  ['sha256', 'Folkkit', '9b7c7fc175ad695c18d03e20295ea1b502cab00fc6ef3fb780c4ae512ff62275'],
  ['json-prettify', '{"a":1}', '{\n  "a": 1\n}'],
  ['json-minify', '{ "a": 1 }', '{"a":1}'],
  ['json-escape', 'line\nbreak', '"line\\nbreak"'],
  ['csv-to-json', 'name,age\nAda,36', '[\n  {\n    "name": "Ada",\n    "age": "36"\n  }\n]'],
  ['dec-to-hex', '255', '0xFF'],
  ['hex-to-dec', 'ff', '255'],
  ['dec-to-bin', '10', '0b1010'],
  ['bin-to-dec', '1010', '10'],
  ['dec-to-oct', '8', '0o10'],
  ['oct-to-dec', '10', '8'],
  ['color-convert', '#ff0000', 'HEX:  #ff0000\nRGB:  rgb(255, 0, 0)\nHSL:  hsl(0, 100%, 50%)'],
  ['css-minify', 'body { color: red; }', 'body{color:red}'],
  ['json-validate', '{"ok":true}', 'Valid JSON\n\nType: object\nContent: 1 keys\nSize: 11 chars\nMinified: 11 chars'],
  ['base64url-encode', 'Folkkit', 'Rm9sa2tpdA'],
  ['base64url-decode', 'Rm9sa2tpdA', 'Folkkit'],
  ['slug-gen', 'Hello Folkkit!', 'Hello Folkkit!\n  → hello-folkkit'],
  ['char-count', 'one two', 'Characters:  7\nWords:       2\nLines:       1\nBytes:       7'],
  ['reverse-text', 'Folkkit', 'tikkloF'],
  ['aspect-ratio', '1920x1080', 'Dimensions: 1920 x 1080\nRatio:      16:9\nDecimal:    1.7778\n\nNearest common: 16:9 (Widescreen / HD)\n\n-- Common sizes at this ratio --\n  853 x 480\n  1280 x 720\n  1920 x 1080\n  2560 x 1440\n  3840 x 2160'],
]

const exactToolEvidence = exactToolCases.map(([subjectId, input, expected]) => (
  toolEvidence(subjectId, 'tool-text-cases', { cases: Object.freeze([{ input, expected, match: 'exact' }]) })
))

const percentageEvidence = toolEvidence('percentage-calc', 'tool-text-cases', {
  cases: Object.freeze([
    { input: '15% of 200', expected: '15% of 200 = 30', match: 'exact' },
    { input: '15% von 200', expected: '15% von 200 = 30', match: 'exact' },
  ]),
})

const adviceEvidence = [
  toolEvidence('loan-calc', 'tool-text-cases', {
    cases: Object.freeze([
      { input: '1000 12% 1', expected: 'Monthly payment:  $88.85', match: 'contains' },
      { input: '1000 5% 0', expected: '(invalid values)', match: 'exact' },
      { input: '1000 5% 101', expected: '(invalid values)', match: 'exact' },
      { input: '1000000000001 5% 30', expected: '(invalid values)', match: 'exact' },
      { input: '1000 101% 30', expected: '(invalid values)', match: 'exact' },
      { input: '99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999 5% 30', expected: '(invalid values)', match: 'exact' },
    ]),
  }),
  toolEvidence('bmi-calc', 'tool-text-cases', {
    cases: Object.freeze([{ input: '70kg 175cm', expected: 'BMI:      22.9', match: 'contains' }]),
  }),
]

const contractEvidence = [
  toolEvidence('text-to-qr', 'tool-qr-generate', { input: 'Folkkit evidence', expectedFilename: 'folkkit-qr.svg' }),
  toolEvidence('qr-to-text', 'tool-qr-read', { expected: 'Folkkit QR evidence' }),
  toolEvidence('merge-pdf', 'tool-pdf-behavior', { operation: 'merge' }),
  toolEvidence('pdf-page-count', 'tool-pdf-behavior', { operation: 'page-count' }),
  toolEvidence('pdf-split', 'tool-pdf-behavior', { operation: 'split' }),
  toolEvidence('pdf-extract-range', 'tool-pdf-behavior', { operation: 'extract-range' }),
  toolEvidence('text-to-pdf', 'tool-pdf-behavior', { operation: 'text-to-pdf' }),
  toolEvidence('pdf-metadata', 'tool-pdf-behavior', { operation: 'metadata' }),
  toolEvidence('pdf-rotate', 'tool-pdf-behavior', { operation: 'rotate' }),
]

const browserEvidence = [
  toolEvidence('images-to-pdf', 'browser-e2e'),
  toolEvidence('png-to-jpg', 'browser-e2e'),
  toolEvidence('jpg-to-png', 'browser-e2e'),
  toolEvidence('audio-to-mp3', 'browser-e2e'),
]

export const toolEvidenceRegistry = Object.freeze([
  ...exactToolEvidence,
  percentageEvidence,
  ...adviceEvidence,
  ...contractEvidence,
  ...browserEvidence,
])

export const catalogEvidenceRegistry = Object.freeze([
  ...formatEvidenceRegistry,
  ...toolEvidenceRegistry,
])

export const releasedFormatIds = Object.freeze(formatEvidenceRegistry.map(evidence => evidence.formatId))

export const releasedFormatPairs = Object.freeze(formatEvidenceRegistry.flatMap(evidence => [
  Object.freeze({
    evidenceId: evidence.evidenceId,
    from: evidence.from,
    to: evidence.to,
    inputLimitClass: evidence.inputLimitClass,
  }),
  ...evidence.additionalCases.map((fixture, index) => Object.freeze({
    evidenceId: `${evidence.evidenceId}:${index + 2}`,
    from: fixture.from,
    to: fixture.to,
    inputLimitClass: evidence.inputLimitClass,
  })),
]))

const releasedFormatPairKeys = new Set(releasedFormatPairs.map(pair => `${pair.from}→${pair.to}`))

export function getFormatEvidence(formatId) {
  return formatEvidenceRegistry.find(evidence => evidence.formatId === formatId) || null
}

export function isReleasedFormatPair(from, to) {
  return typeof from === 'string'
    && typeof to === 'string'
    && releasedFormatPairKeys.has(`${from}→${to}`)
}

export function getReleasedEvidenceTargets(from) {
  if (typeof from !== 'string') return []
  return releasedFormatPairs.filter(pair => pair.from === from).map(pair => pair.to)
}

export function getFormatPairTextLimit(from, to) {
  if (!isReleasedFormatPair(from, to)) return null
  const fromEvidence = getFormatEvidence(from)
  const toEvidence = getFormatEvidence(to)
  const fromLimit = evidenceLimitBytes[fromEvidence?.inputLimitClass] || evidenceLimitBytes['text-5-mib']
  const toLimit = evidenceLimitBytes[toEvidence?.inputLimitClass] || evidenceLimitBytes['text-5-mib']
  return Math.min(fromLimit, toLimit)
}
