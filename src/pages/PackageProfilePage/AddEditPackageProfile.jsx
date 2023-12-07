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
  FormControlInput,
  FormControlNumericInput,
  FormControlReactSelect
} from 'components/formControls'
import Container from 'components/containers/Container'
import { useFormik } from 'formik'
import useFormErrorHandler from 'hooks/useFormErrorHandler'
import { _get } from 'utils/lodash'
import {
  useAddPackageProfileMutation,
  useLazyGetPackageProfileByIdQuery,
  useUpdatePackageProfileMutation
} from 'api/packageProfileApi'
import {
  distanceUnitOptions,
  distanceUnitValues,
  massUnitOptions,
  massUnitValues
} from 'constants/packageProfile'

const useStyles = makeStyles(() => ({
  container: {
    padding: '0 20px'
  },
  labelMarginTop: {
    marginTop: 10
  }
}))

const initialValues = {
  length: '',
  width: '',
  height: '',
  distanceUnit: distanceUnitValues.cm,
  weight: '',
  massUnit: massUnitValues.g,
  name: ''
}

const validationSchema = Yup.object().shape({
  name: Yup.string().trim().required(requiredField),
  length: Yup.number().required(requiredField),
  width: Yup.number().required(requiredField),
  height: Yup.number().required(requiredField),
  weight: Yup.number().required(requiredField)
})

const AddEditPackageProfile = () => {
  const { id } = useParams()
  const classes = useStyles()
  const initialFormValues = useRef(initialValues)

  const isEdit = !!id

  const navigate = useNavigate()

  const [getById, { data: item }] = useLazyGetPackageProfileByIdQuery()
  const [addItem, post] = useAddPackageProfileMutation({
    fixedCacheKey: apiCacheKeys.packageProfile.add
  })
  const [updateItem, put] = useUpdatePackageProfileMutation({
    fixedCacheKey: apiCacheKeys.packageProfile.update
  })

  const onSubmit = useCallback(
    values => {
      const data = {
        ...values
      }

      if (id) {
        updateItem({
          id,
          data
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
    if (item) {
      const { length, width, height, distanceUnit, weight, massUnit, name } =
        item

      initialFormValues.current = {
        length,
        width,
        height,
        distanceUnit,
        weight,
        massUnit,
        name
      }

      setValues(initialFormValues.current)
    }
    // eslint-disable-next-line
  }, [item])

  useEffect(() => {
    if (post.isSuccess || put.isSuccess) {
      navigate(parseToAbsolutePath(routes.packageProfile.list))
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
      width="30%"
      title={`${isEdit ? 'Edit' : 'Add'} Package Profile`}
      closeLink={parseToAbsolutePath(routes.packageProfile.list)}
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
        <FormControlInput
          name="name"
          label="Name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.name}
          touched={touched.name}
          marginBottom={false}
          fullWidth
          isRequired
        />
        <Container cols="3-3-3-2">
          <FormControlNumericInput
            name="length"
            label="Length"
            value={values.length}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.length}
            touched={touched.length}
            precision={4}
            marginBottom={false}
            fullWidth
            isRequired
          />
          <FormControlNumericInput
            name="width"
            label="Width"
            value={values.width}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.width}
            touched={touched.width}
            precision={4}
            marginBottom={false}
            fullWidth
            isRequired
          />
          <FormControlNumericInput
            name="height"
            label="Height"
            value={values.height}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.height}
            touched={touched.height}
            precision={4}
            marginBottom={false}
            fullWidth
            isRequired
          />
          <FormControlReactSelect
            label="Unit"
            name="distanceUnit"
            value={values.distanceUnit}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.distanceUnit}
            touched={touched.distanceUnit}
            options={distanceUnitOptions}
            marginBottom={false}
            fullWidth
          />
        </Container>
        <Container cols="3-2-3-3">
          <FormControlNumericInput
            name="weight"
            label="Weight"
            value={values.weight}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.weight}
            touched={touched.weight}
            precision={4}
            marginBottom={false}
            fullWidth
            isRequired
          />
          <FormControlReactSelect
            label="Unit"
            name="massUnit"
            value={values.massUnit}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.massUnit}
            touched={touched.massUnit}
            formControlContainerClass={classes.labelMarginTop}
            options={massUnitOptions}
            marginBottom={false}
            fullWidth
          />
        </Container>
      </Container>
    </SideModal>
  )
}

export default AddEditPackageProfile
