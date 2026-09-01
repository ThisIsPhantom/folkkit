import { assertCsvBudget } from '../runtime/workBudgets'

function utf8ToBase64(input) {
  const bytes = new TextEncoder().encode(input)
  let binary = ''
  const chunkSize = 0x8000
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize))
  }
  return btoa(binary)
}

function base64ToUtf8(input) {
  const binary = atob(input.replace(/\s/g, ''))
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

export const dataConverters = [
  {
    id: 'json-prettify',
    name: 'JSON Prettify',
    category: 'data',
    description: 'Format JSON with indentation',
    convert: (input) => {
      try {
        return JSON.stringify(JSON.parse(input), null, 2)
      } catch {
        return '(invalid JSON)'
      }
    },
  },
  {
    id: 'json-minify',
    name: 'JSON Minify',
    category: 'data',
    description: 'Remove whitespace from JSON',
    convert: (input) => {
      try {
        return JSON.stringify(JSON.parse(input))
      } catch {
        return '(invalid JSON)'
      }
    },
  },
  {
    id: 'json-escape',
    name: 'JSON String Escape',
    category: 'data',
    description: 'Escape a string for use inside JSON',
    convert: (input) => {
      return JSON.stringify(input)
    },
  },
  {
    id: 'json-unescape',
    name: 'JSON String Unescape',
    category: 'data',
    description: 'Unescape a JSON-escaped string',
    convert: (input) => {
      try {
        return JSON.parse(input)
      } catch {
        return '(invalid JSON string)'
      }
    },
  },
  {
    id: 'csv-to-json',
    name: 'CSV to JSON',
    category: 'data',
    description: 'Convert CSV to a JSON array of objects',
    convert: (input) => {
      try {
        const parseRow = (line) => {
          const result = []
          let current = ''
          let inQuotes = false
          for (let i = 0; i < line.length; i++) {
            const ch = line[i]
            if (inQuotes) {
              if (ch === '"' && line[i + 1] === '"') {
                current += '"'
                i++
              } else if (ch === '"') {
                inQuotes = false
              } else {
                current += ch
              }
            } else {
              if (ch === '"') {
                inQuotes = true
              } else if (ch === ',') {
                result.push(current)
                current = ''
              } else {
                current += ch
              }
            }
          }
          result.push(current)
          return result
        }
        const parsedRows = assertCsvBudget(input, parseRow)
        if (parsedRows.length < 2) return '(need at least a header row and one data row)'
        const headers = parsedRows[0]
        const rows = parsedRows.slice(1).map((vals) => {
          const obj = {}
          headers.forEach((h, i) => { obj[h] = vals[i] ?? '' })
          return obj
        })
        return JSON.stringify(rows, null, 2)
      } catch (error) {
        if (error?.code === 'resource_limit') throw error
        return '(invalid CSV)'
      }
    },
  },
  {
    id: 'tsv-to-json',
    name: 'TSV to JSON',
    category: 'data',
    description: 'Convert tab-separated values to JSON',
    convert: (input) => {
      try {
        const lines = input.trim().split('\n')
        if (lines.length < 2) return '(need at least a header row and one data row)'
        const headers = lines[0].split('\t')
        const rows = lines.slice(1).map(line => {
          const vals = line.split('\t')
          const obj = {}
          headers.forEach((h, i) => { obj[h.trim()] = (vals[i] || '').trim() })
          return obj
        })
        return JSON.stringify(rows, null, 2)
      } catch {
        return '(invalid TSV)'
      }
    },
  },
  {
    id: 'json-to-tsv',
    name: 'JSON to TSV',
    category: 'data',
    description: 'Convert a JSON array of objects to tab-separated values',
    convert: (input) => {
      try {
        const data = JSON.parse(input)
        if (!Array.isArray(data) || data.length === 0) return '(expected a non-empty JSON array)'
        const keys = Object.keys(data[0])
        return [keys.join('\t'), ...data.map(row => keys.map(k => String(row[k] ?? '')).join('\t'))].join('\n')
      } catch {
        return '(invalid JSON)'
      }
    },
  },
  {
    id: 'env-to-json',
    name: '.env to JSON',
    category: 'data',
    description: 'Convert .env file format to JSON',
    convert: (input) => {
      const obj = {}
      for (const line of input.split('\n')) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith('#')) continue
        const eqIdx = trimmed.indexOf('=')
        if (eqIdx < 0) continue
        const key = trimmed.slice(0, eqIdx).trim()
        let val = trimmed.slice(eqIdx + 1).trim()
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1)
        obj[key] = val
      }
      return JSON.stringify(obj, null, 2)
    },
  },
  {
    id: 'json-to-markdown-table',
    name: 'JSON to Markdown Table',
    category: 'data',
    description: 'Convert a JSON array of objects to a Markdown table',
    convert: (input) => {
      try {
        const data = JSON.parse(input.trim())
        if (!Array.isArray(data) || data.length === 0) return '(expected a non-empty JSON array of objects)'
        const keys = Object.keys(data[0])
        const header = '| ' + keys.join(' | ') + ' |'
        const sep = '| ' + keys.map(() => '---').join(' | ') + ' |'
        const rows = data.map(row => '| ' + keys.map(k => String(row[k] ?? '')).join(' | ') + ' |')
        return [header, sep, ...rows].join('\n')
      } catch {
        return '(invalid JSON)'
      }
    },
  },
  {
    id: 'markdown-table-to-json',
    name: 'Markdown Table to JSON',
    category: 'data',
    description: 'Convert a Markdown table to a JSON array',
    convert: (input) => {
      const lines = input.trim().split('\n').filter(l => l.trim())
      if (lines.length < 3) return '(need at least header, separator, and one data row)'
      const parse = (line) => line.split('|').map(c => c.trim()).filter(Boolean)
      const headers = parse(lines[0])
      const data = lines.slice(2).map(line => {
        const cells = parse(line)
        const obj = {}
        headers.forEach((h, i) => { obj[h] = cells[i] ?? '' })
        return obj
      })
      return JSON.stringify(data, null, 2)
    },
  },
  {
    id: 'ini-to-json',
    name: 'INI to JSON',
    category: 'data',
    description: 'Parse INI config file format to JSON',
    placeholder: '[database]\nhost = localhost\nport = 5432\n\n[server]\ndebug = true',
    convert: (input) => {
      const result = {}
      let section = null
      for (const rawLine of input.split('\n')) {
        const line = rawLine.trim()
        if (!line || line.startsWith(';') || line.startsWith('#')) continue
        const sectionMatch = line.match(/^\[([^\]]+)\]$/)
        if (sectionMatch) {
          section = sectionMatch[1].trim()
          if (!result[section]) result[section] = {}
          continue
        }
        const eqIdx = line.indexOf('=')
        if (eqIdx < 0) continue
        const key = line.slice(0, eqIdx).trim()
        let val = line.slice(eqIdx + 1).trim()
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1)
        const parsed = val === 'true' ? true : val === 'false' ? false : val === 'null' ? null : /^\d+$/.test(val) ? parseInt(val) : /^\d*\.\d+$/.test(val) ? parseFloat(val) : val
        if (section) result[section][key] = parsed
        else result[key] = parsed
      }
      return JSON.stringify(result, null, 2)
    },
  },
  {
    id: 'json-to-ini',
    name: 'JSON to INI',
    category: 'data',
    description: 'Convert a JSON object to INI config format',
    convert: (input) => {
      try {
        const obj = JSON.parse(input.trim())
        if (typeof obj !== 'object' || obj === null) return '(enter a JSON object)'
        const lines = []
        const globals = []
        const sections = []
        for (const [k, v] of Object.entries(obj)) {
          if (typeof v === 'object' && v !== null && !Array.isArray(v)) sections.push([k, v])
          else globals.push([k, v])
        }
        for (const [k, v] of globals) lines.push(`${k} = ${v}`)
        if (globals.length > 0 && sections.length > 0) lines.push('')
        for (const [section, vals] of sections) {
          lines.push(`[${section}]`)
          for (const [k, v] of Object.entries(vals)) lines.push(`${k} = ${v}`)
          lines.push('')
        }
        return lines.join('\n').trimEnd()
      } catch {
        return '(invalid JSON)'
      }
    },
  },
  {
    id: 'ndjson-to-json',
    name: 'NDJSON to JSON',
    category: 'data',
    description: 'Convert newline-delimited JSON (NDJSON/JSON Lines) to a JSON array',
    placeholder: '{"name":"Alice","age":30}\n{"name":"Bob","age":25}',
    convert: (input) => {
      try {
        const lines = input.trim().split('\n').filter(l => l.trim())
        const parsed = lines.map(l => JSON.parse(l))
        return JSON.stringify(parsed, null, 2)
      } catch {
        return '(invalid NDJSON — each line must be valid JSON)'
      }
    },
  },
  {
    id: 'json-to-ndjson',
    name: 'JSON to NDJSON',
    category: 'data',
    description: 'Convert a JSON array to newline-delimited JSON (NDJSON/JSON Lines)',
    convert: (input) => {
      try {
        const data = JSON.parse(input.trim())
        if (!Array.isArray(data)) return '(expected a JSON array)'
        return data.map(item => JSON.stringify(item)).join('\n')
      } catch {
        return '(invalid JSON)'
      }
    },
  },
  {
    id: 'properties-to-json',
    name: 'Properties to JSON',
    category: 'data',
    description: 'Convert Java .properties file format to JSON',
    placeholder: 'app.name=My App\napp.version=1.0\n# comment\ndb.host=localhost',
    convert: (input) => {
      const obj = {}
      for (const line of input.split('\n')) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('!')) continue
        const eqIdx = trimmed.search(/[=:]/)
        if (eqIdx < 0) continue
        const key = trimmed.slice(0, eqIdx).trim()
        const val = trimmed.slice(eqIdx + 1).trim()
        obj[key] = val
      }
      return JSON.stringify(obj, null, 2)
    },
  },
  {
    id: 'json-to-properties',
    name: 'JSON to Properties',
    category: 'data',
    description: 'Convert a flat JSON object to Java .properties format',
    convert: (input) => {
      try {
        const obj = JSON.parse(input.trim())
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) return '(enter a flat JSON object)'
        return Object.entries(obj).map(([k, v]) => `${k}=${v}`).join('\n')
      } catch {
        return '(invalid JSON)'
      }
    },
  },
  {
    id: 'json-merge',
    name: 'JSON Deep Merge',
    category: 'data',
    description: 'Deep merge two JSON objects — separate with a line containing only "---"',
    placeholder: '{"a": 1, "b": {"x": 10}}\n---\n{"b": {"y": 20}, "c": 3}',
    convert: (input) => {
      const sep = input.indexOf('\n---\n')
      if (sep === -1) return '(separate the two JSON objects with a line containing only "---")'
      try {
        const obj1 = JSON.parse(input.slice(0, sep).trim())
        const obj2 = JSON.parse(input.slice(sep + 5).trim())
        function deepMerge(target, source) {
          const result = { ...target }
          for (const key of Object.keys(source)) {
            if (
              key in result &&
              typeof result[key] === 'object' && result[key] !== null && !Array.isArray(result[key]) &&
              typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])
            ) {
              result[key] = deepMerge(result[key], source[key])
            } else {
              result[key] = source[key]
            }
          }
          return result
        }
        return JSON.stringify(deepMerge(obj1, obj2), null, 2)
      } catch (e) {
        return `(invalid JSON: ${e.message})`
      }
    },
  },
  {
    id: 'csv-stats',
    name: 'CSV Statistics',
    category: 'data',
    description: 'Compute statistics (count, min, max, mean, sum) for each numeric column in a CSV',
    placeholder: 'name,age,score\nAlice,30,92\nBob,25,88\nCarol,35,95',
    convert: (input) => {
      try {
        const lines = input.trim().split('\n')
        if (lines.length < 2) return '(need at least a header row and one data row)'
        const parseRow = (line) => {
          const result = []
          let cur = '', inQ = false
          for (let i = 0; i < line.length; i++) {
            const c = line[i]
            if (inQ) { if (c === '"' && line[i+1] === '"') { cur += '"'; i++ } else if (c === '"') inQ = false; else cur += c }
            else { if (c === '"') inQ = true; else if (c === ',') { result.push(cur); cur = '' } else cur += c }
          }
          result.push(cur)
          return result
        }
        const headers = parseRow(lines[0])
        const rows = lines.slice(1).map(parseRow)
        const results = []
        for (let col = 0; col < headers.length; col++) {
          const vals = rows.map(r => parseFloat(r[col])).filter(v => !isNaN(v))
          if (vals.length === 0) {
            results.push(`${headers[col]}: (non-numeric)`)
            continue
          }
          const sum = vals.reduce((a, b) => a + b, 0)
          const mean = sum / vals.length
          const min = Math.min(...vals)
          const max = Math.max(...vals)
          const sorted = [...vals].sort((a, b) => a - b)
          const median = vals.length % 2 === 0
            ? (sorted[vals.length / 2 - 1] + sorted[vals.length / 2]) / 2
            : sorted[Math.floor(vals.length / 2)]
          const variance = vals.reduce((acc, v) => acc + (v - mean) ** 2, 0) / vals.length
          const fmt = (n) => parseFloat(n.toFixed(4)).toString()
          results.push(
            `── ${headers[col]} (${vals.length} values) ──`,
            `  Min:    ${fmt(min)}`,
            `  Max:    ${fmt(max)}`,
            `  Sum:    ${fmt(sum)}`,
            `  Mean:   ${fmt(mean)}`,
            `  Median: ${fmt(median)}`,
            `  StdDev: ${fmt(Math.sqrt(variance))}`,
          )
        }
        return results.join('\n')
      } catch (e) {
        return `(error: ${e.message})`
      }
    },
  },
  {
    id: 'json-pick',
    name: 'JSON Pick Keys',
    category: 'data',
    description: 'Extract specific keys from a JSON object or array — format: key1,key2 on first line, then JSON',
    placeholder: 'name,age\n[{"name":"Alice","age":30,"email":"a@b.com"},{"name":"Bob","age":25,"email":"b@c.com"}]',
    convert: (input) => {
      try {
        const newlineIdx = input.indexOf('\n')
        if (newlineIdx === -1) return '(first line: comma-separated keys, rest: JSON)'
        const keys = input.slice(0, newlineIdx).split(',').map(k => k.trim()).filter(Boolean)
        const data = JSON.parse(input.slice(newlineIdx + 1).trim())
        const pick = (obj) => {
          const result = {}
          for (const k of keys) if (k in obj) result[k] = obj[k]
          return result
        }
        if (Array.isArray(data)) return JSON.stringify(data.map(pick), null, 2)
        return JSON.stringify(pick(data), null, 2)
      } catch (e) {
        return `(error: ${e.message})`
      }
    },
  },
  {
    id: 'csv-transpose',
    name: 'CSV Transpose',
    category: 'data',
    description: 'Swap rows and columns in a CSV',
    placeholder: 'name,age,city\nAlice,30,NYC\nBob,25,LA',
    convert: (input) => {
      const rows = input.trim().split('\n').map(r => {
        const cells = []
        let cur = '', inQ = false
        for (const ch of r) {
          if (ch === '"') { inQ = !inQ } else if (ch === ',' && !inQ) { cells.push(cur); cur = '' } else cur += ch
        }
        cells.push(cur)
        return cells
      })
      if (rows.length === 0) return '(empty input)'
      const maxCols = Math.max(...rows.map(r => r.length))
      const transposed = Array.from({ length: maxCols }, (_, col) =>
        rows.map(row => row[col] ?? '').join(',')
      )
      return transposed.join('\n')
    },
  },
  {
    id: 'jsonl-to-json',
    name: 'JSON Lines ↔ JSON Array',
    category: 'data',
    description: 'Convert between JSON Lines (one JSON per line) and JSON array',
    placeholder: '{"id":1,"name":"Alice"}\n{"id":2,"name":"Bob"}',
    convert: (input) => {
      const trimmed = input.trim()
      // If it starts with [ it's a JSON array → convert to JSONL
      if (trimmed.startsWith('[')) {
        try {
          const arr = JSON.parse(trimmed)
          if (!Array.isArray(arr)) return '(input is a JSON object, not an array)'
          return arr.map(item => JSON.stringify(item)).join('\n')
        } catch (e) { return `(JSON parse error: ${e.message})` }
      }
      // Otherwise treat as JSONL → convert to JSON array
      const lines = trimmed.split('\n').map(l => l.trim()).filter(Boolean)
      const parsed = []
      for (let i = 0; i < lines.length; i++) {
        try { parsed.push(JSON.parse(lines[i])) }
        catch (e) { return `(error on line ${i + 1}: ${e.message})` }
      }
      return JSON.stringify(parsed, null, 2)
    },
  },
  {
    id: 'csv-sort',
    name: 'CSV Sort by Column',
    category: 'data',
    description: 'Sort CSV rows by a column — first line: column number (1-based), or "col desc" for descending',
    placeholder: '2\nname,age,city\nAlice,30,NYC\nBob,25,LA\nCarol,35,SF',
    convert: (input) => {
      const lines = input.trim().split('\n')
      const firstLine = lines[0].trim()
      const colMatch = firstLine.match(/^(\d+)(\s+desc)?$/i)
      if (!colMatch) return '(first line: column number, e.g. "2" or "2 desc")'
      const colIdx = parseInt(colMatch[1], 10) - 1
      const desc = !!colMatch[2]
      const dataLines = lines.slice(1)
      if (dataLines.length === 0) return '(no data rows)'
      // Keep header if it looks like one (non-numeric in first col)
      const hasHeader = isNaN(dataLines[0].split(',')[0])
      const header = hasHeader ? [dataLines[0]] : []
      const rows = hasHeader ? dataLines.slice(1) : dataLines
      const parseCell = (row) => {
        const cell = row.split(',')[colIdx] ?? ''
        const num = parseFloat(cell)
        return isNaN(num) ? cell.toLowerCase() : num
      }
      const sorted = [...rows].sort((a, b) => {
        const va = parseCell(a), vb = parseCell(b)
        if (va < vb) return desc ? 1 : -1
        if (va > vb) return desc ? -1 : 1
        return 0
      })
      return [...header, ...sorted].join('\n')
    },
  },
  {
    id: 'json-group-by',
    name: 'JSON Group By',
    category: 'data',
    description: 'Group a JSON array by a key — first line: key name, rest: JSON array',
    placeholder: 'department\n[{"name":"Alice","department":"Eng"},{"name":"Bob","department":"HR"},{"name":"Carol","department":"Eng"}]',
    convert: (input) => {
      const newlineIdx = input.indexOf('\n')
      if (newlineIdx === -1) return '(first line: key name, rest: JSON array)'
      const key = input.slice(0, newlineIdx).trim()
      try {
        const arr = JSON.parse(input.slice(newlineIdx + 1).trim())
        if (!Array.isArray(arr)) return '(JSON must be an array)'
        const groups = {}
        for (const item of arr) {
          const k = String(item[key] ?? '(missing)')
          if (!groups[k]) groups[k] = []
          groups[k].push(item)
        }
        return JSON.stringify(groups, null, 2)
      } catch (e) { return `(error: ${e.message})` }
    },
  },
  {
    id: 'json-count',
    name: 'JSON Array Stats',
    category: 'data',
    description: 'Count and summarize a JSON array — number of items, key frequency, types',
    convert: (input) => {
      try {
        const data = JSON.parse(input.trim())
        if (!Array.isArray(data)) return '(input must be a JSON array)'
        if (data.length === 0) return 'Empty array'
        const keyCounts = {}
        const keyTypes = {}
        for (const item of data) {
          if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
            for (const [k, v] of Object.entries(item)) {
              keyCounts[k] = (keyCounts[k] || 0) + 1
              const t = v === null ? 'null' : Array.isArray(v) ? 'array' : typeof v
              if (!keyTypes[k]) keyTypes[k] = {}
              keyTypes[k][t] = (keyTypes[k][t] || 0) + 1
            }
          }
        }
        const lines = [
          `Total items: ${data.length}`,
          `Item type: ${typeof data[0] === 'object' && !Array.isArray(data[0]) ? 'object' : typeof data[0]}`,
          '',
        ]
        if (Object.keys(keyCounts).length > 0) {
          lines.push('Key coverage (out of ' + data.length + ' items):')
          for (const [k, count] of Object.entries(keyCounts).sort((a, b) => b[1] - a[1])) {
            const pct = Math.round(count / data.length * 100)
            const types = Object.entries(keyTypes[k]).map(([t, c]) => `${t}×${c}`).join(', ')
            lines.push(`  ${k}: ${count} (${pct}%) — ${types}`)
          }
        }
        return lines.join('\n')
      } catch (e) { return `(error: ${e.message})` }
    },
  },
  {
    id: 'tsv-csv-convert',
    name: 'TSV / CSV Converter',
    category: 'data',
    description: 'Convert between TSV (tab-separated) and CSV (comma-separated) — auto-detects direction',
    placeholder: 'name\tage\tcity\nAlice\t30\tNY\nBob\t25\tLA',
    convert: (input) => {
      const s = input.trim()
      if (!s) return '(enter TSV or CSV data)'
      const lines = s.split('\n')
      const hasTabs = lines.some(l => l.includes('\t'))
      if (hasTabs) {
        // TSV → CSV
        const csv = lines.map(line => {
          return line.split('\t').map(cell => {
            if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
              return '"' + cell.replace(/"/g, '""') + '"'
            }
            return cell
          }).join(',')
        }).join('\n')
        return csv
      } else {
        // CSV → TSV
        const tsv = lines.map(line => {
          const cells = []
          let inQuote = false, cell = ''
          for (let i = 0; i < line.length; i++) {
            const ch = line[i]
            if (ch === '"') { inQuote = !inQuote }
            else if (ch === ',' && !inQuote) { cells.push(cell); cell = '' }
            else { cell += ch }
          }
          cells.push(cell)
          return cells.map(c => c.replace(/\t/g, ' ')).join('\t')
        }).join('\n')
        return tsv
      }
    },
  },
  {
    id: 'json-to-sql',
    name: 'JSON to SQL INSERT',
    category: 'data',
    description: 'Convert a JSON array of objects to SQL INSERT statements — enter table name on first line, then JSON',
    placeholder: 'users\n[{"id":1,"name":"Alice","age":30},{"id":2,"name":"Bob","age":25}]',
    convert: (input) => {
      const lines = input.trim().split('\n')
      const firstLine = lines[0].trim()
      let tableName = 'table_name', jsonStr = input.trim()
      if (!firstLine.startsWith('[') && !firstLine.startsWith('{')) {
        tableName = firstLine.replace(/[^a-zA-Z0-9_]/g, '') || 'table_name'
        jsonStr = lines.slice(1).join('\n').trim()
      }
      if (!jsonStr) return '(enter table name on first line, then JSON array)'
      try {
        let data = JSON.parse(jsonStr)
        if (!Array.isArray(data)) data = [data]
        if (!data.length || typeof data[0] !== 'object') return '(JSON must be an array of objects)'
        const cols = [...new Set(data.flatMap(r => Object.keys(r)))]
        const esc = v => v === null || v === undefined ? 'NULL' : typeof v === 'number' ? v : typeof v === 'boolean' ? (v ? 1 : 0) : `'${String(v).replace(/'/g, "''")}'`
        const header = `INSERT INTO \`${tableName}\` (${cols.map(c => `\`${c}\``).join(', ')}) VALUES`
        const rows = data.map(row => `  (${cols.map(c => esc(row[c])).join(', ')})`)
        return [
          header,
          rows.join(',\n') + ';',
          '',
          `-- ${data.length} row${data.length !== 1 ? 's' : ''}, ${cols.length} column${cols.length !== 1 ? 's' : ''}`,
          `-- Columns: ${cols.join(', ')}`,
        ].join('\n')
      } catch (e) { return `(invalid JSON: ${e.message})` }
    },
  },
  {
    id: 'csv-to-html',
    name: 'CSV to HTML Table',
    category: 'data',
    description: 'Convert CSV data to an HTML table with optional styling',
    placeholder: 'Name,Age,City\nAlice,30,New York\nBob,25,Los Angeles',
    convert: (input) => {
      const s = input.trim()
      if (!s) return '(enter CSV data)'
      const parseRow = line => {
        const cells = []
        let inQuote = false, cell = ''
        for (const ch of line) {
          if (ch === '"') inQuote = !inQuote
          else if (ch === ',' && !inQuote) { cells.push(cell); cell = '' }
          else cell += ch
        }
        cells.push(cell)
        return cells.map(c => c.replace(/^"|"$/g, '').replace(/""/g, '"'))
      }
      const rows = s.split('\n').map(parseRow)
      if (rows.length < 1) return '(enter CSV data with at least a header row)'
      const [header, ...body] = rows
      const th = header.map(h => `    <th>${h}</th>`).join('\n')
      const trs = body.map(row => `  <tr>\n${row.map(c => `    <td>${c}</td>`).join('\n')}\n  </tr>`).join('\n')
      return [
        '<table>',
        '  <thead>',
        '  <tr>',
        th,
        '  </tr>',
        '  </thead>',
        '  <tbody>',
        trs,
        '  </tbody>',
        '</table>',
        '',
        `<!-- ${body.length} rows, ${header.length} columns -->`,
      ].join('\n')
    },
  },
  {
    id: 'json-to-csv-advanced',
    name: 'JSON Array to CSV',
    category: 'data',
    description: 'Convert a JSON array to CSV with proper quoting — handles nested objects and arrays',
    placeholder: '[{"name":"Alice","age":30,"city":"New York"},{"name":"Bob","age":25,"city":"LA"}]',
    convert: (input) => {
      const s = input.trim()
      if (!s) return '(enter a JSON array of objects)'
      try {
        let data = JSON.parse(s)
        if (!Array.isArray(data)) data = [data]
        if (!data.length) return '(empty array)'
        const flatten = (obj, prefix = '') => {
          const result = {}
          for (const [k, v] of Object.entries(obj)) {
            const key = prefix ? `${prefix}.${k}` : k
            if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
              Object.assign(result, flatten(v, key))
            } else {
              result[key] = Array.isArray(v) ? JSON.stringify(v) : v
            }
          }
          return result
        }
        const rows = data.map(item => typeof item === 'object' && !Array.isArray(item) ? flatten(item) : { value: item })
        const cols = [...new Set(rows.flatMap(r => Object.keys(r)))]
        const esc = v => {
          const str = v === null || v === undefined ? '' : String(v)
          return str.includes(',') || str.includes('"') || str.includes('\n') ? `"${str.replace(/"/g, '""')}"` : str
        }
        const lines = [cols.join(','), ...rows.map(r => cols.map(c => esc(r[c])).join(','))]
        return lines.join('\n')
      } catch (e) { return `(invalid JSON: ${e.message})` }
    },
  },
  {
    id: 'csv-filter',
    name: 'CSV Filter / Search',
    category: 'data',
    description: 'Filter CSV rows — first line: column=value (or multiple: col1=val1,col2=val2), then paste CSV',
    placeholder: 'city=New York\nName,Age,City\nAlice,30,New York\nBob,25,Los Angeles\nCarol,35,New York',
    convert: (input) => {
      const lines = input.split('\n')
      if (lines.length < 2) return '(enter filter on first line, then CSV data)'
      const filterLine = lines[0].trim()
      const csvData = lines.slice(1).join('\n').trim()
      if (!csvData) return '(enter filter on first line, then CSV data)'
      const parseRow = line => {
        const cells = []
        let inQ = false, cell = ''
        for (const ch of line) {
          if (ch === '"') { inQ = !inQ }
          else if (ch === ',' && !inQ) { cells.push(cell.trim()); cell = '' }
          else cell += ch
        }
        cells.push(cell.trim())
        return cells
      }
      const csvLines = csvData.split('\n')
      const headers = parseRow(csvLines[0])
      const filters = Object.fromEntries(filterLine.split(',').map(f => {
        const [k, ...vp] = f.split('=')
        return [k.trim().toLowerCase(), vp.join('=').trim().toLowerCase()]
      }))
      const body = csvLines.slice(1)
      const filtered = body.filter(line => {
        if (!line.trim()) return false
        const row = parseRow(line)
        return Object.entries(filters).every(([col, val]) => {
          const idx = headers.findIndex(h => h.toLowerCase() === col)
          return idx !== -1 && (row[idx] || '').toLowerCase().includes(val)
        })
      })
      return [
        headers.join(','),
        ...filtered,
        '',
        `-- Matched ${filtered.length} of ${body.filter(l => l.trim()).length} rows`,
      ].join('\n')
    },
  },
  {
    id: 'data-url-converter',
    name: 'Data URL Analyzer',
    category: 'data',
    description: 'Parse a data URL (data:...) into its components, or encode text as a data URL',
    placeholder: 'data:text/html;charset=utf-8,<h1>Hello</h1>',
    convert: (input) => {
      const s = input.trim()
      if (!s) return '(enter a data URL like "data:text/plain;base64,SGVsbG8=" or text to encode)'
      if (s.startsWith('data:')) {
        const m = s.match(/^data:([^;,]+)(?:;([^,]+))?,(.*)$/s)
        if (!m) return '(invalid data URL format)'
        const [, mimeType, encoding, data] = m
        const isBase64 = encoding === 'base64'
        let content = ''
        let byteLength = data.length
        if (isBase64) {
          const cleaned = data.replace(/\s/g, '')
          try {
            content = base64ToUtf8(cleaned).slice(0, 200)
            byteLength = atob(cleaned).length
          } catch {
            content = '(binary content)'
            byteLength = Math.floor(cleaned.length * 3 / 4)
          }
        } else {
          content = decodeURIComponent(data).slice(0, 200)
        }
        return [
          `MIME type: ${mimeType}`,
          `Encoding: ${encoding || 'URL-encoded (none)'}`,
          `Data length: ${data.length} chars (${byteLength} bytes)`,
          '',
          'Content preview:',
          content + (content.length === 200 ? '...' : ''),
        ].join('\n')
      }
      // Encode text as data URL
      const encoded = encodeURIComponent(s)
      const b64 = utf8ToBase64(s)
      return [
        'URL-encoded data URL:',
        `data:text/plain;charset=utf-8,${encoded}`,
        '',
        'Base64 data URL:',
        `data:text/plain;charset=utf-8;base64,${b64}`,
        '',
        `Original length: ${s.length} chars`,
        `URL-encoded: ${encoded.length} chars`,
        `Base64: ${b64.length} chars`,
      ].join('\n')
    },
  },
  {
    id: 'yaml-to-env',
    name: 'YAML to .env',
    description: 'Convert a flat YAML file to a .env environment variables file. Nested keys become UPPER_SNAKE_CASE with __ separator.',
    category: 'data',
    convert: (input) => {
      if (!input.trim()) return '(paste YAML to convert)'
      const lines = input.split('\n')
      const envLines = []
      const path = []
      for (const line of lines) {
        if (!line.trim() || line.trimStart().startsWith('#')) {
          if (line.trimStart().startsWith('#')) envLines.push(`# ${line.trim().slice(1).trim()}`)
          continue
        }
        const indent = line.match(/^(\s*)/)[1].length
        const keyVal = line.trim().match(/^([\w-]+)\s*:\s*(.*)$/)
        if (!keyVal) continue
        const [, key, val] = keyVal
        const depth = Math.floor(indent / 2)
        path.splice(depth)
        path[depth] = key
        if (val.trim() && !val.trim().startsWith('{') && !val.trim().startsWith('[')) {
          const envKey = path.join('__').toUpperCase().replace(/-/g, '_')
          let envVal = val.trim()
          // Remove YAML quotes
          if ((envVal.startsWith('"') && envVal.endsWith('"')) ||
              (envVal.startsWith("'") && envVal.endsWith("'"))) {
            envVal = envVal.slice(1, -1)
          }
          // Quote values with spaces
          if (envVal.includes(' ')) envVal = `"${envVal}"`
          envLines.push(`${envKey}=${envVal}`)
        }
      }
      return envLines.join('\n') || '(no values found)'
    },
  },
  {
    id: 'csv-stats-summary',
    name: 'CSV Statistics Summary',
    description: 'Statistical summary of a CSV file. Shows count, min, max, mean, median for numeric columns, and unique count for text columns.',
    category: 'data',
    convert: (input) => {
      const lines = input.trim().split('\n').filter(l => l.trim())
      if (lines.length < 2) return '(need at least 2 rows: header + data)'
      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))
      const rows = lines.slice(1).map(l =>
        l.split(',').map(v => v.trim().replace(/^"|"$/g, ''))
      )
      const out = [`CSV Summary — ${rows.length} rows, ${headers.length} columns`, '']
      for (let ci = 0; ci < headers.length; ci++) {
        const col = rows.map(r => r[ci] || '').filter(v => v !== '')
        const nums = col.map(Number).filter(v => !isNaN(v) && v !== '')
        out.push(`Column: ${headers[ci]}`)
        if (nums.length > col.length * 0.5) {
          // Numeric column
          nums.sort((a, b) => a - b)
          const sum = nums.reduce((a, b) => a + b, 0)
          const mean = sum / nums.length
          const mid = Math.floor(nums.length / 2)
          const median = nums.length % 2 === 0
            ? (nums[mid - 1] + nums[mid]) / 2
            : nums[mid]
          out.push(`  Type:   Numeric`)
          out.push(`  Count:  ${nums.length} (${col.length - nums.length} missing)`)
          out.push(`  Min:    ${nums[0]}`)
          out.push(`  Max:    ${nums[nums.length - 1]}`)
          out.push(`  Mean:   ${mean.toFixed(4)}`)
          out.push(`  Median: ${median}`)
          const variance = nums.reduce((acc, v) => acc + (v - mean) ** 2, 0) / nums.length
          out.push(`  Std Dev:${Math.sqrt(variance).toFixed(4)}`)
        } else {
          // Text column
          const unique = new Set(col)
          const freq = {}
          col.forEach(v => freq[v] = (freq[v] || 0) + 1)
          const top = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 3)
          out.push(`  Type:   Text`)
          out.push(`  Count:  ${col.length}`)
          out.push(`  Unique: ${unique.size}`)
          out.push(`  Top values: ${top.map(([v, c]) => `"${v}" (${c})`).join(', ')}`)
        }
        out.push('')
      }
      return out.join('\n')
    },
  },
  {
    id: 'json-to-zod',
    name: 'JSON to Zod Schema',
    description: 'Generate a Zod validation schema from a JSON example. Useful for TypeScript projects using Zod.',
    category: 'data',
    convert: (input) => {
      let obj
      try { obj = JSON.parse(input.trim()) } catch { return '(invalid JSON)' }
      const indent = (n) => '  '.repeat(n)
      const gen = (val, depth = 0) => {
        if (val === null) return 'z.null()'
        if (typeof val === 'boolean') return 'z.boolean()'
        if (typeof val === 'number') return Number.isInteger(val) ? 'z.number().int()' : 'z.number()'
        if (typeof val === 'string') return 'z.string()'
        if (Array.isArray(val)) {
          if (val.length === 0) return 'z.array(z.unknown())'
          return `z.array(${gen(val[0], depth)})`
        }
        if (typeof val === 'object') {
          const entries = Object.entries(val)
          if (entries.length === 0) return 'z.object({})'
          const fields = entries.map(([k, v]) =>
            `${indent(depth + 1)}${/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : JSON.stringify(k)}: ${gen(v, depth + 1)},`
          )
          return `z.object({\n${fields.join('\n')}\n${indent(depth)}})`
        }
        return 'z.unknown()'
      }
      return `import { z } from 'zod'\n\nconst schema = ${gen(obj)}\n\ntype Schema = z.infer<typeof schema>`
    },
  },
  {
    id: 'msgpack-preview',
    name: 'JSON Size Estimator',
    description: 'Estimate compressed sizes and wire format sizes of JSON data. Shows JSON, minified, estimated gzip, and key stats.',
    category: 'data',
    convert: (input) => {
      let obj
      try { obj = JSON.parse(input.trim()) } catch { return '(invalid JSON)' }
      const pretty = JSON.stringify(obj, null, 2)
      const minified = JSON.stringify(obj)
      const prettyBytes = new TextEncoder().encode(pretty).length
      const minBytes = new TextEncoder().encode(minified).length
      // Estimate gzip (typically 60-80% compression on JSON)
      const gzipEst = Math.round(minBytes * 0.35)
      // Count structure
      const countKeys = (o) => {
        if (typeof o !== 'object' || o === null) return 0
        let n = Array.isArray(o) ? 0 : Object.keys(o).length
        for (const v of Object.values(o)) n += countKeys(v)
        return n
      }
      const countVals = (o, acc = { strings: 0, numbers: 0, booleans: 0, nulls: 0, arrays: 0, objects: 0 }) => {
        if (o === null) acc.nulls++
        else if (typeof o === 'string') acc.strings++
        else if (typeof o === 'number') acc.numbers++
        else if (typeof o === 'boolean') acc.booleans++
        else if (Array.isArray(o)) { acc.arrays++; o.forEach(v => countVals(v, acc)) }
        else if (typeof o === 'object') { acc.objects++; Object.values(o).forEach(v => countVals(v, acc)) }
        return acc
      }
      const counts = countVals(obj)
      const kb = (b) => b >= 1024 ? `${(b / 1024).toFixed(2)} KB` : `${b} B`
      return [
        'JSON Size Analysis',
        '',
        `Pretty-printed:  ${kb(prettyBytes)} (${prettyBytes.toLocaleString()} bytes)`,
        `Minified:        ${kb(minBytes)} (${minBytes.toLocaleString()} bytes)`,
        `Gzip estimate:   ~${kb(gzipEst)} (~${Math.round((1 - gzipEst / minBytes) * 100)}% compression)`,
        '',
        'Structure:',
        `  Objects:   ${counts.objects}`,
        `  Arrays:    ${counts.arrays}`,
        `  Keys:      ${countKeys(obj)}`,
        `  Strings:   ${counts.strings}`,
        `  Numbers:   ${counts.numbers}`,
        `  Booleans:  ${counts.booleans}`,
        `  Nulls:     ${counts.nulls}`,
        '',
        `Minification saves: ${kb(prettyBytes - minBytes)} (${Math.round((prettyBytes - minBytes) / prettyBytes * 100)}%)`,
      ].join('\n')
    },
  },
  {
    id: 'graphql-schema',
    name: 'JSON to GraphQL Schema',
    description: 'Generate a GraphQL schema (SDL) from a JSON example object.',
    category: 'data',
    convert: (input) => {
      let obj
      try { obj = JSON.parse(input.trim()) } catch { return '(invalid JSON)' }
      if (Array.isArray(obj)) obj = obj[0] || {}
      const typeMap = (val) => {
        if (val === null) return 'String'
        if (typeof val === 'boolean') return 'Boolean'
        if (typeof val === 'number') return Number.isInteger(val) ? 'Int' : 'Float'
        if (typeof val === 'string') {
          if (/^\d{4}-\d{2}-\d{2}/.test(val)) return 'String # Date'
          if (/^[0-9a-f-]{36}$/i.test(val)) return 'ID'
          return 'String'
        }
        if (Array.isArray(val)) return val.length > 0 ? `[${typeMap(val[0])}]` : '[String]'
        if (typeof val === 'object') return 'TYPE_NAME'
        return 'String'
      }
      const genType = (name, obj, types = []) => {
        const fields = []
        for (const [k, v] of Object.entries(obj)) {
          if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
            const subTypeName = k.charAt(0).toUpperCase() + k.slice(1)
            fields.push(`  ${k}: ${subTypeName}`)
            genType(subTypeName, v, types)
          } else {
            fields.push(`  ${k}: ${typeMap(v)}`)
          }
        }
        types.unshift(`type ${name} {\n${fields.join('\n')}\n}`)
        return types
      }
      const typeName = 'Root'
      const types = genType(typeName, obj)
      return [
        `# GraphQL Schema`,
        `# Generated from JSON example`,
        '',
        ...types,
        '',
        `type Query {`,
        `  get${typeName}: ${typeName}`,
        `  list${typeName}s: [${typeName}!]!`,
        `}`,
      ].join('\n')
    },
  },
  {
    id: 'json-to-prisma',
    name: 'JSON to Prisma Schema',
    description: 'Generate a Prisma schema model from a JSON example. Useful for Prisma ORM database modeling.',
    category: 'data',
    convert: (input) => {
      let obj
      try { obj = JSON.parse(input.trim()) } catch { return '(invalid JSON)' }
      if (Array.isArray(obj)) obj = obj[0] || {}
      const typeMap = (k, val) => {
        if (val === null) return 'String?'
        if (typeof val === 'boolean') return 'Boolean'
        if (typeof val === 'number') return Number.isInteger(val) ? 'Int' : 'Float'
        if (typeof val === 'string') {
          if (/^\d{4}-\d{2}-\d{2}/.test(val)) return 'DateTime'
          if (/^[0-9a-f-]{36}$/i.test(val)) return 'String @id'
          if (k === 'id' || k === 'uuid') return 'String @id @default(uuid())'
          return 'String'
        }
        if (Array.isArray(val)) return '// TODO: relation'
        if (typeof val === 'object') return '// TODO: embedded object'
        return 'String'
      }
      const modelName = 'MyModel'
      const fields = []
      let hasId = false
      for (const [k, v] of Object.entries(obj)) {
        if (k === 'id') { hasId = true; fields.push(`  id    String  @id @default(cuid())`) }
        else fields.push(`  ${k.padEnd(15)} ${typeMap(k, v)}`)
      }
      if (!hasId) fields.unshift(`  id    String  @id @default(cuid())`)
      fields.push('  createdAt DateTime @default(now())')
      fields.push('  updatedAt DateTime @updatedAt')
      return [
        `// Prisma Schema`,
        `// Add to your schema.prisma file`,
        '',
        `generator client {`,
        `  provider = "prisma-client-js"`,
        `}`,
        '',
        `datasource db {`,
        `  provider = "postgresql"`,
        `  url      = env("DATABASE_URL")`,
        `}`,
        '',
        `model ${modelName} {`,
        ...fields,
        `}`,
      ].join('\n')
    },
  },
  {
    id: 'protobuf-gen',
    name: 'JSON to Protocol Buffers',
    description: 'Generate a Protocol Buffers (proto3) schema from a JSON example.',
    category: 'data',
    convert: (input) => {
      let obj
      try { obj = JSON.parse(input.trim()) } catch { return '(invalid JSON)' }
      if (Array.isArray(obj)) obj = obj[0] || {}
      const typeMap = (val) => {
        if (val === null || typeof val === 'string') return 'string'
        if (typeof val === 'boolean') return 'bool'
        if (typeof val === 'number') return Number.isInteger(val) ? 'int64' : 'double'
        if (Array.isArray(val)) return `repeated ${val.length > 0 ? typeMap(val[0]) : 'string'}`
        if (typeof val === 'object') return 'bytes // TODO: nested message'
        return 'string'
      }
      const fields = Object.entries(obj).map(([k, v], i) =>
        `  ${typeMap(v).padEnd(20)} ${k.replace(/([A-Z])/g, '_$1').toLowerCase()} = ${i + 1};`
      )
      return [
        `syntax = "proto3";`,
        '',
        `package myservice;`,
        '',
        `message MyMessage {`,
        ...fields,
        `}`,
        '',
        `// RPC service`,
        `service MyService {`,
        `  rpc GetMessage(MyMessage) returns (MyMessage);`,
        `  rpc ListMessages(Empty) returns (stream MyMessage);`,
        `}`,
        '',
        `message Empty {}`,
      ].join('\n')
    },
  },
  {
    id: 'markdown-to-json',
    name: 'Markdown Outline to JSON',
    description: 'Convert a Markdown document outline (headings) to a nested JSON structure.',
    category: 'data',
    convert: (input) => {
      const lines = input.trim().split('\n')
      const root = { title: 'Document', children: [] }
      const stack = [{ node: root, level: 0 }]
      for (const line of lines) {
        const m = line.match(/^(#{1,6})\s+(.+)$/)
        if (!m) continue
        const level = m[1].length
        const title = m[2].trim()
        const node = { title, level, children: [] }
        while (stack.length > 1 && stack[stack.length - 1].level >= level) stack.pop()
        stack[stack.length - 1].node.children.push(node)
        stack.push({ node, level })
      }
      const clean = (n) => {
        const { title, children } = n
        return children.length > 0 ? { title, children: children.map(clean) } : { title }
      }
      if (root.children.length === 0) return '(no headings found — paste Markdown with # headings)'
      return JSON.stringify(root.children.map(clean), null, 2)
    },
  },
  {
    id: 'json-normalize',
    name: 'JSON Normalizer',
    description: 'Normalize JSON data: sort arrays, deduplicate, remove null/empty fields, standardize key naming to camelCase.',
    category: 'data',
    convert: (input) => {
      let obj
      try { obj = JSON.parse(input.trim()) } catch { return '(invalid JSON)' }
      const toCamel = (s) => s.replace(/[-_\s]+(.)/g, (_, c) => c.toUpperCase())
      const normalize = (val) => {
        if (val === null || val === undefined || val === '') return undefined
        if (Array.isArray(val)) {
          const cleaned = val.map(normalize).filter(v => v !== undefined)
          // Deduplicate primitive arrays
          if (cleaned.every(v => typeof v !== 'object')) {
            return [...new Set(cleaned)]
          }
          return cleaned
        }
        if (typeof val === 'object') {
          const result = {}
          for (const [k, v] of Object.entries(val)) {
            const normalized = normalize(v)
            if (normalized !== undefined) {
              result[toCamel(k)] = normalized
            }
          }
          return Object.keys(result).length > 0 ? result : undefined
        }
        return val
      }
      const result = normalize(obj)
      if (result === undefined) return '(all values were empty or null)'
      return JSON.stringify(result, null, 2)
    },
  },
  {
    id: 'avro-schema',
    name: 'JSON to Avro Schema',
    description: 'Generate an Apache Avro schema from a JSON example.',
    category: 'data',
    convert: (input) => {
      let obj
      try { obj = JSON.parse(input.trim()) } catch { return '(invalid JSON)' }
      if (Array.isArray(obj)) obj = obj[0] || {}
      const avroType = (val) => {
        if (val === null) return ['null', 'string']
        if (typeof val === 'boolean') return 'boolean'
        if (typeof val === 'number') return Number.isInteger(val) ? 'long' : 'double'
        if (typeof val === 'string') return 'string'
        if (Array.isArray(val)) return { type: 'array', items: val.length > 0 ? avroType(val[0]) : 'string' }
        if (typeof val === 'object') return buildRecord(val, 'Nested')
        return 'string'
      }
      const buildRecord = (o, name) => ({
        type: 'record',
        name,
        fields: Object.entries(o).map(([k, v]) => ({ name: k, type: avroType(v) })),
      })
      const schema = buildRecord(obj, 'MyRecord')
      return JSON.stringify(schema, null, 2)
    },
  },
  {
    id: 'har-to-curl',
    name: 'HAR Entry to cURL',
    description: 'Convert a HAR (HTTP Archive) entry or raw fetch request to cURL command. Paste a HAR entry JSON.',
    category: 'data',
    convert: (input) => {
      let entry
      try { entry = JSON.parse(input.trim()) } catch { return '(invalid JSON — paste a HAR entry)' }
      // Handle HAR entry or direct request object
      const req = entry.request || entry
      if (!req.url && !req.method) return '(not a valid HAR entry — need url and method)'
      const method = req.method || 'GET'
      const url = req.url || req.urlWithoutQuery || ''
      const headers = req.headers || []
      const body = req.postData?.text || req.body?.content || ''
      const parts = [`curl -X ${method}`]
      for (const h of headers) {
        const name = h.name || h[0]
        const value = h.value || h[1]
        if (!['host', 'content-length', ':method', ':path', ':authority', ':scheme'].includes(name?.toLowerCase())) {
          parts.push(`  -H '${name}: ${value}'`)
        }
      }
      if (body) parts.push(`  -d '${body.replace(/'/g, "'\\''")}'`)
      parts.push(`  '${url}'`)
      return parts.join(' \\\n')
    },
  },
  {
    id: 'openapi-gen',
    name: 'OpenAPI Path Generator',
    description: 'Generate an OpenAPI 3.0 path definition from a description. Enter: "GET /users/:id → get user by ID" or "POST /users → create user".',
    category: 'data',
    convert: (input) => {
      const lines = input.trim().split('\n').filter(l => l.trim())
      const paths = {}
      for (const line of lines) {
        const m = line.match(/^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\s+(\/[^\s→]*)\s*(?:→\s*(.+))?/i)
        if (!m) continue
        const [, method, rawPath, summary = ''] = m
        const params = [...rawPath.matchAll(/:(\w+)/g)].map(m => m[1])
        const oaPath = rawPath.replace(/:(\w+)/g, '{$1}')
        if (!paths[oaPath]) paths[oaPath] = {}
        const op = {
          summary: summary.trim() || `${method} ${oaPath}`,
          operationId: method.toLowerCase() + rawPath.replace(/[/:]/g, '_').replace(/__+/g, '_'),
          parameters: params.map(p => ({ name: p, in: 'path', required: true, schema: { type: 'string' } })),
          responses: {
            '200': { description: 'Success' },
            '400': { description: 'Bad Request' },
            '401': { description: 'Unauthorized' },
            '404': { description: 'Not Found' },
          },
        }
        if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
          op.requestBody = {
            required: true,
            content: { 'application/json': { schema: { type: 'object' } } },
          }
        }
        paths[oaPath][method.toLowerCase()] = op
      }
      if (Object.keys(paths).length === 0) return '(enter: "GET /users/:id → get user" — one endpoint per line)'
      const spec = {
        openapi: '3.0.0',
        info: { title: 'API', version: '1.0.0' },
        paths,
      }
      return JSON.stringify(spec, null, 2)
    },
  },
]
