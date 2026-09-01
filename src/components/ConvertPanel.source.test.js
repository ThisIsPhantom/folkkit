import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { expect, test } from 'vitest'

test('production output line preparation never splits the complete output string', async () => {
  const source = await readFile(resolve('src', 'components', 'ConvertPanel.jsx'), 'utf8')
  expect(source).not.toMatch(/\boutput\.split\(\s*['"]\\n['"]\s*\)/)
})
