import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { withStyles } from '@material-ui/core'
import { components } from 'react-select'
import { useDispatch, useSelector } from 'react-redux'

import { _debounce, _uniqBy, _get, _differenceWith } from 'utils/lodash'
import FormControlReactSelect from './FormControlReactSelect'
import { simulateEvent } from 'utils/formik'
import { sortByLabel } from 'utils/libraryUtils'
import PropTypes from 'constants/propTypes'
import { storedOptionsSelector } from 'selectors/appSelectors'
import { setStoredOptions } from 'slices/appSlice'

const ClearIndicator = ({ onClick, innerValue, innerProps, ...props }) => {
  return (
    <>
      {innerValue && (
        <components.ClearIndicator
          innerProps={{
            ...innerProps,
            onMouseDown: onClick,
            onTouchEnd: onClick
          }}
          {...props}
        />
      )}
    </>
  )
}

const styles = ({ colors }) => ({
  errorText: {
    margin: 0,
    marginTop: -15,
    color: colors.error,
    fontSize: 10,
    lineHeight: 1.5
  }
})

const FormControlAutocomplete = ({
  validationFunc,
  validationErrorMessage,
  getOptions,
  limit,
  withResetValue,
  selectComponent: SelectComponent,
  isSearchable,
  isResettable,
  isCreatable,
  value,
  components,
  initialResponse,
  initialFetchValue,
  classes,
  name,
  onChange,
  uniqueOptions,
  isClearable,
  isSort,
  staticRequestParams,
  onFocus,
  createdValue,
  hideOptions = [],
  hideOptionsStrict = [],
  optionsDependency,
  setResponseData,
  staticOptions,
  isGroupedSelect = false,
  groupedOptions,
  isSelectFirstOption = false,
  ...props
}) => {
  const dispatch = useDispatch()

  const storedOptions = useSelector(storedOptionsSelector)

  const [{ data, meta, error }, setResponse] = useState(initialResponse)
  const [initialFetchData, setInitialFetchData] = useState([])
  const [innerValue, setInnerValue] = useState(initialResponse.meta.value || '')
  const [validationError, setValidationError] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(
    (value, page = 1) => {
      return new Promise(resolve => {
        if (getOptions) {
          setLoading(true)

          getOptions(value, {
            limit,
            page,
            ...staticRequestParams
          }).then(({ data, meta, error }) => {
            setResponse(prevState =>
              error
                ? {
                    data: [],
                    meta: { currentPage: 1 },
                    error: ''
                  }
                : {
                    data:
                      meta.currentPage > 1
                        ? [...prevState.data, ...data]
                        : data,
                    meta,
                    error: ''
                  }
            )
            resolve({ data, meta, error })
            setLoading(false)
          })
        } else resolve()
      })
    },
    [getOptions, limit, staticRequestParams]
  )

  useEffect(() => {
    if (data && setResponseData) {
      setResponseData(data)
    }
    //eslint-disable-next-line
  }, [data])

  useEffect(() => {
    if (isSelectFirstOption) {
      fetchData().then(({ data }) => {
        if (!!data?.length) onChange({ target: { name, ...data[0] } })
      })
    }
    //eslint-disable-next-line
  }, [isSelectFirstOption])

  const onInputChangeHandler = useMemo(
    () =>
      _debounce((value, { action }) => {
        if (!validationFunc(value || '')) {
          setValidationError(true)
        } else {
          setValidationError(false)
          action === 'input-change' && fetchData(value)
          setInnerValue(value)
        }
      }, 300),
    [fetchData, validationFunc]
  )

  const handleMenuScrollToBottom = useCallback(() => {
    const { currentPage, lastPage } = meta
    if ((!lastPage || currentPage < lastPage) && !loading) {
      fetchData(innerValue, currentPage + 1)
    }
  }, [fetchData, meta, innerValue, loading])

  const handleSearchReset = useCallback(() => {
    setInnerValue('')
    fetchData('')
    if (withResetValue) {
      onChange(simulateEvent(props.name, ''))
    }
  }, [fetchData, onChange, props, withResetValue])

  const handleChange = useCallback(
    e => {
      const { name, value, label } = e.target
      dispatch(
        setStoredOptions({
          [name]: [{ value, label }]
        })
      )
      onChange(e)
    },
    [onChange, dispatch]
  )

  const handleFocus = useCallback(
    e => {
      if (!data.length) {
        fetchData('')
      }
      if (onFocus) {
        onFocus(e)
      }
    },
    [data, fetchData, onFocus]
  )

  useEffect(
    () => {
      if (initialFetchValue) {
        const options = _get(storedOptions, name, [])
        if (
          options.length &&
          options.some(({ value }) => value === initialFetchValue)
        ) {
          setInitialFetchData(options)
        } else {
          getOptions(initialFetchValue, {
            limit,
            page: 1,
            exact: true,
            ...staticRequestParams
          }).then(({ data, error }) => {
            if (!error) {
              dispatch(
                setStoredOptions({
                  [name]: data
                })
              )
              setInitialFetchData(data)
            }
          })
        }
      }
    },
    // eslint-disable-next-line
    [initialFetchValue]
  )

  useEffect(() => {
    if (createdValue && createdValue.data) {
      handleSearchReset()
    }
    // eslint-disable-next-line
  }, [createdValue])

  useEffect(() => {
    if (optionsDependency) {
      setResponse({
        data: [],
        meta: { currentPage: 1 },
        error: ''
      })
    }
    // eslint-disable-next-line
  }, [optionsDependency])

  const options = useMemo(() => {
    let _options = [...staticOptions, ...data]

    if (initialFetchData.length || uniqueOptions) {
      _options = _uniqBy([..._options, ...initialFetchData], 'value')
    }
    if (isSort) {
      _options = sortByLabel(_options)
    }

    if (hideOptionsStrict?.length) {
      return _differenceWith(
        _options,
        hideOptionsStrict,
        (a, b) => a.value === b.value || a.label === b.label
      )
    } else {
      return _differenceWith(_options, hideOptions, (a, b) => a.value === b)
    }
  }, [
    data,
    initialFetchData,
    uniqueOptions,
    hideOptions,
    hideOptionsStrict,
    staticOptions,
    isSort
  ])

  return (
    <>
      <SelectComponent
        {...props}
        createdValue={createdValue}
        name={name}
        onFocus={handleFocus}
        onChange={handleChange}
        isLoading={loading}
        onInputChange={onInputChangeHandler}
        isSearchable={isSearchable}
        isCreatable={isCreatable}
        onMenuScrollToBottom={handleMenuScrollToBottom}
        options={options}
        error={validationError || error || props.error}
        isClearable={isClearable}
        isSort={isSort}
        components={
          isResettable
            ? {
                ...components,
                ClearIndicator: props => (
                  <ClearIndicator
                    innerValue={innerValue}
                    onClick={handleSearchReset}
                    {...props}
                  />
                )
              }
            : components
        }
        value={value}
        isGroupedSelect={isGroupedSelect}
        groupedOptions={groupedOptions}
      />
      {validationError && (
        <div className={classes.errorText}>{validationError}</div>
      )}
    </>
  )
}

FormControlAutocomplete.propTypes = {
  getOptions: PropTypes.func,
  initialResponse: PropTypes.shape({
    data: PropTypes.array,
    meta: PropTypes.object,
    error: PropTypes.string
  }),
  selectComponent: PropTypes.elementType,
  isSearchable: PropTypes.bool,
  isResettable: PropTypes.bool,
  isClearable: PropTypes.bool,
  isSort: PropTypes.bool,
  isCreatable: PropTypes.bool,
  withResetValue: PropTypes.bool,
  validationFunc: PropTypes.func,
  validationErrorMessage: PropTypes.string,
  limit: PropTypes.number,
  initialFetchValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  uniqueOptions: PropTypes.bool,
  staticRequestParams: PropTypes.object,
  isGroupedSelect: PropTypes.bool,
  groupedOptions: PropTypes.array
}
FormControlAutocomplete.defaultProps = {
  selectComponent: FormControlReactSelect,
  isSearchable: true,
  isResettable: false,
  isClearable: false,
  isSort: false,
  withResetValue: false,
  validationFunc: () => true,
  validationErrorMessage: '',
  limit: 10,
  initialResponse: {
    data: [],
    meta: { currentPage: 1 },
    error: ''
  },
  uniqueOptions: false,
  staticRequestParams: {},
  staticOptions: [],
  isGroupedSelect: false,
  groupedOptions: []
}
export default withStyles(styles)(FormControlAutocomplete)
