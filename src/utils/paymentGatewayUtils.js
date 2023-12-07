import { config } from 'constants/app'

export const loadAuthorizeScript = () => {
  const scriptEle = document.createElement('script')
  const link =
    config.AUTHORIZE_NET_MODE === 'live'
      ? 'https://js.authorize.net/v1/Accept.js'
      : 'https://jstest.authorize.net/v1/Accept.js'
  scriptEle.setAttribute('src', link)

  document.body.appendChild(scriptEle)
}

export const getAuthorizeAuthData = () => ({
  clientKey: config.AUTHORIZE_NET_CLIENT_KEY,
  apiLoginID: config.AUTHORIZE_NET_LOGIN_ID
})

export const getAuthorizeCardData = ({ cardNumber, expire, cardCode }) => {
  const [month, year] = expire.split('/')
  return {
    cardNumber: cardNumber.replaceAll(' ', ''),
    cardCode,
    month,
    year
  }
}

export const getAuthorizeBankData = ({
  accountNumber,
  routingNumber,
  nameOnAccount,
  accountType
}) => ({
  accountNumber,
  routingNumber,
  nameOnAccount,
  accountType
})
