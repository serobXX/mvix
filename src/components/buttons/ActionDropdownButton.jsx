import React, { forwardRef, useMemo } from 'react'
import classNames from 'classnames'

import Tooltip from 'components/Tooltip'
import ActionLinksDropdown from 'components/dropdowns/ActionLinksDropdown'
import { CircleIconButton } from 'components/buttons'
import { MaterialPopup } from 'components/Popup'
import PropTypes from 'constants/propTypes'
import iconNames from 'constants/iconNames'
import { getIconClassName } from 'utils/iconUtils'

const dropdownStyle = {
  width: 185,
  animation: 'fade-in'
}

const ActionDropdownButton = forwardRef(
  (
    {
      actionLinks = [],
      disabled,
      position,
      activeValueClass,
      tooltipText,
      tooltipPlacement,
      trigger: pTrigger,
      popupOn = 'hover',
      iconButtonClassName,
      iconClassName = getIconClassName(iconNames.moreInfo),
      data,
      popupStyle
    },
    ref
  ) => {
    const isEmpty = useMemo(
      () =>
        !actionLinks.filter(
          action =>
            !action.divider &&
            (action.hasOwnProperty('render') ? action.render : true)
        ).length,
      [actionLinks]
    )

    const trigger = useMemo(() => {
      if (!pTrigger) {
        return (
          <CircleIconButton
            className={classNames('hvr-grow', iconButtonClassName)}
            disabled={disabled}
          >
            <i className={iconClassName} />
          </CircleIconButton>
        )
      }

      return <div ref={ref}>{pTrigger}</div>
    }, [disabled, pTrigger, ref, iconButtonClassName, iconClassName])

    const style = useMemo(
      () => ({
        ...dropdownStyle,
        ...popupStyle
      }),
      [popupStyle]
    )

    return (
      !isEmpty && (
        <Tooltip
          title={tooltipText}
          placement={tooltipPlacement || 'top'}
          disableHoverListener={!tooltipText}
        >
          <div>
            <MaterialPopup
              on={popupOn}
              trigger={trigger}
              style={style}
              placement={position}
              preventOverflow={{
                enabled: true,
                boundariesElement: 'viewport'
              }}
            >
              {closePopup => (
                <ActionLinksDropdown
                  actionLinks={actionLinks}
                  activeValueClass={activeValueClass}
                  data={data}
                  closePopup={closePopup}
                />
              )}
            </MaterialPopup>
          </div>
        </Tooltip>
      )
    )
  }
)

ActionDropdownButton.propTypes = {
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
  activeValueClass: PropTypes.className,
  disabled: PropTypes.bool,
  position: PropTypes.materialPopupPosition,
  tooltipText: PropTypes.string,
  tooltipPlacement: PropTypes.string,
  trigger: PropTypes.node,
  popupOn: PropTypes.string,
  iconButtonClassName: PropTypes.className,
  iconClassName: PropTypes.className
}

export default ActionDropdownButton
