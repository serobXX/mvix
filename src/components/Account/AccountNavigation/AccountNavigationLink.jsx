import React, { useState } from 'react'
import classNames from 'classnames'

import { CircleIconButton } from 'components/buttons'
import Tooltip from 'components/Tooltip'

const AccountNavigationLink = ({
  linkIconClassName,
  iconButtonClassName,
  onClick,
  tooltipTitle,
  tooltipHeader
}) => {
  const [, setAnchorEl] = useState()

  const handleHover = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div onClick={onClick} onMouseOver={handleHover} onMouseLeave={handleClose}>
      <Tooltip
        title={tooltipTitle}
        headerText={tooltipHeader}
        arrowWithHeaderColor
        placement="bottom"
        withHeader
        arrow
        disableHoverListener={!tooltipTitle}
      >
        <CircleIconButton
          className={classNames('hvr-grow', iconButtonClassName)}
        >
          <i className={linkIconClassName} />
        </CircleIconButton>
      </Tooltip>
    </div>
  )
}

export default AccountNavigationLink
