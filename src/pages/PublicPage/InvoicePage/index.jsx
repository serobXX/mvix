import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'

import { CircularLoader } from 'components/loaders'
import { useLazyGetPublicInvoiceQuery } from 'api/publicApi'
import { EmptyPlaceholder } from 'components/placeholder'
import PreviewContent from './PreviewContent'
import PaymentContent from './PaymentContent'

const useStyles = makeStyles(() => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    fontSize: '16px',

    '@media screen and (max-width: 1200px)': {
      fontSize: '14px'
    }
  },
  headerRoot: {
    background: '#1565c0',
    padding: '15px 10px',
    position: 'sticky',
    top: 0,
    left: 0,
    width: '100%'
  },
  headerContainer: {
    width: '100%',
    maxWidth: 950,
    margin: '0px auto',
    '& h4': {
      color: '#fff',
      margin: 0
    }
  }
}))

const InvoicePage = () => {
  const { token } = useParams()
  const classes = useStyles()
  const [isPayContentOpen, setPayContentOpen] = useState(false)

  const [getInvoice, { data: invoice, isFetching, error }] =
    useLazyGetPublicInvoiceQuery()

  useEffect(() => {
    document.body.style.background = '#fff'
    document.body.style.height = '100vh'
  }, [])

  useEffect(() => {
    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    )
    if (clientSecret) {
      setPayContentOpen(true)
    }
  }, [])

  const fetcher = useCallback(() => {
    getInvoice(token)
  }, [getInvoice, token])

  useEffect(() => {
    if (token) {
      fetcher()
    }
    //eslint-disable-next-line
  }, [token])

  const showError = useMemo(
    () =>
      error?.code < 200 ||
      error?.code > 299 ||
      invoice?.isExpied ||
      invoice?.status === 'Accepted',
    [invoice, error?.code]
  )

  const handleRedirectBack = useCallback(() => {
    window.location.href = `${window.location.origin}${window.location.pathname}`
  }, [])

  return (
    <>
      {isFetching && <CircularLoader />}
      {showError ? (
        <EmptyPlaceholder text={'Link Expired'} fullHeight />
      ) : (
        <div className={classes.root}>
          <div className={classNames(classes.headerRoot, 'no-print')}>
            <div className={classes.headerContainer}>
              <h4>Mvix</h4>
            </div>
          </div>
          {isPayContentOpen ? (
            <PaymentContent
              invoice={invoice}
              onRedirectBack={handleRedirectBack}
            />
          ) : (
            <PreviewContent
              invoice={invoice}
              token={token}
              fetcher={fetcher}
              onPayClick={() => setPayContentOpen(true)}
            />
          )}
        </div>
      )}
    </>
  )
}

export default InvoicePage
