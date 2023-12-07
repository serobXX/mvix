import { useCallback, useEffect, useMemo, useState } from 'react'
import { _isEqual } from 'utils/lodash'

const useRowSelection = rows => {
  const [selectedAll, setSelectedAll] = useState(false)
  const [excludeSelected, setExcludeSelected] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const [isClearRows, setClearRows] = useState(false)

  const clearSelectedRows = useCallback(() => {
    setClearRows(true)
  }, [])

  useEffect(() => {
    setClearRows(false)
  }, [isClearRows])

  const handleSelectRows = useCallback(
    rows => {
      if (!_isEqual(selectedRows, rows)) {
        setSelectedRows(rows)
      }
    },
    [selectedRows]
  )

  const handleExcludeSelected = useCallback(
    exclude => {
      if (!_isEqual(excludeSelected, exclude)) {
        setExcludeSelected(exclude)
      }
    },
    [excludeSelected]
  )

  return useMemo(
    () => ({
      clearSelectedRows,
      setSelectedRows: handleSelectRows,
      setSelectedAll,
      setExcludeSelected: handleExcludeSelected,
      selectedRows,
      selectedAll,
      excludeSelected,
      initialRows: rows,
      isClearRows
    }),
    [
      clearSelectedRows,
      handleSelectRows,
      handleExcludeSelected,
      selectedRows,
      selectedAll,
      excludeSelected,
      rows,
      isClearRows
    ]
  )
}

export default useRowSelection
