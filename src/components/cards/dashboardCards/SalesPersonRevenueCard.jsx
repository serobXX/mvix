import { useMemo, useState } from 'react'
import { Grid, makeStyles } from '@material-ui/core'

import GridCardBase from '../GridCardBase'
import { parseCurrency } from 'utils/generalUtils'
import { AnimatedPieChart } from 'components/charts'
import { defaultOwner } from 'constants/detailView'
import { FormControlReactSelect } from 'components/formControls'
import { EmptyPlaceholder } from 'components/placeholder'

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
  dateSelectContainer: {
    width: 140
  },
  cardHeaderText: {
    maxWidth: `130px !important`
  }
}))

const dateConstants = {
  THIS_MONTH: 'thisMonth',
  THIS_QUARTER: 'thisQuarter',
  THIS_YEAR: 'thisYear',
  PREV_MONTH: 'prevMonth',
  PREV_QUARTER: 'prevQuarter',
  PREV_YEAR: 'prevYear'
}

const dateOptions = [
  { label: 'This Month', value: dateConstants.THIS_MONTH },
  { label: 'This Quarter', value: dateConstants.THIS_QUARTER },
  { label: 'This Year', value: dateConstants.THIS_YEAR },
  { label: 'Previous Month', value: dateConstants.PREV_MONTH },
  { label: 'Previous Quarter', value: dateConstants.PREV_QUARTER },
  { label: 'Previous Year', value: dateConstants.PREV_YEAR }
]

const SalesPersonRevenueCard = ({ data }) => {
  const classes = useStyles()
  const [dateSelectedOption, setDateSelectedOption] = useState(
    dateConstants.THIS_MONTH
  )

  const chartData = useMemo(() => {
    if (data) {
      return data[dateSelectedOption]?.length
        ? data[dateSelectedOption].map(({ Total, owner }) => ({
            value: Total,
            id: `${(owner || defaultOwner).first_name} ${
              (owner || defaultOwner).last_name
            }`
          }))
        : []
    }
    return []
  }, [data, dateSelectedOption])

  return (
    <GridCardBase
      variant={2}
      title="Sales Person Revenue"
      rootClassName={classes.cardRoot}
      headerTextClasses={[classes.cardHeaderText]}
      headerComponent={
        <FormControlReactSelect
          value={dateSelectedOption}
          options={dateOptions}
          onChange={({ target: { value } }) => setDateSelectedOption(value)}
          marginBottom={false}
          formControlContainerClass={classes.dateSelectContainer}
        />
      }
    >
      <div className={classes.contentRoot}>
        <Grid container justifyContent="center" className={classes.chartRoot}>
          {!!chartData?.length ? (
            <AnimatedPieChart
              data={chartData}
              valueFormat={parseCurrency}
              fullHeight
            />
          ) : (
            <EmptyPlaceholder variant="small" text={'No Data'} fullHeight />
          )}
        </Grid>
      </div>
    </GridCardBase>
  )
}

export default SalesPersonRevenueCard
