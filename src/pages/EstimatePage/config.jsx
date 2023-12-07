import {
  FormControlAutocomplete,
  FormControlInput,
  FormControlReactSelect
} from 'components/formControls'
import { TextWithTooltipColumn } from 'components/tableColumns'
import { statusValues } from 'constants/commonOptions'
import customFieldNames from 'constants/customFieldNames'
import { entityValues } from 'constants/customFields'
import {
  BACKEND_DATE_FORMAT,
  DATE_VIEW_FORMAT
} from 'constants/dateTimeFormats'
import { estimateStatusOptions } from 'constants/estimate'
import iconNames from 'constants/iconNames'
import { updateFieldName } from 'constants/library'
import { ADMINISTRATOR } from 'constants/roleConstants'
import moment from 'moment'
import {
  getAccountOptions,
  getContactOptions,
  getEstimateOptions,
  getOpportunityOptions,
  transformDataByValueName
} from 'utils/autocompleteOptions'
import {
  displayFirstAndLastName,
  getTitleBasedOnEntity
} from 'utils/customFieldUtils'
import { getIconClassName } from 'utils/iconUtils'
import { _get } from 'utils/lodash'

export const getColumns = () => [
  {
    field: 'estimateValidityDuration',
    headerName: 'Validity Duration',
    width: 150,
    cellRenderer: TextWithTooltipColumn,
    type: 'centerAligned',
    cellRendererParams: {
      getValue: ({ estimateValidityDuration }) =>
        estimateValidityDuration &&
        moment(estimateValidityDuration, BACKEND_DATE_FORMAT).format(
          DATE_VIEW_FORMAT
        )
    },
    positionIndex: 1
  },
  {
    field: 'accountId',
    headerName: 'Account',
    type: 'centerAligned',
    width: 150,
    cellRenderer: TextWithTooltipColumn,
    positionIndex: 1,
    cellRendererParams: {
      getValue: ({ account }) =>
        _get(account, `customFields.${customFieldNames.accountName}`, '')
    }
  },
  {
    field: 'contactId',
    headerName: 'Contact',
    type: 'centerAligned',
    width: 150,
    cellRenderer: TextWithTooltipColumn,
    positionIndex: 1,
    cellRendererParams: {
      getValue: ({ contact }) => displayFirstAndLastName(contact)
    }
  },
  {
    field: 'opportunityId',
    headerName: 'Opportunity',
    type: 'centerAligned',
    width: 150,
    cellRenderer: TextWithTooltipColumn,
    positionIndex: 1,
    cellRendererParams: {
      getValue: ({ opportunity }) =>
        getTitleBasedOnEntity(entityValues.opportunity, opportunity)
    }
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 200,
    type: 'centerAligned',
    cellRenderer: TextWithTooltipColumn
  }
]

export const getFilters = role => [
  {
    field: 'estimateName',
    filter: FormControlAutocomplete,
    filterProps: {
      withPortal: true,
      isClearable: true,
      isCreatable: true,
      getOptions: getEstimateOptions(null, transformDataByValueName)
    }
  },
  {
    field: 'status',
    filter: FormControlReactSelect,
    filterProps: {
      withPortal: true,
      isClearable: true,
      options: [
        ...estimateStatusOptions(true),
        ...(role?.name === ADMINISTRATOR
          ? [
              {
                label: statusValues.disabled,
                value: statusValues.disabled
              }
            ]
          : [])
      ],
      isMulti: true,
      isMultiSelection: true,
      fixedHeight: true
    }
  },
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
    field: 'opportunityId',
    filter: FormControlAutocomplete,
    filterProps: {
      withPortal: true,
      isClearable: true,
      getOptions: getOpportunityOptions()
    }
  }
]

export const getEditors = () => [
  {
    field: 'estimateName',
    cellEditor: FormControlInput
  },
  {
    field: 'status',
    cellEditor: FormControlReactSelect,
    cellEditorProps: {
      withPortal: true,
      options: estimateStatusOptions(),
      isInput: false
    }
  },
  {
    field: 'accountId',
    cellEditor: FormControlAutocomplete,
    cellEditorProps: value => ({
      withPortal: true,
      getOptions: getAccountOptions(),
      isInput: false,
      initialFetchValue: value?.account?.id
    }),
    valueGetter: ({ data: { account = {} } = {} }) => {
      return account?.id
    },
    valueSetter: params => {
      if (
        params.newValue &&
        params.newValue !== _get(params.data, 'account.id', '')
      ) {
        params.data.accountId = params.newValue
        return true
      }
      return false
    }
  },
  {
    field: 'contactId',
    cellEditor: FormControlAutocomplete,
    cellEditorProps: value => ({
      withPortal: true,
      getOptions: getContactOptions(),
      isInput: false,
      initialFetchValue: value
    }),
    valueGetter: ({ data: { contact = {} } = {} }) => {
      return contact?.id
    },
    valueSetter: params => {
      if (
        params.newValue &&
        params.newValue !== _get(params.data, 'contact.id', '')
      ) {
        params.data.contactId = params.newValue
        return true
      }
      return false
    }
  },
  {
    field: 'opportunityId',
    cellEditor: FormControlAutocomplete,
    cellEditorProps: value => ({
      withPortal: true,
      getOptions: getOpportunityOptions(),
      isInput: false,
      initialFetchValue: value?.opportunity?.id
    }),
    valueGetter: ({ data: { opportunity = {} } = {} }) => {
      return opportunity?.id
    },
    valueSetter: params => {
      if (
        params.newValue &&
        params.newValue !== _get(params.data, 'opportunity.id', '')
      ) {
        params.data.opportunityId = params.newValue
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
    label: 'Change Status',
    clickAction: handleOpenUpdateModal({
      field: updateFieldName.estimateStatus,
      title: 'Change Status'
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
