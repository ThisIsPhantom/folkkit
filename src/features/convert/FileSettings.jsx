import { useI18n } from '../../i18n/index.js'
import { IMAGE_FORMATS, VIDEO_FORMATS } from './profiles.js'

function Choice({ label, value, options, disabled, onChange }) {
  return <label>{label}<select value={value} disabled={disabled} onChange={event => onChange(event.target.value)}>{options.map(([id, text]) => <option key={id} value={id}>{text}</option>)}</select></label>
}
export default function FileSettings({ item, disabled, onChange }) {
  const { t } = useI18n()
  const tr = key => t(`studioConvert.${key}`)
  const settings = item.settings
  const set = (key, value) => onChange({ ...settings, [key]: value })
  const number = (key, label, fallback, max, min = 1, step = 1) => <label>{tr(label)}<input type="number" min={min} max={max} step={step} value={settings[key] ?? fallback} disabled={disabled} onChange={event => set(key, event.target.value)} /></label>
  return <details className="converter-settings" open={item.target === 'gif'}><summary>{tr('settings')}</summary><div>
    {IMAGE_FORMATS.includes(item.from) && <>
      {number('width', 'width', '', 8192)}{number('height', 'height', '', 8192)}
      {['jpeg','webp'].includes(item.target) && number('quality', 'quality', item.target === 'jpeg' ? 92 : 90, 100, 10)}
      {item.target === 'pdf' && <>
        <Choice label={tr('pageSize')} value={settings.pageSize || 'original'} disabled={disabled} onChange={value => set('pageSize', value)} options={[['original',tr('original')],['a4','A4'],['letter','Letter']]} />
        {settings.pageSize && settings.pageSize !== 'original' && <Choice label={tr('orientation')} value={settings.orientation || 'portrait'} disabled={disabled} onChange={value => set('orientation', value)} options={[['portrait',tr('portrait')],['landscape',tr('landscape')]]} />}
      </>}
      <p>{tr('imageHint')}</p>
    </>}
    {item.from === 'pdf' && <>
      <label>{tr('pages')}<input value={settings.pages || ''} placeholder="1-3,5" disabled={disabled} onChange={event => set('pages', event.target.value)} /></label>
      <Choice label={tr('dpi')} value={settings.dpi || 144} disabled={disabled} onChange={value => set('dpi', value)} options={[72,144,300].map(value => [value,`${value} dpi`])} />
      <p>{tr('pagesHint')}</p>
    </>}
    {item.target === 'mp3' && <Choice label={tr('bitrate')} value={settings.bitrate || 192} disabled={disabled} onChange={value => set('bitrate', value)} options={[128,192,256,320].map(value => [value,`${value} kbit/s`])} />}
    {item.target === 'flac' && <Choice label={tr('flacLevel')} value={settings.flacLevel ?? 5} disabled={disabled} onChange={value => set('flacLevel', value)} options={[0,1,2,3,4,5,6,7,8].map(value => [value,String(value)])} />}
    {item.target === 'ogg' && <Choice label={tr('vorbisQuality')} value={settings.vorbisQuality || 5} disabled={disabled} onChange={value => set('vorbisQuality', value)} options={[2,5,8].map(value => [value,String(value)])} />}
    {item.target === 'wav' && <p>{tr('wavHint')}</p>}
    {VIDEO_FORMATS.includes(item.from) && <>
      {['mp4','webm'].includes(item.target) && <Choice label={tr('resolution')} value={settings.resolution || 1080} disabled={disabled} onChange={value => set('resolution', value)} options={[1080,720,480].map(value => [value,`${value}p`])} />}
      {item.target !== 'gif' && <label className="converter-inline"><input type="checkbox" checked={settings.trim || false} disabled={disabled} onChange={event => onChange({ ...settings, trim: event.target.checked, start: settings.start ?? 0, duration: settings.duration ?? 1 })} />{tr('trim')}</label>}
      {(item.target === 'gif' || settings.trim) && <>{number('start', 'clipStart', 0, 7200, 0, 0.1)}{number('duration', 'clipDuration', item.target === 'gif' ? 5 : 1, item.target === 'gif' ? 30 : 7200, 0.1, 0.1)}</>}
      <p>{tr(item.target === 'gif' ? 'clipHint' : 'videoHint')}</p>
    </>}
  </div></details>
}
