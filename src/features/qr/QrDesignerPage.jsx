import { useEffect, useMemo, useRef, useState } from 'react'
import { useI18n } from '../../i18n/index.js'
import { createLatestPreview } from './latestPreview.js'
import { computeSquareCrop, loadLogoAsset, moveCropByPixels } from './logoAsset.js'
import { downloadQrBlob, generateQrBlob } from './qrGenerator.js'
import { analyseQrPayload, contrastRatio } from './qrModel.js'
import { buildQrPayload } from './qrPayloads.js'
import { readQrImage, safeHttpUrl } from './qrReader.js'
import './qr-designer.css'

const DEFAULTS = Object.freeze({
  contentType: 'text',
  foreground: '#111111',
  background: '#ffffff',
  dotStyle: 'square',
  cornerSquareStyle: 'square',
  cornerDotStyle: 'square',
  size: 320,
  quietZone: 4,
  logoSize: 20,
  logoSpacing: 4,
  crop: Object.freeze({ zoom: 1, x: 0, y: 0 }),
})

const CONTENT_DEFAULTS = Object.freeze({
  text: '',
  wifiName: '',
  wifiPassword: '',
  wifiEncryption: 'WPA',
  wifiHidden: false,
  contactName: '',
  contactOrganization: '',
  contactPhone: '',
  contactEmail: '',
  contactWebsite: '',
  emailTo: '',
  emailSubject: '',
  emailBody: '',
  smsPhone: '',
  smsMessage: '',
})

const CONTENT_TYPES = Object.freeze([
  ['text', 'typeText'],
  ['url', 'typeUrl'],
  ['wifi', 'typeWifi'],
  ['vcard', 'typeContact'],
  ['email', 'typeEmail'],
  ['sms', 'typeSms'],
])

const MODES = new Set(['create', 'read'])
const normalizeMode = value => MODES.has(value) ? value : 'create'

const styleOptions = Object.freeze({
  dots: [
    ['square', 'styleSquare'],
    ['rounded', 'styleRounded'],
    ['extra-rounded', 'styleExtraRounded'],
  ],
  cornerSquares: [
    ['square', 'styleSquare'],
    ['extra-rounded', 'styleExtraRounded'],
    ['dot', 'styleDots'],
  ],
  cornerDots: [
    ['square', 'styleSquare'],
    ['dot', 'styleDots'],
  ],
})

const tabs = Object.freeze([
  ['content', 'tabContent'],
  ['design', 'tabDesign'],
  ['logo', 'tabLogo'],
])

const colourPresets = Object.freeze({
  foreground: Object.freeze([
    ['graphite', '#111111', 'colourGraphite'],
    ['green', '#166534', 'colourGreen'],
    ['blue', '#1d4ed8', 'colourBlue'],
    ['purple', '#6b21a8', 'colourPurple'],
    ['terracotta', '#9a3412', 'colourTerracotta'],
  ]),
  background: Object.freeze([
    ['white', '#ffffff', 'colourWhite'],
    ['neutral', '#f5f3ef', 'colourLightNeutral'],
    ['mint', '#ecfdf5', 'colourMint'],
    ['light-blue', '#eff6ff', 'colourLightBlue'],
    ['rose', '#fff1f2', 'colourRose'],
  ]),
})

function ColourPresets({ kind, selected, onSelect, t }) {
  const groupKey = kind === 'foreground' ? 'foregroundPresets' : 'backgroundPresets'
  const actionKey = kind === 'foreground' ? 'selectForegroundPreset' : 'selectBackgroundPreset'
  return (
    <div className="qr-swatches" role="group" aria-label={t(`studioQr.${groupKey}`)}>
      {colourPresets[kind].map(([name, value, labelKey]) => {
        const label = t(`studioQr.${labelKey}`)
        return (
          <button
            key={value}
            type="button"
            className={`qr-swatch qr-swatch--${name}`}
            aria-label={t(`studioQr.${actionKey}`, { color: label })}
            aria-pressed={selected === value}
            title={label}
            onClick={() => onSelect(value)}
          >
            <span className="sr-only">{label}</span>
          </button>
        )
      })}
    </div>
  )
}

function SelectControl({ id, label, value, onChange, options, t }) {
  return (
    <label className="qr-field" htmlFor={id}>
      <span>{label}</span>
      <span className="qr-select-wrap">
        <select id={id} name={id} value={value} onChange={onChange}>
          {options.map(([optionValue, key]) => <option key={optionValue} value={optionValue}>{t(`studioQr.${key}`)}</option>)}
        </select>
        <svg viewBox="0 0 8 5" width="8" height="5" aria-hidden="true"><path d="M.5.5 4 4 7.5.5" /></svg>
      </span>
    </label>
  )
}

function RangeControl({ id, label, value, minimum, maximum, step = 1, output, onChange }) {
  return (
    <label className="qr-field qr-range" htmlFor={id}>
      <span className="qr-field-heading"><span>{label}</span><output htmlFor={id}>{output}</output></span>
      <input id={id} name={id} type="range" min={minimum} max={maximum} step={step} value={value} onChange={onChange} />
    </label>
  )
}

function ContentField({ id, label, value, onChange, error, t, type = 'text', multiline = false, inputMode, placeholder }) {
  const describedBy = error ? `${id}-error` : undefined
  const controlProps = {
    id,
    name: id,
    value,
    inputMode,
    placeholder,
    'aria-invalid': error ? 'true' : undefined,
    'aria-describedby': describedBy,
    onChange: event => onChange(event.target.value),
  }
  return (
    <label className="qr-field" htmlFor={id}>
      <span>{label}</span>
      {multiline ? <textarea {...controlProps} /> : <input {...controlProps} type={type} />}
      {error && <span id={describedBy} className="qr-field-error" role="alert">{t(`studioQr.fieldErrors.${error}`)}</span>}
    </label>
  )
}

function LogoCropControl({ asset, crop, onChange, t }) {
  const canvasRef = useRef(null)
  const dragRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!context) return
    const source = computeSquareCrop(asset.bitmap, crop)
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.drawImage(
      asset.bitmap,
      source.sx,
      source.sy,
      source.sourceSize,
      source.sourceSize,
      0,
      0,
      canvas.width,
      canvas.height,
    )
  }, [asset, crop])

  const finishDrag = (event, restore = false) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    if (restore) onChange(drag.crop)
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    dragRef.current = null
    setDragging(false)
  }

  const handlePointerDown = (event) => {
    if (dragRef.current) return
    if (event.pointerType === 'mouse' && event.button !== 0) return
    event.preventDefault()
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      displaySize: Math.min(rect.width, rect.height),
      crop,
    }
    setDragging(true)
  }

  const handlePointerMove = (event) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    event.preventDefault()
    onChange(moveCropByPixels(asset.bitmap, drag.crop, {
      deltaX: event.clientX - drag.startX,
      deltaY: event.clientY - drag.startY,
      displaySize: drag.displaySize,
    }))
  }

  const handleKeyDown = (event) => {
    const movements = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    }
    const direction = movements[event.key]
    if (!direction) return
    event.preventDefault()
    const step = event.shiftKey ? 32 : 8
    onChange(moveCropByPixels(asset.bitmap, crop, {
      deltaX: direction[0] * step,
      deltaY: direction[1] * step,
      displaySize: canvasRef.current?.clientWidth || 320,
    }))
  }

  return (
    <div className="qr-crop-control">
      <div
        className="qr-crop-stage"
        role="group"
        tabIndex="0"
        aria-label={t('studioQr.cropControlLabel')}
        aria-describedby="qr-crop-hint"
        data-dragging={dragging ? 'true' : 'false'}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={event => finishDrag(event)}
        onPointerCancel={event => finishDrag(event, true)}
        onLostPointerCapture={(event) => {
          if (dragRef.current?.pointerId !== event.pointerId) return
          dragRef.current = null
          setDragging(false)
        }}
        onKeyDown={handleKeyDown}
      >
        <canvas ref={canvasRef} width="320" height="320" aria-hidden="true" />
        <span className="qr-crop-frame" aria-hidden="true" />
      </div>
      <div className="qr-crop-footer">
        <p id="qr-crop-hint" className="qr-helper">{t('studioQr.cropHint')}</p>
        <button
          type="button"
          className="qr-button qr-button-secondary"
          disabled={crop.x === 0 && crop.y === 0}
          onClick={() => onChange({ ...crop, x: 0, y: 0 })}
        >
          {t('studioQr.cropCenter')}
        </button>
      </div>
    </div>
  )
}

export default function QrDesignerPage({
  generateQr = generateQrBlob,
  readQr = readQrImage,
  initialMode = 'create',
  onModeChange,
  active = true,
}) {
  const { t } = useI18n()
  const requestedMode = normalizeMode(initialMode)
  const [localMode, setLocalMode] = useState(requestedMode)
  const mode = onModeChange ? requestedMode : localMode
  const [activeTab, setActiveTab] = useState('content')
  const [settings, setSettings] = useState(DEFAULTS)
  const [contentFields, setContentFields] = useState(CONTENT_DEFAULTS)
  const [touchedFields, setTouchedFields] = useState({})
  const [logoAsset, setLogoAsset] = useState(null)
  const logoRef = useRef(null)
  const logoRequestRef = useRef(0)
  const [logoError, setLogoError] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [previewState, setPreviewState] = useState('idle')
  const [exporting, setExporting] = useState(null)
  const [exportError, setExportError] = useState(null)
  const previewRef = useRef(null)
  const exportGenerationRef = useRef(0)
  const mountedRef = useRef(false)
  const [readerState, setReaderState] = useState({ status: 'idle', value: '', error: null, generation: 0 })
  const readerAbortRef = useRef(null)
  const readerGenerationRef = useRef(0)

  const level = logoAsset ? 'H' : 'Q'
  const payload = useMemo(
    () => buildQrPayload(settings.contentType, contentFields),
    [settings.contentType, contentFields],
  )
  const analysis = useMemo(() => analyseQrPayload(payload.data, level), [payload.data, level])
  const nearCapacity = analysis.ok && analysis.bytes >= analysis.capacity * 0.8
  const lowContrast = useMemo(
    () => contrastRatio(settings.foreground, settings.background) < 4.5,
    [settings.foreground, settings.background],
  )
  const request = useMemo(
    () => ({ ...settings, data: payload.data, logoAsset, analysis }),
    [settings, payload.data, logoAsset, analysis],
  )

  useEffect(() => {
    const preview = createLatestPreview({
      generate: nextRequest => generateQr(nextRequest, 'svg'),
      createUrl: blob => URL.createObjectURL(blob),
      revokeUrl: url => URL.revokeObjectURL(url),
      onReady: (url) => {
        setPreviewUrl(url)
        setPreviewState('ready')
      },
      onError: () => setPreviewState('error'),
      onPending: () => setPreviewState('updating'),
      onClear: () => {
        setPreviewUrl(null)
        setPreviewState('idle')
      },
    })
    previewRef.current = preview
    return () => {
      preview.dispose()
      previewRef.current = null
    }
  }, [generateQr])

  useEffect(() => {
    if (!analysis.ok) {
      previewRef.current?.clear()
      return
    }
    previewRef.current?.update(request)
  }, [analysis, request])

  useEffect(() => () => {
    logoRequestRef.current += 1
    logoRef.current?.bitmap.close?.()
  }, [])

  useEffect(() => () => {
    readerGenerationRef.current += 1
    readerAbortRef.current?.abort()
  }, [])

  useEffect(() => {
    if (active) return
    readerGenerationRef.current += 1
    readerAbortRef.current?.abort()
    readerAbortRef.current = null
  }, [active])

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      exportGenerationRef.current += 1
    }
  }, [])

  const updateSetting = (key, value) => setSettings(current => ({ ...current, [key]: value }))
  const updateContent = (key, value) => {
    setContentFields(current => ({ ...current, [key]: value }))
    setTouchedFields(current => ({ ...current, [key]: true }))
  }
  const fieldError = key => touchedFields[key] ? payload.fieldErrors[key] : null
  const updateCrop = (key, value) => setSettings(current => ({
    ...current,
    crop: { ...current.crop, [key]: value },
  }))

  const installLogo = (nextLogo) => {
    logoRef.current?.bitmap.close?.()
    logoRef.current = nextLogo
    setLogoAsset(nextLogo)
  }

  const handleLogo = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const requestId = ++logoRequestRef.current
    setLogoError(null)
    try {
      const nextLogo = await loadLogoAsset(file)
      if (requestId !== logoRequestRef.current) {
        nextLogo.bitmap.close?.()
        return
      }
      installLogo(nextLogo)
    } catch (error) {
      if (requestId !== logoRequestRef.current) return
      const key = error?.code === 'too_large'
        ? 'largeLogo'
        : error?.code === 'unsupported_browser'
          ? 'unsupportedLogo'
          : 'invalidLogo'
      setLogoError(t(`studioQr.${key}`))
      event.target.value = ''
    }
  }

  const removeLogo = () => {
    logoRequestRef.current += 1
    installLogo(null)
    setLogoError(null)
    setSettings(current => ({ ...current, crop: DEFAULTS.crop, logoSize: DEFAULTS.logoSize, logoSpacing: DEFAULTS.logoSpacing }))
  }

  const reset = () => {
    exportGenerationRef.current += 1
    removeLogo()
    setSettings(DEFAULTS)
    setContentFields(CONTENT_DEFAULTS)
    setTouchedFields({})
    setActiveTab('content')
    setExporting(null)
    setExportError(null)
  }

  const cancelRead = (clear = false) => {
    const generation = ++readerGenerationRef.current
    readerAbortRef.current?.abort()
    readerAbortRef.current = null
    setReaderState(current => clear || current.status === 'reading'
      ? { status: 'idle', value: '', error: null, generation }
      : current)
  }

  const selectMode = (nextMode) => {
    const next = normalizeMode(nextMode)
    if (next === mode) return
    if (mode === 'read') cancelRead()
    if (onModeChange) onModeChange(next)
    else setLocalMode(next)
  }

  const handleReaderFile = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    cancelRead(true)
    const generation = ++readerGenerationRef.current
    const controller = new AbortController()
    readerAbortRef.current = controller
    setReaderState({ status: 'reading', value: '', error: null, generation })
    try {
      const value = await readQr(file, { signal: controller.signal })
      if (generation !== readerGenerationRef.current || controller.signal.aborted) return
      setReaderState({ status: 'success', value, error: null, generation })
    } catch (error) {
      if (error?.code === 'cancelled') {
        const cancelledGeneration = readerGenerationRef.current
        setReaderState(current => current.status === 'reading' && current.generation === generation
          ? { status: 'idle', value: '', error: null, generation: cancelledGeneration }
          : current)
        return
      }
      if (generation !== readerGenerationRef.current) return
      setReaderState({ status: 'error', value: '', error: error?.code || 'decode_failed', generation })
    } finally {
      if (generation === readerGenerationRef.current) readerAbortRef.current = null
    }
  }

  const copyReaderResult = async () => {
    try {
      await navigator.clipboard.writeText(readerState.value)
      setReaderState(current => ({ ...current, status: 'copied' }))
    } catch {
      setReaderState(current => ({ ...current, error: 'copy_failed' }))
    }
  }

  const exportQr = async (extension) => {
    if (!analysis.ok || exporting) return
    const generation = ++exportGenerationRef.current
    setExporting(extension)
    setExportError(null)
    try {
      const blob = await generateQr(request, extension)
      if (!mountedRef.current || generation !== exportGenerationRef.current) return
      downloadQrBlob(blob, `folkkit-qr.${extension}`)
    } catch {
      if (mountedRef.current && generation === exportGenerationRef.current) setExportError(t('studioQr.downloadError'))
    } finally {
      if (mountedRef.current && generation === exportGenerationRef.current) setExporting(null)
    }
  }

  const handleTabKeyDown = (event, tab) => {
    const currentIndex = tabs.findIndex(([name]) => name === tab)
    let nextIndex = null
    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabs.length
    if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + tabs.length) % tabs.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = tabs.length - 1
    if (nextIndex === null) return
    event.preventDefault()
    const nextTab = tabs[nextIndex][0]
    setActiveTab(nextTab)
    document.getElementById(`qr-tab-${nextTab}`)?.focus()
  }

  const renderTab = (tab) => {
    if (tab === 'content') {
      return (
        <div className="qr-control-stack">
          <fieldset className="qr-fieldset">
            <legend>{t('studioQr.contentType')}</legend>
            <div className="qr-segmented qr-segmented--types">
              {CONTENT_TYPES.map(([type, labelKey]) => (
                <label key={type}>
                  <input
                    type="radio"
                    name="qr-content-type"
                    value={type}
                    checked={settings.contentType === type}
                    onChange={() => {
                      updateSetting('contentType', type)
                      setTouchedFields({})
                    }}
                  />
                  <span>{t(`studioQr.${labelKey}`)}</span>
                </label>
              ))}
            </div>
          </fieldset>
          {['text', 'url'].includes(settings.contentType) && (
            <ContentField
              id="qr-content"
              label={t('studioQr.contentLabel')}
              value={contentFields.text}
              inputMode={settings.contentType === 'url' ? 'url' : 'text'}
              placeholder={t(`studioQr.${settings.contentType === 'url' ? 'urlPlaceholder' : 'textPlaceholder'}`)}
              multiline
              error={fieldError('text')}
              onChange={value => updateContent('text', value)}
              t={t}
            />
          )}
          {settings.contentType === 'wifi' && (
            <>
              <ContentField id="qr-wifi-name" label={t('studioQr.wifiName')} value={contentFields.wifiName} error={fieldError('wifiName')} onChange={value => updateContent('wifiName', value)} t={t} />
              <label className="qr-field" htmlFor="qr-wifi-encryption">
                <span>{t('studioQr.wifiEncryption')}</span>
                <span className="qr-select-wrap">
                  <select id="qr-wifi-encryption" name="qr-wifi-encryption" value={contentFields.wifiEncryption} onChange={event => updateContent('wifiEncryption', event.target.value)}>
                    <option value="WPA">WPA/WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">{t('studioQr.wifiOpen')}</option>
                  </select>
                  <svg viewBox="0 0 8 5" width="8" height="5" aria-hidden="true"><path d="M.5.5 4 4 7.5.5" /></svg>
                </span>
              </label>
              {contentFields.wifiEncryption !== 'nopass' && <ContentField id="qr-wifi-password" label={t('studioQr.wifiPassword')} value={contentFields.wifiPassword} error={fieldError('wifiPassword')} onChange={value => updateContent('wifiPassword', value)} t={t} type="password" />}
              <label className="qr-check"><input type="checkbox" checked={contentFields.wifiHidden} onChange={event => updateContent('wifiHidden', event.target.checked)} /> <span>{t('studioQr.wifiHidden')}</span></label>
            </>
          )}
          {settings.contentType === 'vcard' && (
            <>
              <ContentField id="qr-contact-name" label={t('studioQr.contactName')} value={contentFields.contactName} error={fieldError('contactName')} onChange={value => updateContent('contactName', value)} t={t} />
              <ContentField id="qr-contact-organization" label={t('studioQr.contactOrganization')} value={contentFields.contactOrganization} multiline onChange={value => updateContent('contactOrganization', value)} t={t} />
              <ContentField id="qr-contact-phone" label={t('studioQr.phone')} value={contentFields.contactPhone} inputMode="tel" onChange={value => updateContent('contactPhone', value)} t={t} />
              <ContentField id="qr-contact-email" label={t('studioQr.emailAddress')} value={contentFields.contactEmail} inputMode="email" error={fieldError('contactEmail')} onChange={value => updateContent('contactEmail', value)} t={t} />
              <ContentField id="qr-contact-website" label={t('studioQr.website')} value={contentFields.contactWebsite} inputMode="url" error={fieldError('contactWebsite')} onChange={value => updateContent('contactWebsite', value)} t={t} />
            </>
          )}
          {settings.contentType === 'email' && (
            <>
              <ContentField id="qr-email-to" label={t('studioQr.emailTo')} value={contentFields.emailTo} inputMode="email" error={fieldError('emailTo')} onChange={value => updateContent('emailTo', value)} t={t} />
              <ContentField id="qr-email-subject" label={t('studioQr.emailSubject')} value={contentFields.emailSubject} onChange={value => updateContent('emailSubject', value)} t={t} />
              <ContentField id="qr-email-body" label={t('studioQr.message')} value={contentFields.emailBody} multiline onChange={value => updateContent('emailBody', value)} t={t} />
            </>
          )}
          {settings.contentType === 'sms' && (
            <>
              <ContentField id="qr-sms-phone" label={t('studioQr.phone')} value={contentFields.smsPhone} inputMode="tel" error={fieldError('smsPhone')} onChange={value => updateContent('smsPhone', value)} t={t} />
              <ContentField id="qr-sms-message" label={t('studioQr.message')} value={contentFields.smsMessage} multiline onChange={value => updateContent('smsMessage', value)} t={t} />
            </>
          )}
          {nearCapacity && <p id="qr-content-status" className="qr-warning" role="status">{t('studioQr.capacityRemaining', { remaining: analysis.capacity - analysis.bytes })}</p>}
        </div>
      )
    }

    if (tab === 'design') {
      return (
        <div className="qr-control-stack">
          <div className="qr-colour-grid">
            <div className="qr-colour">
              <label className="qr-field" htmlFor="qr-foreground">
                <span className="qr-field-heading"><span>{t('studioQr.foreground')}</span><span className="qr-field-value" aria-hidden="true">{settings.foreground}</span></span>
                <input id="qr-foreground" name="qr-foreground" type="color" aria-label={t('studioQr.foreground')} value={settings.foreground} onInput={event => updateSetting('foreground', event.target.value)} />
              </label>
              <ColourPresets kind="foreground" selected={settings.foreground} onSelect={value => updateSetting('foreground', value)} t={t} />
            </div>
            <div className="qr-colour">
              <label className="qr-field" htmlFor="qr-background">
                <span className="qr-field-heading"><span>{t('studioQr.background')}</span><span className="qr-field-value" aria-hidden="true">{settings.background}</span></span>
                <input id="qr-background" name="qr-background" type="color" aria-label={t('studioQr.background')} value={settings.background} onInput={event => updateSetting('background', event.target.value)} />
              </label>
              <ColourPresets kind="background" selected={settings.background} onSelect={value => updateSetting('background', value)} t={t} />
            </div>
          </div>
          {lowContrast && <p className="qr-warning" role="status">{t('studioQr.contrastWarning')}</p>}
          <div className="qr-style-grid">
            <SelectControl
              id="qr-dot-style"
              label={t('studioQr.moduleStyle')}
              value={settings.dotStyle}
              options={styleOptions.dots}
              t={t}
              onChange={(event) => {
                const dotStyle = event.target.value
                setSettings(current => ({
                  ...current,
                  dotStyle,
                }))
              }}
            />
            <SelectControl id="qr-corner-square" label={t('studioQr.cornerFrameStyle')} value={settings.cornerSquareStyle} options={styleOptions.cornerSquares} t={t} onChange={event => updateSetting('cornerSquareStyle', event.target.value)} />
            <SelectControl id="qr-corner-dot" label={t('studioQr.cornerDotStyle')} value={settings.cornerDotStyle} options={styleOptions.cornerDots} t={t} onChange={event => updateSetting('cornerDotStyle', event.target.value)} />
          </div>
          <RangeControl id="qr-size" label={t('studioQr.size')} value={settings.size} minimum={256} maximum={1024} step={64} output={t('studioQr.sizeValue', { value: settings.size })} onChange={event => updateSetting('size', Number(event.target.value))} />
          <RangeControl id="qr-quiet-zone" label={t('studioQr.quietZone')} value={settings.quietZone} minimum={4} maximum={12} output={t('studioQr.quietZoneValue', { value: settings.quietZone })} onChange={event => updateSetting('quietZone', Number(event.target.value))} />
          <p className="qr-helper">{t('studioQr.quietZoneHint')}</p>
        </div>
      )
    }

    return (
      <div className="qr-control-stack">
        <label className="qr-file-field" htmlFor="qr-logo">
          <span>{t('studioQr.logoInput')}</span>
          <input id="qr-logo" name="qr-logo" type="file" accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp" onChange={handleLogo} />
        </label>
        <p className="qr-helper">{t('studioQr.logoAcceptHint')}</p>
        {logoError && <p className="qr-error" role="alert">{logoError}</p>}
        {logoAsset && (
          <>
            <div className="qr-logo-summary">
              <span>{t('studioQr.logoSelected', { name: logoAsset.name })}</span>
              <button type="button" className="qr-button qr-button-ghost" onClick={removeLogo}>{t('studioQr.logoRemove')}</button>
            </div>
            <RangeControl id="qr-logo-size" label={t('studioQr.logoSize')} value={settings.logoSize} minimum={12} maximum={24} output={t('studioQr.logoSizeValue', { value: settings.logoSize })} onChange={event => updateSetting('logoSize', Number(event.target.value))} />
            <RangeControl id="qr-logo-spacing" label={t('studioQr.logoSpacing')} value={settings.logoSpacing} minimum={0} maximum={12} output={t('studioQr.logoSpacingValue', { value: settings.logoSpacing })} onChange={event => updateSetting('logoSpacing', Number(event.target.value))} />
            <RangeControl id="qr-crop-zoom" label={t('studioQr.cropZoom')} value={settings.crop.zoom} minimum={1} maximum={3} step={0.1} output={`${settings.crop.zoom.toFixed(1)}×`} onChange={event => updateCrop('zoom', Number(event.target.value))} />
            <LogoCropControl asset={logoAsset} crop={settings.crop} onChange={crop => setSettings(current => ({ ...current, crop }))} t={t} />
            <p className="qr-helper">{t('studioQr.logoSafety')}</p>
          </>
        )}
      </div>
    )
  }

  const invalidMessage = analysis.reason === 'capacity' ? t('studioQr.capacityError') : null
  const readerLink = readerState.value ? safeHttpUrl(readerState.value) : null
  const readerIsRunning = readerState.status === 'reading'

  return (
    <section className="studio-page qr-designer" aria-labelledby="qr-designer-title" hidden={!active}>
      <nav className="qr-modes" aria-label={t('studioQr.modeLabel')}>
        <button type="button" aria-pressed={mode === 'create'} onClick={() => selectMode('create')}>{t('studioQr.modeCreate')}</button>
        <button type="button" aria-pressed={mode === 'read'} onClick={() => selectMode('read')}>{t('studioQr.modeRead')}</button>
      </nav>
      <header className="qr-page-heading">
        <h1 id="qr-designer-title">{t(`studioQr.${mode === 'read' ? 'readerTitle' : 'title'}`)}</h1>
        <p>{t(`studioQr.${mode === 'read' ? 'readerIntro' : 'intro'}`)}</p>
      </header>

      {mode === 'read' ? (
        <section className="qr-reader" aria-label={t('studioQr.readerTitle')}>
          <label className="qr-file-field" htmlFor="qr-reader-file">
            <span>{t('studioQr.readerInput')}</span>
            <input
              id="qr-reader-file"
              name="qr-reader-file"
              type="file"
              accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp"
              disabled={readerIsRunning}
              onChange={handleReaderFile}
            />
          </label>
          <p className="qr-helper">{t('studioQr.readerHint')}</p>
          {readerIsRunning && (
            <div className="qr-reader-progress">
              <progress aria-label={t('studioQr.readerProgress')} />
              <p role="status">{t('studioQr.readerProgress')}</p>
              <button type="button" className="qr-button qr-button-secondary" onClick={() => cancelRead()}>{t('studioQr.readerCancel')}</button>
            </div>
          )}
          {readerState.error && <p className="qr-error" role="alert">{t(`studioQr.readerErrors.${readerState.error}`)}</p>}
          {readerState.value && (
            <div className="qr-reader-result">
              <h2>{t('studioQr.readerResult')}</h2>
              <pre tabIndex="0">{readerState.value}</pre>
              <div className="qr-reader-actions">
                <button type="button" className="qr-button qr-button-primary" onClick={copyReaderResult}>{t('studioQr.readerCopy')}</button>
                {readerLink && <a className="qr-button qr-button-secondary" href={readerLink} target="_blank" rel="noreferrer">{t('studioQr.readerOpenLink')}</a>}
                <button type="button" className="qr-button qr-button-ghost" onClick={() => cancelRead(true)}>{t('studioQr.readerReset')}</button>
              </div>
              {readerState.status === 'copied' && <p className="qr-preview-status" role="status">{t('studioQr.readerCopied')}</p>}
            </div>
          )}
        </section>
      ) : <div className="qr-workspace">
        <section className="qr-editor" aria-label={t('studioQr.tabsLabel')}>
          <div className="qr-tabs" role="tablist" aria-label={t('studioQr.tabsLabel')}>
            {tabs.map(([tab, key]) => (
              <button
                key={tab}
                id={`qr-tab-${tab}`}
                type="button"
                role="tab"
                aria-selected={activeTab === tab}
                aria-controls={`qr-panel-${tab}`}
                tabIndex={activeTab === tab ? 0 : -1}
                onClick={() => setActiveTab(tab)}
                onKeyDown={event => handleTabKeyDown(event, tab)}
              >
                {t(`studioQr.${key}`)}
              </button>
            ))}
          </div>
          <div id={`qr-panel-${activeTab}`} role="tabpanel" aria-labelledby={`qr-tab-${activeTab}`} tabIndex={0} className="qr-tab-panel">
            {renderTab(activeTab)}
          </div>
          {invalidMessage && <p className="qr-error" role="alert">{invalidMessage}</p>}
        </section>

        <section className="qr-preview-panel" aria-labelledby="qr-preview-title">
          <div className="qr-preview-heading">
            <h2 id="qr-preview-title">{t('studioQr.previewTitle')}</h2>
          </div>
          <div className="qr-preview-frame" aria-busy={previewState === 'updating'}>
            {previewUrl && <img src={previewUrl} alt={t('studioQr.previewAlt')} width="420" height="420" />}
            {!previewUrl && <div className="qr-preview-placeholder" aria-hidden="true" />}
          </div>
          <p className={previewState === 'error' ? 'qr-error' : 'qr-preview-status'} aria-live="polite">
            {previewState === 'updating' ? t('studioQr.previewUpdating') : previewState === 'error' ? t('studioQr.previewError') : ''}
          </p>
          {exportError && <p className="qr-error" role="alert">{exportError}</p>}
          {exporting && <p className="qr-preview-status" role="status">{t('studioQr.downloading')}</p>}
          <div className="qr-actions">
            <button type="button" className="qr-button qr-button-primary" disabled={!analysis.ok || Boolean(exporting)} onClick={() => exportQr('png')}>{t('studioQr.downloadPng')}</button>
            <button type="button" className="qr-button qr-button-secondary" disabled={!analysis.ok || Boolean(exporting)} onClick={() => exportQr('svg')}>{t('studioQr.downloadSvg')}</button>
            <button type="button" className="qr-button qr-button-ghost" onClick={reset}>{t('studioQr.reset')}</button>
          </div>
        </section>
      </div>}
    </section>
  )
}
