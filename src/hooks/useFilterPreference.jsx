import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  useAddPreferenceMutation,
  useUpdatePreferenceMutation
} from 'api/preferenceApi'
import FilterViewSidebar from 'components/FilterPreference/FilterViewSidebar'
import apiCacheKeys from 'constants/apiCacheKeys'
import {
  getFilterFromData,
  parseBEDataToFilter,
  parseFilterToBEData
} from 'utils/filterPreference'
import useNotifyAnalyzer from './useNotifyAnalyzer'
import { notifyLabels } from 'constants/notifyAnalyzer'

const useFilterPreference = ({ entity }) => {
  const [selectedFilter, setSelectedFilter] = useState()
  const [filterModel, setFilterModel] = useState({})

  const [addItem, post] = useAddPreferenceMutation({
    fixedCacheKey: apiCacheKeys.preference.add
  })
  const [updateItem, put] = useUpdatePreferenceMutation({
    fixedCacheKey: apiCacheKeys.preference.update
  })
  const [, del] = useAddPreferenceMutation({
    fixedCacheKey: apiCacheKeys.preference.delete
  })

  const handleApplyFilter = useCallback(item => {
    setSelectedFilter(item)
  }, [])

  useEffect(() => {
    if (entity) {
      setSelectedFilter()
    }
  }, [entity])

  useNotifyAnalyzer({
    entityName: 'Filter',
    onSuccess: reducer => {
      if (reducer.data?.id) {
        handleApplyFilter(reducer.data)
      }
    },
    watchArray: [post, put, del],
    labels: [notifyLabels.add, notifyLabels.update, notifyLabels.delete]
  })

  const viewToolPanel = useMemo(
    () => ({
      id: 'views',
      labelDefault: 'Views',
      labelKey: 'views',
      iconKey: 'views',
      toolPanel: FilterViewSidebar,
      toolPanelParams: {
        entity,
        onApplyFilter: handleApplyFilter,
        selectedFilter
      }
    }),
    [entity, handleApplyFilter, selectedFilter]
  )

  const staticFilterModel = useMemo(
    () =>
      !!selectedFilter?.id
        ? parseBEDataToFilter(getFilterFromData(selectedFilter))
        : {},
    [selectedFilter]
  )

  const handleSaveFilter = useCallback(
    ({ name, filter }) => {
      const data = {
        name,
        entity,
        settings: {
          filter: parseFilterToBEData(filter || filterModel)
        }
      }

      if (!!selectedFilter?.id) {
        updateItem({
          id: selectedFilter?.id,
          data
        })
      } else {
        addItem(data)
      }
    },
    [filterModel, entity, updateItem, addItem, selectedFilter]
  )

  const clearSelectedFilter = useCallback(() => {
    setSelectedFilter()
  }, [])

  return useMemo(
    () => ({
      filterModel,
      staticFilterModel,
      setFilterModel,
      viewToolPanel,
      selectedFilter,
      handleSaveFilter,
      clearSelectedFilter
    }),
    [
      viewToolPanel,
      filterModel,
      staticFilterModel,
      handleSaveFilter,
      selectedFilter,
      clearSelectedFilter
    ]
  )
}

export default useFilterPreference
