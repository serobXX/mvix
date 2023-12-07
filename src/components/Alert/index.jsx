import { withStyles } from '@material-ui/core'
import { Alert } from '@material-ui/lab'

export default withStyles(({ palette, type }) => ({
  standardWarning: {
    ...palette[type].alert.warning
  },
  standardSuccess: {
    ...palette[type].alert.success
  },
  standardInfo: {
    ...palette[type].alert.info
  },
  standardError: {
    ...palette[type].alert.error
  }
}))(Alert)
