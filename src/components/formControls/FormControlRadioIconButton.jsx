import { FormControl, Grid, makeStyles } from '@material-ui/core'
import classNames from 'classnames'

import PropTypes from 'constants/propTypes'
import { simulateEvent } from 'utils/formik'
import FormControlLabel from './FormControlLabel'
import Tooltip from 'components/Tooltip'
import { WhiteButton } from 'components/buttons'
import { ErrorText } from 'components/typography'

const useStyles = makeStyles(({ palette, type, colors, spacing }) => ({
  root: {
    width: '100%'
  },
  button: {
    minWidth: 'unset',
    width: 42,
    height: 40
  },
  selected: {
    backgroundColor: colors.highlight,
    '& $icon': {
      color: palette[type].buttons.white.hover.color,
      '& svg, & i': {
        color: palette[type].buttons.white.hover.color
      }
    }
  },
  icon: {
    fontSize: 20
  },
  formControlRoot: {
    width: '100%',
    position: 'relative'
  },
  formControlMargin: {
    marginBottom: spacing(2)
  },
  errorTextRoot: {
    marginTop: 5
  },
  label: {
    position: 'relative',
    marginBottom: 3
  },
  buttonRoot: {
    gap: 10
  }
}))

const FormControlRadioIconButton = ({
  label,
  name,
  value,
  options,
  onChange,
  formControlContainerClass,
  formControlRootClass,
  error,
  touched,
  absoluteErrorText,
  marginBottom,
  isOptional,
  errorTextClass
}) => {
  const classes = useStyles()
  const showError = touched && !!error

  const handleChange = _value => () => {
    onChange(simulateEvent(name, _value))
  }

  return (
    <div className={classNames(classes.root, formControlContainerClass)}>
      <FormControl
        className={classNames(classes.formControlRoot, formControlRootClass, {
          [classes.formControlMargin]:
            !absoluteErrorText && showError ? false : marginBottom
        })}
      >
        {label && (
          <FormControlLabel
            label={`${label} ${isOptional ? <i>{'(optional)'}</i> : ''}`}
            classes={{
              root: classes.label
            }}
          />
        )}
        <Grid container className={classes.buttonRoot}>
          {options.map(
            ({ tooltip, value: _value, icon, iconComponent, disabled }) => (
              <Tooltip
                title={tooltip}
                arrow
                placement="top"
                key={`radio-icon-button-${_value}`}
              >
                <WhiteButton
                  className={classNames(classes.button, {
                    [classes.selected]: _value === value
                  })}
                  onClick={handleChange(_value)}
                  disabled={disabled}
                >
                  {iconComponent || (
                    <i className={classNames(icon, classes.icon)} />
                  )}
                </WhiteButton>
              </Tooltip>
            )
          )}
        </Grid>
        <ErrorText
          isOptional={isOptional}
          absolute={absoluteErrorText}
          condition={showError}
          error={error}
          rootClassName={classNames(classes.errorTextRoot, errorTextClass)}
        />
      </FormControl>
    </div>
  )
}

FormControlRadioIconButton.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  name: PropTypes.string.isRequired,
  options: PropTypes.array,
  formControlContainerClass: PropTypes.className,
  formControlRootClass: PropTypes.className,
  error: PropTypes.string,
  touched: PropTypes.bool,
  absoluteErrorText: PropTypes.bool,
  marginBottom: PropTypes.bool,
  isOptional: PropTypes.bool,
  errorTextClass: PropTypes.className
}

FormControlRadioIconButton.defaultProps = {
  onChange: f => f,
  options: [],
  touched: false,
  absoluteErrorText: true,
  marginBottom: true,
  isOptional: false
}

export default FormControlRadioIconButton
