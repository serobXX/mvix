import { titleCase } from 'title-case'
import iconNames from './iconNames'

export const relatedEntityType = {
  invoice: 'Invoice',
  subscription: 'Subscription'
}

export const relatedEntityIcons = {
  [relatedEntityType.invoice]: iconNames.invoice,
  [relatedEntityType.subscription]: iconNames.subscription
}

export const reminderName = 'Invoice Reminder 1'

export const relatedEntityOptions = [
  ...Object.values(relatedEntityType).map(type => ({
    label: type,
    value: type
  }))
]

export const remindEntityValues = {
  contact: 'Contact',
  account: 'Account',
  me: 'Me'
}

export const remindEntityOptions = [
  ...Object.values(remindEntityValues).map(type => ({
    label: type,
    value: type
  }))
]

export const remindTypeValues = {
  before: 'before',
  after: 'after'
}

export const remindTypeOptions = [
  ...Object.values(remindTypeValues).map(type => ({
    label: type,
    value: type
  }))
]

export const remindDateValues = {
  invoiceDate: 'invoice date',
  subscriptionDate: 'subscription date',
  renewalDate: 'renewal date',
  dueDate: 'due date',
  expectedPaymentDate: 'expected payment date'
}

export const remindDateOptions = [
  ...Object.values(remindDateValues).map(type => ({
    label: titleCase(type),
    value: type
  }))
]

export const senderOptions = [
  {
    label: 'Mvix | Accounts Receivables<ar@mvix.com>',
    value: 'ar@mvix.com'
  }
]
