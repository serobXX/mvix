import { useMemo } from 'react'
import moment from 'moment'

import BaseComponent from '../BaseComponent'
import { BACKEND_DATE_FORMAT } from 'constants/dateTimeFormats'
import { routes } from 'constants/routes'

const TodayActivityPage = () => {
  const queryParams = useMemo(
    () => ({
      beforeDate: moment().format(BACKEND_DATE_FORMAT),
      afterDate: moment().format(BACKEND_DATE_FORMAT)
    }),
    []
  )

  return (
    <BaseComponent
      title="Today's Activities"
      queryParams={queryParams}
      hideAddButton
      hideAddRoute
      rootRoute={routes.activity.today}
    />
  )
}

export default TodayActivityPage
