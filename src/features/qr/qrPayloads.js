const CONTENT_TYPES = new Set(['text', 'url', 'wifi', 'vcard', 'email', 'sms'])
const WIFI_ENCRYPTION = new Set(['WPA', 'WEP', 'nopass'])

function plainText(value) {
  return Array.from(String(value ?? '').replace(/\r\n?/g, '\n'))
    .filter((character) => {
      const code = character.codePointAt(0)
      return code === 9 || code === 10 || code >= 32 && code !== 127
    })
    .join('')
}

function singleLine(value) {
  return plainText(value).replace(/[\n\t]/g, ' ').trim()
}

function normalizeHttpUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null
  } catch {
    return null
  }
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function mailRecipient(value) {
  return encodeURIComponent(value).replace(/%40/gi, '@')
}

function wifiEscape(value) {
  return value.replace(/[\\;,:"]/g, character => `\\${character}`)
}

function vcardEscape(value) {
  return plainText(value)
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
}

function normalizePhone(value) {
  return singleLine(value).replace(/[\s().-]/g, '')
}

function result(data = '', fieldErrors = {}) {
  return { data, fieldErrors }
}

export function buildQrPayload(contentType, fields = {}) {
  const type = CONTENT_TYPES.has(contentType) ? contentType : 'text'

  if (type === 'text') {
    const data = plainText(fields.text)
    return data ? result(data) : result('', { text: 'required' })
  }

  if (type === 'url') {
    const data = singleLine(fields.text)
    if (!data) return result('', { text: 'required' })
    return normalizeHttpUrl(data) ? result(data) : result('', { text: 'http_url' })
  }

  if (type === 'wifi') {
    const name = String(fields.wifiName ?? '')
    const encryption = WIFI_ENCRYPTION.has(fields.wifiEncryption) ? fields.wifiEncryption : 'WPA'
    const password = String(fields.wifiPassword ?? '')
    const fieldErrors = {}
    if (!name) fieldErrors.wifiName = 'required'
    const hasControl = value => Array.from(value).some(character => character.codePointAt(0) < 32 || character.codePointAt(0) === 127)
    if (hasControl(name)) fieldErrors.wifiName = 'single_line'
    if (encryption !== 'nopass' && hasControl(password)) fieldErrors.wifiPassword = 'single_line'
    if (encryption !== 'nopass' && !password) fieldErrors.wifiPassword = 'required'
    if (Object.keys(fieldErrors).length) return result('', fieldErrors)
    const parts = [`T:${encryption}`, `S:${wifiEscape(name)}`]
    if (encryption !== 'nopass') parts.push(`P:${wifiEscape(password)}`)
    if (fields.wifiHidden) parts.push('H:true')
    return result(`WIFI:${parts.join(';')};;`)
  }

  if (type === 'vcard') {
    const name = plainText(fields.contactName).trim()
    const email = singleLine(fields.contactEmail)
    const websiteInput = singleLine(fields.contactWebsite)
    const website = websiteInput ? normalizeHttpUrl(websiteInput) : ''
    const phoneInput = singleLine(fields.contactPhone)
    const phone = normalizePhone(phoneInput)
    const fieldErrors = {}
    if (!name) fieldErrors.contactName = 'required'
    if (email && !validEmail(email)) fieldErrors.contactEmail = 'email'
    if (websiteInput && !website) fieldErrors.contactWebsite = 'http_url'
    if (phoneInput && !/^\+?[0-9]{3,15}$/.test(phone)) fieldErrors.contactPhone = 'phone'
    if (Object.keys(fieldErrors).length) return result('', fieldErrors)
    const lines = ['BEGIN:VCARD', 'VERSION:4.0', `FN:${vcardEscape(name)}`]
    const organization = plainText(fields.contactOrganization).trim()
    if (organization) lines.push(`ORG:${vcardEscape(organization)}`)
    if (phone) lines.push(`TEL;VALUE=uri:tel:${phone}`)
    if (email) lines.push(`EMAIL:${vcardEscape(email)}`)
    if (website) lines.push(`URL:${website}`)
    lines.push('END:VCARD')
    return result(lines.join('\r\n'))
  }

  if (type === 'email') {
    const to = singleLine(fields.emailTo)
    if (!to) return result('', { emailTo: 'required' })
    if (!validEmail(to)) return result('', { emailTo: 'email' })
    const query = []
    const subject = singleLine(fields.emailSubject)
    const body = plainText(fields.emailBody)
    if (subject) query.push(`subject=${encodeURIComponent(subject)}`)
    if (body) query.push(`body=${encodeURIComponent(body)}`)
    return result(`mailto:${mailRecipient(to)}${query.length ? `?${query.join('&')}` : ''}`)
  }

  const phone = normalizePhone(fields.smsPhone)
  if (!phone) return result('', { smsPhone: 'required' })
  if (!/^\+?[0-9]{3,15}$/.test(phone)) return result('', { smsPhone: 'phone' })
  const message = plainText(fields.smsMessage)
  return result(`sms:${phone}${message ? `?body=${encodeURIComponent(message)}` : ''}`)
}
