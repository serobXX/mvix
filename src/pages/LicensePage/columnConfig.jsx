import {
  DateTimeViewColumn,
  TagColumn,
  StatusColumn,
  TextWithTooltipColumn
} from 'components/tableColumns'
import { licenseTypeOptions } from 'constants/licenseContants'

export const getColumns = () => [
  {
    headerName: 'Name',
    field: 'name',
    width: 150,
    cellRenderer: TextWithTooltipColumn,
    cellRendererParams: {
      isTitle: true
    }
  },
  {
    headerName: 'Type',
    field: 'licenseType',
    width: 120,
    type: 'centerAligned',
    cellRenderer: TextWithTooltipColumn,
    cellRendererParams: {
      getValue: data => {
        return licenseTypeOptions.find(
          ({ value }) => value === data.licenseType
        )?.label
      }
    }
  },
  {
    headerName: 'Duration (Months)',
    field: 'licenseDurationInMonth',
    width: 80,
    type: 'centerAligned',
    cellRenderer: TextWithTooltipColumn
  },
  {
    headerName: 'Status',
    field: 'status',
    width: 100,
    type: 'centerAligned',
    cellRenderer: StatusColumn
  },
  {
    field: 'createdAt',
    headerName: 'Created On',
    width: 100,
    type: 'centerAligned',
    cellRenderer: DateTimeViewColumn
  },
  {
    field: 'tag',
    headerName: 'Tags',
    width: 150,
    type: 'centerAligned',
    cellRenderer: TagColumn,
    cellRendererParams: {
      maxWidth: 150,
      getValue: data => data.tag
    }
  }
]
