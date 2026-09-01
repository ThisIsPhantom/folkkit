import {
  clearContentHistory,
  getContentHistory,
  getHistoryEnabled,
  setContentHistory,
  setHistoryEnabled,
} from './preferences'
import { isReleasedFormatPair } from '../catalog/evidenceRegistry'

const MAX_ENTRIES = 30
const MAX_PREVIEW_LENGTH = 120
const LEGACY_HISTORY_KEY = 'convert-everything-history'
export const HISTORY_CHANGE_EVENT = 'folkkit:history-change'

function notifyChange() {
  window.dispatchEvent(new Event(HISTORY_CHANGE_EVENT))
}

function clearStoredHistory() {
  clearContentHistory()
  localStorage.removeItem(LEGACY_HISTORY_KEY)
}

function ensureCurrentConsent() {
  if (getHistoryEnabled()) return true
  clearStoredHistory()
  setHistoryEnabled(false)
  return false
}

function normalizeEntry(entry) {
  if (
    !entry ||
    typeof entry.from !== 'string' ||
    typeof entry.to !== 'string' ||
    typeof entry.input !== 'string' ||
    typeof entry.output !== 'string' ||
    !Number.isFinite(entry.timestamp) ||
    !isReleasedFormatPair(entry.from, entry.to)
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
    return ensureCurrentConsent()
  },

  setEnabled(enabled) {
    const wasEnabled = ensureCurrentConsent()
    if (enabled !== true || !wasEnabled) clearStoredHistory()
    setHistoryEnabled(enabled)
    notifyChange()
  },

  list() {
    if (!ensureCurrentConsent()) return []
    return listEntries().map(entry => ({ ...entry }))
  },

  append(entry) {
    if (!ensureCurrentConsent()) return

    const normalizedEntry = normalizeEntry(entry)
    if (!normalizedEntry) return

    setContentHistory([normalizedEntry, ...listEntries()].slice(0, MAX_ENTRIES))
    notifyChange()
  },

  remove(index) {
    if (!ensureCurrentConsent()) return
    if (!Number.isInteger(index) || index < 0) return

    const entries = listEntries()
    if (index >= entries.length) return

    entries.splice(index, 1)
    setContentHistory(entries)
    notifyChange()
  },

  clear({ revokeConsent = false } = {}) {
    clearStoredHistory()
    if (revokeConsent) setHistoryEnabled(false)
    notifyChange()
  },
})

if (typeof localStorage !== 'undefined') ensureCurrentConsent()
