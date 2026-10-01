export const answerValues = Object.freeze(['yes', 'maybe', 'no'])
export const retentionDays = Object.freeze([1, 7, 30, 90])
const knownErrors = new Set(['required', 'tooLong', 'options', 'tooMany', 'answers', 'notFound', 'expired', 'retention', 'passwordRequired', 'passwordWrong', 'full', 'forbidden', 'network'])

export class PollError extends Error {
  constructor(code) {
    super(code)
    this.code = knownErrors.has(code) ? code : 'unknown'
  }
}

export async function pollRequest(body, fetcher = globalThis.fetch) {
  let response
  try {
    response = await fetcher('/api/poll.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
      credentials: 'omit',
    })
  } catch {
    throw new PollError('network')
  }
  let data = null
  try { data = await response.json() } catch { /* handled below */ }
  if (!response.ok || !data) throw new PollError(data?.error || (response.status >= 500 ? 'network' : 'unknown'))
  return data
}

export function parsePollLocation({ pathname = '', hash = '' }) {
  const match = pathname.match(/^\/poll\/([A-Za-z0-9_-]{8,32})\/?$/)
  const admin = new URLSearchParams(hash.replace(/^#/, '')).get('admin')
  return { id: match ? match[1] : null, adminToken: match && admin && /^[A-Za-z0-9_-]{16,64}$/.test(admin) ? admin : null }
}

export function formatOption(option, locale) {
  let date = ''
  if (option.date) {
    const value = new Date(`${option.date}T00:00:00`)
    if (!Number.isNaN(value.getTime())) date = new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'de-CH', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).format(value)
  }
  return [date, option.label].filter(Boolean).join(' · ')
}

export function tallyResponses(options, responses) {
  const totals = options.map(() => ({ yes: 0, maybe: 0, no: 0 }))
  for (const response of responses) {
    response.answers.forEach((answer, index) => {
      if (totals[index] && answerValues.includes(answer)) totals[index][answer] += 1
    })
  }
  // Doodle-style ranking: yes counts fully, maybe breaks ties.
  const scores = totals.map(total => total.yes * 2 + total.maybe)
  const top = Math.max(0, ...scores)
  const best = top > 0 ? scores.flatMap((score, index) => score === top ? [index] : []) : []
  return { totals, best }
}

export function emptyOption() {
  return { date: '', label: '' }
}
