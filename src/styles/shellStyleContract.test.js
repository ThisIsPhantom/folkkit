import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, test } from 'vitest'

const shellCss = readFileSync(resolve('src/components/shell/shell.css'), 'utf8')
const pagesCss = readFileSync(resolve('src/pages/pages.css'), 'utf8')
const globalCss = readFileSync(resolve('src/styles/global.css'), 'utf8')

describe('shell style contract', () => {
  test('uses only body and shared emphasis weights', () => {
    const weights = [...`${shellCss}\n${pagesCss}`.matchAll(/font-weight:\s*(\d+)/g)]
      .map((match) => Number(match[1]))

    expect([...new Set(weights)].sort()).toEqual([400, 600])
  })

  test('turns native smooth scrolling off for reduced motion', () => {
    const reducedMotionBlock = globalCss.match(/@media \(prefers-reduced-motion: reduce\) \{([\s\S]*)\}\s*$/)?.[1]

    expect(reducedMotionBlock).toContain('scroll-behavior: auto')
  })
})
