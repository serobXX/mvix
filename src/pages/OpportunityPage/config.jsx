import { hexToRgb } from '@material-ui/core'
import { FormControlAutocomplete } from 'components/formControls'
import { TextWithTooltipColumn } from 'components/tableColumns'
import ChipColumn from 'components/tableColumns/ChipColumn'
import { optionEntity } from 'constants/autocompleteOptions'
import { entityValues } from 'constants/customFields'
import iconNames from 'constants/iconNames'
import { updateFieldName } from 'constants/library'
import { opportunityStageColors } from 'constants/opportunityConstants'
import {
  getAccountOptions,
  getOptionsByFieldAndEntity
} from 'utils/autocompleteOptions'
import {
  getDarkenColorFromRgb,
  getLightenColorFromRgb,
  getRandomColor
} from 'utils/color'
import {
  getTitleBasedOnEntity,
  sortDataBySortOrder
} from 'utils/customFieldUtils'
import { getIconClassName } from 'utils/iconUtils'
import { _get } from 'utils/lodash'

export const getColumns = () => [
  {
    field: 'stageId',
    headerName: 'Stage',
    width: 170,
    type: 'centerAligned',
    cellRenderer: ChipColumn,
    cellRendererParams: {
      getProps: data => {
        const stage = _get(data, `stage.name`, '')
        const randomColor = hexToRgb(getRandomColor())
        return {
          label: stage,
          backgroundColor:
            opportunityStageColors[stage]?.background ||
            getLightenColorFromRgb(randomColor, 0.5),
          color:
            opportunityStageColors[stage]?.color ||
            getDarkenColorFromRgb(randomColor, 0.5)
        }
      },
      getValue: data => _get(data, `stage.name`, '')
    }
  },
  {
    field: 'accountId',
    headerName: 'Account Name',
    positionIndex: 1,
    width: 170,
    type: 'centerAligned',
    cellRenderer: TextWithTooltipColumn,
    cellRendererParams: {
      getValue: data =>
        getTitleBasedOnEntity(entityValues.account, data.account)
    }
  }
]

export const getFilters = () => [
  {
    field: 'stageId',
    filter: FormControlAutocomplete,
    filterProps: {
      getOptions: getOptionsByFieldAndEntity({
        field: ['name', 'id'],
        entity: optionEntity.stage,
        transformData: data =>
          sortDataBySortOrder([...data]).map(({ name, id }) => ({
            label: name,
            value: id
          }))
      }),
      withPortal: true,
      isClearable: true
    }
  },
  {
    field: 'accountId',
    filter: FormControlAutocomplete,
    filterProps: {
      getOptions: getAccountOptions(),
      withPortal: true,
      isClearable: true
    }
  }
]

export const getEditors = () => [
  {
    field: 'stageId',
    cellEditor: FormControlAutocomplete,
    cellEditorProps: data => ({
      getOptions: getOptionsByFieldAndEntity({
        field: ['name', 'id'],
        entity: optionEntity.stage,
        transformData: stages =>
          sortDataBySortOrder([...stages]).map(({ name, id }) => ({
            label: name,
            value: id
          })),
        passIdForNumber: true
      }),
      withPortal: true,
      isInput: false,
      initialFetchValue: _get(
        data,
        `stageLog.${_get(data, 'stageLog.length', 1) - 1}.stage.id`,
        ''
      )
    }),
    valueGetter: ({ data }) => {
      return _get(data, `stage.id`, '')
    },
    valueSetter: ({ data, newValue }) => {
      if (newValue && newValue !== _get(data, `stage.name`, '')) {
        data.stageId = newValue
        return true
      }
      return false
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
    label: 'Change Stage',
    clickAction: handleOpenUpdateModal({
      field: updateFieldName.stage,
      title: 'Change Stage'
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
