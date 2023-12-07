import React, {
  useCallback,
  useMemo,
  useState,
  useEffect,
  memo,
  useRef
} from 'react'
import Creatable from 'react-select/creatable'
import ReactSelect from 'react-select'
import classNames from 'classnames'
import { FormControl, Grid, InputLabel, withStyles } from '@material-ui/core'

import { _isEmpty, _isFunction, _isNotEmpty } from 'utils/lodash'
import Tooltip from 'components/Tooltip'
import PropTypes from 'constants/propTypes'
import { simulateEvent } from 'utils/formik'
import sorting from 'utils/sorting'
import { fontSize, position, tooltipTypes } from 'constants/common'
import { ErrorText } from 'components/typography'
import { getStyles } from './styles'
import SingleValue from './SingleValue'
import IconOption from './IconOption'
import SingleIconValue from './SingleIconValue'
import SelectControl from './SelectControl'
import { getIconClassName } from 'utils/iconUtils'
import iconNames, { iconTypes } from 'constants/iconNames'
import MultiValueLabelDoubling from './MultiValueLabelDoubling'
import OptionDoubling from './OptionDoubling'

const styles = ({
  palette,
  colors,
  type,
  fontSize,
  lineHeight,
  fontWeight,
  typography
}) => ({
  root: {
    position: 'relative',
    width: '200px',
    '&:hover $startAdornmentIcon': {
      opacity: 1
    },
    '&:hover .react-select__dropdown-indicator': {
      opacity: 1,
      visibility: 'visible'
    }
  },
  fullHeight: {
    height: '100%'
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
    top: 6,
    left: 15
  },
  topInputStartIconLabel: {
    left: 37
  },
  topLabelShrink: {
    transform: 'translate(0px, 0px) scale(0.9)',
    top: -10,
    left: 17
  },
  bottomLabelMargin: {
    marginTop: '7px'
  },
  copyBtn: {
    position: 'absolute',
    right: '55px',
    bottom: '8px',
    cursor: 'pointer',
    color: '#afb7c7'
  },
  copyBtnRightOffset: {
    right: '35px'
  },
  copyBtnFocused: {
    color: 'rgb(95,95,95)'
  },
  copyBtnHoveredWithFocus: {
    '&:hover': {
      color: 'rgb(65,65,65)'
    },
    '&:active': {
      color: 'rgb(21,21,21)'
    }
  },
  copyBtnHoveredWithoutFocus: {
    '&:hover': {
      color: 'rgb(153, 153, 153)'
    },
    '&:active': {
      color: 'rgb(89,89,89)'
    }
  },
  bootstrapFormLabelFocus: {
    color: `${palette[type].formControls.label.color} !important`
  },
  labelLink: {
    display: 'unset',
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
  label: {},
  labelSmall: {
    fontSize: `${fontSize.small}px !important`
  },
  labelSmallest: {
    fontSize: `${fontSize.smallest}px !important`
  },
  errorTextRoot: {
    marginLeft: 5
  },
  formControlRoot: {
    width: '100%',
    position: 'relative',
    backgroundColor: palette[type].formControls.input.background
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
    cursor: 'pointer',
    color: colors.highlight
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
  fullWidth: {
    width: '100%'
  },
  readOnlyWithoutSelection: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    zIndex: 1
  },
  errorIcon: {
    color: colors.error,
    cursor: 'pointer'
  }
})

const SelectComponent = ({
  isCreatable,
  childRef,
  createOptionLabelText,
  ...props
}) => {
  return isCreatable ? (
    <Creatable
      {...props}
      ref={childRef}
      allowCreateWhileLoading
      createOptionPosition="first"
      formatCreateLabel={value => (
        <span style={{ fontSize: '13px' }}>
          {createOptionLabelText
            ? createOptionLabelText(value)
            : `Search for "${value}"`}
        </span>
      )}
    />
  ) : (
    <ReactSelect ref={childRef} {...props} />
  )
}

const FormControlChips = ({
  classes,
  label,
  isOptional,
  marginBottom,
  theme,
  options = [],
  name,
  noOptionsMessage,
  placeholder,
  values,
  onChange,
  isSearchable,
  isLoading,
  customClass,
  isMulti,
  disabled,
  formControlLabelClass,
  formControlContainerClass,
  formControlRootClass,
  onInputChange,
  error,
  touched,
  fontSizeVariant,
  labelFontSizeVariant,
  tooltip,
  tooltipType,
  tooltipHeader,
  onMenuScrollToBottom,
  onBlur,
  isClearable,
  components,
  formatOptionLabel,
  styles,
  createdValue,
  createNewValue,
  clearCreatedValue,
  hasDynamicChipsCreation,
  isCreatable,
  returnValues = false,
  withPortal = false,
  onFocus,
  isSort = true,
  labelPosition,
  isOptionDisabled,
  filterOption,
  readOnly,
  readOnlyWithoutSelection,
  removeValueOnBlur,
  menuPosition = 'absolute',
  menuPlacement = 'auto',
  withIcons = false,
  menuIsOpen: menuOpen,
  isInputEditable = false,
  isReactSelectCreatable = false,
  menuWidth,
  onMenuClose,
  absoluteErrorText,
  errorTextClass,
  fullHeight,
  fixedHeight,
  onDoubleClick,
  autoFocus,
  startAdornment,
  startAdornmentIcon,
  endAdornment,
  endAdornmentIcon,
  fullWidth,
  createOptionLabelText,
  showValueOnDoubleClick,
  hideErrorText,
  isRequired,
  isBottomError,
  isGroupedSelect,
  groupedOptions
}) => {
  const isStartAdornment = !!startAdornment || !!startAdornmentIcon
  const isEndAdornment = !!endAdornment || !!endAdornmentIcon
  const [inputValue, setInputValue] = useState('')
  const [valueToCreate, setValueToCreate] = useState(null)
  const [isFocused, setFocused] = useState(false)

  let inputRef = useRef(null)

  const showError = useMemo(() => {
    return !!(error && touched)
  }, [error, touched])

  const isErrorIcon = !isBottomError && showError

  const customStyles = useMemo(
    () =>
      getStyles(
        theme,
        isMulti,
        styles,
        fontSizeVariant,
        menuWidth,
        fullHeight,
        fixedHeight,
        isStartAdornment,
        isEndAdornment,
        isErrorIcon
      ),
    [
      isMulti,
      theme,
      styles,
      fontSizeVariant,
      menuWidth,
      fullHeight,
      fixedHeight,
      isStartAdornment,
      isEndAdornment,
      isErrorIcon
    ]
  )

  useEffect(() => {
    if (autoFocus && !disabled && !readOnlyWithoutSelection) {
      const input = inputRef?.current
      if (input) {
        input.focus()
      }
    }
    //eslint-disable-next-line
  }, [autoFocus])

  const computedValue = useMemo(() => {
    if (
      typeof values === 'number' ||
      typeof values === 'boolean' ||
      (typeof values === 'string' && values.length > 0)
    ) {
      return (
        options.find(searchValue => searchValue.value === values) || {
          value: values,
          label: values,
          alias: values,
          __isNew__: true
        } ||
        []
      )
    }

    if (Array.isArray(values) && returnValues) {
      return options.filter(option => values.includes(option.value))
    }

    if (values?.value) {
      const selectedValue = options.find(
        option => option.value === values.value
      )
      if (selectedValue) return selectedValue
    }

    if (isReactSelectCreatable && !values && !!inputValue) {
      return {
        value: inputValue,
        label: inputValue
      }
    }

    return values
  }, [values, returnValues, isReactSelectCreatable, inputValue, options])

  const allowCreateValue = useMemo(
    () => hasDynamicChipsCreation && _isFunction(createNewValue),
    [hasDynamicChipsCreation, createNewValue]
  )

  const onChangeHandler = useCallback(
    newValue => {
      if (!readOnly) {
        if (isMulti) {
          onChange({ target: { name, value: newValue || [], ...newValue } })
        } else {
          if (newValue && newValue.__isNew__) {
            onChange({
              target: { name, ...newValue, alias: newValue.value }
            })
          } else if (!newValue) {
            onChange({
              target: { name, value: newValue }
            })
          } else {
            onChange({
              target: { name, ...newValue }
            })
          }
        }
      }
    },
    [onChange, isMulti, name, readOnly]
  )

  const onBlurHandler = useCallback(
    event => {
      if (isReactSelectCreatable && !!event.target.value) {
        onChange(simulateEvent(name, event.target.value))
      } else {
        onBlur(
          simulateEvent(name, removeValueOnBlur ? null : event.target.value)
        )
        isInputEditable && !isMulti && setInputValue('')
      }
      setFocused(false)
    },
    [
      onBlur,
      onChange,
      name,
      removeValueOnBlur,
      isInputEditable,
      isMulti,
      isReactSelectCreatable
    ]
  )

  const onInputChangeHandler = useCallback(
    (value, data) => {
      if (isInputEditable && !isMulti) {
        if (data.action === 'set-value') {
          inputRef.current?.select?.blur()
          setInputValue(value)
        } else if (!['input-blur', 'menu-close'].includes(data.action)) {
          setInputValue(value)
        }
        onInputChange(value, data)
      } else {
        setInputValue(value)

        onInputChange(value, data)
      }
    },
    [onInputChange, isInputEditable, isMulti]
  )

  const onKeyDownHandler = useCallback(
    e => {
      if (allowCreateValue && e.key === 'Enter' && isMulti) {
        if (
          (_isEmpty(inputValue) && _isEmpty(options)) ||
          values.find(({ label }) => label === inputValue)
        ) {
          e.preventDefault()
        } else {
          const item = options
            .filter(opt => !values.find(({ label }) => label === opt.label))
            .find(({ label }) =>
              label.toLowerCase().includes(inputValue.toLowerCase())
            )
          if (!item && !valueToCreate) {
            e.preventDefault()
            setValueToCreate(inputValue)
            createNewValue(inputValue)
          }
        }
      } else if (allowCreateValue && e.key === 'Enter') {
        const item = options.some(
          ({ label }) =>
            label.trim().toLowerCase() === inputValue.trim().toLowerCase()
        )
        if (!item) {
          e.preventDefault()
          setValueToCreate(inputValue)
          createNewValue(inputValue)
        }
      }
    },
    [
      createNewValue,
      inputValue,
      isMulti,
      options,
      values,
      valueToCreate,
      allowCreateValue
    ]
  )

  const noOptionsMessageHandler = useCallback(() => {
    // Displays current input as no-options-message for create-schedule page time pickers
    if (valueToCreate && allowCreateValue) {
      return 'Loading...'
    }
    if (typeof noOptionsMessage === 'function') {
      return noOptionsMessage(inputValue)
    }
    if (error) return null
    return noOptionsMessage || 'No Options'
  }, [inputValue, noOptionsMessage, valueToCreate, error, allowCreateValue])

  useEffect(() => {
    const { data, error } = createdValue
    if (data && data.label === valueToCreate) {
      onChange({
        target: {
          name,
          value: [...values, data]
        }
      })
      setInputValue('')
      setValueToCreate(null)
      clearCreatedValue()
    } else if (error) {
      setValueToCreate(null)
      clearCreatedValue()
    }
    // eslint-disable-next-line
  }, [createdValue])

  const menuIsOpen = useMemo(
    () =>
      readOnly === true || readOnlyWithoutSelection === true ? false : menuOpen,
    [readOnly, readOnlyWithoutSelection, menuOpen]
  )

  const editableFilterOption = useCallback(
    (option, searchText) => {
      if (searchText === computedValue.label) {
        return true
      }
      return (
        String(option.value).toLowerCase().includes(searchText.toLowerCase()) ||
        (typeof option.label === 'string' &&
          option.label.toLowerCase().includes(searchText.toLowerCase()))
      )
    },
    [computedValue]
  )

  const handleFocus = useCallback(
    e => {
      if (!isMulti && isInputEditable) {
        setInputValue(computedValue.label)
      }
      setFocused(true)
      onFocus(e)
    },
    [onFocus, isInputEditable, isMulti, computedValue]
  )

  const parsedOptions = useMemo(() => {
    if (isGroupedSelect) {
      let _otherOptions = [...options]
      const _groupedOptions = groupedOptions.map(({ label, value }) => {
        const _options = []
        _otherOptions = _otherOptions.filter(({ group, ...option }) => {
          if (group === value) {
            _options.push(option)
          }
          return group !== value
        })
        return {
          label,
          value,
          options: isSort ? sorting(_options, 'label') : _options
        }
      })
      if (!!_otherOptions.length) {
        _otherOptions.push({
          label: 'Others',
          value: 'other',
          options: _otherOptions
        })
      }

      return _groupedOptions
    }
    return isSort ? sorting(options, 'label') : options
  }, [isGroupedSelect, isSort, options, groupedOptions])

  return (
    <div
      onClick={e => e.stopPropagation()}
      onMouseDown={e => e.stopPropagation()}
      style={{ marginBottom }}
      className={classNames(classes.root, formControlContainerClass, {
        [classes.leftLabel]: labelPosition === position.left,
        [classes.topLabel]: labelPosition === position.top,
        [classes.topLabelMargin]: labelPosition === position.top && label,
        [classes.bottomLabel]: labelPosition === position.bottom,
        [classes.rightLabel]: labelPosition === position.right,
        [classes.fullHeight]: fullHeight,
        [classes.fullWidth]: fullWidth
      })}
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
          className={classNames(classes.formControlRoot, formControlRootClass, {
            [classes.fullHeight]: fullHeight,
            [classes.disabledFormControl]: disabled
          })}
          disabled={disabled}
        >
          {readOnlyWithoutSelection && (
            <div className={classes.readOnlyWithoutSelection} />
          )}
          {label && (
            <Tooltip
              arrow
              withHeader={!!tooltipHeader}
              headerText={tooltipHeader}
              title={tooltip}
              disableHoverListener={
                !tooltip || tooltipType !== tooltipTypes.text
              }
              placement="top"
            >
              <InputLabel
                shrink={isFocused || !!_isNotEmpty(computedValue)}
                className={classNames(
                  classes.bootstrapFormLabel,
                  formControlLabelClass,
                  {
                    [classes.alignLabel]:
                      labelPosition === position.top ||
                      labelPosition === position.bottom,
                    [classes.topInputLabel]: labelPosition === position.top,
                    [classes.topInputStartIconLabel]:
                      labelPosition === position.top && isStartAdornment,
                    [classes.bottomLabelMargin]:
                      labelPosition === position.bottom,
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
                  root:
                    tooltip && tooltipType === tooltipTypes.text
                      ? classes.labelLink
                      : classes.label,
                  shrink: classNames({
                    [classes.topLabelShrink]: labelPosition === position.top
                  })
                }}
                focused={isFocused}
              >
                {label} {isOptional && <i>({'optional'})</i>}
              </InputLabel>
            </Tooltip>
          )}

          <SelectComponent
            label={`${label}${isOptional ? ' (optional)' : ''}`}
            isCreatable={isCreatable}
            childRef={inputRef}
            styles={customStyles}
            isSearchable={
              isSearchable && !readOnly && !readOnlyWithoutSelection
            }
            isLoading={isLoading}
            isClearable={isClearable && !readOnly && !readOnlyWithoutSelection}
            className={customClass}
            classNamePrefix="react-select"
            noOptionsMessage={noOptionsMessageHandler}
            placeholder={placeholder}
            isMulti={isMulti}
            options={parsedOptions}
            formatOptionLabel={formatOptionLabel}
            backspaceRemovesValue={false}
            readOnlyWithoutSelection={readOnlyWithoutSelection}
            createOptionLabelText={createOptionLabelText}
            components={{
              IndicatorSeparator: null,
              SingleValue: withIcons ? SingleIconValue : SingleValue,
              Control: SelectControl,
              ...(withIcons ? { Option: IconOption } : {}),
              ...(showValueOnDoubleClick
                ? {
                    MultiValueLabel: MultiValueLabelDoubling,
                    Option: OptionDoubling
                  }
                : {}),
              ...components
            }}
            onMenuScrollToBottom={onMenuScrollToBottom}
            value={computedValue}
            onChange={onChangeHandler}
            onBlur={onBlurHandler}
            menuPlacement={menuPlacement}
            menuShouldScrollIntoView={false}
            inputValue={inputValue}
            onInputChange={onInputChangeHandler}
            onKeyDown={onKeyDownHandler}
            isDisabled={disabled}
            menuPortalTarget={withPortal ? document.body : undefined}
            filterOption={
              (isInputEditable && !isMulti && editableFilterOption) ||
              filterOption
            }
            {...(isOptionDisabled && { isOptionDisabled })}
            menuIsOpen={menuIsOpen}
            menuPosition={menuPosition}
            onFocus={handleFocus}
            showError={showError}
            {...(onMenuClose && { onMenuClose })}
            autoFocus={autoFocus}
            isRequired={isRequired}
          />
          {isStartAdornment && (
            <div className={classes.startAdornment}>
              {startAdornment || (
                <i
                  className={classNames(
                    startAdornmentIcon,
                    classes.startAdornmentIcon,
                    {
                      [classes.startAdornmentIconActive]:
                        isFocused || !!computedValue
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
                        [classes.startAdornmentIconActive]:
                          isFocused || !!computedValue
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
                      classes.errorIcon
                    )}
                  />
                </Tooltip>
              )}
            </div>
          )}
          {!hideErrorText && isBottomError && (
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
            withHeader={!!tooltipHeader}
            headerText={tooltipHeader}
            placement="top"
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

FormControlChips.propTypes = {
  classes: PropTypes.object,
  isMulti: PropTypes.bool,
  label: PropTypes.string,
  isOptional: PropTypes.bool,
  marginBottom: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  options: PropTypes.array,
  noOptionsMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  placeholder: PropTypes.string,
  values: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.number,
    PropTypes.string,
    PropTypes.bool
  ]),
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  onInputChange: PropTypes.func,
  fontSizeVariant: PropTypes.inputFieldFontSize,
  labelFontSizeVariant: PropTypes.inputFieldFontSize,
  error: PropTypes.string,
  isSearchable: PropTypes.bool,
  touched: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
    PropTypes.array
  ]),
  isSort: PropTypes.bool,
  onMenuScrollToBottom: PropTypes.func,
  onBlur: PropTypes.func,
  isClearable: PropTypes.bool,
  components: PropTypes.object,
  styles: PropTypes.object,
  createdValue: PropTypes.object,
  clearCreatedValue: PropTypes.func,
  hasDynamicChipsCreation: PropTypes.bool,
  labelPosition: PropTypes.string,
  isOptionDisabled: PropTypes.func,
  tooltip: PropTypes.string,
  tooltipHeader: PropTypes.string,
  filterOption: PropTypes.func,
  removeValueOnBlur: PropTypes.bool,
  absoluteErrorText: PropTypes.bool,
  errorTextClass: PropTypes.className,
  name: PropTypes.string,
  isLoading: PropTypes.bool,
  customClass: PropTypes.className,
  formControlLabelClass: PropTypes.className,
  formControlContainerClass: PropTypes.className,
  createNewValue: PropTypes.func,
  isCreatable: PropTypes.bool,
  returnValues: PropTypes.bool,
  withPortal: PropTypes.bool,
  onFocus: PropTypes.func,
  readOnly: PropTypes.bool,
  menuPosition: PropTypes.string,
  menuPlacement: PropTypes.string,
  withIcons: PropTypes.bool,
  menuIsOpen: PropTypes.bool,
  isInputEditable: PropTypes.bool,
  isReactSelectCreatable: PropTypes.bool,
  menuWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onMenuClose: PropTypes.func,
  fixedHeight: PropTypes.bool,
  tooltipType: PropTypes.string,
  formControlRootClass: PropTypes.className,
  showValueOnDoubleClick: PropTypes.bool,
  isRequired: PropTypes.bool,
  isBottomError: PropTypes.bool,
  isGroupedSelect: PropTypes.bool,
  groupedOptions: PropTypes.array
}

FormControlChips.defaultProps = {
  label: '',
  isOptional: false,
  marginBottom: 16,
  options: [],
  name: 'tag',
  placeholder: '',
  values: [],
  onChange: f => f,
  isSearchable: true,
  labelPosition: position.top,
  isLoading: false,
  customClass: '',
  isMulti: true,
  disabled: false,
  formControlLabelClass: '',
  formControlContainerClass: '',
  onInputChange: f => f,
  fontSizeVariant: 'primary',
  labelFontSizeVariant: 'primary',
  error: '',
  touched: false,
  onMenuScrollToBottom: f => f,
  onBlur: f => f,
  isClearable: false,
  components: {},
  styles: {},
  createdValue: {},
  createNewValue: null,
  clearCreatedValue: f => f,
  hasDynamicChipsCreation: true,
  onFocus: f => f,
  tooltip: '',
  tooltipHeader: '',
  removeValueOnBlur: true,
  absoluteErrorText: true,
  fixedHeight: false,
  tooltipType: tooltipTypes.text,
  showValueOnDoubleClick: false,
  isRequired: false,
  isBottomError: false,
  isGroupedSelect: false,
  groupedOptions: []
}

export default withStyles(styles, { withTheme: true })(memo(FormControlChips))
