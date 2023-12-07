import { useMemo } from 'react'

import BaseComponent from '../BaseComponent'
import { routes } from 'constants/routes'

const hideStatusOptions = ['Completed']
const PendingActivityPage = () => {
  const queryParams = useMemo(
    () => ({
      activityStatus: 'Deferred,In Progress,Not started,Waiting for input'
    }),
    []
  )

  return (
    <BaseComponent
      title="Pending Activities"
      queryParams={queryParams}
      hideAddButton
      rootRoute={routes.activity.pending}
      hideStatusOptions={hideStatusOptions}
    />
  )
}

export default PendingActivityPage
