import { useCallback, useMemo, useRef, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import { Calendar } from 'react-date-range'
import moment from 'moment'
import classNames from 'classnames'

import { MaterialPopup } from 'components/Popup'
import { materialPopupPosition, position } from 'constants/common'
import FormControlInput from '../FormControlInput'
import {
  NORMAL_DATE_TIME_AP_FORMAT,
  NORMAL_DATE_TIME_S_AP_FORMAT,
  TIME_S_FORMAT
} from 'constants/dateTimeFormats'
import { simulateEvent } from 'utils/formik'
import PropTypes from 'constants/propTypes'
import getStyles from './styles'
import TimePicker from './components/TimePicker'

import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'

const useStyles = makeStyles(({ palette, type, typography, colors }) => ({
  formControlRoot: {
    '&:hover $endAdornmentErrorIcon': {
      '& i': {
        color: colors.error
      }
    }
  },
  endAdornment: {
    height: 'calc(100% - 3px)',
    padding: 10,
    marginLeft: 4,
    display: 'grid',
    placeItems: 'center',
    marginRight: '-10px',
    background: palette[type].formControls.multipleDatesPicker.input.background,
    color: palette[type].formControls.multipleDatesPicker.input.color,
    borderLeft: `1px solid ${palette[type].formControls.multipleDatesPicker.input.border}`
  },
  clearIcon: {
    cursor: 'pointer',
    color: typography.lightAccent[type].color,
    marginTop: 3,

    '&:hover': {
      color: typography.darkAccent[type].color
    }
  },
  dateRangeRoot: localValues => ({
    ...getStyles({ palette, type }, localValues)
  }),
  endTimeRoot: {
    position: 'absolute',
    top: 70,
    right: 10,
    height: 'calc(100% - 70px) !important'
  },
  endAdornmentErrorIcon: {
    '& i': {
      height: 'calc(100% - 3px)',
      padding: '0px 15px',
      marginLeft: 4,
      display: 'grid',
      placeItems: 'center',
      marginRight: '-10px',
      background:
        palette[type].formControls.multipleDatesPicker.input.background,
      borderLeft: `1px solid ${palette[type].formControls.multipleDatesPicker.input.border}`,
      opacity: 1,
      color: 'rgba(248, 75, 106, 0.6)'
    }
  }
}))

const FormControlDateTimePicker = ({
  name,
  label,
  value,
  error,
  touched,
  formControlContainerClass,
  formControlRootClass,
  withPortal,
  marginBottom,
  fullWidth,
  onFocus,
  onBlur,
  onChange,
  maskValue: dateTimeFormat,
  minDate,
  maxDate,
  labelPosition,
  disabled,
  inputProps,
  hideIcon,
  isClearable,
  fullHeight,
  showSeconds,
  onDoubleClick,
  tooltip,
  tooltipHeader,
  tooltipType,
  isRequired,
  isBottomError,
  showErrorText
}) => {
  const classes = useStyles({
    fullWidth,
    showSeconds
  })
  const inputRef = useRef()
  const [isFocusedInput, setFocusedInput] = useState(false)

  const showError = useMemo(() => {
    return !!(showErrorText && error && touched)
  }, [showErrorText, error, touched])

  const isErrorIcon = !isBottomError && showError

  const maskValue = useMemo(
    () =>
      dateTimeFormat ||
      (showSeconds ? NORMAL_DATE_TIME_S_AP_FORMAT : NORMAL_DATE_TIME_AP_FORMAT),
    [showSeconds, dateTimeFormat]
  )

  const handleChange = useCallback(
    date => {
      onChange(simulateEvent(name, moment(date).format(maskValue)))
    },
    [onChange, maskValue, name]
  )

  const handleFocus = useCallback(
    event => {
      setFocusedInput(true)

      onFocus(event)
    },
    [onFocus]
  )

  const handleBlur = useCallback(
    event => {
      setFocusedInput(false)

      onBlur(event)
    },
    [onBlur]
  )

  const handleClearDate = useCallback(
    event => {
      event.stopPropagation()
      onChange(simulateEvent(name, null))
    },
    [onChange, name]
  )

  const handleChangeTime = useCallback(
    t => {
      const time = moment(t, TIME_S_FORMAT)
      onChange(
        simulateEvent(
          name,
          (value ? moment(value, maskValue) : moment())
            .set({
              hour: time.get('hour'),
              minute: time.get('minute'),
              second: time.get('second')
            })
            .format(maskValue)
        )
      )
    },
    [onChange, name, value, maskValue]
  )

  const handleCalendarClick = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  const handleClose = useCallback(() => {
    if (!isFocusedInput) {
      onBlur(simulateEvent(name, value))
    }
  }, [onBlur, value, name, isFocusedInput])

  return (
    <MaterialPopup
      open={isFocusedInput === true ? true : undefined}
      on="click"
      placement={materialPopupPosition.bottomCenter}
      onClose={handleClose}
      trigger={
        <FormControlInput
          labelPosition={labelPosition}
          inputRef={inputRef}
          label={label}
          endAdornment={
            (isClearable && value) || (!hideIcon && !isErrorIcon) ? (
              <>
                {isClearable && value ? (
                  <i
                    className={classNames(
                      getIconClassName(iconNames.clear),
                      classes.clearIcon
                    )}
                    onClick={handleClearDate}
                  />
                ) : null}
                {hideIcon || isErrorIcon ? null : (
                  <div
                    className={classes.endAdornment}
                    onClick={handleCalendarClick}
                  >
                    <i className={getIconClassName(iconNames.date)} />
                  </div>
                )}
              </>
            ) : null
          }
          name={name}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          fullWidth={fullWidth}
          error={error}
          touched={touched}
          marginBottom={marginBottom}
          disabled={disabled}
          formControlContainerClass={formControlContainerClass}
          formControlRootClass={classNames(
            classes.formControlRoot,
            formControlRootClass
          )}
          readOnly
          fullHeight={fullHeight}
          onDoubleClick={onDoubleClick}
          tooltip={tooltip}
          tooltipHeader={tooltipHeader}
          tooltipType={tooltipType}
          isRequired={isRequired}
          isBottomError={isBottomError}
          showErrorText={showErrorText}
          endAdornmentRootClass={isErrorIcon && classes.endAdornmentErrorIcon}
          {...inputProps}
        />
      }
      preventOverflow={
        withPortal
          ? {
              enabled: true,
              boundariesElement: 'viewport'
            }
          : {}
      }
      disabled={disabled}
    >
      <>
        <Calendar
          className={classes.dateRangeRoot}
          onChange={handleChange}
          date={value ? moment(value, maskValue).toDate() : null}
          minDate={minDate && moment(minDate, maskValue).toDate()}
          maxDate={maxDate && moment(maxDate, maskValue).toDate()}
        />
        <TimePicker
          rootClassName={classes.endTimeRoot}
          maskValue={TIME_S_FORMAT}
          value={moment(value, maskValue).format(TIME_S_FORMAT)}
          onChange={handleChangeTime}
          showSeconds={showSeconds}
        />
      </>
    </MaterialPopup>
  )
}

FormControlDateTimePicker.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.string,
  error: PropTypes.string,
  touched: PropTypes.bool,
  formControlContainerClass: PropTypes.className,
  withPortal: PropTypes.bool,
  marginBottom: PropTypes.bool,
  fullWidth: PropTypes.bool,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  maskValue: PropTypes.string,
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
  labelPosition: PropTypes.inputFieldLabelPosition,
  disabled: PropTypes.bool,
  inputProps: PropTypes.object,
  hideIcon: PropTypes.bool,
  isClearable: PropTypes.bool,
  fullHeight: PropTypes.bool
}

FormControlDateTimePicker.defaultProps = {
  withPortal: false,
  marginBottom: true,
  fullWidth: false,
  onFocus: f => f,
  onBlur: f => f,
  minDate: moment().format(NORMAL_DATE_TIME_S_AP_FORMAT),
  labelPosition: position.top,
  disabled: false,
  inputProps: {},
  hideIcon: false,
  isClearable: false,
  fullHeight: false,
  showErrorText: true
}

export default FormControlDateTimePicker
