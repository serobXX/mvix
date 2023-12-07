import { useCallback, useEffect, useMemo } from 'react'
import { makeStyles } from '@material-ui/core'

import {
  useLazyGetDashboardQuery,
  useUpdateDashboardStatsMutation
} from 'api/dashboardApi'
import DashboardAccordion from './DashboardAccordion'
import {
  dashboardSectionTitles,
  dashboardSectionTypes
} from 'constants/dashboard'
import MarketingSection from './sections/MarketingSection'
import SalesSection from './sections/SalesSection'
import useUser from 'hooks/useUser'
import { DashboardLoader } from 'components/loaders'
import { _get } from 'utils/lodash'

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing(2),
    marginBottom: spacing(2)
  }
}))

const DashboardPage = () => {
  const classes = useStyles()
  const { data: user, isLoading: userLoading } = useUser()
  const [getDashboard, { data, isFetching }] = useLazyGetDashboardQuery()
  const [updateStats, updateReducer] = useUpdateDashboardStatsMutation()

  useEffect(() => {
    getDashboard(null, true)
    //eslint-disable-next-line
  }, [])

  const sections = useMemo(
    () =>
      [
        {
          title: dashboardSectionTitles[dashboardSectionTypes.marketing],
          initialOpen: true,
          value: dashboardSectionTypes.marketing,
          element: <MarketingSection data={data?.marketing} />,
          render: _get(
            user?.dashboardBlocks,
            `${dashboardSectionTypes.marketing}`,
            false
          )
        },
        {
          title: dashboardSectionTitles[dashboardSectionTypes.sales],
          element: <SalesSection data={data?.sales} />,
          value: dashboardSectionTypes.sales,
          render: _get(
            user?.dashboardBlocks,
            `${dashboardSectionTypes.sales}`,
            false
          )
        }
      ].filter(({ render }) => render !== false),
    [data, user?.dashboardBlocks]
  )

  const handleRefresh = useCallback(
    section => event => {
      event.stopPropagation()
      updateStats({
        sections: [section]
      })
    },
    [updateStats]
  )

  return (
    <div className={classes.root}>
      {isFetching || userLoading ? (
        <DashboardLoader />
      ) : (
        sections.map(({ title, initialOpen, element, value }) => (
          <DashboardAccordion
            key={`dashboard-section-${title.replaceAll(' ', '-')}`}
            title={title}
            initialOpen={initialOpen}
            hideAccordion={sections.length === 1}
            onRefresh={handleRefresh(value)}
            refreshLoading={updateReducer?.isLoading}
          >
            {element}
          </DashboardAccordion>
        ))
      )}
    </div>
  )
}

export default DashboardPage
