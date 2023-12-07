import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import { ResponsivePie } from '@nivo/pie'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(() => ({
  root: ({ fullHeight }) => ({
    height: '100%',
    minHeight: fullHeight ? 'auto' : 250,
    width: '100%'
  })
}))

const TICK_INTERVAL = 16

const AnimatedPieChart = ({
  data,
  startAngle = 0,
  endAngle = 360,
  animationDuration = 1000,
  fit = false,
  fullHeight = false,
  ...props
}) => {
  const classes = useStyles({ fullHeight })
  const [localAngle, setLocalAngle] = useState(startAngle)
  const timeoutId = useRef(null)

  const angleIncerment = useMemo(
    () =>
      (endAngle - startAngle) / Math.ceil(animationDuration / TICK_INTERVAL),
    [animationDuration, startAngle, endAngle]
  )

  const animationTick = useCallback(
    localAngle => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current)
        timeoutId.current = null
      }
      const newAngle = localAngle + angleIncerment

      if (newAngle >= endAngle) {
        setLocalAngle(endAngle)
      } else {
        setLocalAngle(newAngle)
        timeoutId.current = setTimeout(animationTick, TICK_INTERVAL, newAngle)
      }
    },
    [angleIncerment, endAngle]
  )

  useEffect(() => {
    setLocalAngle(startAngle)
    animationTick(startAngle)
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current)
      }
    }
    //eslint-disable-next-line
  }, [data, startAngle, endAngle, animationDuration])

  return (
    <div className={classes.root}>
      <ResponsivePie
        data={data}
        startAngle={startAngle}
        endAngle={localAngle}
        fit={fit}
        enableArcLinkLabels={false}
        enableArcLabels={false}
        innerRadius={0.5}
        cornerRadius={3}
        padAngle={1}
        {...props}
      />
    </div>
  )
}

export default AnimatedPieChart
