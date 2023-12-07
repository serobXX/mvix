import { withStyles, Paper } from '@material-ui/core'

const TablePaper = withStyles(theme => {
  const { palette, type } = theme
  return {
    root: {
      background: palette[type].tableLibrary.paper.background
    }
  }
})(Paper)

const ModalPaper = withStyles(theme => {
  const { palette, type } = theme
  return {
    root: {
      background: palette[type].modal.background
    }
  }
})(Paper)

export { TablePaper, ModalPaper }
