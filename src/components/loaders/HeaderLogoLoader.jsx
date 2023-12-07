import ContentLoader from 'react-content-loader'
import { withTheme } from '@material-ui/core'

const HeaderLogoLoader = ({ theme }) => (
  <ContentLoader
    style={{
      width: 185,
      height: 56
    }}
    foregroundColor={theme.palette[theme.type].loader.background}
    backgroundColor={theme.palette[theme.type].loader.foreground}
  >
    <rect x="12" y="12" rx="6" ry="6" width="32" height="32" />
    <rect x="62" y="18" rx="6" ry="6" width="100" height="20" />
  </ContentLoader>
)

export default withTheme(HeaderLogoLoader)
