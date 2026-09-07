import { expect, test } from 'vitest'
import { readFileSync } from 'node:fs'
import { mp3DecodedTiming } from './audioMp3Timing.js'
import { parseWaveform, parseWaveformAnalysis } from './audioModel.js'

function taggedMp3() {
  // MPEG-2.5 Layer III, 8000 Hz mono, 32 kbit/s: 288 bytes and 576 samples per frame.
  // One Info frame plus 114 audio frames; 576 delay + 1088 padding = 64000 samples.
  const bytes = new Uint8Array(115 * 288)
  for (let offset = 0; offset < bytes.length; offset += 288) bytes.set([255, 227, 72, 192], offset)
  const view = new DataView(bytes.buffer)
  bytes.set(new TextEncoder().encode('Info'), 13)
  view.setUint32(17, 3); view.setUint32(21, 114); view.setUint32(25, bytes.length)
  bytes.set(new TextEncoder().encode('Lavc59.37'), 29)
  bytes.set([0x24, 0x04, 0x40], 50)
  return bytes
}
function waveform(count = 800) {
  return new TextEncoder().encode(Array.from({ length: count }, (_, i) => `frame:${i} pts:${i * 441} pts_time:${i / 100}\nlavfi.astats.Overall.Min_level=-0.5\nlavfi.astats.Overall.Max_level=0.5\nlavfi.astats.Overall.Number_of_samples=441.000000\n`).join(''))
}
test('verified MPEG-2.5 frame counts and encoder fields account for real 210ms padding', () => {
  const timing = mp3DecodedTiming(taggedMp3(), 8.21)
  expect(timing).toMatchObject({ duration: 8, sampleRate: 8000, encodedSamples: 65664, delay: 576, padding: 1088 })
  expect(timing.tolerance).toBeLessThan(.001)
  expect(parseWaveform(waveform(), 8.21, 441, timing)).toHaveLength(800)
  expect(parseWaveformAnalysis(waveform(), 8.21, 441, timing).duration).toBe(8)
})
test('codec padding cannot hide even one missing 10ms analysis window', () => {
  const timing = mp3DecodedTiming(taggedMp3(), 8.21)
  expect(() => parseWaveform(waveform(799), 8.21, 441, timing)).toThrow('resource_limit')
  expect(() => parseWaveformAnalysis(waveform(799), 8.21, 441, timing)).toThrow('resource_limit')
  const missingSamples = new TextDecoder().decode(waveform()).replace(/Number_of_samples=441.000000\n$/, 'Number_of_samples=1.000000\n')
  expect(() => parseWaveformAnalysis(new TextEncoder().encode(missingSamples), 8.21, 441, timing)).toThrow('resource_limit')
})
test('unverified, forged or truncated MP3 frame metadata cannot relax duration checks', () => {
  const bytes = taggedMp3()
  expect(mp3DecodedTiming(bytes.subarray(0, bytes.length - 1), 8.21)).toBeNull()
  const wrongCount = bytes.slice(); new DataView(wrongCount.buffer).setUint32(21, 120)
  expect(mp3DecodedTiming(wrongCount, 8.21)).toBeNull()
  const wrongRate = bytes.slice(); wrongRate[288 + 2] = 0x40
  expect(mp3DecodedTiming(wrongRate, 8.21)).toBeNull()
  const excessiveDelay = bytes.slice(); excessiveDelay.set([255,255,255],50)
  expect(mp3DecodedTiming(excessiveDelay, 8.21)).toBeNull()
  expect(mp3DecodedTiming(bytes, 9)).toBeNull()
  expect(mp3DecodedTiming(new Uint8Array(12), 8.21)).toBeNull()
  expect(() => parseWaveform(waveform(), 8.21, 441, null)).toThrow('resource_limit')
  expect(() => parseWaveformAnalysis(waveform(), 8.21, 441, null)).toThrow('resource_limit')
})

test('existing MPEG-1 fixture keeps its one-second decoded duration', () => {
  const bytes = new Uint8Array(readFileSync('tests/e2e/file-converter-fixtures/sample.mp3'))
  expect(mp3DecodedTiming(bytes)).toMatchObject({ sampleRate: 44100, duration: 1 })
})
