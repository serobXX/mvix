import { useCallback } from 'react'
import { FormControlLabel, Radio, makeStyles } from '@material-ui/core'
import classNames from 'classnames'

import { formLabelPositionMap, position } from 'constants/common'
import PropTypes from 'constants/propTypes'
import { simulateEvent } from 'utils/formik'

const useStyles = makeStyles(
  ({ fontSize, lineHeight, fontWeight, palette, type, colors }) => ({
    root: ({ fullHeight }) => ({
      margin: 0,
      ...(fullHeight ? { height: '100%' } : {})
    }),
    label: {
      fontSize: fontSize.primary,
      lineHeight: lineHeight.primary,
      fontWeight: fontWeight.normal,
      color: palette[type].formControls.label.color,
      transform: 'none',
      marginLeft: 10
    },
    leftLabel: {
      marginRight: 10,
      marginLeft: 0
    },
    primaryColor: {
      color: palette[type].radioButton.color
    },
    checked: {
      color: `${palette[type].radioButton.checked} !important`
    },
    disabled: {
      '& $primaryColor': {
        color: 'rgb(179 179 179 / 26%)'
      },
      '& $label': {
        color: palette[type].formControls.label.color
      }
    }
  })
)

const FormControlRadio = ({
  name,
  label,
  value,
  checked,
  onChange,
  labelPosition,
  rootClassName,
  labelClassName,
  inputRootClassName,
  disabled,
  fullHeight,
  ...props
}) => {
  const classes = useStyles({
    fullHeight
  })
  const handleChange = useCallback(
    ({ target: { checked } }) => {
      if (name) {
        onChange(simulateEvent(name, checked ? value : ''))
      } else {
        onChange(checked ? value : '')
      }
    },
    [name, onChange, value]
  )

  return (
    <FormControlLabel
      control={
        <Radio
          classes={{
            root: inputRootClassName,
            colorPrimary: classes.primaryColor,
            checked: classes.checked
          }}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          disableRipple
          color="primary"
          {...props}
        />
      }
      value={value}
      label={label}
      labelPlacement={formLabelPositionMap[labelPosition]}
      classes={{
        root: classNames(classes.root, rootClassName),
        label: classNames(classes.label, labelClassName, {
          [classes.leftLabel]: labelPosition === position.left
        }),
        disabled: classes.disabled
      }}
    />
  )
}

FormControlRadio.propTypes = {
  value: PropTypes.bool,
  label: PropTypes.string,
  rootClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  inputRootClassName: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  labelPosition: PropTypes.inputFieldLabelPosition,
  disabled: PropTypes.bool,
  fullHeight: PropTypes.bool
}

FormControlRadio.defaultProps = {
  value: false,
  labelPosition: position.right,
  disabled: false,
  onChange: f => f,
  fullHeight: true
}

export default FormControlRadio
