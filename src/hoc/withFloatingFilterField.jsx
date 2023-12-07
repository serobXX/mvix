import Container from 'components/containers/Container'
import { comparisonValues, filterTypeOperators } from 'constants/filter'
import React, {
  Fragment,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState
} from 'react'
import update from 'utils/immutability'
import { _get } from 'utils/lodash'
import { camelCaseToSplitCapitalize } from 'utils/stringConversion'
import InputField from './withFilterField/FilterField/InputField'

const withFloatingFilterField = (Component, filters, filterProps) =>
  forwardRef(({ parentFilterInstance, column }, ref) => {
    const [values, setValues] = useState({})
    const isMultiFilter = !Component && !!filters?.length

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
          parentFilterInstance(instance => {
            instance.onFloatingFilterChanged(_values)
          })
        },
      [values, parentFilterInstance]
    )

    useImperativeHandle(ref, () => ({
      onParentModelChanged: model => {
        setValues(model == null ? {} : model)
      }
    }))

    const renderFilter = useCallback(
      ({
        name,
        values,
        placeholder,
        component,
        filterProps: { isMultiSelection, filterType, ...filterProps } = {}
      }) => {
        const value = filterType
          ? values?.length > 2
            ? values
                .reduce(
                  (a, b, index) =>
                    b.value
                      ? a + ` ${index > 0 ? `${b.comparison} ` : ''}${b.value}`
                      : a,
                  ''
                )
                .trim()
            : _get(values, '0.value', '')
          : values?.value
        return (
          <InputField
            label={placeholder}
            isMultiSelection={isMultiSelection}
            value={value}
            initialFetchValue={values?.length === 1 ? value : undefined}
            name={name}
            filterType={filterType}
            index={0}
            filterProps={filterProps}
            type={
              (values?.length ? values?.[0]?.type : values?.type) ||
              filterTypeOperators[filterType]?.[0]?.value
            }
            component={component}
            handleChange={handleChange}
            disabled={values?.length > 2}
          />
        )
      },
      [handleChange]
    )

    return isMultiFilter ? (
      <Container cols={filters.length}>
        {filters.map(filter => (
          <Fragment key={`multiple-floating-filter-${filter.field}`}>
            {renderFilter({
              placeholder: _get(
                filter,
                'headerName',
                camelCaseToSplitCapitalize(_get(filter, 'field', ''))
              ),
              name: filter.field,
              values: values?.[filter.field],
              filterProps: filter.filterProps,
              component: filter.filter
            })}
          </Fragment>
        ))}
      </Container>
    ) : (
      renderFilter({
        name: _get(column, 'colId', ''),
        values: _get(values, `${_get(column, 'colId', '')}`),
        filterProps,
        component: Component
      })
    )
  })

export default withFloatingFilterField
