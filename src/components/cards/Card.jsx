import React, { memo, useCallback } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import classNames from 'classnames'
import {
  withStyles,
  Paper,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText
} from '@material-ui/core'

import { CircleIconButton } from 'components/buttons'
import PropTypes from 'constants/propTypes'
import { ErrorText, TextWithTooltip } from 'components/typography'
import { MaterialPopup } from 'components/Popup'

import '/src/styles/card/_card.scss'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'

const styles = ({
  palette,
  type,
  typography,
  fontSize,
  fontWeight,
  lineHeight
}) => ({
  root: {
    padding: '22px 27px',
    borderRadius: 0,
    boxShadow: 'none',
    background: palette[type].card.background,
    overflow: 'visible'
  },
  radius: {
    borderRadius: '4px'
  },
  shadow: {
    boxShadow: `-2px 0 4px 0 ${palette[type].card.shadow}`
  },
  noRootSidePaddings: {
    paddingLeft: 0,
    paddingRight: 0
  },
  noRootTopPadding: {
    paddingTop: 0
  },
  header: {
    marginBottom: '20px'
  },
  headerSidePaddings: {
    paddingLeft: '27px',
    paddingRight: '27px'
  },
  circleIcon: {
    padding: '4px',
    color: '#afb7c7',
    '& i': {
      fontSize: 16
    }
  },
  menuDropdown: {
    width: '215px'
  },
  cardTitle: {
    ...typography.darkAccent[type],
    fontSize: fontSize.big,
    lineHeight: lineHeight.big,
    textTransform: 'capitalize',
    marginRight: 10
  },
  cardMenuList: {
    padding: '16px 36px 17px 35px'
  },
  cardMenuListItem: {
    padding: '8px 0'
  },
  cardMenuTextRoot: {
    padding: '2px 0 0'
  },
  cardMenuText: {
    ...typography.lightText[type],
    fontSize: fontSize.primary,
    lineHeight: lineHeight.primary,
    fontWeight: fontWeight.normal,
    transition: 'opacity .2s',
    whiteSpace: 'nowrap',

    '&:hover': {
      textShadow: `0 0 1px ${typography.lightText[type].color}`
    }
  },

  grayHeader: {
    marginLeft: '-32px',
    marginRight: '-32px',
    backgroundColor: palette[type].card.greyHeader.background,
    borderTop: `1px solid ${palette[type].pages.adminSettings.content.border}`,
    borderBottom: `1px solid ${palette[type].pages.adminSettings.content.border}`,
    borderRadius: 4
  },
  noNegativeHeaderSideMargins: {
    marginLeft: 0,
    marginRight: 0
  },
  grayHeaderTitle: {
    fontSize: fontSize.primary,
    color: palette[type].card.greyHeader.color,
    paddingLeft: '32px',
    lineHeight: '44px'
  },

  flatHeader: {
    marginTop: '8px',
    marginBottom: '30px'
  },
  flatHeaderTitle: {
    fontSize: fontSize.big,
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.big,
    color: palette[type].card.flatHeader.color
  }
})

function CardHeader({
  title,
  titleComponent,
  titleComponentWrapClassName,
  classes,
  headerTextClasses,
  headerClasses,
  hasMargin,
  removeSidePaddings,
  removeNegativeHeaderSideMargins,
  grayHeader,
  flatHeader,
  icon,
  showMenuOnHover,
  dropdown,
  popupContentStyle,
  iconButtonComponent,
  iconButtonClassName,
  pulseButtonComponent,
  headerComponent,
  iconClassName,
  menuDropdownComponent,
  onMenuDropdownToggle,
  menuDropdownContainerClassName,
  menuItems,
  onClickFunction,
  headerHelpTextClasses,
  helpText,
  popupPlacement,
  on,
  error,
  popupProps = {},
  headerWrapClassName
}) {
  const onModalToggle = useCallback(
    e => {
      onMenuDropdownToggle(
        e?.target?.classList && !e.target.classList.contains('popup-overlay')
      )
    },
    [onMenuDropdownToggle]
  )

  return (
    <header
      className={classNames(...headerClasses, {
        [classes.header]: hasMargin,
        [classes.headerSidePaddings]: removeSidePaddings,
        [classes.noNegativeHeaderSideMargins]: removeNegativeHeaderSideMargins,
        [classes.grayHeader]: grayHeader,
        [classes.flatHeader]: flatHeader
      })}
    >
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        className={headerWrapClassName}
      >
        {title && (
          <Grid item>
            <Grid container alignItems="center">
              <TextWithTooltip
                weight="bold"
                color="title.primary"
                maxWidth={grayHeader ? 308 : 350}
                rootClassName={classNames(
                  classes.cardTitle,
                  ...headerTextClasses,
                  {
                    [classes.grayHeaderTitle]: grayHeader,
                    [classes.flatHeaderTitle]: flatHeader
                  }
                )}
              >
                {title}
              </TextWithTooltip>
              <ErrorText error={error} condition={!!error} />
            </Grid>
          </Grid>
        )}
        {titleComponent && (
          <Grid item className={titleComponentWrapClassName}>
            {titleComponent}
          </Grid>
        )}
        {pulseButtonComponent && pulseButtonComponent}
        {headerComponent && headerComponent}
        {icon && (
          <Grid item className={showMenuOnHover ? 'Card__Dropdown-Icon' : ''}>
            {dropdown ? (
              <MaterialPopup
                onOpen={onModalToggle}
                onClose={onModalToggle}
                position={popupPlacement}
                style={{ ...popupContentStyle }}
                on={on}
                trigger={
                  iconButtonComponent ? (
                    iconButtonComponent
                  ) : (
                    <CircleIconButton
                      className={classNames(
                        'hvr-grow',
                        classes.circleIcon,
                        iconButtonClassName
                      )}
                    >
                      <i
                        className={
                          iconClassName || 'icon-navigation-show-more-vertical'
                        }
                      />
                    </CircleIconButton>
                  )
                }
                {...popupProps}
              >
                {menuDropdownComponent ? (
                  menuDropdownComponent
                ) : (
                  <List
                    className={classNames(
                      classes.cardMenuList,
                      menuDropdownContainerClassName
                    )}
                  >
                    {menuItems.map((item, index) => (
                      <ListItem
                        className={classes.cardMenuListItem}
                        key={item + index}
                        component={item.component ? item.component : RouterLink}
                        href={item.href ? item.href : null}
                        to={item.url ? item.url : null}
                        target={item.target}
                        rel={item.rel}
                      >
                        <ListItemText
                          className={classes.cardMenuTextRoot}
                          primary={item.label}
                          primaryTypographyProps={{
                            className: classes.cardMenuText
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </MaterialPopup>
            ) : iconButtonComponent ? (
              iconButtonComponent
            ) : (
              <CircleIconButton
                className={classNames(
                  'hvr-grow',
                  classes.circleIcon,
                  iconButtonClassName
                )}
                onClick={onClickFunction}
              >
                <i
                  className={
                    iconClassName || getIconClassName(iconNames.moreInfo)
                  }
                />
              </CircleIconButton>
            )}
          </Grid>
        )}
        {helpText && (
          <Grid item>
            <Typography className={classNames(...headerHelpTextClasses)}>
              {helpText}
            </Typography>
          </Grid>
        )}
      </Grid>
    </header>
  )
}

CardHeader.defaultProps = {
  headerTextClasses: [],
  headerClasses: [],
  onMenuDropdownToggle: f => f,
  on: 'click'
}

const CardHeaderMemoized = memo(CardHeader)

const Card = ({
  t,
  classes,
  title,
  titleComponent,
  titleComponentWrapClassName,
  menuItems,
  removeSidePaddings,
  removeNegativeHeaderSideMargins,
  icon,
  iconClassName,
  iconButtonClassName,
  iconButtonComponent,
  pulseButtonComponent,
  headerComponent,
  radius,
  shadow,
  grayHeader,
  flatHeader,
  dropdown,
  dropdownContainerClassName,
  onClickFunction,
  rootClassName,
  headerClasses,
  headerTextClasses,
  helpText,
  hasMargin,
  headerHelpTextClasses,
  menuDropdownComponent,
  onMenuDropdownToggle,
  menuDropdownContainerClassName,
  showMenuOnHover,
  popupContentStyle,
  onClick,
  rootStyle,
  popupPlacement,
  on,
  error,
  popupProps,
  headerWrapClassName,
  ...props
}) => {
  return (
    <Paper
      className={classNames(classes.root, rootClassName, {
        [classes.noRootSidePaddings]: removeSidePaddings,
        [classes.radius]: radius,
        [classes.shadow]: shadow,
        [classes.noRootTopPadding]: grayHeader,
        Card__Container: showMenuOnHover
      })}
      onClick={onClick}
      style={rootStyle}
    >
      {(title || titleComponent || headerComponent) && (
        <CardHeaderMemoized
          title={title}
          titleComponent={titleComponent}
          titleComponentWrapClassName={titleComponentWrapClassName}
          classes={classes}
          headerTextClasses={headerTextClasses}
          headerClasses={headerClasses}
          hasMargin={hasMargin}
          removeSidePaddings={removeSidePaddings}
          removeNegativeHeaderSideMargins={removeNegativeHeaderSideMargins}
          grayHeader={grayHeader}
          flatHeader={flatHeader}
          icon={icon}
          showMenuOnHover={showMenuOnHover}
          dropdown={dropdown}
          popupContentStyle={popupContentStyle}
          iconButtonComponent={iconButtonComponent}
          pulseButtonComponent={pulseButtonComponent}
          headerComponent={headerComponent}
          iconButtonClassName={iconButtonClassName}
          iconClassName={iconClassName}
          menuDropdownComponent={menuDropdownComponent}
          menuDropdownContainerClassName={menuDropdownContainerClassName}
          menuItems={menuItems}
          onClickFunction={onClickFunction}
          headerHelpTextClasses={headerHelpTextClasses}
          onMenuDropdownToggle={onMenuDropdownToggle}
          helpText={helpText}
          popupPlacement={popupPlacement}
          on={on}
          error={error}
          popupProps={popupProps}
          headerWrapClassName={headerWrapClassName}
        />
      )}

      {props.children}
    </Paper>
  )
}

Card.propTypes = {
  title: PropTypes.string,
  titleComponent: PropTypes.node,
  titleComponentWrapClassName: PropTypes.string,
  menuItems: PropTypes.array,
  removeSidePaddings: PropTypes.bool,
  removeNegativeHeaderSideMargins: PropTypes.bool,
  icon: PropTypes.bool,
  iconClassName: PropTypes.string,
  iconButtonClassName: PropTypes.string,
  iconButtonComponent: PropTypes.node,
  pulseButtonComponent: PropTypes.node,
  headerComponent: PropTypes.node,
  radius: PropTypes.bool,
  shadow: PropTypes.bool,
  grayHeader: PropTypes.bool,
  flatHeader: PropTypes.bool,
  dropdown: PropTypes.bool,
  dropdownContainerClassName: PropTypes.string,
  onClickFunction: PropTypes.func,
  rootClassName: PropTypes.string,
  helpText: PropTypes.string,
  hasMargin: PropTypes.bool,
  headerHelpTextClasses: PropTypes.array,
  menuDropdownComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  onMenuDropdownToggle: PropTypes.func,
  menuDropdownContainerClassName: PropTypes.string,
  showMenuOnHover: PropTypes.bool,
  popupContentStyle: PropTypes.object,
  popupProps: PropTypes.object,
  rootStyle: PropTypes.object,
  popupPlacement: PropTypes.string,
  onClick: PropTypes.func,
  headerTextClasses: PropTypes.array,
  on: PropTypes.oneOf(['click', 'hover'])
}

Card.defaultProps = {
  title: null,
  titleComponent: null,
  titleComponentWrapClassName: '',
  menuItems: [],
  removeSidePaddings: false,
  removeNegativeHeaderSideMargins: false,
  icon: true,
  iconClassName: null,
  iconButtonClassName: null,
  iconButtonComponent: null,
  pulseButtonComponent: null,
  headerComponent: null,
  radius: true,
  shadow: true,
  grayHeader: false,
  flatHeader: false,
  dropdown: true,
  dropdownContainerClassName: '',
  onClickFunction: f => f,
  rootClassName: '',
  helpText: null,
  hasMargin: true,
  headerHelpTextClasses: [],
  menuDropdownComponent: null,
  onMenuDropdownToggle: f => f,
  menuDropdownContainerClassName: '',
  showMenuOnHover: false,
  popupContentStyle: {},
  rootStyle: {},
  popupPlacement: 'bottom right',
  onClick: f => f
}

export default withStyles(styles)(Card)
