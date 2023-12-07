import { getIconClassName } from 'utils/iconUtils'
import iconNames from './iconNames'
import { froalaEntityNames } from './froalaConstants'

export const templateEntityValues = {
  invoice: 'Invoice',
  proposal: 'Proposal',
  email: 'Email'
}

export const templateToFroalaEntity = {
  [templateEntityValues.email]: froalaEntityNames.email,
  [templateEntityValues.proposal]: froalaEntityNames.proposal,
  [templateEntityValues.invoice]: froalaEntityNames.invoice
}

export const templateTabs = [
  {
    label: 'Canned Response',
    icon: getIconClassName(iconNames.cannedResponse),
    value: 'cannedResponse'
  },
  {
    label: 'Automated Response',
    icon: getIconClassName(iconNames.automatedResponse),
    value: 'automatedResponse'
  },
  {
    label: 'Email',
    icon: getIconClassName(iconNames.email),
    value: 'email',
    entity: templateEntityValues.email
  },
  {
    label: 'Proposal',
    icon: getIconClassName(iconNames.proposal),
    value: 'proposal',
    entity: templateEntityValues.proposal,
    isSystem: true
  },
  {
    label: 'Invoice',
    icon: getIconClassName(iconNames.invoice),
    value: 'invoice',
    entity: templateEntityValues.invoice,
    isSystem: true
  }
]

export const templateEntityOptions = [
  {
    label: 'Invoice',
    value: templateEntityValues.invoice
  },
  {
    label: 'Proposal',
    value: templateEntityValues.proposal
  },
  {
    label: 'Email',
    value: templateEntityValues.email
  }
]
