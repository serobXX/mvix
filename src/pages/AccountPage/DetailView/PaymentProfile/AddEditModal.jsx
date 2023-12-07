import { DefaultModal } from 'components/modals'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Grid, makeStyles } from '@material-ui/core'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { getNames } from 'country-list'
import update from 'immutability-helper'

import { requiredField } from 'constants/validationMessages'
import {
  FormControlAutocomplete,
  FormControlInput,
  FormControlReactSelect,
  FormControlSelectLocations
} from 'components/formControls'
import Container from 'components/containers/Container'
import useFormErrorHandler from 'hooks/useFormErrorHandler'
import { _get } from 'utils/lodash'
import { paymentMethodOptions, paymentMethodValues } from 'constants/payment'
import Scrollbars from 'components/Scrollbars'
import { transformAddress } from 'utils/detailViewUtils'

const useStyles = makeStyles(() => ({
  wrapContent: {
    width: '100%',
    paddingBottom: 20
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
  paymentName: '',
  paymentMethod: paymentMethodValues.creditCard,
  billingStreetAddress: '',
  billingCity: '',
  billingState: '',
  billingPostalCode: '',
  billingCountry: ''
}

const validationSchema = Yup.object().shape({
  paymentName: Yup.string().required(requiredField),
  paymentMethod: Yup.string().required(requiredField),
  billingStreetAddress: Yup.string().required(requiredField),
  billingCity: Yup.string().required(requiredField),
  billingState: Yup.string().required(requiredField),
  billingPostalCode: Yup.string().required(requiredField),
  billingCountry: Yup.string().required(requiredField)
})

const AddEditModal = ({
  isModalOpen,
  accountId,
  onCloseModal,
  onAddItem,
  onUpdateItem,
  item,
  post,
  put
}) => {
  const classes = useStyles()
  const initiFormValues = useRef(initialValues)

  const [isSubmitting, setSubmitting] = useState(false)

  const isEdit = !!item?.id

  const onSubmit = useCallback(
    values => {
      setSubmitting(true)
      const data = {
        ...values,
        accountId
      }
      if (isEdit) {
        data.id = item?.id
        onUpdateItem(data)
      } else {
        onAddItem(data)
      }
    },
    [isEdit, item?.id, onUpdateItem, onAddItem, accountId]
  )

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
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
    if (item) {
      const {
        paymentName,
        paymentMethod,
        billingStreetAddress,
        billingCity,
        billingState,
        billingPostalCode,
        billingCountry
      } = item
      initiFormValues.current = {
        accountId,
        paymentName,
        paymentMethod,
        billingStreetAddress,
        billingCity,
        billingState,
        billingPostalCode,
        billingCountry
      }
      setValues(initiFormValues.current)
    }
    //eslint-disable-next-line
  }, [item])

  useEffect(() => {
    if (post.isSuccess || put.isSuccess) {
      setSubmitting(false)
      onCloseModal()
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

  const getCountries = useCallback(async () => {
    const names = getNames()
      .sort()
      .map(c => ({ value: c, label: c }))
    return {
      data: names,
      meta: {
        total: names.length,
        currentPage: 1,
        lastPage: 1
      }
    }
  }, [])

  const handleChangeLocation = useCallback(
    ({ target: { value, data } }) => {
      const addresses = transformAddress(value, data)

      setValues(
        update(values, {
          billingStreetAddress: {
            $set: addresses?.address1
          },
          billingCity: {
            $set: addresses?.city
          },
          billingState: {
            $set: addresses?.state
          },
          billingPostalCode: {
            $set: addresses?.zipCode
          },
          billingCountry: {
            $set: addresses?.country
          }
        })
      )
    },
    [values, setValues]
  )

  return (
    <DefaultModal
      open={isModalOpen}
      modalTitle={isEdit ? 'Edit Payment Profile' : 'Add Payment Profile'}
      onCloseModal={onCloseModal}
      onClickSave={handleSubmit}
      isUpdate={isEdit}
      isSaveLoad={isSubmitting}
    >
      <Scrollbars autoHeight autoHeightMax={'calc(100vh - 200px)'}>
        <Grid container direction="row" className={classes.wrapContent}>
          <Grid item xs={12}>
            <Container cols="2" isFormContainer>
              <FormControlInput
                label="Name"
                name="paymentName"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.paymentName}
                error={errors.paymentName}
                touched={touched.paymentName}
                fullWidth
                marginBottom={false}
                isRequired
              />
              <FormControlReactSelect
                label="Payment Method"
                name="paymentMethod"
                value={values.paymentMethod}
                error={errors.paymentMethod}
                touched={touched.paymentMethod}
                options={paymentMethodOptions}
                onChange={handleChange}
                onBlur={handleBlur}
                isSort={false}
                fullWidth
                marginBottom={false}
              />
              <FormControlSelectLocations
                label="Billing Address"
                name="billingStreetAddress"
                value={values.billingStreetAddress}
                error={errors.billingStreetAddress}
                touched={touched.billingStreetAddress}
                onChange={handleChangeLocation}
                onBlur={handleBlur}
                fullWidth
                marginBottom={false}
                formControlContainerClass={classes.stretch}
                withPortal
                isRequired
              />
              <FormControlInput
                label="Billing City"
                name="billingCity"
                value={values.billingCity}
                error={errors.billingCity}
                touched={touched.billingCity}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                marginBottom={false}
                isRequired
              />
              <FormControlInput
                label="Billing State"
                name="billingState"
                value={values.billingState}
                error={errors.billingState}
                touched={touched.billingState}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                marginBottom={false}
                isRequired
              />
              <FormControlInput
                label="Billing Zip"
                name="billingPostalCode"
                value={values.billingPostalCode}
                error={errors.billingPostalCode}
                touched={touched.billingPostalCode}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                marginBottom={false}
                isRequired
              />
              <FormControlAutocomplete
                label="Billing Country"
                name="billingCountry"
                value={values.billingCountry}
                error={errors.billingCountry}
                touched={touched.billingCountry}
                getOptions={getCountries}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                marginBottom={false}
                withPortal
                isRequired
              />
            </Container>
          </Grid>
        </Grid>
      </Scrollbars>
    </DefaultModal>
  )
}

export default AddEditModal
