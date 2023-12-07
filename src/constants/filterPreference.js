import { _capitalize } from 'utils/lodash'
import { subtabNames } from './systemDictionary'

export const filterEntityValues = {
  lead: 'Lead',
  account: 'Account',
  contact: 'Contact',
  ticket: 'Ticket',
  opportunity: 'Opportunity',
  estimate: 'Estimate',
  invoice: 'Invoice',
  user: 'User',
  payment: 'Payment',
  activity: 'Activity',
  license: 'License',
  product: 'Product',
  salesTax: 'SalesTax',
  tag: 'Tag',
  email: 'Email',
  reminder: 'Reminder',
  shipping: 'Shipping',
  order: 'Order',
  packageProfile: 'PackageProfile',

  ...Object.entries(subtabNames).reduce((a, [key, value]) => {
    a[value] = _capitalize(key)
    return a
  }, {})
}
