import { useI18n } from '../../i18n'

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function ResultActions({ record, onDiscard, onCopied }) {
  const { t } = useI18n()
  const result = record?.result
  if (!result) return null

  const copy = async () => {
    if (result.kind !== 'text' || !result.text) return
    await navigator.clipboard.writeText(result.text)
    onCopied?.()
  }

  return (
    <div className="result-actions">
      <div className="panel-label-row">
        <span className="panel-label">{t('workspaceTools.output')}</span>
        <div className="panel-actions">
          {(result.kind === 'download' || result.kind === 'image') && record.url && (
            <a className="pill-btn-sm" href={record.url} download={result.filename}>{t('workspaceTools.download')}</a>
          )}
          {result.kind === 'text' && result.text && (
            <button type="button" className="pill-btn-sm" onClick={copy}>{t('workspaceTools.copy')}</button>
          )}
          <button type="button" className="pill-btn-sm" onClick={onDiscard}>{t('workspaceTools.discard')}</button>
        </div>
      </div>
      {(result.kind === 'download' || result.kind === 'image') && (
        <div className="media-result">
          <span className="media-result-name">{result.filename}</span>
          <span className="media-result-size">{formatSize(result.blob.size)}</span>
        </div>
      )}
      {result.kind === 'image' && record.url && (
        <div className="image-preview"><img src={record.url} alt={t('workspaceTools.previewAlt')} /></div>
      )}
      {result.kind === 'text' && <pre className="workspace-text-result">{result.text}</pre>}
    </div>
  )
}
