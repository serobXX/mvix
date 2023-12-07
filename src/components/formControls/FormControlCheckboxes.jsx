import { useCallback, useMemo } from 'react'
import {
  FormControl,
  FormGroup,
  InputLabel,
  makeStyles
} from '@material-ui/core'
import classNames from 'classnames'

import Tooltip from 'components/Tooltip'
import { ErrorText } from 'components/typography'
import { fontSize, position } from 'constants/common'
import { FormControlCheckbox } from 'components/formControls'
import { simulateEvent } from 'utils/formik'
import { _uniq } from 'utils/lodash'
import PropTypes from 'constants/propTypes'

const useStyles = makeStyles(
  ({ palette, colors, type, spacing, fontSize, lineHeight, fontWeight }) => ({
    root: ({ fullHeight }) => ({
      display: 'flex',
      flexWrap: 'wrap',
      width: '200px',
      ...(fullHeight ? { height: '100%' } : {})
    }),
    rootContainer: {
      width: '100% !important'
    },
    formControlRoot: {
      width: '100%',
      position: 'relative'
    },
    formControlMargin: {
      marginBottom: spacing(2)
    },
    labelSmall: {
      fontSize: `${fontSize.small}px !important`
    },
    labelSmallest: {
      fontSize: `${fontSize.smallest}px !important`
    },
    bootstrapFormLabel: {
      fontSize: fontSize.primary,
      lineHeight: lineHeight.primary,
      fontWeight: fontWeight.normal,
      color: palette[type].formControls.label.color,
      transform: 'none',
      position: 'relative'
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
      justifyContent: 'center',
      gap: spacing(2)
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
    alignLabel: {
      alignSelf: 'flex-start'
    },
    labelLink: {
      textDecoration: 'underline',
      textDecorationStyle: 'dotted',
      textDecorationColor: colors.highlight,
      textUnderlineOffset: '2px',
      '&:hover': {
        cursor: 'pointer',
        textDecorationStyle: 'solid'
      }
    },
    errorTextRoot: {
      marginLeft: 5
    },
    formGroupRoot: ({ row }) => ({
      flexDirection: row ? 'column' : 'row',
      gap: row ? 0 : 15
    })
  })
)

const FormControlCheckboxes = ({
  label,
  name,
  value,
  options,
  onChange,
  error,
  touched,
  labelPosition,
  isOptional,
  fullHeight,
  fullWidth,
  formControlContainerClass,
  formControlRootClass,
  formControlLabelClass,
  errorTextClass,
  disabled,
  tooltip,
  absoluteErrorText,
  labelFontSizeVariant,
  marginBottom,
  onDoubleClick,
  row
}) => {
  const classes = useStyles({ fullHeight, row })

  const showError = useMemo(() => {
    return !!(error && touched)
  }, [error, touched])

  const handleChange = useCallback(
    ({ target: { name: _name, value: _value } }) => {
      const _values = _value
        ? _uniq([...(value || []), _name])
        : (value || []).filter(v => v !== _name)
      name ? onChange(simulateEvent(name, _values)) : onChange(_values)
    },
    [onChange, name, value]
  )

  return (
    <div
      className={classNames(classes.root, formControlContainerClass, {
        [classes.rootContainer]: fullWidth
      })}
      onDoubleClick={onDoubleClick}
    >
      <FormControl
        className={classNames(classes.formControlRoot, formControlRootClass, {
          [classes.formControlMargin]:
            !absoluteErrorText && showError ? false : marginBottom,
          [classes.leftLabel]: labelPosition === position.left,
          [classes.bottomLabel]: labelPosition === position.bottom,
          [classes.rightLabel]: labelPosition === position.right
        })}
      >
        {label && (
          <Tooltip
            arrow
            title={tooltip}
            disableHoverListener={!tooltip}
            placement="top"
          >
            <InputLabel
              className={classNames(
                classes.bootstrapFormLabel,
                formControlLabelClass,
                {
                  [classes.alignLabel]: labelPosition === position.bottom,
                  [classes.labelSmall]: labelFontSizeVariant === fontSize.small,
                  [classes.labelSmallest]:
                    labelFontSizeVariant === fontSize.smallest
                }
              )}
              classes={{
                root: classNames({
                  [classes.labelLink]: tooltip
                })
              }}
            >
              {label} {isOptional && <i>({'optional'})</i>}
            </InputLabel>
          </Tooltip>
        )}
        <FormGroup
          classes={{
            root: classes.formGroupRoot
          }}
        >
          {options &&
            options.map(({ label, value: _value }) => (
              <FormControlCheckbox
                key={`checkbox-group-${_value}`}
                name={_value}
                value={value.includes(_value)}
                label={label}
                onChange={handleChange}
                disabled={disabled}
                fullHeight={false}
              />
            ))}
        </FormGroup>
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

FormControlCheckboxes.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.array,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  ),
  onChange: PropTypes.func,
  error: PropTypes.string,
  touched: PropTypes.bool,
  labelPosition: PropTypes.inputFieldLabelPosition,
  isOptional: PropTypes.bool,
  fullHeight: PropTypes.bool,
  fullWidth: PropTypes.bool,
  formControlContainerClass: PropTypes.className,
  formControlRootClass: PropTypes.className,
  formControlLabelClass: PropTypes.className,
  errorTextClass: PropTypes.className,
  disabled: PropTypes.bool,
  tooltip: PropTypes.string,
  absoluteErrorText: PropTypes.bool,
  labelFontSizeVariant: PropTypes.inputFieldFontSize,
  marginBottom: PropTypes.bool
}

FormControlCheckboxes.defaultProps = {
  options: [],
  value: [],
  onChange: f => f,
  touched: false,
  labelPosition: position.top,
  isOptional: false,
  absoluteErrorText: true,
  marginBottom: true,
  fullHeight: false,
  row: true
}

export default FormControlCheckboxes
