const customFieldNames = {
  firstName: 'first-name',
  lastName: 'last-name',
  accountName: 'account-name',
  opportunityName: 'opportunityName',
  estimateName: 'estimateName',
  termAndCondition: 'terms-and-condition',
  contactName: 'contact-name',

  mobile: 'mobile',
  phone: 'phone',
  website: 'website',
  description: 'description',
  leadPhone: 'phone',
  leadEmail: 'email',
  leadOwner: 'lead-owner',
  leadStatus: 'lead-status',
  leadSource: 'lead-source',
  leadType: 'lead-type',
  leadIndustry: 'industry',
  leadSolutionInterest: 'solution-interest',
  leadTitle: 'lead-title',
  leadCompany: 'company',
  leadCity: 'city',
  leadState: 'state',
  leadCountry: 'country',
  addresses: 'addresses',
  leadRequirements: 'lead-requirements',
  leadDescription: 'lead-description',

  apolloId: 'apollo_id',
  twitterUrl: 'twitter_url',
  githubUrl: 'github_url',
  facebookUrl: 'facebook_url',
  linkedinUrl: 'linkedin_url',
  apolloContactId: 'apollo_contact_id',
  apolloOrganizationId: 'apollo_organization_id',

  oppExpectedClosingDate: 'expectingClosingDate',
  oppExpectedRevenue: 'expectedRevenue',
  opportunityType: 'projectType',
  opportunityOwner: 'opportunity-owner',

  accountOwner: 'account-owner',
  accountRelation: 'relation',
  accountSupport: 'support-level',
  accountPartnershipStatus: 'partnership-status',
  accountBuildConfig: 'account-build-config',
  accountPaymentTerm: 'payment_term',

  contactOwner: 'contact-owner',
  contactAuthority: 'authority',
  estimateOwner: 'estimate-owner',
  contactType: 'contact-type',

  productName: 'product-name',
  productDescription: 'product-description',
  productRecurringFrequency: 'recurring-frequency',
  productRecurring: 'product-recurring',
  productCode: 'product-code',
  productPrice: 'product-price',
  productUsageUnit: 'usage-unit',
  productUnitOfMeasure: 'unit-of-measure',
  productCategory: 'product-category',

  lostReason: 'lost-reason',
  lostDetails: 'lost-details',

  billingStreet: 'billing-street',
  billingCity: 'billing-city',
  billingState: 'billing-state',
  billingCode: 'billing-code',
  billingCountry: 'billing-country',
  shippingStreet: 'shipping-street',
  shippingCity: 'shipping-city',
  shippingState: 'shipping-state',
  shippingCode: 'shipping-postal-code',
  shippingCountry: 'shipping-country',
  shipToMultiple: 'ship-to-multiple',

  accountSalesTax: 'sales-tax'
}

export default customFieldNames

export const billingAddressFields = [
  customFieldNames.billingStreet,
  customFieldNames.billingCity,
  customFieldNames.billingCode,
  customFieldNames.billingCountry,
  customFieldNames.billingState
]

export const shippingAddressFields = [
  customFieldNames.shippingStreet,
  customFieldNames.shippingCity,
  customFieldNames.shippingCode,
  customFieldNames.shippingCountry,
  customFieldNames.shippingState
]
