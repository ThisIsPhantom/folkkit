import { describe, expect, test } from 'vitest'
import { readUrlState } from './urlState'

describe('readUrlState', () => {
  test('keeps format navigation while ignoring content-bearing query parameters', () => {
    expect(readUrlState('?from=text&to=base64&input=private%20text&output=cHJpdmF0ZQ%3D%3D', '')).toEqual({
      from: 'text',
      to: 'base64',
      toolId: null,
    })
  })

  test('reads a tool query without exposing content', () => {
    expect(readUrlState('?tool=qr-generator&input=private%20text', '')).toEqual({
      from: 'text',
      to: 'base64',
      toolId: 'qr-generator',
    })
  })

  test('supports the legacy tool hash without parsing content', () => {
    expect(readUrlState('?input=private%20text', '#tool/pdf-page-count')).toEqual({
      from: 'text',
      to: 'base64',
      toolId: 'pdf-page-count',
    })
  })

  test('falls back from a raw format that lacks independent release evidence', () => {
    expect(readUrlState('?from=petabytes&to=terabytes', '')).toEqual({
      from: 'text',
      to: 'base64',
      toolId: null,
    })
  })
})
