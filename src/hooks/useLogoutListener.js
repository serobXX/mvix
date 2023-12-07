import { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import eventNames from 'constants/eventNames'
import { useLogoutMutation } from 'api/authApi'
import { registeredApi } from 'api/index'
import { resetAll } from '../store/actions'
import { storageClearToken, storageGetItem } from 'utils/storage'
import { setTheme } from 'slices/appSlice'
import localStorageItems from 'constants/localStorageItems'
import { useLocation, useNavigate } from 'react-router-dom'

export default function useLogoutListener() {
  const dispatch = useDispatch()
  const [logout, { isLoading }] = useLogoutMutation()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = useCallback(
    async ({ detail: { fromLogout } = {} }) => {
      const logoutPromise = new Promise(resolve => {
        if (!isLoading) {
          logout()
            .unwrap()
            .then(resolve)
            .catch(() => resolve())
        } else resolve()
      })
      await logoutPromise
      navigate(location.pathname, { replace: true, state: { fromLogout } })
      storageClearToken()
      registeredApi.forEach(api => {
        dispatch(api.util.resetApiState())
      })
      dispatch(resetAll())
      dispatch(setTheme(storageGetItem(localStorageItems.theme)))
    },
    [logout, isLoading, dispatch, location, navigate]
  )

  useEffect(() => {
    document.addEventListener(eventNames.logout, handleLogout)
    return () => {
      document.removeEventListener(eventNames.logout, handleLogout)
    }
  }, [handleLogout])
}
