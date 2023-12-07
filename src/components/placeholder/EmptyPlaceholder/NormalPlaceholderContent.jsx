import React from 'react'
import classNames from 'classnames'
import { makeStyles } from '@material-ui/core'

import { Text } from 'components/typography'
import { getIconClassName } from 'utils/iconUtils'
import iconNames, { iconTypes } from 'constants/iconNames'

const useStyles = makeStyles(({ colors }) => ({
  icon: {
    color: colors.highlight,
    fontSize: 65
  }
}))

const NormalPlaceholderContent = ({
  text,
  requestText,
  iconClassName,
  textClassName,
  requestTextClassName
}) => {
  const classes = useStyles()

  return (
    <>
      <i
        className={classNames(
          getIconClassName(iconNames.warning, iconTypes.solid),
          classes.icon,
          iconClassName
        )}
      />
      <Text
        variant="big"
        weight="bold"
        component="h2"
        color="highlight"
        rootClassName={textClassName}
      >
        {text}
      </Text>
      <Text color="highlight" rootClassName={requestTextClassName}>
        {requestText}
      </Text>
    </>
  )
}

export default NormalPlaceholderContent
