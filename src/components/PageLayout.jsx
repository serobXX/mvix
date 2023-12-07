import { Outlet } from 'react-router-dom'
import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'
import { useSelector } from 'react-redux'

import Header from 'components/Header'
import { SCREEN_MAX_WIDTH, zIndexes } from 'constants/ui'
import {
  isConfirmationRequiredSelector,
  profileOpenedSelector
} from 'selectors/appSelectors'
import useValidateUserProfile from 'hooks/useValidateUserProfile'
import { ProfilePage } from 'pages/index'

const useStyles = makeStyles(() => ({
  mainContainer: {
    maxWidth: SCREEN_MAX_WIDTH,
    margin: '16px auto 0',
    paddingTop: 80
  },
  confirmation: {
    '&::before': {
      content: '""',
      position: 'fixed',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      zIndex: zIndexes.confirmation
    }
  }
}))

const PageLayout = () => {
  const classes = useStyles()
  const isConfirmationRequired = useSelector(isConfirmationRequiredSelector)
  const profileOpened = useSelector(profileOpenedSelector)

  const isValid = useValidateUserProfile()

  return (
    <>
      <Header />
      <div
        className={classNames(classes.mainContainer, 'main-container', {
          [classes.confirmation]: isConfirmationRequired
        })}
      >
        {isValid && <Outlet />}
        {profileOpened && <ProfilePage />}
      </div>
    </>
  )
}

export default PageLayout
