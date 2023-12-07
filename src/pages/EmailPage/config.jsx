import {
  FormControlDatePicker,
  FormControlInput
} from 'components/formControls'
import {
  DateTimeViewColumn,
  TextWithTooltipColumn
} from 'components/tableColumns'
import { getTitleBasedOnEntity } from 'utils/customFieldUtils'

export const getColumns = () => [
  {
    field: 'to',
    headerName: 'To',
    type: 'centerAligned',
    width: 150,
    cellRenderer: TextWithTooltipColumn,
    cellRendererParams: {
      getValue: ({ to }) => to.join(', ')
    }
  },
  {
    field: 'relatedToEntity',
    headerName: 'Related Entity',
    type: 'centerAligned',
    width: 150,
    cellRenderer: TextWithTooltipColumn
  },
  {
    field: 'relatedToId',
    headerName: 'Related Record',
    type: 'centerAligned',
    width: 150,
    cellRenderer: TextWithTooltipColumn,
    cellRendererParams: {
      getValue: ({ relatedToEntity, relatedEntity }) =>
        relatedEntity
          ? getTitleBasedOnEntity(relatedToEntity, relatedEntity)
          : ''
    }
  },
  {
    field: 'receivedDate',
    headerName: 'Date',
    type: 'centerAligned',
    width: 150,
    cellRenderer: DateTimeViewColumn
  }
]

export const getFilters = () => [
  {
    field: 'subject',
    filter: FormControlInput
  },
  {
    field: 'to',
    filter: FormControlInput
  },
  {
    field: 'receivedDate',
    filter: FormControlDatePicker,
    filterProps: {
      isClearable: true,
      withPortal: true,
      minDate: null
    }
  }
]
