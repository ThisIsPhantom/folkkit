import { expect, test } from 'vitest'
import { findSecretCandidates } from './scan-secrets.mjs'

test('static secret scan catches private keys and provider tokens without flagging documented placeholders', () => {
  const privateKeyMarker = ['-----BEGIN', 'PRIVATE KEY-----'].join(' ')
  expect(findSecretCandidates('fixture.txt', privateKeyMarker)).toHaveLength(1)
  expect(findSecretCandidates('fixture.txt', `token=${'ghp_' + 'a'.repeat(36)}`)).toHaveLength(1)
  expect(findSecretCandidates('.env.example', 'VITE_PUBLIC_CONTACT_EMAIL=required-before-public-release')).toEqual([])
})
