import React from 'react'

import ContentLoader from 'react-content-loader'

import { withTheme } from '@material-ui/core'

const DashboardLoader = ({ theme }) => (
  <ContentLoader
    style={{
      width: '100%',
      height: 1200
    }}
    backgroundColor={theme.palette[theme.type].loader.background}
    foregroundColor={theme.palette[theme.type].loader.foreground}
  >
    <rect x="0" y="0" rx="6" ry="6" width="340" height="195" />
    <rect x="0" y="215" rx="6" ry="6" width="340" height="195" />
    <rect x="0" y="430" rx="6" ry="6" width="340" height="195" />
    <rect x="0" y="645" rx="6" ry="6" width="340" height="195" />
    <rect x="0" y="860" rx="6" ry="6" width="340" height="195" />

    <rect x="360" y="0" rx="6" ry="6" width="1080" height="237" />
    <rect x="360" y="257" rx="6" ry="6" width="1080" height="397" />
    <rect x="360" y="674" rx="6" ry="6" width="1080" height="390" />

    <rect x="1460" y="0" rx="6" ry="6" width="340" height="414" />
    <rect x="1460" y="434" rx="6" ry="6" width="340" height="629" />
    <rect x="1460" y="940" rx="6" ry="6" width="340" height="176" />
  </ContentLoader>
)

export default withTheme(DashboardLoader)
