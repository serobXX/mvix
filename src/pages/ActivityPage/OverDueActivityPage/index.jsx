import { useMemo } from 'react'
import moment from 'moment'

import BaseComponent from '../BaseComponent'
import { BACKEND_DATE_FORMAT } from 'constants/dateTimeFormats'
import { routes } from 'constants/routes'

const hideStatusOptions = ['Completed']
const OverDueActivityPage = () => {
  const queryParams = useMemo(
    () => ({
      beforeDate: moment().subtract(1, 'day').format(BACKEND_DATE_FORMAT),
      activityStatus: 'Deferred,In Progress,Not started,Waiting for input'
    }),
    []
  )

  return (
    <BaseComponent
      title="Over Due Activities"
      queryParams={queryParams}
      hideAddButton
      hideAddRoute
      rootRoute={routes.activity.overDue}
      hideStatusOptions={hideStatusOptions}
    />
  )
}

export default OverDueActivityPage
