import { Tab, withStyles } from '@material-ui/core'

const UpperTab = withStyles(theme => {
  const { palette, type, fontSize, fontWeight } = theme
  return {
    root: {
      color: '#74809A',
      cursor: 'pointer',
      fontSize: fontSize.primary,
      fontWeight: fontWeight.bold,
      minWidth: 130
    },
    selected: {
      color: palette[type].upperTab.selected.color
    }
  }
})(Tab)

export default UpperTab
