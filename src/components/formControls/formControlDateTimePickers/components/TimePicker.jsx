import { useCallback, useEffect, useMemo, useRef } from 'react'
import moment from 'moment'
import classNames from 'classnames'
import { makeStyles } from '@material-ui/core'

import PropTypes from 'constants/propTypes'
import Scrollbars from 'components/Scrollbars'

const useStyles = makeStyles(({ typography, type }) => ({
  root: {
    display: 'flex',
    height: '100%',
    borderRight: 'none'
  },
  listRoot: {
    width: 56,
    height: '100%'
  },
  listTitle: {
    color: '#849095',
    fontWeight: 600,
    padding: '0.833em',
    fontSize: 12
  },
  listBox: {
    cursor: 'pointer',
    padding: 8,
    margin: '2px 4px',
    width: 48,
    height: 40,
    display: 'grid',
    placeItems: 'center',
    ...typography.darkText[type],
    borderRadius: 4,

    '&:hover': {
      background: '#3d91ff',
      color: '#fff'
    }
  },
  selected: {
    background: '#3d91ff',
    color: '#fff'
  },
  listScrollbar: {
    height: 'calc(100% - 38px) !important'
  }
}))

const TimeList = ({
  classes,
  value,
  start = 0,
  end = 59,
  gap = 1,
  label,
  onChange
}) => {
  const scrollbarRef = useRef()

  useEffect(() => {
    if (value || value === 0) {
      scrollbarRef.current?.scrollToTop &&
        scrollbarRef.current.scrollToTop(Math.floor(value / gap) * 42)
    }
    // eslint-disable-next-line
  }, [value])

  const renderList = useMemo(() => {
    const list = []
    for (let i = start; i <= end; i = i + gap) {
      list.push(
        <div
          className={classNames(classes.listBox, {
            [classes.selected]: i === value
          })}
          onClick={() => onChange(i)}
          key={`time-${label}-${i}`}
        >
          {i}
        </div>
      )
    }
    return list
  }, [start, end, gap, classes, value, onChange, label])

  return (
    <div className={classes.listRoot}>
      <div className={classes.listTitle}>{label}</div>
      <Scrollbars ref={scrollbarRef} className={classes.listScrollbar}>
        {renderList}
      </Scrollbars>
    </div>
  )
}

const TimePicker = ({
  value,
  maskValue,
  showSeconds,
  onChange,
  rootClassName
}) => {
  const classes = useStyles()
  const { hours, minutes, seconds } = useMemo(() => {
    if (!value) return {}
    const time = moment(value, maskValue)
    return {
      hours: time.get('hour'),
      minutes: time.get('minute'),
      seconds: time.get('second')
    }
  }, [value, maskValue])

  const handleChange = useCallback(
    (h = hours, m = minutes, s = seconds) => {
      onChange(
        moment()
          .set({
            hour: h || 0,
            minute: m || 0,
            second: s || 0
          })
          .format(maskValue)
      )
    },
    [onChange, hours, minutes, seconds, maskValue]
  )

  return (
    <div className={classNames(classes.root, rootClassName)}>
      <TimeList
        classes={classes}
        label="Hours"
        value={hours}
        end={23}
        onChange={v => handleChange(v)}
      />
      <TimeList
        classes={classes}
        label="Minutes"
        value={minutes}
        onChange={v => handleChange(undefined, v)}
      />
      {showSeconds && (
        <TimeList
          classes={classes}
          label="Seconds"
          value={seconds}
          onChange={v => handleChange(undefined, undefined, v)}
        />
      )}
    </div>
  )
}

TimePicker.propTypes = {
  value: PropTypes.string,
  maskValue: PropTypes.string
}

TimePicker.defaultProps = {
  onChange: f => f,
  showSeconds: false
}

export default TimePicker
