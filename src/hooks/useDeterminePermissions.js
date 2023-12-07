import { useMemo } from 'react'
import useUser from './useUser'
import { _get } from 'utils/lodash'

const useDeterminePermissions = findPermission => {
  const user = useUser()

  return useMemo(() => {
    return Array.isArray(findPermission)
      ? findPermission.map(permission =>
          _get(user, `permissions[${permission}]`, {})
        )
      : _get(user, `permissions[${findPermission}]`, {})
  }, [user, findPermission])
}

export default useDeterminePermissions
