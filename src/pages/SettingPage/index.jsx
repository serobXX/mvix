import { useMemo } from 'react'

import {
  useGetSiteConfigsQuery,
  useUpdateSiteConfigMutation
} from 'api/siteConfigApi'
import GridLayout from 'components/GridLayout'
import { DashboardLoader } from 'components/loaders'
import { BIG_LIMIT } from 'constants/app'
import { notifyLabels } from 'constants/notifyAnalyzer'
import useNotifyAnalyzer from 'hooks/useNotifyAnalyzer'
import { cardNames } from './config'
import PaymentProcessorCard from './components/PaymentProcessorCard'

const SettingPage = () => {
  const { data, isFetching } = useGetSiteConfigsQuery({
    limit: BIG_LIMIT
  })
  const [updateSiteConfig, updateReducer] = useUpdateSiteConfigMutation()

  useNotifyAnalyzer({
    entityName: 'Settings',
    watchArray: [updateReducer],
    labels: [notifyLabels.update]
  })

  const cards = useMemo(
    () => ({
      [cardNames.PAYMENT_PROCESSOR]: (
        <PaymentProcessorCard data={data} onUpdate={updateSiteConfig} />
      )
    }),
    [data, updateSiteConfig]
  )

  const positions = useMemo(
    () => [
      {
        x: 0,
        y: 0,
        w: 1,
        h: 5,
        i: cardNames.PAYMENT_PROCESSOR
      }
    ],
    []
  )

  return isFetching ? (
    <DashboardLoader />
  ) : (
    <GridLayout cards={cards} positions={positions} disableDragging />
  )
}

export default SettingPage
