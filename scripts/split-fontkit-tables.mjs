import {parse} from 'acorn'

const tableNames = new Set(['cp936','cp950','eucjp','cp949','shiftjis','big5Added'])
const moduleId = '\0folkkit:fontkit-tables'

export function splitFontkitTables(source) {
  const ast = parse(source, {ecmaVersion:'latest',sourceType:'module'})
  const nodes = ast.body.filter(node=>node.type==='VariableDeclaration'&&node.declarations.length===1&&tableNames.has(node.declarations[0].id.name))
  if(nodes.length!==tableNames.size)throw new Error('The locked fontkit character tables changed; review the vendor split.')
  let code=source
  for(const node of [...nodes].reverse())code=code.slice(0,node.start)+code.slice(node.end)
  const names=nodes.map(node=>node.declarations[0].id.name)
  // A vendor diagnostic contains a remote documentation URL. Keep the
  // diagnostic local; no external origin belongs in an automatic sink.
  code=code.replace(/https:\/\/github\.com\/ashtuchkin\/iconv-lite\/wiki\/[A-Za-z0-9-]+/g,'iconv-lite compatibility documentation')
  return {code:`import {${names.join(',')}} from 'folkkit:fontkit-tables';\n${code}`,tables:nodes.map(node=>`export ${source.slice(node.start,node.end)}`).join('\n')}
}

export function fontkitTablesPlugin(){
  let tables
  return {
    name:'split-local-fontkit-tables',
    enforce:'pre',
    resolveId(id){if(id==='folkkit:fontkit-tables')return moduleId},
    load(id){if(id===moduleId)return tables},
    transform(code,id){
      if(!id.replaceAll('\\','/').endsWith('/@pdf-lib/fontkit/dist/fontkit.es.js'))return
      const split=splitFontkitTables(code);tables=split.tables;return {code:split.code,map:null}
    },
  }
}
