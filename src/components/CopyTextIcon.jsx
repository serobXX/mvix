import React, { useCallback, useState } from 'react'
import Tooltip from './Tooltip'
import iconNames, { iconTypes } from 'constants/iconNames'
import { getIconClassName } from 'utils/iconUtils'

const CopyTextIcon = ({
  icon = getIconClassName(iconNames.copy, iconTypes.solid),
  iconClassName,
  text,
  children,
  copyText = 'Click to copy input value',
  copiedText = 'Input value copied to clipboard'
}) => {
  const [copyTooltip, setCopyTooltip] = useState(copyText)
  const handleCopy = useCallback(() => {
    navigator?.clipboard?.writeText && navigator.clipboard.writeText(text)
    setCopyTooltip(copiedText)
    setTimeout(() => setCopyTooltip(copyText), 2000)
  }, [text, copyText, copiedText])

  return (
    <Tooltip title={copyTooltip} placement="top" arrow>
      {children || (
        <i className={`${icon} ${iconClassName}`} onClick={handleCopy} />
      )}
    </Tooltip>
  )
}

export default CopyTextIcon
