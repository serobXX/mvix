import React, { useEffect, useRef, useState } from 'react'
import { Tooltip } from '@material-ui/core'

import PropTypes from 'constants/propTypes'
import Text from './Text'

const TextWithTooltip = ({
  maxWidth = 0,
  placement = 'top',
  children,
  whiteSpace,
  styles,
  ...props
}) => {
  const ref = useRef(null)
  const [tooltipText, setTooltipText] = useState('')

  useEffect(
    () => {
      const element = ref.current
      const resizeObserver = new ResizeObserver(() => {
        const isTextHidden =
          element?.scrollWidth !== element?.clientWidth ||
          element?.clientWidth >= maxWidth
        setTooltipText(isTextHidden ? children : '')
      })
      resizeObserver.observe(element)

      return () => {
        resizeObserver.unobserve(element)
      }
    },
    // eslint-disable-next-line
    [ref.current, maxWidth, children]
  )

  return (
    <Tooltip arrow title={tooltipText} placement={placement}>
      <Text
        ref={ref}
        whiteSpace="no-wrap"
        noWrap
        {...props}
        style={{ ...styles, maxWidth }}
      >
        {children}
      </Text>
    </Tooltip>
  )
}

TextWithTooltip.propTypes = {
  maxWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  variant: PropTypes.fontSize,
  weight: PropTypes.fontWeight,
  fontStyle: PropTypes.fontStyle,
  color: PropTypes.color,
  rootClassName: PropTypes.className,
  styles: PropTypes.object
}

export default TextWithTooltip
