import { useEffect } from 'react'
import { makeStyles } from '@material-ui/core'
import { useGoogleLogin } from '@react-oauth/google'

import GridCardBase from 'components/cards/GridCardBase'
import { googleLoginErrors } from 'constants/error'
import useSnackbar from 'hooks/useSnackbar'
import GmailLogo from '/src/assets/icons/gmail-logo.svg'
import { useOauthGmailMutation } from 'api/configApi'

const useStyles = makeStyles(({ palette, type, typography, colors }) => ({
  cardRoot: {
    display: 'flex',
    flexDirection: 'column',
    boxShadow: palette[type].pages.dashboard.card.boxShadow
  },
  cardContentRoot: {
    flexGrow: 1
  },
  cardContentWrap: {
    height: '100%',
    padding: 0,
    flexWrap: 'nowrap',
    alignItems: 'center',
    justifyContent: 'center'
  },
  gmailBtn: {
    outline: 'none',
    background: colors.highlight,
    borderRadius: 4,
    border: `1px solid ${colors.highlight}`,
    ...typography.darkText[type],
    color: '#fff',
    width: 'fit-content',
    padding: 0,
    alignItems: 'center',
    display: 'flex',
    paddingRight: 10,
    cursor: 'pointer',
    overflow: 'hidden',
    gap: 10,

    '& img': {
      height: 35,
      width: 35,
      padding: 7,
      background: '#fff'
    }
  }
}))

const EmailIntegration = ({ isFaded }) => {
  const classes = useStyles()
  const { showSnackbar } = useSnackbar()
  const [connectGmail, gmailReducer] = useOauthGmailMutation()

  useEffect(() => {
    if (gmailReducer?.isSuccess) {
      showSnackbar('Gmail has been connected', 'success')
      gmailReducer.reset()
    } else if (gmailReducer?.isError) {
      showSnackbar('Unable to connect gmail', 'error')
      gmailReducer.reset()
    }
    //eslint-disable-next-line
  }, [gmailReducer])

  const handleGoogleFailure = ({ error }) => {
    switch (error) {
      case googleLoginErrors.POPUP_CLOSED_BY_USER:
        break
      case googleLoginErrors.ACCESS_DENIED:
        showSnackbar(
          `Unable to login via Google.Not enough permissions.`,
          'error'
        )
        break
      default:
        showSnackbar('Unable to login via Google.', 'error')
        break
    }
  }

  const handleGoogleResponse = (response = {}) => {
    if (response?.code) {
      connectGmail(response?.code)
    } else {
      showSnackbar('Unable to login via Google.', 'error')
    }
  }

  const handleGoogleButtonClick = useGoogleLogin({
    onSuccess: handleGoogleResponse,
    onError: handleGoogleFailure,
    prompt: 'select_account',
    flow: 'auth-code',
    scope: [
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.modify'
    ].join(' '),
    redirect_uri: `${window.location.origin}/oauth/google`
  })

  return (
    <GridCardBase
      title={'Email Integration'}
      dropdown={false}
      rootClassName={classes.cardRoot}
      contentRootClassName={classes.cardContentRoot}
      contentWrapClassName={classes.cardContentWrap}
      removeScrollbar
      isFaded={isFaded}
    >
      <button className={classes.gmailBtn} onClick={handleGoogleButtonClick}>
        <img src={GmailLogo} alt={'gmail_logo'} />
        Connect to Gmail
      </button>
    </GridCardBase>
  )
}

export default EmailIntegration
