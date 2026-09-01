// Format definitions and conversion graph
// This powers the "Apple Translate" style UI where you pick From → To
import { objToYaml, yamlToJson, parseToml } from './utils/parsers'
import { hexToRgb, rgbToHsl, hslToRgb, parseRgb, parseHsl, rgbToHsv, hsvToRgb, parseHsv } from './utils/color'
import { getReleasedEvidenceTargets, releasedFormatIds } from './catalog/evidenceRegistry'

export const formats = [
  { id: 'text', name: 'Text', group: 'Text', placeholder: 'Type or paste text...' },
  { id: 'base64', name: 'Base64', group: 'Text', placeholder: 'SGVsbG8gV29ybGQ=' },
  { id: 'base32', name: 'Base32', group: 'Text', placeholder: 'JBSWY3DPEBLW64TMMQ======' },
  { id: 'base58', name: 'Base58', group: 'Text', placeholder: 'StV1DL6CwTryKyV' },
  { id: 'url', name: 'URL Encoded', group: 'Text', placeholder: 'hello%20world' },
  { id: 'html-ent', name: 'HTML Entities', group: 'Text', placeholder: '&lt;div&gt;hello&lt;/div&gt;' },
  { id: 'hex', name: 'Hex', group: 'Text', placeholder: '48 65 6c 6c 6f' },
  { id: 'binary', name: 'Binary', group: 'Text', placeholder: '01001000 01100101 01101100 01101100 01101111' },
  { id: 'unicode', name: 'Unicode Escaped', group: 'Text', placeholder: '\\u0048\\u0065\\u006c\\u006c\\u006f' },
  { id: 'morse', name: 'Morse Code', group: 'Text', placeholder: '.... . .-.. .-.. ---' },
  { id: 'nato', name: 'NATO Phonetic', group: 'Text', placeholder: 'Alfa Bravo Charlie' },
  { id: 'rot13', name: 'ROT13', group: 'Text', placeholder: 'Uryyb Jbeyq' },
  { id: 'reverse', name: 'Reversed', group: 'Text', placeholder: 'dlroW olleH' },
  { id: 'json-escaped', name: 'JSON String', group: 'Text', placeholder: '"Hello\\nWorld\\t\\"quoted\\"" ' },
  { id: 'uppercase', name: 'UPPERCASE', group: 'Case', placeholder: 'HELLO WORLD' },
  { id: 'lowercase', name: 'lowercase', group: 'Case', placeholder: 'hello world' },
  { id: 'titlecase', name: 'Title Case', group: 'Case', placeholder: 'Hello World' },
  { id: 'camelcase', name: 'camelCase', group: 'Case', placeholder: 'helloWorld' },
  { id: 'snakecase', name: 'snake_case', group: 'Case', placeholder: 'hello_world' },
  { id: 'kebabcase', name: 'kebab-case', group: 'Case', placeholder: 'hello-world' },
  { id: 'markdown', name: 'Markdown', group: 'Markup', placeholder: '# Hello **world**' },
  { id: 'html-markup', name: 'HTML', group: 'Markup', placeholder: '<h1>Hello <strong>world</strong></h1>' },
  { id: 'plain', name: 'Plain Text', group: 'Markup', placeholder: 'Hello world' },
  { id: 'json', name: 'JSON', group: 'Data', placeholder: '{"key": "value"}' },
  { id: 'json-min', name: 'JSON Minified', group: 'Data', placeholder: '{"key":"value"}' },
  { id: 'yaml', name: 'YAML', group: 'Data', placeholder: 'key: value\nitems:\n  - one\n  - two' },
  { id: 'csv', name: 'CSV', group: 'Data', placeholder: 'name,age\nAlice,30\nBob,25' },
  { id: 'tsv', name: 'TSV', group: 'Data', placeholder: 'name\tage\nAlice\t30\nBob\t25' },
  { id: 'xml', name: 'XML', group: 'Data', placeholder: '<root><item>hello</item></root>' },
  { id: 'querystring', name: 'Query String', group: 'Data', placeholder: 'key=value&foo=bar' },
  { id: 'toml', name: 'TOML', group: 'Data', placeholder: 'key = "value"\n[section]\nname = "test"' },
  { id: 'timestamp', name: 'Unix Timestamp', group: 'Time', placeholder: '1700000000' },
  { id: 'iso-date', name: 'ISO 8601', group: 'Time', placeholder: '2024-01-15T12:00:00Z' },
  { id: 'human-date', name: 'Human Date', group: 'Time', placeholder: 'Mon, 15 Jan 2024 12:00:00 GMT' },
  { id: 'sha1', name: 'SHA-1 Hash', group: 'Hash' },
  { id: 'sha256', name: 'SHA-256 Hash', group: 'Hash' },
  { id: 'sha384', name: 'SHA-384 Hash', group: 'Hash' },
  { id: 'sha512', name: 'SHA-512 Hash', group: 'Hash' },
  { id: 'md5', name: 'MD5 Hash', group: 'Hash' },
  { id: 'decimal', name: 'Decimal', group: 'Number', placeholder: '255' },
  { id: 'numhex', name: 'Hexadecimal', group: 'Number', placeholder: '0xFF' },
  { id: 'numbin', name: 'Binary (Num)', group: 'Number', placeholder: '0b11111111' },
  { id: 'numoct', name: 'Octal', group: 'Number', placeholder: '0o377' },
  { id: 'roman', name: 'Roman Numeral', group: 'Number', placeholder: 'CCLV' },
  { id: 'bits', name: 'Bits', group: 'Data Size', placeholder: '8388608' },
  { id: 'bytes', name: 'Bytes', group: 'Data Size', placeholder: '1048576' },
  { id: 'kilobytes', name: 'Kilobytes', group: 'Data Size', placeholder: '1024' },
  { id: 'megabytes', name: 'Megabytes', group: 'Data Size', placeholder: '1' },
  { id: 'gigabytes', name: 'Gigabytes', group: 'Data Size', placeholder: '0.5' },
  { id: 'kib', name: 'Kibibytes (KiB)', group: 'Data Size', placeholder: '1000' },
  { id: 'mib', name: 'Mebibytes (MiB)', group: 'Data Size', placeholder: '0.977' },
  { id: 'gib', name: 'Gibibytes (GiB)', group: 'Data Size', placeholder: '0.00095' },
  { id: 'celsius', name: 'Celsius', group: 'Temperature', placeholder: '100' },
  { id: 'fahrenheit', name: 'Fahrenheit', group: 'Temperature', placeholder: '212' },
  { id: 'kelvin', name: 'Kelvin', group: 'Temperature', placeholder: '373.15' },
  { id: 'inches', name: 'Inches', group: 'Length', placeholder: '12' },
  { id: 'cm', name: 'Centimeters', group: 'Length', placeholder: '30.48' },
  { id: 'mm', name: 'Millimeters', group: 'Length', placeholder: '304.8' },
  { id: 'feet', name: 'Feet', group: 'Length', placeholder: '1' },
  { id: 'meters', name: 'Meters', group: 'Length', placeholder: '0.3048' },
  { id: 'miles', name: 'Miles', group: 'Distance', placeholder: '1' },
  { id: 'km', name: 'Kilometers', group: 'Distance', placeholder: '1.609' },
  { id: 'yards', name: 'Yards', group: 'Distance', placeholder: '1760' },
  { id: 'nautmiles', name: 'Nautical Miles', group: 'Distance', placeholder: '0.8684' },
  { id: 'kg', name: 'Kilograms', group: 'Weight', placeholder: '1' },
  { id: 'lb', name: 'Pounds', group: 'Weight', placeholder: '2.205' },
  { id: 'oz', name: 'Ounces', group: 'Weight', placeholder: '35.274' },
  { id: 'grams', name: 'Grams', group: 'Weight', placeholder: '1000' },
  { id: 'ton-metric', name: 'Tonnes (metric)', group: 'Weight', placeholder: '0.001' },
  { id: 'ton-short', name: 'Short Tons (US)', group: 'Weight', placeholder: '0.0011' },
  { id: 'stone', name: 'Stones', group: 'Weight', placeholder: '0.1575' },
  { id: 'mph', name: 'Miles/hour', group: 'Speed', placeholder: '60' },
  { id: 'kmh', name: 'km/hour', group: 'Speed', placeholder: '96.56' },
  { id: 'ms', name: 'Meters/sec', group: 'Speed', placeholder: '26.82' },
  { id: 'knots', name: 'Knots', group: 'Speed', placeholder: '52.14' },
  { id: 'sqft', name: 'Square Feet', group: 'Area', placeholder: '100' },
  { id: 'sqm', name: 'Square Meters', group: 'Area', placeholder: '9.29' },
  { id: 'acres', name: 'Acres', group: 'Area', placeholder: '1' },
  { id: 'hectares', name: 'Hectares', group: 'Area', placeholder: '0.4047' },
  { id: 'liters', name: 'Liters', group: 'Volume', placeholder: '1' },
  { id: 'gallons', name: 'Gallons (US)', group: 'Volume', placeholder: '0.2642' },
  { id: 'ml', name: 'Milliliters', group: 'Volume', placeholder: '1000' },
  { id: 'floz', name: 'Fluid Ounces', group: 'Volume', placeholder: '33.814' },
  { id: 'cups', name: 'Cups', group: 'Volume', placeholder: '4.227' },
  { id: 'dur-seconds', name: 'Seconds', group: 'Duration', placeholder: '3600' },
  { id: 'dur-minutes', name: 'Minutes', group: 'Duration', placeholder: '60' },
  { id: 'dur-hours', name: 'Hours', group: 'Duration', placeholder: '1' },
  { id: 'dur-days', name: 'Days', group: 'Duration', placeholder: '0.0417' },
  { id: 'joules', name: 'Joules', group: 'Energy', placeholder: '1000' },
  { id: 'calories', name: 'Calories', group: 'Energy', placeholder: '239.006' },
  { id: 'kcal', name: 'Kilocalories', group: 'Energy', placeholder: '0.239' },
  { id: 'kwh', name: 'Kilowatt-hours', group: 'Energy', placeholder: '0.000278' },
  { id: 'btu', name: 'BTU', group: 'Energy', placeholder: '0.9478' },
  { id: 'psi', name: 'PSI', group: 'Pressure', placeholder: '14.696' },
  { id: 'bar', name: 'Bar', group: 'Pressure', placeholder: '1.01325' },
  { id: 'atm', name: 'Atmospheres', group: 'Pressure', placeholder: '1' },
  { id: 'pascal', name: 'Pascals', group: 'Pressure', placeholder: '101325' },
  { id: 'mmhg', name: 'mmHg', group: 'Pressure', placeholder: '760' },
  { id: 'degrees', name: 'Degrees', group: 'Angle', placeholder: '180' },
  { id: 'radians', name: 'Radians', group: 'Angle', placeholder: '3.14159' },
  { id: 'gradians', name: 'Gradians', group: 'Angle', placeholder: '200' },
  { id: 'terabytes', name: 'Terabytes', group: 'Data Size', placeholder: '0.001' },
  { id: 'petabytes', name: 'Petabytes', group: 'Data Size', placeholder: '0.000001' },
  { id: 'hz', name: 'Hertz', group: 'Frequency', placeholder: '1000' },
  { id: 'khz', name: 'Kilohertz', group: 'Frequency', placeholder: '1' },
  { id: 'mhz', name: 'Megahertz', group: 'Frequency', placeholder: '0.001' },
  { id: 'ghz', name: 'Gigahertz', group: 'Frequency', placeholder: '0.000001' },
  { id: 'watts', name: 'Watts', group: 'Power', placeholder: '1000' },
  { id: 'kilowatts', name: 'Kilowatts', group: 'Power', placeholder: '1' },
  { id: 'horsepower', name: 'Horsepower', group: 'Power', placeholder: '1.341' },
  { id: 'btuh', name: 'BTU/hour', group: 'Power', placeholder: '3412.14' },
  { id: 'mpg', name: 'Miles/gallon', group: 'Fuel Economy', placeholder: '30' },
  { id: 'kml', name: 'km/Liter', group: 'Fuel Economy', placeholder: '12.75' },
  { id: 'l100km', name: 'L/100km', group: 'Fuel Economy', placeholder: '7.84' },
  { id: 'bps', name: 'Bits/sec', group: 'Data Rate', placeholder: '1000000' },
  { id: 'kbps', name: 'Kbps', group: 'Data Rate', placeholder: '1000' },
  { id: 'mbps', name: 'Mbps', group: 'Data Rate', placeholder: '1' },
  { id: 'gbps', name: 'Gbps', group: 'Data Rate', placeholder: '0.001' },
  { id: 'tsp', name: 'Teaspoons', group: 'Cooking', placeholder: '3' },
  { id: 'tbsp', name: 'Tablespoons', group: 'Cooking', placeholder: '1' },
  { id: 'cup-cook', name: 'Cups (US)', group: 'Cooking', placeholder: '0.0625' },
  { id: 'braille', name: 'Braille', group: 'Text', placeholder: '⠓⠑⠇⠇⠕' },
  { id: 'piglatin', name: 'Pig Latin', group: 'Text', placeholder: 'ellohay orldway' },
  { id: 'leetspeak', name: 'Leet Speak', group: 'Text', placeholder: 'h3ll0 w0rld' },
  { id: 'base64url', name: 'Base64 URL', group: 'Text', placeholder: 'SGVsbG8gV29ybGQ' },
  { id: 'atbash', name: 'Atbash', group: 'Text', placeholder: 'Svool Dliow' },
  { id: 'rankine', name: 'Rankine', group: 'Temperature', placeholder: '671.67' },
  { id: 'turns', name: 'Turns', group: 'Angle', placeholder: '0.5' },
  { id: 'tbps', name: 'Tbps', group: 'Data Rate', placeholder: '0.000001' },
  { id: 'color-hex', name: 'Color HEX', group: 'Color', placeholder: '#ff6b35' },
  { id: 'color-rgb', name: 'Color RGB', group: 'Color', placeholder: 'rgb(255, 107, 53)' },
  { id: 'color-hsl', name: 'Color HSL', group: 'Color', placeholder: 'hsl(16, 100%, 60%)' },
  { id: 'color-hsv', name: 'Color HSV', group: 'Color', placeholder: 'hsv(16, 79%, 100%)' },
  { id: 'color-cmyk', name: 'Color CMYK', group: 'Color', placeholder: 'cmyk(0%, 58%, 79%, 0%)' },
  { id: 'pint-cook', name: 'Pints (US)', group: 'Cooking', placeholder: '0.03125' },
  { id: 'qt-cook', name: 'Quarts (US)', group: 'Cooking', placeholder: '0.015625' },
  { id: 'floz-cook', name: 'Fluid Oz (US)', group: 'Cooking', placeholder: '0.5' },
  { id: 'dur-ms', name: 'Milliseconds', group: 'Duration', placeholder: '3600000' },
  { id: 'dur-weeks', name: 'Weeks', group: 'Duration', placeholder: '0.006' },
  { id: 'dur-us', name: 'Microseconds', group: 'Duration', placeholder: '3600000000' },
  { id: 'dur-ns', name: 'Nanoseconds', group: 'Duration', placeholder: '3.6e12' },
  { id: 'dur-months', name: 'Months', group: 'Duration', placeholder: '0.00137' },
  { id: 'dur-years', name: 'Years', group: 'Duration', placeholder: '0.000114' },
  { id: 'megajoules', name: 'Megajoules', group: 'Energy', placeholder: '0.001' },
  { id: 'fps', name: 'Feet/sec', group: 'Speed', placeholder: '88' },
  { id: 'mach', name: 'Mach', group: 'Speed', placeholder: '0.0767' },
  { id: 'micrometers', name: 'Micrometers', group: 'Length', placeholder: '304800' },
  { id: 'nanometers', name: 'Nanometers', group: 'Length', placeholder: '304800000' },
  { id: 'light-year', name: 'Light Years', group: 'Distance', placeholder: '1' },
  { id: 'au', name: 'Astronomical Units', group: 'Distance', placeholder: '63241' },
  { id: 'gallon-us', name: 'Gallons (US)', group: 'Cooking', placeholder: '1' },
  { id: 'milligrams', name: 'Milligrams', group: 'Weight', placeholder: '453592' },
  { id: 'micrograms', name: 'Micrograms', group: 'Weight', placeholder: '453592000' },
  { id: 'carats', name: 'Carats', group: 'Weight', placeholder: '5000' },
  { id: 'btu-per-hr', name: 'BTU/hour', group: 'Power', placeholder: '3412' },
  { id: 'calories-per-sec', name: 'cal/sec', group: 'Power', placeholder: '239' },
  { id: 'rpm', name: 'RPM', group: 'Frequency', placeholder: '60' },
  { id: 'radians-per-sec', name: 'Radians/sec (ω)', group: 'Frequency', placeholder: '6.2832' },
  { id: 'troy-oz', name: 'Troy Ounce', group: 'Weight', placeholder: '32.15' },
  { id: 'sqkm', name: 'Square Kilometers', group: 'Area', placeholder: '1' },
  { id: 'sqmiles', name: 'Square Miles', group: 'Area', placeholder: '0.3861' },
  { id: 'sqinches', name: 'Square Inches', group: 'Area', placeholder: '1550' },
  { id: 'sqcm', name: 'Square Centimeters', group: 'Area', placeholder: '92.9' },
  { id: 'kpa', name: 'Kilopascals (kPa)', group: 'Pressure', placeholder: '101.325' },
  { id: 'hpa', name: 'Hectopascals (hPa)', group: 'Pressure', placeholder: '1013.25' },
  { id: 'arcminutes', name: 'Arcminutes', group: 'Angle', placeholder: '10800' },
  { id: 'arcseconds', name: 'Arcseconds', group: 'Angle', placeholder: '648000' },
  { id: 'cubic-m', name: 'Cubic Meters', group: 'Volume', placeholder: '0.001' },
  { id: 'cubic-ft', name: 'Cubic Feet', group: 'Volume', placeholder: '0.0353' },
  { id: 'newtons', name: 'Newtons', group: 'Force', placeholder: '9.807' },
  { id: 'pound-force', name: 'Pound-force (lbf)', group: 'Force', placeholder: '2.205' },
  { id: 'kg-force', name: 'Kilogram-force (kgf)', group: 'Force', placeholder: '1' },
  { id: 'dyne', name: 'Dyne', group: 'Force', placeholder: '980665' },
  { id: 'kilonewtons', name: 'Kilonewtons', group: 'Force', placeholder: '0.009807' },
  { id: 'lux', name: 'Lux', group: 'Illuminance', placeholder: '500' },
  { id: 'foot-candle', name: 'Foot-candle', group: 'Illuminance', placeholder: '46.45' },
  { id: 'millilux', name: 'Millilux', group: 'Illuminance', placeholder: '500000' },
  { id: 'pt', name: 'Points (pt)', group: 'Typography', placeholder: '72' },
  { id: 'pica', name: 'Picas', group: 'Typography', placeholder: '6' },
  { id: 'px', name: 'Pixels (96 DPI)', group: 'Typography', placeholder: '96' },
  // Density group
  { id: 'kgm3', name: 'kg/m³', group: 'Density', placeholder: '1000' },
  { id: 'gcm3', name: 'g/cm³', group: 'Density', placeholder: '1' },
  { id: 'lbft3', name: 'lb/ft³', group: 'Density', placeholder: '62.43' },
  { id: 'lbgal', name: 'lb/gal (US)', group: 'Density', placeholder: '8.34' },
  // Electric Current group
  { id: 'ampere', name: 'Amperes (A)', group: 'Electric', placeholder: '1' },
  { id: 'milliamp', name: 'Milliamperes (mA)', group: 'Electric', placeholder: '1000' },
  { id: 'microamp', name: 'Microamperes (μA)', group: 'Electric', placeholder: '1000000' },
  { id: 'kiloamp', name: 'Kiloamperes (kA)', group: 'Electric', placeholder: '0.001' },
  // Voltage group
  { id: 'volt', name: 'Volts (V)', group: 'Voltage', placeholder: '120' },
  { id: 'millivolt', name: 'Millivolts (mV)', group: 'Voltage', placeholder: '120000' },
  { id: 'kilovolt', name: 'Kilovolts (kV)', group: 'Voltage', placeholder: '0.12' },
  { id: 'microvolt', name: 'Microvolts (μV)', group: 'Voltage', placeholder: '120000000' },
  // Resistance group
  { id: 'ohm', name: 'Ohms (Ω)', group: 'Resistance', placeholder: '1000' },
  { id: 'kilohm', name: 'Kilohms (kΩ)', group: 'Resistance', placeholder: '1' },
  { id: 'megohm', name: 'Megohms (MΩ)', group: 'Resistance', placeholder: '0.001' },
  { id: 'milliohm', name: 'Milliohms (mΩ)', group: 'Resistance', placeholder: '1000000' },
  // Acceleration group
  { id: 'ms2', name: 'm/s²', group: 'Acceleration', placeholder: '9.81' },
  { id: 'gforce', name: 'g-force', group: 'Acceleration', placeholder: '1' },
  { id: 'fts2', name: 'ft/s²', group: 'Acceleration', placeholder: '32.17' },
  { id: 'cms2', name: 'cm/s² (Gal)', group: 'Acceleration', placeholder: '981' },
  // Torque group
  { id: 'nm-torque', name: 'Newton-meters (N·m)', group: 'Torque', placeholder: '100' },
  { id: 'lb-ft', name: 'Pound-feet (lb·ft)', group: 'Torque', placeholder: '73.76' },
  { id: 'lb-in', name: 'Pound-inches (lb·in)', group: 'Torque', placeholder: '885.1' },
  { id: 'kg-cm', name: 'Kilogram-cm (kg·cm)', group: 'Torque', placeholder: '1019.7' },
  // Force
  { id: 'newton', name: 'Newtons (N)', group: 'Force', placeholder: '9.81' },
  { id: 'kilonewton', name: 'Kilonewtons (kN)', group: 'Force', placeholder: '0.00981' },
  { id: 'kgforce', name: 'Kilogram-force (kgf)', group: 'Force', placeholder: '1' },
  // Illuminance
  { id: 'footcandle', name: 'Footcandle (fc)', group: 'Illuminance', placeholder: '46.45' },
  { id: 'phot', name: 'Phot (ph)', group: 'Illuminance', placeholder: '0.05' },
  { id: 'nox', name: 'Nox (nx)', group: 'Illuminance', placeholder: '500000' },
  // Capacitance
  { id: 'farad', name: 'Farad (F)', group: 'Capacitance', placeholder: '0.000001' },
  { id: 'microfarad', name: 'Microfarad (μF)', group: 'Capacitance', placeholder: '1' },
  { id: 'nanofarad', name: 'Nanofarad (nF)', group: 'Capacitance', placeholder: '1000' },
  { id: 'picofarad', name: 'Picofarad (pF)', group: 'Capacitance', placeholder: '1000000' },
  // Frequency extended
  { id: 'terahertz', name: 'Terahertz (THz)', group: 'Frequency', placeholder: '0.001' },
  { id: 'gigahertz', name: 'Gigahertz (GHz)', group: 'Frequency', placeholder: '1' },
  // Number ratios
  { id: 'percent', name: 'Percent (%)', group: 'Number', placeholder: '75' },
  { id: 'decimal-frac', name: 'Decimal Fraction', group: 'Number', placeholder: '0.75' },
  { id: 'ppm', name: 'Parts per Million (ppm)', group: 'Number', placeholder: '750000' },
  { id: 'ppb', name: 'Parts per Billion (ppb)', group: 'Number', placeholder: '750000000' },
  // Typography / Print units
  { id: 'pt-type', name: 'Point (pt)', group: 'Typography', placeholder: '72' },
  { id: 'screen-px', name: 'Screen Pixel (96 DPI)', group: 'Typography', placeholder: '96' },
  { id: 'twip', name: 'Twip (1/1440 in)', group: 'Typography', placeholder: '1440' },
]

const releasedFormatIdSet = new Set(releasedFormatIds)

// Raw formats remain preserved; only independently evidenced formats are exposed.
export const releasedFormats = formats.filter(format => releasedFormatIdSet.has(format.id))

// Hash helper
async function digest(algo, input) {
  const data = new TextEncoder().encode(input)
  const buf = await crypto.subtle.digest(algo, data)
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

// Color helpers

// Base58 helpers (Bitcoin alphabet)
const B58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
function textToBase58(input) {
  const bytes = new TextEncoder().encode(input)
  let num = 0n
  for (const b of bytes) num = num * 256n + BigInt(b)
  let result = ''
  while (num > 0n) { result = B58_ALPHABET[Number(num % 58n)] + result; num /= 58n }
  for (const b of bytes) { if (b === 0) result = '1' + result; else break }
  return result || '1'
}
function base58ToText(input) {
  const s = input.trim()
  let num = 0n
  for (const c of s) { const i = B58_ALPHABET.indexOf(c); if (i < 0) throw new Error('bad char'); num = num * 58n + BigInt(i) }
  const hex = num.toString(16).padStart(2, '0')
  const bytes = hex.match(/.{2}/g).map(h => parseInt(h, 16))
  let leadingZeros = 0
  for (const c of s) { if (c === '1') leadingZeros++; else break }
  const result = new Uint8Array([...Array(leadingZeros).fill(0), ...bytes])
  return new TextDecoder().decode(result)
}

// Braille encoding (Grade 1 — letters, digits, basic punctuation)
const brailleMap = {
  'a': '⠁','b': '⠃','c': '⠉','d': '⠙','e': '⠑','f': '⠋','g': '⠛','h': '⠓','i': '⠊','j': '⠚',
  'k': '⠅','l': '⠇','m': '⠍','n': '⠝','o': '⠕','p': '⠏','q': '⠟','r': '⠗','s': '⠎','t': '⠞',
  'u': '⠥','v': '⠧','w': '⠺','x': '⠭','y': '⠽','z': '⠵',
  '1': '⠼⠁','2': '⠼⠃','3': '⠼⠉','4': '⠼⠙','5': '⠼⠑',
  '6': '⠼⠋','7': '⠼⠛','8': '⠼⠓','9': '⠼⠊','0': '⠼⠚',
  ' ': ' ','.': '⠲',',': '⠂','?': '⠦','!': '⠖',';': '⠆',':': '⠒',
  '-': '⠤',"'": '⠄','"': '⠦','/': '⠌','(': '⠐⠣',')': '⠐⠜',
}
const brailleRev = {}
for (const [k, v] of Object.entries(brailleMap)) {
  if (!brailleRev[v]) brailleRev[v] = k
}

function textToBraille(input) {
  let result = ''
  for (const ch of input.toLowerCase()) {
    result += brailleMap[ch] || ch
  }
  return result
}

function brailleToText(input) {
  let result = ''
  let i = 0
  const chars = Array.from(input)
  while (i < chars.length) {
    // check 2-char braille sequences (number indicator, parentheses)
    if (i + 1 < chars.length) {
      const two = chars[i] + chars[i + 1]
      if (brailleRev[two]) { result += brailleRev[two]; i += 2; continue }
    }
    const one = chars[i]
    result += brailleRev[one] || one
    i++
  }
  return result
}

// Pig Latin converter
function textToPigLatin(input) {
  return input.replace(/\b([a-zA-Z]+)\b/g, (word) => {
    const lower = word.toLowerCase()
    const isUpper = word[0] === word[0].toUpperCase()
    const vowels = 'aeiou'
    let result
    if (vowels.includes(lower[0])) {
      result = lower + 'yay'
    } else {
      let consonantCluster = 0
      while (consonantCluster < lower.length && !vowels.includes(lower[consonantCluster])) consonantCluster++
      result = lower.slice(consonantCluster) + lower.slice(0, consonantCluster) + 'ay'
    }
    return isUpper ? result.charAt(0).toUpperCase() + result.slice(1) : result
  })
}

function pigLatinToText(input) {
  return input.replace(/\b([a-zA-Z]+)\b/g, (word) => {
    const lower = word.toLowerCase()
    const isUpper = word[0] === word[0].toUpperCase()
    let result
    if (lower.endsWith('yay')) {
      result = lower.slice(0, -3)
    } else if (lower.endsWith('ay')) {
      const base = lower.slice(0, -2)
      // find the original consonant cluster at the end
      const vowels = 'aeiou'
      let splitIdx = base.length
      for (let j = base.length - 1; j >= 0; j--) {
        if (vowels.includes(base[j])) break
        splitIdx = j
      }
      result = base.slice(splitIdx) + base.slice(0, splitIdx)
    } else {
      result = lower
    }
    return isUpper ? result.charAt(0).toUpperCase() + result.slice(1) : result
  })
}

// Leet speak
const leetMap = { 'a': '4', 'e': '3', 'i': '1', 'o': '0', 's': '5', 't': '7', 'b': '8', 'g': '9', 'l': '|' }
const leetRev = Object.fromEntries(Object.entries(leetMap).map(([k, v]) => [v, k]))

// Simple MD5 implementation
function md5(input) {
  const bytes = new TextEncoder().encode(input)
  function md5cycle(x, k) {
    let a = x[0], b = x[1], c = x[2], d = x[3]
    const ff = (a,b,c,d,k,s,t) => { a = add32(add32(a, (b&c)|(~b&d)), add32(k, t)); return add32((a<<s)|(a>>>(32-s)), b) }
    const gg = (a,b,c,d,k,s,t) => { a = add32(add32(a, (b&d)|(c&~d)), add32(k, t)); return add32((a<<s)|(a>>>(32-s)), b) }
    const hh = (a,b,c,d,k,s,t) => { a = add32(add32(a, b^c^d), add32(k, t)); return add32((a<<s)|(a>>>(32-s)), b) }
    const ii = (a,b,c,d,k,s,t) => { a = add32(add32(a, c^(b|~d)), add32(k, t)); return add32((a<<s)|(a>>>(32-s)), b) }
    a=ff(a,b,c,d,k[0],7,-680876936);d=ff(d,a,b,c,k[1],12,-389564586);c=ff(c,d,a,b,k[2],17,606105819);b=ff(b,c,d,a,k[3],22,-1044525330)
    a=ff(a,b,c,d,k[4],7,-176418897);d=ff(d,a,b,c,k[5],12,1200080426);c=ff(c,d,a,b,k[6],17,-1473231341);b=ff(b,c,d,a,k[7],22,-45705983)
    a=ff(a,b,c,d,k[8],7,1770035416);d=ff(d,a,b,c,k[9],12,-1958414417);c=ff(c,d,a,b,k[10],17,-42063);b=ff(b,c,d,a,k[11],22,-1990404162)
    a=ff(a,b,c,d,k[12],7,1804603682);d=ff(d,a,b,c,k[13],12,-40341101);c=ff(c,d,a,b,k[14],17,-1502002290);b=ff(b,c,d,a,k[15],22,1236535329)
    a=gg(a,b,c,d,k[1],5,-165796510);d=gg(d,a,b,c,k[6],9,-1069501632);c=gg(c,d,a,b,k[11],14,643717713);b=gg(b,c,d,a,k[0],20,-373897302)
    a=gg(a,b,c,d,k[5],5,-701558691);d=gg(d,a,b,c,k[10],9,38016083);c=gg(c,d,a,b,k[15],14,-660478335);b=gg(b,c,d,a,k[4],20,-405537848)
    a=gg(a,b,c,d,k[9],5,568446438);d=gg(d,a,b,c,k[14],9,-1019803690);c=gg(c,d,a,b,k[3],14,-187363961);b=gg(b,c,d,a,k[8],20,1163531501)
    a=gg(a,b,c,d,k[13],5,-1444681467);d=gg(d,a,b,c,k[2],9,-51403784);c=gg(c,d,a,b,k[7],14,1735328473);b=gg(b,c,d,a,k[12],20,-1926607734)
    a=hh(a,b,c,d,k[5],4,-378558);d=hh(d,a,b,c,k[8],11,-2022574463);c=hh(c,d,a,b,k[11],16,1839030562);b=hh(b,c,d,a,k[14],23,-35309556)
    a=hh(a,b,c,d,k[1],4,-1530992060);d=hh(d,a,b,c,k[4],11,1272893353);c=hh(c,d,a,b,k[7],16,-155497632);b=hh(b,c,d,a,k[10],23,-1094730640)
    a=hh(a,b,c,d,k[13],4,681279174);d=hh(d,a,b,c,k[0],11,-358537222);c=hh(c,d,a,b,k[3],16,-722521979);b=hh(b,c,d,a,k[6],23,76029189)
    a=hh(a,b,c,d,k[9],4,-640364487);d=hh(d,a,b,c,k[12],11,-421815835);c=hh(c,d,a,b,k[15],16,530742520);b=hh(b,c,d,a,k[2],23,-995338651)
    a=ii(a,b,c,d,k[0],6,-198630844);d=ii(d,a,b,c,k[7],10,1126891415);c=ii(c,d,a,b,k[14],15,-1416354905);b=ii(b,c,d,a,k[5],21,-57434055)
    a=ii(a,b,c,d,k[12],6,1700485571);d=ii(d,a,b,c,k[3],10,-1894986606);c=ii(c,d,a,b,k[10],15,-1051523);b=ii(b,c,d,a,k[1],21,-2054922799)
    a=ii(a,b,c,d,k[8],6,1873313359);d=ii(d,a,b,c,k[15],10,-30611744);c=ii(c,d,a,b,k[6],15,-1560198380);b=ii(b,c,d,a,k[13],21,1309151649)
    a=ii(a,b,c,d,k[4],6,-145523070);d=ii(d,a,b,c,k[11],10,-1120210379);c=ii(c,d,a,b,k[2],15,718787259);b=ii(b,c,d,a,k[9],21,-343485551)
    x[0]=add32(a,x[0]);x[1]=add32(b,x[1]);x[2]=add32(c,x[2]);x[3]=add32(d,x[3])
  }
  function add32(a, b) { return (a + b) & 0xFFFFFFFF }
  function md5blk(s) { const md5blks = []; for (let i = 0; i < 64; i += 4) md5blks[i >> 2] = s[i] + (s[i+1] << 8) + (s[i+2] << 16) + (s[i+3] << 24); return md5blks }
  const n = bytes.length
  let tail = [128], i = n + 1
  while (i % 64 !== 56) { tail.push(0); i++ }
  const state = [1732584193, -271733879, -1732584194, 271733878]
  const all = new Uint8Array(n + tail.length + 8)
  all.set(bytes); all.set(tail, n)
  const bits = n * 8
  all[all.length - 8] = bits & 0xff; all[all.length - 7] = (bits >> 8) & 0xff
  all[all.length - 6] = (bits >> 16) & 0xff; all[all.length - 5] = (bits >> 24) & 0xff
  for (let j = 0; j < all.length; j += 64) md5cycle(state, md5blk(all.slice(j, j + 64)))
  return state.map(s => {
    let h = ''
    for (let i = 0; i < 4; i++) h += ((s >> (i * 8)) & 0xFF).toString(16).padStart(2, '0')
    return h
  }).join('')
}

// Roman numeral helpers
function decToRoman(num) {
  const vals = [[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']]
  let r = ''
  for (const [v, s] of vals) { while (num >= v) { r += s; num -= v } }
  return r
}
function romanToDec(s) {
  const map = { I:1, V:5, X:10, L:50, C:100, D:500, M:1000 }
  let result = 0
  const upper = s.trim().toUpperCase()
  for (let i = 0; i < upper.length; i++) {
    const cur = map[upper[i]]
    if (!cur) throw new Error('invalid roman numeral')
    const next = map[upper[i + 1]] || 0
    if (cur < next) result -= cur; else result += cur
  }
  return result
}

function jsonToYaml(json) {
  const obj = JSON.parse(json)
  return objToYaml(obj, 0)
}

// Morse maps
const morseEnc = { A:'.-',B:'-...',C:'-.-.',D:'-..',E:'.',F:'..-.',G:'--.',H:'....',I:'..',J:'.---',K:'-.-',L:'.-..',M:'--',N:'-.',O:'---',P:'.--.',Q:'--.-',R:'.-.',S:'...',T:'-',U:'..-',V:'...-',W:'.--',X:'-..-',Y:'-.--',Z:'--..',0:'-----',1:'.----',2:'..---',3:'...--',4:'....-',5:'.....',6:'-....',7:'--...',8:'---..',9:'----.',' ':'/' }
const morseDec = Object.fromEntries(Object.entries(morseEnc).map(([k, v]) => [v, k]))

// NATO map
const natoMap = { A:'Alfa',B:'Bravo',C:'Charlie',D:'Delta',E:'Echo',F:'Foxtrot',G:'Golf',H:'Hotel',I:'India',J:'Juliet',K:'Kilo',L:'Lima',M:'Mike',N:'November',O:'Oscar',P:'Papa',Q:'Quebec',R:'Romeo',S:'Sierra',T:'Tango',U:'Uniform',V:'Victor',W:'Whiskey',X:'X-ray',Y:'Yankee',Z:'Zulu' }

// Conversion functions: key = "from→to"
const conversionMap = {
  // text ↔ base64
  'text→base64': (i) => btoa(unescape(encodeURIComponent(i))),
  'base64→text': (i) => decodeURIComponent(escape(atob(i.trim()))),

  // text ↔ base58
  'text→base58': (i) => textToBase58(i),
  'base58→text': (i) => base58ToText(i),

  // text ↔ base32
  'text→base32': (i) => {
    const alph = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
    const bytes = new TextEncoder().encode(i)
    let bits = ''
    for (const b of bytes) bits += b.toString(2).padStart(8, '0')
    while (bits.length % 5) bits += '0'
    let r = ''
    for (let j = 0; j < bits.length; j += 5) r += alph[parseInt(bits.slice(j, j + 5), 2)]
    while (r.length % 8) r += '='
    return r
  },
  'base32→text': (i) => {
    const alph = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
    const cleaned = i.trim().replace(/=+$/, '').toUpperCase()
    let bits = ''
    for (const c of cleaned) { const idx = alph.indexOf(c); if (idx < 0) throw new Error('bad char'); bits += idx.toString(2).padStart(5, '0') }
    const bytes = []
    for (let j = 0; j + 8 <= bits.length; j += 8) bytes.push(parseInt(bits.slice(j, j + 8), 2))
    return new TextDecoder().decode(new Uint8Array(bytes))
  },

  // text ↔ url encoded
  'text→url': (i) => encodeURIComponent(i),
  'url→text': (i) => decodeURIComponent(i),

  // text ↔ html entities
  'text→html-ent': (i) => i.replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[c]),
  'html-ent→text': (i) => { const el = document.createElement('textarea'); el.innerHTML = i; return el.value },

  // text ↔ hex
  'text→hex': (i) => Array.from(new TextEncoder().encode(i)).map(b => b.toString(16).padStart(2, '0')).join(' '),
  'hex→text': (i) => { const h = i.replace(/\s+/g, ''); const bytes = new Uint8Array(h.match(/.{2}/g).map(b => parseInt(b, 16))); return new TextDecoder().decode(bytes) },

  // text ↔ binary
  'text→binary': (i) => Array.from(new TextEncoder().encode(i)).map(b => b.toString(2).padStart(8, '0')).join(' '),
  'binary→text': (i) => { const bins = i.trim().split(/\s+/); return new TextDecoder().decode(new Uint8Array(bins.map(b => parseInt(b, 2)))) },

  // text ↔ unicode escaped
  'text→unicode': (i) => Array.from(i).map(c => { const cp = c.codePointAt(0); return cp > 0xffff ? `\\u{${cp.toString(16)}}` : `\\u${cp.toString(16).padStart(4, '0')}` }).join(''),
  'unicode→text': (i) => i.replace(/\\u\{([0-9a-fA-F]+)\}|\\u([0-9a-fA-F]{4})/g, (_, p1, p2) => String.fromCodePoint(parseInt(p1 || p2, 16))),

  // text ↔ morse
  'text→morse': (i) => i.toUpperCase().split('').map(c => morseEnc[c] || c).join(' '),
  'morse→text': (i) => i.trim().split(' ').map(code => morseDec[code] || code).join(''),

  // text → nato (one-way)
  'text→nato': (i) => i.toUpperCase().split('').map(c => c === ' ' ? '/' : natoMap[c] || c).join(' '),

  // case conversions
  'text→uppercase': (i) => i.toUpperCase(),
  'text→lowercase': (i) => i.toLowerCase(),
  'text→titlecase': (i) => i.replace(/\b\w/g, c => c.toUpperCase()),
  'text→camelcase': (i) => i.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()),
  'text→snakecase': (i) => i.replace(/([a-z])([A-Z])/g, '$1_$2').replace(/[\s-]+/g, '_').toLowerCase(),
  'text→kebabcase': (i) => i.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[\s_]+/g, '-').toLowerCase(),
  'uppercase→text': (i) => i,
  'lowercase→text': (i) => i,
  'titlecase→text': (i) => i,
  'camelcase→text': (i) => i.replace(/([A-Z])/g, ' $1').trim().toLowerCase(),
  'snakecase→text': (i) => i.replace(/_/g, ' '),
  'kebabcase→text': (i) => i.replace(/-/g, ' '),
  'uppercase→lowercase': (i) => i.toLowerCase(),
  'lowercase→uppercase': (i) => i.toUpperCase(),

  // rot13 (self-inverse)
  'text→rot13': (i) => i.replace(/[a-zA-Z]/g, c => { const b = c <= 'Z' ? 65 : 97; return String.fromCharCode(((c.charCodeAt(0) - b + 13) % 26) + b) }),
  'rot13→text': (i) => i.replace(/[a-zA-Z]/g, c => { const b = c <= 'Z' ? 65 : 97; return String.fromCharCode(((c.charCodeAt(0) - b + 13) % 26) + b) }),

  // text ↔ braille
  'text→braille': (i) => textToBraille(i),
  'braille→text': (i) => brailleToText(i),

  // text ↔ pig latin
  'text→piglatin': (i) => textToPigLatin(i),
  'piglatin→text': (i) => pigLatinToText(i),

  // text ↔ leet speak
  'text→leetspeak': (i) => Array.from(i).map(c => leetMap[c.toLowerCase()] || c).join(''),
  'leetspeak→text': (i) => Array.from(i).map(c => leetRev[c] || c).join(''),

  // text ↔ base64url
  'text→base64url': (i) => btoa(unescape(encodeURIComponent(i))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''),
  'base64url→text': (i) => { const s = i.trim().replace(/-/g, '+').replace(/_/g, '/'); return decodeURIComponent(escape(atob(s + '='.repeat((4 - s.length % 4) % 4)))) },
  'base64url→base64': (i) => { const s = i.trim().replace(/-/g, '+').replace(/_/g, '/'); return s + '='.repeat((4 - s.length % 4) % 4) },
  'base64→base64url': (i) => i.trim().replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''),
  'base64url→hex': (i) => { const s = i.trim().replace(/-/g, '+').replace(/_/g, '/'); const bytes = Uint8Array.from(atob(s + '='.repeat((4 - s.length % 4) % 4)), c => c.charCodeAt(0)); return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(' ') },

  // text ↔ atbash (self-inverse)
  'text→atbash': (i) => i.replace(/[a-zA-Z]/g, c => { const b = c <= 'Z' ? 65 : 97; return String.fromCharCode(b + 25 - (c.charCodeAt(0) - b)) }),
  'atbash→text': (i) => i.replace(/[a-zA-Z]/g, c => { const b = c <= 'Z' ? 65 : 97; return String.fromCharCode(b + 25 - (c.charCodeAt(0) - b)) }),
  'atbash→morse': (i) => { const t = i.replace(/[a-zA-Z]/g, c => { const b = c <= 'Z' ? 65 : 97; return String.fromCharCode(b + 25 - (c.charCodeAt(0) - b)) }); return t.toUpperCase().split('').map(c => morseEnc[c] || c).join(' ') },
  'atbash→braille': (i) => textToBraille(i.replace(/[a-zA-Z]/g, c => { const b = c <= 'Z' ? 65 : 97; return String.fromCharCode(b + 25 - (c.charCodeAt(0) - b)) })),
  'rot13→atbash': (i) => { const r = i.replace(/[a-zA-Z]/g, c => { const b = c <= 'Z' ? 65 : 97; return String.fromCharCode(((c.charCodeAt(0) - b + 13) % 26) + b) }); return r.replace(/[a-zA-Z]/g, c => { const b = c <= 'Z' ? 65 : 97; return String.fromCharCode(b + 25 - (c.charCodeAt(0) - b)) }) },
  'atbash→rot13': (i) => { const a = i.replace(/[a-zA-Z]/g, c => { const b = c <= 'Z' ? 65 : 97; return String.fromCharCode(b + 25 - (c.charCodeAt(0) - b)) }); return a.replace(/[a-zA-Z]/g, c => { const b = c <= 'Z' ? 65 : 97; return String.fromCharCode(((c.charCodeAt(0) - b + 13) % 26) + b) }) },

  // cross-conversions: reverse ↔ encodings
  'reverse→base64': (i) => btoa(unescape(encodeURIComponent(i))),
  'reverse→morse': (i) => i.toUpperCase().split('').map(c => morseEnc[c] || c).join(' '),
  'reverse→braille': (i) => textToBraille(i),

  // morse ↔ braille (via text intermediate)
  'morse→braille': (i) => textToBraille(i.trim().split(' ').map(code => morseDec[code] || code).join('')),
  'braille→morse': (i) => brailleToText(i).toUpperCase().split('').map(c => morseEnc[c] || c).join(' '),

  // base64 ↔ braille
  'base64→braille': (i) => textToBraille(decodeURIComponent(escape(atob(i.trim())))),
  'braille→base64': (i) => btoa(unescape(encodeURIComponent(brailleToText(i)))),

  // leetspeak → other fun encodings
  'leetspeak→morse': (i) => { const t = Array.from(i).map(c => leetRev[c] || c).join(''); return t.toUpperCase().split('').map(c => morseEnc[c] || c).join(' ') },
  'leetspeak→braille': (i) => textToBraille(Array.from(i).map(c => leetRev[c] || c).join('')),

  // piglatin ↔ other
  'piglatin→braille': (i) => textToBraille(pigLatinToText(i)),
  'braille→piglatin': (i) => textToPigLatin(brailleToText(i)),

  // morse ↔ binary (through text intermediary)
  'morse→binary': (i) => { const t = i.trim().split(' ').map(code => morseDec[code] || code).join(''); return Array.from(new TextEncoder().encode(t)).map(b => b.toString(2).padStart(8, '0')).join(' ') },
  'binary→morse': (i) => { const t = new TextDecoder().decode(new Uint8Array(i.trim().split(/\s+/).map(b => parseInt(b, 2)))); return t.toUpperCase().split('').map(c => morseEnc[c] || c).join(' ') },

  // rot13 ↔ morse/braille
  'rot13→morse': (i) => i.replace(/[a-zA-Z]/g, c => { const b = c <= 'Z' ? 65 : 97; return String.fromCharCode(((c.charCodeAt(0) - b + 13) % 26) + b) }).toUpperCase().split('').map(c => morseEnc[c] || c).join(' '),
  'rot13→braille': (i) => textToBraille(i.replace(/[a-zA-Z]/g, c => { const b = c <= 'Z' ? 65 : 97; return String.fromCharCode(((c.charCodeAt(0) - b + 13) % 26) + b) })),

  // morse ↔ nato (via text)
  'morse→nato': (i) => { const text = i.trim().split(' ').map(code => morseDec[code] || code).join(''); return text.toUpperCase().split('').map(c => c === ' ' ? '/' : natoMap[c] || c).join(' ') },
  'nato→morse': (i) => { const rev = Object.fromEntries(Object.entries(natoMap).map(([k, v]) => [v.toLowerCase(), k])); const text = i.split(/\s+/).map(w => w === '/' ? ' ' : (rev[w.toLowerCase()] || w)).join(''); return text.toUpperCase().split('').map(c => morseEnc[c] || c).join(' ') },

  // braille ↔ nato
  'braille→nato': (i) => { const text = brailleToText(i); return text.toUpperCase().split('').map(c => c === ' ' ? '/' : natoMap[c] || c).join(' ') },
  'nato→braille': (i) => { const rev = Object.fromEntries(Object.entries(natoMap).map(([k, v]) => [v.toLowerCase(), k])); const text = i.split(/\s+/).map(w => w === '/' ? ' ' : (rev[w.toLowerCase()] || w)).join(''); return textToBraille(text) },

  // reverse ↔ leetspeak
  'reverse→leetspeak': (i) => Array.from(i).map(c => leetMap[c.toLowerCase()] || c).join(''),
  'leetspeak→reverse': (i) => [...Array.from(i).map(c => leetRev[c] || c).join('')].reverse().join(''),

  // reverse ↔ piglatin
  'reverse→piglatin': (i) => textToPigLatin([...i].reverse().join('')),
  'piglatin→reverse': (i) => [...pigLatinToText(i)].reverse().join(''),

  // reverse (self-inverse)
  'text→reverse': (i) => [...i].reverse().join(''),
  'reverse→text': (i) => [...i].reverse().join(''),

  // json string escape/unescape
  'text→json-escaped': (i) => JSON.stringify(i),
  'json-escaped→text': (i) => JSON.parse(i.trim()),

  // markdown → html
  'markdown→html-markup': (i) => {
    let h = i
    h = h.replace(/^### (.+)$/gm, '<h3>$1</h3>')
    h = h.replace(/^## (.+)$/gm, '<h2>$1</h2>')
    h = h.replace(/^# (.+)$/gm, '<h1>$1</h1>')
    h = h.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    h = h.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    h = h.replace(/\*(.+?)\*/g, '<em>$1</em>')
    h = h.replace(/`(.+?)`/g, '<code>$1</code>')
    h = h.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    return h
  },

  // html → plain text
  'html-markup→plain': (i) => { const el = document.createElement('div'); el.innerHTML = i; return el.textContent || '' },

  // json ↔ json minified
  'json→json-min': (i) => JSON.stringify(JSON.parse(i)),
  'json-min→json': (i) => JSON.stringify(JSON.parse(i), null, 2),

  // json ↔ csv
  'json→csv': (i) => {
    const data = JSON.parse(i)
    if (!Array.isArray(data) || !data.length) throw new Error('expected array')
    const keys = Object.keys(data[0])
    const esc = v => { const s = String(v ?? ''); return /[,"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
    return [keys.map(esc).join(','), ...data.map(row => keys.map(k => esc(row[k])).join(','))].join('\n')
  },
  'csv→json': (i) => {
    const lines = i.trim().split('\n')
    const parseRow = line => { const r = []; let cur = '', inQ = false; for (let j = 0; j < line.length; j++) { const c = line[j]; if (inQ) { if (c === '"' && line[j+1] === '"') { cur += '"'; j++ } else if (c === '"') inQ = false; else cur += c } else { if (c === '"') inQ = true; else if (c === ',') { r.push(cur); cur = '' } else cur += c } } r.push(cur); return r }
    const headers = parseRow(lines[0])
    return JSON.stringify(lines.slice(1).map(l => { const v = parseRow(l); const o = {}; headers.forEach((h, j) => o[h] = v[j] ?? ''); return o }), null, 2)
  },

  // csv ↔ tsv
  'csv→tsv': (i) => {
    const parseRow = line => { const r = []; let cur = '', inQ = false; for (let j = 0; j < line.length; j++) { const c = line[j]; if (inQ) { if (c === '"' && line[j+1] === '"') { cur += '"'; j++ } else if (c === '"') inQ = false; else cur += c } else { if (c === '"') inQ = true; else if (c === ',') { r.push(cur); cur = '' } else cur += c } } r.push(cur); return r }
    return i.trim().split('\n').map(line => parseRow(line).join('\t')).join('\n')
  },
  'tsv→csv': (i) => {
    const esc = v => { const s = String(v ?? ''); return /[,"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
    return i.trim().split('\n').map(line => line.split('\t').map(esc).join(',')).join('\n')
  },

  // json ↔ tsv
  'json→tsv': (i) => {
    const data = JSON.parse(i)
    if (!Array.isArray(data) || !data.length) throw new Error('expected array')
    const keys = Object.keys(data[0])
    return [keys.join('\t'), ...data.map(row => keys.map(k => String(row[k] ?? '').replace(/\t/g, ' ')).join('\t'))].join('\n')
  },
  'tsv→json': (i) => {
    const lines = i.trim().split('\n')
    const headers = lines[0].split('\t')
    return JSON.stringify(lines.slice(1).map(l => { const v = l.split('\t'); const o = {}; headers.forEach((h, j) => o[h] = v[j] ?? ''); return o }), null, 2)
  },

  // tsv ↔ yaml
  'tsv→yaml': (i) => {
    const lines = i.trim().split('\n')
    const headers = lines[0].split('\t')
    const data = lines.slice(1).map(l => { const v = l.split('\t'); const o = {}; headers.forEach((h, j) => o[h] = v[j] ?? ''); return o })
    return objToYaml(data, 0)
  },

  // tsv ↔ xml
  'tsv→xml': (i) => {
    const lines = i.trim().split('\n')
    const headers = lines[0].split('\t')
    const rows = lines.slice(1).map(l => {
      const v = l.split('\t')
      return '  <row>\n' + headers.map((h, j) => `    <${h}>${(v[j] || '').replace(/&/g, '&amp;').replace(/</g, '&lt;')}</${h}>`).join('\n') + '\n  </row>'
    })
    return '<?xml version="1.0"?>\n<data>\n' + rows.join('\n') + '\n</data>'
  },

  // json ↔ yaml
  'json→yaml': (i) => jsonToYaml(i),
  'yaml→json': (i) => yamlToJson(i),

  // json ↔ toml
  'json→toml': (i) => {
    const obj = JSON.parse(i)
    const lines = []
    function emit(val, prefix) {
      for (const [k, v] of Object.entries(val)) {
        if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
          const section = prefix ? `${prefix}.${k}` : k
          lines.push(`\n[${section}]`)
          emit(v, section)
        } else {
          const formatted = typeof v === 'string' ? `"${v}"` : JSON.stringify(v)
          lines.push(`${k} = ${formatted}`)
        }
      }
    }
    emit(obj, '')
    return lines.join('\n').trim()
  },
  'toml→json': (i) => JSON.stringify(parseToml(i), null, 2),

  // json ↔ querystring
  'json→querystring': (i) => { const o = JSON.parse(i); const p = new URLSearchParams(); for (const [k, v] of Object.entries(o)) p.set(k, String(v)); return p.toString() },
  'querystring→json': (i) => { const p = new URLSearchParams(i.trim().replace(/^\?/, '')); const o = {}; for (const [k, v] of p) o[k] = v; return JSON.stringify(o, null, 2) },

  // yaml ↔ querystring / csv
  'yaml→csv': (i) => { const j = yamlToJson(i); const data = JSON.parse(j); if (!Array.isArray(data)) throw new Error('need array'); const keys = Object.keys(data[0]); const esc = v => { const s = String(v ?? ''); return /[,"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }; return [keys.map(esc).join(','), ...data.map(row => keys.map(k => esc(row[k])).join(','))].join('\n') },

  // xml → json (one-way)
  'xml→json': (i) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(i, 'text/xml')
    if (doc.querySelector('parsererror')) throw new Error('invalid XML')
    function toObj(node) {
      const obj = {}
      if (node.attributes) for (const a of node.attributes) obj['@' + a.name] = a.value
      for (const ch of node.childNodes) {
        if (ch.nodeType === 3) { const t = ch.textContent.trim(); if (t) { if (!Object.keys(obj).length) return t; obj['#text'] = t } }
        else if (ch.nodeType === 1) { const v = toObj(ch); if (obj[ch.nodeName]) { if (!Array.isArray(obj[ch.nodeName])) obj[ch.nodeName] = [obj[ch.nodeName]]; obj[ch.nodeName].push(v) } else obj[ch.nodeName] = v }
      }
      return obj
    }
    return JSON.stringify({ [doc.documentElement.nodeName]: toObj(doc.documentElement) }, null, 2)
  },

  // text → hashes (one-way)
  'text→sha1': (i) => digest('SHA-1', i),
  'text→sha256': (i) => digest('SHA-256', i),
  'text→sha384': (i) => digest('SHA-384', i),
  'text→sha512': (i) => digest('SHA-512', i),
  'text→md5': (i) => md5(i),

  // base64 → hashes (decode first, then hash the decoded text)
  'base64→sha256': async (i) => {
    const text = decodeURIComponent(escape(atob(i.trim())))
    return digest('SHA-256', text)
  },
  'base64→md5': (i) => {
    const text = decodeURIComponent(escape(atob(i.trim())))
    return md5(text)
  },

  // timestamp ↔ iso-date ↔ human-date
  'timestamp→iso-date': (i) => { const n = Number(i.trim()); const ms = n > 1e12 ? n : n * 1000; return new Date(ms).toISOString() },
  'timestamp→human-date': (i) => { const n = Number(i.trim()); const ms = n > 1e12 ? n : n * 1000; return new Date(ms).toUTCString() },
  'iso-date→timestamp': (i) => String(Math.floor(new Date(i.trim()).getTime() / 1000)),
  'iso-date→human-date': (i) => new Date(i.trim()).toUTCString(),
  'human-date→timestamp': (i) => String(Math.floor(new Date(i.trim()).getTime() / 1000)),
  'human-date→iso-date': (i) => new Date(i.trim()).toISOString(),
  'text→timestamp': (i) => { const d = new Date(i.trim()); if (isNaN(d.getTime())) throw new Error('bad date'); return String(Math.floor(d.getTime() / 1000)) },
  'text→iso-date': (i) => { const d = new Date(i.trim()); if (isNaN(d.getTime())) throw new Error('bad date'); return d.toISOString() },

  // number conversions
  'decimal→numhex': (i) => '0x' + parseInt(i.trim(), 10).toString(16).toUpperCase(),
  'numhex→decimal': (i) => String(parseInt(i.trim().replace(/^0x/i, ''), 16)),
  'decimal→numbin': (i) => '0b' + parseInt(i.trim(), 10).toString(2),
  'numbin→decimal': (i) => String(parseInt(i.trim().replace(/^0b/i, ''), 2)),
  'decimal→numoct': (i) => '0o' + parseInt(i.trim(), 10).toString(8),
  'numoct→decimal': (i) => String(parseInt(i.trim().replace(/^0o/i, ''), 8)),
  'numhex→numbin': (i) => '0b' + parseInt(i.trim().replace(/^0x/i, ''), 16).toString(2),
  'numbin→numhex': (i) => '0x' + parseInt(i.trim().replace(/^0b/i, ''), 2).toString(16).toUpperCase(),

  // roman numerals
  'decimal→roman': (i) => { const n = parseInt(i.trim(), 10); if (isNaN(n) || n < 1 || n > 3999) throw new Error('1-3999 only'); return decToRoman(n) },
  'roman→decimal': (i) => String(romanToDec(i)),
  'numhex→roman': (i) => { const n = parseInt(i.trim().replace(/^0x/i, ''), 16); return decToRoman(n) },
  'roman→numhex': (i) => '0x' + romanToDec(i).toString(16).toUpperCase(),

  // cross-encoding conversions
  'base64→hex': (i) => { const bytes = Uint8Array.from(atob(i.trim()), c => c.charCodeAt(0)); return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(' ') },
  'hex→base64': (i) => { const hex = i.replace(/\s+/g, ''); const bytes = hex.match(/.{2}/g).map(b => parseInt(b, 16)); return btoa(String.fromCharCode(...bytes)) },
  'base64→base32': (i) => {
    const bytes = Uint8Array.from(atob(i.trim()), c => c.charCodeAt(0))
    const alph = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
    let bits = ''; for (const b of bytes) bits += b.toString(2).padStart(8, '0')
    while (bits.length % 5) bits += '0'
    let r = ''; for (let j = 0; j < bits.length; j += 5) r += alph[parseInt(bits.slice(j, j + 5), 2)]
    while (r.length % 8) r += '='
    return r
  },
  'base32→base64': (i) => {
    const alph = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
    const cleaned = i.trim().replace(/=+$/, '').toUpperCase()
    let bits = ''; for (const c of cleaned) { const idx = alph.indexOf(c); if (idx < 0) throw new Error('bad char'); bits += idx.toString(2).padStart(5, '0') }
    const bytes = []; for (let j = 0; j + 8 <= bits.length; j += 8) bytes.push(parseInt(bits.slice(j, j + 8), 2))
    return btoa(String.fromCharCode(...bytes))
  },

  // more cross-encoding: base64 ↔ binary
  'base64→binary': (i) => { const bytes = Uint8Array.from(atob(i.trim()), c => c.charCodeAt(0)); return Array.from(bytes).map(b => b.toString(2).padStart(8, '0')).join(' ') },
  'binary→base64': (i) => { const bytes = i.trim().split(/\s+/).map(b => parseInt(b, 2)); return btoa(String.fromCharCode(...bytes)) },

  // hex ↔ binary
  'hex→binary': (i) => { const hex = i.replace(/\s+/g, ''); return hex.match(/.{2}/g).map(b => parseInt(b, 16).toString(2).padStart(8, '0')).join(' ') },
  'binary→hex': (i) => { return i.trim().split(/\s+/).map(b => parseInt(b, 2).toString(16).padStart(2, '0')).join(' ') },

  // url ↔ base64 (through text)
  'url→base64': (i) => btoa(unescape(encodeURIComponent(decodeURIComponent(i)))),
  'base64→url': (i) => encodeURIComponent(decodeURIComponent(escape(atob(i.trim())))),

  // url ↔ hex (through text)
  'url→hex': (i) => { const text = decodeURIComponent(i); return Array.from(new TextEncoder().encode(text)).map(b => b.toString(16).padStart(2, '0')).join(' ') },
  'hex→url': (i) => { const h = i.replace(/\s+/g, ''); const bytes = new Uint8Array(h.match(/.{2}/g).map(b => parseInt(b, 16))); return encodeURIComponent(new TextDecoder().decode(bytes)) },

  // base32 ↔ hex
  'base32→hex': (i) => {
    const alph = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
    const cleaned = i.trim().replace(/=+$/, '').toUpperCase()
    let bits = ''; for (const c of cleaned) { const idx = alph.indexOf(c); if (idx < 0) throw new Error('bad char'); bits += idx.toString(2).padStart(5, '0') }
    const bytes = []; for (let j = 0; j + 8 <= bits.length; j += 8) bytes.push(parseInt(bits.slice(j, j + 8), 2))
    return bytes.map(b => b.toString(16).padStart(2, '0')).join(' ')
  },
  'hex→base32': (i) => {
    const alph = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
    const hex = i.replace(/\s+/g, '')
    const bytes = hex.match(/.{2}/g).map(b => parseInt(b, 16))
    let bits = ''; for (const b of bytes) bits += b.toString(2).padStart(8, '0')
    while (bits.length % 5) bits += '0'
    let r = ''; for (let j = 0; j < bits.length; j += 5) r += alph[parseInt(bits.slice(j, j + 5), 2)]
    while (r.length % 8) r += '='
    return r
  },

  // base58 ↔ base64 (through text)
  'base58→base64': (i) => btoa(unescape(encodeURIComponent(base58ToText(i)))),
  'base64→base58': (i) => textToBase58(decodeURIComponent(escape(atob(i.trim())))),

  // base58 ↔ hex (through text)
  'base58→hex': (i) => { const text = base58ToText(i); return Array.from(new TextEncoder().encode(text)).map(b => b.toString(16).padStart(2, '0')).join(' ') },
  'hex→base58': (i) => { const h = i.replace(/\s+/g, ''); const bytes = new Uint8Array(h.match(/.{2}/g).map(b => parseInt(b, 16))); return textToBase58(new TextDecoder().decode(bytes)) },

  'json→xml': (i) => {
    const obj = JSON.parse(i)
    function toXml(val, tag) {
      if (val === null || val === undefined) return `<${tag}/>`
      if (Array.isArray(val)) return val.map(item => toXml(item, tag)).join('\n')
      if (typeof val === 'object') { const ch = Object.entries(val).map(([k, v]) => toXml(v, k)).join('\n  '); return `<${tag}>\n  ${ch}\n</${tag}>` }
      return `<${tag}>${String(val).replace(/&/g, '&amp;').replace(/</g, '&lt;')}</${tag}>`
    }
    const keys = Object.keys(obj)
    if (keys.length === 1) return '<?xml version="1.0"?>\n' + toXml(obj[keys[0]], keys[0])
    return '<?xml version="1.0"?>\n' + toXml(obj, 'root')
  },
  'xml→yaml': (i) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(i, 'text/xml')
    if (doc.querySelector('parsererror')) throw new Error('invalid XML')
    function toObj(node) {
      const obj = {}
      if (node.attributes) for (const a of node.attributes) obj['@' + a.name] = a.value
      for (const ch of node.childNodes) {
        if (ch.nodeType === 3) { const t = ch.textContent.trim(); if (t) { if (!Object.keys(obj).length) return t; obj['#text'] = t } }
        else if (ch.nodeType === 1) { const v = toObj(ch); if (obj[ch.nodeName]) { if (!Array.isArray(obj[ch.nodeName])) obj[ch.nodeName] = [obj[ch.nodeName]]; obj[ch.nodeName].push(v) } else obj[ch.nodeName] = v }
      }
      return obj
    }
    const result = { [doc.documentElement.nodeName]: toObj(doc.documentElement) }
    return objToYaml(result, 0)
  },
  'csv→yaml': (i) => {
    const lines = i.trim().split('\n')
    const parseRow = line => { const r = []; let cur = '', inQ = false; for (let j = 0; j < line.length; j++) { const c = line[j]; if (inQ) { if (c === '"' && line[j+1] === '"') { cur += '"'; j++ } else if (c === '"') inQ = false; else cur += c } else { if (c === '"') inQ = true; else if (c === ',') { r.push(cur); cur = '' } else cur += c } } r.push(cur); return r }
    const headers = parseRow(lines[0])
    const data = lines.slice(1).map(l => { const v = parseRow(l); const o = {}; headers.forEach((h, j) => o[h] = v[j] ?? ''); return o })
    return objToYaml(data, 0)
  },

  // toml ↔ yaml (via json as intermediary)
  'toml→yaml': (i) => objToYaml(parseToml(i), 0),
  'yaml→toml': (i) => {
    const json = yamlToJson(i)
    const obj = JSON.parse(json)
    const lines = []
    function emit(val, prefix) {
      for (const [k, v] of Object.entries(val)) {
        if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
          const section = prefix ? `${prefix}.${k}` : k
          lines.push(`\n[${section}]`)
          emit(v, section)
        } else {
          const formatted = typeof v === 'string' ? `"${v}"` : JSON.stringify(v)
          lines.push(`${k} = ${formatted}`)
        }
      }
    }
    emit(obj, '')
    return lines.join('\n').trim()
  },

  // json-min ↔ yaml
  'json-min→yaml': (i) => jsonToYaml(JSON.stringify(JSON.parse(i))),
  'yaml→json-min': (i) => JSON.stringify(JSON.parse(yamlToJson(i))),

  // json-min ↔ csv
  'json-min→csv': (i) => {
    const data = JSON.parse(i)
    if (!Array.isArray(data) || !data.length) throw new Error('expected array')
    const keys = Object.keys(data[0])
    const esc = v => { const s = String(v ?? ''); return /[,"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
    return [keys.map(esc).join(','), ...data.map(row => keys.map(k => esc(row[k])).join(','))].join('\n')
  },

  // json-min ↔ toml
  'json-min→toml': (i) => {
    const obj = JSON.parse(i)
    const lines = []
    function emit(val, prefix) {
      for (const [k, v] of Object.entries(val)) {
        if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
          const section = prefix ? `${prefix}.${k}` : k
          lines.push(`\n[${section}]`)
          emit(v, section)
        } else {
          const formatted = typeof v === 'string' ? `"${v}"` : JSON.stringify(v)
          lines.push(`${k} = ${formatted}`)
        }
      }
    }
    emit(obj, '')
    return lines.join('\n').trim()
  },

  // csv → toml (via json)
  'csv→toml': (i) => {
    const lines = i.trim().split('\n')
    const parseRow = line => { const r = []; let cur = '', inQ = false; for (let j = 0; j < line.length; j++) { const c = line[j]; if (inQ) { if (c === '"' && line[j+1] === '"') { cur += '"'; j++ } else if (c === '"') inQ = false; else cur += c } else { if (c === '"') inQ = true; else if (c === ',') { r.push(cur); cur = '' } else cur += c } } r.push(cur); return r }
    const headers = parseRow(lines[0])
    const data = lines.slice(1).map(l => { const v = parseRow(l); const o = {}; headers.forEach((h, j) => o[h] = v[j] ?? ''); return o })
    // emit as array of tables
    return data.map((row) => {
      const section = `[[item]]\n`
      const entries = Object.entries(row).map(([k, v]) => {
        if (/^-?\d+$/.test(v)) return `${k} = ${v}`
        if (/^-?\d+\.\d+$/.test(v)) return `${k} = ${v}`
        if (v === 'true' || v === 'false') return `${k} = ${v}`
        return `${k} = "${v}"`
      }).join('\n')
      return section + entries
    }).join('\n\n')
  },

  // toml → csv (basic: uses first section's keys as columns)
  'toml→csv': (i) => {
    const obj = parseToml(i)
    // Try to find an array or flatten top-level
    const firstArray = Object.values(obj).find(v => Array.isArray(v))
    const data = firstArray || [obj]
    if (!Array.isArray(data) || !data.length) throw new Error('no tabular data')
    const keys = Object.keys(data[0])
    const esc = v => { const s = String(v ?? ''); return /[,"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
    return [keys.map(esc).join(','), ...data.map(row => keys.map(k => esc(row[k])).join(','))].join('\n')
  },

  // querystring ↔ yaml
  'querystring→yaml': (i) => {
    const p = new URLSearchParams(i.trim().replace(/^\?/, ''))
    const o = {}
    for (const [k, v] of p) o[k] = v
    return objToYaml(o, 0)
  },
  'yaml→querystring': (i) => {
    const j = yamlToJson(i)
    const o = JSON.parse(j)
    const p = new URLSearchParams()
    for (const [k, v] of Object.entries(o)) p.set(k, String(v))
    return p.toString()
  },

  // querystring ↔ toml
  'querystring→toml': (i) => {
    const p = new URLSearchParams(i.trim().replace(/^\?/, ''))
    const lines = []
    for (const [k, v] of p) {
      if (/^-?\d+$/.test(v)) lines.push(`${k} = ${v}`)
      else if (v === 'true' || v === 'false') lines.push(`${k} = ${v}`)
      else lines.push(`${k} = "${v}"`)
    }
    return lines.join('\n')
  },

  // nato → text (reverse)
  'nato→text': (i) => {
    const rev = Object.fromEntries(Object.entries(natoMap).map(([k, v]) => [v.toLowerCase(), k]))
    return i.split(/\s+/).map(w => w === '/' ? ' ' : (rev[w.toLowerCase()] || w)).join('')
  },

  // data size conversions
  'bytes→kilobytes': (i) => (parseFloat(i.trim()) / 1024).toPrecision(6).replace(/\.?0+$/, ''),
  'bytes→megabytes': (i) => (parseFloat(i.trim()) / (1024 * 1024)).toPrecision(6).replace(/\.?0+$/, ''),
  'bytes→gigabytes': (i) => (parseFloat(i.trim()) / (1024 * 1024 * 1024)).toPrecision(6).replace(/\.?0+$/, ''),
  'kilobytes→bytes': (i) => String(Math.round(parseFloat(i.trim()) * 1024)),
  'kilobytes→megabytes': (i) => (parseFloat(i.trim()) / 1024).toPrecision(6).replace(/\.?0+$/, ''),
  'kilobytes→gigabytes': (i) => (parseFloat(i.trim()) / (1024 * 1024)).toPrecision(6).replace(/\.?0+$/, ''),
  'megabytes→bytes': (i) => String(Math.round(parseFloat(i.trim()) * 1024 * 1024)),
  'megabytes→kilobytes': (i) => String(Math.round(parseFloat(i.trim()) * 1024)),
  'megabytes→gigabytes': (i) => (parseFloat(i.trim()) / 1024).toPrecision(6).replace(/\.?0+$/, ''),
  'gigabytes→bytes': (i) => String(Math.round(parseFloat(i.trim()) * 1024 * 1024 * 1024)),
  'gigabytes→kilobytes': (i) => String(Math.round(parseFloat(i.trim()) * 1024 * 1024)),
  'gigabytes→megabytes': (i) => String(Math.round(parseFloat(i.trim()) * 1024)),

  // bits conversions
  'bits→bytes': (i) => (parseFloat(i.trim()) / 8).toPrecision(6).replace(/\.?0+$/, ''),
  'bytes→bits': (i) => String(Math.round(parseFloat(i.trim()) * 8)),
  'bits→kilobytes': (i) => (parseFloat(i.trim()) / 8 / 1024).toPrecision(6).replace(/\.?0+$/, ''),
  'bits→megabytes': (i) => (parseFloat(i.trim()) / 8 / 1048576).toPrecision(6).replace(/\.?0+$/, ''),
  'kilobytes→bits': (i) => String(Math.round(parseFloat(i.trim()) * 1024 * 8)),
  'megabytes→bits': (i) => String(Math.round(parseFloat(i.trim()) * 1048576 * 8)),

  // bits ↔ gigabytes, terabytes, petabytes
  'bits→gigabytes': (i) => (parseFloat(i.trim()) / 8 / 1073741824).toPrecision(6).replace(/\.?0+$/, ''),
  'gigabytes→bits': (i) => String(Math.round(parseFloat(i.trim()) * 1073741824 * 8)),
  'bits→terabytes': (i) => (parseFloat(i.trim()) / 8 / 1099511627776).toPrecision(6).replace(/\.?0+$/, ''),
  'terabytes→bits': (i) => String(Math.round(parseFloat(i.trim()) * 1099511627776 * 8)),
  'bits→petabytes': (i) => (parseFloat(i.trim()) / 8 / 1125899906842624).toPrecision(6).replace(/\.?0+$/, ''),
  'petabytes→bits': (i) => String(Math.round(parseFloat(i.trim()) * 1125899906842624 * 8)),

  // bits ↔ IEC units
  'bits→kib': (i) => (parseFloat(i.trim()) / 8 / 1024).toPrecision(6).replace(/\.?0+$/, ''),
  'kib→bits': (i) => String(Math.round(parseFloat(i.trim()) * 1024 * 8)),
  'bits→mib': (i) => (parseFloat(i.trim()) / 8 / 1048576).toPrecision(6).replace(/\.?0+$/, ''),
  'mib→bits': (i) => String(Math.round(parseFloat(i.trim()) * 1048576 * 8)),
  'bits→gib': (i) => (parseFloat(i.trim()) / 8 / 1073741824).toPrecision(6).replace(/\.?0+$/, ''),
  'gib→bits': (i) => String(Math.round(parseFloat(i.trim()) * 1073741824 * 8)),

  // IEC units (power-of-2)
  'bytes→kib': (i) => (parseFloat(i.trim()) / 1024).toPrecision(6).replace(/\.?0+$/, ''),
  'kib→bytes': (i) => String(Math.round(parseFloat(i.trim()) * 1024)),
  'bytes→mib': (i) => (parseFloat(i.trim()) / 1048576).toPrecision(6).replace(/\.?0+$/, ''),
  'mib→bytes': (i) => String(Math.round(parseFloat(i.trim()) * 1048576)),
  'bytes→gib': (i) => (parseFloat(i.trim()) / 1073741824).toPrecision(6).replace(/\.?0+$/, ''),
  'gib→bytes': (i) => String(Math.round(parseFloat(i.trim()) * 1073741824)),
  'kib→mib': (i) => (parseFloat(i.trim()) / 1024).toPrecision(6).replace(/\.?0+$/, ''),
  'mib→kib': (i) => String(Math.round(parseFloat(i.trim()) * 1024)),
  'kib→gib': (i) => (parseFloat(i.trim()) / 1048576).toPrecision(6).replace(/\.?0+$/, ''),
  'gib→kib': (i) => String(Math.round(parseFloat(i.trim()) * 1048576)),
  'mib→gib': (i) => (parseFloat(i.trim()) / 1024).toPrecision(6).replace(/\.?0+$/, ''),
  'gib→mib': (i) => String(Math.round(parseFloat(i.trim()) * 1024)),
  // IEC ↔ SI cross
  'kilobytes→kib': (i) => (parseFloat(i.trim()) * 1000 / 1024).toPrecision(6).replace(/\.?0+$/, ''),
  'kib→kilobytes': (i) => (parseFloat(i.trim()) * 1024 / 1000).toPrecision(6).replace(/\.?0+$/, ''),
  'megabytes→mib': (i) => (parseFloat(i.trim()) * 1000000 / 1048576).toPrecision(6).replace(/\.?0+$/, ''),
  'mib→megabytes': (i) => (parseFloat(i.trim()) * 1048576 / 1000000).toPrecision(6).replace(/\.?0+$/, ''),
  'gigabytes→gib': (i) => (parseFloat(i.trim()) * 1e9 / 1073741824).toPrecision(6).replace(/\.?0+$/, ''),
  'gib→gigabytes': (i) => (parseFloat(i.trim()) * 1073741824 / 1e9).toPrecision(6).replace(/\.?0+$/, ''),

  // temperature conversions
  'celsius→fahrenheit': (i) => { const c = parseFloat(i.trim()); return (c * 9/5 + 32).toFixed(2) + ' °F' },
  'celsius→kelvin': (i) => { const c = parseFloat(i.trim()); return (c + 273.15).toFixed(2) + ' K' },
  'fahrenheit→celsius': (i) => { const f = parseFloat(i.trim()); return ((f - 32) * 5/9).toFixed(2) + ' °C' },
  'fahrenheit→kelvin': (i) => { const f = parseFloat(i.trim()); return ((f - 32) * 5/9 + 273.15).toFixed(2) + ' K' },
  'kelvin→celsius': (i) => { const k = parseFloat(i.trim()); return (k - 273.15).toFixed(2) + ' °C' },
  'kelvin→fahrenheit': (i) => { const k = parseFloat(i.trim()); return ((k - 273.15) * 9/5 + 32).toFixed(2) + ' °F' },
  'celsius→rankine': (i) => { const c = parseFloat(i.trim()); return ((c + 273.15) * 1.8).toFixed(2) + ' °R' },
  'rankine→celsius': (i) => { const r = parseFloat(i.trim()); return (r / 1.8 - 273.15).toFixed(2) + ' °C' },
  'fahrenheit→rankine': (i) => { const f = parseFloat(i.trim()); return (f + 459.67).toFixed(2) + ' °R' },
  'rankine→fahrenheit': (i) => { const r = parseFloat(i.trim()); return (r - 459.67).toFixed(2) + ' °F' },
  'kelvin→rankine': (i) => { const k = parseFloat(i.trim()); return (k * 1.8).toFixed(2) + ' °R' },
  'rankine→kelvin': (i) => { const r = parseFloat(i.trim()); return (r / 1.8).toFixed(4) + ' K' },

  // number cross-conversions: oct ↔ hex, oct ↔ bin
  'numoct→numhex': (i) => '0x' + parseInt(i.trim().replace(/^0o/i, ''), 8).toString(16).toUpperCase(),
  'numhex→numoct': (i) => '0o' + parseInt(i.trim().replace(/^0x/i, ''), 16).toString(8),
  'numoct→numbin': (i) => '0b' + parseInt(i.trim().replace(/^0o/i, ''), 8).toString(2),
  'numbin→numoct': (i) => '0o' + parseInt(i.trim().replace(/^0b/i, ''), 2).toString(8),

  // markdown → plain text (strip formatting)
  'markdown→plain': (i) => {
    let t = i
    t = t.replace(/^#{1,6}\s+/gm, '')
    t = t.replace(/\*\*\*(.+?)\*\*\*/g, '$1')
    t = t.replace(/\*\*(.+?)\*\*/g, '$1')
    t = t.replace(/\*(.+?)\*/g, '$1')
    t = t.replace(/~~(.+?)~~/g, '$1')
    t = t.replace(/`(.+?)`/g, '$1')
    t = t.replace(/\[(.+?)\]\(.+?\)/g, '$1')
    t = t.replace(/!\[.*?\]\(.+?\)/g, '')
    t = t.replace(/^>\s?/gm, '')
    t = t.replace(/^[-*+]\s/gm, '')
    t = t.replace(/^\d+\.\s/gm, '')
    t = t.replace(/^---+$/gm, '')
    return t.trim()
  },

  // json ↔ querystring cross-format via json-min
  'json-min→querystring': (i) => { const o = JSON.parse(i); const p = new URLSearchParams(); for (const [k, v] of Object.entries(o)) p.set(k, String(v)); return p.toString() },
  'querystring→json-min': (i) => { const p = new URLSearchParams(i.trim().replace(/^\?/, '')); const o = {}; for (const [k, v] of p) o[k] = v; return JSON.stringify(o) },

  // length conversions
  'inches→cm': (i) => (parseFloat(i) * 2.54).toFixed(4).replace(/\.?0+$/, ''),
  'cm→inches': (i) => (parseFloat(i) / 2.54).toFixed(4).replace(/\.?0+$/, ''),
  'inches→mm': (i) => (parseFloat(i) * 25.4).toFixed(2).replace(/\.?0+$/, ''),
  'mm→inches': (i) => (parseFloat(i) / 25.4).toFixed(4).replace(/\.?0+$/, ''),
  'inches→feet': (i) => (parseFloat(i) / 12).toFixed(4).replace(/\.?0+$/, ''),
  'feet→inches': (i) => (parseFloat(i) * 12).toFixed(2).replace(/\.?0+$/, ''),
  'inches→meters': (i) => (parseFloat(i) * 0.0254).toFixed(4).replace(/\.?0+$/, ''),
  'meters→inches': (i) => (parseFloat(i) / 0.0254).toFixed(2).replace(/\.?0+$/, ''),
  'cm→mm': (i) => (parseFloat(i) * 10).toFixed(2).replace(/\.?0+$/, ''),
  'mm→cm': (i) => (parseFloat(i) / 10).toFixed(4).replace(/\.?0+$/, ''),
  'cm→meters': (i) => (parseFloat(i) / 100).toFixed(4).replace(/\.?0+$/, ''),
  'meters→cm': (i) => (parseFloat(i) * 100).toFixed(2).replace(/\.?0+$/, ''),
  'cm→feet': (i) => (parseFloat(i) / 30.48).toFixed(4).replace(/\.?0+$/, ''),
  'feet→cm': (i) => (parseFloat(i) * 30.48).toFixed(2).replace(/\.?0+$/, ''),
  'mm→meters': (i) => (parseFloat(i) / 1000).toFixed(4).replace(/\.?0+$/, ''),
  'meters→mm': (i) => (parseFloat(i) * 1000).toFixed(2).replace(/\.?0+$/, ''),
  'feet→meters': (i) => (parseFloat(i) * 0.3048).toFixed(4).replace(/\.?0+$/, ''),
  'meters→feet': (i) => (parseFloat(i) / 0.3048).toFixed(4).replace(/\.?0+$/, ''),
  'mm→feet': (i) => (parseFloat(i) / 304.8).toFixed(4).replace(/\.?0+$/, ''),
  'feet→mm': (i) => (parseFloat(i) * 304.8).toFixed(2).replace(/\.?0+$/, ''),

  // weight conversions
  'kg→lb': (i) => (parseFloat(i) * 2.20462).toFixed(4).replace(/\.?0+$/, ''),
  'lb→kg': (i) => (parseFloat(i) / 2.20462).toFixed(4).replace(/\.?0+$/, ''),
  'kg→oz': (i) => (parseFloat(i) * 35.274).toFixed(2).replace(/\.?0+$/, ''),
  'oz→kg': (i) => (parseFloat(i) / 35.274).toFixed(4).replace(/\.?0+$/, ''),
  'kg→grams': (i) => (parseFloat(i) * 1000).toFixed(2).replace(/\.?0+$/, ''),
  'grams→kg': (i) => (parseFloat(i) / 1000).toFixed(4).replace(/\.?0+$/, ''),
  'lb→oz': (i) => (parseFloat(i) * 16).toFixed(2).replace(/\.?0+$/, ''),
  'oz→lb': (i) => (parseFloat(i) / 16).toFixed(4).replace(/\.?0+$/, ''),
  'lb→grams': (i) => (parseFloat(i) * 453.592).toFixed(2).replace(/\.?0+$/, ''),
  'grams→lb': (i) => (parseFloat(i) / 453.592).toFixed(4).replace(/\.?0+$/, ''),
  'oz→grams': (i) => (parseFloat(i) * 28.3495).toFixed(2).replace(/\.?0+$/, ''),
  'grams→oz': (i) => (parseFloat(i) / 28.3495).toFixed(4).replace(/\.?0+$/, ''),
  // tons, stones
  'kg→ton-metric': (i) => (parseFloat(i) / 1000).toFixed(6).replace(/\.?0+$/, ''),
  'ton-metric→kg': (i) => (parseFloat(i) * 1000).toFixed(2).replace(/\.?0+$/, ''),
  'kg→ton-short': (i) => (parseFloat(i) / 907.185).toFixed(6).replace(/\.?0+$/, ''),
  'ton-short→kg': (i) => (parseFloat(i) * 907.185).toFixed(2).replace(/\.?0+$/, ''),
  'kg→stone': (i) => (parseFloat(i) / 6.35029).toFixed(4).replace(/\.?0+$/, ''),
  'stone→kg': (i) => (parseFloat(i) * 6.35029).toFixed(4).replace(/\.?0+$/, ''),
  'lb→stone': (i) => (parseFloat(i) / 14).toFixed(4).replace(/\.?0+$/, ''),
  'stone→lb': (i) => (parseFloat(i) * 14).toFixed(2).replace(/\.?0+$/, ''),
  'ton-metric→lb': (i) => (parseFloat(i) * 2204.62).toFixed(2).replace(/\.?0+$/, ''),
  'lb→ton-metric': (i) => (parseFloat(i) / 2204.62).toFixed(6).replace(/\.?0+$/, ''),
  'ton-metric→ton-short': (i) => (parseFloat(i) * 1.10231).toFixed(4).replace(/\.?0+$/, ''),
  'ton-short→ton-metric': (i) => (parseFloat(i) / 1.10231).toFixed(4).replace(/\.?0+$/, ''),
  'ton-short→lb': (i) => (parseFloat(i) * 2000).toFixed(2).replace(/\.?0+$/, ''),
  'lb→ton-short': (i) => (parseFloat(i) / 2000).toFixed(6).replace(/\.?0+$/, ''),

  // distance conversions (miles, km, yards, nautical miles)
  'miles→km': (i) => (parseFloat(i) * 1.60934).toFixed(4).replace(/\.?0+$/, ''),
  'km→miles': (i) => (parseFloat(i) / 1.60934).toFixed(4).replace(/\.?0+$/, ''),
  'miles→yards': (i) => (parseFloat(i) * 1760).toFixed(2).replace(/\.?0+$/, ''),
  'yards→miles': (i) => (parseFloat(i) / 1760).toFixed(6).replace(/\.?0+$/, ''),
  'miles→meters': (i) => (parseFloat(i) * 1609.34).toFixed(2).replace(/\.?0+$/, ''),
  'meters→miles': (i) => (parseFloat(i) / 1609.34).toFixed(6).replace(/\.?0+$/, ''),
  'miles→nautmiles': (i) => (parseFloat(i) * 0.868976).toFixed(4).replace(/\.?0+$/, ''),
  'nautmiles→miles': (i) => (parseFloat(i) / 0.868976).toFixed(4).replace(/\.?0+$/, ''),
  'km→yards': (i) => (parseFloat(i) * 1093.61).toFixed(2).replace(/\.?0+$/, ''),
  'yards→km': (i) => (parseFloat(i) / 1093.61).toFixed(6).replace(/\.?0+$/, ''),
  'km→meters': (i) => (parseFloat(i) * 1000).toFixed(2).replace(/\.?0+$/, ''),
  'meters→km': (i) => (parseFloat(i) / 1000).toFixed(6).replace(/\.?0+$/, ''),
  'km→nautmiles': (i) => (parseFloat(i) * 0.539957).toFixed(4).replace(/\.?0+$/, ''),
  'nautmiles→km': (i) => (parseFloat(i) / 0.539957).toFixed(4).replace(/\.?0+$/, ''),
  'yards→meters': (i) => (parseFloat(i) * 0.9144).toFixed(4).replace(/\.?0+$/, ''),
  'meters→yards': (i) => (parseFloat(i) / 0.9144).toFixed(4).replace(/\.?0+$/, ''),
  'yards→feet': (i) => (parseFloat(i) * 3).toFixed(2).replace(/\.?0+$/, ''),
  'feet→yards': (i) => (parseFloat(i) / 3).toFixed(4).replace(/\.?0+$/, ''),
  'nautmiles→meters': (i) => (parseFloat(i) * 1852).toFixed(2).replace(/\.?0+$/, ''),
  'meters→nautmiles': (i) => (parseFloat(i) / 1852).toFixed(6).replace(/\.?0+$/, ''),

  // speed conversions
  'mph→kmh': (i) => (parseFloat(i) * 1.60934).toFixed(4).replace(/\.?0+$/, ''),
  'kmh→mph': (i) => (parseFloat(i) / 1.60934).toFixed(4).replace(/\.?0+$/, ''),
  'mph→ms': (i) => (parseFloat(i) * 0.44704).toFixed(4).replace(/\.?0+$/, ''),
  'ms→mph': (i) => (parseFloat(i) / 0.44704).toFixed(4).replace(/\.?0+$/, ''),
  'mph→knots': (i) => (parseFloat(i) * 0.868976).toFixed(4).replace(/\.?0+$/, ''),
  'knots→mph': (i) => (parseFloat(i) / 0.868976).toFixed(4).replace(/\.?0+$/, ''),
  'kmh→ms': (i) => (parseFloat(i) / 3.6).toFixed(4).replace(/\.?0+$/, ''),
  'ms→kmh': (i) => (parseFloat(i) * 3.6).toFixed(4).replace(/\.?0+$/, ''),
  'kmh→knots': (i) => (parseFloat(i) * 0.539957).toFixed(4).replace(/\.?0+$/, ''),
  'knots→kmh': (i) => (parseFloat(i) / 0.539957).toFixed(4).replace(/\.?0+$/, ''),
  'ms→knots': (i) => (parseFloat(i) * 1.94384).toFixed(4).replace(/\.?0+$/, ''),
  'knots→ms': (i) => (parseFloat(i) / 1.94384).toFixed(4).replace(/\.?0+$/, ''),
  // feet per second
  'fps→mph': (i) => (parseFloat(i) * 0.681818).toFixed(4).replace(/\.?0+$/, ''),
  'mph→fps': (i) => (parseFloat(i) * 1.46667).toFixed(4).replace(/\.?0+$/, ''),
  'fps→ms': (i) => (parseFloat(i) * 0.3048).toFixed(4).replace(/\.?0+$/, ''),
  'ms→fps': (i) => (parseFloat(i) / 0.3048).toFixed(4).replace(/\.?0+$/, ''),
  'fps→kmh': (i) => (parseFloat(i) * 1.09728).toFixed(4).replace(/\.?0+$/, ''),
  'kmh→fps': (i) => (parseFloat(i) / 1.09728).toFixed(4).replace(/\.?0+$/, ''),
  'fps→knots': (i) => (parseFloat(i) * 0.592484).toFixed(4).replace(/\.?0+$/, ''),
  'knots→fps': (i) => (parseFloat(i) / 0.592484).toFixed(4).replace(/\.?0+$/, ''),
  // mach (at sea level 20°C: 1 mach = 343 m/s = 1235.52 km/h = 767.27 mph)
  'mach→ms': (i) => (parseFloat(i) * 343).toFixed(2).replace(/\.?0+$/, ''),
  'ms→mach': (i) => (parseFloat(i) / 343).toFixed(6).replace(/\.?0+$/, ''),
  'mach→mph': (i) => (parseFloat(i) * 767.269).toFixed(2).replace(/\.?0+$/, ''),
  'mph→mach': (i) => (parseFloat(i) / 767.269).toFixed(6).replace(/\.?0+$/, ''),
  'mach→kmh': (i) => (parseFloat(i) * 1235.52).toFixed(2).replace(/\.?0+$/, ''),
  'kmh→mach': (i) => (parseFloat(i) / 1235.52).toFixed(6).replace(/\.?0+$/, ''),
  'mach→knots': (i) => (parseFloat(i) * 667.607).toFixed(2).replace(/\.?0+$/, ''),
  'knots→mach': (i) => (parseFloat(i) / 667.607).toFixed(6).replace(/\.?0+$/, ''),
  'mach→fps': (i) => (parseFloat(i) * 1125.33).toFixed(2).replace(/\.?0+$/, ''),
  'fps→mach': (i) => (parseFloat(i) / 1125.33).toFixed(6).replace(/\.?0+$/, ''),

  // area conversions
  'sqft→sqm': (i) => (parseFloat(i) * 0.092903).toFixed(4).replace(/\.?0+$/, ''),
  'sqm→sqft': (i) => (parseFloat(i) / 0.092903).toFixed(4).replace(/\.?0+$/, ''),
  'sqft→acres': (i) => (parseFloat(i) / 43560).toFixed(6).replace(/\.?0+$/, ''),
  'acres→sqft': (i) => (parseFloat(i) * 43560).toFixed(2).replace(/\.?0+$/, ''),
  'sqft→hectares': (i) => (parseFloat(i) / 107639).toFixed(6).replace(/\.?0+$/, ''),
  'hectares→sqft': (i) => (parseFloat(i) * 107639).toFixed(2).replace(/\.?0+$/, ''),
  'sqm→acres': (i) => (parseFloat(i) / 4046.86).toFixed(6).replace(/\.?0+$/, ''),
  'acres→sqm': (i) => (parseFloat(i) * 4046.86).toFixed(2).replace(/\.?0+$/, ''),
  'sqm→hectares': (i) => (parseFloat(i) / 10000).toFixed(6).replace(/\.?0+$/, ''),
  'hectares→sqm': (i) => (parseFloat(i) * 10000).toFixed(2).replace(/\.?0+$/, ''),
  'acres→hectares': (i) => (parseFloat(i) * 0.404686).toFixed(6).replace(/\.?0+$/, ''),
  'hectares→acres': (i) => (parseFloat(i) / 0.404686).toFixed(4).replace(/\.?0+$/, ''),

  // volume conversions
  'liters→gallons': (i) => (parseFloat(i) * 0.264172).toFixed(4).replace(/\.?0+$/, ''),
  'gallons→liters': (i) => (parseFloat(i) / 0.264172).toFixed(4).replace(/\.?0+$/, ''),
  'liters→ml': (i) => (parseFloat(i) * 1000).toFixed(2).replace(/\.?0+$/, ''),
  'ml→liters': (i) => (parseFloat(i) / 1000).toFixed(4).replace(/\.?0+$/, ''),
  'liters→floz': (i) => (parseFloat(i) * 33.814).toFixed(4).replace(/\.?0+$/, ''),
  'floz→liters': (i) => (parseFloat(i) / 33.814).toFixed(4).replace(/\.?0+$/, ''),
  'liters→cups': (i) => (parseFloat(i) * 4.22675).toFixed(4).replace(/\.?0+$/, ''),
  'cups→liters': (i) => (parseFloat(i) / 4.22675).toFixed(4).replace(/\.?0+$/, ''),
  'gallons→ml': (i) => (parseFloat(i) * 3785.41).toFixed(2).replace(/\.?0+$/, ''),
  'ml→gallons': (i) => (parseFloat(i) / 3785.41).toFixed(6).replace(/\.?0+$/, ''),
  'gallons→floz': (i) => (parseFloat(i) * 128).toFixed(2).replace(/\.?0+$/, ''),
  'floz→gallons': (i) => (parseFloat(i) / 128).toFixed(4).replace(/\.?0+$/, ''),
  'gallons→cups': (i) => (parseFloat(i) * 16).toFixed(2).replace(/\.?0+$/, ''),
  'cups→gallons': (i) => (parseFloat(i) / 16).toFixed(4).replace(/\.?0+$/, ''),
  'ml→floz': (i) => (parseFloat(i) * 0.033814).toFixed(4).replace(/\.?0+$/, ''),
  'floz→ml': (i) => (parseFloat(i) / 0.033814).toFixed(2).replace(/\.?0+$/, ''),
  'ml→cups': (i) => (parseFloat(i) * 0.00422675).toFixed(4).replace(/\.?0+$/, ''),
  'cups→ml': (i) => (parseFloat(i) / 0.00422675).toFixed(2).replace(/\.?0+$/, ''),
  'floz→cups': (i) => (parseFloat(i) / 8).toFixed(4).replace(/\.?0+$/, ''),
  'cups→floz': (i) => (parseFloat(i) * 8).toFixed(2).replace(/\.?0+$/, ''),

  // duration conversions
  'dur-seconds→dur-minutes': (i) => (parseFloat(i) / 60).toFixed(4).replace(/\.?0+$/, ''),
  'dur-minutes→dur-seconds': (i) => (parseFloat(i) * 60).toFixed(2).replace(/\.?0+$/, ''),
  'dur-seconds→dur-hours': (i) => (parseFloat(i) / 3600).toFixed(6).replace(/\.?0+$/, ''),
  'dur-hours→dur-seconds': (i) => (parseFloat(i) * 3600).toFixed(2).replace(/\.?0+$/, ''),
  'dur-seconds→dur-days': (i) => (parseFloat(i) / 86400).toFixed(6).replace(/\.?0+$/, ''),
  'dur-days→dur-seconds': (i) => (parseFloat(i) * 86400).toFixed(2).replace(/\.?0+$/, ''),
  'dur-minutes→dur-hours': (i) => (parseFloat(i) / 60).toFixed(4).replace(/\.?0+$/, ''),
  'dur-hours→dur-minutes': (i) => (parseFloat(i) * 60).toFixed(2).replace(/\.?0+$/, ''),
  'dur-minutes→dur-days': (i) => (parseFloat(i) / 1440).toFixed(6).replace(/\.?0+$/, ''),
  'dur-days→dur-minutes': (i) => (parseFloat(i) * 1440).toFixed(2).replace(/\.?0+$/, ''),
  'dur-hours→dur-days': (i) => (parseFloat(i) / 24).toFixed(4).replace(/\.?0+$/, ''),
  'dur-days→dur-hours': (i) => (parseFloat(i) * 24).toFixed(2).replace(/\.?0+$/, ''),
  // milliseconds
  'dur-ms→dur-days': (i) => (parseFloat(i) / 86400000).toFixed(8).replace(/\.?0+$/, ''),
  'dur-days→dur-ms': (i) => (parseFloat(i) * 86400000).toFixed(0),
  // weeks
  'dur-weeks→dur-seconds': (i) => (parseFloat(i) * 604800).toFixed(0),
  'dur-seconds→dur-weeks': (i) => (parseFloat(i) / 604800).toFixed(8).replace(/\.?0+$/, ''),
  'dur-weeks→dur-ms': (i) => (parseFloat(i) * 604800000).toFixed(0),
  'dur-ms→dur-weeks': (i) => (parseFloat(i) / 604800000).toFixed(10).replace(/\.?0+$/, ''),

  // energy conversions
  'joules→calories': (i) => (parseFloat(i) * 0.239006).toFixed(4).replace(/\.?0+$/, ''),
  'calories→joules': (i) => (parseFloat(i) / 0.239006).toFixed(4).replace(/\.?0+$/, ''),
  'joules→kcal': (i) => (parseFloat(i) / 4184).toFixed(6).replace(/\.?0+$/, ''),
  'kcal→joules': (i) => (parseFloat(i) * 4184).toFixed(2).replace(/\.?0+$/, ''),
  'joules→kwh': (i) => (parseFloat(i) / 3600000).toFixed(8).replace(/\.?0+$/, ''),
  'kwh→joules': (i) => (parseFloat(i) * 3600000).toFixed(2).replace(/\.?0+$/, ''),
  'joules→btu': (i) => (parseFloat(i) * 0.000947817).toFixed(6).replace(/\.?0+$/, ''),
  'btu→joules': (i) => (parseFloat(i) / 0.000947817).toFixed(2).replace(/\.?0+$/, ''),
  'calories→kcal': (i) => (parseFloat(i) / 1000).toFixed(4).replace(/\.?0+$/, ''),
  'kcal→calories': (i) => (parseFloat(i) * 1000).toFixed(2).replace(/\.?0+$/, ''),
  'calories→kwh': (i) => (parseFloat(i) / 860421).toFixed(8).replace(/\.?0+$/, ''),
  'kwh→calories': (i) => (parseFloat(i) * 860421).toFixed(2).replace(/\.?0+$/, ''),
  'calories→btu': (i) => (parseFloat(i) * 0.003968).toFixed(6).replace(/\.?0+$/, ''),
  'btu→calories': (i) => (parseFloat(i) / 0.003968).toFixed(2).replace(/\.?0+$/, ''),
  'kcal→kwh': (i) => (parseFloat(i) / 860.421).toFixed(6).replace(/\.?0+$/, ''),
  'kwh→kcal': (i) => (parseFloat(i) * 860.421).toFixed(2).replace(/\.?0+$/, ''),
  'kcal→btu': (i) => (parseFloat(i) * 3.96832).toFixed(4).replace(/\.?0+$/, ''),
  'btu→kcal': (i) => (parseFloat(i) / 3.96832).toFixed(4).replace(/\.?0+$/, ''),
  'kwh→btu': (i) => (parseFloat(i) * 3412.14).toFixed(2).replace(/\.?0+$/, ''),
  'btu→kwh': (i) => (parseFloat(i) / 3412.14).toFixed(6).replace(/\.?0+$/, ''),
  // megajoules
  'megajoules→joules': (i) => (parseFloat(i) * 1e6).toFixed(0),
  'joules→megajoules': (i) => (parseFloat(i) / 1e6).toFixed(8).replace(/\.?0+$/, ''),
  'megajoules→kwh': (i) => (parseFloat(i) / 3.6).toFixed(6).replace(/\.?0+$/, ''),
  'kwh→megajoules': (i) => (parseFloat(i) * 3.6).toFixed(4).replace(/\.?0+$/, ''),
  'megajoules→kcal': (i) => (parseFloat(i) * 239.006).toFixed(2).replace(/\.?0+$/, ''),
  'kcal→megajoules': (i) => (parseFloat(i) / 239.006).toFixed(6).replace(/\.?0+$/, ''),
  'megajoules→btu': (i) => (parseFloat(i) * 947.817).toFixed(2).replace(/\.?0+$/, ''),
  'btu→megajoules': (i) => (parseFloat(i) / 947.817).toFixed(6).replace(/\.?0+$/, ''),

  // pressure conversions
  'psi→bar': (i) => (parseFloat(i) * 0.0689476).toFixed(4).replace(/\.?0+$/, ''),
  'bar→psi': (i) => (parseFloat(i) / 0.0689476).toFixed(4).replace(/\.?0+$/, ''),
  'psi→atm': (i) => (parseFloat(i) * 0.068046).toFixed(4).replace(/\.?0+$/, ''),
  'atm→psi': (i) => (parseFloat(i) / 0.068046).toFixed(4).replace(/\.?0+$/, ''),
  'psi→pascal': (i) => (parseFloat(i) * 6894.76).toFixed(2).replace(/\.?0+$/, ''),
  'pascal→psi': (i) => (parseFloat(i) / 6894.76).toFixed(6).replace(/\.?0+$/, ''),
  'psi→mmhg': (i) => (parseFloat(i) * 51.7149).toFixed(4).replace(/\.?0+$/, ''),
  'mmhg→psi': (i) => (parseFloat(i) / 51.7149).toFixed(4).replace(/\.?0+$/, ''),
  'bar→atm': (i) => (parseFloat(i) * 0.986923).toFixed(4).replace(/\.?0+$/, ''),
  'atm→bar': (i) => (parseFloat(i) / 0.986923).toFixed(4).replace(/\.?0+$/, ''),
  'bar→pascal': (i) => (parseFloat(i) * 100000).toFixed(2).replace(/\.?0+$/, ''),
  'pascal→bar': (i) => (parseFloat(i) / 100000).toFixed(6).replace(/\.?0+$/, ''),
  'bar→mmhg': (i) => (parseFloat(i) * 750.062).toFixed(4).replace(/\.?0+$/, ''),
  'mmhg→bar': (i) => (parseFloat(i) / 750.062).toFixed(6).replace(/\.?0+$/, ''),
  'atm→pascal': (i) => (parseFloat(i) * 101325).toFixed(2).replace(/\.?0+$/, ''),
  'pascal→atm': (i) => (parseFloat(i) / 101325).toFixed(8).replace(/\.?0+$/, ''),
  'atm→mmhg': (i) => (parseFloat(i) * 760).toFixed(4).replace(/\.?0+$/, ''),
  'mmhg→atm': (i) => (parseFloat(i) / 760).toFixed(6).replace(/\.?0+$/, ''),
  'pascal→mmhg': (i) => (parseFloat(i) * 0.00750062).toFixed(4).replace(/\.?0+$/, ''),
  'mmhg→pascal': (i) => (parseFloat(i) / 0.00750062).toFixed(2).replace(/\.?0+$/, ''),

  // angle conversions
  'degrees→radians': (i) => (parseFloat(i) * Math.PI / 180).toFixed(6).replace(/\.?0+$/, ''),
  'radians→degrees': (i) => (parseFloat(i) * 180 / Math.PI).toFixed(4).replace(/\.?0+$/, ''),
  'degrees→gradians': (i) => (parseFloat(i) * 10 / 9).toFixed(4).replace(/\.?0+$/, ''),
  'gradians→degrees': (i) => (parseFloat(i) * 9 / 10).toFixed(4).replace(/\.?0+$/, ''),
  'radians→gradians': (i) => (parseFloat(i) * 200 / Math.PI).toFixed(4).replace(/\.?0+$/, ''),
  'gradians→radians': (i) => (parseFloat(i) * Math.PI / 200).toFixed(6).replace(/\.?0+$/, ''),
  'turns→degrees': (i) => (parseFloat(i) * 360).toFixed(4).replace(/\.?0+$/, ''),
  'degrees→turns': (i) => (parseFloat(i) / 360).toFixed(6).replace(/\.?0+$/, ''),
  'turns→radians': (i) => (parseFloat(i) * 2 * Math.PI).toFixed(6).replace(/\.?0+$/, ''),
  'radians→turns': (i) => (parseFloat(i) / (2 * Math.PI)).toFixed(6).replace(/\.?0+$/, ''),
  'turns→gradians': (i) => (parseFloat(i) * 400).toFixed(4).replace(/\.?0+$/, ''),
  'gradians→turns': (i) => (parseFloat(i) / 400).toFixed(6).replace(/\.?0+$/, ''),

  // extended data size conversions (TB, PB)
  'gigabytes→terabytes': (i) => (parseFloat(i) / 1024).toFixed(6).replace(/\.?0+$/, ''),
  'terabytes→gigabytes': (i) => (parseFloat(i) * 1024).toFixed(2).replace(/\.?0+$/, ''),
  'terabytes→petabytes': (i) => (parseFloat(i) / 1024).toFixed(8).replace(/\.?0+$/, ''),
  'petabytes→terabytes': (i) => (parseFloat(i) * 1024).toFixed(2).replace(/\.?0+$/, ''),
  'megabytes→terabytes': (i) => (parseFloat(i) / 1048576).toFixed(8).replace(/\.?0+$/, ''),
  'terabytes→megabytes': (i) => (parseFloat(i) * 1048576).toFixed(2).replace(/\.?0+$/, ''),
  'kilobytes→terabytes': (i) => (parseFloat(i) / 1073741824).toFixed(10).replace(/\.?0+$/, ''),
  'terabytes→kilobytes': (i) => (parseFloat(i) * 1073741824).toFixed(0),
  'bytes→terabytes': (i) => (parseFloat(i) / 1099511627776).toFixed(12).replace(/\.?0+$/, ''),
  'terabytes→bytes': (i) => (parseFloat(i) * 1099511627776).toFixed(0),
  'megabytes→petabytes': (i) => (parseFloat(i) / 1073741824).toFixed(10).replace(/\.?0+$/, ''),
  'petabytes→megabytes': (i) => (parseFloat(i) * 1073741824).toFixed(0),
  'gigabytes→petabytes': (i) => (parseFloat(i) / 1048576).toFixed(8).replace(/\.?0+$/, ''),
  'petabytes→gigabytes': (i) => (parseFloat(i) * 1048576).toFixed(2).replace(/\.?0+$/, ''),
  'bytes→petabytes': (i) => (parseFloat(i) / 1125899906842624).toFixed(15).replace(/\.?0+$/, ''),
  'petabytes→bytes': (i) => (parseFloat(i) * 1125899906842624).toFixed(0),
  'kilobytes→petabytes': (i) => (parseFloat(i) / 1099511627776).toFixed(12).replace(/\.?0+$/, ''),
  'petabytes→kilobytes': (i) => (parseFloat(i) * 1099511627776).toFixed(0),

  // frequency conversions
  'hz→khz': (i) => (parseFloat(i) / 1000).toFixed(4).replace(/\.?0+$/, ''),
  'khz→hz': (i) => (parseFloat(i) * 1000).toFixed(2).replace(/\.?0+$/, ''),
  'hz→mhz': (i) => (parseFloat(i) / 1000000).toFixed(6).replace(/\.?0+$/, ''),
  'mhz→hz': (i) => (parseFloat(i) * 1000000).toFixed(0),
  'hz→ghz': (i) => (parseFloat(i) / 1000000000).toFixed(9).replace(/\.?0+$/, ''),
  'ghz→hz': (i) => (parseFloat(i) * 1000000000).toFixed(0),
  'khz→mhz': (i) => (parseFloat(i) / 1000).toFixed(4).replace(/\.?0+$/, ''),
  'mhz→khz': (i) => (parseFloat(i) * 1000).toFixed(2).replace(/\.?0+$/, ''),
  'khz→ghz': (i) => (parseFloat(i) / 1000000).toFixed(6).replace(/\.?0+$/, ''),
  'ghz→khz': (i) => (parseFloat(i) * 1000000).toFixed(2).replace(/\.?0+$/, ''),
  'mhz→ghz': (i) => (parseFloat(i) / 1000).toFixed(4).replace(/\.?0+$/, ''),
  'ghz→mhz': (i) => (parseFloat(i) * 1000).toFixed(2).replace(/\.?0+$/, ''),

  // power conversions
  'watts→kilowatts': (i) => (parseFloat(i) / 1000).toFixed(4).replace(/\.?0+$/, ''),
  'kilowatts→watts': (i) => (parseFloat(i) * 1000).toFixed(2).replace(/\.?0+$/, ''),
  'watts→horsepower': (i) => (parseFloat(i) / 745.7).toFixed(4).replace(/\.?0+$/, ''),
  'horsepower→watts': (i) => (parseFloat(i) * 745.7).toFixed(2).replace(/\.?0+$/, ''),
  'watts→btuh': (i) => (parseFloat(i) * 3.41214).toFixed(4).replace(/\.?0+$/, ''),
  'btuh→watts': (i) => (parseFloat(i) / 3.41214).toFixed(4).replace(/\.?0+$/, ''),
  'kilowatts→horsepower': (i) => (parseFloat(i) * 1.34102).toFixed(4).replace(/\.?0+$/, ''),
  'horsepower→kilowatts': (i) => (parseFloat(i) / 1.34102).toFixed(4).replace(/\.?0+$/, ''),
  'kilowatts→btuh': (i) => (parseFloat(i) * 3412.14).toFixed(2).replace(/\.?0+$/, ''),
  'btuh→kilowatts': (i) => (parseFloat(i) / 3412.14).toFixed(6).replace(/\.?0+$/, ''),
  'horsepower→btuh': (i) => (parseFloat(i) * 2544.43).toFixed(2).replace(/\.?0+$/, ''),
  'btuh→horsepower': (i) => (parseFloat(i) / 2544.43).toFixed(6).replace(/\.?0+$/, ''),

  // fuel economy conversions
  'mpg→kml': (i) => (parseFloat(i) * 0.425144).toFixed(4).replace(/\.?0+$/, ''),
  'kml→mpg': (i) => (parseFloat(i) / 0.425144).toFixed(4).replace(/\.?0+$/, ''),
  'mpg→l100km': (i) => (235.215 / parseFloat(i)).toFixed(4).replace(/\.?0+$/, ''),
  'l100km→mpg': (i) => (235.215 / parseFloat(i)).toFixed(4).replace(/\.?0+$/, ''),
  'kml→l100km': (i) => (100 / parseFloat(i)).toFixed(4).replace(/\.?0+$/, ''),
  'l100km→kml': (i) => (100 / parseFloat(i)).toFixed(4).replace(/\.?0+$/, ''),

  // data transfer rate conversions
  'bps→kbps': (i) => (parseFloat(i) / 1000).toFixed(4).replace(/\.?0+$/, ''),
  'kbps→bps': (i) => (parseFloat(i) * 1000).toFixed(0),
  'bps→mbps': (i) => (parseFloat(i) / 1000000).toFixed(6).replace(/\.?0+$/, ''),
  'mbps→bps': (i) => (parseFloat(i) * 1000000).toFixed(0),
  'bps→gbps': (i) => (parseFloat(i) / 1000000000).toFixed(9).replace(/\.?0+$/, ''),
  'gbps→bps': (i) => (parseFloat(i) * 1000000000).toFixed(0),
  'kbps→mbps': (i) => (parseFloat(i) / 1000).toFixed(4).replace(/\.?0+$/, ''),
  'mbps→kbps': (i) => (parseFloat(i) * 1000).toFixed(2).replace(/\.?0+$/, ''),
  'kbps→gbps': (i) => (parseFloat(i) / 1000000).toFixed(6).replace(/\.?0+$/, ''),
  'gbps→kbps': (i) => (parseFloat(i) * 1000000).toFixed(2).replace(/\.?0+$/, ''),
  'mbps→gbps': (i) => (parseFloat(i) / 1000).toFixed(4).replace(/\.?0+$/, ''),
  'gbps→mbps': (i) => (parseFloat(i) * 1000).toFixed(2).replace(/\.?0+$/, ''),
  'gbps→tbps': (i) => (parseFloat(i) / 1000).toFixed(6).replace(/\.?0+$/, ''),
  'tbps→gbps': (i) => (parseFloat(i) * 1000).toFixed(2).replace(/\.?0+$/, ''),
  'mbps→tbps': (i) => (parseFloat(i) / 1000000).toFixed(8).replace(/\.?0+$/, ''),
  'tbps→mbps': (i) => (parseFloat(i) * 1000000).toFixed(2).replace(/\.?0+$/, ''),
  'kbps→tbps': (i) => (parseFloat(i) / 1000000000).toFixed(12).replace(/\.?0+$/, ''),
  'tbps→kbps': (i) => (parseFloat(i) * 1000000000).toFixed(0),
  'bps→tbps': (i) => (parseFloat(i) / 1000000000000).toFixed(14).replace(/\.?0+$/, ''),
  'tbps→bps': (i) => (parseFloat(i) * 1000000000000).toFixed(0),

  // cooking measurement conversions
  'tsp→tbsp': (i) => (parseFloat(i) / 3).toFixed(4).replace(/\.?0+$/, ''),
  'tbsp→tsp': (i) => (parseFloat(i) * 3).toFixed(2).replace(/\.?0+$/, ''),
  'tsp→cup-cook': (i) => (parseFloat(i) / 48).toFixed(4).replace(/\.?0+$/, ''),
  'cup-cook→tsp': (i) => (parseFloat(i) * 48).toFixed(2).replace(/\.?0+$/, ''),
  'tsp→ml': (i) => (parseFloat(i) * 4.92892).toFixed(4).replace(/\.?0+$/, ''),
  'ml→tsp': (i) => (parseFloat(i) / 4.92892).toFixed(4).replace(/\.?0+$/, ''),
  'tbsp→cup-cook': (i) => (parseFloat(i) / 16).toFixed(4).replace(/\.?0+$/, ''),
  'cup-cook→tbsp': (i) => (parseFloat(i) * 16).toFixed(2).replace(/\.?0+$/, ''),
  'tbsp→ml': (i) => (parseFloat(i) * 14.7868).toFixed(4).replace(/\.?0+$/, ''),
  'ml→tbsp': (i) => (parseFloat(i) / 14.7868).toFixed(4).replace(/\.?0+$/, ''),
  'cup-cook→ml': (i) => (parseFloat(i) * 236.588).toFixed(2).replace(/\.?0+$/, ''),
  'ml→cup-cook': (i) => (parseFloat(i) / 236.588).toFixed(4).replace(/\.?0+$/, ''),

  // toml → querystring
  'toml→querystring': (i) => {
    const obj = parseToml(i)
    const p = new URLSearchParams()
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v !== 'object') p.set(k, String(v))
    }
    return p.toString()
  },

  // json-min ↔ xml
  'json-min→xml': (i) => {
    const obj = JSON.parse(i)
    function toXml(val, tag) {
      if (val === null || val === undefined) return `<${tag}/>`
      if (Array.isArray(val)) return val.map(item => toXml(item, tag)).join('\n')
      if (typeof val === 'object') { const ch = Object.entries(val).map(([k, v]) => toXml(v, k)).join('\n  '); return `<${tag}>\n  ${ch}\n</${tag}>` }
      return `<${tag}>${String(val).replace(/&/g, '&amp;').replace(/</g, '&lt;')}</${tag}>`
    }
    const keys = Object.keys(obj)
    if (keys.length === 1) return '<?xml version="1.0"?>\n' + toXml(obj[keys[0]], keys[0])
    return '<?xml version="1.0"?>\n' + toXml(obj, 'root')
  },
  'xml→json-min': (i) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(i, 'text/xml')
    if (doc.querySelector('parsererror')) throw new Error('invalid XML')
    function toObj(node) {
      const obj = {}
      if (node.attributes) for (const a of node.attributes) obj['@' + a.name] = a.value
      for (const ch of node.childNodes) {
        if (ch.nodeType === 3) { const t = ch.textContent.trim(); if (t) { if (!Object.keys(obj).length) return t; obj['#text'] = t } }
        else if (ch.nodeType === 1) { const v = toObj(ch); if (obj[ch.nodeName]) { if (!Array.isArray(obj[ch.nodeName])) obj[ch.nodeName] = [obj[ch.nodeName]]; obj[ch.nodeName].push(v) } else obj[ch.nodeName] = v }
      }
      return obj
    }
    return JSON.stringify({ [doc.documentElement.nodeName]: toObj(doc.documentElement) })
  },

  // csv ↔ xml
  'csv→xml': (i) => {
    const lines = i.trim().split('\n')
    const parseRow = line => { const r = []; let cur = '', inQ = false; for (let j = 0; j < line.length; j++) { const c = line[j]; if (inQ) { if (c === '"' && line[j+1] === '"') { cur += '"'; j++ } else if (c === '"') inQ = false; else cur += c } else { if (c === '"') inQ = true; else if (c === ',') { r.push(cur); cur = '' } else cur += c } } r.push(cur); return r }
    const headers = parseRow(lines[0])
    const rows = lines.slice(1).map(l => {
      const v = parseRow(l)
      return '  <row>\n' + headers.map((h, j) => `    <${h}>${(v[j] || '').replace(/&/g, '&amp;').replace(/</g, '&lt;')}</${h}>`).join('\n') + '\n  </row>'
    })
    return '<?xml version="1.0"?>\n<data>\n' + rows.join('\n') + '\n</data>'
  },
  'xml→csv': (i) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(i, 'text/xml')
    if (doc.querySelector('parsererror')) throw new Error('invalid XML')
    const rows = doc.documentElement.children
    if (!rows.length) throw new Error('no data')
    const headers = [...rows[0].children].map(c => c.nodeName)
    const esc = v => { const s = String(v ?? ''); return /[,"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
    const dataRows = [...rows].map(row => headers.map(h => esc(row.querySelector(h)?.textContent || '')).join(','))
    return [headers.join(','), ...dataRows].join('\n')
  },

  // html → markdown (basic reverse)
  'html-markup→markdown': (i) => {
    let m = i
    m = m.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1')
    m = m.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1')
    m = m.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1')
    m = m.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1')
    m = m.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    m = m.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
    m = m.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    m = m.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
    m = m.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
    m = m.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    m = m.replace(/<br\s*\/?>/gi, '\n')
    m = m.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n')
    m = m.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1')
    m = m.replace(/<\/?[^>]+>/g, '')
    m = m.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    return m.trim()
  },

  // plain → html (wrap paragraphs)
  'plain→html-markup': (i) => i.split(/\n\n+/).map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('\n'),

  // color conversions
  'color-hex→color-rgb': (i) => { const rgb = hexToRgb(i.trim()); if (!rgb) throw new Error('bad hex'); return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
  'color-hex→color-hsl': (i) => { const rgb = hexToRgb(i.trim()); if (!rgb) throw new Error('bad hex'); const hsl = rgbToHsl(rgb); return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
  'color-rgb→color-hex': (i) => { const rgb = parseRgb(i); if (!rgb) throw new Error('bad rgb'); return '#' + [rgb.r, rgb.g, rgb.b].map(c => c.toString(16).padStart(2, '0')).join('') },
  'color-rgb→color-hsl': (i) => { const rgb = parseRgb(i); if (!rgb) throw new Error('bad rgb'); const hsl = rgbToHsl(rgb); return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
  'color-hsl→color-hex': (i) => { const hsl = parseHsl(i); if (!hsl) throw new Error('bad hsl'); const rgb = hslToRgb(hsl); return '#' + [rgb.r, rgb.g, rgb.b].map(c => c.toString(16).padStart(2, '0')).join('') },
  'color-hsl→color-rgb': (i) => { const hsl = parseHsl(i); if (!hsl) throw new Error('bad hsl'); const rgb = hslToRgb(hsl); return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },

  // color-hsv conversions
  'color-hex→color-hsv': (i) => { const rgb = hexToRgb(i.trim()); if (!rgb) throw new Error('bad hex'); const hsv = rgbToHsv(rgb); return `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)` },
  'color-rgb→color-hsv': (i) => { const rgb = parseRgb(i); if (!rgb) throw new Error('bad rgb'); const hsv = rgbToHsv(rgb); return `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)` },
  'color-hsl→color-hsv': (i) => { const hsl = parseHsl(i); if (!hsl) throw new Error('bad hsl'); const rgb = hslToRgb(hsl); const hsv = rgbToHsv(rgb); return `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)` },
  'color-hsv→color-hex': (i) => { const hsv = parseHsv(i); if (!hsv) throw new Error('bad hsv'); const rgb = hsvToRgb(hsv); return '#' + [rgb.r, rgb.g, rgb.b].map(c => c.toString(16).padStart(2, '0')).join('') },
  'color-hsv→color-rgb': (i) => { const hsv = parseHsv(i); if (!hsv) throw new Error('bad hsv'); const rgb = hsvToRgb(hsv); return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
  'color-hsv→color-hsl': (i) => { const hsv = parseHsv(i); if (!hsv) throw new Error('bad hsv'); const rgb = hsvToRgb(hsv); const hsl = rgbToHsl(rgb); return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },

  // CMYK color conversions
  'color-hex→color-cmyk': (i) => {
    const rgb = hexToRgb(i.trim()); if (!rgb) throw new Error('bad hex')
    const r = rgb.r/255, g = rgb.g/255, b = rgb.b/255
    const k = 1 - Math.max(r, g, b)
    if (k === 1) return 'cmyk(0%, 0%, 0%, 100%)'
    const c = (1-r-k)/(1-k), m = (1-g-k)/(1-k), y = (1-b-k)/(1-k)
    return `cmyk(${Math.round(c*100)}%, ${Math.round(m*100)}%, ${Math.round(y*100)}%, ${Math.round(k*100)}%)`
  },
  'color-cmyk→color-hex': (i) => {
    const m = i.match(/cmyk\(\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*\)/i)
    if (!m) throw new Error('bad cmyk')
    const [c,mg,y,k] = [m[1],m[2],m[3],m[4]].map(v => parseFloat(v)/100)
    const r = Math.round(255*(1-c)*(1-k)), g = Math.round(255*(1-mg)*(1-k)), b = Math.round(255*(1-y)*(1-k))
    return '#' + [r,g,b].map(v => Math.max(0,Math.min(255,v)).toString(16).padStart(2,'0')).join('')
  },
  'color-rgb→color-cmyk': (i) => {
    const rgb = parseRgb(i); if (!rgb) throw new Error('bad rgb')
    const r = rgb.r/255, g = rgb.g/255, b = rgb.b/255
    const k = 1 - Math.max(r, g, b)
    if (k === 1) return 'cmyk(0%, 0%, 0%, 100%)'
    const c = (1-r-k)/(1-k), m = (1-g-k)/(1-k), y = (1-b-k)/(1-k)
    return `cmyk(${Math.round(c*100)}%, ${Math.round(m*100)}%, ${Math.round(y*100)}%, ${Math.round(k*100)}%)`
  },
  'color-cmyk→color-rgb': (i) => {
    const m = i.match(/cmyk\(\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*\)/i)
    if (!m) throw new Error('bad cmyk')
    const [c,mg,y,k] = [m[1],m[2],m[3],m[4]].map(v => parseFloat(v)/100)
    const r = Math.round(255*(1-c)*(1-k)), g = Math.round(255*(1-mg)*(1-k)), b = Math.round(255*(1-y)*(1-k))
    return `rgb(${Math.max(0,Math.min(255,r))}, ${Math.max(0,Math.min(255,g))}, ${Math.max(0,Math.min(255,b))})`
  },
  'color-cmyk→color-hsl': (i) => {
    const m = i.match(/cmyk\(\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*\)/i)
    if (!m) throw new Error('bad cmyk')
    const [c,mg,y,k] = [m[1],m[2],m[3],m[4]].map(v => parseFloat(v)/100)
    const rgb = { r: Math.round(255*(1-c)*(1-k)), g: Math.round(255*(1-mg)*(1-k)), b: Math.round(255*(1-y)*(1-k)) }
    const hsl = rgbToHsl(rgb); return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
  },
  'color-hsl→color-cmyk': (i) => {
    const hsl = parseHsl(i); if (!hsl) throw new Error('bad hsl')
    const rgb = hslToRgb(hsl)
    const r = rgb.r/255, g = rgb.g/255, b = rgb.b/255
    const k = 1 - Math.max(r, g, b)
    if (k === 1) return 'cmyk(0%, 0%, 0%, 100%)'
    const c = (1-r-k)/(1-k), m = (1-g-k)/(1-k), y = (1-b-k)/(1-k)
    return `cmyk(${Math.round(c*100)}%, ${Math.round(m*100)}%, ${Math.round(y*100)}%, ${Math.round(k*100)}%)`
  },

  // cooking: pints, quarts, fluid oz (1 cup = 2 pints? No: 1 cup = 0.5 pint, 1 quart = 2 cups, 1 fl oz = 2 tbsp)
  // 1 tsp = 1/3 tbsp, 1 tbsp = 3 tsp, 1 cup = 16 tbsp = 48 tsp = 8 fl oz = 0.5 pint = 0.25 quart
  // 1 fl oz = 2 tbsp = 6 tsp = 29.5735 ml
  'tsp→floz-cook': (i) => (parseFloat(i) / 6).toFixed(4).replace(/\.?0+$/, ''),
  'floz-cook→tsp': (i) => (parseFloat(i) * 6).toFixed(2).replace(/\.?0+$/, ''),
  'tbsp→floz-cook': (i) => (parseFloat(i) / 2).toFixed(4).replace(/\.?0+$/, ''),
  'floz-cook→tbsp': (i) => (parseFloat(i) * 2).toFixed(2).replace(/\.?0+$/, ''),
  'cup-cook→floz-cook': (i) => (parseFloat(i) * 8).toFixed(2).replace(/\.?0+$/, ''),
  'floz-cook→cup-cook': (i) => (parseFloat(i) / 8).toFixed(4).replace(/\.?0+$/, ''),
  'floz-cook→ml': (i) => (parseFloat(i) * 29.5735).toFixed(2).replace(/\.?0+$/, ''),
  'ml→floz-cook': (i) => (parseFloat(i) / 29.5735).toFixed(4).replace(/\.?0+$/, ''),
  'pint-cook→cup-cook': (i) => (parseFloat(i) * 2).toFixed(2).replace(/\.?0+$/, ''),
  'cup-cook→pint-cook': (i) => (parseFloat(i) / 2).toFixed(4).replace(/\.?0+$/, ''),
  'pint-cook→floz-cook': (i) => (parseFloat(i) * 16).toFixed(2).replace(/\.?0+$/, ''),
  'floz-cook→pint-cook': (i) => (parseFloat(i) / 16).toFixed(4).replace(/\.?0+$/, ''),
  'pint-cook→ml': (i) => (parseFloat(i) * 473.176).toFixed(2).replace(/\.?0+$/, ''),
  'ml→pint-cook': (i) => (parseFloat(i) / 473.176).toFixed(4).replace(/\.?0+$/, ''),
  'qt-cook→pint-cook': (i) => (parseFloat(i) * 2).toFixed(2).replace(/\.?0+$/, ''),
  'pint-cook→qt-cook': (i) => (parseFloat(i) / 2).toFixed(4).replace(/\.?0+$/, ''),
  'qt-cook→cup-cook': (i) => (parseFloat(i) * 4).toFixed(2).replace(/\.?0+$/, ''),
  'cup-cook→qt-cook': (i) => (parseFloat(i) / 4).toFixed(4).replace(/\.?0+$/, ''),
  'qt-cook→ml': (i) => (parseFloat(i) * 946.353).toFixed(2).replace(/\.?0+$/, ''),
  'ml→qt-cook': (i) => (parseFloat(i) / 946.353).toFixed(4).replace(/\.?0+$/, ''),
  'qt-cook→floz-cook': (i) => (parseFloat(i) * 32).toFixed(2).replace(/\.?0+$/, ''),
  'floz-cook→qt-cook': (i) => (parseFloat(i) / 32).toFixed(4).replace(/\.?0+$/, ''),

  // KiB ↔ megabytes (new — other kib conversions already exist in data size section)
  'kib→megabytes': (i) => (parseFloat(i) / 976.5625).toFixed(6).replace(/\.?0+$/, ''),
  'megabytes→kib': (i) => (parseFloat(i) * 976.5625).toFixed(2).replace(/\.?0+$/, ''),

  // Length: micrometers, nanometers
  'meters→micrometers': (i) => (parseFloat(i) * 1e6).toExponential(4).replace(/\.?0+e/, 'e'),
  'micrometers→meters': (i) => (parseFloat(i) * 1e-6).toExponential(4).replace(/\.?0+e/, 'e'),
  'mm→micrometers': (i) => (parseFloat(i) * 1000).toFixed(2).replace(/\.?0+$/, ''),
  'micrometers→mm': (i) => (parseFloat(i) / 1000).toFixed(6).replace(/\.?0+$/, ''),
  'cm→micrometers': (i) => (parseFloat(i) * 10000).toFixed(2).replace(/\.?0+$/, ''),
  'micrometers→cm': (i) => (parseFloat(i) / 10000).toFixed(6).replace(/\.?0+$/, ''),
  'inches→micrometers': (i) => (parseFloat(i) * 25400).toFixed(2).replace(/\.?0+$/, ''),
  'micrometers→inches': (i) => (parseFloat(i) / 25400).toFixed(6).replace(/\.?0+$/, ''),
  'micrometers→nanometers': (i) => (parseFloat(i) * 1000).toFixed(2).replace(/\.?0+$/, ''),
  'nanometers→micrometers': (i) => (parseFloat(i) / 1000).toFixed(6).replace(/\.?0+$/, ''),
  'mm→nanometers': (i) => (parseFloat(i) * 1e6).toFixed(0),
  'nanometers→mm': (i) => (parseFloat(i) * 1e-6).toFixed(8).replace(/\.?0+$/, ''),
  'nanometers→meters': (i) => (parseFloat(i) * 1e-9).toExponential(4),
  'meters→nanometers': (i) => (parseFloat(i) * 1e9).toExponential(4),
  'nanometers→cm': (i) => (parseFloat(i) * 1e-7).toExponential(4),
  'cm→nanometers': (i) => (parseFloat(i) * 1e7).toExponential(4),
  'nanometers→inches': (i) => (parseFloat(i) / 25400000).toExponential(4),
  'inches→nanometers': (i) => (parseFloat(i) * 25400000).toExponential(4),

  // Distance: light-years, AU
  'light-year→km': (i) => (parseFloat(i) * 9.461e12).toExponential(4),
  'km→light-year': (i) => (parseFloat(i) / 9.461e12).toExponential(4),
  'light-year→miles': (i) => (parseFloat(i) * 5.879e12).toExponential(4),
  'miles→light-year': (i) => (parseFloat(i) / 5.879e12).toExponential(4),
  'light-year→au': (i) => (parseFloat(i) * 63241.1).toFixed(1),
  'au→light-year': (i) => (parseFloat(i) / 63241.1).toExponential(6),
  'au→km': (i) => (parseFloat(i) * 1.496e8).toExponential(4),
  'km→au': (i) => (parseFloat(i) / 1.496e8).toExponential(6),
  'au→miles': (i) => (parseFloat(i) * 9.296e7).toExponential(4),
  'miles→au': (i) => (parseFloat(i) / 9.296e7).toExponential(6),
  'light-year→meters': (i) => (parseFloat(i) * 9.461e15).toExponential(4),
  'meters→light-year': (i) => (parseFloat(i) / 9.461e15).toExponential(6),
  'au→meters': (i) => (parseFloat(i) * 1.496e11).toExponential(4),
  'meters→au': (i) => (parseFloat(i) / 1.496e11).toExponential(6),
  'au→yards': (i) => (parseFloat(i) * 1.636e11).toExponential(4),
  'yards→au': (i) => (parseFloat(i) / 1.636e11).toExponential(6),

  // Weight: milligrams, micrograms, carats
  'oz→carats': (i) => (parseFloat(i) * 141.748).toFixed(3).replace(/\.?0+$/, ''),
  'carats→oz': (i) => (parseFloat(i) / 141.748).toFixed(6).replace(/\.?0+$/, ''),
  'milligrams→carats': (i) => (parseFloat(i) / 200).toFixed(6).replace(/\.?0+$/, ''),
  'carats→milligrams': (i) => (parseFloat(i) * 200).toFixed(2).replace(/\.?0+$/, ''),
  'micrograms→oz': (i) => (parseFloat(i) / 28349523.1).toExponential(4),
  'oz→micrograms': (i) => (parseFloat(i) * 28349523.1).toExponential(4),
  'micrograms→kg': (i) => (parseFloat(i) * 1e-9).toExponential(4),
  'kg→micrograms': (i) => (parseFloat(i) * 1e9).toExponential(4),

  // Cooking: US gallon
  'gallon-us→cup-cook': (i) => (parseFloat(i) * 16).toFixed(2).replace(/\.?0+$/, ''),
  'cup-cook→gallon-us': (i) => (parseFloat(i) / 16).toFixed(4).replace(/\.?0+$/, ''),
  'gallon-us→floz-cook': (i) => (parseFloat(i) * 128).toFixed(2).replace(/\.?0+$/, ''),
  'floz-cook→gallon-us': (i) => (parseFloat(i) / 128).toFixed(6).replace(/\.?0+$/, ''),
  'gallon-us→ml': (i) => (parseFloat(i) * 3785.41).toFixed(2).replace(/\.?0+$/, ''),
  'ml→gallon-us': (i) => (parseFloat(i) / 3785.41).toFixed(6).replace(/\.?0+$/, ''),
  'gallon-us→pint-cook': (i) => (parseFloat(i) * 8).toFixed(2).replace(/\.?0+$/, ''),
  'pint-cook→gallon-us': (i) => (parseFloat(i) / 8).toFixed(4).replace(/\.?0+$/, ''),
  'gallon-us→qt-cook': (i) => (parseFloat(i) * 4).toFixed(2).replace(/\.?0+$/, ''),
  'qt-cook→gallon-us': (i) => (parseFloat(i) / 4).toFixed(4).replace(/\.?0+$/, ''),
  'gallon-us→liters': (i) => (parseFloat(i) * 3.78541).toFixed(4).replace(/\.?0+$/, ''),
  'liters→gallon-us': (i) => (parseFloat(i) / 3.78541).toFixed(4).replace(/\.?0+$/, ''),

  // Power: BTU/hr and cal/sec connections
  'watts→btu-per-hr': (i) => (parseFloat(i) * 3.41214).toFixed(4).replace(/\.?0+$/, ''),
  'btu-per-hr→watts': (i) => (parseFloat(i) / 3.41214).toFixed(4).replace(/\.?0+$/, ''),
  'horsepower→btu-per-hr': (i) => (parseFloat(i) * 2544.43).toFixed(2).replace(/\.?0+$/, ''),
  'btu-per-hr→horsepower': (i) => (parseFloat(i) / 2544.43).toFixed(6).replace(/\.?0+$/, ''),
  'kilowatts→btu-per-hr': (i) => (parseFloat(i) * 3412.14).toFixed(2).replace(/\.?0+$/, ''),
  'btu-per-hr→kilowatts': (i) => (parseFloat(i) / 3412.14).toFixed(6).replace(/\.?0+$/, ''),
  'watts→calories-per-sec': (i) => (parseFloat(i) / 4.184).toFixed(4).replace(/\.?0+$/, ''),
  'calories-per-sec→watts': (i) => (parseFloat(i) * 4.184).toFixed(4).replace(/\.?0+$/, ''),
  'horsepower→calories-per-sec': (i) => (parseFloat(i) * 745.7 / 4.184).toFixed(4).replace(/\.?0+$/, ''),
  'calories-per-sec→horsepower': (i) => (parseFloat(i) * 4.184 / 745.7).toFixed(6).replace(/\.?0+$/, ''),

  // Frequency: RPM and radians/sec
  'hz→rpm': (i) => (parseFloat(i) * 60).toFixed(4).replace(/\.?0+$/, ''),
  'rpm→hz': (i) => (parseFloat(i) / 60).toFixed(6).replace(/\.?0+$/, ''),
  'hz→radians-per-sec': (i) => (parseFloat(i) * 2 * Math.PI).toFixed(4).replace(/\.?0+$/, ''),
  'radians-per-sec→hz': (i) => (parseFloat(i) / (2 * Math.PI)).toFixed(6).replace(/\.?0+$/, ''),
  'rpm→radians-per-sec': (i) => (parseFloat(i) * Math.PI / 30).toFixed(4).replace(/\.?0+$/, ''),
  'radians-per-sec→rpm': (i) => (parseFloat(i) * 30 / Math.PI).toFixed(4).replace(/\.?0+$/, ''),

  // Weight: troy ounce (1 troy oz = 31.1035 g)
  'troy-oz→kg': (i) => (parseFloat(i) * 0.0311035).toFixed(6).replace(/\.?0+$/, ''),
  'kg→troy-oz': (i) => (parseFloat(i) / 0.0311035).toFixed(4).replace(/\.?0+$/, ''),
  'troy-oz→milligrams': (i) => (parseFloat(i) * 31103.5).toFixed(2).replace(/\.?0+$/, ''),
  'milligrams→troy-oz': (i) => (parseFloat(i) / 31103.5).toFixed(8).replace(/\.?0+$/, ''),
  'troy-oz→carats': (i) => (parseFloat(i) * 155.517).toFixed(3).replace(/\.?0+$/, ''),
  'carats→troy-oz': (i) => (parseFloat(i) / 155.517).toFixed(6).replace(/\.?0+$/, ''),
  'troy-oz→lb': (i) => (parseFloat(i) * 0.0685714).toFixed(6).replace(/\.?0+$/, ''),
  'lb→troy-oz': (i) => (parseFloat(i) / 0.0685714).toFixed(4).replace(/\.?0+$/, ''),

  // Power: calories-per-sec ↔ kilowatts
  'calories-per-sec→kilowatts': (i) => (parseFloat(i) * 4.184 / 1000).toFixed(6).replace(/\.?0+$/, ''),
  'kilowatts→calories-per-sec': (i) => (parseFloat(i) * 1000 / 4.184).toFixed(4).replace(/\.?0+$/, ''),

  // Frequency: RPM ↔ Hz cross-connections
  'rpm→khz': (i) => (parseFloat(i) / 60000).toExponential(4),
  'khz→rpm': (i) => (parseFloat(i) * 60000).toFixed(2).replace(/\.?0+$/, ''),
  'radians-per-sec→khz': (i) => (parseFloat(i) / (2 * Math.PI * 1000)).toExponential(4),
  'khz→radians-per-sec': (i) => (parseFloat(i) * 2 * Math.PI * 1000).toFixed(4).replace(/\.?0+$/, ''),

  // Area: sqkm, sqmiles, sqinches, sqcm
  'sqm→sqkm': (i) => (parseFloat(i) / 1e6).toFixed(8).replace(/\.?0+$/, ''),
  'sqkm→sqm': (i) => (parseFloat(i) * 1e6).toFixed(0),
  'sqft→sqkm': (i) => (parseFloat(i) / 10763910.4).toFixed(10).replace(/\.?0+$/, ''),
  'sqkm→sqft': (i) => (parseFloat(i) * 10763910.4).toFixed(2).replace(/\.?0+$/, ''),
  'sqkm→acres': (i) => (parseFloat(i) * 247.105).toFixed(4).replace(/\.?0+$/, ''),
  'acres→sqkm': (i) => (parseFloat(i) / 247.105).toFixed(6).replace(/\.?0+$/, ''),
  'sqkm→hectares': (i) => (parseFloat(i) * 100).toFixed(4).replace(/\.?0+$/, ''),
  'hectares→sqkm': (i) => (parseFloat(i) / 100).toFixed(6).replace(/\.?0+$/, ''),
  'sqmiles→sqkm': (i) => (parseFloat(i) * 2.58999).toFixed(4).replace(/\.?0+$/, ''),
  'sqkm→sqmiles': (i) => (parseFloat(i) / 2.58999).toFixed(4).replace(/\.?0+$/, ''),
  'sqmiles→sqft': (i) => (parseFloat(i) * 27878400).toFixed(0),
  'sqft→sqmiles': (i) => (parseFloat(i) / 27878400).toFixed(8).replace(/\.?0+$/, ''),
  'sqmiles→acres': (i) => (parseFloat(i) * 640).toFixed(2).replace(/\.?0+$/, ''),
  'acres→sqmiles': (i) => (parseFloat(i) / 640).toFixed(6).replace(/\.?0+$/, ''),
  'sqmiles→sqm': (i) => (parseFloat(i) * 2589988.1).toFixed(2).replace(/\.?0+$/, ''),
  'sqm→sqmiles': (i) => (parseFloat(i) / 2589988.1).toFixed(8).replace(/\.?0+$/, ''),
  'sqinches→sqft': (i) => (parseFloat(i) / 144).toFixed(4).replace(/\.?0+$/, ''),
  'sqft→sqinches': (i) => (parseFloat(i) * 144).toFixed(2).replace(/\.?0+$/, ''),
  'sqinches→sqcm': (i) => (parseFloat(i) * 6.4516).toFixed(4).replace(/\.?0+$/, ''),
  'sqcm→sqinches': (i) => (parseFloat(i) / 6.4516).toFixed(4).replace(/\.?0+$/, ''),
  'sqcm→sqm': (i) => (parseFloat(i) / 10000).toFixed(6).replace(/\.?0+$/, ''),
  'sqm→sqcm': (i) => (parseFloat(i) * 10000).toFixed(2).replace(/\.?0+$/, ''),
  'sqinches→sqm': (i) => (parseFloat(i) / 1550).toFixed(6).replace(/\.?0+$/, ''),
  'sqm→sqinches': (i) => (parseFloat(i) * 1550).toFixed(2).replace(/\.?0+$/, ''),

  // Pressure: kPa, hPa
  'pascal→kpa': (i) => (parseFloat(i) / 1000).toFixed(6).replace(/\.?0+$/, ''),
  'kpa→pascal': (i) => (parseFloat(i) * 1000).toFixed(2).replace(/\.?0+$/, ''),
  'bar→kpa': (i) => (parseFloat(i) * 100).toFixed(2).replace(/\.?0+$/, ''),
  'kpa→bar': (i) => (parseFloat(i) / 100).toFixed(4).replace(/\.?0+$/, ''),
  'atm→kpa': (i) => (parseFloat(i) * 101.325).toFixed(4).replace(/\.?0+$/, ''),
  'kpa→atm': (i) => (parseFloat(i) / 101.325).toFixed(6).replace(/\.?0+$/, ''),
  'psi→kpa': (i) => (parseFloat(i) * 6.89476).toFixed(4).replace(/\.?0+$/, ''),
  'kpa→psi': (i) => (parseFloat(i) / 6.89476).toFixed(4).replace(/\.?0+$/, ''),
  'mmhg→kpa': (i) => (parseFloat(i) * 0.133322).toFixed(6).replace(/\.?0+$/, ''),
  'kpa→mmhg': (i) => (parseFloat(i) / 0.133322).toFixed(4).replace(/\.?0+$/, ''),
  'kpa→hpa': (i) => (parseFloat(i) * 10).toFixed(2).replace(/\.?0+$/, ''),
  'hpa→kpa': (i) => (parseFloat(i) / 10).toFixed(4).replace(/\.?0+$/, ''),
  'pascal→hpa': (i) => (parseFloat(i) / 100).toFixed(4).replace(/\.?0+$/, ''),
  'hpa→pascal': (i) => (parseFloat(i) * 100).toFixed(2).replace(/\.?0+$/, ''),
  'bar→hpa': (i) => (parseFloat(i) * 1000).toFixed(2).replace(/\.?0+$/, ''),
  'hpa→bar': (i) => (parseFloat(i) / 1000).toFixed(6).replace(/\.?0+$/, ''),
  'atm→hpa': (i) => (parseFloat(i) * 1013.25).toFixed(2).replace(/\.?0+$/, ''),
  'hpa→atm': (i) => (parseFloat(i) / 1013.25).toFixed(6).replace(/\.?0+$/, ''),
  'psi→hpa': (i) => (parseFloat(i) * 68.9476).toFixed(4).replace(/\.?0+$/, ''),
  'hpa→psi': (i) => (parseFloat(i) / 68.9476).toFixed(4).replace(/\.?0+$/, ''),
  'mmhg→hpa': (i) => (parseFloat(i) * 1.33322).toFixed(4).replace(/\.?0+$/, ''),
  'hpa→mmhg': (i) => (parseFloat(i) / 1.33322).toFixed(4).replace(/\.?0+$/, ''),

  // Angle: arcminutes, arcseconds
  'degrees→arcminutes': (i) => (parseFloat(i) * 60).toFixed(4).replace(/\.?0+$/, ''),
  'arcminutes→degrees': (i) => (parseFloat(i) / 60).toFixed(6).replace(/\.?0+$/, ''),
  'degrees→arcseconds': (i) => (parseFloat(i) * 3600).toFixed(4).replace(/\.?0+$/, ''),
  'arcseconds→degrees': (i) => (parseFloat(i) / 3600).toFixed(6).replace(/\.?0+$/, ''),
  'arcminutes→arcseconds': (i) => (parseFloat(i) * 60).toFixed(4).replace(/\.?0+$/, ''),
  'arcseconds→arcminutes': (i) => (parseFloat(i) / 60).toFixed(6).replace(/\.?0+$/, ''),
  'radians→arcminutes': (i) => (parseFloat(i) * 180 / Math.PI * 60).toFixed(4).replace(/\.?0+$/, ''),
  'arcminutes→radians': (i) => (parseFloat(i) / 60 * Math.PI / 180).toFixed(8).replace(/\.?0+$/, ''),
  'turns→arcminutes': (i) => (parseFloat(i) * 21600).toFixed(4).replace(/\.?0+$/, ''),
  'arcminutes→turns': (i) => (parseFloat(i) / 21600).toFixed(8).replace(/\.?0+$/, ''),

  // Volume: cubic meters, cubic feet
  'ml→cubic-m': (i) => (parseFloat(i) * 1e-6).toExponential(4),
  'cubic-m→ml': (i) => (parseFloat(i) * 1e6).toFixed(0),

  // Angle: arcseconds cross-connections
  'arcseconds→radians': (i) => (parseFloat(i) / 3600 * Math.PI / 180).toFixed(10).replace(/\.?0+$/, ''),
  'radians→arcseconds': (i) => (parseFloat(i) * 180 / Math.PI * 3600).toFixed(4).replace(/\.?0+$/, ''),
  'arcseconds→turns': (i) => (parseFloat(i) / 1296000).toFixed(10).replace(/\.?0+$/, ''),
  'turns→arcseconds': (i) => (parseFloat(i) * 1296000).toFixed(2).replace(/\.?0+$/, ''),
  'arcseconds→gradians': (i) => (parseFloat(i) / 3240).toFixed(6).replace(/\.?0+$/, ''),
  'gradians→arcseconds': (i) => (parseFloat(i) * 3240).toFixed(2).replace(/\.?0+$/, ''),

  // Area: sqcm cross-connections
  'sqcm→sqft': (i) => (parseFloat(i) / 929.03).toFixed(6).replace(/\.?0+$/, ''),
  'sqft→sqcm': (i) => (parseFloat(i) * 929.03).toFixed(4).replace(/\.?0+$/, ''),
  'sqcm→sqkm': (i) => (parseFloat(i) * 1e-10).toExponential(4),
  'sqkm→sqcm': (i) => (parseFloat(i) * 1e10).toExponential(4),
  'sqcm→hectares': (i) => (parseFloat(i) * 1e-8).toExponential(4),
  'hectares→sqcm': (i) => (parseFloat(i) * 1e8).toFixed(0),
  'sqcm→acres': (i) => (parseFloat(i) * 2.47105e-8).toExponential(4),
  'acres→sqcm': (i) => (parseFloat(i) / 2.47105e-8).toExponential(4),

  // Weight: stone cross-connections
  'stone→grams': (i) => (parseFloat(i) * 6350.29).toFixed(2).replace(/\.?0+$/, ''),
  'grams→stone': (i) => (parseFloat(i) / 6350.29).toFixed(6).replace(/\.?0+$/, ''),
  'stone→oz': (i) => (parseFloat(i) * 224).toFixed(2).replace(/\.?0+$/, ''),
  'oz→stone': (i) => (parseFloat(i) / 224).toFixed(6).replace(/\.?0+$/, ''),
  'stone→ton-metric': (i) => (parseFloat(i) * 0.00635029).toFixed(6).replace(/\.?0+$/, ''),
  'ton-metric→stone': (i) => (parseFloat(i) / 0.00635029).toFixed(4).replace(/\.?0+$/, ''),

  // Case format cross-connections
  'camelcase→snakecase': (i) => i.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, ''),
  'snakecase→camelcase': (i) => i.replace(/_([a-z])/g, (_, c) => c.toUpperCase()),
  'camelcase→kebabcase': (i) => i.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, ''),
  'kebabcase→camelcase': (i) => i.replace(/-([a-z])/g, (_, c) => c.toUpperCase()),
  'snakecase→kebabcase': (i) => i.replace(/_/g, '-'),
  'kebabcase→snakecase': (i) => i.replace(/-/g, '_'),
  'titlecase→camelcase': (i) => i.replace(/\s+(\w)/g, (_, c) => c.toUpperCase()).replace(/^\w/, c => c.toLowerCase()),
  'titlecase→snakecase': (i) => i.toLowerCase().replace(/\s+/g, '_'),
  'titlecase→kebabcase': (i) => i.toLowerCase().replace(/\s+/g, '-'),

  // Text: plain ↔ more formats
  'plain→lowercase': (i) => i.toLowerCase(),
  'plain→uppercase': (i) => i.toUpperCase(),
  'plain→titlecase': (i) => i.replace(/\b\w/g, c => c.toUpperCase()),

  // Roman numeral ↔ binary and hex
  'roman→binary': (i) => {
    const s = i.trim().toUpperCase()
    const vals = { M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1 }
    let n = 0, idx = 0
    for (const [sym, val] of Object.entries(vals)) { while (s.startsWith(sym, idx)) { n += val; idx += sym.length } }
    if (n === 0) return '(invalid roman numeral)'
    return n.toString(2)
  },
  'binary→roman': (i) => {
    const n = parseInt(i.trim(), 2)
    if (isNaN(n) || n <= 0 || n > 3999) return '(out of range for roman numerals: 1-3999)'
    const vals = [[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']]
    let r = '', rem = n
    for (const [v, s] of vals) { while (rem >= v) { r += s; rem -= v } }
    return r
  },

  // Force conversions
  'newtons→pound-force': (i) => (parseFloat(i) * 0.224809).toFixed(4).replace(/\.?0+$/, ''),
  'pound-force→newtons': (i) => (parseFloat(i) * 4.44822).toFixed(4).replace(/\.?0+$/, ''),
  'newtons→kg-force': (i) => (parseFloat(i) / 9.80665).toFixed(4).replace(/\.?0+$/, ''),
  'kg-force→newtons': (i) => (parseFloat(i) * 9.80665).toFixed(4).replace(/\.?0+$/, ''),
  'newtons→dyne': (i) => (parseFloat(i) * 100000).toFixed(2).replace(/\.?0+$/, ''),
  'dyne→newtons': (i) => (parseFloat(i) * 1e-5).toFixed(8).replace(/\.?0+$/, ''),
  'newtons→kilonewtons': (i) => (parseFloat(i) / 1000).toFixed(6).replace(/\.?0+$/, ''),
  'kilonewtons→newtons': (i) => (parseFloat(i) * 1000).toFixed(2).replace(/\.?0+$/, ''),
  'pound-force→kg-force': (i) => (parseFloat(i) * 0.453592).toFixed(4).replace(/\.?0+$/, ''),
  'kg-force→pound-force': (i) => (parseFloat(i) * 2.20462).toFixed(4).replace(/\.?0+$/, ''),
  'kilonewtons→pound-force': (i) => (parseFloat(i) * 224.809).toFixed(4).replace(/\.?0+$/, ''),
  'pound-force→kilonewtons': (i) => (parseFloat(i) / 224.809).toFixed(6).replace(/\.?0+$/, ''),
  'kilonewtons→kg-force': (i) => (parseFloat(i) * 101.972).toFixed(4).replace(/\.?0+$/, ''),
  'kg-force→kilonewtons': (i) => (parseFloat(i) / 101.972).toFixed(6).replace(/\.?0+$/, ''),

  // Illuminance conversions
  'lux→foot-candle': (i) => (parseFloat(i) * 0.0929).toFixed(4).replace(/\.?0+$/, ''),
  'foot-candle→lux': (i) => (parseFloat(i) * 10.7639).toFixed(4).replace(/\.?0+$/, ''),
  'lux→millilux': (i) => (parseFloat(i) * 1000).toFixed(2).replace(/\.?0+$/, ''),
  'millilux→lux': (i) => (parseFloat(i) / 1000).toFixed(6).replace(/\.?0+$/, ''),
  'foot-candle→millilux': (i) => (parseFloat(i) * 10763.9).toFixed(2).replace(/\.?0+$/, ''),
  'millilux→foot-candle': (i) => (parseFloat(i) / 10763.9).toFixed(8).replace(/\.?0+$/, ''),

  // Case format cross-connections
  'lowercase→titlecase': (i) => i.replace(/\b\w/g, c => c.toUpperCase()),
  'lowercase→snakecase': (i) => i.trim().replace(/\s+/g, '_'),
  'lowercase→kebabcase': (i) => i.trim().replace(/\s+/g, '-'),
  'lowercase→camelcase': (i) => i.replace(/\s+(\w)/g, (_, c) => c.toUpperCase()),
  'uppercase→titlecase': (i) => i.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()),
  'uppercase→snakecase': (i) => i.toLowerCase().replace(/\s+/g, '_'),
  'uppercase→kebabcase': (i) => i.toLowerCase().replace(/\s+/g, '-'),
  'snakecase→uppercase': (i) => i.toUpperCase(),
  'kebabcase→uppercase': (i) => i.toUpperCase().replace(/-/g, '_'),

  // Markdown → plain text (strip formatting)
  'markdown→text': (i) => i
    .replace(/#{1,6}\s+/g, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    .replace(/`{3}[\s\S]*?`{3}/g, '')
    .replace(/`(.+?)`/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/!\[.*?\]\(.+?\)/g, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/^>\s+/gm, '')
    .replace(/^[-*_]{3,}$/gm, '')
    .replace(/\n{3,}/g, '\n\n').trim(),

  // Plain text → identifier formats
  'plain→camelcase': (i) => i.trim().toLowerCase().replace(/[^a-z0-9]+(.)/g, (_, c) => c.toUpperCase()),
  'plain→snakecase': (i) => i.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''),
  'plain→kebabcase': (i) => i.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),

  // Typography: pt ↔ pica ↔ px ↔ inches ↔ mm ↔ cm (1in = 72pt = 6pica = 96px at 96DPI)
  'pt→pica': (i) => (parseFloat(i) / 12).toFixed(4).replace(/\.?0+$/, ''),
  'pica→pt': (i) => (parseFloat(i) * 12).toFixed(4).replace(/\.?0+$/, ''),
  'pt→px': (i) => (parseFloat(i) * 96 / 72).toFixed(4).replace(/\.?0+$/, ''),
  'px→pt': (i) => (parseFloat(i) * 72 / 96).toFixed(4).replace(/\.?0+$/, ''),
  'pt→inches': (i) => (parseFloat(i) / 72).toFixed(6).replace(/\.?0+$/, ''),
  'inches→pt': (i) => (parseFloat(i) * 72).toFixed(4).replace(/\.?0+$/, ''),
  'pt→mm': (i) => (parseFloat(i) * 25.4 / 72).toFixed(4).replace(/\.?0+$/, ''),
  'mm→pt': (i) => (parseFloat(i) * 72 / 25.4).toFixed(4).replace(/\.?0+$/, ''),
  'pt→cm': (i) => (parseFloat(i) * 2.54 / 72).toFixed(6).replace(/\.?0+$/, ''),
  'cm→pt': (i) => (parseFloat(i) * 72 / 2.54).toFixed(4).replace(/\.?0+$/, ''),
  'pica→inches': (i) => (parseFloat(i) / 6).toFixed(6).replace(/\.?0+$/, ''),
  'inches→pica': (i) => (parseFloat(i) * 6).toFixed(4).replace(/\.?0+$/, ''),
  'pica→px': (i) => (parseFloat(i) * 16).toFixed(2).replace(/\.?0+$/, ''),
  'px→pica': (i) => (parseFloat(i) / 16).toFixed(4).replace(/\.?0+$/, ''),
  'px→inches': (i) => (parseFloat(i) / 96).toFixed(6).replace(/\.?0+$/, ''),
  'inches→px': (i) => (parseFloat(i) * 96).toFixed(2).replace(/\.?0+$/, ''),
  'px→mm': (i) => (parseFloat(i) * 25.4 / 96).toFixed(4).replace(/\.?0+$/, ''),
  'mm→px': (i) => (parseFloat(i) * 96 / 25.4).toFixed(4).replace(/\.?0+$/, ''),
  'px→cm': (i) => (parseFloat(i) * 2.54 / 96).toFixed(6).replace(/\.?0+$/, ''),
  'cm→px': (i) => (parseFloat(i) * 96 / 2.54).toFixed(4).replace(/\.?0+$/, ''),

  // Density conversions (pivot: kg/m³)
  'kgm3→gcm3': (i) => (parseFloat(i) / 1000).toFixed(6).replace(/\.?0+$/, ''),
  'gcm3→kgm3': (i) => (parseFloat(i) * 1000).toFixed(2).replace(/\.?0+$/, ''),
  'kgm3→lbft3': (i) => (parseFloat(i) * 0.0624279).toFixed(4).replace(/\.?0+$/, ''),
  'lbft3→kgm3': (i) => (parseFloat(i) * 16.0185).toFixed(4).replace(/\.?0+$/, ''),
  'kgm3→lbgal': (i) => (parseFloat(i) * 0.00834540).toFixed(6).replace(/\.?0+$/, ''),
  'lbgal→kgm3': (i) => (parseFloat(i) * 119.826).toFixed(4).replace(/\.?0+$/, ''),
  'gcm3→lbft3': (i) => (parseFloat(i) * 62.4279).toFixed(4).replace(/\.?0+$/, ''),
  'lbft3→gcm3': (i) => (parseFloat(i) / 62.4279).toFixed(6).replace(/\.?0+$/, ''),
  'gcm3→lbgal': (i) => (parseFloat(i) * 8.34540).toFixed(4).replace(/\.?0+$/, ''),
  'lbgal→gcm3': (i) => (parseFloat(i) / 8.34540).toFixed(6).replace(/\.?0+$/, ''),
  'lbft3→lbgal': (i) => (parseFloat(i) / 7.48052).toFixed(6).replace(/\.?0+$/, ''),
  'lbgal→lbft3': (i) => (parseFloat(i) * 7.48052).toFixed(4).replace(/\.?0+$/, ''),

  // Electric Current conversions (pivot: ampere)
  'ampere→milliamp': (i) => (parseFloat(i) * 1000).toFixed(4).replace(/\.?0+$/, ''),
  'milliamp→ampere': (i) => (parseFloat(i) / 1000).toFixed(6).replace(/\.?0+$/, ''),
  'ampere→microamp': (i) => (parseFloat(i) * 1e6).toFixed(2).replace(/\.?0+$/, ''),
  'microamp→ampere': (i) => (parseFloat(i) * 1e-6).toFixed(9).replace(/\.?0+$/, ''),
  'ampere→kiloamp': (i) => (parseFloat(i) / 1000).toFixed(6).replace(/\.?0+$/, ''),
  'kiloamp→ampere': (i) => (parseFloat(i) * 1000).toFixed(2).replace(/\.?0+$/, ''),
  'milliamp→microamp': (i) => (parseFloat(i) * 1000).toFixed(4).replace(/\.?0+$/, ''),
  'microamp→milliamp': (i) => (parseFloat(i) / 1000).toFixed(6).replace(/\.?0+$/, ''),
  'milliamp→kiloamp': (i) => (parseFloat(i) * 1e-6).toFixed(9).replace(/\.?0+$/, ''),
  'kiloamp→milliamp': (i) => (parseFloat(i) * 1e6).toFixed(2).replace(/\.?0+$/, ''),

  // Voltage conversions (pivot: volt)
  'volt→millivolt': (i) => (parseFloat(i) * 1000).toFixed(4).replace(/\.?0+$/, ''),
  'millivolt→volt': (i) => (parseFloat(i) / 1000).toFixed(6).replace(/\.?0+$/, ''),
  'volt→kilovolt': (i) => (parseFloat(i) / 1000).toFixed(6).replace(/\.?0+$/, ''),
  'kilovolt→volt': (i) => (parseFloat(i) * 1000).toFixed(4).replace(/\.?0+$/, ''),
  'volt→microvolt': (i) => (parseFloat(i) * 1e6).toFixed(2).replace(/\.?0+$/, ''),
  'microvolt→volt': (i) => (parseFloat(i) * 1e-6).toFixed(9).replace(/\.?0+$/, ''),
  'millivolt→kilovolt': (i) => (parseFloat(i) * 1e-6).toFixed(9).replace(/\.?0+$/, ''),
  'kilovolt→millivolt': (i) => (parseFloat(i) * 1e6).toFixed(2).replace(/\.?0+$/, ''),
  'millivolt→microvolt': (i) => (parseFloat(i) * 1000).toFixed(4).replace(/\.?0+$/, ''),
  'microvolt→millivolt': (i) => (parseFloat(i) / 1000).toFixed(6).replace(/\.?0+$/, ''),

  // Volume: cubic-m ↔ liters/gallons/cubic-ft cross-connections
  'cubic-m→liters': (i) => (parseFloat(i) * 1000).toFixed(4).replace(/\.?0+$/, ''),
  'liters→cubic-m': (i) => (parseFloat(i) / 1000).toFixed(6).replace(/\.?0+$/, ''),
  'cubic-m→gallons': (i) => (parseFloat(i) * 264.172).toFixed(4).replace(/\.?0+$/, ''),
  'gallons→cubic-m': (i) => (parseFloat(i) / 264.172).toFixed(6).replace(/\.?0+$/, ''),
  'cubic-ft→liters': (i) => (parseFloat(i) * 28.3168).toFixed(4).replace(/\.?0+$/, ''),
  'liters→cubic-ft': (i) => (parseFloat(i) / 28.3168).toFixed(6).replace(/\.?0+$/, ''),
  'cubic-ft→gallons': (i) => (parseFloat(i) * 7.48052).toFixed(4).replace(/\.?0+$/, ''),
  'gallons→cubic-ft': (i) => (parseFloat(i) / 7.48052).toFixed(4).replace(/\.?0+$/, ''),
  'cubic-m→cubic-ft': (i) => (parseFloat(i) * 35.3147).toFixed(4).replace(/\.?0+$/, ''),
  'cubic-ft→cubic-m': (i) => (parseFloat(i) / 35.3147).toFixed(6).replace(/\.?0+$/, ''),

  // Weight: milligrams and micrograms cross-connections
  'milligrams→grams': (i) => (parseFloat(i) / 1000).toFixed(6).replace(/\.?0+$/, ''),
  'grams→milligrams': (i) => (parseFloat(i) * 1000).toFixed(4).replace(/\.?0+$/, ''),
  'milligrams→kg': (i) => (parseFloat(i) * 1e-6).toFixed(9).replace(/\.?0+$/, ''),
  'kg→milligrams': (i) => (parseFloat(i) * 1e6).toFixed(2).replace(/\.?0+$/, ''),
  'milligrams→oz': (i) => (parseFloat(i) * 3.5274e-5).toFixed(8).replace(/\.?0+$/, ''),
  'oz→milligrams': (i) => (parseFloat(i) * 28349.5).toFixed(2).replace(/\.?0+$/, ''),
  'micrograms→milligrams': (i) => (parseFloat(i) / 1000).toFixed(6).replace(/\.?0+$/, ''),
  'milligrams→micrograms': (i) => (parseFloat(i) * 1000).toFixed(4).replace(/\.?0+$/, ''),
  'micrograms→grams': (i) => (parseFloat(i) * 1e-6).toFixed(9).replace(/\.?0+$/, ''),
  'grams→micrograms': (i) => (parseFloat(i) * 1e6).toFixed(2).replace(/\.?0+$/, ''),
  'carats→grams': (i) => (parseFloat(i) * 0.2).toFixed(4).replace(/\.?0+$/, ''),
  'grams→carats': (i) => (parseFloat(i) * 5).toFixed(4).replace(/\.?0+$/, ''),
  'troy-oz→grams': (i) => (parseFloat(i) * 31.1035).toFixed(4).replace(/\.?0+$/, ''),
  'grams→troy-oz': (i) => (parseFloat(i) / 31.1035).toFixed(6).replace(/\.?0+$/, ''),
  'troy-oz→oz': (i) => (parseFloat(i) * 1.09714).toFixed(4).replace(/\.?0+$/, ''),
  'oz→troy-oz': (i) => (parseFloat(i) / 1.09714).toFixed(6).replace(/\.?0+$/, ''),

  // Duration: more cross-connections
  'dur-ms→dur-seconds': (i) => (parseFloat(i) / 1000).toFixed(4).replace(/\.?0+$/, ''),
  'dur-seconds→dur-ms': (i) => (parseFloat(i) * 1000).toFixed(2).replace(/\.?0+$/, ''),
  'dur-ms→dur-minutes': (i) => (parseFloat(i) / 60000).toFixed(6).replace(/\.?0+$/, ''),
  'dur-minutes→dur-ms': (i) => (parseFloat(i) * 60000).toFixed(2).replace(/\.?0+$/, ''),
  'dur-ms→dur-hours': (i) => (parseFloat(i) / 3600000).toFixed(8).replace(/\.?0+$/, ''),
  'dur-hours→dur-ms': (i) => (parseFloat(i) * 3600000).toFixed(2).replace(/\.?0+$/, ''),
  'dur-weeks→dur-hours': (i) => (parseFloat(i) * 168).toFixed(4).replace(/\.?0+$/, ''),
  'dur-hours→dur-weeks': (i) => (parseFloat(i) / 168).toFixed(6).replace(/\.?0+$/, ''),
  'dur-weeks→dur-minutes': (i) => (parseFloat(i) * 10080).toFixed(2).replace(/\.?0+$/, ''),
  'dur-minutes→dur-weeks': (i) => (parseFloat(i) / 10080).toFixed(8).replace(/\.?0+$/, ''),
  'dur-weeks→dur-days': (i) => (parseFloat(i) * 7).toFixed(4).replace(/\.?0+$/, ''),
  'dur-days→dur-weeks': (i) => (parseFloat(i) / 7).toFixed(6).replace(/\.?0+$/, ''),

  // Color: missing HSV↔CMYK cross-connections
  'color-hsv→color-cmyk': (i) => {
    const hsv = parseHsv(i); if (!hsv) throw new Error('bad hsv')
    const rgb = hsvToRgb(hsv)
    const r = rgb.r/255, g = rgb.g/255, b = rgb.b/255
    const k = 1 - Math.max(r, g, b)
    if (k === 1) return 'cmyk(0%, 0%, 0%, 100%)'
    return `cmyk(${Math.round((1-r-k)/(1-k)*100)}%, ${Math.round((1-g-k)/(1-k)*100)}%, ${Math.round((1-b-k)/(1-k)*100)}%, ${Math.round(k*100)}%)`
  },
  'color-cmyk→color-hsv': (i) => {
    const m = i.match(/cmyk\(\s*([\d.]+)%[^,]*,\s*([\d.]+)%[^,]*,\s*([\d.]+)%[^,]*,\s*([\d.]+)%/i)
    if (!m) throw new Error('bad cmyk')
    const [c, mg, y, k] = [parseFloat(m[1])/100, parseFloat(m[2])/100, parseFloat(m[3])/100, parseFloat(m[4])/100]
    const rgb = { r: Math.round(255*(1-c)*(1-k)), g: Math.round(255*(1-mg)*(1-k)), b: Math.round(255*(1-y)*(1-k)) }
    const hsv = rgbToHsv(rgb)
    return `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`
  },

  // Resistance conversions (pivot: ohm)
  'ohm→kilohm': (i) => (parseFloat(i) / 1000).toFixed(6).replace(/\.?0+$/, ''),
  'kilohm→ohm': (i) => (parseFloat(i) * 1000).toFixed(4).replace(/\.?0+$/, ''),
  'ohm→megohm': (i) => (parseFloat(i) * 1e-6).toFixed(9).replace(/\.?0+$/, ''),
  'megohm→ohm': (i) => (parseFloat(i) * 1e6).toFixed(2).replace(/\.?0+$/, ''),
  'ohm→milliohm': (i) => (parseFloat(i) * 1000).toFixed(4).replace(/\.?0+$/, ''),
  'milliohm→ohm': (i) => (parseFloat(i) / 1000).toFixed(6).replace(/\.?0+$/, ''),
  'kilohm→megohm': (i) => (parseFloat(i) / 1000).toFixed(6).replace(/\.?0+$/, ''),
  'megohm→kilohm': (i) => (parseFloat(i) * 1000).toFixed(4).replace(/\.?0+$/, ''),
  'milliohm→kilohm': (i) => (parseFloat(i) * 1e-6).toFixed(9).replace(/\.?0+$/, ''),
  'kilohm→milliohm': (i) => (parseFloat(i) * 1e6).toFixed(2).replace(/\.?0+$/, ''),

  // Acceleration conversions (1g = 9.80665 m/s²)
  'ms2→gforce': (i) => (parseFloat(i) / 9.80665).toFixed(6).replace(/\.?0+$/, ''),
  'gforce→ms2': (i) => (parseFloat(i) * 9.80665).toFixed(4).replace(/\.?0+$/, ''),
  'ms2→fts2': (i) => (parseFloat(i) * 3.28084).toFixed(4).replace(/\.?0+$/, ''),
  'fts2→ms2': (i) => (parseFloat(i) / 3.28084).toFixed(6).replace(/\.?0+$/, ''),
  'ms2→cms2': (i) => (parseFloat(i) * 100).toFixed(4).replace(/\.?0+$/, ''),
  'cms2→ms2': (i) => (parseFloat(i) / 100).toFixed(6).replace(/\.?0+$/, ''),
  'gforce→fts2': (i) => (parseFloat(i) * 32.1741).toFixed(4).replace(/\.?0+$/, ''),
  'fts2→gforce': (i) => (parseFloat(i) / 32.1741).toFixed(6).replace(/\.?0+$/, ''),
  'gforce→cms2': (i) => (parseFloat(i) * 980.665).toFixed(4).replace(/\.?0+$/, ''),
  'cms2→gforce': (i) => (parseFloat(i) / 980.665).toFixed(6).replace(/\.?0+$/, ''),
  'fts2→cms2': (i) => (parseFloat(i) * 30.48).toFixed(4).replace(/\.?0+$/, ''),
  'cms2→fts2': (i) => (parseFloat(i) / 30.48).toFixed(6).replace(/\.?0+$/, ''),

  // Torque conversions (1 N·m = 0.737562 lb·ft)
  'nm-torque→lb-ft': (i) => (parseFloat(i) * 0.737562).toFixed(4).replace(/\.?0+$/, ''),
  'lb-ft→nm-torque': (i) => (parseFloat(i) * 1.35582).toFixed(4).replace(/\.?0+$/, ''),
  'nm-torque→lb-in': (i) => (parseFloat(i) * 8.85075).toFixed(4).replace(/\.?0+$/, ''),
  'lb-in→nm-torque': (i) => (parseFloat(i) * 0.112985).toFixed(6).replace(/\.?0+$/, ''),
  'nm-torque→kg-cm': (i) => (parseFloat(i) * 10.1972).toFixed(4).replace(/\.?0+$/, ''),
  'kg-cm→nm-torque': (i) => (parseFloat(i) * 0.098066).toFixed(6).replace(/\.?0+$/, ''),
  'lb-ft→lb-in': (i) => (parseFloat(i) * 12).toFixed(4).replace(/\.?0+$/, ''),
  'lb-in→lb-ft': (i) => (parseFloat(i) / 12).toFixed(6).replace(/\.?0+$/, ''),
  'lb-ft→kg-cm': (i) => (parseFloat(i) * 13.8255).toFixed(4).replace(/\.?0+$/, ''),
  'kg-cm→lb-ft': (i) => (parseFloat(i) / 13.8255).toFixed(6).replace(/\.?0+$/, ''),
  'lb-in→kg-cm': (i) => (parseFloat(i) * 1.15212).toFixed(4).replace(/\.?0+$/, ''),
  'kg-cm→lb-in': (i) => (parseFloat(i) / 1.15212).toFixed(6).replace(/\.?0+$/, ''),

  // Force (base: newton)
  'newton→kilonewton': (i) => (parseFloat(i) / 1000).toFixed(8).replace(/\.?0+$/, ''),
  'kilonewton→newton': (i) => (parseFloat(i) * 1000).toFixed(4).replace(/\.?0+$/, ''),
  'newton→pound-force': (i) => (parseFloat(i) * 0.224809).toFixed(6).replace(/\.?0+$/, ''),
  'pound-force→newton': (i) => (parseFloat(i) * 4.44822).toFixed(6).replace(/\.?0+$/, ''),
  'newton→kgforce': (i) => (parseFloat(i) * 0.101972).toFixed(6).replace(/\.?0+$/, ''),
  'kgforce→newton': (i) => (parseFloat(i) * 9.80665).toFixed(6).replace(/\.?0+$/, ''),
  'newton→dyne': (i) => (parseFloat(i) * 100000).toFixed(4).replace(/\.?0+$/, ''),
  'dyne→newton': (i) => (parseFloat(i) / 100000).toFixed(10).replace(/\.?0+$/, ''),
  'kilonewton→pound-force': (i) => (parseFloat(i) * 224.809).toFixed(4).replace(/\.?0+$/, ''),
  'pound-force→kilonewton': (i) => (parseFloat(i) * 0.00444822).toFixed(8).replace(/\.?0+$/, ''),
  'kilonewton→kgforce': (i) => (parseFloat(i) * 101.972).toFixed(4).replace(/\.?0+$/, ''),
  'kgforce→kilonewton': (i) => (parseFloat(i) * 0.00980665).toFixed(8).replace(/\.?0+$/, ''),
  'pound-force→kgforce': (i) => (parseFloat(i) * 0.453592).toFixed(6).replace(/\.?0+$/, ''),
  'kgforce→pound-force': (i) => (parseFloat(i) * 2.20462).toFixed(6).replace(/\.?0+$/, ''),
  'pound-force→dyne': (i) => (parseFloat(i) * 444822).toFixed(2).replace(/\.?0+$/, ''),
  'dyne→pound-force': (i) => (parseFloat(i) * 0.00000224809).toFixed(12).replace(/\.?0+$/, ''),

  // Illuminance (base: lux)
  'lux→footcandle': (i) => (parseFloat(i) * 0.092903).toFixed(6).replace(/\.?0+$/, ''),
  'footcandle→lux': (i) => (parseFloat(i) * 10.7639).toFixed(4).replace(/\.?0+$/, ''),
  'lux→phot': (i) => (parseFloat(i) * 0.0001).toFixed(8).replace(/\.?0+$/, ''),
  'phot→lux': (i) => (parseFloat(i) * 10000).toFixed(4).replace(/\.?0+$/, ''),
  'lux→nox': (i) => (parseFloat(i) * 1000).toFixed(4).replace(/\.?0+$/, ''),
  'nox→lux': (i) => (parseFloat(i) / 1000).toFixed(8).replace(/\.?0+$/, ''),
  'footcandle→phot': (i) => (parseFloat(i) * 0.00929).toFixed(6).replace(/\.?0+$/, ''),
  'phot→footcandle': (i) => (parseFloat(i) / 0.00929).toFixed(4).replace(/\.?0+$/, ''),

  // Capacitance (base: farad)
  'farad→microfarad': (i) => (parseFloat(i) * 1e6).toFixed(4).replace(/\.?0+$/, ''),
  'microfarad→farad': (i) => (parseFloat(i) * 1e-6).toFixed(12).replace(/\.?0+$/, ''),
  'farad→nanofarad': (i) => (parseFloat(i) * 1e9).toFixed(4).replace(/\.?0+$/, ''),
  'nanofarad→farad': (i) => (parseFloat(i) * 1e-9).toFixed(15).replace(/\.?0+$/, ''),
  'farad→picofarad': (i) => (parseFloat(i) * 1e12).toFixed(4).replace(/\.?0+$/, ''),
  'picofarad→farad': (i) => (parseFloat(i) * 1e-12).toFixed(18).replace(/\.?0+$/, ''),
  'microfarad→nanofarad': (i) => (parseFloat(i) * 1000).toFixed(4).replace(/\.?0+$/, ''),
  'nanofarad→microfarad': (i) => (parseFloat(i) / 1000).toFixed(8).replace(/\.?0+$/, ''),
  'microfarad→picofarad': (i) => (parseFloat(i) * 1e6).toFixed(4).replace(/\.?0+$/, ''),
  'picofarad→microfarad': (i) => (parseFloat(i) * 1e-6).toFixed(12).replace(/\.?0+$/, ''),
  'nanofarad→picofarad': (i) => (parseFloat(i) * 1000).toFixed(4).replace(/\.?0+$/, ''),
  'picofarad→nanofarad': (i) => (parseFloat(i) / 1000).toFixed(8).replace(/\.?0+$/, ''),

  // Frequency extended
  'terahertz→gigahertz': (i) => (parseFloat(i) * 1000).toFixed(4).replace(/\.?0+$/, ''),
  'gigahertz→terahertz': (i) => (parseFloat(i) / 1000).toFixed(8).replace(/\.?0+$/, ''),
  'terahertz→megahertz': (i) => (parseFloat(i) * 1e6).toFixed(4).replace(/\.?0+$/, ''),
  'megahertz→terahertz': (i) => (parseFloat(i) * 1e-6).toFixed(12).replace(/\.?0+$/, ''),
  'terahertz→kilohertz': (i) => (parseFloat(i) * 1e9).toFixed(4).replace(/\.?0+$/, ''),
  'kilohertz→terahertz': (i) => (parseFloat(i) * 1e-9).toFixed(15).replace(/\.?0+$/, ''),
  'terahertz→hertz': (i) => (parseFloat(i) * 1e12).toFixed(4).replace(/\.?0+$/, ''),
  'hertz→terahertz': (i) => (parseFloat(i) * 1e-12).toFixed(18).replace(/\.?0+$/, ''),
  'gigahertz→megahertz': (i) => (parseFloat(i) * 1000).toFixed(4).replace(/\.?0+$/, ''),
  'megahertz→gigahertz': (i) => (parseFloat(i) / 1000).toFixed(8).replace(/\.?0+$/, ''),
  'gigahertz→kilohertz': (i) => (parseFloat(i) * 1e6).toFixed(4).replace(/\.?0+$/, ''),
  'kilohertz→gigahertz': (i) => (parseFloat(i) * 1e-6).toFixed(12).replace(/\.?0+$/, ''),
  'gigahertz→hertz': (i) => (parseFloat(i) * 1e9).toFixed(4).replace(/\.?0+$/, ''),
  'hertz→gigahertz': (i) => (parseFloat(i) * 1e-9).toFixed(15).replace(/\.?0+$/, ''),

  // Number ratios
  'percent→decimal-frac': (i) => (parseFloat(i) / 100).toFixed(6).replace(/\.?0+$/, ''),
  'decimal-frac→percent': (i) => (parseFloat(i) * 100).toFixed(4).replace(/\.?0+$/, ''),
  'percent→ppm': (i) => (parseFloat(i) * 10000).toFixed(4).replace(/\.?0+$/, ''),
  'ppm→percent': (i) => (parseFloat(i) / 10000).toFixed(8).replace(/\.?0+$/, ''),
  'percent→ppb': (i) => (parseFloat(i) * 1e7).toFixed(4).replace(/\.?0+$/, ''),
  'ppb→percent': (i) => (parseFloat(i) / 1e7).toFixed(12).replace(/\.?0+$/, ''),
  'decimal-frac→ppm': (i) => (parseFloat(i) * 1e6).toFixed(4).replace(/\.?0+$/, ''),
  'ppm→decimal-frac': (i) => (parseFloat(i) * 1e-6).toFixed(12).replace(/\.?0+$/, ''),
  'decimal-frac→ppb': (i) => (parseFloat(i) * 1e9).toFixed(4).replace(/\.?0+$/, ''),
  'ppb→decimal-frac': (i) => (parseFloat(i) * 1e-9).toFixed(15).replace(/\.?0+$/, ''),
  'ppm→ppb': (i) => (parseFloat(i) * 1000).toFixed(4).replace(/\.?0+$/, ''),
  'ppb→ppm': (i) => (parseFloat(i) / 1000).toFixed(8).replace(/\.?0+$/, ''),

  // Typography / Print units (1 pt = 1/72 inch; 1 pica = 12 pt; 1 screen-px = 1/96 inch; 1 twip = 1/1440 inch)
  'pt-type→pica': (i) => (parseFloat(i) / 12).toFixed(6).replace(/\.?0+$/, ''),
  'pica→pt-type': (i) => (parseFloat(i) * 12).toFixed(4).replace(/\.?0+$/, ''),
  'pt-type→screen-px': (i) => (parseFloat(i) * 96 / 72).toFixed(4).replace(/\.?0+$/, ''),
  'screen-px→pt-type': (i) => (parseFloat(i) * 72 / 96).toFixed(4).replace(/\.?0+$/, ''),
  'pt-type→twip': (i) => (parseFloat(i) * 20).toFixed(4).replace(/\.?0+$/, ''),
  'twip→pt-type': (i) => (parseFloat(i) / 20).toFixed(6).replace(/\.?0+$/, ''),
  'pt-type→mm': (i) => (parseFloat(i) * 25.4 / 72).toFixed(6).replace(/\.?0+$/, ''),
  'mm→pt-type': (i) => (parseFloat(i) * 72 / 25.4).toFixed(4).replace(/\.?0+$/, ''),
  'pt-type→inch': (i) => (parseFloat(i) / 72).toFixed(8).replace(/\.?0+$/, ''),
  'inch→pt-type': (i) => (parseFloat(i) * 72).toFixed(4).replace(/\.?0+$/, ''),
  'pt-type→cm': (i) => (parseFloat(i) * 2.54 / 72).toFixed(6).replace(/\.?0+$/, ''),
  'cm→pt-type': (i) => (parseFloat(i) * 72 / 2.54).toFixed(4).replace(/\.?0+$/, ''),
  'pica→mm': (i) => (parseFloat(i) * 25.4 / 6).toFixed(4).replace(/\.?0+$/, ''),
  'mm→pica': (i) => (parseFloat(i) * 6 / 25.4).toFixed(6).replace(/\.?0+$/, ''),
  'pica→inch': (i) => (parseFloat(i) / 6).toFixed(6).replace(/\.?0+$/, ''),
  'inch→pica': (i) => (parseFloat(i) * 6).toFixed(4).replace(/\.?0+$/, ''),
  'pica→cm': (i) => (parseFloat(i) * 2.54 / 6).toFixed(4).replace(/\.?0+$/, ''),
  'cm→pica': (i) => (parseFloat(i) * 6 / 2.54).toFixed(6).replace(/\.?0+$/, ''),
  'pica→screen-px': (i) => (parseFloat(i) * 96 / 6).toFixed(4).replace(/\.?0+$/, ''),
  'screen-px→pica': (i) => (parseFloat(i) * 6 / 96).toFixed(6).replace(/\.?0+$/, ''),
  'screen-px→mm': (i) => (parseFloat(i) * 25.4 / 96).toFixed(6).replace(/\.?0+$/, ''),
  'mm→screen-px': (i) => (parseFloat(i) * 96 / 25.4).toFixed(4).replace(/\.?0+$/, ''),
  'screen-px→inch': (i) => (parseFloat(i) / 96).toFixed(8).replace(/\.?0+$/, ''),
  'inch→screen-px': (i) => (parseFloat(i) * 96).toFixed(4).replace(/\.?0+$/, ''),
  'screen-px→cm': (i) => (parseFloat(i) * 2.54 / 96).toFixed(6).replace(/\.?0+$/, ''),
  'cm→screen-px': (i) => (parseFloat(i) * 96 / 2.54).toFixed(4).replace(/\.?0+$/, ''),
  'twip→mm': (i) => (parseFloat(i) * 25.4 / 1440).toFixed(6).replace(/\.?0+$/, ''),
  'mm→twip': (i) => (parseFloat(i) * 1440 / 25.4).toFixed(4).replace(/\.?0+$/, ''),
  'twip→inch': (i) => (parseFloat(i) / 1440).toFixed(8).replace(/\.?0+$/, ''),
  'inch→twip': (i) => (parseFloat(i) * 1440).toFixed(4).replace(/\.?0+$/, ''),
  'twip→screen-px': (i) => (parseFloat(i) * 96 / 1440).toFixed(6).replace(/\.?0+$/, ''),
  'screen-px→twip': (i) => (parseFloat(i) * 1440 / 96).toFixed(4).replace(/\.?0+$/, ''),
  'twip→pica': (i) => (parseFloat(i) / 240).toFixed(6).replace(/\.?0+$/, ''),
  'pica→twip': (i) => (parseFloat(i) * 240).toFixed(4).replace(/\.?0+$/, ''),

  // Duration sub-millisecond and large units
  'dur-us→dur-ms': (i) => (parseFloat(i) / 1000).toFixed(6).replace(/\.?0+$/, ''),
  'dur-ms→dur-us': (i) => (parseFloat(i) * 1000).toFixed(2).replace(/\.?0+$/, ''),
  'dur-us→dur-seconds': (i) => (parseFloat(i) / 1e6).toFixed(9).replace(/\.?0+$/, ''),
  'dur-seconds→dur-us': (i) => (parseFloat(i) * 1e6).toFixed(2).replace(/\.?0+$/, ''),
  'dur-us→dur-ns': (i) => (parseFloat(i) * 1000).toFixed(2).replace(/\.?0+$/, ''),
  'dur-ns→dur-us': (i) => (parseFloat(i) / 1000).toFixed(6).replace(/\.?0+$/, ''),
  'dur-ns→dur-ms': (i) => (parseFloat(i) / 1e6).toFixed(9).replace(/\.?0+$/, ''),
  'dur-ms→dur-ns': (i) => (parseFloat(i) * 1e6).toFixed(2).replace(/\.?0+$/, ''),
  'dur-ns→dur-seconds': (i) => (parseFloat(i) / 1e9).toFixed(12).replace(/\.?0+$/, ''),
  'dur-seconds→dur-ns': (i) => (parseFloat(i) * 1e9).toFixed(2).replace(/\.?0+$/, ''),
  'dur-ns→dur-minutes': (i) => (parseFloat(i) / 6e10).toFixed(14).replace(/\.?0+$/, ''),
  'dur-minutes→dur-ns': (i) => (parseFloat(i) * 6e10).toFixed(0),
  'dur-months→dur-days': (i) => (parseFloat(i) * 30.4375).toFixed(4).replace(/\.?0+$/, ''),
  'dur-days→dur-months': (i) => (parseFloat(i) / 30.4375).toFixed(6).replace(/\.?0+$/, ''),
  'dur-months→dur-weeks': (i) => (parseFloat(i) * 4.34821).toFixed(4).replace(/\.?0+$/, ''),
  'dur-weeks→dur-months': (i) => (parseFloat(i) / 4.34821).toFixed(6).replace(/\.?0+$/, ''),
  'dur-months→dur-hours': (i) => (parseFloat(i) * 730.5).toFixed(2).replace(/\.?0+$/, ''),
  'dur-hours→dur-months': (i) => (parseFloat(i) / 730.5).toFixed(8).replace(/\.?0+$/, ''),
  'dur-months→dur-seconds': (i) => (parseFloat(i) * 2629800).toFixed(0),
  'dur-seconds→dur-months': (i) => (parseFloat(i) / 2629800).toFixed(10).replace(/\.?0+$/, ''),
  'dur-years→dur-months': (i) => (parseFloat(i) * 12).toFixed(4).replace(/\.?0+$/, ''),
  'dur-months→dur-years': (i) => (parseFloat(i) / 12).toFixed(6).replace(/\.?0+$/, ''),
  'dur-years→dur-days': (i) => (parseFloat(i) * 365.25).toFixed(4).replace(/\.?0+$/, ''),
  'dur-days→dur-years': (i) => (parseFloat(i) / 365.25).toFixed(8).replace(/\.?0+$/, ''),
  'dur-years→dur-weeks': (i) => (parseFloat(i) * 52.1775).toFixed(4).replace(/\.?0+$/, ''),
  'dur-weeks→dur-years': (i) => (parseFloat(i) / 52.1775).toFixed(8).replace(/\.?0+$/, ''),
  'dur-years→dur-hours': (i) => (parseFloat(i) * 8766).toFixed(2).replace(/\.?0+$/, ''),
  'dur-hours→dur-years': (i) => (parseFloat(i) / 8766).toFixed(8).replace(/\.?0+$/, ''),
  'dur-years→dur-seconds': (i) => (parseFloat(i) * 31557600).toFixed(0),
  'dur-seconds→dur-years': (i) => (parseFloat(i) / 31557600).toFixed(10).replace(/\.?0+$/, ''),
  'dur-years→dur-minutes': (i) => (parseFloat(i) * 525960).toFixed(0),
  'dur-minutes→dur-years': (i) => (parseFloat(i) / 525960).toFixed(10).replace(/\.?0+$/, ''),
}

// Build adjacency: for each format, what can it convert to?
const adjacency = {}
for (const key of Object.keys(conversionMap)) {
  const [from, to] = key.split('→')
  if (!adjacency[from]) adjacency[from] = []
  adjacency[from].push(to)
}

const formatIdAliases = {
  'kg-force': 'kgforce',
  kgforce: 'kg-force',
}

function getFormatIdVariants(id) {
  const alias = formatIdAliases[id]
  return alias ? [id, alias] : [id]
}

export function getTargets(fromId) {
  const targets = new Set()
  for (const fromVariant of getFormatIdVariants(fromId)) {
    for (const toId of adjacency[fromVariant] || []) {
      targets.add(toId)
      const toAlias = formatIdAliases[toId]
      if (toAlias) targets.add(toAlias)
    }
  }
  return Array.from(targets)
}

export function getReleasedTargets(fromId) {
  if (!releasedFormatIdSet.has(fromId)) return []
  return getReleasedEvidenceTargets(fromId)
}

export function getConvertFn(fromId, toId) {
  for (const fromVariant of getFormatIdVariants(fromId)) {
    for (const toVariant of getFormatIdVariants(toId)) {
      const fn = conversionMap[`${fromVariant}→${toVariant}`]
      if (fn) return fn
    }
  }
  return null
}

export function getFormatById(id) {
  const variants = getFormatIdVariants(id)
  return formats.find(f => variants.includes(f.id))
}
