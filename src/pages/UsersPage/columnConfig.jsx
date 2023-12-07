import {
  TextWithTooltipColumn,
  DateTimeViewColumn,
  StatusColumn
} from 'components/tableColumns'

export const getColumns = () => [
  {
    headerName: 'Email',
    field: 'email',
    width: 200,
    type: 'centerAligned',
    cellRenderer: TextWithTooltipColumn
  },
  {
    headerName: 'Role',
    field: 'role_id',
    width: 100,
    type: 'centerAligned',
    cellRenderer: TextWithTooltipColumn,
    cellRendererParams: {
      getValue: data => {
        return data.role?.name
      }
    }
  },
  {
    field: 'createdAt',
    headerName: 'Created On',
    width: 100,
    type: 'centerAligned',
    cellRenderer: DateTimeViewColumn
  },
  {
    headerName: 'Status',
    field: 'status',
    width: 100,
    type: 'centerAligned',
    cellRenderer: StatusColumn
  }
]
