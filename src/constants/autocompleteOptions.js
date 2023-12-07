import { accountApi } from 'api/accountApi'
import { accountPartnershipApi } from 'api/accountPartnershipApi'
import { activityApi } from 'api/activityApi'
import { contactApi } from 'api/contactApi'
import { contactAuthorityApi } from 'api/contactDicitionary/contactAuthority'
import { contactTypeApi } from 'api/contactDicitionary/contactType'
import { estimateApi } from 'api/estimateApi'
import { invoiceApi } from 'api/invoiceApi'
import { leadApi } from 'api/leadApi'
import { industryApi } from 'api/leadDictionary/industry'
import { leadSourceApi } from 'api/leadDictionary/leadSource'
import { leadStatusApi } from 'api/leadDictionary/leadStatus'
import { leadTypeApi } from 'api/leadDictionary/leadType'
import { solutionApi } from 'api/leadDictionary/solution'
import { opportunityApi } from 'api/opportunityApi'
import { opportunityStageApi } from 'api/opportunityStageApi'
import { packageProfileApi } from 'api/packageProfileApi'
import { paymentApi } from 'api/paymentApi'
import { paymentProfileApi } from 'api/paymentProfile'
import { productApi } from 'api/productApi'
import { salesTaxApi } from 'api/salesTaxApi'
import { templateApi } from 'api/templateApi'
import { userApi } from 'api/userApi'
import { getInitiate } from 'utils/apiUtils'

export const optionEntity = {
  user: 'user',
  leadSource: 'leadSource',
  leadType: 'leadType',
  leadStatus: 'leadStatus',
  industry: 'industry',
  solution: 'solution',
  account: 'account',
  opportunity: 'opportunity',
  activity: 'activity',
  stage: 'stage',
  accountPartnership: 'accountPartnership',
  lead: 'lead',
  contact: 'contact',
  contactType: 'contactType',
  device: 'device',
  category: 'category',
  contactAuthority: 'contactAuthority',
  product: 'product',
  estimate: 'estimate',
  invoice: 'invoice',
  paymentProfile: 'paymentProfile',
  payment: 'payment',
  salesTax: 'salesTax',
  template: 'template',
  packageProfile: 'packageProfile'
}

export const serviceOptions = {
  [optionEntity.user]: getInitiate(userApi.endpoints.getUsers),
  [optionEntity.leadSource]: getInitiate(
    leadSourceApi.endpoints.getLeadSources
  ),
  [optionEntity.leadType]: getInitiate(leadTypeApi.endpoints.getLeadTypes),
  [optionEntity.leadStatus]: getInitiate(leadStatusApi.endpoints.getLeadStatus),
  [optionEntity.industry]: getInitiate(industryApi.endpoints.getIndustries),
  [optionEntity.solution]: getInitiate(solutionApi.endpoints.getSolutions),
  [optionEntity.activity]: getInitiate(activityApi.endpoints.getActivities),
  [optionEntity.stage]: getInitiate(opportunityStageApi.endpoints.getStages),
  [optionEntity.accountPartnership]: getInitiate(
    accountPartnershipApi.endpoints.getPartnership
  ),
  [optionEntity.lead]: getInitiate(leadApi.endpoints.getLeads),
  [optionEntity.account]: getInitiate(accountApi.endpoints.getAccounts),
  [optionEntity.contact]: getInitiate(contactApi.endpoints.getContacts),
  [optionEntity.device]: getInitiate(accountApi.endpoints.getDevices),
  [optionEntity.category]: getInitiate(accountApi.endpoints.getCategories),
  [optionEntity.contactType]: getInitiate(
    contactTypeApi.endpoints.getContactTypes
  ),
  [optionEntity.contactAuthority]: getInitiate(
    contactAuthorityApi.endpoints.getContactAuthorities
  ),
  [optionEntity.product]: getInitiate(productApi.endpoints.getProducts),
  [optionEntity.opportunity]: getInitiate(
    opportunityApi.endpoints.getOpportunities
  ),
  [optionEntity.estimate]: getInitiate(estimateApi.endpoints.getEstimates),
  [optionEntity.invoice]: getInitiate(invoiceApi.endpoints.getInvoices),
  [optionEntity.paymentProfile]: getInitiate(
    paymentProfileApi.endpoints.getPaymentProfiles
  ),
  [optionEntity.payment]: getInitiate(paymentApi.endpoints.getPayments),
  [optionEntity.salesTax]: getInitiate(salesTaxApi.endpoints.getSalesTaxes),
  [optionEntity.template]: getInitiate(templateApi.endpoints.getTemplates),
  [optionEntity.packageProfile]: getInitiate(
    packageProfileApi.endpoints.getPackageProfiles
  )
}
