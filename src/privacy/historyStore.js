import {
  clearContentHistory,
  getContentHistory,
  getHistoryEnabled,
  setContentHistory,
  setHistoryEnabled,
} from './preferences'

const MAX_ENTRIES = 30
const MAX_PREVIEW_LENGTH = 120
export const HISTORY_CHANGE_EVENT = 'folkkit:history-change'

function notifyChange() {
  window.dispatchEvent(new Event(HISTORY_CHANGE_EVENT))
}

function normalizeEntry(entry) {
  if (
    !entry ||
    typeof entry.from !== 'string' ||
    typeof entry.to !== 'string' ||
    typeof entry.input !== 'string' ||
    typeof entry.output !== 'string' ||
    !Number.isFinite(entry.timestamp)
  ) {
    return null
  }

  return {
    from: entry.from,
    to: entry.to,
    input: entry.input.slice(0, MAX_PREVIEW_LENGTH),
    output: entry.output.slice(0, MAX_PREVIEW_LENGTH),
    timestamp: entry.timestamp,
  }
}

function listEntries() {
  return getContentHistory()
    .map(normalizeEntry)
    .filter(Boolean)
    .slice(0, MAX_ENTRIES)
}

export const historyStore = Object.freeze({
  isEnabled() {
    return getHistoryEnabled()
  },

  setEnabled(enabled) {
    if (enabled !== true) clearContentHistory()
    setHistoryEnabled(enabled)
    notifyChange()
  },

  list() {
    if (!getHistoryEnabled()) return []
    return listEntries().map(entry => ({ ...entry }))
  },

  append(entry) {
    if (!getHistoryEnabled()) return

    const normalizedEntry = normalizeEntry(entry)
    if (!normalizedEntry) return

    setContentHistory([normalizedEntry, ...listEntries()].slice(0, MAX_ENTRIES))
    notifyChange()
  },

  remove(index) {
    if (!getHistoryEnabled()) return
    if (!Number.isInteger(index) || index < 0) return

    const entries = listEntries()
    if (index >= entries.length) return

    entries.splice(index, 1)
    setContentHistory(entries)
    notifyChange()
  },

  clear({ revokeConsent = false } = {}) {
    clearContentHistory()
    if (revokeConsent) setHistoryEnabled(false)
    notifyChange()
  },
})
