export const paymentTermValues = {
  prepay: 'Prepay'
}

export const paymentTermOptions = [
  {
    label: 'Prepay',
    value: 'Prepay'
  },
  {
    label: 'NET7',
    value: 'Net 7'
  },
  {
    label: 'NET15',
    value: 'Net 15'
  },
  {
    label: 'NET30',
    value: 'Net 30'
  },
  {
    label: 'NET45',
    value: 'Net 45'
  },
  {
    label: 'NET60',
    value: 'Net 60'
  },
  {
    label: 'NET90',
    value: 'Net 90'
  }
]

export const invoiceStatusValues = {
  draft: 'Draft',
  paymentPending: 'Payment Pending',
  sent: 'Sent',
  paymentCompleted: 'Payment Completed',
  partiallyPaid: 'Partially Paid',
  termsAccepted: 'Terms Accepted',
  approvedForFullfilment: 'Approved for Fullfilment',
  cancelled: 'Cancelled / Voided',
  closed: 'Closed',
  crossShip: 'Cross Ship',
  open: 'Open',
  shippedNotPaid: 'Shipped (Not Paid)',
  techRefresh: 'Tech Refresh'
}

export const invoiceStatusOptions = [
  ...Object.values(invoiceStatusValues).map(status => ({
    label: status,
    value: status
  }))
]

export const invoiceFilterStatusOptions = [
  ...Object.values(invoiceStatusValues)
    .filter(
      status =>
        ![
          invoiceStatusValues.termsAccepted,
          invoiceStatusValues.approvedForFullfilment,
          invoiceStatusValues.paymentCompleted
        ].includes(status)
    )
    .map(status => ({
      label: status,
      value: status
    }))
]

export const orderTypeValues = {
  newBusiness: 'New business',
  existingBusines: 'Existing business'
}

export const orderTypeOptions = [
  ...Object.values(orderTypeValues).map(type => ({
    label: type,
    value: type
  }))
]
