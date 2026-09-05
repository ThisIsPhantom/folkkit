export function calculatorExample(id, options) {
  switch (id) {
    case 'percent': return options.mode === 'of' ? { rate: '15', base: '240' } : options.mode === 'share' ? { part: '36', base: '240' } : { previous: '80', next: '100' }
    case 'rule-of-three': return { first: '4', second: '12', third: '7' }
    case 'pythagoras': return { a: '3', b: '4', c: '5' }
    case 'circle': return { measure: '5' }
    case 'area': return { width: '8', height: '5' }
    case 'volume': return { width: '8', depth: '4', height: '5', radius: '3' }
    case 'units': return { value: '1' }
    case 'aspect-ratio': return { width: '1920', height: '1080', targetWidth: '1280' }
    case 'loan': return { principal: '12000', annualRate: '5', months: '36' }
    case 'bmi': return { weight: '70', height: '175' }
    case 'date': return { startDate: '2024-02-28', endDate: '2024-03-01', days: '2' }
    case 'duration': return { rows: [{ id: 1, hours: '1', minutes: '45', seconds: '30' }, { id: 2, minutes: '30', seconds: '45' }] }
    default: return {}
  }
}
