import { _get } from './lodash'

export const parseFilterToBEData = filters => {
  return Object.entries(filters).map(([key, value]) => ({
    field: key,
    value
  }))
}

export const parseBEDataToFilter = data => {
  return data.reduce((a, b) => {
    a[b.field] = b.value
    return a
  }, {})
}

export const getFilterFromData = data => _get(data, 'settings.filter', [])
