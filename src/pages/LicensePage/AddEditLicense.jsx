import { useCallback, useEffect, useRef, useState } from 'react'
import { Grid, makeStyles } from '@material-ui/core'
import { useNavigate, useParams } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import FormFooterLayout from 'components/footerLayout/FormFooterLayout'
import { SideModal } from 'components/modals'
import { requiredField } from 'constants/validationMessages'
import {
  FormControlInput,
  FormControlNumericInput,
  FormControlReactSelect,
  FormControlSelectTag
} from 'components/formControls'
import Container from 'components/containers/Container'
import { routes } from 'constants/routes'
import { parseToAbsolutePath } from 'utils/urlUtils'
import apiCacheKeys from 'constants/apiCacheKeys'
import useFormErrorHandler from 'hooks/useFormErrorHandler'
import { _get } from 'utils/lodash'
import {
  useAddLicenseMutation,
  useLazyGetLicenseByIdQuery,
  useUpdateLicenseMutation
} from 'api/licenseApi'
import { licenseTypeOptions } from 'constants/licenseContants'
import { convertArr, fromChipObj, tagToChipObj } from 'utils/select'
import { tagEntityType } from 'constants/tagConstants'

const useStyles = makeStyles(() => ({
  wrapContent: {
    padding: '0px 20px',
    width: '100%'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridColumnGap: '16px'
  },
  stretch: {
    gridColumnStart: 1,
    gridColumnEnd: 3
  },
  errorTextClass: {
    whiteSpace: 'nowrap'
  },
  switchWrapCheck: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginLeft: '3px'
  },
  marginBottom: {
    marginBottom: 16
  }
}))

const initialValues = {
  name: '',
  licenseType: '',
  licenseDurationInMonth: '',
  tag: []
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required(requiredField),
  licenseType: Yup.string().required(requiredField),
  licenseDurationInMonth: Yup.number().required(requiredField)
})

const AddEditLicense = () => {
  const { id, view } = useParams()
  const classes = useStyles()
  const initiFormValues = useRef(initialValues)
  const navigate = useNavigate()

  const [isSubmitting, setSubmitting] = useState(false)

  const [getById, { data: license }] = useLazyGetLicenseByIdQuery()
  const [addLicense, post] = useAddLicenseMutation({
    fixedCacheKey: apiCacheKeys.license.add
  })
  const [updateLicense, put] = useUpdateLicenseMutation({
    fixedCacheKey: apiCacheKeys.license.update
  })

  const isEdit = !!id

  const onSubmit = useCallback(
    values => {
      setSubmitting(true)
      const data = {
        ...values,
        tag: convertArr(values.tag || [], fromChipObj)
      }
      if (id) {
        data.id = id
        updateLicense(data)
      } else {
        addLicense(data)
      }
    },
    [id, addLicense, updateLicense]
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
    setFieldError,
    validateForm
  } = useFormik({
    initialValues: initiFormValues.current,
    validationSchema,
    enableReinitialize: true,
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
    //eslint-disable-next-line
  }, [id])

  useEffect(() => {
    if (license) {
      const { name, licenseType, licenseDurationInMonth, tag } = license
      initiFormValues.current = {
        name,
        licenseType,
        licenseDurationInMonth,
        tag: convertArr(tag, tagToChipObj)
      }
      setValues(initiFormValues.current)
    }
    //eslint-disable-next-line
  }, [license])

  useEffect(() => {
    if (post.isSuccess || put.isSuccess) {
      setSubmitting(false)
      navigate(parseToAbsolutePath(routes.licenses[view]))
    } else if (post.isError || put.isError) {
      setSubmitting(false)
    }
    // eslint-disable-next-line
  }, [post, put])

  useFormErrorHandler({
    setFieldError,
    initialFormValues: initialValues,
    errorFields: _get(post, 'error.errorFields', _get(put, 'error.errorFields'))
  })

  return (
    <SideModal
      width="25%"
      title={isEdit ? 'Edit License' : 'Add License'}
      closeLink={parseToAbsolutePath(routes.licenses[view])}
      footerLayout={
        <FormFooterLayout
          onSubmit={handleSubmit}
          isPending={isSubmitting}
          opaqueSubmit={!isValid}
          onReset={handleReset}
          isUpdate={isEdit}
        />
      }
    >
      <Grid container direction="row" className={classes.wrapContent}>
        <Grid item xs={12}>
          <Container cols="1" isFormContainer>
            <FormControlInput
              label={'Name'}
              name="name"
              value={values.name}
              error={errors.name}
              touched={touched.name}
              onChange={handleChange}
              onBlur={handleBlur}
              fullWidth
              marginBottom={false}
              isRequired
            />
            <FormControlReactSelect
              label={'Type'}
              name="licenseType"
              options={licenseTypeOptions}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.licenseType}
              error={errors.licenseType}
              touched={touched.licenseType}
              fullWidth
              marginBottom={false}
              isRequired
            />
            <FormControlNumericInput
              label={'Duration (Months)'}
              name="licenseDurationInMonth"
              value={values.licenseDurationInMonth}
              error={errors.licenseDurationInMonth}
              touched={touched.licenseDurationInMonth}
              onChange={handleChange}
              onBlur={handleBlur}
              max={20}
              fullWidth
              marginBottom={false}
              isRequired
            />
            <FormControlSelectTag
              label="Tag"
              name="tag"
              entityType={tagEntityType.license}
              values={values.tag}
              error={errors.tag}
              touched={touched.tag}
              onChange={handleChange}
              onBlur={handleBlur}
              fullWidth
              marginBottom={false}
              isOptional
            />
          </Container>
        </Grid>
      </Grid>
    </SideModal>
  )
}

export default AddEditLicense
