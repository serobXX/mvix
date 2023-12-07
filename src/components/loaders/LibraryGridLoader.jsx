import React, { useCallback, useMemo } from 'react'
import ContentLoader from 'react-content-loader'
import { withTheme } from '@material-ui/core'
import PropTypes from 'constants/propTypes'

const LibraryGridLoader = props => {
  const {
    rows = 2,
    cols = 4,
    rectHeight = 514,
    rectWidth = 375,
    footerHeight = 50,
    rowSpacing = 350,
    maxWidth = 1800,
    padding = 20,
    theme
  } = props
  const spacing = (maxWidth - rectWidth * cols) / cols - 1

  const makeRow = useCallback(
    y => {
      const rowRects = []
      for (let i = 0; i < cols; i++) {
        rowRects.push(
          <rect
            key={`${i}${y}`}
            x={spacing * i + rectWidth * i}
            y={y}
            rx="6"
            ry="6"
            width={rectWidth}
            height={rectHeight}
          />
        )
      }
      return rowRects
    },
    [cols, rectHeight, rectWidth, spacing]
  )

  const rects = useMemo(() => {
    let result = []
    for (let i = 0; i < rows; i++) {
      result = [...result, ...makeRow(padding * i + rectHeight * i)]
    }
    return result
  }, [makeRow, rectHeight, rows, padding])

  return (
    <ContentLoader
      style={{
        width: '100%',
        height: rows * rowSpacing + footerHeight
      }}
      backgroundColor={theme.palette[theme.type].loader.background}
      foregroundColor={theme.palette[theme.type].loader.foreground}
    >
      {rects}
    </ContentLoader>
  )
}

LibraryGridLoader.propTypes = {
  rows: PropTypes.number,
  cols: PropTypes.number,
  rectHeight: PropTypes.number,
  rectWidth: PropTypes.number,
  footerHeight: PropTypes.number,
  rowSpacing: PropTypes.number
}

export default withTheme(LibraryGridLoader)
