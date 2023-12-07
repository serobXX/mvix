import { useCallback, useEffect, useMemo, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'
import { DateRange } from 'react-date-range'
import moment from 'moment'

import { MaterialPopup } from 'components/Popup'
import { materialPopupPosition, position } from 'constants/common'
import FormControlInput from '../FormControlInput'
import Container from 'components/containers/Container'
import { NORMAL_DATE_FORMAT } from 'constants/dateTimeFormats'
import { simulateEvent } from 'utils/formik'
import getStyles from './styles'
import PropTypes from 'constants/propTypes'

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
  dateRangeRoot: {
    ...getStyles({ palette, type }, { onlyDate: true })
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

const FormControlDateRangePicker = ({
  startDateName,
  endDateName,
  startDateLabel,
  endDateLabel,
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
  maskValue,
  separatorText,
  minDate,
  maxDate,
  labelPosition,
  disabled,
  inputProps,
  onDoubleClick,
  tooltip,
  tooltipHeader,
  tooltipType,
  isRequired,
  isBottomError,
  showErrorText
}) => {
  const classes = useStyles({
    fullWidth
  })
  const [focusedInputs, setFocusedInputs] = useState({
    [startDateName]: false,
    ...(isSingleField ? {} : { [endDateName]: false })
  })
  const [localValues, setLocalValues] = useState([])

  useEffect(() => {
    setLocalValues([
      {
        startDate: values[startDateName]
          ? moment(values[startDateName], maskValue).toDate()
          : new Date(),
        endDate: values[endDateName]
          ? moment(values[endDateName], maskValue).toDate()
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
          startDateName,
          moment(selection.startDate).format(maskValue)
        )
      )
      onChange(
        simulateEvent(endDateName, moment(selection.endDate).format(maskValue))
      )
    },
    [onChange, maskValue, startDateName, endDateName]
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
        ? [values[startDateName], values[endDateName]].join(
            ` ${separatorText} `
          )
        : values[startDateName],
    [values, startDateName, endDateName, isSingleField, separatorText]
  )

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
              label={startDateLabel}
              endAdornment={
                isErrorIcon(startDateName) ? null : (
                  <div className={classes.endAdornment}>
                    <i className={getIconClassName(iconNames.date)} />
                  </div>
                )
              }
              name={startDateName}
              value={parseStartDateValue}
              onFocus={handleFocus}
              onBlur={handleBlur}
              fullWidth={fullWidth}
              error={errors[startDateName]}
              touched={touched[startDateName]}
              marginBottom={false}
              disabled={disabled}
              readOnly
              onDoubleClick={onDoubleClick}
              tooltip={tooltip}
              tooltipHeader={tooltipHeader}
              isRequired={isRequired}
              formControlRootClass={classNames(
                classes.formControlRoot,
                inputProps.formControlRootClass
              )}
              showErrorText={showErrorText}
              isBottomError={isBottomError}
              endAdornmentRootClass={
                isErrorIcon(startDateName) && classes.endAdornmentErrorIcon
              }
              {...inputProps}
            />
            {!isSingleField && (
              <FormControlInput
                labelPosition={labelPosition}
                label={endDateLabel}
                endAdornment={
                  isErrorIcon(endDateName) ? null : (
                    <div className={classes.endAdornment}>
                      <i className={getIconClassName(iconNames.date)} />
                    </div>
                  )
                }
                name={endDateName}
                value={values[endDateName]}
                onFocus={handleFocus}
                onBlur={handleBlur}
                fullWidth={fullWidth}
                error={errors[endDateName]}
                touched={touched[endDateName]}
                marginBottom={false}
                disabled={disabled}
                readOnly
                onDoubleClick={onDoubleClick}
                tooltip={tooltip}
                tooltipHeader={tooltipHeader}
                tooltipType={tooltipType}
                isRequired={isRequired}
                formControlRootClass={classNames(
                  classes.formControlRoot,
                  inputProps.formControlRootClass
                )}
                showErrorText={showErrorText}
                isBottomError={isBottomError}
                endAdornmentRootClass={
                  isErrorIcon(endDateName) && classes.endAdornmentErrorIcon
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
    </MaterialPopup>
  )
}

FormControlDateRangePicker.propTypes = {
  startDateName: PropTypes.string,
  endDateName: PropTypes.string,
  startDateLabel: PropTypes.string,
  endDateLabel: PropTypes.string,
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
  inputProps: PropTypes.object
}

FormControlDateRangePicker.defaultProps = {
  labelPosition: position.top,
  startDateName: 'startDate',
  endDateName: 'endDate',
  separateFields: true,
  isSingleField: false,
  withPortal: false,
  marginBottom: true,
  fullWidth: false,
  onFocus: f => f,
  onBlur: f => f,
  maskValue: NORMAL_DATE_FORMAT,
  separatorText: '-',
  minDate: moment().format(NORMAL_DATE_FORMAT),
  values: {},
  errors: {},
  touched: {},
  disabled: false,
  inputProps: {},
  showErrorText: true
}

export default FormControlDateRangePicker
