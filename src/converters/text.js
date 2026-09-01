const REGEX_PATTERN_MAX_LENGTH = 500
const REGEX_INPUT_MAX_LENGTH = 200000

function getRegexGuardError(pattern, inputText) {
  if (pattern.length > REGEX_PATTERN_MAX_LENGTH) {
    return `(regex pattern too long — max ${REGEX_PATTERN_MAX_LENGTH} chars)`
  }
  if (inputText.length > REGEX_INPUT_MAX_LENGTH) {
    return `(text too long for regex mode — max ${REGEX_INPUT_MAX_LENGTH} chars)`
  }
  return null
}

export const textConverters = [
  {
    id: 'base64-encode',
    name: 'Base64 Encode',
    category: 'encode',
    description: 'Encode text to Base64',
    convert: (input) => {
      try {
        return btoa(unescape(encodeURIComponent(input)))
      } catch {
        return '(invalid input)'
      }
    },
  },
  {
    id: 'base64-decode',
    name: 'Base64 Decode',
    category: 'encode',
    description: 'Decode Base64 to text',
    convert: (input) => {
      try {
        return decodeURIComponent(escape(atob(input.trim())))
      } catch {
        return '(invalid base64)'
      }
    },
  },
  {
    id: 'base32-encode',
    name: 'Base32 Encode',
    category: 'encode',
    description: 'Encode text to Base32',
    convert: (input) => {
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
      const bytes = new TextEncoder().encode(input)
      let bits = ''
      for (const b of bytes) bits += b.toString(2).padStart(8, '0')
      while (bits.length % 5 !== 0) bits += '0'
      let result = ''
      for (let i = 0; i < bits.length; i += 5) {
        result += alphabet[parseInt(bits.slice(i, i + 5), 2)]
      }
      while (result.length % 8 !== 0) result += '='
      return result
    },
  },
  {
    id: 'base32-decode',
    name: 'Base32 Decode',
    category: 'encode',
    description: 'Decode Base32 to text',
    convert: (input) => {
      try {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
        const cleaned = input.trim().replace(/=+$/, '').toUpperCase()
        let bits = ''
        for (const c of cleaned) {
          const idx = alphabet.indexOf(c)
          if (idx === -1) return '(invalid base32 character: ' + c + ')'
          bits += idx.toString(2).padStart(5, '0')
        }
        const bytes = []
        for (let i = 0; i + 8 <= bits.length; i += 8) {
          bytes.push(parseInt(bits.slice(i, i + 8), 2))
        }
        return new TextDecoder().decode(new Uint8Array(bytes))
      } catch {
        return '(invalid base32)'
      }
    },
  },
  {
    id: 'url-encode',
    name: 'URL Encode',
    category: 'encode',
    description: 'Percent-encode text for URLs',
    convert: (input) => {
      try {
        return encodeURIComponent(input)
      } catch {
        return '(invalid input)'
      }
    },
  },
  {
    id: 'url-decode',
    name: 'URL Decode',
    category: 'encode',
    description: 'Decode percent-encoded URL text',
    convert: (input) => {
      try {
        return decodeURIComponent(input)
      } catch {
        return '(invalid url-encoded string)'
      }
    },
  },
  {
    id: 'html-encode',
    name: 'HTML Encode',
    category: 'encode',
    description: 'Escape HTML special characters',
    convert: (input) => {
      const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }
      return input.replace(/[&<>"']/g, (c) => map[c])
    },
  },
  {
    id: 'html-decode',
    name: 'HTML Decode',
    category: 'encode',
    description: 'Unescape HTML entities',
    convert: (input) => {
      const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" }
      return input.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos);/gi, (match, entity) => {
        const normalized = entity.toLowerCase()
        if (named[normalized]) return named[normalized]
        const codePoint = normalized.startsWith('#x')
          ? Number.parseInt(normalized.slice(2), 16)
          : Number.parseInt(normalized.slice(1), 10)
        if (!Number.isInteger(codePoint) || codePoint < 0 || codePoint > 0x10ffff) return match
        return String.fromCodePoint(codePoint)
      })
    },
  },
  {
    id: 'hex-encode',
    name: 'Text to Hex',
    category: 'encode',
    description: 'Convert text to hexadecimal',
    convert: (input) => {
      return Array.from(new TextEncoder().encode(input))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join(' ')
    },
  },
  {
    id: 'hex-decode',
    name: 'Hex to Text',
    category: 'encode',
    description: 'Convert hexadecimal to text',
    convert: (input) => {
      try {
        const hex = input.replace(/\s+/g, '')
        if (hex.length % 2 !== 0) return '(invalid hex — odd length)'
        const bytes = new Uint8Array(hex.match(/.{2}/g).map((b) => parseInt(b, 16)))
        return new TextDecoder().decode(bytes)
      } catch {
        return '(invalid hex)'
      }
    },
  },
  {
    id: 'binary-encode',
    name: 'Text to Binary',
    category: 'encode',
    description: 'Convert text to binary representation',
    convert: (input) => {
      return Array.from(new TextEncoder().encode(input))
        .map((b) => b.toString(2).padStart(8, '0'))
        .join(' ')
    },
  },
  {
    id: 'binary-decode',
    name: 'Binary to Text',
    category: 'encode',
    description: 'Convert binary to text',
    convert: (input) => {
      try {
        const bins = input.trim().split(/\s+/)
        const bytes = new Uint8Array(bins.map((b) => parseInt(b, 2)))
        return new TextDecoder().decode(bytes)
      } catch {
        return '(invalid binary)'
      }
    },
  },
  {
    id: 'unicode-escape',
    name: 'Unicode Escape',
    category: 'encode',
    description: 'Convert text to \\uXXXX escape sequences',
    convert: (input) => {
      return Array.from(input)
        .map((c) => {
          const code = c.codePointAt(0)
          if (code > 0xffff) return `\\u{${code.toString(16)}}`
          return `\\u${code.toString(16).padStart(4, '0')}`
        })
        .join('')
    },
  },
  {
    id: 'unicode-unescape',
    name: 'Unicode Unescape',
    category: 'encode',
    description: 'Convert \\uXXXX sequences back to text',
    convert: (input) => {
      try {
        return input.replace(/\\u\{([0-9a-fA-F]+)\}|\\u([0-9a-fA-F]{4})/g, (_, p1, p2) =>
          String.fromCodePoint(parseInt(p1 || p2, 16))
        )
      } catch {
        return '(invalid unicode escape)'
      }
    },
  },
  {
    id: 'rot13',
    name: 'ROT13',
    category: 'encode',
    description: 'Apply ROT13 cipher (encode and decode are the same)',
    convert: (input) => {
      return input.replace(/[a-zA-Z]/g, (c) => {
        const base = c <= 'Z' ? 65 : 97
        return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base)
      })
    },
  },
  {
    id: 'morse-encode',
    name: 'Text to Morse Code',
    category: 'encode',
    description: 'Convert text to Morse code',
    convert: (input) => {
      const map = {
        A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.',
        G: '--.', H: '....', I: '..', J: '.---', K: '-.-', L: '.-..',
        M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.',
        S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-',
        Y: '-.--', Z: '--..', '0': '-----', '1': '.----', '2': '..---',
        '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
        '8': '---..', '9': '----.', '.': '.-.-.-', ',': '--..--', '?': '..--..',
        '!': '-.-.--', ' ': '/',
      }
      return input
        .toUpperCase()
        .split('')
        .map((c) => map[c] || c)
        .join(' ')
    },
  },
  {
    id: 'morse-decode',
    name: 'Morse Code to Text',
    category: 'encode',
    description: 'Convert Morse code to text',
    convert: (input) => {
      const map = {
        '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E', '..-.': 'F',
        '--.': 'G', '....': 'H', '..': 'I', '.---': 'J', '-.-': 'K', '.-..': 'L',
        '--': 'M', '-.': 'N', '---': 'O', '.--.': 'P', '--.-': 'Q', '.-.': 'R',
        '...': 'S', '-': 'T', '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X',
        '-.--': 'Y', '--..': 'Z', '-----': '0', '.----': '1', '..---': '2',
        '...--': '3', '....-': '4', '.....': '5', '-....': '6', '--...': '7',
        '---..': '8', '----.': '9', '.-.-.-': '.', '--..--': ',', '..--..': '?',
        '-.-.--': '!', '/': ' ',
      }
      return input
        .trim()
        .split(' ')
        .map((code) => map[code] || code)
        .join('')
    },
  },
  {
    id: 'html-to-text',
    name: 'HTML to Plain Text',
    category: 'encode',
    description: 'Strip all HTML tags and return plain text',
    convert: (input) => {
      const el = document.createElement('div')
      el.innerHTML = input
      return el.textContent || ''
    },
  },
  {
    id: 'text-to-nato',
    name: 'NATO Phonetic Alphabet',
    category: 'encode',
    description: 'Convert text to NATO phonetic alphabet',
    convert: (input) => {
      const nato = {
        A: 'Alfa', B: 'Bravo', C: 'Charlie', D: 'Delta', E: 'Echo',
        F: 'Foxtrot', G: 'Golf', H: 'Hotel', I: 'India', J: 'Juliet',
        K: 'Kilo', L: 'Lima', M: 'Mike', N: 'November', O: 'Oscar',
        P: 'Papa', Q: 'Quebec', R: 'Romeo', S: 'Sierra', T: 'Tango',
        U: 'Uniform', V: 'Victor', W: 'Whiskey', X: 'X-ray', Y: 'Yankee',
        Z: 'Zulu', '0': 'Zero', '1': 'One', '2': 'Two', '3': 'Three',
        '4': 'Four', '5': 'Five', '6': 'Six', '7': 'Seven', '8': 'Eight',
        '9': 'Niner',
      }
      return input
        .toUpperCase()
        .split('')
        .map((c) => {
          if (c === ' ') return '(space)'
          return nato[c] || c
        })
        .join(' ')
    },
  },
  {
    id: 'hash-identify',
    name: 'Hash Identifier',
    category: 'encode',
    description: 'Identify possible hash algorithms from a hash string',
    convert: (input) => {
      const t = input.trim().toLowerCase()
      if (!t) return ''
      const hex = /^[0-9a-f]+$/
      if (!hex.test(t)) return '(not a valid hex hash)'
      const len = t.length
      const matches = []
      if (len === 32) matches.push('MD5', 'MD4', 'NTLM')
      if (len === 40) matches.push('SHA-1', 'RIPEMD-160')
      if (len === 56) matches.push('SHA-224', 'SHA3-224')
      if (len === 64) matches.push('SHA-256', 'SHA3-256', 'BLAKE2s')
      if (len === 96) matches.push('SHA-384', 'SHA3-384')
      if (len === 128) matches.push('SHA-512', 'SHA3-512', 'BLAKE2b', 'Whirlpool')
      if (len === 8) matches.push('CRC-32', 'Adler-32')
      if (matches.length === 0) return `Unknown hash (${len} hex chars / ${len * 4} bits)\n\nNo common algorithms match this length.`
      return [
        `Length: ${len} hex chars (${len * 4} bits)`,
        ``,
        `Possible algorithms:`,
        ...matches.map(m => `  - ${m}`),
      ].join('\n')
    },
  },
  {
    id: 'atbash',
    name: 'Atbash Cipher',
    category: 'encode',
    description: 'Apply Atbash cipher — mirrors alphabet (A↔Z, B↔Y). Apply twice to decode.',
    convert: (input) => {
      return input.replace(/[a-zA-Z]/g, c => {
        const base = c <= 'Z' ? 65 : 97
        return String.fromCharCode(base + 25 - (c.charCodeAt(0) - base))
      })
    },
  },
  {
    id: 'encoding-detect',
    name: 'Encoding Detector',
    category: 'encode',
    description: 'Detect what encoding a string might be using',
    convert: (input) => {
      const t = input.trim()
      if (!t) return ''
      const results = []
      // Base64
      if (/^[A-Za-z0-9+/]+=*$/.test(t) && t.length >= 4 && t.length % 4 === 0) {
        try { atob(t); results.push('Base64') } catch { /* not base64 */ }
      }
      // Base32
      if (/^[A-Z2-7]+=*$/i.test(t) && t.length >= 8 && t.length % 8 === 0) {
        results.push('Base32 (possible)')
      }
      // Hex
      if (/^(0x)?[0-9a-f]+$/i.test(t) && t.replace(/^0x/, '').length % 2 === 0) {
        results.push('Hexadecimal')
      }
      // URL encoded
      if (/%[0-9a-f]{2}/i.test(t)) results.push('URL Encoded')
      // HTML entities
      if (/&(?:#\d+|#x[0-9a-f]+|[a-z]+);/i.test(t)) results.push('HTML Entities')
      // JSON
      if ((t.startsWith('{') && t.endsWith('}')) || (t.startsWith('[') && t.endsWith(']'))) {
        try { JSON.parse(t); results.push('JSON') } catch { /* not JSON */ }
      }
      // JWT
      if (/^eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(t)) results.push('JWT (JSON Web Token)')
      // UUID
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(t)) results.push('UUID')
      // Binary
      if (/^[01\s]+$/.test(t) && t.replace(/\s/g, '').length % 8 === 0) results.push('Binary')
      // Morse
      if (/^[.\-/ ]+$/.test(t) && t.includes('.') && t.includes('-')) results.push('Morse Code')
      // Unix timestamp
      if (/^\d{10,13}$/.test(t)) results.push('Unix Timestamp')
      // Data URL
      if (/^data:[^;]+;base64,/.test(t)) results.push('Data URL (Base64)')
      // Plain text
      if (results.length === 0) results.push('Plain Text (no encoding detected)')
      return [
        `Input: ${t.length} characters`,
        ``,
        `Detected encodings:`,
        ...results.map(r => `  - ${r}`),
      ].join('\n')
    },
  },
  {
    id: 'caesar-cipher',
    name: 'Caesar Cipher',
    category: 'encode',
    description: 'Apply or brute-force a Caesar cipher — enter text, optionally :N for shift (e.g. Hello:3)',
    placeholder: 'Hello World:3',
    convert: (input) => {
      const m = input.match(/^([\s\S]+):(-?\d+)$/)
      if (m) {
        const text = m[1], shift = ((parseInt(m[2]) % 26) + 26) % 26
        const shifted = Array.from(text).map(c => {
          if (c >= 'a' && c <= 'z') return String.fromCharCode((c.charCodeAt(0) - 97 + shift) % 26 + 97)
          if (c >= 'A' && c <= 'Z') return String.fromCharCode((c.charCodeAt(0) - 65 + shift) % 26 + 65)
          return c
        }).join('')
        return `Shift ${shift}: ${shifted}`
      }
      // Brute force all 25 shifts
      const text = input.trim()
      return Array.from({ length: 25 }, (_, i) => {
        const shift = i + 1
        const shifted = Array.from(text).map(c => {
          if (c >= 'a' && c <= 'z') return String.fromCharCode((c.charCodeAt(0) - 97 + shift) % 26 + 97)
          if (c >= 'A' && c <= 'Z') return String.fromCharCode((c.charCodeAt(0) - 65 + shift) % 26 + 65)
          return c
        }).join('')
        return `+${String(shift).padStart(2)}: ${shifted}`
      }).join('\n')
    },
  },
  {
    id: 'hex-to-rgb-batch',
    name: 'Hex Colors Batch',
    category: 'encode',
    description: 'Convert multiple hex colors to RGB/HSL at once — one hex per line',
    placeholder: '#ff6b35\n#3b82f6\n#22c55e',
    convert: (input) => {
      const lines = input.split('\n').map(l => l.trim()).filter(Boolean)
      if (lines.length === 0) return '(enter hex colors, one per line)'
      return lines.map(line => {
        const hex = line.startsWith('#') ? line : '#' + line
        if (!/^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(hex)) return `${line}: (invalid hex)`
        const h = hex.replace('#', '')
        const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h
        const n = parseInt(full, 16)
        const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255
        const rr = r / 255, gg = g / 255, bb = b / 255
        const max = Math.max(rr, gg, bb), min = Math.min(rr, gg, bb)
        const l = (max + min) / 2
        const d = max - min
        const s = max === min ? 0 : l > 0.5 ? d / (2 - max - min) : d / (max + min)
        let hue = 0
        if (d !== 0) {
          if (max === rr) hue = ((gg - bb) / d + (gg < bb ? 6 : 0)) / 6
          else if (max === gg) hue = ((bb - rr) / d + 2) / 6
          else hue = ((rr - gg) / d + 4) / 6
        }
        return `${hex}  →  rgb(${r}, ${g}, ${b})  hsl(${Math.round(hue * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
      }).join('\n')
    },
  },
  {
    id: 'text-to-phonetic',
    name: 'Phonetic Spelling',
    category: 'encode',
    description: 'Spell out text using phonetic alphabet alternatives (military, ICAO, or fun)',
    placeholder: 'Hello World',
    convert: (input) => {
      const nato = { A:'Alpha', B:'Bravo', C:'Charlie', D:'Delta', E:'Echo', F:'Foxtrot', G:'Golf', H:'Hotel', I:'India', J:'Juliet', K:'Kilo', L:'Lima', M:'Mike', N:'November', O:'Oscar', P:'Papa', Q:'Quebec', R:'Romeo', S:'Sierra', T:'Tango', U:'Uniform', V:'Victor', W:'Whiskey', X:'X-ray', Y:'Yankee', Z:'Zulu' }
      const fun = { A:'Apple', B:'Banana', C:'Cherry', D:'Dragon', E:'Elephant', F:'Flamingo', G:'Gorilla', H:'Hippo', I:'Igloo', J:'Jaguar', K:'Koala', L:'Lemon', M:'Mango', N:'Narwhal', O:'Octopus', P:'Penguin', Q:'Quail', R:'Raccoon', S:'Sloth', T:'Tiger', U:'Unicorn', V:'Vulture', W:'Walrus', X:'Xerus', Y:'Yak', Z:'Zebra' }
      const lines = input.toUpperCase().split('\n').map(line => {
        const words = []
        for (const ch of line) {
          if (/[A-Z]/.test(ch)) words.push(`${ch}=${nato[ch]}`)
          else if (/[0-9]/.test(ch)) words.push(ch)
          else if (ch === ' ') words.push('|')
          else if (ch !== '') words.push(ch)
        }
        return words.join(' ')
      })
      const funLines = input.toUpperCase().split('\n').map(line => {
        const words = []
        for (const ch of line) {
          if (/[A-Z]/.test(ch)) words.push(`${ch}=${fun[ch]}`)
          else if (ch === ' ') words.push('|')
          else if (ch !== '') words.push(ch)
        }
        return words.join(' ')
      })
      return [
        'NATO/ICAO:',
        ...lines,
        '',
        'Fun phonetic:',
        ...funLines,
      ].join('\n')
    },
  },
  {
    id: 'vigenere',
    name: 'Vigenère Cipher',
    category: 'encode',
    description: 'Vigenère cipher encryption/decryption — format: key:encode:message or key:decode:message',
    placeholder: 'SECRET:encode:Hello World',
    convert: (input) => {
      const parts = input.trim().split(':')
      if (parts.length < 3) return '(format: key:encode:message or key:decode:message)'
      const [key, mode, ...msgParts] = parts
      const message = msgParts.join(':')
      if (!key || !message) return '(key and message required)'
      if (!['encode', 'decode', 'encrypt', 'decrypt'].includes(mode.toLowerCase())) return '(mode must be "encode" or "decode")'
      const decode = mode.toLowerCase().startsWith('d')
      const K = key.toUpperCase().replace(/[^A-Z]/g, '')
      if (!K) return '(key must contain at least one letter)'
      let result = ''
      let ki = 0
      for (const ch of message) {
        if (/[a-zA-Z]/.test(ch)) {
          const upper = ch.toUpperCase()
          const offset = K[ki % K.length].charCodeAt(0) - 65
          const base = 'A'.charCodeAt(0)
          const encoded = decode
            ? String.fromCharCode(((upper.charCodeAt(0) - base - offset + 26) % 26) + base)
            : String.fromCharCode(((upper.charCodeAt(0) - base + offset) % 26) + base)
          result += ch === ch.toLowerCase() ? encoded.toLowerCase() : encoded
          ki++
        } else {
          result += ch
        }
      }
      return [
        `Key:     ${key.toUpperCase()}`,
        `Mode:    ${decode ? 'decode' : 'encode'}`,
        `Input:   ${message}`,
        `Output:  ${result}`,
      ].join('\n')
    },
  },
  {
    id: 'ascii-table',
    name: 'ASCII Table',
    category: 'encode',
    description: 'Show the ASCII table for a range or single character/code — enter char or number (e.g. "A", "65", "32-127")',
    placeholder: 'A',
    convert: (input) => {
      const s = input.trim()
      if (!s) return '(enter a character, code (65), or range (32-127))'
      function row(code) {
        const ch = String.fromCharCode(code)
        const printable = code >= 32 && code < 127 ? ch : (code === 0 ? 'NUL' : code === 9 ? 'TAB' : code === 10 ? 'LF' : code === 13 ? 'CR' : code === 27 ? 'ESC' : code === 32 ? 'SP' : '·')
        return `${code.toString().padStart(3)}  0x${code.toString(16).toUpperCase().padStart(2, '0')}  0b${code.toString(2).padStart(8, '0')}  ${printable}`
      }
      // range like "32-127"
      const rangeMatch = s.match(/^(\d+)-(\d+)$/)
      if (rangeMatch) {
        const from = parseInt(rangeMatch[1]), to = parseInt(rangeMatch[2])
        if (from > to || from < 0 || to > 127) return '(range must be 0-127)'
        if (to - from > 96) return '(range too large — max 96 rows)'
        const lines = ['Dec  Hex   Binary     Char']
        for (let i = from; i <= to; i++) lines.push(row(i))
        return lines.join('\n')
      }
      // single number
      const num = parseInt(s, 10)
      if (!isNaN(num) && num >= 0 && num <= 127) {
        return ['Dec  Hex   Binary     Char', row(num)].join('\n')
      }
      // single character
      if (s.length === 1) {
        const code = s.charCodeAt(0)
        return ['Dec  Hex   Binary     Char', row(code)].join('\n')
      }
      // multiple chars
      if (s.length > 1 && s.length <= 20) {
        const lines = ['Char  Dec  Hex   Binary']
        for (const ch of s) {
          const code = ch.charCodeAt(0)
          lines.push(`  ${ch.padEnd(4)} ${code.toString().padStart(3)}  0x${code.toString(16).toUpperCase().padStart(2, '0')}  ${code.toString(2).padStart(8, '0')}`)
        }
        return lines.join('\n')
      }
      return '(enter a character, ASCII code (0-127), or range like "32-127")'
    },
  },
  {
    id: 'text-dedupe',
    name: 'Remove Duplicate Lines',
    category: 'utility',
    description: 'Remove duplicate lines from text, keeping first occurrence',
    convert: (input) => {
      const lines = input.split('\n')
      const seen = new Set()
      const result = []
      let dupes = 0
      for (const line of lines) {
        if (seen.has(line)) { dupes++ } else { seen.add(line); result.push(line) }
      }
      return result.join('\n') + (dupes > 0 ? `\n\n(removed ${dupes} duplicate line${dupes === 1 ? '' : 's'})` : '')
    },
  },
  {
    id: 'text-sort-lines',
    name: 'Sort Lines',
    category: 'utility',
    description: 'Sort lines alphabetically — add "desc" prefix for descending, "num" for numeric sort',
    placeholder: 'banana\napple\ncherry',
    convert: (input) => {
      const firstLine = input.split('\n')[0].trim().toLowerCase()
      let lines, mode
      if (['desc', 'num', 'num desc', 'asc'].includes(firstLine)) {
        mode = firstLine
        lines = input.split('\n').slice(1)
      } else {
        mode = 'asc'
        lines = input.split('\n')
      }
      if (lines.length <= 1 && !lines[0]) return '(enter text with multiple lines to sort)'
      const sorted = [...lines].sort((a, b) => {
        if (mode.includes('num')) {
          const na = parseFloat(a), nb = parseFloat(b)
          if (!isNaN(na) && !isNaN(nb)) return mode.includes('desc') ? nb - na : na - nb
        }
        return mode.includes('desc') ? b.localeCompare(a) : a.localeCompare(b)
      })
      return sorted.join('\n')
    },
  },
  {
    id: 'number-lines',
    name: 'Number Lines',
    category: 'utility',
    description: 'Add line numbers to text — optionally prefix lines with "start N" for custom start number',
    placeholder: 'first line\nsecond line\nthird line',
    convert: (input) => {
      const lines = input.split('\n')
      const firstLine = lines[0].trim()
      const startMatch = firstLine.match(/^start\s+(\d+)$/i)
      const dataLines = startMatch ? lines.slice(1) : lines
      const startNum = startMatch ? parseInt(startMatch[1], 10) : 1
      const width = String(startNum + dataLines.length - 1).length
      return dataLines.map((line, i) => `${String(startNum + i).padStart(width)}  ${line}`).join('\n')
    },
  },
  {
    id: 'unicode-styled',
    name: 'Unicode Styled Text',
    category: 'encode',
    description: 'Convert text to Unicode styled variants — bold, italic, small caps, fullwidth, strikethrough',
    placeholder: 'Hello World',
    convert: (input) => {
      const text = input.trim()
      if (!text) return '(enter some text)'
      const maps = {
        bold:       'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        boldChars:  '𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗',
        italic:     'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
        italicChars:'𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧',
      }
      const transform = (str, from, to) => {
        const fromArr = [...from], toArr = [...to]
        return [...str].map(c => {
          const idx = fromArr.indexOf(c)
          return idx >= 0 ? toArr[idx] : c
        }).join('')
      }
      const boldText = transform(text, [...maps.bold], [...maps.boldChars])
      const italicText = transform(text, [...maps.italic], [...maps.italicChars])
      // Small caps (uppercase letters mapped to small caps Unicode)
      const smallCapsMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
      const smallCapsOut = 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘQʀꜱᴛᴜᴠᴡxʏᴢᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘQʀꜱᴛᴜᴠᴡxʏᴢ'
      const smallCaps = transform(text, [...smallCapsMap], [...smallCapsOut])
      // Fullwidth
      const fullwidth = [...text].map(c => {
        const code = c.charCodeAt(0)
        if (code >= 0x21 && code <= 0x7e) return String.fromCodePoint(code - 0x21 + 0xff01)
        if (c === ' ') return '\u3000'
        return c
      }).join('')
      // Strikethrough (combining)
      const strike = [...text].map(c => c === ' ' ? ' ' : c + '\u0336').join('')
      // Underline (combining)
      const underline = [...text].map(c => c === ' ' ? ' ' : c + '\u0332').join('')
      return [
        `Bold:          ${boldText}`,
        `Italic:        ${italicText}`,
        `Small caps:    ${smallCaps}`,
        `Fullwidth:     ${fullwidth}`,
        `Strikethrough: ${strike}`,
        `Underline:     ${underline}`,
      ].join('\n')
    },
  },
  {
    id: 'soundex',
    name: 'Soundex Code',
    category: 'encode',
    description: 'Generate Soundex phonetic code for names — useful for finding similar-sounding words',
    placeholder: 'Robert',
    convert: (input) => {
      const words = input.trim().split(/\s+/).filter(Boolean)
      if (words.length === 0) return '(enter a name or word)'
      const soundex = (word) => {
        const w = word.toUpperCase().replace(/[^A-Z]/g, '')
        if (!w) return '(invalid)'
        const map = { B:1,F:1,P:1,V:1, C:2,G:2,J:2,K:2,Q:2,S:2,X:2,Z:2, D:3,T:3, L:4, M:5,N:5, R:6 }
        const first = w[0]
        let code = first
        let prev = map[first] || 0
        for (let i = 1; i < w.length && code.length < 4; i++) {
          const d = map[w[i]] || 0
          if (d && d !== prev) { code += d; prev = d }
          else if (!d) { prev = 0 }
        }
        return code.padEnd(4, '0')
      }
      if (words.length === 1) {
        const code = soundex(words[0])
        return [
          `Word: ${words[0]}`,
          `Soundex: ${code}`,
          '',
          'Similar sounding (same code):',
          '  Names with same Soundex share similar pronunciation patterns.',
          '  Example: Robert, Rupert → R163',
        ].join('\n')
      }
      const results = words.map(w => `  ${w.padEnd(20)} → ${soundex(w)}`)
      const codes = words.map(soundex)
      const grouped = {}
      codes.forEach((c, i) => { if (!grouped[c]) grouped[c] = []; grouped[c].push(words[i]) })
      const matches = Object.entries(grouped).filter(([, ws]) => ws.length > 1)
      return [
        'Soundex codes:',
        ...results,
        '',
        matches.length ? 'Similar sounding: ' + matches.map(([c, ws]) => `${ws.join(' = ')} (${c})`).join(', ') : 'No similar-sounding words found.',
      ].join('\n')
    },
  },
  {
    id: 'word-wrap-smart',
    name: 'Smart Word Wrap',
    category: 'utility',
    description: 'Wrap text at a word boundary — first line: column width (default 80)',
    placeholder: '72\nThis is a long line of text that will be wrapped at the specified column width to make it more readable and easier to work with.',
    convert: (input) => {
      const lines = input.split('\n')
      const firstLine = lines[0].trim()
      const widthMatch = firstLine.match(/^\d+$/)
      const width = widthMatch ? parseInt(firstLine, 10) : 80
      const text = widthMatch ? lines.slice(1).join('\n') : input
      if (!text.trim()) return '(enter text to wrap)'
      const paragraphs = text.split(/\n\n+/)
      const wrapped = paragraphs.map(para => {
        const words = para.replace(/\n/g, ' ').split(/\s+/).filter(Boolean)
        const result = []
        let line = ''
        for (const word of words) {
          if (line && (line + ' ' + word).length > width) {
            result.push(line)
            line = word
          } else {
            line = line ? line + ' ' + word : word
          }
        }
        if (line) result.push(line)
        return result.join('\n')
      })
      return wrapped.join('\n\n')
    },
  },
  {
    id: 'nato-alphabet',
    name: 'NATO Phonetic Alphabet',
    category: 'text',
    description: 'Convert text to NATO phonetic alphabet spelling',
    placeholder: 'Hello World',
    convert: (input) => {
      const nato = {
        A: 'Alpha', B: 'Bravo', C: 'Charlie', D: 'Delta', E: 'Echo',
        F: 'Foxtrot', G: 'Golf', H: 'Hotel', I: 'India', J: 'Juliet',
        K: 'Kilo', L: 'Lima', M: 'Mike', N: 'November', O: 'Oscar',
        P: 'Papa', Q: 'Quebec', R: 'Romeo', S: 'Sierra', T: 'Tango',
        U: 'Uniform', V: 'Victor', W: 'Whiskey', X: 'X-ray', Y: 'Yankee', Z: 'Zulu',
        '0': 'Zero', '1': 'One', '2': 'Two', '3': 'Three', '4': 'Four',
        '5': 'Five', '6': 'Six', '7': 'Seven', '8': 'Eight', '9': 'Niner',
        '.': 'Decimal', ',': 'Comma', '-': 'Dash', '/': 'Slash', '?': 'Query', '!': 'Exclamation',
        '@': 'At', '#': 'Pound', ' ': '(space)',
      }
      if (!input.trim()) return '(enter text to spell out)'
      const words = []
      for (const ch of input.toUpperCase()) {
        words.push(nato[ch] || `[${ch}]`)
      }
      const lines = []
      let currentLine = [], charCount = 0
      for (const w of words) {
        if (charCount + w.length + 2 > 60 && currentLine.length) {
          lines.push(currentLine.join(' - '))
          currentLine = []
          charCount = 0
        }
        currentLine.push(w)
        charCount += w.length + 3
      }
      if (currentLine.length) lines.push(currentLine.join(' - '))
      return lines.join('\n')
    },
  },
  {
    id: 'pig-latin',
    name: 'Pig Latin',
    category: 'text',
    description: 'Convert text to Pig Latin (moves leading consonants to end, adds "-ay")',
    placeholder: 'Hello world, this is a test',
    convert: (input) => {
      if (!input.trim()) return '(enter text to convert)'
      const vowels = /^[aeiou]/i
      const convert = word => {
        const punct = word.match(/([^a-zA-Z]*)$/) || ['']
        const clean = word.slice(0, word.length - punct[0].length)
        if (!clean) return word
        if (vowels.test(clean)) return clean + 'yay' + punct[0]
        const m = clean.match(/^([^aeiouAEIOU]*)(.*)/)
        if (!m || !m[2]) return clean + 'ay' + punct[0]
        const isUpper = clean[0] === clean[0].toUpperCase() && clean[0] !== clean[0].toLowerCase()
        const result = isUpper
          ? m[2][0].toUpperCase() + m[2].slice(1).toLowerCase() + m[1].toLowerCase() + 'ay'
          : m[2] + m[1] + 'ay'
        return result + punct[0]
      }
      const output = input.replace(/\S+/g, convert)
      return output
    },
  },
  {
    id: 'readability-score',
    name: 'Readability Score',
    category: 'text',
    description: 'Analyze text readability — Flesch-Kincaid grade level, reading ease, and stats',
    placeholder: 'Paste your text here to analyze its readability. Longer texts give more accurate results.',
    convert: (input) => {
      const s = input.trim()
      if (!s) return '(enter text to analyze)'
      const sentences = s.split(/[.!?]+/).filter(x => x.trim().length > 2).length || 1
      const words = s.match(/\b[a-zA-Z'-]+\b/g) || []
      if (words.length < 5) return '(enter more text for a meaningful score)'
      const wordCount = words.length
      const charCount = words.join('').length
      // syllable count heuristic
      const countSyllables = w => {
        w = w.toLowerCase().replace(/[^a-z]/g, '')
        if (w.length <= 3) return 1
        w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
        w = w.replace(/^y/, '')
        const m = w.match(/[aeiouy]{1,2}/g)
        return Math.max(1, m ? m.length : 1)
      }
      const syllables = words.reduce((sum, w) => sum + countSyllables(w), 0)
      const avgSyllPerWord = syllables / wordCount
      const avgWordsPerSent = wordCount / sentences
      // Flesch Reading Ease
      const ease = 206.835 - 1.015 * avgWordsPerSent - 84.6 * avgSyllPerWord
      const easeClamp = Math.max(0, Math.min(100, ease))
      const easeLabel = easeClamp >= 90 ? 'Very Easy (5th grade)' : easeClamp >= 80 ? 'Easy (6th grade)' : easeClamp >= 70 ? 'Fairly Easy (7th grade)' : easeClamp >= 60 ? 'Standard (8th–9th grade)' : easeClamp >= 50 ? 'Fairly Difficult (10th–12th grade)' : easeClamp >= 30 ? 'Difficult (College)' : 'Very Difficult (Professional)'
      // Flesch-Kincaid Grade Level
      const grade = 0.39 * avgWordsPerSent + 11.8 * avgSyllPerWord - 15.59
      const gradeClamp = Math.max(0, Math.min(18, grade))
      const complexWords = words.filter(w => countSyllables(w) >= 3).length
      const avgWordLen = charCount / wordCount
      return [
        `Words: ${wordCount}  |  Sentences: ${sentences}  |  Characters: ${s.length}`,
        '',
        `Reading ease:  ${easeClamp.toFixed(0)}/100  (${easeLabel})`,
        `Grade level:   ${gradeClamp.toFixed(1)}  (approx. ${gradeClamp < 1 ? 'Kindergarten' : gradeClamp < 7 ? 'Elementary' : gradeClamp < 10 ? 'Middle School' : gradeClamp < 13 ? 'High School' : 'College+'})`,
        '',
        `Avg sentence length: ${avgWordsPerSent.toFixed(1)} words`,
        `Avg word length:     ${avgWordLen.toFixed(1)} characters`,
        `Avg syllables/word:  ${avgSyllPerWord.toFixed(2)}`,
        `Complex words (3+ syllables): ${complexWords} (${(complexWords/wordCount*100).toFixed(1)}%)`,
        '',
        `Reading time: ~${Math.ceil(wordCount / 238)} min (at 238 wpm)`,
      ].join('\n')
    },
  },
  {
    id: 'text-diff-inline',
    name: 'Inline Text Diff',
    category: 'text',
    description: 'Compare two text blocks line by line — separate with "---" on its own line',
    placeholder: 'hello world\nfoo bar\nbaz\n---\nhello earth\nfoo baz\nqux',
    convert: (input) => {
      const [a, b] = input.split(/^---$/m)
      if (!b) return '(separate two texts with "---" on its own line)'
      const linesA = a.trimEnd().split('\n')
      const linesB = b.trimStart().split('\n')
      const maxLen = Math.max(linesA.length, linesB.length)
      const result = []
      let added = 0, removed = 0, changed = 0, same = 0
      for (let i = 0; i < maxLen; i++) {
        const la = linesA[i], lb = linesB[i]
        if (la === undefined) { result.push(`+ ${lb}`); added++ }
        else if (lb === undefined) { result.push(`- ${la}`); removed++ }
        else if (la === lb) { result.push(`  ${la}`); same++ }
        else { result.push(`- ${la}`); result.push(`+ ${lb}`); changed++ }
      }
      return [
        `Diff summary: ${same} same, ${changed} changed, ${added} added, ${removed} removed`,
        '─'.repeat(40),
        ...result,
      ].join('\n')
    },
  },
  {
    id: 'acronym-gen',
    name: 'Acronym Generator',
    category: 'text',
    description: 'Generate an acronym from a phrase, or expand common acronyms',
    placeholder: 'Application Programming Interface',
    convert: (input) => {
      const s = input.trim()
      if (!s) return '(enter a phrase to create an acronym, or an acronym to look up)'
      const commonAcronyms = {
        API: 'Application Programming Interface', HTTP: 'HyperText Transfer Protocol',
        HTML: 'HyperText Markup Language', CSS: 'Cascading Style Sheets',
        JSON: 'JavaScript Object Notation', XML: 'eXtensible Markup Language',
        SQL: 'Structured Query Language', URL: 'Uniform Resource Locator',
        URI: 'Uniform Resource Identifier', GUI: 'Graphical User Interface',
        CLI: 'Command Line Interface', IDE: 'Integrated Development Environment',
        SDK: 'Software Development Kit', OOP: 'Object-Oriented Programming',
        MVP: 'Minimum Viable Product', SPA: 'Single-Page Application',
        SEO: 'Search Engine Optimization', UX: 'User Experience',
        UI: 'User Interface', REST: 'Representational State Transfer',
        CRUD: 'Create Read Update Delete', DNS: 'Domain Name System',
        SSH: 'Secure Shell', SSL: 'Secure Sockets Layer',
        TLS: 'Transport Layer Security', CDN: 'Content Delivery Network',
        RAM: 'Random Access Memory', CPU: 'Central Processing Unit',
        GPU: 'Graphics Processing Unit', SSD: 'Solid State Drive',
        PDF: 'Portable Document Format', PNG: 'Portable Network Graphics',
        JPEG: 'Joint Photographic Experts Group', GIF: 'Graphics Interchange Format',
        IOT: 'Internet of Things', AI: 'Artificial Intelligence',
        ML: 'Machine Learning', NLP: 'Natural Language Processing',
        SAAS: 'Software as a Service', PAAS: 'Platform as a Service',
        IAAS: 'Infrastructure as a Service', CI: 'Continuous Integration',
        CD: 'Continuous Deployment', TDD: 'Test-Driven Development',
      }
      // Check if it's an acronym lookup
      if (/^[A-Z]{2,10}$/.test(s.toUpperCase()) && s.length <= 10 && !/\s/.test(s)) {
        const upper = s.toUpperCase()
        if (commonAcronyms[upper]) {
          return [`${upper} = ${commonAcronyms[upper]}`].join('\n')
        }
      }
      // Generate acronym from phrase
      const words = s.split(/\s+/).filter(Boolean)
      const acronym = words.map(w => w[0]?.toUpperCase() || '').join('')
      const firstLetters = words.map(w => `  ${w[0]?.toUpperCase() || '?'} — ${w}`).join('\n')
      return [
        `Phrase: ${s}`,
        `Acronym: ${acronym}`,
        '',
        'Letters:',
        firstLetters,
        '',
        `(${words.length} words → ${acronym.length}-letter acronym)`,
      ].join('\n')
    },
  },
  {
    id: 'text-sentence-ops',
    name: 'Sentence Operations',
    category: 'text',
    description: 'Extract, shuffle, or number sentences — enter mode and text: "extract", "shuffle", or "number"',
    placeholder: 'extract\nThe quick brown fox. It jumped over the dog. The end.',
    convert: (input) => {
      const lines = input.split('\n')
      const mode = lines[0].trim().toLowerCase()
      const text = lines.slice(1).join('\n').trim() || lines[0]
      if (!text && mode !== 'extract' && mode !== 'shuffle' && mode !== 'number') {
        return '(modes: "extract" / "shuffle" / "number" — then paste text below)'
      }
      const splitSentences = t => t.match(/[^.!?]+[.!?]*/g)?.map(s => s.trim()).filter(s => s.length > 2) || [t]
      const sentences = splitSentences(mode === 'extract' || mode === 'shuffle' || mode === 'number' ? text : input)
      if (mode === 'extract') {
        return sentences.map((s, i) => `${i + 1}. ${s}`).join('\n')
      }
      if (mode === 'shuffle') {
        const shuffled = [...sentences].sort(() => Math.random() - 0.5)
        return shuffled.join(' ')
      }
      if (mode === 'number') {
        return sentences.map((s, i) => `[${i + 1}] ${s}`).join(' ')
      }
      // Default: just extract
      return [
        `Found ${sentences.length} sentence${sentences.length !== 1 ? 's' : ''}:`,
        ...sentences.map((s, i) => `${i + 1}. ${s}`),
      ].join('\n')
    },
  },
  {
    id: 'text-center',
    name: 'Text Aligner',
    category: 'text',
    description: 'Align text — enter "width align\\ntext" where align is left/center/right (default 80 width)',
    placeholder: '60 center\nHello World\nThis is a test line\nAlign me!',
    convert: (input) => {
      const lines = input.split('\n')
      const firstLine = lines[0].trim()
      const widthAlignMatch = firstLine.match(/^(\d+)?\s*(left|center|right)?$/i)
      let width = 80, align = 'center', text
      if (widthAlignMatch && (widthAlignMatch[1] || widthAlignMatch[2])) {
        width = parseInt(widthAlignMatch[1]) || 80
        align = (widthAlignMatch[2] || 'center').toLowerCase()
        text = lines.slice(1).join('\n')
      } else {
        text = input
      }
      if (!text.trim()) return '(enter: "width align" on first line, then text)'
      const textLines = text.split('\n')
      const aligned = textLines.map(line => {
        if (align === 'center') {
          const pad = Math.max(0, Math.floor((width - line.length) / 2))
          return ' '.repeat(pad) + line
        }
        if (align === 'right') return line.padStart(width)
        return line  // left (default)
      })
      return aligned.join('\n')
    },
  },
  {
    id: 'markdown-toc',
    name: 'Markdown TOC Generator',
    description: 'Generate a table of contents from Markdown headings. Paste your Markdown and get a TOC with anchor links.',
    category: 'text',
    convert: (input) => {
      const lines = input.split('\n')
      const headings = []
      for (const line of lines) {
        const m = line.match(/^(#{1,6})\s+(.+)$/)
        if (m) {
          const level = m[1].length
          const text = m[2].replace(/\*\*|__|\*|_|`|~~|\[([^\]]+)\]\([^)]+\)/g, '$1').trim()
          const anchor = text.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
          headings.push({ level, text, anchor })
        }
      }
      if (headings.length === 0) return '(no headings found — paste Markdown with # headings)'
      const minLevel = Math.min(...headings.map(h => h.level))
      return headings.map(h => {
        const indent = '  '.repeat(h.level - minLevel)
        return `${indent}- [${h.text}](#${h.anchor})`
      }).join('\n')
    },
  },
  {
    id: 'text-extract-quotes',
    name: 'Extract Quoted Text',
    description: 'Extract all quoted strings from text. Finds "double quoted", \'single quoted\', and «guillemet» text.',
    category: 'text',
    convert: (input) => {
      const results = []
      // Double quotes
      const dq = [...input.matchAll(/"([^"]+)"/g)].map(m => ({ type: 'double', text: m[1] }))
      // Single quotes (avoid contractions: don't, it's)
      const sq = [...input.matchAll(/'([^']{2,})'/g)]
        .filter(m => !m[1].includes("'") && m[1].split(' ').length > 1)
        .map(m => ({ type: 'single', text: m[1] }))
      // Guillemets
      const gq = [...input.matchAll(/«([^»]+)»/g)].map(m => ({ type: 'guillemet', text: m[1] }))
      // Backtick code
      const bq = [...input.matchAll(/`([^`]+)`/g)].map(m => ({ type: 'backtick', text: m[1] }))
      results.push(...dq, ...sq, ...gq, ...bq)
      if (results.length === 0) return '(no quoted text found)'
      const grouped = {}
      for (const r of results) {
        if (!grouped[r.type]) grouped[r.type] = []
        grouped[r.type].push(r.text)
      }
      const out = []
      for (const [type, texts] of Object.entries(grouped)) {
        out.push(`--- ${type} quotes (${texts.length}) ---`)
        texts.forEach((t, i) => out.push(`${i + 1}. ${t}`))
        out.push('')
      }
      return out.join('\n').trim()
    },
  },
  {
    id: 'text-summarize',
    name: 'Text Summarizer (Extractive)',
    description: 'Extractive summarization: scores sentences by keyword frequency and returns the most important ones. Enter text (3+ sentences).',
    category: 'text',
    convert: (input) => {
      const text = input.trim()
      if (!text) return '(paste text to summarize)'
      // Split into sentences
      const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]
      if (sentences.length < 3) return '(need at least 3 sentences for summarization)'
      // Build word frequency
      const stopWords = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','with','by','is','are','was','were','be','been','being','have','has','had','do','does','did','will','would','could','should','may','might','shall','can','this','that','these','those','it','its','i','you','he','she','we','they','me','him','her','us','them','my','your','his','our','their'])
      const words = text.toLowerCase().match(/\b[a-z]+\b/g) || []
      const freq = {}
      for (const w of words) {
        if (!stopWords.has(w) && w.length > 2) freq[w] = (freq[w] || 0) + 1
      }
      // Score sentences
      const scored = sentences.map((s, i) => {
        const sWords = s.toLowerCase().match(/\b[a-z]+\b/g) || []
        const score = sWords.reduce((acc, w) => acc + (freq[w] || 0), 0) / (sWords.length || 1)
        return { s: s.trim(), score, i }
      })
      // Top sentences (up to 30% of original)
      const topN = Math.max(1, Math.min(Math.ceil(sentences.length * 0.3), 5))
      const topSentences = [...scored].sort((a, b) => b.score - a.score).slice(0, topN)
      // Return in original order
      const summary = topSentences.sort((a, b) => a.i - b.i).map(x => x.s).join(' ')
      return [
        `Summary (${topN} of ${sentences.length} sentences):`,
        '',
        summary,
        '',
        `Compression: ${Math.round((1 - summary.length / text.length) * 100)}%`,
      ].join('\n')
    },
  },
  {
    id: 'text-char-frequency',
    name: 'Character Frequency Map',
    description: 'Count frequency of each character in text and display as a visual bar chart.',
    category: 'text',
    convert: (input) => {
      if (!input.trim()) return '(enter text to analyze)'
      const freq = {}
      for (const ch of input) {
        const k = ch === '\n' ? '\\n' : ch === '\t' ? '\\t' : ch === ' ' ? '(space)' : ch
        freq[k] = (freq[k] || 0) + 1
      }
      const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1])
      const maxCount = sorted[0][1]
      const barWidth = 30
      const total = input.length
      return sorted.map(([ch, count]) => {
        const bar = '█'.repeat(Math.round(count / maxCount * barWidth))
        const pct = (count / total * 100).toFixed(1)
        return `${ch.padEnd(8)} ${String(count).padStart(4)}  ${pct.padStart(5)}%  ${bar}`
      }).join('\n')
    },
  },
  {
    id: 'text-find-replace',
    name: 'Find & Replace Preview',
    description: 'Preview find and replace with optional regex. First line: "find → replace" (use /pattern/flags for regex). Then paste text.',
    category: 'text',
    convert: (input) => {
      const firstNl = input.indexOf('\n')
      if (firstNl === -1) return '(enter "find → replace" on first line, then text)'
      const ruleLine = input.slice(0, firstNl).trim()
      const text = input.slice(firstNl + 1)
      if (!text.trim()) return '(no text provided after rule line)'
      const arrowIdx = ruleLine.indexOf('→')
      if (arrowIdx === -1) return '(use → to separate find and replace, e.g. "foo → bar")'
      const findStr = ruleLine.slice(0, arrowIdx).trim()
      const replStr = ruleLine.slice(arrowIdx + 1).trim()
      let result, count = 0
      const regexMatch = findStr.match(/^\/(.+)\/([gimsuy]*)$/)
      if (regexMatch) {
        const regexGuard = getRegexGuardError(regexMatch[1], text)
        if (regexGuard) return regexGuard
        try {
          const rx = new RegExp(regexMatch[1], regexMatch[2].includes('g') ? regexMatch[2] : regexMatch[2] + 'g')
          result = text.replace(rx, () => { count++; return replStr })
        } catch (e) {
          return `(invalid regex: ${e.message})`
        }
      } else {
        const escaped = findStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const rx = new RegExp(escaped, 'g')
        result = text.replace(rx, () => { count++; return replStr })
      }
      return `[${count} replacement${count !== 1 ? 's' : ''} made]\n\n${result}`
    },
  },
  {
    id: 'lorem-words',
    name: 'Lorem Ipsum Generator',
    description: 'Generate Lorem Ipsum placeholder text. Enter number of words, sentences, or paragraphs: "3 paragraphs", "50 words", "10 sentences".',
    category: 'text',
    convert: (input) => {
      const lorem = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum'.split(' ')
      const m = input.trim().match(/(\d+)\s*(word|sentence|paragraph|para)s?/i)
      const n = m ? parseInt(m[1]) : 1
      const type = m ? m[2].toLowerCase() : 'paragraph'
      let wordIdx = 0
      const getWord = () => { const w = lorem[wordIdx % lorem.length]; wordIdx++; return w }
      const makeSentence = (minW = 8, maxW = 18) => {
        const len = minW + Math.floor(Math.random() * (maxW - minW))
        const words = Array.from({ length: len }, getWord)
        words[0] = words[0][0].toUpperCase() + words[0].slice(1)
        return words.join(' ') + '.'
      }
      const makeParagraph = () => {
        const numSentences = 3 + Math.floor(Math.random() * 5)
        return Array.from({ length: numSentences }, makeSentence).join(' ')
      }
      if (type.startsWith('word')) {
        const words = Array.from({ length: n }, getWord)
        words[0] = words[0][0].toUpperCase() + words[0].slice(1)
        return words.join(' ') + '.'
      }
      if (type.startsWith('sentence')) {
        return Array.from({ length: n }, makeSentence).join(' ')
      }
      return Array.from({ length: n }, makeParagraph).join('\n\n')
    },
  },
  {
    id: 'haiku-checker',
    name: 'Haiku Checker / Creator',
    description: 'Check if text is a valid haiku (5-7-5 syllables) or see syllable counts. Enter three lines.',
    category: 'text',
    convert: (input) => {
      const countSyllables = (word) => {
        word = word.toLowerCase().replace(/[^a-z]/g, '')
        if (!word) return 0
        if (word.length <= 3) return 1
        word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
        word = word.replace(/^y/, '')
        const m = word.match(/[aeiouy]{1,2}/g)
        return m ? Math.max(1, m.length) : 1
      }
      const lineSyllables = (line) => {
        const words = line.trim().split(/\s+/).filter(Boolean)
        return { count: words.reduce((sum, w) => sum + countSyllables(w), 0), words }
      }
      const lines = input.trim().split('\n').filter(l => l.trim())
      if (lines.length === 0) return '(enter 3 lines to check as a haiku)'
      const analyzed = lines.map(l => { const { count, words } = lineSyllables(l); return { line: l, count, words } })
      const out = ['Syllable Analysis:', '']
      for (const { line, count, words } of analyzed) {
        const detail = words.map(w => `${w}(${countSyllables(w)})`).join(' ')
        out.push(`Line: "${line}"`)
        out.push(`      ${detail}`)
        out.push(`      Total: ${count} syllables`)
        out.push('')
      }
      if (lines.length === 3) {
        const [l1, l2, l3] = analyzed
        const isHaiku = l1.count === 5 && l2.count === 7 && l3.count === 5
        out.push(isHaiku
          ? 'Valid haiku! (5-7-5) ✓'
          : `Not a valid haiku. Need 5-7-5, got ${l1.count}-${l2.count}-${l3.count}`)
      } else {
        out.push('(need exactly 3 lines for haiku validation)')
      }
      return out.join('\n')
    },
  },
  {
    id: 'spongecase',
    name: 'Mocking Spongecase',
    description: 'Convert text to mocking/alternating case (like the SpongeBob mocking meme). "hello world" → "hElLo WoRlD".',
    category: 'text',
    convert: (input) => {
      if (!input.trim()) return '(enter text to convert to spongecase)'
      let upper = Math.random() > 0.5
      return input.split('').map(c => {
        if (!/[a-zA-Z]/.test(c)) return c
        const ch = upper ? c.toUpperCase() : c.toLowerCase()
        upper = !upper
        return ch
      }).join('')
    },
  },
  {
    id: 'text-anagram-finder',
    name: 'Anagram Solver',
    description: 'Find all anagrams of a word or phrase from a built-in word list, or check if two strings are anagrams.',
    category: 'text',
    convert: (input) => {
      const parts = input.trim().split(/\n|→|,/).map(s => s.trim()).filter(Boolean)
      // Check if two strings are anagrams
      if (parts.length === 2) {
        const sortStr = (s) => s.toLowerCase().replace(/[^a-z]/g, '').split('').sort().join('')
        const a = sortStr(parts[0]), b = sortStr(parts[1])
        const isAnagram = a === b
        const sorted_a = parts[0].toLowerCase().replace(/[^a-z ]/g, '').split('').sort().join('')
        const sorted_b = parts[1].toLowerCase().replace(/[^a-z ]/g, '').split('').sort().join('')
        return [
          `"${parts[0]}" and "${parts[1]}"`,
          isAnagram ? 'ARE anagrams ✓' : 'are NOT anagrams',
          '',
          `Letters in "${parts[0]}": ${sorted_a}`,
          `Letters in "${parts[1]}": ${sorted_b}`,
        ].join('\n')
      }
      // Single word: show letter analysis and scrambles
      const word = parts[0].toLowerCase().replace(/[^a-z]/g, '')
      if (!word) return '(enter a word or two words separated by a newline or comma to compare)'
      const sorted = word.split('').sort().join('')
      const freq = {}
      for (const c of word) freq[c] = (freq[c] || 0) + 1
      const freqStr = Object.entries(freq).sort().map(([c, n]) => `${c}×${n}`).join(', ')
      // Generate some scrambles
      const scrambles = new Set()
      const arr = word.split('')
      for (let i = 0; i < 50; i++) {
        for (let j = arr.length - 1; j > 0; j--) {
          const k = Math.floor(Math.random() * (j + 1));
          [arr[j], arr[k]] = [arr[k], arr[j]]
        }
        scrambles.add(arr.join(''))
      }
      return [
        `Word: "${word}"  (${word.length} letters)`,
        `Letters sorted: ${sorted}`,
        `Frequency: ${freqStr}`,
        '',
        'Sample anagram arrangements (scrambled):',
        ...[...scrambles].slice(0, 10).map(s => `  ${s}`),
        '',
        'Tip: Enter two words/phrases on separate lines to check if they are anagrams.',
      ].join('\n')
    },
  },
  {
    id: 'text-password-phrase',
    name: 'Passphrase Generator',
    description: 'Generate memorable passphrases from random words. Enter number of words (4-8) or leave blank for 4-word phrase.',
    category: 'text',
    convert: (input) => {
      const wordlist = ['able','acid','aged','also','area','army','away','baby','back','ball','band','bank','base','bath','bear','beat','been','bell','best','bird','blow','blue','boat','body','bold','bone','book','born','both','bowl','burn','calm','came','camp','card','care','case','cast','cave','cell','chat','chip','city','clap','clay','clip','coal','coat','code','coil','cold','comb','come','cook','cool','core','corn','cost','coup','crew','crop','cure','cute','dark','data','dawn','days','dead','deal','dear','deep','deny','desk','dial','diet','disk','dome','done','door','dose','down','drag','draw','drop','drug','drum','dual','dull','dump','dusk','dust','each','earn','ease','edge','else','even','ever','evil','exam','face','fact','fail','fair','fall','fame','farm','fast','fate','feel','felt','file','fill','film','find','fine','fire','firm','fish','fist','flag','flat','flew','flip','flow','foam','fold','folk','font','food','foot','ford','form','fort','foul','four','free','from','fuel','full','fund','fuse','gain','game','gate','gave','gear','gift','give','glad','glow','glue','gold','golf','good','grab','grit','grow','gulf','guns','gust','hack','hail','half','hall','hard','harm','hash','have','head','heal','heap','heat','heel','heir','help','here','hero','hide','high','hill','hint','home','hook','hope','horn','host','hour','hull','hunt','hurt','icon','idea','idle','inch','into','iron','island','item','jade','join','joke','jolt','jump','just','keep','kind','king','knee','knit','know','lack','lake','land','lane','last','late','lean','left','less','lend','lift','like','line','link','lion','list','live','lock','loft','lone','long','look','loop','love','lung','made','make','mall','many','mark','mast','math','meet','melt','mesh','mild','mill','mind','mint','miss','mist','mode','moon','more','most','move','much','must','myth','name','navy','need','nest','next','nice','nine','node','none','noon','norm','note','noun','now','numb','oath','obey','ocean','once','only','open','oval','over','pace','pack','page','paid','pain','pair','pale','park','part','pass','past','path','peak','peel','peer','pick','pine','pink','pipe','plan','play','plot','plow','plug','plum','plus','poem','pole','pond','pool','poor','pore','port','pose','post','pour','pray','prep','prey','prop','pull','pure','push','race','rain','ramp','rang','rank','rare','rate','read','real','reed','reef','rely','rest','ride','ring','rise','risk','road','roam','rock','role','roll','roof','room','rope','rose','ruin','rule','rush','rust','safe','sail','sake','sale','salt','same','sand','sang','save','seal','seek','seem','seep','send','sent','shed','ship','shot','show','shut','silk','sink','site','size','skin','skip','slam','slap','slim','slip','slot','slow','slug','snap','snow','soap','sock','soil','sole','song','soon','sort','soul','soup','sour','span','spin','spot','spur','stack','star','stay','stem','step','stir','stop','such','suit','sung','sunk','sure','surf','swap','swift','tail','take','tall','tank','tape','task','tell','tend','term','that','them','then','thin','this','tilt','time','tire','toad','toll','tone','torn','tour','town','trap','tree','trim','trip','true','tube','tuck','tune','twin','type','upon','used','very','vest','view','void','volt','vote','wade','wage','wake','walk','wall','ward','warm','warn','wave','well','went','west','what','when','whip','wide','wild','will','wind','wing','wire','wise','wish','with','woke','word','wore','work','worn','wove','wrap','yard','year','your','zero','zone']
      const n = Math.min(8, Math.max(3, parseInt(input.trim()) || 4))
      const pick = () => wordlist[Math.floor(Math.random() * wordlist.length)]
      const phrases = []
      for (let i = 0; i < 5; i++) {
        const words = Array.from({ length: n }, pick)
        phrases.push(words.join('-'))
      }
      const entropy = Math.log2(wordlist.length) * n
      return [
        `${n}-word passphrases (${wordlist.length} words, ~${entropy.toFixed(0)} bits entropy):`,
        '',
        ...phrases.map((p, i) => `${i + 1}. ${p}`),
        '',
        `Entropy: ${entropy.toFixed(1)} bits (~${Math.pow(2, entropy).toExponential(2)} combinations)`,
        `Strength: ${entropy > 70 ? 'Excellent' : entropy > 50 ? 'Good' : entropy > 40 ? 'Fair' : 'Weak'}`,
      ].join('\n')
    },
  },
  {
    id: 'word-cloud-text',
    name: 'Word Frequency Cloud',
    description: 'Analyze word frequency in text and display as a ranked word cloud with size indicators.',
    category: 'text',
    convert: (input) => {
      if (!input.trim()) return '(paste text to analyze word frequency)'
      const stopWords = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','with','by','is','are','was','were','be','been','being','have','has','had','do','does','did','will','would','could','should','may','might','shall','can','this','that','these','those','it','its','i','you','he','she','we','they','me','him','her','us','them','my','your','his','our','their','as','from','into','about','up','out','if','so','not','what','which','who','when','where','how','all','been','more','also','some','than','then','just','over','after','before','here','there'])
      const words = input.toLowerCase().match(/\b[a-z']{2,}\b/g) || []
      const freq = {}
      for (const w of words) {
        if (!stopWords.has(w)) freq[w] = (freq[w] || 0) + 1
      }
      const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 50)
      if (sorted.length === 0) return '(no meaningful words found)'
      const maxCount = sorted[0][1]
      const bars = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█']
      const total = words.length
      return [
        `Top ${sorted.length} words (${total} total, ${Object.keys(freq).length} unique):`,
        '',
        ...sorted.map(([word, count]) => {
          const bar = bars[Math.min(7, Math.round(count / maxCount * 7))]
          const pct = (count / total * 100).toFixed(1)
          return `${bar} ${word.padEnd(20)} ${String(count).padStart(3)}×  ${pct}%`
        }),
      ].join('\n')
    },
  },
  {
    id: 'morse-advanced',
    name: 'Morse Code Converter',
    description: 'Convert text to Morse code and back. Uses standard ITU Morse code. Enter text or Morse code (dots/dashes).',
    category: 'text',
    convert: (input) => {
      const morseMap = {
        'A':'.-', 'B':'-...', 'C':'-.-.', 'D':'-..', 'E':'.', 'F':'..-.', 'G':'--.', 'H':'....', 'I':'..', 'J':'.---',
        'K':'-.-', 'L':'.-..', 'M':'--', 'N':'-.', 'O':'---', 'P':'.--.', 'Q':'--.-', 'R':'.-.', 'S':'...', 'T':'-',
        'U':'..-', 'V':'...-', 'W':'.--', 'X':'-..-', 'Y':'-.--', 'Z':'--..',
        '0':'-----', '1':'.----', '2':'..---', '3':'...--', '4':'....-', '5':'.....', '6':'-....', '7':'--...', '8':'---..', '9':'----.',
        '.':'.-.-.-', ',':'--..--', '?':'..--..', "'":'.----.', '!':'-.-.--', '/':'-..-.', '(':'-.--.', ')':'-.--.-', '&':'.-...', ':':'---...',
        ';':'-.-.-.', '=':'-...-', '+':'.-.-.', '-':'-....-', '_':'..--.-', '"':'.-..-.', '$':'...-..-', '@':'.--.-.', ' ': '/',
      }
      const reverseMap = Object.fromEntries(Object.entries(morseMap).map(([k, v]) => [v, k]))
      const s = input.trim()
      // Detect if input is Morse (contains . and - predominantly)
      const isMorse = /^[.\- /]+$/.test(s) && (s.includes('.') || s.includes('-'))
      if (isMorse) {
        const words = s.split(' / ')
        const decoded = words.map(word =>
          word.split(' ').map(code => reverseMap[code] || '?').join('')
        ).join(' ')
        return `Decoded: ${decoded}`
      }
      // Text to Morse
      const morse = s.toUpperCase().split('').map(c => morseMap[c] || '?').join(' ')
      const wordMorse = s.toUpperCase().split(' ').map(word =>
        word.split('').map(c => morseMap[c] || '?').join(' ')
      ).join(' / ')
      return [
        `Morse Code:`,
        wordMorse,
        '',
        `Timing notation:`,
        `  . = dit (short)  - = dah (long = 3× dit)`,
        `  Letter gap: 3× dit  |  Word gap: 7× dit`,
        '',
        `Length: ${morse.replace(/ /g, '').length} symbols`,
      ].join('\n')
    },
  },
  {
    id: 'text-braille',
    name: 'Text to Braille',
    description: 'Convert text to Unicode Braille characters (Grade 1 Braille, uncontracted). Each character maps to its Braille cell.',
    category: 'text',
    convert: (input) => {
      const brailleMap = {
        'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑', 'f': '⠋', 'g': '⠛', 'h': '⠓',
        'i': '⠊', 'j': '⠚', 'k': '⠅', 'l': '⠇', 'm': '⠍', 'n': '⠝', 'o': '⠕', 'p': '⠏',
        'q': '⠟', 'r': '⠗', 's': '⠎', 't': '⠞', 'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭',
        'y': '⠽', 'z': '⠵',
        '1': '⠂', '2': '⠆', '3': '⠒', '4': '⠲', '5': '⠢', '6': '⠖', '7': '⠶', '8': '⠦', '9': '⠔', '0': '⠴',
        ' ': ' ', ',': '⠂', '.': '⠲', '?': '⠦', '!': '⠖', ';': '⠆', ':': '⠒', '-': '⠤', "'": '⠄',
      }
      const text = input.trim()
      if (!text) return '(enter text to convert to Braille)'
      const braille = text.toLowerCase().split('').map(c => brailleMap[c] || c).join('')
      return [
        'Braille:',
        braille,
        '',
        'Original:',
        text,
        '',
        '(Grade 1 uncontracted Braille — one character per letter)',
      ].join('\n')
    },
  },
  {
    id: 'phonetic-alphabet',
    name: 'Phonetic Spelling',
    description: 'Spell out text using the NATO phonetic alphabet and pronunciation guide.',
    category: 'text',
    convert: (input) => {
      const nato = {
        A: 'Alpha', B: 'Bravo', C: 'Charlie', D: 'Delta', E: 'Echo', F: 'Foxtrot', G: 'Golf',
        H: 'Hotel', I: 'India', J: 'Juliet', K: 'Kilo', L: 'Lima', M: 'Mike', N: 'November',
        O: 'Oscar', P: 'Papa', Q: 'Quebec', R: 'Romeo', S: 'Sierra', T: 'Tango', U: 'Uniform',
        V: 'Victor', W: 'Whiskey', X: 'X-ray', Y: 'Yankee', Z: 'Zulu',
        '0': 'Zero', '1': 'One', '2': 'Two', '3': 'Three', '4': 'Four', '5': 'Five',
        '6': 'Six', '7': 'Seven', '8': 'Eight', '9': 'Nine',
        '.': 'Period', ',': 'Comma', '!': 'Exclamation', '?': 'Question', '-': 'Dash',
        '/': 'Slash', '@': 'At', '#': 'Hash', '&': 'Ampersand',
      }
      const text = input.trim()
      if (!text) return '(enter text to spell phonetically)'
      const chars = text.toUpperCase().split('')
      const phonetics = chars.map(c => nato[c] || (c === ' ' ? '(space)' : c))
      // Group into lines of max 5 characters
      const groups = []
      for (let i = 0; i < phonetics.length; i += 5) {
        groups.push(phonetics.slice(i, i + 5))
      }
      const charDisplay = groups.map((g, i) =>
        chars.slice(i * 5, i * 5 + 5).join('  ').padEnd(15) + '  →  ' + g.join(', ')
      )
      return ['NATO Phonetic Spelling:', '', ...charDisplay].join('\n')
    },
  },
  {
    id: 'text-reverse-cipher',
    name: 'Text Ciphers',
    description: 'Apply various text ciphers. Enter cipher type then text: "rot13 hello" or "atbash hello" or "vigenere KEY hello" or "rail3 message".',
    category: 'text',
    convert: (input) => {
      const s = input.trim()
      const parts = s.split(/\s+/)
      const cipher = parts[0].toLowerCase()
      const text = parts.slice(1).join(' ') || s
      // ROT-N
      if (cipher.startsWith('rot')) {
        const n = parseInt(cipher.slice(3)) || 13
        const rotated = text.split('').map(c => {
          if (/[a-z]/.test(c)) return String.fromCharCode(((c.charCodeAt(0) - 97 + n) % 26) + 97)
          if (/[A-Z]/.test(c)) return String.fromCharCode(((c.charCodeAt(0) - 65 + n) % 26) + 65)
          return c
        }).join('')
        return `ROT-${n}: ${rotated}`
      }
      // Atbash
      if (cipher === 'atbash') {
        const atbashed = text.split('').map(c => {
          if (/[a-z]/.test(c)) return String.fromCharCode(122 - (c.charCodeAt(0) - 97))
          if (/[A-Z]/.test(c)) return String.fromCharCode(90 - (c.charCodeAt(0) - 65))
          return c
        }).join('')
        return `Atbash: ${atbashed}`
      }
      // Vigenere
      if (cipher === 'vigenere' && parts.length >= 3) {
        const key = parts[1].toUpperCase()
        const msg = parts.slice(2).join(' ')
        let ki = 0
        const enc = msg.split('').map(c => {
          if (/[a-zA-Z]/.test(c)) {
            const base = /[a-z]/.test(c) ? 97 : 65
            const shift = key.charCodeAt(ki % key.length) - 65
            ki++
            return String.fromCharCode((c.charCodeAt(0) - base + shift) % 26 + base)
          }
          return c
        }).join('')
        return `Vigenere (key=${key}): ${enc}`
      }
      // Rail fence (2 rails)
      if (cipher.startsWith('rail')) {
        const rails = parseInt(cipher.slice(4)) || 2
        const msg = parts.slice(1).join(' ')
        const fences = Array.from({ length: rails }, () => [])
        let rail = 0, dir = 1
        for (const c of msg) {
          fences[rail].push(c)
          if (rail === 0) dir = 1
          if (rail === rails - 1) dir = -1
          rail += dir
        }
        return `Rail fence (${rails} rails): ${fences.map(f => f.join('')).join('')}`
      }
      return [
        '(enter cipher type then text)',
        'Available ciphers:',
        '  rot13 hello         → uryyb (ROT-13)',
        '  rot5 hello          → mjqqt (ROT-5)',
        '  atbash hello        → svool',
        '  vigenere KEY hello  → Vigenère encryption',
        '  rail2 message       → Rail fence cipher',
        '  rail3 message       → Rail fence (3 rails)',
      ].join('\n')
    },
  },
]
