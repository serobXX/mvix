import React, { memo, useCallback, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import classNames from 'classnames'
import withStyles from '@material-ui/core/styles/withStyles'

import Tooltip from 'components/Tooltip'
import { FormControlInput } from '.'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'

const styles = ({ palette, type, colors }) => ({
  formControlInput: {
    cursor: 'pointer',
    height: 40,
    fontSize: 16
  },
  inputRoot: {
    position: 'relative',
    cursor: 'pointer'
  },
  disabled: {
    cursor: 'auto'
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
    borderLeft: `1px solid ${palette[type].formControls.multipleDatesPicker.input.border}`
  },
  endAdornmentFocus: {
    borderColor: colors.highlight
  }
})

const FormControlCopyInput = ({
  value,
  label,
  marginBottom,
  inputTooltip,
  disabled = false,
  classes
}) => {
  const [tooltip, setTooltip] = useState(
    inputTooltip || 'Click to copy input value'
  )
  const [inputFocused, setInputFocused] = useState(false)

  const handleCopyInputValue = useCallback(() => {
    if (value) {
      setInputFocused(true)
      setTooltip('Input value copied to clipboard')
      setTimeout(() => setTooltip('Click to copy input value'), 2000)
    }
  }, [value])

  return (
    <>
      <Tooltip arrow placement="top" title={tooltip}>
        {disabled ? (
          <FormControlInput
            type="text"
            value={value}
            label={label}
            tooltip={inputTooltip}
            formControlInputClass={classNames(
              classes.formControlInput,
              classes.disabled
            )}
            marginBottom={marginBottom}
            disabled
            readOnly
          />
        ) : (
          <CopyToClipboard onCopy={handleCopyInputValue} text={value}>
            <div>
              <div
                className={classNames(classes.inputRoot, {
                  [classes.disabled]: !value
                })}
              >
                <FormControlInput
                  type="text"
                  value={value}
                  label={label}
                  tooltip={inputTooltip}
                  formControlInputClass={classNames(classes.formControlInput, {
                    [classes.disabled]: !value
                  })}
                  marginBottom={marginBottom}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  disabled={!value}
                  readOnly
                  fullWidth
                  endAdornment={
                    <div
                      className={classNames(classes.endAdornment, {
                        [classes.endAdornmentFocus]: inputFocused
                      })}
                    >
                      <i className={getIconClassName(iconNames.copy)} />
                    </div>
                  }
                />
              </div>
            </div>
          </CopyToClipboard>
        )}
      </Tooltip>
    </>
  )
}

export default memo(withStyles(styles)(FormControlCopyInput))
