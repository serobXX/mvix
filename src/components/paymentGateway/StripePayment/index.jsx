import { useEffect, useMemo, useState } from 'react'
import { Button, Grid, makeStyles } from '@material-ui/core'
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

import { config } from 'constants/app'
import StripePaymentStatus from './StripePaymentStatus'

const useStyles = makeStyles(() => ({
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

const stripePromise = loadStripe(config.STRIPE_KEY)

const PaymentForm = ({ onRedirectBack, onFailed, failedMessage }) => {
  const classes = useStyles()
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setLoading] = useState(false)
  const [message, setMessage] = useState()
  const [isDisplayStatus, setDisplayStatus] = useState(false)

  useEffect(() => {
    if (!stripe) {
      return
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    )

    if (clientSecret) {
      setDisplayStatus(true)
    } else setDisplayStatus(false)
  }, [stripe])

  const handleSubmit = async e => {
    e.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return
    }

    setLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href
      }
    })
    if (error.type === 'card_error' || error.type === 'validation_error') {
      setMessage(error.message)
    } else {
      setMessage(failedMessage || 'Unable to initialize payment.')
      setTimeout(onFailed, 4000)
    }

    setLoading(false)
  }
  return isDisplayStatus ? (
    <StripePaymentStatus onRedirectBack={onRedirectBack} />
  ) : (
    <form id="payment-form" onSubmit={handleSubmit}>
      {message && <div className={classes.errorMessage}>{message}</div>}

      <PaymentElement
        id="payment-element"
        options={{
          layout: 'tabs'
        }}
      />
      <Grid container justifyContent="flex-end">
        <Button
          type="submit"
          variant="contained"
          className={classes.primaryActionBtn}
          disableRipple
          disableElevation
          disabled={isLoading || !stripe || !elements}
        >
          Pay now
        </Button>
      </Grid>
    </form>
  )
}

const StripePayment = ({
  clientSecret,
  onRedirectBack,
  onFailed,
  failedMessage
}) => {
  const options = useMemo(
    () => ({
      clientSecret: clientSecret
    }),
    [clientSecret]
  )

  return (
    !!options?.clientSecret && (
      <Elements stripe={stripePromise} options={options}>
        <PaymentForm
          onRedirectBack={onRedirectBack}
          onFailed={onFailed}
          failedMessage={failedMessage}
        />
      </Elements>
    )
  )
}

export default StripePayment
