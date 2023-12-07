import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { statusValues } from 'constants/commonOptions'
import { customFieldTypes } from 'constants/customFields'
import {
  createYupSchema,
  getCustomFieldInitialValues,
  parseBEValues
} from 'utils/customFieldUtils'
import queryParamsHelper from 'utils/queryParamsHelper'
import { convertArr, fromChipObj, tagToChipObj } from 'utils/select'
import useFormErrorHandler from './useFormErrorHandler'
import { _get } from 'utils/lodash'

const useCustomFieldFormConfig = ({
  id,
  layout,
  hideTagField = false,
  hideStatusField = false,
  initialValues = {},
  initialValidationSchema = {},
  item,
  updateItem = f => f,
  addItem = f => f,
  post,
  put,
  transformItem = f => f
}) => {
  const initiFormValues = useRef({
    ...(hideTagField ? {} : { tag: [] }),
    ...(hideStatusField ? {} : { status: statusValues.active }),
    ...initialValues
  })

  const [isSubmitting, setSubmitting] = useState(false)

  const filteredFields = useMemo(() => {
    return layout.filter(
      ({ type }) =>
        ![customFieldTypes.tab, customFieldTypes.container].includes(type)
    )
  }, [layout])

  const validationSchema = useMemo(() => {
    let customFields = Yup.object()
    if (filteredFields) {
      customFields = Yup.object().shape(
        filteredFields.reduce(createYupSchema, {})
      )
    }
    return Yup.object().shape({
      customFields,
      ...(hideTagField ? {} : { tag: Yup.array() }),
      ...initialValidationSchema
    })
  }, [filteredFields, initialValidationSchema, hideTagField])

  const onSubmit = useCallback(
    values => {
      setSubmitting(true)
      const { tag } = values
      const data = queryParamsHelper({
        ...Object.entries(values).reduce((a, [key, value]) => {
          a[key] = value
          if (
            Array.isArray(value) &&
            typeof value[0] === 'object' &&
            !Object.keys(initialValues).includes(key)
          ) {
            a[key] = value.map(({ value: v }) => v)
          }
          return a
        }, {}),
        ...(hideTagField ? {} : { tag: convertArr(tag, fromChipObj) })
      })
      if (id) {
        updateItem({ id, data })
      } else {
        addItem(data)
      }
    },
    [id, addItem, updateItem, hideTagField, initialValues]
  )

  const form = useFormik({
    initialValues: initiFormValues.current,
    validationSchema,
    enableReinitialize: true,
    onSubmit
  })

  useEffect(() => {
    form.validateForm()
    //eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (filteredFields) {
      initiFormValues.current = {
        ...initiFormValues.current,
        customFields: {
          ...parseBEValues(
            layout,
            filteredFields.reduce((a, b) => {
              a[b.code] = getCustomFieldInitialValues('', b)
              return a
            }, {})
          )
        }
      }
      form.setValues(initiFormValues.current)
    }
    //eslint-disable-next-line
  }, [filteredFields])

  useEffect(() => {
    if (item) {
      const { customFields, status, tag } = item
      initiFormValues.current = {
        ...initiFormValues.current,
        ...transformItem(item),
        customFields: Object.entries(customFields).reduce((a, [key, value]) => {
          const { type, options } =
            filteredFields.find(({ code }) => code === key) || {}
          if (typeof value === 'object' && !Array.isArray(value)) {
            a[key] = value?.id
          } else if (type === customFieldTypes.select) {
            a[key] = options?.find(({ name }) => name === value)?.id
          } else if (type === customFieldTypes.multiselect) {
            a[key] = value?.length
              ? value.map(({ id, name }) => ({
                  label: name,
                  value: id
                }))
              : []
          } else a[key] = value
          return a
        }, {}),
        ...(hideStatusField ? {} : { status }),
        ...(hideTagField ? {} : { tag: convertArr(tag, tagToChipObj) })
      }
      form.setValues(initiFormValues.current)
    }
    //eslint-disable-next-line
  }, [item, filteredFields])

  useFormErrorHandler({
    setFieldError: form.setFieldError,
    initialFormValues: initiFormValues.current,
    errorFields: _get(post, 'error.errorFields', _get(put, 'error.errorFields'))
  })

  return useMemo(
    () => ({
      ...form,
      isSubmitting,
      setSubmitting
    }),
    [form, isSubmitting]
  )
}

export default useCustomFieldFormConfig
