import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import moment from 'moment'
import { useSelector } from 'react-redux'

import { storageGetItem, storageSetItem } from 'utils/storage'
import localStorageItems from 'constants/localStorageItems'
import { isAuthorizedSelector } from 'selectors/appSelectors'
import { AUTO_LOGOUT_TIME } from 'constants/app'
import eventNames from 'constants/eventNames'

export default function useAutoLogout() {
  const location = useLocation()
  const isAuthorized = useSelector(isAuthorizedSelector)
  // const userDetails = useUserDetails()

  const [initialized, setInitialized] = useState(false)

  useEffect(
    () => {
      if (initialized && isAuthorized) {
        storageSetItem(localStorageItems.lastActivity, moment().format())
      }
    },
    // eslint-disable-next-line
    [location, isAuthorized]
  )

  useEffect(
    () => {
      const lastActivity = storageGetItem(localStorageItems.lastActivity)
      const expiresIn = storageGetItem(localStorageItems.expiresIn)
      if (isAuthorized) {
        if (expiresIn && new Date().getTime() > expiresIn) {
          document.dispatchEvent(new Event(eventNames.logout))
        } else if (lastActivity) {
          const diff = moment().diff(lastActivity, 'seconds')
          if (diff > AUTO_LOGOUT_TIME) {
            document.dispatchEvent(new Event(eventNames.logout))
          }
          setInitialized(true)
        } else {
          setInitialized(true)
        }
      }
    },
    // eslint-disable-next-line
    [isAuthorized]
  )
}
