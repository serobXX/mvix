import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { withStyles, Grid } from '@material-ui/core'
import classNames from 'classnames'

import Drawer from 'components/Header/Drawer'
import Navigation from '../Navigation'
import AccountInfo from '../Account/AccountInfo'
import {
  HeaderAccountInfoLoader,
  HeaderNavigationLoader,
  HeaderLogoLoader,
  HeaderAccountNavigationLoader
} from 'components/loaders'
//import Profile from '../Pages/Profile'
import { SCREEN_MAX_WIDTH, themeTypes, zIndexes } from 'constants/ui'
import { routes } from 'constants/routes'

import MvixLogoLight from '/src/assets/images/MvixLogoLight.png'
import MvixLogoDark from '/src/assets/images/MvixLogoDark.png'
import useUser from 'hooks/useUser'
import { isUserProfileValid } from 'utils/profileUtils'
import AccountNavigation from 'components/Account/AccountNavigation'

const styles = theme => {
  const { palette, type } = theme
  return {
    root: {
      display: 'flex',
      alignItems: 'center',
      height: 80,
      borderBottomWidth: 1,
      borderBottomStyle: 'solid',
      borderBottomColor: palette[type].header.borderColor,
      boxShadow: `0 2px 4px 0 ${palette[type].header.shadow.s}, 0 1px 0 0 ${palette[type].header.shadow.f}`,
      backgroundColor: palette[type].default,
      position: 'fixed',
      zIndex: 111,
      width: '100%',
      top: 0
    },
    hovered: {
      zIndex: zIndexes.confirmation + 1
    },
    contentContainer: {
      maxWidth: SCREEN_MAX_WIDTH,
      margin: '0 auto'
    },
    leftPart: {
      padding: '.5rem 0'
    },
    logoImage: {
      width: 'auto',
      maxWidth: 104,
      height: '51px',
      marginTop: '1px'
    },
    navigationWrap: {
      display: 'flex',
      alignItems: 'stretch'
    },
    accountNavigationWrap: {
      display: 'flex',
      alignItems: 'center',
      padding: '.5rem 0'
    },
    hasTopBanner: {
      top: 35
    }
  }
}

const Header = ({ classes, theme, hasTopBanner, ...props }) => {
  const [userPic, setUserPic] = useState('')
  const [name, setName] = useState({ first: '', last: '' })
  const [setProfileSelectorIsOpen] = useState(false)
  const [hovered, setHovered] = useState(false)

  const { data, isFetching, isLoading } = useUser()

  useEffect(() => {
    if (data) {
      const { firstName, lastName, avatar } = data
      setName({ first: firstName, last: lastName })
      setUserPic(avatar)
    }
    // eslint-disable-next-line
  }, [data])

  const handleNavigationHover = useCallback(() => {
    if (!hovered) {
      setHovered(true)
    }
  }, [hovered])

  const handleNavigationLeave = useCallback(() => {
    setHovered(false)
  }, [])

  const isNavDisabled = useMemo(() => !isUserProfileValid(data), [data])

  const handleLogoClick = event => {
    if (isNavDisabled) {
      event.preventDefault()
    }
  }

  return (
    <>
      <header
        onMouseOver={handleNavigationHover}
        onMouseLeave={handleNavigationLeave}
        className={classNames(classes.root, 'top-header', {
          [classes.hovered]: hovered,
          [classes.hasTopBanner]: hasTopBanner
        })}
      >
        <Grid
          container
          justifyContent="space-between"
          direction="row"
          className={classes.contentContainer}
        >
          <Grid item className={classes.leftPart}>
            <Grid container alignItems="center" direction="row">
              {isLoading ? (
                <HeaderLogoLoader />
              ) : (
                <>
                  <Grid item>
                    <Drawer
                      color={theme.colors.highlight}
                      disabled={isNavDisabled}
                    />
                  </Grid>
                  <Grid item>
                    <RouterLink
                      to={routes.dashboard.root}
                      onClick={handleLogoClick}
                    >
                      <img
                        className={classes.logoImage}
                        src={
                          theme.type === themeTypes.light
                            ? MvixLogoLight
                            : MvixLogoDark
                        }
                        alt="Logo"
                      />
                    </RouterLink>
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>

          <Grid item className={classes.navigationWrap}>
            {isLoading ? (
              <HeaderNavigationLoader />
            ) : (
              <Navigation disabled={isNavDisabled} />
            )}
          </Grid>

          <Grid item className={classes.accountNavigationWrap}>
            {isFetching ? (
              <HeaderAccountNavigationLoader />
            ) : (
              <AccountNavigation />
            )}
            {isFetching ? (
              <HeaderAccountInfoLoader />
            ) : (
              <AccountInfo
                userProfile={{
                  userName: `${name.first} ${name.last}`,
                  userPic: userPic
                }}
                dark={props.dark}
                currentTheme={props.currentTheme}
                handleThemeChange={props.handleThemeChange}
                openProfileSelector={setProfileSelectorIsOpen}
                color={theme.colors.other.color6[theme.type]}
              />
            )}
          </Grid>
        </Grid>
      </header>
      {/*{profileSelectorIsOpen && (*/}
      {/*  <Profile setProfileSelectorIsOpen={setProfileSelectorIsOpen} />*/}
      {/*)}*/}
    </>
  )
}

export default withStyles(styles, { withTheme: true })(Header)
