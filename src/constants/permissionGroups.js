export const permissionTypes = {
  read: 'read',
  create: 'create',
  update: 'update',
  delete: 'delete',
  other: 'other'
}

export const permissionPageGroups = {
  lead: 'lead',
  contact: 'contact',
  ticket: 'ticket',
  account: 'account',
  opportunity: 'opportunity',
  product: 'product',
  estimate: 'estimate'
}

export const customFieldPermissionPageGroups = {
  [permissionPageGroups.lead]: `${permissionPageGroups.lead}CustomField`,
  [permissionPageGroups.contact]: `${permissionPageGroups.contact}CustomField`,
  [permissionPageGroups.account]: `${permissionPageGroups.account}CustomField`,
  [permissionPageGroups.opportunity]: `${permissionPageGroups.opportunity}CustomField`,
  [permissionPageGroups.product]: `${permissionPageGroups.product}CustomField`,
  [permissionPageGroups.estimate]: `${permissionPageGroups.estimate}CustomField`
}

export const customFieldGroups = {
  lead: 'lead',
  contact: 'contact',
  account: 'account',
  product: 'product',
  opportunity: 'opportunity',
  estimate: 'estimate'
}

export const permissionGroupNames = {
  industries: 'Industry',
  solutions: 'Solutions',
  stage: 'Stage',
  lead: 'Lead',
  contact: 'Contact',
  ticket: 'Ticket',
  account: 'Account',
  opportunity: 'Opportunity',
  product: 'Product',
  role: 'Role',
  user: 'User',
  tag: 'Tag',
  leadSource: 'LeadSource',
  leadStatus: 'LeadStatus',
  leadType: 'LeadType',
  license: 'License',
  activity: 'Activity',
  customFields: 'CustomField',
  accountPartnership: 'AccountPartnershipStatus',
  contactType: 'ContactType',
  contactAuthority: 'ContactAuthority',
  estimate: 'Estimate',
  invoice: 'Invoice',
  paymentProfile: 'PaymentProfile',
  payment: 'Payment',
  salesTax: 'SalesTax',
  termsAndConditions: 'TermsAndConditions',
  solutionSet: 'SolutionSet',
  email: 'Email',
  subjectLine: 'SubjectLine',
  reminder: 'Reminder',
  template: 'Template',
  shipping: 'Shipping',
  subscription: 'Subscription'
}

export const leadDictionaryPermissionGroup = [
  permissionGroupNames.industries,
  permissionGroupNames.solutions,
  permissionGroupNames.leadSource,
  permissionGroupNames.leadStatus,
  permissionGroupNames.leadType
]

export const systemDictionaryPermissionGroup = [
  permissionGroupNames.industries,
  permissionGroupNames.solutions,
  permissionGroupNames.leadSource,
  permissionGroupNames.leadStatus,
  permissionGroupNames.leadType,
  permissionGroupNames.accountPartnership,
  permissionGroupNames.contactAuthority,
  permissionGroupNames.contactType,
  permissionGroupNames.stage
]

export const contactDictionaryPermissionGroup = [
  permissionGroupNames.contactType,
  permissionGroupNames.contactAuthority
]
