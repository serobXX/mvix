import { TextWithTooltipColumn } from 'components/tableColumns'
import {
  FormControlAutocomplete,
  FormControlInput,
  FormControlNumericInput
} from 'components/formControls'
import { createdAndUpdatedColumns } from 'utils/libraryUtils'
import {
  getOptionsByFieldAndEntity,
  transformDataByValueName
} from 'utils/autocompleteOptions'
import { optionEntity } from 'constants/autocompleteOptions'

export const getColumns = () => [
  {
    headerName: 'Name',
    field: 'name',
    width: 250,
    cellRenderer: TextWithTooltipColumn,
    cellRendererParams: {
      isTitle: true
    }
  },
  {
    headerName: 'Length',
    field: 'length',
    width: 120,
    type: 'centerAligned',
    cellRenderer: TextWithTooltipColumn,
    cellRendererParams: {
      getValue: data => {
        return `${Number(data.length) || 0} ${data.distanceUnit}`
      }
    }
  },
  {
    headerName: 'Width',
    field: 'width',
    width: 120,
    type: 'centerAligned',
    cellRenderer: TextWithTooltipColumn,
    cellRendererParams: {
      getValue: data => {
        return `${Number(data.width) || 0} ${data.distanceUnit}`
      }
    }
  },
  {
    headerName: 'Height',
    field: 'height',
    width: 120,
    type: 'centerAligned',
    cellRenderer: TextWithTooltipColumn,
    cellRendererParams: {
      getValue: data => {
        return `${Number(data.height) || 0} ${data.distanceUnit}`
      }
    }
  },
  {
    headerName: 'Weight',
    field: 'weight',
    width: 120,
    type: 'centerAligned',
    cellRenderer: TextWithTooltipColumn,
    cellRendererParams: {
      getValue: data => {
        return `${Number(data.weight) || 0} ${data.massUnit}`
      }
    }
  },
  ...createdAndUpdatedColumns
]

export const getFilters = () => [
  {
    field: 'name',
    filter: FormControlAutocomplete,
    filterProps: {
      getOptions: getOptionsByFieldAndEntity({
        entity: optionEntity.packageProfile,
        field: ['name'],
        transformData: transformDataByValueName
      }),
      isSearchable: true,
      withPortal: true,
      isClearable: true
    }
  }
]

export const getEditors = () => [
  {
    field: 'name',
    cellEditor: FormControlInput
  },
  {
    field: 'length',
    cellEditor: FormControlNumericInput,
    cellEditorProps: {
      precision: 4
    },
    valueSetter: params => {
      if (params.newValue !== params.data.tax) {
        params.data.length = params.newValue
        return true
      }
      return false
    }
  },
  {
    field: 'width',
    cellEditor: FormControlNumericInput,
    cellEditorProps: {
      precision: 4
    },
    valueSetter: params => {
      if (params.newValue !== params.data.tax) {
        params.data.width = params.newValue
        return true
      }
      return false
    }
  },
  {
    field: 'height',
    cellEditor: FormControlNumericInput,
    cellEditorProps: {
      precision: 4
    },
    valueSetter: params => {
      if (params.newValue !== params.data.tax) {
        params.data.height = params.newValue
        return true
      }
      return false
    }
  },
  {
    field: 'weight',
    cellEditor: FormControlNumericInput,
    cellEditorProps: {
      precision: 4
    },
    valueSetter: params => {
      if (params.newValue !== params.data.tax) {
        params.data.weight = params.newValue
        return true
      }
      return false
    }
  }
]
