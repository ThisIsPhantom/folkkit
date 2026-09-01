import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../../i18n'

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function FileDropZone({ accept = '*', multiple = false, files = [], disabled = false, onFilesChange }) {
  const { t } = useI18n()
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)
  const inputLabel = t(multiple ? 'workspaceTools.selectFiles' : 'workspaceTools.selectFile')

  useEffect(() => {
    if (files.length === 0 && inputRef.current) inputRef.current.value = ''
  }, [files.length])

  const choose = (fileList) => {
    if (disabled) return
    const selected = Array.from(fileList || [])
    onFilesChange?.(multiple ? selected : selected.slice(0, 1))
  }

  const openPicker = () => {
    if (!disabled) inputRef.current?.click()
  }

  return (
    <div
      className={`drop-zone${dragging ? ' dragging' : ''}${disabled ? ' disabled' : ''}`}
      onDrop={(event) => {
        event.preventDefault()
        setDragging(false)
        choose(event.dataTransfer.files)
      }}
      onDragOver={(event) => {
        event.preventDefault()
        if (!disabled) setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onClick={openPicker}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-label={t(multiple ? 'workspaceTools.dropFiles' : 'workspaceTools.dropFile')}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          openPicker()
        }
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={(event) => choose(event.target.files)}
        className="workspace-file-input"
        aria-label={inputLabel}
      />
      {files.length > 0 ? (
        <div className="drop-zone-files">
          {files.map((file, index) => (
            <span className="drop-zone-file" key={`${file.name}-${file.size}-${index}`}>
              <span className="drop-zone-filename">{file.name}</span>
              <span className="drop-zone-size">{formatSize(file.size)}</span>
            </span>
          ))}
        </div>
      ) : (
        <span className="drop-zone-hint">{t(multiple ? 'workspaceTools.dropFiles' : 'workspaceTools.dropFile')}</span>
      )}
    </div>
  )
}
