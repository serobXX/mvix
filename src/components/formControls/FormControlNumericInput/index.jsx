import { useCallback, useState } from 'react'
import NumericInput from 'react-numeric-input'
import classNames from 'classnames'
import { makeStyles } from '@material-ui/core'

import FormControlInput from '../FormControlInput'
import { simulateEvent } from 'utils/formik'
import { _toNumber } from 'utils/lodash'
import PropTypes from 'constants/propTypes'
import { position, tooltipTypes } from 'constants/common'

const useStyles = makeStyles(({ palette, type, colors }) => ({
  numericInputContainer: {
    borderRadius: '4px',
    '& .react-numeric-input': {
      width: '100%',
      height: '100%',

      '& b': {
        width: '18px !important',
        height: '50% !important',
        right: '0 !important',
        border: 'none !important',
        boxShadow: 'none !important',
        background: 'transparent !important',
        borderLeft: `1px solid ${palette[type].formControls.input.border} !important`,

        '& i': {
          transform: 'translate(-50%, -50%) !important',
          margin: '0 !important'
        }
      },

      '& b:nth-of-type(1)': {
        top: '0 !important',
        borderRadius: '0 2px 0 0 !important',
        borderBottom: `1px solid ${palette[type].formControls.input.border} !important`,

        '& i': {
          borderstyle: 'solid !important',
          borderwidth: '0 3px 4px 3px !important',
          borderColor: 'transparent transparent #9fadbf transparent !important'
        }
      },

      '& b:nth-of-type(2)': {
        bottom: '0 !important',
        borderRadius: '0 0 2px 0 !important',

        '& i': {
          borderStyle: 'solid !important',
          borderWidth: '4px 3px 0 3px !important',
          borderColor: '#9fadbf transparent transparent transparent !important'
        }
      },

      '& input': {
        display: 'block !important',
        background: 'transparent',
        border: 'none',

        '&:focus': {
          outline: 'none !important'
        }
      }
    }
  },
  numericReadOnlyWithoutSelection: {
    '& .react-numeric-input': {
      '& b:nth-of-type(1)': {
        opacity: '0.5'
      },

      '& b:nth-of-type(2)': {
        opacity: '0.5'
      }
    }
  },
  formContainer: {
    maxWidth: 100
  },
  numericInputFullWidth: {
    '& .react-numeric-input': {
      width: '100%'
    }
  },
  notchedOutline: ({ isFocused }) => ({
    top: '-5px',
    left: 0,
    right: 0,
    bottom: 0,
    margin: 0,
    padding: '0 8px',
    overflow: 'hidden',
    position: 'absolute',
    border: `1px solid ${
      isFocused ? colors.highlight : palette[type].formControls.input.border
    }`,
    borderBottomColor: isFocused
      ? colors.highlight
      : palette[type].formControls.input.border,
    borderRadius: 'inherit',
    pointerEvents: 'none'
  }),
  notchedOutlineLabel: ({ isFocused, shrink }) => ({
    width: 'auto',
    height: 11,
    display: 'block',
    padding: 0,
    fontSize: '11.7px',
    maxWidth: isFocused || shrink ? '1000px' : '0.01px',
    textAlign: 'left',
    transition:
      isFocused || shrink
        ? 'max-width 100mscubic-bezier(0.0, 0, 0.2, 1) 50ms'
        : 'max-width 50ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
    visibility: 'hidden',

    '& span': {
      display: 'inline-block',
      paddingLeft: 8,
      paddingRight: 8
    }
  }),
  inputNotchedReadOnly: {
    opacity: `0.5 !important`
  },
  requiredBorder: {
    borderLeftColor: `${colors.error} !important`,
    borderLeftWidth: `3px !important`
  },
  numericOnlyInput: ({ isStartAdornment, isEndAdornment }) => ({
    '& .react-numeric-input': {
      '& b': {
        display: 'none'
      },
      '& input': {
        paddingLeft: isStartAdornment ? 9 : 0,
        paddingRight: `${isEndAdornment ? 9 : 0}px !important`
      }
    }
  }),
  notchedOnlyInput: {
    border: 'none !important'
  },
  startAdornmentOnlyInput: {
    left: 0
  },
  endAdornmentOnlyInput: {
    right: `0px !important`
  },
  containerWidthAuto: ({ containerWidth }) => ({
    width: containerWidth
  }),
  endAdornment: {
    right: 20
  }
}))

const numericInputUnsetStyles = {
  'input:disabled': {
    textShadow: null
  },
  'input:not(.form-control)': {
    fontSize: null,
    paddingRight: null,
    paddingLeft: null,
    border: null,
    width: '100%'
  }
}

const InputComponent = ({
  inputRootClassName,
  inputClassName,
  value,
  classes,
  disabled,
  fullWidth,
  handleChangeNumericInput,
  handleNumericBlur,
  max,
  min,
  name,
  numericFormat,
  precision,
  step,
  strict,
  handleFocus,
  label,
  numericRef,
  props,
  isOptional,
  readOnlyWithoutSelection,
  isRequired,
  onlyInput
}) => (
  <div
    className={classNames(classes.numericInputContainer, inputRootClassName, {
      [classes.numericInputFullWidth]: fullWidth,
      [classes.numericReadOnlyWithoutSelection]: readOnlyWithoutSelection,
      [classes.numericOnlyInput]: onlyInput
    })}
  >
    <NumericInput
      strict={strict}
      min={min}
      max={max}
      step={step}
      value={value}
      format={numericFormat}
      disabled={disabled}
      name={name}
      onChange={handleChangeNumericInput}
      onBlur={handleNumericBlur}
      onFocus={handleFocus}
      className={inputClassName}
      style={numericInputUnsetStyles}
      precision={precision}
      ref={numericRef}
      {...props}
    />
    <fieldset
      aria-hidden="true"
      className={classNames(classes.notchedOutline, {
        [classes.inputNotchedReadOnly]: readOnlyWithoutSelection,
        [classes.requiredBorder]: isRequired,
        [classes.notchedOnlyInput]: onlyInput
      })}
    >
      <legend className={classes.notchedOutlineLabel}>
        {label && <span>{`${label}${isOptional ? ' (optional)' : ''}`}</span>}
      </legend>
    </fieldset>
  </div>
)

const FormControlNumericInput = ({
  strict,
  label,
  min,
  max,
  step,
  value,
  format,
  disabled,
  name,
  onChange,
  onBlur,
  precision,
  blurMin,
  fullWidth,
  touched,
  error,
  formControlContainerClass,
  marginBottom,
  fullHeight,
  isNullable,
  numericRef,
  isOptional,
  tooltip,
  tooltipType,
  tooltipHeader,
  labelPosition,
  startAdornment,
  startAdornmentIcon,
  endAdornment,
  endAdornmentIcon,
  readOnly,
  readOnlyWithoutSelection,
  autoFocus,
  formControlRootClass,
  isRequired,
  onlyInput,
  isBottomError,
  ...props
}) => {
  const [isFocused, setFocused] = useState(false)
  const classes = useStyles({
    isFocused,
    shrink: !!value || value === 0,
    showError: !!error && touched,
    isStartAdornment: !!startAdornment || !!startAdornmentIcon,
    isEndAdornment: !!endAdornment || !!endAdornmentIcon,
    containerWidth:
      String(value).split('.')?.[0].length * 10 + precision * 10 + 10
  })

  const numericFormat = useCallback(
    num => {
      if (format && num === format.number.toString()) {
        return format.format
      }
      return num
    },
    [format]
  )

  const handleChangeNumericInput = useCallback(
    value => {
      if (name) {
        onChange(simulateEvent(name, value))
      } else {
        onChange(value, name)
      }
    },
    [onChange, name]
  )

  const handleNumericBlur = useCallback(
    ({ target }) => {
      setFocused(false)

      const { value, name } = target
      let num = value
      const minimum = blurMin || min
      if (value > max) num = max
      if (value < minimum) num = minimum
      onBlur(simulateEvent(name, null))
      if (name && !isNullable) {
        return onChange(simulateEvent(name, _toNumber(num)))
      }
    },
    [max, min, onBlur, onChange, blurMin, isNullable]
  )

  const handleFocus = useCallback(() => {
    setFocused(true)
  }, [])

  return (
    <FormControlInput
      inputComponent={InputComponent}
      inputComponentProps={{
        value,
        classes,
        disabled,
        fullWidth,
        handleChangeNumericInput,
        handleNumericBlur,
        max,
        min,
        name,
        numericFormat,
        precision,
        step,
        strict,
        handleFocus,
        label,
        props,
        numericRef,
        isOptional,
        readOnlyWithoutSelection,
        isRequired,
        onlyInput
      }}
      fullWidth={fullWidth}
      label={label}
      touched={touched}
      error={error}
      labelShrink={isFocused || !!value || value === 0}
      isFocused={isFocused}
      formControlContainerClass={classNames(formControlContainerClass, {
        [classes.formContainer]: !fullWidth,
        [classes.containerWidthAuto]: onlyInput && !fullWidth
      })}
      marginBottom={marginBottom}
      fullHeight={fullHeight}
      isOptional={isOptional}
      disabled={disabled}
      tooltip={tooltip}
      tooltipType={tooltipType}
      tooltipHeader={tooltipHeader}
      labelPosition={labelPosition}
      startAdornment={startAdornment}
      startAdornmentIcon={startAdornmentIcon}
      endAdornment={endAdornment}
      endAdornmentIcon={endAdornmentIcon}
      readOnly={readOnly}
      readOnlyWithoutSelection={readOnlyWithoutSelection}
      autoFocus={autoFocus}
      formControlRootClass={formControlRootClass}
      isRequired={isRequired}
      startAdornmentRootClass={classNames({
        [classes.startAdornmentOnlyInput]: onlyInput
      })}
      endAdornmentRootClass={classNames(classes.endAdornment, {
        [classes.endAdornmentOnlyInput]: onlyInput
      })}
      isBottomError={isBottomError}
    />
  )
}

FormControlNumericInput.propTypes = {
  strict: PropTypes.bool,
  label: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  format: PropTypes.string,
  disabled: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  blurMin: PropTypes.number,
  fullWidth: PropTypes.bool,
  touched: PropTypes.bool,
  error: PropTypes.string,
  formControlContainerClass: PropTypes.className,
  isNullable: PropTypes.bool,
  numericRef: PropTypes.ref,
  isOptional: PropTypes.bool,
  tooltip: PropTypes.string,
  tooltipType: PropTypes.string,
  labelPosition: PropTypes.inputFieldLabelPosition,
  isBottomError: PropTypes.bool
}

FormControlNumericInput.defaultProps = {
  min: 0,
  blurMin: 0,
  max: 9999999,
  step: 1,
  onChange: f => f,
  onBlur: f => f,
  isNullable: false,
  isOptional: false,
  tooltip: '',
  tooltipType: tooltipTypes.text,
  labelPosition: position.top,
  isBottomError: false
}

export default FormControlNumericInput
