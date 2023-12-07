import { useCallback, useEffect, useMemo, useState } from 'react'
import { transformerSelectedItems, unselectItems } from 'utils/libraryUtils'
const useSelectedList = rowsIds => {
  const [selectedList, changeSelectedList] = useState({})
  const [error, setError] = useState(null)
  const [wasValidate, toggleWasValidate] = useState(false)

  const count = useMemo(
    () => Object.keys(selectedList).filter(id => !!selectedList[id]).length,
    [selectedList]
  )

  const isSelect = useCallback(id => !!selectedList[id], [selectedList])

  const isPageSelect = useMemo(() => {
    return rowsIds.every(id => isSelect(id))
  }, [isSelect, rowsIds])

  const toggle = useCallback(id => {
    changeSelectedList(values => ({
      ...values,
      [id]: !values[id]
    }))
  }, [])

  const select = useCallback(
    id => {
      changeSelectedList(values => ({
        ...values,
        [id]: true
      }))
    },
    [changeSelectedList]
  )

  const unselect = useCallback(id => {
    changeSelectedList(values => ({
      ...unselectItems(values, [id])
    }))
  }, [])

  const clear = useCallback(() => changeSelectedList({}), [])

  const pageSelect = useCallback(() => {
    !isPageSelect
      ? changeSelectedList({
          ...transformerSelectedItems(selectedList, rowsIds)
        })
      : changeSelectedList({
          ...unselectItems(selectedList, rowsIds)
        })
  }, [isPageSelect, rowsIds, selectedList])

  const selectedIdsStr = useMemo(
    () => Object.keys(selectedList).map(id => parseInt(id) || id),
    [selectedList]
  )
  const selectedIds = useMemo(
    () => selectedIdsStr.filter(id => selectedList[id] && id),
    [selectedIdsStr, selectedList]
  )

  const selectIds = useCallback(
    ids => {
      clear()
      return ids.forEach(id => id && select(id))
    },
    [clear, select]
  )

  useEffect(() => {
    if (wasValidate && count > 0) {
      setError(null)
      toggleWasValidate(false)
    }
  }, [count, wasValidate])

  const validate = useCallback(
    (msg = 'Please select items') => {
      if (count < 1) {
        setError(msg)
        toggleWasValidate(true)
        return false
      }
      return true
    },
    [count]
  )

  const isValid = useMemo(
    () => count > 0 && wasValidate === false,
    [count, wasValidate]
  )

  const getSelectedKeys = useCallback(() => {
    return Object.entries(selectedList)
      .filter(([, value]) => value)
      .map(([key]) => key)
  }, [selectedList])

  return {
    count,
    isSelect,
    toggle,
    unselect,
    pageSelect,
    isPageSelect,
    clear,
    selectedIds,
    selectIds,
    validate,
    error,
    isValid,
    selectedList,
    getSelectedKeys
  }
}

export default useSelectedList
