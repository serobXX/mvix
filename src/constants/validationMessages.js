export const requiredField = 'This field is required'
export const emailField = 'Email Format is Incorrect'
export const numberField = 'Must be a number'
export const integerField = 'Must be an integer'
export const positiveIntegerField = 'Must be a positive integer'
export const NonZeroIntegerField = 'Must be a non zero integer'
export const invalidValue = 'Invalid Value'
export const passwordMin = min => `Password must be at least ${min} characters`
export const validUrl = 'Enter valid URL'
export const validFileUrl =
  'This file format is not supported for playback. Please try uploading a valid file format'
export const reachableUrlMessage = 'The specified URL does not contain the file'
export const dataParsing = 'Unable to parse data'
export const numbersField = 'Only numbers'
export const requiredTheme = 'Select a theme'
export const requiredCity = 'Select a city'
export const requiredLocation = 'Select a location'
export const requiredBackground = 'Select a background'
export const commaSeparatedMacAddress =
  'Enter valid, comma separated MAC Address(es)'
export const validMacAddress = 'Enter valid MAC Address'
export const validActivationCode = 'Enter valid Activation Code'
export const validIpAddress = 'Enter a valid IP address'
export const validDefaultGateway = 'A valid IP address or 0.0.0.0 is required'
export const validTimeserver = 'Enter a valid timeserver'
export const validSubnetMask = 'Enter a valid Subnet Mask'
export const validDNS = 'Enter a valid DNS'
export const validProxyAddress = 'Enter a valid Proxy Address'
export const requiredFile = 'A file is required'
export const fileFormat = 'file not supported'
export const fileSize = size => `file is not greater than ${size}`
export const phoneMinLength = 'Phone is too short'
export const phoneMaxLength = 'Phone is too long'
export const phoneValidFormat = 'Invalid phone format'
export const groupField =
  "This field may only contain letters, numbers, space and the following special characters: (.!&@#$%-_()')"
export const unableToGetData = 'Unable to get data'
export const invalidDataType = 'Invalid data type'
export const roleTitle = "The name can only contain alphabet and '-'"
export const tagNameMin = 'A Valid tag name should have a min of 3 characters'
export const groupRequiredField = 'One or more groups are required'
export const minCharacters =
  (field = 'This field') =>
  ({ min }) =>
    `${field} must not exceed ${min} characters`
export const exceedCharacters =
  (field = 'This field') =>
  ({ max }) =>
    `${field} must not exceed ${max} characters`
export const exceedWords =
  (field = 'This field') =>
  ({ max }) =>
    `${field} must not exceed ${max} words`
export const numberMinimum = min => `Must be greater than or equal to ${min}`
export const numberMaximum = max => `Must be less than or equal to ${max}`
