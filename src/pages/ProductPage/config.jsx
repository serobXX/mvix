import { TextWithTooltipColumn } from 'components/tableColumns'
import customFieldNames from 'constants/customFieldNames'
import iconNames from 'constants/iconNames'
import { updateFieldName } from 'constants/library'
import { getCustomFieldValueByCode } from 'utils/customFieldUtils'
import { parseCurrency } from 'utils/generalUtils'
import { getIconClassName } from 'utils/iconUtils'

export const getColumns = () => [
  {
    headerName: 'Produce Price',
    field: customFieldNames.productPrice,
    width: 100,
    type: 'centerAligned',
    cellRenderer: TextWithTooltipColumn,
    positionIndex: 1,
    cellRendererParams: {
      getValue: data => {
        if (data.isCustomProduct) {
          return 'Dynamic Price'
        }
        return parseCurrency(
          getCustomFieldValueByCode(data, customFieldNames.productPrice)
        )
      }
    }
  }
]

export const getCommonActions = (
  handleBulkDelete,
  handleOpenUpdateModal,
  permission
) => [
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
