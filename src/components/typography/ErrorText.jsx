import React from 'react'
import { withStyles } from '@material-ui/core'
import classNames from 'classnames'

import PropTypes from 'constants/propTypes'
import Text from './Text'

function styles({ colors }) {
  return {
    root: {
      color: colors.error
    },
    absolute: {
      position: 'absolute',
      bottom: -16,
      height: 16,
      lineHeight: 'inherit'
    },
    static: {
      lineHeight: '16px'
    },
    optionalError: {
      color: colors.highlight
    }
  }
}

function ErrorText({
  classes,
  condition,
  error,
  rootClassName,
  absolute,
  isOptional,
  variant = 'smallest'
}) {
  if (!condition) {
    return null
  }
  return (
    <Text
      variant={variant}
      rootClassName={classNames(classes.root, rootClassName, {
        [classes.absolute]: absolute,
        [classes.static]: !absolute,
        [classes.optionalError]: isOptional
      })}
    >
      {error}
    </Text>
  )
}

ErrorText.propTypes = {
  condition: PropTypes.bool,
  error: PropTypes.string,
  rootClassName: PropTypes.className,
  absolute: PropTypes.bool,
  variant: PropTypes.fontSize
}

export default withStyles(styles)(ErrorText)
