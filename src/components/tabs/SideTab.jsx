import React from 'react'
import { Tab, withStyles } from '@material-ui/core'
import classNames from 'classnames'

const SideTab = withStyles(theme => {
  const { palette, type, fontSize, fontWeight } = theme
  return {
    root: {
      minWidth: '210px',
      padding: 0,
      margin: '5px -1px 5px 0',
      borderTop: 'solid 1px transparent',
      borderLeft: 'solid 1px transparent',
      borderBottom: 'solid 1px transparent',
      textTransform: 'none',
      textAlign: 'left',
      color: '#74809A',
      cursor: 'pointer',
      fontSize: fontSize.primary,
      fontWeight: fontWeight.bold,
      width: 'auto',
      lineHeight: '48px'
    },
    selected: {
      borderTopWidth: 1,
      borderLeftWidth: 1,
      borderBottomWidth: 1,
      borderStyle: 'solid',
      borderColor: palette[type].sideModal.content.border,
      borderRadius: '15px 0 0 15px',
      color: palette[type].sideTab.selected.color,
      background: palette[type].sideTab.selected.background
    },
    wrapper: {
      flexDirection: 'row',
      justifyContent: 'flex-start'
    },
    labelIcon: {
      minHeight: 'auto'
    }
  }
})(Tab)

export default SideTab

const TabIconStyles = () => ({
  tabIconWrap: {
    width: '77px',
    paddingLeft: '10px',
    fontSize: '22px',
    lineHeight: '18px'
  }
})

export const TabIcon = withStyles(TabIconStyles)(
  ({ iconClassName = '', iconWrapClassName = '', classes }) => (
    <div className={classNames(classes.tabIconWrap, iconWrapClassName)}>
      <i className={iconClassName} />
    </div>
  )
)
