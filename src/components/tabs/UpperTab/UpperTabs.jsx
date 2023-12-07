import { Tabs, withStyles } from '@material-ui/core'

const UpperTabs = withStyles(({ palette, type }) => ({
  root: {
    width: '100%',
    background: palette[type].upperTab.background,
    height: 'fit-content'
  },
  fixed: {
    overflow: 'hidden !important',

    '&:hover': {
      overflow: 'auto !important'
    },
    '&::-webkit-scrollbar': {
      width: '6px',
      height: '6px'
    },
    '&::-webkit-scrollbar-thumb': {
      background: palette[type].scrollbar.background,
      borderRadius: '5px'
    }
  },
  indicator: {
    background: palette[type].upperTab.selected.color,
    minWidth: 130
  }
}))(Tabs)

export default UpperTabs
