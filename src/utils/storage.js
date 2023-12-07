import localStorageItems from 'constants/localStorageItems'

const secToMs = sec => sec * 1000

const calculateExpires = sec => {
  const ms = secToMs(sec)
  return Date.now() + ms
}

export function storageSetItem(name, value) {
  window.localStorage.setItem(name, value)
}

export function storageRemoveItem(name) {
  window.localStorage.removeItem(name)
}

export function storageGetItem(name) {
  return window.localStorage.getItem(name)
}

export function storageClearToken() {
  storageRemoveItem(localStorageItems.accessToken)
  storageRemoveItem(localStorageItems.expiresIn)
  storageRemoveItem(localStorageItems.lastActivity)
}

export function storageSetToken(type, token, expires) {
  storageClearToken()
  storageSetItem(localStorageItems.accessToken, `${type} ${token}`)
  storageSetItem(localStorageItems.expiresIn, calculateExpires(expires))
}

export function getToken() {
  return localStorage.getItem(localStorageItems.accessToken)
}
