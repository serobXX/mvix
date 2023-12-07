import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import classNames from 'classnames'
import PhoneInput from 'react-phone-input-2'
import { isValidPhoneNumber } from 'libphonenumber-js'
import { FormControl, Grid, InputLabel, makeStyles } from '@material-ui/core'

import { simulateEvent } from 'utils/formik'
import { getPlaceholderByCountryCode } from 'utils/phoneUtils'
import PropTypes from 'constants/propTypes'
import { fontSize, position, tooltipTypes } from 'constants/common'
import { _isNotEmpty } from 'utils/lodash'
import { ErrorText } from 'components/typography'
import Tooltip from 'components/Tooltip'

import 'react-phone-input-2/lib/style.css'
import { getIconClassName } from 'utils/iconUtils'
import iconNames, { iconTypes } from 'constants/iconNames'

const ReactPhoneInput = import.meta.env.PROD ? PhoneInput.default : PhoneInput

const useStyles = makeStyles(
  ({
    palette,
    type,
    typography,
    transitions,
    fontSize,
    fontWeight,
    lineHeight,
    shapes,
    colors,
    formControls
  }) => {
    return {
      root: ({ isStartAdornment, isEndAdornment, isErrorIcon }) => ({
        position: 'relative',
        width: '100%',
        '& .react-tel-input': {
          '& .form-control': {
            width: '100%',
            height: shapes.height.secondary,
            borderRadius: 4,
            position: 'relative',
            border: 'none',
            background: 'transparent',
            color: palette[type].formControls.input.color,
            fontSize: fontSize.primary,
            lineHeight: lineHeight.primary,
            fontWeight: fontWeight.normal,
            fontFamily: typography.fontFamily,
            paddingTop: 9,
            paddingBottom: 9,
            paddingRight:
              isEndAdornment && isErrorIcon
                ? 60
                : isEndAdornment || isErrorIcon
                ? 40
                : 15,
            transition: transitions.create(['border-color', 'box-shadow']),
            paddingLeft:
              formControls.input.paddingLeft + 32 + (isStartAdornment ? 21 : 0),

            '&:focus': {
              borderRadius: 4
            },

            '&::placeholder': {
              color: colors.light,
              ...formControls.placeholder
            }
          },
          '& .selected-flag': {
            paddingLeft: 11,

            '&:hover, &:focus': {
              backgroundColor: `${palette[type].formControls.select.border} !important`
            }
          },
          '& .flag-dropdown': {
            '&.open': {
              '& .selected-flag': {
                background: 'transparent'
              }
            }
          },
          '& .country-list': {
            width: '100%',

            '& .country': {
              display: 'flex',

              '& .country-name': {
                display: 'block',
                fontSize: 14,
                maxWidth: '80px',
                textOverflow: 'ellipsis',
                overflow: 'hidden'
              },

              '& .dial-code': {
                fontSize: 14
              }
            }
          }
        }
      }),
      disabled: {
        '& .react-tel-input .form-control, & .react-tel-input .selected-flag:hover, .react-tel-input .selected-flag:focus':
          {
            background: palette[type].formControls.disabled.background
          }
      },
      fullHeight: {
        height: '100%',

        '& .react-tel-input, & .react-tel-input .form-control': {
          height: '100%'
        }
      },
      rightLabel: {
        display: 'flex',
        flexDirection: 'row-reverse',
        alignItems: 'center'
      },
      topLabel: {
        display: 'flex',
        flexDirection: 'column'
      },
      topLabelMargin: {
        marginTop: 10
      },
      leftLabel: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
      },
      bottomLabel: {
        display: 'flex',
        flexDirection: 'column-reverse'
      },
      rootMargin: {
        marginBottom: 16
      },
      errorField: {
        borderBottom: `1px solid ${colors.error} !important`
      },
      optionalErrorField: {
        borderBottom: `1px solid ${colors.optionalError} !important`
      },
      buttonContainerClassName: ({ isStartAdornment }) => ({
        backgroundColor: 'transparent !important',
        borderRight: 'none !important',
        borderRadius: '5px 0 0 5px !important',
        borderColor: 'transparent !important',
        left: isStartAdornment ? 33 : 0,
        '& .selected-flag': {
          padding: isStartAdornment ? '0px 8px !important' : 15
        }
      }),
      dropdownContainerClassName: {
        width: '210px !important',
        backgroundColor: `${palette[type].formControls.input.background} !important`,
        color: `${palette[type].formControls.input.color} !important`,
        fontSize: `${fontSize.primary}px !important`,
        '&::-webkit-scrollbar': {
          width: '5px'
        },
        '&::-webkit-scrollbar-thumb': {
          background: type === 'dark' ? '#BABABA50' : '#25252550',
          borderRadius: '5px'
        },
        '& li': {
          '& > span': {
            fontSize: `${fontSize.primary}px !important`
          },
          '&:hover,&.highlight': {
            backgroundColor: `${palette[type].formControls.select.border} !important`
          }
        }
      },
      error: {
        color: colors.error,
        fontSize: 10,
        position: 'absolute',
        bottom: -14,
        left: 5,
        height: '14px'
      },
      optionalError: {
        color: colors.highlight
      },
      formControlRoot: {
        backgroundColor: palette[type].formControls.input.background,
        borderRadius: '4px',
        width: '100%',
        '&:hover $startAdornmentIcon': {
          opacity: 1
        }
      },
      bootstrapFormLabel: {
        fontSize: fontSize.primary,
        lineHeight: lineHeight.primary,
        fontWeight: fontWeight.normal,
        color: palette[type].formControls.label.color,
        whiteSpace: 'pre',
        transform: 'none'
      },
      alignLabel: {
        alignSelf: 'flex-start'
      },
      topLabelFocused: {
        color: `${palette[type].formControls.label.activeColor} !important`
      },
      topInputLabel: {
        transform: 'translate(0px, 0px) scale(1)',
        transition: '0.3s left, 0.3s top, 0.3s transform',
        top: 8,
        left: 46
      },
      topInputStartIconLabel: {
        left: 78
      },
      topLabelShrink: {
        transform: 'translate(0px, 0px) scale(0.9)',
        top: -10,
        left: 17
      },
      bottomLabelMargin: {
        marginTop: '7px'
      },
      labelSmall: {
        fontSize: `${fontSize.small}px !important`
      },
      labelSmallest: {
        fontSize: `${fontSize.smallest}px !important`
      },
      bootstrapFormLabelFocus: {
        color: `${palette[type].formControls.label.color} !important`
      },
      notchedOutline: ({ isFocused, showError, readOnly }) => ({
        top: '-5px',
        left: 0,
        right: 0,
        bottom: 0,
        margin: 0,
        padding: '0 8px',
        overflow: 'hidden',
        position: 'absolute',
        opacity: readOnly ? '0.5' : 1,
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
      errorTextRoot: {
        marginLeft: 5
      },
      infoIcon: {
        ...typography.darkAccent[type],
        fontSize: 20,
        paddingLeft: 5,
        cursor: 'pointer',
        color: colors.highlight
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
      hideDropdown: ({ isStartAdornment }) => ({
        '& .react-tel-input': {
          '& .flag-dropdown': {
            display: 'none'
          },
          '& .form-control': {
            paddingLeft: `${15 + (isStartAdornment ? 21 : 0)}px !important`
          }
        }
      }),
      readOnly: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        zIndex: 1
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
      requiredBorder: {
        borderLeftColor: `${colors.error} !important`,
        borderLeftWidth: `3px !important`
      },
      errorIcon: {
        color: colors.error,
        cursor: 'pointer'
      }
    }
  }
)

const prefix = '+'

const FormControlTelInput = ({
  label,
  labelPosition,
  labelFontSizeVariant,
  customClass,
  marginBottom,
  name,
  value,
  isOptional,
  absoluteErrorText,
  error,
  touched,
  onBlur,
  onChange,
  disabled,
  fullHeight,
  errorTextClass,
  tooltip,
  tooltipType,
  tooltipHeader,
  hideDropdown,
  onDoubleClick,
  autoFocus,
  formControlContainerClass,
  readOnly,
  readOnlyWithoutSelection,
  startAdornment,
  startAdornmentIcon,
  endAdornment,
  endAdornmentIcon,
  isRequired,
  isBottomError
}) => {
  const {
    root: rootClass = '',
    container: containerClass = '',
    label: labelClass = '',
    input: inputClass = '',
    dropDown: dropDownClass = ''
  } = customClass
  const inputRef = useRef(null)
  const isStartAdornment = !!startAdornment || !!startAdornmentIcon
  const isEndAdornment = !!endAdornment || !!endAdornmentIcon
  const [phoneState, setPhoneState] = useState({
    country: 'us',
    dialCode: 1
  })
  const [isFocused, setFocused] = useState(false)

  useEffect(() => {
    if (inputRef?.current && autoFocus) {
      inputRef?.current?.numberInputRef?.focus()
    }
  }, [autoFocus])

  const showError = useMemo(() => {
    return !!(error && touched)
  }, [error, touched])

  const isErrorIcon = !isBottomError && showError

  const classes = useStyles({
    isFocused,
    shrink: !!value,
    showError: showError,
    readOnly: readOnly || readOnlyWithoutSelection,
    isEndAdornment,
    isStartAdornment,
    isErrorIcon
  })

  const handleBlur = useCallback(() => {
    onBlur({ target: { name } })
    setFocused(false)
  }, [name, onBlur])

  const handleFocus = useCallback(() => {
    setFocused(true)
  }, [])

  const handleChange = useCallback(
    (number, data, e) => {
      const eventValue =
        !value &&
        number &&
        !isValidPhoneNumber(`${prefix}${phoneState.dialCode}${number}`)
          ? `${prefix}${phoneState.dialCode}${number}`
          : e.target.value
      const phoneValue = number ? eventValue : !value ? prefix : ''

      if (data) {
        setPhoneState(data)
      }

      if (e.type === 'click') {
        onChange(simulateEvent(name, ''))
        if (inputRef.current) {
          inputRef.current.setState({ formattedNumber: '' })
        }
      } else {
        onChange(simulateEvent(name, phoneValue.replace(' ', '')))
      }
    },
    [name, value, onChange, inputRef, phoneState]
  )

  const isError = useMemo(() => error && touched, [error, touched])

  //remove initial '+1' if no value
  useEffect(() => {
    if (!value && inputRef.current?.state.formattedNumber) {
      inputRef.current.setState({ formattedNumber: '' })
    }
    // eslint-disable-next-line
  }, [inputRef])

  //prevent cursor jumping on number delete
  const autoFormat = useMemo(() => {
    if (!value) {
      return true
    }
    if (inputRef.current) {
      return (
        value.startsWith(
          `${prefix}${inputRef.current.state.selectedCountry.dialCode}`
        ) || value.length > 4
      )
    }
  }, [value, inputRef])

  const placeholder = useMemo(() => {
    const { dialCode = 1, countryCode } = phoneState || {}
    return `${prefix}${dialCode} ${getPlaceholderByCountryCode(countryCode)}`
  }, [phoneState])

  return (
    <div
      onClick={e => e.stopPropagation()}
      onMouseDown={e => e.stopPropagation()}
      className={classNames(
        classes.root,
        formControlContainerClass,
        rootClass,
        {
          [classes.leftLabel]: labelPosition === position.left,
          [classes.topLabel]: labelPosition === position.top,
          [classes.topLabelMargin]: labelPosition === position.top && label,
          [classes.bottomLabel]: labelPosition === position.bottom,
          [classes.rightLabel]: labelPosition === position.right,
          [classes.fullHeight]: fullHeight,
          [classes.rootMargin]: marginBottom,
          [classes.disabled]: disabled,
          [classes.hideDropdown]: hideDropdown
        }
      )}
      onDoubleClick={onDoubleClick}
    >
      <Grid
        container
        wrap="nowrap"
        className={classNames({
          [classes.fullHeight]: fullHeight
        })}
      >
        <FormControl
          className={classNames(classes.formControlRoot, {
            [classes.fullHeight]: fullHeight
          })}
        >
          {(readOnly || readOnlyWithoutSelection) && (
            <div className={classes.readOnly} />
          )}
          {label && (
            <Tooltip
              arrow
              title={tooltip || ''}
              disableHoverListener={
                !tooltip || tooltipType !== tooltipTypes.text
              }
              headerText={tooltipHeader}
              withHeader={!!tooltipHeader}
              placement="top"
            >
              <InputLabel
                shrink={isFocused || !!_isNotEmpty(value)}
                className={classNames(classes.bootstrapFormLabel, labelClass, {
                  [classes.alignLabel]:
                    labelPosition === position.top ||
                    labelPosition === position.bottom,
                  [classes.topInputLabel]: labelPosition === position.top,
                  [classes.topInputStartIconLabel]:
                    labelPosition === position.top && isStartAdornment,
                  [classes.bottomLabelMargin]:
                    labelPosition === position.bottom,
                  [classes.labelSmall]: labelFontSizeVariant === fontSize.small,
                  [classes.labelSmallest]:
                    labelFontSizeVariant === fontSize.smallest
                })}
                classes={{
                  focused: classNames({
                    [classes.bootstrapFormLabelFocus]:
                      labelPosition !== position.top,
                    [classes.topLabelFocused]: labelPosition === position.top
                  }),
                  shrink: classNames({
                    [classes.topLabelShrink]: labelPosition === position.top
                  }),
                  root: classNames({
                    [classes.labelLink]:
                      tooltip && tooltipType === tooltipTypes.text
                  })
                }}
                focused={isFocused}
              >
                {label} {isOptional && <i>({'optional'})</i>}
              </InputLabel>
            </Tooltip>
          )}
          <ReactPhoneInput
            ref={inputRef}
            value={value || ''}
            country={phoneState?.country}
            name={name}
            disabled={disabled}
            placeholder={isFocused ? placeholder : ''}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            countryCodeEditable
            jumpCursorToEnd
            autoFormat={autoFormat}
            alwaysDefaultMask
            defaultMask=".............."
            prefix={prefix}
            containerClass={classNames(containerClass)}
            inputClass={classNames(classes.inputClassName, inputClass, {
              [classes.errorField]: isError,
              [classes.optionalErrorField]: isError && isOptional
            })}
            buttonClass={classes.buttonContainerClassName}
            dropdownClass={classNames(
              classes.dropdownContainerClassName,
              dropDownClass
            )}
            autoFocus={autoFocus}
          />
          <fieldset
            aria-hidden="true"
            className={classNames(classes.notchedOutline, {
              [classes.requiredBorder]: isRequired
            })}
          >
            <legend className={classes.notchedOutlineLabel}>
              {label && (
                <span>
                  {label} {isOptional && <i>({'optional'})</i>}
                </span>
              )}
            </legend>
          </fieldset>
          {isStartAdornment && (
            <div className={classes.startAdornment}>
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
            <div className={classes.endAdornment}>
              {isEndAdornment &&
                (endAdornment || (
                  <i
                    className={classNames(
                      endAdornmentIcon,
                      classes.startAdornmentIcon,
                      {
                        [classes.startAdornmentIconActive]: isFocused || !!value
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
              rootClassName={classNames(classes.errorTextRoot, errorTextClass)}
            />
          )}
        </FormControl>
        {!!tooltip && tooltipType === tooltipTypes.icon && (
          <Tooltip
            title={tooltip}
            disableHoverListener={!tooltip || tooltipType !== tooltipTypes.icon}
            arrow
            placement="top"
            headerText={tooltipHeader}
            withHeader={!!tooltipHeader}
          >
            <i
              className={classNames(
                getIconClassName(iconNames.info),
                classes.infoIcon
              )}
            />
          </Tooltip>
        )}
      </Grid>
    </div>
  )
}

FormControlTelInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  isOptional: PropTypes.bool,
  absoluteErrorText: PropTypes.bool,
  error: PropTypes.string,
  touched: PropTypes.bool,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  labelPosition: PropTypes.inputFieldLabelPosition,
  labelFontSizeVariant: PropTypes.inputFieldFontSize,
  customClass: PropTypes.object,
  marginBottom: PropTypes.bool,
  fullHeight: PropTypes.bool,
  errorTextClass: PropTypes.className,
  tooltip: PropTypes.string,
  tooltipType: PropTypes.string,
  hideDropdown: PropTypes.bool,
  isRequired: PropTypes.bool,
  isBottomError: PropTypes.bool
}

FormControlTelInput.defaultProps = {
  labelPosition: position.top,
  isOptional: false,
  absoluteErrorText: true,
  onChange: f => f,
  onBlur: f => f,
  marginBottom: true,
  customClass: {},
  tooltip: '',
  tooltipType: tooltipTypes.text,
  hideDropdown: false,
  isRequired: false,
  isBottomError: false
}

export default FormControlTelInput
