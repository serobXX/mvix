import { useMemo } from 'react'
import { makeStyles, withTheme } from '@material-ui/core'
import { ResponsiveBar } from '@nivo/bar'

const useStyles = makeStyles(({ typography, type, fontSize }) => ({
  root: ({ fullHeight }) => ({
    height: '100%',
    minHeight: fullHeight ? 'auto' : 250,
    width: '100%'
  }),
  tooltip: {
    ...typography.lightText[type],
    fontFamily: typography.fontFamily,
    fontSize: fontSize.secondary
  }
}))

const COLORS = ['#d0021b', '#f5a623', '#7ed321', '#4a90e2', '#9013fe']

const BarChart = ({
  data,
  colors,
  theme,
  margin,
  fullHeight = false,
  ...props
}) => {
  const classes = useStyles({ fullHeight })
  const chartTheme = useMemo(
    () => ({
      fontFamily: theme.typography.fontFamily,
      fontSize: 12,
      axis: {
        ticks: {
          line: { fill: '#74809A' },
          text: { fill: '#74809A' }
        },
        legend: {
          text: { fill: '#74809A' }
        }
      },
      legends: {
        text: { fill: '#74809A' },
        title: {
          text: { fill: '#74809A' }
        }
      },
      grid: {
        line: { stroke: '#74809A', strokeDasharray: '1 5' }
      }
    }),
    [theme.typography.fontFamily]
  )

  return (
    <div className={classes.root}>
      <ResponsiveBar
        margin={{ top: 20, right: 20, bottom: 40, left: 40, ...(margin || {}) }}
        data={data}
        indexBy="name"
        colorBy="index"
        colors={colors || COLORS}
        enableLabel={false}
        borderRadius={3}
        padding={0.3}
        theme={chartTheme}
        gridYValues={3}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          legend: 'name',
          legendPosition: 'middle',
          legendOffset: 100
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickValues: 4,
          legend: 'value',
          legendPosition: 'middle',
          legendOffset: -100
        }}
        {...props}
      />
    </div>
  )
}

export default withTheme(BarChart)
