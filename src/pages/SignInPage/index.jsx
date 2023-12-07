import React, { useCallback, useMemo, useState } from 'react'
import { Typography, makeStyles, useTheme, Grid } from '@material-ui/core'
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google'

import AccountModal from './AccountModal'
import defaultDarkHeaderLogo from '/src/assets/images/MvixLogoDark.png'
import defaultLightHeaderLogo from '/src/assets/images/MvixLogoLight.png'
import { themeTypes } from 'constants/ui'
import { useGetIpQuery } from 'api/ipApi'
import { googleLoginErrors } from 'constants/error'
import { config } from 'constants/app'
import useSnackbar from 'hooks/useSnackbar'
import useAuth from 'hooks/useAuth'
import { CircularLoader } from 'components/loaders'

const useStyles = makeStyles(({ palette, type }) => ({
  container: {
    width: '430px',
    padding: '0px'
  },
  logoImage: {
    width: 'auto',
    maxWidth: '104px',
    height: '52px'
  },
  ipAddress: {
    marginBottom: '10px',
    color: '#74809a'
  },
  expandedGoogleButtonWrapper: {
    cursor: 'pointer',
    width: 'fit-content',
    margin: '140px auto 150px auto',
    display: 'flex',
    justifyContent: 'center'
  },
  expandedGoogleButton: {
    pointerEvents: 'none',
    // height: '50px',
    width: '236px'

    // '& iframe': {
    //   transform: 'scale(1.4)',
    //   margin: '0px auto !important'
    // }
  }
}))

function SignInPage() {
  const classes = useStyles()
  const [isCookiesUnavailable, setCookiesUnavailable] = useState(false)
  const theme = useTheme()
  const { showSnackbar } = useSnackbar()

  const { data: { ip } = {} } = useGetIpQuery()
  const { socialLoginUser, isLoading } = useAuth()

  const handleGoogleButtonClick = useGoogleLogin({
    onSuccess: tokenResponse => {
      socialLoginUser({
        provider: 'google',
        token: tokenResponse.access_token
      })
    },
    onError: error => {
      switch (error) {
        case googleLoginErrors.POPUP_CLOSED_BY_USER:
          break
        case googleLoginErrors.IDPIFRAME_INITIALIZATION_FAILED:
          setCookiesUnavailable(true)
          break
        case googleLoginErrors.ACCESS_DENIED:
          showSnackbar(
            `Unable to login via Google. Not enough permissions.`,
            'error'
          )
          break
        default:
          showSnackbar('Unable to login via Google.', 'error')
          break
      }
    }
  })

  const handleGoogleInitializationFailure = useCallback(({ error }) => {
    if (error === googleLoginErrors.IDPIFRAME_INITIALIZATION_FAILED) {
      setCookiesUnavailable(true)
    }
  }, [])

  const renderGoogleLogin = useMemo(() => {
    if (!config.GOOGLE_CLIENT_ID) return null

    if (isCookiesUnavailable) {
      return () => {
        showSnackbar(
          `Unable to login via Google. Please check if third-party cookies are enabled in your browser.`,
          'error'
        )
      }
    }
    return (
      <div
        className={classes.expandedGoogleButtonWrapper}
        onClick={() => handleGoogleButtonClick()}
      >
        <div className={classes.expandedGoogleButton}>
          <GoogleLogin
            onScriptLoadError={handleGoogleInitializationFailure}
            theme={theme.type === themeTypes.dark ? 'filled_blue' : 'outline'}
            size="large"
          />
        </div>
      </div>
    )
  }, [
    classes.expandedGoogleButton,
    classes.expandedGoogleButtonWrapper,
    handleGoogleButtonClick,
    handleGoogleInitializationFailure,
    isCookiesUnavailable,
    showSnackbar,
    theme.type
  ])

  return (
    <AccountModal hideScrollbar={isLoading}>
      {isLoading && <CircularLoader />}
      <div className={classes.container}>
        <header>
          <img
            className={classes.logoImage}
            src={
              theme.type === themeTypes.light
                ? defaultLightHeaderLogo
                : defaultDarkHeaderLogo
            }
            alt="Logo"
          />
        </header>
        {renderGoogleLogin}
        <Grid item>
          <Typography align="center" className={classes.ipAddress}>
            {`Your IP address is being logged as ${ip || ''}`}
          </Typography>
        </Grid>
      </div>
    </AccountModal>
  )
}

export default SignInPage
