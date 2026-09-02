// Web-related converters — regex, cron, CSS minify, diff, etc.
import { objToYaml, yamlToJson, parseYamlValue as _parseYamlValue, parseToml } from '../utils/parsers.js'

const REGEX_PATTERN_MAX_LENGTH = 500
const REGEX_INPUT_MAX_LENGTH = 200000
const REGEX_MATCH_LIMIT = 1000
const BASE64_API_UNAVAILABLE_ERROR = '(Base64 APIs are not available in this runtime)'
const BASE64_UTF8_DECODE_ERROR = '(invalid Base64 input or non-UTF-8 content)'

function getRegexGuardError(pattern, inputText) {
  if (pattern.length > REGEX_PATTERN_MAX_LENGTH) {
    return `(regex pattern too long — max ${REGEX_PATTERN_MAX_LENGTH} chars)`
  }
  if (inputText.length > REGEX_INPUT_MAX_LENGTH) {
    return `(text too long for regex mode — max ${REGEX_INPUT_MAX_LENGTH} chars)`
  }
  return null
}

function utf8ToBase64(inputText) {
  if (typeof btoa !== 'function') return { error: BASE64_API_UNAVAILABLE_ERROR }
  try {
    const bytes = new TextEncoder().encode(inputText)
    let binary = ''
    const chunkSize = 0x8000
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize))
    }
    return { value: btoa(binary) }
  } catch (e) {
    const message = e && e.message ? e.message : 'unknown error'
    return { error: `(failed to encode text as Base64: ${message})` }
  }
}

function base64ToUtf8(base64Text) {
  if (typeof atob !== 'function') return { error: BASE64_API_UNAVAILABLE_ERROR }
  try {
    const binary = atob(base64Text)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }

    let decoder
    try {
      decoder = new TextDecoder('utf-8', { fatal: true })
    } catch {
      decoder = new TextDecoder('utf-8')
    }
    return { value: decoder.decode(bytes) }
  } catch {
    return { error: BASE64_UTF8_DECODE_ERROR }
  }
}

export const webConverters = [
  {
    id: 'text-diff',
    name: 'Text Diff',
    category: 'utility',
    description: 'Compare two texts — separate with a line containing only "---"',
    placeholder: 'Line one\nLine two\n---\nLine one\nLine changed',
    convert: (input) => {
      const sep = input.indexOf('\n---\n')
      if (sep === -1) return '(separate the two texts with a line containing only "---")'
      const a = input.slice(0, sep).split('\n')
      const b = input.slice(sep + 5).split('\n')
      const maxLen = Math.max(a.length, b.length)
      const result = []
      for (let i = 0; i < maxLen; i++) {
        const lineA = a[i] ?? ''
        const lineB = b[i] ?? ''
        if (lineA === lineB) {
          result.push(`  ${lineA}`)
        } else {
          if (i < a.length) result.push(`- ${lineA}`)
          if (i < b.length) result.push(`+ ${lineB}`)
        }
      }
      return result.join('\n')
    },
  },
  {
    id: 'xml-to-json',
    name: 'XML to JSON (Basic)',
    category: 'data',
    description: 'Convert simple XML to JSON — basic parser, no namespace support',
    convert: (input) => {
      try {
        const parser = new DOMParser()
        const doc = parser.parseFromString(input, 'text/xml')
        const error = doc.querySelector('parsererror')
        if (error) return '(invalid XML: ' + error.textContent.slice(0, 100) + ')'

        function nodeToObj(node) {
          const obj = {}
          if (node.attributes) {
            for (const attr of node.attributes) {
              obj['@' + attr.name] = attr.value
            }
          }
          for (const child of node.childNodes) {
            if (child.nodeType === 3) { // text
              const text = child.textContent.trim()
              if (text) {
                if (Object.keys(obj).length === 0) return text
                obj['#text'] = text
              }
            } else if (child.nodeType === 1) { // element
              const val = nodeToObj(child)
              if (obj[child.nodeName]) {
                if (!Array.isArray(obj[child.nodeName])) {
                  obj[child.nodeName] = [obj[child.nodeName]]
                }
                obj[child.nodeName].push(val)
              } else {
                obj[child.nodeName] = val
              }
            }
          }
          return obj
        }

        const result = { [doc.documentElement.nodeName]: nodeToObj(doc.documentElement) }
        return JSON.stringify(result, null, 2)
      } catch {
        return '(failed to parse XML)'
      }
    },
  },
  {
    id: 'regex-tester',
    name: 'Regex Tester',
    category: 'utility',
    description: 'Test a regex pattern — first line is the pattern, rest is the test string',
    placeholder: '\\d+\nThe answer is 42 and 7',
    convert: (input) => {
      const lines = input.split('\n')
      const pattern = lines[0]
      const text = lines.slice(1).join('\n')
      if (!pattern) return '(enter a regex pattern on the first line, test string below)'
      const regexGuard = getRegexGuardError(pattern, text)
      if (regexGuard) return regexGuard
      try {
        const regex = new RegExp(pattern, 'gm')
        const matches = []
        let m
        while ((m = regex.exec(text)) !== null) {
          matches.push(m)
          if (matches.length >= REGEX_MATCH_LIMIT) break
          if (m[0] === '') regex.lastIndex++
        }
        if (matches.length === 0) return '(no matches)'
        const output = matches
          .map((m, i) => {
            const groups = m.slice(1)
            let line = `Match ${i + 1}: "${m[0]}" (index ${m.index})`
            if (groups.length > 0) {
              line += '\n  Groups: ' + groups.map((g, j) => `$${j + 1}="${g}"`).join(', ')
            }
            return line
          })
        if (matches.length >= REGEX_MATCH_LIMIT) {
          output.push(`(match limit reached: showing first ${REGEX_MATCH_LIMIT})`)
        }
        return output.join('\n')
      } catch (e) {
        return `(invalid regex: ${e.message})`
      }
    },
  },
  {
    id: 'css-minify',
    name: 'CSS Minify',
    category: 'data',
    description: 'Minify CSS by removing whitespace and comments',
    convert: (input) => {
      return input
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\s+/g, ' ')
        .replace(/\s*([{}:;,>+~])\s*/g, '$1')
        .replace(/;}/g, '}')
        .trim()
    },
  },
  {
    id: 'html-minify',
    name: 'HTML Minify',
    category: 'data',
    description: 'Minify HTML by removing extra whitespace',
    convert: (input) => {
      return input
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/>\s+</g, '><')
        .replace(/\s{2,}/g, ' ')
        .trim()
    },
  },
  {
    id: 'js-minify',
    name: 'JS Minify (Basic)',
    category: 'data',
    description: 'Basic JavaScript minification — removes comments and extra whitespace',
    convert: (input) => {
      return input
        .replace(/\/\/.*$/gm, '')
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\n\s*\n/g, '\n')
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean)
        .join('\n')
    },
  },
  {
    id: 'js-prettify',
    name: 'JS Prettify (Basic)',
    category: 'data',
    description: 'Format minified JavaScript with proper indentation',
    convert: (input) => {
      let indent = 0
      const step = '  '
      let result = ''
      let inString = false
      let stringChar = ''
      let escaped = false
      for (let i = 0; i < input.length; i++) {
        const c = input[i]
        if (escaped) { result += c; escaped = false; continue }
        if (c === '\\') { result += c; escaped = true; continue }
        if (inString) {
          result += c
          if (c === stringChar) inString = false
          continue
        }
        if (c === '"' || c === "'" || c === '`') {
          inString = true; stringChar = c; result += c; continue
        }
        if (c === '{' || c === '[') {
          indent++
          result += c + '\n' + step.repeat(indent)
        } else if (c === '}' || c === ']') {
          indent = Math.max(0, indent - 1)
          result += '\n' + step.repeat(indent) + c
        } else if (c === ',') {
          result += ',\n' + step.repeat(indent)
        } else if (c === ';') {
          result += ';\n' + step.repeat(indent)
        } else {
          result += c
        }
      }
      return result.replace(/\n\s*\n/g, '\n').trim()
    },
  },
  {
    id: 'url-parser',
    name: 'URL Parser',
    category: 'utility',
    description: 'Parse a URL into its components',
    convert: (input) => {
      try {
        const url = new URL(input.trim())
        const parts = [
          `Protocol:  ${url.protocol}`,
          `Host:      ${url.host}`,
          `Hostname:  ${url.hostname}`,
          `Port:      ${url.port || '(default)'}`,
          `Pathname:  ${url.pathname}`,
          `Search:    ${url.search || '(none)'}`,
          `Hash:      ${url.hash || '(none)'}`,
          `Origin:    ${url.origin}`,
        ]
        if (url.searchParams.toString()) {
          parts.push('', '-- Query Parameters --')
          for (const [key, val] of url.searchParams) {
            parts.push(`  ${key} = ${val}`)
          }
        }
        return parts.join('\n')
      } catch {
        return '(invalid URL)'
      }
    },
  },
  {
    id: 'cron-parser',
    name: 'Cron Expression Parser',
    category: 'utility',
    description: 'Explain a cron expression in human-readable form',
    placeholder: '*/15 9-17 * * 1-5',
    convert: (input) => {
      const parts = input.trim().split(/\s+/)
      if (parts.length < 5 || parts.length > 6) {
        return '(expected 5 or 6 fields: minute hour day-of-month month day-of-week [year])'
      }

      const [min, hour, dom, mon, dow] = parts

      const describe = (val, unit) => {
        if (val === '*') return `every ${unit}`
        if (val.includes('/')) {
          const [, step] = val.split('/')
          return `every ${step} ${unit}s`
        }
        if (val.includes(',')) return `at ${unit}s ${val}`
        if (val.includes('-')) return `${unit}s ${val}`
        return `at ${unit} ${val}`
      }

      const monthNames = { 1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec' }
      const dayNames = { 0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat', 7: 'Sun' }

      return [
        `Expression: ${input.trim()}`,
        '',
        `Minute:       ${describe(min, 'minute')}`,
        `Hour:         ${describe(hour, 'hour')}`,
        `Day of Month: ${describe(dom, 'day')}`,
        `Month:        ${mon === '*' ? 'every month' : mon.split(',').map((m) => monthNames[m] || m).join(', ')}`,
        `Day of Week:  ${dow === '*' ? 'every day' : dow.split(',').map((d) => dayNames[d] || d).join(', ')}`,
      ].join('\n')
    },
  },
  {
    id: 'json-to-querystring',
    name: 'JSON to Query String',
    category: 'data',
    description: 'Convert a JSON object to URL query string',
    convert: (input) => {
      try {
        const obj = JSON.parse(input)
        if (typeof obj !== 'object' || Array.isArray(obj)) return '(expected a JSON object)'
        const params = new URLSearchParams()
        for (const [key, val] of Object.entries(obj)) {
          params.set(key, String(val))
        }
        return params.toString()
      } catch {
        return '(invalid JSON)'
      }
    },
  },
  {
    id: 'querystring-to-json',
    name: 'Query String to JSON',
    category: 'data',
    description: 'Convert URL query string to JSON',
    convert: (input) => {
      try {
        const cleaned = input.trim().replace(/^\?/, '')
        const params = new URLSearchParams(cleaned)
        const obj = {}
        for (const [key, val] of params) {
          obj[key] = val
        }
        return JSON.stringify(obj, null, 2)
      } catch {
        return '(invalid query string)'
      }
    },
  },
  {
    id: 'json-to-yaml',
    name: 'JSON to YAML',
    category: 'data',
    description: 'Convert JSON to YAML format',
    convert: (input) => {
      try {
        const obj = JSON.parse(input)
        return objToYaml(obj, 0)
      } catch {
        return '(invalid JSON)'
      }
    },
  },
  {
    id: 'yaml-to-json',
    name: 'YAML to JSON',
    category: 'data',
    description: 'Convert basic YAML to JSON',
    convert: (input) => {
      try {
        return yamlToJson(input)
      } catch {
        return '(invalid YAML)'
      }
    },
  },
  {
    id: 'json-to-xml',
    name: 'JSON to XML',
    category: 'data',
    description: 'Convert JSON to basic XML',
    convert: (input) => {
      try {
        const obj = JSON.parse(input)
        function toXml(val, tag) {
          if (val === null || val === undefined) return `<${tag}/>`
          if (Array.isArray(val)) return val.map(item => toXml(item, tag)).join('\n')
          if (typeof val === 'object') {
            const children = Object.entries(val).map(([k, v]) => toXml(v, k)).join('\n  ')
            return `<${tag}>\n  ${children}\n</${tag}>`
          }
          return `<${tag}>${String(val).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</${tag}>`
        }
        const keys = Object.keys(obj)
        if (keys.length === 1) return '<?xml version="1.0"?>\n' + toXml(obj[keys[0]], keys[0])
        return '<?xml version="1.0"?>\n' + toXml(obj, 'root')
      } catch {
        return '(invalid JSON)'
      }
    },
  },
  {
    id: 'html-prettify',
    name: 'HTML Prettify',
    category: 'data',
    description: 'Format HTML with proper indentation',
    convert: (input) => {
      let indent = 0
      const voidTags = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'])
      return input
        .replace(/>\s*</g, '>\n<')
        .split('\n')
        .map(line => {
          const trimmed = line.trim()
          if (!trimmed) return ''
          const isClosing = trimmed.startsWith('</')
          const isSelfClosing = trimmed.endsWith('/>') || voidTags.has((trimmed.match(/<(\w+)/)?.[1] || '').toLowerCase())
          if (isClosing) indent = Math.max(0, indent - 1)
          const result = '  '.repeat(indent) + trimmed
          if (!isClosing && !isSelfClosing && trimmed.startsWith('<') && !trimmed.startsWith('<!')) indent++
          return result
        })
        .filter(Boolean)
        .join('\n')
    },
  },
  {
    id: 'css-prettify',
    name: 'CSS Prettify',
    category: 'data',
    description: 'Format minified CSS with proper indentation',
    convert: (input) => {
      return input
        .replace(/\{/g, ' {\n  ')
        .replace(/\}/g, '\n}\n')
        .replace(/;/g, ';\n  ')
        .replace(/\n\s*\n/g, '\n')
        .replace(/ {2}\n\}/g, '\n}')
        .trim()
    },
  },
  {
    id: 'toml-to-json',
    name: 'TOML to JSON',
    category: 'data',
    description: 'Convert basic TOML to JSON (supports strings, numbers, booleans, arrays)',
    convert: (input) => {
      try {
        return JSON.stringify(parseToml(input), null, 2)
      } catch {
        return '(invalid TOML)'
      }
    },
  },
  {
    id: 'json-validate',
    name: 'JSON Validator',
    category: 'data',
    description: 'Validate JSON and show errors with line numbers',
    convert: (input) => {
      try {
        const obj = JSON.parse(input)
        const keys = typeof obj === 'object' && obj !== null
          ? (Array.isArray(obj) ? `${obj.length} items` : `${Object.keys(obj).length} keys`)
          : typeof obj
        return [
          'Valid JSON',
          '',
          `Type: ${Array.isArray(obj) ? 'array' : typeof obj}`,
          `Content: ${keys}`,
          `Size: ${input.length} chars`,
          `Minified: ${JSON.stringify(obj).length} chars`,
        ].join('\n')
      } catch (e) {
        const match = e.message.match(/position (\d+)/)
        if (match) {
          const pos = parseInt(match[1])
          const lines = input.slice(0, pos).split('\n')
          const line = lines.length
          const col = lines[lines.length - 1].length + 1
          return `Invalid JSON\n\nError at line ${line}, column ${col}:\n${e.message}`
        }
        return `Invalid JSON\n\n${e.message}`
      }
    },
  },
  {
    id: 'html-to-jsx',
    name: 'HTML to JSX',
    category: 'data',
    description: 'Convert HTML attributes to JSX-compatible format',
    convert: (input) => {
      return input
        .replace(/\bclass=/g, 'className=')
        .replace(/\bfor=/g, 'htmlFor=')
        .replace(/\btabindex=/g, 'tabIndex=')
        .replace(/\breadonly\b/g, 'readOnly')
        .replace(/\bautofocus\b/g, 'autoFocus')
        .replace(/\bautocomplete=/g, 'autoComplete=')
        .replace(/\bmaxlength=/g, 'maxLength=')
        .replace(/\bminlength=/g, 'minLength=')
        .replace(/\bcellpadding=/g, 'cellPadding=')
        .replace(/\bcellspacing=/g, 'cellSpacing=')
        .replace(/\bcolspan=/g, 'colSpan=')
        .replace(/\browspan=/g, 'rowSpan=')
        .replace(/\benctype=/g, 'encType=')
        .replace(/\bnovalidate\b/g, 'noValidate')
        .replace(/\bcrossorigin=/g, 'crossOrigin=')
        .replace(/\bstroke-width=/g, 'strokeWidth=')
        .replace(/\bstroke-linecap=/g, 'strokeLinecap=')
        .replace(/\bstroke-linejoin=/g, 'strokeLinejoin=')
        .replace(/\bfill-rule=/g, 'fillRule=')
        .replace(/\bclip-rule=/g, 'clipRule=')
        .replace(/\bfont-size=/g, 'fontSize=')
        .replace(/\bstyle="([^"]+)"/g, (_, s) => {
          const obj = s.split(';').filter(Boolean).map(rule => {
            const [prop, val] = rule.split(':').map(x => x.trim())
            const camelProp = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
            return `${camelProp}: "${val}"`
          }).join(', ')
          return `style={{${obj}}}`
        })
    },
  },
  {
    id: 'json-to-toml',
    name: 'JSON to TOML',
    category: 'data',
    description: 'Convert JSON to basic TOML format',
    convert: (input) => {
      try {
        const obj = JSON.parse(input)
        const lines = []
        function emit(val, prefix) {
          for (const [k, v] of Object.entries(val)) {
            if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
              const section = prefix ? `${prefix}.${k}` : k
              lines.push(`\n[${section}]`)
              emit(v, section)
            } else {
              const formatted = typeof v === 'string' ? `"${v}"` : JSON.stringify(v)
              lines.push(`${k} = ${formatted}`)
            }
          }
        }
        emit(obj, '')
        return lines.join('\n').trim()
      } catch {
        return '(invalid JSON)'
      }
    },
  },
  {
    id: 'svg-optimize',
    name: 'SVG Optimizer (Basic)',
    category: 'data',
    description: 'Remove unnecessary attributes and whitespace from SVG',
    convert: (input) => {
      return input
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/\s*xmlns:[\w]+="[^"]*"/g, '')
        .replace(/\s*data-[\w-]+="[^"]*"/g, '')
        .replace(/\s*style=""/g, '')
        .replace(/\s*class=""/g, '')
        .replace(/>\s+</g, '><')
        .replace(/\s{2,}/g, ' ')
        .replace(/\s*\/>/g, '/>')
        .trim()
    },
  },
  {
    id: 'css-vars-extract',
    name: 'CSS Variables Extractor',
    category: 'data',
    description: 'Extract CSS custom properties (variables) from a stylesheet',
    convert: (input) => {
      const vars = input.match(/--[\w-]+\s*:\s*[^;]+/g)
      if (!vars || vars.length === 0) return '(no CSS variables found)'
      const parsed = vars.map(v => {
        const [name, ...rest] = v.split(':')
        return { name: name.trim(), value: rest.join(':').trim() }
      })
      return [
        `${parsed.length} CSS variable(s) found:`,
        '',
        ...parsed.map(v => `${v.name}: ${v.value};`),
      ].join('\n')
    },
  },
  {
    id: 'tailwind-to-css',
    name: 'Tailwind → CSS',
    category: 'data',
    description: 'Convert common Tailwind classes to approximate CSS — paste class names',
    convert: (input) => {
      const map = {
        'flex': 'display: flex;',
        'block': 'display: block;',
        'inline': 'display: inline;',
        'hidden': 'display: none;',
        'grid': 'display: grid;',
        'relative': 'position: relative;',
        'absolute': 'position: absolute;',
        'fixed': 'position: fixed;',
        'sticky': 'position: sticky;',
        'static': 'position: static;',
        'items-center': 'align-items: center;',
        'items-start': 'align-items: flex-start;',
        'items-end': 'align-items: flex-end;',
        'justify-center': 'justify-content: center;',
        'justify-between': 'justify-content: space-between;',
        'justify-start': 'justify-content: flex-start;',
        'justify-end': 'justify-content: flex-end;',
        'flex-col': 'flex-direction: column;',
        'flex-row': 'flex-direction: row;',
        'flex-wrap': 'flex-wrap: wrap;',
        'flex-1': 'flex: 1 1 0%;',
        'flex-none': 'flex: none;',
        'flex-shrink-0': 'flex-shrink: 0;',
        'flex-grow': 'flex-grow: 1;',
        'text-center': 'text-align: center;',
        'text-left': 'text-align: left;',
        'text-right': 'text-align: right;',
        'font-bold': 'font-weight: 700;',
        'font-semibold': 'font-weight: 600;',
        'font-medium': 'font-weight: 500;',
        'font-normal': 'font-weight: 400;',
        'font-light': 'font-weight: 300;',
        'italic': 'font-style: italic;',
        'uppercase': 'text-transform: uppercase;',
        'lowercase': 'text-transform: lowercase;',
        'capitalize': 'text-transform: capitalize;',
        'truncate': 'overflow: hidden; text-overflow: ellipsis; white-space: nowrap;',
        'overflow-hidden': 'overflow: hidden;',
        'overflow-auto': 'overflow: auto;',
        'overflow-scroll': 'overflow: scroll;',
        'rounded': 'border-radius: 0.25rem;',
        'rounded-lg': 'border-radius: 0.5rem;',
        'rounded-xl': 'border-radius: 0.75rem;',
        'rounded-2xl': 'border-radius: 1rem;',
        'rounded-full': 'border-radius: 9999px;',
        'rounded-none': 'border-radius: 0;',
        'border': 'border-width: 1px;',
        'border-0': 'border-width: 0;',
        'border-2': 'border-width: 2px;',
        'shadow': 'box-shadow: 0 1px 3px rgba(0,0,0,0.1);',
        'shadow-lg': 'box-shadow: 0 10px 15px rgba(0,0,0,0.1);',
        'shadow-none': 'box-shadow: none;',
        'cursor-pointer': 'cursor: pointer;',
        'cursor-default': 'cursor: default;',
        'select-none': 'user-select: none;',
        'pointer-events-none': 'pointer-events: none;',
        'transition': 'transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);',
        'sr-only': 'position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border-width: 0;',
      }

      // Dynamic spacing/sizing patterns
      const spacingScale = { 0: '0', 1: '0.25rem', 2: '0.5rem', 3: '0.75rem', 4: '1rem', 5: '1.25rem', 6: '1.5rem', 8: '2rem', 10: '2.5rem', 12: '3rem', 16: '4rem', 20: '5rem', 24: '6rem', 32: '8rem', 40: '10rem', 48: '12rem', 64: '16rem', 'px': '1px', 0.5: '0.125rem', 1.5: '0.375rem', 2.5: '0.625rem', 3.5: '0.875rem' }
      const textScale = { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem', '4xl': '2.25rem' }

      const classes = input.trim().split(/\s+/)
      const results = []

      for (const cls of classes) {
        if (map[cls]) { results.push(`/* ${cls} */  ${map[cls]}`); continue }

        // Dynamic patterns
        let m
        if ((m = cls.match(/^p-(\S+)$/)) && spacingScale[m[1]]) { results.push(`/* ${cls} */  padding: ${spacingScale[m[1]]};`); continue }
        if ((m = cls.match(/^px-(\S+)$/)) && spacingScale[m[1]]) { results.push(`/* ${cls} */  padding-left: ${spacingScale[m[1]]}; padding-right: ${spacingScale[m[1]]};`); continue }
        if ((m = cls.match(/^py-(\S+)$/)) && spacingScale[m[1]]) { results.push(`/* ${cls} */  padding-top: ${spacingScale[m[1]]}; padding-bottom: ${spacingScale[m[1]]};`); continue }
        if ((m = cls.match(/^m-(\S+)$/)) && spacingScale[m[1]]) { results.push(`/* ${cls} */  margin: ${spacingScale[m[1]]};`); continue }
        if ((m = cls.match(/^mx-(\S+)$/)) && spacingScale[m[1]]) { results.push(`/* ${cls} */  margin-left: ${spacingScale[m[1]]}; margin-right: ${spacingScale[m[1]]};`); continue }
        if ((m = cls.match(/^my-(\S+)$/)) && spacingScale[m[1]]) { results.push(`/* ${cls} */  margin-top: ${spacingScale[m[1]]}; margin-bottom: ${spacingScale[m[1]]};`); continue }
        if ((m = cls.match(/^gap-(\S+)$/)) && spacingScale[m[1]]) { results.push(`/* ${cls} */  gap: ${spacingScale[m[1]]};`); continue }
        if ((m = cls.match(/^w-(\S+)$/)) && spacingScale[m[1]]) { results.push(`/* ${cls} */  width: ${spacingScale[m[1]]};`); continue }
        if (cls === 'w-full') { results.push(`/* ${cls} */  width: 100%;`); continue }
        if (cls === 'h-full') { results.push(`/* ${cls} */  height: 100%;`); continue }
        if (cls === 'w-screen') { results.push(`/* ${cls} */  width: 100vw;`); continue }
        if ((m = cls.match(/^h-(\S+)$/)) && spacingScale[m[1]]) { results.push(`/* ${cls} */  height: ${spacingScale[m[1]]};`); continue }
        if ((m = cls.match(/^text-(\S+)$/)) && textScale[m[1]]) { results.push(`/* ${cls} */  font-size: ${textScale[m[1]]};`); continue }
        if ((m = cls.match(/^leading-(\S+)$/)) && spacingScale[m[1]]) { results.push(`/* ${cls} */  line-height: ${spacingScale[m[1]]};`); continue }
        if ((m = cls.match(/^opacity-(\d+)$/))) { results.push(`/* ${cls} */  opacity: ${parseInt(m[1]) / 100};`); continue }
        if ((m = cls.match(/^z-(\d+)$/))) { results.push(`/* ${cls} */  z-index: ${m[1]};`); continue }
        if ((m = cls.match(/^top-(\S+)$/)) && spacingScale[m[1]]) { results.push(`/* ${cls} */  top: ${spacingScale[m[1]]};`); continue }
        if ((m = cls.match(/^right-(\S+)$/)) && spacingScale[m[1]]) { results.push(`/* ${cls} */  right: ${spacingScale[m[1]]};`); continue }
        if ((m = cls.match(/^bottom-(\S+)$/)) && spacingScale[m[1]]) { results.push(`/* ${cls} */  bottom: ${spacingScale[m[1]]};`); continue }
        if ((m = cls.match(/^left-(\S+)$/)) && spacingScale[m[1]]) { results.push(`/* ${cls} */  left: ${spacingScale[m[1]]};`); continue }
        if ((m = cls.match(/^min-w-(\S+)$/)) && spacingScale[m[1]]) { results.push(`/* ${cls} */  min-width: ${spacingScale[m[1]]};`); continue }
        if ((m = cls.match(/^max-w-(\S+)$/)) && spacingScale[m[1]]) { results.push(`/* ${cls} */  max-width: ${spacingScale[m[1]]};`); continue }

        results.push(`/* ${cls} */  /* unknown class */`)
      }

      return results.join('\n')
    },
  },
  {
    id: 'json-sort-keys',
    name: 'JSON Sort Keys',
    category: 'data',
    description: 'Sort JSON object keys alphabetically (recursive)',
    convert: (input) => {
      try {
        const obj = JSON.parse(input)
        function sortKeys(val) {
          if (Array.isArray(val)) return val.map(sortKeys)
          if (val !== null && typeof val === 'object') {
            const sorted = {}
            for (const key of Object.keys(val).sort()) {
              sorted[key] = sortKeys(val[key])
            }
            return sorted
          }
          return val
        }
        return JSON.stringify(sortKeys(obj), null, 2)
      } catch {
        return '(invalid JSON)'
      }
    },
  },
  {
    id: 'htaccess-gen',
    name: 'Redirect Generator',
    category: 'utility',
    description: 'Generate redirect rules — enter "from to" pairs, one per line',
    convert: (input) => {
      const lines = input.trim().split('\n').filter(l => l.trim())
      if (lines.length === 0) return '(enter "from to" URL pairs, one per line\ne.g. /old-page /new-page)'
      const pairs = lines.map(l => {
        const parts = l.trim().split(/\s+/)
        return { from: parts[0], to: parts[1] || parts[0] }
      })

      const nginx = pairs.map(p => `rewrite ^${p.from}$ ${p.to} permanent;`).join('\n')
      const apache = pairs.map(p => `Redirect 301 ${p.from} ${p.to}`).join('\n')
      const meta = pairs.map(p => `<meta http-equiv="refresh" content="0; url=${p.to}">`).join('\n')

      return [
        '-- Nginx --',
        nginx,
        '',
        '-- Apache (.htaccess) --',
        apache,
        '',
        '-- HTML Meta Refresh --',
        meta,
      ].join('\n')
    },
  },
  {
    id: 'markdown-table-format',
    name: 'Markdown Table Formatter',
    category: 'utility',
    description: 'Align and format a Markdown table with consistent column widths',
    placeholder: '| Name | Age | City |\n| --- | --- | --- |\n| Alice | 30 | NYC |\n| Bob | 25 | LA |',
    convert: (input) => {
      const lines = input.trim().split('\n').filter(l => l.includes('|'))
      if (lines.length < 2) return '(paste a markdown table with | delimiters)'
      const rows = lines.map(l =>
        l.split('|').map(c => c.trim()).filter((_, i, a) => i > 0 && i < a.length)
      )
      // Detect separator row
      const sepIdx = rows.findIndex(r => r.every(c => /^[-:]+$/.test(c)))
      if (sepIdx === -1) return '(no separator row found — expected a row like | --- | --- |)'
      // Get alignment from separator
      const alignments = rows[sepIdx].map(c => {
        if (c.startsWith(':') && c.endsWith(':')) return 'center'
        if (c.endsWith(':')) return 'right'
        return 'left'
      })
      // Calculate column widths
      const cols = rows[0].length
      const widths = Array(cols).fill(3)
      for (let i = 0; i < rows.length; i++) {
        if (i === sepIdx) continue
        for (let j = 0; j < cols; j++) {
          widths[j] = Math.max(widths[j], (rows[i][j] || '').length)
        }
      }
      // Format rows
      const fmt = (row, isSep) => {
        const cells = Array(cols).fill('').map((_, j) => {
          if (isSep) {
            const w = widths[j]
            const a = alignments[j]
            if (a === 'center') return ':' + '-'.repeat(w) + ':'
            if (a === 'right') return '-'.repeat(w + 1) + ':'
            return '-'.repeat(w + 2)
          }
          const cell = row[j] || ''
          return ' ' + cell.padEnd(widths[j]) + ' '
        })
        return '|' + cells.join('|') + '|'
      }
      return rows.map((r, i) => fmt(r, i === sepIdx)).join('\n')
    },
  },
  {
    id: 'word-frequency',
    name: 'Word Frequency',
    category: 'utility',
    description: 'Count word frequency in text and rank by occurrence',
    convert: (input) => {
      if (!input.trim()) return ''
      const words = input.toLowerCase().match(/\b[a-z']+\b/g)
      if (!words || words.length === 0) return '(no words found)'
      const freq = {}
      for (const w of words) freq[w] = (freq[w] || 0) + 1
      const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1])
      const total = words.length
      return [
        `${total} words, ${sorted.length} unique`,
        '',
        ...sorted.slice(0, 50).map(([word, count], i) => {
          const pct = ((count / total) * 100).toFixed(1)
          const bar = '#'.repeat(Math.round(count / sorted[0][1] * 20))
          return `${String(i + 1).padStart(3)}. ${word.padEnd(20)} ${String(count).padStart(5)}  ${pct.padStart(5)}%  ${bar}`
        }),
        sorted.length > 50 ? `\n... and ${sorted.length - 50} more unique words` : '',
      ].filter(Boolean).join('\n')
    },
  },
  {
    id: 'reading-time',
    name: 'Reading Time Estimator',
    category: 'utility',
    description: 'Estimate reading time, word count, and complexity of text',
    convert: (input) => {
      if (!input.trim()) return ''
      const text = input.trim()
      const words = text.split(/\s+/).filter(Boolean)
      const wordCount = words.length
      const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length || 1
      const syllables = words.reduce((sum, w) => {
        const s = w.toLowerCase().replace(/[^a-z]/g, '')
        const count = s.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').match(/[aeiouy]{1,2}/g)
        return sum + (count ? count.length : 1)
      }, 0)
      const avgWordLen = (words.join('').length / wordCount).toFixed(1)
      const wordsPerSentence = (wordCount / sentences).toFixed(1)
      // Flesch Reading Ease
      const flesch = Math.round(206.835 - 1.015 * (wordCount / sentences) - 84.6 * (syllables / wordCount))
      const level = flesch >= 90 ? 'Very Easy (5th grade)' :
        flesch >= 80 ? 'Easy (6th grade)' :
        flesch >= 70 ? 'Fairly Easy (7th grade)' :
        flesch >= 60 ? 'Standard (8th-9th grade)' :
        flesch >= 50 ? 'Fairly Difficult (10th-12th grade)' :
        flesch >= 30 ? 'Difficult (College)' : 'Very Difficult (Graduate)'
      return [
        `Words:           ${wordCount.toLocaleString()}`,
        `Sentences:       ${sentences.toLocaleString()}`,
        `Syllables:       ${syllables.toLocaleString()}`,
        `Avg word length: ${avgWordLen} chars`,
        `Words/sentence:  ${wordsPerSentence}`,
        '',
        `Reading time:    ~${Math.ceil(wordCount / 238)} min (238 wpm)`,
        `Speaking time:   ~${Math.ceil(wordCount / 150)} min (150 wpm)`,
        '',
        `Flesch Score:    ${flesch}`,
        `Reading Level:   ${level}`,
      ].join('\n')
    },
  },
  {
    id: 'user-agent-parse',
    name: 'User Agent Parser',
    category: 'utility',
    description: 'Parse a browser user agent string into readable components',
    placeholder: navigator.userAgent,
    convert: (input) => {
      const ua = input.trim()
      if (!ua) return ''
      const get = (regex) => { const m = ua.match(regex); return m ? m[1] : null }
      const browser =
        get(/Edg[e/](\S+)/) ? `Edge ${get(/Edg[e/](\S+)/)}` :
        get(/OPR\/(\S+)/) ? `Opera ${get(/OPR\/(\S+)/)}` :
        get(/Chrome\/(\S+)/) && !get(/Edg/) ? `Chrome ${get(/Chrome\/(\S+)/)}` :
        get(/Firefox\/(\S+)/) ? `Firefox ${get(/Firefox\/(\S+)/)}` :
        get(/Version\/(\S+).*Safari/) ? `Safari ${get(/Version\/(\S+)/)}` :
        'Unknown'
      const os =
        get(/Windows NT ([\d.]+)/) ? `Windows NT ${get(/Windows NT ([\d.]+)/)}` :
        get(/Mac OS X ([\d_]+)/) ? `macOS ${get(/Mac OS X ([\d_]+)/).replace(/_/g, '.')}` :
        get(/Linux/) ? 'Linux' :
        get(/Android ([\d.]+)/) ? `Android ${get(/Android ([\d.]+)/)}` :
        get(/iPhone OS ([\d_]+)/) ? `iOS ${get(/iPhone OS ([\d_]+)/).replace(/_/g, '.')}` :
        get(/iPad.*OS ([\d_]+)/) ? `iPadOS ${get(/iPad.*OS ([\d_]+)/).replace(/_/g, '.')}` :
        'Unknown'
      const engine = get(/AppleWebKit\/(\S+)/) ? `WebKit ${get(/AppleWebKit\/(\S+)/)}` :
        get(/Gecko\/(\S+)/) ? `Gecko ${get(/Gecko\/(\S+)/)}` : 'Unknown'
      const mobile = /Mobile|Android|iPhone|iPad/.test(ua) ? 'Yes' : 'No'
      const bot = /bot|crawl|spider|slurp|wget|curl/i.test(ua) ? 'Yes' : 'No'
      return [
        `Browser: ${browser}`,
        `OS:      ${os}`,
        `Engine:  ${engine}`,
        `Mobile:  ${mobile}`,
        `Bot:     ${bot}`,
        '',
        `Raw: ${ua}`,
      ].join('\n')
    },
  },
  {
    id: 'json-to-csv',
    name: 'JSON Array → CSV',
    category: 'data',
    description: 'Convert a JSON array of objects to CSV with headers',
    placeholder: '[{"name":"Alice","age":30},{"name":"Bob","age":25}]',
    convert: (input) => {
      try {
        const arr = JSON.parse(input.trim())
        if (!Array.isArray(arr) || arr.length === 0) return '(expected a non-empty JSON array)'
        if (typeof arr[0] !== 'object' || arr[0] === null) return '(expected array of objects)'
        const headers = [...new Set(arr.flatMap(obj => Object.keys(obj)))]
        const esc = (val) => {
          const s = val == null ? '' : String(val)
          return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s
        }
        const rows = arr.map(obj => headers.map(h => esc(obj[h])).join(','))
        return [headers.map(esc).join(','), ...rows].join('\n')
      } catch {
        return '(invalid JSON)'
      }
    },
  },
  {
    id: 'csv-to-json-array',
    name: 'CSV → JSON Array',
    category: 'data',
    description: 'Convert CSV with headers to a JSON array of objects',
    convert: (input) => {
      const lines = input.trim().split('\n')
      if (lines.length < 2) return '(need at least a header row and one data row)'
      const parseRow = (line) => {
        const result = []
        let cur = '', inQ = false
        for (let i = 0; i < line.length; i++) {
          const c = line[i]
          if (inQ) {
            if (c === '"' && line[i+1] === '"') { cur += '"'; i++ }
            else if (c === '"') inQ = false
            else cur += c
          } else {
            if (c === '"') inQ = true
            else if (c === ',') { result.push(cur.trim()); cur = '' }
            else cur += c
          }
        }
        result.push(cur.trim())
        return result
      }
      const headers = parseRow(lines[0])
      const rows = lines.slice(1).filter(l => l.trim()).map(parseRow)
      const objects = rows.map(row => {
        const obj = {}
        headers.forEach((h, i) => {
          const val = row[i] || ''
          obj[h] = !isNaN(val) && val !== '' ? Number(val) : val
        })
        return obj
      })
      return JSON.stringify(objects, null, 2)
    },
  },
  {
    id: 'markdown-link-extract',
    name: 'Markdown Link Extractor',
    category: 'utility',
    description: 'Extract all links from Markdown text',
    convert: (input) => {
      const links = []
      const mdLinks = input.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)
      for (const m of mdLinks) links.push({ text: m[1], url: m[2] })
      const rawUrls = input.matchAll(/(?<!\()https?:\/\/[^\s<>"{}|\\^`[\]]+/g)
      for (const m of rawUrls) {
        if (!links.some(l => l.url === m[0])) links.push({ text: '', url: m[0] })
      }
      if (links.length === 0) return '(no links found)'
      return [
        `${links.length} link(s) found:`,
        '',
        ...links.map((l, i) => {
          const label = l.text ? `[${l.text}]` : ''
          return `${i + 1}. ${label} ${l.url}`
        }),
      ].join('\n')
    },
  },
  {
    id: 'html-entity-ref',
    name: 'HTML Entity Reference',
    category: 'utility',
    description: 'Look up HTML entities by character or name — enter a character or entity name',
    isGenerator: true,
    convert: (input) => {
      const entities = {
        '&': ['&amp;', 'ampersand'], '<': ['&lt;', 'less than'], '>': ['&gt;', 'greater than'],
        '"': ['&quot;', 'quotation mark'], "'": ['&apos;', 'apostrophe'], ' ': ['&nbsp;', 'non-breaking space'],
        '©': ['&copy;', 'copyright'], '®': ['&reg;', 'registered'], '™': ['&trade;', 'trademark'],
        '€': ['&euro;', 'euro'], '£': ['&pound;', 'pound'], '¥': ['&yen;', 'yen'],
        '¢': ['&cent;', 'cent'], '°': ['&deg;', 'degree'], '±': ['&plusmn;', 'plus-minus'],
        '×': ['&times;', 'multiplication'], '÷': ['&divide;', 'division'],
        '←': ['&larr;', 'left arrow'], '→': ['&rarr;', 'right arrow'],
        '↑': ['&uarr;', 'up arrow'], '↓': ['&darr;', 'down arrow'],
        '♠': ['&spades;', 'spade'], '♣': ['&clubs;', 'club'],
        '♥': ['&hearts;', 'heart'], '♦': ['&diams;', 'diamond'],
        '…': ['&hellip;', 'ellipsis'], '—': ['&mdash;', 'em dash'], '–': ['&ndash;', 'en dash'],
        '•': ['&bull;', 'bullet'], '∞': ['&infin;', 'infinity'],
        '√': ['&radic;', 'square root'], '≈': ['&asymp;', 'approximately'],
        '≠': ['&ne;', 'not equal'], '≤': ['&le;', 'less or equal'], '≥': ['&ge;', 'greater or equal'],
        '∑': ['&sum;', 'sum'], '∏': ['&prod;', 'product'], '∫': ['&int;', 'integral'],
        'α': ['&alpha;', 'alpha'], 'β': ['&beta;', 'beta'], 'γ': ['&gamma;', 'gamma'],
        'δ': ['&delta;', 'delta'], 'π': ['&pi;', 'pi'], 'σ': ['&sigma;', 'sigma'],
        'λ': ['&lambda;', 'lambda'], 'μ': ['&mu;', 'mu'], 'θ': ['&theta;', 'theta'],
      }
      const t = input.trim().toLowerCase()
      if (!t) {
        return Object.entries(entities).map(([char, [entity, name]]) =>
          `${char.padEnd(3)} ${entity.padEnd(12)} ${name}`
        ).join('\n')
      }
      // Search by character, entity, or name
      const results = Object.entries(entities).filter(([char, [entity, name]]) =>
        char === input.trim() || entity.toLowerCase().includes(t) || name.includes(t)
      )
      if (results.length === 0) return `(no matching entities for "${input.trim()}")`
      return results.map(([char, [entity, name]]) =>
        `${char}  ${entity.padEnd(12)} &#${char.codePointAt(0)};  ${name}`
      ).join('\n')
    },
  },
  {
    id: 'json-to-env',
    name: 'JSON → .env',
    category: 'data',
    description: 'Convert a JSON object to .env file format',
    convert: (input) => {
      try {
        const obj = JSON.parse(input.trim())
        if (typeof obj !== 'object' || Array.isArray(obj)) return '(expected a JSON object)'
        return Object.entries(obj).map(([key, val]) => {
          const envKey = key.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase()
          const envVal = typeof val === 'string' ? (val.includes(' ') || val.includes('"') ? `"${val.replace(/"/g, '\\"')}"` : val) : String(val)
          return `${envKey}=${envVal}`
        }).join('\n')
      } catch {
        return '(invalid JSON)'
      }
    },
  },
  {
    id: 'endian-swap',
    name: 'Endianness Swap',
    category: 'encode',
    description: 'Swap byte order (little-endian ↔ big-endian) — enter hex bytes',
    placeholder: 'DEADBEEF',
    convert: (input) => {
      const hex = input.trim().replace(/\s+/g, '').replace(/^0x/i, '')
      if (!/^[0-9a-fA-F]+$/.test(hex) || hex.length % 2 !== 0) return '(enter an even number of hex digits like DEADBEEF)'
      const bytes = hex.match(/.{2}/g) || []
      const swapped = [...bytes].reverse().join('')
      return [
        `Input (big-endian):    0x${hex.toUpperCase()}`,
        `Swapped (little-end):  0x${swapped.toUpperCase()}`,
        '',
        `Bytes: ${bytes.join(' ')} → ${[...bytes].reverse().join(' ')}`,
        `Decimal: ${parseInt(hex, 16)}`,
      ].join('\n')
    },
  },
  {
    id: 'json-to-graphql',
    name: 'JSON to GraphQL Type',
    category: 'data',
    description: 'Generate a GraphQL type definition from a JSON object',
    placeholder: '{"name": "Alice", "age": 30, "active": true}',
    convert: (input) => {
      try {
        const obj = JSON.parse(input.trim())
        function gqlType(val, name) {
          if (val === null) return 'String'
          if (typeof val === 'string') return 'String'
          if (typeof val === 'number') return Number.isInteger(val) ? 'Int' : 'Float'
          if (typeof val === 'boolean') return 'Boolean'
          if (Array.isArray(val)) {
            if (val.length === 0) return '[String]'
            return `[${gqlType(val[0], name)}]`
          }
          if (typeof val === 'object') return capitalize(name)
          return 'String'
        }
        function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1) }
        const types = []
        function emit(obj, typeName) {
          const fields = Object.entries(obj).map(([k, v]) => {
            const type = gqlType(v, k)
            if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
              emit(v, capitalize(k))
            }
            if (Array.isArray(v) && v.length > 0 && typeof v[0] === 'object') {
              emit(v[0], capitalize(k))
            }
            return `  ${k}: ${type}`
          })
          types.push(`type ${typeName} {\n${fields.join('\n')}\n}`)
        }
        emit(obj, 'Root')
        return types.reverse().join('\n\n')
      } catch {
        return '(invalid JSON)'
      }
    },
  },
  {
    id: 'unicode-lookup',
    name: 'Unicode Lookup',
    category: 'encode',
    description: 'Show Unicode details for each character in text',
    convert: (input) => {
      if (!input) return ''
      const chars = Array.from(input)
      if (chars.length > 50) return `(showing first 50 of ${chars.length} characters)\n\n` +
        Array.from(input.slice(0, 50)).map(c => {
          const cp = c.codePointAt(0)
          const hex = cp.toString(16).toUpperCase().padStart(4, '0')
          const utf8 = new TextEncoder().encode(c)
          const utf8Hex = Array.from(utf8).map(b => b.toString(16).toUpperCase().padStart(2, '0')).join(' ')
          return `${c}  U+${hex}  UTF-8: ${utf8Hex}`
        }).join('\n')
      return chars.map(c => {
        const cp = c.codePointAt(0)
        const hex = cp.toString(16).toUpperCase().padStart(4, '0')
        const utf8 = new TextEncoder().encode(c)
        const utf8Hex = Array.from(utf8).map(b => b.toString(16).toUpperCase().padStart(2, '0')).join(' ')
        const dec = cp
        return `${c}  U+${hex}  Dec: ${dec}  UTF-8: ${utf8Hex}  HTML: &#${dec};`
      }).join('\n')
    },
  },
  {
    id: 'text-encoding-view',
    name: 'Text Encoding Viewer',
    category: 'encode',
    description: 'Show how text is encoded in UTF-8 bytes with hex and decimal representation',
    convert: (input) => {
      if (!input) return ''
      const utf8 = new TextEncoder().encode(input)
      const hex = Array.from(utf8).map(b => b.toString(16).toUpperCase().padStart(2, '0'))
      const dec = Array.from(utf8)
      return [
        `Text:     ${input.slice(0, 100)}${input.length > 100 ? '...' : ''}`,
        `Length:   ${input.length} characters, ${utf8.length} bytes`,
        '',
        `UTF-8 Hex:`,
        `  ${hex.join(' ')}`,
        '',
        `UTF-8 Dec:`,
        `  ${dec.join(' ')}`,
        '',
        `UTF-8 Binary:`,
        `  ${Array.from(utf8).map(b => b.toString(2).padStart(8, '0')).join(' ')}`,
      ].join('\n')
    },
  },
  {
    id: 'json-to-python',
    name: 'JSON → Python Dict',
    category: 'data',
    description: 'Convert JSON to Python dictionary literal syntax',
    convert: (input) => {
      const obj = JSON.parse(input)
      function toPython(val, indent = 0) {
        const pad = '    '.repeat(indent)
        const pad1 = '    '.repeat(indent + 1)
        if (val === null) return 'None'
        if (val === true) return 'True'
        if (val === false) return 'False'
        if (typeof val === 'string') return JSON.stringify(val)
        if (typeof val === 'number') return String(val)
        if (Array.isArray(val)) {
          if (val.length === 0) return '[]'
          const items = val.map(v => pad1 + toPython(v, indent + 1))
          return '[\n' + items.join(',\n') + '\n' + pad + ']'
        }
        if (typeof val === 'object') {
          const entries = Object.entries(val)
          if (entries.length === 0) return '{}'
          const items = entries.map(([k, v]) => pad1 + JSON.stringify(k) + ': ' + toPython(v, indent + 1))
          return '{\n' + items.join(',\n') + '\n' + pad + '}'
        }
        return String(val)
      }
      return toPython(obj)
    },
  },
  {
    id: 'json-to-php',
    name: 'JSON → PHP Array',
    category: 'data',
    description: 'Convert JSON to PHP array syntax',
    convert: (input) => {
      const obj = JSON.parse(input)
      function toPhp(val, indent = 0) {
        const pad = '    '.repeat(indent)
        const pad1 = '    '.repeat(indent + 1)
        if (val === null) return 'null'
        if (val === true) return 'true'
        if (val === false) return 'false'
        if (typeof val === 'string') return "'" + val.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'"
        if (typeof val === 'number') return String(val)
        if (Array.isArray(val)) {
          if (val.length === 0) return '[]'
          const items = val.map(v => pad1 + toPhp(v, indent + 1))
          return '[\n' + items.join(',\n') + ',\n' + pad + ']'
        }
        if (typeof val === 'object') {
          const entries = Object.entries(val)
          if (entries.length === 0) return '[]'
          const items = entries.map(([k, v]) => pad1 + "'" + k.replace(/'/g, "\\'") + "' => " + toPhp(v, indent + 1))
          return '[\n' + items.join(',\n') + ',\n' + pad + ']'
        }
        return String(val)
      }
      return toPhp(obj)
    },
  },
  {
    id: 'json-to-typescript',
    name: 'JSON → TypeScript Interface',
    category: 'data',
    description: 'Generate TypeScript interfaces from JSON data',
    convert: (input) => {
      const obj = JSON.parse(input)
      const interfaces = []
      function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1) }
      function tsType(val, name) {
        if (val === null) return 'null'
        if (typeof val === 'string') return 'string'
        if (typeof val === 'number') return Number.isInteger(val) ? 'number' : 'number'
        if (typeof val === 'boolean') return 'boolean'
        if (Array.isArray(val)) {
          if (val.length === 0) return 'unknown[]'
          const inner = tsType(val[0], name)
          return inner + '[]'
        }
        if (typeof val === 'object') {
          const iName = capitalize(name)
          emit(val, iName)
          return iName
        }
        return 'unknown'
      }
      function emit(o, typeName) {
        const fields = Object.entries(o).map(([k, v]) => `  ${k}: ${tsType(v, k)};`)
        interfaces.push(`interface ${typeName} {\n${fields.join('\n')}\n}`)
      }
      emit(obj, 'Root')
      return interfaces.reverse().join('\n\n')
    },
  },
  {
    id: 'sql-format',
    name: 'SQL Formatter',
    category: 'utility',
    description: 'Beautify SQL queries with proper indentation and line breaks',
    convert: (input) => {
      const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN',
        'OUTER JOIN', 'FULL JOIN', 'CROSS JOIN', 'ON', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET',
        'UNION', 'UNION ALL', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE',
        'ALTER TABLE', 'DROP TABLE', 'AS', 'IN', 'NOT', 'NULL', 'IS', 'LIKE', 'BETWEEN', 'EXISTS',
        'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'ASC', 'DESC', 'DISTINCT', 'INTO', 'WITH']
      const majorKw = new Set(['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT',
        'UNION', 'UNION ALL', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM',
        'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE', 'WITH'])
      const indentKw = new Set(['AND', 'OR', 'ON', 'WHEN', 'ELSE'])

      // Normalize whitespace
      let sql = input.replace(/\s+/g, ' ').trim()

      // Uppercase keywords
      for (const kw of keywords) {
        const re = new RegExp('\\b' + kw.replace(/ /g, '\\s+') + '\\b', 'gi')
        sql = sql.replace(re, kw)
      }

      // Split at major keywords
      let result = ''
      const tokens = sql.split(/\b/)
      let i = 0
      while (i < tokens.length) {
        const token = tokens[i]
        const upper = token.trim().toUpperCase()

        // Check for 2-word keywords
        let twoWord = ''
        if (i + 2 < tokens.length) {
          twoWord = (token + tokens[i + 1] + tokens[i + 2]).trim().toUpperCase()
        }

        if (majorKw.has(twoWord)) {
          result += '\n' + twoWord
          i += 3
          continue
        }
        if (majorKw.has(upper)) {
          result += '\n' + upper
          i++
          continue
        }
        if (indentKw.has(upper)) {
          result += '\n  ' + upper
          i++
          continue
        }
        result += token
        i++
      }

      return result.trim().split('\n').map(l => l.trimEnd()).join('\n')
    },
  },
  {
    id: 'sql-minify',
    name: 'SQL Minifier',
    category: 'utility',
    description: 'Compress SQL queries to a single line',
    convert: (input) => {
      return input
        .replace(/--[^\n]*/g, '')       // remove line comments
        .replace(/\/\*[\s\S]*?\*\//g, '') // remove block comments
        .replace(/\s+/g, ' ')            // collapse whitespace
        .trim()
    },
  },
  {
    id: 'json-path',
    name: 'JSON Path Extractor',
    category: 'data',
    description: 'Extract values from JSON using dot notation — separate path and JSON with "---"',
    placeholder: '$.users[0].name\n---\n{"users": [{"name": "Alice"}, {"name": "Bob"}]}',
    convert: (input) => {
      const sep = input.indexOf('\n---\n')
      if (sep === -1) return '(put the path on the first line, then "---", then the JSON)'
      const path = input.slice(0, sep).trim()
      const json = JSON.parse(input.slice(sep + 5))

      function extract(obj, pathStr) {
        const parts = pathStr
          .replace(/^\$\.?/, '')
          .split(/\.|\[(\d+)\]/)
          .filter(Boolean)

        let current = obj
        for (const part of parts) {
          if (current == null) return undefined
          current = current[isNaN(part) ? part : parseInt(part)]
        }
        return current
      }

      const result = extract(json, path)
      if (result === undefined) return '(no match found)'
      return typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result)
    },
  },
  {
    id: 'csv-to-html-table',
    name: 'CSV → HTML Table',
    category: 'data',
    description: 'Convert CSV or TSV data into an HTML table',
    convert: (input) => {
      const lines = input.trim().split('\n')
      if (lines.length === 0) return ''
      const delim = input.includes('\t') ? '\t' : ','
      const rows = lines.map(l => l.split(delim).map(c => c.trim().replace(/^"|"$/g, '')))

      const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      let html = '<table>\n'
      html += '  <thead>\n    <tr>\n'
      html += rows[0].map(c => `      <th>${esc(c)}</th>`).join('\n') + '\n'
      html += '    </tr>\n  </thead>\n'

      if (rows.length > 1) {
        html += '  <tbody>\n'
        for (let i = 1; i < rows.length; i++) {
          html += '    <tr>\n'
          html += rows[i].map(c => `      <td>${esc(c)}</td>`).join('\n') + '\n'
          html += '    </tr>\n'
        }
        html += '  </tbody>\n'
      }
      html += '</table>'
      return html
    },
  },
  {
    id: 'html-to-markdown',
    name: 'HTML → Markdown',
    category: 'utility',
    description: 'Convert simple HTML to Markdown',
    convert: (input) => {
      let md = input
        // headers
        .replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi, (_, n, c) => '#'.repeat(parseInt(n)) + ' ' + c.trim() + '\n\n')
        // bold/strong
        .replace(/<(b|strong)[^>]*>([\s\S]*?)<\/\1>/gi, '**$2**')
        // italic/em
        .replace(/<(i|em)[^>]*>([\s\S]*?)<\/\1>/gi, '*$2*')
        // code
        .replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, '`$1`')
        // links
        .replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)')
        // images
        .replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '![$2]($1)')
        .replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, '![]($1)')
        // line breaks
        .replace(/<br\s*\/?>/gi, '\n')
        // paragraphs
        .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '$1\n\n')
        // lists
        .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n')
        .replace(/<\/?[uo]l[^>]*>/gi, '\n')
        // blockquote
        .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, c) => c.trim().split('\n').map(l => '> ' + l).join('\n') + '\n\n')
        // hr
        .replace(/<hr\s*\/?>/gi, '---\n\n')
        // pre
        .replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, '```\n$1\n```\n\n')
        // strip remaining tags
        .replace(/<[^>]+>/g, '')
        // decode entities
        .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
        // clean up extra newlines
        .replace(/\n{3,}/g, '\n\n')
        .trim()
      return md
    },
  },
  {
    id: 'base64url-encode',
    name: 'Base64URL Encode',
    category: 'encode',
    description: 'Encode text to URL-safe Base64 (RFC 4648)',
    convert: (input) => {
      const encoded = utf8ToBase64(input)
      if (encoded.error) return encoded.error
      return encoded.value.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    },
  },
  {
    id: 'base64url-decode',
    name: 'Base64URL Decode',
    category: 'encode',
    description: 'Decode URL-safe Base64 back to text',
    convert: (input) => {
      let s = input.replace(/-/g, '+').replace(/_/g, '/')
      while (s.length % 4) s += '='
      const decoded = base64ToUtf8(s)
      if (decoded.error) return decoded.error
      return decoded.value
    },
  },
  {
    id: 'backslash-escape',
    name: 'Backslash Escape',
    category: 'encode',
    description: 'Escape special characters with backslashes (for shell, regex, etc.)',
    convert: (input) => {
      return input.replace(/[\n\r\t\\/"'`$!&|;(){}[\]<>*?#~= ]/g, (c) => {
        const map = { '\n': '\\n', '\r': '\\r', '\t': '\\t' }
        return map[c] || '\\' + c
      })
    },
  },
  {
    id: 'backslash-unescape',
    name: 'Backslash Unescape',
    category: 'encode',
    description: 'Unescape backslash sequences back to their literal characters',
    convert: (input) => {
      return input.replace(/\\(.)/g, (_, c) => {
        const map = { n: '\n', r: '\r', t: '\t', '0': '\0' }
        return map[c] || c
      })
    },
  },
  {
    id: 'punycode-encode',
    name: 'Punycode Encode',
    category: 'encode',
    description: 'Encode international domain names to Punycode (ACE form)',
    convert: (input) => {
      // Simple punycode encoder for domain labels
      const labels = input.split('.')
      return labels.map(label => {
        if (label.split('').every(c => c.charCodeAt(0) < 128)) return label
        // Use URL API trick for encoding
        try {
          const url = new URL('http://' + label + '.example')
          return url.hostname.split('.')[0]
        } catch {
          return label
        }
      }).join('.')
    },
  },
  {
    id: 'punycode-decode',
    name: 'Punycode Decode',
    category: 'encode',
    description: 'Decode Punycode (xn--) domain names to Unicode',
    convert: (input) => {
      const labels = input.split('.')
      return labels.map(label => {
        if (!label.startsWith('xn--')) return label
        try {
          const url = new URL('http://' + label + '.example')
          // The URL API gives us the decoded hostname
          const decoded = url.hostname.split('.')[0]
          return decoded
        } catch {
          return label
        }
      }).join('.')
    },
  },
  {
    id: 'number-words',
    name: 'Number to Words',
    category: 'utility',
    description: 'Convert numbers to English words (e.g., 42 → forty-two)',
    convert: (input) => {
      const n = parseInt(input.trim())
      if (isNaN(n)) return '(enter a number)'
      if (n === 0) return 'zero'

      const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
        'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
      const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
      const scales = ['', 'thousand', 'million', 'billion', 'trillion']

      function chunk(num) {
        if (num === 0) return ''
        if (num < 20) return ones[num]
        if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? '-' + ones[num % 10] : '')
        return ones[Math.floor(num / 100)] + ' hundred' + (num % 100 ? ' and ' + chunk(num % 100) : '')
      }

      const neg = n < 0
      let abs = Math.abs(n)
      const parts = []
      let scaleIdx = 0
      while (abs > 0) {
        const rem = abs % 1000
        if (rem > 0) parts.unshift(chunk(rem) + (scales[scaleIdx] ? ' ' + scales[scaleIdx] : ''))
        abs = Math.floor(abs / 1000)
        scaleIdx++
      }
      return (neg ? 'negative ' : '') + parts.join(', ')
    },
  },
  {
    id: 'markdown-to-html',
    name: 'Markdown → HTML',
    category: 'utility',
    description: 'Convert basic Markdown to HTML',
    convert: (input) => {
      let html = input
        // code blocks
        .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
        // inline code
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        // headers
        .replace(/^######\s+(.+)$/gm, '<h6>$1</h6>')
        .replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>')
        .replace(/^####\s+(.+)$/gm, '<h4>$1</h4>')
        .replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')
        .replace(/^##\s+(.+)$/gm, '<h2>$1</h2>')
        .replace(/^#\s+(.+)$/gm, '<h1>$1</h1>')
        // bold + italic
        .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
        // bold
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        // italic
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        // links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
        // images
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">')
        // hr
        .replace(/^---+$/gm, '<hr>')
        // blockquote
        .replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>')
        // unordered list items
        .replace(/^[-*]\s+(.+)$/gm, '<li>$1</li>')
        // paragraphs (lines not already tagged)
        .replace(/^(?!<[a-z])((?!<\/)[^\n]+)$/gm, '<p>$1</p>')
        // clean up adjacent blockquotes and list items
        .replace(/<\/blockquote>\n<blockquote>/g, '\n')
        .replace(/<\/li>\n<li>/g, '</li>\n<li>')
      return html.trim()
    },
  },
  {
    id: 'json-schema-validate',
    name: 'JSON Schema Validator',
    category: 'data',
    description: 'Validate JSON against a schema — put schema first, then "---", then JSON',
    placeholder: '{"type":"object","properties":{"name":{"type":"string"}},"required":["name"]}\n---\n{"name":"Alice"}',
    convert: (input) => {
      const sep = input.indexOf('\n---\n')
      if (sep === -1) return '(put the JSON Schema first, then a line with "---", then the JSON to validate)'
      const schema = JSON.parse(input.slice(0, sep))
      const data = JSON.parse(input.slice(sep + 5))

      const errors = []
      function validate(val, sch, path) {
        if (!sch || typeof sch !== 'object') return
        // type check
        if (sch.type) {
          const types = Array.isArray(sch.type) ? sch.type : [sch.type]
          const actual = val === null ? 'null' : Array.isArray(val) ? 'array' : typeof val
          if (!types.includes(actual)) errors.push(`${path}: expected ${types.join('|')}, got ${actual}`)
        }
        // required
        if (sch.required && typeof val === 'object' && val !== null) {
          for (const r of sch.required) {
            if (!(r in val)) errors.push(`${path}: missing required property "${r}"`)
          }
        }
        // properties
        if (sch.properties && typeof val === 'object' && val !== null && !Array.isArray(val)) {
          for (const [k, sub] of Object.entries(sch.properties)) {
            if (k in val) validate(val[k], sub, path + '.' + k)
          }
        }
        // items (array)
        if (sch.items && Array.isArray(val)) {
          val.forEach((item, idx) => validate(item, sch.items, path + '[' + idx + ']'))
        }
        // enum
        if (sch.enum && !sch.enum.includes(val)) errors.push(`${path}: value not in enum [${sch.enum.join(', ')}]`)
        // minLength/maxLength
        if (typeof val === 'string') {
          if (sch.minLength !== undefined && val.length < sch.minLength) errors.push(`${path}: string too short (min ${sch.minLength})`)
          if (sch.maxLength !== undefined && val.length > sch.maxLength) errors.push(`${path}: string too long (max ${sch.maxLength})`)
          if (sch.pattern) {
            if (sch.pattern.length > REGEX_PATTERN_MAX_LENGTH) {
              errors.push(`${path}: pattern too long (max ${REGEX_PATTERN_MAX_LENGTH})`)
            } else {
              try {
                if (!new RegExp(sch.pattern).test(val)) errors.push(`${path}: pattern mismatch /${sch.pattern}/`)
              } catch (e) {
                errors.push(`${path}: invalid pattern /${sch.pattern}/ (${e.message})`)
              }
            }
          }
        }
        // minimum/maximum
        if (typeof val === 'number') {
          if (sch.minimum !== undefined && val < sch.minimum) errors.push(`${path}: ${val} < minimum ${sch.minimum}`)
          if (sch.maximum !== undefined && val > sch.maximum) errors.push(`${path}: ${val} > maximum ${sch.maximum}`)
        }
      }
      validate(data, schema, '$')

      if (errors.length === 0) return 'Valid! JSON matches the schema.'
      return `Invalid — ${errors.length} error(s):\n\n` + errors.map(e => '  ' + e).join('\n')
    },
  },
  {
    id: 'epoch-batch',
    name: 'Epoch Batch Converter',
    category: 'utility',
    description: 'Convert multiple timestamps/dates at once (one per line). Auto-detects direction.',
    placeholder: '1700000000\n2024-01-15T12:00:00Z\n1609459200\nJan 1, 2023',
    convert: (input) => {
      return input.trim().split('\n').map(line => {
        const s = line.trim()
        if (!s) return ''
        // check if it looks like a unix timestamp (all digits, optionally with leading -)
        if (/^-?\d{1,13}$/.test(s)) {
          const ms = s.length <= 10 ? parseInt(s) * 1000 : parseInt(s)
          const d = new Date(ms)
          if (isNaN(d.getTime())) return `${s}  →  (invalid)`
          return `${s}  →  ${d.toISOString()}  (${d.toUTCString()})`
        }
        // try to parse as date string
        const d = new Date(s)
        if (isNaN(d.getTime())) return `${s}  →  (could not parse)`
        const epoch = Math.floor(d.getTime() / 1000)
        return `${s}  →  ${epoch}  (Unix timestamp)`
      }).join('\n')
    },
  },
  {
    id: 'semver-compare',
    name: 'Semver Compare',
    category: 'utility',
    description: 'Compare two semantic versions (one per line). Shows which is newer.',
    placeholder: '2.1.0\n2.0.5-beta.1',
    convert: (input) => {
      const lines = input.trim().split('\n').map(l => l.trim()).filter(Boolean)
      if (lines.length < 2) return '(enter two versions, one per line)'

      function parse(v) {
        const m = v.match(/^v?(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z0-9.]+))?(?:\+([a-zA-Z0-9.]+))?$/)
        if (!m) return null
        return { major: parseInt(m[1]), minor: parseInt(m[2]), patch: parseInt(m[3]), pre: m[4] || '', build: m[5] || '', raw: v }
      }

      const a = parse(lines[0])
      const b = parse(lines[1])
      if (!a) return `"${lines[0]}" is not a valid semver`
      if (!b) return `"${lines[1]}" is not a valid semver`

      function compare(x, y) {
        if (x.major !== y.major) return x.major - y.major
        if (x.minor !== y.minor) return x.minor - y.minor
        if (x.patch !== y.patch) return x.patch - y.patch
        if (!x.pre && y.pre) return 1    // no pre-release > has pre-release
        if (x.pre && !y.pre) return -1
        return x.pre < y.pre ? -1 : x.pre > y.pre ? 1 : 0
      }

      const cmp = compare(a, b)
      const relation = cmp > 0 ? `${a.raw} is NEWER` : cmp < 0 ? `${b.raw} is NEWER` : 'They are EQUAL'

      return [
        `Version A: ${a.raw}`,
        `  Major: ${a.major}  Minor: ${a.minor}  Patch: ${a.patch}${a.pre ? '  Pre: ' + a.pre : ''}${a.build ? '  Build: ' + a.build : ''}`,
        '',
        `Version B: ${b.raw}`,
        `  Major: ${b.major}  Minor: ${b.minor}  Patch: ${b.patch}${b.pre ? '  Pre: ' + b.pre : ''}${b.build ? '  Build: ' + b.build : ''}`,
        '',
        `Result: ${relation}`,
        cmp !== 0 ? `Diff: ${Math.abs(a.major - b.major)} major, ${Math.abs(a.minor - b.minor)} minor, ${Math.abs(a.patch - b.patch)} patch` : '',
      ].filter(Boolean).join('\n')
    },
  },
  {
    id: 'url-parse',
    name: 'URL Parser',
    category: 'utility',
    description: 'Parse a URL into its components: protocol, host, path, query params, etc.',
    convert: (input) => {
      let urlStr = input.trim()
      if (!urlStr.includes('://')) urlStr = 'https://' + urlStr
      const url = new URL(urlStr)

      const params = [...url.searchParams.entries()]
      const paramLines = params.length > 0
        ? params.map(([k, v]) => `  ${k} = ${v}`).join('\n')
        : '  (none)'

      return [
        `Full URL:   ${url.href}`,
        `Protocol:   ${url.protocol}`,
        `Host:       ${url.host}`,
        `Hostname:   ${url.hostname}`,
        url.port ? `Port:       ${url.port}` : `Port:       (default)`,
        `Pathname:   ${url.pathname}`,
        `Search:     ${url.search || '(none)'}`,
        `Hash:       ${url.hash || '(none)'}`,
        url.username ? `Username:   ${url.username}` : '',
        url.password ? `Password:   ${url.password}` : '',
        `Origin:     ${url.origin}`,
        '',
        `Query params:`,
        paramLines,
      ].filter(l => l !== '').join('\n')
    },
  },
  {
    id: 'url-builder',
    name: 'URL Builder',
    category: 'utility',
    description: 'Build a URL from components — enter key=value pairs, one per line',
    placeholder: 'base=https://api.example.com/v1/users\npage=1\nlimit=20\nsort=name\norder=asc',
    convert: (input) => {
      const lines = input.trim().split('\n').map(l => l.trim()).filter(Boolean)
      const params = {}
      let base = ''
      for (const line of lines) {
        const eq = line.indexOf('=')
        if (eq === -1) continue
        const key = line.slice(0, eq).trim()
        const val = line.slice(eq + 1).trim()
        if (key.toLowerCase() === 'base' || key.toLowerCase() === 'url') {
          base = val
        } else {
          params[key] = val
        }
      }
      if (!base) return '(add a line like: base=https://example.com/path)'
      const url = new URL(base)
      for (const [k, v] of Object.entries(params)) {
        url.searchParams.set(k, v)
      }
      return url.toString()
    },
  },
  {
    id: 'data-uri',
    name: 'Data URI Generator',
    category: 'encode',
    description: 'Generate a data URI from text with specified MIME type (default: text/plain)',
    placeholder: 'mime=text/html\n---\n<h1>Hello World</h1>',
    convert: (input) => {
      let mime = 'text/plain'
      let content = input
      const sep = input.indexOf('\n---\n')
      if (sep !== -1) {
        const header = input.slice(0, sep).trim()
        const mimeMatch = header.match(/mime\s*=\s*(.+)/)
        if (mimeMatch) mime = mimeMatch[1].trim()
        content = input.slice(sep + 5)
      }
      const encoded = utf8ToBase64(content)
      if (encoded.error) return encoded.error
      return `data:${mime};base64,${encoded.value}`
    },
  },
  {
    id: 'ipv6-expand',
    name: 'IPv6 Expand',
    category: 'utility',
    description: 'Expand an abbreviated IPv6 address to its full form',
    convert: (input) => {
      let addr = input.trim().toLowerCase()
      // Handle :: expansion
      if (addr.includes('::')) {
        const parts = addr.split('::')
        const left = parts[0] ? parts[0].split(':') : []
        const right = parts[1] ? parts[1].split(':') : []
        const fill = 8 - left.length - right.length
        const mid = Array(fill).fill('0000')
        addr = [...left, ...mid, ...right].join(':')
      }
      return addr.split(':').map(g => g.padStart(4, '0')).join(':')
    },
  },
  {
    id: 'ipv6-compress',
    name: 'IPv6 Compress',
    category: 'utility',
    description: 'Compress a full IPv6 address to its shortest form',
    convert: (input) => {
      const groups = input.trim().toLowerCase().split(':').map(g => g.replace(/^0+/, '') || '0')
      // Find longest run of 0s
      let bestStart = -1, bestLen = 0, curStart = -1, curLen = 0
      for (let i = 0; i < groups.length; i++) {
        if (groups[i] === '0') {
          if (curStart === -1) curStart = i
          curLen++
          if (curLen > bestLen) { bestLen = curLen; bestStart = curStart }
        } else {
          curStart = -1; curLen = 0
        }
      }
      if (bestLen > 1) {
        const before = groups.slice(0, bestStart).join(':')
        const after = groups.slice(bestStart + bestLen).join(':')
        return (before || '') + '::' + (after || '')
      }
      return groups.join(':')
    },
  },
  {
    id: 'md-table-to-csv',
    name: 'Markdown Table → CSV',
    category: 'data',
    description: 'Convert a Markdown pipe-delimited table to CSV',
    convert: (input) => {
      const lines = input.trim().split('\n').filter(l => l.trim())
      const dataLines = lines.filter(l => !/^\s*\|?\s*[-:]+/.test(l)) // skip separator rows
      return dataLines.map(line => {
        return line
          .replace(/^\s*\|/, '')    // strip leading pipe
          .replace(/\|\s*$/, '')    // strip trailing pipe
          .split('|')
          .map(cell => {
            const trimmed = cell.trim()
            // quote if contains comma or quote
            if (trimmed.includes(',') || trimmed.includes('"')) {
              return '"' + trimmed.replace(/"/g, '""') + '"'
            }
            return trimmed
          })
          .join(',')
      }).join('\n')
    },
  },
  {
    id: 'csv-to-md-table',
    name: 'CSV → Markdown Table',
    category: 'data',
    description: 'Convert CSV data to a Markdown pipe-delimited table',
    convert: (input) => {
      const lines = input.trim().split('\n')
      const rows = lines.map(l => {
        const cells = []
        let cell = '', inQuote = false
        for (const ch of l) {
          if (ch === '"') { inQuote = !inQuote; continue }
          if (ch === ',' && !inQuote) { cells.push(cell.trim()); cell = ''; continue }
          cell += ch
        }
        cells.push(cell.trim())
        return cells
      })
      if (rows.length === 0) return ''
      const maxCols = Math.max(...rows.map(r => r.length))
      const padded = rows.map(r => {
        while (r.length < maxCols) r.push('')
        return r
      })
      // compute column widths
      const widths = Array(maxCols).fill(0)
      for (const row of padded) {
        row.forEach((c, i) => { widths[i] = Math.max(widths[i], c.length) })
      }
      const formatRow = (row) => '| ' + row.map((c, i) => c.padEnd(widths[i])).join(' | ') + ' |'
      const header = formatRow(padded[0])
      const sep = '| ' + widths.map(w => '-'.repeat(w)).join(' | ') + ' |'
      const body = padded.slice(1).map(formatRow)
      return [header, sep, ...body].join('\n')
    },
  },
  {
    id: 'curl-builder',
    name: 'Request → curl',
    category: 'utility',
    description: 'Build a curl command from request details. Enter method, URL, headers, body.',
    placeholder: 'method=POST\nurl=https://api.example.com/users\ncontent-type: application/json\nauthorization: Bearer token123\n---\n{"name": "Alice"}',
    convert: (input) => {
      const sep = input.indexOf('\n---\n')
      const header = sep !== -1 ? input.slice(0, sep) : input
      const body = sep !== -1 ? input.slice(sep + 5).trim() : ''

      const lines = header.trim().split('\n')
      let method = 'GET', url = ''
      const headers = []

      for (const line of lines) {
        const l = line.trim()
        if (l.match(/^method\s*=/i)) { method = l.split('=')[1].trim().toUpperCase(); continue }
        if (l.match(/^url\s*=/i)) { url = l.split('=').slice(1).join('=').trim(); continue }
        if (l.includes(':')) headers.push(l)
      }

      if (!url) return '(add url=https://... on a line)'

      const parts = [`curl -X ${method}`]
      parts.push(`  '${url}'`)
      for (const h of headers) {
        parts.push(`  -H '${h}'`)
      }
      if (body) {
        parts.push(`  -d '${body.replace(/'/g, "'\\''")}'`)
      }
      return parts.join(' \\\n')
    },
  },
  {
    id: 'curl-to-fetch',
    name: 'curl → fetch()',
    category: 'utility',
    description: 'Convert a curl command to JavaScript fetch() code',
    convert: (input) => {
      const s = input.replace(/\\\n/g, ' ').trim()
      let method = 'GET', url = '', headers = {}, body = ''

      // Extract URL (first quoted or unquoted URL-like string after curl)
      const urlMatch = s.match(/curl\s+(?:-\w+\s+)*['"]?(https?:\/\/[^\s'"]+)['"]?/)
      if (urlMatch) url = urlMatch[1]

      // Extract -X METHOD
      const methodMatch = s.match(/-X\s+(\w+)/)
      if (methodMatch) method = methodMatch[1].toUpperCase()

      // Extract headers (-H)
      const headerMatches = s.matchAll(/-H\s+['"]([^'"]+)['"]/g)
      for (const m of headerMatches) {
        const colon = m[1].indexOf(':')
        if (colon > -1) {
          headers[m[1].slice(0, colon).trim()] = m[1].slice(colon + 1).trim()
        }
      }

      // Extract body (-d / --data)
      const bodyMatch = s.match(/-d\s+['"]([^'"]+)['"]/) || s.match(/--data\s+['"]([^'"]+)['"]/)
      if (bodyMatch) { body = bodyMatch[1]; if (method === 'GET') method = 'POST' }

      const opts = []
      if (method !== 'GET') opts.push(`  method: '${method}',`)
      if (Object.keys(headers).length) {
        opts.push(`  headers: ${JSON.stringify(headers, null, 4).replace(/\n/g, '\n  ')},`)
      }
      if (body) {
        opts.push(`  body: ${/^[{[]/.test(body.trim()) ? `JSON.stringify(${body})` : `'${body}'`},`)
      }

      if (opts.length === 0) return `fetch('${url}')`
      return `fetch('${url}', {\n${opts.join('\n')}\n})`
    },
  },
  {
    id: 'text-dedup',
    name: 'Deduplicate Lines',
    category: 'utility',
    description: 'Remove duplicate lines from text (preserves first occurrence and order)',
    convert: (input) => {
      const seen = new Set()
      const lines = input.split('\n')
      const unique = lines.filter(l => {
        if (seen.has(l)) return false
        seen.add(l)
        return true
      })
      const removed = lines.length - unique.length
      return unique.join('\n') + (removed > 0 ? `\n\n--- ${removed} duplicate line(s) removed ---` : '')
    },
  },
  {
    id: 'line-sort',
    name: 'Sort Lines',
    category: 'utility',
    description: 'Sort lines alphabetically. Prefix with "r:" to reverse, "n:" for numeric sort.',
    convert: (input) => {
      let mode = 'alpha'
      let text = input
      if (text.startsWith('r:')) { mode = 'reverse'; text = text.slice(2) }
      else if (text.startsWith('n:')) { mode = 'numeric'; text = text.slice(2) }

      const lines = text.split('\n')
      if (mode === 'numeric') {
        lines.sort((a, b) => (parseFloat(a) || 0) - (parseFloat(b) || 0))
      } else {
        lines.sort((a, b) => a.localeCompare(b))
      }
      if (mode === 'reverse') lines.reverse()
      return lines.join('\n')
    },
  },
  {
    id: 'line-number',
    name: 'Add Line Numbers',
    category: 'utility',
    description: 'Add line numbers to each line of text',
    convert: (input) => {
      const lines = input.split('\n')
      const pad = String(lines.length).length
      return lines.map((l, i) => `${String(i + 1).padStart(pad)}  ${l}`).join('\n')
    },
  },
  {
    id: 'xml-format',
    name: 'XML/HTML Prettifier',
    category: 'utility',
    description: 'Format and indent XML or HTML with proper nesting',
    convert: (input) => {
      // Simple XML/HTML formatter
      const s = input.trim()
        .replace(/>\s*</g, '>\n<')   // put each tag on its own line
        .replace(/\n\s*\n/g, '\n')   // remove blank lines

      let indent = 0
      const step = '  '
      const lines = s.split('\n')
      const result = []

      for (const raw of lines) {
        const line = raw.trim()
        if (!line) continue

        // Closing tag
        if (line.match(/^<\/\w/)) indent = Math.max(0, indent - 1)

        result.push(step.repeat(indent) + line)

        // Self-closing or doctype or comment
        if (line.match(/\/>$/) || line.match(/^<\?/) || line.match(/^<!--/) || line.match(/^<!DOCTYPE/i)) {
          // no change
        }
        // Opening tag (not closing, not self-closing)
        else if (line.match(/^<\w[^>]*[^/]>/) && !line.match(/^<(br|hr|img|input|meta|link|area|base|col|embed|source|track|wbr)\b/i)) {
          indent++
        }
      }
      return result.join('\n')
    },
  },
  {
    id: 'xml-minify',
    name: 'XML/HTML Minifier',
    category: 'utility',
    description: 'Minify XML or HTML by removing unnecessary whitespace',
    convert: (input) => {
      return input
        .replace(/<!--[\s\S]*?-->/g, '')  // remove comments
        .replace(/>\s+</g, '><')           // remove whitespace between tags
        .replace(/\s+/g, ' ')             // collapse remaining whitespace
        .trim()
    },
  },
  {
    id: 'column-align',
    name: 'Column Aligner',
    category: 'utility',
    description: 'Align text into neat columns. Auto-detects delimiter (tab, |, comma, or spaces).',
    convert: (input) => {
      const lines = input.split('\n').filter(l => l.trim())
      if (lines.length === 0) return ''

      // detect delimiter
      const first = lines[0]
      let delim = '\t'
      if (first.includes('|')) delim = '|'
      else if (first.includes(',') && !first.includes('\t')) delim = ','
      else if (first.includes('\t')) delim = '\t'
      else delim = /\s{2,}/ // multiple spaces

      const rows = lines.map(l => {
        const parts = typeof delim === 'string'
          ? l.split(delim).map(c => c.trim())
          : l.split(delim).map(c => c.trim())
        return parts
      })

      const maxCols = Math.max(...rows.map(r => r.length))
      const widths = Array(maxCols).fill(0)
      for (const row of rows) {
        row.forEach((c, i) => { widths[i] = Math.max(widths[i], c.length) })
      }

      const sep = typeof delim === 'string' ? ` ${delim === '\t' ? '  ' : delim} ` : '  '
      return rows.map(row => {
        return row.map((c, i) => c.padEnd(widths[i] || 0)).join(sep).trimEnd()
      }).join('\n')
    },
  },
  {
    id: 'text-wrap',
    name: 'Word Wrap',
    category: 'utility',
    description: 'Wrap text at a specified width. First line: number (default 80). Rest: text to wrap.',
    placeholder: '60\n---\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    convert: (input) => {
      let width = 80
      let text = input
      const sep = input.indexOf('\n---\n')
      if (sep !== -1) {
        const num = parseInt(input.slice(0, sep).trim())
        if (!isNaN(num) && num > 0) width = num
        text = input.slice(sep + 5)
      }

      const words = text.split(/\s+/)
      const lines = []
      let current = ''

      for (const word of words) {
        if (current.length + word.length + 1 > width && current.length > 0) {
          lines.push(current)
          current = word
        } else {
          current = current ? current + ' ' + word : word
        }
      }
      if (current) lines.push(current)
      return lines.join('\n')
    },
  },
  {
    id: 'placeholder-image',
    name: 'Placeholder Image URL',
    category: 'utility',
    description: 'Generate placeholder image URLs. Enter WxH (e.g., 300x200)',
    convert: (input) => {
      const s = input.trim()
      const m = s.match(/(\d+)\s*[xX×]\s*(\d+)/)
      if (!m) return '(enter dimensions like: 300x200)'
      const w = m[1], h = m[2]
      return [
        `Placeholder services:`,
        '',
        `placehold.co:`,
        `  https://placehold.co/${w}x${h}`,
        `  https://placehold.co/${w}x${h}/333/fff`,
        '',
        `picsum.photos (random photo):`,
        `  https://picsum.photos/${w}/${h}`,
        '',
        `dummyimage.com:`,
        `  https://dummyimage.com/${w}x${h}/ccc/333`,
        '',
        `HTML placeholder:`,
        `  <img src="https://placehold.co/${w}x${h}" width="${w}" height="${h}" alt="Placeholder">`,
        '',
        `CSS placeholder:`,
        `  background: #ddd; width: ${w}px; height: ${h}px;`,
      ].join('\n')
    },
  },
  {
    id: 'css-unit',
    name: 'CSS Unit Converter',
    category: 'utility',
    description: 'Convert between CSS units (px, rem, em, pt, cm, in). Assumes 16px base.',
    convert: (input) => {
      const s = input.trim().toLowerCase()
      const m = s.match(/^([\d.]+)\s*(px|rem|em|pt|cm|in|mm|vw|vh|%)$/)
      if (!m) return '(enter a value with unit, e.g., 16px, 1rem, 12pt)'

      const val = parseFloat(m[1])
      const unit = m[2]
      const base = 16 // default root font size

      // Convert everything to px first
      const toPx = {
        px: val,
        rem: val * base,
        em: val * base,
        pt: val * (96 / 72),
        cm: val * (96 / 2.54),
        in: val * 96,
        mm: val * (96 / 25.4),
      }

      const px = toPx[unit]
      if (px === undefined) return `(cannot convert ${unit} without viewport/context info — try px, rem, em, pt, cm, in, mm)`

      const round = (n) => parseFloat(n.toFixed(4))

      return [
        `${val}${unit} =`,
        '',
        `  ${round(px)} px`,
        `  ${round(px / base)} rem`,
        `  ${round(px / base)} em`,
        `  ${round(px * 72 / 96)} pt`,
        `  ${round(px * 2.54 / 96)} cm`,
        `  ${round(px / 96)} in`,
        `  ${round(px * 25.4 / 96)} mm`,
        '',
        `(assumes ${base}px root font size)`,
      ].join('\n')
    },
  },
  {
    id: 'slug-gen',
    name: 'Slug Generator',
    category: 'utility',
    description: 'Convert text to URL-safe slugs',
    convert: (input) => {
      const lines = input.trim().split('\n')
      return lines.map(line => {
        const slug = line
          .toLowerCase()
          .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove diacritics
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '')
        return `${line.trim()}\n  → ${slug}`
      }).join('\n\n')
    },
  },
  {
    id: 'case-detect',
    name: 'Case Detector',
    category: 'utility',
    description: 'Detect the naming convention of a string',
    convert: (input) => {
      const s = input.trim()
      const results = []

      if (/^[a-z]+([A-Z][a-z]*)+$/.test(s)) results.push('camelCase')
      if (/^[A-Z][a-z]+([A-Z][a-z]*)+$/.test(s)) results.push('PascalCase')
      if (/^[a-z]+(_[a-z]+)+$/.test(s)) results.push('snake_case')
      if (/^[A-Z]+(_[A-Z]+)+$/.test(s)) results.push('SCREAMING_SNAKE_CASE')
      if (/^[a-z]+(-[a-z]+)+$/.test(s)) results.push('kebab-case')
      if (/^[A-Z]+-[A-Z]/.test(s)) results.push('SCREAMING-KEBAB-CASE')
      if (/^[a-z]+(\.[a-z]+)+$/.test(s)) results.push('dot.case')
      if (/^[A-Z][a-z]*(\s[A-Z][a-z]*)+$/.test(s)) results.push('Title Case')
      if (s === s.toUpperCase() && s !== s.toLowerCase()) results.push('UPPERCASE')
      if (s === s.toLowerCase() && /[a-z]/.test(s) && !/[_-]/.test(s)) results.push('lowercase')

      if (results.length === 0) results.push('No standard case detected')

      // Show conversions
      const base = s
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/[_\-./]/g, ' ')
        .toLowerCase()
        .trim()

      const words = base.split(/\s+/)

      return [
        `Input:  "${s}"`,
        `Detected: ${results.join(', ')}`,
        '',
        'Conversions:',
        `  camelCase:    ${words[0] + words.slice(1).map(w => w[0].toUpperCase() + w.slice(1)).join('')}`,
        `  PascalCase:   ${words.map(w => w[0].toUpperCase() + w.slice(1)).join('')}`,
        `  snake_case:   ${words.join('_')}`,
        `  kebab-case:   ${words.join('-')}`,
        `  SCREAMING:    ${words.join('_').toUpperCase()}`,
        `  Title Case:   ${words.map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}`,
        `  dot.case:     ${words.join('.')}`,
        `  slug:         ${words.join('-')}`,
      ].join('\n')
    },
  },
  {
    id: 'json-diff',
    name: 'JSON Diff',
    category: 'data',
    description: 'Compare two JSON objects — separate with a line containing "---"',
    placeholder: '{"name":"Alice","age":30}\n---\n{"name":"Alice","age":31,"email":"a@b.com"}',
    convert: (input) => {
      const sep = input.indexOf('\n---\n')
      if (sep === -1) return '(separate two JSON objects with a line containing "---")'
      const a = JSON.parse(input.slice(0, sep))
      const b = JSON.parse(input.slice(sep + 5))

      const changes = []
      function diff(objA, objB, path) {
        const allKeys = new Set([...Object.keys(objA || {}), ...Object.keys(objB || {})])
        for (const key of allKeys) {
          const p = path ? path + '.' + key : key
          const inA = objA && key in objA
          const inB = objB && key in objB

          if (inA && !inB) {
            changes.push(`- ${p}: ${JSON.stringify(objA[key])}`)
          } else if (!inA && inB) {
            changes.push(`+ ${p}: ${JSON.stringify(objB[key])}`)
          } else if (typeof objA[key] === 'object' && typeof objB[key] === 'object' && objA[key] !== null && objB[key] !== null && !Array.isArray(objA[key]) && !Array.isArray(objB[key])) {
            diff(objA[key], objB[key], p)
          } else if (JSON.stringify(objA[key]) !== JSON.stringify(objB[key])) {
            changes.push(`~ ${p}: ${JSON.stringify(objA[key])} → ${JSON.stringify(objB[key])}`)
          }
        }
      }
      diff(a, b, '')

      if (changes.length === 0) return 'No differences — objects are identical.'
      return [
        `${changes.length} difference(s):`,
        '',
        '  - = removed',
        '  + = added',
        '  ~ = changed',
        '',
        ...changes,
      ].join('\n')
    },
  },
  {
    id: 'css-gradient',
    name: 'CSS Gradient Generator',
    category: 'color',
    description: 'Enter 2+ hex colors (one per line) to generate CSS gradient code',
    placeholder: '#ff6b35\n#f7c948\n#4ecdc4',
    convert: (input) => {
      const colors = input.trim().split('\n').map(l => l.trim()).filter(l => /^#?[0-9a-fA-F]{3,8}$/.test(l))
      if (colors.length < 2) return '(enter at least 2 hex colors, one per line)'

      const hexColors = colors.map(c => c.startsWith('#') ? c : '#' + c)

      return [
        '/* Linear gradients */',
        `background: linear-gradient(to right, ${hexColors.join(', ')});`,
        `background: linear-gradient(135deg, ${hexColors.join(', ')});`,
        `background: linear-gradient(to bottom, ${hexColors.join(', ')});`,
        '',
        '/* Radial gradient */',
        `background: radial-gradient(circle, ${hexColors.join(', ')});`,
        `background: radial-gradient(ellipse, ${hexColors.join(', ')});`,
        '',
        '/* Conic gradient */',
        `background: conic-gradient(${hexColors.join(', ')});`,
        '',
        '/* With explicit stops */',
        `background: linear-gradient(to right, ${hexColors.map((c, i) => `${c} ${Math.round(i / (hexColors.length - 1) * 100)}%`).join(', ')});`,
        '',
        '/* CSS variable version */',
        ...hexColors.map((c, i) => `--gradient-color-${i + 1}: ${c};`),
        `background: linear-gradient(to right, ${hexColors.map((_, i) => `var(--gradient-color-${i + 1})`).join(', ')});`,
      ].join('\n')
    },
  },
  {
    id: 'css-shadow',
    name: 'CSS Shadow Generator',
    category: 'utility',
    description: 'Generate box-shadow and text-shadow CSS. Enter: x y blur spread color (or just defaults).',
    placeholder: '4 4 8 0 rgba(0,0,0,0.2)',
    convert: (input) => {
      const s = input.trim()
      let x = 4, y = 4, blur = 8, spread = 0, color = 'rgba(0, 0, 0, 0.2)'

      const m = s.match(/([\d.-]+)\s+([\d.-]+)\s*([\d.-]+)?\s*([\d.-]+)?\s*(.+)?/)
      if (m) {
        x = parseFloat(m[1]) || 0
        y = parseFloat(m[2]) || 0
        blur = parseFloat(m[3]) || 0
        spread = parseFloat(m[4]) || 0
        color = m[5] || color
      }

      return [
        '/* box-shadow */',
        `box-shadow: ${x}px ${y}px ${blur}px ${spread}px ${color};`,
        '',
        '/* Inset version */',
        `box-shadow: inset ${x}px ${y}px ${blur}px ${spread}px ${color};`,
        '',
        '/* text-shadow (no spread) */',
        `text-shadow: ${x}px ${y}px ${blur}px ${color};`,
        '',
        '/* Multiple shadows (layered) */',
        `box-shadow:`,
        `  ${x}px ${y}px ${blur}px ${spread}px ${color},`,
        `  ${x * 2}px ${y * 2}px ${blur * 2}px ${spread}px ${color.replace(/[\d.]+\)$/, (m2) => (parseFloat(m2) * 0.5).toFixed(2) + ')')};`,
        '',
        '/* Drop shadow filter */',
        `filter: drop-shadow(${x}px ${y}px ${blur}px ${color});`,
      ].join('\n')
    },
  },
  {
    id: 'dotenv-validate',
    name: 'Dotenv Validator',
    category: 'utility',
    description: 'Validate .env file syntax — check for issues like missing values, duplicates, bad formatting',
    convert: (input) => {
      const lines = input.split('\n')
      const issues = []
      const keys = new Map()

      lines.forEach((line, idx) => {
        const num = idx + 1
        const trimmed = line.trim()

        // skip empty lines and comments
        if (!trimmed || trimmed.startsWith('#')) return

        // check for = sign
        const eq = trimmed.indexOf('=')
        if (eq === -1) {
          issues.push(`Line ${num}: Missing '=' — "${trimmed.slice(0, 40)}"`)
          return
        }

        const key = trimmed.slice(0, eq).trim()
        const value = trimmed.slice(eq + 1)

        // key validation
        if (!key) issues.push(`Line ${num}: Empty key`)
        else if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) issues.push(`Line ${num}: Invalid key name "${key}" — use A-Z, 0-9, underscore only`)

        // duplicate check
        if (keys.has(key)) {
          issues.push(`Line ${num}: Duplicate key "${key}" (first at line ${keys.get(key)})`)
        } else {
          keys.set(key, num)
        }

        // value checks
        if (!value && !value.trim()) issues.push(`Line ${num}: Empty value for "${key}"`)
        if (value.includes(' ') && !value.startsWith('"') && !value.startsWith("'")) {
          issues.push(`Line ${num}: Value contains spaces but is not quoted — "${key}"`)
        }
        // unmatched quotes
        if ((value.startsWith('"') && !value.endsWith('"')) || (value.startsWith("'") && !value.endsWith("'"))) {
          issues.push(`Line ${num}: Unmatched quotes for "${key}"`)
        }
      })

      const envCount = keys.size
      return [
        `Checked ${lines.length} lines, ${envCount} variables`,
        '',
        issues.length === 0 ? 'No issues found — .env file looks good!' : `${issues.length} issue(s) found:\n\n${issues.map(i => '  ' + i).join('\n')}`,
      ].join('\n')
    },
  },
  {
    id: 'emoji-lookup',
    name: 'Emoji Lookup',
    category: 'utility',
    description: 'Search for emojis by name or paste emojis to get their names',
    convert: (input) => {
      const emojiMap = {
        'smile':'😊','laugh':'😂','cry':'😢','heart':'❤️','fire':'🔥','thumbsup':'👍','thumbsdown':'👎',
        'star':'⭐','sun':'☀️','moon':'🌙','cloud':'☁️','rain':'🌧️','snow':'❄️','lightning':'⚡',
        'check':'✅','cross':'❌','warning':'⚠️','question':'❓','exclamation':'❗','info':'ℹ️',
        'rocket':'🚀','airplane':'✈️','car':'🚗','house':'🏠','tree':'🌳','flower':'🌸',
        'dog':'🐕','cat':'🐈','bird':'🐦','fish':'🐟','bug':'🐛','snake':'🐍',
        'apple':'🍎','pizza':'🍕','coffee':'☕','beer':'🍺','cake':'🎂','hamburger':'🍔',
        'music':'🎵','art':'🎨','movie':'🎬','book':'📚','phone':'📱','computer':'💻',
        'lock':'🔒','unlock':'🔓','key':'🔑','magnify':'🔍','bulb':'💡','gear':'⚙️',
        'clock':'🕐','calendar':'📅','mail':'📧','pin':'📌','link':'🔗','scissors':'✂️',
        'wave':'👋','clap':'👏','pray':'🙏','muscle':'💪','brain':'🧠','eyes':'👀',
        'sparkles':'✨','party':'🎉','trophy':'🏆','medal':'🏅','crown':'👑','gem':'💎',
        'money':'💰','chart':'📈','target':'🎯','flag':'🏁','earth':'🌍','world':'🌎',
        'rainbow':'🌈','umbrella':'☂️','wind':'💨','droplet':'💧','leaf':'🍃','cactus':'🌵',
        '100':'💯','ok':'👌','peace':'✌️','fist':'✊','point':'👉','shrug':'🤷',
      }
      const revMap = Object.fromEntries(Object.entries(emojiMap).map(([k, v]) => [v, k]))

      const s = input.trim().toLowerCase()
      // Check if input contains emojis — look for non-ASCII codepoints typical of emoji
      const foundEmojis = [...s].filter(c => {
        const cp = c.codePointAt(0)
        return (cp >= 0x1F300 && cp <= 0x1F9FF) || (cp >= 0x2600 && cp <= 0x27BF) || (cp >= 0xFE00 && cp <= 0xFE0F) || cp === 0x200D || cp === 0x20E3
      })
      if (foundEmojis.length > 0) {
        const descriptions = [...new Set(foundEmojis)].map(e => {
          const name = revMap[e]
          const cp = [...e].map(c => 'U+' + c.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')).join(' ')
          return `  ${e}  ${name || '(unknown)'}  ${cp}`
        })
        return `Found ${foundEmojis.length} emoji(s):\n\n${descriptions.join('\n')}`
      }

      // Search by keyword
      const matches = Object.entries(emojiMap).filter(([k]) => k.includes(s))
      if (matches.length === 0) return `No emojis found for "${s}". Try: smile, heart, fire, rocket, star, check, etc.`
      return matches.map(([name, emoji]) => `  ${emoji}  :${name}:`).join('\n')
    },
  },
  {
    id: 'text-to-emoji',
    name: 'Text to Emoji',
    category: 'utility',
    description: 'Replace common words with emojis (heart→❤️, fire→🔥, star→⭐, etc.)',
    convert: (input) => {
      const map = {
        'heart':'❤️','love':'❤️','fire':'🔥','hot':'🔥','star':'⭐','sun':'☀️','moon':'🌙',
        'rain':'🌧️','snow':'❄️','check':'✅','yes':'✅','no':'❌','warning':'⚠️',
        'rocket':'🚀','car':'🚗','house':'🏠','tree':'🌳','dog':'🐕','cat':'🐈',
        'apple':'🍎','pizza':'🍕','coffee':'☕','cake':'🎂','music':'🎵','book':'📚',
        'phone':'📱','computer':'💻','key':'🔑','light':'💡','clock':'🕐','mail':'📧',
        'wave':'👋','party':'🎉','trophy':'🏆','crown':'👑','money':'💰','earth':'🌍',
        'rainbow':'🌈','smile':'😊','laugh':'😂','cry':'😢','ok':'👌','cool':'😎',
        'think':'🤔','idea':'💡','brain':'🧠','eyes':'👀','hand':'✋','point':'👉',
        'up':'⬆️','down':'⬇️','left':'⬅️','right':'➡️',
      }
      return input.replace(/\b(\w+)\b/g, (word) => {
        const lower = word.toLowerCase()
        return map[lower] || word
      })
    },
  },
  {
    id: 'regex-escape',
    name: 'Regex Escape',
    category: 'encode',
    description: 'Escape special regex characters so text can be used literally in a regex',
    convert: (input) => {
      return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    },
  },
  {
    id: 'regex-unescape',
    name: 'Regex Unescape',
    category: 'encode',
    description: 'Remove regex escape backslashes to get the literal text',
    convert: (input) => {
      return input.replace(/\\([.*+?^${}()|[\]\\])/g, '$1')
    },
  },
  {
    id: 'timezone-convert',
    name: 'Timezone Converter',
    category: 'utility',
    description: 'Show a time across timezones. Enter a date/time or "now" for current time.',
    placeholder: 'now',
    convert: (input) => {
      const s = input.trim()
      const date = s.toLowerCase() === 'now' ? new Date() : new Date(s)
      if (isNaN(date.getTime())) return '(enter a date/time like "2024-06-15 14:30" or "now")'

      const zones = [
        ['UTC', 'UTC'],
        ['US Eastern (EST/EDT)', 'America/New_York'],
        ['US Central (CST/CDT)', 'America/Chicago'],
        ['US Mountain (MST/MDT)', 'America/Denver'],
        ['US Pacific (PST/PDT)', 'America/Los_Angeles'],
        ['UK (GMT/BST)', 'Europe/London'],
        ['Central Europe (CET/CEST)', 'Europe/Berlin'],
        ['India (IST)', 'Asia/Kolkata'],
        ['China (CST)', 'Asia/Shanghai'],
        ['Japan (JST)', 'Asia/Tokyo'],
        ['Korea (KST)', 'Asia/Seoul'],
        ['Australia East (AEST)', 'Australia/Sydney'],
      ]

      const fmt = (tz) => {
        try {
          return date.toLocaleString('en-US', {
            timeZone: tz,
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
          })
        } catch {
          return '(unsupported timezone)'
        }
      }

      return [
        `Input: ${s === 'now' ? 'Current time' : s}`,
        `ISO:   ${date.toISOString()}`,
        `Unix:  ${Math.floor(date.getTime() / 1000)}`,
        '',
        ...zones.map(([label, tz]) => `${label.padEnd(28)} ${fmt(tz)}`),
      ].join('\n')
    },
  },
  {
    id: 'unix-perm',
    name: 'Unix Permissions',
    category: 'utility',
    description: 'Show detailed Unix permission breakdown. Enter octal (755) or symbolic (rwxr-xr-x).',
    convert: (input) => {
      const s = input.trim()
      // same as chmod-calc but with directory listing format
      const numMatch = s.match(/^0?([0-7]{3,4})$/)
      if (numMatch) {
        const d = numMatch[1].length === 4 ? numMatch[1] : '0' + numMatch[1]
        const perms = [parseInt(d[1]), parseInt(d[2]), parseInt(d[3])]
        const rwx = (n) => ((n & 4) ? 'r' : '-') + ((n & 2) ? 'w' : '-') + ((n & 1) ? 'x' : '-')
        const sym = perms.map(rwx).join('')
        return [
          `Octal:    ${s}`,
          `Symbolic: ${sym}`,
          `ls -l:    -${sym}`,
          '',
          `  Owner: ${rwx(perms[0])}  (${perms[0]})`,
          `  Group: ${rwx(perms[1])}  (${perms[1]})`,
          `  Other: ${rwx(perms[2])}  (${perms[2]})`,
          '',
          'Common permissions:',
          '  755 = rwxr-xr-x (typical for directories/scripts)',
          '  644 = rw-r--r-- (typical for files)',
          '  600 = rw------- (private files)',
          '  777 = rwxrwxrwx (everyone full access)',
          '  400 = r-------- (read-only for owner)',
        ].join('\n')
      }
      return '(enter octal permissions like 755, 644, 600, etc.)'
    },
  },
  {
    id: 'docker-run-gen',
    name: 'Docker Run Generator',
    category: 'utility',
    description: 'Generate docker run command from options. Enter key=value pairs.',
    placeholder: 'image=nginx:latest\nname=my-nginx\nport=8080:80\nvolume=./data:/usr/share/nginx/html\nenv=NODE_ENV=production\ndetach=true',
    convert: (input) => {
      const lines = input.trim().split('\n').map(l => l.trim()).filter(Boolean)
      let image = '', name = '', detach = false
      const ports = [], volumes = [], envs = [], extra = []

      for (const line of lines) {
        const eq = line.indexOf('=')
        if (eq === -1) continue
        const key = line.slice(0, eq).trim().toLowerCase()
        const val = line.slice(eq + 1).trim()

        if (key === 'image') image = val
        else if (key === 'name') name = val
        else if (key === 'port' || key === 'ports') ports.push(val)
        else if (key === 'volume' || key === 'volumes' || key === 'vol') volumes.push(val)
        else if (key === 'env' || key === 'environment') envs.push(val)
        else if (key === 'detach' || key === 'd') detach = val === 'true' || val === 'yes'
        else extra.push(`${key}=${val}`)
      }

      if (!image) return '(add image=nginx:latest on a line)'

      const parts = ['docker run']
      if (detach) parts.push('  -d')
      if (name) parts.push(`  --name ${name}`)
      for (const p of ports) parts.push(`  -p ${p}`)
      for (const v of volumes) parts.push(`  -v ${v}`)
      for (const e of envs) parts.push(`  -e ${e}`)
      parts.push(`  ${image}`)

      const run = parts.join(' \\\n')

      // docker-compose.yml
      const compose = [
        'version: "3.8"',
        'services:',
        `  ${name || 'app'}:`,
        `    image: ${image}`,
      ]
      if (ports.length) {
        compose.push('    ports:')
        for (const p of ports) compose.push(`      - "${p}"`)
      }
      if (volumes.length) {
        compose.push('    volumes:')
        for (const v of volumes) compose.push(`      - ${v}`)
      }
      if (envs.length) {
        compose.push('    environment:')
        for (const e of envs) compose.push(`      - ${e}`)
      }

      return [
        '--- docker run ---',
        run,
        '',
        '--- docker-compose.yml ---',
        compose.join('\n'),
      ].join('\n')
    },
  },
  {
    id: 'gitignore-gen',
    name: 'Gitignore Generator',
    category: 'utility',
    description: 'Generate .gitignore for common project types. Enter: node, python, java, rust, go, react, etc.',
    convert: (input) => {
      const templates = {
        node: ['node_modules/', 'dist/', 'build/', '.env', '.env.local', '*.log', 'npm-debug.log*', 'coverage/', '.nyc_output/', '.cache/'],
        python: ['__pycache__/', '*.py[cod]', '*$py.class', '*.so', '.Python', 'env/', 'venv/', '.venv/', 'dist/', 'build/', '*.egg-info/', '.eggs/', '.pytest_cache/', '.mypy_cache/'],
        java: ['*.class', '*.jar', '*.war', '*.ear', 'target/', '.gradle/', 'build/', '.idea/', '*.iml', 'out/'],
        rust: ['target/', 'Cargo.lock', '**/*.rs.bk'],
        go: ['*.exe', '*.exe~', '*.dll', '*.so', '*.dylib', '*.test', '*.out', 'vendor/', 'go.sum'],
        react: ['node_modules/', 'build/', 'dist/', '.env', '.env.local', '.env.development.local', '.env.test.local', '.env.production.local', '*.log', 'coverage/'],
        general: ['.DS_Store', 'Thumbs.db', '.idea/', '.vscode/', '*.swp', '*.swo', '*~', '.env', '.env.local'],
      }

      const types = input.trim().toLowerCase().split(/[\s,;]+/).filter(Boolean)
      if (types.length === 0) return 'Enter project types: node, python, java, rust, go, react, general'

      const patterns = new Set()
      const matched = []
      for (const type of types) {
        const tmpl = templates[type]
        if (tmpl) {
          matched.push(type)
          tmpl.forEach(p => patterns.add(p))
        }
      }
      // always include general
      templates.general.forEach(p => patterns.add(p))

      return [
        `# Generated .gitignore for: ${matched.join(', ') || 'general'}`,
        '',
        ...Array.from(patterns).sort(),
      ].join('\n')
    },
  },
  {
    id: 'json-to-go',
    name: 'JSON → Go Struct',
    category: 'data',
    description: 'Convert JSON to Go struct definitions with json tags',
    convert: (input) => {
      const obj = JSON.parse(input)
      const structs = []

      function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1) }
      function goName(s) {
        return s.split(/[_\-\s]+/).map(capitalize).join('')
          .replace(/Id$/, 'ID').replace(/Url$/, 'URL').replace(/Api$/, 'API')
      }

      function goType(val, name) {
        if (val === null) return 'interface{}'
        if (typeof val === 'string') return 'string'
        if (typeof val === 'number') return Number.isInteger(val) ? 'int' : 'float64'
        if (typeof val === 'boolean') return 'bool'
        if (Array.isArray(val)) {
          if (val.length === 0) return '[]interface{}'
          return '[]' + goType(val[0], name)
        }
        if (typeof val === 'object') {
          const structName = goName(name)
          emit(val, structName)
          return structName
        }
        return 'interface{}'
      }

      function emit(o, typeName) {
        const fields = Object.entries(o).map(([k, v]) => {
          const fieldName = goName(k)
          const fieldType = goType(v, k)
          return `\t${fieldName} ${fieldType} \`json:"${k}"\``
        })
        structs.push(`type ${typeName} struct {\n${fields.join('\n')}\n}`)
      }

      emit(obj, 'Root')
      return structs.reverse().join('\n\n')
    },
  },
  {
    id: 'json-to-rust',
    name: 'JSON → Rust Struct',
    category: 'data',
    description: 'Convert JSON to Rust struct definitions with serde derive',
    convert: (input) => {
      const obj = JSON.parse(input)
      const structs = []

      function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1) }
      function rustName(s) { return s.split(/[_\-\s]+/).map(capitalize).join('') }
      function snakeCase(s) { return s.replace(/([a-z])([A-Z])/g, '$1_$2').replace(/[\s-]+/g, '_').toLowerCase() }

      function rustType(val, name) {
        if (val === null) return 'Option<serde_json::Value>'
        if (typeof val === 'string') return 'String'
        if (typeof val === 'number') return Number.isInteger(val) ? 'i64' : 'f64'
        if (typeof val === 'boolean') return 'bool'
        if (Array.isArray(val)) {
          if (val.length === 0) return 'Vec<serde_json::Value>'
          return 'Vec<' + rustType(val[0], name) + '>'
        }
        if (typeof val === 'object') {
          const structName = rustName(name)
          emit(val, structName)
          return structName
        }
        return 'serde_json::Value'
      }

      function emit(o, typeName) {
        const fields = Object.entries(o).map(([k, v]) => {
          const fieldName = snakeCase(k)
          const fieldType = rustType(v, k)
          const rename = fieldName !== k ? `\n    #[serde(rename = "${k}")]` : ''
          return `${rename}\n    pub ${fieldName}: ${fieldType},`
        })
        structs.push(`#[derive(Debug, Serialize, Deserialize)]\npub struct ${typeName} {${fields.join('')}\n}`)
      }

      emit(obj, 'Root')
      return structs.reverse().join('\n\n')
    },
  },
  {
    id: 'md-link-check',
    name: 'Markdown Link Checker',
    category: 'utility',
    description: 'Extract and validate all links from Markdown text',
    convert: (input) => {
      const links = []
      // [text](url)
      const mdLinks = input.matchAll(/\[([^\]]*)\]\(([^)]+)\)/g)
      for (const m of mdLinks) {
        links.push({ text: m[1], url: m[2], type: 'inline' })
      }
      // bare URLs
      const bareUrls = input.matchAll(/(?<!\()(https?:\/\/[^\s)>\]]+)/g)
      for (const m of bareUrls) {
        if (!links.some(l => l.url === m[1])) {
          links.push({ text: '', url: m[1], type: 'bare' })
        }
      }
      // reference-style [text][ref] and [ref]: url
      const refs = {}
      const refDefs = input.matchAll(/^\[([^\]]+)\]:\s*(.+)$/gm)
      for (const m of refDefs) refs[m[1].toLowerCase()] = m[2].trim()

      if (links.length === 0) return '(no links found in the text)'

      const result = links.map((l, i) => {
        let status = ''
        try {
          new URL(l.url)
          status = 'valid URL'
        } catch {
          if (l.url.startsWith('#') || l.url.startsWith('/') || l.url.startsWith('./')) {
            status = 'relative path'
          } else if (l.url.startsWith('mailto:')) {
            status = 'email link'
          } else {
            status = 'potentially invalid'
          }
        }
        return `${i + 1}. [${l.type}] ${l.text ? '"' + l.text + '" → ' : ''}${l.url}\n   Status: ${status}`
      })

      return [
        `Found ${links.length} link(s):`,
        '',
        ...result,
      ].join('\n')
    },
  },
  {
    id: 'text-pad',
    name: 'Text Pad/Truncate',
    category: 'utility',
    description: 'Pad or truncate text. First line: width (prefix with "c:" for center, "r:" for right)',
    placeholder: '40\n---\nHello World',
    convert: (input) => {
      const sep = input.indexOf('\n---\n')
      if (sep === -1) return '(first line: width [prefix c: for center, r: for right], then ---, then text)'

      const spec = input.slice(0, sep).trim()
      const text = input.slice(sep + 5)

      let align = 'left', width = 40, pad = ' '
      if (spec.startsWith('c:')) { align = 'center'; width = parseInt(spec.slice(2)) }
      else if (spec.startsWith('r:')) { align = 'right'; width = parseInt(spec.slice(2)) }
      else { width = parseInt(spec) }

      if (isNaN(width) || width < 1) return '(enter a valid width number)'

      return text.split('\n').map(line => {
        if (line.length >= width) return line.slice(0, width)
        const diff = width - line.length
        if (align === 'right') return pad.repeat(diff) + line
        if (align === 'center') {
          const left = Math.floor(diff / 2)
          return pad.repeat(left) + line + pad.repeat(diff - left)
        }
        return line + pad.repeat(diff)
      }).join('\n')
    },
  },
  {
    id: 'html-table-to-csv',
    name: 'HTML Table to CSV',
    category: 'data',
    description: 'Extract data from an HTML table and convert to CSV',
    convert: (input) => {
      try {
        const parser = new DOMParser()
        const doc = parser.parseFromString(input.trim(), 'text/html')
        const table = doc.querySelector('table')
        if (!table) return '(no <table> element found)'
        const rows = [...table.querySelectorAll('tr')]
        return rows.map(row => {
          const cells = [...row.querySelectorAll('th, td')]
          return cells.map(cell => {
            const text = cell.textContent.trim().replace(/\s+/g, ' ').replace(/"/g, '""')
            return text.includes(',') || text.includes('"') || text.includes('\n') ? `"${text}"` : text
          }).join(',')
        }).filter(Boolean).join('\n')
      } catch {
        return '(invalid HTML)'
      }
    },
  },
  {
    id: 'json-to-kotlin',
    name: 'JSON to Kotlin',
    category: 'utility',
    description: 'Generate Kotlin data class from a JSON object',
    convert: (input) => {
      try {
        const json = JSON.parse(input.trim())
        const root = Array.isArray(json) ? json[0] : json
        if (typeof root !== 'object' || root === null) return '(enter a JSON object or array of objects)'
        const classes = []
        function getType(val, key) {
          if (val === null) return 'Any?'
          if (Array.isArray(val)) {
            if (val.length === 0) return 'List<Any>'
            const singular = key.replace(/ies$/, 'y').replace(/s$/, '') || key
            return `List<${getType(val[0], singular)}>`
          }
          if (typeof val === 'object') {
            const name = key.charAt(0).toUpperCase() + key.slice(1)
            buildClass(val, name)
            return name
          }
          if (typeof val === 'boolean') return 'Boolean'
          if (typeof val === 'number') return Number.isInteger(val) ? 'Int' : 'Double'
          return 'String'
        }
        function buildClass(obj, name) {
          const fields = Object.entries(obj).map(([k, v]) => {
            const camel = k.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
            const type = getType(v, k)
            const annotation = camel !== k ? `    @SerializedName("${k}")\n` : ''
            return `${annotation}    val ${camel}: ${type}`
          })
          classes.push(`data class ${name}(\n${fields.join(',\n')}\n)`)
        }
        buildClass(root, 'Root')
        return classes.join('\n\n')
      } catch {
        return '(invalid JSON)'
      }
    },
  },
  {
    id: 'json-to-java',
    name: 'JSON to Java',
    category: 'utility',
    description: 'Generate Java POJO class from a JSON object',
    convert: (input) => {
      try {
        const json = JSON.parse(input.trim())
        const root = Array.isArray(json) ? json[0] : json
        if (typeof root !== 'object' || root === null) return '(enter a JSON object or array of objects)'
        const classes = []
        function getType(val, key) {
          if (val === null) return 'Object'
          if (Array.isArray(val)) {
            if (val.length === 0) return 'List<Object>'
            const singular = key.replace(/ies$/, 'y').replace(/s$/, '') || key
            return `List<${getType(val[0], singular)}>`
          }
          if (typeof val === 'object') {
            const name = key.charAt(0).toUpperCase() + key.slice(1)
            buildClass(val, name)
            return name
          }
          if (typeof val === 'boolean') return 'boolean'
          if (typeof val === 'number') return Number.isInteger(val) ? 'int' : 'double'
          return 'String'
        }
        function buildClass(obj, name) {
          const fields = Object.entries(obj).map(([k, v]) => {
            const camel = k.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
            const type = getType(v, k)
            return `    private ${type} ${camel};`
          })
          const getters = Object.entries(obj).map(([k, v]) => {
            const camel = k.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
            const type = getType(v, k)
            const cap = camel.charAt(0).toUpperCase() + camel.slice(1)
            return `    public ${type} get${cap}() { return ${camel}; }\n    public void set${cap}(${type} ${camel}) { this.${camel} = ${camel}; }`
          })
          classes.push(`public class ${name} {\n${fields.join('\n')}\n\n${getters.join('\n')}\n}`)
        }
        buildClass(root, 'Root')
        return classes.join('\n\n')
      } catch {
        return '(invalid JSON)'
      }
    },
  },
  {
    id: 'json-schema-gen',
    name: 'JSON Schema Generator',
    category: 'utility',
    description: 'Generate a JSON Schema (draft-07) from a JSON example',
    convert: (input) => {
      try {
        const data = JSON.parse(input.trim())
        function inferSchema(val) {
          if (val === null) return { type: 'null' }
          if (typeof val === 'boolean') return { type: 'boolean' }
          if (typeof val === 'number') return Number.isInteger(val) ? { type: 'integer' } : { type: 'number' }
          if (typeof val === 'string') return { type: 'string' }
          if (Array.isArray(val)) {
            if (val.length === 0) return { type: 'array', items: {} }
            return { type: 'array', items: inferSchema(val[0]) }
          }
          if (typeof val === 'object') {
            const props = {}
            for (const [k, v] of Object.entries(val)) props[k] = inferSchema(v)
            return { type: 'object', properties: props, required: Object.keys(val) }
          }
          return {}
        }
        const schema = {
          $schema: 'http://json-schema.org/draft-07/schema#',
          ...inferSchema(data),
        }
        return JSON.stringify(schema, null, 2)
      } catch {
        return '(invalid JSON)'
      }
    },
  },
  {
    id: 'duration-format',
    name: 'Duration Formatter',
    category: 'utility',
    description: 'Format a duration in seconds or milliseconds to human-readable time',
    placeholder: '3723',
    convert: (input) => {
      const s = input.trim()
      let totalMs = parseFloat(s)
      if (isNaN(totalMs)) return '(enter a number of seconds or milliseconds)'
      // Auto-detect ms vs s: if > 1e10 it's likely ms
      let isMs = false
      if (totalMs > 1e10 || s.endsWith('ms')) { isMs = true }
      if (!isMs) totalMs *= 1000
      const ms = Math.floor(totalMs % 1000)
      const totalSec = Math.floor(totalMs / 1000)
      const sec = totalSec % 60
      const min = Math.floor(totalSec / 60) % 60
      const hrs = Math.floor(totalSec / 3600) % 24
      const days = Math.floor(totalSec / 86400)
      const parts = []
      if (days > 0) parts.push(`${days}d`)
      if (hrs > 0) parts.push(`${hrs}h`)
      if (min > 0) parts.push(`${min}m`)
      if (sec > 0 || parts.length === 0) parts.push(`${sec}s`)
      const hhmm = [
        days > 0 ? String(days * 24 + hrs).padStart(2, '0') : String(hrs).padStart(2, '0'),
        String(min).padStart(2, '0'),
        String(sec).padStart(2, '0'),
      ].join(':')
      return [
        `Human:    ${parts.join(' ')}${ms > 0 ? ` ${ms}ms` : ''}`,
        `HH:MM:SS: ${hhmm}`,
        `Seconds:  ${(isMs ? totalMs / 1000 : totalMs / 1000).toFixed(isMs ? 3 : 0)}`,
        `Minutes:  ${(totalMs / 60000).toFixed(4).replace(/\.?0+$/, '')}`,
        `Hours:    ${(totalMs / 3600000).toFixed(6).replace(/\.?0+$/, '')}`,
        `Days:     ${(totalMs / 86400000).toFixed(8).replace(/\.?0+$/, '')}`,
      ].join('\n')
    },
  },
  {
    id: 'sql-insert-to-json',
    name: 'SQL INSERT to JSON',
    category: 'data',
    description: 'Parse SQL INSERT statements into a JSON array of objects',
    placeholder: "INSERT INTO users (id, name, age) VALUES (1, 'Alice', 30), (2, 'Bob', 25);",
    convert: (input) => {
      try {
        const s = input.trim()
        const colMatch = s.match(/\(([^)]+)\)\s*VALUES/i)
        if (!colMatch) return '(cannot parse columns — expected: INSERT INTO table (col1, col2) VALUES (...))'
        const cols = colMatch[1].split(',').map(c => c.trim().replace(/[`"[\]]/g, ''))
        const valSection = s.slice(s.indexOf('VALUES', colMatch.index) + 6)
        const rows = []
        let depth = 0, current = '', inStr = false, strChar = ''
        for (const ch of valSection) {
          if (!inStr && (ch === "'" || ch === '"')) { inStr = true; strChar = ch; current += ch }
          else if (inStr && ch === strChar) { inStr = false; current += ch }
          else if (!inStr && ch === '(') { depth++; if (depth === 1) continue; current += ch }
          else if (!inStr && ch === ')') {
            depth--
            if (depth === 0) { rows.push(current.trim()); current = '' }
            else current += ch
          }
          else current += ch
        }
        const result = rows.map(row => {
          const values = []
          let val = '', inQ = false, qChar = ''
          for (const ch of row) {
            if (!inQ && (ch === "'" || ch === '"')) { inQ = true; qChar = ch }
            else if (inQ && ch === qChar) { inQ = false }
            else if (!inQ && ch === ',') { values.push(val.trim()); val = '' }
            else val += ch
          }
          values.push(val.trim())
          const obj = {}
          cols.forEach((col, i) => {
            const v = values[i]?.trim() ?? ''
            if (v === 'NULL' || v === 'null') obj[col] = null
            else if (/^-?\d+$/.test(v)) obj[col] = parseInt(v)
            else if (/^-?\d*\.\d+$/.test(v)) obj[col] = parseFloat(v)
            else obj[col] = v
          })
          return obj
        })
        return JSON.stringify(result, null, 2)
      } catch {
        return '(failed to parse SQL INSERT statement)'
      }
    },
  },
  {
    id: 'text-reverse-words',
    name: 'Reverse Words',
    category: 'utility',
    description: 'Reverse the order of words in text (optionally each line independently)',
    placeholder: 'Hello World foo bar',
    convert: (input) => {
      return input.split('\n').map(line => line.split(' ').reverse().join(' ')).join('\n')
    },
  },
  {
    id: 'string-multiply',
    name: 'Repeat Text',
    category: 'utility',
    description: 'Repeat text N times — enter text then :N on a new line or after a comma',
    placeholder: 'hello\n:5',
    convert: (input) => {
      const lines = input.split('\n')
      // Check if last line starts with ":"
      if (lines.length >= 2 && lines[lines.length - 1].trim().startsWith(':')) {
        const n = parseInt(lines[lines.length - 1].trim().slice(1))
        if (!isNaN(n) && n > 0 && n <= 1000) {
          const text = lines.slice(0, -1).join('\n')
          return Array(n).fill(text).join('\n')
        }
      }
      // Check if ends with :N
      const m = input.match(/^([\s\S]+):(\d+)$/)
      if (m) {
        const n = parseInt(m[2])
        if (!isNaN(n) && n > 0 && n <= 1000) return Array(n).fill(m[1].trim()).join('\n')
      }
      return '(enter text then :N on a new line, e.g. "hello" then ":5")'
    },
  },
  {
    id: 'anagram-check',
    name: 'Anagram Checker',
    category: 'utility',
    description: 'Check if two words or phrases are anagrams of each other (one per line)',
    placeholder: 'listen\nsilent',
    convert: (input) => {
      const lines = input.split('\n').map(l => l.trim()).filter(Boolean)
      if (lines.length < 2) return '(enter two words or phrases, one per line)'
      const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '').split('').sort().join('')
      const a = lines[0], b = lines[1]
      const isAnagram = normalize(a) === normalize(b)
      const aLetters = a.toLowerCase().replace(/[^a-z]/g, '').split('').sort().join('')
      const bLetters = b.toLowerCase().replace(/[^a-z]/g, '').split('').sort().join('')
      return [
        `"${a}" and "${b}"`,
        `Anagram: ${isAnagram ? 'YES ✓' : 'NO ✗'}`,
        '',
        `"${a}" letters: ${aLetters}`,
        `"${b}" letters: ${bLetters}`,
        ...(isAnagram ? [] : [`\nDifference: ${aLetters.length} vs ${bLetters.length} letters`]),
      ].join('\n')
    },
  },
  {
    id: 'json-to-csharp',
    name: 'JSON to C#',
    category: 'utility',
    description: 'Generate C# class with properties from a JSON object',
    convert: (input) => {
      try {
        const data = JSON.parse(input.trim())
        const root = Array.isArray(data) ? data[0] : data
        if (typeof root !== 'object' || root === null) return '(enter a JSON object or array of objects)'
        const classes = []
        function csType(val, key) {
          if (val === null) return 'object?'
          if (typeof val === 'boolean') return 'bool'
          if (typeof val === 'number') return Number.isInteger(val) ? 'int' : 'double'
          if (typeof val === 'string') return 'string'
          if (Array.isArray(val)) {
            if (val.length === 0) return 'List<object>'
            const singular = key.replace(/ies$/, 'y').replace(/s$/, '')
            return `List<${csType(val[0], singular)}>`
          }
          if (typeof val === 'object') {
            const name = key.charAt(0).toUpperCase() + key.slice(1)
            buildClass(val, name)
            return name
          }
          return 'object'
        }
        function buildClass(obj, name) {
          const props = Object.entries(obj).map(([k, v]) => {
            const propName = k.charAt(0).toUpperCase() + k.slice(1).replace(/_([a-z])/g, (_, c) => c.toUpperCase())
            return `    public ${csType(v, k)} ${propName} { get; set; }`
          })
          classes.push(`public class ${name}\n{\n${props.join('\n')}\n}`)
        }
        buildClass(root, 'Root')
        return classes.join('\n\n')
      } catch {
        return '(invalid JSON)'
      }
    },
  },
  {
    id: 'json-to-swift',
    name: 'JSON to Swift',
    category: 'utility',
    description: 'Generate Swift Codable struct from a JSON object',
    convert: (input) => {
      try {
        const data = JSON.parse(input.trim())
        const root = Array.isArray(data) ? data[0] : data
        if (typeof root !== 'object' || root === null) return '(enter a JSON object or array of objects)'
        const structs = []
        function swiftType(val, key) {
          if (val === null) return 'Any?'
          if (typeof val === 'boolean') return 'Bool'
          if (typeof val === 'number') return Number.isInteger(val) ? 'Int' : 'Double'
          if (typeof val === 'string') return 'String'
          if (Array.isArray(val)) {
            if (val.length === 0) return '[Any]'
            const singular = key.replace(/ies$/, 'y').replace(/s$/, '')
            return `[${swiftType(val[0], singular)}]`
          }
          if (typeof val === 'object') {
            const name = key.charAt(0).toUpperCase() + key.slice(1)
            buildStruct(val, name)
            return name
          }
          return 'Any'
        }
        function buildStruct(obj, name) {
          const props = Object.entries(obj).map(([k, v]) => {
            const propName = k.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
            const needsCodingKey = propName !== k
            return `    let ${propName}: ${swiftType(v, k)}${needsCodingKey ? ' // CodingKey: ' + k : ''}`
          })
          structs.push(`struct ${name}: Codable {\n${props.join('\n')}\n}`)
        }
        buildStruct(root, 'Root')
        return structs.join('\n\n')
      } catch {
        return '(invalid JSON)'
      }
    },
  },
  {
    id: 'bit-calculator',
    name: 'Bitwise Calculator',
    category: 'number',
    description: 'Perform bitwise operations: AND, OR, XOR, NOT, shifts — enter: A op B (e.g. "255 AND 170")',
    placeholder: '255 AND 170',
    convert: (input) => {
      const s = input.trim()
      if (!s) return '(enter: A AND B, A OR B, A XOR B, NOT A, A << N, A >> N)'
      const notMatch = s.match(/^NOT\s+(-?\d+)/i)
      if (notMatch) {
        const a = parseInt(notMatch[1])
        if (isNaN(a)) return '(invalid number)'
        const result = ~a
        return [
          `NOT ${a} = ${result}`,
          `Hex: 0x${(result >>> 0).toString(16).toUpperCase().padStart(8, '0')}`,
          `Bin: ${(result >>> 0).toString(2).padStart(32, '0')}`,
        ].join('\n')
      }
      const m = s.match(/^(-?\d+)\s+(AND|OR|XOR|<<|>>)\s+(-?\d+)/i)
      if (!m) return '(format: A AND B, A OR B, A XOR B, NOT A, A << N, A >> N)'
      const a = parseInt(m[1]), op = m[2].toUpperCase(), b = parseInt(m[3])
      if (isNaN(a) || isNaN(b)) return '(invalid numbers)'
      let result
      if (op === 'AND') result = a & b
      else if (op === 'OR') result = a | b
      else if (op === 'XOR') result = a ^ b
      else if (op === '<<') result = a << b
      else result = a >> b
      const u = result >>> 0
      return [
        `${a} ${op} ${b} = ${result}`,
        `Hex:    0x${u.toString(16).toUpperCase().padStart(8, '0')}`,
        `Binary: ${u.toString(2).padStart(32, '0')}`,
        `Octal:  0o${u.toString(8)}`,
        '',
        `A: ${(a >>> 0).toString(2).padStart(32, '0')}`,
        `B: ${(b >>> 0).toString(2).padStart(32, '0')}`,
        `R: ${u.toString(2).padStart(32, '0')}`,
      ].join('\n')
    },
  },
  {
    id: 'css-specificity',
    name: 'CSS Specificity',
    category: 'utility',
    description: 'Calculate CSS selector specificity — enter selectors, one per line',
    placeholder: '#header .nav a:hover\n.btn.btn-primary\ndiv > p + span',
    convert: (input) => {
      const lines = input.split('\n').map(l => l.trim()).filter(Boolean)
      if (lines.length === 0) return '(enter CSS selectors, one per line)'
      function calcSpec(sel) {
        // Remove pseudo-elements and strings to avoid false matches
        let s = sel.replace(/::[\w-]+/g, ' ').replace(/"[^"]*"|'[^']*'/g, '')
        const ids = (s.match(/#[\w-]+/g) || []).length
        s = s.replace(/#[\w-]+/g, '')
        const classes = (s.match(/\.[\w-]+|:[\w-]+(?:\([^)]*\))?|\[[\w^$*~|=-]+(?:=["']?[^"'\]]*["']?)?\]/g) || []).length
        s = s.replace(/\.[\w-]+|:[\w-]+(?:\([^)]*\))?|\[[\w^$*~|=-]+(?:=["']?[^"'\]]*["']?)?\]/g, '')
        const elems = (s.match(/[a-zA-Z][\w-]*/g) || []).filter(t => !['and', 'or', 'not', 'is', 'where', 'has'].includes(t)).length
        return { ids, classes, elems, score: ids * 100 + classes * 10 + elems }
      }
      const results = lines.map(sel => {
        const { ids, classes, elems, score } = calcSpec(sel)
        return `(${ids},${classes},${elems}) = ${score.toString().padStart(4)} — ${sel}`
      })
      results.sort((a, b) => {
        const sa = parseInt(a.match(/= *(\d+)/)[1])
        const sb = parseInt(b.match(/= *(\d+)/)[1])
        return sb - sa
      })
      return results.join('\n')
    },
  },
  {
    id: 'uuid-validate',
    name: 'UUID Validate',
    category: 'utility',
    description: 'Validate UUID format and identify version (1-5, 7)',
    placeholder: '550e8400-e29b-41d4-a716-446655440000',
    convert: (input) => {
      const s = input.trim().toLowerCase()
      const re = /^[0-9a-f]{8}-[0-9a-f]{4}-([1-5]|7)[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
      if (!re.test(s)) {
        const noHyphens = s.replace(/-/g, '')
        if (/^[0-9a-f]{32}$/i.test(noHyphens)) {
          return `⚠ UUID is missing hyphens\nFormatted: ${noHyphens.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5')}`
        }
        return '✗ Invalid UUID format'
      }
      const version = parseInt(s[14], 10)
      const variant = s[19]
      const variantNames = { '8': 'RFC 4122', '9': 'RFC 4122', 'a': 'RFC 4122', 'b': 'RFC 4122' }
      const versionNames = {
        1: 'v1 — Time-based (MAC address + timestamp)',
        2: 'v2 — DCE Security',
        3: 'v3 — Name-based (MD5)',
        4: 'v4 — Random',
        5: 'v5 — Name-based (SHA-1)',
        7: 'v7 — Unix Epoch time-ordered (draft)',
      }
      return [
        `✓ Valid UUID`,
        `Version: ${versionNames[version] || `v${version}`}`,
        `Variant: ${variantNames[variant] || 'Unknown'}`,
        `Uppercase: ${s.toUpperCase()}`,
        `No hyphens: ${s.replace(/-/g, '')}`,
        `URN: urn:uuid:${s}`,
      ].join('\n')
    },
  },
  {
    id: 'css-animation-gen',
    name: 'CSS Animation Generator',
    category: 'utility',
    description: 'Generate CSS @keyframes animation — format: name duration easing (e.g. "fadeIn 0.3s ease")',
    placeholder: 'slideUp 0.4s ease-out',
    convert: (input) => {
      const s = input.trim()
      if (!s) return '(enter: name duration easing — e.g. "fadeIn 0.3s ease")'
      const parts = s.split(/\s+/)
      const name = parts[0] || 'myAnimation'
      const duration = parts[1] || '0.3s'
      const easing = parts.slice(2).join(' ') || 'ease'
      const presets = {
        fadein: `@keyframes ${name} {\n  from { opacity: 0; }\n  to   { opacity: 1; }\n}`,
        fadeout: `@keyframes ${name} {\n  from { opacity: 1; }\n  to   { opacity: 0; }\n}`,
        slideup: `@keyframes ${name} {\n  from { transform: translateY(20px); opacity: 0; }\n  to   { transform: translateY(0);    opacity: 1; }\n}`,
        slidedown: `@keyframes ${name} {\n  from { transform: translateY(-20px); opacity: 0; }\n  to   { transform: translateY(0);     opacity: 1; }\n}`,
        slideleft: `@keyframes ${name} {\n  from { transform: translateX(20px); opacity: 0; }\n  to   { transform: translateX(0);    opacity: 1; }\n}`,
        slideright: `@keyframes ${name} {\n  from { transform: translateX(-20px); opacity: 0; }\n  to   { transform: translateX(0);     opacity: 1; }\n}`,
        scalein: `@keyframes ${name} {\n  from { transform: scale(0.8); opacity: 0; }\n  to   { transform: scale(1);   opacity: 1; }\n}`,
        scaleout: `@keyframes ${name} {\n  from { transform: scale(1);   opacity: 1; }\n  to   { transform: scale(1.2); opacity: 0; }\n}`,
        bounce: `@keyframes ${name} {\n  0%, 100% { transform: translateY(0); }\n  40%       { transform: translateY(-20px); }\n  60%       { transform: translateY(-10px); }\n}`,
        shake: `@keyframes ${name} {\n  0%, 100% { transform: translateX(0); }\n  20%, 60% { transform: translateX(-6px); }\n  40%, 80% { transform: translateX(6px); }\n}`,
        pulse: `@keyframes ${name} {\n  0%, 100% { transform: scale(1); }\n  50%       { transform: scale(1.05); }\n}`,
        spin: `@keyframes ${name} {\n  from { transform: rotate(0deg); }\n  to   { transform: rotate(360deg); }\n}`,
        flip: `@keyframes ${name} {\n  from { transform: rotateY(0); }\n  to   { transform: rotateY(360deg); }\n}`,
      }
      const key = name.toLowerCase().replace(/[^a-z]/g, '')
      const keyframes = presets[key] ||
        `@keyframes ${name} {\n  from { /* start state */ }\n  to   { /* end state */ }\n}`
      return [
        keyframes,
        '',
        `.element {`,
        `  animation: ${name} ${duration} ${easing};`,
        `}`,
        '',
        `/* With all options */`,
        `.element {`,
        `  animation-name:            ${name};`,
        `  animation-duration:        ${duration};`,
        `  animation-timing-function: ${easing};`,
        `  animation-delay:           0s;`,
        `  animation-iteration-count: 1;`,
        `  animation-direction:       normal;`,
        `  animation-fill-mode:       both;`,
        `  animation-play-state:      running;`,
        `}`,
        '',
        `Available presets: fadeIn, fadeOut, slideUp, slideDown, slideLeft, slideRight, scaleIn, scaleOut, bounce, shake, pulse, spin, flip`,
      ].join('\n')
    },
  },
  {
    id: 'openapi-summary',
    name: 'OpenAPI Summary',
    category: 'utility',
    description: 'Parse OpenAPI 3.x JSON/YAML and list all endpoints with methods',
    placeholder: '{"openapi":"3.0.0","paths":{"/users":{"get":{"summary":"List users"},"post":{"summary":"Create user"}},"/users/{id}":{"get":{"summary":"Get user"}}}}',
    convert: (input) => {
      try {
        let spec
        const trimmed = input.trim()
        if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
          spec = JSON.parse(trimmed)
        } else {
          spec = yamlToJson(trimmed)
        }
        if (!spec.paths) return '(no "paths" found in spec)'
        const methods = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options', 'trace']
        const lines = []
        const title = spec.info?.title || 'API'
        const version = spec.info?.version || ''
        const baseUrl = spec.servers?.[0]?.url || ''
        lines.push(`${title}${version ? ` v${version}` : ''}${baseUrl ? ` — ${baseUrl}` : ''}`)
        lines.push('')
        const paths = Object.entries(spec.paths).sort(([a], [b]) => a.localeCompare(b))
        for (const [path, pathObj] of paths) {
          for (const method of methods) {
            if (!pathObj[method]) continue
            const op = pathObj[method]
            const summary = op.summary || op.operationId || ''
            const tags = op.tags?.join(', ') || ''
            lines.push(`${method.toUpperCase().padEnd(7)} ${path}${summary ? `  — ${summary}` : ''}${tags ? ` [${tags}]` : ''}`)
          }
        }
        lines.push('')
        lines.push(`Total: ${paths.length} paths, ${lines.filter(l => /^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS|TRACE)/.test(l)).length} operations`)
        return lines.join('\n')
      } catch (e) {
        return `(parse error: ${e.message})`
      }
    },
  },
  {
    id: 'har-parse',
    name: 'HAR Parser',
    category: 'utility',
    description: 'Parse HTTP Archive (HAR) JSON and summarize requests',
    placeholder: '{"log":{"entries":[{"request":{"method":"GET","url":"https://example.com"},"response":{"status":200},"time":123}]}}',
    convert: (input) => {
      try {
        const har = JSON.parse(input.trim())
        const entries = har.log?.entries
        if (!Array.isArray(entries)) return '(expected HAR format: {log:{entries:[...]}})'
        const lines = []
        const browser = har.log?.browser
        if (browser) lines.push(`Browser: ${browser.name} ${browser.version}`)
        lines.push(`Requests: ${entries.length}`)
        lines.push('')
        let totalTime = 0, totalSize = 0
        const statusGroups = {}
        for (const entry of entries) {
          const { request, response, time } = entry
          const method = request?.method || '?'
          const url = request?.url || ''
          const status = response?.status || 0
          const size = response?.bodySize || 0
          const t = time || 0
          totalTime += t
          totalSize += size > 0 ? size : 0
          statusGroups[Math.floor(status / 100)] = (statusGroups[Math.floor(status / 100)] || 0) + 1
          const shortUrl = url.length > 60 ? url.slice(0, 57) + '...' : url
          lines.push(`${method.padEnd(7)} ${status} ${t.toFixed(0).padStart(6)}ms  ${shortUrl}`)
        }
        lines.push('')
        lines.push(`Total time:  ${totalTime.toFixed(0)}ms`)
        lines.push(`Total size:  ${(totalSize / 1024).toFixed(1)} KB`)
        const groups = Object.entries(statusGroups).sort()
        if (groups.length > 0) lines.push(`Status: ${groups.map(([g, c]) => `${g}xx:${c}`).join('  ')}`)
        return lines.join('\n')
      } catch (e) {
        return `(invalid HAR: ${e.message})`
      }
    },
  },
  {
    id: 'matrix-ops',
    name: 'Matrix Operations',
    category: 'utility',
    description: 'Matrix determinant, transpose, multiply — enter rows separated by newlines, elements by spaces or commas; use "---" between two matrices for multiply',
    placeholder: '1 2 3\n4 5 6\n7 8 9',
    convert: (input) => {
      const sep = input.indexOf('\n---\n')
      function parseMatrix(s) {
        const rows = s.trim().split('\n').map(l => l.trim().split(/[\s,]+/).map(Number))
        if (rows.some(r => r.some(isNaN))) throw new Error('non-numeric value')
        return rows
      }
      function det(m) {
        const n = m.length
        if (n === 1) return m[0][0]
        if (n === 2) return m[0][0] * m[1][1] - m[0][1] * m[1][0]
        let d = 0
        for (let j = 0; j < n; j++) {
          const minor = m.slice(1).map(r => [...r.slice(0, j), ...r.slice(j + 1)])
          d += (j % 2 === 0 ? 1 : -1) * m[0][j] * det(minor)
        }
        return d
      }
      function transpose(m) { return m[0].map((_, i) => m.map(r => r[i])) }
      function multiply(a, b) {
        if (a[0].length !== b.length) throw new Error(`Cannot multiply ${a.length}×${a[0].length} by ${b.length}×${b[0].length}`)
        return a.map(row => b[0].map((_, j) => row.reduce((sum, _, k) => sum + row[k] * b[k][j], 0)))
      }
      function fmtMatrix(m) {
        const cols = m[0].length
        const widths = Array.from({length: cols}, (_, j) => Math.max(...m.map(r => String(parseFloat(r[j].toFixed(4))).length)))
        return m.map(r => r.map((v, j) => String(parseFloat(v.toFixed(4))).padStart(widths[j])).join('  ')).join('\n')
      }
      try {
        if (sep !== -1) {
          const A = parseMatrix(input.slice(0, sep))
          const B = parseMatrix(input.slice(sep + 5))
          const result = multiply(A, B)
          return [
            `A (${A.length}×${A[0].length}) × B (${B.length}×${B[0].length}) = C (${result.length}×${result[0].length})`,
            '',
            'Result:',
            fmtMatrix(result),
          ].join('\n')
        }
        const m = parseMatrix(input)
        const rows = m.length, cols = m[0].length
        const lines = [`Matrix: ${rows}×${cols}`, '']
        const T = transpose(m)
        lines.push('Transpose:')
        lines.push(fmtMatrix(T))
        if (rows === cols) {
          const d = det(m)
          lines.push('')
          lines.push(`Determinant: ${parseFloat(d.toFixed(6))}`)
          lines.push(d === 0 ? '  (matrix is singular — no inverse)' : '  (matrix is invertible)')
        } else {
          lines.push('\n(Determinant requires square matrix)')
        }
        return lines.join('\n')
      } catch (e) {
        return `(error: ${e.message})`
      }
    },
  },
  {
    id: 'text-normalize',
    name: 'Unicode Normalize',
    category: 'encode',
    description: 'Normalize Unicode text (NFC, NFD, NFKC, NFKD) and show code point info',
    placeholder: 'café résumé naïve',
    convert: (input) => {
      if (!input) return ''
      const forms = ['NFC', 'NFD', 'NFKC', 'NFKD']
      const lines = []
      for (const form of forms) {
        const normalized = input.normalize(form)
        const same = normalized === input ? ' (same)' : ''
        lines.push(`${form}: ${normalized}${same}  [${normalized.length} chars, ${new TextEncoder().encode(normalized).length} bytes]`)
      }
      lines.push('')
      // Show code points for first 20 chars
      const chars = [...input].slice(0, 20)
      lines.push('Code points' + (input.length > 20 ? ' (first 20):' : ':'))
      for (const ch of chars) {
        const cp = ch.codePointAt(0)
        const hex = cp.toString(16).toUpperCase().padStart(4, '0')
        const name = `U+${hex}`
        lines.push(`  ${ch.padEnd(2)} ${name}`)
      }
      return lines.join('\n')
    },
  },
  {
    id: 'unit-prefix',
    name: 'SI Prefix Converter',
    category: 'utility',
    description: 'Convert between SI prefixes (kilo, mega, giga, etc.) — format: "1.5 km to m" or "500 mA to A"',
    placeholder: '1.5 km to m',
    convert: (input) => {
      const prefixes = {
        q: 1e-30, r: 1e-27, y: 1e-24, z: 1e-21, a: 1e-18, f: 1e-15, p: 1e-12,
        n: 1e-9, µ: 1e-6, u: 1e-6, m: 1e-3, c: 1e-2, d: 1e-1,
        '': 1, da: 1e1, h: 1e2, k: 1e3, M: 1e6, G: 1e9, T: 1e12,
        P: 1e15, E: 1e18, Z: 1e21, Y: 1e24, R: 1e27, Q: 1e30,
      }
      const prefixNames = {
        q:'quecto', r:'ronto', y:'yocto', z:'zepto', a:'atto', f:'femto', p:'pico',
        n:'nano', µ:'micro', u:'micro', m:'milli', c:'centi', d:'deci',
        '':'(base)', da:'deca', h:'hecto', k:'kilo', M:'mega', G:'giga', T:'tera',
        P:'peta', E:'exa', Z:'zetta', Y:'yotta', R:'ronna', Q:'quetta',
      }
      const m = input.trim().match(/^([\d.e+-]+)\s*([a-zA-Zµ]*?)([a-zA-Zµ]+)\s+to\s+([a-zA-Zµ]*?)([a-zA-Zµ]+)$/i)
      if (!m) return '(format: "1.5 km to m" or "500 mA to A")'
      const [, numStr, fromPre, fromUnit, toPre, toUnit] = m
      if (fromUnit.toLowerCase() !== toUnit.toLowerCase()) return `(units must match: "${fromUnit}" vs "${toUnit}")`
      const fromFactor = prefixes[fromPre] ?? prefixes[fromPre.toLowerCase()]
      const toFactor = prefixes[toPre] ?? prefixes[toPre.toLowerCase()]
      if (fromFactor === undefined) return `(unknown prefix: "${fromPre}")`
      if (toFactor === undefined) return `(unknown prefix: "${toPre}")`
      const value = parseFloat(numStr)
      if (isNaN(value)) return '(invalid number)'
      const result = value * fromFactor / toFactor
      const fmt = (n) => parseFloat(n.toPrecision(10)).toString()
      return [
        `${value} ${fromPre}${fromUnit} = ${fmt(result)} ${toPre}${toUnit}`,
        '',
        `From: ${fromPre || '(base)'} (${prefixNames[fromPre] || ''}) = ${fromFactor}`,
        `To:   ${toPre || '(base)'} (${prefixNames[toPre] || ''}) = ${toFactor}`,
        `Ratio: ×${fmt(fromFactor / toFactor)}`,
      ].join('\n')
    },
  },
  {
    id: 'http-headers-parse',
    name: 'HTTP Headers Parse',
    category: 'utility',
    description: 'Parse raw HTTP request/response headers and display structured info',
    placeholder: 'HTTP/1.1 200 OK\nContent-Type: application/json; charset=utf-8\nCache-Control: no-cache, no-store\nX-RateLimit-Remaining: 99\nContent-Length: 1234',
    convert: (input) => {
      const lines = input.trim().split('\n')
      if (lines.length === 0) return '(enter HTTP headers)'
      const results = []
      let statusLine = null
      const headers = {}
      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed) continue
        if (/^HTTP\//.test(trimmed) || /^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS|TRACE) /.test(trimmed)) {
          statusLine = trimmed
          continue
        }
        const colonIdx = trimmed.indexOf(':')
        if (colonIdx < 0) continue
        const name = trimmed.slice(0, colonIdx).trim()
        const value = trimmed.slice(colonIdx + 1).trim()
        headers[name.toLowerCase()] = value
        results.push(`${name}: ${value}`)
      }
      const output = []
      if (statusLine) output.push(`Status: ${statusLine}`, '')
      output.push(`Headers (${results.length}):`)
      // Parse common headers specially
      const ct = headers['content-type']
      if (ct) output.push(`  Content-Type: ${ct.split(';')[0].trim()}${ct.includes('charset') ? ` (charset: ${ct.match(/charset=([^\s;]+)/i)?.[1] || '?'})` : ''}`)
      const cc = headers['cache-control']
      if (cc) output.push(`  Cache-Control: ${cc}`)
      const auth = headers['authorization']
      if (auth) {
        const scheme = auth.split(' ')[0]
        output.push(`  Authorization: ${scheme} (${scheme === 'Bearer' ? 'JWT/token' : scheme === 'Basic' ? 'base64 credentials' : 'custom'})`)
      }
      const cors = headers['access-control-allow-origin']
      if (cors) output.push(`  CORS: ${cors}`)
      const cl = headers['content-length']
      if (cl) output.push(`  Content-Length: ${cl} bytes (${(parseInt(cl) / 1024).toFixed(2)} KB)`)
      output.push('')
      output.push('All headers:')
      output.push(...results.map(r => `  ${r}`))
      return output.join('\n')
    },
  },
  {
    id: 'semver-parse',
    name: 'SemVer Parser',
    category: 'utility',
    description: 'Parse and compare semantic version strings',
    placeholder: '1.2.3-alpha.1+build.20231101',
    convert: (input) => {
      const lines = input.trim().split('\n').map(l => l.trim()).filter(Boolean)
      const semverRe = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/
      function parse(v) {
        const m = semverRe.exec(v.replace(/^v/, ''))
        if (!m) return null
        return { major: +m[1], minor: +m[2], patch: +m[3], prerelease: m[4] || null, build: m[5] || null }
      }
      function compare(a, b) {
        if (a.major !== b.major) return a.major - b.major
        if (a.minor !== b.minor) return a.minor - b.minor
        if (a.patch !== b.patch) return a.patch - b.patch
        if (!a.prerelease && b.prerelease) return 1
        if (a.prerelease && !b.prerelease) return -1
        if (!a.prerelease && !b.prerelease) return 0
        const aParts = a.prerelease.split('.'), bParts = b.prerelease.split('.')
        for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
          const ap = aParts[i], bp = bParts[i]
          if (ap === undefined) return -1
          if (bp === undefined) return 1
          const an = parseInt(ap), bn = parseInt(bp)
          if (!isNaN(an) && !isNaN(bn)) { if (an !== bn) return an - bn }
          else if (ap !== bp) return ap < bp ? -1 : 1
        }
        return 0
      }
      if (lines.length === 1) {
        const v = parse(lines[0])
        if (!v) return `(invalid semver: "${lines[0]}")`
        return [
          `Version: ${lines[0]}`,
          `Major:      ${v.major}`,
          `Minor:      ${v.minor}`,
          `Patch:      ${v.patch}`,
          ...(v.prerelease ? [`Pre-release: ${v.prerelease}`, '  (pre-releases have lower precedence than release)'] : []),
          ...(v.build ? [`Build:       ${v.build}`, '  (build metadata is ignored in comparisons)'] : []),
          '',
          `Next patch:  ${v.major}.${v.minor}.${v.patch + 1}`,
          `Next minor:  ${v.major}.${v.minor + 1}.0`,
          `Next major:  ${v.major + 1}.0.0`,
        ].join('\n')
      }
      // Multiple versions — sort and compare
      const parsed = lines.map(l => ({ raw: l, v: parse(l) }))
      const invalid = parsed.filter(p => !p.v)
      if (invalid.length > 0) return `(invalid semver: ${invalid.map(p => p.raw).join(', ')})`
      const sorted = [...parsed].sort((a, b) => compare(a.v, b.v))
      return [
        'Sorted (oldest → newest):',
        ...sorted.map((p, i) => `  ${i + 1}. ${p.raw}`),
        '',
        lines.length === 2 ? `Comparison: ${lines[0]} ${compare(parsed[0].v, parsed[1].v) > 0 ? '>' : compare(parsed[0].v, parsed[1].v) < 0 ? '<' : '='} ${lines[1]}` : '',
      ].filter(l => l !== '').join('\n')
    },
  },
  {
    id: 'json-pointer',
    name: 'JSON Pointer (RFC 6901)',
    category: 'data',
    description: 'Extract values from JSON using RFC 6901 JSON Pointer — format: pointer on first line, then JSON',
    placeholder: '/users/0/name\n{"users":[{"name":"Alice","age":30},{"name":"Bob","age":25}]}',
    convert: (input) => {
      const newline = input.indexOf('\n')
      if (newline === -1) return '(first line: JSON pointer like /foo/bar/0, rest: JSON)'
      const pointer = input.slice(0, newline).trim()
      try {
        const data = JSON.parse(input.slice(newline + 1).trim())
        if (!pointer.startsWith('/') && pointer !== '') return '(JSON pointer must start with / or be empty)'
        const parts = pointer === '' ? [] : pointer.slice(1).split('/').map(p => p.replace(/~1/g, '/').replace(/~0/g, '~'))
        let current = data
        for (const part of parts) {
          if (current === null || typeof current !== 'object') return `(cannot traverse into ${JSON.stringify(current)} with key "${part}")`
          if (Array.isArray(current)) {
            const idx = part === '-' ? current.length - 1 : parseInt(part, 10)
            if (isNaN(idx) || idx < 0 || idx >= current.length) return `(array index out of bounds: ${part})`
            current = current[idx]
          } else {
            if (!(part in current)) return `(key not found: "${part}")`
            current = current[part]
          }
        }
        return [
          `Pointer: ${pointer || '(root)'}`,
          `Type:    ${Array.isArray(current) ? 'array' : typeof current}`,
          '',
          typeof current === 'object' ? JSON.stringify(current, null, 2) : String(current),
        ].join('\n')
      } catch (e) {
        return `(error: ${e.message})`
      }
    },
  },
  {
    id: 'color-contrast-ratio',
    name: 'Contrast Ratio Calculator',
    category: 'utility',
    description: 'Calculate contrast ratio between two hex colors and show WCAG level — format: #color1 #color2',
    placeholder: '#ffffff #333333',
    convert: (input) => {
      const parts = input.trim().split(/\s+/)
      if (parts.length !== 2) return '(enter two hex colors: #ffffff #000000)'
      function hexToRgb(hex) {
        const h = hex.replace('#', '')
        if (h.length === 3) {
          return { r: parseInt(h[0]+h[0], 16), g: parseInt(h[1]+h[1], 16), b: parseInt(h[2]+h[2], 16) }
        }
        if (h.length !== 6) return null
        return { r: parseInt(h.slice(0,2), 16), g: parseInt(h.slice(2,4), 16), b: parseInt(h.slice(4,6), 16) }
      }
      function relativeLuminance({ r, g, b }) {
        const c = [r, g, b].map(v => {
          const s = v / 255
          return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
        })
        return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
      }
      const rgb1 = hexToRgb(parts[0])
      const rgb2 = hexToRgb(parts[1])
      if (!rgb1) return `(invalid color: ${parts[0]})`
      if (!rgb2) return `(invalid color: ${parts[1]})`
      const L1 = relativeLuminance(rgb1)
      const L2 = relativeLuminance(rgb2)
      const lighter = Math.max(L1, L2)
      const darker = Math.min(L1, L2)
      const ratio = (lighter + 0.05) / (darker + 0.05)
      const passAA = ratio >= 4.5
      const passAAA = ratio >= 7
      const passAALarge = ratio >= 3
      const passAAALarge = ratio >= 4.5
      return [
        `${parts[0]} on ${parts[1]}`,
        '',
        `Contrast ratio: ${ratio.toFixed(2)}:1`,
        '',
        `WCAG AA  (normal text,  4.5:1): ${passAA ? '✓ Pass' : '✗ Fail'}`,
        `WCAG AA  (large text,   3.0:1): ${passAALarge ? '✓ Pass' : '✗ Fail'}`,
        `WCAG AAA (normal text,  7.0:1): ${passAAA ? '✓ Pass' : '✗ Fail'}`,
        `WCAG AAA (large text,   4.5:1): ${passAAALarge ? '✓ Pass' : '✗ Fail'}`,
        '',
        `Color 1 luminance: ${L1.toFixed(4)}`,
        `Color 2 luminance: ${L2.toFixed(4)}`,
      ].join('\n')
    },
  },
  {
    id: 'text-inflect',
    name: 'Word Inflection',
    category: 'utility',
    description: 'Pluralize/singularize English words and convert between cases (camelCase, snake_case, etc.)',
    placeholder: 'userProfile',
    convert: (input) => {
      const s = input.trim()
      if (!s) return ''
      function pluralize(word) {
        const irregulars = { mouse:'mice', goose:'geese', tooth:'teeth', foot:'feet', person:'people', man:'men', woman:'women', child:'children', ox:'oxen', index:'indices', criterion:'criteria', datum:'data', medium:'media', formula:'formulae', analysis:'analyses', basis:'bases', thesis:'theses', matrix:'matrices' }
        const w = word.toLowerCase()
        if (irregulars[w]) return irregulars[w]
        if (/(?:s|sh|ch|x|z)$/i.test(word)) return word + 'es'
        if (/[aeiou]y$/i.test(word)) return word + 's'
        if (/[^aeiou]y$/i.test(word)) return word.slice(0, -1) + 'ies'
        if (/(?:f|fe)$/i.test(word)) return word.replace(/(?:f|fe)$/, 'ves')
        if (/o$/i.test(word)) return word + 'es'
        return word + 's'
      }
      // Detect and convert case
      const isCamel = /^[a-z][a-zA-Z0-9]+$/.test(s)
      const isPascal = /^[A-Z][a-zA-Z0-9]+$/.test(s)
      const isSnake = /^[a-z][a-z0-9_]+[a-z0-9]$/.test(s)
      const isKebab = /^[a-z][a-z0-9-]+[a-z0-9]$/.test(s)
      const isScreaming = /^[A-Z][A-Z0-9_]+[A-Z0-9]$/.test(s)
      let words = []
      if (isCamel || isPascal) words = s.replace(/([A-Z])/g, ' $1').trim().split(/\s+/).map(w => w.toLowerCase())
      else if (isSnake || isScreaming) words = s.toLowerCase().split('_').filter(Boolean)
      else if (isKebab) words = s.toLowerCase().split('-').filter(Boolean)
      else words = s.toLowerCase().split(/\s+/).filter(Boolean)
      const lastWord = words[words.length - 1]
      const plural = [...words.slice(0, -1), pluralize(lastWord)]
      const camel = words.map((w, i) => i === 0 ? w : w[0].toUpperCase() + w.slice(1)).join('')
      const pascal = words.map(w => w[0].toUpperCase() + w.slice(1)).join('')
      const snake = words.join('_')
      const kebab = words.join('-')
      const screaming = words.join('_').toUpperCase()
      const title = words.map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
      return [
        `Input: ${s}`,
        '',
        `camelCase:  ${camel}`,
        `PascalCase: ${pascal}`,
        `snake_case: ${snake}`,
        `kebab-case: ${kebab}`,
        `SCREAMING:  ${screaming}`,
        `Title Case: ${title}`,
        '',
        `Plural:     ${plural.join(' ')}`,
      ].join('\n')
    },
  },
  {
    id: 'yaml-to-toml',
    name: 'YAML to TOML',
    category: 'data',
    description: 'Convert YAML to TOML format',
    placeholder: 'title: My App\ndatabase:\n  host: localhost\n  port: 5432',
    convert: (input) => {
      try {
        const obj = yamlToJson(input.trim())
        function toTomlValue(val) {
          if (val === null || val === undefined) return '""'
          if (typeof val === 'boolean') return String(val)
          if (typeof val === 'number') return String(val)
          if (typeof val === 'string') return JSON.stringify(val)
          if (Array.isArray(val) && val.every(v => typeof v !== 'object' || v === null)) {
            return '[' + val.map(toTomlValue).join(', ') + ']'
          }
          return null
        }
        function buildToml(obj, prefix = '') {
          const scalars = [], tables = [], arrays = []
          for (const [key, val] of Object.entries(obj)) {
            const fullKey = prefix ? `${prefix}.${key}` : key
            const v = toTomlValue(val)
            if (v !== null) scalars.push(`${key} = ${v}`)
            else if (Array.isArray(val)) arrays.push([key, fullKey, val])
            else if (typeof val === 'object') tables.push([key, fullKey, val])
          }
          const parts = [...scalars]
          for (const [, fullKey, val] of tables) {
            parts.push('', `[${fullKey}]`)
            parts.push(buildToml(val, fullKey))
          }
          for (const [, fullKey, arr] of arrays) {
            for (const item of arr) {
              parts.push('', `[[${fullKey}]]`)
              if (typeof item === 'object' && item !== null) {
                for (const [k, v] of Object.entries(item)) {
                  const tv = toTomlValue(v)
                  if (tv !== null) parts.push(`${k} = ${tv}`)
                }
              }
            }
          }
          return parts.join('\n')
        }
        return buildToml(obj)
      } catch (e) {
        return `(error: ${e.message})`
      }
    },
  },
  {
    id: 'json-to-table',
    name: 'JSON to ASCII Table',
    category: 'data',
    description: 'Render a JSON array of objects as a formatted ASCII table',
    placeholder: '[{"name":"Alice","age":30,"city":"NYC"},{"name":"Bob","age":25,"city":"LA"}]',
    convert: (input) => {
      try {
        const data = JSON.parse(input.trim())
        if (!Array.isArray(data) || data.length === 0) return '(expected a non-empty JSON array of objects)'
        const keys = [...new Set(data.flatMap(r => Object.keys(r)))]
        const rows = data.map(r => keys.map(k => String(r[k] ?? '')))
        const widths = keys.map((k, i) => Math.max(k.length, ...rows.map(r => r[i].length)))
        const hr = '+' + widths.map(w => '-'.repeat(w + 2)).join('+') + '+'
        const headerRow = '|' + keys.map((k, i) => ` ${k.padEnd(widths[i])} `).join('|') + '|'
        const dataRows = rows.map(row => '|' + row.map((c, i) => ` ${c.padEnd(widths[i])} `).join('|') + '|')
        return [hr, headerRow, hr, ...dataRows, hr].join('\n')
      } catch (e) {
        return `(invalid JSON: ${e.message})`
      }
    },
  },
  {
    id: 'git-log-parse',
    name: 'Git Log Parser',
    category: 'utility',
    description: 'Parse git log --oneline output and categorize by conventional commit type',
    placeholder: 'abc1234 feat: add OAuth login\ndef5678 fix: resolve race condition\n789abcd chore: update dependencies',
    convert: (input) => {
      const lines = input.trim().split('\n').filter(Boolean)
      if (lines.length === 0) return '(paste git log --oneline output)'
      const commits = lines.map(line => {
        const m = line.match(/^([0-9a-f]{4,40})\s+(.+)$/)
        return { hash: m ? m[1].slice(0, 7) : '', msg: m ? m[2] : line }
      })
      const types = { feat: [], fix: [], docs: [], chore: [], refactor: [], test: [], style: [], perf: [], other: [] }
      for (const c of commits) {
        const m = c.msg.match(/^(feat|fix|docs|chore|refactor|test|style|perf)(?:\(.+\))?!?:\s*(.+)/)
        if (m) types[m[1]].push(`  ${c.hash} ${m[2]}`)
        else types.other.push(`  ${c.hash} ${c.msg}`)
      }
      const labels = { feat:'Features', fix:'Bug fixes', docs:'Docs', chore:'Chores', refactor:'Refactoring', test:'Tests', style:'Style', perf:'Performance', other:'Other' }
      const out = [`Total commits: ${commits.length}`, '']
      for (const [type, items] of Object.entries(types)) {
        if (items.length === 0) continue
        out.push(`${labels[type]} (${items.length}):`)
        out.push(...items.slice(0, 15))
        if (items.length > 15) out.push(`  ... and ${items.length - 15} more`)
        out.push('')
      }
      return out.join('\n').trimEnd()
    },
  },
  {
    id: 'sql-to-json-schema',
    name: 'SQL CREATE to JSON Schema',
    category: 'data',
    description: 'Parse a SQL CREATE TABLE statement and generate a JSON Schema',
    placeholder: 'CREATE TABLE users (\n  id INT PRIMARY KEY,\n  name VARCHAR(255) NOT NULL,\n  email TEXT UNIQUE,\n  active BOOLEAN DEFAULT true\n);',
    convert: (input) => {
      try {
        const tableMatch = input.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?["'`]?(\w+)["'`]?\s*\(([\s\S]+)\)/i)
        if (!tableMatch) return '(could not parse CREATE TABLE statement)'
        const tableName = tableMatch[1]
        const columnsDef = tableMatch[2]
        const props = {}
        const required = []
        const lines = columnsDef.split(',').map(l => l.trim()).filter(l => l && !l.toUpperCase().match(/^(PRIMARY KEY|UNIQUE|CHECK|FOREIGN|INDEX|KEY)\b/))
        for (const line of lines) {
          const parts = line.match(/^["'`]?(\w+)["'`]?\s+([\w()]+)(.*)$/)
          if (!parts) continue
          const [, colName, rawType, rest] = parts
          const upper = rawType.toUpperCase()
          let jsonType = 'string'
          if (/^(INT|BIGINT|SMALLINT|TINYINT|SERIAL)/.test(upper)) jsonType = 'integer'
          else if (/^(FLOAT|DOUBLE|DECIMAL|NUMERIC|REAL)/.test(upper)) jsonType = 'number'
          else if (/^BOOL/.test(upper)) jsonType = 'boolean'
          else if (/^JSON/.test(upper)) jsonType = 'object'
          const prop = { type: jsonType }
          const lenMatch = rawType.match(/\((\d+)\)/)
          if (lenMatch && jsonType === 'string') prop.maxLength = parseInt(lenMatch[1])
          const defaultMatch = rest.match(/DEFAULT\s+(['"]?)([^'",\s]+)\1/i)
          if (defaultMatch) {
            const dv = defaultMatch[2]
            prop.default = dv === 'true' ? true : dv === 'false' ? false : /^\d+$/.test(dv) ? parseInt(dv) : dv
          }
          props[colName] = prop
          if (/NOT NULL/i.test(rest) || /PRIMARY KEY/i.test(rest)) required.push(colName)
        }
        const schema = { '$schema': 'http://json-schema.org/draft-07/schema#', title: tableName, type: 'object', properties: props }
        if (required.length > 0) schema.required = required
        return JSON.stringify(schema, null, 2)
      } catch (e) {
        return `(parse error: ${e.message})`
      }
    },
  },
  {
    id: 'markdown-escape',
    name: 'Markdown Escape',
    category: 'encode',
    description: 'Escape special Markdown characters (adds backslashes before *, _, [, etc.)',
    placeholder: '# Hello *World* [link](url) `code` > quote',
    convert: (input) => {
      const specialChars = /([\\`*_{}[\]()#+.!|-])/g
      const escaped = input.replace(specialChars, '\\$1')
      const unescaped = input.replace(/\\([\\`*_{}[\]()#+.!|-])/g, '$1')
      if (escaped === input) {
        return ['No special characters to escape.', '', 'Unescaped version (removing existing backslashes):', unescaped].join('\n')
      }
      return ['Escaped:', escaped, '', 'Unescaped (for reference):', unescaped].join('\n')
    },
  },
  {
    id: 'ip-range',
    name: 'IP Range to CIDR',
    category: 'utility',
    description: 'Convert an IP range to CIDR notation — format: start-end (e.g. 192.168.1.0-192.168.1.255)',
    placeholder: '192.168.1.0-192.168.1.255',
    convert: (input) => {
      const m = input.trim().match(/^(\d+\.\d+\.\d+\.\d+)\s*[-–]\s*(\d+\.\d+\.\d+\.\d+)$/)
      if (!m) return '(format: start-end, e.g. 192.168.1.0-192.168.1.255)'
      function ipToNum(ip) {
        const parts = ip.split('.').map(Number)
        if (parts.some(p => p < 0 || p > 255)) return NaN
        return (parts[0] << 24 | parts[1] << 16 | parts[2] << 8 | parts[3]) >>> 0
      }
      function numToIp(n) {
        return `${(n >>> 24) & 255}.${(n >>> 16) & 255}.${(n >>> 8) & 255}.${n & 255}`
      }
      const start = ipToNum(m[1]), end = ipToNum(m[2])
      if (isNaN(start) || isNaN(end)) return '(invalid IP address)'
      if (start > end) return '(start must be <= end)'
      const count = end - start + 1
      // Find the smallest CIDR(s) that cover the range
      const cidrs = []
      let remaining = count
      let current = start
      while (remaining > 0) {
        let prefix = 32
        while (prefix > 0 && (current & (1 << (32 - prefix))) === 0 && (1 << (32 - prefix)) <= remaining) prefix--
        const size = 1 << (32 - prefix)
        cidrs.push(`${numToIp(current)}/${prefix}  (${size} addresses)`)
        current = (current + size) >>> 0
        remaining -= size
      }
      return [
        `Range: ${m[1]} — ${m[2]}`,
        `Count: ${count.toLocaleString()} addresses`,
        '',
        `CIDR notation:`,
        ...cidrs.map(c => `  ${c}`),
      ].join('\n')
    },
  },
  {
    id: 'json-to-form-data',
    name: 'JSON → FormData / URLEncoded',
    category: 'data',
    description: 'Convert flat JSON object to FormData or application/x-www-form-urlencoded format',
    placeholder: '{"name": "Alice", "age": 30, "city": "NYC"}',
    convert: (input) => {
      try {
        const obj = JSON.parse(input.trim())
        if (typeof obj !== 'object' || Array.isArray(obj) || obj === null) return '(input must be a flat JSON object)'
        const encoded = new URLSearchParams()
        const curlParts = []
        const fdParts = []
        for (const [k, v] of Object.entries(obj)) {
          const val = typeof v === 'object' ? JSON.stringify(v) : String(v)
          encoded.set(k, val)
          curlParts.push(`  -d "${k}=${encodeURIComponent(val)}"`)
          fdParts.push(`formData.append('${k}', '${val.replace(/'/g, "\\'")}')`)
        }
        return [
          'URL-encoded:',
          `  ${encoded.toString()}`,
          '',
          'Fetch (FormData):',
          `  const formData = new FormData()`,
          ...fdParts.map(l => `  ${l}`),
          '',
          'curl flags:',
          ...curlParts,
        ].join('\n')
      } catch (e) { return `(JSON parse error: ${e.message})` }
    },
  },
  {
    id: 'css-to-js-obj',
    name: 'CSS → JS Object (React style)',
    category: 'encode',
    description: 'Convert CSS properties to JavaScript object notation for React inline styles',
    placeholder: 'background-color: #ff6b35;\nfont-size: 16px;\nmargin-top: 8px;',
    convert: (input) => {
      const lines = input.trim().split(';').map(l => l.trim()).filter(Boolean)
      const props = []
      for (const line of lines) {
        const colon = line.indexOf(':')
        if (colon === -1) continue
        const prop = line.slice(0, colon).trim()
        const val = line.slice(colon + 1).trim()
        // Convert kebab-case to camelCase
        const camel = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
        // Numeric values (px, em, rem, %) — keep as string in JS
        const jsVal = /^\d+(\.\d+)?(px|em|rem|vh|vw|%|s|ms|deg|fr)$/.test(val) ? `'${val}'` :
                     /^[\d.]+$/.test(val) ? val : `'${val}'`
        props.push(`  ${camel}: ${jsVal},`)
      }
      if (props.length === 0) return '(no valid CSS properties found)'
      return `const style = {\n${props.join('\n')}\n}`
    },
  },
  {
    id: 'ts-type-gen',
    name: 'JSON → TypeScript Type',
    category: 'data',
    description: 'Generate a TypeScript type/interface from a JSON example',
    placeholder: '{"id": 1, "name": "Alice", "tags": ["admin"], "address": {"city": "NYC"}}',
    convert: (input) => {
      try {
        const obj = JSON.parse(input.trim())
        function inferType(val, indent = '  ') {
          if (val === null) return 'null'
          if (Array.isArray(val)) {
            if (val.length === 0) return 'unknown[]'
            const types = [...new Set(val.map(v => inferType(v, indent)))]
            const t = types.length === 1 ? types[0] : `(${types.join(' | ')})`
            return `${t}[]`
          }
          if (typeof val === 'object') {
            const lines = Object.entries(val).map(([k, v]) => {
              const t = inferType(v, indent + '  ')
              return `${indent}  ${k}: ${t}`
            })
            return `{\n${lines.join('\n')}\n${indent}}`
          }
          return typeof val
        }
        if (typeof obj !== 'object' || obj === null) return `type Root = ${inferType(obj)}`
        const lines = Object.entries(obj).map(([k, v]) => `  ${k}: ${inferType(v)}`)
        return `interface Root {\n${lines.join('\n')}\n}`
      } catch (e) { return `(JSON parse error: ${e.message})` }
    },
  },
  {
    id: 'mime-lookup',
    name: 'MIME Type Lookup',
    category: 'data',
    description: 'Look up MIME type by file extension or find extensions for a MIME type',
    placeholder: 'pdf',
    convert: (input) => {
      const mimes = {
        'html': 'text/html', 'htm': 'text/html', 'css': 'text/css', 'js': 'application/javascript',
        'json': 'application/json', 'xml': 'application/xml', 'txt': 'text/plain', 'csv': 'text/csv',
        'md': 'text/markdown', 'yaml': 'application/x-yaml', 'yml': 'application/x-yaml',
        'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'png': 'image/png', 'gif': 'image/gif',
        'webp': 'image/webp', 'svg': 'image/svg+xml', 'ico': 'image/x-icon', 'bmp': 'image/bmp',
        'tif': 'image/tiff', 'tiff': 'image/tiff', 'avif': 'image/avif', 'heic': 'image/heic',
        'mp4': 'video/mp4', 'webm': 'video/webm', 'ogv': 'video/ogg', 'mov': 'video/quicktime',
        'avi': 'video/x-msvideo', 'mkv': 'video/x-matroska', 'm4v': 'video/mp4',
        'mp3': 'audio/mpeg', 'ogg': 'audio/ogg', 'wav': 'audio/wav', 'flac': 'audio/flac',
        'm4a': 'audio/mp4', 'aac': 'audio/aac', 'opus': 'audio/opus',
        'pdf': 'application/pdf', 'doc': 'application/msword',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'xls': 'application/vnd.ms-excel',
        'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'ppt': 'application/vnd.ms-powerpoint',
        'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'zip': 'application/zip', 'tar': 'application/x-tar', 'gz': 'application/gzip',
        'rar': 'application/x-rar-compressed', '7z': 'application/x-7z-compressed',
        'woff': 'font/woff', 'woff2': 'font/woff2', 'ttf': 'font/ttf', 'otf': 'font/otf',
        'wasm': 'application/wasm', 'pb': 'application/x-protobuf',
        'sh': 'application/x-sh', 'py': 'text/x-python', 'rb': 'application/x-ruby',
        'java': 'text/x-java-source', 'c': 'text/x-c', 'h': 'text/x-c',
        'cpp': 'text/x-c++', 'ts': 'application/typescript', 'tsx': 'application/typescript',
        'jsx': 'text/jsx', 'go': 'text/x-go', 'rs': 'text/x-rustsrc',
      }
      const q = input.trim().toLowerCase().replace(/^\./, '').replace(/^.*\//, '')
      // Check if it's a MIME type (contains /)
      if (q.includes('/')) {
        const matches = Object.entries(mimes).filter(([, m]) => m === q).map(([ext]) => `.${ext}`)
        if (matches.length === 0) return `MIME type: ${q}\nExtensions: (none found in database)`
        return `MIME type: ${q}\nExtensions: ${matches.join(', ')}`
      }
      // Look up by extension
      const ext = q.split('.').pop()
      const mime = mimes[ext]
      if (!mime) {
        // Try partial match
        const partials = Object.keys(mimes).filter(k => k.includes(ext)).slice(0, 10)
        return partials.length ? `No exact match for ".${ext}"\n\nSimilar: ${partials.map(k => `.${k} → ${mimes[k]}`).join('\n  ')}` : `Unknown extension: .${ext}`
      }
      const sameType = Object.entries(mimes).filter(([, m]) => m === mime && `.${ext}` !== `.${ext}`).map(([e]) => `.${e}`)
      return [
        `Extension: .${ext}`,
        `MIME type: ${mime}`,
        `Category: ${mime.split('/')[0]}`,
        sameType.length ? `Also: ${sameType.join(', ')}` : '',
        '',
        `Content-Type header:`,
        `  Content-Type: ${mime}${mime.startsWith('text/') ? '; charset=utf-8' : ''}`,
      ].filter(Boolean).join('\n')
    },
  },
  {
    id: 'open-graph-meta',
    name: 'Open Graph Meta Tags',
    category: 'web',
    description: 'Generate Open Graph meta tags — enter "title | description | url | image" (pipe-separated)',
    placeholder: 'My Page Title | A short description of the page | https://example.com | https://example.com/image.jpg',
    convert: (input) => {
      const parts = input.split('|').map(s => s.trim())
      const [title = '', description = '', url = '', image = ''] = parts
      if (!title) return '(enter: title | description | url | image)'
      const escape = s => s.replace(/"/g, '&quot;')
      const tags = [
        '<!-- Open Graph / Facebook -->',
        `<meta property="og:type" content="website">`,
        url ? `<meta property="og:url" content="${escape(url)}">` : '',
        `<meta property="og:title" content="${escape(title)}">`,
        description ? `<meta property="og:description" content="${escape(description)}">` : '',
        image ? `<meta property="og:image" content="${escape(image)}">` : '',
        '',
        '<!-- Twitter -->',
        `<meta property="twitter:card" content="${image ? 'summary_large_image' : 'summary'}">`,
        url ? `<meta property="twitter:url" content="${escape(url)}">` : '',
        `<meta property="twitter:title" content="${escape(title)}">`,
        description ? `<meta property="twitter:description" content="${escape(description)}">` : '',
        image ? `<meta property="twitter:image" content="${escape(image)}">` : '',
        '',
        '<!-- Standard -->',
        `<title>${escape(title)}</title>`,
        description ? `<meta name="description" content="${escape(description)}">` : '',
      ].filter(s => s !== undefined && (s === '' || s.startsWith('<')))
      return tags.join('\n')
    },
  },
  {
    id: 'http-status-lookup',
    name: 'HTTP Status Code Lookup',
    category: 'web',
    description: 'Look up HTTP status code meaning and description — enter a code like "404" or partial name like "not found"',
    placeholder: '404',
    convert: (input) => {
      const statuses = {
        100: ['Continue', 'The server has received the request headers and the client should proceed to send the request body.'],
        101: ['Switching Protocols', 'The requester has asked the server to switch protocols.'],
        200: ['OK', 'Standard response for successful HTTP requests.'],
        201: ['Created', 'The request has been fulfilled, resulting in the creation of a new resource.'],
        202: ['Accepted', 'The request has been accepted for processing, but the processing has not been completed.'],
        204: ['No Content', 'The server successfully processed the request, but is not returning any content.'],
        206: ['Partial Content', 'The server is delivering only part of the resource due to a Range header sent by the client.'],
        301: ['Moved Permanently', 'This and all future requests should be directed to the given URI.'],
        302: ['Found', 'Temporary redirect. The client should use the original URL for future requests.'],
        304: ['Not Modified', 'Indicates the resource has not been modified since last requested (use cached version).'],
        307: ['Temporary Redirect', 'Temporary redirect, method must not change.'],
        308: ['Permanent Redirect', 'Permanent redirect, method must not change.'],
        400: ['Bad Request', 'The server cannot or will not process the request due to a client error.'],
        401: ['Unauthorized', 'Authentication is required and has failed or has not yet been provided.'],
        403: ['Forbidden', 'The server understood the request but refuses to authorize it.'],
        404: ['Not Found', 'The requested resource could not be found.'],
        405: ['Method Not Allowed', 'A request method is not supported for the requested resource.'],
        408: ['Request Timeout', 'The server timed out waiting for the request.'],
        409: ['Conflict', 'Indicates that the request could not be processed because of conflict in the request.'],
        410: ['Gone', 'Indicates that the resource requested is no longer available.'],
        413: ['Payload Too Large', 'The request is larger than the server is willing or able to process.'],
        414: ['URI Too Long', 'The URI provided was too long for the server to process.'],
        415: ['Unsupported Media Type', 'The request entity has a media type which the server or resource does not support.'],
        422: ['Unprocessable Entity', 'The request was well-formed but was unable to be followed due to semantic errors.'],
        429: ['Too Many Requests', 'The user has sent too many requests in a given amount of time ("rate limiting").'],
        500: ['Internal Server Error', 'A generic error message, given when an unexpected condition was encountered.'],
        501: ['Not Implemented', 'The server does not recognize the request method, or lacks the ability to fulfill it.'],
        502: ['Bad Gateway', 'The server was acting as a gateway or proxy and received an invalid response from the upstream server.'],
        503: ['Service Unavailable', 'The server is currently unavailable (overloaded or down for maintenance).'],
        504: ['Gateway Timeout', 'The server was acting as a gateway or proxy and did not receive a timely response.'],
      }
      const q = input.trim()
      const code = parseInt(q)
      if (!isNaN(code) && statuses[code]) {
        const [name, desc] = statuses[code]
        const category = code < 200 ? '1xx Informational' : code < 300 ? '2xx Success' : code < 400 ? '3xx Redirection' : code < 500 ? '4xx Client Error' : '5xx Server Error'
        return [`${code} ${name}`, `Category: ${category}`, '', desc].join('\n')
      }
      if (!isNaN(code)) {
        const nearby = Object.keys(statuses).filter(k => Math.floor(Number(k) / 100) === Math.floor(code / 100)).map(k => `  ${k}: ${statuses[k][0]}`).join('\n')
        return `Unknown status: ${code}\n\nCodes in ${Math.floor(code/100)}xx range:\n${nearby || '(none known)'}`
      }
      // text search
      const search = q.toLowerCase()
      const matches = Object.entries(statuses).filter(([, [name, desc]]) => name.toLowerCase().includes(search) || desc.toLowerCase().includes(search))
      if (!matches.length) return `(no status codes match "${q}")`
      return matches.map(([k, [name, desc]]) => `${k} ${name}\n  ${desc}`).join('\n\n')
    },
  },
  {
    id: 'cors-headers',
    name: 'CORS Headers Generator',
    category: 'web',
    description: 'Generate CORS headers for your API — enter "origin [methods] [headers]" e.g. "https://example.com GET,POST Authorization,Content-Type"',
    placeholder: 'https://example.com GET,POST,PUT,DELETE Authorization,Content-Type',
    convert: (input) => {
      const parts = input.trim().split(/\s+/)
      const origin = parts[0] || '*'
      const methods = parts[1] || 'GET,POST,PUT,DELETE,OPTIONS'
      const headers = parts[2] || 'Authorization,Content-Type,Accept'
      const isWildcard = origin === '*'
      const lines = [
        '# CORS Response Headers:',
        `Access-Control-Allow-Origin: ${origin}`,
        `Access-Control-Allow-Methods: ${methods}`,
        `Access-Control-Allow-Headers: ${headers}`,
        isWildcard ? '' : 'Access-Control-Allow-Credentials: true',
        'Access-Control-Max-Age: 86400',
        '',
        '# Nginx config:',
        `add_header Access-Control-Allow-Origin "${origin}";`,
        `add_header Access-Control-Allow-Methods "${methods}";`,
        `add_header Access-Control-Allow-Headers "${headers}";`,
        isWildcard ? '' : 'add_header Access-Control-Allow-Credentials "true";',
        '',
        '# Express.js middleware:',
        "app.use((req, res, next) => {",
        `  res.setHeader('Access-Control-Allow-Origin', '${origin}')`,
        `  res.setHeader('Access-Control-Allow-Methods', '${methods}')`,
        `  res.setHeader('Access-Control-Allow-Headers', '${headers}')`,
        isWildcard ? '' : `  res.setHeader('Access-Control-Allow-Credentials', 'true')`,
        "  if (req.method === 'OPTIONS') return res.sendStatus(204)",
        "  next()",
        "})",
      ].filter(s => s !== undefined && s !== null)
      return lines.join('\n')
    },
  },
  {
    id: 'cookie-parser',
    name: 'Cookie Parser',
    category: 'web',
    description: 'Parse a Cookie header string into key-value pairs, or build a Set-Cookie header',
    placeholder: 'sessionId=abc123; theme=dark; lang=en; _ga=GA1.2.123456',
    convert: (input) => {
      const s = input.trim()
      if (!s) return '(enter a cookie string)'
      // Detect Set-Cookie format
      if (s.toLowerCase().startsWith('set-cookie:') || s.includes('expires=') || s.includes('HttpOnly') || s.includes('Secure')) {
        const parts = s.replace(/^set-cookie:\s*/i, '').split(/;\s*/)
        const [nameVal, ...attrs] = parts
        const [name, ...valParts] = nameVal.split('=')
        const value = valParts.join('=')
        const parsed = attrs.map(a => {
          const [k, ...vp] = a.split('=')
          return { key: k.trim(), value: vp.join('=').trim() }
        })
        return [
          'Set-Cookie parsed:',
          `  Name:  ${name}`,
          `  Value: ${value}`,
          '',
          'Attributes:',
          ...parsed.map(({ key, value: v }) => `  ${key}${v ? ': ' + v : ' (flag)'}`),
        ].join('\n')
      }
      // Regular Cookie header
      const cookies = s.split(/;\s*/).map(c => {
        const eq = c.indexOf('=')
        return eq === -1 ? { name: c.trim(), value: '' } : { name: c.slice(0, eq).trim(), value: c.slice(eq + 1).trim() }
      }).filter(c => c.name)
      return [
        `Parsed ${cookies.length} cookie${cookies.length !== 1 ? 's' : ''}:`,
        '',
        ...cookies.map((c, i) => `${i + 1}. ${c.name}\n   Value: ${c.value || '(empty)'}\n   Length: ${c.value.length} chars`),
      ].join('\n')
    },
  },
  {
    id: 'csp-generator',
    name: 'CSP Header Generator',
    category: 'web',
    description: 'Generate Content Security Policy headers — enter directives like "default-src self; img-src * data:"',
    placeholder: "default-src 'self'; script-src 'self' cdn.example.com; img-src * data:; style-src 'self' 'unsafe-inline'",
    convert: (input) => {
      const s = input.trim()
      if (!s) return "(enter CSP directives, e.g. \"default-src 'self'; img-src *\")"
      const directives = s.split(';').map(d => d.trim()).filter(Boolean)
      const known = {
        'default-src': 'Fallback for fetch directives',
        'script-src': 'Sources for JavaScript',
        'style-src': 'Sources for CSS',
        'img-src': 'Sources for images',
        'font-src': 'Sources for fonts',
        'connect-src': 'URLs for fetch/XHR/WebSocket',
        'frame-src': 'Sources for frames/iframes',
        'media-src': 'Sources for audio/video',
        'object-src': 'Sources for plugins',
        'worker-src': 'Sources for workers',
        'frame-ancestors': 'Who can embed this page',
        'form-action': 'Where forms can submit',
        'base-uri': 'Allowed base URLs',
        'upgrade-insecure-requests': 'Upgrade HTTP to HTTPS',
      }
      const header = `Content-Security-Policy: ${directives.join('; ')}`
      const explained = directives.map(d => {
        const [name, ...vals] = d.split(/\s+/)
        const desc = known[name] || 'Custom directive'
        return `  ${name}: ${vals.join(' ')}\n    → ${desc}`
      })
      const warnings = []
      if (directives.some(d => d.includes("'unsafe-inline'"))) warnings.push("⚠ 'unsafe-inline' weakens XSS protection — use nonces/hashes instead")
      if (directives.some(d => d.includes("'unsafe-eval'"))) warnings.push("⚠ 'unsafe-eval' allows eval() — avoid if possible")
      if (!directives.some(d => d.startsWith('default-src'))) warnings.push("⚠ No 'default-src' directive — consider adding a fallback")
      return [
        '# HTTP Response Header:',
        header,
        '',
        '# Meta tag (less secure, limited support):',
        `<meta http-equiv="Content-Security-Policy" content="${directives.join('; ')}">`,
        '',
        '# Directives explained:',
        ...explained,
        warnings.length ? '' : '',
        ...warnings,
      ].filter(s => s !== undefined).join('\n')
    },
  },
  {
    id: 'nginx-location-gen',
    name: 'Nginx Location Config Generator',
    category: 'web',
    description: 'Generate nginx location block — enter "path [proxy-url]" e.g. "/api http://localhost:3000" or "/static"',
    placeholder: '/api http://localhost:3000',
    convert: (input) => {
      const s = input.trim()
      if (!s) return '(enter: path [proxy-url] — e.g. "/api http://localhost:3000" or "/static")'
      const parts = s.split(/\s+/)
      const path = parts[0]
      const proxyUrl = parts[1]
      if (proxyUrl) {
        return [
          `# Reverse proxy for ${path}`,
          `location ${path} {`,
          `    proxy_pass ${proxyUrl};`,
          `    proxy_set_header Host $host;`,
          `    proxy_set_header X-Real-IP $remote_addr;`,
          `    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;`,
          `    proxy_set_header X-Forwarded-Proto $scheme;`,
          `    proxy_connect_timeout 60s;`,
          `    proxy_send_timeout 60s;`,
          `    proxy_read_timeout 60s;`,
          `}`,
        ].join('\n')
      }
      // Static files
      const isRoot = path === '/'
      return [
        `# Static files for ${path}`,
        `location ${isRoot ? '' : path + ' '}${isRoot ? '/' : ''}{`,
        `    root /var/www/html;`,
        `    index index.html index.htm;`,
        `    try_files $uri $uri/ =404;`,
        `    expires 30d;`,
        `    add_header Cache-Control "public, no-transform";`,
        `}`,
        '',
        `# SPA fallback (uncomment if needed):`,
        `# location ${path} {`,
        `#     try_files $uri $uri/ /index.html;`,
        `# }`,
      ].join('\n')
    },
  },
  {
    id: 'fetch-to-axios',
    name: 'Fetch to Axios Converter',
    category: 'web',
    description: 'Convert fetch() code to axios format — paste fetch() code',
    placeholder: "fetch('https://api.example.com/users', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ name: 'Alice' })\n})",
    convert: (input) => {
      const s = input.trim()
      if (!s) return '(enter fetch() code to convert to axios)'
      // Extract URL
      const urlMatch = s.match(/fetch\(['"`]([^'"`]+)['"`]/)
      const url = urlMatch ? urlMatch[1] : 'URL'
      // Extract method
      const methodMatch = s.match(/method:\s*['"`](\w+)['"`]/i)
      const method = (methodMatch ? methodMatch[1] : 'GET').toLowerCase()
      // Extract headers
      const headersMatch = s.match(/headers:\s*(\{[^}]+\})/s)
      const headers = headersMatch ? headersMatch[1].replace(/\s+/g, ' ') : null
      // Extract body
      const bodyMatch = s.match(/body:\s*(.+?)(?:,\s*\n|\})/)
      const body = bodyMatch ? bodyMatch[1].trim() : null
      const lines = [`axios.${method}('${url}'`]
      if (body && method !== 'get') {
        const dataVal = body.startsWith('JSON.stringify(') ? body.slice(15, -1) : body
        lines[0] += `, ${dataVal}`
      }
      if (headers) {
        lines[0] += `, { headers: ${headers} }`
      }
      lines[0] += ')'
      return [
        `// Original fetch:`,
        s,
        '',
        '// Converted to axios:',
        lines[0],
        '  .then(res => res.data)',
        '  .catch(err => console.error(err))',
        '',
        '// Or with async/await:',
        `const { data } = await axios.${method}('${url}'${body && method !== 'get' ? `, ${body.startsWith('JSON.stringify(') ? body.slice(15,-1) : body}` : ''}${headers ? `, { headers: ${headers} }` : ''})`,
      ].join('\n')
    },
  },
  {
    id: 'webpack-import-gen',
    name: 'Import/Require Converter',
    category: 'web',
    description: 'Convert between ES6 import and CommonJS require — paste import or require statement',
    placeholder: "import React, { useState, useEffect } from 'react'",
    convert: (input) => {
      const s = input.trim()
      if (!s) return "(enter: import or require statement to convert)"
      // ES6 import → CommonJS
      const importDefault = s.match(/^import\s+(\w+)\s+from\s+['"`]([^'"`]+)['"`]/)
      const importNamed = s.match(/^import\s+\{([^}]+)\}\s+from\s+['"`]([^'"`]+)['"`]/)
      const importMixed = s.match(/^import\s+(\w+),\s*\{([^}]+)\}\s+from\s+['"`]([^'"`]+)['"`]/)
      const importStar = s.match(/^import\s+\*\s+as\s+(\w+)\s+from\s+['"`]([^'"`]+)['"`]/)
      const importSide = s.match(/^import\s+['"`]([^'"`]+)['"`]/)
      if (importMixed) {
        const [, def, named, mod] = importMixed
        const names = named.split(',').map(n => n.trim())
        return [
          `// ES6 import:`, s, '',
          '// CommonJS require:',
          `const ${def} = require('${mod}')`,
          `const { ${names.join(', ')} } = require('${mod}')`,
        ].join('\n')
      }
      if (importDefault) {
        return [`// ES6: ${s}`, `// CJS: const ${importDefault[1]} = require('${importDefault[2]}')`].join('\n')
      }
      if (importNamed) {
        const names = importNamed[1].split(',').map(n => n.trim().replace(/\s+as\s+/, ': '))
        return [`// ES6: ${s}`, `// CJS: const { ${names.join(', ')} } = require('${importNamed[2]}')`].join('\n')
      }
      if (importStar) {
        return [`// ES6: ${s}`, `// CJS: const ${importStar[1]} = require('${importStar[2]}')`].join('\n')
      }
      if (importSide) {
        return [`// ES6: ${s}`, `// CJS: require('${importSide[1]}')`].join('\n')
      }
      // CommonJS require → ES6
      const requireDefault = s.match(/const\s+(\w+)\s*=\s*require\(['"`]([^'"`]+)['"`]\)/)
      const requireNamed = s.match(/const\s+\{([^}]+)\}\s*=\s*require\(['"`]([^'"`]+)['"`]\)/)
      if (requireNamed) {
        return [`// CJS: ${s}`, `// ES6: import { ${requireNamed[1].trim()} } from '${requireNamed[2]}'`].join('\n')
      }
      if (requireDefault) {
        return [`// CJS: ${s}`, `// ES6: import ${requireDefault[1]} from '${requireDefault[2]}'`].join('\n')
      }
      return '(paste an ES6 import or CommonJS require statement)'
    },
  },
  {
    id: 'dockerfile-gen',
    name: 'Dockerfile Generator',
    description: 'Generate a Dockerfile from a description. Enter: runtime (node/python/go/rust/java), version (optional), and port.',
    category: 'web',
    convert: (input) => {
      const s = input.trim().toLowerCase()
      // Parse fields
      const runtime = (['node', 'python', 'go', 'rust', 'java', 'deno', 'bun', 'php', 'ruby', 'nginx'].find(r => s.includes(r))) || 'node'
      const portMatch = input.match(/port\s*:?\s*(\d{2,5})/i) || input.match(/\b(\d{4,5})\b/)
      const port = portMatch ? portMatch[1] : runtime === 'python' ? '8000' : runtime === 'go' ? '8080' : runtime === 'java' ? '8080' : '3000'
      const versionMatch = input.match(new RegExp(`${runtime}\\s*([\\d.]+)`, 'i'))
      const version = versionMatch ? versionMatch[1] : ''
      const templates = {
        node: (v, p) => `FROM node:${v || '20-alpine'}
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE ${p}

USER node
CMD ["node", "server.js"]`,
        python: (v, p) => `FROM python:${v || '3.12-slim'}
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE ${p}

CMD ["python", "app.py"]`,
        go: (v, p) => `FROM golang:${v || '1.22-alpine'} AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/main .
EXPOSE ${p}
CMD ["./main"]`,
        rust: (v, p) => `FROM rust:${v || '1.78-slim'} AS builder
WORKDIR /app
COPY . .
RUN cargo build --release

FROM debian:bookworm-slim
COPY --from=builder /app/target/release/app /usr/local/bin/app
EXPOSE ${p}
CMD ["app"]`,
        java: (v, p) => `FROM eclipse-temurin:${v || '21-jdk-alpine'} AS builder
WORKDIR /app
COPY . .
RUN ./mvnw package -DskipTests

FROM eclipse-temurin:${v || '21-jre-alpine'}
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE ${p}
ENTRYPOINT ["java", "-jar", "app.jar"]`,
        nginx: (v, p) => `FROM nginx:${v || 'alpine'}
COPY nginx.conf /etc/nginx/nginx.conf
COPY dist/ /usr/share/nginx/html/
EXPOSE ${p}
CMD ["nginx", "-g", "daemon off;"]`,
        bun: (v, p) => `FROM oven/bun:${v || '1-alpine'}
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile --production
COPY . .
EXPOSE ${p}
CMD ["bun", "run", "start"]`,
        deno: (v, p) => `FROM denoland/deno:${v || 'alpine'}
WORKDIR /app
COPY . .
RUN deno cache main.ts
EXPOSE ${p}
CMD ["deno", "run", "--allow-net", "main.ts"]`,
        php: (v, p) => `FROM php:${v || '8.3-fpm-alpine'}
WORKDIR /var/www/html
RUN docker-php-ext-install pdo pdo_mysql
COPY . .
EXPOSE ${p}
CMD ["php-fpm"]`,
        ruby: (v, p) => `FROM ruby:${v || '3.3-alpine'}
WORKDIR /app
COPY Gemfile Gemfile.lock ./
RUN bundle install
COPY . .
EXPOSE ${p}
CMD ["ruby", "app.rb"]`,
      }
      const tpl = templates[runtime] || templates.node
      return tpl(version, port)
    },
  },
  {
    id: 'api-mock-gen',
    name: 'API Mock Response Generator',
    description: 'Generate mock API responses from a schema or example. Enter JSON or describe fields like: "id:uuid name:string age:number email:email".',
    category: 'web',
    convert: (input) => {
      const s = input.trim()
      // Check if JSON
      try {
        JSON.parse(s) // Valid JSON — generate mock from schema
      } catch {
        // Parse field definitions
        const parts = s.split(/\s+/)
        const pairs = parts.filter(p => p.includes(':'))
        if (pairs.length === 0) return '(enter field definitions like: "id:uuid name:string age:number" or paste JSON)'
        const obj = {}
        const rng = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
        const names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Ethan', 'Fiona', 'George', 'Hannah']
        const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'example.com']
        for (const pair of pairs) {
          const [k, type] = pair.split(':')
          if (!k || !type) continue
          switch (type.toLowerCase()) {
            case 'uuid': obj[k] = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
              const r = Math.random() * 16 | 0
              return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
            }); break
            case 'string': case 'text': obj[k] = `sample_${k}`; break
            case 'number': case 'int': case 'integer': obj[k] = rng(1, 1000); break
            case 'float': case 'decimal': obj[k] = parseFloat((Math.random() * 100).toFixed(2)); break
            case 'bool': case 'boolean': obj[k] = Math.random() > 0.5; break
            case 'email': { const name = names[rng(0, names.length - 1)]; obj[k] = `${name.toLowerCase()}@${domains[rng(0, domains.length - 1)]}`; break }
            case 'name': obj[k] = names[rng(0, names.length - 1)]; break
            case 'date': obj[k] = new Date(Date.now() - rng(0, 86400000 * 365)).toISOString().split('T')[0]; break
            case 'datetime': obj[k] = new Date(Date.now() - rng(0, 86400000 * 30)).toISOString(); break
            case 'url': obj[k] = `https://example.com/${k}/${rng(1, 9999)}`; break
            case 'phone': obj[k] = `+1${rng(200, 999)}${rng(100, 999)}${rng(1000, 9999)}`; break
            case 'null': obj[k] = null; break
            case 'array': obj[k] = []; break
            default: obj[k] = `${type}_value`
          }
        }
        return JSON.stringify({ data: obj, success: true, timestamp: new Date().toISOString() }, null, 2)
      }
      // From JSON — wrap in REST response envelope
      const data = JSON.parse(s)
      const wrapped = {
        data: Array.isArray(data) ? { items: data, total: data.length, page: 1, per_page: data.length } : data,
        success: true,
        timestamp: new Date().toISOString(),
        request_id: Math.random().toString(36).slice(2, 10),
      }
      return JSON.stringify(wrapped, null, 2)
    },
  },
  {
    id: 'regex-to-code',
    name: 'Regex to Code Snippet',
    description: 'Convert a regex pattern to code in multiple languages. Enter a regex pattern (with or without slashes) and optional flags.',
    category: 'web',
    convert: (input) => {
      const s = input.trim()
      let pattern, flags = ''
      const slashMatch = s.match(/^\/(.+)\/([gimsuy]*)$/)
      if (slashMatch) {
        pattern = slashMatch[1]
        flags = slashMatch[2]
      } else {
        pattern = s
      }
      if (!pattern) return '(enter a regex pattern, e.g. /\\d+/g or \\d+)'
      const escaped = pattern.replace(/\\/g, '\\\\')
      const i = flags.includes('i'), m = flags.includes('m')
      return [
        '// JavaScript',
        `const regex = /${pattern}/${flags}`,
        `const result = text.match(regex)`,
        '',
        '// Python',
        `import re`,
        `pattern = re.compile(r'${escaped}'${i ? ', re.IGNORECASE' : ''}${m ? ' | re.MULTILINE' : ''})`,
        `result = pattern.findall(text)`,
        '',
        '// Java',
        `import java.util.regex.*;`,
        `Pattern pattern = Pattern.compile("${escaped.replace(/"/g, '\\"')}"${i ? ', Pattern.CASE_INSENSITIVE' : ''});`,
        `Matcher matcher = pattern.matcher(text);`,
        '',
        '// PHP',
        `preg_match_all('/${escaped.replace(/\//g, '\\/')}/${flags}', $text, $matches);`,
        '',
        '// Ruby',
        `regex = /${pattern}/${flags.replace(/[gms]/g, m => m === 'm' ? 'm' : '')}`,
        `results = text.scan(regex)`,
        '',
        '// Go',
        `import "regexp"`,
        `re := regexp.MustCompile(\`${pattern}\`)`,
        `result := re.FindAllString(text, -1)`,
        '',
        '// Rust',
        `use regex::Regex;`,
        `let re = Regex::new(r"${pattern}").unwrap();`,
        `let result: Vec<&str> = re.find_iter(text).map(|m| m.as_str()).collect();`,
      ].join('\n')
    },
  },
  {
    id: 'env-validator',
    name: '.env File Validator',
    description: 'Validate a .env file for common issues: duplicate keys, missing values, dangerous patterns, and format errors.',
    category: 'web',
    convert: (input) => {
      const lines = input.split('\n')
      const issues = []
      const keys = new Set()
      const defined = {}
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const lineNum = i + 1
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith('#')) continue
        // Must be KEY=value
        if (!trimmed.includes('=')) {
          issues.push(`Line ${lineNum}: Missing '=' — "${trimmed.slice(0, 30)}"`)
          continue
        }
        const eqIdx = trimmed.indexOf('=')
        const key = trimmed.slice(0, eqIdx).trim()
        const val = trimmed.slice(eqIdx + 1).trim()
        // Key format
        if (!/^[A-Z_][A-Z0-9_]*$/i.test(key)) {
          issues.push(`Line ${lineNum}: Non-standard key name "${key}" (should be UPPER_SNAKE_CASE)`)
        }
        // Duplicate key
        if (keys.has(key)) {
          issues.push(`Line ${lineNum}: Duplicate key "${key}"`)
        }
        keys.add(key)
        defined[key] = val
        // Empty value warning
        if (val === '') {
          issues.push(`Line ${lineNum}: Empty value for "${key}"`)
        }
        // Unquoted spaces
        if (val.includes(' ') && !val.startsWith('"') && !val.startsWith("'")) {
          issues.push(`Line ${lineNum}: Value with spaces should be quoted: ${key}`)
        }
        // Suspicious patterns
        if (key.toLowerCase().includes('password') && val.length < 8) {
          issues.push(`Line ${lineNum}: "${key}" looks like a password but is very short`)
        }
      }
      const out = [
        `.env Validation: ${keys.size} keys found`,
        issues.length === 0 ? 'No issues found ✓' : `${issues.length} issue${issues.length !== 1 ? 's' : ''} found:`,
        '',
      ]
      if (issues.length > 0) out.push(...issues)
      else {
        out.push('Keys defined:')
        out.push(...[...keys].map(k => `  ${k}`))
      }
      return out.join('\n')
    },
  },
  {
    id: 'http-header-gen',
    name: 'Security HTTP Headers',
    description: 'Generate recommended security HTTP headers for your web app. Enter your domain and options: "strict", "api", or "static".',
    category: 'web',
    convert: (input) => {
      const s = input.trim().toLowerCase()
      const domain = input.match(/([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/)?.[1] || 'example.com'
      const isApi = s.includes('api')
      const isStatic = s.includes('static')
      const isStrict = s.includes('strict')
      const headers = []
      headers.push(`# Security Headers for ${domain}`)
      headers.push('')
      headers.push('# Prevent MIME type sniffing')
      headers.push('X-Content-Type-Options: nosniff')
      headers.push('')
      headers.push('# Clickjacking protection')
      headers.push('X-Frame-Options: DENY')
      headers.push('')
      if (!isApi) {
        headers.push('# XSS protection (legacy browsers)')
        headers.push('X-XSS-Protection: 1; mode=block')
        headers.push('')
      }
      headers.push('# Referrer policy')
      headers.push('Referrer-Policy: strict-origin-when-cross-origin')
      headers.push('')
      if (isStrict || !isApi) {
        headers.push('# HTTPS enforcement (HSTS) - only enable after testing!')
        headers.push(`Strict-Transport-Security: max-age=31536000; includeSubDomains${isStrict ? '; preload' : ''}`)
        headers.push('')
      }
      headers.push('# Permissions policy')
      headers.push('Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()')
      headers.push('')
      if (isApi) {
        headers.push('# API-specific headers')
        headers.push('Content-Type: application/json')
        headers.push('X-Content-Type-Options: nosniff')
        headers.push('Cache-Control: no-store')
        headers.push(`Access-Control-Allow-Origin: https://${domain}`)
        headers.push('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS')
        headers.push('Access-Control-Allow-Headers: Content-Type, Authorization')
      } else if (isStatic) {
        headers.push('# Static asset headers')
        headers.push('Cache-Control: public, max-age=31536000, immutable')
        headers.push('Vary: Accept-Encoding')
      } else {
        headers.push('# Content Security Policy')
        headers.push(`Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://${domain}; frame-ancestors 'none'`)
        headers.push('')
        headers.push('# Cache control for HTML')
        headers.push('Cache-Control: no-cache, no-store, must-revalidate')
      }
      headers.push('')
      headers.push('# Cross-Origin policies')
      headers.push('Cross-Origin-Opener-Policy: same-origin')
      headers.push('Cross-Origin-Resource-Policy: same-origin')
      if (!isApi) headers.push('Cross-Origin-Embedder-Policy: require-corp')
      return headers.join('\n')
    },
  },
  {
    id: 'sql-schema-gen',
    name: 'SQL Schema Generator',
    description: 'Generate CREATE TABLE SQL from field definitions. Enter table name on first line, then fields: "name type [constraints]".',
    category: 'web',
    convert: (input) => {
      const lines = input.trim().split('\n').filter(l => l.trim())
      if (lines.length < 2) return '(enter table name on line 1, then fields: "name type [constraints]")'
      const tableName = lines[0].trim().replace(/[^a-zA-Z0-9_]/g, '_')
      const typeMap = {
        string: 'VARCHAR(255)', str: 'VARCHAR(255)', text: 'TEXT', longtext: 'LONGTEXT',
        int: 'INT', integer: 'INT', bigint: 'BIGINT', smallint: 'SMALLINT',
        float: 'FLOAT', double: 'DOUBLE', decimal: 'DECIMAL(10,2)', number: 'DECIMAL(15,4)',
        bool: 'BOOLEAN', boolean: 'BOOLEAN',
        date: 'DATE', datetime: 'DATETIME', timestamp: 'TIMESTAMP', time: 'TIME',
        uuid: 'CHAR(36)', json: 'JSON', blob: 'BLOB', binary: 'BINARY(16)',
      }
      const cols = []
      let hasPk = false
      for (const line of lines.slice(1)) {
        const parts = line.trim().split(/\s+/)
        if (parts.length < 2) continue
        const [colName, rawType, ...constraints] = parts
        const sqlType = typeMap[rawType.toLowerCase()] || rawType.toUpperCase()
        const isPk = constraints.some(c => c.toLowerCase() === 'pk' || c.toLowerCase() === 'primary')
        const isNn = constraints.some(c => c.toLowerCase() === 'not' || c.toLowerCase() === 'nn' || c.toLowerCase() === 'required')
        const isUnique = constraints.some(c => c.toLowerCase() === 'unique')
        const hasDefault = constraints.find(c => c.startsWith('default:'))
        const autoInc = isPk && rawType.toLowerCase() === 'int'
        let col = `  ${colName.padEnd(20)} ${sqlType}`
        if (autoInc) col += ' AUTO_INCREMENT'
        if (isPk) { col += ' PRIMARY KEY'; hasPk = true }
        else if (isNn) col += ' NOT NULL'
        if (isUnique && !isPk) col += ' UNIQUE'
        if (hasDefault) col += ` DEFAULT ${hasDefault.split(':')[1]}`
        cols.push(col)
      }
      if (!hasPk) cols.unshift(`  id                   INT AUTO_INCREMENT PRIMARY KEY`)
      const output = [
        `CREATE TABLE ${tableName} (`,
        cols.join(',\n'),
        ');',
        '',
        `-- Indexes (add as needed):`,
        `-- CREATE INDEX idx_${tableName}_created ON ${tableName}(created_at);`,
      ]
      return output.join('\n')
    },
  },
  {
    id: 'json-diff-compare',
    name: 'JSON Deep Diff',
    description: 'Compare two JSON objects and show differences. Separate with a line containing only "---".',
    category: 'web',
    convert: (input) => {
      const sep = input.indexOf('\n---\n')
      if (sep === -1) return '(separate two JSON objects with a line containing only "---")'
      const part1 = input.slice(0, sep).trim()
      const part2 = input.slice(sep + 5).trim()
      let obj1, obj2
      try { obj1 = JSON.parse(part1) } catch { return '(first JSON is invalid)' }
      try { obj2 = JSON.parse(part2) } catch { return '(second JSON is invalid)' }
      const diffs = []
      const compare = (a, b, path = '') => {
        const allKeys = new Set([...Object.keys(a || {}), ...Object.keys(b || {})])
        for (const k of allKeys) {
          const fullPath = path ? `${path}.${k}` : k
          const av = a?.[k], bv = b?.[k]
          if (!(k in (a || {}))) {
            diffs.push(`+ ${fullPath}: ${JSON.stringify(bv)}`)
          } else if (!(k in (b || {}))) {
            diffs.push(`- ${fullPath}: ${JSON.stringify(av)}`)
          } else if (typeof av === 'object' && typeof bv === 'object' && av !== null && bv !== null) {
            compare(av, bv, fullPath)
          } else if (av !== bv) {
            diffs.push(`~ ${fullPath}: ${JSON.stringify(av)} → ${JSON.stringify(bv)}`)
          }
        }
      }
      compare(obj1, obj2)
      if (diffs.length === 0) return 'Objects are identical ✓'
      return [
        `${diffs.length} difference${diffs.length !== 1 ? 's' : ''} found:`,
        '',
        ...diffs,
        '',
        'Legend: + added  - removed  ~ changed',
      ].join('\n')
    },
  },
  {
    id: 'github-actions-gen',
    name: 'GitHub Actions Workflow',
    description: 'Generate a GitHub Actions CI/CD workflow. Enter runtime: "node", "python", "go", "rust", "java", or "docker". Optionally add "deploy" or "test".',
    category: 'web',
    convert: (input) => {
      const s = input.trim().toLowerCase()
      const runtime = (['node', 'python', 'go', 'rust', 'java', 'docker', 'bun', 'deno'].find(r => s.includes(r))) || 'node'
      const hasDeploy = s.includes('deploy')
      const runtimeJobs = {
        node: `    - uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
    - run: npm ci
    - run: npm test
    - run: npm run build`,
        bun: `    - uses: oven-sh/setup-bun@v1
      with:
        bun-version: latest
    - run: bun install
    - run: bun test
    - run: bun run build`,
        python: `    - uses: actions/setup-python@v5
      with:
        python-version: '3.12'
        cache: 'pip'
    - run: pip install -r requirements.txt
    - run: pytest
    - run: python -m flake8 .`,
        go: `    - uses: actions/setup-go@v5
      with:
        go-version: '1.22'
    - run: go mod download
    - run: go test ./...
    - run: go build ./...`,
        rust: `    - uses: dtolnay/rust-toolchain@stable
    - uses: Swatinem/rust-cache@v2
    - run: cargo test
    - run: cargo clippy -- -D warnings
    - run: cargo build --release`,
        java: `    - uses: actions/setup-java@v4
      with:
        java-version: '21'
        distribution: 'temurin'
        cache: 'maven'
    - run: mvn test
    - run: mvn package -DskipTests`,
        docker: `    - uses: docker/setup-buildx-action@v3
    - uses: docker/login-action@v3
      with:
        username: \${{ secrets.DOCKERHUB_USERNAME }}
        password: \${{ secrets.DOCKERHUB_TOKEN }}
    - uses: docker/build-push-action@v5
      with:
        push: \${{ github.ref == 'refs/heads/main' }}
        tags: user/app:latest`,
        deno: `    - uses: denoland/setup-deno@v1
      with:
        deno-version: v1.x
    - run: deno test --allow-all
    - run: deno lint
    - run: deno compile --allow-net main.ts`,
      }
      const deployStep = hasDeploy ? `
  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v4
    - name: Deploy
      run: echo "Add your deployment steps here"
      env:
        DEPLOY_KEY: \${{ secrets.DEPLOY_KEY }}` : ''
      return `name: CI${hasDeploy ? '/CD' : ''}

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
${runtimeJobs[runtime] || runtimeJobs.node}
${deployStep}
`.trim()
    },
  },
  {
    id: 'robots-txt-gen',
    name: 'robots.txt Generator',
    description: 'Generate a robots.txt file. Enter: "allow all", "block all", "block /admin /private sitemap:https://example.com/sitemap.xml".',
    category: 'web',
    convert: (input) => {
      const s = input.trim().toLowerCase()
      const lines = input.trim().split('\n').map(l => l.trim())
      if (s === 'allow all' || s === 'allow') {
        return 'User-agent: *\nAllow: /\n\n# Sitemap\n# Sitemap: https://example.com/sitemap.xml'
      }
      if (s === 'block all' || s === 'disallow all' || s === 'block') {
        return 'User-agent: *\nDisallow: /\n\n# To allow specific paths:\n# Allow: /public/'
      }
      // Parse directives
      const disallows = []
      const allows = []
      const sitemaps = []
      const specificBots = {}
      for (const line of lines) {
        const lower = line.toLowerCase()
        if (lower.startsWith('block ') || lower.startsWith('disallow ')) {
          const path = line.split(' ').slice(1).join(' ')
          if (path) disallows.push(path.startsWith('/') ? path : '/' + path)
        } else if (lower.startsWith('allow ')) {
          const path = line.split(' ').slice(1).join(' ')
          if (path && !['all', 'everyone', 'everything'].includes(path)) allows.push(path.startsWith('/') ? path : '/' + path)
        } else if (lower.startsWith('sitemap:')) {
          sitemaps.push(line.split(':').slice(1).join(':').trim())
        } else if (lower.startsWith('bot:') || lower.startsWith('agent:')) {
          const [, agent, ...paths] = line.split(':')
          specificBots[agent?.trim()] = paths.join(':').trim()
        }
      }
      const out = ['User-agent: *']
      if (disallows.length === 0) out.push('Allow: /')
      else {
        disallows.forEach(p => out.push(`Disallow: ${p}`))
        if (allows.length > 0) allows.forEach(p => out.push(`Allow: ${p}`))
      }
      if (Object.keys(specificBots).length > 0) {
        out.push('')
        for (const [bot, paths] of Object.entries(specificBots)) {
          out.push(`User-agent: ${bot}`)
          out.push(`Disallow: ${paths || '/'}`)
        }
      }
      if (sitemaps.length > 0) {
        out.push('')
        sitemaps.forEach(s => out.push(`Sitemap: ${s}`))
      }
      return out.join('\n')
    },
  },
  {
    id: 'schema-org-gen',
    name: 'Schema.org JSON-LD Generator',
    description: 'Generate Schema.org structured data (JSON-LD). Enter type: "article", "product", "person", "organization", "event", "recipe", "faq".',
    category: 'web',
    convert: (input) => {
      const s = input.trim().toLowerCase()
      const templates = {
        article: {
          '@context': 'https://schema.org',
          '@type': 'Article',
          'headline': 'Article Headline',
          'author': { '@type': 'Person', 'name': 'Author Name' },
          'datePublished': new Date().toISOString().split('T')[0],
          'dateModified': new Date().toISOString().split('T')[0],
          'image': 'https://example.com/image.jpg',
          'publisher': { '@type': 'Organization', 'name': 'Publisher', 'logo': { '@type': 'ImageObject', 'url': 'https://example.com/logo.png' } },
          'description': 'Article description',
        },
        product: {
          '@context': 'https://schema.org',
          '@type': 'Product',
          'name': 'Product Name',
          'description': 'Product description',
          'image': 'https://example.com/product.jpg',
          'offers': { '@type': 'Offer', 'price': '29.99', 'priceCurrency': 'USD', 'availability': 'https://schema.org/InStock' },
          'aggregateRating': { '@type': 'AggregateRating', 'ratingValue': '4.5', 'reviewCount': '89' },
        },
        person: {
          '@context': 'https://schema.org',
          '@type': 'Person',
          'name': 'Full Name',
          'jobTitle': 'Job Title',
          'url': 'https://example.com',
          'email': 'name@example.com',
          'sameAs': ['https://twitter.com/username', 'https://linkedin.com/in/username'],
        },
        organization: {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          'name': 'Company Name',
          'url': 'https://example.com',
          'logo': 'https://example.com/logo.png',
          'contactPoint': { '@type': 'ContactPoint', 'telephone': '+1-555-555-5555', 'contactType': 'customer service' },
          'sameAs': ['https://facebook.com/company', 'https://twitter.com/company'],
        },
        event: {
          '@context': 'https://schema.org',
          '@type': 'Event',
          'name': 'Event Name',
          'startDate': new Date().toISOString(),
          'endDate': new Date(Date.now() + 7200000).toISOString(),
          'location': { '@type': 'Place', 'name': 'Venue Name', 'address': { '@type': 'PostalAddress', 'streetAddress': '123 Main St', 'addressLocality': 'City', 'addressCountry': 'US' } },
          'organizer': { '@type': 'Organization', 'name': 'Organizer' },
          'eventStatus': 'https://schema.org/EventScheduled',
          'eventAttendanceMode': 'https://schema.org/OfflineEventAttendanceMode',
        },
        faq: {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          'mainEntity': [
            { '@type': 'Question', 'name': 'What is this?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'This is the answer.' } },
            { '@type': 'Question', 'name': 'How does it work?', 'acceptedAnswer': { '@type': 'Answer', 'text': 'Here is how it works.' } },
          ],
        },
        recipe: {
          '@context': 'https://schema.org',
          '@type': 'Recipe',
          'name': 'Recipe Name',
          'author': { '@type': 'Person', 'name': 'Chef Name' },
          'datePublished': new Date().toISOString().split('T')[0],
          'description': 'Recipe description',
          'prepTime': 'PT15M',
          'cookTime': 'PT30M',
          'totalTime': 'PT45M',
          'recipeYield': '4 servings',
          'recipeIngredient': ['1 cup flour', '2 eggs', '1 cup milk'],
          'recipeInstructions': [{ '@type': 'HowToStep', 'text': 'Mix ingredients.' }, { '@type': 'HowToStep', 'text': 'Bake at 350°F for 30 minutes.' }],
          'nutrition': { '@type': 'NutritionInformation', 'calories': '250 calories' },
        },
      }
      const type = Object.keys(templates).find(t => s.includes(t)) || 'article'
      const schema = templates[type]
      return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`
    },
  },
  {
    id: 'docker-compose-gen',
    name: 'Docker Compose Generator',
    description: 'Generate a docker-compose.yml file. Enter services separated by commas: "node:3000, postgres:5432, redis:6379, nginx:80".',
    category: 'web',
    convert: (input) => {
      if (!input.trim()) return '(enter services: "node:3000, postgres:5432, redis:6379")'
      const serviceConfigs = {
        node: (port) => ({
          build: '.', ports: [`${port}:${port}`], environment: ['NODE_ENV=development'],
          volumes: ['.:/app', '/app/node_modules'], depends_on: [], restart: 'unless-stopped',
        }),
        python: (port) => ({
          build: '.', ports: [`${port}:${port}`], environment: ['PYTHONPATH=/app', 'FLASK_ENV=development'],
          volumes: ['.:/app'], restart: 'unless-stopped',
        }),
        nginx: (port) => ({
          image: 'nginx:alpine', ports: [`${port}:80`],
          volumes: ['./nginx.conf:/etc/nginx/nginx.conf', './dist:/usr/share/nginx/html'],
          restart: 'unless-stopped',
        }),
        postgres: (port) => ({
          image: 'postgres:16-alpine', ports: [`${port}:5432`],
          environment: ['POSTGRES_DB=myapp', 'POSTGRES_USER=postgres', 'POSTGRES_PASSWORD=password'],
          volumes: ['postgres_data:/var/lib/postgresql/data'], restart: 'unless-stopped',
        }),
        mysql: (port) => ({
          image: 'mysql:8.0', ports: [`${port}:3306`],
          environment: ['MYSQL_DATABASE=myapp', 'MYSQL_USER=user', 'MYSQL_PASSWORD=password', 'MYSQL_ROOT_PASSWORD=rootpassword'],
          volumes: ['mysql_data:/var/lib/mysql'], restart: 'unless-stopped',
        }),
        redis: (port) => ({
          image: 'redis:7-alpine', ports: [`${port}:6379`],
          volumes: ['redis_data:/data'], restart: 'unless-stopped',
        }),
        mongodb: (port) => ({
          image: 'mongo:7', ports: [`${port}:27017`],
          environment: ['MONGO_INITDB_ROOT_USERNAME=root', 'MONGO_INITDB_ROOT_PASSWORD=password'],
          volumes: ['mongo_data:/data/db'], restart: 'unless-stopped',
        }),
        rabbitmq: (port) => ({
          image: 'rabbitmq:3-management', ports: [`${port}:5672`, '15672:15672'],
          environment: ['RABBITMQ_DEFAULT_USER=user', 'RABBITMQ_DEFAULT_PASS=password'],
          restart: 'unless-stopped',
        }),
        kafka: (port) => ({
          image: 'confluentinc/cp-kafka:latest', ports: [`${port}:9092`],
          environment: ['KAFKA_BROKER_ID=1', 'KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181', 'KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092'],
          depends_on: ['zookeeper'], restart: 'unless-stopped',
        }),
        elasticsearch: (port) => ({
          image: 'elasticsearch:8.11.0', ports: [`${port}:9200`],
          environment: ['discovery.type=single-node', 'xpack.security.enabled=false'],
          volumes: ['es_data:/usr/share/elasticsearch/data'], restart: 'unless-stopped',
        }),
      }
      const services = {}
      const volumes = new Set()
      const parts = input.split(',').map(s => s.trim())
      for (const part of parts) {
        const [name, port] = part.split(':').map(s => s.trim())
        const svcName = name.toLowerCase()
        const portNum = port || (svcName === 'postgres' ? '5432' : svcName === 'redis' ? '6379' : svcName === 'mongodb' ? '27017' : svcName === 'mysql' ? '3306' : '3000')
        const configFn = serviceConfigs[svcName] || serviceConfigs.node
        const cfg = configFn(portNum)
        services[svcName] = cfg
        if (cfg.volumes) {
          cfg.volumes.forEach(v => {
            if (v.includes(':') && !v.startsWith('.')) volumes.add(v.split(':')[0])
          })
        }
      }
      const lines = ['version: "3.9"', '', 'services:']
      for (const [name, cfg] of Object.entries(services)) {
        lines.push(`  ${name}:`)
        if (cfg.image) lines.push(`    image: ${cfg.image}`)
        if (cfg.build) lines.push(`    build: ${cfg.build}`)
        if (cfg.ports?.length) { lines.push('    ports:'); cfg.ports.forEach(p => lines.push(`      - "${p}"`)) }
        if (cfg.environment?.length) { lines.push('    environment:'); cfg.environment.forEach(e => lines.push(`      - ${e}`)) }
        if (cfg.volumes?.length) { lines.push('    volumes:'); cfg.volumes.forEach(v => lines.push(`      - ${v}`)) }
        if (cfg.depends_on?.length) { lines.push('    depends_on:'); cfg.depends_on.forEach(d => lines.push(`      - ${d}`)) }
        if (cfg.restart) lines.push(`    restart: ${cfg.restart}`)
      }
      if (volumes.size > 0) {
        lines.push('', 'volumes:')
        for (const v of volumes) lines.push(`  ${v}:`)
      }
      return lines.join('\n')
    },
  },
  {
    id: 'package-json-gen',
    name: 'package.json Generator',
    description: 'Generate a package.json file. Enter project details: "name version description" or just the project name.',
    category: 'web',
    convert: (input) => {
      const parts = input.trim().split('\n').map(l => l.trim()).filter(Boolean)
      const firstLine = parts[0] || 'my-project'
      const tokens = firstLine.split(/\s+/)
      const name = tokens[0].toLowerCase().replace(/[^a-z0-9-]/g, '-') || 'my-project'
      const version = tokens.find(t => /^\d+\.\d+\.\d+/.test(t)) || '1.0.0'
      const description = parts.find(l => l.startsWith('description:'))?.slice('description:'.length).trim()
        || tokens.slice(1).filter(t => !/^\d+\.\d+/.test(t)).join(' ') || 'A new project'
      const isTypeScript = parts.some(l => l.toLowerCase().includes('typescript') || l.toLowerCase().includes('ts'))
      const isReact = parts.some(l => l.toLowerCase().includes('react'))
      const isNode = parts.some(l => l.toLowerCase().includes('node') || l.toLowerCase().includes('express'))
      const pkg = {
        name, version, description, main: isNode ? 'dist/index.js' : undefined,
        scripts: {
          dev: isReact ? 'vite' : isNode ? 'ts-node-dev src/index.ts' : 'node index.js',
          build: isReact ? 'vite build' : isNode ? 'tsc' : undefined,
          test: 'jest',
          lint: 'eslint . --ext .ts,.tsx,.js,.jsx',
          ...(isReact ? { preview: 'vite preview' } : {}),
        },
        keywords: [],
        author: '',
        license: 'MIT',
        dependencies: {
          ...(isReact ? { react: '^18.0.0', 'react-dom': '^18.0.0' } : {}),
          ...(isNode ? { express: '^4.18.0' } : {}),
        },
        devDependencies: {
          ...(isTypeScript ? { typescript: '^5.0.0', '@types/node': '^20.0.0' } : {}),
          ...(isReact && isTypeScript ? { '@types/react': '^18.0.0', '@types/react-dom': '^18.0.0' } : {}),
          ...(isReact ? { vite: '^5.0.0', '@vitejs/plugin-react': '^4.0.0' } : {}),
          jest: '^29.0.0', eslint: '^8.0.0',
        },
      }
      // Remove undefined values
      const clean = (obj) => JSON.parse(JSON.stringify(obj, (k, v) => v === undefined ? undefined : v))
      return JSON.stringify(clean(pkg), null, 2)
    },
  },
  {
    id: 'git-commit-lint',
    name: 'Conventional Commit Linter',
    description: 'Check if a git commit message follows Conventional Commits spec. Enter a commit message.',
    category: 'web',
    convert: (input) => {
      const msg = input.trim()
      if (!msg) return '(enter a git commit message to lint)'
      const lines = msg.split('\n')
      const header = lines[0]
      const issues = []
      const suggestions = []
      // Parse header: type(scope?): description
      const headerMatch = header.match(/^(\w+)(?:\(([^)]+)\))?(!)?:\s*(.+)$/)
      if (!headerMatch) {
        issues.push('Header must match: type(scope): description')
        suggestions.push('Example: feat(auth): add OAuth2 support')
        return `❌ Invalid format\n\nIssues:\n${issues.map(i => '  • ' + i).join('\n')}\n\n${suggestions.map(s => '  💡 ' + s).join('\n')}`
      }
      const [, type, scope, breaking, description] = headerMatch
      const validTypes = ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore', 'ci', 'build', 'revert']
      if (!validTypes.includes(type)) {
        issues.push(`Unknown type "${type}". Valid types: ${validTypes.join(', ')}`)
      }
      if (header.length > 72) issues.push(`Header is ${header.length} chars (max 72 recommended)`)
      if (/[A-Z]/.test(description[0])) issues.push('Description should start with lowercase')
      if (description.endsWith('.')) issues.push('Description should not end with a period')
      if (description.length < 5) issues.push('Description is too short')
      // Check body
      if (lines.length > 1 && lines[1].trim() !== '') issues.push('Line 2 should be blank (separating header from body)')
      const breakingNote = lines.find(l => l.startsWith('BREAKING CHANGE:'))
      const isBreaking = !!breaking || !!breakingNote
      const typeEmojis = { feat: '✨', fix: '🐛', docs: '📚', style: '💅', refactor: '♻️', perf: '⚡', test: '🧪', chore: '🔧', ci: '👷', build: '🏗️', revert: '⏪' }
      const out = [
        issues.length === 0 ? '✅ Valid Conventional Commit' : `⚠️ ${issues.length} issue${issues.length !== 1 ? 's' : ''}`,
        '',
        `Type:        ${typeEmojis[type] || '📝'} ${type}`,
        scope ? `Scope:       ${scope}` : '',
        `Description: ${description}`,
        isBreaking ? 'Breaking:    YES 🚨' : '',
        '',
        issues.length > 0 ? `Issues:\n${issues.map(i => '  • ' + i).join('\n')}` : '',
        '',
        'Conventional Commits types:',
        '  feat:     New feature',
        '  fix:      Bug fix',
        '  docs:     Documentation only',
        '  style:    Formatting (no logic change)',
        '  refactor: Code restructure',
        '  perf:     Performance improvement',
        '  test:     Adding/updating tests',
        '  chore:    Build process or auxiliary tools',
      ].filter(Boolean).join('\n')
      return out
    },
  },
]
