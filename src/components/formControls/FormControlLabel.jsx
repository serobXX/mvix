import React, { useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import InputLabel from '@material-ui/core/InputLabel'
import withStyles from '@material-ui/core/styles/withStyles'

import PropTypes from 'constants/propTypes'
import Tooltip from 'components/Tooltip'

function styles({ palette, type, colors, fontSize, lineHeight, fontWeight }) {
  return {
    root: {
      color: palette[type].formControls.label.color,
      fontSize: fontSize.primary,
      lineHeight: lineHeight.primary,
      fontWeight: fontWeight.normal,
      transform: 'none'
    },
    singleLineRoot: {
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      width: '100%',
      overflow: 'hidden'
    },
    error: {
      color: colors.error
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
    labelSmall: {
      fontSize: `${fontSize.small}px !important`
    },
    labelSmallest: {
      fontSize: `${fontSize.smallest}px !important`
    }
  }
}

function FormControlLabel({
  classes,
  placement,
  label,
  error,
  fontSizeVariant = 'primary',
  rootClassName,
  tooltip,
  isOptional = false,
  withoutTextDecoration = false,
  singleLine = false
}) {
  const ref = useRef(null)
  const [singleLineTooltip, setSingleLineTooltip] = useState('')

  useEffect(
    () => {
      if (singleLine) {
        const isTextHidden =
          ref.current?.scrollWidth !== ref.current?.clientWidth
        setSingleLineTooltip(isTextHidden ? label : '')
      }
    },
    // eslint-disable-next-line
    [ref.current]
  )

  if (!label) {
    return null
  }
  return (
    <Tooltip
      arrow
      title={tooltip || singleLineTooltip || ''}
      disableHoverListener={!(tooltip || singleLineTooltip)}
      placement={placement || 'top'}
    >
      <InputLabel
        ref={ref}
        shrink
        className={classNames(classes.root, rootClassName, {
          [classes.error]: !!error,
          [classes.labelLink]: !!tooltip && !withoutTextDecoration,
          [classes.labelSmall]: fontSizeVariant === 'small',
          [classes.labelSmallest]: fontSizeVariant === 'smallest',
          [classes.singleLineRoot]: singleLine
        })}
      >
        {label} {isOptional && <i>({'optional'})</i>}
      </InputLabel>
    </Tooltip>
  )
}

FormControlLabel.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  fontSizeVariant: PropTypes.oneOf(['primary', 'small', 'smallest']),
  rootClassName: PropTypes.string,
  tooltip: PropTypes.string
}

export default withStyles(styles)(FormControlLabel)
