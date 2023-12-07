import { FormControlInput } from 'components/formControls'
import customFieldNames from 'constants/customFieldNames'
import { filterTypeValues } from 'constants/filter'
import iconNames from 'constants/iconNames'
import { updateFieldName } from 'constants/library'
import { getIconClassName } from 'utils/iconUtils'

export const getColumns = () => []

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
    label: 'Change Lead Status',
    clickAction: handleOpenUpdateModal({
      field: customFieldNames.leadStatus,
      isCustomField: true,
      title: 'Change Lead Status'
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
