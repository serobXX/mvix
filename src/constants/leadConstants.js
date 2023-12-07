import customFieldNames from './customFieldNames'

export const leadStatusColors = {
  'Not Qualified': {
    background: 'rgb(219, 222, 227)',
    color: 'rgb(50, 58, 69)'
  },
  'Pre-Qualified': {
    background: 'rgb(254, 235, 141)',
    color: 'rgb(127, 107, 0)'
  },
  'Pre Qualified': {
    background: 'rgb(254, 235, 141)',
    color: 'rgb(127, 107, 0)'
  },
  'Not Contacted': {
    background: 'rgb(177, 184, 247)',
    color: 'rgb(64, 70, 124)'
  },
  'Lost Lead': {
    background: 'rgb(240, 168, 180)',
    color: 'rgb(122, 31, 47)'
  },
  'Junk Lead': {
    background: 'rgb(204, 217, 255)',
    color: 'rgb(42, 54, 91)'
  },
  Contacted: {
    background: 'rgb(204, 231, 159)',
    color: 'rgb(81, 115, 26)'
  },
  'Contact in Future': {
    background: 'rgb(191, 179, 238)',
    color: 'rgb(78, 44, 218)'
  },
  'Attempted to Contact': {
    background: 'rgb(182, 213, 226)',
    color: 'rgb(23, 100, 131)'
  }
}

export const accountMappingList = {
  [customFieldNames.accountName]: {
    label: 'Account Name',
    value: customFieldNames.leadCompany
  },
  [customFieldNames.phone]: {
    label: 'Phone',
    value: customFieldNames.leadPhone
  },
  [customFieldNames.website]: {
    label: 'Website',
    value: customFieldNames.website
  },
  [customFieldNames.leadSource]: {
    label: 'Lead Source',
    value: customFieldNames.leadSource
  },
  [customFieldNames.leadSolutionInterest]: {
    label: 'Solution Interest',
    value: customFieldNames.leadSolutionInterest
  },
  [customFieldNames.leadIndustry]: {
    label: 'Industry',
    value: customFieldNames.leadIndustry
  },
  [customFieldNames.leadDescription]: {
    label: 'Description',
    value: customFieldNames.description
  },
  [customFieldNames.addresses]: {
    label: 'Addresses',
    value: customFieldNames.addresses
  },
  [customFieldNames.linkedinUrl]: {
    label: 'LinkedIn URL',
    value: customFieldNames.linkedinUrl
  },
  [customFieldNames.accountOwner]: {
    label: 'Owner',
    value: customFieldNames.leadOwner
  }
}

export const contactMappingList = {
  [customFieldNames.mobile]: {
    label: 'Mobile',
    value: customFieldNames.mobile
  },
  [customFieldNames.phone]: {
    label: 'Phone',
    value: customFieldNames.leadPhone
  },
  [customFieldNames.leadTitle]: {
    label: 'Leaad Title',
    value: customFieldNames.leadTitle
  },
  [customFieldNames.leadSource]: {
    label: 'Lead Source',
    value: customFieldNames.leadSource
  },
  [customFieldNames.leadSolutionInterest]: {
    label: 'Solution Interest',
    value: customFieldNames.leadSolutionInterest
  },
  [customFieldNames.leadIndustry]: {
    label: 'Industry',
    value: customFieldNames.leadIndustry
  },
  [customFieldNames.leadDescription]: {
    label: 'Description',
    value: customFieldNames.description
  },
  [customFieldNames.addresses]: {
    label: 'Addresses',
    value: customFieldNames.addresses
  },
  [customFieldNames.linkedinUrl]: {
    label: 'LinkedIn URL',
    value: customFieldNames.linkedinUrl
  },
  [customFieldNames.contactOwner]: {
    label: 'Owner',
    value: customFieldNames.leadOwner
  }
}

export const conflictActionNames = {
  addToExisting: 'addToExisting',
  createNew: 'createNew'
}
