// @vitest-environment node
import { expect, it } from 'vitest'
import * as optimization from './imageOptimization.js'

it('keeps the original only when an unchanged re-encode is not smaller', () => {
  expect(optimization.selectOptimizedBlob).toBeTypeOf('function')
  const original = new Blob(['original'])
  const larger = new Blob(['encoded result'])
  const smaller = new Blob(['small'])
  expect(optimization.selectOptimizedBlob(original,larger,{ width:96,height:64 },{ width:96,height:64 })).toEqual({ blob:original,keptOriginal:true })
  expect(optimization.selectOptimizedBlob(original,smaller,{ width:96,height:64 },{ width:96,height:64 })).toEqual({ blob:smaller,keptOriginal:false })
  expect(optimization.selectOptimizedBlob(original,larger,{ width:96,height:64 },{ width:48,height:32 })).toEqual({ blob:larger,keptOriginal:false })
})

it('uses a clear output filename and preserves the original extension when retained', () => {
  expect(optimization.optimizationFilename('holiday.photo.JPG','jpeg',false)).toBe('holiday.photo-smaller.jpg')
  expect(optimization.optimizationFilename('holiday.photo.JPG','jpeg',true)).toBe('holiday.photo.JPG')
  expect(optimization.optimizationFilename('.png','png',false)).toBe('result-smaller.png')
})
