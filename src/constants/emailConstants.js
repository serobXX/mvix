import {
  getAccountOptions,
  getContactOptions,
  getEstimateOptions,
  getLeadOptions,
  getOpportunityOptions
} from 'utils/autocompleteOptions'
import { _capitalize } from 'utils/lodash'
import { entityValues } from './customFields'
import { getInitiate } from 'utils/apiUtils'
import { leadApi } from 'api/leadApi'
import { accountApi } from 'api/accountApi'
import { contactApi } from 'api/contactApi'
import { opportunityApi } from 'api/opportunityApi'
import { estimateApi } from 'api/estimateApi'

export const emailEntityType = {
  lead: entityValues.lead,
  account: entityValues.account,
  contact: entityValues.contact,
  opportunity: entityValues.opportunity,
  estimate: entityValues.estimate
}

export const emailEntityOptions = [
  ...Object.values(emailEntityType).map(type => ({
    label: _capitalize(type),
    value: type
  }))
]

export const emailEntityAutoComplete = {
  [emailEntityType.lead]: getLeadOptions(null, null, { passAllFields: true }),
  [emailEntityType.account]: getAccountOptions(null, null, {
    passAllFields: true
  }),
  [emailEntityType.contact]: getContactOptions(null, null, {
    passAllFields: true
  }),
  [emailEntityType.opportunity]: getOpportunityOptions(null, null, {
    passAllFields: true
  }),
  [emailEntityType.estimate]: getEstimateOptions(null, null, {
    passAllFields: true
  })
}

export const emailEntityFetchRecord = {
  [emailEntityType.lead]: getInitiate(leadApi.endpoints.getLeadById),
  [emailEntityType.account]: getInitiate(accountApi.endpoints.getAccountById),
  [emailEntityType.contact]: getInitiate(contactApi.endpoints.getContactById),
  [emailEntityType.opportunity]: getInitiate(
    opportunityApi.endpoints.getOpportunityById
  ),
  [emailEntityType.estimate]: getInitiate(estimateApi.endpoints.getEstimateById)
}
