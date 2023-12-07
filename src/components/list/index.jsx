import { List, withStyles } from '@material-ui/core'

export default withStyles(theme => {
  const { palette, type } = theme
  return {
    root: {
      background: palette[type].list.background
    }
  }
})(List)
