export const camelCaseToSplitCapitalize = value => {
  if (!value) {
    return ''
  }
  const result = value.replace(/([^A-Z])([A-Z])/g, '$1 $2')
  return `${result[0].toUpperCase()}${result.substring(1)}`
}

export const snakeCaseToSplitCapitalize = name => {
  if (!name) {
    return ''
  }
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
