import React from 'react'
import { Grid, makeStyles } from '@material-ui/core'
import classNames from 'classnames'

import { Text } from 'components/typography'
import { getIconClassName } from 'utils/iconUtils'
import iconNames, { iconTypes } from 'constants/iconNames'

const useStyles = makeStyles(({ colors, spacing, lineHeight }) => ({
  icon: {
    color: colors.highlight,
    width: 38,
    height: 38,
    fontSize: 30,
    display: 'grid',
    placeItems: 'center',
    marginRight: spacing(1)
  },
  fitContent: {
    width: 'fit-content'
  },
  text: {
    lineHeight: lineHeight.small
  },
  subText: {
    lineHeight: lineHeight.smaller
  },
  clickable: {
    cursor: 'pointer'
  }
}))

const SmallPlaceholderContent = ({
  text,
  requestText,
  onClick,
  iconClassName,
  textClassName,
  requestTextClassName
}) => {
  const classes = useStyles()

  return (
    <Grid container justifyContent="center" wrap="nowrap">
      <Grid item>
        <i
          className={classNames(
            getIconClassName(iconNames.warning, iconTypes.solid),
            classes.icon,
            {
              [classes.clickable]: !!onClick
            },
            iconClassName
          )}
          onClick={onClick}
        />
      </Grid>
      <Grid
        item
        container
        direction="column"
        alignItems="flex-start"
        justifyContent="center"
        className={classNames(classes.fitContent, {
          [classes.clickable]: !!onClick
        })}
        onClick={onClick}
      >
        <Text
          weight="bold"
          color="title.primary"
          display="inline"
          rootClassName={classNames(classes.text, textClassName)}
        >
          {text}
        </Text>
        {requestText && (
          <Text
            display="inline"
            variant="small"
            rootClassName={classNames(classes.subText, requestTextClassName)}
          >
            {requestText}
          </Text>
        )}
      </Grid>
    </Grid>
  )
}

export default SmallPlaceholderContent
