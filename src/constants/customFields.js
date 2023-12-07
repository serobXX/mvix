import Yup from 'utils/yup'
import {
  transformDataByForUsers,
  transformDataForCustomFields,
  transformDataForCustomFieldsName
} from 'utils/autocompleteOptions'
import { optionEntity } from './autocompleteOptions'
import { phoneValidationSchema } from './validation'
import { emailField } from './validationMessages'
import customFieldNames from './customFieldNames'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from './iconNames'

export const entityValues = {
  estimate: 'Estimate',
  product: 'Product',
  opportunity: 'Opportunity',
  account: 'Account',
  contact: 'Contact',
  ticket: 'Ticket',
  lead: 'Lead',
  invoice: 'Invoice'
}

export const entityList = [
  {
    label: 'Estimate',
    value: entityValues.estimate,
    icon: getIconClassName(iconNames.estimate),
    color: '#ff5e44'
  },
  {
    label: 'Product',
    value: entityValues.product,
    icon: getIconClassName(iconNames.product),
    color: '#64b5f6'
  },
  {
    label: 'Opportunity',
    value: entityValues.opportunity,
    icon: getIconClassName(iconNames.opportunity),
    color: '#ec407a'
  },
  {
    label: 'Account',
    value: entityValues.account,
    icon: getIconClassName(iconNames.account),
    color: '#7986cb'
  },
  {
    label: 'Contact',
    value: entityValues.contact,
    icon: getIconClassName(iconNames.contact),
    color: '#ba68c8'
  },
  {
    label: 'Lead',
    value: entityValues.lead,
    icon: getIconClassName(iconNames.lead),
    color: '#90a4ae'
  }
]

export const customFieldTypes = {
  container: 'container',
  tab: 'container',
  text: 'text',
  textarea: 'textarea',
  email: 'email',
  phone: 'phone',
  select: 'select',
  multiselect: 'multiselect',
  date: 'date',
  datetime: 'datetime',
  price: 'price',
  bool: 'bool',
  checkbox: 'checkbox',
  number: 'number',
  file: 'file',
  image: 'image',
  lookup: 'lookup',
  json: 'json',
  internal: 'internal'
}

export const customFieldLookupType = {
  leadSource: 'lead_source',
  leadStatus: 'lead_status',
  leadType: 'lead_type',
  solution: 'solution',
  industry: 'industries',
  user: 'users',
  account: 'account',
  opportunity: 'opportunity',
  accountPartnershipStatus: 'account_partnership_status',
  contactAuthority: 'contact_authority',
  contactType: 'contact_type',
  contact: 'contact',
  stage: 'stage'
}

export const lookupTypeToAutoCompleteMapping = {
  [customFieldLookupType.leadSource]: {
    entity: optionEntity.leadSource,
    field: ['name', 'id']
  },
  [customFieldLookupType.leadStatus]: {
    entity: optionEntity.leadStatus,
    field: ['name', 'id']
  },
  [customFieldLookupType.leadType]: {
    entity: optionEntity.leadType,
    field: ['name', 'id']
  },
  [customFieldLookupType.solution]: {
    entity: optionEntity.solution,
    field: ['name', 'id']
  },
  [customFieldLookupType.industry]: {
    entity: optionEntity.industry,
    field: ['name', 'id']
  },
  [customFieldLookupType.user]: {
    entity: optionEntity.user,
    field: ['firstName', 'id', 'lastName'],
    transformData: transformDataByForUsers
  },
  [customFieldLookupType.stage]: {
    entity: optionEntity.stage,
    field: ['name', 'id']
  },
  [customFieldLookupType.accountPartnershipStatus]: {
    entity: optionEntity.accountPartnership,
    field: ['name', 'id']
  },
  [customFieldLookupType.contactType]: {
    entity: optionEntity.contactType,
    field: ['name', 'id']
  },
  [customFieldLookupType.contactAuthority]: {
    entity: optionEntity.contactAuthority,
    field: ['name', 'id']
  },
  [customFieldLookupType.account]: {
    entity: optionEntity.account,
    field: [customFieldNames.accountName, 'id'],
    transformData: transformDataForCustomFields
  },
  [customFieldLookupType.contact]: {
    entity: optionEntity.contact,
    field: [customFieldNames.firstName, customFieldNames.lastName, 'id'],
    transformData: transformDataForCustomFieldsName
  },
  [customFieldLookupType.opportunity]: {
    entity: optionEntity.opportunity,
    field: [customFieldNames.opportunityName, 'id']
  }
}

export const customFieldTypeDetails = {
  [customFieldTypes.container]: {
    title: 'Tab',
    sourceWidth: 2
  },
  [customFieldTypes.textarea]: {
    destinationHeight: 87
  }
}

export const optionsCustomFieldTypes = [
  customFieldTypes.checkbox,
  customFieldTypes.select,
  customFieldTypes.multiselect
]

export const fieldTypeToYupValidation = {
  [customFieldTypes.text]: Yup.string(),
  [customFieldTypes.textarea]: Yup.string(),
  [customFieldTypes.email]: Yup.string().email(emailField),
  [customFieldTypes.phone]: phoneValidationSchema,
  [customFieldTypes.select]: Yup.string(),
  [customFieldTypes.multiselect]: Yup.array(),
  [customFieldTypes.date]: Yup.string(),
  [customFieldTypes.datetime]: Yup.string(),
  [customFieldTypes.price]: Yup.number(),
  [customFieldTypes.bool]: Yup.boolean(),
  [customFieldTypes.checkbox]: Yup.array(),
  [customFieldTypes.number]: Yup.number(),
  [customFieldTypes.lookup]: Yup.string()
}

export const customFieldTableFilters = [
  customFieldTypes.text,
  customFieldTypes.email,
  customFieldTypes.lookup,
  customFieldTypes.multiselect,
  customFieldTypes.number,
  customFieldTypes.phone,
  customFieldTypes.select
]

export const customFieldTableEditors = [
  customFieldTypes.text,
  customFieldTypes.email,
  customFieldTypes.lookup,
  customFieldTypes.multiselect,
  customFieldTypes.number,
  customFieldTypes.phone,
  customFieldTypes.select,
  customFieldTypes.bool,
  customFieldTypes.date,
  customFieldTypes.datetime,
  customFieldTypes.price
]
