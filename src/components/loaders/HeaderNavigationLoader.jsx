import ContentLoader from 'react-content-loader'
import { withTheme } from '@material-ui/core'

const HeaderNavigationLoader = ({ theme }) => (
  <ContentLoader
    style={{
      width: 635,
      height: 76
    }}
    foregroundColor={theme.palette[theme.type].loader.background}
    backgroundColor={theme.palette[theme.type].loader.foreground}
  >
    <rect x="0" y="28" rx="6" ry="6" width="80" height="20" />
    <rect x="125" y="28" rx="6" ry="6" width="100" height="20" />
    <rect x="270" y="28" rx="6" ry="6" width="90" height="20" />
    <rect x="405" y="28" rx="6" ry="6" width="70" height="20" />
    <rect x="525" y="28" rx="6" ry="6" width="110" height="20" />
  </ContentLoader>
)

export default withTheme(HeaderNavigationLoader)
