export function hexToRgb(hex) {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h
  if (full.length !== 6) return null
  const n = parseInt(full, 16)
  if (isNaN(n)) return null
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

export function rgbToHsl({ r, g, b }) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) }
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

export function hslToRgb({ h, s, l }) {
  h /= 360; s /= 100; l /= 100
  if (s === 0) { const v = Math.round(l * 255); return { r: v, g: v, b: v } }
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1; if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  }
}

export function rgbToHex({ r, g, b }) {
  return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('')
}

export function parseRgb(s) {
  const m = s.match(/(\d+)\s*[,\s]\s*(\d+)\s*[,\s]\s*(\d+)/)
  return m ? { r: +m[1], g: +m[2], b: +m[3] } : null
}

export function parseHsl(s) {
  const m = s.match(/(\d+)\s*[,\s]\s*(\d+)%?\s*[,\s]\s*(\d+)%?/)
  return m ? { h: +m[1], s: +m[2], l: +m[3] } : null
}

export function rgbToHsv({ r, g, b }) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min
  let h = 0
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
    else if (max === g) h = ((b - r) / d + 2) / 6
    else h = ((r - g) / d + 4) / 6
  }
  return { h: Math.round(h * 360), s: Math.round((max === 0 ? 0 : d / max) * 100), v: Math.round(max * 100) }
}

export function hsvToRgb({ h, s, v }) {
  h /= 360; s /= 100; v /= 100
  const i = Math.floor(h * 6)
  const f = h * 6 - i
  const p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s)
  let r, g, b
  switch (i % 6) {
    case 0: [r, g, b] = [v, t, p]; break
    case 1: [r, g, b] = [q, v, p]; break
    case 2: [r, g, b] = [p, v, t]; break
    case 3: [r, g, b] = [p, q, v]; break
    case 4: [r, g, b] = [t, p, v]; break
    default:[r, g, b] = [v, p, q]
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) }
}

export function parseHsv(s) {
  const m = s.match(/(\d+)\s*[,\s]\s*(\d+)%?\s*[,\s]\s*(\d+)%?/)
  return m ? { h: +m[1], s: +m[2], v: +m[3] } : null
}

function validRgb(rgb) {
  return rgb && [rgb.r, rgb.g, rgb.b].every(value => Number.isInteger(value) && value >= 0 && value <= 255)
}

function validHueColor(color, lightnessKey) {
  return color
    && Number.isInteger(color.h) && color.h >= 0 && color.h <= 360
    && Number.isInteger(color.s) && color.s >= 0 && color.s <= 100
    && Number.isInteger(color[lightnessKey]) && color[lightnessKey] >= 0 && color[lightnessKey] <= 100
}

export function normalizeColorToHex(format, value) {
  const text = String(value || '').trim()
  let rgb = null
  if (format === 'color-hex') {
    rgb = hexToRgb(text)
  } else if (format === 'color-rgb') {
    const parsed = parseRgb(text)
    if (validRgb(parsed)) rgb = parsed
  } else if (format === 'color-hsl') {
    const parsed = parseHsl(text)
    if (validHueColor(parsed, 'l')) rgb = hslToRgb(parsed)
  } else if (format === 'color-hsv') {
    const parsed = parseHsv(text)
    if (validHueColor(parsed, 'v')) rgb = hsvToRgb(parsed)
  }
  return validRgb(rgb) ? rgbToHex(rgb) : null
}
