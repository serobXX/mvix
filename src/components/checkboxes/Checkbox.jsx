import { withStyles, Checkbox } from '@material-ui/core'

export default withStyles(theme => {
  const { palette, type } = theme
  return {
    root: {
      color: palette[type].checkbox.color
    },
    indeterminate: {
      color: '#afb7c7'
    },
    disabled: {
      '& span svg': {
        fill: 'rgb(179 179 179 / 26%)'
      }
    }
  }
})(Checkbox)
