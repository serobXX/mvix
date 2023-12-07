import moment from 'moment'

import {
  FormControlAutocomplete,
  FormControlDatePicker,
  FormControlReactSelect
} from 'components/formControls'
import { TextWithTooltipColumn } from 'components/tableColumns'
import { optionEntity } from 'constants/autocompleteOptions'
import customFieldNames from 'constants/customFieldNames'
import { paymentMethodOptions, paymentMethodValues } from 'constants/payment'
import {
  getAccountOptions,
  getOptionsByFieldAndEntity,
  getUserOptions,
  transformDataByValueName
} from 'utils/autocompleteOptions'
import { _get } from 'utils/lodash'
import {
  BACKEND_DATE_FORMAT,
  DATE_VIEW_FORMAT
} from 'constants/dateTimeFormats'
import { parseCurrency } from 'utils/generalUtils'

export const getColumns = () => [
  {
    headerName: 'Account',
    field: 'accountId',
    width: 150,
    cellRenderer: TextWithTooltipColumn,
    type: 'centerAligned',
    cellRendererParams: {
      getValue: ({ account }) =>
        _get(account, `customFields.${customFieldNames.accountName}`, '')
    }
  },
  {
    headerName: 'Invoice',
    field: 'invoiceId',
    width: 150,
    cellRenderer: TextWithTooltipColumn,
    type: 'centerAligned',
    cellRendererParams: {
      getValue: ({ invoice }) => _get(invoice, `invoice_number`, '')
    }
  },
  {
    headerName: 'Method',
    field: 'paymentMethod',
    width: 150,
    type: 'centerAligned',
    cellRenderer: TextWithTooltipColumn,
    cellRendererParams: {
      getValue: ({ paymentMethod, paymentProcessor, creditCardType }) => {
        let method = paymentMethod
        if (paymentMethod === paymentMethodValues.creditCard) {
          method += ` (${creditCardType})`
        } else if (paymentMethod === paymentMethodValues.other) {
          method += ` (${paymentProcessor})`
        }
        return method
      }
    }
  },
  {
    headerName: 'Transaction Number',
    field: 'transactionNumber',
    width: 150,
    type: 'centerAligned',
    cellRenderer: TextWithTooltipColumn,
    cellRendererParams: {
      getValue: ({ paymentMethod, paymentSource }) => {
        if (
          [paymentMethodValues.creditCard, paymentMethodValues.check].includes(
            paymentMethod
          )
        )
          return
        return paymentSource
      }
    }
  },
  {
    headerName: 'Check/CC Number',
    field: 'ccNumber',
    width: 150,
    type: 'centerAligned',
    cellRenderer: TextWithTooltipColumn,
    cellRendererParams: {
      getValue: ({ paymentMethod, paymentSource }) => {
        if (
          ![paymentMethodValues.creditCard, paymentMethodValues.check].includes(
            paymentMethod
          )
        )
          return
        return paymentSource
      }
    }
  },
  {
    headerName: 'Payment Date',
    field: 'paymentDate',
    width: 150,
    type: 'centerAligned',
    cellRenderer: TextWithTooltipColumn,
    cellRendererParams: {
      getValue: ({ paymentDate }) =>
        moment(paymentDate, BACKEND_DATE_FORMAT).format(DATE_VIEW_FORMAT)
    }
  },
  {
    headerName: 'Payment Received',
    field: 'paymentReceived',
    width: 150,
    type: 'centerAligned',
    cellRenderer: TextWithTooltipColumn,
    cellRendererParams: {
      getValue: ({ paymentReceived }) => parseCurrency(paymentReceived)
    }
  },
  {
    headerName: 'Received By',
    field: 'receivedBy',
    width: 150,
    type: 'centerAligned',
    cellRenderer: TextWithTooltipColumn,
    cellRendererParams: {
      getValue: ({ receivedBy }) =>
        `${receivedBy?.first_name} ${receivedBy?.last_name}`
    }
  }
]

export const getFilters = () => [
  {
    field: 'paymentName',
    filter: FormControlAutocomplete,
    filterProps: {
      getOptions: getOptionsByFieldAndEntity({
        field: 'paymentName',
        entity: optionEntity.payment,
        transformData: transformDataByValueName
      }),
      withPortal: true,
      isClearable: true,
      isCreatable: true
    }
  },
  {
    field: 'paymentMethod',
    filter: FormControlReactSelect,
    filterProps: {
      options: paymentMethodOptions,
      withPortal: true,
      isClearable: true,
      isSort: false
    }
  },
  {
    field: 'accountId',
    filter: FormControlAutocomplete,
    filterProps: {
      getOptions: getAccountOptions(),
      withPortal: true,
      isClearable: true
    }
  },
  {
    field: 'invoiceId',
    filter: FormControlAutocomplete,
    filterProps: {
      getOptions: getOptionsByFieldAndEntity({
        field: ['invoiceNumber', 'id'],
        entity: optionEntity.invoice
      }),
      withPortal: true,
      isClearable: true
    }
  },
  {
    field: 'paymentDate',
    filter: FormControlDatePicker,
    filterProps: {
      minDate: null,
      withPortal: true,
      isClearable: true
    }
  },
  {
    field: 'receivedBy',
    filter: FormControlAutocomplete,
    filterProps: {
      getOptions: getUserOptions(),
      withPortal: true,
      isClearable: true
    }
  }
]

export const getEditors = () => [
  {
    field: 'accountId',
    cellEditor: FormControlAutocomplete,
    cellEditorProps: value => ({
      getOptions: getAccountOptions(),
      withPortal: true,
      isInput: false,
      initialFetchValue: value
    }),
    valueGetter: params => params.data?.account?.id,
    valueSetter: params => {
      if (params.newValue) {
        params.data.accountId = params.newValue
        return true
      }
      return false
    }
  },
  {
    field: 'invoiceId',
    cellEditor: FormControlAutocomplete,
    cellEditorProps: value => ({
      getOptions: getOptionsByFieldAndEntity({
        field: ['invoiceNumber', 'id'],
        entity: optionEntity.invoice,
        passIdForNumber: true
      }),
      withPortal: true,
      isInput: false,
      initialFetchValue: value
    }),
    valueGetter: params => params.data?.invoice?.id,
    valueSetter: params => {
      if (params.newValue) {
        params.data.invoiceId = params.newValue
        return true
      }
      return false
    }
  },
  {
    field: 'paymentDate',
    cellEditor: FormControlDatePicker,
    cellEditorProps: {
      minDate: null,
      isInput: false
    }
  },
  {
    field: 'receivedBy',
    cellEditor: FormControlAutocomplete,
    cellEditorProps: value => ({
      getOptions: getUserOptions(null, null, {
        passIdForNumber: true
      }),
      withPortal: true,
      isInput: false,
      initialFetchValue: value
    }),
    valueGetter: params => params.data?.receivedBy?.id,
    valueSetter: params => {
      if (params.newValue) {
        params.data.receivedBy = params.newValue
        return true
      }
      return false
    }
  }
]
