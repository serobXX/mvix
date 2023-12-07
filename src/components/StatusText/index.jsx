import { withStyles, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import classNames from 'classnames'

const useStyles = makeStyles({
  root: {
    fontWeight: 'bold',
    color: ({ color }) => (color ? color : '#619bf9')
  }
})

export const StatusText = ({ color, rootClassName = '', title, ...props }) => {
  const classes = useStyles({
    color: color
  })
  return (
    <Typography className={classNames(classes.root, rootClassName)} {...props}>
      {title}
    </Typography>
  )
}

export const ActiveStatus = withStyles({
  root: {
    color: '#3cd480'
  }
})(StatusText)

export const InactiveStatus = withStyles({
  root: {
    color: '#d35e37'
  }
})(StatusText)

export const ActiveInactiveStatus = ({ isActive, title }) => {
  return isActive ? (
    <ActiveStatus title={title} />
  ) : (
    <InactiveStatus title={title} />
  )
}

export const PendingStatus = withStyles({
  root: {
    color: 'rgba(128, 128, 128, 1)'
  }
})(StatusText)

export const ExpireStatus = withStyles({
  root: {
    color: '#c03829'
  }
})(StatusText)

export const DisabledStatus = withStyles({
  root: {
    color: '#c03829'
  }
})(StatusText)
