import { useCallback, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { makeStyles } from '@material-ui/core'
import * as Yup from 'yup'

import { SideModal } from 'components/modals'
import FormFooterLayout from 'components/footerLayout/FormFooterLayout'
import { parseToAbsolutePath } from 'utils/urlUtils'
import { routes } from 'constants/routes'
import { requiredField } from 'constants/validationMessages'
import apiCacheKeys from 'constants/apiCacheKeys'
import {
  FormControlNumericInput,
  FormControlReactSelect
} from 'components/formControls'
import Container from 'components/containers/Container'
import { useFormik } from 'formik'
import useFormErrorHandler from 'hooks/useFormErrorHandler'
import { _get } from 'utils/lodash'
import {
  useAddSalesTaxMutation,
  useLazyGetSalesTaxByIdQuery,
  useUpdateSalesTaxMutation
} from 'api/salesTaxApi'
import { stateListOptions } from 'constants/salesTax'

const useStyles = makeStyles(() => ({
  container: {
    padding: '0 20px'
  }
}))

const initialValues = {
  stateCode: '',
  tax: ''
}

const validationSchema = Yup.object().shape({
  stateCode: Yup.string().trim().required(requiredField),
  tax: Yup.number().required(requiredField)
})

const AddEditSalesTax = () => {
  const { id } = useParams()
  const classes = useStyles()
  const initialFormValues = useRef(initialValues)

  const isEdit = !!id

  const navigate = useNavigate()

  const [getById, item] = useLazyGetSalesTaxByIdQuery()
  const [addItem, post] = useAddSalesTaxMutation({
    fixedCacheKey: apiCacheKeys.salesTax.add
  })
  const [updateItem, put] = useUpdateSalesTaxMutation({
    fixedCacheKey: apiCacheKeys.salesTax.update
  })

  const onSubmit = useCallback(
    values => {
      const data = {
        ...values
      }

      if (id) {
        updateItem({
          id,
          ...data
        })
      } else {
        addItem(data)
      }
    },
    [id, addItem, updateItem]
  )

  const {
    values,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
    setValues,
    validateForm,
    setFieldError
  } = useFormik({
    initialValues: initialFormValues.current,
    enableReinitialize: true,
    validationSchema,
    onSubmit
  })

  useEffect(() => {
    validateForm()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (id) {
      getById(id)
    }
    // eslint-disable-next-line
  }, [id])

  useEffect(() => {
    if (item.isSuccess && item.data) {
      const { stateCode, tax } = item.data
      initialFormValues.current = {
        stateCode,
        tax
      }

      setValues(initialFormValues.current)
    }
    // eslint-disable-next-line
  }, [item])

  useEffect(() => {
    if (post.isSuccess || put.isSuccess) {
      navigate(parseToAbsolutePath(routes.salesTax.list))
    }
    // eslint-disable-next-line
  }, [post.isSuccess, put.isSuccess])

  useFormErrorHandler({
    setFieldError,
    initialFormValues: initialValues,
    errorFields: _get(post, 'error.errorFields', _get(put, 'error.errorFields'))
  })

  return (
    <SideModal
      width="25%"
      title={`${isEdit ? 'Edit' : 'Add'} Sales Tax`}
      closeLink={parseToAbsolutePath(routes.salesTax.list)}
      footerLayout={
        <FormFooterLayout
          opaqueSubmit={!isValid}
          onSubmit={handleSubmit}
          onReset={handleReset}
          isUpdate={isEdit}
        />
      }
    >
      <Container cols="1" rootClassName={classes.container} isFormContainer>
        <FormControlReactSelect
          name="stateCode"
          label="Sales Tax State"
          value={values.stateCode}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.stateCode}
          touched={touched.stateCode}
          marginBottom={false}
          options={stateListOptions}
          fullWidth
          isSearchable
          isRequired
        />
        <FormControlNumericInput
          name="tax"
          label="Tax Rate (%)"
          value={values.tax}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.tax}
          touched={touched.tax}
          precision={2}
          marginBottom={false}
          fullWidth
          isRequired
        />
      </Container>
    </SideModal>
  )
}

export default AddEditSalesTax
