import {
  Fragment,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState
} from 'react'
import update from 'utils/immutability'

import { _get, _isNotEmpty } from 'utils/lodash'
import { camelCaseToSplitCapitalize } from 'utils/stringConversion'
import FilterField from './FilterField'
import { comparisonValues, filterTypeOperators } from 'constants/filter'

const withFilterField = (Component, filters, filterProps) =>
  forwardRef(({ filterChangedCallback, column, fromSidebar = false }, ref) => {
    const [values, setValues] = useState({})
    const [filterChanged, setFilterChanged] = useState(false)
    const isMultiFilter = !Component && !!filters?.length

    const setModel = useCallback(model => {
      setValues(model === null ? {} : model)
    }, [])

    useImperativeHandle(ref, () => {
      return {
        isFilterActive() {
          return (
            values !== null &&
            values !== '' &&
            _isNotEmpty(values) &&
            !Object.values(values).find(
              _values => _values.length === 1 && !_values?.[0]?.value
            )
          )
        },

        getModel() {
          if (!this.isFilterActive()) {
            return null
          }

          return values
        },

        setModel,

        onFloatingFilterChanged: value => {
          setFilterChanged(true)
          setModel(value)
        }
      }
    })

    const handleChange = useCallback(
      ({ name: fieldName, index, filterType }) =>
        ({ target: { name, value } }) => {
          let _values = { ...values }
          if (!!filterType) {
            _values = update(values, {
              $auto: {
                [fieldName]: {
                  $autoArray: {
                    [index]: {
                      $auto: {
                        type: {
                          $set:
                            _get(values, `${fieldName}.${index}.type`) ||
                            filterTypeOperators[filterType]?.[0]?.value
                        },
                        [name]: {
                          $set: value
                        }
                      }
                    }
                  }
                }
              }
            })

            if (name === 'value' && !!filterTypeOperators[filterType]) {
              const fieldValue = _values?.[fieldName]

              const emptyFields = fieldValue?.filter(
                ({ type, value }) =>
                  !value && !['blank', 'not_blank'].includes(type)
              )
              if (emptyFields.length === 0) {
                _values = update(_values, {
                  [fieldName]: {
                    $push: [
                      {
                        type:
                          filterTypeOperators[filterType] &&
                          filterTypeOperators[filterType]?.[0]?.value,
                        comparison: comparisonValues.and,
                        value: ''
                      }
                    ]
                  }
                })
              } else if (emptyFields.length > 1) {
                const fieldValues = fieldValue.filter(
                  ({ type, value }) =>
                    !!value || ['blank', 'not_blank'].includes(type)
                )
                fieldValues.push({
                  type:
                    filterTypeOperators[filterType] &&
                    filterTypeOperators[filterType]?.[0]?.value,
                  comparison: comparisonValues.and,
                  value: ''
                })
                _values = update(_values, {
                  [fieldName]: {
                    $set: fieldValues
                  }
                })
              }
            }
          } else {
            _values = update(values, {
              $auto: {
                [fieldName]: { $set: { value } }
              }
            })
          }

          setValues(_values)
          setFilterChanged(true)
        },
      [values]
    )

    const handleResetField = useCallback(
      ({ name: fieldName, filterType }) => {
        let _values = { ...values }
        if (!!filterType) {
          _values = update(values, {
            $auto: {
              [fieldName]: {
                $set: [
                  {
                    type: filterTypeOperators[filterType]?.[0]?.value,
                    value: ''
                  }
                ]
              }
            }
          })
        } else {
          _values = update(values, {
            $auto: {
              [fieldName]: { $set: { value: '' } }
            }
          })
        }

        setValues(_values)
        setFilterChanged(true)
      },
      [values]
    )

    useEffect(() => {
      if (filterChanged) {
        filterChangedCallback()
      }
      //eslint-disable-next-line
    }, [values])

    return isMultiFilter ? (
      <Fragment>
        {filters.map(filter => (
          <FilterField
            key={`multiple-filter-${filter.field}`}
            label={_get(
              filter,
              'headerName',
              camelCaseToSplitCapitalize(_get(filter, 'field', ''))
            )}
            name={filter.field}
            values={values?.[filter.field]}
            filterProps={filter.filterProps}
            component={filter.filter}
            handleChange={handleChange}
            fromSidebar={fromSidebar}
            isMultiFilter={isMultiFilter}
            handleResetField={handleResetField}
          />
        ))}
      </Fragment>
    ) : (
      <FilterField
        label={_get(
          column,
          'userProvidedColDef.headerName',
          camelCaseToSplitCapitalize(_get(column, 'colId', ''))
        )}
        name={_get(column, 'colId', '')}
        values={_get(values, `${_get(column, 'colId', '')}`)}
        filterProps={filterProps}
        component={Component}
        handleChange={handleChange}
        fromSidebar={fromSidebar}
        handleResetField={handleResetField}
      />
    )
  })

export default withFilterField
