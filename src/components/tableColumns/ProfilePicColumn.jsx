import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core'

import UserPic from 'components/UserPic'
import { _isFunction } from 'utils/lodash'

const useStyles = makeStyles(() => ({
  link: {
    textDecoration: 'none',
    display: 'flex'
  }
}))

const LinkWrapper = ({ to, className, children, data }) =>
  to ? (
    <Link className={className} to={_isFunction(to) ? to(data) : to}>
      {children}
    </Link>
  ) : (
    children
  )

const ProfilePicColumn = ({
  value,
  getValue,
  getTitleValue,
  data,
  to,
  hoverAnimation = true,
  showJdenticonIcon,
  customIcon
}) => {
  const classes = useStyles()
  return (
    <LinkWrapper to={to} data={data} className={classes.link}>
      <UserPic
        userName={getTitleValue && getTitleValue(data)}
        imgSrc={(getValue ? getValue(data) : value) || ''}
        noStatus
        small
        hoverAnimation={hoverAnimation}
        showJdenticonIcon={showJdenticonIcon}
        customIcon={
          typeof customIcon === 'function' ? customIcon(data) : customIcon
        }
      />
    </LinkWrapper>
  )
}

export default ProfilePicColumn
