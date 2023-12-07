import { StatusColumn, TextWithTooltipColumn } from 'components/tableColumns'
import {
  CheckboxSwitcher,
  FormControlInput,
  FormControlReactSelect
} from 'components/formControls'
import { createdAndUpdatedColumns } from 'utils/libraryUtils'
import {
  relatedEntityOptions,
  remindDateOptions,
  remindEntityOptions,
  senderOptions
} from 'constants/reminderConstants'
import { statusReturnValues, statusOptions } from 'constants/commonOptions'
import { convertToPluralize } from 'utils/pluralize'

export const getColumns = () => [
  {
    headerName: 'Associated Entity',
    field: 'relatedEntity',
    type: 'centerAligned',
    width: 150,
    cellRenderer: TextWithTooltipColumn
  },
  {
    headerName: 'Reminder Entity',
    field: 'remindEntity',
    type: 'centerAligned',
    width: 150,
    cellRenderer: TextWithTooltipColumn
  },
  {
    headerName: 'Reminder',
    field: 'reminder',
    width: 200,
    sortable: false,
    type: 'centerAligned',
    cellRenderer: TextWithTooltipColumn,
    cellRendererParams: {
      getValue: ({ remindType, remindDays, condition }) => {
        return `${remindDays} ${convertToPluralize(
          'day',
          remindDays
        )} ${remindType} ${
          remindDateOptions.find(({ value }) => value === condition)?.label ||
          condition
        }`
      }
    }
  },
  {
    headerName: 'From',
    field: 'sender',
    width: 200,
    type: 'centerAligned',
    cellRenderer: TextWithTooltipColumn,
    cellRendererParams: {
      getValue: ({ sender }) => {
        const from = Array.isArray(sender) ? sender[0] : sender
        return senderOptions.find(({ value }) => value === from)?.label
      }
    }
  },
  {
    headerName: 'Subject',
    field: 'subject',
    width: 250,
    type: 'centerAligned',
    cellRenderer: TextWithTooltipColumn,
    hide: true
  },
  {
    headerName: 'Status',
    field: 'status',
    width: 100,
    type: 'centerAligned',
    cellRenderer: StatusColumn
  },
  ...createdAndUpdatedColumns
]

export const getFilters = () => [
  {
    field: 'name',
    filter: FormControlInput
  },
  {
    field: 'relatedEntity',
    filter: FormControlReactSelect,
    filterProps: {
      options: relatedEntityOptions,
      withPortal: true,
      isClearable: true
    }
  },
  {
    field: 'remindEntity',
    filter: FormControlReactSelect,
    filterProps: {
      options: remindEntityOptions,
      withPortal: true,
      isClearable: true
    }
  },
  {
    field: 'sender',
    filter: FormControlReactSelect,
    filterProps: {
      options: senderOptions,
      withPortal: true,
      isClearable: true
    }
  },
  {
    field: 'status',
    filter: FormControlReactSelect,
    filterProps: {
      options: statusOptions,
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
    field: 'relatedEntity',
    cellEditor: FormControlReactSelect,
    cellEditorProps: {
      options: relatedEntityOptions,
      isSearchable: true,
      withPortal: true,
      isClearable: false,
      isInput: false
    }
  },
  {
    field: 'remindEntity',
    cellEditor: FormControlReactSelect,
    cellEditorProps: {
      options: remindEntityOptions,
      isSearchable: true,
      withPortal: true,
      isInput: false
    }
  },
  {
    field: 'sender',
    cellEditor: FormControlReactSelect,
    cellEditorProps: {
      options: senderOptions,
      isSearchable: true,
      withPortal: true,
      isInput: false
    }
  },
  {
    field: 'subject',
    cellEditor: FormControlInput
  },
  {
    field: 'status',
    cellEditor: CheckboxSwitcher,
    cellEditorProps: {
      returnValues: statusReturnValues,
      isInput: false
    }
  }
]
