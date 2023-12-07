import React, { memo } from 'react'
import ContentLoader from 'react-content-loader'
import { withTheme } from '@material-ui/core'

import PropTypes from 'constants/propTypes'

const PlaceholderRow = memo(
  ({ leftColY, rowY, dividerY, lineHeight, hideProfile = false }) => (
    <>
      <rect x="10" y={leftColY} rx="5" ry="5" width="24" height={lineHeight} />
      {!hideProfile && (
        <rect x="60" y={rowY - 10} rx="50" ry="50" width="45" height={45} />
      )}
      <rect x="120" y={rowY} rx="5" ry="5" width="200" height={lineHeight} />
      <rect x="380" y={rowY} rx="5" ry="5" width="135" height={lineHeight} />
      <rect x="545" y={rowY} rx="5" ry="5" width="135" height={lineHeight} />
      <rect x="710" y={rowY} rx="5" ry="5" width="135" height={lineHeight} />
      <rect x="875" y={rowY} rx="5" ry="5" width="135" height={lineHeight} />
      <rect x="1040" y={rowY} rx="5" ry="5" width="135" height={lineHeight} />
      <rect x="1205" y={rowY} rx="5" ry="5" width="135" height={lineHeight} />
      <rect x="1370" y={rowY} rx="5" ry="5" width="135" height={lineHeight} />
      <rect x="1535" y={rowY} rx="5" ry="5" width="135" height={lineHeight} />
      <rect x="1730" y={rowY} rx="5" ry="5" width="20" height={20} />

      <rect x="20" y={dividerY} rx="5" ry="5" width="1750" height="5" />
    </>
  )
)

const PlaceholderHeader = memo(({ dividerY, lineHeight }) => (
  <PlaceholderRow
    leftColY={20}
    rowY={20}
    dividerY={dividerY}
    lineHeight={lineHeight}
    hideProfile
  />
))

const LibraryLoader = ({
  theme,
  rowCount,
  rowSpacing,
  lineHeight,
  headerHeight,
  headerLineHeight,
  footerHeight,
  hideHeader
}) => {
  const _headerHeight = hideHeader ? 0 : headerHeight
  return (
    <ContentLoader
      style={{
        width: '100%',
        height: rowCount * rowSpacing + _headerHeight + footerHeight
      }}
      backgroundColor={theme.palette[theme.type].loader.background}
      foregroundColor={theme.palette[theme.type].loader.foreground}
    >
      {!hideHeader && (
        <PlaceholderHeader
          dividerY={headerHeight}
          lineHeight={headerLineHeight}
        />
      )}

      {new Array(rowCount).fill(0).map((a, i) => (
        <PlaceholderRow
          key={i}
          leftColY={
            i * rowSpacing + _headerHeight + (rowSpacing - lineHeight) / 2
          }
          rowY={i * rowSpacing + _headerHeight + (rowSpacing - lineHeight) / 2}
          dividerY={(i + 1) * rowSpacing + _headerHeight}
          lineHeight={lineHeight}
        />
      ))}
    </ContentLoader>
  )
}

LibraryLoader.defaultProps = {
  rowCount: 15,
  rowSpacing: 60,
  lineHeight: 24,
  headerHeight: 46,
  footerHeight: 50,
  headerLineHeight: 12,
  hideHeader: false
}
LibraryLoader.propTypes = {
  rowCount: PropTypes.number,
  rowSpacing: PropTypes.number,
  lineHeight: PropTypes.number,
  headerHeight: PropTypes.number,
  footerHeight: PropTypes.number,
  headerLineHeight: PropTypes.number,
  hideHeader: PropTypes.bool
}

export default withTheme(LibraryLoader)
