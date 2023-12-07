import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core'

import GridLayout from 'components/GridLayout'
import { cardNames } from './config'
import EmailIntegration from './components/EmailIntegration'
import DashboardSection from './components/DashboardSection'
import useUser from 'hooks/useUser'
import AppointmentBookingCard from './components/AppointmentBookingCard'
import EmailSignatureCard from './components/EmailSignatureCard'
import { isUserProfileValid } from 'utils/profileUtils'
import { SideModal } from 'components/modals'
import NotificationBanner from 'components/NotificationBanner'
import { setProfileOpened } from 'slices/appSlice'
import { _compact } from 'utils/lodash'

const useStyles = makeStyles(({ palette, type }) => ({
  sideModalHeader: {
    padding: '17px 24px'
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    background: palette[type].body.background,
    padding: 20,
    paddingRight: 6,
    minHeight: 'calc(100% - 60px)',
    paddingTop: '40px'
  },
  sideModalContent: {
    padding: '0px 5px'
  },
  notificationRoot: {
    position: 'sticky',
    top: 0,
    zIndex: 1,
    marginLeft: '-5px',
    width: 'calc(100% + 10px)'
  }
}))

const ProfilePage = () => {
  const [isUserUpdated, setUserUpdated] = useState(false)
  const [isProfileValid, setProfileValid] = useState(false)
  const { data, updateUserDetails } = useUser(false, () => setUserUpdated(true))
  const classes = useStyles()
  const dispatch = useDispatch()

  useEffect(() => {
    if (data && isUserUpdated && isUserProfileValid(data)) {
      dispatch(setProfileOpened(false))
    } else {
      setProfileValid(isUserProfileValid(data))
    }
    //eslint-disable-next-line
  }, [data])

  const cards = useMemo(
    () => ({
      [cardNames.EMAIL_INTEGRATION]: (
        <EmailIntegration isFaded={!isProfileValid} />
      ),
      [cardNames.DASHBOARD_SECTION]: (
        <DashboardSection
          user={data}
          onUpdateUser={updateUserDetails}
          isFaded={!isProfileValid}
        />
      ),
      [cardNames.APPOINTMENT_BOOKING]: (
        <AppointmentBookingCard
          user={data}
          onUpdateUser={updateUserDetails}
          isFaded={!isProfileValid && !!data?.appointmentLink}
          isEnableEdit={!data?.appointmentLink}
        />
      ),
      [cardNames.EMAIL_SIGNATURE]: (
        <EmailSignatureCard
          user={data}
          onUpdateUser={updateUserDetails}
          isFaded={!isProfileValid && !!data?.userSignature}
          isEnableEdit={!data?.userSignature}
        />
      )
    }),
    [data, updateUserDetails, isProfileValid]
  )

  const positions = useMemo(
    () => [
      {
        x: 0,
        y: 0,
        w: 1,
        h: 7,
        i: cardNames.EMAIL_INTEGRATION
      },
      {
        x: 1,
        y: 0,
        w: 1,
        h: 15,
        i: cardNames.DASHBOARD_SECTION
      },
      {
        x: 0,
        y: 7,
        w: 1,
        h: 6,
        i: cardNames.APPOINTMENT_BOOKING
      },
      {
        x: 0,
        y: 15,
        w: 2,
        h: 15,
        i: cardNames.EMAIL_SIGNATURE
      }
    ],
    []
  )

  const handleClose = useCallback(() => {
    dispatch(setProfileOpened(false))
  }, [dispatch])

  return (
    <SideModal
      width={'50%'}
      title={'Profile'}
      headerClassName={classes.sideModalHeader}
      childrenWrapperClass={classes.sideModalContent}
      handleClose={isProfileValid && handleClose}
    >
      {!isProfileValid && (
        <NotificationBanner
          text={
            'Update your Profile before using this CRM. The following fields when populated with your information will help provide our clients with a better experience.' +
            ` (Missing fields: ${_compact([
              !!data?.appointmentLink ? '' : 'Appointment Booking Link',
              !!data?.userSignature ? '' : 'Your Email Signature'
            ]).join(', ')})`
          }
          rootClassName={classes.notificationRoot}
        />
      )}
      <div className={classes.container}>
        <GridLayout
          cards={cards}
          positions={positions}
          disableDragging
          cols={2}
          gridWidth={890}
        />
      </div>
    </SideModal>
  )
}

export default ProfilePage
