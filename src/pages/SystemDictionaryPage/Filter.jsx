import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo
} from 'react'
import { useFormik } from 'formik'
import { makeStyles } from '@material-ui/core'

import {
  FormControlAutocomplete,
  FormControlReactSelect
} from 'components/formControls'
import FilterPanel from 'components/tableLibrary/Sidebar/FilterPanel'
import { getOptions, transformDataByValueName } from 'utils/autocompleteOptions'
import { filterStatusOptions, statusOptions } from 'constants/commonOptions'
import { systemDictionaryInitialFilter } from 'constants/filter'
import useUser from 'hooks/useUser'
import { ADMINISTRATOR } from 'constants/roleConstants'
import useSystemDictionaryApi from 'hooks/useSystemDictionaryApi'

const useStyles = makeStyles(() => ({
  root: {
    padding: 0
  },
  container: {
    gap: 0
  }
}))

const Filter = forwardRef(
  (
    {
      activeSubtab,
      filterValues,
      updateFilter,
      handleResetFilter,
      fetcher,
      closePanel,
      onSaveFilter,
      selectedFilter
    },
    ref
  ) => {
    const classes = useStyles()
    const { getItems } = useSystemDictionaryApi(activeSubtab)
    const { role } = useUser()

    useImperativeHandle(ref, () => ({
      closePanel
    }))

    const onSubmit = values => {
      updateFilter({
        ...values
      })
      fetcher({
        ...systemDictionaryInitialFilter,
        ...values
      })
      closePanel()
    }

    const { values, handleChange, handleSubmit, handleReset, setValues } =
      useFormik({
        initialValues: systemDictionaryInitialFilter,
        onSubmit
      })

    const handleSaveFilter = data => {
      onSaveFilter({
        ...data,
        filter: {
          ...values
        }
      })
      closePanel()
    }

    useEffect(() => {
      if (filterValues) {
        setValues(filterValues)
      }
      //eslint-disable-next-line
    }, [filterValues])

    const resetClick = () => {
      handleReset()
      handleResetFilter()
      fetcher(systemDictionaryInitialFilter)
      closePanel()
    }

    const getNameOptions = useCallback(
      async (value, params) => {
        return getOptions({
          fetcher: getItems,
          params,
          value,
          field: 'name',
          transformData: transformDataByValueName
        })
      },
      [getItems]
    )

    const filters = useMemo(
      () => [
        {
          label: 'Name',
          name: 'name',
          value: values.name,
          filter: FormControlAutocomplete,
          props: {
            getOptions: getNameOptions,
            isCreatable: true,
            isClearable: true
          }
        },
        {
          label: 'Status',
          name: 'status',
          value: values.status,
          filter: FormControlReactSelect,
          props: {
            options:
              role?.name === ADMINISTRATOR
                ? filterStatusOptions
                : statusOptions,
            isCreatable: true,
            isClearable: true,
            isMulti: true
          }
        }
      ],
      [values, getNameOptions, role]
    )

    return (
      <FilterPanel
        onSubmit={handleSubmit}
        onSaveFilter={handleSaveFilter}
        saveFilterItem={selectedFilter}
        onReset={resetClick}
        showSearchFilter
        rootClassName={classes.root}
        addExtraBottomSpace={-35}
        containerClassName={classes.container}
        filterList={filters}
        onChangeFilter={handleChange}
      ></FilterPanel>
    )
  }
)

export default Filter
