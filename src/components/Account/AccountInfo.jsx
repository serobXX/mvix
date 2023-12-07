import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import classNames from 'classnames'
import {
  withStyles,
  Avatar,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles
} from '@material-ui/core'
import { useDispatch } from 'react-redux'
import { Brightness4, BrightnessAuto } from '@material-ui/icons'

import Scrollbars from 'components/Scrollbars'
import { DropdownHover } from 'components/dropdowns'
import HoverMenuList from './HoverMenuList'
import eventNames from 'constants/eventNames'
import { setProfileOpened, setTheme } from 'slices/appSlice'
import { themeTypes } from 'constants/ui'
import { storageSetItem } from 'utils/storage'
import localStorageItems from 'constants/localStorageItems'
import iconNames, { iconTypes } from 'constants/iconNames'
import { routes } from 'constants/routes'
import useUser from 'hooks/useUser'
import { isUserProfileValid } from 'utils/profileUtils'

const styles = theme => {
  const {
    palette,
    type,
    typography,
    fontSize,
    lineHeight,
    fontWeight,
    spacing
  } = theme
  return {
    accountInfoWrap: {
      display: 'flex',
      alignItems: 'stretch',
      marginLeft: '0.5rem',
      paddingLeft: '1rem',
      borderLeftWidth: 1,
      borderLeftStyle: 'solid',
      borderLeftColor: palette[type].secondary
    },
    subMenu: {
      top: '80%',
      transform: 'rotateX(90deg)',
      transformOrigin: 'top center'
    },
    actionBtnLink: {
      display: 'flex',
      cursor: 'pointer'
    },
    actionBtnIcon: {
      fontSize: '25px',
      opacity: 0.8,
      transition: 'opacity .2s',
      paddingTop: '5px'
    },
    actionBtnThemeIcon: {
      padding: '3px 0'
    },
    languagesBtnLink: {
      cursor: 'pointer'
    },
    avatar: {
      margin: 10
    },
    userName: {
      ...typography.lightText[type],
      fontSize: fontSize.secondary,
      lineHeight: lineHeight.secondary,
      fontWeight: fontWeight.normal,
      '&:hover': {
        textShadow: `0 0 1px ${typography.lightText[type].color}`
      }
    },
    text: {
      ...typography.lightText[type],
      fontSize: fontSize.primary,
      lineHeight: lineHeight.primary,
      fontWeight: 600,
      transition: 'opacity .2s',
      whiteSpace: 'nowrap'
    },
    description: {
      ...typography.lightText[type],
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      lineClamp: 2,
      boxOrient: 'vertical'
    },
    textRoot: {
      padding: '2px 0 0',
      margin: '0px'
    },
    flag: {
      width: 30,
      marginTop: '5px',
      filter: 'grayscale(100%)'
    },
    listContainer: {
      padding: '0px',
      position: 'relative',
      overflowY: 'visible',
      display: 'grid',
      gridGap: '6px'
    },
    switchListItem: {
      height: '3em'
    },
    listItem: {
      padding: 10,
      maxHeight: 90,
      alignItems: 'flex-start',
      '&:hover $actionBtnIcon $subMenuIcon': {
        opacity: 1
      }
    },
    subMenuIcon: {
      fontSize: '25px',
      opacity: 0.8,
      transition: 'opacity .3s',
      paddingTop: '5px',
      marginRight: spacing(2),
      width: 30,
      height: 30,
      textAlign: 'center'
    },
    dropdownTrigger: {
      cursor: 'pointer'
    },
    switchListItemText: {
      cursor: 'pointer'
    },
    switchSet: {
      marginLeft: -18
    },
    scrollbarRoot: {
      maxHeight: 'calc(100vh - 100px)'
    },
    navigationSubMegaMenu: {
      padding: '20px'
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
    subItemRow: {
      gridColumn: '1/3',
      display: 'flex',
      gridGap: 6,
      marginBottom: 10
    },
    disabled: {
      opacity: 0.5,
      pointerEvents: 'none'
    }
  }
}

const dynamicStyles = makeStyles({
  listContainer: {
    gridTemplateColumns: ({ navCols }) =>
      `repeat(${navCols},calc((100% - 12px)/${navCols}))`
  },
  text: {
    color: ({ navColor }) => navColor + ' !important'
  },
  icon: {
    color: ({ navColor }) => navColor + ' !important'
  },
  scrollbarRoot: {
    width: ({ navCols }) => `${280 * navCols}px !important`
  }
})

const dropdownFadeTransition = 500

const AccountInfo = ({
  classes,
  userProfile,
  currentTheme,
  cols = 2,
  color = '#90a4ae'
}) => {
  const dispatch = useDispatch()
  const location = useLocation()
  const [hidingDropdown, setHidingDropdown] = useState(false)
  const [hoverCard, setHoverCard] = useState({
    height: '90px',
    transform: 'translate(0px, 0px)'
  })
  const [themeHoverCard, setThemeHoverCard] = useState({
    height: 46,
    transform: 'translate(0px, 0px)'
  })
  const { role, data: user } = useUser()

  const defaultProfileImage = useMemo(() => {
    // timestamp added to break the cache when the profile image updated
    // there is no need to add timestamp for AWS pre-signed link

    return userProfile.userPic || ''
  }, [userProfile])

  const [profile, setProfile] = useState(defaultProfileImage)

  const dynamicClasses = dynamicStyles({
    navColor: color,
    navCols: cols
  })

  const onMouseOver = useCallback(
    (index, subIndex = -1) => {
      if (subIndex >= 0) {
        const x = (subIndex % 3) * 170
        setThemeHoverCard({
          height: 46,
          width: 170,
          transform: `translate(${x}px, 0px)`
        })
        return
      }
      const x = (index % cols) * 255
      const y = Math.floor(index / cols) * 96
      setHoverCard({
        height: 90,
        transform: `translate(${x}px, ${y}px)`
      })
    },
    [cols]
  )

  useEffect(() => {
    setProfile(defaultProfileImage)
  }, [setProfile, defaultProfileImage])

  const logoutUser = useCallback(() => {
    document.dispatchEvent(
      new CustomEvent(eventNames.logout, { detail: { fromLogout: true } })
    )
  }, [])

  const handleProfileShow = useCallback(() => {
    dispatch(setProfileOpened(true))
  }, [dispatch])

  const handleChangeTheme = useCallback(
    themeType => () => {
      dispatch(setTheme(themeType))
      storageSetItem(localStorageItems.theme, themeType)
      // updateUserDetails({
      //   themeMode: themeType
      // })
    },
    [dispatch]
  )

  const themeMenuItems = useMemo(() => {
    return [
      {
        type: 'row',
        render: true,
        items: [
          {
            onLinkClick: handleChangeTheme(themeTypes.light),
            text: `Light Theme`,
            theme: 'light',
            icon: (
              <Brightness4
                style={{ color }}
                className={classes.actionBtnThemeIcon}
              />
            ),
            closeDropDownOnClick: false
          },
          {
            onLinkClick: handleChangeTheme(themeTypes.dark),
            text: `Dark Theme`,
            theme: 'dark',
            icon: (
              <Brightness4
                style={{ color }}
                className={classes.actionBtnThemeIcon}
              />
            ),
            closeDropDownOnClick: false
          },
          {
            onLinkClick: handleChangeTheme(themeTypes.auto),
            text: `Auto Theme`,
            theme: 'auto',
            icon: (
              <BrightnessAuto
                style={{ color }}
                className={classes.actionBtnThemeIcon}
              />
            ),
            closeDropDownOnClick: false
          }
        ]
      }
    ]
  }, [classes.actionBtnThemeIcon, color, handleChangeTheme])

  const menuItems = useMemo(
    () => [
      {
        onLinkClick: handleProfileShow,
        text: 'Profile',
        description: 'Manage your individual profile, Connect Gmail.',
        iconClassName: classNames(
          iconTypes.sharp,
          iconTypes.regular,
          iconNames.profile
        ),
        render: true
      },
      {
        url: routes.settings.root,
        text: 'Settings',
        description: 'Setup account settings payment processor.',
        iconClassName: classNames(
          iconTypes.sharp,
          iconTypes.regular,
          iconNames.setting
        ),
        render: role.isSystem,
        disabled: !isUserProfileValid(user)
      },
      {
        onLinkClick: logoutUser,
        text: 'Logout',
        description: 'Logout from current session to secure your account.',
        iconClassName: classNames(
          iconTypes.sharp,
          iconTypes.regular,
          iconNames.logout
        ),
        render: true
      }
    ],
    [logoutUser, role.isSystem, handleProfileShow, user]
  )

  const onResetMouseHover = useCallback(() => {
    setHoverCard({
      height: '0px',
      transform: `translate(0px, 0px)`
    })
  }, [])

  const onResetThemeMouseHover = useCallback(() => {
    setThemeHoverCard({
      height: '0px',
      transform: `translate(0px, 0px)`
    })
  }, [])

  const setDefaultMouseHoverPosition = useCallback(() => {
    const result = menuItems.find(items => items.url === location.pathname)
    const resultIndex = menuItems
      .filter(itemList => itemList.render)
      .findIndex(items => items.url === location.pathname)
    const themeSubIndex = themeMenuItems[0].items.findIndex(
      item => item.theme === currentTheme
    )

    if (currentTheme) {
      onMouseOver(null, themeSubIndex)
    } else {
      onResetThemeMouseHover()
    }
    if (result) {
      onMouseOver(resultIndex)
    } else {
      onResetMouseHover()
    }
  }, [
    location,
    onMouseOver,
    menuItems,
    themeMenuItems,
    onResetMouseHover,
    onResetThemeMouseHover,
    currentTheme
  ])

  useEffect(() => {
    setDefaultMouseHoverPosition()
  }, [
    location,
    onMouseOver,
    menuItems,
    onResetMouseHover,
    currentTheme,
    setDefaultMouseHoverPosition
  ])

  const scrollHeight = useMemo(() => {
    const filterMenu = menuItems.filter(item =>
      item.hasOwnProperty('render') ? item.render : true
    )

    return 96 * Math.ceil(filterMenu.length / cols) + 85
    // eslint-disable-next-line
  }, [menuItems])

  const onLinkClick = useCallback(
    (onClick, closeDropDown, isLink) => e => {
      !isLink && e.preventDefault()
      onClick && onClick()
      if (closeDropDown) {
        setHidingDropdown(true)
        setTimeout(() => {
          setHidingDropdown(false)
        }, 2 * dropdownFadeTransition)
      }
    },
    []
  )

  const renderListItem = useCallback(
    ({
      type,
      text,
      index,
      onClick,
      closeDropDownOnClick,
      url,
      subIndex,
      icon,
      iconClassName,
      description,
      disabled
    }) => {
      const onMouseOverByType = () => {
        return type === 'row'
          ? onMouseOver(index, subIndex)
          : onMouseOver(index)
      }
      return (
        <ListItem
          key={text + index}
          className={classNames(classes.listItem, {
            [classes.disabled]: disabled
          })}
          component={RouterLink}
          onClick={onLinkClick(onClick, closeDropDownOnClick, !!url)}
          to={url || '#'}
          disableGutters
          onMouseOver={() => onMouseOverByType(type)}
        >
          {iconClassName ? (
            <i
              className={classNames(
                iconClassName,
                classes.subMenuIcon,
                dynamicClasses.icon
              )}
            />
          ) : (
            <ListItemIcon className={classes.icon}>{icon}</ListItemIcon>
          )}

          <ListItemText
            classes={{
              root: classes.textRoot,
              primary: classNames(classes.text, dynamicClasses.text),
              secondary: classes.description
            }}
            primary={text}
            secondary={<>{description && description}</>}
          />
        </ListItem>
      )
    },
    [classes, dynamicClasses, onLinkClick, onMouseOver]
  )

  return (
    <div className={classes.accountInfoWrap}>
      <DropdownHover
        forceHidden={hidingDropdown}
        menuContainerClassName={classes.subMenu}
        ButtonComponent={
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            className={classes.dropdownTrigger}
          >
            <Avatar
              alt={userProfile.userName}
              src={profile}
              children={userProfile.userName[0].toUpperCase()}
              onError={() => setProfile('')}
              className={classes.avatar}
            />
            <Typography component="span" className={classes.userName}>
              {userProfile.userName}
            </Typography>
          </Grid>
        }
        MenuComponent={
          <Scrollbars
            className={classNames(
              classes.scrollbarRoot,
              dynamicClasses.scrollbarRoot
            )}
            style={{
              height: scrollHeight
            }}
            onMouseLeave={() => setDefaultMouseHoverPosition()}
          >
            <div className={classes.navigationSubMegaMenu}>
              <List
                onMouseLeave={() => setDefaultMouseHoverPosition()}
                component="nav"
                className={classNames(
                  classes.listContainer,
                  dynamicClasses.listContainer
                )}
              >
                <div
                  className={classes.navigationHoverCard}
                  style={{
                    ...(themeHoverCard.width
                      ? { width: themeHoverCard.width }
                      : {}),
                    height: themeHoverCard.height,
                    transform: themeHoverCard.transform
                  }}
                />
                <HoverMenuList
                  classes={classes}
                  menuItems={themeMenuItems}
                  renderListItem={renderListItem}
                />
              </List>

              <List
                component="nav"
                className={classNames(
                  classes.listContainer,
                  dynamicClasses.listContainer
                )}
              >
                <div
                  className={classes.navigationHoverCard}
                  style={{
                    ...(hoverCard.width ? { width: hoverCard.width } : {}),
                    height: hoverCard.height,
                    transform: hoverCard.transform
                  }}
                />
                <HoverMenuList
                  classes={classes}
                  menuItems={menuItems}
                  renderListItem={renderListItem}
                />
              </List>
            </div>
          </Scrollbars>
        }
      />
    </div>
  )
}

export default withStyles(styles)(AccountInfo)
