const DAY = 86400000
export const MAX_DURATION_ROWS = 50
const invalid = (code, field) => ({ status: 'invalid', error: { code, field } })
const ready = (key, value) => ({ status: 'ready', results: [{ key, value, symbol: '' }] })

// Date inputs describe calendar days, never local instants or daylight-saving hours.
function calendarDay(input) {
  const text = String(input ?? '').trim()
  if (!text) return { status: 'empty' }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return { status: 'invalid' }
  const [year, month, day] = text.split('-').map(Number)
  if (year < 1 || year > 9999 || month < 1 || month > 12 || day < 1 || day > 31) return { status: 'invalid' }
  const date = new Date(0)
  date.setUTCFullYear(year, month - 1, day)
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return { status: 'invalid' }
  return { status: 'ready', value: date.getTime() / DAY }
}

export function calculateDate(inputs, { mode }) {
  if (!['difference', 'add'].includes(mode)) return invalid('selection')
  const fields = mode === 'difference' ? ['startDate', 'endDate'] : ['startDate']
  const parsed = {}
  for (const field of fields) {
    parsed[field] = calendarDay(inputs[field])
    if (parsed[field].status === 'invalid') return invalid('date', field)
  }
  let days
  if (mode === 'add') {
    const text = String(inputs.days ?? '').trim()
    if (text && (!/^[+-]?\d{1,7}$/.test(text) || Math.abs(Number(text)) > 3652058)) return invalid('days', 'days')
    days = text ? Number(text) : undefined
  }
  if (Object.values(parsed).some(value => value.status === 'empty') || (mode === 'add' && days === undefined)) return { status: 'empty' }
  if (mode === 'difference') return ready('days', parsed.endDate.value - parsed.startDate.value)
  const date = new Date((parsed.startDate.value + days) * DAY)
  if (date.getUTCFullYear() < 1 || date.getUTCFullYear() > 9999) return invalid('dateRange', 'days')
  return ready('date', date.toISOString().slice(0, 10))
}

export function calculateDuration({ rows = [{}] }) {
  if (!Array.isArray(rows) || rows.length < 1 || rows.length > MAX_DURATION_ROWS) return invalid('durationRows')
  let total = 0
  let filled = false
  for (let index = 0; index < rows.length; index++) {
    const row = rows[index]
    if (!row || !['add', 'subtract'].includes(row.operation ?? 'add')) return invalid('selection')
    let seconds = 0
    for (const [field, factor, maximum] of [['hours', 3600, 999999], ['minutes', 60, 59], ['seconds', 1, 59]]) {
      const text = String(row[field] ?? '').trim()
      if (!text) continue
      if (!/^\d{1,6}$/.test(text) || Number(text) > maximum) return invalid(field === 'hours' ? 'durationHours' : 'durationPart', `rows.${index}.${field}`)
      filled = true
      seconds += Number(text) * factor
    }
    total += seconds * (row.operation === 'subtract' ? -1 : 1)
  }
  if (!filled) return { status: 'empty' }
  const absolute = Math.abs(total)
  const formatted = `${total < 0 ? '−' : ''}${Math.floor(absolute / 3600)}:${String(Math.floor(absolute / 60) % 60).padStart(2, '0')}:${String(absolute % 60).padStart(2, '0')}`
  return { status: 'ready', results: [{ key: 'duration', value: formatted, symbol: '' }, { key: 'totalSeconds', value: total, symbol: 's' }] }
}
