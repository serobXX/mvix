import ContentLoader from 'react-content-loader'
import { withTheme } from '@material-ui/core'

const HeaderAccountInfoLoader = ({ theme }) => (
  <ContentLoader
    style={{
      width: 125,
      height: 60
    }}
    foregroundColor={theme.palette[theme.type].loader.background}
    backgroundColor={theme.palette[theme.type].loader.foreground}
  >
    <rect x="10" y="10" rx="50%" ry="50%" width="40" height="40" />
    <rect x="65" y="20" rx="6" ry="6" width="60" height="20" />
  </ContentLoader>
)

export default withTheme(HeaderAccountInfoLoader)
