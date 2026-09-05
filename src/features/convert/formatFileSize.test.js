// @vitest-environment node
import { expect, it } from 'vitest'
import * as fileSize from './formatFileSize.js'

it('formats small and large file sizes with suitable binary units', () => {
  expect(fileSize.formatFileSize).toBeTypeOf('function')
  expect(fileSize.formatFileSize(8,'en')).toBe('8 B')
  expect(fileSize.formatFileSize(1536,'en')).toBe('1.5 KiB')
  expect(fileSize.formatFileSize(2.5 * 1024 * 1024,'de')).toBe('2.5 MiB')
})
