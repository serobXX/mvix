import { _camelCase } from 'utils/lodash'

const commonKeys = {
  add: 'add',
  update: 'update',
  delete: 'delete',
  itemById: 'itemById'
}

const generateKeys = entity => {
  return Object.entries(commonKeys).reduce((a, [key, value]) => {
    a[key] = _camelCase(`${entity} ${value}`)
    return a
  }, {})
}

const apiCacheKeys = {
  me: 'me',
  role: {
    ...generateKeys('role'),
    updatePermission: 'role updatePermission'
  },
  user: generateKeys('user'),
  tag: generateKeys('tag'),
  leadIndustry: generateKeys('leadIndustry'),
  leadSource: generateKeys('leadSource'),
  leadStatus: generateKeys('leadStatus'),
  leadSolution: generateKeys('leadSolution'),
  leadType: generateKeys('leadType'),
  opportunityStage: generateKeys('opportunityStage'),
  license: generateKeys('license'),
  activity: generateKeys('activity'),
  accountPartnership: generateKeys('accountPartnership'),
  lead: {
    ...generateKeys('lead'),
    convertTo: 'convertTo'
  },
  account: generateKeys('account'),
  contactType: generateKeys('contactType'),
  contactAuthority: generateKeys('contactAuthority'),
  contact: generateKeys('contact'),
  ticket: generateKeys('ticket'),
  opportunity: generateKeys('opportunity'),
  product: generateKeys('product'),
  estimate: generateKeys('estimate'),
  invoice: generateKeys('invoice'),
  paymentProfile: generateKeys('paymentProfile'),
  payment: generateKeys('payment'),
  salesTax: generateKeys('salesTax'),
  preference: generateKeys('preference'),
  termsAndConditions: generateKeys('termsAndConditions'),
  accountDemo: generateKeys('accountDemo'),
  accountTraining: generateKeys('accountTraining'),
  solutionSet: generateKeys('solutionSet'),
  email: generateKeys('email'),
  subjectLine: generateKeys('subjectLine'),
  reminder: generateKeys('reminder'),
  template: generateKeys('template'),
  packageProfile: generateKeys('packageProfile')
}

export default apiCacheKeys
