import { useCallback } from 'react'
import { useCreateInvoiceAuthorizeNetMutation } from 'api/publicApi'
import AuthorizeNetPayment from 'components/paymentGateway/AuthorizeNetPayment'
import useNotifyAnalyzer from 'hooks/useNotifyAnalyzer'

const AuthorizeNetContent = ({ invoice, onRedirectBack, onFailed, isLast }) => {
  const [createAuthorizeNet, reducer] = useCreateInvoiceAuthorizeNetMutation()

  useNotifyAnalyzer({
    watchArray: [reducer],
    hideNotification: true
  })

  const handlePaymentData = useCallback(
    opaqueData => {
      if (opaqueData) {
        createAuthorizeNet({
          id: invoice?.id,
          data: {
            opaqueDataDescriptor: opaqueData.dataDescriptor,
            opaqueDataValue: opaqueData.dataValue
          }
        })
      }
    },
    [invoice?.id, createAuthorizeNet]
  )

  return (
    <AuthorizeNetPayment
      onPaymentData={handlePaymentData}
      paymentResponse={reducer}
      onRedirectBack={onRedirectBack}
      onFailed={onFailed}
      failedMessage={`Unable to initialize payment${
        isLast ? ', Please try again' : ', Enabling other payment processor'
      }.`}
    />
  )
}

export default AuthorizeNetContent
