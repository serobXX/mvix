import { getIconClassName } from 'utils/iconUtils'
import iconNames, { iconTypes } from './iconNames'

export const paymentGatewayValues = {
  stripe: 'STRIPE',
  authorize: 'AUTHORIZE'
}

export const paymentGatewayTabs = [
  {
    label: 'Stripe',
    icon: getIconClassName(iconNames.stripeProcessor, iconTypes.brands),
    value: paymentGatewayValues.stripe
  },
  {
    label: 'Authorize.net',
    icon: getIconClassName(iconNames.payment),
    value: paymentGatewayValues.authorize
  }
]

export const paymentTypeValues = {
  card: 'card',
  ach: 'ach'
}

export const paymentTypeTabs = [
  {
    label: 'Credit Card',
    value: paymentTypeValues.card,
    icon: getIconClassName(iconNames.creditCardPayment)
  },
  {
    label: 'ACH',
    value: paymentTypeValues.ach,
    icon: getIconClassName(iconNames.achPayment)
  }
]
