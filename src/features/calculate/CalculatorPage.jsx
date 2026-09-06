import { useEffect, useRef, useState } from 'react'
import { IconArrowsExchange, IconArrowsRightLeft, IconCircle, IconCube, IconPercentage, IconRulerMeasure, IconSquare, IconTriangle, IconAspectRatio, IconCreditCard, IconScale, IconCalendar, IconClock, IconCopy, IconCheck } from '@tabler/icons-react'
import { useI18n } from '../../i18n/index.js'
import { CALCULATOR_IDS, DEFAULT_OPTIONS, UNIT_CATEGORIES, calculate, calculatorFields, formatResult } from './calculatorModel.js'
import './calculator.css'
import DurationFields from './DurationFields.jsx'
import { calculatorExample } from './calculatorExamples.js'

const icons = { percent: IconPercentage, 'rule-of-three': IconArrowsExchange, pythagoras: IconTriangle, circle: IconCircle, area: IconSquare, volume: IconCube, units: IconRulerMeasure, 'aspect-ratio': IconAspectRatio, loan: IconCreditCard, bmi: IconScale, date: IconCalendar, duration: IconClock }
const normalizeCalculator = value => CALCULATOR_IDS.includes(value) ? value : 'percent'

function SelectField({ label, id, value, onChange, entries }) {
  return <label className="calc-field" htmlFor={id}><span>{label}</span><select id={id} name={id} value={value} onChange={event => onChange(event.target.value)}>{entries.map(([key, text]) => <option value={key} key={key}>{text}</option>)}</select></label>
}

function formulaFor(id, options, t) {
  if (id === 'percent') {
    if (options.mode === 'of') return `${t('fields.rate')} ÷ 100 × ${t('fields.base')}`
    if (options.mode === 'share') return `${t('fields.part')} ÷ ${t('fields.base')} × 100`
    return `(${t('fields.next')} − ${t('fields.previous')}) ÷ ${t('fields.previous')} × 100`
  }
  if (id === 'rule-of-three') return 'B ÷ A × C'
  if (id === 'pythagoras') return 'a² + b² = c²'
  if (id === 'circle') return `${t('results.circumference')} = 2 × π × r\n${t('results.area')} = π × r²`
  if (id === 'area') return options.shape === 'triangle' ? 'A = b × h ÷ 2' : 'A = b × h'
  if (id === 'volume') return options.shape === 'cylinder' ? 'V = π × r² × h' : 'V = b × d × h'
  if (id === 'aspect-ratio') return options.mode === 'resize' ? t('aspectResizeFormula') : t('aspectRatioFormula')
  if (id === 'loan') return t('loanFormula')
  if (id === 'bmi') return 'BMI = kg ÷ (cm ÷ 100)²'
  if (id === 'date') return t(options.mode === 'add' ? 'dateAddFormula' : 'dateDifferenceFormula')
  if (id === 'duration') return t('durationFormula')
  const units = UNIT_CATEGORIES[options.category]
  return `${units.find(unit => unit.id === options.from).symbol} → ${units.find(unit => unit.id === options.to).symbol}`
}

function hintFor(id, options) {
  if (id === 'rule-of-three') return 'ruleHint'
  if (id === 'pythagoras') return 'pythagorasHint'
  if (id === 'area' && options.shape === 'triangle') return 'triangleHint'
  if (id === 'percent' && options.mode === 'change') return 'percentChangeHint'
  if (id === 'units' && options.category === 'storage') return 'storageHint'
  if (id === 'units' && options.category === 'temperature') return 'temperatureHint'
  if (id === 'aspect-ratio') return options.mode === 'resize' ? 'aspectResizeHint' : 'aspectHint'
  if (id === 'loan') return 'loanHint'
  if (id === 'bmi') return 'bmiHint'
  if (id === 'date') return options.mode === 'add' ? 'dateAddHint' : 'dateDifferenceHint'
  if (id === 'duration') return 'durationHint'
  return null
}

function formatAmount(value, locale) {
  if (Math.abs(value) >= 1e12 || (value !== 0 && Math.abs(value) < 0.01)) return formatResult(value, locale)
  return new Intl.NumberFormat(locale === 'de' ? 'de-DE' : 'en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: false }).format(value)
}

export default function CalculatorPage({ initialCalculator = 'percent', onSelectCalculator }) {
  const { locale, t: translate } = useI18n()
  const t = (key, vars) => translate(`studioCalculate.${key}`, vars)
  const [selection, setSelection] = useState(() => normalizeCalculator(initialCalculator))
  const [forms, setForms] = useState({})
  // With routing supplied by the shell, query and history changes select the form
  // directly. Values remain in component state while visiting another calculator.
  const active = onSelectCalculator ? normalizeCalculator(initialCalculator) : selection
  const [copyState, setCopyState] = useState(() => ({ calculatorId: active, feedback: null }))
  const copyRevisionRef = useRef(0)
  useEffect(() => () => {
    copyRevisionRef.current += 1
  }, [active])
  const copied = copyState.calculatorId === active ? copyState.feedback : null
  if (copyState.calculatorId !== active) setCopyState({ calculatorId: active, feedback: null })
  const current = forms[active] || {}
  const values = current.values || {}
  const options = { ...DEFAULT_OPTIONS[active], ...current.options }
  const calculation = calculate(active, values, options)
  const fields = calculatorFields(active, options)
  const geometry = ['pythagoras', 'circle', 'area', 'volume'].includes(active)
  const hint = hintFor(active, options)
  const invalidateCopyFeedback = () => {
    copyRevisionRef.current += 1
    setCopyState({ calculatorId: active, feedback: null })
  }
  const update = patch => {
    invalidateCopyFeedback()
    setForms(previous => ({ ...previous, [active]: { ...previous[active], ...patch } }))
  }
  const setOption = (key, value) => update({ options: { ...options, [key]: value } })
  const setValue = (field, value) => update({ values: { ...values, [field]: value } })
  const selectCalculator = id => {
    invalidateCopyFeedback()
    setSelection(id)
    onSelectCalculator?.(id)
  }
  const entries = (keys, namespace) => keys.map(key => [key, t(`${namespace}.${key}`)])
  const fieldLabel = field => {
    if (active === 'bmi') return t(`fields.${field === 'height' ? 'bodyHeight' : 'weight'}`)
    if (active === 'aspect-ratio' && field !== 'targetWidth') return t(`fields.${field === 'width' ? 'pixelWidth' : 'pixelHeight'}`)
    if (field === 'measure') return t(`fields.${options.measure}`)
    if (field === 'width' && active === 'area' && options.shape === 'triangle') return t('fields.triangleBase')
    return t(`fields.${field}`)
  }
  const unitEntries = active === 'units' ? UNIT_CATEGORIES[options.category].map(item => [item.id, `${item.symbol} · ${t(`unitNames.${options.category}.${item.id}`)}`]) : []
  const resultValue = item => typeof item.value === 'string' ? item.value : item.key === 'ratio' ? `${calculation.ratio.width}:${calculation.ratio.height}` : ['loan', 'bmi'].includes(active) ? formatAmount(item.value, locale) : formatResult(item.value, locale)
  const copyResult = async item => {
    const revision = copyRevisionRef.current + 1
    copyRevisionRef.current = revision
    setCopyState({ calculatorId: active, feedback: null })
    try {
      await navigator.clipboard.writeText(resultValue(item))
      if (copyRevisionRef.current === revision) setCopyState({ calculatorId: active, feedback: { resultKey: item.key, revision, status: 'copied' } })
    } catch {
      if (copyRevisionRef.current === revision) setCopyState({ calculatorId: active, feedback: { resultKey: item.key, revision, status: 'copyError' } })
    }
  }
  const copyStatus = item => copied?.resultKey === item.key ? copied.status : 'copy'
  const hasValues = active === 'duration' ? values.rows?.some(row => ['hours', 'minutes', 'seconds'].some(field => row[field])) : Object.values(values).some(Boolean)

  return (
    <section className="studio-page calc-page" aria-labelledby="calc-page-title">
      <header className="calc-heading"><h1 id="calc-page-title">{t('title')}</h1><p>{t('intro')}</p></header>
      <div className="calc-layout">
        <div className="calc-mobile-choice"><SelectField label={t('choose')} id="calc-selection" value={active} onChange={selectCalculator} entries={entries(CALCULATOR_IDS, 'calculators')} /></div>
        <div className="calc-choices" role="group" aria-label={t('choose')}>
          {CALCULATOR_IDS.map(id => {
            const Icon = icons[id]
            return <button key={id} type="button" aria-pressed={active === id} onClick={() => selectCalculator(id)}><Icon size={20} stroke={1.7} aria-hidden="true" /><span>{t(`calculators.${id}`)}</span></button>
          })}
        </div>
        <div className="calc-workbench">
          <header className="calc-workbench-heading"><div><h2>{t(`calculators.${active}`)}</h2><p>{t(`descriptions.${active}`)}</p></div><div className="calc-heading-actions"><button type="button" onClick={() => update({ values: calculatorExample(active, options) })}>{t('example')}</button><button type="button" onClick={() => update({ values: {} })} disabled={!hasValues}>{t('clear')}</button></div></header>
          <div className="calc-workbench-body">
            <form className="calc-form" onSubmit={event => event.preventDefault()} aria-label={t(`calculators.${active}`)}>
              {active === 'percent' && <SelectField label={t('operation')} id="calc-operation" value={options.mode} onChange={value => setOption('mode', value)} entries={entries(['of', 'share', 'change'], 'percentModes')} />}
              {active === 'date' && <SelectField label={t('operation')} id="calc-operation" value={options.mode} onChange={value => setOption('mode', value)} entries={entries(['difference', 'add'], 'dateModes')} />}
              {active === 'duration' && <DurationFields values={values} calculation={calculation} onChange={rows => update({ values: { rows } })} t={t} />}
              {active === 'aspect-ratio' && <SelectField label={t('operation')} id="calc-operation" value={options.mode} onChange={value => setOption('mode', value)} entries={entries(['ratio', 'resize'], 'aspectModes')} />}
              {active === 'pythagoras' && <SelectField label={t('missing')} id="calc-missing" value={options.missing} onChange={value => setOption('missing', value)} entries={entries(['c', 'a', 'b'], 'fields')} />}
              {active === 'circle' && <SelectField label={t('knownMeasure')} id="calc-measure" value={options.measure} onChange={value => setOption('measure', value)} entries={entries(['radius', 'diameter'], 'fields')} />}
              {['area', 'volume'].includes(active) && <SelectField label={t('shape')} id="calc-shape" value={options.shape} onChange={value => setOption('shape', value)} entries={entries(active === 'area' ? ['rectangle', 'triangle'] : ['cuboid', 'cylinder'], 'shapes')} />}
              {active === 'units' && <>
                <SelectField label={t('category')} id="calc-category" value={options.category} onChange={category => {
                  const units = UNIT_CATEGORIES[category]
                  update({ options: { category, from: units[0].id, to: units[1].id } })
                }} entries={entries(Object.keys(UNIT_CATEGORIES), 'categories')} />
                <div className="calc-unit-pair">
                  <SelectField label={t('from')} id="calc-from" value={options.from} onChange={value => setOption('from', value)} entries={unitEntries} />
                  <button className="calc-swap" type="button" aria-label={t('swap')} title={t('swap')} onClick={() => update({ options: { ...options, from: options.to, to: options.from } })}><IconArrowsRightLeft size={20} aria-hidden="true" /></button>
                  <SelectField label={t('to')} id="calc-to" value={options.to} onChange={value => setOption('to', value)} entries={unitEntries} />
                </div>
              </>}
              <div className="calc-input-grid">
                {fields.map(field => {
                  const id = `calc-${active}-${field}`
                  const error = calculation.status === 'invalid' && calculation.error.field === field ? calculation.error.code : null
                  return <div className="calc-field" key={field}>
                    <label htmlFor={id}>{fieldLabel(field)}{field === 'rate' && <span className="calc-input-symbol" aria-hidden="true">%</span>}</label>
                    <input id={id} name={field} type={field.endsWith('Date') ? 'date' : 'text'} min={field.endsWith('Date') ? '0001-01-01' : undefined} max={field.endsWith('Date') ? '9999-12-31' : undefined} inputMode={active === 'date' ? undefined : 'decimal'} autoComplete="off" spellCheck={false} maxLength={128} value={values[field] || ''} onChange={event => setValue(field, event.target.value)} aria-invalid={error ? 'true' : undefined} aria-describedby={error ? `${id}-error` : undefined} />
                    {error && <p id={`${id}-error`} className="calc-field-error">{t(`errors.${error}`)}</p>}
                  </div>
                })}
              </div>
              {hint && <p className="calc-hint">{t(hint)}</p>}
              {geometry && <p className="calc-hint">{t('sameUnits')}</p>}
              {!['date', 'duration'].includes(active) && <p className="calc-decimal-hint">{t('decimalHint')}</p>}
            </form>
            <section className="calc-result" aria-label={t('resultHeading')}>
              <div className="calc-result-live" role="status" aria-live="polite" aria-atomic="true">
                {calculation.status === 'ready' ? <dl>{calculation.ratio && options.mode === 'resize' && <div className="calc-result-item"><dt>{t('results.ratio')}</dt><dd>{calculation.ratio.width}:{calculation.ratio.height}</dd></div>}{calculation.results.map(item => <div className="calc-result-item" key={item.key}><dt>{t(`results.${item.key}`)}</dt><dd data-testid={`result-${item.key}`}>{resultValue(item)}{item.symbol && <span className="calc-result-unit"> {item.symbol === '²' ? t('unitSquared') : item.symbol === '³' ? t('unitCubed') : item.symbol}</span>}</dd><dd className="calc-result-action"><button type="button" className="calc-copy" aria-label={t('copyResult', { name: t(`results.${item.key}`) })} onClick={() => copyResult(item)}>{copyStatus(item) === 'copied' ? <IconCheck size={16} aria-hidden="true" /> : <IconCopy size={16} aria-hidden="true" />}{t(copyStatus(item))}</button></dd></div>)}</dl> : calculation.status === 'invalid' ? <p className="calc-result-error">{t(`errors.${calculation.error.code}`)}</p> : <div className="calc-empty"><span aria-hidden="true">=</span><strong>{t('empty')}</strong><p>{t('emptyHint')}</p></div>}
              </div>
              <details className="calc-formula" key={active}><summary>{t('formula')}</summary><p>{formulaFor(active, options, t)}</p></details>
              {calculation.status === 'ready' && !calculation.ratio && !['date', 'duration'].includes(active) && <p className="calc-precision">{t(['loan', 'bmi'].includes(active) ? 'roundedPrecision' : 'precision')}</p>}
            </section>
          </div>
        </div>
      </div>
    </section>
  )
}
