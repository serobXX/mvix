import { makeStyles } from '@material-ui/core'
import { ResponsiveFunnel } from '@nivo/funnel'
import { useCallback, useMemo } from 'react'

const useStyles = makeStyles(() => ({
  root: ({ fullHeight }) => ({
    height: '100%',
    minHeight: fullHeight ? 'auto' : 250,
    width: '100%'
  })
}))

const FunnelChart = ({
  data,
  margin,
  isCustomFunnel,
  valueFormat,
  fullHeight = false,
  ...props
}) => {
  const classes = useStyles({ fullHeight })

  const chartData = useMemo(() => {
    if (!isCustomFunnel) return data

    return data.map(({ value, ...rest }, index) => ({
      ...rest,
      value: data.length - index,
      valuePrint: value
    }))
  }, [data, isCustomFunnel])

  const handleValueFormatter = useCallback(
    value => {
      let formattedValue = chartData.find(
        ({ value: _value }) => _value === value
      )?.valuePrint
      formattedValue = formattedValue || (formattedValue === 0 ? 0 : value)
      return valueFormat ? valueFormat(formattedValue) : formattedValue
    },
    [chartData, valueFormat]
  )

  return (
    <div className={classes.root}>
      <ResponsiveFunnel
        data={chartData}
        colors={{ scheme: 'spectral' }}
        margin={{ top: 20, right: 40, bottom: 20, left: 40, ...(margin || {}) }}
        labelColor={{
          from: 'color',
          modifiers: [['darker', 3]]
        }}
        enableBeforeSeparators={false}
        enableAfterSeparators={false}
        currentPartSizeExtension={10}
        motionConfig="wobbly"
        valueFormat={isCustomFunnel ? handleValueFormatter : valueFormat}
        {...props}
      />
    </div>
  )
}

export default FunnelChart
