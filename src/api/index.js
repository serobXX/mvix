import { accountApi } from './accountApi'
import { accountPartnershipApi } from './accountPartnershipApi'
import { activityApi } from './activityApi'
import { authApi } from './authApi'
import { contactDictionaryApi } from './contactDicitionary'
import { contactApi } from './contactApi'
import { customFieldApi } from './customFieldApi'
import { ipApi } from './ipApi'
import { leadApi } from './leadApi'
import { leadDictionaryApi } from './leadDictionary'
import { licenseApi } from './licenseApi'
import { opportunityStageApi } from './opportunityStageApi'
import { roleApi } from './roleApi'
import { tagApi } from './tagApi'
import { userApi } from './userApi'
import { opportunityApi } from './opportunityApi'
import { productApi } from './productApi'
import { estimateApi } from './estimateApi'
import { invoiceApi } from './invoiceApi'
import { paymentProfileApi } from './paymentProfile'
import { paymentApi } from './paymentApi'
import { configApi } from './configApi'
import { salesTaxApi } from './salesTaxApi'
import { preferenceApi } from './preferenceApi'
import { termsAndConditionsApi } from './termsAndConditionsApi'
import { logApi } from './logApi'
import { solutionSetApi } from './solutionSetApi'
import { emailApi } from './emailApi'
import { fontApi } from './fontApi'
import { subjectLineApi } from './subjectLineApi'
import { reminderApi } from './reminderApi'
import { templateApi } from './templateApi'
import { publicApi } from './publicApi'
import { dashboardApi } from './dashboardApi'
import { ticketApi } from './ticketApi'
import { siteConfigApi } from './siteConfigApi'
import { packageProfileApi } from './packageProfileApi'
import { shippingApi } from './shippingApi'

export const registeredApi = [
  authApi,
  ipApi,
  roleApi,
  userApi,
  tagApi,
  ...leadDictionaryApi,
  opportunityStageApi,
  licenseApi,
  activityApi,
  customFieldApi,
  accountPartnershipApi,
  leadApi,
  accountApi,
  ...contactDictionaryApi,
  contactApi,
  ticketApi,
  opportunityApi,
  productApi,
  estimateApi,
  invoiceApi,
  paymentProfileApi,
  paymentApi,
  configApi,
  salesTaxApi,
  preferenceApi,
  termsAndConditionsApi,
  logApi,
  solutionSetApi,
  emailApi,
  fontApi,
  subjectLineApi,
  reminderApi,
  templateApi,
  publicApi,
  dashboardApi,
  siteConfigApi,
  packageProfileApi,
  shippingApi
]
