import React, { forwardRef, useCallback } from 'react'
import classNames from 'classnames'
import {
  withStyles,
  Button,
  IconButton,
  Fab,
  Tooltip,
  CircularProgress
} from '@material-ui/core'
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab'
import { themeTypes } from 'constants/ui'

export const WhiteButton = withStyles(({ palette, type, shapes, colors }) => ({
  root: {
    border: '1px solid',
    height: shapes.height.primary,
    padding: '9px 18px',
    boxShadow: `0 2px 4px 0 ${palette[type].buttons.white.shadow}`,
    backgroundColor: palette[type].buttons.white.background,
    color: palette[type].buttons.white.color,
    '&:hover, &focus, &:active': {
      color: palette[type].buttons.white.hover.color,
      '& svg, & i': {
        color: palette[type].buttons.white.hover.color
      }
    },
    '&:disabled': {
      color: `${colors.light}`,
      opacity: 0.5
    }
  },
  label: {
    fontSize: '0.8125rem',
    lineHeight: '1.1em',
    textTransform: 'capitalize',
    color: 'inherit'
  },
  iconColor: {
    marginRight: 4,
    fontSize: '14px'
  },
  filledButton: {
    color: `${palette[type].buttons.white.hover.color} !important`,
    '& svg, & i': {
      color: palette[type].buttons.white.hover.color
    },
    '&:before': {
      backgroundColor: palette[type].buttons.white.background
    },
    '&:disabled': {
      color: palette[type].buttons.blue.disabled,
      opacity: 0.5
    }
  },
  outlineButton: {
    '&:hover, &focus, &:active': {
      color: `${palette[type].buttons.white.hover.color} !important`,
      '& svg, & i': {
        color: `${palette[type].buttons.white.hover.color} !important`
      }
    }
  },
  filledLightButton: {
    color: `${palette[themeTypes.light].buttons.white.hover.color} !important`,
    '& svg, & i': {
      color: palette[themeTypes.light].buttons.white.hover.color
    },
    '&:before': {
      backgroundColor: palette[themeTypes.light].buttons.white.background
    },
    '&:disabled': {
      color: palette[themeTypes.light].buttons.blue.disabled
    }
  },
  filledDarkButton: {
    color: `${palette[themeTypes.dark].buttons.white.hover.color} !important`,
    '& svg, & i': {
      color: palette[themeTypes.dark].buttons.white.hover.color
    },
    '&:before': {
      backgroundColor: palette[themeTypes.dark].buttons.white.background
    },
    '&:disabled': {
      color: palette[themeTypes.dark].buttons.blue.disabled
    }
  },
  outlineLightButton: {
    boxShadow: `0 2px 4px 0 ${palette[themeTypes.light].buttons.white.shadow}`,
    backgroundColor: palette[themeTypes.light].buttons.white.background,
    color: palette[themeTypes.light].buttons.white.color,
    '&:hover, &focus, &:active': {
      color: `${
        palette[themeTypes.light].buttons.white.hover.color
      } !important`,
      '& svg, & i': {
        color: `${
          palette[themeTypes.light].buttons.white.hover.color
        } !important`
      }
    }
  },
  outlineDarkButton: {
    boxShadow: `0 2px 4px 0 ${palette[themeTypes.dark].buttons.white.shadow}`,
    backgroundColor: palette[themeTypes.dark].buttons.white.background,
    color: palette[themeTypes.dark].buttons.white.color,
    '&:hover, &focus, &:active': {
      color: `${palette[themeTypes.dark].buttons.white.hover.color} !important`,
      '& svg, & i': {
        color: `${
          palette[themeTypes.dark].buttons.white.hover.color
        } !important`
      }
    }
  }
}))(
  forwardRef(
    (
      {
        iconClassName,
        tooltipContainerClassName,
        icon = null,
        children,
        classes: {
          iconColor,
          filledButton,
          outlineButton,
          filledDarkButton,
          filledLightButton,
          outlineDarkButton,
          outlineLightButton,
          ...classes
        },
        className,
        variant = 'dafault',
        staticThemeType,
        disabled,
        opaque,
        filledVariant = '',
        progress,
        tooltipText,
        tooltipPlacement = 'top',
        ...props
      },
      ref
    ) => {
      const ApplyTooltip = useCallback(
        ({ children }) => {
          return tooltipText ? (
            <div className={tooltipContainerClassName}>
              <Tooltip
                arrow
                title={tooltipText}
                placement={tooltipPlacement}
                disableHoverListener={!tooltipText}
              >
                {children}
              </Tooltip>
            </div>
          ) : (
            <>{children}</>
          )
        },
        [tooltipText, tooltipPlacement, tooltipContainerClassName]
      )

      return (
        <ApplyTooltip>
          <Button
            ref={ref}
            classes={classes}
            disabled={disabled || progress}
            {...props}
            className={classNames(className, {
              'hvr-radial-out--danger': variant === 'danger',
              'hvr-radial-out--info': variant === 'info',
              'hvr-radial-out--accent': variant === 'accent',
              'hvr-radial-out--accent-filled':
                variant === 'primary' && filledVariant === 'accent',
              'hvr-radial-out--primary': variant === 'primary',
              [filledButton]: variant === 'primary',
              [outlineButton]: variant !== 'primary',
              'hvr-radial-out': !disabled,
              opaqueEl: opaque,
              [filledLightButton]:
                staticThemeType === themeTypes.light && variant === 'primary',
              [filledDarkButton]:
                staticThemeType === themeTypes.dark && variant === 'primary',
              [outlineLightButton]:
                staticThemeType === themeTypes.light && variant !== 'primary',
              [outlineDarkButton]:
                staticThemeType === themeTypes.dark && variant !== 'primary'
            })}
          >
            {progress ? (
              <CircularProgress size={18} />
            ) : (
              <>
                {iconClassName != null && (
                  <i className={classNames(iconColor, iconClassName)} />
                )}
                {icon}
                {children}
              </>
            )}
          </Button>
        </ApplyTooltip>
      )
    }
  )
)

export const BlueButton = forwardRef((props, ref) => (
  <WhiteButton ref={ref} variant="primary" {...props} />
))

export const CircleIconButton = withStyles(theme => {
  const { palette, type } = theme
  return {
    label: {
      lineHeight: 1,
      marginBottom: '-2px'
    },
    root: {
      color: palette[type].buttons.iconButton.color,
      '&:disabled': {
        color: `${palette[type].buttons.iconButton.color}50`
      },
      '& > span > .fa': {
        fontSize: '20px'
      }
    }
  }
})(IconButton)

export const CircleLibraryIconButton = withStyles(theme => {
  const { colors } = theme
  return {
    label: {
      lineHeight: 1,
      marginBottom: '-2px'
    },
    root: {
      color: '#afb7c7',

      '&:hover, &.active': {
        color: colors.highlight
      }
    }
  }
})(({ active, rootClassName = '', ...props }) => {
  return (
    <IconButton
      {...props}
      className={classNames('hvr-grow', { active: active }, rootClassName)}
    />
  )
})

export const TabToggleButton = withStyles(
  ({
    palette,
    type,
    typography,
    fontSize,
    fontWeight,
    lineHeight,
    colors
  }) => ({
    root: {
      ...typography.lightText[type],
      height: '25px',
      border: `1px solid ${palette[type].tabs.toggleButton.border} !important`,
      fontSize: fontSize.small,
      lineHeight: lineHeight.small,
      fontWeight: fontWeight.normal,
      borderRadius: '100px',
      textTransform: 'capitalize',
      background: palette[type].tabs.toggleButton.background,

      '&:not(:last-child)': {
        borderRight: 'none'
      }
    },
    selected: {
      borderColor: `${colors.highlight} !important`,
      backgroundColor: `${colors.highlight} !important`,
      color: '#fff !important',
      fontWeight: 'bold'
    }
  })
)(ToggleButton)

export const FabBlueButton = withStyles({
  root: {
    background: '#0076b9',
    color: '#fff',

    '&:hover': {
      background: '#006198'
    }
  },
  label: {
    textTransform: 'capitalize',
    color: 'inherit'
  },
  disabled: {
    color: '#fff !important',
    background: '#0076b9 !important',
    opacity: 0.5
  }
})(({ className, opaque, children, ...rest }) => (
  <Fab className={classNames(className, { opaqueEl: opaque })} {...rest}>
    {children}
  </Fab>
))

export const WeekSelectGroup = withStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    boxShadow: 'none'
  }
})(ToggleButtonGroup)

export const WeekSelectButton = withStyles({
  root: {
    width: '55px',
    height: '22px',
    paddingTop: 0,
    paddingBottom: 0,
    border: '1px solid #e4e9f3',
    fontSize: '12px',
    textTransform: 'uppercase',
    borderRadius: '2px !important',
    backgroundColor: '#fff',
    color: '#606066'
  },
  selected: {
    borderColor: '#41cb71 !important',
    backgroundColor: '#41cb71 !important',
    color: '#fff !important'
  }
})(ToggleButton)

export const DirectionToggleButtonGroup = withStyles(theme => {
  const { palette, type } = theme
  return {
    root: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: palette[type].sideModal.background,
      borderRadius: '4px',
      boxShadow: 'none'
    }
  }
})(ToggleButtonGroup)

export const DirectionToggleButton = withStyles(theme => {
  const { palette, type, shapes, colors } = theme
  return {
    root: {
      width: '42px',
      minWidth: '42px',
      height: shapes.height.primary,
      border: `1px solid ${palette[type].formControls.input.border}`,
      fontSize: '12px',
      color: palette[type].directionToggle.color,
      borderRadius: '4px',
      textTransform: 'capitalize',

      '&:not(:last-child)': {
        borderRight: 'none'
      }
    },
    selected: {
      borderColor: `${colors.highlight} !important`,
      backgroundColor: `${colors.highlight} !important`,
      color: '#fff !important'
    }
  }
})(ToggleButton)

export const TransparentButton = withStyles({
  root: {
    background: 'transparent',
    color: '#74809a',

    '&:hover': {
      borderColor: '#006198',
      color: '#006198'
    }
  },
  label: {
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'capitalize',
    color: 'inherit'
  }
})(Button)

export const TextButton = withStyles({
  root: {
    background: 'transparent',
    border: 'transparent',
    width: 'fit-content',
    height: 'fit-content',
    cursor: 'pointer'
  }
})(({ classes, children, ...props }) => (
  <button className={classes.root} {...props}>
    {children}
  </button>
))
