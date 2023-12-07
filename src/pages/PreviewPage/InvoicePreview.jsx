import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'

import FroalaPreview from 'components/FroalaPreview'
import { CircularLoader } from 'components/loaders'
import { useLazyGetInvoiceByIdQuery } from 'api/invoiceApi'
import { froalaEntityNames } from 'constants/froalaConstants'
import { _get } from 'utils/lodash'

const InvoicePreview = () => {
  const { id } = useParams()

  const [getItem, { data: invoice, isFetching }] = useLazyGetInvoiceByIdQuery()

  useEffect(() => {
    document.body.style.background = '#fff'
    document.body.style.height = '100vh'
  }, [])

  useEffect(() => {
    if (id) {
      getItem(id)
    }
    //eslint-disable-next-line
  }, [id])

  const placeholderData = useMemo(
    () => ({
      invoice: invoice,
      account: invoice?.account,
      contact: invoice?.clientAdmin,
      opportunity: invoice?.opportunity
    }),
    [invoice]
  )

  return (
    <>
      {isFetching && <CircularLoader />}
      <FroalaPreview
        value={_get(invoice, 'defaultTemplate.template', '')}
        previewPlaceholder
        placeholderData={placeholderData}
        entity={froalaEntityNames.invoice}
        isContainerWrap
      />
    </>
  )
}

export default InvoicePreview
