import { useEffect } from 'react'

import { useLazyGetInvoiceStripeSecretQuery } from 'api/publicApi'
import StripePayment from 'components/paymentGateway/StripePayment'

const StripeContent = ({ invoice, onRedirectBack, onFailed, isLast }) => {
  const [getClientSecret, { data, isFetching, error }] =
    useLazyGetInvoiceStripeSecretQuery()

  useEffect(() => {
    if (!!invoice?.id) {
      getClientSecret(50, true)
    }
    //eslint-disable-next-line
  }, [invoice])

  useEffect(() => {
    if (error) {
      onFailed()
    }
    //eslint-disable-next-line
  }, [error])

  return (
    !isFetching && (
      <StripePayment
        clientSecret={data?.clientSecret}
        onRedirectBack={onRedirectBack}
        onFailed={onFailed}
        failedMessage={`Unable to initialize payment${
          isLast ? ', Please try again' : ', Enabling other payment processor'
        }.`}
      />
    )
  )
}

export default StripeContent
