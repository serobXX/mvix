import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'

const useStyles = makeStyles(() => ({
  tabRoot: {
    width: '100%',
    display: 'flex',
    marginLeft: '-5px',
    marginBottom: 20
  },
  tabCardRoot: {
    padding: '0.75em',
    background: '#fff',
    borderRadius: 5,
    fontSize: '0.875em',
    fontWeight: 600,
    color: '#6d6e78',
    transition: 'background .15s ease, border .15s ease, box-shadow .15s ease',
    border: '1px solid #e6e6e6',
    boxShadow:
      '0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 6px rgba(0, 0, 0, 0.02)',
    margin: '0px 5px',
    width: '120px',
    height: 70,
    cursor: 'pointer',

    '&:hover': {
      color: '#30313d',

      '& i': {
        color: '#30313d'
      }
    }
  },
  tabCardSelected: {
    borderColor: '#0570de',
    color: '#0570de !important',
    boxShadow:
      '0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 6px rgba(0, 0, 0, 0.02), 0 0 0 1px #0570de',
    '& i': {
      color: '#0570de !important'
    }
  },
  tabCardIcon: {
    width: '100%',
    '& i': {
      fontSize: '1em',
      color: '#6d6e78'
    }
  },
  tabCardText: {
    paddingTop: '0.25em'
  }
}))

const CardTab = ({ tabs, value, onChange }) => {
  const classes = useStyles()
  return (
    <div className={classes.tabRoot}>
      {tabs.map(({ label, icon, value: _value }) => (
        <div
          key={`card-tab-${_value}`}
          className={classNames(classes.tabCardRoot, {
            [classes.tabCardSelected]: value === _value
          })}
          onClick={() => onChange(_value)}
        >
          <div className={classes.tabCardIcon}>
            <i className={icon} />
          </div>
          <div className={classes.tabCardText}>{label}</div>
        </div>
      ))}
    </div>
  )
}

export default CardTab
