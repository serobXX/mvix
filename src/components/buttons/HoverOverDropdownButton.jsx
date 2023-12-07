import React, { forwardRef, useMemo } from 'react'
import classNames from 'classnames'

import Tooltip from 'components/Tooltip'
import { CircleIconButton } from 'components/buttons'
import { MaterialPopup } from 'components/Popup'
import PropTypes from 'constants/propTypes'
import HoverOverDropdown from 'components/dropdowns/HoverOverDropdown'
import iconNames from 'constants/iconNames'
import { getIconClassName } from 'utils/iconUtils'

const dropdownStyle = {
  width: 230,
  animation: 'fade-in'
}

const HoverOverDropdownButton = forwardRef(
  (
    {
      items = [],
      disabled,
      position,
      tooltipText,
      tooltipPlacement,
      trigger: pTrigger,
      popupOn = 'hover',
      iconButtonClassName,
      iconClassName = getIconClassName(iconNames.moreInfo),
      data,
      listItemClassName,
      hoverCardHeight,
      cardRowSpacing,
      color,
      popupStyle,
      popupContentRootClassName,
      popupHoverCardClassName
    },
    ref
  ) => {
    const isEmpty = useMemo(
      () =>
        !items.filter(action =>
          action.hasOwnProperty('render') ? action.render : true
        ).length,
      [items]
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
              style={{ ...dropdownStyle, ...(popupStyle || {}) }}
              placement={position}
              preventOverflow={{
                enabled: true,
                boundariesElement: 'viewport'
              }}
            >
              {close => (
                <HoverOverDropdown
                  items={items}
                  data={data}
                  closePopup={close}
                  listItemClassName={listItemClassName}
                  hoverCardHeight={hoverCardHeight}
                  cardRowSpacing={cardRowSpacing}
                  color={color}
                  contentRootClassName={popupContentRootClassName}
                  hoverCardClassName={popupHoverCardClassName}
                />
              )}
            </MaterialPopup>
          </div>
        </Tooltip>
      )
    )
  }
)

HoverOverDropdownButton.propTypes = {
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
  ),
  disabled: PropTypes.bool,
  position: PropTypes.materialPopupPosition,
  tooltipText: PropTypes.string,
  tooltipPlacement: PropTypes.string,
  trigger: PropTypes.node,
  popupOn: PropTypes.string,
  iconButtonClassName: PropTypes.className,
  iconClassName: PropTypes.className
}

export default HoverOverDropdownButton
