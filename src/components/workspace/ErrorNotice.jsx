import { useI18n } from '../../i18n'

const keyByCode = Object.freeze({
  unsupported_type: 'errors.unsupportedType',
  unsupported_browser: 'errors.unsupportedBrowser',
  too_large: 'errors.tooLarge',
  invalid_file: 'errors.invalidFile',
  out_of_memory: 'errors.outOfMemory',
  cancelled: 'errors.cancelled',
  conversion_failed: 'errors.conversionFailed',
})

export default function ErrorNotice({ error }) {
  const { t } = useI18n()
  if (!error) return null
  const messageKey = keyByCode[error.code] || 'errors.conversionFailed'
  return <div className="error-msg" role="alert">{t(messageKey)}</div>
}
