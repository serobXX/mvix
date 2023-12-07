import { useMemo, useState } from 'react'
import { Grid, makeStyles } from '@material-ui/core'

import { ToggleTab } from 'components/tabs'
import GridCardBase from '../GridCardBase'
import FunnelChart from 'components/charts/FunnelChart'
import { parseCurrency } from 'utils/generalUtils'

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

const typeTabConstants = {
  COUNT: 'count',
  AMOUNT: 'amount'
}

const typeTabs = [
  { label: '#', value: typeTabConstants.COUNT },
  { label: '$', value: typeTabConstants.AMOUNT }
]

const SalesStageCard = ({ data }) => {
  const classes = useStyles()
  const [typeSelectedTab, setTypeSelectedTab] = useState(
    typeTabConstants.AMOUNT
  )

  const chartData = useMemo(() => {
    if (data) {
      let stageClosed = 0
      switch (typeSelectedTab) {
        case typeTabConstants.AMOUNT:
          stageClosed = data.sum.reduce((a, b) => {
            if (
              b.stage &&
              ['Closed Won', 'Closed Lost'].includes(b.stage?.name)
            ) {
              a += b.TotalRevenue || 0
            }
            return a
          }, 0)
          return (
            data.sum && [
              ...data.sum
                .filter(
                  ({ stage }) =>
                    !!stage &&
                    !['Closed Won', 'Closed Lost'].includes(stage?.name)
                )
                .map(({ TotalRevenue, stage }) => ({
                  id: stage?.id,
                  value: TotalRevenue || 0,
                  label: stage?.name
                })),
              {
                id: 7,
                value: stageClosed,
                label: 'Closed Won/Lost'
              }
            ]
          )
        case typeTabConstants.COUNT:
          stageClosed = data.count.reduce((a, b) => {
            if (
              b.stage &&
              ['Closed Won', 'Closed Lost'].includes(b.stage?.name)
            ) {
              a += b.Total || 0
            }
            return a
          }, 0)
          return (
            data.count && [
              ...data.count
                .filter(
                  ({ stage }) =>
                    !!stage &&
                    !['Closed Won', 'Closed Lost'].includes(stage?.name)
                )
                .map(({ Total, stage }) => ({
                  id: stage?.id,
                  value: Total || 0,
                  label: stage?.name
                })),
              {
                id: 7,
                value: stageClosed,
                label: 'Closed Won/Lost'
              }
            ]
          )
        default:
          return []
      }
    }
    return []
  }, [data, typeSelectedTab])

  return (
    <GridCardBase
      variant={2}
      title="Opportunity Stage"
      rootClassName={classes.cardRoot}
    >
      <div className={classes.contentRoot}>
        <Grid container justifyContent="center" className={classes.chartRoot}>
          {!!chartData.length && (
            <FunnelChart
              data={chartData}
              margin={{ top: 0 }}
              isCustomFunnel
              valueFormat={
                typeSelectedTab === typeTabConstants.AMOUNT && parseCurrency
              }
              fullHeight
            />
          )}
        </Grid>
        <Grid container>
          <ToggleTab
            tabs={typeTabs}
            value={typeSelectedTab}
            onChange={(_, tab) => {
              if (tab) setTypeSelectedTab(tab)
            }}
            tabWidth={60}
          />
        </Grid>
      </div>
    </GridCardBase>
  )
}

export default SalesStageCard
