import { useEffect, useMemo } from 'react'
import { _has } from 'utils/lodash'

const useFormErrorHandler = ({
  setFieldError,
  initialFormValues,
  errorFields,
  showAllErrors,
  fieldMapping
}) => {
  const fields = useMemo(
    () =>
      Object.keys(initialFormValues).map(
        field => fieldMapping?.[field] || field
      ),
    [initialFormValues, fieldMapping]
  )

  useEffect(() => {
    if (errorFields?.length) {
      errorFields.forEach(({ name, value }) => {
        if (
          showAllErrors ||
          fields.includes(name) ||
          _has(initialFormValues, name)
        ) {
          setFieldError(name, value[0])
        }
      })
    }
    // eslint-disable-next-line
  }, [errorFields])
}

export default useFormErrorHandler
