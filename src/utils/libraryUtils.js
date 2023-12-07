import * as R from 'ramda'

import { paginationValuesByView, paginationViews } from 'constants/library'
import { _isArray, _isObject } from './lodash'
import queryParamsHelper from './queryParamsHelper'
import {
  DateTimeViewColumn,
  TextWithTooltipColumn
} from 'components/tableColumns'
import { Base64 } from 'js-base64'

export const parseAgGridRequestData = (params, sortMapping) => {
  const { startRow, endRow, sortModel, filter, filterModel } = params
  let separateFilter = {}
  let filters = []

  let parseFilterModel = {
    ...(filterModel
      ? Object.entries(filterModel).reduce((a, [key, value]) => {
          if (_isObject(value) && !_isArray(value)) {
            a = {
              ...a,
              ...value
            }
          } else {
            a = {
              ...a,
              [key]: value
            }
          }
          return a
        }, {})
      : {}),
    ...filter
  }

  Object.entries(parseFilterModel).forEach(([key, values]) => {
    if (Array.isArray(values)) {
      const conditions = values.filter(
        ({ type, value }) => ['blank', 'not_blank'].includes(type) || !!value
      )
      if (conditions.length) {
        filters.push({
          field: key,
          conditions: values.filter(
            ({ type, value }) =>
              ['blank', 'not_blank'].includes(type) || !!value
          )
        })
      }
    } else {
      separateFilter[key] = values?.value || ''
    }
  })

  const limit = endRow - startRow
  const colId = sortModel[0]?.colId
  return queryParamsHelper(
    {
      limit,
      page: Math.ceil(startRow / limit) + 1,
      ...(sortModel.length
        ? {
            sort: sortMapping?.[colId] || colId,
            order: sortModel[0]?.sort
          }
        : {}),
      ...separateFilter,
      filters: filters?.length ? Base64.encode(JSON.stringify(filters)) : null
    },
    ['tag', 'status'],
    [],
    ['activityStatus', 'activityType', 'licenseType', 'role_id']
  )
}

export const getPaginationValues = view => {
  if (!paginationViews.hasOwnProperty(view)) {
    return paginationValuesByView[paginationViews.listView]
  }

  return paginationValuesByView[view]
}

export const isMultipleSelected = selected => {
  return selected?.selectedAll || selected?.selectedRows?.length > 1
}

export const transformerSelectedItems = (initAccum = {}, ids) =>
  ids.reduce(
    (accum, id) => ({
      ...accum,
      [id]: true
    }),
    { ...initAccum }
  )

export const unselectItems = (list, ids) => {
  const modifiedList = { ...list }
  ids.forEach(id => {
    delete modifiedList[id]
  })
  return modifiedList
}

export const sortByLabel = R.compose(
  R.sortBy(R.compose(R.toLower, R.defaultTo(''), R.prop('label'))),
  R.defaultTo([])
)

export const sortByTag = R.compose(
  R.sortBy(R.compose(R.toLower, R.defaultTo(''), R.prop('tag'))),
  R.defaultTo([])
)
export const sortByTagDesc = R.compose(
  R.sortWith([R.descend(R.compose(R.toLower, R.defaultTo(''), R.prop('tag')))]),
  R.defaultTo([])
)

export const createdAndUpdatedColumns = [
  {
    field: 'createdBy',
    headerName: 'Created by',
    width: 135,
    type: 'centerAligned',
    cellRenderer: TextWithTooltipColumn,
    cellRendererParams: {
      getValue: ({ createdBy }) =>
        createdBy && `${createdBy.firstName} ${createdBy.lastName}`
    },
    positionIndex: 200
  },
  {
    field: 'createdAt',
    headerName: 'Created On',
    width: 135,
    type: 'centerAligned',
    cellRenderer: DateTimeViewColumn,
    positionIndex: 201
  },
  {
    field: 'updatedBy',
    headerName: 'Last Modified by',
    width: 135,
    type: 'centerAligned',
    cellRenderer: TextWithTooltipColumn,
    cellRendererParams: {
      getValue: ({ updatedBy }) =>
        updatedBy && `${updatedBy.firstName} ${updatedBy.lastName}`
    },
    positionIndex: 202
  },
  {
    field: 'updatedAt',
    headerName: 'Last Modified On',
    width: 135,
    type: 'centerAligned',
    cellRenderer: DateTimeViewColumn,
    positionIndex: 203
  }
]
