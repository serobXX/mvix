import update from 'immutability-helper'

import {
  customFieldLookupType,
  customFieldTypes,
  entityValues,
  fieldTypeToYupValidation,
  lookupTypeToAutoCompleteMapping
} from 'constants/customFields'
import { _get, _groupBy, _isEmpty, _uniqueId } from './lodash'
import {
  exceedCharacters,
  minCharacters,
  requiredField
} from 'constants/validationMessages'
import {
  getOptionsByFieldAndEntity,
  transformDataByValueName
} from './autocompleteOptions'
import { statusValues } from 'constants/commonOptions'
import customFieldNames from 'constants/customFieldNames'
import { hasHTTPSOrHTTP, removeHTTPSorHTTP } from './urlUtils'
import Yup from './yup'

export const sortDataBySortOrder = data =>
  [...data].sort((a, b) => a.sortOrder - b.sortOrder)

export const refreshSortOrder = data => {
  return sortDataBySortOrder(data).map((item, index) => ({
    ...item,
    sortOrder: index + 1
  }))
}

export const parseFields = data => {
  return data.map(({ parentId, options, ...item }) => ({
    ...item,
    ...(parentId ? { parentId } : {}),
    options: sortDataBySortOrder([...(options || [])]).map(({ id, name }) => ({
      label: name,
      value: id
    }))
  }))
}

export const parseFromBEData = data => {
  const group = _groupBy(data, 'parentId')
  const isTabHave = group[null]
    ? !group[null]?.some(({ type }) => type !== customFieldTypes.tab)
    : false
  if (isTabHave) {
    const _tabs = group[null]
    const parsedTabs = refreshSortOrder(parseFields(_tabs)).map(tab => ({
      ...tab,
      childs: refreshSortOrder(parseFields(group[tab.id] || []))
    }))
    return parsedTabs
  } else {
    const withoutTabs = (group[null] || []).filter(
      ({ type }) => type !== customFieldTypes.tab
    )
    return refreshSortOrder(parseFields(withoutTabs))
  }
}

export const generateTabCode = () => `tab-${_uniqueId()}`

export const generateItemCode = type => `item-${type}-${_uniqueId()}`

export const createCustomFieldTab = ({
  name,
  code,
  sortOrder = 1,
  childs = []
}) => {
  return {
    name,
    code,
    sortOrder,
    childs,
    type: customFieldTypes.tab
  }
}

export const createCustomFieldItem = (
  type,
  {
    name,
    code,
    sortOrder,
    isRequired = false,
    isUnique = false,
    options = [],
    width = 1,
    tooltip = '',
    tooltipType = 'text',
    property = {}
  }
) => ({
  type,
  code,
  name,
  sortOrder,
  isRequired,
  isUnique,
  options,
  width,
  tooltip,
  tooltipType,
  property
})

export const updateFieldValueByKey = ({
  fields = [],
  key = 'name',
  code: itemCode,
  value,
  activeTab,
  setFields,
  setDisplayFields,
  values,
  isTab = false
}) => {
  if (activeTab && !isTab) {
    const tabIndex = fields.findIndex(({ code }) => code === activeTab)
    if (tabIndex > -1) {
      const itemIndex = fields[tabIndex].childs.findIndex(
        ({ code }) => code === itemCode
      )
      if (itemIndex > -1) {
        const data = update(fields, {
          [tabIndex]: {
            childs: {
              [itemIndex]: {
                ...(values
                  ? Object.entries(values).reduce((a, [_key, _value]) => {
                      a[_key] = {
                        $set: _value
                      }
                      return a
                    }, {})
                  : {
                      [key]: {
                        $set: value
                      }
                    })
              }
            }
          }
        })

        setFields && setFields(data)
        setDisplayFields && setDisplayFields(data[tabIndex].childs)
        return data
      }
    }
  } else {
    const itemIndex = fields.findIndex(({ code }) => code === itemCode)
    if (itemIndex > -1) {
      const data = update(fields, {
        [itemIndex]: {
          ...(values
            ? Object.entries(values).reduce((a, [_key, _value]) => {
                a[_key] = {
                  $set: _value
                }
                return a
              }, {})
            : {
                [key]: {
                  $set: value
                }
              })
        }
      })

      setFields && setFields(data)
      setDisplayFields && !isTab && setDisplayFields(data)
      return data
    }
  }
}

export const createYupSchema = (schema, config) => {
  const { code, type, isRequired, property, isMultiple } = config
  if (!fieldTypeToYupValidation[type]) {
    return schema
  }
  let validator =
    type === customFieldTypes.lookup && isMultiple
      ? Yup.array()
      : fieldTypeToYupValidation[type]

  if (isRequired) {
    if (type === customFieldTypes.lookup && isMultiple) {
      validator = validator.min(1, requiredField)
    } else validator = validator.required(requiredField)
  }
  if (type === customFieldTypes.price) {
    if (property?.maxValue) {
      validator = validator.max(property.maxValue)
    }
  }
  if (_get(property, 'charLimit.isActive', false)) {
    validator = validator
      .min(_get(property, 'charLimit.minChar', 0), minCharacters())
      .max(_get(property, 'charLimit.maxChar', 100), exceedCharacters())
  }

  schema[code] = validator.nullable()
  return schema
}

export const getLookupOptions = (lookupType, transformDataByName = false) => {
  const { entity, field, transformData } =
    lookupTypeToAutoCompleteMapping[lookupType] || {}
  return entity
    ? getOptionsByFieldAndEntity({
        field,
        entity,
        transformData: transformDataByName
          ? transformDataByValueName
          : transformData,
        options: {
          status: statusValues.active
        },
        passIdForNumber: true
      })
    : null
}

export const displayFirstAndLastName = data =>
  `${_get(data, `customFields.${customFieldNames.firstName}`, '')} ${_get(
    data,
    `customFields.${customFieldNames.lastName}`,
    ''
  )}`

export const getTitleBasedOnEntity = (entity, data) => {
  switch (entity) {
    case entityValues.lead:
      return `${data?.salutation ? `${data?.salutation} ` : ''}${_get(
        data,
        `customFields.${customFieldNames.firstName}`,
        ''
      )} ${_get(data, `customFields.${customFieldNames.lastName}`, '')}`.trim()
    case entityValues.account:
      return _get(data, `customFields.${customFieldNames.accountName}`, '')
    case entityValues.contact:
      return `${data?.salutation ? `${data?.salutation} ` : ''}${_get(
        data,
        `customFields.${customFieldNames.firstName}`,
        ''
      )} ${_get(data, `customFields.${customFieldNames.lastName}`, '')}`.trim()
    case entityValues.opportunity:
      return (
        _get(data, `${customFieldNames.opportunityName}`, '') ||
        data?.projectName
      )
    case entityValues.estimate:
      return _get(data, `${customFieldNames.estimateName}`, '')
    case entityValues.product:
      return _get(data, `customFields.${customFieldNames.productName}`, '')
    default:
      return ''
  }
}

export const getOptionForLookupType = (lookup, data) => {
  if (lookup === customFieldLookupType.user) {
    return {
      value: data.id,
      label: `${data.first_name} ${data.last_name}`
    }
  } else if (lookup === customFieldLookupType.account) {
    return {
      value: data.id,
      label: getTitleBasedOnEntity(entityValues.account, data)
    }
  } else {
    return {
      value: data.id,
      label: data.name
    }
  }
}

export const getLabelFromCustomField = (layout, _code) =>
  layout.find(({ code }) => code === _code)?.name

export const getFieldFromCustomFieldCode = (layout, _code) =>
  layout && layout.find(({ code }) => code === _code)

export const getOwnerBasedOnEntity = (entity, data) => {
  switch (entity) {
    case entityValues.lead:
      return _get(data, `customFields.${customFieldNames.leadOwner}`, {})
    case entityValues.account:
      return _get(data, `customFields.${customFieldNames.accountOwner}`, {})
    case entityValues.contact:
      return _get(data, `customFields.${customFieldNames.contactOwner}`, {})
    case entityValues.opportunity:
      return _get(data, `customFields.${customFieldNames.opportunityOwner}`, {})
    case entityValues.estimate:
      return _get(data, `customFields.${customFieldNames.estimateOwner}`, {})
    default:
      return {}
  }
}
export const getCustomFieldValueByCode = (data, code, fallback = '') =>
  _get(data, `customFields.${code}`, fallback)

export const parsePhoneNumber = value => {
  let val = value
  if (val && !val?.startsWith?.('+')) {
    val = '+1 ' + val
  }
  return val
}

export const parseBEValues = (layout, values) => {
  return Object.entries(values).reduce((a, [key, value]) => {
    const field = getFieldFromCustomFieldCode(layout, key)
    a[key] = value
    if (field) {
      if (field.type === customFieldTypes.phone) {
        a[key] = parsePhoneNumber(value)
      }
      if (field.type === customFieldTypes.text && hasHTTPSOrHTTP(value)) {
        a[key] = removeHTTPSorHTTP(value)
      }
    }
    return a
  }, {})
}

export const getCustomFieldInitialValues = (
  value,
  { type, options, property, isMultiple },
  defaultValue
) => {
  return type !== customFieldTypes.bool && _isEmpty(value)
    ? (type === customFieldTypes.lookup
        ? defaultValue || property?.defaultValue || (isMultiple ? [] : '')
        : type === customFieldTypes.select
        ? options.find(
            ({ name }) => name === (defaultValue || property?.defaultValue)
          )?.id
        : '') || ''
    : value
}
