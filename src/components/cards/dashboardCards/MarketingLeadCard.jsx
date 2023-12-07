import { useMemo, useState } from 'react'
import { Grid, makeStyles } from '@material-ui/core'

import { ToggleTab } from 'components/tabs'
import GridCardBase from '../GridCardBase'
import FunnelChart from 'components/charts/FunnelChart'

const useStyles = makeStyles(() => ({
  cardRoot: {
    display: 'flex',
    flexDirection: 'column'
  },
  contentRoot: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column'
  },
  chartRoot: {
    flexGrow: 1
  }
}))

const dateTabConstants = {
  MTD: 'mtd',
  QTD: 'qtd',
  YTD: 'ytd'
}

const yearTabConstants = {
  THIS_YEAR: 'thisYear',
  LAST_YEAR: 'lastYear'
}

const dateTabs = [
  { label: 'MTD', value: dateTabConstants.MTD },
  { label: 'QTD', value: dateTabConstants.QTD },
  { label: 'YTD', value: dateTabConstants.YTD }
]

const yearTabs = [
  { label: 'Last Year', value: yearTabConstants.LAST_YEAR },
  { label: 'Current Year', value: yearTabConstants.THIS_YEAR }
]

const MarketingLeadCard = ({ data }) => {
  const classes = useStyles()
  const [dateSelectedTab, setDateSelectedTab] = useState(dateTabConstants.MTD)
  const [yearSelectedTab, setYearSelectedTab] = useState(
    yearTabConstants.THIS_YEAR
  )

  const chartData = useMemo(() => {
    if (data) {
      const _data =
        yearSelectedTab === yearTabConstants.LAST_YEAR
          ? data.lastYear
          : data.currentYear
      switch (dateSelectedTab) {
        case dateTabConstants.MTD:
          return _data.Month
        case dateTabConstants.QTD:
          return _data.Quarter
        case dateTabConstants.YTD:
          return _data.Year
        default:
          return []
      }
    }
    return []
  }, [data, dateSelectedTab, yearSelectedTab])

  return (
    <GridCardBase
      variant={2}
      title="Leads"
      rootClassName={classes.cardRoot}
      headerComponent={
        <ToggleTab
          tabs={dateTabs}
          value={dateSelectedTab}
          onChange={(_, tab) => {
            if (tab) setDateSelectedTab(tab)
          }}
          tabWidth={70}
        />
      }
    >
      <div className={classes.contentRoot}>
        <Grid container justifyContent="center" className={classes.chartRoot}>
          {!!chartData?.length && (
            <FunnelChart
              data={chartData}
              margin={{ top: 0, left: 40, right: 40 }}
              isCustomFunnel
              fullHeight
            />
          )}
        </Grid>
        <Grid container>
          <ToggleTab
            tabs={yearTabs}
            value={yearSelectedTab}
            onChange={(_, tab) => {
              if (tab) setYearSelectedTab(tab)
            }}
            tabWidth={100}
          />
        </Grid>
      </div>
    </GridCardBase>
  )
}

export default MarketingLeadCard
