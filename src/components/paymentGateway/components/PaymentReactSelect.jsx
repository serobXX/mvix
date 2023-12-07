import { useCallback, useMemo } from 'react'
import {
  FormControl,
  InputLabel,
  makeStyles,
  withTheme
} from '@material-ui/core'
import classNames from 'classnames'
import Select from 'react-select'
import { ErrorText } from 'components/typography'
import getOrExecute from 'utils/getOrExecute'

const useStyles = makeStyles(() => ({
  root: {
    width: '100%'
  },
  formControlRoot: {
    width: '100%',
    position: 'relative'
  },
  formControlMargin: {
    marginBottom: '0.75rem'
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
  label: {
    position: 'unset !important'
  },
  alignLabel: {
    alignSelf: 'flex-start'
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
}))

const getStyles = ({ transitions, typography }, styles, showError) => {
  return {
    ...styles,
    control: (provided, state) => ({
      ...provided,
      borderColor: '#e6e6e6',
      minHeight: '44px',
      transition: transitions.create(['border-color', 'box-shadow']),
      fontFamily: typography.fontFamily,
      paddingLeft: '0.75em',
      borderRadius: 4,

      ...(!state.isFocused && {
        '&:hover': {
          borderColor: '#e6e6e6'
        }
      }),

      ...(state.isFocused && {
        border: '1px solid #80bdff',
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        ...styles?.onFocus
      }),
      ...getOrExecute(styles?.container, state)
    }),
    input: (provided, state) => ({
      ...provided,
      fontSize: '0.9em',
      fontWeight: '600',
      fontFamily: typography.fontFamily,
      color: '#505050',
      ...getOrExecute(styles?.input, state)
    }),
    valueContainer: (provided, state) => ({
      ...provided,
      ...getOrExecute(styles?.valueContainer, state),
      paddingLeft: 0
    })
  }
}

const PaymentReactSelect = ({
  id,
  label,
  name,
  value,
  error,
  touched,
  onChange,
  onBlur,
  options,
  formControlContainerClass,
  formControlRootClass,
  marginBottom,
  absoluteErrorText,
  showErrorText,
  labelPosition,
  formControlLabelClass,
  errorTextClass,
  styles,
  theme,
  isSearchable,
  ...props
}) => {
  const classes = useStyles()

  const showError = useMemo(() => {
    return !!(showErrorText && error && touched)
  }, [showErrorText, error, touched])

  const customStyles = useMemo(
    () => getStyles(theme, styles, error && touched),
    [styles, error, touched, theme]
  )

  const computedValue = useMemo(() => {
    return (
      options.find(({ value: _value }) => _value === value) || {
        value,
        label: value,
        __isNew__: true
      }
    )
  }, [options, value])

  const onChangeHandler = useCallback(
    newValue => {
      if (newValue && newValue.__isNew__) {
        onChange({
          target: { name, ...newValue, alias: newValue.value }
        })
      } else {
        onChange({
          target: { name, ...newValue }
        })
      }
    },
    [onChange, name]
  )

  return (
    <div className={classNames(classes.root, formControlContainerClass)}>
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
        {label && (
          <InputLabel
            shrink
            htmlFor={id}
            className={classNames(
              classes.bootstrapFormLabel,
              formControlLabelClass,
              {
                [classes.alignLabel]:
                  labelPosition === 'top' || labelPosition === 'bottom'
              }
            )}
            classes={{
              focused: classes.bootstrapFormLabelFocus,
              root: classes.label
            }}
          >
            {label}
          </InputLabel>
        )}
        <Select
          name={name}
          options={options}
          onBlur={onBlur}
          onChange={onChangeHandler}
          value={computedValue}
          styles={customStyles}
          isSearchable={isSearchable}
          {...props}
        />
        <ErrorText
          absolute={absoluteErrorText}
          condition={showError}
          error={error}
          rootClassName={classNames(classes.errorText, errorTextClass)}
        />
      </FormControl>
    </div>
  )
}

PaymentReactSelect.defaultProps = {
  touched: false,
  options: [],
  marginBottom: true,
  absoluteErrorText: false,
  showErrorText: true,
  labelPosition: 'top',
  isSearchable: false
}

export default withTheme(PaymentReactSelect)
