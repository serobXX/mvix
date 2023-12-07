import { useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

import { useSocialLoginMutation } from 'api/authApi'
import { setAuthorized } from 'slices/appSlice'
import useSnackbar from './useSnackbar'
import { storageClearToken, storageSetToken } from 'utils/storage'
import { routes } from 'constants/routes'
import { parseToAbsolutePath } from 'utils/urlUtils'

const useAuth = () => {
  const dispatch = useDispatch()
  const { showSnackbar } = useSnackbar()
  const routerPush = useNavigate()
  const { state: routerState } = useLocation()
  const [socialLoginUser, { data, isLoading, error, isSuccess, isError }] =
    useSocialLoginMutation()

  useEffect(() => {
    if (isError && error?.message) {
      showSnackbar(error?.message, 'error')
      storageClearToken()
    }
    //eslint-disable-next-line
  }, [isError])

  useEffect(() => {
    if (isSuccess) {
      dispatch(setAuthorized(true))
      storageClearToken()
      storageSetToken(data.tokenType, data.accessToken, data.expiresIn)
      if (routerState?.from && !routerState?.from?.state?.fromLogout) {
        routerState.from.state = { ...routerState.from.state, fromLogin: true }
        routerPush(routerState.from)
      } else {
        routerPush({
          pathname: parseToAbsolutePath(routes.dashboard.root),
          state: { fromLogin: true }
        })
      }
    }
    //eslint-disable-next-line
  }, [isSuccess])

  return useMemo(
    () => ({
      socialLoginUser,
      data,
      isLoading,
      error,
      isSuccess,
      isError
    }),
    [socialLoginUser, data, isLoading, error, isSuccess, isError]
  )
}

export default useAuth
