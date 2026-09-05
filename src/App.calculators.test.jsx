import { act } from 'react'
import { beforeEach, expect, test, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { renderWithProviders } from './test/renderWithProviders'

beforeEach(() => {
  localStorage.clear()
  history.replaceState(null, '', '/')
  window.scrollTo = vi.fn()
})

test('the old percent URL opens labelled fields at its canonical calculator address', async () => {
  history.replaceState(null, '', '/workspace?tool=percentage-calc')
  renderWithProviders(<App />)
  expect(await screen.findByRole('textbox', { name: 'Grundwert' })).toBeVisible()
  expect(window.location.pathname + window.location.search).toBe('/calculate?calculator=percent')
  expect(screen.getByRole('link', { name: 'Rechner', exact: true })).toHaveAttribute('aria-current', 'page')
  expect(screen.queryByRole('textbox', { name: 'Werkzeugeingabe' })).not.toBeInTheDocument()
})

test('query-only history changes select the calculator and preserve values in its form', async () => {
  history.replaceState(null, '', '/calculate?calculator=pythagoras')
  const user = userEvent.setup()
  renderWithProviders(<App />)
  await user.type(await screen.findByLabelText('Kathete a'), '3')
  await user.type(screen.getByLabelText('Kathete b'), '4')
  expect(screen.getByTestId('result-c')).toHaveTextContent('5')
  await user.click(screen.getByRole('button', { name: 'Kreis', exact: true }))
  expect(window.location.search).toBe('?calculator=circle')
  act(() => {
    history.replaceState(null, '', '/calculate?calculator=pythagoras')
    window.dispatchEvent(new PopStateEvent('popstate'))
  })
  expect(await screen.findByLabelText('Kathete a')).toHaveValue('3')
  expect(screen.getByTestId('result-c')).toHaveTextContent('5')
})

test('calculation tools live in their hub with integrated fields', async () => {
  history.replaceState(null, '', '/tools')
  const user = userEvent.setup()
  renderWithProviders(<App />)
  expect(screen.queryByRole('button', { name: 'Prozentrechner öffnen', exact: true })).not.toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'BMI berechnen öffnen', exact: true })).not.toBeInTheDocument()
  await user.click(screen.getByRole('link', { name: 'Rechner', exact: true }))
  await user.click(await screen.findByRole('button', { name: 'BMI', exact: true }))
  expect(window.location.pathname + window.location.search).toBe('/calculate?calculator=bmi')
  expect(screen.getByLabelText('Gewicht (kg)')).toBeVisible()
  expect(screen.getByRole('link', { name: 'Rechner', exact: true })).toHaveAttribute('aria-current', 'page')
})

test.each([
  ['aspect-ratio', 'aspect-ratio', 'Breite (px)'],
  ['loan-calc', 'loan', 'Kreditbetrag'],
  ['bmi-calc', 'bmi', 'Gewicht (kg)'],
])('old %s links open the matching new form', async (tool, calculator, label) => {
  history.replaceState(null, '', `/workspace?tool=${tool}`)
  renderWithProviders(<App />)
  expect(await screen.findByLabelText(label)).toBeVisible()
  expect(window.location.pathname + window.location.search).toBe(`/calculate?calculator=${calculator}`)
  expect(screen.queryByRole('textbox', { name: 'Werkzeugeingabe' })).not.toBeInTheDocument()
})
