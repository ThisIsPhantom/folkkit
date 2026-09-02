import messagesDe from './messages.de.js'
import messagesEn from './messages.en.js'

export { useI18n } from './context.js'

export const messagesByLocale = Object.freeze({
  de: messagesDe,
  en: messagesEn,
})

export function normalizeLocale(locale) {
  return locale === 'en' ? 'en' : 'de'
}

export function translate(messages, key, vars = {}) {
  const value = key.split('.').reduce((node, part) => node?.[part], messages)
  if (typeof value !== 'string') throw new Error(`Missing translation: ${key}`)
  return value.replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? `{${name}}`))
}

export function getMessages(locale) {
  return messagesByLocale[normalizeLocale(locale)]
}
