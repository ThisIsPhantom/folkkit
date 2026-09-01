import { fileURLToPath } from 'node:url'
import { createPublicOperator, getPublicOperatorErrors } from '../src/content/publicOperator.js'

export function validatePublicConfig(values) {
  const operator = createPublicOperator(values)
  return { operator, errors: getPublicOperatorErrors(operator) }
}

export function runPublicConfigValidation(values = process.env) {
  const { errors } = validatePublicConfig(values)
  if (errors.length > 0) {
    throw new Error(`Public release configuration is incomplete:\n- ${errors.join('\n- ')}`)
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    runPublicConfigValidation()
    console.log('Public release configuration is valid.')
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}
