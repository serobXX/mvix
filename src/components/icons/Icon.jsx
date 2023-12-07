import React, { forwardRef } from 'react'
import classNames from 'classnames'
import Tooltip from 'components/Tooltip'
import withStyles from '@material-ui/core/styles/withStyles'
import Grid from '@material-ui/core/Grid'

import Spacing from 'components/containers/Spacing'
import PropTypes from 'constants/propTypes'

function styles({ fontSize, colors, palette }) {
  return {
    root: {
      fontSize: fontSize.big
    },
    hover: {
      cursor: 'pointer'
    },
    disabled: {
      opacity: '.6'
    },
    'color-blue': {
      color: colors.highlight
    },
    'color-light': {
      color: colors.light
    },
    'color-success': {
      color: colors.green
    },
    'color-danger': {
      color: palette.buttons.secondary.theme2.color
    }
  }
}

const containerProps = {
  container: true,
  justifyContent: 'center',
  alignItems: 'center'
}

const itemProps = {
  item: true
}

const Icon = forwardRef(
  (
    {
      classes,
      icon,
      iconComponent,
      className,
      tooltip,
      tooltipHeader,
      tooltipMaxWidth,
      color,
      disabled,
      rootProps,
      container,
      paddingHor,
      paddingVert,
      onClick,
      tooltipPlacement,
      ...props
    },
    ref
  ) => {
    return (
      <Tooltip
        arrow
        title={tooltip}
        disableHoverListener={!tooltip}
        headerText={tooltipHeader || ''}
        withHeader={!!tooltipHeader}
        maxWidth={tooltipMaxWidth}
        placement={tooltipPlacement}
      >
        <Grid
          ref={ref}
          onClick={onClick}
          className={classNames(classes.root, classes[`color-${color}`], {
            [classes.hover]: !!onClick,
            [classes.disabled]: disabled
          })}
          {...(container && containerProps)}
          {...(!container && itemProps)}
          {...rootProps}
          {...props}
        >
          <Spacing
            variant={0}
            paddingVert={paddingVert}
            paddingHor={paddingHor}
            {...(container && containerProps)}
            {...(!container && itemProps)}
          >
            {iconComponent ? (
              iconComponent
            ) : (
              <i className={classNames(icon, className)} aria-hidden="true" />
            )}
          </Spacing>
        </Grid>
      </Tooltip>
    )
  }
)

Icon.propTypes = {
  icon: PropTypes.string,
  rootClassName: PropTypes.string,
  tooltip: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  tooltipType: PropTypes.string,
  color: PropTypes.oneOf(['blue', 'light', 'success', 'danger']),
  disabled: PropTypes.bool,
  rootProps: PropTypes.object,
  container: PropTypes.bool,
  paddingVert: PropTypes.oneOf([1, 1.5, 2, 3]),
  paddingHor: PropTypes.oneOf([1, 1.5, 2, 3]),
  onClick: PropTypes.func,
  tooltipPlacement: PropTypes.string
}

Icon.defaultProps = {
  tooltip: '',
  container: true
}

export default withStyles(styles)(Icon)
