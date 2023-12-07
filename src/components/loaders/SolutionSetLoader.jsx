import React from 'react'

import ContentLoader from 'react-content-loader'

import { withTheme } from '@material-ui/core'

const SolutionSetLoader = ({ theme }) => (
  <ContentLoader
    style={{
      width: '100%',
      height: 1200
    }}
    foregroundColor={theme.palette[theme.type].loader.background}
    backgroundColor={theme.palette[theme.type].loader.foreground}
  >
    <rect x="0" y="0" rx="6" ry="6" width="375" height="108" />
    <rect x="0" y="123" rx="6" ry="6" width="375" height="108" />
    <rect x="0" y="246" rx="6" ry="6" width="375" height="108" />
    <rect x="0" y="369" rx="6" ry="6" width="375" height="108" />
    <rect x="0" y="492" rx="6" ry="6" width="375" height="108" />
    <rect x="0" y="615" rx="6" ry="6" width="375" height="108" />
    <rect x="0" y="738" rx="6" ry="6" width="375" height="108" />
  </ContentLoader>
)

export default withTheme(SolutionSetLoader)
