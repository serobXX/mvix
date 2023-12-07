import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

import useUser from './useUser'
import { isUserProfileValid } from 'utils/profileUtils'
import { setProfileOpened } from 'slices/appSlice'
import { profileOpenedSelector } from 'selectors/appSelectors'

const useValidateUserProfile = () => {
  const { data: user } = useUser()
  const dispatch = useDispatch()
  const location = useLocation()
  const profileOpened = useSelector(profileOpenedSelector)

  useEffect(() => {
    if (!!user?.id && !isUserProfileValid(user)) {
      dispatch(setProfileOpened(true))
    }
    //eslint-disable-next-line
  }, [user])

  useEffect(() => {
    if (isUserProfileValid(user) && profileOpened) {
      dispatch(setProfileOpened(false))
    }
    //eslint-disable-next-line
  }, [location.pathname])

  return useMemo(() => isUserProfileValid(user), [user])
}

export default useValidateUserProfile
