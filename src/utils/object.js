export function getResponse({ response }) {
  return response
}

export function getError({ error }) {
  return error
}

export function getMessage(data) {
  if (data) {
    return data.message
  }
}

export function getException({ exception } = {}) {
  return exception
}

export function getStatus({ status }) {
  return status
}

export function getData({ data }) {
  return data
}

export function getCode({ code }) {
  return code
}

export function getConfig({ config }) {
  return config
}

export function getErrors(data) {
  if (data) {
    return data.errors
  }
}
