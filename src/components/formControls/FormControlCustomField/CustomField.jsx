import { useCallback, useMemo, useState } from 'react'
import { makeStyles } from '@material-ui/core'

import {
  CheckboxSwitcher,
  FormControlAutocomplete,
  FormControlCheckboxes,
  FormControlDatePicker,
  FormControlDateTimePicker,
  FormControlFileInput,
  FormControlInput,
  FormControlNumericInput,
  FormControlReactSelect,
  FormControlTelInput
} from 'components/formControls'
import { customFieldTypes } from 'constants/customFields'
import { Text } from 'components/typography'
import { position } from 'constants/common'
import {
  getLookupOptions,
  getOptionForLookupType
} from 'utils/customFieldUtils'
import Tooltip from 'components/Tooltip'
import classNames from 'classnames'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'
import { _get } from 'utils/lodash'

const useStyles = makeStyles(({ typography, type, fontSize }) => ({
  formControl: {
    '&:hover $copyIcon': {
      opacity: 1,
      visibility: 'visible'
    }
  },
  copyIcon: {
    ...typography.lightText[type],
    fontSize: fontSize.secondary,
    cursor: 'pointer',
    opacity: 0,
    visibility: 'hidden',
    transition: '0.3s opacity, 0.3s visibility'
  }
}))

const CustomField = ({
  type,
  label,
  name,
  value,
  error,
  touched,
  onChange,
  onBlur,
  lookupType,
  tooltip,
  tooltipType,
  options,
  isClearable = false,
  fullHeight = false,
  property,
  hideCopyBtn,
  formControlContainerClass,
  isMultiple,
  ...inputProps
}) => {
  const classes = useStyles()
  const [copyTooltip, setCopyTooltip] = useState('Click to copy input value')

  const handleCopy = useCallback(() => {
    navigator?.clipboard?.writeText && navigator.clipboard.writeText(value)
    setCopyTooltip('Input value copied to clipboard')
    setTimeout(() => setCopyTooltip('Click to copy input value'), 2000)
  }, [value])

  const renderField = useMemo(() => {
    const basicProps = {
      label,
      name,
      value,
      error,
      touched,
      onChange,
      onBlur,
      fullWidth: true,
      marginBottom: false,
      tooltip,
      tooltipType,
      tooltipHeader: property?.tooltipHeader,
      labelPosition: position.top,
      fullHeight,
      formControlContainerClass: classNames(
        classes.formControl,
        formControlContainerClass
      ),
      ...inputProps
    }
    switch (type) {
      case customFieldTypes.text:
        return <FormControlInput {...basicProps} />
      case customFieldTypes.textarea:
        return <FormControlInput {...basicProps} multiline />
      case customFieldTypes.email:
        return (
          <FormControlInput
            {...basicProps}
            type="email"
            endAdornment={
              hideCopyBtn ? null : (
                <Tooltip title={copyTooltip} placement="top" arrow>
                  <i
                    className={classNames(
                      getIconClassName(iconNames.copy),
                      classes.copyIcon
                    )}
                    onClick={handleCopy}
                  />
                </Tooltip>
              )
            }
          />
        )
      case customFieldTypes.select:
        return (
          <FormControlReactSelect
            {...basicProps}
            options={options}
            withPortal
            isClearable={isClearable}
          />
        )
      case customFieldTypes.multiselect:
        return (
          <FormControlReactSelect
            {...basicProps}
            options={options}
            isMulti
            withPortal
            isClearable={isClearable}
          />
        )
      case customFieldTypes.date:
        return <FormControlDatePicker {...basicProps} />
      case customFieldTypes.datetime:
        return <FormControlDateTimePicker {...basicProps} />
      case customFieldTypes.bool:
        return <CheckboxSwitcher {...basicProps} value={value ? true : false} />
      case customFieldTypes.checkbox:
        return <FormControlCheckboxes {...basicProps} options={options} />
      case customFieldTypes.phone:
        return (
          <FormControlTelInput
            {...basicProps}
            startAdornment={undefined}
            startAdornmentIcon={undefined}
            endAdornment={
              hideCopyBtn ? null : (
                <Tooltip title={copyTooltip} placement="top" arrow>
                  <i
                    className={classNames(
                      getIconClassName(iconNames.copy),
                      classes.copyIcon
                    )}
                    onClick={handleCopy}
                  />
                </Tooltip>
              )
            }
          />
        )
      case customFieldTypes.number:
        return <FormControlNumericInput {...basicProps} />
      case customFieldTypes.price:
        return (
          <FormControlNumericInput
            {...basicProps}
            max={property?.maxValue}
            precision={property?.decimal}
          />
        )
      case customFieldTypes.lookup:
        return (
          <FormControlAutocomplete
            {...basicProps}
            getOptions={getLookupOptions(lookupType)}
            {...(typeof value === 'object' && value.id
              ? {
                  value: getOptionForLookupType(lookupType, value)?.value,
                  staticOptions: [getOptionForLookupType(lookupType, value)],
                  uniqueOptions: true
                }
              : {})}
            withPortal
            isClearable={isClearable}
            isMulti={isMultiple}
            {...(value ? { initialFetchValue: !isMultiple && value } : {})}
          />
        )
      case customFieldTypes.file:
        return (
          <FormControlFileInput
            {...basicProps}
            isMulti={_get(property, 'file.isMulti', false)}
            max={_get(property, 'file.max', undefined)}
          />
        )
      default:
        return <Text>{name}</Text>
    }
  }, [
    type,
    label,
    name,
    value,
    error,
    touched,
    onChange,
    onBlur,
    options,
    lookupType,
    tooltip,
    tooltipType,
    isClearable,
    fullHeight,
    inputProps,
    property,
    classes.copyIcon,
    copyTooltip,
    handleCopy,
    hideCopyBtn,
    classes.formControl,
    formControlContainerClass,
    isMultiple
  ])

  return renderField
}

export default CustomField
