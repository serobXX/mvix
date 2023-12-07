import React, { useCallback, useMemo, memo } from 'react'
import {
  withStyles,
  FormGroup,
  FormControlLabel,
  Switch
} from '@material-ui/core'
import classNames from 'classnames'
import { getKeyByValue } from 'utils/getKeyByValue'
import { simulateEvent } from 'utils/formik'
import PropTypes from 'constants/propTypes'
import Tooltip from 'components/Tooltip'
import { formLabelPositionMap, position } from 'constants/common'

const styles = ({
  palette,
  colors,
  transitions,
  typography,
  type,
  fontSize,
  fontWeight,
  lineHeight
}) => ({
  iOSSwitchBase: {
    height: 14,
    top: 2,
    left: 11,
    color: palette[type].default,
    '&$checked': {
      transform: 'translateX(10px)',
      color: palette[type].default,
      '& + $iOSBar': {
        backgroundColor: '#41cb71 !important',
        opacity: 1
        //border: 'none',
      },
      '&:hover': {
        backgroundColor: 'unset'
      }
    },
    // '&$iOSChecked': {
    //   color: palette[type].default,
    //   '& + $iOSBar': {
    //     backgroundColor: '#41cb71'
    //   }
    // },
    transition: transitions.create('transform', {
      duration: transitions.duration.shortest,
      easing: transitions.easing.sharp
    })
  },
  checked: {},
  root: {
    height: 22,
    padding: '4px 17px'
  },
  rootStrict: {
    width: 24,
    padding: '4px 0'
  },
  iOSSwitchBaseStrict: {
    left: -6
  },
  iOSChecked: {
    transform: 'translateX(8px)',
    '& + $iOSBar': {
      opacity: 1,
      border: 'none'
    }
  },
  iOSCheckedStrict: {
    transform: 'translateX(4px)'
  },
  iOSDisabled: {
    opacity: '0.25'
  },
  iOSReadOnly: {
    opacity: 0.25
  },
  iOSBar: {
    //transform: 'translate(-50%, -50%)',
    borderRadius: 14,
    width: 24,
    height: 14,
    backgroundColor: '#535d73',
    opacity: 1,
    marginTop: 'unset',
    marginLeft: 'unset',
    transition: transitions.create('background-color')
  },
  iOSBarReadOnly: {
    opacity: 0.12,
    backgroundColor: '#000'
  },
  iOSBarStrict: {
    top: 7,
    left: 11,
    marginLeft: 0,
    marginTop: 0
  },
  iOSIcon: {
    width: 8,
    height: 8,
    boxShadow: 'none',
    marginTop: 0
  },
  labelWrap: {
    marginLeft: 0,
    marginRight: 0
  },
  label: {
    ...typography.subtitle[type],
    textTransform: 'capitalize',
    fontSize: fontSize.primary,
    lineHeight: lineHeight.primary,
    fontWeight: fontWeight.normal
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
  labelError: {
    color: colors.error
  },
  labelDisabled: {
    color: `${palette[type].formControls.disabled.color} !important`
  },
  'justify-space-between': {
    width: '100%',
    justifyContent: 'space-between'
  },
  'align-start': {
    alignSelf: 'flex-start',
    height: 32
  },
  'align-end': {
    alignSelf: 'flex-end',
    height: 32
  },
  mediaFormControlRootClass: {
    display: 'flex',
    alignItems: 'flex-start'
  },
  mediaFormControlLabelClass: {
    marginBottom: 5
  },
  mediaSwitchRoot: {
    marginLeft: -15
  },
  labelSmall: {
    fontSize: `${fontSize.small}px !important`
  },
  labelSmallest: {
    fontSize: `${fontSize.smallest}px !important`
  }
})

const CheckboxSwitcher = ({
  classes,
  variant = 1,
  label,
  id = 0,
  name = '',
  value = false,
  switchContainerClass = '',
  switchRootClass = '',
  switchBaseClass = '',
  formControlRootClass = '',
  formControlLabelClass = '',
  disabled = false,
  labelPosition = position.left,
  labelFontSizeVariant = 'primary',
  returnValues = {
    true: true,
    false: false
  },
  onChange = f => f,
  onBlur = f => f,
  selectedListMode = false,
  isFormLabel = true,
  switchStrictWidth = false,
  error,
  switchIconClass,
  tooltip = '',
  justify,
  align,
  formClasses,
  tooltipUnderLine = true,
  readOnly = false,
  tooltipHeaderText,
  onDoubleClick = f => f,
  readOnlyWithoutSelection = false
}) => {
  const labelPlacement = formLabelPositionMap[labelPosition]
  const handleToggle = useCallback(
    (event, value) => {
      if (name) {
        if (selectedListMode) {
          onChange(name)
          onBlur(name)
        } else {
          let returnValue = getKeyByValue(returnValues, value)

          if (returnValue === 'true') returnValue = true
          if (returnValue === 'false') returnValue = false

          onChange(simulateEvent(name, returnValue))
          onBlur(simulateEvent(name, returnValue))
        }
      } else {
        onChange(value, id, event)
        onBlur(value, id, event)
      }
    },
    [name, selectedListMode, returnValues, onChange, id, onBlur]
  )
  const checked = useMemo(
    () => returnValues[value] || false,
    [returnValues, value]
  )

  return (
    <FormGroup row classes={formClasses} className={switchContainerClass}>
      <Tooltip
        arrow
        title={tooltip}
        {...(tooltipHeaderText && {
          headerText: tooltipHeaderText,
          withHeader: true
        })}
        disableHoverListener={!tooltip}
        placement="top"
      >
        <FormControlLabel
          classes={{
            root: classNames(
              classes.labelWrap,
              formControlRootClass,
              classes[`justify-${justify}`],
              {
                [classes[`align-${align}`]]:
                  align && ['start', 'end'].includes(labelPlacement),
                [classes.mediaFormControlRootClass]: variant === 2
              }
            ),
            label: classNames(classes.label, formControlLabelClass, {
              [classes.labelError]: error,
              'form-label': isFormLabel,
              [classes.labelLink]: tooltipUnderLine && tooltip,
              [classes.mediaFormControlLabelClass]: variant === 2,
              [classes.labelSmall]: labelFontSizeVariant === 'small',
              [classes.labelSmallest]: labelFontSizeVariant === 'smallest'
            }),
            disabled: classes.labelDisabled
          }}
          label={label}
          labelPlacement={variant === 2 ? 'top' : labelPlacement}
          control={
            <Switch
              disabled={disabled || readOnly || readOnlyWithoutSelection}
              disableRipple
              value="checked"
              checked={checked}
              onChange={handleToggle}
              classes={{
                root: classNames(classes.root, switchRootClass, {
                  [classes.rootStrict]: switchStrictWidth,
                  [classes.mediaSwitchRoot]: variant === 2
                }),
                switchBase: classNames(classes.iOSSwitchBase, switchBaseClass, {
                  [classes.iOSSwitchBaseStrict]: switchStrictWidth
                }),
                track: classNames(classes.iOSBar, {
                  [classes.iOSBarStrict]: switchStrictWidth,
                  [classes.iOSBarReadOnly]: readOnly
                }),
                thumb: classNames(classes.iOSIcon, switchIconClass),
                checked: classes.checked,
                disabled:
                  !disabled && readOnly
                    ? classes.iOSReadOnly
                    : classes.iOSDisabled
              }}
            />
          }
          onDoubleClick={onDoubleClick}
        />
      </Tooltip>
    </FormGroup>
  )
}

CheckboxSwitcher.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  name: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.number
  ]),
  switchContainerClass: PropTypes.className,
  switchRootClass: PropTypes.className,
  switchBaseClass: PropTypes.className,
  formControlRootClass: PropTypes.className,
  formControlLabelClass: PropTypes.className,
  disabled: PropTypes.bool,
  labelPlacement: PropTypes.inputFieldLabelPosition,
  labelFontSizeVariant: PropTypes.inputFieldFontSize,
  returnValues: PropTypes.object,
  onChange: PropTypes.func,
  selectedListMode: PropTypes.bool,
  isFormLabel: PropTypes.bool,
  error: PropTypes.string,
  switchIconClass: PropTypes.string,
  tooltip: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([false])]),
  justify: PropTypes.oneOf(['space-between']),
  align: PropTypes.oneOf(['end, start']),
  switchStrictWidth: PropTypes.bool,
  readOnly: PropTypes.bool
}

export default withStyles(styles)(memo(CheckboxSwitcher))
