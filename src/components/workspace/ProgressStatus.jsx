import { useI18n } from '../../i18n'

export default function ProgressStatus({ progress = 0, loadingRuntime = false, onCancel }) {
  const { t } = useI18n()
  const value = Math.min(100, Math.max(0, Number(progress) || 0))
  const status = loadingRuntime
    ? t('workspaceTools.loadingRuntime')
    : t('workspaceTools.processing', { progress: `${value} %` })

  return (
    <div className="progress-status" role="status" aria-live="polite">
      <progress
        className="progress-bar"
        aria-label={t('workspaceTools.progressLabel')}
        max="100"
        value={value}
      />
      <div className="progress-status-row">
        <span className="progress-text">{status}</span>
        <button type="button" className="pill-btn-sm" onClick={onCancel}>{t('workspaceTools.cancel')}</button>
      </div>
    </div>
  )
}
