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
    <rect x="0" y="0" rx="6" ry="6" width="405" height="90" />
    <rect x="0" y="105" rx="6" ry="6" width="405" height="90" />
    <rect x="0" y="210" rx="6" ry="6" width="405" height="90" />
    <rect x="0" y="315" rx="6" ry="6" width="405" height="90" />
    <rect x="0" y="420" rx="6" ry="6" width="405" height="90" />
    <rect x="0" y="525" rx="6" ry="6" width="405" height="90" />
    <rect x="0" y="630" rx="6" ry="6" width="405" height="90" />
    <rect x="0" y="735" rx="6" ry="6" width="405" height="90" />
    <rect x="0" y="840" rx="6" ry="6" width="405" height="90" />
    <rect x="0" y="945" rx="6" ry="6" width="405" height="90" />
  </ContentLoader>
)

export default withTheme(SolutionSetLoader)
