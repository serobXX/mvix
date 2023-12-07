import { useCallback, useEffect, useRef, useState } from 'react'
import { Grid, makeStyles } from '@material-ui/core'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import FormFooterLayout from 'components/footerLayout/FormFooterLayout'
import { SideModal } from 'components/modals'
import { requiredField } from 'constants/validationMessages'
import {
  FormControlAutocomplete,
  FormControlDatePicker,
  FormControlInput,
  FormControlNumericInput,
  FormControlReactSelect
} from 'components/formControls'
import Container from 'components/containers/Container'
import { routes } from 'constants/routes'
import { parseToAbsolutePath } from 'utils/urlUtils'
import apiCacheKeys from 'constants/apiCacheKeys'
import useFormErrorHandler from 'hooks/useFormErrorHandler'
import { _get } from 'utils/lodash'
import {
  creditCardTypeOptions,
  paymentMethodOptions,
  paymentMethodValues,
  paymentProcessorOptions
} from 'constants/payment'
import {
  getAccountOptions,
  getOptionsByFieldAndEntity,
  getUserOptions,
  transformDataForInvoice
} from 'utils/autocompleteOptions'
import { optionEntity } from 'constants/autocompleteOptions'
import {
  useAddPaymentMutation,
  useLazyGetPaymentByIdQuery,
  useUpdatePaymentMutation
} from 'api/paymentApi'
import { simulateEvent } from 'utils/formik'
import queryParamsHelper from 'utils/queryParamsHelper'
import moment from 'moment'
import { NORMAL_DATE_FORMAT } from 'constants/dateTimeFormats'
import useUser from 'hooks/useUser'

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
  accountId: '',
  invoiceId: '',
  paymentMethod: paymentMethodValues.creditCard,
  creditCardType: '',
  paymentSource: '',
  paymentProcessor: '',
  paymentReceived: '',
  note: '',
  paymentDate: moment().format(NORMAL_DATE_FORMAT),
  receivedBy: ''
}

const validationSchema = Yup.object().shape({
  accountId: Yup.number().required(requiredField),
  invoiceId: Yup.number().required(requiredField),
  paymentMethod: Yup.string().required(requiredField),
  creditCardType: Yup.string()
    .when('paymentMethod', {
      is: paymentMethodValues.creditCard,
      then: () => Yup.string().required(requiredField)
    })
    .nullable(),
  paymentProcessor: Yup.string()
    .when('paymentMethod', {
      is: paymentMethodValues.other,
      then: () => Yup.string().required(requiredField)
    })
    .nullable(),
  paymentSource: Yup.string()
    .when('paymentMethod', {
      is: method =>
        ![paymentMethodValues.check, paymentMethodValues.creditCard].includes(
          method
        ),
      then: () => Yup.string().required(requiredField)
    })
    .when('paymentMethod', {
      is: paymentMethodValues.check,
      then: () => Yup.string().required(requiredField)
    })
    .when('paymentMethod', {
      is: paymentMethodValues.creditCard,
      then: () =>
        Yup.string()
          .required(requiredField)
          .matches(/^\d{4}$/i, 'Enter last 4 digits of your Credit Card')
    }),
  paymentReceived: Yup.number().required(requiredField),
  note: Yup.string(),
  paymentDate: Yup.string().required(requiredField),
  receivedBy: Yup.number().required(requiredField)
})

const AddEditPayment = ({ closeLink, fromDetailView }) => {
  const { id, paymentId, view } = useParams()
  const location = useLocation()
  const classes = useStyles()
  const [balanceDue, setBalanceDue] = useState(0)
  const [disabledFields, setDisabledFields] = useState([])
  const initiFormValues = useRef(initialValues)
  const navigate = useNavigate()
  const { data: user } = useUser()

  const [isSubmitting, setSubmitting] = useState(false)

  const [getById, { data: item }] = useLazyGetPaymentByIdQuery()
  const [addItem, post] = useAddPaymentMutation({
    fixedCacheKey: apiCacheKeys.payment.add
  })
  const [updateItem, put] = useUpdatePaymentMutation({
    fixedCacheKey: apiCacheKeys.payment.update
  })

  const isEdit = fromDetailView ? !!paymentId : !!id

  const onSubmit = useCallback(
    values => {
      setSubmitting(true)
      const data = queryParamsHelper({
        ...values
      })
      if (fromDetailView ? paymentId : id) {
        data.id = fromDetailView ? paymentId : id
        updateItem(data)
      } else {
        addItem(data)
      }
    },
    [id, addItem, updateItem, fromDetailView, paymentId]
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
    if (location.state && fromDetailView && !isEdit) {
      initiFormValues.current = {
        ...initiFormValues.current,
        accountId: location.state.accountId
          ? Number(location.state.accountId)
          : '',
        invoiceId: location.state.invoiceId
          ? Number(location.state.invoiceId)
          : ''
      }
      if (location.state.balanceDue) {
        setBalanceDue(location.state.balanceDue)
      }
      setDisabledFields(Object.keys(location.state))
      setValues(initiFormValues.current)
    }
    //eslint-disable-next-line
  }, [location.state])

  useEffect(() => {
    if (fromDetailView ? paymentId : id) {
      getById(fromDetailView ? paymentId : id)
    }
    //eslint-disable-next-line
  }, [id, paymentId])

  useEffect(() => {
    if (user?.id) {
      initiFormValues.current = {
        ...initiFormValues.current,
        receivedBy: item?.receivedBy?.id || user.id
      }
      setValues(initiFormValues.current)
    }
    //eslint-disable-next-line
  }, [user])

  useEffect(() => {
    if (item) {
      const {
        account,
        invoice,
        paymentReceived,
        paymentMethod,
        note,
        paymentDate,
        receivedBy,
        creditCardType,
        paymentSource,
        paymentProcessor
      } = item
      initiFormValues.current = {
        accountId: account?.id,
        invoiceId: invoice?.id,
        paymentMethod,
        paymentReceived,
        note,
        paymentDate,
        receivedBy: receivedBy?.id,
        creditCardType,
        paymentSource,
        paymentProcessor
      }
      setBalanceDue(invoice?.balance_due)
      setValues(initiFormValues.current)
    }
    //eslint-disable-next-line
  }, [item])

  useEffect(() => {
    if (post.isSuccess || put.isSuccess) {
      setSubmitting(false)
      navigate(closeLink || parseToAbsolutePath(routes.payments[view]))
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

  const handleChangeAccount = e => {
    handleChange(e)
    handleChange(simulateEvent('invoiceId', ''))
    setBalanceDue(0)
  }

  const handleChangeInvoice = e => {
    handleChange(e)
    setBalanceDue(
      (e.target?.balanceDue ? Number(e.target?.balanceDue) : 0) -
        Number(values.paymentReceived)
    )
  }

  const handleChangeReceived = e => {
    if (values.invoiceId) {
      setBalanceDue(
        b => Number(b) + Number(values.paymentReceived) - Number(e.target.value)
      )
    }
    handleChange(e)
  }

  return (
    <SideModal
      width="30%"
      title={isEdit ? 'Edit Payment' : 'Add Payment'}
      closeLink={closeLink || parseToAbsolutePath(routes.payments[view])}
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
          <Container cols="2" isFormContainer>
            <FormControlAutocomplete
              label="Account"
              name="accountId"
              value={values.accountId}
              error={errors.accountId}
              touched={touched.accountId}
              onChange={handleChangeAccount}
              onBlur={handleBlur}
              fullWidth
              marginBottom={false}
              getOptions={getAccountOptions()}
              formControlContainerClass={classes.stretch}
              initialFetchValue={values.accountId}
              disabled={disabledFields.includes('accountId')}
              isRequired
            />
            <FormControlAutocomplete
              label="Invoice"
              name="invoiceId"
              value={values.invoiceId}
              error={errors.invoiceId}
              touched={touched.invoiceId}
              onChange={handleChangeInvoice}
              onBlur={handleBlur}
              fullWidth
              marginBottom={false}
              optionsDependency={values.accountId}
              getOptions={
                !!values.accountId &&
                getOptionsByFieldAndEntity({
                  field: ['invoiceNumber', 'estimateName', 'id'],
                  entity: optionEntity.invoice,
                  transformData: transformDataForInvoice,
                  passIdForNumber: true,
                  options: {
                    accountId: values.accountId
                  }
                })
              }
              formControlContainerClass={classes.stretch}
              initialFetchValue={values.invoiceId}
              disabled={disabledFields.includes('invoiceId')}
              isRequired
            />
            <Container
              cols={
                [
                  paymentMethodValues.creditCard,
                  paymentMethodValues.other
                ].includes(values.paymentMethod)
                  ? 3
                  : 2
              }
              rootClassName={classes.stretch}
              isFormContainer
            >
              <FormControlReactSelect
                label="Payment Method"
                name="paymentMethod"
                value={values.paymentMethod}
                error={errors.paymentMethod}
                touched={touched.paymentMethod}
                options={paymentMethodOptions}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                marginBottom={false}
                isSort={false}
              />
              {values.paymentMethod === paymentMethodValues.other && (
                <FormControlReactSelect
                  label="Payment Processor"
                  name="paymentProcessor"
                  value={values.paymentProcessor}
                  error={errors.paymentProcessor}
                  touched={touched.paymentProcessor}
                  options={paymentProcessorOptions}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  marginBottom={false}
                  isSort={false}
                  isRequired
                />
              )}
              {values.paymentMethod === paymentMethodValues.creditCard ? (
                <>
                  <FormControlReactSelect
                    label="Credit Card Type"
                    name="creditCardType"
                    value={values.creditCardType}
                    error={errors.creditCardType}
                    touched={touched.creditCardType}
                    options={creditCardTypeOptions}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    marginBottom={false}
                    isSort={false}
                    isRequired
                  />
                  <FormControlInput
                    label="CC No. (last 4 digit)"
                    name="paymentSource"
                    value={values.paymentSource}
                    error={errors.paymentSource}
                    touched={touched.paymentSource}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    marginBottom={false}
                    isRequired
                  />
                </>
              ) : values.paymentMethod === paymentMethodValues.check ? (
                <FormControlInput
                  label="Check Number"
                  name="paymentSource"
                  value={values.paymentSource}
                  error={errors.paymentSource}
                  touched={touched.paymentSource}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  marginBottom={false}
                  isRequired
                />
              ) : (
                <FormControlInput
                  label="Transaction Number"
                  name="paymentSource"
                  value={values.paymentSource}
                  error={errors.paymentSource}
                  touched={touched.paymentSource}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  marginBottom={false}
                  isRequired
                />
              )}
            </Container>
            <FormControlNumericInput
              label="Payment Received"
              name="paymentReceived"
              value={values.paymentReceived}
              error={errors.paymentReceived}
              touched={touched.paymentReceived}
              onChange={handleChangeReceived}
              onBlur={handleBlur}
              fullWidth
              min={0.01}
              precision={2}
              marginBottom={false}
              isRequired
            />
            <FormControlInput
              label="Balance Due"
              value={balanceDue}
              fullWidth
              disabled
              marginBottom={false}
            />
            <FormControlInput
              label="Note"
              name="note"
              value={values.note}
              error={errors.note}
              touched={touched.note}
              onChange={handleChange}
              onBlur={handleBlur}
              fullWidth
              marginBottom={false}
              multiline
              isOptional
              formControlContainerClass={classes.stretch}
            />
            <FormControlDatePicker
              label="Payment Date"
              name="paymentDate"
              value={values.paymentDate}
              error={errors.paymentDate}
              touched={touched.paymentDate}
              onChange={handleChange}
              onBlur={handleBlur}
              fullWidth
              marginBottom={false}
              minDate={null}
            />
            <FormControlAutocomplete
              label="Received By"
              name="receivedBy"
              value={values.receivedBy}
              error={errors.receivedBy}
              touched={touched.receivedBy}
              onChange={handleChange}
              onBlur={handleBlur}
              fullWidth
              marginBottom={false}
              getOptions={getUserOptions(null, null, { passIdForNumber: true })}
              initialFetchValue={values.receivedBy}
            />
          </Container>
        </Grid>
      </Grid>
    </SideModal>
  )
}

export default AddEditPayment
