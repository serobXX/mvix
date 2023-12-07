import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getNow } from 'utils/date'
import { isAuthorizedSelector } from 'selectors/appSelectors'
import { _subtract, _toNumber } from 'utils/lodash'
import { storageGetItem, storageSetToken } from 'utils/storage'
import localStorageItems from 'constants/localStorageItems'
import { useRefreshTokenMutation } from 'api/authApi'

function useRefreshToken() {
  const isAuthorized = useSelector(isAuthorizedSelector)
  const [updateToken, { data, reset }] = useRefreshTokenMutation()

  useEffect(() => {
    if (isAuthorized && !data) {
      const millisecondsToExpire = _subtract(
        _toNumber(storageGetItem(localStorageItems.expiresIn)),
        getNow()
      )
      const timeout = setTimeout(() => {
        updateToken()
      }, _subtract(millisecondsToExpire, 60000))

      return () => clearTimeout(timeout)
    }
    //eslint-disable-next-line
  }, [isAuthorized, data])

  useEffect(() => {
    if (data) {
      storageSetToken(data.tokenType, data.accessToken, data.expiresIn)
      reset()
    }
    //eslint-disable-next-line
  }, [data])
}

export default useRefreshToken
