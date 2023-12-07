import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import classNames from 'classnames'
import moment from 'moment'
import {
  InputLabel,
  FormControl,
  OutlinedInput,
  makeStyles,
  Grid
} from '@material-ui/core'

import { _isString } from 'utils/lodash'
import PropTypes from 'constants/propTypes'
import ErrorText from 'components/typography/ErrorText'
import { fontSize, position, tooltipTypes } from 'constants/common'
import { getIconClassName } from 'utils/iconUtils'
import iconNames, { iconTypes } from 'constants/iconNames'
import Tooltip from 'components/Tooltip'

const useStyles = makeStyles(
  ({
    palette,
    colors,
    type,
    spacing,
    transitions,
    typography,
    shapes,
    fontSize,
    lineHeight,
    fontWeight,
    formControls
  }) => ({
    root: ({ fullHeight }) => ({
      display: 'flex',
      flexWrap: 'wrap',
      width: '200px',
      position: 'relative',
      ...(fullHeight ? { height: '100%' } : {})
    }),
    rootContainer: {
      width: '100% !important'
    },
    formControlRoot: {
      width: '100%',
      position: 'relative',
      backgroundColor: palette[type].formControls.input.background,
      '&:hover $startAdornmentIcon': {
        opacity: 1
      }
    },
    inputReadOnly: {
      // zIndex: 3
    },
    formControlMargin: {
      marginBottom: spacing(2)
    },
    bootstrapRootWithoutMargin: {
      marginTop: 'unset !important'
    },
    bootstrapInput: ({
      fullHeight,
      isStartAdornment,
      isEndAdornment,
      isErrorIcon
    }) => ({
      borderRadius: 4,
      position: 'relative',
      color: palette[type].formControls.input.color,
      fontSize: fontSize.primary,
      padding: '5px 15px',
      paddingRight:
        isEndAdornment && isErrorIcon
          ? 60
          : isEndAdornment || isErrorIcon
          ? 40
          : 15,
      paddingLeft: isStartAdornment
        ? formControls.input.paddingLeft + 21
        : formControls.input.paddingLeft,
      transition: transitions.create(['border-color', 'box-shadow']),
      fontFamily: typography.fontFamily,
      ...(fullHeight
        ? { height: '100%' }
        : { height: shapes.height.secondary }),

      '&:focus': {
        border: `none`
      }
    }),
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
      height: '87px !important'
    },
    bootstrapTextAreaInput: {
      minHeight: '87px',
      margin: '11px 0px',
      overflowY: 'auto !important',
      paddingTop: '0px !important',

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
      fontSize: fontSize.primary,
      lineHeight: lineHeight.primary,
      fontWeight: fontWeight.normal,
      color: palette[type].formControls.label.color,
      transform: 'none'
    },
    topInputLabel: {
      transform: 'translate(0px, 0px) scale(1)',
      transition: '0.3s left, 0.3s top, 0.3s transform',
      top: 6,
      left: 15,
      whiteSpace: 'nowrap'
    },
    topInputStartIconLabel: {
      left: 37
    },
    topLabelShrink: {
      transform: 'translate(0px, 0px) scale(0.9)',
      top: -10,
      left: 17
    },
    labelRightComponentContainer: {
      position: 'absolute',
      top: 0,
      right: 0
    },
    bootstrapFormLabelFocus: {
      color: `${palette[type].formControls.label.color} !important`
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
      textShadow: 'unset'
    },
    rightLabel: {
      display: 'flex',
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing(2)
    },
    topLabel: {
      display: 'flex',
      flexDirection: 'column',
      marginTop: 10
    },
    leftLabel: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing(2)
    },
    bottomLabel: {
      display: 'flex',
      flexDirection: 'column-reverse'
    },
    label: {
      position: 'unset !important'
    },
    topLabelRoot: {
      position: 'absolute !important'
    },
    alignLabel: {
      alignSelf: 'flex-start'
    },
    shrink: {
      flexGrow: 1
    },
    labelLink: {
      textDecoration: 'underline',
      textDecorationStyle: 'dotted',
      textDecorationColor: colors.highlight,
      textUnderlineOffset: '2px',
      zIndex: 1,
      '&:hover': {
        cursor: 'pointer',
        textDecorationStyle: 'solid'
      }
    },
    multiline: ({ isEndAdornment, isErrorIcon }) => ({
      padding:
        isEndAdornment && isErrorIcon
          ? '0px 34px 0px 0px'
          : isEndAdornment || isErrorIcon
          ? '0px 14px 0px 0px'
          : 0
    }),
    errorTextRoot: {
      marginLeft: 5,
      whiteSpace: 'nowrap'
    },
    inputNotched: {
      border: `1px solid ${palette[type].formControls.input.border}`,
      '$inputRoot:hover &': {
        borderColor: `${palette[type].formControls.input.border}`
      },
      '& span': {
        paddingLeft: 8,
        paddingRight: 8
      }
    },
    inputNotchedReadOnly: {
      opacity: 0.5
    },
    topLabelFocused: {
      color: `${palette[type].formControls.label.activeColor} !important`
    },
    inputFocused: {
      '& $inputNotched': {
        border: `1px solid ${colors.highlight} !important`
      }
    },
    inputRoot: ({ fullHeight }) => ({
      ...(fullHeight ? { height: '100%' } : {})
    }),
    inputError: {
      '&:not($inputFocused) $inputNotched': {
        borderColor: `${palette[type].formControls.input.border}`
      }
    },
    disabledInput: {
      '& $inputNotched': {
        borderColor: `${palette[type].formControls.input.border} !important`
      },
      '& $requiredBorder': {
        borderLeftColor: `${colors.error} !important`
      }
    },
    disabledFormControl: {
      background: palette[type].formControls.disabled.background,
      '& $bootstrapFormLabel': {
        color: palette[type].formControls.disabled.color
      }
    },
    infoIcon: {
      ...typography.darkAccent[type],
      fontSize: 20,
      paddingLeft: 5,
      paddingTop: 10,
      cursor: 'pointer',
      color: colors.highlight
    },
    fullHeight: {
      height: '100%'
    },
    startAdornment: {
      position: 'absolute',
      left: 11,
      height: '100%',
      display: 'flex',
      alignItems: 'center'
    },
    endAdornment: {
      position: 'absolute',
      right: 11,
      height: '100%',
      display: 'flex',
      gap: 5,
      alignItems: 'center',
      zIndex: 2
    },
    startAdornmentIcon: {
      color: colors.highlight,
      fontSize: 16,
      height: 20,
      width: 20,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: '0.6',
      transition: '0.3s opacity'
    },
    startAdornmentIconActive: {
      opacity: '1'
    },
    errorIcon: {
      color: colors.error,
      cursor: 'pointer'
    },
    readOnlyWithoutSelection: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      zIndex: 1
    },
    requiredBorder: {
      borderLeftColor: `${colors.error} !important`,
      borderLeftWidth: 3
    }
  })
)

const FormControlInput = ({
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
  error,
  touched,
  onBlur,
  onFocus,
  labelRightComponent,
  showErrorText,
  marginBottom,
  customiseDisabled,
  pattern,
  onClickLabel,
  labelPosition,
  tooltip,
  tooltipType,
  tooltipHeader,
  tooltipMaxWidth,
  defaultValue,
  fontSizeVariant,
  labelFontSizeVariant,
  absoluteErrorText,
  inputRef: inputParentRef,
  startAdornment,
  startAdornmentIcon,
  endAdornment,
  endAdornmentIcon,
  fullHeight,
  inputComponent: InputComponent,
  inputComponentProps,
  labelShrink,
  isFocused: parentFocused,
  onDoubleClick,
  autoHeightInput,
  readOnly,
  readOnlyWithoutSelection,
  autoFocus,
  isRequired,
  startAdornmentRootClass,
  endAdornmentRootClass,
  isBottomError,
  ...props
}) => {
  const [isFocused, setFocused] = useState(false)
  const isStartAdornment = !!startAdornment || !!startAdornmentIcon
  const isEndAdornment = !!endAdornment || !!endAdornmentIcon
  const inputRef = useRef()
  const isUncontrolled = _isString(defaultValue)

  const showError = useMemo(() => {
    return !!(showErrorText && error && touched)
  }, [showErrorText, error, touched])

  const isErrorIcon = !isBottomError && showError

  const classes = useStyles({
    isEndAdornment,
    isStartAdornment,
    isErrorIcon,
    fullHeight,
    multiline
  })

  const inputValue = !isUncontrolled
    ? maskValue
      ? moment(value).format(maskValue)
      : value
    : undefined

  const inputClassName = classNames(
    classes.bootstrapInput,
    formControlInputClass,
    {
      [classes.bootstrapTextAreaInput]: multiline,
      [classes.bootstrapTextAreaHeight]: multiline && !autoHeightInput,
      [classes.disabled]: disabled && customiseDisabled,
      [classes.inputSmall]: fontSizeVariant === fontSize.small,
      [classes.inputSmallest]: fontSizeVariant === fontSize.smallest
    }
  )

  const inputRootClassName = classNames(
    classes.inputRoot,
    formControlInputRootClass,
    {
      [classes.inputReadOnly]: readOnly,
      [classes.bootstrapRootWithoutMargin]: labelPosition !== position.top,
      [classes.shrink]: labelPosition !== position.top
    }
  )

  useEffect(() => {
    if (parentFocused !== undefined) {
      setFocused(parentFocused)
    }
  }, [parentFocused])

  useEffect(() => {
    if (autoFocus && !disabled && !readOnlyWithoutSelection) {
      const input = inputParentRef?.current || inputRef?.current
      if (input) {
        input.focus()
      }
    }
    //eslint-disable-next-line
  }, [autoFocus])

  const handleFocus = useCallback(
    e => {
      setFocused(true)
      onFocus && onFocus(e)
    },
    [onFocus]
  )

  const handleBlur = useCallback(
    e => {
      setFocused(false)
      onBlur && onBlur(e)
    },
    [onBlur]
  )

  return (
    <div
      className={classNames(classes.root, formControlContainerClass, {
        [classes.rootContainer]: fullWidth
      })}
      onDoubleClick={onDoubleClick}
    >
      <Grid container wrap="nowrap" direction="column">
        <Grid
          item
          container
          className={classNames({
            [classes.fullHeight]: fullHeight
          })}
          wrap="nowrap"
        >
          <FormControl
            className={classNames(
              classes.formControlRoot,
              formControlRootClass,
              {
                [classes.formControlMargin]:
                  !absoluteErrorText && showError ? false : marginBottom,
                [classes.leftLabel]: labelPosition === position.left,
                [classes.topLabel]: labelPosition === position.top && label,
                [classes.bottomLabel]: labelPosition === position.bottom,
                [classes.rightLabel]: labelPosition === position.right,
                [classes.disabledFormControl]: disabled && customiseDisabled
              }
            )}
            disabled={disabled && customiseDisabled}
          >
            {readOnlyWithoutSelection && (
              <div className={classes.readOnlyWithoutSelection} />
            )}
            {labelRightComponent && (
              <div className={classes.labelRightComponentContainer}>
                {labelRightComponent}
              </div>
            )}
            {label && (
              <Tooltip
                arrow
                title={tooltip || ''}
                headerText={tooltipHeader || ''}
                withHeader={!!tooltipHeader}
                disableHoverListener={
                  !tooltip || tooltipType !== tooltipTypes.text
                }
                placement="top"
                maxWidth={tooltipMaxWidth}
              >
                <InputLabel
                  shrink={
                    labelPosition !== position.top ||
                    !!placeholder ||
                    labelShrink ||
                    undefined
                  }
                  htmlFor={id}
                  className={classNames(
                    classes.bootstrapFormLabel,
                    formControlLabelClass,
                    {
                      [classes.topInputLabel]: labelPosition === position.top,
                      [classes.topInputStartIconLabel]:
                        labelPosition === position.top && isStartAdornment,
                      [classes.alignLabel]: labelPosition === position.bottom,
                      [classes.labelSmall]:
                        labelFontSizeVariant === fontSize.small,
                      [classes.labelSmallest]:
                        labelFontSizeVariant === fontSize.smallest
                    }
                  )}
                  classes={{
                    focused: classNames({
                      [classes.bootstrapFormLabelFocus]:
                        labelPosition !== position.top,
                      [classes.topLabelFocused]: labelPosition === position.top
                    }),
                    shrink: classNames({
                      [classes.topLabelShrink]: labelPosition === position.top
                    }),
                    root: classNames(classes.label, {
                      [classes.labelLink]:
                        (tooltip && tooltipType === tooltipTypes.text) ||
                        !!onClickLabel,
                      [classes.topLabelRoot]: labelPosition === position.top
                    })
                  }}
                  onClick={() => onClickLabel && onClickLabel()}
                  focused={isFocused}
                >
                  {label} {isOptional && <i>({'optional'})</i>}
                </InputLabel>
              </Tooltip>
            )}

            {InputComponent ? (
              <InputComponent
                inputRootClassName={inputRootClassName}
                inputClassName={inputClassName}
                {...inputComponentProps}
              />
            ) : (
              <OutlinedInput
                id={id}
                type={type}
                value={inputValue}
                label={`${label}${isOptional ? <i>({'optional'})</i> : ''}`}
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
                  focused: classes.inputFocused,
                  notchedOutline: classNames(classes.inputNotched, {
                    [classes.inputNotchedReadOnly]: readOnlyWithoutSelection,
                    [classes.requiredBorder]: isRequired
                  }),
                  disabled: classes.disabledInput,
                  error: classes.inputError,
                  multiline: classes.multiline
                }}
                onChange={onChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                inputRef={inputParentRef || inputRef}
                error={showError}
                readOnly={readOnly}
                {...(labelPosition === position.top && !!label
                  ? !!placeholder
                    ? { notched: true }
                    : {}
                  : { notched: false })}
                {...props}
              />
            )}
            {isStartAdornment && (
              <div
                className={classNames(
                  classes.startAdornment,
                  startAdornmentRootClass
                )}
              >
                {startAdornment || (
                  <i
                    className={classNames(
                      startAdornmentIcon,
                      classes.startAdornmentIcon,
                      {
                        [classes.startAdornmentIconActive]: isFocused || !!value
                      }
                    )}
                  />
                )}
              </div>
            )}

            {(isEndAdornment || isErrorIcon) && (
              <div
                className={classNames(
                  classes.endAdornment,
                  endAdornmentRootClass
                )}
              >
                {isEndAdornment &&
                  (endAdornment || (
                    <i
                      className={classNames(
                        endAdornmentIcon,
                        classes.startAdornmentIcon,
                        {
                          [classes.startAdornmentIconActive]:
                            isFocused || !!value
                        }
                      )}
                    />
                  ))}
                {isErrorIcon && (
                  <Tooltip title={error} placement="top" arrow>
                    <i
                      className={classNames(
                        getIconClassName(iconNames.error, iconTypes.solid),
                        classes.startAdornmentIcon,
                        classes.errorIcon,
                        {
                          [classes.startAdornmentIconActive]: isFocused
                        }
                      )}
                    />
                  </Tooltip>
                )}
              </div>
            )}

            {isBottomError && (
              <ErrorText
                isOptional={isOptional}
                absolute={absoluteErrorText}
                condition={showError}
                error={error}
                rootClassName={classNames(
                  classes.errorTextRoot,
                  errorTextClass
                )}
              />
            )}
          </FormControl>
          {!!tooltip && tooltipType === tooltipTypes.icon && (
            <Tooltip
              title={tooltip}
              headerText={tooltipHeader}
              withHeader={!!tooltipHeader}
              disableHoverListener={
                !tooltip || tooltipType !== tooltipTypes.icon
              }
              arrow
              placement="top"
            >
              <i
                className={classNames(
                  getIconClassName(iconNames.info, iconTypes.regular),
                  classes.infoIcon
                )}
              />
            </Tooltip>
          )}
        </Grid>
      </Grid>
    </div>
  )
}

FormControlInput.propTypes = {
  type: PropTypes.string,
  autocomplete: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  maskValue: PropTypes.string,
  isOptional: PropTypes.bool,
  fullWidth: PropTypes.bool,
  placeholder: PropTypes.string,
  formControlContainerClass: PropTypes.className,
  formControlRootClass: PropTypes.className,
  formControlLabelClass: PropTypes.className,
  formControlInputRootClass: PropTypes.className,
  formControlInputClass: PropTypes.className,
  errorTextClass: PropTypes.className,
  multiline: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  touched: PropTypes.bool,
  onBlur: PropTypes.func,
  labelRightComponent: PropTypes.node,
  showErrorText: PropTypes.bool,
  marginBottom: PropTypes.bool,
  customiseDisabled: PropTypes.bool,
  labelPosition: PropTypes.inputFieldLabelPosition,
  tooltip: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  id: PropTypes.string,
  name: PropTypes.string,
  pattern: PropTypes.string,
  onClickLabel: PropTypes.func,
  defaultValue: PropTypes.string,
  absoluteErrorText: PropTypes.bool,
  fontSizeVariant: PropTypes.inputFieldFontSize,
  labelFontSizeVariant: PropTypes.inputFieldFontSize,
  inputRef: PropTypes.ref,
  startAdornment: PropTypes.node,
  endAdornment: PropTypes.node,
  fullHeight: PropTypes.bool,
  inputComponent: PropTypes.func,
  labelShrink: PropTypes.bool,
  isFocused: PropTypes.bool,
  inputComponentProps: PropTypes.object,
  tooltipType: PropTypes.string,
  isRequired: PropTypes.bool,
  isBottomError: PropTypes.bool
}

FormControlInput.defaultProps = {
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
  error: '',
  touched: false,
  onBlur: f => f,
  labelRightComponent: null,
  showErrorText: true,
  marginBottom: true,
  customiseDisabled: true,
  labelPosition: position.top,
  tooltip: '',
  tooltipType: tooltipTypes.text,
  fontSizeVariant: 'primary',
  labelFontSizeVariant: 'primary',
  absoluteErrorText: true,
  fullHeight: false,
  inputComponentProps: {},
  isRequired: false,
  isBottomError: false
}

export default FormControlInput
