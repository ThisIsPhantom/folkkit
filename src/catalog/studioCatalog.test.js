import {expect,test} from 'vitest'
import {getStudioTools} from './studioCatalog.js'
import {getReleasedTools} from './releaseCatalog.js'
import {toolStudioHref,resolveAppRoute} from '../routing/studioRoutes.js'
import de from '../i18n/messages.de.js'
import en from '../i18n/messages.en.js'

test.each([['de',de],['en',en]])('studio entries have real %s labels, unique IDs and working studio destinations', (locale,messages)=>{
  const t=key=>key.split('.').reduce((value,part)=>value?.[part],messages)
  const entries=getStudioTools(t)
  const inherited=new Set(getReleasedTools(locale).map(tool=>tool.id))
  expect(entries.length).toBe(5)
  expect(new Set(entries.map(tool=>tool.id)).size).toBe(entries.length)
  for(const tool of entries){
    expect(inherited.has(tool.id)).toBe(false)
    expect(tool.name).toEqual(expect.any(String))
    expect(tool.description).toEqual(expect.any(String))
    expect(tool.name).not.toMatch(/^catalog\./)
    expect(tool.name.length).toBeGreaterThan(2)
    const url=new URL(toolStudioHref(tool.id),'https://folkkit.test')
    expect(['qr','convert','image','audio']).toContain(resolveAppRoute(url))
  }
})
