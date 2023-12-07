export function hasHTTPS(value) {
  return Boolean(value.match(/^(https:\/\/)/))
}

export function hasHTTPSOrHTTP(value) {
  if (!value) return false
  return Boolean(value.match(/^(https:\/\/|http:\/\/)/))
}

export function removeHTTPSorHTTP(value) {
  return value.replace(/^(https:\/\/|http:\/\/)/, '')
}

export function completeUrl(value) {
  return value ? (hasHTTPSOrHTTP(value) ? value : `https://${value}`) : ''
}

export const isValidUrl = string => {
  let url
  try {
    url = new URL(string)
  } catch (_) {
    return false
  }

  return url.protocol === 'http:' || url.protocol === 'https:'
}

/**
 * @param {string} url
 * @return boolean
 */
export const isAWSS3bucketURL = url => {
  const bucketRGEX = new RegExp(/^(.+)(?:\.s3[-.].*)$/)

  return bucketRGEX.test(url)
}

export const removeSearchParamsWithoutRefresh = newSearchParams => {
  window.history.pushState(
    null,
    '',
    `${window.location.pathname}${newSearchParams ? newSearchParams : ''}`
  )
}

export const getSearchParamsObject = search => {
  const paramsObj = {}
  const urlParams = new URLSearchParams(search)
  urlParams.forEach((value, key) => {
    paramsObj[key] = value
  })
  return paramsObj
}

export const getUnknownSearchParams = (
  searchParamsObject,
  initialFilterState
) => {
  const unknownParams = Object.entries(searchParamsObject)
    .filter(([key]) => !initialFilterState.hasOwnProperty(key))
    .map(([key, value]) => `${key}=${value}`)

  return unknownParams.length ? `?${unknownParams.join('&')}` : ''
}

export const parseToAbsolutePath = path => `/${path}`

export const removeAbsolutePath = path =>
  path.startsWith('/') ? path.substring(1) : path
