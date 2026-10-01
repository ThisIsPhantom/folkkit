import { useCallback, useEffect, useId, useState } from 'react'
import { IconCopy, IconPlus, IconTrash } from '@tabler/icons-react'
import { useI18n } from '../../i18n'
import { answerValues, emptyOption, formatOption, parsePollLocation, pollRequest, tallyResponses } from './pollModel'
import './poll.css'

function adminStorageKey(id) {
  return `folkkit.poll.admin.${id}`
}

function rememberAdminToken(id, token) {
  try { localStorage.setItem(adminStorageKey(id), token) } catch { /* optional convenience */ }
}

function recallAdminToken(id) {
  try { return localStorage.getItem(adminStorageKey(id)) } catch { return null }
}

function forgetAdminToken(id) {
  try { localStorage.removeItem(adminStorageKey(id)) } catch { /* optional convenience */ }
}

function CopyField({ label, value, hint }) {
  const { t } = useI18n()
  const id = useId()
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* the field stays selectable */ }
  }
  return (
    <div className="poll-copy">
      <label htmlFor={id}>{label}</label>
      <div className="poll-copy__row">
        <input id={id} readOnly value={value} onFocus={event => event.target.select()} />
        <button type="button" onClick={copy}><IconCopy size={18} aria-hidden="true" /> {copied ? t('studioPoll.copied') : t('studioPoll.copy')}</button>
      </div>
      {hint && <p className="studio-status">{hint}</p>}
    </div>
  )
}

function CreatePoll({ onCreated }) {
  const { t } = useI18n()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [options, setOptions] = useState(() => [emptyOption(), emptyOption()])
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const updateOption = (index, patch) => setOptions(current => current.map((option, position) => position === index ? { ...option, ...patch } : option))

  const submit = async (event) => {
    event.preventDefault()
    setError(null)
    const filled = options.filter(option => option.date || option.label.trim())
    if (!title.trim()) return setError('required')
    if (filled.length === 0) return setError('options')
    setBusy(true)
    try {
      const created = await pollRequest({ action: 'create', title, description, options: filled, password })
      rememberAdminToken(created.id, created.adminToken)
      onCreated(created)
    } catch (failure) {
      setError(failure.code || 'unknown')
      setBusy(false)
    }
  }

  return (
    <form className="poll-card" onSubmit={submit} noValidate>
      <h1>{t('studioPoll.createTitle')}</h1>
      <p className="studio-status">{t('studioPoll.createIntro')}</p>
      <div className="poll-field">
        <label htmlFor="poll-title">{t('studioPoll.pollTitle')}</label>
        <input id="poll-title" required maxLength={120} value={title} placeholder={t('studioPoll.pollTitlePlaceholder')} onChange={event => setTitle(event.target.value)} />
      </div>
      <div className="poll-field">
        <label htmlFor="poll-description">{t('studioPoll.description')}</label>
        <textarea id="poll-description" rows={2} maxLength={1000} value={description} onChange={event => setDescription(event.target.value)} />
      </div>
      <fieldset className="poll-options">
        <legend>{t('studioPoll.options')}</legend>
        {options.map((option, index) => (
          <div className="poll-options__row" key={index}>
            <input type="date" aria-label={t('studioPoll.optionDate', { number: index + 1 })} value={option.date} onChange={event => updateOption(index, { date: event.target.value })} />
            <input aria-label={t('studioPoll.optionLabel', { number: index + 1 })} maxLength={80} value={option.label} placeholder={t('studioPoll.optionLabelPlaceholder')} onChange={event => updateOption(index, { label: event.target.value })} />
            <button type="button" className="poll-icon-button" aria-label={t('studioPoll.removeOption', { number: index + 1 })} disabled={options.length <= 1} onClick={() => setOptions(current => current.filter((_, position) => position !== index))}>
              <IconTrash size={18} aria-hidden="true" />
            </button>
          </div>
        ))}
        <button type="button" disabled={options.length >= 40} onClick={() => setOptions(current => [...current, emptyOption()])}><IconPlus size={18} aria-hidden="true" /> {t('studioPoll.addOption')}</button>
      </fieldset>
      <div className="poll-field">
        <label htmlFor="poll-password">{t('studioPoll.password')}</label>
        <input id="poll-password" type="password" autoComplete="new-password" maxLength={200} value={password} onChange={event => setPassword(event.target.value)} />
        <p className="studio-status">{t('studioPoll.passwordHint')}</p>
      </div>
      {error && <p role="alert">{t(`studioPoll.errors.${error}`)}</p>}
      <button type="submit" className="studio-primary" disabled={busy}>{busy ? t('studioPoll.creating') : t('studioPoll.create')}</button>
    </form>
  )
}

function PasswordGate({ error, onSubmit }) {
  const { t } = useI18n()
  const [value, setValue] = useState('')
  return (
    <form className="poll-card" onSubmit={event => { event.preventDefault(); onSubmit(value) }}>
      <h1>{t('studioPoll.protectedTitle')}</h1>
      <p className="studio-status">{t('studioPoll.protectedIntro')}</p>
      <div className="poll-field">
        <label htmlFor="poll-gate-password">{t('studioPoll.password').replace(/ \(.*\)$/, '')}</label>
        <input id="poll-gate-password" type="password" autoComplete="current-password" value={value} onChange={event => setValue(event.target.value)} />
      </div>
      {error && <p role="alert">{t(`studioPoll.errors.${error}`)}</p>}
      <button type="submit" className="studio-primary">{t('studioPoll.open')}</button>
    </form>
  )
}

function VoteForm({ poll, onSubmit }) {
  const { locale, t } = useI18n()
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [answers, setAnswers] = useState(() => poll.options.map(() => null))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [sent, setSent] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setError(null)
    if (!name.trim() || !address.trim()) return setError('required')
    if (answers.some(answer => !answer)) return setError('answers')
    setBusy(true)
    try {
      await onSubmit({ name, address, answers })
      setSent(true)
      setName('')
      setAddress('')
      setAnswers(poll.options.map(() => null))
    } catch (failure) {
      setError(failure.code || 'unknown')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="poll-card" onSubmit={submit} noValidate>
      <h2>{t('studioPoll.voteTitle')}</h2>
      <div className="poll-vote__people">
        <div className="poll-field">
          <label htmlFor="poll-name">{t('studioPoll.name')}</label>
          <input id="poll-name" required autoComplete="name" maxLength={80} value={name} onChange={event => { setName(event.target.value); setSent(false) }} />
        </div>
        <div className="poll-field">
          <label htmlFor="poll-address">{t('studioPoll.address')}</label>
          <input id="poll-address" required autoComplete="street-address" maxLength={200} value={address} aria-describedby="poll-address-hint" onChange={event => setAddress(event.target.value)} />
        </div>
      </div>
      <p className="studio-status" id="poll-address-hint">{t('studioPoll.addressHint')}</p>
      <ul className="poll-vote__options">
        {poll.options.map((option, index) => {
          const label = formatOption(option, locale)
          return (
            <li key={index}>
              <span className="poll-vote__label">{label}</span>
              <div className="poll-segment" role="group" aria-label={t('studioPoll.answerGroup', { option: label })}>
                {answerValues.map(value => (
                  <button key={value} type="button" data-answer={value} aria-pressed={answers[index] === value}
                    onClick={() => setAnswers(current => current.map((answer, position) => position === index ? value : answer))}>
                    {t(`studioPoll.${value}`)}
                  </button>
                ))}
              </div>
            </li>
          )
        })}
      </ul>
      {error && <p role="alert">{t(`studioPoll.errors.${error}`)}</p>}
      {sent && <p role="status" className="poll-success">{t('studioPoll.thanks')}</p>}
      <button type="submit" className="studio-primary" disabled={busy}>{busy ? t('studioPoll.submitting') : t('studioPoll.submit')}</button>
    </form>
  )
}

const answerSymbols = { yes: '✓', maybe: '~', no: '–' }

function Results({ poll, onDeleteResponse }) {
  const { locale, t } = useI18n()
  const { totals, best } = tallyResponses(poll.options, poll.responses)
  return (
    <section className="poll-card" aria-labelledby="poll-results-title">
      <div className="poll-results__head">
        <h2 id="poll-results-title">{t('studioPoll.resultsTitle')}</h2>
        <span className="studio-status">{t('studioPoll.participants', { count: poll.responses.length })}</span>
      </div>
      {poll.responses.length === 0 ? <p className="studio-status">{t('studioPoll.noResponses')}</p> : (
        <div className="poll-table-wrap" tabIndex={0} role="region" aria-labelledby="poll-results-title">
          <table className="poll-table">
            <thead>
              <tr>
                <th scope="col">{t('studioPoll.participant')}</th>
                {poll.options.map((option, index) => (
                  <th scope="col" key={index} className={best.includes(index) ? 'poll-best' : undefined}>
                    {formatOption(option, locale)}
                    {best.includes(index) && <span className="poll-best__badge">{t('studioPoll.best')}</span>}
                  </th>
                ))}
                {poll.admin && <th scope="col"><span className="sr-only">{t('studioPoll.adminBadge')}</span></th>}
              </tr>
            </thead>
            <tbody>
              {poll.responses.map(response => (
                <tr key={response.id}>
                  <th scope="row">
                    {response.name}
                    {poll.admin && <span className="poll-address">{response.address}</span>}
                  </th>
                  {response.answers.map((answer, index) => (
                    <td key={index} data-answer={answer}><span aria-hidden="true">{answerSymbols[answer]}</span><span className="sr-only">{t(`studioPoll.${answer}`)}</span></td>
                  ))}
                  {poll.admin && <td><button type="button" className="poll-icon-button" aria-label={t('studioPoll.deleteResponse', { name: response.name })} onClick={() => onDeleteResponse(response.id)}><IconTrash size={16} aria-hidden="true" /></button></td>}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th scope="row">{t('studioPoll.total')}</th>
                {totals.map((total, index) => (
                  <td key={index} className={best.includes(index) ? 'poll-best' : undefined}>
                    <strong>{total.yes}</strong>{total.maybe > 0 && <span className="studio-status"> (+{total.maybe})</span>}
                  </td>
                ))}
                {poll.admin && <td />}
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </section>
  )
}

function PollView({ id, initialAdminToken, onNavigate }) {
  const { t } = useI18n()
  const [adminToken] = useState(() => initialAdminToken || recallAdminToken(id))
  const [password, setPassword] = useState('')
  const [state, setState] = useState({ status: 'loading' })

  const fetchState = useCallback(async (nextPassword) => {
    try {
      return { status: 'ready', poll: await pollRequest({ action: 'get', id, password: nextPassword, adminToken }) }
    } catch (failure) {
      if (failure.code === 'passwordRequired' || failure.code === 'passwordWrong') return { status: 'locked', error: nextPassword ? failure.code : null }
      return { status: 'error', error: failure.code }
    }
  }, [id, adminToken])

  useEffect(() => {
    let active = true
    if (initialAdminToken) rememberAdminToken(id, initialAdminToken)
    fetchState('').then(next => { if (active) setState(next) })
    return () => { active = false }
  }, [id, initialAdminToken, fetchState])

  if (state.status === 'loading') return <p role="status" className="studio-status">{t('studioPoll.loading')}</p>
  if (state.status === 'locked') return <PasswordGate error={state.error} onSubmit={async value => { setPassword(value); setState(await fetchState(value)) }} />
  if (state.status === 'error' || state.status === 'deleted') return (
    <div className="poll-card">
      <p role={state.status === 'error' ? 'alert' : 'status'}>{state.status === 'deleted' ? t('studioPoll.deleted') : t(`studioPoll.errors.${state.error}`)}</p>
      <button type="button" onClick={() => onNavigate('/poll')}>{t('studioPoll.newPoll')}</button>
    </div>
  )

  const { poll } = state
  const shareUrl = `${window.location.origin}/poll/${poll.id}`
  const submitVote = async (vote) => {
    const updated = await pollRequest({ action: 'respond', id, password, adminToken, ...vote })
    setState({ status: 'ready', poll: updated })
  }
  const deleteResponse = async (responseId) => {
    try {
      setState({ status: 'ready', poll: await pollRequest({ action: 'deleteResponse', id, adminToken, responseId }) })
    } catch (failure) {
      setState({ status: 'error', error: failure.code })
    }
  }
  const deletePoll = async () => {
    if (!window.confirm(t('studioPoll.confirmDeletePoll'))) return
    try {
      await pollRequest({ action: 'deletePoll', id, adminToken })
      forgetAdminToken(id)
      setState({ status: 'deleted' })
    } catch (failure) {
      setState({ status: 'error', error: failure.code })
    }
  }

  return (
    <>
      <header className="poll-header">
        <h1>{poll.title}{poll.admin && <span className="poll-badge">{t('studioPoll.adminBadge')}</span>}</h1>
        {poll.description && <p className="poll-description">{poll.description}</p>}
      </header>
      {poll.admin && (
        <section className="poll-card" aria-label={t('studioPoll.createdTitle')}>
          <CopyField label={t('studioPoll.shareLink')} value={shareUrl} />
          <CopyField label={t('studioPoll.adminLink')} value={`${shareUrl}#admin=${adminToken}`} hint={t('studioPoll.adminHint')} />
        </section>
      )}
      <VoteForm key={poll.id} poll={poll} onSubmit={submitVote} />
      <Results poll={poll} onDeleteResponse={deleteResponse} />
      {poll.admin && <button type="button" className="poll-danger" onClick={deletePoll}><IconTrash size={18} aria-hidden="true" /> {t('studioPoll.deletePoll')}</button>}
    </>
  )
}

export default function PollPage({ location, onNavigate }) {
  const { id, adminToken } = parsePollLocation(location)
  return (
    <div className="studio-page poll-page">
      {id
        ? <PollView key={id} id={id} initialAdminToken={adminToken} onNavigate={onNavigate} />
        : <CreatePoll onCreated={created => onNavigate(`/poll/${created.id}#admin=${created.adminToken}`)} />}
    </div>
  )
}
