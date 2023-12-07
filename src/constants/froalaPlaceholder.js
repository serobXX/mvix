import { getIconClassName } from 'utils/iconUtils'
import customFieldNames from './customFieldNames'
import { entityValues } from './customFields'
import { froalaEntityNames } from './froalaConstants'
import iconNames from './iconNames'

export const placeholderEntityValues = {
  lead: 'lead',
  account: 'account',
  contact: 'contact',
  estimate: 'estimate',
  opportunity: 'opportunity',
  proposal: 'proposal',
  invoice: 'invoice',
  salesPerson: 'salesPerson'
}

export const placeholderStaticCodes = {
  proposalLink: 'proposal-link',
  termsAndConditions: 'termsAndConditions',
  invoiceBalanceDue: 'balanceDue',
  invoiceDueDate: 'dueDate',
  invoiceGrandTotal: 'grandTotal',
  invoiceNumber: 'invoiceNumber',
  invoiceOrderType: 'orderType',
  invoicePaymentTerm: 'payment_term',
  invoiceTotalTax: 'totalTax',
  invoiceTotalDiscount: 'totalDiscount',
  billingStreet: customFieldNames.billingStreet,
  billingCity: customFieldNames.billingCity,
  billingState: customFieldNames.billingState,
  billingCountry: customFieldNames.billingCountry,
  billingCode: customFieldNames.billingCode,
  shippingStreet: customFieldNames.shippingStreet,
  shippingCity: customFieldNames.shippingCity,
  shippingState: customFieldNames.shippingState,
  shippingCountry: customFieldNames.shippingCountry,
  shippingCode: customFieldNames.shippingCode,
  appointmentLink: 'appointment-link'
}

export const placeholderEntityToCustomFieldEntity = {
  [placeholderEntityValues.lead]: entityValues.lead,
  [placeholderEntityValues.account]: entityValues.account,
  [placeholderEntityValues.contact]: entityValues.contact,
  [placeholderEntityValues.estimate]: entityValues.estimate,
  [placeholderEntityValues.opportunity]: entityValues.opportunity
}

export const placeholderEntityOptions = [
  {
    label: 'Lead',
    icon: getIconClassName(iconNames.lead),
    value: placeholderEntityValues.lead,
    entities: [froalaEntityNames.email, froalaEntityNames.leadEmail]
  },
  {
    label: 'Account',
    icon: getIconClassName(iconNames.account),
    value: placeholderEntityValues.account,
    entities: [
      froalaEntityNames.email,
      froalaEntityNames.accountEmail,
      froalaEntityNames.contactEmail,
      froalaEntityNames.opportunityEmail,
      froalaEntityNames.proposalEmail,
      froalaEntityNames.estimateEmail,
      froalaEntityNames.proposal,
      froalaEntityNames.invoice
    ]
  },
  {
    label: 'Contact',
    icon: getIconClassName(iconNames.contact),
    value: placeholderEntityValues.contact,
    entities: [
      froalaEntityNames.email,
      froalaEntityNames.contactEmail,
      froalaEntityNames.opportunityEmail,
      froalaEntityNames.proposalEmail,
      froalaEntityNames.estimateEmail,
      froalaEntityNames.proposal,
      froalaEntityNames.invoice
    ]
  },
  {
    label: 'Opportunity',
    icon: getIconClassName(iconNames.opportunity),
    value: placeholderEntityValues.opportunity,
    entities: [
      froalaEntityNames.email,
      froalaEntityNames.opportunityEmail,
      froalaEntityNames.proposalEmail,
      froalaEntityNames.estimateEmail,
      froalaEntityNames.proposal,
      froalaEntityNames.invoice
    ]
  },
  {
    label: 'Proposal',
    icon: getIconClassName(iconNames.proposal),
    value: placeholderEntityValues.proposal,
    entities: [froalaEntityNames.email, froalaEntityNames.proposalEmail],
    options: [
      {
        name: 'Proposal Link',
        code: placeholderStaticCodes.proposalLink
      }
    ]
  },
  {
    label: 'Proposal',
    icon: getIconClassName(iconNames.proposal),
    value: placeholderEntityValues.proposal,
    entities: [froalaEntityNames.proposal],
    options: [
      {
        name: 'Term & Conditions',
        code: placeholderStaticCodes.termsAndConditions
      }
    ]
  },
  {
    label: 'Estimate',
    icon: getIconClassName(iconNames.estimate),
    value: placeholderEntityValues.estimate,
    entities: [
      froalaEntityNames.email,
      froalaEntityNames.estimateEmail,
      froalaEntityNames.proposal
    ]
  },
  {
    label: 'Invoice',
    icon: getIconClassName(iconNames.invoice),
    value: placeholderEntityValues.invoice,
    entities: [froalaEntityNames.invoice],
    options: [
      {
        name: 'Balance Due',
        code: placeholderStaticCodes.invoiceBalanceDue
      },
      {
        name: 'Due Date',
        code: placeholderStaticCodes.invoiceDueDate
      },
      {
        name: 'Grand Total',
        code: placeholderStaticCodes.invoiceGrandTotal
      },
      {
        name: 'Invoice Number',
        code: placeholderStaticCodes.invoiceNumber
      },
      {
        name: 'Order Type',
        code: placeholderStaticCodes.invoiceOrderType
      },
      {
        name: 'Payment Term',
        code: placeholderStaticCodes.invoicePaymentTerm
      },
      {
        name: 'Total Discount',
        code: placeholderStaticCodes.invoiceTotalDiscount
      },
      {
        name: 'Total Tax',
        code: placeholderStaticCodes.invoiceTotalTax
      },
      {
        name: 'Term & Conditions',
        code: placeholderStaticCodes.termsAndConditions
      },
      {
        name: 'Billing Street',
        code: placeholderStaticCodes.billingStreet
      },
      {
        name: 'Billing City',
        code: placeholderStaticCodes.billingCity
      },
      {
        name: 'Billing State',
        code: placeholderStaticCodes.billingState
      },
      {
        name: 'Billing Country',
        code: placeholderStaticCodes.billingCountry
      },
      {
        name: 'Billing Zip Code',
        code: placeholderStaticCodes.billingCode
      },
      {
        name: 'Shipping Street',
        code: placeholderStaticCodes.shippingStreet
      },
      {
        name: 'Shipping City',
        code: placeholderStaticCodes.shippingCity
      },
      {
        name: 'Shipping State',
        code: placeholderStaticCodes.shippingState
      },
      {
        name: 'Shipping Country',
        code: placeholderStaticCodes.shippingCountry
      },
      {
        name: 'Shipping Zip Code',
        code: placeholderStaticCodes.shippingCode
      }
    ]
  },
  {
    label: 'Sales Person',
    icon: getIconClassName(iconNames.salesPerson),
    value: placeholderEntityValues.salesPerson,
    entities: [
      froalaEntityNames.email,
      froalaEntityNames.proposalEmail,
      froalaEntityNames.proposal,
      froalaEntityNames.accountEmail,
      froalaEntityNames.contactEmail,
      froalaEntityNames.estimateEmail,
      froalaEntityNames.leadEmail,
      froalaEntityNames.invoice
    ],
    options: [
      {
        name: 'Appointment Link',
        code: placeholderStaticCodes.appointmentLink
      }
    ]
  }
]
