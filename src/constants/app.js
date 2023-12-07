export const config = {
  API_URL: import.meta.env.VITE_API_URL,
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  GOOGLE_API_KEY: import.meta.env.VITE_GOOGLE_API_KEY,
  IP_API_URL: 'https://api.ipify.org/',
  GOOGLE_FONTS_URL: 'https://www.googleapis.com/webfonts/v1/webfonts',
  FROALA_EDITOR_KEY: import.meta.env.VITE_FROALA_EDITOR_KEY,
  PUBLIC_URL: import.meta.env.VITE_PUBLIC_URL,
  STRIPE_KEY: import.meta.env.VITE_STRIPE_KEY,
  AUTHORIZE_NET_MODE: import.meta.env.VITE_AUTHORIZE_NET_MODE,
  AUTHORIZE_NET_LOGIN_ID: import.meta.env.VITE_AUTHORIZE_NET_LOGIN_ID,
  AUTHORIZE_NET_CLIENT_KEY: import.meta.env.VITE_AUTHORIZE_NET_CLIENT_KEY
}

export const DEFAULT_NOTIFICATION_DURATION = 3000
export const AUTO_LOGOUT_TIME = 1800
export const BIG_LIMIT = 99999
