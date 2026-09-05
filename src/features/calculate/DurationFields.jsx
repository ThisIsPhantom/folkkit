import { MAX_DURATION_ROWS } from './calendarModel.js'

const emptyRows = [{ id: 1 }, { id: 2 }]

export default function DurationFields({ values, calculation, onChange, t }) {
  const rows = values.rows || emptyRows
  const updateRow = (index, patch) => onChange(rows.map((row, i) => i === index ? { ...row, ...patch } : row))
  return <div className="calc-durations">
    {rows.map((row, index) => <fieldset className="calc-duration" key={row.id}>
      <legend>{t('durationRow', { number: index + 1 })}</legend>
      <div className="calc-duration-actions">
        <label className="calc-field"><span className="sr-only">{t('durationOperation', { number: index + 1 })}</span><select name={`duration-${row.id}-operation`} value={row.operation || 'add'} onChange={event => updateRow(index, { operation: event.target.value })}><option value="add">+ {t('add')}</option><option value="subtract">− {t('subtract')}</option></select></label>
        <button type="button" disabled={rows.length === 1} aria-label={t('removeDuration', { number: index + 1 })} onClick={() => onChange(rows.filter((_, i) => i !== index))}>{t('remove')}</button>
      </div>
      <div className="calc-duration-inputs">{['hours', 'minutes', 'seconds'].map(field => {
        const inputId = `duration-${row.id}-${field}`
        const error = calculation.error?.field === `rows.${index}.${field}` ? calculation.error.code : null
        return <div className="calc-field" key={field}><label htmlFor={inputId}>{t(`fields.${field}`)}</label><input id={inputId} name={inputId} type="text" inputMode="numeric" autoComplete="off" maxLength={field === 'hours' ? 6 : 2} placeholder="0" value={row[field] || ''} onChange={event => updateRow(index, { [field]: event.target.value })} aria-invalid={error ? 'true' : undefined} aria-describedby={error ? `${inputId}-error` : undefined} />{error && <p id={`${inputId}-error`} className="calc-field-error">{t(`errors.${error}`)}</p>}</div>
      })}</div>
    </fieldset>)}
    <button type="button" disabled={rows.length >= MAX_DURATION_ROWS} onClick={() => onChange([...rows, { id: Math.max(...rows.map(row => row.id)) + 1 }])}>{t('addDuration')}</button>
  </div>
}
