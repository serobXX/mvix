import React, { memo } from 'react'
import PropTypes from 'constants/propTypes'
import FormControlChips from './FormControlChips'

const FormControlReactSelect = ({
  onChange,
  value,
  labelPosition = 'top',
  label,
  formControlContainerClass,
  formControlLabelClass,
  error,
  touched,
  marginBottom,
  isSearchable,
  isMulti = false,
  isSort = true,
  ...props
}) => {
  return (
    <FormControlChips
      isMulti={isMulti}
      isSearchable={isSearchable}
      onChange={onChange}
      values={value}
      error={error}
      isSort={isSort}
      touched={touched}
      formControlContainerClass={formControlContainerClass}
      formControlLabelClass={formControlLabelClass}
      marginBottom={marginBottom}
      labelPosition={labelPosition}
      label={label}
      {...props}
    />
  )
}

FormControlReactSelect.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool
  ]),
  labelPosition: PropTypes.string,
  label: PropTypes.string,
  isSort: PropTypes.bool,
  formControlContainerClass: PropTypes.className,
  formControlLabelClass: PropTypes.className,
  error: PropTypes.string,
  touched: PropTypes.bool,
  marginBottom: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  isSearchable: PropTypes.bool,
  isMulti: PropTypes.bool,
  options: PropTypes.array
}

FormControlReactSelect.defaultProps = {
  isSearchable: false
}

export default memo(FormControlReactSelect)
