import { _isArray, _isObject, _mapValues, _reduce, _set } from './lodash'

export function simulateEvent(name, value) {
  return { target: { name, value } }
}

export function errorsToTouched(errors = {}, excludeKeys = []) {
  return _mapValues(errors, (val, key) => {
    if (excludeKeys.includes(key)) {
      return
    }
    if (_isObject(val)) {
      return errorsToTouched(val)
    } else {
      return true
    }
  })
}

export function formToTouched(values = {}, excludeKeys = [], status = false) {
  return _mapValues(values, (val, key) => {
    if (excludeKeys.includes(key)) {
      return
    }
    if (Array.isArray(val)) {
      return val.map(v => formToTouched(v, excludeKeys, status))
    } else if (_isObject(val)) {
      return formToTouched(val, excludeKeys, status)
    } else {
      return status
    }
  })
}

export function namesToTouched(names) {
  return _reduce(names, (acc, cur) => ({ ...acc, [cur]: true }), {})
}

export function errorArrayToObj(errors = [], allowedNames = []) {
  const errorField = {}
  errors.forEach(({ name, value }) => {
    const prepareVal = _isArray(value) ? value.join(' ') : value
    if (!allowedNames.length || allowedNames.some(str => name.includes(str))) {
      _set(errorField, name, prepareVal)
    } else {
      errorField[name] = prepareVal
    }
  })
  return errorField
}
