import { useState, useEffect, useCallback } from 'react'
import { HISTORY_CHANGE_EVENT, historyStore } from '../privacy/historyStore'
import { getFormatById } from '../formats'
import { useToast } from '../hooks/useToast'
import './History.css'

function timeAgo(ts) {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'now'
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  return `${Math.floor(hrs / 24)}d`
}

function History({ onSelect }) {
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
      toast('Copied to clipboard')
    } catch { /* clipboard not available */ }
  }, [toast])

  if (!isEnabled) {
    return (
      <div className="history">
        <p>Local history is stored only in this browser after you enable it.</p>
        <button className="history-clear" onClick={handleEnable}>Enable local history</button>
      </div>
    )
  }

  return (
    <div className="history">
      <div className="history-header">
        <span className="history-label">Recents</span>
        <button className="history-clear" onClick={handleDeleteAndDisable}>Delete history and disable</button>
      </div>
      <div className="history-scroll">
        {items.length === 0 && <p>No local history yet.</p>}
        {items.map((item, i) => {
          const fromFmt = getFormatById(item.from)
          const toFmt = getFormatById(item.to)
          return (
            <div
              key={`${item.timestamp}-${i}`}
              className="history-card"
              role="button"
              tabIndex={0}
              onClick={() => onSelect(item)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(item) } }}
            >
              <button
                className="history-card-remove"
                onClick={(e) => handleRemove(e, i)}
                aria-label="Remove from history"
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
                <span className="history-card-time">{timeAgo(item.timestamp)}</span>
              </div>
              <span className="history-card-preview">{item.input}</span>
              <span className="history-card-output">{item.output}</span>
              <div className="history-card-actions">
                <button
                  className="history-card-btn"
                  onClick={(e) => handleCopy(e, item.output)}
                >
                  Copy
                </button>
                <button
                  className="history-card-btn"
                  onClick={(e) => { e.stopPropagation(); onSelect(item) }}
                >
                  Reuse
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default History
