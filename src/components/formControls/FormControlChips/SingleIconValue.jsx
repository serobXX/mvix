import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'
import { components } from 'react-select'

const useStyles = makeStyles({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row'
  },
  icon: {
    fontSize: 16,
    marginRight: 8
  }
})

const SingleIconValue = ({ classes, children, data, ...props }) => {
  const iconClasses = useStyles()
  return (
    <components.SingleValue {...props}>
      <div className={iconClasses.root}>
        <i className={classNames(iconClasses.icon, data.icon)}></i>
        {data.label}
      </div>
    </components.SingleValue>
  )
}

export default SingleIconValue
