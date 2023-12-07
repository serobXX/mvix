import iconNames from './iconNames'

export const paymentMethodValues = {
  creditCard: 'Credit Card',
  check: 'Check',
  ach: 'ACH',
  wire: 'Wire',
  other: 'Other'
}

export const paymentMethodOptions = [
  ...Object.values(paymentMethodValues).map(value => ({
    label: value,
    value
  }))
]

export const creditCardTypeValues = {
  amex: 'AMEX',
  visa: 'VISA',
  master: 'MASTERCARD',
  discover: 'DISCOVER'
}

export const creditCardTypeOptions = [
  ...Object.values(creditCardTypeValues).map(value => ({
    label: value,
    value
  }))
]

export const paymentMethodIcons = {
  [paymentMethodValues.creditCard]: iconNames.creditCardPayment,
  [paymentMethodValues.ach]: iconNames.achPayment,
  [paymentMethodValues.check]: iconNames.checkPayment,
  [paymentMethodValues.other]: iconNames.otherPayment,
  [paymentMethodValues.wire]: iconNames.wirePayment
}

export const creditCardTypeIcons = {
  [creditCardTypeValues.amex]: iconNames.amexCreditCard,
  [creditCardTypeValues.master]: iconNames.masterCreditCard,
  [creditCardTypeValues.discover]: iconNames.discoverCreditCard,
  [creditCardTypeValues.visa]: iconNames.visaCreditCard
}

export const paymentProcessorValues = {
  stripe: 'STRIPE',
  authorize: 'AUTHORIZE',
  paypal: 'PAYPAL'
}

export const paymentProcessorOptions = [
  ...Object.values(paymentProcessorValues).map(value => ({
    label: value,
    value
  }))
]

export const paymentProcessorIcons = {
  [paymentProcessorValues.stripe]: iconNames.stripeProcessor,
  [paymentProcessorValues.paypal]: iconNames.paypalProcessor
}
