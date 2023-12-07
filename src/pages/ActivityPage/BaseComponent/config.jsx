import moment from 'moment'

import { TagColumn, TextWithTooltipColumn } from 'components/tableColumns'
import {
  activityEntityOptions,
  activityEntityType,
  activityStatusOptions,
  activityTypeOptions,
  priorityOptions
} from 'constants/activity'
import { DATE_VIEW_FORMAT } from 'constants/dateTimeFormats'
import { BACKEND_DATE_FORMAT } from 'constants/dateTimeFormats'
import {
  BACKEND_DATE_TIME_FORMAT,
  DATE_TIME_VIEW_FORMAT,
  NORMAL_DATE_TIME_AP_FORMAT
} from 'constants/dateTimeFormats'
import ChipColumn from 'components/tableColumns/ChipColumn'
import {
  FormControlAutocomplete,
  FormControlDatePicker,
  FormControlDateTimePicker,
  FormControlInput,
  FormControlReactSelect,
  FormControlSelectTag
} from 'components/formControls'
import {
  getActivityOptions,
  getUserOptions,
  transformDataByValueName
} from 'utils/autocompleteOptions'
import { _isEqual } from 'utils/lodash'
import {
  chipObjToTag,
  convertArr,
  fromChipObj,
  tagToChipObj
} from 'utils/select'
import ReminderColumn from './ReminderColumn'
import { tagEntityType } from 'constants/tagConstants'
import queryParamsHelper from 'utils/queryParamsHelper'
import { getTitleBasedOnEntity } from 'utils/customFieldUtils'
import { entityValues } from 'constants/customFields'

const getRelatedToValue = data => {
  if (data.relatedToEntity === activityEntityType.accoount) {
    return getTitleBasedOnEntity(entityValues.account, data?.relatedItem)
  } else if (data.relatedToEntity === activityEntityType.opportunity) {
    return getTitleBasedOnEntity(entityValues.opportunity, data?.relatedItem)
  } else if (data.relatedToEntity === activityEntityType.estimate) {
    return getTitleBasedOnEntity(entityValues.estimate, data?.relatedItem)
  } else if (data.relatedToEntity === activityEntityType.contact) {
    return getTitleBasedOnEntity(entityValues.contact, data?.relatedItem)
  } else {
    return getTitleBasedOnEntity(entityValues.lead, data?.relatedItem)
  }
}

export const getColumns = () => [
  {
    headerName: 'Type',
    field: 'activityType',
    width: 120,
    type: 'centerAligned',
    cellRenderer: ChipColumn,
    cellRendererParams: {
      getProps: data => {
        const { icon, label, backgroundColor, color } =
          activityTypeOptions.find(
            ({ value }) => value === data.activityType
          ) || {}
        return {
          label,
          iconClassName: icon,
          backgroundColor,
          color: color || 'rgb(255,255,255)'
        }
      }
    }
  },
  {
    headerName: 'Start Date',
    field: 'startedAt',
    width: 150,
    type: 'centerAligned',
    cellRenderer: TextWithTooltipColumn,
    cellRendererParams: {
      getValue: data => {
        return (
          data.startedAt &&
          moment(data.startedAt, BACKEND_DATE_TIME_FORMAT).format(
            DATE_TIME_VIEW_FORMAT
          )
        )
      }
    }
  },
  {
    headerName: 'End Date',
    field: 'endedAt',
    width: 150,
    type: 'centerAligned',
    cellRenderer: TextWithTooltipColumn,
    cellRendererParams: {
      getValue: data => {
        return (
          data.endedAt &&
          moment(data.endedAt, BACKEND_DATE_TIME_FORMAT).format(
            DATE_TIME_VIEW_FORMAT
          )
        )
      }
    }
  },
  {
    headerName: 'Priority',
    field: 'priority',
    width: 80,
    type: 'centerAligned',
    cellRenderer: TextWithTooltipColumn,
    cellRendererParams: {
      getValue: data =>
        priorityOptions.find(({ value }) => value === data.priority)?.label
    }
  },
  {
    headerName: 'Status',
    field: 'activityStatus',
    width: 120,
    type: 'centerAligned',
    cellRenderer: ChipColumn,
    cellRendererParams: {
      getProps: data => {
        const { label, color } =
          activityStatusOptions.find(
            ({ value }) => value === data.activityStatus
          ) || {}
        return {
          label,
          backgroundColor: 'transparent',
          color
        }
      }
    }
  },
  {
    headerName: 'Reminders',
    field: 'reminders',
    width: 80,
    type: 'centerAligned',
    cellRenderer: ReminderColumn
  },
  {
    headerName: 'Associated Entity',
    field: 'relatedToEntity',
    width: 120,
    type: 'centerAligned',
    cellRenderer: TextWithTooltipColumn
  },
  {
    headerName: 'Associated With',
    field: 'relatedToId',
    width: 120,
    type: 'centerAligned',
    cellRenderer: TextWithTooltipColumn,
    cellRendererParams: {
      getValue: getRelatedToValue
    }
  },
  {
    headerName: 'Task Owner',
    field: 'relatedTo',
    width: 100,
    type: 'centerAligned',
    cellRenderer: TextWithTooltipColumn,
    cellRendererParams: {
      getValue: data =>
        `${data.relatedTo?.firstName} ${data.relatedTo?.lastName}`
    }
  },
  {
    headerName: 'Due Date',
    field: 'dueDate',
    width: 120,
    type: 'centerAligned',
    cellRenderer: TextWithTooltipColumn,
    cellRendererParams: {
      getValue: data =>
        moment(data.dueDate, BACKEND_DATE_FORMAT).format(DATE_VIEW_FORMAT)
    }
  },
  {
    field: 'tag',
    headerName: 'Tags',
    width: 100,
    type: 'centerAligned',
    cellRenderer: TagColumn,
    cellRendererParams: {
      maxWidth: 100,
      getValue: data => data.tag
    }
  }
]

export const getFilters = (hideStatusOptions = []) => [
  {
    field: 'subject',
    filter: FormControlAutocomplete,
    filterProps: {
      getOptions: getActivityOptions('subject', transformDataByValueName),
      withPortal: true,
      isClearable: true,
      isCreatable: true
    }
  },
  {
    field: 'activityType',
    filter: FormControlReactSelect,
    filterProps: {
      options: activityTypeOptions.filter(({ disabled }) => !disabled),
      withPortal: true,
      isClearable: true,
      isMulti: true,
      isMultiSelection: true,
      fixedHeight: true,
      isSort: false
    }
  },
  {
    field: 'priority',
    filter: FormControlReactSelect,
    filterProps: {
      options: priorityOptions,
      withPortal: true,
      isClearable: true
    }
  },
  {
    field: 'activityStatus',
    filter: FormControlReactSelect,
    filterProps: {
      options: activityStatusOptions.filter(
        ({ value }) => !hideStatusOptions.includes(value)
      ),
      withPortal: true,
      isClearable: true,
      isMulti: true,
      isMultiSelection: true,
      fixedHeight: true
    }
  },
  {
    field: 'relatedToEntity',
    filter: FormControlReactSelect,
    filterProps: {
      options: activityEntityOptions,
      withPortal: true,
      isClearable: true,
      isSort: false
    }
  },
  {
    field: 'relatedTo',
    filter: FormControlAutocomplete,
    filterProps: {
      getOptions: getUserOptions(),
      withPortal: true,
      isClearable: true,
      isCreatable: false
    }
  },
  {
    field: 'dueDate',
    filter: FormControlDatePicker,
    filterProps: {
      isClearable: true,
      hideIcon: true,
      withPortal: true
    }
  },
  {
    field: 'tag',
    filter: FormControlSelectTag,
    filterProps: {
      withPortal: true,
      isMultiSelection: true,
      hasDynamicChipsCreation: false,
      fixedHeight: true,
      entityType: tagEntityType.activity
    }
  }
]

export const getEditors = () => [
  {
    field: 'subject',
    cellEditor: FormControlInput
  },
  {
    field: 'activityType',
    cellEditor: FormControlReactSelect,
    cellEditorProps: {
      options: activityTypeOptions.filter(({ disabled }) => !disabled),
      withPortal: true,
      isInput: false,
      isSort: false
    }
  },
  {
    field: 'startedAt',
    cellEditor: FormControlDateTimePicker,
    cellEditorProps: ({ endedAt }) => ({
      hideIcon: true,
      withPortal: true,
      maxDate: moment(endedAt, BACKEND_DATE_TIME_FORMAT).format(
        NORMAL_DATE_TIME_AP_FORMAT
      )
    }),
    valueSetter: params => {
      if (params.newValue) {
        params.data.startedAt = moment(
          params.newValue,
          NORMAL_DATE_TIME_AP_FORMAT
        ).format(BACKEND_DATE_TIME_FORMAT)
        return true
      }
      return false
    }
  },
  {
    field: 'endedAt',
    cellEditor: FormControlDateTimePicker,
    cellEditorProps: ({ startedAt }) => ({
      hideIcon: true,
      withPortal: true,
      minDate: moment(startedAt, BACKEND_DATE_TIME_FORMAT).format(
        NORMAL_DATE_TIME_AP_FORMAT
      )
    }),
    valueSetter: params => {
      if (params.newValue) {
        params.data.endedAt = moment(
          params.newValue,
          NORMAL_DATE_TIME_AP_FORMAT
        ).format(BACKEND_DATE_TIME_FORMAT)
        return true
      }
      return false
    }
  },
  {
    field: 'priority',
    cellEditor: FormControlReactSelect,
    cellEditorProps: {
      options: priorityOptions,
      withPortal: true,
      isInput: false
    }
  },
  {
    field: 'activityStatus',
    cellEditor: FormControlReactSelect,
    cellEditorProps: {
      options: activityStatusOptions,
      withPortal: true,
      isInput: false
    }
  },
  {
    field: 'relatedTo',
    cellEditor: FormControlAutocomplete,
    cellEditorProps: ({ relatedTo }) => ({
      getOptions: getUserOptions(),
      withPortal: true,
      uniqueOptions: true,
      staticOptions: [
        {
          label: `${relatedTo.firstName} ${relatedTo.lastName}`,
          value: relatedTo.id
        }
      ]
    }),
    valueGetter: params => params.data?.relatedTo?.id,
    valueSetter: params => {
      if (params.newValue) {
        params.data.changedRelatedTo = params.newValue
        return true
      }
      return false
    }
  },
  {
    field: 'dueDate',
    cellEditor: FormControlDatePicker,
    cellEditorProps: {
      hideIcon: true,
      withPortal: true,
      isInput: false
    }
  },
  {
    field: 'tag',
    cellEditor: FormControlSelectTag,
    cellEditorProps: {
      isMultiSelection: true,
      withPortal: true,
      entityType: tagEntityType.activity
    },
    valueGetter: params => convertArr(params.data?.tag, tagToChipObj),
    valueSetter: params => {
      if (
        params.newValue &&
        !_isEqual(convertArr(params.newValue, chipObjToTag), params.data.tag)
      ) {
        params.data.tag = convertArr(params.newValue, chipObjToTag)
        return true
      }
      return false
    }
  }
]

export const parseActivityPayloadForNewData = (data, newData = {}) => {
  const {
    id,
    relatedTo,
    startedAt,
    endedAt,
    activityType,
    activityStatus,
    priority,
    dueDate,
    subject,
    relatedToEntity,
    relatedItem,
    description,
    reminderAt,
    reminderType,
    tag
  } = data

  return {
    id,
    data: queryParamsHelper({
      relatedTo: relatedTo.id,
      startedAt,
      endedAt,
      activityType,
      activityStatus,
      priority,
      dueDate,
      subject,
      relatedToEntity,
      relatedToId: relatedItem?.id,
      description,
      reminderAt,
      reminderType,
      tag: convertArr(convertArr(tag, tagToChipObj), fromChipObj),
      ...newData
    })
  }
}
