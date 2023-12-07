import { TextWithTooltipColumn } from 'components/tableColumns'
import {
  FormControlNumericInput,
  FormControlReactSelect
} from 'components/formControls'
import { stateListOptions } from 'constants/salesTax'
import { createdAndUpdatedColumns } from 'utils/libraryUtils'

export const getColumns = () => [
  {
    headerName: 'Sales Tax ID',
    field: 'id',
    width: 100,
    maxWidth: 100,
    cellRenderer: TextWithTooltipColumn,
    type: 'centerAligned'
  },
  {
    headerName: 'Sales Tax State',
    field: 'stateCode',
    width: 150,
    cellRenderer: TextWithTooltipColumn,
    cellRendererParams: {
      getValue: ({ stateCode }) => {
        return (
          stateListOptions.find(({ value }) => value === stateCode)?.label ||
          stateCode
        )
      },
      isTitle: true
    }
  },
  {
    headerName: 'Tax Rate (%)',
    field: 'tax',
    width: 120,
    type: 'centerAligned',
    cellRenderer: TextWithTooltipColumn,
    cellRendererParams: {
      getValue: data => {
        return `${data.tax || 0}%`
      }
    }
  },
  ...createdAndUpdatedColumns
]

export const getFilters = () => [
  {
    field: 'stateCode',
    filter: FormControlReactSelect,
    filterProps: {
      options: stateListOptions,
      isSearchable: true,
      withPortal: true,
      isClearable: true
    }
  }
]

export const getEditors = () => [
  {
    field: 'stateCode',
    cellEditor: FormControlReactSelect,
    cellEditorProps: {
      options: stateListOptions,
      isSearchable: true,
      withPortal: true,
      isClearable: false,
      isInput: false
    }
  },
  {
    field: 'tax',
    cellEditor: FormControlNumericInput,
    cellEditorProps: {
      precision: 2
    },
    valueSetter: params => {
      if (params.newValue !== params.data.tax) {
        params.data.tax = params.newValue
        return true
      }
      return false
    }
  }
]
