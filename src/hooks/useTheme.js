import { useState, useEffect } from 'react'
import { preferenceKeys } from '../privacy/preferences'

function getInitialTheme() {
  const stored = localStorage.getItem(preferenceKeys.theme)
  if (stored === 'light' || stored === 'dark') return stored
  return 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(preferenceKeys.theme, theme)
    // Update PWA theme color
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#171c20' : '#f6f7f8')
  }, [theme])

  const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))

  return { theme, toggle }
}
