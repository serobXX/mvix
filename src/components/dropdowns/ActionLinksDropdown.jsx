import React, { useCallback } from 'react'
import { Divider, makeStyles } from '@material-ui/core'
import { Link } from 'react-router-dom'

import {
  DropdownButtonListItem,
  DropdownHoverListItem,
  DropdownHoverListItemIcon,
  DropdownHoverListItemText
} from 'components/dropdowns'

import List from 'components/list'
import classNames from 'classnames'
import PropTypes from 'constants/propTypes'
import { _isFunction } from 'utils/lodash'

const useStyles = makeStyles(({ typography, palette, type }) => ({
  value: {
    color: palette[type].tagCard.item.color,
    fontFamily: typography.fontFamily,
    fontSize: '12px',
    fontWeight: 'bold',
    letterSpacing: '-0.01px',
    lineHeight: '15px',
    padding: '5px 0 0 5px'
  },
  rowActionList: {
    background: palette[type].tableLibrary.body.row.dropdown.list.background,
    overflow: 'hidden',
    borderRadius: 6,
    minWidth: 185
  },
  disabled: {
    textAlign: 'left',
    padding: '5px 16px',
    borderBottom: '1px solid #f5f6fa',
    opacity: 0.5,
    display: 'flex',
    alignItems: 'center'
  },
  listIcon: {
    fontSize: 18
  }
}))

const ActionLinksDropdown = ({
  actionLinks,
  activeValueClass = '',
  data,
  closePopup
}) => {
  const classes = useStyles()
  const setProps = useCallback(
    (action, index) => {
      const key = `row-action-${index}`
      const component = action.clickAction ? 'button' : Link
      const disabled = action.disabled

      const onClick = action.clickAction ? action.clickAction : f => f
      const actionTo = _isFunction(action.to) ? action.to(data) : action.to
      const to = {
        pathname: actionTo && actionTo.pathname ? actionTo.pathname : actionTo,
        data: action.data || undefined
      }

      const target = action.target || undefined

      return {
        key,
        component,
        to,
        state: actionTo?.data,
        target,
        onClick: event => {
          onClick(event, data)
          closePopup && closePopup()
        },
        disabled
      }
    },
    [data, closePopup]
  )
  const renderContent = useCallback(
    action => (
      <>
        {action?.icon && (
          <DropdownHoverListItemIcon className={classes.listIcon}>
            <i className={action.icon} />
          </DropdownHoverListItemIcon>
        )}
        {action?.value !== undefined ? (
          <span className={classNames(classes.value, activeValueClass)}>
            {action.value}
          </span>
        ) : null}
        <DropdownHoverListItemText primary={action?.label} />
      </>
    ),
    [classes.value, activeValueClass, classes.listIcon]
  )

  return (
    <List component="nav" disablePadding className={classes.rowActionList}>
      {actionLinks
        .filter(action =>
          action.hasOwnProperty('render')
            ? typeof action.render === 'function'
              ? action.render(data)
              : action.render
            : true
        )
        .map((action, index) => {
          if (action.divider) {
            return <Divider key={`row-action-${index}`} />
          } else if (action.disabled) {
            return (
              <div className={classes.disabled} key={index}>
                {renderContent(action)}
              </div>
            )
          } else if (action.isDropDownButton) {
            return (
              <DropdownButtonListItem {...setProps(action, index)}>
                {renderContent(action)}
              </DropdownButtonListItem>
            )
          } else {
            return (
              <DropdownHoverListItem {...setProps(action, index)}>
                {renderContent(action)}
              </DropdownHoverListItem>
            )
          }
        })}
    </List>
  )
}

ActionLinksDropdown.propTypes = {
  actionLinks: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string,
      value: PropTypes.string,
      label: PropTypes.string,
      clickAction: PropTypes.func,
      to: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
        PropTypes.func
      ]),
      data: PropTypes.any,
      target: PropTypes.any,
      divider: PropTypes.bool,
      disabled: PropTypes.bool,
      render: PropTypes.bool
    })
  ),
  activeValueClass: PropTypes.className
}

export default ActionLinksDropdown
