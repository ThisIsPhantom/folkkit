import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { I18nContext } from '../../i18n/context.js'
import { translate } from '../../i18n/index.js'
import CalculatorPage from './CalculatorPage.jsx'
import messagesDe from './messages.de.js'
import messagesEn from './messages.en.js'

function renderPage(props = {}, locale = 'de') {
  const messages = { studioCalculate: locale === 'de' ? messagesDe : messagesEn }
  return render(<I18nContext.Provider value={{ locale, t: (key, vars) => translate(messages, key, vars) }}><CalculatorPage {...props} /></I18nContext.Provider>)
}

describe('calculator workspace', () => {
  it('offers twelve named calculators and actual percent fields with live output', () => {
    renderPage()
    expect(within(screen.getByRole('group', { name: 'Rechner wählen' })).getAllByRole('button')).toHaveLength(12)
    expect(screen.queryByRole('heading', { name: 'Weitere Rechner' })).not.toBeInTheDocument()
    expect(screen.getByText('Werte eingeben')).toBeVisible()
    fireEvent.change(screen.getByRole('textbox', { name: 'Prozentsatz' }), { target: { value: '12,5' } })
    fireEvent.change(screen.getByRole('textbox', { name: 'Grundwert' }), { target: { value: '240' } })
    expect(screen.getByRole('status')).toHaveTextContent('30')
    fireEvent.click(screen.getByRole('button', { name: 'Leeren' }))
    expect(screen.getByRole('textbox', { name: 'Grundwert' })).toHaveValue('')
  })
  it('associates inline errors with the exact input and removes stale results', () => {
    renderPage()
    fireEvent.change(screen.getByLabelText('Berechnung'), { target: { value: 'share' } })
    fireEvent.change(screen.getByRole('textbox', { name: 'Anteil' }), { target: { value: '2' } })
    fireEvent.change(screen.getByRole('textbox', { name: 'Grundwert' }), { target: { value: '0' } })
    expect(screen.getByRole('textbox', { name: 'Grundwert' })).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('textbox', { name: 'Grundwert' })).toHaveAccessibleDescription('Dieser Wert darf nicht null sein.')
    expect(screen.queryByTestId('result-result')).not.toBeInTheDocument()
  })
  it('preserves each form when switching calculators and honours a legacy initial selection', () => {
    renderPage({ initialCalculator: 'pythagoras' })
    fireEvent.change(screen.getByLabelText('Kathete a'), { target: { value: '3' } })
    fireEvent.change(screen.getByLabelText('Kathete b'), { target: { value: '4' } })
    expect(screen.getByTestId('result-c')).toHaveTextContent('5')
    fireEvent.click(screen.getByRole('button', { name: 'Kreis', exact: true }))
    fireEvent.click(screen.getByRole('button', { name: 'Pythagoras', exact: true }))
    expect(screen.getByLabelText('Kathete a')).toHaveValue('3')
    expect(screen.getByTestId('result-c')).toHaveTextContent('5')
  })
  it('resets incompatible unit selections and swaps units without erasing the entered value', () => {
    renderPage({ initialCalculator: 'units' })
    fireEvent.change(screen.getByLabelText('Wert'), { target: { value: '100' } })
    fireEvent.click(screen.getByRole('button', { name: 'Einheiten tauschen' }))
    expect(screen.getByLabelText('Von')).toHaveValue('cm')
    expect(screen.getByTestId('result-result')).toHaveTextContent('1 m')
    fireEvent.change(screen.getByLabelText('Grösse'), { target: { value: 'temperature' } })
    expect(screen.getByLabelText('Von')).toHaveValue('C')
    expect(screen.getByLabelText('Nach')).toHaveValue('F')
    expect(screen.getByTestId('result-result')).toHaveTextContent('212 °F')
  })
  it('renders the integrated aspect ratio calculator in English with exact ratio and resize', () => {
    renderPage({ initialCalculator: 'aspect-ratio' }, 'en')
    expect(screen.getByRole('heading', { level: 1, name: 'Calculators' })).toBeVisible()
    fireEvent.change(screen.getByRole('textbox', { name: 'Width (px)' }), { target: { value: '1920' } })
    fireEvent.change(screen.getByRole('textbox', { name: 'Height (px)' }), { target: { value: '1080' } })
    expect(screen.getByTestId('result-ratio')).toHaveTextContent('16:9')
    fireEvent.change(screen.getByRole('combobox', { name: 'Calculation' }), { target: { value: 'resize' } })
    fireEvent.change(screen.getByRole('textbox', { name: 'Target width (px)' }), { target: { value: '1280' } })
    expect(screen.getByTestId('result-targetHeight')).toHaveTextContent('720')
  })
  it('uses separate credit fields and displays zero-interest payment totals', () => {
    renderPage({ initialCalculator: 'loan' })
    fireEvent.change(screen.getByLabelText('Kreditbetrag'), { target: { value: '1200' } })
    fireEvent.change(screen.getByLabelText('Jahreszins (%)'), { target: { value: '0' } })
    fireEvent.change(screen.getByLabelText('Laufzeit (Monate)'), { target: { value: '12' } })
    expect(screen.getByTestId('result-monthlyPayment')).toHaveTextContent('100,00')
    expect(screen.getByTestId('result-totalPayment')).toHaveTextContent('1200,00')
    expect(screen.getByTestId('result-totalInterest')).toHaveTextContent('0,00')
  })
  it('computes BMI from kilogram and centimetre fields without a diagnosis', () => {
    renderPage({ initialCalculator: 'bmi' })
    fireEvent.change(screen.getByLabelText('Gewicht (kg)'), { target: { value: '70' } })
    fireEvent.change(screen.getByLabelText('Grösse (cm)'), { target: { value: '175' } })
    expect(screen.getByTestId('result-bmi')).toHaveTextContent('22,86')
  })
  it('keeps the translation tree complete in both languages', () => {
    const keys = (object, prefix = '') => Object.entries(object).flatMap(([key, value]) => typeof value === 'object' ? keys(value, `${prefix}${key}.`) : `${prefix}${key}`)
    expect(keys(messagesDe).sort()).toEqual(keys(messagesEn).sort())
  })
  it('fills an example and copies the displayed value with feedback', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Beispiel', exact: true }))
    expect(screen.getByTestId('result-result')).toHaveTextContent('36')
    fireEvent.click(screen.getByRole('button', { name: 'Ergebnis kopieren' }))
    expect(await screen.findByText('Kopiert')).toBeVisible()
    expect(writeText).toHaveBeenCalledWith('36')
    writeText.mockRejectedValueOnce(new Error('denied'))
    fireEvent.click(screen.getByRole('button', { name: 'Ergebnis kopieren' }))
    expect(await screen.findByText('Kopieren fehlgeschlagen')).toBeVisible()
  })
  it('uses real date fields and preserves signed days when changing the operation', () => {
    renderPage({ initialCalculator: 'date' })
    fireEvent.click(screen.getByRole('button', { name: 'Beispiel', exact: true }))
    expect(screen.getByLabelText('Startdatum')).toHaveAttribute('type', 'date')
    expect(screen.getByTestId('result-days')).toHaveTextContent('2')
    fireEvent.change(screen.getByLabelText('Berechnung'), { target: { value: 'add' } })
    fireEvent.change(screen.getByLabelText('Anzahl Tage'), { target: { value: '-1' } })
    expect(screen.getByTestId('result-date')).toHaveTextContent('2024-02-27')
  })
  it('sums separately labelled duration rows and clears them', () => {
    renderPage({ initialCalculator: 'duration' }, 'en')
    const first = within(screen.getByRole('group', { name: 'Duration 1' }))
    const second = within(screen.getByRole('group', { name: 'Duration 2' }))
    fireEvent.change(first.getByLabelText('Hours'), { target: { value: '1' } })
    fireEvent.change(second.getByLabelText('Minutes'), { target: { value: '30' } })
    expect(screen.getByTestId('result-duration')).toHaveTextContent('1:30:00')
    fireEvent.change(screen.getByLabelText('Operation for duration 2'), { target: { value: 'subtract' } })
    expect(screen.getByTestId('result-duration')).toHaveTextContent('0:30:00')
    fireEvent.click(screen.getByRole('button', { name: 'Clear', exact: true }))
    expect(screen.queryByTestId('result-duration')).not.toBeInTheDocument()
  })
})
