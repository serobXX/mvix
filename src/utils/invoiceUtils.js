import moment from 'moment'

import {
  FormControlAutocomplete,
  FormControlDatePicker,
  FormControlInput,
  FormControlReactSelect
} from 'components/formControls'
import { optionEntity } from 'constants/autocompleteOptions'
import { statusValues } from 'constants/commonOptions'
import {
  getAccountOptions,
  getContactOptions,
  getEstimateOptions,
  getOpportunityOptions,
  getUserOptions,
  transformDataByValueName
} from 'utils/autocompleteOptions'
import { getOptionsByFieldAndEntity } from 'utils/autocompleteOptions'
import { ADMINISTRATOR } from 'constants/roleConstants'
import { TextWithTooltipColumn } from 'components/tableColumns'
import customFieldNames from 'constants/customFieldNames'
import {
  BACKEND_DATE_FORMAT,
  DATE_VIEW_FORMAT
} from 'constants/dateTimeFormats'
import {
  displayFirstAndLastName,
  getTitleBasedOnEntity
} from 'utils/customFieldUtils'
import { parseCurrency } from 'utils/generalUtils'
import { entityValues } from 'constants/customFields'
import { _get } from 'utils/lodash'
import {
  invoiceFilterStatusOptions,
  paymentTermOptions
} from 'constants/invoiceConstants'

export const getShippingColumns = () => [
  {
    field: 'shipCost',
    headerName: 'Ship Cost',
    width: 100,
    type: 'centerAligned',
    cellRenderer: TextWithTooltipColumn,
    cellRendererParams: {
      getValue: ({ shipCost }) => parseCurrency(shipCost)
    }
  },
  {
    field: 'shipDate',
    headerName: 'Ship Date',
    width: 150,
    type: 'centerAligned',
    cellRenderer: TextWithTooltipColumn,
    cellRendererParams: {
      getValue: ({ shipDate }) =>
        shipDate &&
        moment(shipDate, BACKEND_DATE_FORMAT).format(DATE_VIEW_FORMAT)
    }
  },
  {
    field: 'shipCarrier',
    headerName: 'Ship Carrier',
    width: 150,
    type: 'centerAligned',
    cellRenderer: TextWithTooltipColumn
  }
]

export const getRefundColumns = () => [
  {
    field: 'refundDate',
    headerName: 'Refund Date',
    width: 150,
    type: 'centerAligned',
    cellRenderer: TextWithTooltipColumn,
    cellRendererParams: {
      getValue: ({ refundDate }) =>
        refundDate &&
        moment(refundDate, BACKEND_DATE_FORMAT).format(DATE_VIEW_FORMAT)
    }
  },
  {
    field: 'refundAmount',
    headerName: 'Refund Amount',
    width: 100,
    type: 'centerAligned',
    cellRenderer: TextWithTooltipColumn,
    cellRendererParams: {
      getValue: ({ refundAmount }) => parseCurrency(refundAmount)
    }
  },
  {
    field: 'refundedBy',
    headerName: 'Refunded By',
    width: 150,
    type: 'centerAligned',
    cellRenderer: TextWithTooltipColumn,
    cellRendererParams: {
      getValue: ({ refundedBy }) =>
        refundedBy && `${refundedBy.first_name} ${refundedBy.last_name}`
    }
  }
]

export const getInvoiceColumns = () => [
  {
    field: 'estimateId',
    headerName: 'Estimate Name',
    width: 150,
    type: 'centerAligned',
    cellRenderer: TextWithTooltipColumn,
    cellRendererParams: {
      getValue: ({ estimateName }) => estimateName
    }
  },
  {
    field: 'accountId',
    headerName: 'Account Name',
    width: 150,
    type: 'centerAligned',
    cellRenderer: TextWithTooltipColumn,
    cellRendererParams: {
      getValue: ({ account }) =>
        _get(account, `customFields.${customFieldNames.accountName}`, '')
    }
  },
  {
    field: 'contactId',
    headerName: 'Contact Name',
    width: 150,
    type: 'centerAligned',
    cellRenderer: TextWithTooltipColumn,
    cellRendererParams: {
      getValue: ({ clientAdmin }) => displayFirstAndLastName(clientAdmin)
    }
  },
  {
    field: 'opportunityId',
    headerName: 'Opportunity Name',
    width: 150,
    type: 'centerAligned',
    cellRenderer: TextWithTooltipColumn,
    cellRendererParams: {
      getValue: ({ opportunity }) =>
        getTitleBasedOnEntity(entityValues.opportunity, opportunity)
    }
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 200,
    type: 'centerAligned',
    cellRenderer: TextWithTooltipColumn
  },
  {
    field: 'subTotal',
    headerName: 'Sub Total',
    width: 100,
    type: 'centerAligned',
    cellRenderer: TextWithTooltipColumn,
    cellRendererParams: {
      getValue: ({ subTotal }) => parseCurrency(subTotal)
    }
  },
  {
    field: 'totalDiscount',
    headerName: 'Discount',
    width: 100,
    type: 'centerAligned',
    cellRenderer: TextWithTooltipColumn,
    cellRendererParams: {
      getValue: ({ totalDiscount }) => parseCurrency(totalDiscount)
    }
  },
  {
    field: 'totalTax',
    headerName: 'Tax',
    width: 100,
    type: 'centerAligned',
    cellRenderer: TextWithTooltipColumn,
    cellRendererParams: {
      getValue: ({ totalTax }) => parseCurrency(totalTax)
    }
  },
  {
    field: 'grandTotal',
    headerName: 'Total',
    width: 100,
    type: 'centerAligned',
    cellRenderer: TextWithTooltipColumn,
    cellRendererParams: {
      getValue: ({ grandTotal }) => parseCurrency(grandTotal)
    }
  },
  {
    field: 'totalReceived',
    headerName: 'Total Received',
    width: 150,
    type: 'centerAligned',
    cellRenderer: TextWithTooltipColumn,
    sortable: false,
    cellRendererParams: {
      getValue: ({ grandTotal, balanceDue }) =>
        parseCurrency((Number(grandTotal) - Number(balanceDue)).toFixed(2))
    }
  },
  {
    field: 'balanceDue',
    headerName: 'Balance Due',
    width: 120,
    type: 'centerAligned',
    sortable: false,
    cellRenderer: TextWithTooltipColumn,
    cellRendererParams: {
      getValue: ({ balanceDue }) => parseCurrency(balanceDue)
    }
  },
  {
    field: 'paymentTerm',
    headerName: 'Payment Term',
    width: 150,
    type: 'centerAligned',
    cellRenderer: TextWithTooltipColumn,
    cellRendererParams: {
      getValue: ({ payment_term }) => payment_term
    }
  },
  {
    field: 'dueDate',
    headerName: 'Due Date',
    width: 150,
    type: 'centerAligned',
    cellRenderer: TextWithTooltipColumn,
    cellRendererParams: {
      getValue: ({ dueDate }) =>
        dueDate && moment(dueDate, BACKEND_DATE_FORMAT).format(DATE_VIEW_FORMAT)
    }
  },
  {
    field: 'ownerId',
    headerName: 'Invoice Owner',
    width: 150,
    type: 'centerAligned',
    cellRenderer: TextWithTooltipColumn,
    cellRendererParams: {
      getValue: ({ invoiceOwner }) =>
        invoiceOwner && `${invoiceOwner.first_name} ${invoiceOwner.last_name}`
    }
  }
]

export const getShippingFilters = () => [
  {
    field: 'shipDate',
    filter: FormControlDatePicker,
    filterProps: {
      withPortal: true,
      isClearable: true,
      minDate: null
    }
  },
  {
    field: 'shipCarrier',
    filter: FormControlInput
  }
]

export const getInvoiceFilters = ({ role, hideStatus, invoiceParams }) => [
  {
    field: 'invoiceNumber',
    filter: FormControlAutocomplete,
    filterProps: {
      withPortal: true,
      isClearable: true,
      isCreatable: true,
      getOptions: getOptionsByFieldAndEntity({
        field: ['invoiceNumber', 'id'],
        entity: optionEntity.invoice,
        transformData: transformDataByValueName,
        options: invoiceParams || {}
      })
    }
  },
  {
    field: 'estimateId',
    filter: FormControlAutocomplete,
    filterProps: {
      withPortal: true,
      isClearable: true,
      getOptions: getEstimateOptions()
    }
  },
  {
    field: 'accountId',
    filter: FormControlAutocomplete,
    filterProps: {
      withPortal: true,
      isClearable: true,
      getOptions: getAccountOptions()
    }
  },
  {
    field: 'contactId',
    filter: FormControlAutocomplete,
    filterProps: {
      withPortal: true,
      isClearable: true,
      getOptions: getContactOptions()
    }
  },
  {
    field: 'opportunityId',
    filter: FormControlAutocomplete,
    filterProps: {
      withPortal: true,
      isClearable: true,
      getOptions: getOpportunityOptions()
    }
  },
  {
    field: 'paymentTerm',
    filter: FormControlReactSelect,
    filterProps: {
      withPortal: true,
      isClearable: true,
      isSort: false,
      options: paymentTermOptions
    }
  },
  {
    field: 'dueDate',
    filter: FormControlDatePicker,
    filterProps: {
      withPortal: true,
      isClearable: true,
      minDate: null
    }
  },
  {
    field: 'ownerId',
    filter: FormControlAutocomplete,
    filterProps: {
      withPortal: true,
      isClearable: true,
      getOptions: getUserOptions()
    }
  },
  ...(hideStatus
    ? []
    : [
        {
          field: 'status',
          filter: FormControlReactSelect,
          filterProps: {
            withPortal: true,
            isClearable: true,
            options: [
              ...invoiceFilterStatusOptions,
              ...(role?.name === ADMINISTRATOR
                ? [
                    {
                      label: statusValues.disabled,
                      value: statusValues.disabled
                    }
                  ]
                : [])
            ],
            isMulti: true,
            isMultiSelection: true,
            fixedHeight: true
          }
        }
      ])
]
