import { Tabs, withStyles } from '@material-ui/core'

const SingleIconTextTabs = withStyles({
  indicator: {
    display: 'none'
  },
  flexContainer: {
    flexWrap: 'wrap'
  }
})(Tabs)

export default SingleIconTextTabs
