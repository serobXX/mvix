import React from 'react'
import classNames from 'classnames'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'

import PropTypes from 'constants/propTypes'
import { whiteSpace } from 'utils/styles'
import { _get, _isFunction } from 'utils/lodash'
import { Link } from 'react-router-dom'

function styles({ fontSize, fontWeight, lineHeight, colors, type }) {
  function _color(variant) {
    return {
      color: _get(colors, variant)
    }
  }

  function _variant(variant) {
    return {
      fontSize: fontSize[variant],
      lineHeight: lineHeight[variant]
    }
  }

  function _fontWeight(variant) {
    return {
      fontWeight: fontWeight[variant]
    }
  }

  function _fontStyle(variant) {
    return {
      fontStyle: variant
    }
  }

  return {
    'font-style-normal': _fontStyle('normal'),
    'font-style-italic': _fontStyle('italic'),
    'font-weight-normal': _fontWeight('normal'),
    'font-weight-bold': _fontWeight('bold'),
    'variant-primary': _variant('primary'),
    'variant-secondary': _variant('secondary'),
    'variant-small': _variant('small'),
    'variant-smaller': _variant('smaller'),
    'variant-smallest': _variant('smallest'),
    'variant-big': _variant('big'),
    'variant-bigger': _variant('bigger'),
    'variant-biggest': _variant('biggest'),
    'color-inherit': _color('inherit'),
    'color-light': _color('light'),
    'color-highlight': _color('highlight'),
    'color-title.primary': _color(`title.primary[${type}]`),
    'color-warning': _color(`warning`),
    'white-space-normal': whiteSpace('normal'),
    'white-space-pre': whiteSpace('pre'),
    'white-space-no-wrap': whiteSpace('nowrap'),
    'white-space-pre-line': whiteSpace('pre-line'),
    linkView: {
      textDecoration: 'none',
      maxWidth: '100%',
      cursor: 'pointer',
      transitionDuration: '0.2s',

      '&:hover, &:focus': {
        color: colors.highlight
      }
    },
    link: {
      textDecoration: 'none',
      maxWidth: '100%',

      '& p': {
        transitionDuration: '0.2s'
      },

      '&:hover p, &:focus p': {
        color: colors.highlight
      }
    }
  }
}

const LinkWrapper = ({ to, className, children, data }) =>
  to && !!(_isFunction(to) ? to(data) : to) ? (
    <Link className={className} to={_isFunction(to) ? to(data) : to}>
      {children}
    </Link>
  ) : (
    children
  )

const Text = React.forwardRef(
  (
    {
      classes,
      variant,
      fontStyle,
      weight,
      color,
      children,
      whiteSpace,
      rootClassName,
      className,
      to,
      data,
      linkView,
      onClick,
      ...props
    },
    ref
  ) => {
    return (
      <LinkWrapper to={to} className={classes.link} data={data}>
        <Typography
          ref={ref}
          className={classNames(
            classes[`variant-${variant}`],
            classes[`font-weight-${weight}`],
            classes[`font-style-${fontStyle}`],
            classes[`color-${color}`],
            classes[`white-space-${whiteSpace}`],
            rootClassName,
            {
              [classes.linkView]: !!onClick && linkView
            }
          )}
          onClick={event => onClick && onClick(event, data)}
          {...props}
        >
          {children}
        </Typography>
      </LinkWrapper>
    )
  }
)

Text.propTypes = {
  variant: PropTypes.fontSize,
  weight: PropTypes.fontWeight,
  fontStyle: PropTypes.fontStyle,
  color: PropTypes.color,
  rootClassName: PropTypes.className,
  whiteSpace: PropTypes.whiteSpace
}

Text.defaultProps = {
  color: 'light',
  weight: 'normal',
  fontStyle: 'normal',
  variant: 'primary',
  whiteSpace: 'normal'
}

export default withStyles(styles)(Text)
