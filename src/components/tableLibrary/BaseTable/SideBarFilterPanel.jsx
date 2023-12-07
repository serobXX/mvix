import {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { makeStyles } from '@material-ui/core'

import { _get, _isEqual } from 'utils/lodash'
import BaseTableContext from './context'
import { camelCaseToSplitCapitalize } from 'utils/stringConversion'
import FilterPanel from '../Sidebar/FilterPanel'
import FilterField from 'hoc/withFilterField/FilterField'
import update from 'utils/immutability'

const useStyles = makeStyles(() => ({
  root: {
    padding: `0px !important`
  },
  container: {
    gap: 0
  }
}))

const CustomFilter = ({
  filterPanelOpened = false,
  field,
  value,
  filterComponent: FilterComponent,
  filterParams,
  api,
  columnApi,
  onFilterChanged
}) => {
  const ref = useRef()

  useEffect(() => {
    if (ref.current && filterPanelOpened) {
      ref.current.setModel(value)
    }
  }, [value, filterPanelOpened])

  const handleFilterChange = () => {
    ref.current && onFilterChanged(ref.current.getModel())
  }

  return (
    <FilterComponent
      ref={ref}
      column={columnApi.getColumn(field)}
      filterParams={filterParams?.filterParams}
      api={api}
      filterChangedCallback={handleFilterChange}
      fromSidebar
    />
  )
}

const SideBarFilterPanel = ({
  api,
  remainingFilters = [],
  columnApi,
  onSaveFilter,
  saveFilterItem,
  clearSelectedFilter
}) => {
  const classes = useStyles()
  const [storedFilters, setStoredFilters] = useState({})
  const [filters, setFilters] = useState({})
  const [externalFilters, setExternalFilters] = useState({})
  const [searchFilter, setSearchFilter] = useState('')
  const {
    filterPanelOpened,
    setFilterPanelOpened,
    filterChanged,
    setFilterChanged
  } = useContext(BaseTableContext)

  useEffect(() => {
    if (filterPanelOpened) {
      const _filters = api.getFilterModel()
      const _externalFilters = api.getQuickFilter()
      setStoredFilters(_filters)
      setFilters(_filters)
      setExternalFilters(_externalFilters || {})
    }
    //eslint-disable-next-line
  }, [filterPanelOpened])

  useEffect(() => {
    if (filterChanged) {
      setFilterPanelOpened(false)
      setFilterChanged(false)
    }
    //eslint-disable-next-line
  }, [filterChanged])

  const filterColumns = useMemo(() => {
    return _get(columnApi, 'columnModel.columnDefs', []).filter(
      ({ filter }) => !!filter
    )
  }, [columnApi])

  const handleFilterChanged = field => value => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleChangeCustomField = useCallback(
    ({ name: fieldName }) =>
      ({ target: { value } }) => {
        const _values = update(externalFilters, {
          $auto: {
            [fieldName]: { $set: { value } }
          }
        })
        setExternalFilters(_values)
      },
    [externalFilters]
  )

  const handleResetExternalField = useCallback(
    ({ name: fieldName }) => {
      const _values = update(externalFilters, {
        $auto: {
          [fieldName]: { $set: { value: '' } }
        }
      })
      setExternalFilters(_values)
    },
    [externalFilters]
  )

  const handleSubmit = useCallback(async () => {
    const _filters = api.getFilterModel()

    await api.setQuickFilter(externalFilters)
    await api.setFilterModel(filters)
    if (_isEqual(_filters, filters)) {
      api.onFilterChanged()
    }
  }, [api, externalFilters, filters])

  const handleReset = async () => {
    await api.setQuickFilter(null)
    await api.setFilterModel(null)
    api.onFilterChanged()
    clearSelectedFilter && clearSelectedFilter()
  }

  const handleSaveFilter = useCallback(
    values => {
      onSaveFilter &&
        onSaveFilter({
          ...values,
          filter: {
            ...filters,
            ...externalFilters
          }
        })
    },
    [onSaveFilter, filters, externalFilters]
  )

  const searchFilterColumns = useMemo(
    () =>
      filterColumns.filter(({ headerName, field, filters }) =>
        filters?.length
          ? filters.some(({ field, headerName }) =>
              (headerName || camelCaseToSplitCapitalize(field))
                .toLowerCase()
                .includes(searchFilter.toLowerCase())
            )
          : (headerName || camelCaseToSplitCapitalize(field))
              .toLowerCase()
              .includes(searchFilter.toLowerCase())
      ),
    [filterColumns, searchFilter]
  )

  const searchRemainingFilters = useMemo(
    () =>
      remainingFilters.filter(({ headerName, field }) =>
        (headerName || camelCaseToSplitCapitalize(field))
          .toLowerCase()
          .includes(searchFilter.toLowerCase())
      ),
    [remainingFilters, searchFilter]
  )

  return (
    <FilterPanel
      rootClassName={classes.root}
      containerClassName={classes.container}
      cols={1}
      onSubmit={handleSubmit}
      onReset={handleReset}
      onSaveFilter={handleSaveFilter}
      saveFilterItem={saveFilterItem}
      showSearchFilter
      searchFilter={searchFilter}
      onChangeSearchFilter={setSearchFilter}
    >
      {searchFilterColumns.map(({ field, filter, filterParams }) => (
        <Fragment key={`filter-side-panel-${field}`}>
          <CustomFilter
            filterPanelOpened={filterPanelOpened}
            value={storedFilters[field]}
            filterComponent={filter}
            filterParams={filterParams}
            field={field}
            api={api}
            columnApi={columnApi}
            onFilterChanged={handleFilterChanged(field)}
          />
        </Fragment>
      ))}
      {searchRemainingFilters.map(
        ({ field, headerName, filter, filterParams }) => (
          <FilterField
            key={`filter-side-panel-${field}`}
            label={headerName || camelCaseToSplitCapitalize(field)}
            name={field}
            values={externalFilters[field]}
            filterProps={filterParams}
            component={filter}
            fromSidebar={true}
            handleChange={handleChangeCustomField}
            handleResetField={handleResetExternalField}
          />
        )
      )}
    </FilterPanel>
  )
}

export default SideBarFilterPanel
