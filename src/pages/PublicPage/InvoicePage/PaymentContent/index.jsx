import { makeStyles } from '@material-ui/core'
import moment from 'moment'

import Scrollbars from 'components/Scrollbars'
import { Card } from 'components/cards'
import {
  BACKEND_DATE_FORMAT,
  DATE_VIEW_FORMAT
} from 'constants/dateTimeFormats'
import iconNames, { iconTypes } from 'constants/iconNames'
import { parseCurrency } from 'utils/generalUtils'
import { getIconClassName } from 'utils/iconUtils'
import StripeContent from './StripeContent'
import {
  paymentGatewayTabs,
  paymentGatewayValues
} from 'constants/paymentGateway'
import AuthorizeNetContent from './AuthorizeNetContent'
import { useCallback, useEffect, useMemo, useState } from 'react'

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1
  },
  container: {
    width: '100%',
    maxWidth: 950,
    margin: '0px auto',
    paddingTop: 15,
    paddingLeft: 10,
    paddingRight: 10
  },
  cardRoot: {
    boxShadow: '0 3px 10px rgb(0 0 0 / 0.2)',
    marginBottom: 20
  },
  summaryContentRoot: {
    display: 'flex',
    width: '100%',
    flexWrap: 'nowrap'
  },
  summaryLeftContent: {
    display: 'flex',
    paddingRight: 20,
    borderRight: '2px solid #dfdfdf',
    alignItems: 'center'
  },
  summaryRightContent: {
    flexGrow: 1,
    padding: '0px 20px'
  },
  invoiceIcon: {
    background: '#1565c0',
    borderRadius: 40,
    width: '2.5em',
    height: '2.5em',
    display: 'grid',
    placeItems: 'center',

    '& i': {
      fontSize: '1.25em',
      color: '#fff'
    }
  },
  invoiceDetails: {
    marginLeft: '15px'
  },
  invoiceNumber: {
    color: '#1565c0',
    fontSize: '0.9em',
    lineHeight: '1.5em'
  },
  invoiceDueDate: {
    fontSize: '0.75em',
    color: '#6b6b6b'
  },
  balanceDueText: {
    color: '#6b6b6b',
    lineHeight: '1.5em',
    fontSize: '0.75em'
  },
  invoiceBalDue: {
    color: '#6b6b6b',
    fontWeight: 'bold',
    fontSize: '0.9em'
  }
}))

const PaymentContent = ({ invoice, onRedirectBack }) => {
  const classes = useStyles()
  const [paymentProcessor, setPaymentProcessor] = useState(
    paymentGatewayValues.stripe
  )

  useEffect(() => {
    if (invoice?.mainPaymentProcessor) {
      setPaymentProcessor(invoice?.mainPaymentProcessor)
    }
  }, [invoice?.mainPaymentProcessor])

  const paymentGatewayList = useMemo(() => {
    return paymentGatewayTabs.sort((a, b) =>
      b.value === invoice?.mainPaymentProcessor ? 1 : -1
    )
  }, [invoice?.mainPaymentProcessor])

  const paymentIndex = useMemo(
    () =>
      paymentGatewayList.findIndex(({ value }) => value === paymentProcessor),
    [paymentGatewayList, paymentProcessor]
  )

  const handleFailed = useCallback(() => {
    if (paymentIndex + 1 < paymentGatewayList.length) {
      setPaymentProcessor(paymentGatewayList[paymentIndex + 1]?.value)
    }
  }, [paymentGatewayList, paymentIndex])

  return (
    <div className={classes.root}>
      <Scrollbars>
        <div className={classes.container}>
          <Card rootClassName={classes.cardRoot}>
            <div className={classes.summaryContentRoot}>
              <div className={classes.summaryLeftContent}>
                <div className={classes.invoiceIcon}>
                  <i
                    className={getIconClassName(
                      iconNames.invoice,
                      iconTypes.solid
                    )}
                  />
                </div>
                <div className={classes.invoiceDetails}>
                  <div className={classes.invoiceNumber}>
                    {invoice?.invoiceNumber || ''}
                  </div>
                  <div className={classes.invoiceDueDate}>
                    {invoice?.dueDate
                      ? moment(invoice?.dueDate, BACKEND_DATE_FORMAT).format(
                          DATE_VIEW_FORMAT
                        )
                      : ''}
                  </div>
                </div>
              </div>
              <div className={classes.summaryRightContent}>
                <div className={classes.balanceDueText}>Balance Due</div>
                <div className={classes.invoiceBalDue}>
                  {parseCurrency(Number(invoice?.balanceDue || 0).toFixed(2))}
                </div>
              </div>
            </div>
          </Card>
          <Card rootClassName={classes.cardRoot}>
            {paymentProcessor === paymentGatewayValues.authorize ? (
              <AuthorizeNetContent
                invoice={invoice}
                onRedirectBack={onRedirectBack}
                onFailed={handleFailed}
                isLast={paymentIndex + 1 === paymentGatewayList.length}
              />
            ) : (
              <StripeContent
                invoice={invoice}
                onRedirectBack={onRedirectBack}
                onFailed={handleFailed}
                isLast={paymentIndex + 1 === paymentGatewayList.length}
              />
            )}
          </Card>
        </div>
      </Scrollbars>
    </div>
  )
}

export default PaymentContent
