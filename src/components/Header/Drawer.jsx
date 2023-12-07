import React, { useMemo, useState, useCallback, useEffect } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import classNames from 'classnames'
import {
  withStyles,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  makeStyles
} from '@material-ui/core'

import DrawerIcon from 'components/icons/DrawerIcon'
import { DropdownHover } from 'components/dropdowns'
import Scrollbars from 'components/Scrollbars'
import { compareByProperty } from 'utils/sort'
import { colors } from '../../theme'
import { routes } from 'constants/routes'
import useUserPermissionGroupsByType from 'hooks/useUserPermissionGroupsByType'
import {
  permissionGroupNames,
  permissionTypes,
  systemDictionaryPermissionGroup
} from 'constants/permissionGroups'
import { parseToAbsolutePath } from 'utils/urlUtils'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'
import useUser from 'hooks/useUser'
import { ADMINISTRATOR } from 'constants/roleConstants'

const styles = theme => {
  const { palette, type, typography, fontSize, lineHeight, colors } = theme
  return {
    iconButtonWrapper: {
      marginRight: '1rem',
      paddingRight: '0.5rem',
      borderRightWidth: 1,
      borderRightStyle: 'solid',
      borderRightColor: palette[type].secondary
    },
    navigationSubMenu: {
      top: '80%',
      transform: 'rotateX(90deg)',
      transformOrigin: 'top center'
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
    navigationSubMenuList: {
      padding: '0px',
      position: 'relative',
      overflowY: 'visible',
      display: 'grid',
      gridGap: '6px'
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
      transition: 'opacity .2s',
      whiteSpace: 'nowrap',
      color: colors.highlight
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
      height: 90,
      alignItems: 'flex-start',
      '&:hover $subMenuIcon': {
        opacity: 1
      }
    },
    subMenuIcon: {
      fontSize: '25px',
      opacity: 0.8,
      transition: 'opacity .2s',
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
    }
  }
}

const dynamicStyles = makeStyles({
  navigationSubMenuList: {
    gridTemplateColumns: ({ navCols }) =>
      `repeat(${navCols},calc((100% - 12px)/${navCols}))`
  },
  navigationSubMenuText: {
    color: ({ navColor }) => navColor + ' !important'
  }
})

const dropdownFadeTransition = 500

const Drawer = ({
  t,
  classes,
  customClass,
  color = colors.highlight,
  disabled
}) => {
  const location = useLocation()
  const { role } = useUser(true)
  const readGroups = useUserPermissionGroupsByType(permissionTypes.read)

  const [hidingDropdown, setHidingDropdown] = useState(false)
  const [isHovering, setHoverState] = useState(false)
  const [hoverCard, setHoverCard] = useState({
    height: '90px',
    transform: 'translate(0px, 0px)'
  })

  const menuItems = useMemo(
    () => [
      {
        url: routes.users.list,
        linkText: 'User Management',
        description: 'Add new users to your account & manage permissions.',
        iconClassName: getIconClassName(iconNames.user),
        render: readGroups.includes(permissionGroupNames.user)
      },
      {
        url: routes.products.list,
        linkText: 'Products',
        description: 'Add & manage products for use in estimates',
        iconClassName: getIconClassName(iconNames.product),
        render: readGroups.includes(permissionGroupNames.product)
      },
      {
        url: routes.tags.list,
        linkText: 'Tags',
        description: 'Add and manage tags for use in filtering & reports.',
        iconClassName: getIconClassName(iconNames.tag),
        render: readGroups.includes(permissionGroupNames.tag)
      },
      {
        url: routes.licenses.list,
        linkText: 'Licenses',
        description: 'Add and manage licenses for use in device & account.',
        iconClassName: getIconClassName(iconNames.licenses),
        render: readGroups.includes(permissionGroupNames.license)
      },
      {
        url: routes.customFields.root,
        linkText: 'Custom Fields',
        description:
          'Manage custom fields layout for lead, contact, account, estimate, product & opportunity.',
        iconClassName: getIconClassName(iconNames.customFields),
        render: readGroups.includes(permissionGroupNames.customFields)
      },
      {
        url: routes.systemDictionary.root,
        linkText: 'System Dictionary',
        description:
          'Add and manage lead, contact, account & opportunity dictionaries.',
        iconClassName: getIconClassName(iconNames.systemDictionary),
        render:
          systemDictionaryPermissionGroup.some(p => readGroups.includes(p)) &&
          role?.name === ADMINISTRATOR,
        exact: false
      },
      {
        url: routes.salesTax.root,
        linkText: 'Sales Tax',
        description: 'Add and Manage State Sales Tax Rate Settings.',
        iconClassName: getIconClassName(iconNames.salesTax),
        render: readGroups.includes(permissionGroupNames.salesTax)
      },
      {
        url: routes.termsAndConditions.root,
        linkText: 'Terms and Conditions',
        description: 'Manage proposal & invoice term and conditions.',
        iconClassName: getIconClassName(iconNames.termsAndConditions),
        render: readGroups.includes(permissionGroupNames.termsAndConditions)
      },
      {
        url: routes.email.root,
        linkText: 'Email',
        description: 'Manage & Send Emails.',
        iconClassName: getIconClassName(iconNames.emailNav),
        render: readGroups.includes(permissionGroupNames.email)
      },
      {
        url: routes.reminder.list,
        linkText: 'Reminders',
        description: 'Manage & Set Reminders for Invoice & Subscription.',
        iconClassName: getIconClassName(iconNames.reminderNav),
        render: readGroups.includes(permissionGroupNames.reminder)
      },
      {
        url: routes.template.root,
        linkText: 'Templates',
        description: 'Manage & Create Templates for Email, PDF & Web.',
        iconClassName: getIconClassName(iconNames.template),
        render: readGroups.includes(permissionGroupNames.template)
      },
      {
        url: routes.projects.list,
        linkText: 'Projects',
        description: 'Create and Manage Projects.',
        iconClassName: getIconClassName(iconNames.projectNav),
        render: true
      },
      {
        url: routes.department.list,
        linkText: 'Department',
        description: 'Create and Manage Departments.',
        iconClassName: getIconClassName(iconNames.departmentNav),
        render: true
      },
      {
        url: routes.assistSettings.root,
        linkText: 'Assist Settings',
        description: 'Setup assist settings.',
        iconClassName: getIconClassName(iconNames.setting),
        render: true
      },
      {
        url: routes.announcements.list,
        linkText: 'Team Announcements',
        description: 'Send Announcements to the Team.',
        iconClassName: getIconClassName(iconNames.announcementsNav),
        render: role?.isSystem
      },
      {
        url: routes.packageProfile.list,
        linkText: 'Shipment Package Profiles',
        description: 'Create and Manage Shipment Package Profiles.',
        iconClassName: getIconClassName(iconNames.packageProfileNav),
        render: role?.isSystem
      }
    ],
    [readGroups, role?.name, role?.isSystem]
  )

  const cols = useMemo(
    () =>
      Math.min(
        menuItems.filter(item => !item.hasOwnProperty('render') || item.render)
          .length,
        2
      ),
    [menuItems]
  )

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
    return menuItems.sort((a, b) => compareByProperty(a, b, 'linkText'))
  }, [menuItems])

  const menuItemsToRender = useMemo(() => {
    return menuItemsSorted.filter(item =>
      item.hasOwnProperty('render') ? item.render : true
    )
  }, [menuItemsSorted])

  const handleMouseOver = useCallback(() => {
    const resultIndex = menuItemsToRender.findIndex(items =>
      items.exact === false
        ? location.pathname.includes(items.url)
        : parseToAbsolutePath(items.url) === location.pathname
    )
    if (resultIndex !== -1) {
      onMouseOver(resultIndex)
    } else {
      onResetMouseHover()
    }
  }, [location.pathname, menuItemsToRender, onMouseOver, onResetMouseHover])

  useEffect(() => {
    handleMouseOver()
    // eslint-disable-next-line
  }, [location.pathname])

  const scrollHeight = useMemo(() => {
    return 96 * Math.ceil(menuItemsToRender.length / cols) + 40
    // eslint-disable-next-line
  }, [menuItemsToRender, cols])

  const onLinkClick = useCallback(() => {
    setHidingDropdown(true)
    setTimeout(() => {
      setHidingDropdown(false)
    }, 2 * dropdownFadeTransition)
  }, [])

  return (
    <div
      className={classNames(classes.iconButtonWrapper, customClass)}
      onMouseEnter={() => setHoverState(true)}
      onMouseLeave={() => setHoverState(false)}
    >
      <DropdownHover
        forceHidden={disabled || hidingDropdown || !menuItemsToRender.length}
        dropSide="bottomRight"
        menuContainerClassName={classes.navigationSubMenu}
        dropdownContainerClassName={classes.dropdownContainer}
        buttonWrapClassName={classes.dropdownButton}
        ButtonComponent={
          <IconButton>
            <DrawerIcon hovering={isHovering} />
          </IconButton>
        }
        MenuComponent={
          <Scrollbars
            className={classes.scrollbarRoot}
            style={{
              height: scrollHeight || 0,
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
                    to={item.url}
                    disableGutters
                    onMouseOver={() => onMouseOver(index)}
                  >
                    {item.iconClassName && (
                      <ListItemIcon>
                        <i
                          style={{ color }}
                          className={classNames(
                            item.iconClassName,
                            classes.subMenuIcon,
                            {
                              [classes.subMenuIconActive]:
                                location.pathname === item.url
                            }
                          )}
                        />
                      </ListItemIcon>
                    )}
                    <ListItemText
                      className={classes.navigationSubMenuItem}
                      primary={item.linkText}
                      primaryTypographyProps={{
                        className: classNames(
                          classes.navigationSubMenuText,
                          dynamicClasses.navigationSubMenuText
                        )
                      }}
                      secondary={
                        <>
                          {item.description}
                          {item.printSystem && <b> ({t('System')}).</b>}
                        </>
                      }
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

export default withStyles(styles)(Drawer)
