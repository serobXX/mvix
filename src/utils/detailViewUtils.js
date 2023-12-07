import { customFieldTypes } from 'constants/customFields'
import { getCustomFieldValueByCode } from './customFieldUtils'
import customFieldNames from 'constants/customFieldNames'
import { titleCase } from 'title-case'

export const transformAddress = (value, data) => {
  if (value && data) {
    const {
      placeId,
      timezone,
      city,
      state,
      country,
      zipcode,
      latitude,
      longitude
    } = data
    let address1 = value,
      address2 = ''

    if (value.includes(city?.longName)) {
      address1 = value.substring(0, value.indexOf(city?.longName)).trim() || ''
      address2 = value.substring(value.indexOf(city?.longName)).trim() || ''
    } else if (value.includes(city?.shortName)) {
      address1 = value.substring(0, value.indexOf(city?.shortName)).trim() || ''
      address2 = value.substring(value.indexOf(city?.shortName)).trim() || ''
    }

    address1 = address1.endsWith(',')
      ? address1.substring(0, address1.length - 1)
      : address1
    address2 = address2.endsWith(',')
      ? address2.substring(0, address2.length - 1)
      : address2

    return {
      placeId,
      address1,
      address2,
      city: city?.longName,
      cityShort: city?.shortName,
      state: state?.longName,
      stateShort: state?.shortName,
      country: country?.longName,
      countryShort: country?.shortName,
      zipCode: zipcode?.longName,
      zipCodeShort: zipcode?.shortName,
      timeZoneId: timezone?.timeZoneId,
      timeZoneName: timezone?.timeZoneName,
      latitude,
      longitude
    }
  } else return value
}

export const getEmails = (layout, item) => {
  return layout
    .filter(({ type }) => type === customFieldTypes.email)
    .reduce((a, b) => {
      a[b.code] = getCustomFieldValueByCode(item, b.code, '')
      return a
    }, {})
}

export const getPhones = (layout, item) => {
  return layout
    .filter(({ type }) => type === customFieldTypes.phone)
    .reduce((a, b) => {
      const phone = getCustomFieldValueByCode(item, b.code, '')
      a[b.code] = phone
        ? !phone.trim().startsWith('+')
          ? `+1 ${phone}`
          : phone
        : ''
      return a
    }, {})
}

export const billingShippingToAddress = values => {
  values = values || {}
  const billingAddress = {
    address1: values[customFieldNames.billingStreet],
    locationAddress: values[customFieldNames.billingStreet],
    city: values[customFieldNames.billingCity],
    state: values[customFieldNames.billingState],
    country: values[customFieldNames.billingCountry],
    zipCode: values[customFieldNames.billingCode],
    isBilling: true
  }

  const shippingAddress = {
    address1: values[customFieldNames.shippingStreet],
    locationAddress: values[customFieldNames.shippingStreet],
    city: values[customFieldNames.shippingCity],
    state: values[customFieldNames.shippingState],
    country: values[customFieldNames.shippingCountry],
    zipCode: values[customFieldNames.shippingCode],
    isShipping: true
  }

  return [billingAddress, shippingAddress]
}

export const addressToBillingShipping = values => {
  if (!values?.length) return {}
  const billingAddress = values?.[0]
  const shippingAddress = values?.[1]
  let data = {}

  if (billingAddress) {
    data = {
      [customFieldNames.billingStreet]: billingAddress.address1,
      [customFieldNames.billingCity]: billingAddress.city,
      [customFieldNames.billingState]:
        billingAddress.stateShort || billingAddress.state,
      [customFieldNames.billingCode]: billingAddress.zipCode,
      [customFieldNames.billingCountry]:
        billingAddress.countryShort || billingAddress.country
    }
  }
  if (shippingAddress) {
    data = {
      ...data,
      [customFieldNames.shippingStreet]: shippingAddress.address1,
      [customFieldNames.shippingCity]: shippingAddress.city,
      [customFieldNames.shippingState]:
        shippingAddress.stateShort || shippingAddress.state,
      [customFieldNames.shippingCode]: shippingAddress.zipCode,
      [customFieldNames.shippingCountry]:
        shippingAddress.countryShort || shippingAddress.country
    }
  }

  return data
}

export const transformToConflictAddress = data => {
  const changedAddresses = data.changedAddresses
    ? Object.entries(data.changedAddresses)
    : []

  return [
    {
      title: 'Contact',
      hideActions: true,
      fieldName: 'customFields',
      list: changedAddresses.map(([key, value]) => ({
        label: titleCase(key.replaceAll('-', ' ')),
        name: key,
        options: [
          {
            label: value.saved,
            value: value.saved
          },
          {
            label: value.newContact,
            value: value.newContact
          }
        ]
      })),
      hideHeader: true
    }
  ]
}
