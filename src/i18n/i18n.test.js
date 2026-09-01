import { createElement } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { I18nProvider } from './I18nProvider'
import { translate, useI18n } from './index'

function LocaleProbe() {
  const { locale, setLocale, t } = useI18n()

  return createElement('div', null,
    createElement('output', { 'data-testid': 'locale' }, locale),
    createElement('output', { 'data-testid': 'translation' }, t('catalog.toolCount', { count: 10 })),
    createElement('button', { type: 'button', onClick: () => setLocale('en') }, 'English'),
  )
}

afterEach(() => {
  localStorage.clear()
})

describe('localization', () => {
  it('looks up German and English messages with interpolation', () => {
    expect(translate({ catalog: { toolCount: '{count} Werkzeuge' } }, 'catalog.toolCount', { count: 10 })).toBe('10 Werkzeuge')
    expect(translate({ catalog: { toolCount: '{count} tools' } }, 'catalog.toolCount', { count: 10 })).toBe('10 tools')
  })

  it('fails when a production translation key is missing', () => {
    expect(() => translate({ catalog: {} }, 'catalog.toolCount')).toThrow('Missing translation: catalog.toolCount')
  })

  it('defaults to German and persists an explicit language choice', async () => {
    Object.defineProperty(navigator, 'language', { configurable: true, value: 'de-CH' })
    const user = userEvent.setup()
    render(createElement(I18nProvider, null, createElement(LocaleProbe)))

    expect(screen.getByTestId('locale')).toHaveTextContent('de')
    expect(screen.getByTestId('translation')).toHaveTextContent('10 Werkzeuge')

    await user.click(screen.getByRole('button', { name: 'English' }))

    expect(screen.getByTestId('locale')).toHaveTextContent('en')
    expect(localStorage.getItem('folkkit:locale')).toBe('en')

    delete navigator.language
  })

  it('uses a stored English preference over the browser default', () => {
    localStorage.setItem('folkkit:locale', 'en')

    render(createElement(I18nProvider, null, createElement(LocaleProbe)))

    expect(screen.getByTestId('locale')).toHaveTextContent('en')
  })
})
