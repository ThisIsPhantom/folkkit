// Folkkit calculations are deterministic and keep all inputs in the current page.
export const CALCULATOR_IDS = Object.freeze(['percent', 'rule-of-three', 'pythagoras', 'circle', 'area', 'volume', 'units', 'aspect-ratio', 'loan', 'bmi'])

const unit = (id, symbol, factor) => Object.freeze({ id, symbol, factor })
export const UNIT_CATEGORIES = Object.freeze({
  length: Object.freeze([unit('m', 'm', 1), unit('cm', 'cm', 0.01), unit('mm', 'mm', 0.001), unit('km', 'km', 1000), unit('in', 'in', 0.0254), unit('ft', 'ft', 0.3048), unit('yd', 'yd', 0.9144), unit('mi', 'mi', 1609.344)]),
  area: Object.freeze([unit('m2', 'm²', 1), unit('cm2', 'cm²', 0.0001), unit('mm2', 'mm²', 0.000001), unit('km2', 'km²', 1e6), unit('ha', 'ha', 10000), unit('ft2', 'ft²', 0.09290304)]),
  volume: Object.freeze([unit('l', 'l', 1), unit('ml', 'ml', 0.001), unit('m3', 'm³', 1000), unit('cm3', 'cm³', 0.001), unit('usgal', 'US gal', 3.785411784)]),
  mass: Object.freeze([unit('kg', 'kg', 1), unit('g', 'g', 0.001), unit('mg', 'mg', 0.000001), unit('t', 't', 1000), unit('lb', 'lb', 0.45359237), unit('oz', 'oz', 0.028349523125)]),
  temperature: Object.freeze([unit('C', '°C', 1), unit('F', '°F', 1), unit('K', 'K', 1)]),
  time: Object.freeze([unit('h', 'h', 3600), unit('min', 'min', 60), unit('s', 's', 1), unit('ms', 'ms', 0.001), unit('day', 'd', 86400), unit('week', 'wk', 604800)]),
  speed: Object.freeze([unit('kmh', 'km/h', 1 / 3.6), unit('ms', 'm/s', 1), unit('mph', 'mph', 0.44704), unit('kn', 'kn', 1852 / 3600)]),
  storage: Object.freeze([unit('MB', 'MB', 1e6), unit('GB', 'GB', 1e9), unit('kB', 'kB', 1000), unit('B', 'B', 1), unit('TB', 'TB', 1e12), unit('KiB', 'KiB', 1024), unit('MiB', 'MiB', 1024 ** 2), unit('GiB', 'GiB', 1024 ** 3), unit('TiB', 'TiB', 1024 ** 4)]),
})

export const DEFAULT_OPTIONS = Object.freeze({
  percent: Object.freeze({ mode: 'of' }),
  'rule-of-three': Object.freeze({}),
  pythagoras: Object.freeze({ missing: 'c' }),
  circle: Object.freeze({ measure: 'radius' }),
  area: Object.freeze({ shape: 'rectangle' }),
  volume: Object.freeze({ shape: 'cuboid' }),
  units: Object.freeze({ category: 'length', from: 'm', to: 'cm' }),
  'aspect-ratio': Object.freeze({ mode: 'ratio' }),
  loan: Object.freeze({}),
  bmi: Object.freeze({}),
})

export function parseNumber(input) {
  const text = String(input ?? '').trim()
  if (!text) return { status: 'empty' }
  if (text.length > 128 || !/^[+-]?(?:\d+(?:[.,]\d*)?|[.,]\d+)(?:e[+-]?\d+)?$/i.test(text)) return { status: 'invalid' }
  const value = Number(text.replace(',', '.'))
  // A nonzero mantissa that underflows to zero must not silently become zero.
  if (!Number.isFinite(value) || (value === 0 && /[1-9]/.test(text.split(/e/i)[0]))) return { status: 'invalid' }
  return { status: 'ready', value }
}

export function calculatorFields(id, options = {}) {
  const settings = { ...DEFAULT_OPTIONS[id], ...options }
  switch (id) {
    case 'percent': return settings.mode === 'of' ? ['rate', 'base'] : settings.mode === 'share' ? ['part', 'base'] : ['previous', 'next']
    case 'rule-of-three': return ['first', 'second', 'third']
    case 'pythagoras': return ['a', 'b', 'c'].filter(side => side !== settings.missing)
    case 'circle': return ['measure']
    case 'area': return ['width', 'height']
    case 'volume': return settings.shape === 'cylinder' ? ['radius', 'height'] : ['width', 'depth', 'height']
    case 'units': return ['value']
    case 'aspect-ratio': return settings.mode === 'resize' ? ['width', 'height', 'targetWidth'] : ['width', 'height']
    case 'loan': return ['principal', 'annualRate', 'months']
    case 'bmi': return ['weight', 'height']
    default: return []
  }
}

const invalid = (code, field) => ({ status: 'invalid', error: { code, field } })
const result = (key, value, symbol = '', nonzero = false) => ({ key, value, symbol, nonzero })

function convertUnit(value, options) {
  const units = Object.hasOwn(UNIT_CATEGORIES, options.category) && UNIT_CATEGORIES[options.category]
  if (!units) return invalid('selection')
  const from = units.find(item => item.id === options.from)
  const to = units.find(item => item.id === options.to)
  if (!from || !to) return invalid('selection')
  let converted
  if (options.category === 'temperature') {
    const minimum = { C: -273.15, F: -459.67, K: 0 }[from.id]
    if (value < minimum) return invalid('temperature', 'value')
    const celsius = from.id === 'C' ? value : from.id === 'F' ? (value - 32) / 1.8 : value - 273.15
    converted = to.id === 'C' ? celsius : to.id === 'F' ? celsius * 1.8 + 32 : Math.max(0, celsius + 273.15)
  } else {
    if (value < 0) return invalid('nonnegative', 'value')
    converted = value * (from.factor / to.factor)
  }
  if (from.id === to.id) converted = value
  return [result('result', converted, to.symbol, value !== 0 && options.category !== 'temperature')]
}

function calculateLoan({ principal, annualRate, months }) {
  if (principal <= 0) return invalid('positive', 'principal')
  if (annualRate < 0 || annualRate > 100) return invalid('rate', 'annualRate')
  if (!Number.isInteger(months) || months < 1 || months > 1200) return invalid('months', 'months')
  // Ordinary annuity: fixed nominal annual rate / 12, end-of-month payments.
  // https://support.microsoft.com/en-us/excel/functions/pmt-function
  const rate = annualRate / 1200
  if (annualRate > 0 && rate === 0) return invalid('range')
  let interestFactor = 0
  if (months === 1) interestFactor = rate
  else if (rate > 0 && rate * months < 1e-7) {
    // The annuity's Taylor expansion avoids subtracting almost equal totals.
    // At this threshold the omitted cubic term is below displayed precision.
    interestFactor = ((months + 1) / 2) * rate + ((months * months - 1) / 12) * rate * rate
  } else if (rate > 0) {
    interestFactor = months * (rate / -Math.expm1(-months * Math.log1p(rate))) - 1
  }
  const totalInterest = principal * interestFactor
  const totalPayment = principal + totalInterest
  const monthlyPayment = totalPayment / months
  return [result('monthlyPayment', monthlyPayment, '', true), result('totalPayment', totalPayment, '', true), result('totalInterest', totalInterest, '', annualRate > 0)]
}

function greatestCommonDivisor(first, second) {
  while (second !== 0) {
    const remainder = first % second
    first = second
    second = remainder
  }
  return first
}

export function calculate(id, inputs = {}, options = {}) {
  if (!CALCULATOR_IDS.includes(id)) return invalid('selection')
  const settings = { ...DEFAULT_OPTIONS[id], ...options }
  const fields = calculatorFields(id, settings)
  const values = {}
  let empty = false
  for (const field of fields) {
    const parsed = parseNumber(inputs[field])
    if (parsed.status === 'invalid') return invalid('number', field)
    if (parsed.status === 'empty') empty = true
    values[field] = parsed.value
  }
  if (empty) return { status: 'empty' }
  if (['pythagoras', 'circle', 'area', 'volume', 'aspect-ratio', 'bmi'].includes(id)) {
    const field = fields.find(name => values[name] <= 0)
    if (field) return invalid('positive', field)
  }

  let results
  let ratio
  switch (id) {
    case 'percent':
      if (settings.mode === 'of') results = [result('result', (values.rate / 100) * values.base, '', values.rate !== 0 && values.base !== 0)]
      else if (settings.mode === 'share') {
        if (values.base === 0) return invalid('nonzero', 'base')
        results = [result('result', (values.part / values.base) * 100, '%', values.part !== 0)]
      } else if (settings.mode === 'change') {
        if (values.previous <= 0) return invalid('positive', 'previous')
        results = [result('result', ((values.next - values.previous) / values.previous) * 100, '%', values.next !== values.previous)]
      } else return invalid('selection')
      break
    case 'rule-of-three':
      if (values.first === 0) return invalid('nonzero', 'first')
      results = [result('result', (values.second / values.first) * values.third, '', values.second !== 0 && values.third !== 0)]
      break
    case 'pythagoras': {
      if (!['a', 'b', 'c'].includes(settings.missing)) return invalid('selection')
      const known = settings.missing === 'a' ? values.b : values.a
      if (settings.missing !== 'c' && values.c <= known) return invalid('hypotenuse', 'c')
      const side = settings.missing === 'c'
        ? Math.hypot(values.a, values.b)
        : Math.sqrt((values.c - known) / values.c) * Math.sqrt(1 + known / values.c) * values.c
      results = [result(settings.missing, side, '', true)]
      break
    }
    case 'circle': {
      if (!['radius', 'diameter'].includes(settings.measure)) return invalid('selection')
      const radius = settings.measure === 'diameter' ? values.measure / 2 : values.measure
      results = [result('radius', radius, '', true), result('diameter', radius * 2, '', true), result('circumference', 2 * Math.PI * radius, '', true), result('area', Math.PI * radius * radius, '²', true)]
      break
    }
    case 'area':
      if (settings.shape === 'triangle') results = [result('area', (values.width / 2) * values.height, '²', true)]
      else if (settings.shape === 'rectangle') results = [result('area', values.width * values.height, '²', true), result('perimeter', 2 * (values.width + values.height), '', true)]
      else return invalid('selection')
      break
    case 'volume':
      if (settings.shape === 'cylinder') results = [result('volume', Math.PI * values.radius * values.radius * values.height, '³', true)]
      else if (settings.shape === 'cuboid') results = [result('volume', values.width * values.depth * values.height, '³', true)]
      else return invalid('selection')
      break
    case 'units': results = convertUnit(values.value, settings); break
    case 'aspect-ratio': {
      if (!['ratio', 'resize'].includes(settings.mode)) return invalid('selection')
      for (const field of fields) {
        if (values[field] > 1e9) return invalid('dimension', field)
        if (!Number.isInteger(values[field])) return invalid('integer', field)
      }
      const divisor = greatestCommonDivisor(values.width, values.height)
      ratio = { width: values.width / divisor, height: values.height / divisor }
      if (settings.mode === 'resize') {
        // Dimensions are bounded integers. Keep the product and half-pixel test
        // exact even when the intermediate numerator exceeds Number precision.
        const numerator = BigInt(values.targetWidth) * BigInt(values.height)
        const denominator = BigInt(values.width)
        const roundedHeight = numerator / denominator + (2n * (numerator % denominator) >= denominator ? 1n : 0n)
        if (roundedHeight < 1n || roundedHeight > 1000000000n) return invalid('dimension', 'targetWidth')
        const targetHeight = Number(roundedHeight)
        results = [result('targetWidth', values.targetWidth, 'px', true), result('targetHeight', targetHeight, 'px', true)]
      } else results = [result('ratio', values.width / values.height, '', true)]
      break
    }
    case 'loan': results = calculateLoan(values); break
    case 'bmi': {
      // Metric BMI = weight (kg) / height (m)²; no diagnosis or classification.
      // https://www.cdc.gov/bmi/about/index.html
      const metres = values.height / 100
      results = [result('bmi', values.weight / metres / metres, '', true)]
      break
    }
  }
  if (!Array.isArray(results)) return results
  if (results.some(item => !Number.isFinite(item.value) || (item.nonzero && item.value === 0))) return invalid('range')
  return { status: 'ready', results: results.map(({ key, value, symbol }) => ({ key, value, symbol })), ...(ratio ? { ratio } : {}) }
}

export function formatResult(value, locale) {
  const absolute = Math.abs(value)
  return new Intl.NumberFormat(locale === 'de' ? 'de-DE' : 'en-GB', {
    maximumSignificantDigits: 12,
    notation: absolute !== 0 && (absolute < 1e-6 || absolute >= 1e12) ? 'scientific' : 'standard',
    useGrouping: false,
  }).format(Object.is(value, -0) ? 0 : value)
}
