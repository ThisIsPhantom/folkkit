import { hexToRgb, rgbToHsl, hslToRgb, rgbToHex } from '../utils/color.js'

function parseRgbString(input) {
  const match = input.match(/rgba?\(\s*(\d+)\s*[,\s]\s*(\d+)\s*[,\s]\s*(\d+)/)
  if (!match) return null
  return { r: parseInt(match[1]), g: parseInt(match[2]), b: parseInt(match[3]) }
}

function parseHslString(input) {
  const match = input.match(/hsla?\(\s*(\d+)\s*[,\s]\s*(\d+)%?\s*[,\s]\s*(\d+)%?/)
  if (!match) return null
  return { h: parseInt(match[1]), s: parseInt(match[2]), l: parseInt(match[3]) }
}

function formatAll(rgb) {
  const hsl = rgbToHsl(rgb)
  const hex = rgbToHex(rgb)
  return [
    `HEX:  ${hex}`,
    `RGB:  rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    `HSL:  hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
  ].join('\n')
}

export const colorConverters = [
  {
    id: 'color-convert',
    name: 'Color Converter',
    category: 'color',
    description: 'Convert between HEX, RGB, and HSL — auto-detects input format',
    convert: (input) => {
      const trimmed = input.trim()
      if (!trimmed) return ''

      // try hex
      if (/^#?[0-9a-fA-F]{3,6}$/.test(trimmed)) {
        const rgb = hexToRgb(trimmed.startsWith('#') ? trimmed : '#' + trimmed)
        if (rgb) return formatAll(rgb)
      }

      // try rgb(...)
      const rgb = parseRgbString(trimmed)
      if (rgb) return formatAll(rgb)

      // try hsl(...)
      const hsl = parseHslString(trimmed)
      if (hsl) {
        const fromHsl = hslToRgb(hsl)
        return formatAll(fromHsl)
      }

      return '(enter a hex like #ff6600, rgb(255,102,0), or hsl(24,100%,50%))'
    },
  },
  {
    id: 'color-palette',
    name: 'Color Palette Generator',
    category: 'color',
    description: 'Generate complementary, analogous, and triadic colors from a hex color',
    convert: (input) => {
      const trimmed = input.trim()
      const rgb = hexToRgb(trimmed.startsWith('#') ? trimmed : '#' + trimmed)
      if (!rgb) return '(enter a hex color like #ff6600)'
      const hsl = rgbToHsl(rgb)

      const makeHex = (h, s, l) => {
        const r = hslToRgb({ h: ((h % 360) + 360) % 360, s, l })
        return rgbToHex(r)
      }

      const { h, s, l } = hsl
      return [
        `Input: ${rgbToHex(rgb)}`,
        '',
        '-- Complementary --',
        `  ${makeHex(h + 180, s, l)}`,
        '',
        '-- Analogous --',
        `  ${makeHex(h - 30, s, l)}  ${rgbToHex(rgb)}  ${makeHex(h + 30, s, l)}`,
        '',
        '-- Triadic --',
        `  ${rgbToHex(rgb)}  ${makeHex(h + 120, s, l)}  ${makeHex(h + 240, s, l)}`,
        '',
        '-- Split Complementary --',
        `  ${makeHex(h + 150, s, l)}  ${rgbToHex(rgb)}  ${makeHex(h + 210, s, l)}`,
        '',
        '-- Shades --',
        `  ${makeHex(h, s, Math.max(0, l - 30))}  ${makeHex(h, s, Math.max(0, l - 15))}  ${rgbToHex(rgb)}  ${makeHex(h, s, Math.min(100, l + 15))}  ${makeHex(h, s, Math.min(100, l + 30))}`,
      ].join('\n')
    },
  },
  {
    id: 'color-contrast',
    name: 'Color Contrast Checker',
    category: 'color',
    description: 'Check WCAG contrast ratio — enter two hex colors on separate lines',
    convert: (input) => {
      const lines = input.trim().split('\n').map(l => l.trim())
      if (lines.length < 2) return '(enter two hex colors on separate lines)'
      const rgb1 = hexToRgb(lines[0].startsWith('#') ? lines[0] : '#' + lines[0])
      const rgb2 = hexToRgb(lines[1].startsWith('#') ? lines[1] : '#' + lines[1])
      if (!rgb1 || !rgb2) return '(invalid hex colors)'

      const luminance = ({ r, g, b }) => {
        const [rs, gs, bs] = [r, g, b].map(c => {
          c = c / 255
          return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
        })
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
      }

      const l1 = luminance(rgb1)
      const l2 = luminance(rgb2)
      const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)

      const aa = ratio >= 4.5 ? 'PASS' : 'FAIL'
      const aaLarge = ratio >= 3 ? 'PASS' : 'FAIL'
      const aaa = ratio >= 7 ? 'PASS' : 'FAIL'
      const aaaLarge = ratio >= 4.5 ? 'PASS' : 'FAIL'

      return [
        `Color 1: ${rgbToHex(rgb1)}`,
        `Color 2: ${rgbToHex(rgb2)}`,
        '',
        `Contrast Ratio: ${ratio.toFixed(2)}:1`,
        '',
        `WCAG AA (normal text):  ${aa}   (need 4.5:1)`,
        `WCAG AA (large text):   ${aaLarge}   (need 3:1)`,
        `WCAG AAA (normal text): ${aaa}  (need 7:1)`,
        `WCAG AAA (large text):  ${aaaLarge}  (need 4.5:1)`,
      ].join('\n')
    },
  },
  {
    id: 'color-blindness',
    name: 'Color Blindness Sim',
    category: 'color',
    description: 'Simulate how a color looks under different types of color blindness',
    convert: (input) => {
      const s = input.trim()
      let rgb = hexToRgb(s)
      if (!rgb) rgb = parseRgbString(s)
      if (!rgb) {
        const hsl = parseHslString(s)
        if (hsl) rgb = hslToRgb(hsl)
      }
      if (!rgb) return '(enter a color: hex, rgb(), or hsl())'

      // Color blindness simulation using Brettel matrices (simplified)
      function simulate(r, g, b, type) {
        // Convert to linear RGB
        const toLinear = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4) }
        const toSrgb = (c) => { c = Math.max(0, Math.min(1, c)); return c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055 }

        let lr = toLinear(r), lg = toLinear(g), lb = toLinear(b)

        // Matrices for different types of color blindness
        let nr, ng, nb
        if (type === 'protanopia') {
          nr = 0.567 * lr + 0.433 * lg + 0.000 * lb
          ng = 0.558 * lr + 0.442 * lg + 0.000 * lb
          nb = 0.000 * lr + 0.242 * lg + 0.758 * lb
        } else if (type === 'deuteranopia') {
          nr = 0.625 * lr + 0.375 * lg + 0.000 * lb
          ng = 0.700 * lr + 0.300 * lg + 0.000 * lb
          nb = 0.000 * lr + 0.300 * lg + 0.700 * lb
        } else if (type === 'tritanopia') {
          nr = 0.950 * lr + 0.050 * lg + 0.000 * lb
          ng = 0.000 * lr + 0.433 * lg + 0.567 * lb
          nb = 0.000 * lr + 0.475 * lg + 0.525 * lb
        } else {
          nr = lr; ng = lg; nb = lb
        }

        return {
          r: Math.round(toSrgb(nr) * 255),
          g: Math.round(toSrgb(ng) * 255),
          b: Math.round(toSrgb(nb) * 255),
        }
      }

      const proto = simulate(rgb.r, rgb.g, rgb.b, 'protanopia')
      const deuter = simulate(rgb.r, rgb.g, rgb.b, 'deuteranopia')
      const trit = simulate(rgb.r, rgb.g, rgb.b, 'tritanopia')

      const fmt = (c) => `rgb(${c.r}, ${c.g}, ${c.b})  →  ${rgbToHex(c)}`

      return [
        `Original:      ${fmt(rgb)}`,
        '',
        `Protanopia:    ${fmt(proto)}`,
        `  (no red cones — ~1% of males)`,
        '',
        `Deuteranopia:  ${fmt(deuter)}`,
        `  (no green cones — ~1% of males)`,
        '',
        `Tritanopia:    ${fmt(trit)}`,
        `  (no blue cones — very rare)`,
      ].join('\n')
    },
  },
  {
    id: 'color-shades',
    name: 'Color Shades',
    category: 'color',
    description: 'Generate lighter and darker shades of a color',
    convert: (input) => {
      const s = input.trim()
      let rgb = hexToRgb(s)
      if (!rgb) rgb = parseRgbString(s)
      if (!rgb) {
        const hsl = parseHslString(s)
        if (hsl) rgb = hslToRgb(hsl)
      }
      if (!rgb) return '(enter a color: hex, rgb(), or hsl())'

      const hsl = rgbToHsl(rgb)
      const shades = []
      for (let l = 95; l >= 5; l -= 10) {
        const c = hslToRgb({ h: hsl.h, s: hsl.s, l })
        const hex = rgbToHex(c)
        const marker = Math.abs(l - hsl.l) < 5 ? '  ← original' : ''
        shades.push(`  L:${String(l).padStart(3)}%  ${hex}  rgb(${c.r}, ${c.g}, ${c.b})${marker}`)
      }
      return `Shades for ${rgbToHex(rgb)}:\n\n${shades.join('\n')}`
    },
  },
  {
    id: 'color-gradient',
    name: 'CSS Gradient Generator',
    category: 'color',
    description: 'Generate a CSS gradient between two hex colors — one per line',
    convert: (input) => {
      const lines = input.trim().split('\n').map(l => l.trim()).filter(Boolean)
      if (lines.length < 2) return '(enter two hex colors on separate lines)'
      const rgb1 = hexToRgb(lines[0].startsWith('#') ? lines[0] : '#' + lines[0])
      const rgb2 = hexToRgb(lines[1].startsWith('#') ? lines[1] : '#' + lines[1])
      if (!rgb1 || !rgb2) return '(invalid hex colors)'
      const hex1 = rgbToHex(rgb1)
      const hex2 = rgbToHex(rgb2)
      const dir = lines[2] || 'to right'
      const stops = [0, 25, 50, 75, 100].map(pct => {
        const t = pct / 100
        const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * t)
        const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * t)
        const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * t)
        return `  ${rgbToHex({ r, g, b })}  ${pct}%`
      })
      return [
        `From: ${hex1}`,
        `To:   ${hex2}`,
        '',
        '-- CSS --',
        `background: linear-gradient(${dir}, ${hex1}, ${hex2});`,
        '',
        '-- With 5 stops --',
        `background: linear-gradient(${dir},`,
        `  ${hex1} 0%,`,
        `  ${rgbToHex({ r: Math.round(rgb1.r * 0.75 + rgb2.r * 0.25), g: Math.round(rgb1.g * 0.75 + rgb2.g * 0.25), b: Math.round(rgb1.b * 0.75 + rgb2.b * 0.25) })} 25%,`,
        `  ${rgbToHex({ r: Math.round((rgb1.r + rgb2.r) / 2), g: Math.round((rgb1.g + rgb2.g) / 2), b: Math.round((rgb1.b + rgb2.b) / 2) })} 50%,`,
        `  ${rgbToHex({ r: Math.round(rgb1.r * 0.25 + rgb2.r * 0.75), g: Math.round(rgb1.g * 0.25 + rgb2.g * 0.75), b: Math.round(rgb1.b * 0.25 + rgb2.b * 0.75) })} 75%,`,
        `  ${hex2} 100%`,
        `);`,
        '',
        '-- Color stops --',
        ...stops,
      ].join('\n')
    },
  },
  {
    id: 'oklch-convert',
    name: 'OKLCH Converter',
    category: 'color',
    description: 'Convert hex colors to OKLCH (perceptually uniform color space)',
    convert: (input) => {
      const s = input.trim()
      let rgb = hexToRgb(s.startsWith('#') ? s : '#' + s)
      if (!rgb) rgb = (function parseRgb(str) {
        const m = str.match(/rgba?\(\s*(\d+)\s*[,\s]\s*(\d+)\s*[,\s]\s*(\d+)/)
        return m ? { r: +m[1], g: +m[2], b: +m[3] } : null
      })(s)
      if (!rgb) return '(enter a hex like #ff6600 or rgb(255,102,0))'
      // Convert sRGB → linear RGB
      const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4) }
      const lr = lin(rgb.r), lg = lin(rgb.g), lb = lin(rgb.b)
      // sRGB → XYZ D65
      const X = 0.4124564 * lr + 0.3575761 * lg + 0.1804375 * lb
      const Y = 0.2126729 * lr + 0.7151522 * lg + 0.0721750 * lb
      const Z = 0.0193339 * lr + 0.1191920 * lg + 0.9503041 * lb
      // XYZ → Oklab
      const cbrt = (n) => Math.sign(n) * Math.pow(Math.abs(n), 1 / 3)
      const l_ = cbrt(0.8189330101 * X + 0.3618667424 * Y - 0.1288597137 * Z)
      const m_ = cbrt(0.0329845436 * X + 0.9293118715 * Y + 0.0361456387 * Z)
      const s_ = cbrt(0.0482003018 * X + 0.2643662691 * Y + 0.6338517070 * Z)
      const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_
      const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_
      const b2 = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_
      // Oklab → OKLCH
      const C = Math.sqrt(a * a + b2 * b2)
      const H = (Math.atan2(b2, a) * 180 / Math.PI + 360) % 360
      const hsl = rgbToHsl(rgb)
      return [
        `Input: ${rgbToHex(rgb)}`,
        '',
        `OKLCH:  oklch(${(L * 100).toFixed(2)}% ${C.toFixed(4)} ${H.toFixed(2)})`,
        `Oklab:  oklab(${(L * 100).toFixed(2)}% ${a.toFixed(4)} ${b2.toFixed(4)})`,
        `HSL:    hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
        '',
        `Lightness: ${(L * 100).toFixed(2)}%`,
        `Chroma:    ${C.toFixed(4)}`,
        `Hue:       ${H.toFixed(2)}°`,
      ].join('\n')
    },
  },
  {
    id: 'color-mix',
    name: 'Color Mixer',
    category: 'color',
    description: 'Mix two hex colors — enter color1, color2, and optional ratio (0-1, default 0.5)',
    placeholder: '#ff0000\n#0000ff\n0.5',
    convert: (input) => {
      const lines = input.trim().split('\n').map(l => l.trim()).filter(Boolean)
      if (lines.length < 2) return '(enter two hex colors on separate lines, optionally add ratio on third line)'
      const rgb1 = hexToRgb(lines[0].startsWith('#') ? lines[0] : '#' + lines[0])
      const rgb2 = hexToRgb(lines[1].startsWith('#') ? lines[1] : '#' + lines[1])
      if (!rgb1 || !rgb2) return '(invalid hex colors)'
      const ratio = lines[2] ? Math.max(0, Math.min(1, parseFloat(lines[2]))) : 0.5
      if (isNaN(ratio)) return '(ratio must be a number between 0 and 1)'
      const mix = (a, b, t) => Math.round(a + (b - a) * t)
      const steps = [0, 0.25, 0.5, 0.75, 1].map(t => {
        const r = { r: mix(rgb1.r, rgb2.r, t), g: mix(rgb1.g, rgb2.g, t), b: mix(rgb1.b, rgb2.b, t) }
        const marker = Math.abs(t - ratio) < 0.01 ? ' ← selected' : ''
        return `  ${(t * 100).toFixed(0).padStart(3)}%  ${rgbToHex(r)}${marker}`
      })
      const result = { r: mix(rgb1.r, rgb2.r, ratio), g: mix(rgb1.g, rgb2.g, ratio), b: mix(rgb1.b, rgb2.b, ratio) }
      const hsl = rgbToHsl(result)
      return [
        `Color 1:  ${rgbToHex(rgb1)}  (ratio: 0 = 100% color 1)`,
        `Color 2:  ${rgbToHex(rgb2)}  (ratio: 1 = 100% color 2)`,
        `Ratio:    ${ratio}`,
        '',
        `Result:   ${rgbToHex(result)}`,
        `          rgb(${result.r}, ${result.g}, ${result.b})`,
        `          hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
        '',
        'Blend steps:',
        ...steps,
      ].join('\n')
    },
  },
  {
    id: 'css-custom-props',
    name: 'CSS Custom Properties',
    category: 'color',
    description: 'Generate CSS custom properties (variables) from a list of colors',
    placeholder: '#3b82f6\n#ef4444\n#22c55e\n#f59e0b',
    convert: (input) => {
      const lines = input.trim().split('\n').map(l => l.trim()).filter(Boolean)
      if (lines.length === 0) return '(enter hex colors, one per line)'
      const names = ['primary', 'danger', 'success', 'warning', 'info', 'neutral', 'accent', 'muted']
      const vars = lines.map((line, i) => {
        const hex = line.startsWith('#') ? line : '#' + line
        const rgb = hexToRgb(hex)
        if (!rgb) return `/* Invalid color: ${line} */`
        const hsl = rgbToHsl(rgb)
        const name = names[i] || `color-${i + 1}`
        return `  --color-${name}: ${hex};\n  --color-${name}-rgb: ${rgb.r}, ${rgb.g}, ${rgb.b};\n  --color-${name}-hsl: ${hsl.h}, ${hsl.s}%, ${hsl.l}%;`
      })
      return `:root {\n${vars.join('\n')}\n}`
    },
  },
  {
    id: 'color-temperature',
    name: 'Color Temperature',
    category: 'color',
    description: 'Convert color temperature (Kelvin) to RGB — enter a temperature in Kelvin (1000K-40000K)',
    placeholder: '6500',
    convert: (input) => {
      const temp = parseFloat(input.trim())
      if (isNaN(temp) || temp < 1000 || temp > 40000) return '(enter a color temperature in Kelvin, 1000K to 40000K)'
      // Tanner Helland algorithm
      const t = temp / 100
      let r, g, b
      if (t <= 66) {
        r = 255
        g = Math.max(0, Math.min(255, 99.4708025861 * Math.log(t) - 161.1195681661))
      } else {
        r = Math.max(0, Math.min(255, 329.698727446 * Math.pow(t - 60, -0.1332047592)))
        g = Math.max(0, Math.min(255, 288.1221695283 * Math.pow(t - 60, -0.0755148492)))
      }
      if (t >= 66) b = 255
      else if (t <= 19) b = 0
      else b = Math.max(0, Math.min(255, 138.5177312231 * Math.log(t - 10) - 305.0447927307))
      r = Math.round(r); g = Math.round(g); b = Math.round(b)
      const hex = rgbToHex({ r, g, b })
      const hsl = rgbToHsl({ r, g, b })
      const desc = temp < 2000 ? 'Candlelight' : temp < 3000 ? 'Warm white / incandescent' : temp < 4000 ? 'Warm white / halogen' : temp < 5000 ? 'Neutral white' : temp < 6500 ? 'Cool white / daylight' : temp < 8000 ? 'Daylight / overcast sky' : 'Blue sky'
      return [
        `Temperature: ${temp}K — ${desc}`,
        '',
        `HEX: ${hex}`,
        `RGB: rgb(${r}, ${g}, ${b})`,
        `HSL: hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
        '',
        `Common values:`,
        `  1900K - Candlelight`,
        `  2700K - Warm white bulb`,
        `  3000K - Halogen`,
        `  4000K - Fluorescent`,
        `  5500K - Noon sunlight`,
        `  6500K - Daylight / sRGB D65`,
        `  9000K - Clear blue sky`,
      ].join('\n')
    },
  },
  {
    id: 'color-tints-shades',
    name: 'Tints & Shades',
    category: 'color',
    description: 'Generate a full range of tints (lighter) and shades (darker) from a hex color',
    placeholder: '#3b82f6',
    convert: (input) => {
      const hex = input.trim()
      const rgb = hexToRgb(hex.startsWith('#') ? hex : '#' + hex)
      if (!rgb) return '(enter a valid hex color)'
      const result = []
      // Tints: mix with white
      result.push('Tints (mixed with white):')
      for (const pct of [90, 80, 70, 60, 50, 40, 30, 20, 10]) {
        const t = pct / 100
        const r = Math.round(rgb.r + (255 - rgb.r) * t)
        const g = Math.round(rgb.g + (255 - rgb.g) * t)
        const b = Math.round(rgb.b + (255 - rgb.b) * t)
        const h = rgbToHex({ r, g, b })
        result.push(`  ${(100 - pct).toString().padStart(3)}% — ${h}  rgb(${r}, ${g}, ${b})`)
      }
      result.push(`  100% — ${hex.startsWith('#') ? hex : '#' + hex}  (base)`)
      result.push('')
      result.push('Shades (mixed with black):')
      result.push(`  100% — ${hex.startsWith('#') ? hex : '#' + hex}  (base)`)
      for (const pct of [10, 20, 30, 40, 50, 60, 70, 80, 90]) {
        const t = pct / 100
        const r = Math.round(rgb.r * (1 - t))
        const g = Math.round(rgb.g * (1 - t))
        const b = Math.round(rgb.b * (1 - t))
        const h = rgbToHex({ r, g, b })
        result.push(`  ${(100 - pct).toString().padStart(3)}% — ${h}  rgb(${r}, ${g}, ${b})`)
      }
      return result.join('\n')
    },
  },
  {
    id: 'color-harmonies',
    name: 'Color Harmonies',
    category: 'color',
    description: 'Generate color harmony schemes (complementary, triadic, analogous, etc.) from a hex color',
    placeholder: '#e74c3c',
    convert: (input) => {
      const hex = input.trim()
      const rgb = hexToRgb(hex.startsWith('#') ? hex : '#' + hex)
      if (!rgb) return '(enter a valid hex color)'
      const hsl = rgbToHsl(rgb)
      function hslToHex(h, s, l) {
        const rgb = hslToRgb({ h: ((h % 360) + 360) % 360, s, l })
        return rgbToHex(rgb)
      }
      const h = hsl.h, s = hsl.s, l = hsl.l
      const result = [
        `Base: ${hex.startsWith('#') ? hex : '#' + hex}  hsl(${h}, ${s}%, ${l}%)`,
        '',
        'Complementary (180°):',
        `  ${hslToHex(h + 180, s, l)}  hsl(${(h + 180) % 360}, ${s}%, ${l}%)`,
        '',
        'Analogous (±30°):',
        `  ${hslToHex(h - 30, s, l)}  hsl(${((h - 30 + 360) % 360)}, ${s}%, ${l}%)`,
        `  ${hslToHex(h + 30, s, l)}  hsl(${(h + 30) % 360}, ${s}%, ${l}%)`,
        '',
        'Triadic (±120°):',
        `  ${hslToHex(h + 120, s, l)}  hsl(${(h + 120) % 360}, ${s}%, ${l}%)`,
        `  ${hslToHex(h + 240, s, l)}  hsl(${(h + 240) % 360}, ${s}%, ${l}%)`,
        '',
        'Split-Complementary (±150°):',
        `  ${hslToHex(h + 150, s, l)}  hsl(${(h + 150) % 360}, ${s}%, ${l}%)`,
        `  ${hslToHex(h + 210, s, l)}  hsl(${(h + 210) % 360}, ${s}%, ${l}%)`,
        '',
        'Tetradic / Square (90° apart):',
        `  ${hslToHex(h + 90, s, l)}  hsl(${(h + 90) % 360}, ${s}%, ${l}%)`,
        `  ${hslToHex(h + 180, s, l)}  hsl(${(h + 180) % 360}, ${s}%, ${l}%)`,
        `  ${hslToHex(h + 270, s, l)}  hsl(${(h + 270) % 360}, ${s}%, ${l}%)`,
      ]
      return result.join('\n')
    },
  },
  {
    id: 'color-lighten-darken',
    name: 'Lighten / Darken Color',
    category: 'color',
    description: 'Lighten or darken a color by percentage — enter "hex amount%" e.g. "#3498db 20%"',
    placeholder: '#3498db 20%',
    convert: (input) => {
      const m = input.trim().match(/^(#[0-9a-fA-F]{3,6})\s+([-+]?\d+)%?$/)
      if (!m) return '(format: #rrggbb percentage — e.g. "#3498db 20%" or "#3498db -30%")'
      const hex = m[1]
      const pct = parseInt(m[2], 10)
      const parseHex = (s) => {
        const h = s.replace('#', '')
        if (h.length === 3) return { r: parseInt(h[0]+h[0], 16), g: parseInt(h[1]+h[1], 16), b: parseInt(h[2]+h[2], 16) }
        return { r: parseInt(h.slice(0,2), 16), g: parseInt(h.slice(2,4), 16), b: parseInt(h.slice(4,6), 16) }
      }
      const { r, g, b } = parseHex(hex)
      const adjust = (c) => Math.max(0, Math.min(255, pct >= 0 ? c + (255 - c) * pct / 100 : c * (1 + pct / 100)))
      const nr = adjust(r), ng = adjust(g), nb = adjust(b)
      const toHex = (rv, gv, bv) => '#' + [rv, gv, bv].map(v => Math.round(v).toString(16).padStart(2,'0')).join('')
      const action = pct >= 0 ? 'Lightened' : 'Darkened'
      const result = [
        `Original: ${hex}  rgb(${r}, ${g}, ${b})`,
        `${action} by ${Math.abs(pct)}%: ${toHex(nr, ng, nb)}  rgb(${Math.round(nr)}, ${Math.round(ng)}, ${Math.round(nb)})`,
        '',
        'Scale:',
      ]
      for (const p of [-50, -30, -20, -10, 10, 20, 30, 50]) {
        const ra = adjust2 => Math.max(0, Math.min(255, p >= 0 ? adjust2 + (255 - adjust2) * p / 100 : adjust2 * (1 + p / 100)))
        result.push(`  ${p > 0 ? '+' : ''}${p}%: ${toHex(ra(r), ra(g), ra(b))}`)
      }
      return result.join('\n')
    },
  },
  {
    id: 'color-random',
    name: 'Random Color Generator',
    category: 'color',
    description: 'Generate random colors — enter count (default 5) or a style: "warm", "cool", "pastel", "dark", "neon"',
    placeholder: '5 pastel',
    convert: (input) => {
      const s = input.trim().toLowerCase() || '5'
      const countMatch = s.match(/(\d+)/)
      const count = Math.min(20, Math.max(1, parseInt(countMatch?.[1]) || 5))
      const style = s.includes('warm') ? 'warm' : s.includes('cool') ? 'cool' :
        s.includes('pastel') ? 'pastel' : s.includes('dark') ? 'dark' : s.includes('neon') ? 'neon' : 'random'
      const hslToHex = (h, sl, l) => {
        const s2 = sl / 100, l2 = l / 100
        const c = (1 - Math.abs(2*l2-1)) * s2
        const x = c * (1 - Math.abs(h/60 % 2 - 1)), m = l2 - c/2
        let r, g, b
        if (h < 60) { [r,g,b] = [c,x,0] } else if (h < 120) { [r,g,b] = [x,c,0] }
        else if (h < 180) { [r,g,b] = [0,c,x] } else if (h < 240) { [r,g,b] = [0,x,c] }
        else if (h < 300) { [r,g,b] = [x,0,c] } else { [r,g,b] = [c,0,x] }
        return '#' + [r,g,b].map(v => Math.round((v+m)*255).toString(16).padStart(2,'0')).join('')
      }
      const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
      const colors = Array.from({ length: count }, () => {
        let h, sat, l
        if (style === 'warm') { h = rand(0, 60); sat = rand(70, 100); l = rand(40, 65) }
        else if (style === 'cool') { h = rand(180, 270); sat = rand(60, 100); l = rand(35, 65) }
        else if (style === 'pastel') { h = rand(0, 360); sat = rand(60, 90); l = rand(70, 85) }
        else if (style === 'dark') { h = rand(0, 360); sat = rand(50, 100); l = rand(10, 35) }
        else if (style === 'neon') { h = rand(0, 360); sat = 100; l = rand(50, 60) }
        else { h = rand(0, 360); sat = rand(40, 100); l = rand(30, 70) }
        const hex = hslToHex(h, sat, l)
        return { hex, hsl: `hsl(${h}, ${sat}%, ${l}%)` }
      })
      return colors.map(c => `${c.hex}  ${c.hsl}`).join('\n')
    },
  },
  {
    id: 'color-extract',
    name: 'Extract Colors from Text',
    category: 'color',
    description: 'Find and normalize all color values in a block of CSS or text',
    placeholder: 'background: #ff6b35; color: rgb(255, 107, 53); border: 1px solid hsl(16, 100%, 60%);',
    convert: (input) => {
      if (!input.trim()) return '(enter CSS or text containing color values)'
      const found = []
      // HEX colors
      const hexes = [...input.matchAll(/#([0-9a-fA-F]{3,8})\b/g)]
      for (const m of hexes) {
        const hex = m[0].length === 4 ? '#' + m[1].split('').map(c => c+c).join('') : m[0].slice(0,7)
        found.push({ type: 'HEX', raw: m[0], normalized: hex.toLowerCase() })
      }
      // RGB/RGBA
      const rgbs = [...input.matchAll(/rgba?\(\s*[\d.,\s/]+\)/gi)]
      for (const m of rgbs) found.push({ type: 'RGB', raw: m[0], normalized: m[0].replace(/\s+/g, ' ') })
      // HSL/HSLA
      const hsls = [...input.matchAll(/hsla?\(\s*[\d.,\s%/]+\)/gi)]
      for (const m of hsls) found.push({ type: 'HSL', raw: m[0], normalized: m[0].replace(/\s+/g, ' ') })
      // Named colors (common ones)
      const namedColors = ['red', 'green', 'blue', 'white', 'black', 'yellow', 'orange', 'purple', 'pink', 'gray', 'grey', 'cyan', 'magenta', 'lime', 'navy', 'teal', 'silver', 'gold', 'coral', 'salmon', 'violet', 'indigo', 'maroon', 'olive', 'aqua']
      for (const color of namedColors) {
        if (new RegExp(`\\b${color}\\b`, 'i').test(input)) {
          found.push({ type: 'Named', raw: color, normalized: color })
        }
      }
      if (!found.length) return '(no color values found in text)'
      const unique = found.filter((c, i) => found.findIndex(d => d.normalized === c.normalized) === i)
      return [
        `Found ${unique.length} unique color${unique.length !== 1 ? 's' : ''}:`,
        '',
        ...unique.map(c => `${c.type.padEnd(6)} ${c.normalized.padEnd(25)} (from: ${c.raw.length > 30 ? c.raw.slice(0,27)+'...' : c.raw})`),
      ].join('\n')
    },
  },
  {
    id: 'css-to-color-vars',
    name: 'CSS to Color Variables',
    category: 'color',
    description: 'Extract all colors from CSS and convert to CSS custom properties',
    placeholder: '.button { background: #ff6b35; color: white; border: 1px solid #333; }\n.header { background: rgb(30, 30, 50); }',
    convert: (input) => {
      if (!input.trim()) return '(enter CSS to extract colors)'
      const colorMap = {}
      const hexes = [...input.matchAll(/#([0-9a-fA-F]{3,6})\b/g)]
      let varIndex = 1
      for (const m of hexes) {
        const hex = m[0].length === 4 ? '#' + m[1].split('').map(c => c+c).join('') : m[0].toLowerCase()
        if (!colorMap[hex]) colorMap[hex] = `--color-${varIndex++}`
      }
      if (!Object.keys(colorMap).length) return '(no hex colors found in CSS)'
      const vars = Object.entries(colorMap).map(([hex, name]) => `  ${name}: ${hex};`).join('\n')
      let replaced = input
      for (const [hex, name] of Object.entries(colorMap)) replaced = replaced.replace(new RegExp(hex.replace('#', '#'), 'gi'), `var(${name})`)
      return [
        ':root {',
        vars,
        '}',
        '',
        '/* Updated CSS: */',
        replaced,
      ].join('\n')
    },
  },
  {
    id: 'color-wcag-audit',
    name: 'WCAG Color Audit',
    description: 'Audit multiple color pairs for WCAG accessibility compliance. Enter pairs one per line: "foreground background" or "#fff #000".',
    category: 'color',
    convert: (input) => {
      const { hexToRgb } = (() => {
        const hexToRgb = (hex) => {
          const h = hex.replace('#', '')
          const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h
          return { r: parseInt(full.slice(0, 2), 16), g: parseInt(full.slice(2, 4), 16), b: parseInt(full.slice(4, 6), 16) }
        }
        return { hexToRgb }
      })()
      const relativeLuminance = ({ r, g, b }) => {
        const ch = [r, g, b].map(c => { const s = c / 255; return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4) })
        return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2]
      }
      const contrast = (c1, c2) => {
        const l1 = relativeLuminance(c1), l2 = relativeLuminance(c2)
        const lighter = Math.max(l1, l2), darker = Math.min(l1, l2)
        return (lighter + 0.05) / (darker + 0.05)
      }
      const parseColor = (s) => {
        s = s.trim()
        if (s.startsWith('#')) return hexToRgb(s)
        const rgb = s.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
        if (rgb) return { r: +rgb[1], g: +rgb[2], b: +rgb[3] }
        return null
      }
      const lines = input.trim().split('\n').filter(l => l.trim())
      const results = []
      for (const line of lines) {
        const parts = line.trim().split(/\s+/)
        if (parts.length < 2) continue
        const fg = parseColor(parts[0]), bg = parseColor(parts[1])
        if (!fg || !bg) { results.push(`"${line}" — could not parse colors`); continue }
        const ratio = contrast(fg, bg)
        const aa_normal = ratio >= 4.5
        const aa_large = ratio >= 3
        const aaa_normal = ratio >= 7
        const aaa_large = ratio >= 4.5
        const badge = (pass) => pass ? 'PASS' : 'FAIL'
        results.push([
          `${parts[0]} on ${parts[1]}: ${ratio.toFixed(2)}:1`,
          `  AA Normal (≥4.5):  ${badge(aa_normal)}  |  AA Large (≥3):    ${badge(aa_large)}`,
          `  AAA Normal (≥7):   ${badge(aaa_normal)}  |  AAA Large (≥4.5): ${badge(aaa_large)}`,
        ].join('\n'))
      }
      if (results.length === 0) return '(enter color pairs, e.g. "#333 #fff" or "#000000 #ffffff")'
      return results.join('\n\n')
    },
  },
  {
    id: 'color-to-tailwind',
    name: 'Color to Nearest Tailwind',
    description: 'Find the nearest Tailwind CSS color for any hex color. Enter one hex color per line.',
    category: 'color',
    convert: (input) => {
      const tailwind = {
        'slate-50':'#f8fafc','slate-100':'#f1f5f9','slate-200':'#e2e8f0','slate-300':'#cbd5e1','slate-400':'#94a3b8','slate-500':'#64748b','slate-600':'#475569','slate-700':'#334155','slate-800':'#1e293b','slate-900':'#0f172a',
        'gray-50':'#f9fafb','gray-100':'#f3f4f6','gray-200':'#e5e7eb','gray-300':'#d1d5db','gray-400':'#9ca3af','gray-500':'#6b7280','gray-600':'#4b5563','gray-700':'#374151','gray-800':'#1f2937','gray-900':'#111827',
        'red-50':'#fef2f2','red-100':'#fee2e2','red-200':'#fecaca','red-300':'#fca5a5','red-400':'#f87171','red-500':'#ef4444','red-600':'#dc2626','red-700':'#b91c1c','red-800':'#991b1b','red-900':'#7f1d1d',
        'orange-400':'#fb923c','orange-500':'#f97316','orange-600':'#ea580c',
        'amber-400':'#fbbf24','amber-500':'#f59e0b','amber-600':'#d97706',
        'yellow-300':'#fde047','yellow-400':'#facc15','yellow-500':'#eab308',
        'green-50':'#f0fdf4','green-100':'#dcfce7','green-400':'#4ade80','green-500':'#22c55e','green-600':'#16a34a','green-700':'#15803d','green-800':'#166534','green-900':'#14532d',
        'teal-400':'#2dd4bf','teal-500':'#14b8a6','teal-600':'#0d9488',
        'cyan-400':'#22d3ee','cyan-500':'#06b6d4','cyan-600':'#0891b2',
        'blue-50':'#eff6ff','blue-100':'#dbeafe','blue-200':'#bfdbfe','blue-300':'#93c5fd','blue-400':'#60a5fa','blue-500':'#3b82f6','blue-600':'#2563eb','blue-700':'#1d4ed8','blue-800':'#1e40af','blue-900':'#1e3a8a',
        'indigo-400':'#818cf8','indigo-500':'#6366f1','indigo-600':'#4f46e5',
        'violet-400':'#a78bfa','violet-500':'#8b5cf6','violet-600':'#7c3aed',
        'purple-400':'#c084fc','purple-500':'#a855f7','purple-600':'#9333ea',
        'pink-400':'#f472b6','pink-500':'#ec4899','pink-600':'#db2777',
        'rose-400':'#fb7185','rose-500':'#f43f5e','rose-600':'#e11d48',
        'white':'#ffffff','black':'#000000',
      }
      const hexToRgb = (hex) => {
        const h = hex.replace('#', '')
        const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h
        return { r: parseInt(full.slice(0, 2), 16), g: parseInt(full.slice(2, 4), 16), b: parseInt(full.slice(4, 6), 16) }
      }
      const colorDist = (c1, c2) => Math.sqrt((c1.r - c2.r) ** 2 + (c1.g - c2.g) ** 2 + (c1.b - c2.b) ** 2)
      const hexes = input.trim().split('\n').map(l => l.trim()).filter(l => /^#?[0-9a-fA-F]{3,6}$/.test(l))
      if (hexes.length === 0) return '(enter hex colors, one per line, e.g. #4a90d9)'
      return hexes.map(hex => {
        const input_hex = hex.startsWith('#') ? hex : '#' + hex
        const inputRgb = hexToRgb(input_hex)
        let best = null, bestDist = Infinity
        for (const [name, twHex] of Object.entries(tailwind)) {
          const d = colorDist(inputRgb, hexToRgb(twHex))
          if (d < bestDist) { bestDist = d; best = { name, hex: twHex } }
        }
        const exact = bestDist < 1
        return `${input_hex} → ${exact ? '(exact) ' : ''}${best.name} (${best.hex})${exact ? '' : ` [Δ=${Math.round(bestDist)}]`}`
      }).join('\n')
    },
  },
  {
    id: 'color-from-image',
    name: 'Color Palette Description',
    description: 'Describe a color palette in words and get matching hex codes. Enter color names or descriptions separated by commas.',
    category: 'color',
    convert: (input) => {
      const namedColors = {
        red:'#ff0000',crimson:'#dc143c',scarlet:'#ff2400',maroon:'#800000',tomato:'#ff6347',coral:'#ff7f50',salmon:'#fa8072',
        orange:'#ffa500','dark orange':'#ff8c00',tangerine:'#f28500',peach:'#ffdab9',
        yellow:'#ffff00',gold:'#ffd700',amber:'#ffbf00',cream:'#fffdd0',ivory:'#fffff0',
        green:'#008000','lime green':'#32cd32','forest green':'#228b22',mint:'#98ff98',olive:'#808000',sage:'#b2ac88',emerald:'#50c878',
        teal:'#008080',cyan:'#00ffff',turquoise:'#40e0d0','sea green':'#2e8b57',
        blue:'#0000ff','sky blue':'#87ceeb','navy blue':'#000080',cobalt:'#0047ab',cerulean:'#007ba7','royal blue':'#4169e1','baby blue':'#89cff0',
        purple:'#800080',violet:'#7f00ff',lavender:'#e6e6fa',plum:'#dda0dd',mauve:'#e0b0ff',indigo:'#4b0082',
        pink:'#ffc0cb','hot pink':'#ff69b4','rose pink':'#ff007f','dusty rose':'#dcae96',magenta:'#ff00ff',
        white:'#ffffff','off white':'#faf9f6','snow white':'#fffafa',
        'light gray':'#d3d3d3',gray:'#808080','dark gray':'#404040',silver:'#c0c0c0',charcoal:'#36454f',
        black:'#000000','jet black':'#0a0a0a',
        brown:'#a52a2a',tan:'#d2b48c',beige:'#f5f5dc',khaki:'#c3b091',caramel:'#c68642',chocolate:'#7b3f00',
      }
      const colors = input.split(',').map(c => c.trim().toLowerCase()).filter(Boolean)
      if (colors.length === 0) return '(enter color names separated by commas)'
      const results = []
      for (const name of colors) {
        const exact = namedColors[name]
        if (exact) {
          results.push(`${name}: ${exact}`)
        } else {
          const close = Object.entries(namedColors).find(([k]) => k.includes(name) || name.includes(k))
          if (close) results.push(`${name}: ${close[1]} (closest: ${close[0]})`)
          else results.push(`${name}: (not recognized — try more specific color names)`)
        }
      }
      return results.join('\n')
    },
  },
  {
    id: 'color-css-variables',
    name: 'CSS Color System Generator',
    description: 'Generate a complete CSS color system from a single brand color. Creates a full scale of shades (50-900) in multiple formats.',
    category: 'color',
    convert: (input) => {
      const hex = input.trim()
      const hexToRgb = (h) => {
        const hx = h.replace('#', '')
        const full = hx.length === 3 ? hx.split('').map(c => c + c).join('') : hx
        return { r: parseInt(full.slice(0, 2), 16), g: parseInt(full.slice(2, 4), 16), b: parseInt(full.slice(4, 6), 16) }
      }
      const rgbToHsl = (r, g, b) => {
        r /= 255; g /= 255; b /= 255
        const max = Math.max(r, g, b), min = Math.min(r, g, b)
        let h, s, l = (max + min) / 2
        if (max === min) { h = s = 0 }
        else {
          const d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
          h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4
          h /= 6
        }
        return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
      }
      const hslToHex = (h, s, l) => {
        s /= 100; l /= 100
        const a = s * Math.min(l, 1 - l)
        const f = (n) => {
          const k = (n + h / 30) % 12
          const c = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))
          return Math.round(255 * c).toString(16).padStart(2, '0')
        }
        return `#${f(0)}${f(8)}${f(4)}`
      }
      if (!/#?[0-9a-fA-F]{3,6}/.test(hex)) return '(enter a hex color, e.g. #4a90d9)'
      const rgb = hexToRgb(hex.startsWith('#') ? hex : '#' + hex)
      const { h, s } = rgbToHsl(rgb.r, rgb.g, rgb.b)
      const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]
      const lines = ['/* CSS Color Scale */', ':root {']
      for (const step of steps) {
        // Map 50→95% lightness, 900→10% lightness
        const targetL = Math.round(95 - (step / 900) * 85)
        const targetS = step <= 100 ? Math.max(10, s - 20) : step >= 800 ? Math.max(20, s - 10) : s
        const color = hslToHex(h, targetS, targetL)
        lines.push(`  --color-${step}: ${color};`)
      }
      lines.push('}', '', '/* Usage example */', `.btn { background: var(--color-500); }`, `.btn:hover { background: var(--color-600); }`, `.text { color: var(--color-900); }`, `.bg-light { background: var(--color-50); }`)
      return lines.join('\n')
    },
  },
  {
    id: 'color-mix-calculator',
    name: 'Color Mixing Calculator',
    description: 'Mix two or more colors by percentage. Enter colors and percentages: "#ff0000 60% #0000ff 40%" or "#red 50% blue 50%".',
    category: 'color',
    convert: (input) => {
      const hexToRgb = (h) => {
        const namedColors = { red: '#ff0000', blue: '#0000ff', green: '#008000', white: '#ffffff', black: '#000000', yellow: '#ffff00', orange: '#ffa500', purple: '#800080', pink: '#ffc0cb', gray: '#808080', cyan: '#00ffff', magenta: '#ff00ff' }
        const hx = namedColors[h.toLowerCase()] || (h.startsWith('#') ? h : '#' + h)
        const full = hx.replace('#', '').length === 3 ? hx.replace('#', '').split('').map(c => c + c).join('') : hx.replace('#', '')
        return { r: parseInt(full.slice(0, 2), 16), g: parseInt(full.slice(2, 4), 16), b: parseInt(full.slice(4, 6), 16) }
      }
      const tokens = input.trim().split(/\s+/)
      const colors = []
      let i = 0
      while (i < tokens.length) {
        const token = tokens[i]
        const pct = tokens[i + 1]?.match(/^(\d+)%$/)
        if (pct) {
          colors.push({ hex: token, pct: parseFloat(pct[1]) / 100 })
          i += 2
        } else if (/^#?[0-9a-fA-F]{3,6}$/.test(token) || Object.keys({ red: 1, blue: 1, green: 1, white: 1, black: 1, yellow: 1, orange: 1, purple: 1, pink: 1, gray: 1, cyan: 1, magenta: 1 }).includes(token.toLowerCase())) {
          colors.push({ hex: token, pct: null })
          i++
        } else { i++ }
      }
      if (colors.length < 2) return '(enter at least 2 colors with percentages, e.g. "#ff0000 60% #0000ff 40%")'
      // Distribute equal percentages if not specified
      const totalPct = colors.reduce((s, c) => s + (c.pct || 0), 0)
      const unspecified = colors.filter(c => c.pct === null).length
      const eachPct = unspecified > 0 ? (1 - totalPct) / unspecified : 0
      colors.forEach(c => { if (c.pct === null) c.pct = eachPct })
      // Mix in RGB
      const mixed = colors.reduce((acc, { hex, pct }) => {
        const rgb = hexToRgb(hex)
        return { r: acc.r + rgb.r * pct, g: acc.g + rgb.g * pct, b: acc.b + rgb.b * pct }
      }, { r: 0, g: 0, b: 0 })
      const r = Math.round(mixed.r), g = Math.round(mixed.g), b = Math.round(mixed.b)
      const toHex = (n) => n.toString(16).padStart(2, '0')
      const mixedHex = `#${toHex(r)}${toHex(g)}${toHex(b)}`
      const pctStr = colors.map(c => `${c.hex} (${Math.round(c.pct * 100)}%)`).join(' + ')
      return [
        `Mix: ${pctStr}`,
        `Result: ${mixedHex}`,
        `rgb(${r}, ${g}, ${b})`,
        '',
        `Components:  R=${r}  G=${g}  B=${b}`,
      ].join('\n')
    },
  },
  {
    id: 'color-luminance',
    name: 'Color Luminance & Lightness',
    description: 'Calculate relative luminance, perceived lightness, and suggest readable text color for any background. Enter a hex color.',
    category: 'color',
    convert: (input) => {
      const hexes = input.trim().split('\n').map(l => l.trim()).filter(l => /^#?[0-9a-fA-F]{3,6}$/.test(l))
      if (hexes.length === 0) return '(enter hex colors, one per line)'
      const hexToRgb = (h) => {
        const hx = h.replace('#', '')
        const full = hx.length === 3 ? hx.split('').map(c => c + c).join('') : hx
        return { r: parseInt(full.slice(0, 2), 16), g: parseInt(full.slice(2, 4), 16), b: parseInt(full.slice(4, 6), 16) }
      }
      const relativeLuminance = ({ r, g, b }) => {
        const ch = [r, g, b].map(c => { const s = c / 255; return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4) })
        return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2]
      }
      return hexes.map(hex => {
        const input_hex = hex.startsWith('#') ? hex : '#' + hex
        const rgb = hexToRgb(input_hex)
        const L = relativeLuminance(rgb)
        const perceivedL = L <= 0.008856 ? L * 903.3 : Math.pow(L, 1 / 3) * 116 - 16
        const textLabel = L > 0.179 ? 'Black text' : 'White text'
        const contrastWhite = (1.05) / (L + 0.05)
        const contrastBlack = (L + 0.05) / 0.05
        return [
          `${input_hex}  rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
          `Relative Luminance: ${L.toFixed(4)} (${(L * 100).toFixed(1)}%)`,
          `Perceived Lightness (L*): ${perceivedL.toFixed(1)}/100`,
          `Readable text: ${textLabel}`,
          `  vs white: ${contrastWhite.toFixed(2)}:1`,
          `  vs black: ${contrastBlack.toFixed(2)}:1`,
        ].join('\n')
      }).join('\n\n')
    },
  },
]
