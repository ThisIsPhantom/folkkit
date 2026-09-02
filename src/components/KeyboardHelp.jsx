import { useEffect, useRef } from 'react'
import { useI18n } from '../i18n'
import './KeyboardHelp.css'

const shortcuts = [
  { groupKey: 'keyboardHelp.convertGroup' },
  { keys: ['Ctrl/⌘', 'L'], descKey: 'keyboardHelp.focusInput' },
  { keys: ['Ctrl/⌘', '⇧', 'S'], descKey: 'keyboardHelp.swap' },
  { keys: ['Ctrl/⌘', '⇧', 'C'], descKey: 'keyboardHelp.copyOutput' },
  { keys: ['Ctrl/⌘', '⇧', 'X'], descKey: 'keyboardHelp.reset' },
  { keys: ['Ctrl/⌘', 'B'], descKey: 'keyboardHelp.toggleBatch' },
  { keys: ['Esc'], descKey: 'keyboardHelp.backToFormats' },
  { groupKey: 'keyboardHelp.globalGroup' },
  { keys: ['Ctrl/⌘', 'D'], descKey: 'keyboardHelp.toggleTheme' },
  { keys: ['?'], descKey: 'keyboardHelp.thisHelp' },
]

function KeyboardHelp({ open, onClose }) {
  const { t } = useI18n()
  const closeRef = useRef(null)
  useEffect(() => {
    if (!open) return
    const previousFocus = document.activeElement
    closeRef.current?.focus()
    const handleKey = (e) => {
      if (e.key === 'Escape' || e.key === '?') {
        e.preventDefault()
        e.stopImmediatePropagation()
        onClose()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('keydown', handleKey)
      previousFocus?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="kb-backdrop" onClick={onClose}>
      <div
        className="kb-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="keyboard-help-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="kb-title" id="keyboard-help-title">{t('keyboardHelp.title')}</h2>
        <div className="kb-list">
          {shortcuts.map((s) => (
            s.groupKey ? (
              <div key={s.groupKey} className="kb-group-label">{t(s.groupKey)}</div>
            ) : (
              <div key={s.descKey} className="kb-row">
                <div className="kb-keys">
                  {s.keys.map((k, j) => (
                    <span key={j}>
                      <kbd className="kb-key">{k}</kbd>
                      {j < s.keys.length - 1 && <span className="kb-plus">+</span>}
                    </span>
                  ))}
                </div>
                <span className="kb-desc">{t(s.descKey)}</span>
              </div>
            )
          ))}
        </div>
        <div className="kb-footer">{t('keyboardHelp.footer')}</div>
        <button ref={closeRef} type="button" className="kb-close" onClick={onClose} aria-label={t('keyboardHelp.close')}>
          {t('keyboardHelp.closeVisible')}
        </button>
      </div>
    </div>
  )
}

export default KeyboardHelp
