import React from 'react'

import ContentLoader from 'react-content-loader'

import { withTheme } from '@material-ui/core'

const SolutionSetItemsLoader = ({ theme }) => (
  <ContentLoader
    style={{
      width: '100%',
      height: 900
    }}
    foregroundColor={theme.palette[theme.type].loader.background}
    backgroundColor={theme.palette[theme.type].loader.foreground}
  >
    <rect x="0" y="0" rx="6" ry="6" width="380" height="60" />
    <rect x="409" y="0" rx="6" ry="6" width="380" height="60" />

    <rect x="0" y="85" rx="6" ry="6" width="380" height="60" />
    <rect x="409" y="85" rx="6" ry="6" width="380" height="60" />

    <rect x="0" y="170" rx="6" ry="6" width="380" height="60" />
    <rect x="409" y="170" rx="6" ry="6" width="380" height="60" />

    <rect x="0" y="255" rx="6" ry="6" width="380" height="60" />
    <rect x="409" y="255" rx="6" ry="6" width="380" height="60" />

    <rect x="0" y="340" rx="6" ry="6" width="380" height="60" />
    <rect x="409" y="340" rx="6" ry="6" width="380" height="60" />

    <rect x="0" y="425" rx="6" ry="6" width="380" height="60" />
    <rect x="409" y="425" rx="6" ry="6" width="380" height="60" />
  </ContentLoader>
)

export default withTheme(SolutionSetItemsLoader)
