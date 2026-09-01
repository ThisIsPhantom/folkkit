import { useI18n } from '../../i18n'

const keyByCode = Object.freeze({
  unsupported_type: 'errors.unsupportedType',
  unsupported_pair: 'errors.unsupportedPair',
  unsupported_browser: 'errors.unsupportedBrowser',
  too_large: 'errors.tooLarge',
  invalid_file: 'errors.invalidFile',
  out_of_memory: 'errors.outOfMemory',
  cancelled: 'errors.cancelled',
  conversion_failed: 'errors.conversionFailed',
  media_runtime_unavailable: 'errors.mediaRuntimeUnavailable',
  resource_limit: 'errors.resourceLimit',
})

export default function ErrorNotice({ error, onRetry }) {
  const { t } = useI18n()
  if (!error) return null
  const messageKey = keyByCode[error.code] || 'errors.conversionFailed'
  return (
    <div className="error-msg" role="alert">
      <span>{t(messageKey)}</span>
      {error.code === 'media_runtime_unavailable' && onRetry && (
        <button type="button" onClick={onRetry}>{t('workspaceTools.retryModule')}</button>
      )}
    </div>
  )
}
