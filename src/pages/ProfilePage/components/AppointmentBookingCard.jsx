import { useCallback, useEffect, useMemo, useState } from 'react'
import { makeStyles } from '@material-ui/core'

import { BlueButton } from 'components/buttons'
import CancelButton from 'components/buttons/CancelButton'
import GridCardBase from 'components/cards/GridCardBase'
import Spacing from 'components/containers/Spacing'
import { FormControlInput } from 'components/formControls'
import Icon from 'components/icons/Icon'
import iconNames, { iconTypes } from 'constants/iconNames'
import { getIconClassName } from 'utils/iconUtils'
import { requiredField, validUrl } from 'constants/validationMessages'
import { isValidUrl, hasHTTPSOrHTTP } from 'utils/urlUtils'
import { Text } from 'components/typography'
import classNames from 'classnames'

const useStyles = makeStyles(({ palette, type, typography, colors }) => ({
  cardRoot: {
    display: 'flex',
    flexDirection: 'column',
    boxShadow: palette[type].pages.dashboard.card.boxShadow
  },
  cardContentRoot: {
    flexGrow: 1
  },
  footerRoot: {
    paddingRight: 25,
    gridColumnGap: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'absolute',
    top: 0,
    left: '60%',
    background: palette[type].secondary,
    width: '40%',
    paddingTop: 10,
    paddingBottom: 6
  },
  tooltipBodyRoot: {
    '& p': {
      color: '#fff'
    }
  },
  tooltipHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'right',
    gap: 8
  },
  headerText: {
    ...typography.dashboardTitle[type],
    whiteSpace: 'nowrap'
  },
  emptyLink: {
    color: colors.error
  }
}))

const AppointmentBookingCard = ({
  user,
  onUpdateUser,
  isFaded,
  isEnableEdit
}) => {
  const [isEdit, setEdit] = useState(false)
  const [values, setValues] = useState({})
  const [error, setError] = useState()
  const classes = useStyles()

  useEffect(() => {
    if (isEnableEdit) {
      setEdit(true)
    }
  }, [isEnableEdit])

  useEffect(() => {
    setValues({ appointmentLink: user?.appointmentLink || '' })
  }, [user?.appointmentLink])

  const setUrlValue = useCallback(value => {
    setValues({ appointmentLink: value })
    if (!value) {
      setError(requiredField)
    } else if (!isValidUrl(value)) {
      setError(validUrl)
    } else setError()
  }, [])

  const handleChange = useCallback(
    ({ target: { value } }) => {
      setUrlValue(value)
    },
    [setUrlValue]
  )

  const handleBlur = useCallback(
    ({ target: { value } }) => {
      if (value.trim().length !== 0 && !hasHTTPSOrHTTP(value)) {
        value = 'https://' + value
      }
      setUrlValue(value)
    },
    [setUrlValue]
  )

  const handleCancel = () => {
    setEdit(false)
    setError()
    setValues({ appointmentLink: user?.appointmentLink || '' })
  }

  const handleSubmit = () => {
    onUpdateUser({
      ...values
    })
    setEdit(false)
  }

  const tooltipBodyRender = useMemo(
    () => (
      <div className={classes.tooltipBodyRoot}>
        <Text>{`1. Open Google Calendar.`}</Text>
        <Text>{`2. On your Calendar grid, click the appointment schedule.`}</Text>
        <Text>
          {`3. Next to “Open booking page,” click Share. `}
          <i className={getIconClassName(iconNames.share)} />
        </Text>
        <Text>
          {`4. Under “Link,” select "To share a link for all services on your calendar, click `}
          <b>All appointment schedules</b>
          {`."`}
        </Text>
        <Text>{`5. Copy the "Booking Page LInk" and paste it here.`}</Text>
      </div>
    ),
    [classes.tooltipBodyRoot]
  )

  return (
    <>
      <GridCardBase
        titleComponent={
          <div className={classes.tooltipHeader}>
            <Text
              rootClassName={classNames(classes.headerText, {
                [classes.emptyLink]: !user?.appointmentLink
              })}
            >{`Appointment Booking Link`}</Text>
            <Icon
              icon={getIconClassName(iconNames.info, iconTypes.solid)}
              color="blue"
              tooltip={tooltipBodyRender}
              tooltipHeader={'Google Appointment Booking'}
              tooltipMaxWidth={400}
              tooltipPlacement={'top'}
            />
          </div>
        }
        dropdown={false}
        rootClassName={classes.cardRoot}
        contentRootClassName={classes.cardContentRoot}
        removeScrollbar
        icon={!isEdit}
        isFaded={!isEdit && isFaded}
        iconButtonComponent={
          <Icon
            icon={getIconClassName(iconNames.edit3)}
            color="light"
            onClick={() => setEdit(true)}
          />
        }
      >
        <FormControlInput
          label="Link"
          name="appointmentLink"
          value={values.appointmentLink}
          error={error}
          touched
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={!isEdit}
          fullWidth
          marginBottom={false}
        />
      </GridCardBase>
      {isEdit && (
        <Spacing variant={0} paddingVert={1} rootClassName={classes.footerRoot}>
          {!isEnableEdit && <CancelButton onClick={handleCancel} />}
          <BlueButton
            onClick={handleSubmit}
            iconClassName={getIconClassName(iconNames.save)}
            disabled={!values.appointmentLink || !!error}
          >
            {'Save'}
          </BlueButton>
        </Spacing>
      )}
    </>
  )
}

export default AppointmentBookingCard
