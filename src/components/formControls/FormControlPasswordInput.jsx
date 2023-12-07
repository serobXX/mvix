import React, { useCallback, useState } from 'react'
import classNames from 'classnames'
import { IconButton } from '@material-ui/core'
import { Visibility, VisibilityOff } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import FormControlInput from './FormControlInput'

const useStyles = makeStyles({
  container: {
    display: 'flex',
    position: 'relative'
  },
  icon: {
    position: 'absolute',
    right: '1px',
    bottom: '14px',
    padding: 8
  },
  input: {
    flexGrow: 1
  }
})

const FormControlPasswordInput = ({
  id,
  value = '',
  label = '',
  placeholder = '',
  name = '',
  touched = false,
  error = '',
  onChange = f => f,
  iconClass,
  ...props
}) => {
  const classes = useStyles()
  const [isVisible, toggleVisible] = useState(false)

  const handleToggle = useCallback(() => {
    toggleVisible(value => !value)
  }, [])

  return (
    <div className={classes.container}>
      <FormControlInput
        id={id}
        label={label}
        type={isVisible ? 'text' : 'password'}
        fullWidth
        formControlContainerClass={classes.input}
        value={value}
        name={name}
        touched={touched}
        error={error}
        placeholder={placeholder || label}
        handleChange={onChange}
        {...props}
      />
      <IconButton
        className={classNames(classes.icon, iconClass)}
        onClick={handleToggle}
        tabIndex="-1"
      >
        {isVisible ? (
          <Visibility fontSize="small" />
        ) : (
          <VisibilityOff fontSize="small" />
        )}
      </IconButton>
    </div>
  )
}

export default FormControlPasswordInput
