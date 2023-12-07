export const estimateStatusValues = {
  draft: 'Draft',
  sent: 'Sent',
  accepted: 'Accepted',
  delivered: 'Delivered',
  requestedChanges: 'Requested Changes',
  rejected: 'Rejected',
  canceledVoided: 'Canceled/Voided'
}

export const estimateStatusOptions = (withAccept = false) => {
  const status = { ...estimateStatusValues }
  if (!withAccept) delete status.accepted
  return [
    ...Object.values(status).map(value => ({
      label: value,
      value
    }))
  ]
}

export const estimateProductItemsInitialValues = {
  productId: '',
  quantity: 1,
  price: '',
  description: '',
  discount: 0
}
