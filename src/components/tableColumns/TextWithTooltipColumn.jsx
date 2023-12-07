import { useMemo } from 'react'
import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'

import { TextWithTooltip } from 'components/typography'
import { _isString } from 'utils/lodash'
import { hasHTTPSOrHTTP, removeHTTPSorHTTP } from 'utils/urlUtils'

const useStyles = makeStyles(({ typography, type }) => ({
  root: ({ isTitle }) => ({
    ...(isTitle ? typography.darkAccent[type] : {})
  })
}))

const TextWithTooltipColumn = ({
  value,
  data,
  maxWidth = '100%',
  getValue,
  tooltipPlacement = 'top',
  whiteSpace,
  styles,
  variant,
  weight,
  fontStyle,
  color,
  isTitle = false,
  rootClassName,
  to,
  isPhoneField = false,
  onClick
}) => {
  const classes = useStyles({ isTitle })

  const _value = useMemo(() => {
    let val = getValue ? getValue(data) : _isString(value) && value
    if (val && isPhoneField && !val?.startsWith?.('+')) {
      val = '+1 ' + val
    } else if (typeof value === 'string' && hasHTTPSOrHTTP(value)) {
      val = removeHTTPSorHTTP(val)
    }
    return val || 'N/A'
  }, [getValue, value, isPhoneField, data])

  return (
    <TextWithTooltip
      maxWidth={maxWidth}
      placement={tooltipPlacement}
      whiteSpace={whiteSpace}
      styles={styles}
      variant={variant}
      weight={weight}
      fontStyle={fontStyle}
      color={color}
      rootClassName={classNames(classes.root, rootClassName)}
      to={to}
      data={data}
      onClick={onClick}
      linkView={!!onClick}
    >
      {_value}
    </TextWithTooltip>
  )
}

export default TextWithTooltipColumn
