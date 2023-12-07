import React, { useCallback, useMemo, useRef } from 'react'
import { FormControlInput } from '..'
import { makeStyles } from '@material-ui/core'
import { simulateEvent } from 'utils/formik'
import classNames from 'classnames'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'

const useStyles = makeStyles(({ palette, type, typography }) => ({
  fileInput: {
    display: 'none'
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
    borderLeft: `1px solid ${palette[type].formControls.multipleDatesPicker.input.border}`,
    cursor: 'pointer'
  },
  clearIcon: {
    cursor: 'pointer',
    color: typography.lightAccent[type].color,
    marginTop: 3,
    zIndex: 5,

    '&:hover': {
      color: typography.darkAccent[type].color
    }
  }
}))

const FormControlFileInput2 = ({
  value,
  readOnly,
  isMulti,
  max = 10,
  name,
  onChange,
  isClearable = false,
  hideIcon,
  showErrorText = true,
  error,
  touched,
  isBottomError,
  ...props
}) => {
  const classes = useStyles()
  const inputRef = useRef()

  const showError = useMemo(() => {
    return !!(showErrorText && error && touched)
  }, [showErrorText, error, touched])

  const isErrorIcon = !isBottomError && showError

  const handleClick = useCallback(() => {
    if (!readOnly && inputRef.current) {
      inputRef.current.click()
    }
  }, [readOnly])

  const handleChangFile = useCallback(
    ({ target: { files } }) => {
      if (!!files.length && files.length <= max) {
        onChange(simulateEvent(name, isMulti ? files : files[0]))
      }
    },
    [max, onChange, isMulti, name]
  )

  const handleClear = useCallback(() => {
    onChange(simulateEvent(name, ''))
  }, [onChange, name])

  return (
    <>
      <FormControlInput
        onClick={handleClick}
        {...props}
        value={isMulti ? `${value.length} files` : value?.name}
        showErrorText={showErrorText}
        error={error}
        touched={touched}
        isBottomError={isBottomError}
        endAdornment={
          (isClearable && value) || (!hideIcon && !isErrorIcon) ? (
            <>
              {isClearable && value ? (
                <i
                  className={classNames(
                    getIconClassName(iconNames.clear),
                    classes.clearIcon
                  )}
                  onClick={handleClear}
                />
              ) : null}
              {hideIcon || isErrorIcon ? null : (
                <div className={classes.endAdornment} onClick={handleClick}>
                  <i className={getIconClassName(iconNames.fileAttach)} />
                </div>
              )}
            </>
          ) : null
        }
        readOnly
      />
      <input
        type="file"
        className={classes.fileInput}
        ref={inputRef}
        onChange={handleChangFile}
        multiple={isMulti}
      />
    </>
  )
}

export default FormControlFileInput2
