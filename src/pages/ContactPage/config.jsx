import {
  FormControlAutocomplete,
  FormControlInput
} from 'components/formControls'
import { TextWithTooltipColumn } from 'components/tableColumns'
import customFieldNames from 'constants/customFieldNames'
import { filterTypeValues } from 'constants/filter'
import iconNames from 'constants/iconNames'
import { updateFieldName } from 'constants/library'
import { getAccountOptions } from 'utils/autocompleteOptions'
import { getIconClassName } from 'utils/iconUtils'
import { _get } from 'utils/lodash'

export const getColumns = () => [
  {
    field: 'accountId',
    headerName: 'Account',
    width: 150,
    type: 'centerAligned',
    cellRenderer: TextWithTooltipColumn,
    cellRendererParams: {
      getValue: data => {
        return _get(
          data,
          `accountId.customFields.${customFieldNames.accountName}`,
          ''
        )
      }
    },
    positionIndex: 1
  }
]

export const getFilters = () => [
  {
    field: 'name',
    filters: [
      {
        field: customFieldNames.firstName,
        filter: FormControlInput,
        headerName: 'First Name',
        filterProps: {
          filterType: filterTypeValues.string
        }
      },
      {
        field: customFieldNames.lastName,
        filter: FormControlInput,
        headerName: 'Last Name',
        filterProps: {
          filterType: filterTypeValues.string
        }
      }
    ]
  },
  {
    field: 'accountId',
    filter: FormControlAutocomplete,
    filterProps: {
      withPortal: true,
      isClearable: true,
      getOptions: getAccountOptions()
    }
  }
]

export const getEditors = () => [
  {
    field: 'accountId',
    cellEditor: FormControlAutocomplete,
    cellEditorProps: ({ accountId }) => ({
      withPortal: true,
      getOptions: getAccountOptions(),
      isInput: false,
      initialFetchValue: accountId?.id
    }),
    valueGetter: ({ data }) => {
      return _get(data, `accountId.id`, '')
    },
    valueSetter: params => {
      if (
        params.newValue &&
        params.newValue !== _get(params.data, `accountId.id`)
      ) {
        params.data.newAccountId = params.newValue
        return true
      }
      return false
    }
  }
]

export const getCommonActions = (
  handleBulkDelete,
  handleOpenUpdateModal,
  permission
) => [
  {
    label: 'Change Owner',
    clickAction: handleOpenUpdateModal({
      field: updateFieldName.owner,
      title: 'Change Owner'
    }),
    render: permission.update
  },
  {
    label: 'Change Authority',
    clickAction: handleOpenUpdateModal({
      field: customFieldNames.contactAuthority,
      isCustomField: true,
      title: 'Change Contact Authority'
    }),
    render: permission.update
  },
  {
    label: 'Change Record Status',
    clickAction: handleOpenUpdateModal({
      field: updateFieldName.status,
      title: 'Change Record Status'
    }),
    render: permission.update
  },
  {
    label: 'Move to Account',
    clickAction: handleOpenUpdateModal({
      field: updateFieldName.account,
      title: 'Move to Account'
    }),
    render: permission.update
  },
  {
    label: 'Add Tags',
    clickAction: handleOpenUpdateModal({
      field: updateFieldName.tag,
      title: 'Add Tags'
    }),
    render: permission.update
  },
  {
    label: 'Delete',
    clickAction: handleBulkDelete,
    icon: getIconClassName(iconNames.delete),
    render: permission.delete
  }
]
