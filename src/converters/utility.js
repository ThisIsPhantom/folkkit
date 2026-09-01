function relativeTime(date) {
  const diff = Date.now() - date.getTime()
  const abs = Math.abs(diff)
  const future = diff < 0
  const secs = Math.floor(abs / 1000)
  const mins = Math.floor(secs / 60)
  const hours = Math.floor(mins / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  let text
  if (secs < 60) text = `${secs} seconds`
  else if (mins < 60) text = `${mins} minutes`
  else if (hours < 24) text = `${hours} hours`
  else if (days < 30) text = `${days} days`
  else if (months < 12) text = `${months} months`
  else text = `${years} years`

  return future ? `in ${text}` : `${text} ago`
}

export const utilityConverters = [
  {
    id: 'timestamp-to-date',
    name: 'Unix Timestamp to Date',
    category: 'utility',
    description: 'Convert Unix timestamp (seconds or ms) to human-readable date',
    convert: (input) => {
      const n = Number(input.trim())
      if (isNaN(n)) return '(invalid timestamp)'
      const ms = n > 1e12 ? n : n * 1000
      const d = new Date(ms)
      if (isNaN(d.getTime())) return '(invalid timestamp)'
      return [
        `UTC:    ${d.toUTCString()}`,
        `Local:  ${d.toLocaleString()}`,
        `ISO:    ${d.toISOString()}`,
      ].join('\n')
    },
  },
  {
    id: 'date-to-timestamp',
    name: 'Date to Unix Timestamp',
    category: 'utility',
    description: 'Convert a date string to Unix timestamp',
    convert: (input) => {
      const d = new Date(input.trim())
      if (isNaN(d.getTime())) return '(invalid date — try ISO 8601 or any common format)'
      const sec = Math.floor(d.getTime() / 1000)
      return [
        `Seconds:      ${sec}`,
        `Milliseconds: ${d.getTime()}`,
      ].join('\n')
    },
  },
  {
    id: 'uuid-generate',
    name: 'UUID Generator',
    category: 'utility',
    description: 'Generate a random UUID v4',
    isGenerator: true,
    convert: () => crypto.randomUUID(),
  },
  {
    id: 'jwt-decode',
    name: 'JWT Decode',
    category: 'utility',
    placeholder: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U',
    description: 'Decode a JSON Web Token (does not verify signature)',
    convert: (input) => {
      try {
        const parts = input.trim().split('.')
        if (parts.length !== 3) return '(expected 3 dot-separated parts)'
        const decode = (s) => {
          const padded = s.replace(/-/g, '+').replace(/_/g, '/')
          return JSON.parse(decodeURIComponent(escape(atob(padded))))
        }
        const header = decode(parts[0])
        const payload = decode(parts[1])
        return [
          '-- Header --',
          JSON.stringify(header, null, 2),
          '',
          '-- Payload --',
          JSON.stringify(payload, null, 2),
        ].join('\n')
      } catch {
        return '(invalid JWT)'
      }
    },
  },
  {
    id: 'lorem-ipsum',
    name: 'Lorem Ipsum Generator',
    category: 'utility',
    description: 'Generate lorem ipsum paragraphs — enter a number (default 3)',
    convert: (input) => {
      const base = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
      const extras = [
        'Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris.',
        'Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.',
        'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante.',
        'Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra.',
      ]
      const count = Math.max(1, Math.min(20, parseInt(input.trim()) || 3))
      const paragraphs = [base]
      for (let i = 1; i < count; i++) {
        paragraphs.push(extras[(i - 1) % extras.length])
      }
      return paragraphs.join('\n\n')
    },
  },
  {
    id: 'char-count',
    name: 'Character & Word Count',
    category: 'utility',
    description: 'Count characters, words, and lines in text',
    convert: (input) => {
      const chars = input.length
      const words = input.trim() ? input.trim().split(/\s+/).length : 0
      const lines = input ? input.split('\n').length : 0
      const bytes = new TextEncoder().encode(input).length
      return [
        `Characters:  ${chars}`,
        `Words:       ${words}`,
        `Lines:       ${lines}`,
        `Bytes:       ${bytes}`,
      ].join('\n')
    },
  },
  {
    id: 'case-convert',
    name: 'Case Converter',
    category: 'utility',
    description: 'Convert text to various cases',
    convert: (input) => {
      const lower = input.toLowerCase()
      const upper = input.toUpperCase()
      const title = input.replace(/\b\w/g, (c) => c.toUpperCase())
      const camel = input
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
      const snake = input
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .replace(/[\s-]+/g, '_')
        .toLowerCase()
      const kebab = input
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .toLowerCase()
      return [
        `lowercase:   ${lower}`,
        `UPPERCASE:   ${upper}`,
        `Title Case:  ${title}`,
        `camelCase:   ${camel}`,
        `snake_case:  ${snake}`,
        `kebab-case:  ${kebab}`,
      ].join('\n')
    },
  },
  {
    id: 'reverse-text',
    name: 'Reverse Text',
    category: 'utility',
    description: 'Reverse the characters in text',
    convert: (input) => Array.from(input).reverse().join(''),
  },
  {
    id: 'sort-lines',
    name: 'Sort Lines',
    category: 'utility',
    description: 'Sort lines alphabetically',
    convert: (input) => input.split('\n').sort((a, b) => a.localeCompare(b)).join('\n'),
  },
  {
    id: 'dedupe-lines',
    name: 'Remove Duplicate Lines',
    category: 'utility',
    description: 'Remove duplicate lines while preserving order',
    convert: (input) => [...new Set(input.split('\n'))].join('\n'),
  },
  {
    id: 'line-numbers',
    name: 'Add Line Numbers',
    category: 'utility',
    description: 'Prefix each line with its number',
    convert: (input) => {
      return input
        .split('\n')
        .map((line, i) => `${String(i + 1).padStart(4)}  ${line}`)
        .join('\n')
    },
  },
  {
    id: 'shuffle-lines',
    name: 'Shuffle Lines',
    category: 'utility',
    description: 'Randomly shuffle the order of lines',
    convert: (input) => {
      const lines = input.split('\n')
      for (let i = lines.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [lines[i], lines[j]] = [lines[j], lines[i]]
      }
      return lines.join('\n')
    },
  },
  {
    id: 'trim-lines',
    name: 'Trim Lines',
    category: 'utility',
    description: 'Remove leading and trailing whitespace from each line',
    convert: (input) => input.split('\n').map((l) => l.trim()).join('\n'),
  },
  {
    id: 'remove-empty-lines',
    name: 'Remove Empty Lines',
    category: 'utility',
    description: 'Remove all blank lines from text',
    convert: (input) => input.split('\n').filter((l) => l.trim()).join('\n'),
  },
  {
    id: 'wrap-lines',
    name: 'Word Wrap',
    category: 'utility',
    description: 'Wrap text at N characters — enter number on first line, text below',
    convert: (input) => {
      const lines = input.split('\n')
      const width = Math.max(10, parseInt(lines[0]) || 80)
      const text = lines.slice(1).join('\n')
      if (!text) return '(first line is wrap width, rest is text)'
      const words = text.split(/\s+/)
      const result = []
      let line = ''
      for (const word of words) {
        if (line.length + word.length + 1 > width) {
          result.push(line)
          line = word
        } else {
          line = line ? line + ' ' + word : word
        }
      }
      if (line) result.push(line)
      return result.join('\n')
    },
  },
  {
    id: 'extract-emails',
    name: 'Extract Emails',
    category: 'utility',
    description: 'Extract all email addresses from text',
    convert: (input) => {
      const emails = input.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g)
      if (!emails || emails.length === 0) return '(no emails found)'
      return [...new Set(emails)].join('\n')
    },
  },
  {
    id: 'extract-urls',
    name: 'Extract URLs',
    category: 'utility',
    description: 'Extract all URLs from text',
    convert: (input) => {
      const urls = input.match(/https?:\/\/[^\s<>"{}|\\^`[\]]+/g)
      if (!urls || urls.length === 0) return '(no URLs found)'
      return [...new Set(urls)].join('\n')
    },
  },
  {
    id: 'extract-numbers',
    name: 'Extract Numbers',
    category: 'utility',
    description: 'Extract all numbers from text',
    convert: (input) => {
      const nums = input.match(/-?\d+\.?\d*/g)
      if (!nums || nums.length === 0) return '(no numbers found)'
      return nums.join('\n')
    },
  },
  {
    id: 'slugify',
    name: 'Slugify',
    category: 'utility',
    description: 'Convert text to a URL-friendly slug',
    convert: (input) => {
      return input
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
    },
  },
  {
    id: 'string-escape',
    name: 'String Escape (Code)',
    category: 'utility',
    description: 'Escape special characters for use in code strings',
    convert: (input) => {
      return input
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/'/g, "\\'")
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t')
    },
  },
  {
    id: 'string-unescape',
    name: 'String Unescape',
    category: 'utility',
    description: 'Unescape code string escape sequences',
    convert: (input) => {
      return input
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\t/g, '\t')
        .replace(/\\'/g, "'")
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\')
    },
  },
  {
    id: 'number-format',
    name: 'Number Formatter',
    category: 'utility',
    description: 'Format a number with commas and locale options — one number per line',
    convert: (input) => {
      return input.split('\n').map(line => {
        const n = Number(line.trim())
        if (isNaN(n)) return line
        return [
          `Standard:   ${n.toLocaleString('en-US')}`,
          `Full:       ${n.toLocaleString('en-US', { style: 'decimal', maximumFractionDigits: 20 })}`,
          `Scientific: ${n.toExponential()}`,
        ].join('\n')
      }).join('\n\n')
    },
  },
  {
    id: 'csv-to-markdown',
    name: 'CSV to Markdown Table',
    category: 'utility',
    description: 'Convert CSV data to a Markdown table',
    convert: (input) => {
      const lines = input.trim().split('\n')
      if (lines.length < 1) return '(need at least a header row)'
      const parseRow = (line) => {
        const result = []
        let cur = '', inQ = false
        for (let i = 0; i < line.length; i++) {
          const c = line[i]
          if (inQ) { if (c === '"' && line[i+1] === '"') { cur += '"'; i++ } else if (c === '"') inQ = false; else cur += c }
          else { if (c === '"') inQ = true; else if (c === ',') { result.push(cur.trim()); cur = '' } else cur += c }
        }
        result.push(cur.trim())
        return result
      }
      const headers = parseRow(lines[0])
      const rows = lines.slice(1).map(parseRow)
      const headerLine = '| ' + headers.join(' | ') + ' |'
      const sepLine = '| ' + headers.map(() => '---').join(' | ') + ' |'
      const bodyLines = rows.map(r => '| ' + headers.map((_, i) => r[i] || '').join(' | ') + ' |')
      return [headerLine, sepLine, ...bodyLines].join('\n')
    },
  },
  {
    id: 'markdown-to-csv',
    name: 'Markdown Table to CSV',
    category: 'utility',
    description: 'Convert a Markdown table to CSV',
    convert: (input) => {
      const lines = input.trim().split('\n').filter(l => l.includes('|'))
      if (lines.length < 2) return '(need a markdown table with at least header and separator)'
      const parseRow = (line) => line.split('|').map(c => c.trim()).filter(Boolean)
      const header = parseRow(lines[0])
      // Skip separator line (index 1)
      const rows = lines.slice(2).map(parseRow)
      const esc = (s) => s.includes(',') || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s
      return [header.map(esc).join(','), ...rows.map(r => r.map(esc).join(','))].join('\n')
    },
  },
  {
    id: 'epoch-now',
    name: 'Current Timestamp',
    category: 'utility',
    description: 'Show the current Unix timestamp and date in various formats',
    convert: () => {
      const now = new Date()
      return [
        `Epoch (seconds): ${Math.floor(now.getTime() / 1000)}`,
        `Epoch (ms):      ${now.getTime()}`,
        `ISO 8601:        ${now.toISOString()}`,
        `UTC:             ${now.toUTCString()}`,
        `Local:           ${now.toLocaleString()}`,
        `Date:            ${now.toLocaleDateString()}`,
        `Time:            ${now.toLocaleTimeString()}`,
      ].join('\n')
    },
  },
  {
    id: 'list-to-json',
    name: 'List to JSON Array',
    category: 'data',
    description: 'Convert a newline-separated list to a JSON array',
    convert: (input) => {
      const items = input.split('\n').filter(l => l.trim())
      return JSON.stringify(items, null, 2)
    },
  },
  {
    id: 'json-to-list',
    name: 'JSON Array to List',
    category: 'data',
    description: 'Convert a JSON array to a newline-separated list',
    convert: (input) => {
      try {
        const arr = JSON.parse(input)
        if (!Array.isArray(arr)) return '(expected a JSON array)'
        return arr.join('\n')
      } catch {
        return '(invalid JSON)'
      }
    },
  },
  {
    id: 'ip-to-decimal',
    name: 'IP to Decimal',
    category: 'number',
    description: 'Convert an IPv4 address to its decimal representation',
    convert: (input) => {
      const parts = input.trim().split('.')
      if (parts.length !== 4) return '(enter a valid IPv4 address like 192.168.1.1)'
      const nums = parts.map(Number)
      if (nums.some(n => isNaN(n) || n < 0 || n > 255)) return '(invalid IPv4 octets)'
      const decimal = ((nums[0] << 24) + (nums[1] << 16) + (nums[2] << 8) + nums[3]) >>> 0
      return [
        `Decimal:  ${decimal}`,
        `Hex:      0x${decimal.toString(16).toUpperCase().padStart(8, '0')}`,
        `Binary:   ${nums.map(n => n.toString(2).padStart(8, '0')).join('.')}`,
        `Octal:    ${nums.map(n => n.toString(8)).join('.')}`,
      ].join('\n')
    },
  },
  {
    id: 'decimal-to-ip',
    name: 'Decimal to IP',
    category: 'number',
    description: 'Convert a decimal number to an IPv4 address',
    convert: (input) => {
      const n = Number(input.trim())
      if (isNaN(n) || n < 0 || n > 4294967295) return '(enter a number between 0 and 4294967295)'
      const ip = [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.')
      return ip
    },
  },
  {
    id: 'markdown-preview',
    name: 'Markdown to HTML Preview',
    category: 'utility',
    description: 'Convert Markdown to styled HTML output',
    convert: (input) => {
      let h = input
      h = h.replace(/^#### (.+)$/gm, '<h4>$1</h4>')
      h = h.replace(/^### (.+)$/gm, '<h3>$1</h3>')
      h = h.replace(/^## (.+)$/gm, '<h2>$1</h2>')
      h = h.replace(/^# (.+)$/gm, '<h1>$1</h1>')
      h = h.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
      h = h.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      h = h.replace(/\*(.+?)\*/g, '<em>$1</em>')
      h = h.replace(/~~(.+?)~~/g, '<del>$1</del>')
      h = h.replace(/`(.+?)`/g, '<code>$1</code>')
      h = h.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
      h = h.replace(/^- (.+)$/gm, '<li>$1</li>')
      h = h.replace(/(<li>.*<\/li>\n?)+/g, (m) => '<ul>' + m + '</ul>')
      h = h.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
      h = h.replace(/^---$/gm, '<hr>')
      h = h.replace(/\n\n/g, '</p><p>')
      h = '<p>' + h + '</p>'
      h = h.replace(/<p>(<h[1-4]>)/g, '$1')
      h = h.replace(/(<\/h[1-4]>)<\/p>/g, '$1')
      h = h.replace(/<p>(<ul>)/g, '$1')
      h = h.replace(/(<\/ul>)<\/p>/g, '$1')
      h = h.replace(/<p>(<blockquote>)/g, '$1')
      h = h.replace(/(<\/blockquote>)<\/p>/g, '$1')
      h = h.replace(/<p>(<hr>)<\/p>/g, '$1')
      h = h.replace(/<p><\/p>/g, '')
      return h
    },
  },
  {
    id: 'epoch-convert',
    name: 'Epoch Converter',
    category: 'utility',
    description: 'Convert between epoch timestamp and human date — enter epoch or date string',
    convert: (input) => {
      const t = input.trim()
      if (!t) return ''
      // If it looks like a number, treat as epoch
      if (/^\d{10,13}$/.test(t)) {
        const n = Number(t)
        const ms = n > 1e12 ? n : n * 1000
        const d = new Date(ms)
        if (isNaN(d.getTime())) return '(invalid timestamp)'
        return [
          `Input:   ${t}`,
          `Seconds: ${Math.floor(ms / 1000)}`,
          `Millis:  ${ms}`,
          '',
          `UTC:     ${d.toUTCString()}`,
          `ISO:     ${d.toISOString()}`,
          `Local:   ${d.toLocaleString()}`,
          '',
          `Relative: ${relativeTime(d)}`,
        ].join('\n')
      }
      // Otherwise treat as date string
      const d = new Date(t)
      if (isNaN(d.getTime())) return '(could not parse — try ISO 8601, epoch seconds, or common date formats)'
      return [
        `Input:   ${t}`,
        `Seconds: ${Math.floor(d.getTime() / 1000)}`,
        `Millis:  ${d.getTime()}`,
        '',
        `UTC:     ${d.toUTCString()}`,
        `ISO:     ${d.toISOString()}`,
        `Local:   ${d.toLocaleString()}`,
        '',
        `Relative: ${relativeTime(d)}`,
      ].join('\n')
    },
  },
  {
    id: 'placeholder-img',
    name: 'Placeholder Image URL',
    category: 'utility',
    description: 'Generate placeholder image URLs — enter WIDTHxHEIGHT (e.g. 400x300)',
    convert: (input) => {
      const match = input.trim().match(/^(\d+)\s*[xX×]\s*(\d+)$/)
      if (!match) return '(enter dimensions like 400x300)'
      const [, w, h] = match
      return [
        `-- Placeholder Services --`,
        ``,
        `placehold.co:`,
        `  https://placehold.co/${w}x${h}`,
        `  https://placehold.co/${w}x${h}/png`,
        ``,
        `picsum.photos (random image):`,
        `  https://picsum.photos/${w}/${h}`,
        ``,
        `HTML img tag:`,
        `  <img src="https://placehold.co/${w}x${h}" width="${w}" height="${h}" alt="placeholder">`,
        ``,
        `CSS background:`,
        `  background: url('https://placehold.co/${w}x${h}') center/cover;`,
      ].join('\n')
    },
  },
  {
    id: 'css-units',
    name: 'CSS Unit Converter',
    category: 'utility',
    description: 'Convert between px, rem, em, pt — enter value like "16px" (base 16px)',
    convert: (input) => {
      const lines = input.trim().split('\n')
      const line = lines[0].trim()
      const base = lines[1] ? parseFloat(lines[1]) || 16 : 16

      const match = line.match(/^([\d.]+)\s*(px|rem|em|pt|vw|vh|%)$/i)
      if (!match) return '(enter a value like "16px" or "1rem"\noptional: base font-size on second line, default 16)'
      const val = parseFloat(match[1])
      const unit = match[2].toLowerCase()

      let px
      if (unit === 'px') px = val
      else if (unit === 'rem' || unit === 'em') px = val * base
      else if (unit === 'pt') px = val * (96 / 72)
      else return `(${unit} cannot be converted without viewport context)`

      return [
        `Base font-size: ${base}px`,
        '',
        `${val}${unit} =`,
        `  ${px.toFixed(2)}px`,
        `  ${(px / base).toFixed(4)}rem`,
        `  ${(px / base).toFixed(4)}em`,
        `  ${(px * (72 / 96)).toFixed(2)}pt`,
        `  ${(px / 16 * 100).toFixed(2)}%  (of 16px base)`,
      ].join('\n')
    },
  },
  {
    id: 'aspect-ratio',
    name: 'Aspect Ratio Calculator',
    category: 'utility',
    description: 'Calculate aspect ratio from dimensions — enter WIDTHxHEIGHT',
    convert: (input) => {
      const match = input.trim().match(/^(\d+)\s*[xX×:]\s*(\d+)$/)
      if (!match) return '(enter dimensions like 1920x1080 or 16:9)'
      const w = parseInt(match[1])
      const h = parseInt(match[2])
      if (w === 0 || h === 0) return '(dimensions must be non-zero)'

      const gcd = (a, b) => b === 0 ? a : gcd(b, a % b)
      const d = gcd(w, h)
      const rw = w / d
      const rh = h / d

      const commonRatios = [
        [16, 9, '16:9 (Widescreen / HD)'],
        [4, 3, '4:3 (Classic TV)'],
        [21, 9, '21:9 (Ultrawide)'],
        [1, 1, '1:1 (Square)'],
        [3, 2, '3:2 (Classic Photo)'],
        [9, 16, '9:16 (Mobile / Stories)'],
        [5, 4, '5:4 (Monitor)'],
        [2, 1, '2:1 (Univisium)'],
      ]
      const nearest = commonRatios
        .map(([cw, ch, label]) => ({ label, diff: Math.abs((cw / ch) - (w / h)) }))
        .sort((a, b) => a.diff - b.diff)[0]

      return [
        `Dimensions: ${w} x ${h}`,
        `Ratio:      ${rw}:${rh}`,
        `Decimal:    ${(w / h).toFixed(4)}`,
        '',
        `Nearest common: ${nearest.label}`,
        '',
        `-- Common sizes at this ratio --`,
        ...[480, 720, 1080, 1440, 2160].map(height => {
          const width = Math.round(height * (w / h))
          return `  ${width} x ${height}`
        }),
      ].join('\n')
    },
  },
  {
    id: 'docker-run-to-compose',
    name: 'Docker Run → Compose',
    category: 'utility',
    description: 'Convert a docker run command to docker-compose.yml format',
    convert: (input) => {
      const cmd = input.trim().replace(/\\\n/g, ' ')
      if (!cmd.startsWith('docker run')) return '(paste a docker run command)'

      const result = { image: '', ports: [], volumes: [], environment: [], restart: '', name: '', network: '' }
      const args = cmd.replace(/^docker run\s+/, '').match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || []

      let i = 0
      while (i < args.length) {
        const arg = args[i]
        const next = args[i + 1]

        if (arg === '-p' || arg === '--publish') { result.ports.push(next); i += 2 }
        else if (arg === '-v' || arg === '--volume') { result.volumes.push(next); i += 2 }
        else if (arg === '-e' || arg === '--env') { result.environment.push(next); i += 2 }
        else if (arg === '--name') { result.name = next; i += 2 }
        else if (arg === '--restart') { result.restart = next; i += 2 }
        else if (arg === '--network') { result.network = next; i += 2 }
        else if (arg === '-d' || arg === '--detach') { i++ }
        else if (arg === '--rm') { i++ }
        else if (arg === '-it' || arg === '-i' || arg === '-t') { i++ }
        else if (arg.startsWith('-')) { i += 2 }
        else { result.image = arg; i++ }
      }

      if (!result.image) return '(could not find image name)'

      const svcName = result.name || result.image.split('/').pop().split(':')[0]
      const lines = ['services:', `  ${svcName}:`, `    image: ${result.image}`]
      if (result.name) lines.push(`    container_name: ${result.name}`)
      if (result.restart) lines.push(`    restart: ${result.restart}`)
      if (result.network) lines.push(`    networks:\n      - ${result.network}`)
      if (result.ports.length) { lines.push('    ports:'); result.ports.forEach(p => lines.push(`      - "${p}"`)) }
      if (result.volumes.length) { lines.push('    volumes:'); result.volumes.forEach(v => lines.push(`      - ${v}`)) }
      if (result.environment.length) { lines.push('    environment:'); result.environment.forEach(e => lines.push(`      - ${e}`)) }
      if (result.network) lines.push('', 'networks:', `  ${result.network}:`, '    external: true')
      return lines.join('\n')
    },
  },
  {
    id: 'regex-replace',
    name: 'Regex Replace',
    category: 'utility',
    description: 'Find & replace with regex — line 1: pattern, line 2: replacement, rest: text',
    convert: (input) => {
      const lines = input.split('\n')
      if (lines.length < 3) return '(line 1: regex pattern\nline 2: replacement string\nline 3+: text to transform)'
      const pattern = lines[0]
      const replacement = lines[1]
      const text = lines.slice(2).join('\n')
      try {
        const regex = new RegExp(pattern, 'gm')
        const result = text.replace(regex, replacement)
        const matchCount = (text.match(regex) || []).length
        return `-- ${matchCount} replacement(s) --\n\n${result}`
      } catch (e) {
        return `(invalid regex: ${e.message})`
      }
    },
  },
  {
    id: 'base-convert',
    name: 'Base Converter',
    category: 'number',
    description: 'Convert between any base (2-36) — format: "value base fromBase toBase"',
    convert: (input) => {
      const parts = input.trim().split(/\s+/)
      if (parts.length < 1) return '(enter: value [fromBase] [toBase]\ne.g. "ff 16 10" or just "255" for all bases)'

      let value = parts[0]
      const fromBase = parts[1] ? parseInt(parts[1]) : 10
      const toBase = parts[2] ? parseInt(parts[2]) : null

      if (fromBase < 2 || fromBase > 36) return '(base must be between 2 and 36)'
      const num = parseInt(value, fromBase)
      if (isNaN(num)) return '(invalid number for the given base)'

      if (toBase) {
        if (toBase < 2 || toBase > 36) return '(base must be between 2 and 36)'
        return `${value} (base ${fromBase}) = ${num.toString(toBase).toUpperCase()} (base ${toBase})`
      }

      return [
        `Input: ${value} (base ${fromBase})`,
        `Decimal: ${num}`,
        '',
        `Base  2: ${num.toString(2)}`,
        `Base  8: ${num.toString(8)}`,
        `Base 10: ${num.toString(10)}`,
        `Base 16: ${num.toString(16).toUpperCase()}`,
        `Base 32: ${num.toString(32).toUpperCase()}`,
        `Base 36: ${num.toString(36).toUpperCase()}`,
      ].join('\n')
    },
  },
  {
    id: 'jwt-create',
    name: 'JWT Builder',
    category: 'utility',
    description: 'Build an unsigned JWT from JSON payload — enter JSON',
    convert: (input) => {
      try {
        const payload = JSON.parse(input.trim())
        const header = { alg: 'none', typ: 'JWT' }
        const b64url = (obj) => btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
        const token = `${b64url(header)}.${b64url(payload)}.`
        return [
          '-- Unsigned JWT (alg: none) --',
          '',
          token,
          '',
          '-- Header --',
          JSON.stringify(header, null, 2),
          '',
          '-- Payload --',
          JSON.stringify(payload, null, 2),
        ].join('\n')
      } catch {
        return '(enter a valid JSON object for the payload)'
      }
    },
  },
  {
    id: 'number-to-words',
    name: 'Number to Words',
    category: 'number',
    description: 'Convert a number to its English word representation',
    convert: (input) => {
      const n = Number(input.trim())
      if (isNaN(n) || !isFinite(n)) return '(enter a valid number)'
      if (n === 0) return 'zero'
      const ones = ['','one','two','three','four','five','six','seven','eight','nine',
        'ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen']
      const tens = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety']
      const scales = ['','thousand','million','billion','trillion','quadrillion']
      function chunk(num) {
        if (num === 0) return ''
        if (num < 20) return ones[num]
        if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? '-' + ones[num % 10] : '')
        return ones[Math.floor(num / 100)] + ' hundred' + (num % 100 ? ' and ' + chunk(num % 100) : '')
      }
      const neg = n < 0
      let abs = Math.abs(Math.floor(n))
      if (abs === 0) return neg ? 'negative zero' : 'zero'
      const parts = []
      let scaleIdx = 0
      while (abs > 0) {
        const rem = abs % 1000
        if (rem > 0) parts.unshift(chunk(rem) + (scales[scaleIdx] ? ' ' + scales[scaleIdx] : ''))
        abs = Math.floor(abs / 1000)
        scaleIdx++
      }
      let result = (neg ? 'negative ' : '') + parts.join(', ')
      const decimal = input.trim().split('.')
      if (decimal[1]) {
        result += ' point ' + decimal[1].split('').map(d => ones[+d] || 'zero').join(' ')
      }
      return result
    },
  },
  {
    id: 'date-diff',
    name: 'Date/Time Difference',
    category: 'utility',
    description: 'Calculate the difference between two dates — one per line',
    convert: (input) => {
      const lines = input.trim().split('\n').map(l => l.trim()).filter(Boolean)
      if (lines.length < 2) return '(enter two dates on separate lines\ne.g. 2024-01-01\n     2024-12-31)'
      const d1 = new Date(lines[0])
      const d2 = new Date(lines[1])
      if (isNaN(d1.getTime())) return `(invalid first date: "${lines[0]}")`
      if (isNaN(d2.getTime())) return `(invalid second date: "${lines[1]}")`
      const diffMs = Math.abs(d2 - d1)
      const diffSec = Math.floor(diffMs / 1000)
      const diffMin = Math.floor(diffSec / 60)
      const diffHour = Math.floor(diffMin / 60)
      const diffDay = Math.floor(diffHour / 24)
      const diffWeek = Math.floor(diffDay / 7)
      const diffMonth = Math.abs((d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth()))
      const diffYear = Math.abs(d2.getFullYear() - d1.getFullYear())
      const earlier = d1 < d2 ? d1 : d2
      const later = d1 < d2 ? d2 : d1
      return [
        `From:    ${earlier.toISOString().slice(0, 19).replace('T', ' ')}`,
        `To:      ${later.toISOString().slice(0, 19).replace('T', ' ')}`,
        '',
        `Years:        ${diffYear}`,
        `Months:       ${diffMonth}`,
        `Weeks:        ${diffWeek}`,
        `Days:         ${diffDay}`,
        `Hours:        ${diffHour.toLocaleString()}`,
        `Minutes:      ${diffMin.toLocaleString()}`,
        `Seconds:      ${diffSec.toLocaleString()}`,
        `Milliseconds: ${diffMs.toLocaleString()}`,
      ].join('\n')
    },
  },
  {
    id: 'text-frequency',
    name: 'Character Frequency',
    category: 'utility',
    description: 'Count frequency of each character in text',
    convert: (input) => {
      if (!input) return ''
      const freq = {}
      for (const c of input) {
        const display = c === '\n' ? '\\n' : c === '\t' ? '\\t' : c === ' ' ? '(space)' : c
        freq[display] = (freq[display] || 0) + 1
      }
      const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1])
      const total = input.length
      return sorted.map(([char, count]) => {
        const pct = ((count / total) * 100).toFixed(1)
        const bar = '#'.repeat(Math.round(count / total * 30))
        return `${char.padEnd(8)} ${String(count).padStart(5)}  ${pct.padStart(5)}%  ${bar}`
      }).join('\n')
    },
  },
  {
    id: 'json-path-extract',
    name: 'JSON Path Extractor',
    category: 'data',
    description: 'List all paths in a JSON object — useful for understanding structure',
    convert: (input) => {
      try {
        const obj = JSON.parse(input.trim())
        const paths = []
        function walk(val, path) {
          if (val === null || typeof val !== 'object') {
            paths.push(`${path} = ${JSON.stringify(val)}`)
            return
          }
          if (Array.isArray(val)) {
            if (val.length === 0) { paths.push(`${path} = []`); return }
            val.forEach((item, i) => walk(item, `${path}[${i}]`))
          } else {
            const keys = Object.keys(val)
            if (keys.length === 0) { paths.push(`${path} = {}`); return }
            keys.forEach(k => walk(val[k], path ? `${path}.${k}` : k))
          }
        }
        walk(obj, '')
        return paths.join('\n')
      } catch {
        return '(invalid JSON)'
      }
    },
  },
  {
    id: 'text-to-nato-table',
    name: 'NATO Alphabet Table',
    category: 'utility',
    description: 'Show the NATO phonetic alphabet with corresponding letters and morse code',
    isGenerator: true,
    convert: () => {
      const nato = { A:'Alfa',B:'Bravo',C:'Charlie',D:'Delta',E:'Echo',F:'Foxtrot',G:'Golf',H:'Hotel',I:'India',J:'Juliet',K:'Kilo',L:'Lima',M:'Mike',N:'November',O:'Oscar',P:'Papa',Q:'Quebec',R:'Romeo',S:'Sierra',T:'Tango',U:'Uniform',V:'Victor',W:'Whiskey',X:'X-ray',Y:'Yankee',Z:'Zulu' }
      const morse = { A:'.-',B:'-...',C:'-.-.',D:'-..',E:'.',F:'..-.',G:'--.',H:'....',I:'..',J:'.---',K:'-.-',L:'.-..',M:'--',N:'-.',O:'---',P:'.--.',Q:'--.-',R:'.-.',S:'...',T:'-',U:'..-',V:'...-',W:'.--',X:'-..-',Y:'-.--',Z:'--..' }
      return Object.entries(nato).map(([letter, word]) => {
        return `${letter}  ${word.padEnd(10)} ${(morse[letter] || '').padEnd(6)}`
      }).join('\n')
    },
  },
  {
    id: 'cidr-calc',
    name: 'CIDR / Subnet Calculator',
    category: 'utility',
    description: 'Calculate subnet details from IP/CIDR notation — e.g. 192.168.1.0/24',
    placeholder: '192.168.1.0/24',
    convert: (input) => {
      const match = input.trim().match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)\/(\d+)$/)
      if (!match) return '(enter an IP with CIDR notation like 192.168.1.0/24)'
      const octets = [+match[1], +match[2], +match[3], +match[4]]
      if (octets.some(o => o < 0 || o > 255)) return '(invalid IP octets)'
      const prefix = +match[5]
      if (prefix < 0 || prefix > 32) return '(CIDR prefix must be 0-32)'
      const ip = ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0
      const mask = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0
      const network = (ip & mask) >>> 0
      const broadcast = (network | ~mask) >>> 0
      const firstHost = prefix >= 31 ? network : (network + 1) >>> 0
      const lastHost = prefix >= 31 ? broadcast : (broadcast - 1) >>> 0
      const hostCount = prefix >= 31 ? (prefix === 32 ? 1 : 2) : Math.pow(2, 32 - prefix) - 2
      const toIp = (n) => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.')
      const toBin = (n) => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].map(o => o.toString(2).padStart(8, '0')).join('.')
      return [
        `IP Address:    ${toIp(ip)}`,
        `CIDR Prefix:   /${prefix}`,
        `Subnet Mask:   ${toIp(mask)}`,
        `Wildcard Mask: ${toIp(~mask >>> 0)}`,
        '',
        `Network:       ${toIp(network)}`,
        `Broadcast:     ${toIp(broadcast)}`,
        `First Host:    ${toIp(firstHost)}`,
        `Last Host:     ${toIp(lastHost)}`,
        `Total Hosts:   ${hostCount.toLocaleString()}`,
        '',
        `IP Binary:     ${toBin(ip)}`,
        `Mask Binary:   ${toBin(mask)}`,
        '',
        `Class: ${octets[0] < 128 ? 'A' : octets[0] < 192 ? 'B' : octets[0] < 224 ? 'C' : octets[0] < 240 ? 'D' : 'E'}`,
        `Private: ${(octets[0] === 10 || (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) || (octets[0] === 192 && octets[1] === 168)) ? 'Yes' : 'No'}`,
      ].join('\n')
    },
  },
  {
    id: 'named-colors',
    name: 'CSS Named Colors',
    category: 'color',
    description: 'Look up CSS named colors — search by name or hex value',
    convert: (input) => {
      const colors = {
        aliceblue:'#f0f8ff',antiquewhite:'#faebd7',aqua:'#00ffff',aquamarine:'#7fffd4',
        azure:'#f0ffff',beige:'#f5f5dc',bisque:'#ffe4c4',black:'#000000',
        blanchedalmond:'#ffebcd',blue:'#0000ff',blueviolet:'#8a2be2',brown:'#a52a2a',
        burlywood:'#deb887',cadetblue:'#5f9ea0',chartreuse:'#7fff00',chocolate:'#d2691e',
        coral:'#ff7f50',cornflowerblue:'#6495ed',cornsilk:'#fff8dc',crimson:'#dc143c',
        cyan:'#00ffff',darkblue:'#00008b',darkcyan:'#008b8b',darkgoldenrod:'#b8860b',
        darkgray:'#a9a9a9',darkgreen:'#006400',darkkhaki:'#bdb76b',darkmagenta:'#8b008b',
        darkolivegreen:'#556b2f',darkorange:'#ff8c00',darkorchid:'#9932cc',darkred:'#8b0000',
        darksalmon:'#e9967a',darkseagreen:'#8fbc8f',darkslateblue:'#483d8b',darkslategray:'#2f4f4f',
        darkturquoise:'#00ced1',darkviolet:'#9400d3',deeppink:'#ff1493',deepskyblue:'#00bfff',
        dimgray:'#696969',dodgerblue:'#1e90ff',firebrick:'#b22222',floralwhite:'#fffaf0',
        forestgreen:'#228b22',fuchsia:'#ff00ff',gainsboro:'#dcdcdc',ghostwhite:'#f8f8ff',
        gold:'#ffd700',goldenrod:'#daa520',gray:'#808080',green:'#008000',
        greenyellow:'#adff2f',honeydew:'#f0fff0',hotpink:'#ff69b4',indianred:'#cd5c5c',
        indigo:'#4b0082',ivory:'#fffff0',khaki:'#f0e68c',lavender:'#e6e6fa',
        lavenderblush:'#fff0f5',lawngreen:'#7cfc00',lemonchiffon:'#fffacd',lightblue:'#add8e6',
        lightcoral:'#f08080',lightcyan:'#e0ffff',lightgoldenrodyellow:'#fafad2',lightgray:'#d3d3d3',
        lightgreen:'#90ee90',lightpink:'#ffb6c1',lightsalmon:'#ffa07a',lightseagreen:'#20b2aa',
        lightskyblue:'#87cefa',lightslategray:'#778899',lightsteelblue:'#b0c4de',lightyellow:'#ffffe0',
        lime:'#00ff00',limegreen:'#32cd32',linen:'#faf0e6',magenta:'#ff00ff',
        maroon:'#800000',mediumaquamarine:'#66cdaa',mediumblue:'#0000cd',mediumorchid:'#ba55d3',
        mediumpurple:'#9370db',mediumseagreen:'#3cb371',mediumslateblue:'#7b68ee',mediumspringgreen:'#00fa9a',
        mediumturquoise:'#48d1cc',mediumvioletred:'#c71585',midnightblue:'#191970',mintcream:'#f5fffa',
        mistyrose:'#ffe4e1',moccasin:'#ffe4b5',navajowhite:'#ffdead',navy:'#000080',
        oldlace:'#fdf5e6',olive:'#808000',olivedrab:'#6b8e23',orange:'#ffa500',
        orangered:'#ff4500',orchid:'#da70d6',palegoldenrod:'#eee8aa',palegreen:'#98fb98',
        paleturquoise:'#afeeee',palevioletred:'#db7093',papayawhip:'#ffefd5',peachpuff:'#ffdab9',
        peru:'#cd853f',pink:'#ffc0cb',plum:'#dda0dd',powderblue:'#b0e0e6',
        purple:'#800080',rebeccapurple:'#663399',red:'#ff0000',rosybrown:'#bc8f8f',
        royalblue:'#4169e1',saddlebrown:'#8b4513',salmon:'#fa8072',sandybrown:'#f4a460',
        seagreen:'#2e8b57',seashell:'#fff5ee',sienna:'#a0522d',silver:'#c0c0c0',
        skyblue:'#87ceeb',slateblue:'#6a5acd',slategray:'#708090',snow:'#fffafa',
        springgreen:'#00ff7f',steelblue:'#4682b4',tan:'#d2b48c',teal:'#008080',
        thistle:'#d8bfd8',tomato:'#ff6347',turquoise:'#40e0d0',violet:'#ee82ee',
        wheat:'#f5deb3',white:'#ffffff',whitesmoke:'#f5f5f5',yellow:'#ffff00',yellowgreen:'#9acd32',
      }
      const t = input.trim().toLowerCase()
      if (!t) {
        return Object.entries(colors).map(([name, hex]) => `${name.padEnd(22)} ${hex}`).join('\n')
      }
      const results = Object.entries(colors).filter(([name, hex]) =>
        name.includes(t) || hex.includes(t)
      )
      if (results.length === 0) return `(no matching colors for "${input.trim()}")`
      return results.map(([name, hex]) => `${name.padEnd(22)} ${hex}`).join('\n')
    },
  },
  {
    id: 'rot-n',
    name: 'ROT-N Cipher',
    category: 'encode',
    description: 'Apply ROT-N cipher — first line is N (default 13), rest is text',
    placeholder: '13\nHello, World!',
    convert: (input) => {
      const lines = input.split('\n')
      const n = parseInt(lines[0]) || 13
      const text = lines.length > 1 ? lines.slice(1).join('\n') : lines[0]
      if (!text) return `(enter shift amount on first line, text below\ndefault: ROT-13)`
      return text.replace(/[a-zA-Z]/g, (c) => {
        const base = c >= 'a' ? 97 : 65
        return String.fromCharCode(((c.charCodeAt(0) - base + ((n % 26) + 26) % 26) % 26) + base)
      })
    },
  },
  {
    id: 'number-base-table',
    name: 'Number in All Bases',
    category: 'number',
    description: 'Show a number in bases 2-36',
    placeholder: '255',
    convert: (input) => {
      const n = parseInt(input.trim())
      if (isNaN(n)) return '(enter a decimal number)'
      const bases = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 16, 20, 32, 36]
      return [
        `Decimal: ${n}`,
        '',
        ...bases.map(b => `Base ${String(b).padStart(2)}:  ${n.toString(b).toUpperCase()}`),
      ].join('\n')
    },
  },
  {
    id: 'lorem-sentences',
    name: 'Lorem Sentences',
    category: 'utility',
    description: 'Generate N random lorem ipsum sentences — enter a count (default 5)',
    convert: (input) => {
      const sentences = [
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
        'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.',
        'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.',
        'Nulla facilisi morbi tempus iaculis urna id volutpat lacus.',
        'Amet consectetur adipiscing elit pellentesque habitant morbi tristique senectus.',
        'Viverra justo nec ultrices dui sapien eget mi proin sed.',
        'Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus.',
        'Tortor vitae purus faucibus ornare suspendisse sed nisi lacus sed.',
        'Facilisis magna etiam tempor orci eu lobortis elementum nibh tellus.',
        'Massa sapien faucibus et molestie ac feugiat sed lectus vestibulum.',
        'Pellentesque diam volutpat commodo sed egestas egestas fringilla phasellus.',
        'Neque ornare aenean euismod elementum nisi quis eleifend quam adipiscing.',
        'Egestas sed tempus urna et pharetra pharetra massa massa ultricies.',
      ]
      const count = Math.max(1, Math.min(30, parseInt(input.trim()) || 5))
      const result = []
      for (let i = 0; i < count; i++) {
        result.push(sentences[i % sentences.length])
      }
      return result.join(' ')
    },
  },
  {
    id: 'fake-data',
    name: 'Fake Data Generator',
    category: 'utility',
    description: 'Generate fake data records — enter count (default 5)',
    isGenerator: true,
    convert: (input) => {
      const count = Math.max(1, Math.min(50, parseInt(input.trim()) || 5))
      const firstNames = ['James','Mary','John','Patricia','Robert','Jennifer','Michael','Linda','David','Elizabeth','William','Barbara','Richard','Susan','Joseph','Jessica','Thomas','Sarah','Christopher','Karen']
      const lastNames = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez','Hernandez','Lopez','Gonzalez','Wilson','Anderson','Thomas','Taylor','Moore','Jackson','Martin']
      const domains = ['gmail.com','yahoo.com','outlook.com','proton.me','example.com','company.org']
      const rand = (arr) => arr[Math.floor(Math.random() * arr.length)]
      const randNum = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
      const records = []
      for (let i = 0; i < count; i++) {
        const first = rand(firstNames)
        const last = rand(lastNames)
        const email = `${first.toLowerCase()}.${last.toLowerCase()}${randNum(1, 99)}@${rand(domains)}`
        const phone = `(${randNum(200, 999)}) ${randNum(200, 999)}-${String(randNum(1000, 9999))}`
        const age = randNum(18, 75)
        records.push(`${first} ${last}, ${age}, ${email}, ${phone}`)
      }
      return [
        'Name, Age, Email, Phone',
        '---',
        ...records,
      ].join('\n')
    },
  },
  {
    id: 'ip-info',
    name: 'IP Address Info',
    category: 'utility',
    description: 'Show detailed info about an IPv4 address',
    placeholder: '192.168.1.1',
    convert: (input) => {
      const t = input.trim()
      const match = t.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/)
      if (!match) return '(enter an IPv4 address like 192.168.1.1)'
      const o = [+match[1], +match[2], +match[3], +match[4]]
      if (o.some(n => n < 0 || n > 255)) return '(invalid octets)'
      const dec = ((o[0] << 24) | (o[1] << 16) | (o[2] << 8) | o[3]) >>> 0
      const cls = o[0] < 128 ? 'A' : o[0] < 192 ? 'B' : o[0] < 224 ? 'C' : o[0] < 240 ? 'D' : 'E'
      const priv = (o[0] === 10 || (o[0] === 172 && o[1] >= 16 && o[1] <= 31) || (o[0] === 192 && o[1] === 168))
      const loopback = o[0] === 127
      const linkLocal = o[0] === 169 && o[1] === 254
      const broadcast = dec === 4294967295
      const multicast = o[0] >= 224 && o[0] <= 239
      return [
        `IP:         ${t}`,
        `Decimal:    ${dec}`,
        `Hex:        0x${dec.toString(16).toUpperCase().padStart(8, '0')}`,
        `Binary:     ${o.map(n => n.toString(2).padStart(8, '0')).join('.')}`,
        `Octal:      ${o.map(n => n.toString(8)).join('.')}`,
        '',
        `Class:      ${cls}`,
        `Private:    ${priv ? 'Yes' : 'No'}`,
        `Loopback:   ${loopback ? 'Yes' : 'No'}`,
        `Link-local: ${linkLocal ? 'Yes' : 'No'}`,
        `Multicast:  ${multicast ? 'Yes' : 'No'}`,
        `Broadcast:  ${broadcast ? 'Yes' : 'No'}`,
        '',
        `Default mask: ${cls === 'A' ? '255.0.0.0 (/8)' : cls === 'B' ? '255.255.0.0 (/16)' : cls === 'C' ? '255.255.255.0 (/24)' : 'N/A'}`,
      ].join('\n')
    },
  },
  {
    id: 'crontab-gen',
    name: 'Crontab Generator',
    category: 'utility',
    description: 'Describe a schedule in plain English to get a cron expression',
    placeholder: 'every 5 minutes\nevery day at 3am\nevery monday at noon\nevery hour\nweekdays at 9:30am',
    convert: (input) => {
      const line = input.trim().toLowerCase()
      const results = line.split('\n').map(l => {
        const s = l.trim()
        if (!s) return ''

        // every N minutes
        let m = s.match(/every\s+(\d+)\s+min/)
        if (m) return `*/${m[1]} * * * *    # ${s}`

        // every N hours
        m = s.match(/every\s+(\d+)\s+hour/)
        if (m) return `0 */${m[1]} * * *    # ${s}`

        // every minute
        if (/every\s+minute/.test(s)) return `* * * * *    # ${s}`

        // every hour
        if (/every\s+hour/.test(s)) return `0 * * * *    # ${s}`

        // every day at TIME
        m = s.match(/every\s+day\s+at\s+(\d{1,2}):?(\d{2})?\s*(am|pm)?/)
        if (m) {
          let h = parseInt(m[1])
          const min = m[2] ? parseInt(m[2]) : 0
          if (m[3] === 'pm' && h < 12) h += 12
          if (m[3] === 'am' && h === 12) h = 0
          return `${min} ${h} * * *    # ${s}`
        }

        // at TIME (shorthand for daily)
        m = s.match(/^at\s+(\d{1,2}):?(\d{2})?\s*(am|pm)?/)
        if (m) {
          let h = parseInt(m[1])
          const min = m[2] ? parseInt(m[2]) : 0
          if (m[3] === 'pm' && h < 12) h += 12
          if (m[3] === 'am' && h === 12) h = 0
          return `${min} ${h} * * *    # ${s}`
        }

        // every WEEKDAY at TIME
        const days = { sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6, sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 }
        m = s.match(/every\s+(sun(?:day)?|mon(?:day)?|tue(?:sday)?|wed(?:nesday)?|thu(?:rsday)?|fri(?:day)?|sat(?:urday)?)\s+at\s+(\d{1,2}):?(\d{2})?\s*(am|pm|noon|midnight)?/i)
        if (m) {
          const dow = days[m[1].toLowerCase()]
          let h = parseInt(m[2])
          let min = m[3] ? parseInt(m[3]) : 0
          if (m[4] === 'pm' && h < 12) h += 12
          if (m[4] === 'am' && h === 12) h = 0
          if (m[4] === 'noon') { h = 12; min = 0 }
          if (m[4] === 'midnight') { h = 0; min = 0 }
          return `${min} ${h} * * ${dow}    # ${s}`
        }

        // every WEEKDAY (no time — default midnight)
        m = s.match(/every\s+(sun(?:day)?|mon(?:day)?|tue(?:sday)?|wed(?:nesday)?|thu(?:rsday)?|fri(?:day)?|sat(?:urday)?)/i)
        if (m) {
          const dow = days[m[1].toLowerCase()]
          return `0 0 * * ${dow}    # ${s}`
        }

        // weekdays at TIME
        m = s.match(/weekdays?\s+at\s+(\d{1,2}):?(\d{2})?\s*(am|pm)?/)
        if (m) {
          let h = parseInt(m[1])
          const min = m[2] ? parseInt(m[2]) : 0
          if (m[3] === 'pm' && h < 12) h += 12
          if (m[3] === 'am' && h === 12) h = 0
          return `${min} ${h} * * 1-5    # ${s}`
        }

        // noon / midnight
        if (/every\s+day\s+at\s+noon/.test(s) || s === 'noon' || s === 'daily at noon')
          return `0 12 * * *    # ${s}`
        if (/every\s+day\s+at\s+midnight/.test(s) || s === 'midnight')
          return `0 0 * * *    # ${s}`

        // every WEEKDAY at noon
        m = s.match(/every\s+(sun(?:day)?|mon(?:day)?|tue(?:sday)?|wed(?:nesday)?|thu(?:rsday)?|fri(?:day)?|sat(?:urday)?)\s+at\s+noon/i)
        if (m) {
          const dow = days[m[1].toLowerCase()]
          return `0 12 * * ${dow}    # ${s}`
        }

        return `# Could not parse: "${s}"\n# Format: minute hour day month weekday\n# ┌───── minute (0-59)\n# │ ┌───── hour (0-23)\n# │ │ ┌───── day of month (1-31)\n# │ │ │ ┌───── month (1-12)\n# │ │ │ │ ┌───── day of week (0-6, Sun=0)\n# * * * * *`
      })
      return results.filter(Boolean).join('\n')
    },
  },
  {
    id: 'chmod-calc',
    name: 'Chmod Calculator',
    category: 'utility',
    description: 'Convert between numeric and symbolic file permissions (e.g., 755 or rwxr-xr-x)',
    convert: (input) => {
      const s = input.trim()
      // numeric to symbolic
      const numMatch = s.match(/^0?([0-7]{3,4})$/)
      if (numMatch) {
        const digits = numMatch[1].length === 4 ? numMatch[1] : '0' + numMatch[1]
        const special = parseInt(digits[0])
        const perms = [parseInt(digits[1]), parseInt(digits[2]), parseInt(digits[3])]
        const rwx = (n) => ((n & 4) ? 'r' : '-') + ((n & 2) ? 'w' : '-') + ((n & 1) ? 'x' : '-')
        let sym = perms.map(rwx).join('')
        // special bits
        if (special & 4) sym = sym.slice(0, 2) + (sym[2] === 'x' ? 's' : 'S') + sym.slice(3) // setuid
        if (special & 2) sym = sym.slice(0, 5) + (sym[5] === 'x' ? 's' : 'S') + sym.slice(6) // setgid
        if (special & 1) sym = sym.slice(0, 8) + (sym[8] === 'x' ? 't' : 'T')               // sticky
        const labels = ['Owner', 'Group', 'Other']
        const desc = perms.map((n, idx) => {
          const parts = []
          if (n & 4) parts.push('read')
          if (n & 2) parts.push('write')
          if (n & 1) parts.push('execute')
          return `${labels[idx]}: ${parts.join(', ') || 'none'}`
        })
        return [
          `Numeric:  ${s}`,
          `Symbolic: ${sym}`,
          '',
          ...desc,
          special ? `\nSpecial: ${(special & 4) ? 'setuid ' : ''}${(special & 2) ? 'setgid ' : ''}${(special & 1) ? 'sticky' : ''}`.trim() : '',
        ].filter(Boolean).join('\n')
      }
      // symbolic to numeric
      const symMatch = s.match(/^([r-][w-][xsS-])([r-][w-][xsS-])([r-][w-][xtT-])$/)
      if (symMatch) {
        const toNum = (part) => ((part[0] === 'r' ? 4 : 0) + (part[1] === 'w' ? 2 : 0) + (/[xst]/i.test(part[2]) ? 1 : 0))
        const o = toNum(symMatch[1])
        const g = toNum(symMatch[2])
        const w = toNum(symMatch[3])
        let sp = 0
        if (/[sS]/.test(symMatch[1][2])) sp += 4
        if (/[sS]/.test(symMatch[2][2])) sp += 2
        if (/[tT]/.test(symMatch[3][2])) sp += 1
        return [
          `Symbolic: ${s}`,
          `Numeric:  ${sp ? sp : ''}${o}${g}${w}`,
          '',
          `Owner: ${(o & 4 ? 'read ' : '')}${(o & 2 ? 'write ' : '')}${(o & 1 ? 'execute' : '')}`.trim() || 'Owner: none',
          `Group: ${(g & 4 ? 'read ' : '')}${(g & 2 ? 'write ' : '')}${(g & 1 ? 'execute' : '')}`.trim() || 'Group: none',
          `Other: ${(w & 4 ? 'read ' : '')}${(w & 2 ? 'write ' : '')}${(w & 1 ? 'execute' : '')}`.trim() || 'Other: none',
        ].join('\n')
      }
      return 'Enter numeric (e.g., 755) or symbolic (e.g., rwxr-xr-x) permissions'
    },
  },
  {
    id: 'text-stats',
    name: 'Text Statistics',
    category: 'utility',
    description: 'Character, word, sentence, paragraph counts, readability metrics, and word frequency',
    convert: (input) => {
      const chars = input.length
      const charsNoSpace = input.replace(/\s/g, '').length
      const words = input.trim().split(/\s+/).filter(Boolean)
      const wordCount = words.length
      const sentences = input.split(/[.!?]+/).filter(s => s.trim().length > 0).length
      const paragraphs = input.split(/\n\s*\n/).filter(p => p.trim().length > 0).length
      const lines = input.split('\n').length
      const avgWordLen = wordCount > 0 ? (words.reduce((s, w) => s + w.length, 0) / wordCount).toFixed(1) : 0

      // Word frequency
      const freq = {}
      for (const w of words) {
        const lw = w.toLowerCase().replace(/[^a-z0-9'-]/g, '')
        if (lw) freq[lw] = (freq[lw] || 0) + 1
      }
      const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1])
      const unique = sorted.length
      const top10 = sorted.slice(0, 10).map(([w, c]) => `  ${w}: ${c}`).join('\n')

      // Flesch reading ease
      const syllables = words.reduce((s, w) => {
        const syls = w.toLowerCase().replace(/[^a-z]/g, '').replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').match(/[aeiouy]{1,2}/g)
        return s + Math.max(1, syls ? syls.length : 1)
      }, 0)
      const flesch = wordCount > 0 && sentences > 0
        ? (206.835 - 1.015 * (wordCount / sentences) - 84.6 * (syllables / wordCount)).toFixed(1)
        : 'N/A'

      const readTime = Math.max(1, Math.ceil(wordCount / 238))

      return [
        `Characters:      ${chars.toLocaleString()}`,
        `Characters (no space): ${charsNoSpace.toLocaleString()}`,
        `Words:           ${wordCount.toLocaleString()}`,
        `Unique words:    ${unique.toLocaleString()}`,
        `Sentences:       ${sentences}`,
        `Paragraphs:      ${paragraphs}`,
        `Lines:           ${lines}`,
        `Avg word length: ${avgWordLen} chars`,
        `Syllables:       ~${syllables}`,
        `Reading ease:    ${flesch} (Flesch)`,
        `Reading time:    ~${readTime} min`,
        '',
        `Top words:`,
        top10 || '  (none)',
      ].join('\n')
    },
  },
  {
    id: 'string-reverse',
    name: 'String Reverse',
    category: 'utility',
    description: 'Reverse text by characters, words, or lines',
    placeholder: 'Hello World\nLine two\nLine three',
    convert: (input) => {
      const byChars = Array.from(input).reverse().join('')
      const byWords = input.split(/(\s+)/).reverse().join('')
      const byLines = input.split('\n').reverse().join('\n')
      return [
        'By characters:',
        byChars,
        '',
        'By words:',
        byWords,
        '',
        'By lines:',
        byLines,
      ].join('\n')
    },
  },
  {
    id: 'nato-converter',
    name: 'NATO Phonetic',
    category: 'utility',
    description: 'Convert text to/from NATO phonetic alphabet (auto-detects direction)',
    convert: (input) => {
      const natoMap = {
        A:'Alfa',B:'Bravo',C:'Charlie',D:'Delta',E:'Echo',F:'Foxtrot',G:'Golf',H:'Hotel',
        I:'India',J:'Juliet',K:'Kilo',L:'Lima',M:'Mike',N:'November',O:'Oscar',P:'Papa',
        Q:'Quebec',R:'Romeo',S:'Sierra',T:'Tango',U:'Uniform',V:'Victor',W:'Whiskey',
        X:'Xray',Y:'Yankee',Z:'Zulu','0':'Zero','1':'One','2':'Two','3':'Three','4':'Four',
        '5':'Five','6':'Six','7':'Seven','8':'Eight','9':'Niner',
      }
      const rev = Object.fromEntries(Object.entries(natoMap).map(([k, v]) => [v.toLowerCase(), k]))
      const words = input.trim().split(/\s+/)
      // detect: if first word is a NATO word, decode
      if (rev[words[0].toLowerCase()]) {
        return words.map(w => w === '/' ? ' ' : (rev[w.toLowerCase()] || w)).join('')
      }
      return input.toUpperCase().split('').map(c => c === ' ' ? '  /  ' : natoMap[c] || c).join(' ')
    },
  },
  {
    id: 'wcag-contrast',
    name: 'WCAG Contrast Checker',
    category: 'color',
    description: 'Check WCAG color contrast ratio between two hex colors — one per line',
    placeholder: '#2c2a25\n#faf8f5',
    convert: (input) => {
      const lines = input.trim().split('\n').map(l => l.trim()).filter(Boolean)
      if (lines.length < 2) return '(enter two hex colors, one per line\ne.g.:\n#000000\n#ffffff)'
      function parseHexColor(color) {
        const c = color.startsWith('#') ? color : '#' + color
        if (!/^#[0-9a-fA-F]{6}$/.test(c)) return null
        return c
      }
      function hexToLuminance(hex) {
        const h = hex.replace('#', '')
        const linearize = c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
        const r = linearize(parseInt(h.slice(0, 2), 16) / 255)
        const g = linearize(parseInt(h.slice(2, 4), 16) / 255)
        const b = linearize(parseInt(h.slice(4, 6), 16) / 255)
        return 0.2126 * r + 0.7152 * g + 0.0722 * b
      }
      const hex1 = parseHexColor(lines[0])
      const hex2 = parseHexColor(lines[1])
      if (!hex1) return `(invalid color: "${lines[0]}" — use 6-digit hex like #ff0000)`
      if (!hex2) return `(invalid color: "${lines[1]}" — use 6-digit hex like #ffffff)`
      const L1 = Math.max(hexToLuminance(hex1), hexToLuminance(hex2))
      const L2 = Math.min(hexToLuminance(hex1), hexToLuminance(hex2))
      const ratio = (L1 + 0.05) / (L2 + 0.05)
      const verdict = (passes) => passes ? '✓ Pass' : '✗ Fail'
      return [
        `Color 1:   ${hex1}`,
        `Color 2:   ${hex2}`,
        `Ratio:     ${ratio.toFixed(2)}:1`,
        '',
        '-- WCAG 2.1 Compliance --',
        `AA   Normal text  (≥4.5:1):  ${verdict(ratio >= 4.5)}`,
        `AA   Large text   (≥3.0:1):  ${verdict(ratio >= 3.0)}`,
        `AAA  Normal text  (≥7.0:1):  ${verdict(ratio >= 7.0)}`,
        `AAA  Large text   (≥4.5:1):  ${verdict(ratio >= 4.5)}`,
        '',
        'Large text = 18pt+ or 14pt+ bold (~24px or ~18.67px)',
      ].join('\n')
    },
  },
  {
    id: 'json-flatten',
    name: 'JSON Flatten',
    category: 'data',
    description: 'Flatten nested JSON to dot-notation key/value pairs',
    placeholder: '{"user":{"name":"Alice","address":{"city":"NYC"}},"tags":["js","react"]}',
    convert: (input) => {
      try {
        const obj = JSON.parse(input.trim())
        const result = {}
        function flatten(val, prefix) {
          if (Array.isArray(val)) {
            val.forEach((item, i) => flatten(item, `${prefix}[${i}]`))
          } else if (val !== null && typeof val === 'object') {
            for (const [k, v] of Object.entries(val)) {
              flatten(v, prefix ? `${prefix}.${k}` : k)
            }
          } else {
            result[prefix] = val
          }
        }
        flatten(obj, '')
        return JSON.stringify(result, null, 2)
      } catch {
        return '(invalid JSON)'
      }
    },
  },
  {
    id: 'json-unflatten',
    name: 'JSON Unflatten',
    category: 'data',
    description: 'Expand dot-notation flat JSON back to nested structure',
    placeholder: '{"user.name":"Alice","user.address.city":"NYC","tags[0]":"js","tags[1]":"react"}',
    convert: (input) => {
      try {
        const flat = JSON.parse(input.trim())
        const result = {}
        for (const [key, value] of Object.entries(flat)) {
          const parts = key.replace(/\[(\d+)\]/g, '.$1').split('.')
          let cur = result
          for (let i = 0; i < parts.length - 1; i++) {
            const p = parts[i]
            const next = parts[i + 1]
            if (!(p in cur)) {
              cur[p] = /^\d+$/.test(next) ? [] : {}
            }
            cur = cur[p]
          }
          cur[parts[parts.length - 1]] = value
        }
        return JSON.stringify(result, null, 2)
      } catch {
        return '(invalid JSON)'
      }
    },
  },
  {
    id: 'color-scheme',
    name: 'Color Scheme Generator',
    category: 'color',
    description: 'Generate complementary, triadic, analogous, and tint/shade palettes from a hex color',
    placeholder: '#3b82f6',
    convert: (input) => {
      const hex = input.trim()
      if (!/^#?[0-9a-fA-F]{6}$/.test(hex.replace('#', ''))) {
        return '(enter a 6-digit hex color like #3b82f6)'
      }
      const h = hex.replace('#', '')
      const r = parseInt(h.slice(0, 2), 16) / 255
      const g = parseInt(h.slice(2, 4), 16) / 255
      const b = parseInt(h.slice(4, 6), 16) / 255
      const max = Math.max(r, g, b), min = Math.min(r, g, b)
      const l = (max + min) / 2
      let s = 0, hue = 0
      if (max !== min) {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
          case r: hue = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
          case g: hue = ((b - r) / d + 2) / 6; break
          case b: hue = ((r - g) / d + 4) / 6; break
        }
      }
      const hDeg = Math.round(hue * 360)
      const sPct = Math.round(s * 100)
      const lPct = Math.round(l * 100)
      function hslToHex(hh, ss, ll) {
        const s2 = ss / 100, l2 = ll / 100
        const a = s2 * Math.min(l2, 1 - l2)
        const f = n => {
          const k = (n + hh / 30) % 12
          const color = l2 - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
          return Math.round(255 * color).toString(16).padStart(2, '0')
        }
        return `#${f(0)}${f(8)}${f(4)}`
      }
      const rot = (deg) => ((hDeg + deg) % 360 + 360) % 360
      return [
        `Base:           ${hex.startsWith('#') ? hex : '#' + h}  hsl(${hDeg}, ${sPct}%, ${lPct}%)`,
        '',
        '-- Complementary --',
        `Complement:     ${hslToHex(rot(180), sPct, lPct)}`,
        '',
        '-- Triadic --',
        `Triadic 1:      ${hslToHex(rot(120), sPct, lPct)}`,
        `Triadic 2:      ${hslToHex(rot(240), sPct, lPct)}`,
        '',
        '-- Analogous --',
        `Analogous -30°: ${hslToHex(rot(-30), sPct, lPct)}`,
        `Analogous +30°: ${hslToHex(rot(30), sPct, lPct)}`,
        '',
        '-- Split Complementary --',
        `Split 1:        ${hslToHex(rot(150), sPct, lPct)}`,
        `Split 2:        ${hslToHex(rot(210), sPct, lPct)}`,
        '',
        '-- Tints & Shades --',
        `Tint  90%:      ${hslToHex(hDeg, sPct, Math.min(95, lPct + 35))}`,
        `Tint  70%:      ${hslToHex(hDeg, sPct, Math.min(90, lPct + 20))}`,
        `Base:           ${hex.startsWith('#') ? hex : '#' + h}`,
        `Shade 70%:      ${hslToHex(hDeg, sPct, Math.max(5, lPct - 20))}`,
        `Shade 50%:      ${hslToHex(hDeg, sPct, Math.max(5, lPct - 35))}`,
      ].join('\n')
    },
  },
  {
    id: 'unicode-inspector',
    name: 'Unicode Inspector',
    category: 'utility',
    description: 'Show Unicode code point info for each character',
    placeholder: 'Hello 🌍 こんにちは',
    convert: (input) => {
      if (!input) return ''
      const controlNames = {
        0:'NUL',1:'SOH',2:'STX',3:'ETX',4:'EOT',5:'ENQ',6:'ACK',7:'BEL',
        8:'BS',9:'HT',10:'LF',11:'VT',12:'FF',13:'CR',14:'SO',15:'SI',
        16:'DLE',17:'DC1',18:'DC2',19:'DC3',20:'DC4',21:'NAK',22:'SYN',23:'ETB',
        24:'CAN',25:'EM',26:'SUB',27:'ESC',28:'FS',29:'GS',30:'RS',31:'US',
      }
      const chars = [...input]
      return chars.map(ch => {
        const cp = ch.codePointAt(0)
        const hex = cp.toString(16).toUpperCase().padStart(cp > 0xFFFF ? 5 : 4, '0')
        const display = cp < 0x20 ? (controlNames[cp] || `CTL`) : cp === 0x20 ? 'SPACE' : ch
        const bytes = [...new TextEncoder().encode(ch)].map(b => b.toString(16).padStart(2, '0')).join(' ')
        return `U+${hex}  ${display.padEnd(6)} UTF-8: ${bytes}`
      }).join('\n')
    },
  },
  {
    id: 'ascii-art',
    name: 'ASCII Art Text',
    category: 'utility',
    description: 'Generate large block-letter ASCII art from text',
    convert: (input) => {
      const font = {
        A: ['  #  ','  #  ',' # # ','#####','#   #','#   #'],
        B: ['#### ','#   #','#### ','#   #','#   #','#### '],
        C: [' ####','#    ','#    ','#    ','#    ',' ####'],
        D: ['#### ','#   #','#   #','#   #','#   #','#### '],
        E: ['#####','#    ','###  ','#    ','#    ','#####'],
        F: ['#####','#    ','###  ','#    ','#    ','#    '],
        G: [' ####','#    ','# ###','#   #','#   #',' ####'],
        H: ['#   #','#   #','#####','#   #','#   #','#   #'],
        I: ['#####','  #  ','  #  ','  #  ','  #  ','#####'],
        J: ['#####','   # ','   # ','   # ','#  # ',' ##  '],
        K: ['#   #','#  # ','###  ','#  # ','#   #','#   #'],
        L: ['#    ','#    ','#    ','#    ','#    ','#####'],
        M: ['#   #','## ##','# # #','#   #','#   #','#   #'],
        N: ['#   #','##  #','# # #','#  ##','#   #','#   #'],
        O: [' ### ','#   #','#   #','#   #','#   #',' ### '],
        P: ['#### ','#   #','#### ','#    ','#    ','#    '],
        Q: [' ### ','#   #','#   #','# # #','#  ##',' ####'],
        R: ['#### ','#   #','#### ','#  # ','#   #','#   #'],
        S: [' ####','#    ',' ### ','    #','    #','#### '],
        T: ['#####','  #  ','  #  ','  #  ','  #  ','  #  '],
        U: ['#   #','#   #','#   #','#   #','#   #',' ### '],
        V: ['#   #','#   #','#   #',' # # ',' # # ','  #  '],
        W: ['#   #','#   #','#   #','# # #','## ##','#   #'],
        X: ['#   #',' # # ','  #  ','  #  ',' # # ','#   #'],
        Y: ['#   #',' # # ','  #  ','  #  ','  #  ','  #  '],
        Z: ['#####','   # ','  #  ',' #   ','#    ','#####'],
        ' ': ['     ','     ','     ','     ','     ','     '],
        '0': [' ### ','#   #','#  ##','# # #','##  #',' ### '],
        '1': ['  #  ',' ##  ','  #  ','  #  ','  #  ','#####'],
        '2': [' ### ','#   #','   # ',' ##  ','#    ','#####'],
        '3': [' ### ','#   #','  ## ','    #','#   #',' ### '],
        '4': ['#   #','#   #','#####','    #','    #','    #'],
        '5': ['#####','#    ','#### ','    #','    #','#### '],
        '6': [' ### ','#    ','#### ','#   #','#   #',' ### '],
        '7': ['#####','   # ','  #  ',' #   ',' #   ',' #   '],
        '8': [' ### ','#   #',' ### ','#   #','#   #',' ### '],
        '9': [' ### ','#   #',' ####','    #','    #',' ### '],
        '!': ['  #  ','  #  ','  #  ','  #  ','     ','  #  '],
        '?': [' ### ','#   #','  ## ','  #  ','     ','  #  '],
        '.': ['     ','     ','     ','     ','     ','  #  '],
      }

      const text = input.toUpperCase()
      const lines = Array(6).fill('')
      for (const ch of text) {
        const glyph = font[ch] || font['?']
        for (let row = 0; row < 6; row++) {
          lines[row] += (glyph[row] || '     ') + ' '
        }
      }
      return lines.map(l => l.trimEnd()).join('\n')
    },
  },
  {
    id: 'typescript-gen',
    name: 'JSON to TypeScript',
    category: 'utility',
    description: 'Generate TypeScript interfaces from a JSON object',
    convert: (input) => {
      try {
        const json = JSON.parse(input.trim())
        const root = Array.isArray(json) ? json[0] : json
        if (typeof root !== 'object' || root === null) return '(enter a JSON object or array of objects)'
        const interfaces = []
        function getType(val, key) {
          if (val === null) return 'null'
          if (Array.isArray(val)) {
            if (val.length === 0) return 'unknown[]'
            const singular = key.replace(/ies$/, 'y').replace(/s$/, '')
            return getType(val[0], singular) + '[]'
          }
          if (typeof val === 'object') {
            const name = key.charAt(0).toUpperCase() + key.slice(1)
            buildInterface(val, name)
            return name
          }
          return typeof val
        }
        function buildInterface(obj, name) {
          const lines = Object.entries(obj).map(([k, v]) => {
            const type = getType(v, k)
            const safe = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : `'${k}'`
            return `  ${safe}: ${type};`
          })
          interfaces.push(`interface ${name} {\n${lines.join('\n')}\n}`)
        }
        buildInterface(root, 'Root')
        return interfaces.join('\n\n')
      } catch {
        return '(invalid JSON)'
      }
    },
  },
  {
    id: 'http-status',
    name: 'HTTP Status Codes',
    category: 'utility',
    description: 'Look up HTTP status code meaning — enter a code or leave blank for all',
    convert: (input) => {
      const statuses = {
        100: ['Continue', 'The server received the request headers; client should proceed.'],
        101: ['Switching Protocols', 'The server agrees to switch protocols as requested.'],
        102: ['Processing', 'Server has received and is processing the request.'],
        103: ['Early Hints', 'Return some response headers before final HTTP message.'],
        200: ['OK', 'Standard response for successful HTTP requests.'],
        201: ['Created', 'The request fulfilled, resulting in a new resource being created.'],
        202: ['Accepted', 'Request accepted for processing, but not yet completed.'],
        204: ['No Content', 'Successfully processed, returning no content.'],
        206: ['Partial Content', 'Delivers only part of the resource (byte serving).'],
        301: ['Moved Permanently', 'This and all future requests directed to the given URI.'],
        302: ['Found', 'The resource is temporarily at a different URI.'],
        304: ['Not Modified', 'Resource has not been modified since last requested.'],
        307: ['Temporary Redirect', 'Redirect using the same method to a different URL.'],
        308: ['Permanent Redirect', 'Resource is now at another URI; use same method.'],
        400: ['Bad Request', 'Request cannot be fulfilled due to bad syntax.'],
        401: ['Unauthorized', 'Authentication required and has failed or not been provided.'],
        403: ['Forbidden', 'Request was valid but the server is refusing action.'],
        404: ['Not Found', 'The requested resource could not be found.'],
        405: ['Method Not Allowed', 'Request method is not supported for this resource.'],
        408: ['Request Timeout', 'The server timed out waiting for the request.'],
        409: ['Conflict', 'Conflict in the request, such as an edit conflict.'],
        410: ['Gone', 'The resource requested is no longer available.'],
        413: ['Content Too Large', 'Request is larger than the server is willing to process.'],
        415: ['Unsupported Media Type', 'Media type the server does not support.'],
        422: ['Unprocessable Content', 'Well-formed but semantically erroneous request.'],
        429: ['Too Many Requests', 'User has sent too many requests (rate limiting).'],
        500: ['Internal Server Error', 'An unexpected condition was encountered.'],
        501: ['Not Implemented', 'Server does not support the functionality required.'],
        502: ['Bad Gateway', 'Invalid response received from an upstream server.'],
        503: ['Service Unavailable', 'Server is currently unavailable (overload or maintenance).'],
        504: ['Gateway Timeout', 'Gateway did not receive a timely response from upstream.'],
        505: ['HTTP Version Not Supported', 'HTTP version in the request is not supported.'],
      }
      const s = input.trim()
      if (!s) {
        const groups = { '1xx Informational': [], '2xx Success': [], '3xx Redirection': [], '4xx Client Error': [], '5xx Server Error': [] }
        for (const [code, [name]] of Object.entries(statuses)) {
          const n = parseInt(code)
          if (n < 200) groups['1xx Informational'].push(`  ${code} ${name}`)
          else if (n < 300) groups['2xx Success'].push(`  ${code} ${name}`)
          else if (n < 400) groups['3xx Redirection'].push(`  ${code} ${name}`)
          else if (n < 500) groups['4xx Client Error'].push(`  ${code} ${name}`)
          else groups['5xx Server Error'].push(`  ${code} ${name}`)
        }
        return Object.entries(groups).map(([g, lines]) => `${g}:\n${lines.join('\n')}`).join('\n\n')
      }
      const code = parseInt(s)
      if (isNaN(code)) return '(enter a status code like 404 or leave blank for all)'
      const entry = statuses[code]
      if (!entry) return `(unknown status code: ${code})`
      const [name, desc] = entry
      return [`${code} ${name}`, '', desc].join('\n')
    },
  },
  {
    id: 'password-strength',
    name: 'Password Strength',
    category: 'utility',
    description: 'Analyze password strength and estimate time to crack',
    convert: (input) => {
      const pw = input
      if (!pw) return '(enter a password to analyze)'
      const hasLower = /[a-z]/.test(pw)
      const hasUpper = /[A-Z]/.test(pw)
      const hasDigit = /[0-9]/.test(pw)
      const hasSymbol = /[^a-zA-Z0-9]/.test(pw)
      let pool = 0
      if (hasLower) pool += 26
      if (hasUpper) pool += 26
      if (hasDigit) pool += 10
      if (hasSymbol) pool += 32
      const entropy = pool > 0 ? Math.log2(Math.pow(pool, pw.length)) : 0
      let strength
      if (entropy < 28) strength = 'Very Weak'
      else if (entropy < 36) strength = 'Weak'
      else if (entropy < 60) strength = 'Fair'
      else if (entropy < 80) strength = 'Strong'
      else strength = 'Very Strong'
      const guesses = Math.pow(2, entropy)
      const secs = guesses / 1e9
      function fmtTime(s) {
        if (s < 1) return 'instant'
        if (s < 60) return `${s.toFixed(0)} seconds`
        if (s < 3600) return `${(s / 60).toFixed(0)} minutes`
        if (s < 86400) return `${(s / 3600).toFixed(0)} hours`
        if (s < 31536000) return `${(s / 86400).toFixed(0)} days`
        if (s < 3.15e9) return `${(s / 31536000).toFixed(0)} years`
        return `${(s / 3.15e9).toFixed(0)} billion years`
      }
      const issues = []
      if (pw.length < 8) issues.push('Too short (minimum 8 characters recommended)')
      if (!hasLower) issues.push('Add lowercase letters (a-z)')
      if (!hasUpper) issues.push('Add uppercase letters (A-Z)')
      if (!hasDigit) issues.push('Add numbers (0-9)')
      if (!hasSymbol) issues.push('Add symbols (!@#$%...)')
      if (/(.)\1{2,}/.test(pw)) issues.push('Avoid 3+ repeated characters in a row')
      return [
        `Length:   ${pw.length} characters`,
        `Strength: ${strength}`,
        `Entropy:  ${entropy.toFixed(1)} bits`,
        `Pool:     ${pool} possible characters`,
        '',
        `Crack time (10⁹ guesses/sec): ${fmtTime(secs)}`,
        '',
        `${hasLower ? '✓' : '✗'} Lowercase letters`,
        `${hasUpper ? '✓' : '✗'} Uppercase letters`,
        `${hasDigit ? '✓' : '✗'} Numbers`,
        `${hasSymbol ? '✓' : '✗'} Symbols`,
        ...(issues.length > 0 ? ['', 'Suggestions:', ...issues.map(i => `  • ${i}`)] : ['', '✓ Looks good!']),
      ].join('\n')
    },
  },
  {
    id: 'luhn-check',
    name: 'Luhn Check',
    category: 'utility',
    description: 'Validate credit card numbers using the Luhn algorithm',
    convert: (input) => {
      const num = input.trim().replace(/[\s-]/g, '')
      if (!num) return '(enter a number to validate)'
      if (!/^\d+$/.test(num)) return '(enter digits only — spaces and dashes are allowed)'
      let sum = 0, isEven = false
      for (let i = num.length - 1; i >= 0; i--) {
        let d = parseInt(num[i])
        if (isEven) { d *= 2; if (d > 9) d -= 9 }
        sum += d
        isEven = !isEven
      }
      const valid = sum % 10 === 0
      let cardType = 'Unknown'
      if (/^4\d{12}(\d{3})?$/.test(num)) cardType = 'Visa'
      else if (/^5[1-5]\d{14}$/.test(num) || /^2(2[2-9]\d|[3-6]\d\d|7([01]\d|20))\d{12}$/.test(num)) cardType = 'Mastercard'
      else if (/^3[47]\d{13}$/.test(num)) cardType = 'American Express'
      else if (/^6(011|22\d|4[4-9]|5)\d{12,}$/.test(num)) cardType = 'Discover'
      else if (/^35(2[89]|[3-8]\d)\d{12}$/.test(num)) cardType = 'JCB'
      return [
        `Number:     ${num}`,
        `Luhn:       ${valid ? 'VALID ✓' : 'INVALID ✗'}`,
        `Card type:  ${cardType}`,
        `Length:     ${num.length} digits`,
      ].join('\n')
    },
  },
  {
    id: 'num-stats',
    name: 'Number Statistics',
    category: 'utility',
    description: 'Statistical analysis of a list of numbers (one per line or comma-separated)',
    placeholder: '12\n45\n7\n89\n34\n56\n23',
    convert: (input) => {
      const nums = input.split(/[\n,]+/).map(s => s.trim()).filter(Boolean).map(Number).filter(n => !isNaN(n))
      if (nums.length === 0) return '(enter numbers, one per line or comma-separated)'
      const n = nums.length
      const sorted = [...nums].sort((a, b) => a - b)
      const sum = nums.reduce((a, b) => a + b, 0)
      const mean = sum / n
      const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)]
      const popVariance = nums.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / n
      const sampleVariance = n > 1 ? nums.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / (n - 1) : 0
      const q1 = sorted[Math.floor(n * 0.25)]
      const q3 = sorted[Math.floor(n * 0.75)]
      const iqr = q3 - q1
      const freq = {}
      nums.forEach(v => { freq[v] = (freq[v] || 0) + 1 })
      const maxFreq = Math.max(...Object.values(freq))
      const modes = Object.keys(freq).filter(k => freq[k] === maxFreq).map(Number)
      const modeStr = maxFreq === 1 ? 'none (all values unique)' : modes.join(', ') + ` (×${maxFreq})`
      const fmt = (v) => Number.isInteger(v) ? String(v) : v.toPrecision(6).replace(/\.?0+$/, '')
      return [
        `Count:     ${n}`,
        `Sum:       ${fmt(sum)}`,
        '',
        `Min:       ${fmt(sorted[0])}`,
        `Max:       ${fmt(sorted[n - 1])}`,
        `Range:     ${fmt(sorted[n - 1] - sorted[0])}`,
        '',
        `Mean:      ${fmt(mean)}`,
        `Median:    ${fmt(median)}`,
        `Mode:      ${modeStr}`,
        '',
        `Std Dev (pop):    ${fmt(Math.sqrt(popVariance))}`,
        `Std Dev (sample): ${fmt(Math.sqrt(sampleVariance))}`,
        `Variance (pop):   ${fmt(popVariance)}`,
        `Variance (sample):${fmt(sampleVariance)}`,
        '',
        `Q1 (25%): ${fmt(q1)}`,
        `Q3 (75%): ${fmt(q3)}`,
        `IQR:      ${fmt(iqr)}`,
      ].join('\n')
    },
  },
  {
    id: 'morse-code',
    name: 'Morse Code',
    category: 'utility',
    description: 'Convert text to Morse code and vice versa (use dots and dashes)',
    placeholder: 'Hello World',
    convert: (input) => {
      const s = input.trim()
      if (!s) return ''
      const ENC = {
        A:'.-', B:'-...', C:'-.-.', D:'-..', E:'.', F:'..-.', G:'--.', H:'....', I:'..', J:'.---',
        K:'-.-', L:'.-..', M:'--', N:'-.', O:'---', P:'.--.', Q:'--.-', R:'.-.', S:'...', T:'-',
        U:'..-', V:'...-', W:'.--', X:'-..-', Y:'-.--', Z:'--..',
        '0':'-----', '1':'.----', '2':'..---', '3':'...--', '4':'....-', '5':'.....',
        '6':'-....', '7':'--...', '8':'---..', '9':'----.',
        '.':'.-.-.-', ',':'--..--', '?':'..--..', "'":'.----.', '!':'-.-.--',
        '/':'-..-.', '(':'-.--.', ')':'-.--.-', '&':'.-...', ':':'---...',
        ';':'-.-.-.', '=':'-...-', '+':'.-.-.', '-':'-....-',
        '"':'.-..-.', '@':'.--.-.', ' ':'/',
      }
      const DEC = Object.fromEntries(Object.entries(ENC).map(([k, v]) => [v, k]))
      DEC['/'] = ' '
      if (/^[.\-/ ]+$/.test(s)) {
        const words = s.trim().split(/\s*\/\s*/)
        const decoded = words.map(word => word.trim().split(/\s+/).map(code => DEC[code] || '?').join('')).join(' ')
        return `Decoded: ${decoded}`
      }
      const encoded = s.toUpperCase().split('').map(c => ENC[c] ?? '').join(' ').replace(/ {2,}/g, ' ')
      return `Morse: ${encoded}`
    },
  },
  {
    id: 'css-clamp',
    name: 'CSS Clamp Generator',
    category: 'utility',
    description: 'Generate fluid CSS clamp() values — enter: minPx maxPx minVw maxVw',
    placeholder: '16 24 320 1280',
    convert: (input) => {
      const parts = input.trim().split(/[\s,]+/)
      if (parts.length < 4) return '(enter: minSize maxSize minViewport maxViewport — e.g. 16 24 320 1280)'
      const [minSize, maxSize, minVw, maxVw] = parts.map(Number)
      if ([minSize, maxSize, minVw, maxVw].some(isNaN)) return '(all four values must be numbers)'
      if (minVw >= maxVw) return '(minViewport must be less than maxViewport)'
      const slope = (maxSize - minSize) / (maxVw - minVw)
      const intercept = minSize - slope * minVw
      const slopeVw = (slope * 100).toFixed(4).replace(/\.?0+$/, '')
      const interceptRem = (intercept / 16).toFixed(4).replace(/\.?0+$/, '')
      const minRem = minSize / 16
      const maxRem = maxSize / 16
      const clampValue = `clamp(${minRem}rem, ${slopeVw}vw + ${interceptRem}rem, ${maxRem}rem)`
      return [
        `Min: ${minSize}px (${minRem}rem) at ${minVw}px viewport`,
        `Max: ${maxSize}px (${maxRem}rem) at ${maxVw}px viewport`,
        '',
        clampValue,
        '',
        `font-size: ${clampValue};`,
        `padding: ${clampValue};`,
        '',
        `Slope: ${slopeVw}vw per 100px viewport`,
        `Intercept: ${interceptRem}rem`,
      ].join('\n')
    },
  },
  {
    id: 'percentage-calc',
    name: 'Percentage Calculator',
    category: 'utility',
    description: 'Calculate percentages — "15% of 200", "30 is what % of 150", or "100 to 150 % change"',
    placeholder: '15% of 200',
    convert: (input) => {
      const s = input.trim()
      if (!s) return '(enter: "15% of 200", "30 is what % of 150", or "100 to 150 % change")'
      const fmt = (n) => parseFloat(n.toFixed(6)).toString()
      let m = s.match(/^([\d.]+)%\s*(of|von)\s*([\d.]+)$/i)
      if (m) {
        const pct = parseFloat(m[1]), connector = m[2].toLowerCase(), total = parseFloat(m[3])
        if (![pct, total].every(Number.isFinite)) return '(invalid values)'
        return `${pct}% ${connector} ${total} = ${fmt((pct / 100) * total)}`
      }
      m = s.match(/^([\d.]+)\s+is\s+what\s+%\s+of\s+([\d.]+)$/i)
      if (m) {
        const part = parseFloat(m[1]), total = parseFloat(m[2])
        if (total === 0) return '(cannot divide by zero)'
        return `${part} is ${fmt((part / total) * 100)}% of ${total}`
      }
      m = s.match(/^([\d.]+)\s+to\s+([\d.]+)(\s+%\s*change)?$/i)
      if (m) {
        const from = parseFloat(m[1]), to = parseFloat(m[2])
        if (from === 0) return '(cannot calculate % change from zero)'
        const change = ((to - from) / Math.abs(from)) * 100
        return [
          `${from} → ${to}`,
          `Change: ${change >= 0 ? '+' : ''}${fmt(change)}%`,
          `Difference: ${fmt(to - from)}`,
        ].join('\n')
      }
      return '(enter: "15% of 200", "30 is what % of 150", or "100 to 150 % change")'
    },
  },
  {
    id: 'loan-calc',
    name: 'Loan Calculator',
    category: 'utility',
    description: 'Calculate monthly payment, total cost, and amortization — format: "amount rate% years" (e.g. "250000 4.5% 30")',
    placeholder: '250000 4.5% 30',
    convert: (input) => {
      const m = input.trim().match(/^([\d,]+)\s+([\d.]+)%?\s+(\d+)$/)
      if (!m) return '(format: "amount rate% years" — e.g. "250000 4.5% 30" for a 30-year mortgage at 4.5%)'
      const principal = parseFloat(m[1].replace(/,/g, ''))
      const annualRate = parseFloat(m[2])
      const years = parseInt(m[3], 10)
      if (
        !Number.isFinite(principal)
        || !Number.isFinite(annualRate)
        || !Number.isInteger(years)
        || principal <= 0
        || principal > 1_000_000_000_000
        || annualRate < 0
        || annualRate > 100
        || years < 1
        || years > 100
      ) return '(invalid values)'
      const n = years * 12
      const r = annualRate / 100 / 12
      const fmt = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      if (r === 0) {
        const monthly = principal / n
        return [`Principal:       $${fmt(principal)}`, `Rate:            0% (interest-free)`, `Term:            ${years} years (${n} payments)`, `Monthly payment: $${fmt(monthly)}`, `Total paid:      $${fmt(principal)}`].join('\n')
      }
      const monthly = principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
      const totalPaid = monthly * n
      const totalInterest = totalPaid - principal
      if (![monthly, totalPaid, totalInterest].every(Number.isFinite)) return '(invalid values)'
      // Amortization milestones
      let balance = principal
      let interestPaid = 0
      const milestones = []
      for (let i = 1; i <= n; i++) {
        const interest = balance * r
        const principalPaid = monthly - interest
        balance = Math.max(0, balance - principalPaid)
        interestPaid += interest
        if (i === 12 || i === 60 || i === 120 || i === 180 || i === 240 || i === n) {
          milestones.push(`  Year ${Math.ceil(i/12).toString().padStart(2)}: balance $${fmt(balance)}, interest paid $${fmt(interestPaid)}`)
        }
      }
      return [
        `Principal:        $${fmt(principal)}`,
        `Rate:             ${annualRate}% APR`,
        `Term:             ${years} years (${n} payments)`,
        '',
        `Monthly payment:  $${fmt(monthly)}`,
        `Total paid:       $${fmt(totalPaid)}`,
        `Total interest:   $${fmt(totalInterest)} (${((totalInterest / principal) * 100).toFixed(1)}% of principal)`,
        '',
        'Amortization milestones:',
        ...milestones,
      ].join('\n')
    },
  },
  {
    id: 'bmi-calc',
    name: 'BMI Calculator',
    category: 'utility',
    description: 'Calculate BMI from weight and height — format: "70kg 175cm" or "154lb 5ft 9in"',
    placeholder: '70kg 175cm',
    convert: (input) => {
      const s = input.trim()
      let kg, cm
      // metric: "70kg 175cm"
      const metric = s.match(/^([\d.]+)\s*kg\s+([\d.]+)\s*cm$/i)
      if (metric) { kg = parseFloat(metric[1]); cm = parseFloat(metric[2]) }
      // imperial: "154lb 5ft 9in" or "154lb 5'9""
      const imperial = s.match(/^([\d.]+)\s*lb\s+(\d+)\s*ft\s*(\d*)\s*in?/i) || s.match(/^([\d.]+)\s*lb\s+(\d+)'(\d*)"?/i)
      if (imperial) {
        kg = parseFloat(imperial[1]) * 0.453592
        const ft = parseInt(imperial[2], 10), inch = parseInt(imperial[3] || '0', 10)
        cm = (ft * 12 + inch) * 2.54
      }
      if (!kg || !cm) return '(format: "70kg 175cm" or "154lb 5ft 9in")'
      const m = cm / 100
      const bmi = kg / (m * m)
      const category = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal weight' : bmi < 30 ? 'Overweight' : 'Obese'
      const normalLow = Math.round(18.5 * m * m)
      const normalHigh = Math.round(24.9 * m * m)
      return [
        `Height: ${cm.toFixed(1)} cm  (${Math.floor(cm / 2.54 / 12)}ft ${Math.round((cm / 2.54) % 12)}in)`,
        `Weight: ${kg.toFixed(1)} kg  (${(kg / 0.453592).toFixed(1)} lb)`,
        '',
        `BMI:      ${bmi.toFixed(1)}`,
        `Category: ${category}`,
        '',
        `Healthy BMI range:  18.5 – 24.9`,
        `Healthy weight for your height: ${normalLow}–${normalHigh} kg`,
      ].join('\n')
    },
  },
  {
    id: 'password-entropy',
    name: 'Password Entropy',
    category: 'utility',
    description: 'Analyze password strength with entropy calculation and crack time estimate',
    placeholder: 'MySecureP@ss123!',
    convert: (input) => {
      if (!input) return '(enter a password to analyze)'
      const len = input.length
      let poolSize = 0
      const hasLower = /[a-z]/.test(input)
      const hasUpper = /[A-Z]/.test(input)
      const hasDigit = /[0-9]/.test(input)
      const hasSymbol = /[^a-zA-Z0-9]/.test(input)
      const hasExtended = [...input].some((char) => char.codePointAt(0) > 0x7F)
      if (hasLower) poolSize += 26
      if (hasUpper) poolSize += 26
      if (hasDigit) poolSize += 10
      if (hasSymbol) poolSize += 32
      if (hasExtended) poolSize += 128
      if (poolSize === 0) poolSize = 1
      const entropy = Math.log2(poolSize) * len
      const crackTimeSec = Math.pow(2, entropy) / 1e12 // ~1 trillion guesses/sec (GPU)
      function formatTime(sec) {
        if (sec < 1) return 'instantly'
        if (sec < 60) return `${sec.toFixed(0)} seconds`
        if (sec < 3600) return `${(sec / 60).toFixed(0)} minutes`
        if (sec < 86400) return `${(sec / 3600).toFixed(0)} hours`
        if (sec < 2592000) return `${(sec / 86400).toFixed(0)} days`
        if (sec < 31536000) return `${(sec / 2592000).toFixed(0)} months`
        if (sec < 3.154e9) return `${(sec / 31536000).toFixed(0)} years`
        if (sec < 3.154e12) return `${(sec / 31536000 / 1000).toFixed(0)}k years`
        if (sec < 3.154e15) return `${(sec / 31536000 / 1e6).toFixed(0)}M years`
        return 'centuries'
      }
      const strength = entropy < 28 ? 'Very Weak' : entropy < 36 ? 'Weak' : entropy < 60 ? 'Fair' : entropy < 128 ? 'Strong' : 'Very Strong'
      return [
        `Password:    ${'•'.repeat(Math.min(len, 20))} (${len} chars)`,
        `Entropy:     ${entropy.toFixed(1)} bits`,
        `Strength:    ${strength}`,
        `Crack time:  ${formatTime(crackTimeSec)} (at 10¹² guesses/sec)`,
        '',
        `Character set (pool: ${poolSize}):`,
        ...[hasLower && '  ✓ Lowercase (a-z)', hasUpper && '  ✓ Uppercase (A-Z)', hasDigit && '  ✓ Digits (0-9)', hasSymbol && '  ✓ Symbols (!@#...)', hasExtended && '  ✓ Extended (unicode)'].filter(Boolean),
        ...(!hasLower ? ['  ✗ Missing lowercase'] : []),
        ...(!hasUpper ? ['  ✗ Missing uppercase'] : []),
        ...(!hasDigit ? ['  ✗ Missing digits'] : []),
        ...(!hasSymbol ? ['  ✗ Missing symbols'] : []),
      ].join('\n')
    },
  },
  {
    id: 'tls-cert-info',
    name: 'PEM Certificate Info',
    category: 'utility',
    description: 'Decode basic info from a PEM certificate (base64 section only — no private key parsing)',
    placeholder: '-----BEGIN CERTIFICATE-----\nMIIBkTCB+wIJ...\n-----END CERTIFICATE-----',
    convert: (input) => {
      const pemMatch = input.match(/-----BEGIN CERTIFICATE-----\s*([\s\S]*?)\s*-----END CERTIFICATE-----/)
      if (!pemMatch) return '(paste a PEM certificate: -----BEGIN CERTIFICATE----- ... -----END CERTIFICATE-----)'
      try {
        const b64 = pemMatch[1].replace(/\s+/g, '')
        const binary = atob(b64)
        const bytes = new Uint8Array(binary.length).map((_, i) => binary.charCodeAt(i))
        // Basic DER parsing to extract readable strings
        const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(' ')
        // Extract visible ASCII strings from cert (common names, org, etc.)
        let strings = []
        let current = ''
        for (const b of bytes) {
          if (b >= 32 && b < 127) current += String.fromCharCode(b)
          else if (current.length >= 3) { strings.push(current); current = '' }
          else current = ''
        }
        if (current.length >= 3) strings.push(current)
        const interesting = strings.filter(s =>
          s.includes('.') || s.includes('=') || s.includes(',') ||
          /[A-Z]{2,}/.test(s) || s.length > 8
        ).filter(s => !/^[0-9.]+$/.test(s)).slice(0, 20)
        return [
          `Certificate size: ${bytes.length} bytes`,
          `Base64 length: ${b64.length} chars`,
          '',
          'Extracted strings (subject/issuer fields):',
          ...interesting.map(s => `  ${s}`),
          '',
          'Raw hex (first 32 bytes):',
          hex.split(' ').slice(0, 32).join(' '),
        ].join('\n')
      } catch (e) {
        return `(decode error: ${e.message})`
      }
    },
  },
  {
    id: 'xpath-tester',
    name: 'XPath Tester',
    category: 'utility',
    description: 'Evaluate XPath expression against XML — format: XPath on first line, then XML',
    placeholder: '//user/@name\n<root><user name="Alice"/><user name="Bob"/></root>',
    convert: (input) => {
      const newline = input.indexOf('\n')
      if (newline === -1) return '(first line: XPath expression, rest: XML)'
      const xpath = input.slice(0, newline).trim()
      const xml = input.slice(newline + 1).trim()
      if (!xml) return '(enter XML after the first line)'
      try {
        const parser = new DOMParser()
        const doc = parser.parseFromString(xml, 'text/xml')
        const err = doc.querySelector('parsererror')
        if (err) return `(XML parse error: ${err.textContent.slice(0, 100)})`
        const result = doc.evaluate(xpath, doc, null, XPathResult.ANY_TYPE, null)
        const items = []
        let node
        switch (result.resultType) {
          case XPathResult.NUMBER_TYPE:
            return `Result (number): ${result.numberValue}`
          case XPathResult.STRING_TYPE:
            return `Result (string): ${result.stringValue}`
          case XPathResult.BOOLEAN_TYPE:
            return `Result (boolean): ${result.booleanValue}`
          default:
            while ((node = result.iterateNext()) !== null) {
              if (node.nodeType === Node.ATTRIBUTE_NODE) items.push(`@${node.name}="${node.value}"`)
              else if (node.nodeType === Node.TEXT_NODE) items.push(`"${node.textContent}"`)
              else items.push(new XMLSerializer().serializeToString(node))
            }
        }
        if (items.length === 0) return `(no matches for: ${xpath})`
        return [`XPath: ${xpath}`, `Matches: ${items.length}`, '', ...items.map((s, i) => `[${i + 1}] ${s}`)].join('\n')
      } catch (e) {
        return `(error: ${e.message})`
      }
    },
  },
  {
    id: 'color-mix-ratio',
    name: 'Color Mix',
    category: 'utility',
    description: 'Mix two hex colors at a given ratio — format: #color1 #color2 ratio% (default 50%)',
    placeholder: '#ff0000 #0000ff 30%',
    convert: (input) => {
      const m = input.trim().match(/^(#[0-9a-f]{3,6})\s+(#[0-9a-f]{3,6})(?:\s+(\d+)%?)?$/i)
      if (!m) return '(format: #color1 #color2 ratio% — e.g. #ff0000 #0000ff 30%)'
      function hexToRgb(hex) {
        const h = hex.replace('#', '')
        if (h.length === 3) return [parseInt(h[0]+h[0], 16), parseInt(h[1]+h[1], 16), parseInt(h[2]+h[2], 16)]
        return [parseInt(h.slice(0,2), 16), parseInt(h.slice(2,4), 16), parseInt(h.slice(4,6), 16)]
      }
      const [, c1, c2, ratioStr] = m
      const ratio = (parseFloat(ratioStr) ?? 50) / 100
      const rgb1 = hexToRgb(c1), rgb2 = hexToRgb(c2)
      const steps = [0, 0.25, 0.5, 0.75, 1.0]
      const results = steps.map(t => {
        const r = rgb1.map((a, i) => Math.round(a + (rgb2[i] - a) * t))
        const hex = '#' + r.map(v => v.toString(16).padStart(2, '0')).join('')
        return `  ${(t * 100).toFixed(0).padStart(3)}% — ${hex}  rgb(${r.join(', ')})`
      })
      const mixed = rgb1.map((a, i) => Math.round(a + (rgb2[i] - a) * ratio))
      const mixedHex = '#' + mixed.map(v => v.toString(16).padStart(2, '0')).join('')
      return [
        `Color 1: ${c1}  rgb(${hexToRgb(c1).join(', ')})`,
        `Color 2: ${c2}  rgb(${hexToRgb(c2).join(', ')})`,
        '',
        `Mix at ${Math.round(ratio * 100)}%: ${mixedHex}  rgb(${mixed.join(', ')})`,
        '',
        'Gradient stops:',
        ...results,
      ].join('\n')
    },
  },
  {
    id: 'timezone-list',
    name: 'Timezone Converter',
    category: 'utility',
    description: 'Convert a time to multiple timezones at once — format: "2024-01-15 14:30 America/New_York" or just enter a timestamp',
    placeholder: '2024-01-15 14:30 America/New_York',
    convert: (input) => {
      const s = input.trim()
      let date
      // Try to parse with timezone
      const m = s.match(/^(.+?)\s+([A-Za-z_]+\/[A-Za-z_]+|UTC[+-]\d+|UTC)$/)
      if (m) {
        try { date = new Date(new Date(m[1]).toLocaleString('en-US', { timeZone: m[2] })) } catch { date = new Date(m[1]) }
        if (isNaN(date.getTime())) date = new Date(m[1])
      } else {
        date = new Date(s.replace(' ', 'T'))
        if (isNaN(date.getTime())) date = new Date(parseInt(s) * (s.length <= 10 ? 1000 : 1))
      }
      if (isNaN(date.getTime())) return '(invalid date — try "2024-01-15 14:30 America/New_York" or Unix timestamp)'
      const zones = [
        'America/Los_Angeles', 'America/Denver', 'America/Chicago', 'America/New_York',
        'America/Sao_Paulo', 'Europe/London', 'Europe/Paris', 'Europe/Istanbul',
        'Asia/Dubai', 'Asia/Kolkata', 'Asia/Bangkok', 'Asia/Singapore', 'Asia/Tokyo',
        'Australia/Sydney', 'Pacific/Auckland',
      ]
      const lines = [
        `UTC: ${date.toUTCString()}`,
        `ISO: ${date.toISOString()}`,
        '',
        'World times:',
      ]
      for (const tz of zones) {
        try {
          const label = tz.split('/')[1].replace('_', ' ').padEnd(16)
          const time = date.toLocaleString('en-US', { timeZone: tz, hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })
          lines.push(`  ${label} ${time}`)
        } catch { /* skip unsupported */ }
      }
      return lines.join('\n')
    },
  },
  {
    id: 'email-address-parse',
    name: 'Email Address Parser',
    category: 'utility',
    description: 'Parse and validate email addresses — one per line',
    placeholder: 'John Doe <john.doe+tag@example.com>\nuser@sub.domain.co.uk',
    convert: (input) => {
      const lines = input.trim().split('\n').filter(Boolean)
      if (lines.length === 0) return '(enter email addresses, one per line)'
      const RFC5322 = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return lines.map(line => {
        const trimmed = line.trim()
        // Try "Name <email>" format
        const namedMatch = trimmed.match(/^(.+?)\s*<([^>]+)>$/)
        let name = '', email = ''
        if (namedMatch) {
          name = namedMatch[1].trim().replace(/^["']|["']$/g, '')
          email = namedMatch[2].trim()
        } else {
          email = trimmed
        }
        const valid = RFC5322.test(email)
        if (!valid) return `✗ ${trimmed}\n  Invalid email format`
        const [local, domain] = email.split('@')
        const plusIdx = local.indexOf('+')
        const base = plusIdx >= 0 ? local.slice(0, plusIdx) : local
        const tag = plusIdx >= 0 ? local.slice(plusIdx + 1) : null
        const domainParts = domain.split('.')
        const tld = domainParts.slice(-1)[0]
        const subdomain = domainParts.length > 2 ? domainParts.slice(0, -2).join('.') : null
        return [
          `✓ ${email}`,
          `  Local:     ${local}`,
          ...(name ? [`  Name:      ${name}`] : []),
          ...(tag ? [`  Tag:       +${tag}  (base: ${base}@${domain})`] : []),
          `  Domain:    ${domain}`,
          ...(subdomain ? [`  Subdomain: ${subdomain}`] : []),
          `  TLD:       .${tld}`,
        ].join('\n')
      }).join('\n\n')
    },
  },
  {
    id: 'text-columns',
    name: 'Text Columns',
    category: 'utility',
    description: 'Extract, filter, or reorder columns from whitespace/tab-separated text',
    placeholder: 'alice  30  engineer\nbob    25  designer\ncarol  35  manager',
    convert: (input) => {
      if (!input.trim()) return ''
      const lines = input.trim().split('\n')
      const rows = lines.map(l => l.trim().split(/\s{2,}|\t/).map(c => c.trim()))
      const maxCols = Math.max(...rows.map(r => r.length))
      const widths = Array.from({ length: maxCols }, (_, i) => Math.max(...rows.map(r => (r[i] || '').length)))
      const formatted = rows.map(r => r.map((c, i) => c.padEnd(widths[i])).join('  ')).join('\n')
      const colInfo = widths.map((w, i) => `  Col ${i + 1}: max ${w} chars`).join('\n')
      return [
        `Rows: ${rows.length}  Columns: ${maxCols}`,
        '',
        colInfo,
        '',
        'Aligned:',
        formatted,
      ].join('\n')
    },
  },
  {
    id: 'compound-interest',
    name: 'Compound Interest',
    category: 'utility',
    description: 'Calculate compound interest — format: "principal rate% years [times/year]" e.g. "1000 5% 10" or "1000 5% 10 12"',
    placeholder: '1000 5% 10 12',
    convert: (input) => {
      const m = input.trim().match(/^([\d.]+)\s+([\d.]+)%?\s+(\d+)(?:\s+(\d+))?$/)
      if (!m) return '(format: principal rate% years [compounds-per-year, default=1])'
      const P = parseFloat(m[1])
      const r = parseFloat(m[2]) / 100
      const t = parseInt(m[3], 10)
      const n = parseInt(m[4] || '1', 10)
      if (P <= 0 || r <= 0 || t <= 0 || n <= 0) return '(all values must be positive)'
      const A = P * Math.pow(1 + r / n, n * t)
      const interest = A - P
      const effectiveRate = (Math.pow(1 + r / n, n) - 1) * 100
      const compoundingName = { 1: 'annually', 2: 'semi-annually', 4: 'quarterly', 12: 'monthly', 52: 'weekly', 365: 'daily' }[n] || `${n}× per year`
      const lines = [
        `Principal:       $${P.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `Rate:            ${(r * 100).toFixed(4).replace(/\.?0+$/, '')}% (${compoundingName})`,
        `Time:            ${t} years`,
        `Effective rate:  ${effectiveRate.toFixed(4).replace(/\.?0+$/, '')}% per year`,
        '',
        `Final amount:    $${A.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `Interest earned: $${interest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `Total return:    ${((A / P - 1) * 100).toFixed(2)}%`,
        '',
        'Milestones:',
      ]
      for (const yr of [1, 5, 10, 20, 30].filter(y => y <= t)) {
        const a = P * Math.pow(1 + r / n, n * yr)
        lines.push(`  Year ${String(yr).padStart(2)}: $${a.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`)
      }
      return lines.join('\n')
    },
  },
  {
    id: 'isbn-validate',
    name: 'ISBN Validator',
    category: 'utility',
    description: 'Validate and convert ISBN-10 and ISBN-13',
    placeholder: '978-0-13-468599-1',
    convert: (input) => {
      const clean = input.trim().replace(/[-\s]/g, '')
      const validISBN10 = (s) => {
        if (!/^\d{9}[\dX]$/.test(s)) return false
        let sum = 0
        for (let i = 0; i < 9; i++) sum += (i + 1) * parseInt(s[i], 10)
        const check = s[9] === 'X' ? 10 : parseInt(s[9], 10)
        return (sum + 10 * check) % 11 === 0
      }
      const validISBN13 = (s) => {
        if (!/^\d{13}$/.test(s)) return false
        let sum = 0
        for (let i = 0; i < 12; i++) sum += (i % 2 === 0 ? 1 : 3) * parseInt(s[i], 10)
        return (10 - sum % 10) % 10 === parseInt(s[12], 10)
      }
      const isbn10to13 = (s) => {
        const base = '978' + s.slice(0, 9)
        let sum = 0
        for (let i = 0; i < 12; i++) sum += (i % 2 === 0 ? 1 : 3) * parseInt(base[i], 10)
        const check = (10 - sum % 10) % 10
        return base + check
      }
      const isbn13to10 = (s) => {
        if (!s.startsWith('978')) return null
        const base = s.slice(3, 12)
        let sum = 0
        for (let i = 0; i < 9; i++) sum += (i + 1) * parseInt(base[i], 10)
        const rem = (11 - sum % 11) % 11
        return base + (rem === 10 ? 'X' : rem)
      }
      if (clean.length === 10) {
        const valid = validISBN10(clean.toUpperCase())
        const isbn13 = valid ? isbn10to13(clean.toUpperCase()) : null
        return [
          `ISBN-10: ${clean}`,
          `Valid: ${valid ? 'Yes' : 'No'}`,
          isbn13 ? `ISBN-13 equivalent: ${isbn13}` : '',
          isbn13 ? `Formatted: ${isbn13.replace(/(\d{3})(\d{1})(\d{5})(\d{3})(\d{1})/, '$1-$2-$3-$4-$5')}` : '',
        ].filter(Boolean).join('\n')
      }
      if (clean.length === 13) {
        const valid = validISBN13(clean)
        const isbn10 = valid ? isbn13to10(clean) : null
        return [
          `ISBN-13: ${clean}`,
          `Valid: ${valid ? 'Yes' : 'No'}`,
          isbn10 ? `ISBN-10 equivalent: ${isbn10}` : (clean.startsWith('978') ? '' : '(ISBN-10 only available for 978-prefix ISBNs)'),
          `Formatted: ${clean.replace(/(\d{3})(\d{1})(\d{5})(\d{3})(\d{1})/, '$1-$2-$3-$4-$5')}`,
        ].filter(Boolean).join('\n')
      }
      return `(invalid length: ${clean.length} digits — ISBN-10 or ISBN-13 expected)`
    },
  },
  {
    id: 'age-calc',
    name: 'Age Calculator',
    category: 'utility',
    description: 'Calculate age from a birthdate — enter date (YYYY-MM-DD or MM/DD/YYYY)',
    placeholder: '1990-05-15',
    convert: (input) => {
      const s = input.trim()
      let d = new Date(s)
      if (isNaN(d.getTime())) {
        const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
        if (m) d = new Date(`${m[3]}-${m[1].padStart(2,'0')}-${m[2].padStart(2,'0')}`)
      }
      if (isNaN(d.getTime())) return '(invalid date — use YYYY-MM-DD or MM/DD/YYYY)'
      const now = new Date()
      if (d > now) return '(date is in the future)'
      let years = now.getFullYear() - d.getFullYear()
      let months = now.getMonth() - d.getMonth()
      let days = now.getDate() - d.getDate()
      if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate() }
      if (months < 0) { years--; months += 12 }
      const totalDays = Math.floor((now - d) / 86400000)
      const totalWeeks = Math.floor(totalDays / 7)
      const nextBday = new Date(now.getFullYear(), d.getMonth(), d.getDate())
      if (nextBday < now) nextBday.setFullYear(now.getFullYear() + 1)
      const daysToNext = Math.floor((nextBday - now) / 86400000)
      const zodiac = (() => {
        const mo = d.getMonth() + 1, day = d.getDate()
        if ((mo === 3 && day >= 21) || (mo === 4 && day <= 19)) return 'Aries'
        if ((mo === 4 && day >= 20) || (mo === 5 && day <= 20)) return 'Taurus'
        if ((mo === 5 && day >= 21) || (mo === 6 && day <= 20)) return 'Gemini'
        if ((mo === 6 && day >= 21) || (mo === 7 && day <= 22)) return 'Cancer'
        if ((mo === 7 && day >= 23) || (mo === 8 && day <= 22)) return 'Leo'
        if ((mo === 8 && day >= 23) || (mo === 9 && day <= 22)) return 'Virgo'
        if ((mo === 9 && day >= 23) || (mo === 10 && day <= 22)) return 'Libra'
        if ((mo === 10 && day >= 23) || (mo === 11 && day <= 21)) return 'Scorpio'
        if ((mo === 11 && day >= 22) || (mo === 12 && day <= 21)) return 'Sagittarius'
        if ((mo === 12 && day >= 22) || (mo === 1 && day <= 19)) return 'Capricorn'
        if ((mo === 1 && day >= 20) || (mo === 2 && day <= 18)) return 'Aquarius'
        return 'Pisces'
      })()
      return [
        `Birthdate: ${d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
        '',
        `Age: ${years} years, ${months} months, ${days} days`,
        `    = ${totalWeeks.toLocaleString()} weeks`,
        `    = ${totalDays.toLocaleString()} days`,
        '',
        `Next birthday: in ${daysToNext} day${daysToNext === 1 ? '' : 's'}`,
        `Zodiac sign: ${zodiac}`,
        `Day of week born: ${d.toLocaleDateString('en-US', { weekday: 'long' })}`,
      ].join('\n')
    },
  },
  {
    id: 'tip-calc',
    name: 'Tip Calculator',
    category: 'utility',
    description: 'Calculate tip and split a bill — format: "amount tip% people" e.g. "85.50 20% 4"',
    placeholder: '85.50 20% 4',
    convert: (input) => {
      const m = input.trim().match(/^([\d.]+)\s+([\d.]+)%?\s*(\d+)?$/)
      if (!m) return '(format: amount tip% [people] — e.g. "85.50 20% 4")'
      const bill = parseFloat(m[1])
      const tipPct = parseFloat(m[2])
      const people = parseInt(m[3] || '1', 10)
      if (isNaN(bill) || bill <= 0) return '(invalid bill amount)'
      const tipAmt = bill * tipPct / 100
      const total = bill + tipAmt
      const perPerson = total / people
      const tipPerPerson = tipAmt / people
      const lines = [
        `Bill:        $${bill.toFixed(2)}`,
        `Tip (${tipPct}%): $${tipAmt.toFixed(2)}`,
        `Total:       $${total.toFixed(2)}`,
      ]
      if (people > 1) {
        lines.push(``, `Split ${people} ways:`)
        lines.push(`  Per person:  $${perPerson.toFixed(2)}`)
        lines.push(`  Tip each:    $${tipPerPerson.toFixed(2)}`)
        lines.push(`  Bill each:   $${(bill / people).toFixed(2)}`)
      }
      lines.push(``, 'Other tip amounts:')
      for (const pct of [15, 18, 20, 22, 25].filter(p => p !== tipPct)) {
        const t = bill * pct / 100
        const pp = (bill + t) / people
        lines.push(`  ${pct}%: $${(bill + t).toFixed(2)}${people > 1 ? ` ($${pp.toFixed(2)} each)` : ''}`)
      }
      return lines.join('\n')
    },
  },
  {
    id: 'aspect-ratio-exact',
    name: 'Aspect Ratio Finder',
    category: 'utility',
    description: 'Find exact and common aspect ratios for any dimensions — enter "width height"',
    placeholder: '1920 1080',
    convert: (input) => {
      const m = input.trim().match(/^(\d+)[x:×\s,]+(\d+)$/)
      if (!m) return '(enter dimensions as "width height" or "1920x1080")'
      const w = parseInt(m[1], 10), h = parseInt(m[2], 10)
      if (!w || !h) return '(dimensions must be positive)'
      const gcd = (a, b) => b === 0 ? a : gcd(b, a % b)
      const g = gcd(w, h)
      const rw = w / g, rh = h / g
      const decimal = w / h
      const commonRatios = [
        [1, 1], [4, 3], [3, 2], [5, 4], [16, 9], [16, 10], [21, 9], [32, 9],
        [2, 1], [3, 1], [4, 1], [5, 3], [9, 16], [2, 3], [3, 4]
      ]
      const closest = commonRatios.map(([a, b]) => ({
        ratio: `${a}:${b}`,
        diff: Math.abs(decimal - a / b)
      })).sort((a, b) => a.diff - b.diff)[0]
      const megapixels = (w * h / 1e6).toFixed(2)
      return [
        `Dimensions: ${w} × ${h}`,
        `Exact ratio: ${rw}:${rh}`,
        `Decimal: ${decimal.toFixed(6)}`,
        `Closest common: ${closest.ratio} (${(closest.diff * 100 / decimal).toFixed(2)}% off)`,
        `Megapixels: ${megapixels} MP`,
        '',
        `To maintain ${rw}:${rh} ratio:`,
        `  480p:  ${Math.round(480 * rw / rh)} × 480`,
        `  720p:  ${Math.round(720 * rw / rh)} × 720`,
        `  1080p: ${Math.round(1080 * rw / rh)} × 1080`,
        `  4K:    ${Math.round(2160 * rw / rh)} × 2160`,
      ].join('\n')
    },
  },
  {
    id: 'pace-calc',
    name: 'Running Pace Calculator',
    category: 'utility',
    description: 'Convert running pace and finish times — enter "time distance" e.g. "25:00 5km"',
    placeholder: '25:00 5km',
    convert: (input) => {
      const s = input.trim()
      const distMatch = s.match(/^(\d+:\d+(?::\d+)?)\s+([\d.]+)\s*(km|mi|miles|m)?$/i)
      const parseTime = (str) => {
        const parts = str.split(':').map(Number)
        return parts.length === 2 ? parts[0] * 60 + parts[1] : parts[0] * 3600 + parts[1] * 60 + parts[2]
      }
      const secToTime = (secs) => {
        const h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60), sc = Math.round(secs % 60)
        return h > 0 ? `${h}:${String(m).padStart(2,'0')}:${String(sc).padStart(2,'0')}` : `${m}:${String(sc).padStart(2,'0')}`
      }
      if (!distMatch) return '(format: "25:00 5km" or "1:45:30 21km" or "55:00 10mi")'
      const totalSecs = parseTime(distMatch[1])
      const dist = parseFloat(distMatch[2])
      const unit = (distMatch[3] || 'km').toLowerCase()
      const km = unit.startsWith('m') && !unit.startsWith('mi') ? dist / 1000 : unit.startsWith('mi') ? dist * 1.60934 : dist
      const paceKm = totalSecs / km
      const speedKmh = km / (totalSecs / 3600)
      return [
        `Time: ${secToTime(totalSecs)}  Distance: ${dist} ${unit} (${km.toFixed(2)} km)`,
        '',
        `Pace:  ${secToTime(Math.round(paceKm))}/km  |  ${secToTime(Math.round(paceKm * 1.60934))}/mile`,
        `Speed: ${speedKmh.toFixed(2)} km/h  |  ${(speedKmh / 1.60934).toFixed(2)} mph`,
        '',
        'Race finish times at this pace:',
        `  5K:        ${secToTime(Math.round(paceKm * 5))}`,
        `  10K:       ${secToTime(Math.round(paceKm * 10))}`,
        `  Half (21K): ${secToTime(Math.round(paceKm * 21.0975))}`,
        `  Full (42K): ${secToTime(Math.round(paceKm * 42.195))}`,
      ].join('\n')
    },
  },
  {
    id: 'ppi-calc',
    name: 'PPI / DPI Calculator',
    category: 'utility',
    description: 'Calculate screen pixels per inch — enter "width height diagonal" e.g. "1920 1080 15.6"',
    placeholder: '1920 1080 15.6',
    convert: (input) => {
      const parts = input.trim().split(/[\s,x×]+/).map(Number).filter(n => !isNaN(n) && n > 0)
      if (parts.length < 3) return '(enter: width height diagonal-in — e.g. "1920 1080 15.6")'
      const [w, h, diag] = parts
      const ppi = Math.sqrt(w * w + h * h) / diag
      const pixelMm = 25.4 / ppi
      const category = ppi < 96 ? 'Standard monitor' : ppi < 150 ? 'Good quality' : ppi < 220 ? 'High density' : ppi < 300 ? 'Retina-class' : 'Ultra HD'
      return [
        `Resolution: ${w} × ${h}  |  Screen: ${diag}"`,
        '',
        `PPI / DPI: ${ppi.toFixed(1)}`,
        `Pixel size: ${pixelMm.toFixed(3)} mm`,
        `Quality tier: ${category}`,
        '',
        `Physical size: ${(w / ppi).toFixed(2)}" × ${(h / ppi).toFixed(2)}"`,
        `              ${(w / ppi * 25.4).toFixed(0)} mm × ${(h / ppi * 25.4).toFixed(0)} mm`,
      ].join('\n')
    },
  },
  {
    id: 'levenshtein',
    name: 'String Edit Distance',
    category: 'utility',
    description: 'Levenshtein edit distance and similarity between two strings — one per line',
    placeholder: 'kitten\nsitting',
    convert: (input) => {
      const lines = input.split('\n').map(l => l.trim()).filter(Boolean)
      if (lines.length < 2) return '(enter two strings, one per line)'
      const a = lines[0], b = lines[1]
      const m = a.length, n = b.length
      const dp = Array.from({ length: m + 1 }, (_, i) =>
        Array.from({ length: n + 1 }, (_, j) => i === 0 ? j : j === 0 ? i : 0)
      )
      for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
          dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
        }
      }
      const dist = dp[m][n]
      const maxLen = Math.max(m, n)
      const similarity = maxLen === 0 ? 100 : ((maxLen - dist) / maxLen * 100)
      const shared = maxLen - dist
      return [
        `A: "${a}" (${m} chars)`,
        `B: "${b}" (${n} chars)`,
        '',
        `Edit distance: ${dist} operation${dist === 1 ? '' : 's'}`,
        `Similarity: ${similarity.toFixed(1)}%`,
        `Shared characters (approx): ${shared}`,
        '',
        dist === 0 ? 'Strings are identical.' :
        dist === 1 ? 'Strings differ by 1 edit (insert, delete, or substitute).' :
        `${dist} edits needed to transform A into B.`,
      ].filter(Boolean).join('\n')
    },
  },
  {
    id: 'discount-calc',
    name: 'Discount Calculator',
    category: 'utility',
    description: 'Calculate sale price from discount — enter "original discount%" e.g. "120 25%"',
    placeholder: '120 25%',
    convert: (input) => {
      const m = input.trim().match(/^([\d.]+)\s+([\d.]+)%?$/)
      if (!m) return '(format: original-price discount% — e.g. "120 25%")'
      const original = parseFloat(m[1])
      const discount = parseFloat(m[2])
      if (original <= 0) return '(price must be positive)'
      if (discount < 0 || discount > 100) return '(discount must be 0-100)'
      const saved = original * discount / 100
      const sale = original - saved
      const lines = [
        `Original: $${original.toFixed(2)}`,
        `Discount: ${discount}%`,
        `Saved:    $${saved.toFixed(2)}`,
        `Sale:     $${sale.toFixed(2)}`,
        '',
        'Other discounts:',
      ]
      for (const pct of [5, 10, 15, 20, 25, 30, 40, 50, 75].filter(p => Math.abs(p - discount) > 0.5)) {
        lines.push(`  ${String(pct).padStart(2)}%: $${(original * (1 - pct / 100)).toFixed(2)}`)
      }
      return lines.join('\n')
    },
  },
  {
    id: 'grade-calc',
    name: 'Grade / GPA Calculator',
    category: 'utility',
    description: 'Calculate GPA or grade — enter scores and weights, one per line: "score weight" or just scores',
    placeholder: '92 3\n85 4\n78 2',
    convert: (input) => {
      const lines = input.trim().split('\n').map(l => l.trim()).filter(Boolean)
      const entries = lines.map(line => {
        const parts = line.split(/[\s,]+/).map(Number)
        return { score: parts[0], weight: parts[1] || 1 }
      }).filter(e => !isNaN(e.score) && e.score >= 0 && e.score <= 100)
      if (entries.length === 0) return '(enter scores, one per line — optionally add weight: "92 3")'
      const totalWeight = entries.reduce((s, e) => s + e.weight, 0)
      const weighted = entries.reduce((s, e) => s + e.score * e.weight, 0) / totalWeight
      const toGrade = (score) => {
        if (score >= 97) return { letter: 'A+', gpa: 4.0 }
        if (score >= 93) return { letter: 'A', gpa: 4.0 }
        if (score >= 90) return { letter: 'A−', gpa: 3.7 }
        if (score >= 87) return { letter: 'B+', gpa: 3.3 }
        if (score >= 83) return { letter: 'B', gpa: 3.0 }
        if (score >= 80) return { letter: 'B−', gpa: 2.7 }
        if (score >= 77) return { letter: 'C+', gpa: 2.3 }
        if (score >= 73) return { letter: 'C', gpa: 2.0 }
        if (score >= 70) return { letter: 'C−', gpa: 1.7 }
        if (score >= 67) return { letter: 'D+', gpa: 1.3 }
        if (score >= 60) return { letter: 'D', gpa: 1.0 }
        return { letter: 'F', gpa: 0.0 }
      }
      const { letter, gpa } = toGrade(weighted)
      const gpaWeighted = entries.reduce((s, e) => s + toGrade(e.score).gpa * e.weight, 0) / totalWeight
      const lines2 = [
        `Entries: ${entries.length}`,
        '',
        `Weighted average: ${weighted.toFixed(2)}%  →  ${letter}  (${gpa.toFixed(1)} GPA points)`,
        `GPA (weighted): ${gpaWeighted.toFixed(2)} / 4.00`,
        '',
        'Breakdown:',
      ]
      for (const e of entries) {
        const g = toGrade(e.score)
        lines2.push(`  ${String(e.score).padStart(3)}% (×${e.weight}) → ${g.letter} (${g.gpa.toFixed(1)})`)
      }
      return lines2.join('\n')
    },
  },
  {
    id: 'fuel-cost',
    name: 'Fuel Cost Calculator',
    category: 'utility',
    description: 'Calculate fuel cost for a trip — enter "distance mpg price" e.g. "300 30 3.50" or "300km 10L/100km 1.80"',
    placeholder: '300 30 3.50',
    convert: (input) => {
      const s = input.trim()
      // km + L/100km + price/liter
      const kmMatch = s.match(/^([\d.]+)\s*km\s+([\d.]+)\s*(?:L\/100km|l100|l\/100)\s+([\d.]+)/i)
      if (kmMatch) {
        const dist = parseFloat(kmMatch[1])
        const l100 = parseFloat(kmMatch[2])
        const price = parseFloat(kmMatch[3])
        const liters = dist / 100 * l100
        const cost = liters * price
        return [
          `Distance: ${dist} km`,
          `Efficiency: ${l100} L/100km`,
          `Fuel price: $${price}/liter`,
          '',
          `Fuel needed: ${liters.toFixed(2)} liters`,
          `Total cost: $${cost.toFixed(2)}`,
          `Cost per km: $${(cost / dist).toFixed(3)}`,
        ].join('\n')
      }
      // miles + mpg + price/gallon
      const parts = s.split(/\s+/).map(Number)
      if (parts.length >= 3 && parts.every(p => !isNaN(p) && p > 0)) {
        const [dist, mpg, price] = parts
        const gallons = dist / mpg
        const cost = gallons * price
        const distKm = dist * 1.60934
        const lper100 = 235.215 / mpg
        return [
          `Distance: ${dist} miles (${distKm.toFixed(1)} km)`,
          `Efficiency: ${mpg} mpg (${lper100.toFixed(1)} L/100km)`,
          `Fuel price: $${price}/gallon`,
          '',
          `Fuel needed: ${gallons.toFixed(2)} gallons (${(gallons * 3.78541).toFixed(2)} liters)`,
          `Total cost: $${cost.toFixed(2)}`,
          `Cost per mile: $${(cost / dist).toFixed(3)}`,
          '',
          'Return trip: $' + (cost * 2).toFixed(2),
        ].join('\n')
      }
      return '(format: "300 30 3.50" = miles mpg price/gallon\n  or "300km 8.5 1.80" = km L/100km price/liter)'
    },
  },
  {
    id: 'recipe-scale',
    name: 'Recipe Scaler',
    category: 'utility',
    description: 'Scale recipe ingredients — first line: multiplier or "for N" or "half", rest: ingredients',
    placeholder: '2x\n2 cups flour\n1 tsp salt\n3 eggs\n1/2 cup butter',
    convert: (input) => {
      const lines = input.trim().split('\n')
      const cmd = lines[0].trim().toLowerCase()
      let factor = 1
      const halfMatch = cmd.match(/^half$/)
      const xMatch = cmd.match(/^([\d.]+)\s*x?$/)
      const forMatch = cmd.match(/^for\s+(\d+)/)
      if (halfMatch) factor = 0.5
      else if (xMatch) factor = parseFloat(xMatch[1])
      else if (forMatch) factor = parseFloat(forMatch[1])
      else return '(first line: multiplier like "2x", "0.5", "half", or "for 4")'
      const ingredients = lines.slice(1).filter(Boolean)
      if (ingredients.length === 0) return '(add ingredients after the multiplier line)'
      const fracs = { '1/2': 0.5, '1/3': 1/3, '2/3': 2/3, '1/4': 0.25, '3/4': 0.75, '1/8': 0.125, '3/8': 0.375, '5/8': 0.625, '7/8': 0.875 }
      const toFrac = (n) => {
        for (const [f, v] of Object.entries(fracs)) {
          if (Math.abs(n - v) < 0.01) return f
        }
        const rounded = Math.round(n * 8) / 8
        for (const [f, v] of Object.entries(fracs)) {
          if (Math.abs(rounded - v) < 0.001) return f
        }
        return n % 1 === 0 ? String(n) : n.toFixed(2).replace(/\.?0+$/, '')
      }
      const results = ingredients.map(line => {
        const m = line.match(/^([\d.]+(?:\/\d+)?)\s+(.+)$/)
        if (!m) return `  ${line} (× ${factor})`
        let qty = fracs[m[1]] ?? parseFloat(m[1])
        if (isNaN(qty)) return `  ${line}`
        const scaled = qty * factor
        const whole = Math.floor(scaled)
        const frac = scaled - whole
        let display = ''
        if (whole > 0 && frac > 0.01) display = `${whole} ${toFrac(frac)}`
        else if (whole > 0) display = String(whole)
        else display = toFrac(scaled)
        return `  ${display} ${m[2]}`
      })
      return [
        `Scale: ${factor}× (${factor < 1 ? 'reduced' : factor === 1 ? 'same' : 'enlarged'})`,
        '',
        ...results,
      ].join('\n')
    },
  },
  {
    id: 'paint-calc',
    name: 'Paint Coverage Calculator',
    category: 'utility',
    description: 'Calculate paint needed for a room — enter "width height length [coats] [coverage]" e.g. "12 9 15"',
    placeholder: '12 9 15',
    convert: (input) => {
      const parts = input.trim().split(/[\s,]+/).map(Number).filter(n => !isNaN(n) && n > 0)
      if (parts.length < 3) return '(enter: width height length [coats] [sqft/gallon] — in feet, e.g. "12 9 15" for 12ft wide, 15ft long, 9ft high room)'
      const [w, h, l, coats = 2, coveragePer = 400] = parts
      const wallArea = 2 * (w + l) * h
      const ceilingArea = w * l
      const doors = Math.max(1, Math.round((w + l) / 20)) // estimate 1 door per 20 ft of perimeter
      const windows = Math.max(2, Math.round((w + l) / 10)) // estimate windows
      const doorArea = doors * 21  // standard 3×7 door
      const windowArea = windows * 15  // average window
      const paintableWalls = wallArea - doorArea - windowArea
      const gallonsWalls = (paintableWalls * coats) / coveragePer
      const gallonsCeiling = ceilingArea / coveragePer
      return [
        `Room: ${w}' × ${l}'  |  Ceiling height: ${h}'`,
        '',
        `Wall area:    ${wallArea} sq ft`,
        `Ceiling:      ${ceilingArea} sq ft`,
        `Doors (~${doors}):   -${doorArea} sq ft`,
        `Windows (~${windows}): -${windowArea} sq ft`,
        `Net walls:    ${paintableWalls} sq ft`,
        '',
        `Coats: ${coats}  |  Coverage: ${coveragePer} sq ft/gallon`,
        '',
        `Walls: ${gallonsWalls.toFixed(2)} gallons (${Math.ceil(gallonsWalls)} gallon cans)`,
        `Ceiling: ${gallonsCeiling.toFixed(2)} gallons (${Math.ceil(gallonsCeiling)} gallon cans)`,
        `Total: ${(gallonsWalls + gallonsCeiling).toFixed(2)} gallons`,
      ].join('\n')
    },
  },
  {
    id: 'mortgage-calc',
    name: 'Mortgage Calculator',
    category: 'utility',
    description: 'Calculate monthly mortgage payment — enter "price downpayment% rate% years" e.g. "400000 20% 6.5% 30"',
    placeholder: '400000 20% 6.5% 30',
    convert: (input) => {
      const m = input.trim().match(/^([\d,]+)\s+([\d.]+)%?\s+([\d.]+)%?\s+(\d+)/)
      if (!m) return '(enter: price down% rate% years — e.g. "400000 20% 6.5% 30")'
      const price = parseFloat(m[1].replace(/,/g, ''))
      const down = parseFloat(m[2]) / 100
      const annualRate = parseFloat(m[3]) / 100
      const years = parseInt(m[4])
      const principal = price * (1 - down)
      const monthlyRate = annualRate / 12
      const n = years * 12
      const monthly = monthlyRate === 0
        ? principal / n
        : principal * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
      const totalPaid = monthly * n
      const totalInterest = totalPaid - principal
      const fmt = v => '$' + v.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      // Amortization milestones
      let bal = principal
      const milestones = []
      for (let mo = 1; mo <= n; mo++) {
        const interest = bal * monthlyRate
        const prinPayment = monthly - interest
        bal -= prinPayment
        if (mo % (n / 4 | 0) === 0 || mo === n) {
          milestones.push(`  Year ${(mo / 12).toFixed(1).padStart(5)}: Balance ${fmt(Math.max(0, bal))}`)
        }
      }
      return [
        `Home price:      ${fmt(price)}`,
        `Down payment:    ${fmt(price * down)} (${m[2]}%)`,
        `Loan amount:     ${fmt(principal)}`,
        `Rate:            ${m[3]}% annual`,
        `Term:            ${years} years (${n} payments)`,
        '',
        `Monthly payment: ${fmt(monthly)}`,
        `Total paid:      ${fmt(totalPaid)}`,
        `Total interest:  ${fmt(totalInterest)} (${(totalInterest / price * 100).toFixed(1)}% of price)`,
        '',
        'Balance milestones:',
        ...milestones,
      ].join('\n')
    },
  },
  {
    id: 'time-between',
    name: 'Time Between Dates',
    category: 'utility',
    description: 'Calculate days, weeks, months and years between two dates — enter "date1 to date2" e.g. "2020-01-01 to 2025-06-15"',
    placeholder: '2000-01-01 to 2026-02-19',
    convert: (input) => {
      const m = input.trim().match(/(.+?)\s+to\s+(.+)/i)
      if (!m) return '(enter: "start-date to end-date" — e.g. "2000-01-01 to 2026-02-19")'
      const d1 = new Date(m[1].trim()), d2 = new Date(m[2].trim())
      if (isNaN(d1) || isNaN(d2)) return '(invalid date — use YYYY-MM-DD format)'
      const [start, end] = d1 <= d2 ? [d1, d2] : [d2, d1]
      const diffMs = end - start
      const diffDays = Math.round(diffMs / 86400000)
      const diffWeeks = (diffDays / 7).toFixed(1)
      const diffMonths = ((end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth())
      const diffYears = end.getFullYear() - start.getFullYear()
      const fmt = d => d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      // Age-style breakdown
      let y = end.getFullYear() - start.getFullYear()
      let mo = end.getMonth() - start.getMonth()
      let dy = end.getDate() - start.getDate()
      if (dy < 0) { mo--; dy += new Date(end.getFullYear(), end.getMonth(), 0).getDate() }
      if (mo < 0) { y--; mo += 12 }
      return [
        `From: ${fmt(start)}`,
        `To:   ${fmt(end)}`,
        '',
        `= ${y > 0 ? y + ' year' + (y !== 1 ? 's' : '') + ', ' : ''}${mo > 0 ? mo + ' month' + (mo !== 1 ? 's' : '') + ', ' : ''}${dy} day${dy !== 1 ? 's' : ''}`,
        '',
        `Total days:   ${diffDays.toLocaleString()}`,
        `Total weeks:  ${diffWeeks}`,
        `Total months: ${diffMonths}`,
        `Total years:  ${diffYears} (approx)`,
        '',
        `Hours:   ${(diffDays * 24).toLocaleString()}`,
        `Minutes: ${(diffDays * 24 * 60).toLocaleString()}`,
      ].join('\n')
    },
  },
  {
    id: 'loan-amortization',
    name: 'Loan Amortization',
    category: 'utility',
    description: 'Detailed loan amortization schedule — enter "principal rate% years" e.g. "10000 5% 3"',
    placeholder: '10000 5% 3',
    convert: (input) => {
      const m = input.trim().match(/^([\d,]+)\s+([\d.]+)%?\s+(\d+)/)
      if (!m) return '(enter: principal rate% years — e.g. "10000 5% 3")'
      const principal = parseFloat(m[1].replace(/,/g, ''))
      const annualRate = parseFloat(m[2]) / 100
      const years = parseInt(m[3])
      const n = years * 12
      const r = annualRate / 12
      const payment = r === 0 ? principal / n : principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
      const fmt = v => '$' + v.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      let bal = principal, totalInterest = 0
      const rows = []
      for (let mo = 1; mo <= n; mo++) {
        const interestPmt = bal * r
        const principalPmt = payment - interestPmt
        bal -= principalPmt
        totalInterest += interestPmt
        if (mo <= 6 || mo === n || mo % 12 === 0) {
          rows.push(`  Month ${String(mo).padStart(3)}: pmt=${fmt(payment)}, principal=${fmt(principalPmt)}, interest=${fmt(interestPmt)}, balance=${fmt(Math.max(0, bal))}`)
          if (mo === 6 && n > 12) rows.push(`  ...`)
        }
      }
      return [
        `Loan: ${fmt(principal)} at ${m[2]}% for ${years} year${years !== 1 ? 's' : ''} (${n} payments)`,
        `Monthly payment: ${fmt(payment)}`,
        `Total paid: ${fmt(payment * n)}`,
        `Total interest: ${fmt(totalInterest)}`,
        '',
        'Amortization (selected months):',
        ...rows,
      ].join('\n')
    },
  },
  {
    id: 'calories-burned',
    name: 'Calories Burned Calculator',
    category: 'utility',
    description: 'Estimate calories burned during exercise — enter "activity weight duration" e.g. "running 70kg 30min" or "cycling 154lbs 45min"',
    placeholder: 'running 70kg 30min',
    convert: (input) => {
      const s = input.trim().toLowerCase()
      // MET values (Metabolic Equivalent of Task)
      const mets = {
        running: 9.8, jogging: 7.0, walking: 3.5, 'brisk walking': 4.5, hiking: 6.0,
        cycling: 7.5, swimming: 7.0, 'weight training': 5.0, yoga: 2.5, pilates: 3.0,
        rowing: 8.0, 'jump rope': 11.0, basketball: 8.0, soccer: 8.0, tennis: 7.0,
        dancing: 5.5, elliptical: 5.0, skiing: 7.0, climbing: 8.0, golf: 3.5,
      }
      // Parse weight
      let weightKg = 70
      const kgMatch = s.match(/([\d.]+)\s*kg/)
      const lbMatch = s.match(/([\d.]+)\s*lbs?/)
      if (kgMatch) weightKg = parseFloat(kgMatch[1])
      else if (lbMatch) weightKg = parseFloat(lbMatch[1]) * 0.453592
      // Parse duration
      let durationMin = 30
      const minMatch = s.match(/([\d.]+)\s*min/)
      const hrMatch = s.match(/([\d.]+)\s*h(?:r|ours?)?(?!\w)/)
      if (minMatch) durationMin = parseFloat(minMatch[1])
      else if (hrMatch) durationMin = parseFloat(hrMatch[1]) * 60
      // Find activity
      let activity = 'running', met = mets.running
      for (const [act, m] of Object.entries(mets)) {
        if (s.includes(act)) { activity = act; met = m; break }
      }
      const calories = met * weightKg * (durationMin / 60)
      const intensityLabel = met < 3 ? 'Light' : met < 6 ? 'Moderate' : met < 9 ? 'Vigorous' : 'Very Vigorous'
      return [
        `Activity: ${activity} (MET: ${met})`,
        `Weight:   ${weightKg.toFixed(1)} kg (${(weightKg * 2.20462).toFixed(1)} lbs)`,
        `Duration: ${durationMin} minutes`,
        `Intensity: ${intensityLabel}`,
        '',
        `Calories burned: ~${Math.round(calories)} kcal`,
        '',
        'Other activities for comparison:',
        ...Object.entries(mets).slice(0, 6).filter(([a]) => a !== activity).map(([a, m]) => `  ${a}: ~${Math.round(m * weightKg * durationMin / 60)} kcal`),
        '',
        `Available activities: ${Object.keys(mets).join(', ')}`,
      ].join('\n')
    },
  },
  {
    id: 'screen-size-calc',
    name: 'Screen Size Calculator',
    category: 'utility',
    description: 'Calculate screen dimensions from diagonal and aspect ratio — enter "diagonal aspect" e.g. "27 16:9" or "13.3 2560x1600"',
    placeholder: '27 16:9',
    convert: (input) => {
      const s = input.trim()
      if (!s) return '(enter: diagonal aspect — e.g. "27 16:9" or "27 1920x1080")'
      const diagMatch = s.match(/([\d.]+)/)
      if (!diagMatch) return '(enter diagonal size in inches)'
      const diag = parseFloat(diagMatch[1])
      let ratio = { w: 16, h: 9 }
      const ratioMatch = s.match(/(\d+)[:\s×x](\d+)/)
      if (ratioMatch) { ratio.w = parseInt(ratioMatch[1]); ratio.h = parseInt(ratioMatch[2]) }
      // If pixel resolution given (large numbers), compute PPI
      let ppi = null
      const pxMatch = s.match(/(\d{3,5})[x×](\d{3,5})/)
      if (pxMatch) {
        const pw = parseInt(pxMatch[1]), ph = parseInt(pxMatch[2])
        ratio.w = pw; ratio.h = ph
        ppi = Math.sqrt(pw * pw + ph * ph) / diag
      }
      const diagRatio = Math.sqrt(ratio.w * ratio.w + ratio.h * ratio.h)
      const w = diag * ratio.w / diagRatio
      const h = diag * ratio.h / diagRatio
      return [
        `Diagonal: ${diag}"`,
        `Aspect ratio: ${ratio.w}:${ratio.h}`,
        '',
        `Width:  ${w.toFixed(2)}" (${(w * 2.54).toFixed(1)} cm)`,
        `Height: ${h.toFixed(2)}" (${(h * 2.54).toFixed(1)} cm)`,
        `Area:   ${(w * h).toFixed(1)} in² (${(w * h * 6.4516).toFixed(0)} cm²)`,
        ppi ? `PPI:    ${ppi.toFixed(0)} pixels/inch` : '',
        '',
        'Common screen sizes:',
        '  24"  16:9 → 20.9" × 11.8"',
        '  27"  16:9 → 23.5" × 13.2"',
        '  32"  16:9 → 27.9" × 15.7"',
        '  13"  16:10 → 11.0" × 6.9"',
      ].filter(Boolean).join('\n')
    },
  },
  {
    id: 'water-intake',
    name: 'Water Intake Calculator',
    category: 'utility',
    description: 'Calculate daily water intake recommendation — enter "weight [activity]" e.g. "70kg active" or "154lbs sedentary"',
    placeholder: '70kg moderately active',
    convert: (input) => {
      const s = input.trim().toLowerCase()
      let weightKg = 70
      const kgM = s.match(/([\d.]+)\s*kg/)
      const lbM = s.match(/([\d.]+)\s*lbs?/)
      if (kgM) weightKg = parseFloat(kgM[1])
      else if (lbM) weightKg = parseFloat(lbM[1]) * 0.453592
      const activityMult = s.includes('very active') || s.includes('athlete') ? 1.4 :
        s.includes('active') ? 1.25 : s.includes('light') ? 1.1 : 1.0
      const baseML = weightKg * 33  // 33ml per kg base
      const totalML = baseML * activityMult
      const totalL = totalML / 1000
      const glassesML = 250, cups8oz = 237
      return [
        `Weight: ${weightKg.toFixed(1)} kg (${(weightKg * 2.20462).toFixed(1)} lbs)`,
        `Activity multiplier: ×${activityMult}`,
        '',
        `Daily water intake:`,
        `  ${totalL.toFixed(2)} liters`,
        `  ${(totalML / 1000 * 33.814).toFixed(1)} fluid ounces`,
        `  ~${Math.round(totalML / glassesML)} glasses (250ml each)`,
        `  ~${Math.round(totalML / cups8oz)} cups (8oz each)`,
        '',
        `Spread throughout the day:`,
        `  On waking:     1-2 glasses`,
        `  With each meal: 1-2 glasses`,
        `  During exercise: extra 0.5-1L/hour`,
        '',
        'Note: This is a general estimate. Climate, health conditions, and diet affect needs.',
      ].join('\n')
    },
  },
  {
    id: 'wind-chill',
    name: 'Wind Chill / Heat Index',
    category: 'utility',
    description: 'Calculate wind chill or heat index — enter "temp wind" e.g. "5C 20km/h" or "32F 10mph" or "30C 60%" for heat index',
    placeholder: '5C 20km/h',
    convert: (input) => {
      const s = input.trim().toLowerCase()
      // Parse temperature
      const cMatch = s.match(/([-\d.]+)\s*°?c(?!\w)/)
      const fMatch = s.match(/([-\d.]+)\s*°?f(?!\w)/)
      if (!cMatch && !fMatch) return '(enter: "5C 20km/h" for wind chill or "30C 60%" for heat index)'
      let tempC = cMatch ? parseFloat(cMatch[1]) : (parseFloat(fMatch[1]) - 32) * 5/9
      const tempF = tempC * 9/5 + 32
      // Parse humidity for heat index
      const humMatch = s.match(/([\d.]+)\s*%/)
      if (humMatch) {
        const H = parseFloat(humMatch[1])
        const T = tempF
        // Rothfusz heat index formula
        const HI = -42.379 + 2.04901523*T + 10.14333127*H - 0.22475541*T*H - 0.00683783*T*T -
          0.05481717*H*H + 0.00122874*T*T*H + 0.00085282*T*H*H - 0.00000199*T*T*H*H
        const hiC = (HI - 32) * 5/9
        const category = HI < 80 ? 'Caution' : HI < 90 ? 'Extreme Caution' : HI < 103 ? 'Danger' : 'Extreme Danger'
        return [
          `Temperature: ${tempC.toFixed(1)}°C (${tempF.toFixed(1)}°F)`,
          `Humidity: ${H}%`,
          '',
          `Heat Index: ${hiC.toFixed(1)}°C (${HI.toFixed(1)}°F)`,
          `Category: ${category}`,
          '',
          HI >= 90 ? '⚠ Heat illness risk is high — stay hydrated and avoid prolonged sun exposure.' : 'Take precautions in direct sunlight and with physical activity.',
        ].join('\n')
      }
      // Parse wind speed for wind chill
      const kmhMatch = s.match(/([\d.]+)\s*km\/?h/)
      const mphMatch = s.match(/([\d.]+)\s*mph/)
      const msMatch = s.match(/([\d.]+)\s*m\/?s(?!\w)/)
      let windKmh = 0
      if (kmhMatch) windKmh = parseFloat(kmhMatch[1])
      else if (mphMatch) windKmh = parseFloat(mphMatch[1]) * 1.60934
      else if (msMatch) windKmh = parseFloat(msMatch[1]) * 3.6
      else return '(enter wind speed like "20km/h" or "10mph" or humidity like "60%" for heat index)'
      if (tempC > 10) return '(wind chill is only meaningful below 10°C / 50°F — for higher temps, try heat index with "30C 60%")'
      if (windKmh < 5) return '(wind speed must be at least 5 km/h for wind chill calculation)'
      // Canadian wind chill formula
      const wc = 13.12 + 0.6215*tempC - 11.37*Math.pow(windKmh, 0.16) + 0.3965*tempC*Math.pow(windKmh, 0.16)
      const wcF = wc * 9/5 + 32
      const frostbiteTime = wc < -27 ? '< 30 min' : wc < -35 ? '< 10 min' : wc < -60 ? '< 2 min' : 'Low risk'
      return [
        `Temperature: ${tempC.toFixed(1)}°C (${tempF.toFixed(1)}°F)`,
        `Wind speed: ${windKmh.toFixed(1)} km/h (${(windKmh/1.60934).toFixed(1)} mph)`,
        '',
        `Wind chill: ${wc.toFixed(1)}°C (${wcF.toFixed(1)}°F)`,
        `Frostbite risk: ${frostbiteTime}`,
        '',
        `Feels ${Math.abs(wc - tempC).toFixed(1)}°C ${wc < tempC ? 'colder' : 'warmer'} than actual temperature`,
      ].join('\n')
    },
  },
  {
    id: 'retirement-calc',
    name: 'Retirement Savings Calculator',
    category: 'utility',
    description: 'Estimate retirement savings — enter "monthly-contribution years rate% [current-savings]" e.g. "500 30 7%"',
    placeholder: '500 30 7%',
    convert: (input) => {
      const m = input.trim().match(/^([\d,]+)\s+(\d+)\s+([\d.]+)%?(?:\s+([\d,]+))?/)
      if (!m) return '(enter: monthly-contribution years rate% [current-savings] — e.g. "500 30 7%")'
      const monthly = parseFloat(m[1].replace(/,/g, ''))
      const years = parseInt(m[2])
      const rate = parseFloat(m[3]) / 100
      const current = parseFloat((m[4] || '0').replace(/,/g, ''))
      const n = years * 12
      const r = rate / 12
      // Future value of current savings
      const fvCurrent = current * Math.pow(1 + r, n)
      // Future value of monthly contributions (annuity)
      const fvContrib = r > 0 ? monthly * (Math.pow(1 + r, n) - 1) / r : monthly * n
      const total = fvCurrent + fvContrib
      const totalContributed = monthly * n + current
      const totalGrowth = total - totalContributed
      const fmt = v => '$' + Math.round(v).toLocaleString()
      // Safe withdrawal rate (4% rule)
      const annualWithdraw = total * 0.04
      const monthlyWithdraw = annualWithdraw / 12
      // Milestones
      const milestones = []
      for (let y = 5; y <= years; y += 5) {
        const t = y * 12
        const mv = (current * Math.pow(1 + r, t)) + (r > 0 ? monthly * (Math.pow(1 + r, t) - 1) / r : monthly * t)
        milestones.push(`  Year ${String(y).padStart(2)}: ${fmt(mv)}`)
      }
      return [
        `Monthly contribution: ${fmt(monthly)}`,
        current > 0 ? `Current savings:      ${fmt(current)}` : '',
        `Annual return:        ${m[3]}%`,
        `Time horizon:         ${years} years`,
        '',
        `Final balance:        ${fmt(total)}`,
        `Total contributed:    ${fmt(totalContributed)}`,
        `Investment growth:    ${fmt(totalGrowth)} (${(totalGrowth/totalContributed*100).toFixed(0)}% return)`,
        '',
        `4% withdrawal rule:   ${fmt(annualWithdraw)}/year (${fmt(monthlyWithdraw)}/month)`,
        '',
        'Growth milestones:',
        ...milestones,
      ].filter(Boolean).join('\n')
    },
  },
  {
    id: 'tax-bracket',
    name: 'US Tax Bracket Calculator',
    category: 'utility',
    description: 'Estimate US federal income tax — enter gross income e.g. "75000" or "75000 married"',
    placeholder: '75000',
    convert: (input) => {
      const s = input.trim()
      const incomeMatch = s.match(/([\d,]+)/)
      if (!incomeMatch) return '(enter gross income — e.g. "75000" or "75000 married")'
      const income = parseFloat(incomeMatch[1].replace(/,/g, ''))
      const isMarried = /married|joint|mfj/i.test(s)
      // 2024 US Federal Tax Brackets
      const singleBrackets = [
        [11600, 0.10], [47150, 0.12], [100525, 0.22], [191950, 0.24],
        [243725, 0.32], [609350, 0.35], [Infinity, 0.37],
      ]
      const marriedBrackets = [
        [23200, 0.10], [94300, 0.12], [201050, 0.22], [383900, 0.24],
        [487450, 0.32], [731200, 0.35], [Infinity, 0.37],
      ]
      const standardDeduction = isMarried ? 29200 : 14600
      const brackets = isMarried ? marriedBrackets : singleBrackets
      const taxable = Math.max(0, income - standardDeduction)
      let tax = 0, prev = 0
      const breakdown = []
      for (const [limit, rate] of brackets) {
        if (taxable <= prev) break
        const amount = Math.min(taxable, limit) - prev
        const portion = amount * rate
        tax += portion
        breakdown.push(`  ${(rate * 100).toFixed(0)}%: ${Math.round(amount).toLocaleString()} → $${Math.round(portion).toLocaleString()}`)
        prev = limit
      }
      const effectiveRate = tax / income * 100
      const marginalRate = brackets.find(([l]) => taxable <= l)?.[1] || 0.37
      const fmt = v => '$' + Math.round(v).toLocaleString()
      return [
        `Filing status: ${isMarried ? 'Married Filing Jointly' : 'Single'}`,
        `Gross income: ${fmt(income)}`,
        `Standard deduction: ${fmt(standardDeduction)}`,
        `Taxable income: ${fmt(taxable)}`,
        '',
        'Tax by bracket:',
        ...breakdown,
        '',
        `Federal income tax: ${fmt(tax)}`,
        `Effective tax rate: ${effectiveRate.toFixed(1)}%`,
        `Marginal tax rate: ${(marginalRate * 100).toFixed(0)}%`,
        `After-tax income: ${fmt(income - tax)}`,
        '',
        '(Estimate only — does not include FICA, state taxes, credits, or deductions)',
      ].join('\n')
    },
  },
  {
    id: 'speed-distance-time',
    name: 'Speed / Distance / Time',
    category: 'utility',
    description: 'Solve for speed, distance, or time — enter two known values e.g. "120km 1.5h" or "60mph 2h" or "100km 80kph"',
    placeholder: '120km 1.5h',
    convert: (input) => {
      const s = input.trim().toLowerCase()
      // Parse each value type
      const distKm = (() => {
        const m = s.match(/([\d.]+)\s*km(?!\w|ph)/)
        if (m) return parseFloat(m[1])
        const mi = s.match(/([\d.]+)\s*mi(?:les?)?(?!\w|ph)/)
        if (mi) return parseFloat(mi[1]) * 1.60934
        const m2 = s.match(/([\d.]+)\s*m(?:eters?)?(?!\w|ph|i|s|k)/)
        if (m2) return parseFloat(m2[1]) / 1000
        return null
      })()
      const timeHr = (() => {
        const h = s.match(/([\d.]+)\s*h(?:r|ours?)?(?!\w)/)
        const min = s.match(/([\d.]+)\s*min(?:utes?)?/)
        const sec = s.match(/([\d.]+)\s*s(?:ec(?:onds?)?)?(?!\w)/)
        if (h || min || sec) return (parseFloat(h?.[1] || 0) + parseFloat(min?.[1] || 0)/60 + parseFloat(sec?.[1] || 0)/3600)
        return null
      })()
      const speedKph = (() => {
        const kph = s.match(/([\d.]+)\s*k(?:m\/?h|ph)/)
        if (kph) return parseFloat(kph[1])
        const mph = s.match(/([\d.]+)\s*mph/)
        if (mph) return parseFloat(mph[1]) * 1.60934
        const ms = s.match(/([\d.]+)\s*m\/s/)
        if (ms) return parseFloat(ms[1]) * 3.6
        return null
      })()
      const known = [distKm !== null, timeHr !== null, speedKph !== null].filter(Boolean).length
      if (known < 2) return '(enter two values — e.g. "120km 1.5h" or "60mph 2h" or "200km 80kph")'
      let solveFor, resultKm, resultHr, resultKph
      if (distKm === null) {
        resultKm = speedKph * timeHr
        solveFor = 'distance'
      } else if (timeHr === null) {
        resultHr = distKm / speedKph
        solveFor = 'time'
      } else {
        resultKph = distKm / timeHr
        solveFor = 'speed'
      }
      const fmtTime = h => {
        const hrs = Math.floor(h), mins = Math.round((h - hrs) * 60)
        return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`
      }
      const d = resultKm || distKm, t = resultHr || timeHr, sp = resultKph || speedKph
      return [
        solveFor === 'distance' ? `Solving for: Distance` : solveFor === 'time' ? `Solving for: Time` : `Solving for: Speed`,
        '',
        `Distance: ${d.toFixed(2)} km (${(d/1.60934).toFixed(2)} miles)`,
        `Time:     ${fmtTime(t)} (${t.toFixed(4)} hours)`,
        `Speed:    ${sp.toFixed(2)} km/h (${(sp/1.60934).toFixed(2)} mph, ${(sp/3.6).toFixed(2)} m/s)`,
        '',
        solveFor === 'distance' ? `Result: ${d.toFixed(2)} km = ${(d*1000).toFixed(0)} m = ${(d/1.60934).toFixed(2)} miles` :
        solveFor === 'time' ? `Result: ${fmtTime(t)} (${(t*60).toFixed(1)} min = ${(t*3600).toFixed(0)} sec)` :
        `Result: ${sp.toFixed(2)} km/h = ${(sp/1.60934).toFixed(2)} mph`,
      ].join('\n')
    },
  },
  {
    id: 'ohms-law',
    name: "Ohm's Law Calculator",
    category: 'utility',
    description: "Solve V=IR — enter two values e.g. \"12V 2A\" or \"120V 60W\" or \"10Ω 2A\"",
    placeholder: '12V 2A',
    convert: (input) => {
      const s = input.trim().toLowerCase().replace(/\s+/g, '')
      const vMatch = s.match(/([\d.]+)v/)
      const iMatch = s.match(/([\d.]+)(?:a|amps?)/)
      const rMatch = s.match(/([\d.]+)(?:ω|ohms?)/)
      const pMatch = s.match(/([\d.]+)w/)
      const V = vMatch ? parseFloat(vMatch[1]) : null
      const I = iMatch ? parseFloat(iMatch[1]) : null
      const R = rMatch ? parseFloat(rMatch[1]) : null
      const P = pMatch ? parseFloat(pMatch[1]) : null
      // Solve with 2 known values
      let v = V, i = I, r = R, p = P
      if (v && i) { r = v/i; p = v*i }
      else if (v && r) { i = v/r; p = v*v/r }
      else if (v && p) { i = p/v; r = v*v/p }
      else if (i && r) { v = i*r; p = i*i*r }
      else if (i && p) { v = p/i; r = p/(i*i) }
      else if (r && p) { v = Math.sqrt(p*r); i = Math.sqrt(p/r) }
      else return '(enter two values — e.g. "12V 2A" or "120V 60W" or "10Ω 2A")'
      const fmt = (n, unit) => n !== null && !isNaN(n) ? `${parseFloat(n.toFixed(4))} ${unit}` : '?'
      return [
        `Voltage (V):     ${fmt(v, 'V')}`,
        `Current (I):     ${fmt(i, 'A')}`,
        `Resistance (R):  ${fmt(r, 'Ω')}`,
        `Power (P):       ${fmt(p, 'W')}`,
        '',
        `Formulas used:`,
        `  V = I × R = ${fmt(i,'A')} × ${fmt(r,'Ω')} = ${fmt(v,'V')}`,
        `  P = V × I = ${fmt(v,'V')} × ${fmt(i,'A')} = ${fmt(p,'W')}`,
        `  P = I²× R = ${fmt(i,'A')}² × ${fmt(r,'Ω')} = ${fmt(p,'W')}`,
        `  P = V²/ R = ${fmt(v,'V')}² / ${fmt(r,'Ω')} = ${fmt(p,'W')}`,
      ].join('\n')
    },
  },
  {
    id: 'number-system-table',
    name: 'Number Systems Reference',
    category: 'utility',
    description: 'Show a number in all systems (binary, octal, decimal, hex) — enter any number in any base',
    placeholder: '255',
    convert: (input) => {
      const s = input.trim()
      if (!s) return '(enter a number: decimal "255", hex "0xFF", binary "0b11111111", or octal "0o377")'
      let n
      if (/^0x/i.test(s)) n = parseInt(s, 16)
      else if (/^0b/i.test(s)) n = parseInt(s.slice(2), 2)
      else if (/^0o/i.test(s)) n = parseInt(s.slice(2), 8)
      else if (/^[01]+$/i.test(s) && s.length > 4) n = parseInt(s, 2) // assume binary if only 0s and 1s
      else n = parseInt(s, 10)
      if (isNaN(n) || n < 0) return '(enter a non-negative integer in any base)'
      if (n > 2**32) return '(number too large — max 2³²)'
      const bin = n.toString(2)
      const oct = n.toString(8)
      const hex = n.toString(16).toUpperCase()
      const grouped = bin.replace(/(\d{4})(?=\d)/g, '$1 ')
      const byteCount = Math.ceil(bin.length / 8)
      return [
        `Decimal:     ${n.toLocaleString()}`,
        `Hexadecimal: 0x${hex}  (${hex.replace(/(\w{2})(?=\w)/g, '$1 ')})`,
        `Octal:       0o${oct}`,
        `Binary:      0b${bin}`,
        `             ${grouped}`,
        '',
        `Bit width:   ${bin.length} bits (${byteCount} byte${byteCount !== 1 ? 's' : ''})`,
        `Signed:      ${n <= 0x7FFFFFFF ? n : n - 0x100000000} (32-bit signed)`,
        '',
        'ASCII:       ' + (n >= 32 && n <= 126 ? `'${String.fromCharCode(n)}'` : n < 32 ? '(control char)' : '(non-ASCII)'),
        `Unicode:     U+${hex.padStart(4, '0')} ${n <= 0x10FFFF ? `'${String.fromCharCode(n)}'` : '(out of range)'}`,
      ].join('\n')
    },
  },
  {
    id: 'body-fat-calc',
    name: 'Body Fat Calculator',
    description: 'Estimate body fat % using Navy method. Enter: weight(kg) height(cm) waist(cm) neck(cm) [hip(cm) for female]. Add "female" for women.',
    category: 'utility',
    convert: (input) => {
      const parts = input.trim().split(/\s+/)
      const female = input.toLowerCase().includes('female')
      const nums = parts.filter(p => /^\d+\.?\d*$/.test(p)).map(Number)
      if (nums.length < 4) return '(enter: weight(kg) height(cm) waist(cm) neck(cm) [hip for female])'
      const [weight, height, waist, neck, hip] = nums
      if (female && !hip) return '(female calculation requires hip measurement)'
      let bf
      if (female && hip) {
        bf = 163.205 * Math.log10(waist + hip - neck) - 97.684 * Math.log10(height) - 78.387
      } else {
        bf = 86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76
      }
      bf = Math.max(0, Math.min(70, bf))
      const leanMass = weight * (1 - bf / 100)
      const fatMass = weight * bf / 100
      const gender = female ? 'Female' : 'Male'
      const category = female
        ? (bf < 14 ? 'Essential' : bf < 21 ? 'Athletic' : bf < 25 ? 'Fitness' : bf < 32 ? 'Acceptable' : 'Obese')
        : (bf < 6 ? 'Essential' : bf < 14 ? 'Athletic' : bf < 18 ? 'Fitness' : bf < 25 ? 'Acceptable' : 'Obese')
      return [
        `Body Fat:    ${bf.toFixed(1)}% (${category})`,
        `Lean Mass:   ${leanMass.toFixed(1)} kg`,
        `Fat Mass:    ${fatMass.toFixed(1)} kg`,
        '',
        `Method: US Navy (${gender})`,
        `Reference ranges (${gender}):`,
        female
          ? '  Essential: <14% | Athletic: 14–20% | Fitness: 21–24%\n  Acceptable: 25–31% | Obese: >31%'
          : '  Essential: <6%  | Athletic: 6–13%  | Fitness: 14–17%\n  Acceptable: 18–24% | Obese: >25%',
      ].join('\n')
    },
  },
  {
    id: 'electricity-cost',
    name: 'Electricity Cost',
    description: 'Calculate electricity cost. Enter: watts hours [days] [rate-per-kwh]. Default: 1 day, $0.13/kWh.',
    category: 'utility',
    convert: (input) => {
      const parts = input.trim().split(/\s+/).map(Number).filter(n => !isNaN(n))
      if (parts.length < 2) return '(enter: watts hours [days] [rate-per-kwh])'
      const [watts, hours, days = 1, rate = 0.13] = parts
      const kwhPerDay = (watts * hours) / 1000
      const kwhTotal = kwhPerDay * days
      const costTotal = kwhTotal * rate
      const costMonth = kwhPerDay * 30 * rate
      const costYear = kwhPerDay * 365 * rate
      return [
        `Power:         ${watts} W`,
        `Usage:         ${hours} hrs/day × ${days} day${days !== 1 ? 's' : ''}`,
        `Rate:          $${rate.toFixed(4)}/kWh`,
        '',
        `Energy/day:    ${kwhPerDay.toFixed(4)} kWh`,
        `Total energy:  ${kwhTotal.toFixed(4)} kWh`,
        '',
        `Cost (${days} day${days !== 1 ? 's' : ''}):  $${costTotal.toFixed(4)}`,
        `Cost/month:    $${costMonth.toFixed(2)} (30 days)`,
        `Cost/year:     $${costYear.toFixed(2)} (365 days)`,
        '',
        `Annual CO₂:    ~${(kwhPerDay * 365 * 0.386).toFixed(1)} kg (US avg grid)`,
      ].join('\n')
    },
  },
  {
    id: 'ideal-weight',
    name: 'Ideal Weight',
    description: 'Calculate ideal weight using multiple formulas. Enter: height in cm (or feet\'inches like 5\'10). Add "female" for women.',
    category: 'utility',
    convert: (input) => {
      const female = input.toLowerCase().includes('female')
      let heightCm
      const feetMatch = input.match(/(\d+)'(\d+)/)
      if (feetMatch) {
        heightCm = parseInt(feetMatch[1]) * 30.48 + parseInt(feetMatch[2]) * 2.54
      } else {
        const num = parseFloat(input.replace(/[^\d.]/g, ''))
        if (isNaN(num)) return '(enter height in cm or feet\'inches, e.g. 175 or 5\'9)'
        heightCm = num > 10 ? num : num * 100 // assume meters if < 10
      }
      const heightIn = heightCm / 2.54
      const inchesOver5ft = heightIn - 60
      // Formulas
      const devine = female
        ? 45.5 + 2.3 * inchesOver5ft
        : 50 + 2.3 * inchesOver5ft
      const robinson = female
        ? 49 + 1.7 * inchesOver5ft
        : 52 + 1.9 * inchesOver5ft
      const miller = female
        ? 53.1 + 1.36 * inchesOver5ft
        : 56.2 + 1.41 * inchesOver5ft
      const hamwi = female
        ? 45.5 + 2.2 * inchesOver5ft
        : 48 + 2.7 * inchesOver5ft
      const avg = (devine + robinson + miller + hamwi) / 4
      const bmiLow = 18.5 * (heightCm / 100) ** 2
      const bmiHigh = 24.9 * (heightCm / 100) ** 2
      const toRange = (kg) => `${kg.toFixed(1)} kg (${(kg * 2.20462).toFixed(1)} lbs)`
      return [
        `Height: ${heightCm.toFixed(1)} cm (${Math.floor(heightIn / 12)}'${Math.round(heightIn % 12)}")`,
        `Gender: ${female ? 'Female' : 'Male'}`,
        '',
        `Devine formula:   ${toRange(devine)}`,
        `Robinson formula: ${toRange(robinson)}`,
        `Miller formula:   ${toRange(miller)}`,
        `Hamwi formula:    ${toRange(hamwi)}`,
        `Average:          ${toRange(avg)}`,
        '',
        `Healthy BMI range: ${bmiLow.toFixed(1)}–${bmiHigh.toFixed(1)} kg`,
        `                   (${(bmiLow * 2.20462).toFixed(1)}–${(bmiHigh * 2.20462).toFixed(1)} lbs)`,
      ].join('\n')
    },
  },
  {
    id: 'blood-pressure',
    name: 'Blood Pressure Classifier',
    description: 'Classify blood pressure reading. Enter systolic/diastolic like "120/80" or separate "120 80".',
    category: 'utility',
    convert: (input) => {
      const m = input.match(/(\d+)\s*[/\s]\s*(\d+)/)
      if (!m) return '(enter blood pressure as systolic/diastolic, e.g. 120/80)'
      const sys = parseInt(m[1])
      const dia = parseInt(m[2])
      if (sys < 50 || sys > 300 || dia < 30 || dia > 200) return '(values out of realistic range)'
      const pp = sys - dia // pulse pressure
      const map = Math.round(dia + pp / 3) // mean arterial pressure
      let category, desc, advice
      if (sys < 90 || dia < 60) {
        category = 'Low (Hypotension)'; desc = 'Below normal'
        advice = 'May cause dizziness. Consult doctor if symptomatic.'
      } else if (sys < 120 && dia < 80) {
        category = 'Normal'; desc = 'Optimal blood pressure'
        advice = 'Maintain healthy lifestyle.'
      } else if (sys < 130 && dia < 80) {
        category = 'Elevated'; desc = 'Slightly above normal'
        advice = 'Lifestyle changes recommended. Monitor regularly.'
      } else if (sys < 140 || dia < 90) {
        category = 'High — Stage 1 Hypertension'; desc = 'Mildly high'
        advice = 'Consult doctor. Lifestyle changes and possible medication.'
      } else if (sys < 180 || dia < 120) {
        category = 'High — Stage 2 Hypertension'; desc = 'Significantly high'
        advice = 'Medical treatment required. See a doctor soon.'
      } else {
        category = 'Hypertensive Crisis'; desc = 'Dangerously high'
        advice = 'SEEK EMERGENCY CARE IMMEDIATELY.'
      }
      return [
        `Reading:        ${sys}/${dia} mmHg`,
        `Category:       ${category}`,
        `Description:    ${desc}`,
        '',
        `Pulse Pressure: ${pp} mmHg (normal: 40–60)`,
        `Mean Arterial:  ${map} mmHg (normal: 70–100)`,
        '',
        `Advice: ${advice}`,
        '',
        'Reference (AHA 2017):',
        '  Normal:      <120/80',
        '  Elevated:    120–129/<80',
        '  HTN Stage 1: 130–139 or 80–89',
        '  HTN Stage 2: ≥140 or ≥90',
        '  Crisis:      >180 and/or >120',
      ].join('\n')
    },
  },
  {
    id: 'unit-price-compare',
    name: 'Unit Price Comparison',
    description: 'Compare prices per unit. One item per line: "name quantity unit price" e.g. "Large 500 g 3.99"',
    category: 'utility',
    convert: (input) => {
      const lines = input.trim().split('\n').filter(l => l.trim())
      if (lines.length === 0) return '(enter items, one per line: Name Quantity Unit Price)'
      const items = []
      for (const line of lines) {
        const parts = line.trim().split(/\s+/)
        if (parts.length < 3) continue
        const price = parseFloat(parts[parts.length - 1])
        const qty = parseFloat(parts[parts.length - 3])
        const unit = parts[parts.length - 2]
        const name = parts.slice(0, parts.length - 3).join(' ') || `Item ${items.length + 1}`
        if (!isNaN(price) && !isNaN(qty) && qty > 0) {
          items.push({ name, qty, unit, price, perUnit: price / qty })
        }
      }
      if (items.length === 0) return '(enter: Name Quantity Unit Price, e.g. "Large 500 g 3.99")'
      items.sort((a, b) => a.perUnit - b.perUnit)
      const best = items[0]
      const maxNameLen = Math.max(...items.map(i => i.name.length))
      const rows = items.map((item, idx) => {
        const marker = idx === 0 ? ' ← BEST' : idx === items.length - 1 ? ' (most expensive)' : ''
        const savings = idx > 0 ? ` (${((item.perUnit - best.perUnit) / best.perUnit * 100).toFixed(1)}% more)` : ''
        return `${item.name.padEnd(maxNameLen)}  ${item.qty} ${item.unit} for $${item.price.toFixed(2)}  →  $${item.perUnit.toFixed(4)}/${item.unit}${marker}${savings}`
      })
      return rows.join('\n')
    },
  },
  {
    id: 'inflation-calc',
    name: 'Inflation Calculator',
    description: 'Calculate inflation-adjusted value. Enter: amount year1 year2 [inflation-rate%]. Uses US CPI data for 1913-2024 or custom rate.',
    category: 'utility',
    convert: (input) => {
      const parts = input.trim().split(/\s+/).map(Number)
      if (parts.length < 3) return '(enter: amount startYear endYear [annualRate%])'
      const [amount, year1, year2, customRate] = parts
      if (isNaN(amount) || isNaN(year1) || isNaN(year2)) return '(invalid input)'
      // US CPI index values (approximate, base 1984=100)
      const cpi = {
        1913:9.9,1920:20.0,1925:17.5,1930:16.7,1935:13.7,1940:14.0,1945:18.0,
        1950:24.1,1955:26.8,1960:29.6,1965:31.5,1970:38.8,1975:53.8,1980:82.4,
        1985:107.6,1990:130.7,1995:152.4,2000:172.2,2005:195.3,2010:218.1,
        2015:237.0,2016:240.0,2017:245.1,2018:251.1,2019:255.7,2020:258.8,
        2021:270.0,2022:292.7,2023:304.7,2024:314.2,
      }
      let adjusted
      if (customRate) {
        const rate = customRate / 100
        const years = year2 - year1
        adjusted = amount * Math.pow(1 + rate, years)
      } else {
        // Interpolate CPI
        const getCPI = (yr) => {
          if (cpi[yr]) return cpi[yr]
          const keys = Object.keys(cpi).map(Number).sort((a, b) => a - b)
          const lo = keys.filter(k => k <= yr).pop()
          const hi = keys.filter(k => k >= yr).shift()
          if (!lo || !hi) return null
          if (lo === hi) return cpi[lo]
          const t = (yr - lo) / (hi - lo)
          return cpi[lo] + t * (cpi[hi] - cpi[lo])
        }
        const cpi1 = getCPI(year1), cpi2 = getCPI(year2)
        if (!cpi1 || !cpi2) return '(year out of range 1913–2024; or provide custom rate%)'
        adjusted = amount * (cpi2 / cpi1)
      }
      const change = adjusted - amount
      const pctChange = (change / amount) * 100
      const years = Math.abs(year2 - year1)
      const annualRate = (Math.pow(adjusted / amount, 1 / years) - 1) * 100
      return [
        `$${amount.toFixed(2)} in ${year1}`,
        `= $${adjusted.toFixed(2)} in ${year2}`,
        '',
        `Change: ${change >= 0 ? '+' : ''}$${change.toFixed(2)} (${pctChange >= 0 ? '+' : ''}${pctChange.toFixed(1)}%)`,
        `Avg annual rate: ${annualRate.toFixed(2)}%/year`,
        '',
        year2 > year1
          ? `Purchasing power of $${amount} decreased ${Math.abs(pctChange).toFixed(1)}% over ${years} years`
          : `Equivalent in today's money: adjust for deflation`,
      ].join('\n')
    },
  },
  {
    id: 'heart-rate-zones',
    name: 'Heart Rate Zones',
    description: 'Calculate heart rate training zones. Enter age and optionally resting heart rate for Karvonen zones. Example: "35 60".',
    category: 'utility',
    convert: (input) => {
      const parts = input.trim().split(/\s+/).map(Number).filter(n => !isNaN(n))
      if (parts.length === 0) return '(enter age, optionally followed by resting heart rate)'
      const [age, rhr = 60] = parts
      if (age < 1 || age > 120) return '(invalid age)'
      const maxHr = 220 - age
      const hrr = maxHr - rhr
      const karvonen = (pct) => Math.round(rhr + hrr * pct)
      const simple = (pct) => Math.round(maxHr * pct)
      const zones = [
        { name: 'Zone 1 — Recovery', min: 0.50, max: 0.60, desc: 'Light activity, warm-up/cool-down' },
        { name: 'Zone 2 — Fat Burn', min: 0.60, max: 0.70, desc: 'Easy aerobic, fat oxidation' },
        { name: 'Zone 3 — Aerobic', min: 0.70, max: 0.80, desc: 'Moderate, improves aerobic capacity' },
        { name: 'Zone 4 — Threshold', min: 0.80, max: 0.90, desc: 'Hard, lactate threshold training' },
        { name: 'Zone 5 — Max', min: 0.90, max: 1.00, desc: 'Maximum effort, sprints' },
      ]
      const rows = zones.map(z =>
        `${z.name.padEnd(24)} ${karvonen(z.min).toString().padStart(3)}–${karvonen(z.max)} bpm  |  ${simple(z.min)}–${simple(z.max)} bpm (simple)`
      )
      return [
        `Age: ${age}  |  Max HR: ${maxHr} bpm  |  Resting HR: ${rhr} bpm`,
        '',
        '                         Karvonen (HRR)       Simple (% Max HR)',
        ...rows,
        '',
        ...zones.map((z, i) => `Zone ${i + 1}: ${z.desc}`),
        '',
        `Karvonen formula uses heart rate reserve (HRR = Max HR - Resting HR = ${hrr})`,
      ].join('\n')
    },
  },
  {
    id: 'running-pace',
    name: 'Running Pace Calculator',
    description: 'Calculate running pace, speed, and finish times. Enter: distance and time like "5k 25:30" or "marathon 3:45:00".',
    category: 'utility',
    convert: (input) => {
      const s = input.trim().toLowerCase()
      const distances = {
        '5k': 5, '10k': 10, 'halfmarathon': 21.0975, 'half': 21.0975,
        'marathon': 42.195, '1500m': 1.5, 'mile': 1.60934, '5mile': 8.04672,
      }
      let distKm = null, distName = ''
      for (const [name, km] of Object.entries(distances)) {
        if (s.includes(name)) { distKm = km; distName = name; break }
      }
      if (!distKm) {
        const kmMatch = s.match(/([\d.]+)\s*km/)
        const mileMatch = s.match(/([\d.]+)\s*mile/)
        if (kmMatch) { distKm = parseFloat(kmMatch[1]); distName = `${distKm} km` }
        else if (mileMatch) { distKm = parseFloat(mileMatch[1]) * 1.60934; distName = `${mileMatch[1]} miles` }
      }
      const timeMatch = s.match(/(\d+):(\d+):(\d+)|(\d+):(\d+)/)
      let totalSec = null
      if (timeMatch) {
        if (timeMatch[1]) totalSec = parseInt(timeMatch[1]) * 3600 + parseInt(timeMatch[2]) * 60 + parseInt(timeMatch[3])
        else totalSec = parseInt(timeMatch[4]) * 60 + parseInt(timeMatch[5])
      }
      const paceMatch = s.match(/pace\s+(\d+):(\d+)/)
      if (paceMatch && distKm) {
        const paceSec = parseInt(paceMatch[1]) * 60 + parseInt(paceMatch[2])
        totalSec = paceSec * distKm
      }
      if (!distKm || !totalSec) return '(enter: distance + time, e.g. "5k 25:30" or "marathon 3:45:00")'
      const paceSecPerKm = totalSec / distKm
      const paceSecPerMile = paceSecPerKm * 1.60934
      const speedKph = distKm / (totalSec / 3600)
      const speedMph = speedKph / 1.60934
      const fmtTime = (s) => {
        const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = Math.round(s % 60)
        return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}` : `${m}:${String(sec).padStart(2, '0')}`
      }
      const projections = Object.entries(distances).map(([name, km]) =>
        `  ${name.padEnd(14)} ${fmtTime(paceSecPerKm * km)}`
      )
      return [
        `Distance: ${distName} (${distKm.toFixed(3)} km)`,
        `Total time: ${fmtTime(totalSec)}`,
        '',
        `Pace: ${fmtTime(paceSecPerKm)}/km  (${fmtTime(paceSecPerMile)}/mile)`,
        `Speed: ${speedKph.toFixed(2)} km/h  (${speedMph.toFixed(2)} mph)`,
        '',
        'Race projections at this pace:',
        ...projections,
      ].join('\n')
    },
  },
  {
    id: 'savings-goal',
    name: 'Savings Goal Calculator',
    description: 'Calculate how long to reach a savings goal. Enter: goal currentSavings monthlyContribution [interestRate%].',
    category: 'utility',
    convert: (input) => {
      const parts = input.trim().split(/[,\s]+/).map(Number).filter(n => !isNaN(n))
      if (parts.length < 3) return '(enter: goal currentSavings monthlySavings [interestRate%])'
      const [goal, current, monthly, rate = 0] = parts
      if (goal <= current) return `Already reached! Current savings ($${current.toLocaleString()}) exceeds goal ($${goal.toLocaleString()})`
      const monthlyRate = rate / 100 / 12
      let months
      if (monthlyRate === 0) {
        months = Math.ceil((goal - current) / monthly)
      } else {
        months = 0
        let balance = current
        while (balance < goal && months < 10000) {
          balance = balance * (1 + monthlyRate) + monthly
          months++
        }
        if (months >= 10000) return '(goal unreachable with these parameters)'
      }
      const years = Math.floor(months / 12)
      const remMonths = months % 12
      const totalContributions = monthly * months
      const interest = goal - (current + totalContributions)
      const targetDate = new Date()
      targetDate.setMonth(targetDate.getMonth() + months)
      return [
        `Goal: $${goal.toLocaleString()}`,
        `Current savings: $${current.toLocaleString()}`,
        `Monthly contribution: $${monthly.toLocaleString()}`,
        rate ? `Annual interest: ${rate}%` : 'No interest',
        '',
        `Time to goal: ${years > 0 ? `${years}y ` : ''}${remMonths}m (${months} months total)`,
        `Target date: ${targetDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
        '',
        `Total contributions: $${totalContributions.toLocaleString()}`,
        rate ? `Interest earned: ~$${Math.max(0, interest).toLocaleString(undefined, { maximumFractionDigits: 0 })}` : '',
      ].filter(Boolean).join('\n')
    },
  },
  {
    id: 'timezone-offset',
    name: 'Time Zone Converter',
    description: 'Convert a time between two timezones. Enter: "time timezone1 timezone2" e.g. "09:00 EST PST" or "14:30 UTC+5:30 UTC-5".',
    category: 'utility',
    convert: (input) => {
      const s = input.trim()
      const timeMatch = s.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/)
      if (!timeMatch) return '(enter: time timezone1 timezone2, e.g. "09:00 EST PST")'
      const hours = parseInt(timeMatch[1]), minutes = parseInt(timeMatch[2])
      const tzOffsets = {
        'UTC': 0, 'GMT': 0, 'EST': -5, 'EDT': -4, 'CST': -6, 'CDT': -5,
        'MST': -7, 'MDT': -6, 'PST': -8, 'PDT': -7, 'AST': -4, 'HST': -10,
        'AKST': -9, 'WET': 0, 'CET': 1, 'CEST': 2, 'EET': 2, 'EEST': 3,
        'MSK': 3, 'GST': 4, 'PKT': 5, 'IST': 5.5, 'BST': 6, 'ICT': 7,
        'HKT': 8, 'JST': 9, 'KST': 9, 'AEST': 10, 'AEDT': 11, 'NZST': 12,
      }
      const parseOffset = (tz) => {
        const upper = tz.toUpperCase()
        if (tzOffsets[upper] !== undefined) return tzOffsets[upper]
        const m = tz.match(/UTC([+-])(\d+)(?::(\d+))?/i)
        if (m) return (m[1] === '+' ? 1 : -1) * (parseInt(m[2]) + (parseInt(m[3] || 0) / 60))
        return null
      }
      const parts = s.replace(timeMatch[0], '').trim().split(/\s+/)
      if (parts.length < 2) return '(enter two timezones after the time)'
      const tz1Str = parts[0].toUpperCase(), tz2Str = parts[1].toUpperCase()
      const off1 = parseOffset(parts[0]), off2 = parseOffset(parts[1])
      if (off1 === null) return `(unknown timezone: ${tz1Str})`
      if (off2 === null) return `(unknown timezone: ${tz2Str})`
      const utcMinutes = hours * 60 + minutes - off1 * 60
      const targetMinutes = ((utcMinutes + off2 * 60) % 1440 + 1440) % 1440
      const th = Math.floor(targetMinutes / 60), tm = Math.round(targetMinutes % 60)
      const fmtT = (h, m) => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
      const dayDiff = Math.floor((utcMinutes + off2 * 60) / 1440)
      const dayStr = dayDiff === 1 ? ' (+1 day)' : dayDiff === -1 ? ' (-1 day)' : ''
      return [
        `${fmtT(hours, minutes)} ${tz1Str}`,
        `= ${fmtT(th, tm)} ${tz2Str}${dayStr}`,
        '',
        `UTC offset: ${tz1Str} = UTC${off1 >= 0 ? '+' : ''}${off1}  |  ${tz2Str} = UTC${off2 >= 0 ? '+' : ''}${off2}`,
        `Difference: ${off2 - off1 >= 0 ? '+' : ''}${off2 - off1} hours`,
      ].join('\n')
    },
  },
  {
    id: 'recipe-nutrition',
    name: 'Recipe Nutrition Estimator',
    description: 'Estimate nutrition for a recipe. Enter one ingredient per line: "quantity unit food" e.g. "2 tbsp olive oil" or "100g chicken breast".',
    category: 'utility',
    convert: (input) => {
      // Per 100g approximate macros: [cal, protein_g, carbs_g, fat_g, fiber_g]
      const nutrition = {
        'olive oil': [884, 0, 0, 100, 0], 'butter': [717, 0.9, 0.1, 81, 0],
        'flour': [364, 10, 76, 1, 3], 'sugar': [387, 0, 100, 0, 0],
        'egg': [155, 13, 1.1, 11, 0], 'eggs': [155, 13, 1.1, 11, 0],
        'milk': [42, 3.4, 5, 1, 0], 'cream': [340, 2.1, 3.6, 36, 0],
        'cheese': [402, 25, 1.3, 33, 0], 'chicken breast': [165, 31, 0, 3.6, 0],
        'chicken': [165, 31, 0, 3.6, 0], 'beef': [250, 26, 0, 17, 0],
        'salmon': [208, 20, 0, 13, 0], 'tuna': [144, 30, 0, 1, 0],
        'rice': [130, 2.7, 28, 0.3, 0.4], 'pasta': [131, 5, 25, 1.1, 1.8],
        'bread': [265, 9, 49, 3.2, 2.7], 'potato': [77, 2, 17, 0.1, 2.2],
        'carrot': [41, 0.9, 10, 0.2, 2.8], 'tomato': [18, 0.9, 3.9, 0.2, 1.2],
        'onion': [40, 1.1, 9.3, 0.1, 1.7], 'garlic': [149, 6.4, 33, 0.5, 2.1],
        'apple': [52, 0.3, 14, 0.2, 2.4], 'banana': [89, 1.1, 23, 0.3, 2.6],
        'broccoli': [34, 2.8, 7, 0.4, 2.6], 'spinach': [23, 2.9, 3.6, 0.4, 2.2],
        'almonds': [579, 21, 22, 50, 12.5], 'oats': [389, 17, 66, 7, 10.6],
      }
      const unitToGrams = {
        'g': 1, 'gram': 1, 'grams': 1, 'kg': 1000, 'oz': 28.35, 'lb': 453.6, 'lbs': 453.6,
        'cup': 240, 'cups': 240, 'tbsp': 15, 'tablespoon': 15, 'tsp': 5, 'teaspoon': 5,
        'ml': 1, 'l': 1000, 'piece': 50, 'pieces': 50, 'slice': 30, 'slices': 30,
        'large': 70, 'medium': 50, 'small': 30,
      }
      const lines = input.trim().split('\n').filter(l => l.trim())
      if (lines.length === 0) return '(enter ingredients one per line: "100g chicken breast" or "2 tbsp olive oil")'
      let totalCal = 0, totalProt = 0, totalCarbs = 0, totalFat = 0, totalFiber = 0
      const itemLines = []
      for (const line of lines) {
        const parts = line.trim().split(/\s+/)
        const qty = parseFloat(parts[0])
        let unitGrams = 100
        let foodStart = 1
        if (!isNaN(qty) && parts.length > 1) {
          const possibleUnit = parts[1].toLowerCase().replace(/s$/, '')
          if (unitToGrams[possibleUnit] || unitToGrams[parts[1].toLowerCase()]) {
            unitGrams = unitToGrams[parts[1].toLowerCase()] || unitToGrams[possibleUnit]
            foodStart = 2
          } else {
            unitGrams = 1 // just count items
            foodStart = 1
          }
        }
        const foodName = parts.slice(foodStart).join(' ').toLowerCase()
        const found = Object.entries(nutrition).find(([k]) => foodName.includes(k))
        if (!found) { itemLines.push(`  ${line.trim()} — (not in database)`); continue }
        const grams = (isNaN(qty) ? 1 : qty) * unitGrams
        const [cal, prot, carbs, fat, fiber] = found[1].map(v => v * grams / 100)
        totalCal += cal; totalProt += prot; totalCarbs += carbs; totalFat += fat; totalFiber += fiber
        itemLines.push(`  ${line.trim().padEnd(30)} ${Math.round(cal)} kcal  P:${prot.toFixed(1)}g  C:${carbs.toFixed(1)}g  F:${fat.toFixed(1)}g`)
      }
      return [
        'Nutrition Estimate:',
        ...itemLines,
        '',
        `TOTAL (${lines.length} ingredients):`,
        `  Calories: ${Math.round(totalCal)} kcal`,
        `  Protein:  ${totalProt.toFixed(1)} g`,
        `  Carbs:    ${totalCarbs.toFixed(1)} g`,
        `  Fat:      ${totalFat.toFixed(1)} g`,
        `  Fiber:    ${totalFiber.toFixed(1)} g`,
        '',
        '(Approximate values based on common food data)',
      ].join('\n')
    },
  },
  {
    id: 'fuel-calc',
    name: 'Fuel Cost Calculator',
    description: 'Calculate fuel cost and efficiency for a trip. Enter: distance price-per-gallon mpg e.g. "300 miles 3.50 30mpg" or metric "500 km 1.80 L/100km 8".',
    category: 'utility',
    convert: (input) => {
      const s = input.trim().toLowerCase()
      // Metric: km + L/100km
      const km = parseFloat(s.match(/([\d.]+)\s*km/)?.[1])
      const lPer100 = parseFloat(s.match(/([\d.]+)\s*(?:l\/100|l100|liters?\s*per\s*100)/)?.[1])
      const pricePerL = parseFloat(s.match(/(?:price|cost|\$|€|£)?\s*([\d.]+)\s*(?:\/l|per\s*l)/)?.[1])
      if (km && lPer100 && pricePerL) {
        const liters = km * lPer100 / 100
        const cost = liters * pricePerL
        const mpg = 235.214 / lPer100
        return [
          `Distance: ${km} km`,
          `Efficiency: ${lPer100} L/100km (${mpg.toFixed(1)} MPG)`,
          `Price: $${pricePerL}/L`,
          '',
          `Fuel needed: ${liters.toFixed(2)} L`,
          `Total cost: $${cost.toFixed(2)}`,
          `Cost per km: $${(cost / km).toFixed(4)}`,
        ].join('\n')
      }
      // Imperial
      const distMatch = s.match(/([\d.]+)\s*(?:mile|mi)/)
      const priceMatch = s.match(/\$?([\d.]+)\s*(?:\/gal|per\s*gal|gallon)/)
      const mpgMatch = s.match(/([\d.]+)\s*mpg/) || s.match(/mpg[:\s]+([\d.]+)/)
      if (!distMatch || !priceMatch || !mpgMatch) {
        return [
          '(enter: distance price-per-gallon mpg)',
          'Examples:',
          '  "300 miles 3.50 30mpg"',
          '  "500 km 1.80/L 8 L/100km"',
        ].join('\n')
      }
      const miles = parseFloat(distMatch[1])
      const pricePerGal = parseFloat(priceMatch[1])
      const mpgVal = parseFloat(mpgMatch[1])
      const gallons = miles / mpgVal
      const totalCost = gallons * pricePerGal
      const km2 = miles * 1.60934
      const lper100 = 235.214 / mpgVal
      return [
        `Distance: ${miles} miles (${km2.toFixed(1)} km)`,
        `Efficiency: ${mpgVal} MPG (${lper100.toFixed(1)} L/100km)`,
        `Price: $${pricePerGal.toFixed(2)}/gallon`,
        '',
        `Fuel needed: ${gallons.toFixed(2)} gallons (${(gallons * 3.785).toFixed(1)} liters)`,
        `Total cost: $${totalCost.toFixed(2)}`,
        `Cost per mile: $${(totalCost / miles).toFixed(4)}`,
        `Cost per km: $${(totalCost / km2).toFixed(4)}`,
        '',
        `At $${(pricePerGal + 0.5).toFixed(2)}/gal: $${(gallons * (pricePerGal + 0.5)).toFixed(2)}`,
        `At $${(pricePerGal - 0.5).toFixed(2)}/gal: $${(gallons * (pricePerGal - 0.5)).toFixed(2)}`,
      ].join('\n')
    },
  },
  {
    id: 'sleep-cycle',
    name: 'Sleep Cycle Calculator',
    description: 'Calculate optimal wake-up or bedtimes based on 90-minute sleep cycles. Enter: sleep time "10:30pm" or wake target "7:00am".',
    category: 'utility',
    convert: (input) => {
      const s = input.trim().toLowerCase()
      const parseTime = (str) => {
        const m = str.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/)
        if (!m) return null
        let h = parseInt(m[1]), min = parseInt(m[2] || '0')
        const period = m[3]
        if (period === 'pm' && h !== 12) h += 12
        if (period === 'am' && h === 12) h = 0
        return h * 60 + min
      }
      const fmtTime = (mins) => {
        const totalMins = ((mins % 1440) + 1440) % 1440
        const h = Math.floor(totalMins / 60), m = totalMins % 60
        const period = h >= 12 ? 'PM' : 'AM'
        const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h
        return `${displayH}:${String(m).padStart(2, '0')} ${period}`
      }
      const SLEEP_ONSET = 15 // minutes to fall asleep
      const CYCLE = 90 // minutes per cycle
      const isWake = s.includes('wake') || s.includes('up') || s.includes('alarm') || s.includes('rise')
      const timeStr = s.replace(/wake\s*up|wake|alarm|bedtime|sleep|up|rise/g, '').trim()
      const parsedTime = parseTime(timeStr)
      if (parsedTime === null) return '(enter: "sleep 11:00pm", "wake 7:00am", or "bedtime for 7am")'
      if (isWake) {
        // Given wake time, calculate when to go to sleep
        const wakeMinutes = parsedTime
        const out = [`If you need to wake at ${fmtTime(wakeMinutes)}:`, '']
        for (let cycles = 6; cycles >= 3; cycles--) {
          const bedtime = wakeMinutes - SLEEP_ONSET - cycles * CYCLE
          out.push(`  Sleep at ${fmtTime(bedtime)} → ${cycles} cycles = ${cycles * 1.5}h sleep`)
        }
        out.push('', `(Times include ~${SLEEP_ONSET} min to fall asleep)`)
        return out.join('\n')
      } else {
        // Given sleep time, calculate when to wake
        const bedMinutes = parsedTime
        const sleepStart = bedMinutes + SLEEP_ONSET
        const out = [`If you sleep at ${fmtTime(bedMinutes)}:`, '']
        for (let cycles = 4; cycles <= 7; cycles++) {
          const wake = sleepStart + cycles * CYCLE
          out.push(`  Wake at ${fmtTime(wake)} → ${cycles} cycles = ${cycles * 1.5}h sleep`)
        }
        out.push('', `(Times include ~${SLEEP_ONSET} min to fall asleep)`)
        return out.join('\n')
      }
    },
  },
  {
    id: 'dna-calc',
    name: 'DNA / RNA Tools',
    description: 'Analyze DNA/RNA sequences. Enter a DNA sequence (ACGT) or RNA sequence (ACGU).',
    category: 'utility',
    convert: (input) => {
      const seq = input.trim().toUpperCase().replace(/\s/g, '')
      if (!seq) return '(enter a DNA or RNA sequence)'
      const isDNA = /^[ACGTN]+$/.test(seq)
      const isRNA = /^[ACGUNU]+$/.test(seq)
      if (!isDNA && !isRNA) return '(sequence must contain only ACGT for DNA or ACGU for RNA, N for unknown)'
      const type = isRNA && seq.includes('U') ? 'RNA' : 'DNA'
      const len = seq.length
      const counts = { A: 0, C: 0, G: 0, T: 0, U: 0, N: 0 }
      for (const base of seq) counts[base] = (counts[base] || 0) + 1
      const gcContent = ((counts.G + counts.C) / len * 100).toFixed(1)
      // Complement
      const complement = (s) => s.split('').map(b => {
        if (type === 'DNA') return { A: 'T', T: 'A', C: 'G', G: 'C', N: 'N' }[b] || b
        return { A: 'U', U: 'A', C: 'G', G: 'C', N: 'N' }[b] || b
      }).join('')
      const comp = complement(seq)
      // Transcription (DNA → RNA)
      const rna = type === 'DNA' ? seq.replace(/T/g, 'U') : seq
      // Melting temperature (Wallace rule for ≤14bp, else GC method)
      let tm
      if (len <= 14) {
        tm = 2 * (counts.A + counts.T) + 4 * (counts.G + counts.C)
      } else {
        tm = 64.9 + 41 * (counts.G + counts.C - 16.4) / len
      }
      return [
        `Sequence: ${seq.slice(0, 60)}${len > 60 ? '...' : ''}`,
        `Type: ${type}  |  Length: ${len} bp`,
        '',
        `Base composition:`,
        `  A: ${counts.A} (${(counts.A / len * 100).toFixed(1)}%)  C: ${counts.C} (${(counts.C / len * 100).toFixed(1)}%)`,
        `  G: ${counts.G} (${(counts.G / len * 100).toFixed(1)}%)  ${type === 'DNA' ? 'T' : 'U'}: ${counts[type === 'DNA' ? 'T' : 'U']} (${(counts[type === 'DNA' ? 'T' : 'U'] / len * 100).toFixed(1)}%)`,
        counts.N > 0 ? `  N: ${counts.N} (unknown)` : '',
        '',
        `GC Content: ${gcContent}%`,
        `Melting Temp (Tm): ~${tm.toFixed(1)}°C`,
        '',
        `Complement (5'→3'):`,
        `  ${comp.slice(0, 60)}${len > 60 ? '...' : ''}`,
        `Reverse Complement:`,
        `  ${seq.split('').reverse().join('').slice(0, 60)}${len > 60 ? '...' : ''}`,
        type === 'DNA' ? `\nRNA Transcript: ${rna.slice(0, 60)}${len > 60 ? '...' : ''}` : '',
      ].filter(Boolean).join('\n')
    },
  },
  {
    id: 'date-calculator',
    name: 'Date Calculator',
    description: 'Calculate days between dates, add/subtract days. Enter: "2024-01-15 to 2024-12-31" or "today + 90 days" or "2024-06-15 - 45 days".',
    category: 'utility',
    convert: (input) => {
      const s = input.trim().toLowerCase().replace(/\btoday\b/, new Date().toISOString().split('T')[0])
      const parseDate = (str) => {
        const d = new Date(str.trim())
        return isNaN(d.getTime()) ? null : d
      }
      // "date to date" - difference
      const diffMatch = s.match(/(\d{4}[-/]\d{1,2}[-/]\d{1,2})\s+to\s+(\d{4}[-/]\d{1,2}[-/]\d{1,2})/)
      if (diffMatch) {
        const d1 = parseDate(diffMatch[1]), d2 = parseDate(diffMatch[2])
        if (!d1 || !d2) return '(invalid dates)'
        const diffMs = d2 - d1
        const diffDays = Math.round(diffMs / 86400000)
        const weeks = Math.floor(Math.abs(diffDays) / 7)
        const remDays = Math.abs(diffDays) % 7
        const months = Math.abs(d2.getMonth() - d1.getMonth() + (d2.getFullYear() - d1.getFullYear()) * 12)
        return [
          `From: ${d1.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`,
          `To:   ${d2.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`,
          '',
          `Difference: ${Math.abs(diffDays)} days (${diffDays < 0 ? 'in the past' : 'in the future'})`,
          `  = ${weeks} week${weeks !== 1 ? 's' : ''} and ${remDays} day${remDays !== 1 ? 's' : ''}`,
          `  ≈ ${months} months`,
          `  ≈ ${(Math.abs(diffDays) / 365.25).toFixed(2)} years`,
          '',
          `Business days (approx): ~${Math.round(Math.abs(diffDays) * 5 / 7)}`,
        ].join('\n')
      }
      // "date + N days"
      const addMatch = s.match(/(\d{4}[-/]\d{1,2}[-/]\d{1,2})\s*([+-])\s*(\d+)\s*(?:day|d)/)
      if (addMatch) {
        const d = parseDate(addMatch[1])
        if (!d) return '(invalid date)'
        const sign = addMatch[2] === '-' ? -1 : 1
        const days = parseInt(addMatch[3]) * sign
        const result = new Date(d.getTime() + days * 86400000)
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        return [
          `${d.toISOString().split('T')[0]} ${days > 0 ? '+' : ''}${days} days`,
          `= ${result.toISOString().split('T')[0]} (${dayNames[result.getDay()]})`,
          '',
          `${result.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`,
          `ISO 8601: ${result.toISOString()}`,
          `Unix timestamp: ${Math.floor(result.getTime() / 1000)}`,
        ].join('\n')
      }
      // Just a date - show info
      const dateMatch = s.match(/(\d{4}[-/]\d{1,2}[-/]\d{1,2})/)
      if (dateMatch) {
        const d = parseDate(dateMatch[1])
        if (!d) return '(invalid date)'
        const today = new Date()
        const diffDays = Math.round((d - today) / 86400000)
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        const weekNum = Math.ceil((((d - new Date(d.getFullYear(), 0, 1)) / 86400000) + new Date(d.getFullYear(), 0, 1).getDay() + 1) / 7)
        return [
          `Date: ${d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`,
          `Day of week: ${dayNames[d.getDay()]}`,
          `Day of year: ${Math.ceil((d - new Date(d.getFullYear(), 0, 0)) / 86400000)}`,
          `Week number: ${weekNum}`,
          `Quarter: Q${Math.ceil((d.getMonth() + 1) / 3)}`,
          '',
          `${diffDays === 0 ? 'Today!' : diffDays > 0 ? `${diffDays} days from today` : `${Math.abs(diffDays)} days ago`}`,
          `ISO 8601: ${d.toISOString().split('T')[0]}`,
          `Unix timestamp: ${Math.floor(d.getTime() / 1000)}`,
          `Leap year: ${d.getFullYear() % 4 === 0 && (d.getFullYear() % 100 !== 0 || d.getFullYear() % 400 === 0) ? 'Yes' : 'No'}`,
        ].join('\n')
      }
      return [
        '(enter a date calculation, e.g.)',
        '  "2024-01-15 to 2024-12-31"',
        '  "today + 90 days"',
        '  "2024-06-15 - 45 days"',
        '  "2025-03-15" (date info)',
      ].join('\n')
    },
  },
  {
    id: 'event-countdown',
    name: 'Event Countdown',
    description: 'Calculate time remaining until an event. Enter: "2025-12-31" or "2025-12-31 23:59" or "New Years 2026-01-01".',
    category: 'utility',
    convert: (input) => {
      const s = input.trim()
      // Extract date/time
      const dateMatch = s.match(/(\d{4}[-/]\d{1,2}[-/]\d{1,2})(?:\s+(\d{1,2}:\d{2}))?/)
      if (!dateMatch) return '(enter a date: "2025-12-31" or "2025-12-31 18:00")'
      const dateStr = `${dateMatch[1]}${dateMatch[2] ? ' ' + dateMatch[2] : ''}`
      const target = new Date(dateStr)
      if (isNaN(target.getTime())) return '(invalid date)'
      const now = new Date()
      const diffMs = target - now
      const isPast = diffMs < 0
      const absDiff = Math.abs(diffMs)
      const totalSecs = Math.floor(absDiff / 1000)
      const days = Math.floor(absDiff / 86400000)
      const hours = Math.floor((absDiff % 86400000) / 3600000)
      const minutes = Math.floor((absDiff % 3600000) / 60000)
      const seconds = Math.floor((absDiff % 60000) / 1000)
      const label = s.replace(dateMatch[0], '').trim() || 'Event'
      const weeks = Math.floor(days / 7)
      const remDays = days % 7
      const months = Math.floor(days / 30.44)
      return [
        `${label}: ${target.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: dateMatch[2] ? '2-digit' : undefined, minute: dateMatch[2] ? '2-digit' : undefined })}`,
        '',
        isPast ? '⟵ This event has passed' : '⟶ Upcoming event',
        '',
        `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`,
        `= ${weeks} week${weeks !== 1 ? 's' : ''} and ${remDays} day${remDays !== 1 ? 's' : ''}`,
        `≈ ${months} month${months !== 1 ? 's' : ''}`,
        `≈ ${(absDiff / 31557600000).toFixed(2)} years`,
        '',
        `Total seconds: ${totalSecs.toLocaleString()}`,
        `Total minutes: ${Math.floor(totalSecs / 60).toLocaleString()}`,
        `Total hours: ${Math.floor(totalSecs / 3600).toLocaleString()}`,
      ].join('\n')
    },
  },
]
