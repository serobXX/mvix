import { useCallback, useEffect, useMemo } from 'react'
import { useFormik } from 'formik'
import { makeStyles } from '@material-ui/core'

import {
  FormControlAutocomplete,
  FormControlReactSelect
} from 'components/formControls'
import FilterPanel from 'components/tableLibrary/Sidebar/FilterPanel'
import { tagLibraryInitialFilter } from 'constants/filter'
import { useLazyGetTagsQuery } from 'api/tagApi'
import { getOptions, transformDataByValueName } from 'utils/autocompleteOptions'
import { tagEntityOptions } from 'constants/tagConstants'

const useStyles = makeStyles(() => ({
  root: {
    padding: 0
  },
  container: {
    gap: 0
  }
}))

const TagFilter = ({
  filterValues,
  updateFilter,
  handleResetFilter,
  fetcher,
  closePanel,
  onSaveFilter,
  selectedFilter
}) => {
  const classes = useStyles()
  const [getTags] = useLazyGetTagsQuery()

  const onSubmit = values => {
    updateFilter({
      ...values
    })
    fetcher(values)
    closePanel()
  }

  const { values, handleChange, handleSubmit, handleReset, setValues } =
    useFormik({
      initialValues: tagLibraryInitialFilter,
      onSubmit
    })

  useEffect(() => {
    if (filterValues) {
      setValues(filterValues)
    }
    //eslint-disable-next-line
  }, [filterValues])

  const resetClick = () => {
    handleReset()
    handleResetFilter()
    fetcher(tagLibraryInitialFilter)
    closePanel()
  }

  const handleSaveFilter = data => {
    onSaveFilter({
      ...data,
      filter: {
        ...values
      }
    })
    closePanel()
  }

  const getNameOptions = useCallback(
    async (value, params) => {
      return getOptions({
        fetcher: getTags,
        params,
        value,
        field: 'tag',
        transformData: transformDataByValueName
      })
    },
    [getTags]
  )

  const filters = useMemo(
    () => [
      {
        label: 'Name',
        name: 'tag',
        value: values.tag,
        filter: FormControlAutocomplete,
        props: {
          getOptions: getNameOptions,
          isCreatable: true,
          isClearable: true
        }
      },
      {
        label: 'Entity Type',
        name: 'entityType',
        value: values.entityType,
        filter: FormControlReactSelect,
        props: {
          options: tagEntityOptions,
          isCreatable: true,
          isClearable: true,
          isMulti: true
        }
      }
    ],
    [values, getNameOptions]
  )

  return (
    <FilterPanel
      onSubmit={handleSubmit}
      onSaveFilter={handleSaveFilter}
      saveFilterItem={selectedFilter}
      onReset={resetClick}
      showSearchFilter
      rootClassName={classes.root}
      addExtraBottomSpace={25}
      containerClassName={classes.container}
      filterList={filters}
      onChangeFilter={handleChange}
    />
  )
}

export default TagFilter
