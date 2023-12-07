import { useMemo } from 'react'
import GridLayout from 'components/GridLayout'

import {
  SalesPersonRevenueCard,
  SalesRevenueCard,
  SalesStageCard
} from 'components/cards/dashboardCards'
import { salesCardNames } from 'constants/dashboard'

const SalesSection = ({ data }) => {
  const cards = useMemo(
    () => ({
      [salesCardNames.stageCard]: (
        <SalesStageCard data={data?.opportunityStages} />
      ),
      [salesCardNames.revenueCard]: (
        <SalesRevenueCard data={data?.totalRevenueMonthly} />
      ),
      [salesCardNames.salesPersonCard]: (
        <SalesPersonRevenueCard data={data?.totalRevenueBySalesPerson} />
      )
    }),
    [data]
  )
  const positions = useMemo(
    () => [
      {
        x: 0,
        y: 0,
        w: 1,
        h: 14,
        i: salesCardNames.stageCard
      },
      {
        x: 1,
        y: 0,
        w: 2,
        h: 14,
        i: salesCardNames.revenueCard
      },
      {
        x: 3,
        y: 0,
        w: 1,
        h: 14,
        i: salesCardNames.salesPersonCard
      }
    ],
    []
  )

  return (
    <div>
      <GridLayout
        cards={cards}
        positions={positions}
        disableDragging
        gridWidth={1800}
      />
    </div>
  )
}

export default SalesSection
