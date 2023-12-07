import React from 'react'
import { Typography, withStyles } from '@material-ui/core'
import classNames from 'classnames'

import PropTypes from 'constants/propTypes'

const styles = ({ typography, type, fontSize, lineHeight }) => ({
  selectTitle: {
    ...typography.darkAccent[type],
    lineHeight: lineHeight.big,
    fontSize: fontSize.bigger
  },
  selectSubTitle: {
    ...typography.darkAccent[type],
    lineHeight: lineHeight.big,
    fontSize: fontSize.bigger
  }
})

const PageTitle = ({
  title,
  icon,
  classes,
  selectedCount,
  titleClassName = ''
}) => {
  return (
    <div key="selectTitle" style={{ display: 'flex', alignItems: 'center' }}>
      <Typography
        component="h2"
        className={classNames(classes.selectTitle, titleClassName)}
      >
        {title}
      </Typography>
      {'\u00A0'}

      {!selectedCount || (
        <Typography
          component="h3"
          variant="subtitle1"
          className={classes.selectSubTitle}
        >
          &nbsp;
          {`| ${selectedCount} selected`}
        </Typography>
      )}
      {icon}
    </div>
  )
}

PageTitle.propTypes = {
  selectedCount: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired
}

PageTitle.defaultProps = {
  selectedCount: 0,
  title: ''
}

export default withStyles(styles)(PageTitle)
