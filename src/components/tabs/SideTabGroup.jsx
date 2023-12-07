import { forwardRef, useMemo } from 'react'
import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'
import { Link } from 'react-router-dom'

import { SideTabs, SideTab } from 'components/tabs'
import PropTypes from 'constants/propTypes'
import Scrollbars from 'components/Scrollbars'
import Tooltip from 'components/Tooltip'
import { tooltipTypes } from 'constants/common'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'

export const createTab = (
  label,
  value,
  { icon, iconComponent, activeIcon, to, tooltip, tooltipType } = {}
) => ({
  label,
  value,
  icon: icon,
  iconComponent,
  activeIcon,
  to,
  tooltip,
  tooltipType
})

const useStyles = makeStyles(({ palette, type }) => ({
  root: {
    borderRight: `1px solid ${palette[type].sideModal.content.border}`,
    height: '100%'
  },
  tabsRoot: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  tabsScroller: {
    padding: '55px 0',
    paddingLeft: 25
  },
  tabsContainer: {
    alignItems: 'flex-end'
  },
  tabRoot: {
    opacity: 1,
    height: '50px',
    width: '250px',
    minWidth: 100,
    margin: '25px -1px 0',
    padding: '0px 20px',
    gap: 10
  },
  tabSelected: {
    color: palette[type].pages.rbac.roles.active.color
  },
  tabWrapper: {
    width: 'auto',
    maxWidth: '100%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  },
  tabBtn: {
    justifyContent: 'flex-start'
  },
  tabInfoIcon: {
    fontSize: 18
  }
}))

const CustomSideTab = forwardRef(
  (
    {
      children,
      to,
      tooltip,
      tooltipType = tooltipTypes.text,
      buttonClassName,
      iconClassName,
      ...props
    },
    ref
  ) => {
    const renderIcon = useMemo(
      () =>
        tooltipType === tooltipTypes.icon &&
        !!tooltip && (
          <Tooltip
            title={tooltip}
            disableHoverListener={!tooltip || tooltipType !== tooltipTypes.icon}
            arrow
            placement="top"
          >
            <i
              className={classNames(
                iconClassName,
                getIconClassName(iconNames.info)
              )}
            />
          </Tooltip>
        ),
      [tooltipType, tooltip, iconClassName]
    )

    return (
      <Tooltip
        title={tooltip}
        disableHoverListener={!tooltip || tooltipType !== tooltipTypes.text}
        arrow
        placement="top"
      >
        {to ? (
          <Link
            {...props}
            className={classNames(props.className, buttonClassName)}
            ref={ref}
          >
            {children}
            {renderIcon}
          </Link>
        ) : (
          <div
            {...props}
            className={classNames(props.className, buttonClassName)}
            ref={ref}
          >
            {children}
            {renderIcon}
          </div>
        )}
      </Tooltip>
    )
  }
)

const SideTabGroup = ({
  value,
  onChange,
  tabs,
  tabsRootClassName,
  tabsScrollerClassName,
  tabsFlexContainerClassName,
  tabRootClassName,
  tabSelectedClassName,
  tabWrapperClassName,
  ...props
}) => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Scrollbars>
        <SideTabs
          value={value}
          onChange={onChange}
          classes={{
            root: classNames(classes.tabsRoot, tabsRootClassName),
            scroller: classNames(classes.tabsScroller, tabsScrollerClassName),
            flexContainer: classNames(
              classes.tabsContainer,
              tabsFlexContainerClassName
            )
          }}
          {...props}
        >
          {tabs.map(
            ({
              label,
              icon,
              iconComponent,
              value: _value,
              activeIcon,
              to,
              tooltip,
              tooltipType
            }) => (
              <SideTab
                disableRipple
                key={`side-tab-${_value}`}
                value={_value}
                label={label}
                classes={{
                  root: classNames(classes.tabRoot, tabRootClassName),
                  selected: classNames(
                    classes.tabSelected,
                    tabSelectedClassName
                  ),
                  wrapper: classNames(
                    { [classes.tabWrapper]: !(iconComponent || icon) },
                    tabWrapperClassName
                  )
                }}
                icon={
                  iconComponent ? (
                    iconComponent
                  ) : icon ? (
                    <i
                      className={classNames(
                        {
                          [icon]: !activeIcon || value !== _value,
                          [activeIcon]: value === _value
                        },
                        classes.icon
                      )}
                    />
                  ) : null
                }
                to={to}
                component={CustomSideTab}
                tooltip={tooltip}
                tooltipType={tooltipType}
                buttonClassName={classes.tabBtn}
                iconClassName={classes.tabInfoIcon}
              />
            )
          )}
        </SideTabs>
      </Scrollbars>
    </div>
  )
}

SideTabGroup.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  tabs: PropTypes.array,
  tabsRootClassName: PropTypes.className,
  tabsScrollerClassName: PropTypes.className,
  tabsFlexContainerClassName: PropTypes.className,
  tabRootClassName: PropTypes.className,
  tabSelectedClassName: PropTypes.className,
  tabWrapperClassName: PropTypes.className
}

SideTabGroup.defaultProps = {
  tabs: [],
  onChange: f => f
}

export default SideTabGroup
