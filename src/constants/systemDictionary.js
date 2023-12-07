import { permissionGroupNames } from './permissionGroups'
import iconNames, { iconTypes } from './iconNames'
import { getIconClassName } from 'utils/iconUtils'

export const tabNames = {
  lead: 'lead',
  contact: 'contact',
  account: 'account',
  opportunity: 'opportunity',
  activity: 'activity'
}

export const subtabNames = {
  industry: 'industry',
  source: 'source',
  leadType: 'lead-type',
  leadStatus: 'lead-status',
  solution: 'solution',
  partnership: 'partnership',
  authority: 'authority',
  contactType: 'contact-type',
  stages: 'stages',
  subjectLine: 'subject-line'
}

export const tabMapping = {
  [tabNames.lead]: {
    title: 'Lead',
    subtabs: [
      subtabNames.leadType,
      subtabNames.leadStatus,
      subtabNames.source,
      subtabNames.industry,
      subtabNames.solution
    ]
  },
  [tabNames.contact]: {
    title: 'Contact',
    subtabs: [subtabNames.contactType, subtabNames.authority]
  },
  [tabNames.account]: {
    title: 'Account',
    subtabs: [subtabNames.partnership]
  },
  [tabNames.opportunity]: {
    title: 'Opportunity',
    subtabs: [subtabNames.stages]
  },
  [tabNames.activity]: {
    title: 'Activity',
    subtabs: [subtabNames.subjectLine]
  }
}

export const subtabTitles = {
  [subtabNames.industry]: {
    tab: 'Industries',
    rootPage: 'Industries',
    addPage: 'Add Industry',
    editPage: 'Edit Industry',
    emptyPlaceholder: 'No saved industries'
  },
  [subtabNames.source]: {
    tab: 'Sources',
    rootPage: 'Sources',
    addPage: 'Add Source',
    editPage: 'Edit Source',
    emptyPlaceholder: 'No saved sources'
  },
  [subtabNames.leadType]: {
    tab: 'Types',
    rootPage: 'Types',
    addPage: 'Add Type',
    editPage: 'Edit Type',
    emptyPlaceholder: 'No saved types'
  },
  [subtabNames.leadStatus]: {
    tab: 'Status',
    rootPage: 'Status',
    addPage: 'Add Status',
    editPage: 'Edit Status',
    emptyPlaceholder: 'No saved status'
  },
  [subtabNames.solution]: {
    tab: 'Solutions',
    rootPage: 'Solutions',
    addPage: 'Add Solution',
    editPage: 'Edit Solution',
    emptyPlaceholder: 'No saved solutions'
  },
  [subtabNames.contactType]: {
    tab: 'Types',
    rootPage: 'Types',
    addPage: 'Add Type',
    editPage: 'Edit Type',
    emptyPlaceholder: 'No saved contact types'
  },
  [subtabNames.authority]: {
    tab: 'Authorities',
    rootPage: 'Authorities',
    addPage: 'Add Authority',
    editPage: 'Edit Authority',
    emptyPlaceholder: 'No saved contact authorities'
  },
  [subtabNames.partnership]: {
    tab: 'Partnership',
    rootPage: 'Partnership',
    addPage: 'Add Partnership',
    editPage: 'Edit Partnership',
    emptyPlaceholder: 'No saved account partnership'
  },
  [subtabNames.stages]: {
    tab: 'Stages',
    rootPage: 'Stages',
    addPage: 'Add Stage',
    editPage: 'Edit Stage',
    emptyPlaceholder: 'No saved opportunity stages'
  },
  [subtabNames.subjectLine]: {
    tab: 'Subject Lines',
    rootPage: 'Subject Lines',
    addPage: 'Add Subject Line',
    editPage: 'Edit Subject Line',
    emptyPlaceholder: 'No saved subject line'
  }
}

export const subtabs = {
  [subtabNames.leadStatus]: {
    icon: getIconClassName(iconNames.leadStatus, iconTypes.solid),
    label: subtabTitles[subtabNames.leadStatus].tab,
    value: subtabNames.leadStatus
  },
  [subtabNames.source]: {
    icon: getIconClassName(
      iconNames.leadSource,
      iconTypes.solid,
      iconTypes.sharp
    ),
    label: subtabTitles[subtabNames.source].tab,
    value: subtabNames.source
  },
  [subtabNames.leadType]: {
    icon: getIconClassName(iconNames.leadType, iconTypes.solid),
    label: subtabTitles[subtabNames.leadType].tab,
    value: subtabNames.leadType
  },
  [subtabNames.industry]: {
    icon: getIconClassName(iconNames.industry),
    label: subtabTitles[subtabNames.industry].tab,
    value: subtabNames.industry
  },
  [subtabNames.solution]: {
    icon: getIconClassName(iconNames.solution),
    label: subtabTitles[subtabNames.solution].tab,
    value: subtabNames.solution
  },
  [subtabNames.contactType]: {
    icon: getIconClassName(iconNames.contactType),
    label: subtabTitles[subtabNames.contactType].tab,
    value: subtabNames.contactType
  },
  [subtabNames.authority]: {
    icon: getIconClassName(iconNames.contactAuthority, iconTypes.solid),
    label: subtabTitles[subtabNames.authority].tab,
    value: subtabNames.authority
  },
  [subtabNames.partnership]: {
    icon: getIconClassName(iconNames.accountPartnership),
    label: subtabTitles[subtabNames.partnership].tab,
    value: subtabNames.partnership
  },
  [subtabNames.stages]: {
    icon: getIconClassName(iconNames.opportunityStage, iconTypes.solid),
    label: subtabTitles[subtabNames.stages].tab,
    value: subtabNames.stages
  },
  [subtabNames.subjectLine]: {
    icon: getIconClassName(iconNames.subject, iconTypes.solid),
    label: subtabTitles[subtabNames.subjectLine].tab,
    value: subtabNames.subjectLine
  }
}

export const subtabPermissions = {
  [subtabNames.industry]: permissionGroupNames.industries,
  [subtabNames.source]: permissionGroupNames.leadSource,
  [subtabNames.leadStatus]: permissionGroupNames.leadStatus,
  [subtabNames.leadType]: permissionGroupNames.leadType,
  [subtabNames.solution]: permissionGroupNames.solutions,
  [subtabNames.contactType]: permissionGroupNames.contactType,
  [subtabNames.authority]: permissionGroupNames.contactAuthority,
  [subtabNames.partnership]: permissionGroupNames.accountPartnership,
  [subtabNames.stages]: permissionGroupNames.stage,
  [subtabNames.subjectLine]: permissionGroupNames.subjectLine
}
