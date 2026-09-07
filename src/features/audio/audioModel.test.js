import { expect, test } from 'vitest'
import { createAudioState, editAudioState, createHistory, commitHistory, undoHistory, redoHistory, validateAudioProbe, parseWaveform, buildAudioArgs, validateAudioFile, parseWaveformAnalysis } from './audioModel.js'
test('selection clamps crossing bounds and fades to a real 50ms interval', () => {
 const state=createAudioState(10)
 expect(editAudioState(state,{start:11})).toMatchObject({start:9.95,end:10})
 expect(editAudioState(state,{end:-1})).toMatchObject({start:0,end:0.05})
 expect(editAudioState(state,{start:2,end:5,fadeIn:2,fadeOut:2})).toMatchObject({start:2,end:5,fadeIn:2,fadeOut:1})
 expect(()=>editAudioState(state,{start:NaN})).toThrow()
})
test('history retains 30 metadata changes and discards redo after branching',()=>{
 let h=createHistory(createAudioState(100))
 for(let i=1;i<40;i++) h=commitHistory(h,editAudioState(h.present,{start:i}))
 expect(h.past).toHaveLength(30)
 h=undoHistory(h);expect(h.present.start).toBe(38)
 expect(redoHistory(h).present.start).toBe(39)
 expect(commitHistory(h,editAudioState(h.present,{end:90})).future).toHaveLength(0)
})
test('input budgets and codec validation fail before processing',()=>{
 expect(()=>validateAudioFile({size:100*1024*1024+1})).toThrow('too_large')
 expect(()=>validateAudioProbe('wav',{duration:1800.01,streams:[{type:'audio',codec:'pcm_s16le'}]})).toThrow('resource_limit')
 expect(()=>validateAudioProbe('ogg',{duration:10,streams:[{type:'audio',codec:'opus'}]})).toThrow('unsupported_codec')
 expect(()=>createAudioState(0.049)).toThrow()
})
const wave='frame:0 pts:0 pts_time:0\nlavfi.astats.Overall.Min_level=-0.8\nlavfi.astats.Overall.Max_level=0.7\nframe:1 pts:22050 pts_time:0.5\nlavfi.astats.Overall.Min_level=-0.6\nlavfi.astats.Overall.Max_level=0.9\n'
test('waveform preserves extrema and rejects incomplete, nonfinite, oversized or truncated windows',()=>{
 expect(parseWaveform(new TextEncoder().encode(wave),1,22050)).toEqual([[-0.8,0.7],[-0.6,0.9]])
 for(const bad of [wave.replace('0.9','nan'),wave.split('frame:1')[0],wave.replace('Max_level=0.9','Missing=0.9'),'x'.repeat(524289)]) expect(()=>parseWaveform(new TextEncoder().encode(bad),1,22050)).toThrow()
})
test('export uses fixed format-specific encoders and selection-relative fades',()=>{
 const args=buildAudioArgs('wav','mp3',{start:2,end:5,fadeIn:0.2,fadeOut:0.3,bitrate:192},10)
 expect(args[args.indexOf('-af')+1]).toBe('atrim=start=2:end=5,asetpts=PTS-STARTPTS,afade=t=in:st=0:d=0.2,afade=t=out:st=2.7:d=0.3')
 expect(args).toContain('libmp3lame');expect(args).toContain('67108864')
 expect(()=>buildAudioArgs('wav','mp3',{start:0,end:2,bitrate:'192k;evil'},10)).toThrow()
 expect(()=>buildAudioArgs('wav','mp3',{start:0,end:20},10)).toThrow()
 for(const format of ['wav','mp3','flac','ogg']) expect(buildAudioArgs(format,format,{start:0,end:1},2)).toContain('audio-output.'+format)
})

test('moving the start cannot push an existing end boundary',()=>{expect(editAudioState({...createAudioState(10),end:5},{start:6})).toMatchObject({start:4.95,end:5})})

test('zero fades are omitted because FFmpeg duration zero falls back to sample count',()=>{const args=buildAudioArgs('wav','wav',{start:0,end:1},1);expect(args[args.indexOf('-af')+1]).toBe('atrim=start=0:end=1,asetpts=PTS-STARTPTS')})

test('waveform accepts bounded codec padding in container duration',()=>{
 const text=Array.from({length:100},(_,i)=>`frame:${i} pts:${i*441} pts_time:${i*.01}\nlavfi.astats.Overall.Min_level=-0.5\nlavfi.astats.Overall.Max_level=0.5\n`).join('')
 expect(parseWaveform(new TextEncoder().encode(text),1.04,441)).toHaveLength(100)
})

test('analysis derives the true decoded duration from complete sample windows',()=>{
 const text=Array.from({length:100},(_,i)=>`frame:${i} pts:${i*441} pts_time:${i*.01}\nlavfi.astats.Overall.Min_level=-0.5\nlavfi.astats.Overall.Max_level=0.5\nlavfi.astats.Overall.Number_of_samples=441.000000\n`).join('')
 expect(parseWaveformAnalysis(new TextEncoder().encode(text),1.04,441)).toMatchObject({duration:1})
 expect(()=>parseWaveformAnalysis(new TextEncoder().encode(text.replace('Number_of_samples=441.000000','Number_of_samples=nan')),1.04,441)).toThrow()
})

test('millisecond edits never round beyond the true fractional-sample duration',()=>{
 const state=createAudioState(1.0007),end=editAudioState(state,{end:2}),start=editAudioState(state,{start:2})
 expect(end.end).toBeLessThanOrEqual(state.duration);expect(start.end-start.start).toBeGreaterThanOrEqual(.05-1e-9)
 expect(()=>buildAudioArgs('wav','wav',start,state.duration)).not.toThrow()
})
