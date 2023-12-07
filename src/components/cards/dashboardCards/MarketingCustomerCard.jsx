import { useMemo, useState } from 'react'
import { Grid, makeStyles } from '@material-ui/core'

import { ToggleTab } from 'components/tabs'
import GridCardBase from '../GridCardBase'
import { BarChart } from 'components/charts'
import { _get } from 'utils/lodash'
import moment from 'moment'
import { parseCurrency } from 'utils/generalUtils'
import { FormControlCheckboxes } from 'components/formControls'

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
  },
  legendsRoot: {
    display: 'flex',
    alignItems: 'flex-end',
    height: '100%',
    paddingBottom: 40
  }
}))

const dateTabConstants = {
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly'
}

const typeTabConstants = {
  COUNT: 'count',
  AMOUNT: 'amount'
}

const yearConstants = {
  lastYear: 'lastYear',
  currentYear: 'currentYear'
}

const dateTabs = [
  { label: 'Monthly', value: dateTabConstants.MONTHLY },
  { label: 'Quarterly', value: dateTabConstants.QUARTERLY }
]

const typeTabs = [
  { label: '#', value: typeTabConstants.COUNT },
  { label: '$', value: typeTabConstants.AMOUNT }
]

const yearsOptions = [
  { label: 'Last Year', value: yearConstants.lastYear },
  { label: 'Current Year', value: yearConstants.currentYear }
]

const MarketingCustomerCard = ({ data }) => {
  const classes = useStyles()
  const [dateSelectedTab, setDateSelectedTab] = useState(
    dateTabConstants.MONTHLY
  )
  const [typeSelectedTab, setTypeSelectedTab] = useState(
    typeTabConstants.AMOUNT
  )
  const [visibleLegends, setVisibleLegends] = useState([
    yearConstants.currentYear
  ])

  const chartData = useMemo(() => {
    if (data) {
      const path = `${
        typeSelectedTab === typeTabConstants.COUNT ? 'count' : 'amount'
      }.${
        dateSelectedTab === dateTabConstants.MONTHLY ? 'byMonth' : 'byQuarter'
      }`
      const currentYear = _get(data, `currentYear.${path}`, [])
      const lastYear = _get(data, `lastYear.${path}`, [])

      switch (dateSelectedTab) {
        case dateTabConstants.MONTHLY:
          return Array(12)
            .fill()
            .map((_, index) => {
              const currentRecord = currentYear.find(
                ({ Month }) => Month === index + 1
              )
              const lastRecord = lastYear.find(
                ({ Month }) => Month === index + 1
              )
              return {
                name: moment().set('month', index).format('MMM'),
                'Last Year': lastRecord?.TotalRevenue || lastRecord?.Total || 0,
                'Current Year':
                  currentRecord?.TotalRevenue || currentRecord?.Total || 0
              }
            })
        case dateTabConstants.QUARTERLY:
          return Array(4)
            .fill()
            .map((_, index) => {
              const currentRecord = currentYear.find(
                ({ Month }) => Month === index + 1
              )
              const lastRecord = lastYear.find(
                ({ Month }) => Month === index + 1
              )
              return {
                name: `${moment()
                  .set('quarter', index + 1)
                  .startOf('quarter')
                  .format('MMM')} - ${moment()
                  .set('quarter', index + 1)
                  .endOf('quarter')
                  .format('MMM')}`,
                'Last Year': lastRecord?.TotalRevenue || lastRecord?.Total || 0,
                'Current Year':
                  currentRecord?.TotalRevenue || currentRecord?.Total || 0
              }
            })
        default:
          return []
      }
    }
    return []
  }, [data, dateSelectedTab, typeSelectedTab])

  const filteredData = useMemo(() => {
    return chartData.map(_data => {
      const d = { ..._data }
      if (!visibleLegends.includes(yearConstants.lastYear))
        delete d['Last Year']
      if (!visibleLegends.includes(yearConstants.currentYear))
        delete d['Current Year']
      return d
    })
  }, [chartData, visibleLegends])

  const handleToggleLegends = values => {
    if (values.length) {
      setVisibleLegends(values)
    }
  }

  return (
    <GridCardBase
      variant={2}
      title={
        typeSelectedTab === typeTabConstants.AMOUNT
          ? 'Total Revenue'
          : 'New Accounts'
      }
      rootClassName={classes.cardRoot}
      headerComponent={
        <ToggleTab
          tabs={dateTabs}
          value={dateSelectedTab}
          onChange={(_, tab) => {
            if (tab) setDateSelectedTab(tab)
          }}
          tabWidth={100}
        />
      }
    >
      <div className={classes.contentRoot}>
        <Grid
          container
          justifyContent="center"
          wrap="nowrap"
          className={classes.chartRoot}
        >
          <Grid item className={classes.chartRoot}>
            {!!chartData.length && (
              <BarChart
                data={filteredData}
                keys={['Last Year', 'Current Year']}
                groupMode={visibleLegends.length > 1 ? 'grouped' : 'stacked'}
                colorBy={undefined}
                valueFormat={
                  typeSelectedTab === typeTabConstants.AMOUNT && parseCurrency
                }
                fullHeight
              />
            )}
          </Grid>
          <Grid item>
            <div className={classes.legendsRoot}>
              <FormControlCheckboxes
                options={yearsOptions}
                value={visibleLegends}
                onChange={handleToggleLegends}
                fullWidth
              />
            </div>
          </Grid>
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

export default MarketingCustomerCard
