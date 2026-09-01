export const PUBLIC_OPERATOR_ENV_NAMES = Object.freeze([
  'VITE_PUBLIC_OPERATOR_NAME',
  'VITE_PUBLIC_OPERATOR_ADDRESS',
  'VITE_PUBLIC_CONTACT_EMAIL',
])

const exampleValues = Object.freeze({
  VITE_PUBLIC_OPERATOR_NAME: 'Example Operator',
  VITE_PUBLIC_OPERATOR_ADDRESS: 'Example Street 1|8000 Example City',
  VITE_PUBLIC_CONTACT_EMAIL: 'operator@example.com',
})

function clean(value) {
  return typeof value === 'string' ? value.trim() : ''
}

export function createPublicOperator(values = {}) {
  return Object.freeze({
    name: clean(values.VITE_PUBLIC_OPERATOR_NAME),
    addressLines: Object.freeze(clean(values.VITE_PUBLIC_OPERATOR_ADDRESS)
      .split(/\r?\n|\|/)
      .map(line => line.trim())
      .filter(Boolean)),
    email: clean(values.VITE_PUBLIC_CONTACT_EMAIL),
  })
}

export function getPublicOperatorErrors(operator) {
  const address = operator.addressLines.join('|')
  const errors = []

  if (!operator.name) errors.push('VITE_PUBLIC_OPERATOR_NAME is required.')
  else if (operator.name.toLowerCase() === exampleValues.VITE_PUBLIC_OPERATOR_NAME.toLowerCase()) {
    errors.push('VITE_PUBLIC_OPERATOR_NAME still contains the example value.')
  }

  if (!address) errors.push('VITE_PUBLIC_OPERATOR_ADDRESS is required.')
  else if (address.toLowerCase() === exampleValues.VITE_PUBLIC_OPERATOR_ADDRESS.toLowerCase()) {
    errors.push('VITE_PUBLIC_OPERATOR_ADDRESS still contains the example value.')
  }

  if (!operator.email) errors.push('VITE_PUBLIC_CONTACT_EMAIL is required.')
  else if (operator.email.toLowerCase() === exampleValues.VITE_PUBLIC_CONTACT_EMAIL.toLowerCase()) {
    errors.push('VITE_PUBLIC_CONTACT_EMAIL still contains the example value.')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(operator.email)) {
    errors.push('VITE_PUBLIC_CONTACT_EMAIL must be a valid email address.')
  }

  return errors
}

export function isPublicOperatorConfigured(operator) {
  return getPublicOperatorErrors(operator).length === 0
}

const publicEnv = import.meta.env || {}
export const publicOperator = createPublicOperator(publicEnv)

export default publicOperator
