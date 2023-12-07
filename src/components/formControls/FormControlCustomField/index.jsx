import { useMemo } from 'react'

import CustomField from './CustomField'
import {
  getFieldFromCustomFieldCode,
  sortDataBySortOrder
} from 'utils/customFieldUtils'

const FormControlCustomField = ({
  layout,
  label: parentLabel,
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  disabled,
  marginBottom = 16,
  hideLabel,
  ...props
}) => {
  const {
    type,
    name: label,
    code,
    lookupType,
    options,
    tooltip,
    tooltipType,
    isRequired,
    property,
    isMultiple
  } = useMemo(
    () => getFieldFromCustomFieldCode(layout, name) || {},
    [layout, name]
  )

  const parsedOptions = useMemo(
    () =>
      options &&
      sortDataBySortOrder(options).map(({ id, name }) => ({
        value: id,
        label: name
      })),
    [options]
  )

  return (
    <CustomField
      type={type}
      label={hideLabel ? '' : parentLabel || label}
      name={code}
      value={value}
      error={error}
      touched={touched}
      onChange={onChange}
      onBlur={onBlur}
      lookupType={lookupType}
      options={parsedOptions}
      tooltip={tooltip}
      tooltipType={tooltipType}
      disabled={disabled}
      property={property}
      marginBottom={marginBottom}
      isRequired={isRequired}
      isMultiple={isMultiple}
      {...props}
    />
  )
}

export default FormControlCustomField
