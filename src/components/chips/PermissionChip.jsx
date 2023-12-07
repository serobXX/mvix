import { Chip, makeStyles } from '@material-ui/core'
import classNames from 'classnames'

const useStyles = makeStyles(() => ({
  root: ({ backgroundColor, color, active }) => ({
    maxWidth: '180px',
    maxHeight: '18px',
    margin: '2.5px',
    borderRadius: '3px',
    overflow: 'hidden',
    color,
    backgroundColor: `${backgroundColor} !important`,
    border: `solid 1px ${color}`,
    opacity: active ? 1 : 0.5
  }),
  label: {
    fontSize: '11px',
    fontWeight: 'bold',
    padding: '4px'
  },
  hidden: {
    visibility: 'hidden'
  }
}))

const PermissionChip = ({ value, clickHandler = f => f, active, hidden }) => {
  const colors = {
    read: '#3cd480',
    create: '#ff7b25',
    update: '#3983ff',
    delete: '#DE5246'
  }
  const picked = active === false ? colors[value] + 75 : colors[value]
  const classes = useStyles({
    backgroundColor: `${colors[value]}25`,
    active,
    color: picked
  })
  return (
    <Chip
      classes={{
        root: classNames(classes.root, { [classes.hidden]: hidden }),
        label: classes.label
      }}
      onClick={clickHandler}
      label={value}
      clickable
    />
  )
}

export default PermissionChip
