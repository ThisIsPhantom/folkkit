import { parse } from 'acorn'

function propertyId(element) {
  if (element?.type === 'CallExpression' && element.arguments[0]?.type === 'Literal' && typeof element.arguments[0].value === 'string') {
    return element.arguments[0].value
  }
  if (element?.type !== 'ObjectExpression') return null
  const property = element.properties.find(item => (
    item.type === 'Property'
    && !item.computed
    && ((item.key.type === 'Identifier' && item.key.name === 'id') || item.key.value === 'id')
  ))
  return property?.value?.type === 'Literal' && typeof property.value.value === 'string'
    ? property.value.value
    : null
}

function converterArrayFromInitializer(initializer) {
  if (initializer?.type === 'ArrayExpression') return initializer
  if (
    initializer?.type === 'CallExpression'
    && initializer.callee?.type === 'MemberExpression'
    && initializer.callee.object?.type === 'ArrayExpression'
  ) return initializer.callee.object
  return null
}

export function pruneReleasedConverters(code, releasedIds, moduleId) {
  const ast = parse(code, { ecmaVersion: 'latest', sourceType: 'module' })
  let converterArray = null
  let converterExportName = null
  for (const statement of ast.body) {
    if (statement.type !== 'ExportNamedDeclaration' || statement.declaration?.type !== 'VariableDeclaration') continue
    for (const declaration of statement.declaration.declarations) {
      if (declaration.id?.type !== 'Identifier' || !declaration.id.name.endsWith('Converters')) continue
      const candidate = converterArrayFromInitializer(declaration.init)
      if (!candidate) throw new Error(`Converter export for ${moduleId} is not a supported array.`)
      if (converterArray) throw new Error(`Converter module ${moduleId} has multiple converter arrays.`)
      converterArray = candidate
      converterExportName = declaration.id.name
    }
  }
  if (!converterArray) throw new Error(`Converter module ${moduleId} has no exported converter array.`)
  const selected = []
  const discovered = new Set()
  for (const element of converterArray.elements) {
    const id = propertyId(element)
    if (!id) throw new Error(`Converter module ${moduleId} contains an entry without a literal id.`)
    discovered.add(id)
    if (releasedIds.has(id)) selected.push(code.slice(element.start, element.end))
  }
  const missing = [...releasedIds].filter(id => !discovered.has(id))
  if (missing.length > 0) throw new Error(`Released converter ids missing from ${moduleId}: ${missing.join(', ')}`)
  const edits = [{ start: converterArray.start + 1, end: converterArray.end - 1, replacement: selected.join(',\n') }]
  const mutators = new Set(['copyWithin', 'fill', 'pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'])
  const mutationDependencies = new Set()
  for (const statement of ast.body) {
    if (statement.type !== 'ExpressionStatement') continue
    const expression = statement.expression
    const isMutatingCall = expression.type === 'CallExpression'
      && expression.callee?.type === 'MemberExpression'
      && expression.callee.object?.type === 'Identifier'
      && expression.callee.object.name === converterExportName
      && !expression.callee.computed
      && mutators.has(expression.callee.property.name)
    const isMutatingAssignment = expression.type === 'AssignmentExpression'
      && expression.left?.type === 'MemberExpression'
      && expression.left.object?.type === 'Identifier'
      && expression.left.object.name === converterExportName
    if (isMutatingCall) {
      for (const argument of expression.arguments) {
        const value = argument.type === 'SpreadElement' ? argument.argument : argument
        if (value.type === 'Identifier') mutationDependencies.add(value.name)
      }
    }
    if (isMutatingCall || isMutatingAssignment) edits.push({ start: statement.start, end: statement.end, replacement: '' })
  }
  for (const statement of ast.body) {
    if (statement.type !== 'VariableDeclaration') continue
    const names = statement.declarations.map(declaration => declaration.id?.type === 'Identifier' ? declaration.id.name : null)
    if (!names.some(name => mutationDependencies.has(name))) continue
    if (!names.every(name => mutationDependencies.has(name))) throw new Error(`Mixed hidden mutation declaration in ${moduleId}.`)
    edits.push({ start: statement.start, end: statement.end, replacement: '' })
  }
  return edits.sort((left, right) => right.start - left.start).reduce(
    (result, edit) => `${result.slice(0, edit.start)}${edit.replacement}${result.slice(edit.end)}`,
    code,
  )
}
