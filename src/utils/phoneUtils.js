import { countryPhoneInfo } from 'constants/countryConstants'

const DEFAULT_PLACEHOLDER = '7135844031'

export const getPlaceholderByCountryCode = (countryCode = 'us') => {
  const countryInfo = countryPhoneInfo.find(
    country => country.code === countryCode
  )

  if (!countryInfo) {
    return DEFAULT_PLACEHOLDER
  }

  const { formatLength } = countryInfo

  return DEFAULT_PLACEHOLDER.length < formatLength
    ? DEFAULT_PLACEHOLDER.padEnd(formatLength, '2')
    : DEFAULT_PLACEHOLDER.substring(0, formatLength)
}
