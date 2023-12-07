import ContentLoader from 'react-content-loader'
import { withTheme } from '@material-ui/core'

const HeaderAccountNavigationLoader = ({ theme }) => (
  <ContentLoader
    style={{
      width: 145,
      height: 60
    }}
    foregroundColor={theme.palette[theme.type].loader.background}
    backgroundColor={theme.palette[theme.type].loader.foreground}
  >
    <rect x="10" y="15" rx="50%" ry="50%" width="30" height="30" />
    <rect x="57" y="15" rx="50%" ry="50%" width="30" height="30" />
    <rect x="97" y="15" rx="50%" ry="50%" width="30" height="30" />
  </ContentLoader>
)

export default withTheme(HeaderAccountNavigationLoader)
