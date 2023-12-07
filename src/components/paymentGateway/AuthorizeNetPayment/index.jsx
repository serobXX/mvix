import { useCallback, useEffect, useState } from 'react'
import Payment from 'payment'
import { useFormik } from 'formik'
import Yup from 'utils/yup'

import {
  getAuthorizeAuthData,
  getAuthorizeBankData,
  getAuthorizeCardData,
  loadAuthorizeScript
} from 'utils/paymentGatewayUtils'
import { Button, Grid, makeStyles } from '@material-ui/core'
import { CardTab } from 'components/tabs'
import { paymentTypeTabs, paymentTypeValues } from 'constants/paymentGateway'
import CreditCardForm from './CreditCardForm'
import PaymentStatus from '../components/PaymentStatus'
import { _get } from 'utils/lodash'
import BankForm from './BankForm'

const useStyles = makeStyles(() => ({
  root: {
    width: '100%'
  },
  primaryActionBtn: {
    background: '#1b75dc',
    color: '#fff',
    textTransform: 'capitalize',
    marginTop: 20,
    fontSize: '0.875em',
    '&:hover': {
      background: '#1760b3'
    }
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10
  }
}))

loadAuthorizeScript()

const initialValues = {
  paymentType: paymentTypeValues.card,
  card: {
    cardNumber: '',
    expire: '',
    cardCode: ''
  },
  bank: {
    accountNumber: '',
    routingNumber: '',
    nameOnAccount: '',
    accountType: 'checking'
  }
}

const validationSchema = Yup.object().shape({
  paymentType: Yup.string(),
  card: Yup.object().when('paymentType', {
    is: paymentTypeValues.card,
    then: () =>
      Yup.object().shape({
        cardNumber: Yup.number()
          .required('Your card number is incomplete.')
          .test('creditCard', 'Your card number is invalid.', value => {
            return Payment.fns.validateCardNumber(value)
          }),
        expire: Yup.string()
          .required('Your card expiry is incomplete.')
          .test('creditCard', 'Your card expiry is invalid.', value => {
            return Payment.fns.validateCardExpiry(value)
          }),
        cardCode: Yup.number()
          .required('Your card cvc is incomplete.')
          .test('creditCard', 'Your card cvc is invalid.', function (value) {
            return Payment.fns.validateCardCVC(
              value,
              Payment.fns.cardType(this.parent.cardNumber)
            )
          })
      })
  }),
  bank: Yup.object().when('paymentType', {
    is: paymentTypeValues.ach,
    then: () =>
      Yup.object().shape({
        accountNumber: Yup.string()
          .required('Your account number is incomplete.')
          .max(17, 'Your account number is invalid.')
          .test('onlyNumeric', 'Your account number is invalid.', value => {
            return /^[\d]*$/.test(value)
          }),
        routingNumber: Yup.string()
          .required('Your aba routing number is incomplete.')
          .min(9, 'Your aba routing number is incomplete.')
          .max(9, 'Your aba routing number is incomplete.')
          .test('onlyNumeric', 'Your account number is invalid.', value => {
            return /^[\d]*$/.test(value)
          }),
        nameOnAccount: Yup.string()
          .required('Your name on account is incomplete.')
          .max(22, 'Your name on account should less than 22 characters.'),
        accountType: Yup.string().required('Your account type is incomplete.')
      })
  })
})

const AuthorizeNetPayment = ({
  onRedirectBack,
  onPaymentData,
  paymentResponse,
  onFailed,
  failedMessage
}) => {
  const classes = useStyles()
  const [isLoading, setLoading] = useState(false)
  const [message, setMessage] = useState()
  const [isDisplayStatus, setDisplayStatus] = useState(false)
  const [status, setStatus] = useState()

  const handleResponseHandler = useCallback(
    response => {
      if (response.messages.resultCode === 'Error') {
        if (!!response.messages?.message?.length) {
          setMessage(failedMessage || 'Unable to initialize payment.')
          setLoading(false)
          setTimeout(onFailed, 4000)
        }
      } else {
        onPaymentData && onPaymentData(response.opaqueData)
      }
    },
    [onPaymentData, onFailed, failedMessage]
  )

  const onSubmit = useCallback(
    values => {
      const secureData = {}
      const authData = getAuthorizeAuthData()
      setLoading(true)

      secureData.authData = authData

      if (values.paymentType === paymentTypeValues.ach) {
        const bankData = getAuthorizeBankData(values.bank)
        secureData.bankData = bankData
      } else {
        const cardData = getAuthorizeCardData(values.card)
        secureData.cardData = cardData
      }

      window.Accept?.dispatchData &&
        window.Accept.dispatchData(secureData, handleResponseHandler)
    },
    [handleResponseHandler]
  )

  const {
    values,
    errors,
    touched,
    handleBlur,
    setFieldValue,
    handleChange,
    handleSubmit,
    handleReset
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit
  })

  useEffect(() => {
    if (
      _get(paymentResponse, 'data.messages.resultCode') ||
      paymentResponse?.isError
    ) {
      setLoading(false)
      setDisplayStatus(true)
      handleReset()

      if (_get(paymentResponse, 'data.messages.resultCode') === 'Ok') {
        setStatus('success')
      } else if (
        _get(paymentResponse, 'data.messages.resultCode') === 'Error' ||
        paymentResponse?.isError
      ) {
        setStatus('failed')
      } else {
        setStatus('processing')
      }
    }
    //eslint-disable-next-line
  }, [paymentResponse])

  const handleSubmitValues = event => {
    event.preventDefault()
    handleSubmit()
  }

  return isDisplayStatus ? (
    <PaymentStatus status={status} onRedirectBack={onRedirectBack} />
  ) : (
    <form className={classes.root} onSubmit={handleSubmitValues}>
      {message && <div className={classes.errorMessage}>{message}</div>}
      <CardTab
        tabs={paymentTypeTabs}
        value={values.paymentType}
        onChange={tab => setFieldValue('paymentType', tab)}
      />
      {values.paymentType === paymentTypeValues.card && (
        <CreditCardForm
          name="card"
          values={values.card}
          errors={errors?.card || {}}
          touched={touched?.card || {}}
          handleChange={handleChange}
          handleBlur={handleBlur}
        />
      )}
      {values.paymentType === paymentTypeValues.ach && (
        <BankForm
          name="bank"
          values={values.bank}
          errors={errors?.bank || {}}
          touched={touched?.bank || {}}
          handleChange={handleChange}
          handleBlur={handleBlur}
        />
      )}
      <Grid container justifyContent="flex-end">
        <Button
          type="submit"
          variant="contained"
          className={classes.primaryActionBtn}
          disableRipple
          disableElevation
          disabled={isLoading}
        >
          Pay now
        </Button>
      </Grid>
    </form>
  )
}

export default AuthorizeNetPayment
