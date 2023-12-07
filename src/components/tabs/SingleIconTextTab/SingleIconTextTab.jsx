import React from 'react'
import { Tab, withStyles } from '@material-ui/core'
import classNames from 'classnames'

const CustomTab = ({ classes, rootClassName, ...props }) => {
  const { tabRootWithLabel, ...modifiedClasses } = { ...classes }
  if (props.label) {
    modifiedClasses.root = `${classes.root} ${classes.tabRootWithLabel}`
  }
  modifiedClasses.root = classNames(modifiedClasses.root, rootClassName)

  return <Tab classes={modifiedClasses} {...props} />
}

const SingleIconTextTab = withStyles(theme => {
  const { palette, type, fontSize } = theme
  return {
    root: {
      minHeight: 63,
      minWidth: 'initial',
      color: palette[type].singleIconTab.color,
      cursor: 'pointer',
      margin: '0 20px',
      padding: 0,

      '&:hover': {
        color: palette[type].singleIconTab.hover.color
      }
    },
    wrapper: {
      height: '100%'
    },
    selected: {
      color: '#0a83c8',

      '&:hover': {
        color: '#0a83c8'
      }
    },
    tabRootWithLabel: {
      minHeight: 90,
      maxHeight: 90,
      width: 75,
      padding: '16px 0 12px 0',
      margin: '0 5px',
      textTransform: 'capitalize',
      alignItems: 'flex-start',
      fontSize: fontSize.small,
      lineHeight: 'normal'
    }
  }
})(CustomTab)

export const SmallIconTab = withStyles(() => ({
  root: {
    minHeight: 48
  }
}))(SingleIconTextTab)

export default SingleIconTextTab
