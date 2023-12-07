import React, { useCallback, useMemo, useState } from 'react'
import { Avatar } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import classNames from 'classnames'
import moment from 'moment'
import Tooltip from 'components/Tooltip'
import PropTypes from 'constants/propTypes'
import { _get } from 'utils/lodash'
import JdenticonIcon from 'components/icons/JdenticonIcon'
import { themeTypes } from 'constants/ui'

const useStyles = makeStyles(({ type, colors }) => ({
  root: {
    position: 'relative',
    display: 'inline-block'
  },
  status: {
    '&:hover': {
      cursor: 'pointer'
    },

    '&::after': {
      content: "''",
      display: 'block',
      position: 'absolute',
      top: '5px',
      right: '-2px',
      width: 12,
      height: 12,
      border: '2px solid #fff',
      borderRadius: '100%',
      zIndex: 3
    }
  },
  userOffline: {
    '&::after': {
      backgroundColor: 'gray'
    }
  },
  userOnline: {
    '&::after': {
      backgroundColor: '#3cd480'
    }
  },
  loginWithinWeek: {
    '&::after': {
      backgroundColor: '#D35E37'
    }
  },

  typedAvatar: {
    width: 52,
    height: 52,
    border: '5px solid',
    borderColor: props => props.roleColor
  },
  smallTypedAvatar: {
    width: 42,
    height: 42
  },

  avatar: {
    width: 57,
    height: 57
  },
  smallAvatar: {
    width: 47,
    height: 47
  },
  clientAdmin: {
    borderColor: '#ff7b25'
  },
  superAdmin: {
    borderColor: '#3983ff'
  },
  isChange: {
    cursor: 'pointer'
  },
  isDisabled: {
    cursor: 'not-allowed'
  },
  avatarColoredCircle: {
    position: 'absolute',
    borderRadius: '100%',

    '&:hover': {
      cursor: 'pointer'
    }
  },
  avatarRole: {
    margin: 5,
    width: 42,
    height: 42
  },
  smallAvatarRole: {
    width: 32,
    height: 32
  },
  hoverAnimation: {
    position: 'absolute',
    borderRadius: '100%',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    boxSizing: 'content-box',
    border: `4px dashed transparent`,
    boxShadow: `3px 3px ${type === themeTypes.light ? '#000' : '#fff'}`,
    transition: 'opacity 0.2s, transform 0.2s',
    top: '-3px',
    left: '-3px',
    padding: 8,
    zIndex: 10,
    opacity: 0,
    transform: 'rotate(-90deg)'
  },
  hoverAnimationRoot: {
    width: 51,
    height: 51
  },
  hoverAnimationAvatar: {
    margin: 2
  },
  centerIconRoot: {
    background: colors.highlight,
    border: 'none',
    display: 'grid',
    placeItems: 'center',
    borderRadius: 50
  },
  centerIcon: {
    fontSize: 21,
    color: '#fff'
  }
}))

const onlineStatuses = {
  online: 'online',
  offline: 'offline',
  weeklyOnline: 'weeklyOnline'
}

const UserPic = props => {
  const {
    lastLogin,
    role,
    userName = '',
    imgSrc,
    isChange,
    isDisabled,
    noStatus = false,
    roleDisplayName,
    onClick = () => ({}),
    avatarClassName,
    small = false,
    isPrintDouble = false,
    hoverAnimation = false,
    showJdenticonIcon = false,
    jdenticonIconSize,
    customIcon
  } = props

  const classes = useStyles(props)

  const [error, setError] = useState(false)

  const onlineStatus = useMemo(() => {
    if (!lastLogin || noStatus) {
      return onlineStatuses.offline
    }

    const currentDate = moment()
    const lastLoginDate = moment(lastLogin)

    if (currentDate.diff(lastLoginDate, 'days') <= 7) {
      return currentDate.diff(lastLoginDate, 'hours') <= 24
        ? onlineStatuses.online
        : onlineStatuses.weeklyOnline
    } else {
      return onlineStatuses.offline
    }
  }, [lastLogin, noStatus])

  const statusText = useMemo(() => {
    switch (onlineStatus) {
      case onlineStatuses.offline:
        return 'Offline'
      case onlineStatuses.online:
        return 'Online'
      case onlineStatuses.weeklyOnline:
        return 'Login within week'
      default:
        return 'Offline'
    }
  }, [onlineStatus])

  const handleClick = useCallback(() => {
    !isDisabled && onClick()
  }, [onClick, isDisabled])

  const avatarChildren = useMemo(() => {
    if (typeof userName !== 'string') {
      return userName?.props?.firstName[0]?.toUpperCase()
    }

    const nameSplit = userName.split(' ')
    return isPrintDouble
      ? `${_get(nameSplit, '0.0', '').toUpperCase()} ${_get(
          nameSplit,
          '1.0',
          ''
        ).toUpperCase()}`
      : userName[0]?.toUpperCase()
  }, [userName, isPrintDouble])

  return (
    <div
      onClick={handleClick}
      className={classNames(classes.root, {
        [classes.isChange]: isChange,
        [classes.isDisabled]: isDisabled,
        [classes.hoverAnimationRoot]: hoverAnimation
      })}
    >
      {!noStatus && (
        <Tooltip arrow title={statusText} placement="top">
          <div
            className={classNames({
              [classes.status]: !noStatus,
              [classes.userOffline]: onlineStatus === onlineStatuses.offline,
              [classes.userOnline]: onlineStatus === onlineStatuses.online,
              [classes.loginWithinWeek]:
                onlineStatus === onlineStatuses.weeklyOnline
            })}
          />
        </Tooltip>
      )}
      {role && (
        <Tooltip arrow title={roleDisplayName} placement="top">
          <div
            className={classNames(classes.avatarColoredCircle, {
              [classes.typedAvatar]: role,
              [classes.smallTypedAvatar]: small
            })}
          />
        </Tooltip>
      )}
      <div
        className={classNames(classes.hoverAnimation, 'profile-card-animation')}
      />
      {showJdenticonIcon ? (
        <JdenticonIcon
          value={userName}
          size={
            jdenticonIconSize ||
            (role ? (small ? '32px' : '57px') : small ? '47px' : '42px')
          }
          isRounded
        />
      ) : customIcon ? (
        <div
          className={classNames(classes.centerIconRoot, {
            [classes.avatar]: !role,
            [classes.avatarRole]: role,
            [classes.smallAvatarRole]: small && role,
            [classes.smallAvatar]: small && !role
          })}
        >
          <i className={classNames(customIcon, classes.centerIcon)} />
        </div>
      ) : (
        <Avatar
          alt={typeof userName === 'string' ? userName : 'Profile image'}
          src={imgSrc?.includes('user1.png') || error ? null : imgSrc}
          onError={() => setError(true)}
          children={avatarChildren}
          className={classNames(avatarClassName, {
            [classes.avatar]: !role,
            [classes.avatarRole]: role,
            [classes.smallAvatarRole]: small && role,
            [classes.smallAvatar]: small && !role,
            [classes.hoverAnimationAvatar]: hoverAnimation
          })}
        />
      )}
    </div>
  )
}

UserPic.propTypes = {
  status: PropTypes.string,
  roleColor: PropTypes.string,
  onClick: PropTypes.func,
  isChange: PropTypes.bool
}

export default UserPic
