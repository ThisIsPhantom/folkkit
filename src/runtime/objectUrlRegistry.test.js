import { expect, test } from 'vitest'
import { createObjectUrlRegistry } from './objectUrlRegistry'

test('revokes replaced and remaining object URLs exactly once', () => {
  const revoked = []
  let nextId = 0
  const urlApi = {
    createObjectURL: () => `blob:folkkit-${++nextId}`,
    revokeObjectURL: (url) => revoked.push(url),
  }
  const registry = createObjectUrlRegistry(urlApi)

  const first = registry.create(new Blob(['first']))
  const second = registry.create(new Blob(['second']))
  registry.revoke(first)
  registry.revoke(first)
  registry.revokeAll()
  registry.revokeAll()

  expect(revoked).toEqual([first, second])
})
