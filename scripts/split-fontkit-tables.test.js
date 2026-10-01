import {expect,test} from 'vitest'
import {readFile} from 'node:fs/promises'
import {parse} from 'acorn'
import {splitFontkitTables} from './split-fontkit-tables.mjs'

test('vendor split preserves every literal character table without remote assets',async()=>{
 const source=await readFile('node_modules/@pdf-lib/fontkit/dist/fontkit.es.js','utf8')
 const {code,tables}=splitFontkitTables(source)
 const exported=parse(tables,{ecmaVersion:'latest',sourceType:'module'}).body
 expect(exported).toHaveLength(6)
 const original=parse(source,{ecmaVersion:'latest',sourceType:'module'}).body
 for(const item of exported){const declaration=item.declaration,name=declaration.declarations[0].id.name;const before=original.find(n=>n.type==='VariableDeclaration'&&n.declarations[0].id.name===name);expect(tables.slice(declaration.start,declaration.end)).toBe(source.slice(before.start,before.end))}
 expect(code).toContain("from 'folkkit:fontkit-tables'")
 expect(code).not.toContain('https://github.com/ashtuchkin/iconv-lite/wiki/Node-v4-compatibility')
 expect(()=>splitFontkitTables('export default {}')).toThrow(/locked fontkit/)
})
