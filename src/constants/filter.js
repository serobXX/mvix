import { getIconClassName } from 'utils/iconUtils'
import customFieldNames from './customFieldNames'
import { customFieldTypes } from './customFields'
import entityConstants from './entityConstants'
import iconNames from './iconNames'

import containsIcon from '/src/assets/icons/contains-icon.svg'
import notContainsIcon from '/src/assets/icons/not-contains-icon.svg'
import notNullIcon from '/src/assets/icons/not-null-icon.svg'
import startsWithIcon from '/src/assets/icons/starts-with-icon.svg'
import endsWithIcon from '/src/assets/icons/ends-with-icon.svg'

export const tagLibraryInitialFilter = {
  tag: '',
  entityType: ''
}

export const systemDictionaryInitialFilter = {
  name: '',
  status: ''
}

export const leadDictionaryInitialFilter = {
  name: '',
  status: ''
}

export const opportunityStageInitialFilter = {
  name: '',
  status: ''
}

export const accountPartnershipInitialFilter = {
  name: '',
  status: ''
}

export const contactDictionaryInitialFilter = {
  name: '',
  status: ''
}

export const productLibraryInitialFilter = {
  [customFieldNames.productName]: '',
  [customFieldNames.productCategory]: '',
  status: '',
  tags: []
}

export const filterInitialState = {
  [entityConstants.TagLibrary]: tagLibraryInitialFilter,
  [entityConstants.SystemDictionary]: systemDictionaryInitialFilter,
  [entityConstants.LeadDictionary]: leadDictionaryInitialFilter,
  [entityConstants.OpportunityStage]: opportunityStageInitialFilter,
  [entityConstants.AccountPartnership]: accountPartnershipInitialFilter,
  [entityConstants.ContactDictionary]: contactDictionaryInitialFilter,
  [entityConstants.ProductLibrary]: productLibraryInitialFilter
}

export const filterTypeValues = {
  string: 'string',
  number: 'number',
  phone: 'phone',
  date: 'date',
  select: 'select',
  lookup: 'lookup'
}

export const customFieldTypeToFilterType = {
  [customFieldTypes.text]: filterTypeValues.string,
  [customFieldTypes.email]: filterTypeValues.string,
  [customFieldTypes.number]: filterTypeValues.number,
  [customFieldTypes.select]: filterTypeValues.select,
  [customFieldTypes.multiselect]: filterTypeValues.select,
  [customFieldTypes.phone]: filterTypeValues.phone,
  [customFieldTypes.lookup]: filterTypeValues.lookup
}

const opertorsOptions = {
  contains: {
    label: 'Contains',
    value: 'contains',
    img: containsIcon
  },
  notContains: {
    label: 'Does Not Contain',
    value: 'not_contains',
    img: notContainsIcon
  },
  equals: {
    label: 'Equals',
    value: 'equals',
    icon: getIconClassName(iconNames.equalTo)
  },
  notEqual: {
    label: 'Not Equal',
    value: 'not_equal',
    icon: getIconClassName(iconNames.notEqualTo)
  },
  startsWith: {
    label: 'Starts with',
    value: 'starts_with',
    img: startsWithIcon
  },
  endsWith: {
    label: 'Ends with',
    value: 'ends_with',
    img: endsWithIcon
  },
  blank: {
    label: 'Blank',
    value: 'blank',
    icon: getIconClassName(iconNames.blankContent)
  },
  notBlank: {
    label: 'Not Blank',
    value: 'not_blank',
    img: notNullIcon
  },
  greaterThan: {
    label: 'Greater than',
    value: '>',
    icon: getIconClassName(iconNames.greaterThan)
  },
  lessThan: {
    label: 'Less than',
    value: '<',
    icon: getIconClassName(iconNames.lessThan)
  },
  greaterThanEqualTo: {
    label: 'Greater than or equals',
    value: '>=',
    icon: getIconClassName(iconNames.greaterThanEqual)
  },
  lessThanEqualTo: {
    label: 'Less than or equals',
    value: '<=',
    icon: getIconClassName(iconNames.lessThanEqual)
  }
}

export const filterTypeOperators = {
  [filterTypeValues.string]: [
    opertorsOptions.contains,
    opertorsOptions.notContains,
    opertorsOptions.equals,
    opertorsOptions.notEqual,
    opertorsOptions.startsWith,
    opertorsOptions.endsWith,
    opertorsOptions.blank,
    opertorsOptions.notBlank
  ],
  [filterTypeValues.number]: [
    opertorsOptions.equals,
    opertorsOptions.notEqual,
    opertorsOptions.lessThan,
    opertorsOptions.lessThanEqualTo,
    opertorsOptions.greaterThan,
    opertorsOptions.greaterThanEqualTo,
    opertorsOptions.blank,
    opertorsOptions.notBlank
  ],
  [filterTypeValues.phone]: [
    opertorsOptions.contains,
    opertorsOptions.notContains,
    opertorsOptions.equals,
    opertorsOptions.notEqual,
    opertorsOptions.startsWith,
    opertorsOptions.endsWith,
    opertorsOptions.blank,
    opertorsOptions.notBlank
  ],
  [filterTypeValues.select]: [
    opertorsOptions.equals,
    opertorsOptions.notEqual,
    opertorsOptions.blank,
    opertorsOptions.notBlank
  ],
  [filterTypeValues.lookup]: [opertorsOptions.equals, opertorsOptions.notEqual]
}

export const comparisonValues = {
  and: 'AND',
  or: 'OR'
}

export const comparisonOptions = [
  ...Object.values(comparisonValues).map(value => ({
    label: value,
    value
  }))
]
