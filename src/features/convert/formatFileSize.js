export function formatFileSize(bytes,locale = 'de') {
  const value = Number(bytes)
  if (!Number.isFinite(value) || value < 0) return '0 B'
  if (value < 1024) return `${Math.round(value)} B`
  const units = ['KiB','MiB','GiB']
  let amount = value / 1024
  let index = 0
  while (amount >= 1024 && index < units.length - 1) { amount /= 1024; index++ }
  const formatted = new Intl.NumberFormat(locale === 'en' ? 'en' : 'de-CH',{ maximumFractionDigits:amount < 10 ? 1 : 0 }).format(amount)
  return `${formatted} ${units[index]}`
}
