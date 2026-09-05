import { describe, expect, it } from 'vitest'
import { calculate } from './calculatorModel.js'

const value = (id, inputs, options) => calculate(id, inputs, options).results?.[0]?.value

describe('calendar calculations', () => {
  it('counts calendar days across leap years and clock changes, with signed differences', () => {
    expect(value('date', { startDate: '2024-02-28', endDate: '2024-03-01' })).toBe(2)
    expect(value('date', { startDate: '2026-03-28', endDate: '2026-03-30' })).toBe(2)
    expect(value('date', { startDate: '2026-10-26', endDate: '2026-10-24' })).toBe(-2)
    expect(value('date', { startDate: '0099-12-31', endDate: '0100-01-01' })).toBe(1)
    expect(value('date', { startDate: '2026-01-01', endDate: '2026-01-01' })).toBe(0)
  })
  it.each(['2026-02-29', '1900-02-29', '2024-04-31', '0000-01-01', '10000-01-01', '2026-13-01', '2026-01-00', '2026-1-1', '2026-01-01T12:00:00Z'])('rejects invalid or ambiguous dates: %s', startDate => {
    expect(calculate('date', { startDate, endDate: '2026-01-01' })).toEqual({ status: 'invalid', error: { code: 'date', field: 'startDate' } })
  })
  it('adds or subtracts whole days and bounds the resulting date', () => {
    expect(value('date', { startDate: '2024-02-28', days: '2' }, { mode: 'add' })).toBe('2024-03-01')
    expect(value('date', { startDate: '2000-03-01', days: '-1' }, { mode: 'add' })).toBe('2000-02-29')
    expect(value('date', { startDate: '0001-01-01', days: '0' }, { mode: 'add' })).toBe('0001-01-01')
    for (const [startDate, days] of [['0001-01-01', '-1'], ['9999-12-31', '1'], ['2026-01-01', '1.5'], ['2026-01-01', '1e9']]) {
      expect(calculate('date', { startDate, days }, { mode: 'add' }).status).toBe('invalid')
    }
    expect(calculate('date', { startDate: '', endDate: '' }).status).toBe('empty')
    expect(calculate('date', {}, { mode: 'other' }).status).toBe('invalid')
  })
})

describe('duration sums', () => {
  it('normalizes seconds and minutes and preserves a negative total', () => {
    const rows = [{ hours: '1', minutes: '59', seconds: '45' }, { minutes: '1', seconds: '30' }]
    expect(value('duration', { rows })).toBe('2:01:15')
    expect(value('duration', { rows: [{ hours: '1' }, { hours: '2', seconds: '1', operation: 'subtract' }] })).toBe('−1:00:01')
    expect(value('duration', { rows: [{ seconds: '0' }] })).toBe('0:00:00')
    expect(calculate('duration', { rows: [{}] }).status).toBe('empty')
  })
  it.each([{ minutes: '60' }, { seconds: '-1' }, { hours: '1.1' }, { hours: '1000000' }, { seconds: '1e2' }, { hours: '1', operation: 'multiply' }])('rejects invalid duration fields: %j', row => {
    expect(calculate('duration', { rows: [row] }).status).toBe('invalid')
  })
  it('bounds the number of rows and uses exact integer sums', () => {
    expect(calculate('duration', { rows: Array.from({ length: 51 }, () => ({ hours: '1' })) }).status).toBe('invalid')
    expect(value('duration', { rows: Array.from({ length: 50 }, () => ({ hours: '999999', minutes: '59', seconds: '59' })) })).toBe('49999999:59:10')
  })
})
