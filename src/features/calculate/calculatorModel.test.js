import { describe, expect, it } from 'vitest'
import { calculate, formatResult, parseNumber, UNIT_CATEGORIES } from './calculatorModel.js'

const ready = (id, values, options) => {
  const result = calculate(id, values, options)
  expect(result.status).toBe('ready')
  return Object.fromEntries(result.results.map(item => [item.key, item.value]))
}

describe('calculator numeric inputs', () => {
  it.each([['12,5', 12.5], ['  -0.25 ', -0.25], ['.5', 0.5], ['1e20', 1e20], ['0', 0]])('reads %s without evaluating expressions', (input, expected) => {
    expect(parseNumber(input)).toEqual({ status: 'ready', value: expected })
  })
  it.each(['Infinity', 'NaN', '1/2', '2+2', '1,000.1', '0x20', '1e309', '1e-999', '1'.repeat(129)])('rejects %s', input => {
    expect(parseNumber(input).status).toBe('invalid')
  })
  it('keeps blank inputs empty, including partly completed forms', () => {
    expect(parseNumber('  ')).toEqual({ status: 'empty' })
    expect(calculate('percent', { rate: '20', base: '' }).status).toBe('empty')
  })
  it('reports malformed values even while another field remains blank', () => {
    expect(calculate('percent', { rate: 'abc', base: '' })).toMatchObject({ status: 'invalid', error: { field: 'rate', code: 'number' } })
  })
})

describe('everyday formulas', () => {
  it('supports all three percentage operations and signed change', () => {
    expect(ready('percent', { rate: '12,5', base: '240' })).toEqual({ result: 30 })
    expect(ready('percent', { part: '30', base: '240' }, { mode: 'share' })).toEqual({ result: 12.5 })
    expect(ready('percent', { previous: '80', next: '60' }, { mode: 'change' })).toEqual({ result: -25 })
  })
  it('requires a positive starting value for percentage change and a nonzero base for a share', () => {
    expect(calculate('percent', { previous: '-5', next: '10' }, { mode: 'change' })).toMatchObject({ status: 'invalid', error: { code: 'positive', field: 'previous' } })
    expect(calculate('percent', { part: '3', base: '0' }, { mode: 'share' })).toMatchObject({ status: 'invalid', error: { code: 'nonzero' } })
  })
  it('calculates a direct rule of three', () => {
    expect(ready('rule-of-three', { first: '3', second: '12', third: '5' })).toEqual({ result: 20 })
    expect(calculate('rule-of-three', { first: '0', second: '12', third: '5' }).error.code).toBe('nonzero')
  })
  it('solves every missing side of a right triangle', () => {
    expect(ready('pythagoras', { a: '3', b: '4' })).toEqual({ c: 5 })
    expect(ready('pythagoras', { b: '4', c: '5' }, { missing: 'a' })).toEqual({ a: 3 })
    expect(ready('pythagoras', { a: '3', c: '5' }, { missing: 'b' })).toEqual({ b: 4 })
    expect(calculate('pythagoras', { b: '5', c: '4' }, { missing: 'a' })).toMatchObject({ status: 'invalid', error: { code: 'hypotenuse', field: 'c' } })
    expect(calculate('pythagoras', { a: '0', b: '4' }).error.code).toBe('positive')
  })
  it('avoids overflow when solving representable large triangles', () => {
    expect(ready('pythagoras', { a: '3e200', b: '4e200' }).c / 1e200).toBeCloseTo(5, 12)
    expect(ready('pythagoras', { b: '4e200', c: '5e200' }, { missing: 'a' }).a).toBeCloseTo(3e200, -186)
  })
  it('calculates a circle from either radius or diameter', () => {
    const radius = ready('circle', { measure: '3' })
    const diameter = ready('circle', { measure: '6' }, { measure: 'diameter' })
    expect(radius).toEqual(diameter)
    expect(radius.circumference).toBeCloseTo(6 * Math.PI)
    expect(radius.area).toBeCloseTo(9 * Math.PI)
  })
  it('calculates rectangle and triangle areas', () => {
    expect(ready('area', { width: '4', height: '3' })).toEqual({ area: 12, perimeter: 14 })
    expect(ready('area', { width: '4', height: '3' }, { shape: 'triangle' })).toEqual({ area: 6 })
  })
  it('calculates cuboid and cylinder volumes', () => {
    expect(ready('volume', { width: '4', depth: '5', height: '3' })).toEqual({ volume: 60 })
    expect(ready('volume', { radius: '2', height: '3' }, { shape: 'cylinder' }).volume).toBeCloseTo(12 * Math.PI)
  })
  it('rejects nonrepresentable overflow and underflow instead of showing misleading numbers', () => {
    expect(calculate('volume', { width: '1e200', depth: '1e200', height: '1e200' })).toMatchObject({ status: 'invalid', error: { code: 'range' } })
    expect(calculate('circle', { measure: '1e-200' })).toMatchObject({ status: 'invalid', error: { code: 'range' } })
  })
})

describe('unit conversion', () => {
  it.each([
    ['length', 'm', 'cm', '2,5', 250],
    ['area', 'ha', 'm2', '2', 20000],
    ['volume', 'l', 'ml', '1,5', 1500],
    ['mass', 'lb', 'kg', '1', 0.45359237],
    ['time', 'h', 'min', '2', 120],
    ['speed', 'kmh', 'ms', '36', 10],
    ['storage', 'MiB', 'B', '1', 1048576],
    ['storage', 'MB', 'B', '1', 1000000],
  ])('converts %s %s to %s', (category, from, to, value, expected) => {
    expect(ready('units', { value }, { category, from, to }).result).toBeCloseTo(expected)
  })
  it.each([['C', 'F', '0', 32], ['F', 'C', '212', 100], ['K', 'C', '273,15', 0], ['C', 'K', '-273,15', 0]])('handles affine temperatures %s to %s', (from, to, value, expected) => {
    expect(ready('units', { value }, { category: 'temperature', from, to }).result).toBeCloseTo(expected)
  })
  it('rejects temperatures below absolute zero and negative magnitudes', () => {
    expect(calculate('units', { value: '-273,16' }, { category: 'temperature', from: 'C', to: 'F' }).error.code).toBe('temperature')
    expect(calculate('units', { value: '-1' }, { category: 'length', from: 'm', to: 'cm' }).error.code).toBe('nonnegative')
  })
  it('does not convert incompatible or arbitrary unit identifiers', () => {
    expect(calculate('units', { value: '2' }, { category: 'length', from: 'kg', to: 'cm' }).error.code).toBe('selection')
    expect(calculate('units', { value: '2' }, { category: '__proto__', from: 'm', to: 'cm' }).error.code).toBe('selection')
  })
  it('keeps identity conversions stable in every category', () => {
    for (const [category, units] of Object.entries(UNIT_CATEGORIES)) {
      for (const unit of units) expect(ready('units', { value: '12.5' }, { category, from: unit.id, to: unit.id }).result).toBe(12.5)
    }
  })
})

describe('integrated aspect ratio calculator', () => {
  it('reduces landscape and portrait dimensions to an exact integer ratio', () => {
    expect(calculate('aspect-ratio', { width: '1920', height: '1080' })).toMatchObject({ status: 'ready', ratio: { width: 16, height: 9 } })
    expect(calculate('aspect-ratio', { width: '1080', height: '1920' })).toMatchObject({ status: 'ready', ratio: { width: 9, height: 16 } })
    expect(calculate('aspect-ratio', { width: '997', height: '991' })).toMatchObject({ status: 'ready', ratio: { width: 997, height: 991 } })
  })
  it('resizes to a supplied width and rounds only the final pixel height', () => {
    const resized = calculate('aspect-ratio', { width: '1920', height: '1080', targetWidth: '800' }, { mode: 'resize' })
    expect(resized.ratio).toEqual({ width: 16, height: 9 })
    expect(resized.results).toEqual([{ key: 'targetWidth', value: 800, symbol: 'px' }, { key: 'targetHeight', value: 450, symbol: 'px' }])
    expect(ready('aspect-ratio', { width: '3', height: '2', targetWidth: '100' }, { mode: 'resize' })).toEqual({ targetWidth: 100, targetHeight: 67 })
  })
  it('rounds exact half pixels identically for equivalent source ratios', () => {
    for (const [width, height] of [['6', '15'], ['600', '1500']]) {
      expect(ready('aspect-ratio', { width, height, targetWidth: '49' }, { mode: 'resize' })).toEqual({ targetWidth: 49, targetHeight: 123 })
    }
  })
  it('keeps resize products exact above the safe integer range', () => {
    expect(ready('aspect-ratio', { width: '1000000000', height: '999999999', targetWidth: '500000000' }, { mode: 'resize' })).toEqual({ targetWidth: 500000000, targetHeight: 500000000 })
    expect(ready('aspect-ratio', { width: '1000000000', height: '999999999', targetWidth: '1000000000' }, { mode: 'resize' })).toEqual({ targetWidth: 1000000000, targetHeight: 999999999 })
  })
  it.each([
    [{ width: '0', height: '1080' }, 'positive'],
    [{ width: '1920,5', height: '1080' }, 'integer'],
    [{ width: '1000000001', height: '1080' }, 'dimension'],
    [{ width: '9007199254740993', height: '1080' }, 'dimension'],
  ])('rejects invalid source dimensions %j', (values, code) => {
    expect(calculate('aspect-ratio', values)).toMatchObject({ status: 'invalid', error: { code, field: 'width' } })
  })
  it('rejects resize results that cannot fit a positive bounded pixel dimension', () => {
    expect(calculate('aspect-ratio', { width: '1000000000', height: '1', targetWidth: '1' }, { mode: 'resize' })).toMatchObject({ status: 'invalid', error: { code: 'dimension' } })
    expect(calculate('aspect-ratio', { width: '1', height: '1000000000', targetWidth: '1000000000' }, { mode: 'resize' })).toMatchObject({ status: 'invalid', error: { code: 'dimension' } })
  })
})

describe('integrated fixed-rate loan calculator', () => {
  it('computes a standard nominal-rate loan and independently amortizes it to zero', () => {
    const output = ready('loan', { principal: '10000', annualRate: '6', months: '36' })
    expect(output.monthlyPayment).toBeCloseTo(304.2193745156, 9)
    expect(output.totalPayment).toBeCloseTo(output.monthlyPayment * 36, 9)
    expect(output.totalInterest).toBeCloseTo(951.8974825614, 8)
    let balance = 10000
    for (let month = 0; month < 36; month += 1) balance = balance * 1.005 - output.monthlyPayment
    expect(Math.abs(balance)).toBeLessThan(1e-8)
  })
  it('handles zero interest without division by zero or negative interest', () => {
    expect(ready('loan', { principal: '12000', annualRate: '0', months: '24' })).toEqual({ monthlyPayment: 500, totalPayment: 12000, totalInterest: 0 })
  })
  it('retains positive interest for a very small rate without cancellation', () => {
    const output = ready('loan', { principal: '10000', annualRate: '1e-12', months: '36' })
    expect(output.monthlyPayment).toBeCloseTo(10000 / 36, 9)
    expect(output.totalInterest).toBeGreaterThan(0)
    expect(output.totalInterest / (10000 * 37 / 2 * (1e-12 / 1200))).toBeCloseTo(1, 12)
  })
  it('calculates one-month interest and supports the upper duration and rate bounds', () => {
    expect(ready('loan', { principal: '10000', annualRate: '12', months: '1' })).toEqual({ monthlyPayment: 10100, totalPayment: 10100, totalInterest: 100 })
    const output = ready('loan', { principal: '10000', annualRate: '100', months: '1200' })
    expect(output.monthlyPayment).toBeCloseTo(10000 / 12, 9)
    expect(output.totalInterest).toBeGreaterThan(0)
  })
  it.each([
    [{ principal: '0', annualRate: '6', months: '36' }, 'positive', 'principal'],
    [{ principal: '10000', annualRate: '-1', months: '36' }, 'rate', 'annualRate'],
    [{ principal: '10000', annualRate: '100.01', months: '36' }, 'rate', 'annualRate'],
    [{ principal: '10000', annualRate: '6', months: '0' }, 'months', 'months'],
    [{ principal: '10000', annualRate: '6', months: '36,5' }, 'months', 'months'],
    [{ principal: '10000', annualRate: '6', months: '1201' }, 'months', 'months'],
  ])('rejects invalid loan inputs %j', (values, code, field) => {
    expect(calculate('loan', values)).toMatchObject({ status: 'invalid', error: { code, field } })
  })
  it('rejects overflowing totals and a positive rate that underflows during calculation', () => {
    expect(calculate('loan', { principal: '1e308', annualRate: '100', months: '1200' })).toMatchObject({ status: 'invalid', error: { code: 'range' } })
    expect(calculate('loan', { principal: '10000', annualRate: '5e-324', months: '36' })).toMatchObject({ status: 'invalid', error: { code: 'range' } })
  })
})

describe('integrated BMI calculator', () => {
  it('uses kilograms and centimetres and returns only the numeric index', () => {
    expect(ready('bmi', { weight: '70', height: '175' }).bmi).toBeCloseTo(22.857142857142858, 12)
    expect(ready('bmi', { weight: '70,5', height: '175,5' }).bmi).toBeCloseTo(70.5 / (1.755 ** 2), 12)
    expect(calculate('bmi', { weight: '70', height: '175' }).results).toHaveLength(1)
  })
  it('rejects nonpositive or unrepresentable measurements', () => {
    expect(calculate('bmi', { weight: '0', height: '175' })).toMatchObject({ status: 'invalid', error: { code: 'positive', field: 'weight' } })
    expect(calculate('bmi', { weight: '70', height: '-175' })).toMatchObject({ status: 'invalid', error: { code: 'positive', field: 'height' } })
    expect(calculate('bmi', { weight: '70', height: '1e-200' })).toMatchObject({ status: 'invalid', error: { code: 'range' } })
  })
})

describe('result formatting', () => {
  it.each([['de', 1000], ['en', 1000], ['de', 250000.25], ['en', 250000.25]])('preserves %s result %s when reused as an input', (locale, value) => {
    expect(parseNumber(formatResult(value, locale))).toEqual({ status: 'ready', value })
  })
  it('formats rounded floating-point output in the current locale', () => {
    expect(formatResult(0.1 + 0.2, 'de')).toBe('0,3')
    expect(formatResult(1 / 3, 'en')).toBe('0.333333333333')
    expect(formatResult(-0, 'de')).toBe('0')
  })
  it('keeps tiny and large numbers legible without rounding them to zero', () => {
    expect(formatResult(1e-20, 'en')).toBe('1E-20')
    expect(formatResult(1e20, 'de')).toBe('1E20')
  })
})
