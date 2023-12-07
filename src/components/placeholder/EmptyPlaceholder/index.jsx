import React from 'react'
import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'
import PropTypes from 'constants/propTypes'

import NormalPlaceholderContent from './NormalPlaceholderContent'
import SmallPlaceholderContent from './SmallPlaceholderContent'
import Spacing from 'components/containers/Spacing'

const useStyles = makeStyles(() => ({
  root: {
    height: '70vh'
  },
  fullHeight: {
    height: '100%'
  }
}))

const EmptyPlaceholder = ({
  text,
  rootClassName,
  requestText,
  fullHeight,
  variant = 'normal',
  onClick,
  iconClassName,
  textClassName,
  requestTextClassName
}) => {
  const classes = useStyles()
  return (
    <Spacing
      variant={0}
      justifyContent="center"
      alignItems="center"
      rootClassName={classNames(classes.root, rootClassName, {
        [classes.fullHeight]: fullHeight
      })}
    >
      {variant === 'normal' && (
        <NormalPlaceholderContent
          text={text}
          requestText={requestText}
          iconClassName={iconClassName}
          textClassName={textClassName}
          requestTextClassName={requestTextClassName}
        />
      )}
      {variant === 'small' && (
        <SmallPlaceholderContent
          text={text}
          requestText={requestText}
          onClick={onClick}
          iconClassName={iconClassName}
          textClassName={textClassName}
          requestTextClassName={requestTextClassName}
        />
      )}
    </Spacing>
  )
}

EmptyPlaceholder.propTypes = {
  variant: PropTypes.oneOf(['normal', 'small']),
  fullHeight: PropTypes.bool,
  onClick: PropTypes.func
}

export default EmptyPlaceholder
