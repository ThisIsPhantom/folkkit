import { expect, test } from 'vitest'
import { getLocalizedReleasedFormatById, getLocalizedReleasedFormats } from './formats'

test('provides localized names for every released format in German and English', () => {
  const german = getLocalizedReleasedFormats('de')
  const english = getLocalizedReleasedFormats('en')

  expect(german).toHaveLength(18)
  expect(english).toHaveLength(18)
  expect(getLocalizedReleasedFormatById('json-min', 'de')).toMatchObject({ id: 'json-min', name: 'Minimiertes JSON' })
  expect(getLocalizedReleasedFormatById('json-min', 'en')).toMatchObject({ id: 'json-min', name: 'Minified JSON' })
  expect(german.every(format => typeof format.name === 'string' && format.name.length > 0)).toBe(true)
  expect(english.every(format => typeof format.name === 'string' && format.name.length > 0)).toBe(true)
})
