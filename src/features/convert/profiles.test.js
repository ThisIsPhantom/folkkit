// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { FILE_PROFILES, getProfile, buildMediaArgs, validateMediaProbe, parsePageSelection, resolvePdfScale, assertArchiveBudget } from './profiles.js'
import { detectFile } from './detection.js'

describe('file conversion contracts', () => {
  it('preflights the complete archive budget without reading any file content', () => {
    const entry = { blob: { size: 64 * 1024 * 1024, arrayBuffer() { throw new Error('content must not be read during preflight') } } }
    expect(assertArchiveBudget([entry, entry])).toBe(128 * 1024 * 1024)
    expect(() => assertArchiveBudget([entry, entry, { blob: { size: 1 } }])).toThrow('resource_limit')
    expect(() => assertArchiveBudget([])).toThrow('invalid_file')
  })
  it('uses the verified bounded Opus complexity and limits input before GIF palette work', () => {
    const webm = buildMediaArgs(getProfile('mp4', 'webm'), 'a', 'b')
    expect(webm).toContain('-compression_level:a')
    expect(webm[webm.indexOf('-compression_level:a') + 1]).toBe('0')
    const gif = buildMediaArgs(getProfile('mov', 'gif'), 'a', 'b', { start: 1, duration: 2 })
    expect(gif.indexOf('-ss')).toBeLessThan(gif.indexOf('-i'))
  })
  it('applies validated audio, resolution and intentional clip controls to actual encoder arguments', () => {
    expect(buildMediaArgs(getProfile('wav', 'mp3'), 'a', 'b', { bitrate: 320 })).toContain('320k')
    expect(buildMediaArgs(getProfile('wav', 'flac'), 'a', 'b', { flacLevel: 8 })).toContain('8')
    expect(buildMediaArgs(getProfile('wav', 'ogg'), 'a', 'b', { vorbisQuality: 8 })).toContain('8')
    const args = buildMediaArgs(getProfile('mov', 'mp4'), 'a', 'b', { resolution: 480, trim: true, start: 2, duration: 3 })
    expect(args[args.indexOf('-vf') + 1]).toContain('min(480,ih)')
    expect(args[args.indexOf('-ss') + 1]).toBe('2')
    expect(args[args.indexOf('-t') + 1]).toBe('3')
    expect(() => buildMediaArgs(getProfile('wav', 'mp3'), 'a', 'b', { bitrate: 999 })).toThrow('invalid_settings')
    expect(() => buildMediaArgs(getProfile('mov', 'mp4'), 'a', 'b', { resolution: 9000 })).toThrow('invalid_settings')
    expect(resolvePdfScale(300)).toBe(300 / 72)
    expect(() => resolvePdfScale(10000)).toThrow('invalid_settings')
  })
  it('has exactly the 33 approved directed pairs and cannot execute missing pairs', () => {
    expect(FILE_PROFILES).toHaveLength(33)
    expect(new Set(FILE_PROFILES.map(p => p.id)).size).toBe(33)
    expect(() => getProfile('pdf', 'mp4')).toThrow('unsupported_pair')
    expect(() => getProfile('mov', 'mov')).toThrow('unsupported_pair')
  })
  it('pins actual audio/video encoders and bounds every media output', () => {
    for (const profile of FILE_PROFILES.filter(p => p.engine === 'media')) {
      const args = buildMediaArgs(profile, 'source', 'result', { start: 0, duration: 2 })
      expect(args).toContain('-fs')
      expect(args).toContain('-t')
      expect(args).toContain('-f')
      expect(args.at(-1)).toBe('result')
      expect(args).not.toContain('copy')
    }
    expect(buildMediaArgs(getProfile('wav', 'mp3'), 'a', 'b')).toContain('libmp3lame')
    expect(buildMediaArgs(getProfile('mp4', 'webm'), 'a', 'b')).toContain('libvpx')
    expect(buildMediaArgs(getProfile('mov', 'gif'), 'a', 'b', { start: 2, duration: 4 }).join(' ')).toContain('palettegen')
    expect(() => buildMediaArgs(getProfile('mov', 'gif'), 'a', 'b')).toThrow('invalid_clip')
    expect(() => buildMediaArgs(getProfile('mov', 'gif'), 'a', 'b', { start: 0, duration: 31 })).toThrow('invalid_clip')
  })
  it('checks real stream codecs, finite duration, dimensions and audio existence', () => {
    const probe = { duration: 2, streams: [{ type: 'video', codec: 'h264', width: 320, height: 240 }, { type: 'audio', codec: 'aac' }] }
    expect(validateMediaProbe('mov', 'mp4', probe)).toEqual(probe)
    expect(() => validateMediaProbe('mov', 'mp4', { ...probe, streams: [{ type: 'video', codec: 'hevc', width: 320, height: 240 }] })).toThrow('unsupported_codec')
    expect(() => validateMediaProbe('mp4', 'mp3', { ...probe, streams: probe.streams.slice(0, 1) })).toThrow('no_audio')
    expect(() => validateMediaProbe('mov', 'mp4', { ...probe, duration: Infinity })).toThrow('resource_limit')
  })
  it('preserves ordered unique page selection and rejects malformed/out of range input', () => {
    expect(parsePageSelection('3,1-2,3', 4)).toEqual([2, 0, 1])
    expect(parsePageSelection('', 3)).toEqual([0, 1, 2])
    for (const input of ['0', '5', '2-1', '1,no', '1,']) expect(() => parsePageSelection(input, 4)).toThrow('invalid_pages')
    expect(() => parsePageSelection('', 101)).toThrow('resource_limit')
  })
  it('detects signatures and rejects conflicting extension/MIME metadata', async () => {
    const bytes = Uint8Array.of(137,80,78,71,13,10,26,10,0,0,0,0)
    expect(await detectFile(new File([bytes], 'test.png', { type: 'image/png' }))).toBe('png')
    expect(await detectFile(new File([bytes], 'test', { type: '' }))).toBe('png')
    await expect(detectFile(new File([bytes], 'test.jpg'))).rejects.toThrow('type_mismatch')
    await expect(detectFile(new File([bytes], 'test.png', { type: 'application/pdf' }))).rejects.toThrow('type_mismatch')
    await expect(detectFile(new File(['bad'], 'test.png'))).rejects.toThrow('unsupported_type')
  })
})
