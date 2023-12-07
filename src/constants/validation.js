import * as Yup from 'yup'
import {
  isValidPhoneNumber,
  validatePhoneNumberLength
} from 'libphonenumber-js'
import moment from 'moment'

import { passwordRegExp } from './regExp'
import {
  fileFormat,
  fileSize,
  phoneMaxLength,
  phoneMinLength,
  phoneValidFormat,
  requiredField
} from './validationMessages'
import { _isEmpty } from 'utils/lodash'

export const passwordConfirmValidateSchema = Yup.string().when('password', {
  is: value => !passwordRegExp.test(value),
  then: () => Yup.string(),
  otherwise: () =>
    Yup.string()
      .required(requiredField)
      .oneOf([Yup.ref('password')], `Passwords don't match`)
})

export const imageValidateSchema = Yup.mixed()
  .test('fileFormat', 'jpeg, jpg, png only', value => {
    return (
      _isEmpty(value) ||
      typeof value === 'string' ||
      ['image/jpeg', 'image/jpg', 'image/png'].includes(value.type)
    )
  })
  .nullable()

export const startDateValidationSchema = (expireName = 'endDate', message) =>
  Yup.string()
    .test(
      'isBeforeExpire',
      message || 'The start date must be before the end date.',
      function (value) {
        const expireDate = this.parent[expireName]
        return !value || !expireDate || moment(value).isBefore(expireDate)
      }
    )
    .nullable()

export const endDateValidationSchema = (activeName = 'startDate', message) =>
  Yup.string()
    .test(
      'isAfterActive',
      message || 'The end date must be after the start date.',
      function (value) {
        const activeDate = this.parent[activeName]
        return !value || !activeDate || moment(value).isAfter(activeDate)
      }
    )
    .nullable()

export const phoneValidationSchema = Yup.string()
  .test('phoneMinTest', phoneMinLength, value =>
    value ? validatePhoneNumberLength(value) !== 'TOO_SHORT' : true
  )
  .test('phoneMaxTest', phoneMaxLength, value =>
    value ? validatePhoneNumberLength(value) !== 'TOO_LONG' : true
  )
  .test('phoneFormatTest', phoneValidFormat, value =>
    value ? isValidPhoneNumber(value) : true
  )

export const fileUploadValidationSchema = (fileFormats = [], maxSizeInMb = 5) =>
  Yup.mixed()
    .test('fileFormat', fileFormat, value => {
      return (
        value &&
        value[0] &&
        fileFormats.map(({ mime }) => mime).includes(value[0].type)
      )
    })
    .test('fileSize', fileSize(`${maxSizeInMb}MB`), value => {
      return value && value[0] && value[0].size <= maxSizeInMb * 1024 * 1024
    })
