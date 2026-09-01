import { useCallback, useMemo, useState } from 'react'
import { preferenceKeys } from '../privacy/preferences'
import { I18nContext } from './context'
import { getMessages, normalizeLocale, translate } from './index'

function getInitialLocale() {
  try {
    const storedLocale = localStorage.getItem(preferenceKeys.locale)
    if (storedLocale === 'de' || storedLocale === 'en') return storedLocale
  } catch {
    // Storage can be unavailable in privacy-restricted browser contexts.
  }

  return navigator.language?.toLowerCase().startsWith('en') ? 'en' : 'de'
}

export function I18nProvider({ children }) {
  const [locale, setCurrentLocale] = useState(getInitialLocale)
  const setLocale = useCallback((nextLocale) => {
    const normalizedLocale = normalizeLocale(nextLocale)
    setCurrentLocale(normalizedLocale)
    try {
      localStorage.setItem(preferenceKeys.locale, normalizedLocale)
    } catch {
      // A language preference is optional and must not block the interface.
    }
  }, [])
  const t = useCallback((key, vars) => translate(getMessages(locale), key, vars), [locale])
  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
