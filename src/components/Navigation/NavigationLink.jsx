import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import classNames from 'classnames'
import { makeStyles } from '@material-ui/core'

import {
  withStyles,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@material-ui/core'
import { DropdownHover } from 'components/dropdowns'
import Scrollbars from 'components/Scrollbars'
import { compareByProperty } from 'utils/sort'
import { parseToAbsolutePath } from 'utils/urlUtils'

const styles = ({
  palette,
  type,
  colors,
  typography,
  fontSize,
  lineHeight,
  fontWeight
}) => ({
  navigationLinkWrap: {
    display: 'flex',
    alignItems: 'stretch',
    margin: '0 0.5rem',
    cursor: 'pointer',
    position: 'relative',

    '&:hover': {
      paddingBottom: 0
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      height: '3px',
      transition: 'width .3s',
      width: '0',
      pointerEvents: 'none'
    },

    '&:hover::after': {
      width: '100%'
    },

    '& > *:first-child::after': {
      backgroundColor: colors.error
    }
  },
  navigationItemIcon: {
    fontSize: 25,
    marginRight: '0.5rem'
  },
  navigationItemText: {},
  dropdownContainer: {
    display: 'flex',
    alignItems: 'stretch'
  },
  dropdownButton: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    textTransform: 'capitalize'
  },
  navigationText: {
    ...typography.lightText[type],
    fontSize: fontSize.secondary,
    lineHeight: lineHeight.secondary,
    fontWeight: fontWeight.normal,
    display: 'flex',
    alignItems: 'center'
  },
  navigationSubMenu: {
    top: '70%',
    transform: 'rotateX(90deg)',
    transformOrigin: 'top center',
    transitionDuration: '.5s'
  },
  navigationSubMenuList: {
    padding: '0px',
    position: 'relative',
    overflowY: 'visible',
    display: 'grid',
    gridGap: '6px'
  },
  navigationHoverCard: {
    backgroundColor: palette[type].body.background,
    borderRadius: '10px',
    position: 'absolute',
    top: 0,
    left: 0,
    transitionDuration: '0.7s',
    width: '255px'
  },
  navigationSubMenuItem: {
    padding: '2px 0 0',
    margin: '0px'
  },
  navigationSubMenuText: {
    ...typography.lightText[type],
    fontSize: fontSize.primary,
    lineHeight: lineHeight.primary,
    fontWeight: 600,
    transition: 'opacity .3s',
    whiteSpace: 'nowrap'
  },
  navigationSubMenuDescriptionText: {
    ...typography.lightText[type],
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    lineClamp: 2,
    boxOrient: 'vertical'
  },
  subMenuItem: {
    padding: 10,
    minHeight: 90,
    alignItems: 'flex-start',

    '&:hover $subMenuIcon': {
      opacity: 1
    }
  },
  subMenuIcon: {
    fontSize: '25px',
    opacity: 0.8,
    transition: 'opacity .3s',
    paddingTop: '5px',
    width: 30,
    height: 30,
    textAlign: 'center'
  },
  subMenuIconActive: {
    opacity: 1
  },
  scrollbarRoot: {
    maxHeight: 'calc(100vh - 100px)'
  },
  navigationSubMegaMenu: {
    padding: '20px'
  },
  dropdownLink: {
    color: 'unset',
    textDecoration: 'unset',
    display: 'flex',
    height: '100%'
  }
})

const dynamicStyles = makeStyles({
  navigationLinkWrap: {
    '&::after': {
      backgroundColor: ({ navColor }) => navColor
    }
  },
  navigationSubMenuList: {
    gridTemplateColumns: ({ navCols }) =>
      `repeat(${navCols},calc((100% - 12px)/${navCols}))`
  },
  navigationSubMenuText: {
    color: ({ navColor }) => navColor + ' !important'
  }
})

const dropdownFadeTransition = 500

const NavigationLink = ({
  t,
  classes,
  withIcon = true,
  url = '/',
  color = 'black',
  linkText = '',
  linkIconClassName = '',
  menuItems = [],
  cols = 1
}) => {
  const location = useLocation()
  const [hidingDropdown, setHidingDropdown] = useState(false)
  const [hoverCard, setHoverCard] = useState({
    height: '90px',
    transform: 'translate(0px, 0px)'
  })

  const dynamicClasses = dynamicStyles({
    navColor: color,
    navCols: cols
  })

  const onMouseOver = useCallback(
    index => {
      const x = (index % cols) * 255
      const y = Math.floor(index / cols) * 96
      setHoverCard({
        height: '90px',
        transform: `translate(${x}px, ${y}px)`
      })
    },
    [cols]
  )

  const onResetMouseHover = useCallback(() => {
    setHoverCard({
      height: '0px',
      transform: `translate(0px, 0px)`
    })
  }, [])

  const menuItemsSorted = useMemo(() => {
    return menuItems.sort((a, b) => compareByProperty(a, b, 'label'))
  }, [menuItems])

  const menuItemsToRender = useMemo(() => {
    return menuItemsSorted.filter(item =>
      item.hasOwnProperty('render') ? item.render : true
    )
  }, [menuItemsSorted])

  const handleMouseOver = useCallback(() => {
    const resultIndex = menuItemsToRender.findIndex(items =>
      items.exact === false
        ? location.pathname.includes(items.linkTo)
        : parseToAbsolutePath(items.linkTo) === location.pathname
    )
    if (resultIndex !== -1) {
      onMouseOver(resultIndex)
    } else {
      onResetMouseHover()
    }
  }, [location.pathname, menuItemsToRender, onMouseOver, onResetMouseHover])

  useEffect(() => {
    handleMouseOver()
    //eslint-disable-next-line
  }, [location, onMouseOver, menuItemsSorted, onResetMouseHover])

  const onLinkClick = () => {
    setHidingDropdown(true)
    setTimeout(() => {
      setHidingDropdown(false)
    }, 2 * dropdownFadeTransition)
  }

  const scrollHeight = useMemo(() => {
    return 96 * Math.ceil(menuItemsToRender.length / cols) + 40
    // eslint-disable-next-line
  }, [menuItemsToRender, cols])

  return (
    <div
      className={classNames(
        classes.navigationLinkWrap,
        dynamicClasses.navigationLinkWrap
      )}
    >
      <DropdownHover
        forceHidden={hidingDropdown}
        dropSide="bottomRight"
        menuContainerClassName={classes.navigationSubMenu}
        dropdownContainerClassName={classes.dropdownContainer}
        buttonWrapClassName={classes.dropdownButton}
        ButtonComponent={
          <RouterLink to={url} className={classes.dropdownLink}>
            <Typography className={classNames(classes.navigationText)}>
              {withIcon && (
                <i
                  className={classNames(
                    linkIconClassName,
                    classes.navigationItemIcon
                  )}
                  style={{ color }}
                />
              )}
              <span className={classes.navigationItemText}>{linkText}</span>
            </Typography>
          </RouterLink>
        }
        MenuComponent={
          <Scrollbars
            className={classes.scrollbarRoot}
            style={{
              height: scrollHeight,
              width: 280 * cols + (cols === 1 ? 15 : 0)
            }}
            onMouseLeave={handleMouseOver}
          >
            <div className={classes.navigationSubMegaMenu}>
              <List
                className={classNames(
                  classes.navigationSubMenuList,
                  dynamicClasses.navigationSubMenuList
                )}
              >
                <div
                  className={classes.navigationHoverCard}
                  style={{
                    height: hoverCard.height,
                    transform: hoverCard.transform
                  }}
                />
                {menuItemsToRender.map((item, index) => (
                  <ListItem
                    className={classes.subMenuItem}
                    key={item + index}
                    component={RouterLink}
                    onClick={onLinkClick}
                    to={item.linkTo}
                    disableGutters
                    onMouseOver={() => onMouseOver(index)}
                  >
                    {(item.iconClassName || item.icon) && (
                      <ListItemIcon>
                        {item.iconClassName ? (
                          <i
                            style={{ color }}
                            className={classNames(
                              item.iconClassName,
                              classes.subMenuIcon,
                              {
                                [classes.subMenuIconActive]:
                                  location.pathname === item.linkTo
                              }
                            )}
                          />
                        ) : (
                          item.icon && (
                            <item.icon
                              style={{ color }}
                              className={classNames(
                                item.iconClassName,
                                classes.subMenuIcon,
                                {
                                  [classes.subMenuIconActive]:
                                    location.pathname === item.linkTo
                                }
                              )}
                            />
                          )
                        )}
                      </ListItemIcon>
                    )}
                    <ListItemText
                      className={classes.navigationSubMenuItem}
                      primary={item.label}
                      secondary={
                        <>
                          {item.description}
                          {item.printSystem && <b> ({t('System')}).</b>}
                        </>
                      }
                      primaryTypographyProps={{
                        className: classNames(
                          classes.navigationSubMenuText,
                          dynamicClasses.navigationSubMenuText
                        )
                      }}
                      secondaryTypographyProps={{
                        className: classes.navigationSubMenuDescriptionText
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </div>
          </Scrollbars>
        }
      />
    </div>
  )
}

export default withStyles(styles)(NavigationLink)
