import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { isAuthorizedSelector } from 'selectors/appSelectors'
import { routes } from 'constants/routes'
import useUser from 'hooks/useUser'
import useLogoutListener from 'hooks/useLogoutListener'
import useAutoLogout from 'hooks/useAutoLogout'
import useRefreshToken from 'hooks/useRefreshToken'
import InactivityTimer from './InactivityTimer'

const AuthLayout = () => {
  const isAuthorized = useSelector(isAuthorizedSelector)
  const location = useLocation()
  const { getUserDetails } = useUser()

  useEffect(() => {
    if (isAuthorized) {
      getUserDetails()
    }
    //eslint-disable-next-line
  }, [isAuthorized])

  useLogoutListener()
  useAutoLogout()
  useRefreshToken()

  return isAuthorized ? (
    <>
      <Outlet />
      <InactivityTimer />
    </>
  ) : (
    <Navigate to={routes.signIn.root} replace state={{ from: location }} />
  )
}

export default AuthLayout
