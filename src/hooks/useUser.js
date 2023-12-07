import { useCallback, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'

import { useLazyGetMeQuery, useUpdateMeMutation } from 'api/authApi'
import useSnackbar from './useSnackbar'
import useNotifyAnalyzer from './useNotifyAnalyzer'
import { notifyLabels } from 'constants/notifyAnalyzer'
import apiCacheKeys from 'constants/apiCacheKeys'
import { transformPermission } from 'utils/permissionsUtils'
import { isAuthorizedSelector } from 'selectors/appSelectors'
import { getMeSelector } from 'selectors/authSelectors'
import { ADMINISTRATOR } from 'constants/roleConstants'

export default function useUser(initialFetch = false, onUserUpdated) {
  const [trigger] = useLazyGetMeQuery()
  const { data, isLoading, isFetching, error } = useSelector(getMeSelector)
  const [updateUser, updateData] = useUpdateMeMutation({
    fixedCacheKey: apiCacheKeys.me
  })
  const isAuthorized = useSelector(isAuthorizedSelector)
  const { showSnackbar } = useSnackbar()

  useEffect(() => {
    if (isAuthorized && !isLoading && !data?.id && !error && initialFetch) {
      trigger(null, true)
    }
    //eslint-disable-next-line
  }, [isAuthorized])

  const fetcher = useCallback(() => {
    trigger(null)
  }, [trigger])

  useNotifyAnalyzer({
    fetcher,
    watchArray: [updateData],
    labels: [notifyLabels.update],
    entityName: 'User',
    hideNotification: true
  })

  useEffect(() => {
    if (updateData.isSuccess) {
      showSnackbar('User has been updated', 'success')
      fetcher()
      onUserUpdated && onUserUpdated()
    }
    //eslint-disable-next-line
  }, [updateData.isSuccess])

  const permissions = useMemo(() => {
    if (data?.role?.permission) {
      return transformPermission(data?.role?.permission)
    }
    return {}
  }, [data?.role?.permission])

  const role = useMemo(
    () => ({
      ...(data?.role || {}),
      isSystem: data?.role?.name === ADMINISTRATOR
    }),
    [data?.role]
  )

  return useMemo(
    () => ({
      getUserDetails: fetcher,
      updateUserDetails: updateUser,
      updateData,
      isLoading,
      isFetching,
      data,
      role,
      permissions
    }),
    [
      fetcher,
      updateUser,
      updateData,
      isLoading,
      isFetching,
      data,
      permissions,
      role
    ]
  )
}
