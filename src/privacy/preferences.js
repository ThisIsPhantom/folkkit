export const preferenceKeys = Object.freeze({
  locale: 'folkkit:locale',
  theme: 'folkkit:theme',
  favorites: 'folkkit:favorites',
  favoriteTools: 'folkkit:favorite-tools',
  recentTools: 'folkkit:recent-tools',
  historyEnabled: 'folkkit:history-enabled',
  contentHistory: 'folkkit:content-history',
  installDismissed: 'folkkit:install-dismissed',
})

export function getHistoryEnabled() {
  return localStorage.getItem(preferenceKeys.historyEnabled) === 'true'
}

export function setHistoryEnabled(enabled) {
  if (enabled === true) {
    localStorage.setItem(preferenceKeys.historyEnabled, 'true')
    return
  }

  localStorage.removeItem(preferenceKeys.historyEnabled)
}

export function getContentHistory() {
  try {
    const value = JSON.parse(localStorage.getItem(preferenceKeys.contentHistory) || '[]')
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

export function setContentHistory(entries) {
  if (!Array.isArray(entries)) return
  localStorage.setItem(preferenceKeys.contentHistory, JSON.stringify(entries))
}

export function clearContentHistory() {
  localStorage.removeItem(preferenceKeys.contentHistory)
}
