import { makeStyles } from '@material-ui/core'
import AccountNavigationLink from './AccountNavigationLink'
import classNames from 'classnames'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'
import { useNavigate } from 'react-router-dom'
import { parseToAbsolutePath } from 'utils/urlUtils'
import { routes } from 'constants/routes'

const useStyles = makeStyles(({ palette, type }) => ({
  accountNavigation: {
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    color: palette[type].header.rightAction.iconColor
  }
}))

const AccountNavigation = () => {
  const classes = useStyles()
  const navigate = useNavigate()

  const handleClickNotification = () => {
    navigate(parseToAbsolutePath(routes.notifications.root))
  }

  return (
    <nav className={classes.accountNavigation}>
      <AccountNavigationLink
        linkIconClassName={classNames(
          getIconClassName(iconNames.notificationNav),
          classes.icon
        )}
        iconButtonClassName="hvr-grow"
        onClick={handleClickNotification}
      />
    </nav>
  )
}

export default AccountNavigation
