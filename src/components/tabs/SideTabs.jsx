import { Tabs, withStyles } from '@material-ui/core'

const SideTabs = withStyles({
  root: {
    overflow: 'visible'
  },
  flexContainer: {
    flexDirection: 'column'
  },
  scroller: {
    padding: '65px 0 0 70px'
  },
  fixed: {
    overflow: 'visible'
  },
  indicator: {
    display: 'none'
  }
})(Tabs)

export default SideTabs
