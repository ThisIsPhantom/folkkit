import { describe, expect, it } from 'vitest'
import { buildQrPayload } from './qrPayloads.js'

describe('structured QR payloads', () => {
  it('escapes Wi-Fi delimiters, quotes, backslashes and Unicode without losing content', () => {
    expect(buildQrPayload('wifi', {
      wifiEncryption: 'WPA',
      wifiName: 'Gäste;Netz,"A"\\5',
      wifiPassword: 'p:a,s;s"\\😀',
      wifiHidden: true,
    })).toEqual({
      data: 'WIFI:T:WPA;S:Gäste\\;Netz\\,\\"A\\"\\\\5;P:p\\:a\\,s\\;s\\"\\\\😀;H:true;;',
      fieldErrors: {},
    })
  })

  it('serializes a vCard 4.0 with CRLF boundaries and escaped text values', () => {
    expect(buildQrPayload('vcard', {
      contactName: 'Zoë Example',
      contactOrganization: 'Studio, Nord; Süd\\West\nAtelier',
      contactPhone: '+41 79 123 45 67',
      contactEmail: 'zoe@example.test',
      contactWebsite: 'https://example.test/über-uns',
    })).toEqual({
      data: [
        'BEGIN:VCARD',
        'VERSION:4.0',
        'FN:Zoë Example',
        'ORG:Studio\\, Nord\\; Süd\\\\West\\nAtelier',
        'TEL;VALUE=uri:tel:+41791234567',
        'EMAIL:zoe@example.test',
        'URL:https://example.test/%C3%BCber-uns',
        'END:VCARD',
      ].join('\r\n'),
      fieldErrors: {},
    })
  })

  it('percent-encodes UTF-8 mail and SMS fields', () => {
    expect(buildQrPayload('email', {
      emailTo: 'hello@example.test',
      emailSubject: 'Grüsse & Termin?',
      emailBody: 'Hoi Jörg\nBis bald = ja',
    })).toEqual({
      data: 'mailto:hello@example.test?subject=Gr%C3%BCsse%20%26%20Termin%3F&body=Hoi%20J%C3%B6rg%0ABis%20bald%20%3D%20ja',
      fieldErrors: {},
    })
    expect(buildQrPayload('sms', {
      smsPhone: '+41 79 123 45 67',
      smsMessage: 'Grüsse & bis bald?',
    })).toEqual({
      data: 'sms:+41791234567?body=Gr%C3%BCsse%20%26%20bis%20bald%3F',
      fieldErrors: {},
    })
    expect(buildQrPayload('email', { emailTo: 'Mike&family@example.org' })).toEqual({
      data: 'mailto:Mike%26family@example.org',
      fieldErrors: {},
    })
  })

  it('associates missing or invalid required values with their fields and emits no payload', () => {
    expect(buildQrPayload('wifi', { wifiName: '', wifiEncryption: 'WPA' })).toEqual({
      data: '',
      fieldErrors: { wifiName: 'required', wifiPassword: 'required' },
    })
    expect(buildQrPayload('url', { text: 'javascript:alert(1)' })).toEqual({
      data: '',
      fieldErrors: { text: 'http_url' },
    })
    expect(buildQrPayload('email', { emailTo: 'not-an-email' })).toEqual({
      data: '',
      fieldErrors: { emailTo: 'email' },
    })
    expect(buildQrPayload('vcard', { contactName: 'Ada', contactPhone: 'call-me' })).toEqual({
      data: '',
      fieldErrors: { contactPhone: 'phone' },
    })
  })

  it('prevents structured line injection while keeping ordinary line breaks in message bodies', () => {
    expect(buildQrPayload('vcard', {
      contactName: 'Ada\r\nEMAIL:attacker@example.test',
      contactOrganization: '',
      contactPhone: '',
      contactEmail: '',
      contactWebsite: '',
    }).data).toContain('FN:Ada\\nEMAIL:attacker@example.test\r\nEND:VCARD')
    expect(buildQrPayload('wifi', {
      wifiName: 'Home\u0000Net',
      wifiEncryption: 'nopass',
      wifiPassword: 'ignored',
    })).toEqual({ data: '', fieldErrors: { wifiName: 'single_line' } })
  })
})

it('preserves exact Wi-Fi credentials including edge spaces', () => {
  expect(buildQrPayload('wifi', { wifiName: ' Guest ', wifiPassword: ' password ', wifiEncryption: 'WPA' })).toEqual({ data: 'WIFI:T:WPA;S: Guest ;P: password ;;', fieldErrors: {} })
})
it('rejects unsupported Wi-Fi control characters instead of changing credentials', () => {
  expect(buildQrPayload('wifi', { wifiName: 'Home\u0000Net', wifiPassword: 'a\tb', wifiEncryption: 'WPA' })).toEqual({ data: '', fieldErrors: { wifiName: 'single_line', wifiPassword: 'single_line' } })
})
