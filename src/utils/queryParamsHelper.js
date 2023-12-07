import { squareBracketsRegExp } from 'constants/regExp'

const queryParamsHelper = (
  params = {},
  arrayParamKeys = [],
  excludeParamKeys = [],
  arrayParamKeysGetValue = []
) => {
  let queryParams = {}
  Object.keys(params).forEach(key => {
    let paramValue = params[key]
    if (arrayParamKeys.includes(key) && Array.isArray(params[key])) {
      paramValue = params[key]
        .map(item => (typeof item === 'object' ? item?.label : item))
        .join(',')
    } else if (
      arrayParamKeysGetValue.includes(key) &&
      Array.isArray(params[key])
    ) {
      paramValue = params[key].map(({ value }) => value).join(',')
    }
    if (
      arrayParamKeys.includes(key) &&
      (key === 'updatedAt-from' || key === 'updatedAt-to') &&
      typeof params[key] === 'object'
    ) {
      paramValue = params[key] ? params[key].format('YYYY-MM-DD') : ''
    }
    if (
      typeof params[key] === 'string' &&
      squareBracketsRegExp.test(params[key])
    ) {
      paramValue = params[key].replace(squareBracketsRegExp, '')
    }
    if (paramValue || excludeParamKeys.includes(key)) {
      queryParams[key] = paramValue
    }
  })

  return queryParams
}

export default queryParamsHelper
