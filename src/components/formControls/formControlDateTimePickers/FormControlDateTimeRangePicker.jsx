import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'
import { DateRange } from 'react-date-range'
import moment from 'moment'

import { MaterialPopup } from 'components/Popup'
import { materialPopupPosition, position } from 'constants/common'
import FormControlInput from '../FormControlInput'
import Container from 'components/containers/Container'
import {
  NORMAL_DATE_TIME_AP_FORMAT,
  NORMAL_DATE_TIME_S_AP_FORMAT,
  TIME_S_FORMAT
} from 'constants/dateTimeFormats'
import { simulateEvent } from 'utils/formik'
import getStyles from './styles'
import PropTypes from 'constants/propTypes'
import TimePicker from './components/TimePicker'

import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'

const useStyles = makeStyles(({ palette, type, spacing, colors }) => ({
  formControlRoot: {
    '&:hover $endAdornmentErrorIcon': {
      '& i': {
        color: colors.error
      }
    }
  },
  container: ({ fullWidth }) => ({
    alignItems: 'flex-end',
    width: fullWidth ? '100%' : 'auto'
  }),
  noSeparate: {
    gap: '0px'
  },
  marginBottom: {
    marginBottom: spacing(2)
  },
  endAdornment: {
    height: 'calc(100% - 3px)',
    padding: 10,
    display: 'grid',
    placeItems: 'center',
    marginRight: '-10px',
    background: palette[type].formControls.multipleDatesPicker.input.background,
    color: palette[type].formControls.multipleDatesPicker.input.color,
    borderLeft: `1px solid ${palette[type].formControls.multipleDatesPicker.input.border}`
  },
  dateRangeRoot: localValues => ({
    ...getStyles({ palette, type }, localValues)
  }),
  startTimeRoot: {
    position: 'absolute',
    top: 70,
    left: 335,
    height: 'calc(100% - 70px) !important'
  },
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

const FormControlDateTimeRangePicker = ({
  startDateTimeName,
  endDateTimeName,
  startDateTimeLabel,
  endDateTimeLabel,
  values,
  errors,
  touched,
  separateFields,
  formControlContainerClass,
  isSingleField,
  withPortal,
  marginBottom,
  fullWidth,
  onFocus,
  onBlur,
  onChange,
  maskValue: dateTimeFormat,
  separatorText,
  minDate,
  maxDate,
  labelPosition,
  disabled,
  inputProps,
  showSeconds,
  onDoubleClick,
  onBlurAll,
  autoFocus,
  tooltip,
  tooltipType,
  tooltipHeader,
  isRequired,
  isBottomError,
  showErrorText
}) => {
  const classes = useStyles({
    fullWidth,
    showSeconds
  })
  const [focusedInputs, setFocusedInputs] = useState({
    [startDateTimeName]: false,
    ...(isSingleField ? {} : { [endDateTimeName]: false })
  })
  const [localValues, setLocalValues] = useState([])
  const inputRef = useRef()

  const maskValue = useMemo(
    () =>
      dateTimeFormat ||
      (showSeconds ? NORMAL_DATE_TIME_S_AP_FORMAT : NORMAL_DATE_TIME_AP_FORMAT),
    [showSeconds, dateTimeFormat]
  )

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.click()
    }
  }, [autoFocus])

  useEffect(() => {
    setLocalValues([
      {
        startDate: values[startDateTimeName]
          ? moment(values[startDateTimeName], maskValue).toDate()
          : new Date(),
        endDate: values[endDateTimeName]
          ? moment(values[endDateTimeName], maskValue).toDate()
          : new Date(),
        key: 'selection'
      }
    ])
    // eslint-disable-next-line
  }, [values])

  const handleChange = useCallback(
    ({ selection }) => {
      onChange(
        simulateEvent(
          startDateTimeName,
          moment(selection.startDate)
            .set({ hour: 0, minute: 0, second: 0 })
            .format(maskValue)
        )
      )
      onChange(
        simulateEvent(
          endDateTimeName,
          moment(selection.endDate)
            .set({ hour: 23, minute: 59, second: 59 })
            .format(maskValue)
        )
      )
    },
    [onChange, maskValue, startDateTimeName, endDateTimeName]
  )

  const handleChangeTime = useCallback(
    (t, name) => {
      const time = moment(t, TIME_S_FORMAT)
      onChange(
        simulateEvent(
          name,
          (values[name] ? moment(values[name], maskValue) : moment())
            .set({
              hour: time.get('hour'),
              minute: time.get('minute'),
              second: time.get('second')
            })
            .format(maskValue)
        )
      )
    },
    [onChange, values, maskValue]
  )

  const handleChangeStartTime = useCallback(
    time => {
      handleChangeTime(time, startDateTimeName)
    },
    [startDateTimeName, handleChangeTime]
  )

  const handleChangeEndTime = useCallback(
    time => {
      handleChangeTime(time, endDateTimeName)
    },
    [endDateTimeName, handleChangeTime]
  )

  const handleFocus = useCallback(
    event => {
      const {
        target: { name }
      } = event
      setFocusedInputs(f => ({
        ...f,
        [name]: true
      }))

      onFocus(event)
    },
    [onFocus]
  )

  const handleBlur = useCallback(
    event => {
      const {
        target: { name }
      } = event
      setFocusedInputs(f => ({
        ...f,
        [name]: false
      }))

      onBlur(event)
    },
    [onBlur]
  )

  const parseStartDateValue = useMemo(
    () =>
      isSingleField
        ? [values[startDateTimeName], values[endDateTimeName]].join(
            ` ${separatorText} `
          )
        : values[startDateTimeName],
    [values, startDateTimeName, endDateTimeName, isSingleField, separatorText]
  )

  const handleClose = useCallback(() => {
    if (!Object.values(focusedInputs).some(b => b === true)) {
      onBlurAll(values)
    }
  }, [onBlurAll, focusedInputs, values])

  const isErrorIcon = name =>
    !isBottomError && showErrorText && !!errors[name] && touched[name]

  return (
    <MaterialPopup
      open={
        Object.values(focusedInputs).some(b => b === true) === true
          ? true
          : undefined
      }
      on="click"
      placement={materialPopupPosition.bottomCenter}
      onClose={handleClose}
      trigger={
        <Container
          rootClassName={classNames(
            classes.container,
            formControlContainerClass,
            {
              [classes.noSeparate]: !separateFields,
              [classes.marginBottom]: marginBottom
            }
          )}
          cols={isSingleField ? 1 : 2}
        >
          <>
            <FormControlInput
              labelPosition={labelPosition}
              label={startDateTimeLabel}
              endAdornment={
                isErrorIcon(startDateTimeName) ? null : (
                  <div className={classes.endAdornment}>
                    <i className={getIconClassName(iconNames.date)} />
                  </div>
                )
              }
              name={startDateTimeName}
              value={parseStartDateValue}
              onFocus={handleFocus}
              onBlur={handleBlur}
              fullWidth={fullWidth}
              error={errors[startDateTimeName]}
              touched={touched[startDateTimeName]}
              marginBottom={false}
              disabled={disabled}
              readOnly
              onDoubleClick={onDoubleClick}
              inputRef={inputRef}
              tooltip={tooltip}
              tooltipType={tooltipType}
              tooltipHeader={tooltipHeader}
              isRequired={isRequired}
              formControlRootClass={classNames(
                classes.formControlRoot,
                inputProps.formControlRootClass
              )}
              showErrorText={showErrorText}
              isBottomError={isBottomError}
              endAdornmentRootClass={
                isErrorIcon(startDateTimeName) && classes.endAdornmentErrorIcon
              }
              {...inputProps}
            />
            {!isSingleField && (
              <FormControlInput
                labelPosition={labelPosition}
                label={endDateTimeLabel}
                endAdornment={
                  isErrorIcon(endDateTimeName) ? null : (
                    <div className={classes.endAdornment}>
                      <i className={getIconClassName(iconNames.date)} />
                    </div>
                  )
                }
                name={endDateTimeName}
                value={values[endDateTimeName]}
                onFocus={handleFocus}
                onBlur={handleBlur}
                fullWidth={fullWidth}
                error={errors[endDateTimeName]}
                touched={touched[endDateTimeName]}
                marginBottom={false}
                disabled={disabled}
                readOnly
                onDoubleClick={onDoubleClick}
                tooltip={tooltip}
                tooltipType={tooltipType}
                tooltipHeader={tooltipHeader}
                isRequired={isRequired}
                formControlRootClass={classNames(
                  classes.formControlRoot,
                  inputProps.formControlRootClass
                )}
                showErrorText={showErrorText}
                isBottomError={isBottomError}
                endAdornmentRootClass={
                  isErrorIcon(endDateTimeName) && classes.endAdornmentErrorIcon
                }
                {...inputProps}
              />
            )}
          </>
        </Container>
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
      <DateRange
        className={classes.dateRangeRoot}
        onChange={handleChange}
        showSelectionPreview={true}
        moveRangeOnFirstSelection={false}
        months={2}
        ranges={localValues}
        direction="horizontal"
        showDateDisplay={false}
        minDate={minDate && moment(minDate, maskValue).toDate()}
        maxDate={maxDate && moment(maxDate, maskValue).toDate()}
      />
      <TimePicker
        rootClassName={classes.startTimeRoot}
        maskValue={TIME_S_FORMAT}
        value={moment(values[startDateTimeName], maskValue).format(
          TIME_S_FORMAT
        )}
        onChange={handleChangeStartTime}
        showSeconds={showSeconds}
      />
      <TimePicker
        rootClassName={classes.endTimeRoot}
        maskValue={TIME_S_FORMAT}
        value={moment(values[endDateTimeName], maskValue).format(TIME_S_FORMAT)}
        onChange={handleChangeEndTime}
        showSeconds={showSeconds}
      />
    </MaterialPopup>
  )
}

FormControlDateTimeRangePicker.propTypes = {
  startDateTimeName: PropTypes.string,
  endDateTimeName: PropTypes.string,
  startDateTimeLabel: PropTypes.string,
  endDateTimeLabel: PropTypes.string,
  values: PropTypes.object,
  errors: PropTypes.object,
  touched: PropTypes.object,
  separateFields: PropTypes.bool,
  formControlContainerClass: PropTypes.className,
  isSingleField: PropTypes.bool,
  withPortal: PropTypes.bool,
  marginBottom: PropTypes.bool,
  fullWidth: PropTypes.bool,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  maskValue: PropTypes.string,
  separatorText: PropTypes.string,
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
  labelPosition: PropTypes.inputFieldLabelPosition,
  disabled: PropTypes.bool,
  inputProps: PropTypes.object,
  showSeconds: PropTypes.bool
}

FormControlDateTimeRangePicker.defaultProps = {
  labelPosition: position.top,
  startDateTimeName: 'startDate',
  endDateTimeName: 'endDate',
  separateFields: true,
  isSingleField: false,
  withPortal: false,
  marginBottom: true,
  fullWidth: false,
  onFocus: f => f,
  onBlur: f => f,
  separatorText: '-',
  minDate: moment().format(NORMAL_DATE_TIME_AP_FORMAT),
  values: {},
  errors: {},
  touched: {},
  disabled: false,
  inputProps: {},
  showSeconds: false,
  onBlurAll: f => f,
  showErrorText: true
}

export default FormControlDateTimeRangePicker
