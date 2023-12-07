import React, { useCallback, useMemo } from 'react'
import ContentLoader from 'react-content-loader'
import { withTheme } from '@material-ui/core'
import PropTypes from 'constants/propTypes'

const SolutionLoader = props => {
  const { rows = 10, theme } = props

  const makeRow = useCallback(y => {
    return (
      <>
        <rect x={20} y={y} rx="20" ry="20" width={45} height={45} />
        <rect x={80} y={y + 10} rx="6" ry="6" width={250} height={20} />
      </>
    )
  }, [])

  const rects = useMemo(() => {
    let result = []
    for (let i = 0; i < rows; i++) {
      result = [...result, makeRow(10 * i + 50 * i)]
    }
    return result
  }, [makeRow, rows])

  return (
    <ContentLoader
      style={{
        width: '100%',
        height: rows * 60
      }}
      backgroundColor={theme.palette[theme.type].loader.background}
      foregroundColor={theme.palette[theme.type].loader.foreground}
    >
      {rects}
    </ContentLoader>
  )
}

SolutionLoader.propTypes = {
  rows: PropTypes.number
}

export default withTheme(SolutionLoader)
