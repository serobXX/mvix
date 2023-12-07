import { makeStyles } from '@material-ui/core'
import ReactJdenticon from 'react-jdenticon'

import PropTypes from 'constants/propTypes'

const useStyles = makeStyles(() => ({
  root: ({ isRounded }) => ({
    borderRadius: isRounded ? '50%' : 0,
    overflow: 'hidden'
  })
}))

const JdenticonIcon = ({ value, size = '100%', isRounded = false }) => {
  const classes = useStyles({ isRounded })
  return (
    <div className={classes.root}>
      <ReactJdenticon value={value} size={size} />
    </div>
  )
}

JdenticonIcon.propTypes = {
  size: PropTypes.string,
  value: PropTypes.string.isRequired
}

export default JdenticonIcon
