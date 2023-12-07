import {
  FormControlDatePicker,
  FormControlReactSelect
} from 'components/formControls'
import {
  invoiceFilterStatusOptions,
  invoiceStatusOptions,
  paymentTermOptions
} from 'constants/invoiceConstants'

import {
  getInvoiceColumns,
  getInvoiceFilters,
  getRefundColumns,
  getShippingColumns,
  getShippingFilters
} from 'utils/invoiceUtils'

export const getColumns = () => [
  ...getInvoiceColumns(),
  ...getShippingColumns(),
  ...getRefundColumns()
]

export const getFilters = role => [
  ...getInvoiceFilters({
    role,
    invoiceParams: {
      status: invoiceFilterStatusOptions.map(({ value }) => value).join(',')
    }
  }),
  ...getShippingFilters()
]

export const getEditors = () => [
  {
    field: 'status',
    cellEditor: FormControlReactSelect,
    cellEditorProps: {
      withPortal: true,
      options: invoiceStatusOptions,
      isInput: false
    }
  },
  {
    field: 'dueDate',
    cellEditor: FormControlDatePicker,
    cellEditorProps: {
      withPortal: true,
      isInput: false
    }
  },
  {
    field: 'paymentTerm',
    cellEditor: FormControlReactSelect,
    cellEditorProps: {
      withPortal: true,
      isInput: false,
      isSort: false,
      options: paymentTermOptions
    },
    valueGetter: params => params.data?.payment_term,
    valueSetter: params => {
      if (params.newValue) {
        params.data.payment_term = params.newValue
        return true
      }
      return false
    }
  }
]

export const getOrderColumns = () => [...getInvoiceColumns()]
