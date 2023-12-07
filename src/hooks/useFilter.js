import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import update from 'immutability-helper'
import { useLocation, useNavigate } from 'react-router-dom'

import {
  getSearchParamsObject,
  getUnknownSearchParams,
  removeSearchParamsWithoutRefresh
} from 'utils/urlUtils'
import { resetFilter, updateFilter } from 'slices/filterSlice'
import { filterInitialState } from 'constants/filter'
import { filterSelector } from 'selectors/filterSelectors'

const useFilter = (
  entity,
  predefine = {},
  onValuesChangeCallback,
  keepUnknownParams
) => {
  const values = useSelector(filterSelector(entity))
  const [storeLocation, setStoreLocation] = useState()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setStoreLocation(location.pathname)
  }, [location.pathname])

  const initialValues = useMemo(
    () =>
      filterInitialState.hasOwnProperty(entity)
        ? update(filterInitialState[entity], { $merge: predefine })
        : predefine,
    [entity, predefine]
  )

  const updateByEntity = useCallback(
    (data = {}, resetSearchParams) => {
      dispatch(updateFilter({ entity, data }))
      if (resetSearchParams && location.search) {
        if (keepUnknownParams) {
          removeSearchParamsWithoutRefresh(
            getUnknownSearchParams(
              getSearchParamsObject(location.search),
              initialValues
            )
          )
        } else {
          removeSearchParamsWithoutRefresh()
        }
      }
      onValuesChangeCallback && onValuesChangeCallback(data)
    },
    [
      entity,
      dispatch,
      location,
      onValuesChangeCallback,
      initialValues,
      keepUnknownParams
    ]
  )

  const resetByEntity = useCallback(() => {
    dispatch(resetFilter({ entity }))
    //reset query params
    if (location.search && storeLocation === location.pathname) {
      navigate(location.pathname)
    }
    onValuesChangeCallback && onValuesChangeCallback({})
  }, [
    entity,
    dispatch,
    navigate,
    onValuesChangeCallback,
    location,
    storeLocation
  ])

  const unionValues = useMemo(
    () => update(values, { $merge: predefine }),
    [values, predefine]
  )

  return [unionValues, updateByEntity, resetByEntity, initialValues]
}

export default useFilter
