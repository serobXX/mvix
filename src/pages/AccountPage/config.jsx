import customFieldNames from 'constants/customFieldNames'
import iconNames from 'constants/iconNames'
import { updateFieldName } from 'constants/library'
import { getIconClassName } from 'utils/iconUtils'

export const getColumns = () => []

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
    label: 'Change Relation',
    clickAction: handleOpenUpdateModal({
      field: customFieldNames.accountRelation,
      isCustomField: true,
      title: 'Change Account Relation'
    }),
    render: permission.update
  },
  {
    label: 'Change Partnership Status',
    clickAction: handleOpenUpdateModal({
      field: customFieldNames.accountPartnershipStatus,
      isCustomField: true,
      title: 'Change Partnership Status'
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
