import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'
import Scrollbars from 'components/Scrollbars'

import Container from 'components/containers/Container'
import { SideTab, SideTabs } from 'components/tabs'
import PropTypes from 'constants/propTypes'
import { Link } from 'react-router-dom'

const useStyles = makeStyles(({ palette, type }) => ({
  root: {
    gridTemplateColumns: '250px auto',
    height: 'calc(100vh - 190px)',
    gap: 0
  },
  tabRoot: {
    borderRight: `1px solid ${palette[type].sideModal.content.border}`
  },
  tabs: {
    flexGrow: 2,
    display: 'flex',
    justifyContent: 'flex-end'
  },
  scroller: {
    padding: '55px 0',
    paddingLeft: 25,
    marginTop: 30
  },
  tab: {
    opacity: 1,
    height: '50px',
    width: '230px',
    margin: '25px -1px 0'
  },
  selected: {
    color: palette[type].pages.rbac.roles.active.color
  },
  icon: {
    fontSize: '28px',
    padding: '0 15px'
  },
  contentRoot: {
    height: '100%',
    flexGrow: 1
  }
}))

const DictionaryLayout = ({
  tabs,
  activeTab,
  onChangeTab,
  children,
  rootClassName
}) => {
  const classes = useStyles()
  return (
    <Container rootClassName={classNames(classes.root, rootClassName)}>
      <div className={classes.tabRoot}>
        <Scrollbars>
          {activeTab && (
            <SideTabs
              value={activeTab}
              onChange={(_, tab) => onChangeTab(tab)}
              classes={{ root: classes.tabs, scroller: classes.scroller }}
            >
              {tabs.map(({ icon, activeIcon, label, value, to }) => (
                <SideTab
                  key={`dictionary-tab-${value}`}
                  disableRipple
                  value={value}
                  label={label}
                  classes={{ root: classes.tab, selected: classes.selected }}
                  icon={
                    <i
                      className={classNames(
                        {
                          [icon]: !activeIcon || activeTab !== value,
                          [activeIcon]: activeTab === value
                        },
                        classes.icon
                      )}
                    />
                  }
                  to={to}
                  component={to && Link}
                />
              ))}
            </SideTabs>
          )}
        </Scrollbars>
      </div>
      <div className={classes.contentRoot}>{children}</div>
    </Container>
  )
}

DictionaryLayout.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string,
      activeIcon: PropTypes.string,
      label: PropTypes.string,
      value: PropTypes.string.isRequired,
      to: PropTypes.string
    })
  ),
  activeTab: PropTypes.string,
  onChangeTab: PropTypes.func,
  rootClassName: PropTypes.className
}

DictionaryLayout.defaultProps = {
  tabs: [],
  onChangeTab: f => f
}

export default DictionaryLayout
