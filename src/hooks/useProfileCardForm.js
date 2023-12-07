import { useEffect, useMemo, useRef, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {
  createYupSchema,
  getCustomFieldInitialValues
} from 'utils/customFieldUtils'

const useProfileCardForm = ({
  values,
  layout,
  onSubmit,
  initialValue,
  initialValidationSchema,
  isAdd
}) => {
  const [validationSchema, setValidationSchema] = useState(Yup.object())
  const initialValues = useRef({})

  const form = useFormik({
    initialValues: initialValues.current,
    validationSchema,
    enableReinitialize: true,
    onSubmit
  })

  useEffect(() => {
    if (values) {
      const _values = {
        ...(values || {}),
        ...(initialValue || {})
      }

      const names = Object.keys(_values)
      const filteredFields = layout.filter(
        ({ code }) =>
          names.includes(code) &&
          !Object.keys(initialValidationSchema || {}).includes(code)
      )

      if (isAdd) {
        filteredFields.forEach(field => {
          _values[field.code] = getCustomFieldInitialValues(
            _values[field.code],
            field
          )
        })
      }
      initialValues.current = _values
      form.setValues(initialValues.current)

      setValidationSchema(
        Yup.object().shape({
          ...filteredFields.reduce(createYupSchema, {}),
          ...(initialValidationSchema || {})
        })
      )
    }
    //eslint-disable-next-line
  }, [values, layout])

  return useMemo(() => form, [form])
}

export default useProfileCardForm
