import { useI18n } from '../../i18n'

export default function PrivacyStatus({ compact = false }) {
  const { t } = useI18n()

  return (
    <p className={`privacy-status${compact ? ' privacy-status--compact' : ''}`}>
      <span className="privacy-status__dot" aria-hidden="true" />
      <span>{t('shell.privacyStatus')}</span>
    </p>
  )
}
