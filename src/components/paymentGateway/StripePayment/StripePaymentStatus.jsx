import { useEffect, useState } from 'react'
import { useStripe } from '@stripe/react-stripe-js'

import PaymentStatus from '../components/PaymentStatus'

const StripePaymentStatus = ({ onRedirectBack }) => {
  const [status, setStatus] = useState()

  const stripe = useStripe()

  useEffect(() => {
    if (!stripe) {
      return
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    )

    if (!clientSecret) {
      return
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case 'succeeded':
          setStatus('success')
          break
        case 'processing':
          setStatus('processing')
          break
        case 'requires_payment_method':
          setStatus('failed')
          break
        default:
          setStatus('error')
          break
      }
    })
    //eslint-disable-next-line
  }, [stripe])

  return <PaymentStatus status={status} onRedirectBack={onRedirectBack} />
}

export default StripePaymentStatus
