import { config } from 'constants/app'

export const onlyPublicView = () => {
  return window.location.origin === config.PUBLIC_URL
}

export const parsePublicLink = path => {
  return `${config.PUBLIC_URL}${path}`
}
