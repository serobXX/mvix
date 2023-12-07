export const paginationViews = {
  listView: 'listView',
  gridView: 'gridView'
}

export const paginationValuesByView = {
  [paginationViews.listView]: [50, 100, 250, 500],
  [paginationViews.gridView]: [60, 120, 240, 480]
}

export const tagPaginationValuesByView = {
  [paginationValuesByView.listView]: [50, 100]
}

export const tableEntities = {
  user: 'User',
  lead: 'Lead',
  account: 'Account',
  contact: 'Contact',
  ticket: 'ticket',
  license: 'License',
  activity: 'Activity',
  opportunity: 'Opportunity',
  product: 'Product',
  estimate: 'Estimate',
  invoice: 'Invoice',
  paymentProfile: 'PaymentProfile',
  payment: 'Payment',
  salesTax: 'SalesTax',
  email: 'Email',
  reminder: 'Reminder',
  packageProfile: 'PackageProfile'
}

export const updateFieldName = {
  owner: 'owner',
  tag: 'tag',
  status: 'status',
  account: 'account',
  stage: 'stage',
  estimateStatus: 'estimateStatus'
}
