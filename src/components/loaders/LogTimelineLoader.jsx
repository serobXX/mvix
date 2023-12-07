import React from 'react'

import ContentLoader from 'react-content-loader'

import { withTheme } from '@material-ui/core'

const LogTimelineLoader = ({ theme }) => (
  <ContentLoader
    style={{
      width: '100%',
      height: 1200
    }}
    foregroundColor={theme.palette[theme.type].loader.background}
    backgroundColor={theme.palette[theme.type].loader.foreground}
  >
    <rect x="20" y="45" rx="30" ry="30" width="40" height="40" />
    <rect x="70" y="60" rx="6" ry="6" width="270" height="5" />
    <rect x="350" y="45" rx="30" ry="30" width="40" height="40" />
    <rect x="400" y="60" rx="6" ry="6" width="270" height="5" />
    <rect x="680" y="45" rx="30" ry="30" width="40" height="40" />
    <rect x="730" y="60" rx="6" ry="6" width="270" height="5" />
    <rect x="1010" y="45" rx="30" ry="30" width="40" height="40" />
  </ContentLoader>
)

export default withTheme(LogTimelineLoader)
