export const distanceUnitValues = {
  cm: 'cm',
  in: 'in',
  mm: 'mm',
  ft: 'ft',
  m: 'm',
  yd: 'yd'
}

export const distanceUnitOptions = [
  ...Object.values(distanceUnitValues).map(value => ({
    label: value,
    value
  }))
]

export const massUnitValues = {
  g: 'g',
  oz: 'oz',
  lb: 'lb',
  kg: 'kg'
}

export const massUnitOptions = [
  ...Object.values(massUnitValues).map(value => ({
    label: value,
    value
  }))
]
