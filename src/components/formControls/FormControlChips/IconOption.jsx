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

const IconOption = ({ children, data, ...props }) => {
  const classes = useStyles()

  return (
    <components.Option {...props}>
      <div className={classes.root}>
        <i className={classNames(classes.icon, data.icon)}></i>
        {data.label}
      </div>
    </components.Option>
  )
}

export default IconOption
