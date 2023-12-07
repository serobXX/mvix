import { useMemo } from 'react'
import { _get } from 'utils/lodash'
import useUser from './useUser'

export default function useUserPermissionGroupsByType(permissionType) {
  const user = useUser()

  return useMemo(() => {
    return Object.entries(_get(user, `permissions`, {}))
      .filter(([, group]) => group[permissionType])
      .map(([name]) => name)
  }, [user, permissionType])
}
