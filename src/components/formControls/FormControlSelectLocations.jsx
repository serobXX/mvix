import React, { useCallback, useMemo } from 'react'

import { FormControlChips } from 'components/formControls'
import { _debounce } from 'utils/lodash'
import { useLazyFindLocationQuery } from 'api/configApi'

const FormControlSelectLocations = ({
  value,
  onChange,
  formatLabel,
  transformData,
  staticOptions,
  ...props
}) => {
  const [getLocation, { data: locations = [], isFetching }] =
    useLazyFindLocationQuery()

  const handleLocationInputChange = useMemo(
    () =>
      _debounce(value => {
        if (value && !value.label && value.length > 1) {
          const type = 'search'
          getLocation({
            [type]: value
          })
        }
      }, 500),
    [getLocation]
  )

  const handleChange = useCallback(
    e => onChange({ target: { ...e.target, value: e.target.val } }),
    [onChange]
  )

  const locationOptions = useMemo(
    () => [
      ...locations.map(
        transformData
          ? data =>
              transformData({
                ...data,
                city: data.name
              })
          : ({
              formattedAddress,
              placeId,
              latitude,
              longitude,
              name,
              ...data
            }) => ({
              label: formatLabel
                ? formatLabel({
                    formattedAddress,
                    placeId,
                    latitude,
                    longitude,
                    name,
                    ...data
                  })
                : `${formattedAddress}`,
              value: `${formattedAddress}`,
              val: `${formattedAddress}`,
              data: {
                latitude,
                longitude,
                placeId,
                city: name,
                formattedAddress,
                ...data
              }
            })
      ),
      ...(staticOptions || [])
    ],
    [locations, formatLabel, transformData, staticOptions]
  )

  return (
    <FormControlChips
      options={locationOptions}
      onInputChange={handleLocationInputChange}
      values={value}
      onChange={handleChange}
      isClearable
      isLoading={isFetching}
      filterOption={() => true}
      isMulti={false}
      {...props}
    />
  )
}

export default FormControlSelectLocations
