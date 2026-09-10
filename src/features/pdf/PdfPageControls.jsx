import { useState } from 'react'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { formatEditorPages, parseEditorPages } from './pdfInteraction.js'

// External selection/revision changes discard stale drafts without remounting focused controls.
function usePageDraft(scope, initialValue) {
  const [draft, setDraft] = useState({ scope, value: initialValue, error: false })
  const current = draft.scope === scope ? draft : { scope, value: initialValue, error: false }
  if (draft.scope !== scope) setDraft(current)
  return [current, (value, error = false) => setDraft({ scope, value, error })]
}

export function PdfPageSelection({ selectedPages, pageCount, revision, disabled, onSelect, t }) {
  const initialValue = formatEditorPages(selectedPages)
  const [draft, update] = usePageDraft(`${revision}:${pageCount}:${initialValue}`, initialValue)
  function submit(event) {
    event.preventDefault()
    if (disabled) return
    const pages = parseEditorPages(draft.value, pageCount)
    if (!pages) { update(draft.value, true); return }
    onSelect(pages)
    update(formatEditorPages(pages))
  }
  return <form className="pdf-range-form" onSubmit={submit}>
    <label htmlFor="pdf-page-range">{t('pageRange')}</label>
    <input id="pdf-page-range" type="text" value={draft.value} maxLength={1200} disabled={disabled} autoComplete="off" spellCheck={false} placeholder={pageCount > 3 ? `1–3, ${pageCount}` : pageCount > 1 ? `1–${pageCount}` : '1'} aria-invalid={draft.error || undefined} aria-describedby={draft.error ? 'pdf-range-error' : undefined} onChange={event => update(event.target.value)} />
    <button type="submit" disabled={disabled || !draft.value.trim()}>{t('applyPageRange')}</button>
    {draft.error && <p id="pdf-range-error" className="pdf-field-error" role="alert">{t('invalidPageRange', { count: pageCount })}</p>}
  </form>
}

export function PdfPageNavigation({ pageIndex, pageCount, revision, disabled, onNavigate, t }) {
  const [draft, update] = usePageDraft(`${revision}:${pageCount}:${pageIndex}`, String(pageIndex + 1))
  function submit(event) {
    event.preventDefault()
    if (disabled) return
    const value = draft.value.trim()
    const number = /^\d+$/.test(value) ? Number(value) : NaN
    if (!Number.isInteger(number) || number < 1 || number > pageCount) { update(value, true); return }
    onNavigate(number - 1)
    update(String(number))
  }
  return <nav className="pdf-page-navigation" aria-label={t('pageNavigation')}>
    <button type="button" aria-label={t('previousPage')} title={t('previousPage')} disabled={disabled || pageIndex === 0} onClick={() => onNavigate(pageIndex - 1)}><IconChevronLeft size={18} aria-hidden="true" /></button>
    <form onSubmit={submit}>
      <label htmlFor="pdf-page-number">{t('pageNumber')}</label>
      <input id="pdf-page-number" type="text" inputMode="numeric" autoComplete="off" maxLength={3} value={draft.value} disabled={disabled} aria-invalid={draft.error || undefined} aria-describedby={draft.error ? 'pdf-navigation-error' : 'pdf-page-total'} onChange={event => update(event.target.value)} />
      <span id="pdf-page-total">{t('pageTotal', { count: pageCount })}</span>
      <button type="submit" disabled={disabled}>{t('goToPage')}</button>
    </form>
    <button type="button" aria-label={t('nextPage')} title={t('nextPage')} disabled={disabled || pageIndex === pageCount - 1} onClick={() => onNavigate(pageIndex + 1)}><IconChevronRight size={18} aria-hidden="true" /></button>
    <span className="sr-only" role="status">{t('pageLocation', { number: pageIndex + 1, count: pageCount })}</span>
    {draft.error && <p id="pdf-navigation-error" className="pdf-field-error" role="alert">{t('invalidPageNumber', { count: pageCount })}</p>}
  </nav>
}
