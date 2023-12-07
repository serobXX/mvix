import React, { useMemo } from 'react'
import { Grid, withStyles } from '@material-ui/core'
import classNames from 'classnames'

import { colorPalette } from 'constants/chipsColorPalette'
import PropTypes from 'constants/propTypes'
import { simulateEvent } from 'utils/formik'
import FormControlLabel from './FormControlLabel'

const styles = () => ({
  root: {
    maxWidth: '240px'
  },
  labelWrap: {
    marginBottom: '3px'
  },
  colorItemWrap: {
    width: '20px',
    height: '20px',
    margin: '0 4px 4px 0',
    padding: '2px 0 0 2px',
    borderRadius: '100%',
    border: '1px solid transparent'
  },
  colorItem: {
    width: '14px',
    height: '14px',
    borderRadius: '100%'
  }
})

const FormControlChipsColorPicker = ({
  classes,
  label,
  name,
  lightName,
  value,
  onChange = f => f,
  rootClassName = ''
}) => {
  const renderLabel = useMemo(() => {
    return (
      label && (
        <div className={classes.labelWrap}>
          <FormControlLabel label={label} />
        </div>
      )
    )
  }, [label, classes])

  const handleChange = (base, light) => () => {
    onChange(simulateEvent(name, base))
    lightName && onChange(simulateEvent(lightName, light))
  }

  return (
    <div className={classNames(classes.root, rootClassName)}>
      {renderLabel}
      <Grid container>
        {colorPalette.map(({ base, light }, i) => (
          <Grid
            key={`color-${i}`}
            item
            style={{
              borderColor: value === base ? value : 'transparent'
            }}
            className={classes.colorItemWrap}
          >
            <div
              onClick={handleChange(base, light)}
              className={classes.colorItem}
              style={{
                background: base
              }}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

FormControlChipsColorPicker.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  name: PropTypes.string,
  rootClassName: PropTypes.string
}

export default withStyles(styles)(FormControlChipsColorPicker)
