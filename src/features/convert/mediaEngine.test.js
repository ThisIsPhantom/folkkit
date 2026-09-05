// @vitest-environment node
import { expect, it } from 'vitest'
import { parseProbeLog } from './mediaEngine.js'
it('reads stream codecs and duration without returning payload-bearing log text', () => {
  expect(parseProbeLog([
    'Duration: 00:00:02.50, start: 0.000000, bitrate: 400 kb/s',
    'Stream #0:0[0x1](und): Video: h264 (High) (avc1 / 0x31637661), yuv420p, 320x240 [SAR 1:1 DAR 4:3], 12 fps',
    'Stream #0:1: Audio: aac (LC), 44100 Hz, stereo, fltp, 128 kb/s',
  ])).toEqual({ duration: 2.5, streams: [{ type: 'video', codec: 'h264', width: 320, height: 240, attached: false }, { type: 'audio', codec: 'aac' }] })
})
