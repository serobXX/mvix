import exceptionNames from 'constants/beExceptionNames'
import { _includes, _keys, _reduce } from './lodash'
import { getErrors, getException, getMessage } from './object'

const rawDataErrorCodes = [409]
const rawExceptions = [
  exceptionNames.changedAddressErrorException,
  exceptionNames.rolesUpdateErrorException
]

const defaultError = {
  code: 400,
  message: 'Oops.. Something went wrong',
  errors: [],
  errorFields: []
}

function createErrorFieldObj(name, value) {
  return { name, value }
}

function parseErrors(errors) {
  return _reduce(
    errors,
    (acc, cur) => {
      return [...acc, cur]
    },
    []
  )
}

function parseErrorFields(errors) {
  return _reduce(
    _keys(errors),
    (acc, cur) => {
      return [...acc, createErrorFieldObj(cur, errors[cur])]
    },
    []
  )
}

function errorHandler({ data, status }) {
  if (!data && !status) {
    return defaultError
  }

  const errorMessage = 'Please confirm your action'
  if (
    _includes(rawDataErrorCodes, status) ||
    _includes(rawExceptions, getException(data))
  ) {
    return {
      ...defaultError,
      ...data,
      code: status,
      message: errorMessage,
      innerMessage: getMessage(data)
    }
  }

  if (getErrors(data)) {
    return {
      ...defaultError,
      code: status,
      message: getMessage(data),
      errors: parseErrors(getErrors(data)),
      errorFields: parseErrorFields(getErrors(data)),
      exception: getException(data)
    }
  }

  if (getMessage(data)) {
    return {
      ...defaultError,
      code: status,
      message: getMessage(data),
      exception: getException(data)
    }
  }
}

export default errorHandler

const getErrorsFromObject = error => {
  return typeof error === 'object'
    ? Object.values(error)
        .map(data => getErrorsFromObject(data))
        .join(' ')
    : error
}

export const parseNestedError = error => {
  return Array.isArray(error)
    ? error.map(data => getErrorsFromObject(data)).join(' ')
    : error
}
