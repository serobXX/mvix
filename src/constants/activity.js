import {
  getAccountOptions,
  getLeadOptions,
  getOpportunityOptions,
  getOptionsByFieldAndEntity,
  transformDataForCustomFieldsName
} from 'utils/autocompleteOptions'
import { _capitalize } from 'utils/lodash'
import { optionEntity } from './autocompleteOptions'
import customFieldNames from './customFieldNames'
import { getIconClassName } from 'utils/iconUtils'
import iconNames, { iconTypes } from './iconNames'

export const activityTypeValues = {
  call: 'Call',
  meeting: 'Meeting',
  task: 'Task'
}

export const activityTypeOptions = [
  {
    icon: getIconClassName(iconNames.activityTask, iconTypes.light),
    tooltip: 'Task',
    label: 'Task',
    value: activityTypeValues.task,
    backgroundColor: 'rgb(254, 235, 141)',
    color: 'rgb(127, 107, 0)'
  },
  {
    icon: getIconClassName(iconNames.activityCall, iconTypes.light),
    tooltip: 'Log a Call',
    label: 'Log a Call',
    value: activityTypeValues.call,
    backgroundColor: 'rgb(204, 231, 159)',
    color: 'rgb(81, 115, 26)'
  },
  {
    icon: getIconClassName(iconNames.activityMeeting, iconTypes.light),
    tooltip: 'Schedule a Meeting',
    label: 'Schedule a Meeting',
    value: activityTypeValues.meeting,
    backgroundColor: 'rgb(219, 222, 227)',
    color: 'rgb(50, 58, 69)',
    disabled: true
  }
]

export const priorityOptions = [
  {
    label: 'Lowest',
    value: 'Lowest'
  },
  {
    label: 'Low',
    value: 'Low'
  },
  {
    label: 'Normal',
    value: 'Normal'
  },
  {
    label: 'High',
    value: 'High'
  },
  {
    label: 'Highest',
    value: 'Highest'
  }
]

export const activityStatusValues = {
  notStarted: 'Not started',
  deferred: 'Deferred',
  inProgress: 'In Progress',
  completed: 'Completed',
  waitingForInput: 'Waiting for input'
}

export const activityStatusOptions = [
  {
    label: 'Not started',
    value: activityStatusValues.notStarted,
    color: '#A295D6'
  },
  {
    label: 'Deferred',
    value: activityStatusValues.deferred,
    color: '#5843ad'
  },
  {
    label: 'In Progress',
    value: activityStatusValues.inProgress,
    color: '#b6b604'
  },
  {
    label: 'Completed',
    value: activityStatusValues.completed,
    color: '#5CB85C'
  },
  {
    label: 'Waiting for input',
    value: activityStatusValues.waitingForInput,
    color: '#cc338b'
  }
]

export const reminderUnitOptions = [
  {
    label: 'minutes',
    value: 'minutes'
  },
  {
    label: 'hours',
    value: 'hours'
  },
  {
    label: 'days',
    value: 'days'
  },
  {
    label: 'weeks',
    value: 'weeks'
  }
]

export const reminderTypeOptions = [
  {
    label: 'Email',
    value: 'email'
  },
  {
    label: 'Notification',
    value: 'notification'
  }
]

export const activityEntityType = {
  lead: 'Lead',
  accoount: 'Account',
  contact: 'Contact'
}

export const activityEntityOptions = [
  ...Object.values(activityEntityType).map(type => ({
    label: _capitalize(type),
    value: type
  }))
]

export const activityEntityAutoComplete = {
  [activityEntityType.lead]: getLeadOptions(null, null, {
    passIdForNumber: false
  }),
  [activityEntityType.accoount]: getAccountOptions(null, null, {
    passIdForNumber: false
  }),
  [activityEntityType.contact]: getOptionsByFieldAndEntity({
    field: [customFieldNames.firstName, customFieldNames.lastName, 'id'],
    entity: optionEntity.contact,
    transformData: transformDataForCustomFieldsName
  }),
  [activityEntityType.opportunity]: getOpportunityOptions(),
  [activityEntityType.estimate]: getOptionsByFieldAndEntity({
    field: [customFieldNames.estimateName, 'id'],
    entity: optionEntity.estimate
  })
}

export const activityFieldNames = {
  dueDate: 'dueDate',
  subject: 'subject',
  description: 'description',
  relatedTo: 'relatedTo',
  priority: 'priority',
  relatedToId: 'relatedToId',
  relatedToEntity: 'relatedToEntity',
  activityStatus: 'activityStatus',
  activityType: 'activityType',
  tag: 'tag'
}
