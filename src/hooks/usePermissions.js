import { useMemo } from 'react'

import useUser from 'hooks/useUser'

export default function usePermissions(...permissions) {
  const { role } = useUser()

  return useMemo(
    () =>
      permissions.map(
        permission =>
          !!role?.permissions.find(({ name }) => name === permission)
      ),
    [role, permissions]
  )
}
