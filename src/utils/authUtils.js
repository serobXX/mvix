import localStorageItems from 'constants/localStorageItems'

export const isLoggedIn = () =>
  !!localStorage.getItem(localStorageItems.accessToken)
