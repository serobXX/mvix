import { Grid, makeStyles } from '@material-ui/core'
import classNames from 'classnames'
import iconNames, { iconTypes } from 'constants/iconNames'
import { useEffect, useState } from 'react'
import { getIconClassName } from 'utils/iconUtils'

const useStyles = makeStyles(() => ({
  root: {
    padding: '10px',
    width: '100%'
  },
  statusIcon: {
    fontSize: 50,
    color: '#646464'
  },
  successIcon: {
    color: '#0dae02'
  },
  failedIcon: {
    color: '#da0404'
  },
  processingIcon: {
    color: '#646464'
  },
  statusText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#646464'
  }
}))

const statusData = {
  success: {
    text: 'Payment Successful!',
    icon: getIconClassName(iconNames.paymentSuccess, iconTypes.solid)
  },
  failed: {
    text: 'Your payment was not successful, please try again.',
    icon: getIconClassName(iconNames.paymentFailed, iconTypes.solid)
  },
  processing: {
    text: 'Your payment is processing.',
    icon: getIconClassName(iconNames.paymentProcessing, iconTypes.solid)
  }
}

const PaymentStatus = ({ status, onRedirectBack }) => {
  const classes = useStyles()
  const [time, setTime] = useState(10)

  useEffect(() => {
    if (status) {
      const interval = setInterval(() => {
        setTime(time => {
          if (time === 0) {
            onRedirectBack()
            clearInterval(interval)
            return 0
          }
          return time - 1
        })
      }, 1000)
    }
    //eslint-disable-next-line
  }, [status])

  return (
    <div className={classes.root}>
      <Grid container direction="column" alignItems="center">
        <i
          className={classNames(statusData[status]?.icon, classes.statusIcon, {
            [classes.successIcon]: status === 'success',
            [classes.failedIcon]: status === 'failed',
            [classes.processingIcon]: status === 'processing'
          })}
        />
        <p
          className={classNames(classes.statusText, {
            [classes.successIcon]: status === 'success',
            [classes.failedIcon]: status === 'failed',
            [classes.processingIcon]: status === 'processing'
          })}
        >
          {statusData[status]?.text || 'Your payment is processing.'}
        </p>
        {status && <span>Redirecting back in {time || 0} seconds</span>}
      </Grid>
    </div>
  )
}

export default PaymentStatus
