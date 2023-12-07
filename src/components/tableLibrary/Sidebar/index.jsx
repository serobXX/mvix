import { useCallback, useMemo, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'

import Scrollbars from 'components/Scrollbars'
import PropTypes from 'constants/propTypes'

const useStyles = makeStyles(({ palette, type }) => ({
  root: {
    position: 'relative',
    borderLeft: `1px solid ${palette[type].tableLibrary.body.cell.border}`,
    height: '100%',
    display: 'flex',
    flexDirection: 'row-reverse'
  },
  sideButtons: ({ paddingTop }) => ({
    background: palette[type].tableLibrary.sidePanel.background,
    width: 30,
    paddingTop,
    position: 'relative',
    color: palette[type].tableLibrary.body.cell.color,
    overflow: 'hidden',
    height: '100%',
    zIndex: 101
  }),
  sideButton: {
    borderLeft: `2px solid transparent`,
    transition: `border-left 0.3s`,
    color: 'inherit',
    fontFamily: 'inherit',
    fontSize: '13px',
    lineHeight: '18px',
    fontWeight: 'inherit',
    background: 'transparent',
    padding: '12px 0px',
    width: '100%',
    margin: 0,
    minHeight: '108px',
    backgroundPositionY: 'center',
    backgroundPositionX: 'center',
    backgroundRepeat: 'no-repeat',
    border: 'none',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'nowrap',
    whiteSpace: 'nowrap',
    outline: 'none',
    cursor: 'pointer',

    '&:hover': {
      color: palette[type].tableLibrary.body.cell.active
    }
  },
  buttonIcon: {
    fontSize: '13px',
    marginBottom: 6
  },
  buttonLabel: {
    writingMode: 'vertical-lr'
  },
  selected: {
    color: palette[type].tableLibrary.body.cell.active,
    '& $sideButton': {
      borderLeftColor: palette[type].tableLibrary.body.cell.active
    }
  },
  toolPanelWrap: ({ panelWidth }) => ({
    borderRight: `1px solid ${palette[type].tableLibrary.body.cell.border}`,
    width: panelWidth,
    backgroundColor: palette[type].tableLibrary.sidePanel.background,
    height: '100%',
    zIndex: 101
  }),
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 100,
    width: '100%',
    height: '100%'
  }
}))

const Sidebar = ({ panels, paddingTop }) => {
  const [activePanel, setActivePanel] = useState()

  const filteredPanels = useMemo(
    () => panels.filter(({ isVisible }) => isVisible !== false),
    [panels]
  )

  const {
    component: Component,
    componentProps = {},
    panelWidth = 315,
    render
  } = filteredPanels[activePanel] || {}

  const classes = useStyles({
    paddingTop,
    panelWidth
  })

  const handleActivePanel = useCallback(
    index => () => {
      if (activePanel === index) {
        setActivePanel(null)
      } else setActivePanel(index)
    },
    [activePanel]
  )

  const closePanel = useCallback(() => {
    setActivePanel(null)
  }, [])

  return (
    <div className={classes.root}>
      <div className={classes.sideButtons}>
        {filteredPanels.map(({ icon, label }, index) => (
          <div
            key={`side-panel-${index}`}
            className={classNames(classes.sideButtonRoot, {
              [classes.selected]: index === activePanel
            })}
          >
            <button
              className={classes.sideButton}
              onClick={handleActivePanel(index)}
            >
              <i className={classNames(icon, classes.buttonIcon)} />
              <span className={classes.buttonLabel}>{label}</span>
            </button>
          </div>
        ))}
      </div>
      {activePanel >= 0 && (Component || render) && (
        <>
          <div className={classes.overlay} onClick={closePanel} />
          <div className={classes.toolPanelWrap}>
            <Scrollbars>
              {Component ? (
                <Component closePanel={closePanel} {...componentProps} />
              ) : typeof render === 'function' ? (
                render(closePanel)
              ) : (
                render
              )}
            </Scrollbars>
          </div>
        </>
      )}
    </div>
  )
}

Sidebar.propTypes = {
  panels: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string,
      label: PropTypes.string.isRequired,
      panelWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
      render: PropTypes.node,
      componentProps: PropTypes.object
    })
  ),
  paddingTop: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

Sidebar.defaultProps = {
  panels: [],
  paddingTop: 0
}

export default Sidebar
