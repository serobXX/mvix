import {
  FormControlAutocomplete,
  FormControlInput,
  FormControlReactSelect
} from 'components/formControls'
import { TextWithTooltipColumn,StatusColumn } from 'components/tableColumns'
import { filterStatusOptions } from 'constants/commonOptions'
import { entityValues } from 'constants/customFields'
import { filterTypeValues } from 'constants/filter'
import iconNames from 'constants/iconNames'
import { updateFieldName } from 'constants/library'
// eslint-disable-next-line no-restricted-imports
import { getAccountOptions, getContactOptions } from 'utils/autocompleteOptions'
import { getTitleBasedOnEntity } from 'utils/customFieldUtils'
import { getIconClassName } from 'utils/iconUtils'
import { createdAndUpdatedColumns } from 'utils/libraryUtils'
import { _get } from 'utils/lodash'

export const getColumns = () => [
  {
    headerName: 'Account',
    field: 'accountId',
    width: 150,
    cellRenderer: TextWithTooltipColumn,
    type: 'centerAligned',
    cellRendererParams: {
      getValue: ({ account }) =>
        getTitleBasedOnEntity(entityValues.account, account)
    }
  },
  {
    headerName: 'Contact',
    field: 'contactId',
    width: 150,
    cellRenderer: TextWithTooltipColumn,
    type: 'centerAligned',
    cellRendererParams: {
      getValue: ({ contact }) =>
        getTitleBasedOnEntity(entityValues.contact, contact)
    }
  },
  {
    headerName: 'Device',
    field: 'deviceId',
    width: 150,
    cellRenderer: TextWithTooltipColumn,
    type: 'centerAligned',
    cellRendererParams: {
      getValue: ({ device }) => _get(device, 'name', '')
    }
  },
  {
    headerName: 'Category',
    field: 'category',
    width: 150,
    cellRenderer: TextWithTooltipColumn,
    type: 'centerAligned',
    cellRendererParams: {
      getValue: ({ category }) => _get(category, 'name', '')
    }
  },
  {
    headerName: 'Serial Number',
    field: 'serialNumber',
    width: 150,
    cellRenderer: TextWithTooltipColumn,
    type: 'centerAligned',
    cellRendererParams: {}
  },
  {
    headerName: 'Subject',
    field: 'subject',
    width: 150,
    cellRenderer: TextWithTooltipColumn,
    type: 'centerAligned',
    cellRendererParams: {
      getValue: ({ subject }) => subject
    }
  },
  {
    headerName: 'Reported By',
    field: 'reportedVia',
    width: 150,
    cellRenderer: TextWithTooltipColumn,
    type: 'centerAligned',
    cellRendererParams: {
      getValue: ({ reportedVia }) => reportedVia
    }
  },
  {
    headerName: 'Ticket Owner',
    field: 'ticketOwner',
    width: 150,
    cellRenderer: TextWithTooltipColumn,
    type: 'centerAligned',
    cellRendererParams: {
      getValue: ({ ticketOwner }) =>
        [
          _get(ticketOwner, 'firstName', ''),
          _get(ticketOwner, 'lastName', '')
        ].join(' ')
    }
  },
  {
    headerName: 'Record Status',
    field: 'status',
    width: 100,
    type: 'centerAligned',
    cellRenderer: StatusColumn,
    cellRendererParams: {
      getValue: ({ status }) =>  _get(status, 'status', '') ,
    }
  },
  ...createdAndUpdatedColumns
]

export const getFilters = () => [
  {
    field: 'accountId',
    filter: FormControlAutocomplete,
    filterProps: {
      withPortal: true,
      isClearable: true,
      getOptions: getAccountOptions()
    }
  },
  {
    field: 'contactId',
    filter: FormControlAutocomplete,
    filterProps: {
      withPortal: true,
      isClearable: true,
      getOptions: getContactOptions()
    }
  },
  {
    field: 'email',
    filter: FormControlInput,
    filterProps: {
      filterType: filterTypeValues.string
    }
  },
  {
    field: 'phone',
    filter: FormControlInput,
    filterProps: {
      filterType: filterTypeValues.string
    }
  },
  {
    field: 'status',
    headerName:"Record Status",
    filter: FormControlReactSelect,
    filterProps: {
      withPortal: true,
      isClearable: true,
      options: filterStatusOptions,
      isMulti: true,
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
    label: 'Delete',
    clickAction: handleBulkDelete,
    icon: getIconClassName(iconNames.delete),
    render: permission.delete
  }
]
