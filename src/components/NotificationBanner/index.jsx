import { makeStyles } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import classNames from 'classnames'

import { Text } from 'components/typography'

const useStyles = makeStyles(({ palette, type, typography }) => ({
  notificationBannerRoot: {
    color: 'white',
    fontsize: '13px',
    lineheight: '18px',
    transition: ' max-height .4s linear',
    overflow: 'hidden',
    background: '#1565C0',
    maxHeight: '500px'
  },
  messageRoot: {
    padding: '3px 10px',
    margin: '0 10px',
    ...typography.lightText[type],
    color: '#fff'
  },
  notificationCloseIcon: {
    position: 'absolute',
    top: '50%',
    right: '22px',
    transform: 'translate(0, -50%)',
    lineHeight: '0',
    cursor: 'pointer',
    opacity: '.4',
    display: 'block',
    '&:hover': {
      opacity: '1'
    }
  }
}))

const NotificationBanner = ({
  text,
  textClassName,
  contentComponent,
  rootClassName,
  isCloseDisplay,
  onClose
}) => {
  const classes = useStyles()
  return (
    <div className={classNames(classes.notificationBannerRoot, rootClassName)}>
      {contentComponent || (
        <Text rootClassName={classNames(classes.messageRoot, textClassName)}>
          {text}
        </Text>
      )}
      {isCloseDisplay && (
        <div className={classes.notificationCloseIcon}>
          <CloseIcon onClick={onClose}></CloseIcon>
        </div>
      )}
    </div>
  )
}

export default NotificationBanner
