import React, { useCallback, useMemo } from 'react'
import { makeStyles } from '@material-ui/core'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'

import ListBaseCard from './ListBaseCard'
import { getIconClassName } from 'utils/iconUtils'
import iconNames, { iconTypes } from 'constants/iconNames'
import { parseCurrency } from 'utils/generalUtils'
import { DATE_VIEW_FORMAT } from 'constants/dateTimeFormats'
import { routes } from 'constants/routes'
import Icon from 'components/icons/Icon'
import { useAddPaymentMutation } from 'api/paymentApi'
import apiCacheKeys from 'constants/apiCacheKeys'
import useNotifyAnalyzer from 'hooks/useNotifyAnalyzer'
import { notifyLabels } from 'constants/notifyAnalyzer'
import { convertToPluralize } from 'utils/pluralize'
import {
  creditCardTypeIcons,
  paymentMethodIcons,
  paymentMethodValues,
  paymentProcessorIcons
} from 'constants/payment'

const useStyles = makeStyles(({ typography, type, fontSize }) => ({
  addIcon: {
    ...typography.darkText[type],
    fontSize: fontSize.big
  }
}))

const getProfileIcon = ({
  paymentMethod,
  creditCardType,
  paymentProcessor
}) => {
  if (
    paymentMethod === paymentMethodValues.creditCard &&
    creditCardTypeIcons[creditCardType]
  ) {
    return getIconClassName(
      creditCardTypeIcons[creditCardType],
      iconTypes.brands
    )
  } else if (
    paymentMethod === paymentMethodValues.other &&
    paymentProcessorIcons[paymentProcessor]
  ) {
    return getIconClassName(
      paymentProcessorIcons[paymentProcessor],
      iconTypes.brands
    )
  }
  return getIconClassName(paymentMethodIcons[paymentMethod], iconTypes.duotone)
}

const PaymentCard = ({
  data,
  parentUrl = '/',
  invoiceId,
  accountId,
  balanceDue,
  permission,
  fetcher
}) => {
  const navigate = useNavigate()
  const classes = useStyles()

  const [, post] = useAddPaymentMutation({
    fixedCacheKey: apiCacheKeys.payment.add
  })

  useNotifyAnalyzer({
    fetcher,
    entityName: 'Payment',
    watchArray: [post],
    labels: [notifyLabels.add]
  })

  const rowItems = useMemo(
    () => [
      {
        icon: getIconClassName(iconNames.payment, iconTypes.duotone),
        name: 'paymentName',
        tooltip: 'Payment Name'
      },
      {
        icon: (_, payment) => getProfileIcon(payment),
        name: 'paymentMethod',
        tooltip: (paymentMethod, { creditCardType, paymentProcessor }) => {
          if (paymentMethod === paymentMethodValues.creditCard)
            return `${creditCardType} Payment`
          else if (paymentMethod === paymentMethodValues.other)
            return `${paymentProcessor} Payment`
          else return `${paymentMethod} Payment`
        }
      },
      {
        icon: getIconClassName(iconNames.hashtag, iconTypes.duotone),
        name: 'paymentSource',
        tooltip: paymentMethod =>
          paymentMethod === paymentMethodValues.creditCard
            ? 'Last 4 digit Credit Card Number'
            : paymentMethod === paymentMethodValues.check
            ? 'Check Number'
            : 'Transaction Number'
      },
      {
        icon: getIconClassName(iconNames.date, iconTypes.duotone),
        name: 'paymentDate',
        tooltip: 'Received Date'
      },
      {
        icon: getIconClassName(iconNames.dollarSign, iconTypes.duotone),
        name: 'paymentReceived',
        tooltip: 'Amount Received'
      },
      {
        icon: getIconClassName(iconNames.salesPerson, iconTypes.duotone),
        name: 'receivedBy',
        tooltip: 'Received By'
      }
    ],
    []
  )

  const paymentData = useMemo(
    () =>
      data.map(
        ({
          paymentName,
          paymentReceived,
          paymentDate,
          paymentMethod,
          receivedBy,
          creditCardType,
          paymentProcessor,
          paymentSource
        }) => ({
          paymentName: paymentName,
          paymentReceived: parseCurrency(paymentReceived),
          paymentDate: moment(paymentDate).format(DATE_VIEW_FORMAT),
          paymentMethod: paymentMethod,
          receivedBy: `${receivedBy?.first_name || ''} ${
            receivedBy?.last_name || ''
          }`,
          creditCardType,
          paymentProcessor,
          paymentSource
        })
      ),
    [data]
  )

  const handleRequestTextClick = useCallback(() => {
    if (permission.create) {
      navigate(routes.payments.toDetailAdd(parentUrl), {
        state: {
          invoiceId,
          accountId,
          balanceDue
        }
      })
    }
  }, [navigate, parentUrl, invoiceId, accountId, permission, balanceDue])

  const paymentTotal = useMemo(
    () =>
      !!data?.length
        ? data.reduce((a, b) => a + Number(b.paymentReceived), 0).toFixed(2)
        : 0,
    [data]
  )

  return (
    <ListBaseCard
      title="Payments"
      titleIcon={getIconClassName(iconNames.payment, iconTypes.duotone)}
      rowItems={rowItems}
      data={paymentData}
      emptyText="No Payment Received"
      emptyRequestText={permission.create && 'Click to add payments'}
      onRequestTextClick={handleRequestTextClick}
      iconButtonComponent={
        !!paymentData?.length &&
        permission.create && (
          <Icon
            icon={getIconClassName(iconNames.gridCardAdd)}
            onClick={handleRequestTextClick}
            className={classes.addIcon}
          />
        )
      }
      showFooter
      footerLeftText={`${paymentData.length} ${convertToPluralize(
        'Payment',
        paymentData.length
      )}`}
      footerRightText={parseCurrency(paymentTotal)}
    />
  )
}

PaymentCard.defaultProps = {
  data: []
}

export default PaymentCard
