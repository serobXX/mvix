export const tagEntityType = {
  account: 'Account',
  activity: 'Activity',
  contact: 'Contact',
  ticket: 'Ticket',
  device: 'Device',
  estimate: 'Estimate',
  lead: 'Lead',
  opportunity: 'Opportunity',
  product: 'Product',
  user: 'User',
  license: 'License',
  template: 'Template'
}

export const tagEntityOptions = Object.values(tagEntityType).map(entity => ({
  label: entity,
  value: entity
}))
