import { Base64 } from 'js-base64'

import { optionEntity, serviceOptions } from 'constants/autocompleteOptions'
import { store } from '../store/store'
import { parseGetData } from './apiUtils'
import queryParamsHelper from './queryParamsHelper'
import { tagToChipObj } from './select'
import { _get, _uniqBy } from './lodash'
import customFieldNames from 'constants/customFieldNames'
import { sortDataBySortOrder } from './customFieldUtils'

export const getOptions = async ({
  fetcher,
  params,
  field,
  value,
  transformData,
  search,
  sort,
  useUnwrap = true,
  useCache = true,
  passDispatchState = false,
  passIdForNumber = false,
  removeEmptyLabel = false,
  passAllFields = false,
  isCustomField = false,
  transformCustomFieldParams
}) => {
  try {
    const searchField = search || (Array.isArray(field) ? field[0] : field)
    const filters = [
      ...(transformCustomFieldParams ? transformCustomFieldParams(value) : []),
      {
        field: searchField,
        conditions: [
          {
            type: 'contains',
            value
          }
        ]
      }
    ]
    const _fetcher = fetcher(
      queryParamsHelper({
        fields: Array.isArray(field) ? field.join(',') : field,
        ...(passIdForNumber && typeof value === 'number'
          ? { id: value }
          : isCustomField
          ? {
              filters: filters?.length
                ? Base64.encode(JSON.stringify(_uniqBy(filters, 'field')))
                : null,
              sort: sort || searchField
            }
          : { [searchField]: value, sort: sort || searchField }),
        ...params
      }),
      passDispatchState ? undefined : useCache
    )
    const { data, meta } = passDispatchState
      ? parseGetData(await _fetcher(store.dispatch, store.getState).unwrap())
      : useUnwrap
      ? await _fetcher.unwrap()
      : await _fetcher

    let parsedData = transformData
      ? transformData(data, searchField, passAllFields)
      : data.map(d => ({
          data: passAllFields ? d : {},
          value: d.id,
          label: d[searchField]
        }))

    if (removeEmptyLabel) {
      parsedData = parsedData.filter(({ label }) => !!label)
    }

    return {
      data: parsedData,
      meta: {
        ...meta,
        value
      }
    }
  } catch (err) {
    return {
      data: [],
      meta: {
        value: '',
        currentPage: 1,
        lastPage: 1
      }
    }
  }
}

export const getOptionsByFieldAndEntity =
  ({
    field,
    entity,
    transformData,
    options = {},
    search = null,
    sort = null,
    passIdForNumber = false,
    removeEmptyLabel = false,
    passAllFields = false,
    isCustomField = false,
    transformCustomFieldParams
  }) =>
  (value, params) => {
    return serviceOptions[entity]
      ? getOptions({
          fetcher: serviceOptions[entity],
          params: {
            ...params,
            ...options
          },
          value,
          field,
          transformData,
          search,
          sort,
          passDispatchState: true,
          passIdForNumber,
          removeEmptyLabel,
          passAllFields,
          isCustomField,
          transformCustomFieldParams
        })
      : []
  }

export const getUserOptions = (field, transformData, rest = {}) =>
  getOptionsByFieldAndEntity({
    field: field || ['firstName', 'id', 'lastName'],
    transformData: transformData || transformDataByForUsers,
    entity: optionEntity.user,
    ...rest
  })

export const getActivityOptions = (field, transformData) =>
  getOptionsByFieldAndEntity({
    field: field || ['subject', 'id'],
    transformData:
      transformData ||
      (data =>
        data.map(d => ({
          ...d,
          value: d.id,
          label: d.subject
        }))),
    entity: optionEntity.activity
  })

export const getAccountOptions = (field, transformData, rest = {}) =>
  getOptionsByFieldAndEntity({
    field: field || [customFieldNames.accountName, 'id'],
    transformData: transformData || transformDataForCustomFields,
    entity: optionEntity.account,
    passIdForNumber: true,
    isCustomField: true,
    ...rest
  })

export const getLeadOptions = (field, transformData, rest = {}) =>
  getOptionsByFieldAndEntity({
    field: field || [
      customFieldNames.firstName,
      customFieldNames.lastName,
      'id'
    ],
    transformData: transformData || transformDataForCustomFieldsName,
    entity: optionEntity.lead,
    passIdForNumber: true,
    isCustomField: true,
    transformCustomFieldParams: transformCustomFieldParamsForNames,
    ...rest
  })

export const getContactOptions = (field, transformData, rest = {}) =>
  getOptionsByFieldAndEntity({
    field: field || [
      customFieldNames.firstName,
      customFieldNames.lastName,
      'id'
    ],
    transformData: transformData || transformDataForCustomFieldsName,
    entity: optionEntity.contact,
    passIdForNumber: true,
    isCustomField: true,
    transformCustomFieldParams: transformCustomFieldParamsForNames,
    ...rest
  })
export const getDeviceOptions = (field, transformData, rest = {}) =>
  getOptionsByFieldAndEntity({
    transformData:
      transformData ||
      (data =>
        sortDataBySortOrder([...data]).map(d => ({
          value: d.id,
          label: d.name
        }))),
    entity: optionEntity.device,
    passIdForNumber: true,
    isCustomField: true,
    ...rest
  })

export const getCategoryOptions = (field, transformData, rest = {}) =>
  getOptionsByFieldAndEntity({
    transformData:
      transformData ||
      (data =>
        sortDataBySortOrder([...data]).map(d => ({
          value: d.id,
          label: d.name
        }))),
    entity: optionEntity.category,
    passIdForNumber: true,
    isCustomField: true,
    ...rest
  })

export const getOpportunityOptions = (field, transformData, rest = {}) =>
  getOptionsByFieldAndEntity({
    field: field || [customFieldNames.opportunityName, 'id'],
    transformData,
    entity: optionEntity.opportunity,
    passIdForNumber: true,
    ...rest
  })

export const getEstimateOptions = (field, transformData, rest = {}) =>
  getOptionsByFieldAndEntity({
    field: field || [customFieldNames.estimateName, 'id'],
    transformData,
    entity: optionEntity.estimate,
    passIdForNumber: true,
    ...rest
  })

export const getProductOptions = (field, transformData, rest = {}) =>
  getOptionsByFieldAndEntity({
    field: field || [customFieldNames.productName, 'id'],
    transformData: transformData || transformDataForCustomFields,
    entity: optionEntity.product,
    isCustomField: true,
    passIdForNumber: true,
    ...rest
  })

export const getStageOptions = (field, transformData, rest = {}) =>
  getOptionsByFieldAndEntity({
    field: field || ['name', 'id'],
    transformData: transformData || transformDataByForStage,
    entity: optionEntity.stage,
    passIdForNumber: true,
    ...rest
  })

export const transformCustomFieldParamsForNames = value => {
  const valueSplit = typeof value === 'string' ? value.split(' ') : []
  const lastName = valueSplit?.length > 1 ? valueSplit.slice(1).join(' ') : null
  return lastName
    ? [
        {
          field: customFieldNames.firstName,
          conditions: [
            {
              type: 'contains',
              value: valueSplit[0]
            }
          ]
        },
        {
          field: customFieldNames.lastName,
          conditions: [
            {
              type: 'contains',
              value: lastName
            }
          ]
        }
      ]
    : []
}

export const transformDataByValueName = (
  data,
  field,
  passAllFields = false
) => {
  return data.map(d => ({
    label: d[field],
    value: d[field],
    ...(passAllFields ? d : {})
  }))
}

export const transformDataByValueNameForCustomFields = (
  data,
  field,
  passAllFields = false
) => {
  return data.map(d => ({
    label: _get(d, `customFields.${field}`, ''),
    value: _get(d, `customFields.${field}`, ''),
    ...(passAllFields ? d : {})
  }))
}

export const transformDataForCustomFields = (
  data,
  field,
  passAllFields = false
) => {
  return data.map(d => ({
    label: _get(d, `customFields.${field}`, ''),
    value: d.id,
    ...(passAllFields ? d : {})
  }))
}

export const transformDataForCustomFieldsName = (
  data,
  field,
  passAllFields = false
) => {
  return data.map(d => ({
    label: `${_get(d, `customFields.${customFieldNames.firstName}`, '')} ${_get(
      d,
      `customFields.${customFieldNames.lastName}`,
      ''
    )}`,
    value: d.id,
    ...(passAllFields ? d : {})
  }))
}

export const transformDataByForUsers = data => {
  return data.map(d => ({
    ...d,
    value: d.id,
    label: `${d.firstName} ${d.lastName}`
  }))
}

export const transformDataByForTag = data => {
  return data.map(d => tagToChipObj(d))
}

export const transformDataForInvoice = (data, field) => {
  return data.map(d => ({
    label: `${d.invoiceNumber} - ${d.estimateName}`,
    value: d.id,
    balanceDue: d.balanceDue
  }))
}

export const transformDataByForStage = data => {
  return sortDataBySortOrder([...data]).map(d => ({
    value: d.id,
    label: d.name
  }))
}
