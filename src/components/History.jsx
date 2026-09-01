import { useState, useEffect, useCallback } from 'react'
import { HISTORY_CHANGE_EVENT, historyStore } from '../privacy/historyStore'
import { getLocalizedReleasedFormatById } from '../formats'
import { useI18n } from '../i18n'
import { useToast } from '../hooks/useToast'
import './History.css'

function timeAgo(ts, t) {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return t('history.now')
  if (mins < 60) return t('history.minutesAgo', { count: mins })
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return t('history.hoursAgo', { count: hrs })
  return t('history.daysAgo', { count: Math.floor(hrs / 24) })
}

function History({ onSelect }) {
  const { locale, t } = useI18n()
  const [items, setItems] = useState([])
  const [isEnabled, setIsEnabled] = useState(false)
  const toast = useToast()

  useEffect(() => {
    const refresh = () => {
      setIsEnabled(historyStore.isEnabled())
      setItems(historyStore.list())
    }
    refresh()
    window.addEventListener(HISTORY_CHANGE_EVENT, refresh)
    return () => window.removeEventListener(HISTORY_CHANGE_EVENT, refresh)
  }, [])

  const handleEnable = () => {
    historyStore.setEnabled(true)
  }

  const handleDeleteAndDisable = () => {
    historyStore.clear({ revokeConsent: true })
  }

  const handleRemove = (e, index) => {
    e.stopPropagation()
    historyStore.remove(index)
  }

  const handleCopy = useCallback(async (e, output) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(output)
      toast(t('history.copied'))
    } catch { /* clipboard not available */ }
  }, [t, toast])

  if (!isEnabled) {
    return (
      <div className="history">
        <p>{t('history.consent')}</p>
        <button className="history-clear" onClick={handleEnable}>{t('history.enable')}</button>
      </div>
    )
  }

  return (
    <div className="history">
      <div className="history-header">
        <span className="history-label">{t('history.recent')}</span>
        <button className="history-clear" onClick={handleDeleteAndDisable}>{t('history.deleteAndDisable')}</button>
      </div>
      <ul className="history-scroll" aria-label={t('history.recent')}>
        {items.length === 0 && <li className="history-empty">{t('history.empty')}</li>}
        {items.map((item, i) => {
          const fromFmt = getLocalizedReleasedFormatById(item.from, locale)
          const toFmt = getLocalizedReleasedFormatById(item.to, locale)
          return (
            <li
              key={`${item.timestamp}-${i}`}
            >
              <article className="history-card">
              <button
                className="history-card-remove"
                onClick={(e) => handleRemove(e, i)}
                aria-label={t('history.remove')}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2.5 2.5l5 5M7.5 2.5l-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </button>
              <div className="history-card-top">
                <span className="history-card-route">
                  {fromFmt?.name || item.from}
                  <svg className="history-arrow" width="10" height="10" viewBox="0 0 10 10"><path d="M2 5h6M6 3l2 2-2 2" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {toFmt?.name || item.to}
                </span>
                <span className="history-card-time">{timeAgo(item.timestamp, t)}</span>
              </div>
              <span className="history-card-preview">{item.input}</span>
              <span className="history-card-output">{item.output}</span>
              <div className="history-card-actions">
                <button
                  className="history-card-btn"
                  onClick={(e) => handleCopy(e, item.output)}
                >
                  {t('history.copy')}
                </button>
                <button
                  className="history-card-btn"
                  onClick={(e) => { e.stopPropagation(); onSelect(item) }}
                >
                  {t('history.reuse')}
                </button>
              </div>
              </article>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default History
