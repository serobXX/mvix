import React from 'react'

import {
  withStyles,
  ListItem,
  ListItemText,
  ListItemIcon,
  Grid,
  withTheme,
  makeStyles
} from '@material-ui/core'
import classNames from 'classnames'

import '/src/styles/dropdowns/_dropdown.scss'

const styles = theme => {
  const { palette, type } = theme
  return {
    menu: {
      background: palette[type].dropdown.background,
      boxShadow: `0 2px 4px 0 ${palette[type].dropdown.shadow}`,
      border: `1px solid ${palette[type].dropdown.borderColor}`,

      '&::before': {
        borderColor: `transparent transparent ${palette[type].dropdown.background} transparent`
      },

      '&::after': {
        borderColor: `transparent transparent ${palette[type].dropdown.borderColor} transparent`
      }
    }
  }
}

const DropdownHover = withStyles(styles)(
  ({
    classes,
    MenuComponent,
    ButtonComponent,
    visibleOnInit = false,
    buttonHoverColored,
    dropSide = 'bottomLeft',
    dropdownContainerClassName = '',
    menuContainerClassName = '',
    buttonWrapClassName = '',
    menuClassName = '',
    menuClasses = '',
    forceHidden = false,
    showBackdrop = false
  }) => {
    const isBottom = ['bottomRight', 'bottomCenter', 'bottomLeft'].includes(
      dropSide
    )
    const isTop = ['topRight', 'topCenter', 'topLeft'].includes(dropSide)
    return (
      <>
        <div
          className={classNames(
            'Dropdown-hover__container',
            dropdownContainerClassName,
            {
              'Dropdown-hover__container--force-hidden': forceHidden,
              'Dropdown-hover__container--visible': visibleOnInit,
              'Dropdown-hover__container--backdrop': showBackdrop
            }
          )}
        >
          <div
            className={classNames(
              'Dropdown-hover--button',
              buttonWrapClassName,
              {
                'colored-button': buttonHoverColored
              }
            )}
          >
            {ButtonComponent}
          </div>
          <div
            className={classNames(
              'Dropdown-hover--menu-container',
              menuContainerClassName,
              {
                'Dropdown-hover--menu-container-bottom': isBottom,
                'Dropdown-hover--menu-container-top': isTop,
                'drop-bottom-right': dropSide === 'bottomRight',
                'drop-bottom-center': dropSide === 'bottomCenter',
                'drop-right-center': dropSide === 'rightCenter'
              }
            )}
          >
            <Grid
              className={classNames(
                `Dropdown-hover--menu ${menuClassName}`,
                classes.menu,
                {
                  'Dropdown-hover--menu-bottom': isBottom,
                  'Dropdown-hover--menu-top': isTop
                },
                menuClasses
              )}
            >
              {MenuComponent}
            </Grid>
          </div>
        </div>
        {showBackdrop && <div className={'Dropdown-hover--backdrop'} />}
      </>
    )
  }
)

const useDropdownButtonStyles = makeStyles({
  root: {
    paddingTop: '10px',
    paddingBottom: '10px',
    border: 'none',
    '& i': {
      color: ({ palette, themeType }) =>
        `${palette.buttons.secondary[themeType].borderColor} !important`
    },
    '&:before': {
      left: '-12.5%'
    },
    '&:first-child': {
      borderRadius: '8px 8px 0 0'
    },

    '&:not(:last-child)': {
      borderBottom: ({ palette, themeType }) =>
        `1px solid ${palette.buttons.secondary.hover[themeType].borderColor}`
    },

    '&:last-child': {
      borderRadius: '0 0 8px 8px'
    },

    '&:hover': {
      cursor: 'pointer',
      color: ({ palette, themeType, type }) =>
        themeType === 'theme2' && type === 'dark'
          ? `${palette[type].buttons.white.hover.color} !important`
          : `${palette.buttons.secondary.hover[themeType].color} !important`,
      '& i': {
        color: ({ palette, themeType, type }) =>
          themeType === 'theme2' && type === 'dark'
            ? `${palette[type].buttons.white.hover.color} !important`
            : `${palette.buttons.secondary.hover[themeType].color} !important`
      }
    },
    color: ({ palette, themeType }) =>
      `${palette.buttons.secondary[themeType].color} !important`,
    background: ({ palette, themeType, type }) =>
      themeType === 'theme2' && type === 'dark'
        ? `${palette[type].buttons.white.background} !important`
        : `${palette.buttons.secondary[themeType].background} !important`,
    borderColor: ({ palette, themeType }) =>
      `${palette.buttons.secondary[themeType].borderColor} !important`
  }
})

const DropdownButtonListItem = withTheme(
  ({
    className = '',
    variant = 'primary',
    theme: { palette, type },
    onClick = f => f,
    ...props
  }) => {
    const themeType =
      variant === 'danger'
        ? 'theme2'
        : variant === 'info'
        ? 'theme3'
        : variant === 'accent'
        ? 'theme4'
        : 'theme1'

    const classes = useDropdownButtonStyles({ themeType, palette, type })

    return (
      <ListItem
        onClick={!props.disabled && onClick}
        className={classNames(className, 'hvr-radial-out', classes.root, {
          'hvr-radial-out--danger': variant === 'danger',
          'hvr-radial-out--info': variant === 'info',
          'hvr-radial-out--accent': variant === 'accent',
          'hvr-radial-out--primary': variant === 'primary'
        })}
        {...props}
      />
    )
  }
)

const DropdownHoverListItem = withStyles(({ palette, type, fontWeight }) => ({
  root: {
    paddingTop: '10px',
    paddingBottom: '10px',
    color: palette[type].dropdown.listItem.color,
    border: 'none',
    background: palette[type].dropdown.listItem.background,
    height: 47,

    '&:first-child': {
      borderRadius: '8px 8px 0 0'
    },

    '&:not(:last-child)': {
      borderBottom: `1px solid ${palette[type].dropdown.listItem.border}`
    },

    '&:last-child': {
      borderRadius: '0 0 8px 8px'
    },

    '&:hover': {
      cursor: 'pointer',
      backgroundColor: palette[type].dropdown.listItem.hover.background,
      color: palette[type].dropdown.listItem.hover.color,

      '& span': {
        fontWeight: fontWeight.bold
      }
    }
  }
}))(ListItem)

const DropdownHoverListItemText = withStyles(
  ({ fontSize, fontWeight, lineHeight }) => ({
    root: {
      padding: '5px 0 0 10px'
    },
    primary: {
      fontSize: fontSize.primary,
      lineHeight: lineHeight.primary,
      fontWeight: fontWeight.normal,
      color: 'inherit'
    }
  })
)(({ classes, rootClassName = '', ...props }) => (
  <ListItemText
    classes={{
      ...classes,
      root: classNames(classes.root, rootClassName)
    }}
    {...props}
  />
))

const DropdownHoverListItemIcon = withStyles({
  root: {
    marginRight: 0,
    fontSize: '22px',
    color: '#74809a'
  }
})(ListItemIcon)

export {
  DropdownHover,
  DropdownHoverListItem,
  DropdownHoverListItemText,
  DropdownHoverListItemIcon,
  DropdownButtonListItem
}
