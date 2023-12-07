import { useCallback, useState } from 'react'
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles
} from '@material-ui/core'
import classNames from 'classnames'
import { Link } from 'react-router-dom'

import { _isFunction } from 'utils/lodash'
import PropTypes from 'constants/propTypes'

const useStyles = makeStyles(
  ({ palette, type, typography, fontSize, lineHeight }) => ({
    popupContentRoot: {
      padding: 20
    },
    listContainer: ({ cols }) => ({
      padding: '0px',
      position: 'relative',
      overflowY: 'visible',
      display: 'grid',
      gridGap: '10px',
      gridTemplateColumns: `repeat(${cols},1fr)`
    }),
    navigationHoverCard: ({ hoverCardWidth }) => ({
      backgroundColor: palette[type].body.background,
      borderRadius: '10px',
      position: 'absolute',
      top: 0,
      left: 0,
      transitionDuration: '0.7s',
      width: hoverCardWidth
    }),
    listItem: ({ hoverCardWidth }) => ({
      padding: 10,
      maxHeight: 90,
      alignItems: 'flex-start',
      overflow: 'hidden',
      cursor: 'pointer',
      background: 'transparent',
      border: 'none',
      width: hoverCardWidth
    }),
    text: ({ color }) => ({
      ...typography.lightText[type],
      fontSize: fontSize.primary,
      lineHeight: lineHeight.primary,
      fontWeight: 600,
      transition: 'opacity .2s',
      whiteSpace: 'nowrap',
      color,
      maxWidth: 135,
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }),
    textRoot: {
      padding: '2px 0 0',
      margin: '0px'
    },
    disabled: {
      opacity: 0.5,
      pointerEvents: 'none'
    },
    icon: ({ color }) => ({
      color,
      fontSize: '20px',
      width: 20,
      height: 20,
      marginTop: 3
    })
  })
)

const HoverOverDropdown = ({
  items = [],
  color = '#1565C0',
  data,
  closePopup = f => f,
  listItemClassName,
  hoverCardHeight = 44,
  hoverCardWidth = 190,
  cardRowSpacing = 10,
  contentRootClassName,
  hoverCardClassName,
  listWrapperComponent: ListWrapperComponent,
  listWrapperProps,
  cols = 1
}) => {
  const classes = useStyles({ color, cols, hoverCardWidth })
  const [hoverCard, setHoverCard] = useState({
    height: '0px',
    transform: `translate(0px, 0px)`
  })

  const onResetMouseHover = useCallback(() => {
    setHoverCard({
      height: '0px',
      transform: `translate(0px, 0px)`
    })
  }, [])

  const onMouseOver = useCallback(
    index => () => {
      const x = (index % cols) * (hoverCardWidth + cardRowSpacing)
      const y = Math.floor(index / cols) * (hoverCardHeight + cardRowSpacing)
      setHoverCard({
        height: hoverCardHeight,
        transform: `translate(${x}px, ${y}px)`
      })
    },
    [hoverCardHeight, hoverCardWidth, cols, cardRowSpacing]
  )

  const onLinkClick = useCallback(
    (onClick, isLink) => e => {
      !isLink && e.preventDefault()
      onClick && onClick(data)
      closePopup()
    },
    [data, closePopup]
  )

  const renderListItem = useCallback(
    ({ label, url, icon, iconComponent, img, disabled, onClick }, index) => {
      return (
        <ListItem
          key={label + index}
          className={classNames(classes.listItem, listItemClassName, {
            [classes.disabled]: disabled
          })}
          component={!!url ? Link : onClick ? 'button' : undefined}
          onClick={onLinkClick(onClick, !!url)}
          to={(_isFunction(url) ? url(data) : url) || '#'}
          disableGutters
          onMouseOver={onMouseOver(index)}
        >
          {(iconComponent || img || icon) && (
            <ListItemIcon>
              {iconComponent ||
                (img ? (
                  <img src={img} alt={label} className={classes.icon} />
                ) : (
                  <i className={classNames(icon, classes.icon)} />
                ))}
            </ListItemIcon>
          )}
          <ListItemText
            classes={{
              root: classes.textRoot,
              primary: classes.text
            }}
            primary={label}
          />
        </ListItem>
      )
    },
    [classes, onLinkClick, onMouseOver, data, listItemClassName]
  )

  return (
    <div className={classNames(classes.popupContentRoot, contentRootClassName)}>
      <List
        onMouseLeave={onResetMouseHover}
        component="nav"
        className={classes.listContainer}
      >
        <div
          className={classNames(
            classes.navigationHoverCard,
            hoverCardClassName
          )}
          style={{
            height: hoverCard.height,
            transform: hoverCard.transform
          }}
        />
        {items
          .filter(({ render }) => render !== false)
          .map((item, index) =>
            ListWrapperComponent ? (
              <ListWrapperComponent
                key={item.label + index}
                item={item}
                {...(listWrapperProps || {})}
              >
                {renderListItem(item, index)}
              </ListWrapperComponent>
            ) : (
              renderListItem(item, index)
            )
          )}
      </List>
    </div>
  )
}

HoverOverDropdown.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string,
      value: PropTypes.string,
      label: PropTypes.string,
      onClick: PropTypes.func,
      url: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
      disabled: PropTypes.bool,
      render: PropTypes.bool
    })
  )
}

export default HoverOverDropdown
