import { useMemo } from 'react'
import GridLayout from 'components/GridLayout'

import {
  MarketingCustomerCard,
  MarketingLeadCard
} from 'components/cards/dashboardCards'
import { marketingCardNames } from 'constants/dashboard'

const MarketingSection = ({ data }) => {
  const cards = useMemo(
    () => ({
      [marketingCardNames.leadCard]: (
        <MarketingLeadCard data={data?.leadData} />
      ),
      [marketingCardNames.customerCard]: (
        <MarketingCustomerCard data={data?.newCustomers} />
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
        i: marketingCardNames.leadCard
      },
      {
        x: 1,
        y: 0,
        w: 2,
        h: 14,
        i: marketingCardNames.customerCard
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

export default MarketingSection
