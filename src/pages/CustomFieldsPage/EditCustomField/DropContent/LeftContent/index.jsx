import { useCallback, useEffect, useMemo, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import update from 'immutability-helper'

import { SideTabs } from 'components/tabs'
import Scrollbars from 'components/Scrollbars'
import { _uniqueId } from 'utils/lodash'
import SideTabComponent from './SideTabComponent'
import {
  createCustomFieldTab,
  sortDataBySortOrder,
  updateFieldValueByKey
} from 'utils/customFieldUtils'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'

const useStyles = makeStyles(({ palette, type }) => ({
  root: {
    borderRight: `1px solid ${palette[type].sideModal.content.border}`,
    height: '100%'
  },
  tabsRoot: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  tabsScroller: {
    padding: '55px 0',
    paddingLeft: 25
  },
  tabsContainer: {
    alignItems: 'flex-end'
  },
  tabRoot: {
    opacity: 1,
    height: '50px',
    width: '250px',
    minWidth: 100,
    margin: '25px -1px 0'
  },
  tabSelected: {
    color: palette[type].pages.rbac.roles.active.color
  },
  tabWrapper: {
    paddingLeft: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
    display: 'inline-flex',
    alignItems: 'center'
  },
  draggingHover: {
    width: 250,
    height: 50,
    margin: '25px -1px 0'
  }
}))

const LeftContent = ({
  value,
  onChange,
  tabs,
  fields,
  setFields,
  setStopDrop,
  onEditProperties,
  onDelete
}) => {
  const classes = useStyles()
  const [hoverTabs, setHoverTabs] = useState([])

  useEffect(() => {
    setHoverTabs([...tabs])
  }, [tabs])

  const handleChange = useCallback(
    tab => e => {
      if (tab !== value) {
        onChange(e, tab)
      }
    },
    [onChange, value]
  )

  const handleMoveTabHover = useCallback(
    (sourceIndex, destinationIndex, sourceItem) => {
      if (destinationIndex > -1) {
        if (sourceIndex > -1) {
          setHoverTabs(
            update(tabs, {
              $splice: [
                [sourceIndex, 1],
                [destinationIndex, 0, sourceItem]
              ]
            })
          )
        }
        setStopDrop(false)
      }
    },
    [setStopDrop, tabs]
  )

  const handleMoveTabComplete = useCallback(
    (sourceIndex, destinationIndex) => {
      if (sourceIndex === undefined) {
        setStopDrop(true)
        setFields(fields =>
          sortDataBySortOrder(
            update(fields, {
              ...hoverTabs
                .slice(destinationIndex)
                .reduce((a, { sortOrder }) => {
                  a[sortOrder - 1] = {
                    sortOrder: { $set: sortOrder + 1 }
                  }
                  return a
                }, {}),

              $splice: [
                [0, 0],
                [
                  destinationIndex,
                  0,
                  createCustomFieldTab({
                    name: `Tab ${hoverTabs.length + 1}`,
                    code: `tab-${_uniqueId()}`,
                    sortOrder: destinationIndex + 1
                  })
                ]
              ]
            })
          )
        )
      } else {
        setFields(fields =>
          sortDataBySortOrder(
            update(fields, {
              ...hoverTabs.reduce((a, { sortOrder }, index) => {
                a[sortOrder - 1] = {
                  sortOrder: { $set: index + 1 }
                }
                return a
              }, {})
            })
          )
        )
      }
    },
    [hoverTabs, setFields, setStopDrop]
  )

  const actions = useMemo(
    () => [
      {
        label: 'Edit Properties',
        clickAction: onEditProperties
      },
      {
        label: 'Delete',
        icon: getIconClassName(iconNames.delete),
        clickAction: onDelete
      }
    ],
    [onDelete, onEditProperties]
  )

  const handleUpdateLabel = useCallback(
    (code, value) => {
      updateFieldValueByKey({
        fields,
        key: 'name',
        code,
        value,
        setFields,
        isTab: true
      })
    },
    [setFields, fields]
  )

  return (
    <div className={classes.root}>
      <Scrollbars>
        <SideTabs
          value={0}
          classes={{
            root: classes.tabsRoot,
            scroller: classes.tabsScroller,
            flexContainer: classes.tabsContainer
          }}
        >
          {hoverTabs.map((item, index) => (
            <SideTabComponent
              item={item}
              index={index}
              tabSelected={item.value === value}
              key={`side-tab-${item.value}`}
              handleChange={handleChange}
              classes={classes}
              onMoveTabHover={handleMoveTabHover}
              onMoveTabComplete={handleMoveTabComplete}
              actions={actions}
              onUpdateLabel={handleUpdateLabel}
            />
          ))}
        </SideTabs>
      </Scrollbars>
    </div>
  )
}

export default LeftContent
