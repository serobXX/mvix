import React, { useMemo } from 'react'
import { Grid, Typography, makeStyles } from '@material-ui/core'
import moment from 'moment'
import momentTZ from 'moment-timezone'
import classNames from 'classnames'

import { DATE_VIEW_FORMAT } from 'constants/dateTimeFormats'
import PropTypes from 'constants/propTypes'

const useStyles = makeStyles(({ type, typography }) => ({
  text: {
    ...typography.darkAccent[type]
  },
  textSmall: {
    ...typography.subtitle[type]
  },
  grey: {
    color: 'rgb(148, 148, 148)'
  },
  containerRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  textRow: {
    marginLeft: 5,
    ...typography.darkAccent[type]
  },
  reversedRow: {
    flexDirection: 'row-reverse'
  },
  fontWeightNormal: {
    fontWeight: '400 !important'
  }
}))

const DateTimeView = ({
  date,
  onlyDate = false,
  isUTC = false,
  withSeparator = false,
  fallback = 'N/A',
  textClass,
  textSmallClass,
  rootClassName,
  timeFormat = 'h:mmA',
  inverseDisplay = false,
  printAsUTC = false,
  direction = 'column',
  reversedRow,
  timeFontWeight = 'bold'
}) => {
  const classes = useStyles()
  const { formattedDate, formattedTime } = useMemo(() => {
    const res = {
      formattedDate: null,
      formattedTime: null
    }
    if (date) {
      let dateTime = moment(date)
      if (isUTC) {
        dateTime = moment.utc(date).local()
      }
      if (printAsUTC) {
        dateTime = moment.utc(date)
      }

      res.formattedDate = dateTime.format(DATE_VIEW_FORMAT)
      res.formattedTime = dateTime.format(timeFormat)
    }
    return res
  }, [date, isUTC, printAsUTC, timeFormat])

  if (!date) {
    return (
      <Grid>
        <Typography
          className={classNames(classes.text, classes.grey, {
            [classes.textRow]: direction === 'row'
          })}
        >
          {fallback}
        </Typography>
      </Grid>
    )
  }

  const tz = momentTZ.tz(printAsUTC ? 'UTC' : momentTZ.tz.guess()).zoneAbbr()

  return (
    <Grid
      component="span"
      className={classNames(rootClassName, {
        [classes.containerRow]: direction === 'row',
        [classes.reversedRow]: reversedRow
      })}
    >
      <Typography
        component="span"
        className={classNames(
          classes.text,
          {
            [classes.textRow]: direction === 'row',
            [classes.fontWeightNormal]:
              inverseDisplay && !onlyDate && timeFontWeight === 'normal'
          },
          textClass
        )}
      >
        {inverseDisplay && !onlyDate ? formattedTime + ' ' + tz : formattedDate}
      </Typography>
      {withSeparator && (
        <Typography
          component="span"
          className={classNames(
            classes.text,
            {
              [classes.textRow]: direction === 'row',
              [classes.fontWeightNormal]:
                (inverseDisplay && !onlyDate && timeFontWeight === 'normal') ||
                (!inverseDisplay && timeFontWeight === 'normal')
            },
            textClass
          )}
        >
          |
        </Typography>
      )}
      <Typography
        component="span"
        className={classNames(
          classes.text,
          classes.textSmall,
          {
            [classes.textRow]: direction === 'row',
            [classes.fontWeightNormal]:
              !inverseDisplay && timeFontWeight === 'normal'
          },
          textSmallClass
        )}
      >
        {!onlyDate &&
          (inverseDisplay ? formattedDate : formattedTime + ' ' + tz)}
      </Typography>
    </Grid>
  )
}

DateTimeView.propTypes = {
  direction: PropTypes.oneOf(['row', 'column'])
}

export { DateTimeView }

const DateTimeViewColumn = ({ value, data, getValue }) => {
  return <DateTimeView date={value || getValue(data)} />
}

export default DateTimeViewColumn
