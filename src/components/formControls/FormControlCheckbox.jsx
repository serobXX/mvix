import { useCallback } from 'react'
import { FormControlLabel, makeStyles } from '@material-ui/core'
import classNames from 'classnames'

import { Checkbox } from 'components/checkboxes'
import { formLabelPositionMap, position } from 'constants/common'
import PropTypes from 'constants/propTypes'
import { simulateEvent } from 'utils/formik'

const useStyles = makeStyles(
  ({ fontSize, lineHeight, fontWeight, palette, type }) => ({
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
      '& $label': {
        color: palette[type].formControls.label.color
      }
    }
  })
)

const FormControlCheckbox = ({
  name,
  label,
  value,
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
        onChange(simulateEvent(name, checked))
      } else {
        onChange(checked)
      }
    },
    [name, onChange]
  )

  return (
    <FormControlLabel
      control={
        <Checkbox
          classes={{
            root: inputRootClassName
          }}
          checked={value}
          onChange={handleChange}
          disabled={disabled}
          color="primary"
          {...props}
        />
      }
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

FormControlCheckbox.propTypes = {
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

FormControlCheckbox.defaultProps = {
  value: false,
  labelPosition: position.right,
  disabled: false,
  onChange: f => f,
  fullHeight: true
}

export default FormControlCheckbox
