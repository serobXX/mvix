import React, { memo, useMemo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import moment from 'moment'
import InputBase from '@material-ui/core/InputBase'
import { withStyles, InputLabel, FormControl, Tooltip } from '@material-ui/core'

import { _isString } from 'utils/lodash'
import { ErrorText } from 'components/typography'

const styles = ({
  palette,
  colors,
  type,
  transitions,
  typography,
  fontSize
}) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  rootContainer: {
    width: '100%'
  },
  formControlRoot: {
    width: '100%',
    position: 'relative'
  },
  formControlMargin: {
    marginBottom: '0.75rem'
  },
  bootstrapRootWithoutMargin: {
    marginTop: 'unset !important'
  },
  bootstrapInput: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: palette[type].formControls.input.background,
    border: `1px solid #e6e6e6`,
    fontSize: '0.9em',
    padding: '0.75em',
    fontWeight: '600',
    color: '#505050',
    transition: transitions.create(['border-color', 'box-shadow']),
    fontFamily: typography.fontFamily,
    height: '44px',

    '&::placeholder': {
      color: '#000',
      fontWeight: '600'
    },

    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)'
    }
  },
  inputSmall: {
    fontSize: fontSize.small
  },
  inputSmallest: {
    fontSize: fontSize.smallest
  },
  labelSmall: {
    fontSize: `${fontSize.small}px !important`
  },
  labelSmallest: {
    fontSize: `${fontSize.smallest}px !important`
  },
  bootstrapTextAreaHeight: {
    height: '87px',

    '&::-webkit-scrollbar': {
      width: '6px',
      height: '6px'
    },
    '&::-webkit-scrollbar-thumb': {
      background: palette[type].scrollbar.background,
      borderRadius: '5px'
    }
  },
  bootstrapFormLabel: {
    fontSize: '0.93em',
    marginBottom: '0.25em',
    fontWeight: '600',
    color: '#505050',
    lineHeight: '0.93em',
    transform: 'none'
  },
  bootstrapFormLabelFocus: {
    color: `#505050 !important`
  },
  labelRightComponentContainer: {
    position: 'absolute',
    top: 0,
    right: 0
  },
  error: {
    color: colors.error,
    fontSize: 9,
    lineHeight: '12px',
    position: 'absolute',
    left: 5
  },
  disabled: {
    cursor: 'default',
    backgroundColor: palette[type].formControls.disabled.background,
    textShadow: 'unset'
  },
  rightLabel: {
    display: 'flex',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center'
  },
  topLabel: {
    display: 'flex',
    flexDirection: 'column'
  },
  leftLabel: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  bottomLabel: {
    display: 'flex',
    flexDirection: 'column-reverse'
  },
  label: {
    position: 'unset !important'
  },
  alignLabel: {
    alignSelf: 'flex-start'
  },
  shrink: {
    flexGrow: 1
  },
  labelLink: {
    position: 'unset !important',
    textDecoration: 'underline',
    textDecorationStyle: 'dotted',
    textDecorationColor: colors.highlight,
    textUnderlineOffset: '2px',
    '&:hover': {
      cursor: 'pointer',
      textDecorationStyle: 'solid'
    }
  },
  errorField: {
    border: `3px solid ${colors.error}`
  },
  optionalErrorField: {
    borderBottom: `2px solid ${colors.optionalError}`
  },
  multiline: {
    padding: 0
  },
  errorWithoutIcon: {
    marginLeft: 5
  },
  errorText: {
    fontSize: '0.93em',
    marginTop: '0.2em',
    marginLeft: 0,
    fontWeight: '700'
  }
})

const PaymentFormInput = ({
  t,
  classes,
  id,
  type,
  autocomplete,
  label,
  value,
  maskValue,
  isOptional,
  fullWidth,
  placeholder,
  formControlContainerClass,
  formControlRootClass,
  formControlLabelClass,
  formControlInputRootClass,
  formControlInputClass,
  errorTextClass,
  multiline,
  onChange,
  name,
  disabled,
  icon,
  error,
  touched,
  onBlur,
  labelRightComponent,
  showErrorText,
  marginBottom,
  customiseDisabled,
  pattern,
  onClickLabel,
  labelPosition,
  tooltip,
  defaultValue,
  fontSizeVariant,
  labelFontSizeVariant,
  absoluteErrorText,
  inputRef,
  tReady,
  ...props
}) => {
  const isUncontrolled = _isString(defaultValue)
  const inputValue = !isUncontrolled
    ? maskValue
      ? moment(value).format(maskValue)
      : value
    : undefined

  const inputClassName = classNames(
    classes.bootstrapInput,
    formControlInputClass,
    {
      [classes.errorField]: !!(showErrorText && error && touched),
      [classes.optionalErrorField]: !!(
        showErrorText &&
        error &&
        touched &&
        isOptional
      ),
      [classes.bootstrapTextAreaHeight]: multiline,
      [classes.disabled]: disabled && customiseDisabled,
      [classes.inputSmall]: fontSizeVariant === 'small',
      [classes.inputSmallest]: fontSizeVariant === 'smallest'
    }
  )

  const inputRootClassName = classNames(
    classes.bootstrapRoot,
    formControlInputRootClass,
    {
      [classes.bootstrapRootWithoutMargin]: labelPosition !== 'top',
      [classes.shrink]: labelPosition !== 'top'
    }
  )

  const showError = useMemo(() => {
    return !!(showErrorText && error && touched)
  }, [showErrorText, error, touched])

  return (
    <div
      className={classNames(classes.root, formControlContainerClass, {
        [classes.rootContainer]: fullWidth
      })}
    >
      <FormControl
        className={classNames(classes.formControlRoot, formControlRootClass, {
          [classes.formControlMargin]:
            !absoluteErrorText && showError ? false : marginBottom,
          [classes.leftLabel]: labelPosition === 'left',
          [classes.topLabel]: labelPosition === 'top',
          [classes.bottomLabel]: labelPosition === 'bottom',
          [classes.rightLabel]: labelPosition === 'right'
        })}
      >
        {labelRightComponent && (
          <div className={classes.labelRightComponentContainer}>
            {labelRightComponent}
          </div>
        )}

        {label && (
          <Tooltip
            arrow
            title={tooltip}
            disableHoverListener={!tooltip}
            placement="top"
          >
            <InputLabel
              shrink
              htmlFor={id}
              className={classNames(
                classes.bootstrapFormLabel,
                formControlLabelClass,
                {
                  [classes.alignLabel]:
                    labelPosition === 'top' || labelPosition === 'bottom',
                  [classes.labelSmall]: labelFontSizeVariant === 'small',
                  [classes.labelSmallest]: labelFontSizeVariant === 'smallest'
                }
              )}
              classes={{
                focused: classes.bootstrapFormLabelFocus,
                root:
                  tooltip || !!onClickLabel ? classes.labelLink : classes.label
              }}
              onClick={() => onClickLabel && onClickLabel()}
            >
              {label} {isOptional && <i>({t('optional')})</i>}
            </InputLabel>
          </Tooltip>
        )}

        <InputBase
          id={id}
          type={type}
          value={inputValue}
          defaultValue={defaultValue}
          name={name}
          fullWidth={fullWidth}
          placeholder={placeholder}
          multiline={multiline}
          disabled={disabled}
          pattern={pattern}
          autoComplete={autocomplete}
          classes={{
            root: inputRootClassName,
            input: inputClassName,
            multiline: classes.multiline
          }}
          onChange={onChange}
          onBlur={onBlur}
          inputRef={inputRef}
          {...props}
        />

        {!!icon && icon}

        <ErrorText
          isOptional={isOptional}
          absolute={absoluteErrorText}
          condition={showError}
          error={error}
          rootClassName={classNames(
            classes.errorText,
            {
              [classes.errorWithoutIcon]: !icon
            },
            errorTextClass
          )}
        />
      </FormControl>
    </div>
  )
}

PaymentFormInput.propTypes = {
  type: PropTypes.string,
  autocomplete: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  maskValue: PropTypes.string,
  isOptional: PropTypes.bool,
  fullWidth: PropTypes.bool,
  placeholder: PropTypes.string,
  formControlContainerClass: PropTypes.string,
  formControlRootClass: PropTypes.string,
  formControlLabelClass: PropTypes.string,
  formControlInputRootClass: PropTypes.string,
  formControlInputClass: PropTypes.string,
  errorTextClass: PropTypes.string,
  multiline: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  error: PropTypes.string,
  touched: PropTypes.bool,
  onBlur: PropTypes.func,
  labelRightComponent: PropTypes.node,
  showErrorText: PropTypes.bool,
  marginBottom: PropTypes.bool,
  customiseDisabled: PropTypes.bool,
  labelPosition: PropTypes.string,
  tooltip: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  pattern: PropTypes.string,
  onClickLabel: PropTypes.func,
  defaultValue: PropTypes.string,
  absoluteErrorText: PropTypes.bool,
  fontSizeVariant: PropTypes.oneOf(['primary', 'small', 'smallest']),
  labelFontSizeVariant: PropTypes.oneOf(['primary', 'small', 'smallest']),
  inputRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
}

PaymentFormInput.defaultProps = {
  type: 'text',
  autocomplete: 'new-password',
  label: '',
  value: '',
  maskValue: '',
  isOptional: false,
  fullWidth: false,
  placeholder: null,
  formControlContainerClass: '',
  formControlRootClass: '',
  formControlLabelClass: '',
  formControlInputRootClass: '',
  formControlInputClass: '',
  errorTextClass: '',
  multiline: false,
  onChange: f => f,
  disabled: false,
  icon: null,
  error: '',
  touched: false,
  onBlur: f => f,
  labelRightComponent: null,
  showErrorText: true,
  marginBottom: true,
  customiseDisabled: true,
  labelPosition: 'top',
  tooltip: '',
  fontSizeVariant: 'primary',
  labelFontSizeVariant: 'primary',
  absoluteErrorText: false
}

export default withStyles(styles)(memo(PaymentFormInput))
