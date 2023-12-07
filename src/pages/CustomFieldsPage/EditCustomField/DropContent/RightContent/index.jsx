import { Grid } from '@material-ui/core'
import update from 'immutability-helper'

import Scrollbars from 'components/Scrollbars'
import Spacing from 'components/containers/Spacing'
import CustomFieldItem from './CustomFieldItem'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  sortDataBySortOrder,
  updateFieldValueByKey
} from 'utils/customFieldUtils'
import iconNames from 'constants/iconNames'
import { getIconClassName } from 'utils/iconUtils'
import { customFieldTypes } from 'constants/customFields'

const RightContent = ({
  displayFields = [],
  setDisplayFields,
  fields,
  setFields,
  tabs = [],
  activeTab,
  setStopDrop,
  onDelete,
  onEditProperties
}) => {
  const [hoverItems, setHoverItems] = useState([])
  const [resizeEnable, setResizeEnable] = useState()
  const containerRef = useRef()

  useEffect(() => {
    setHoverItems([...displayFields])
  }, [displayFields])

  // Exsiting item moving
  const handleMoveItemHover = useCallback(
    (sourceIndex, destinationIndex, sourceItem) => {
      if (destinationIndex > -1) {
        if (sourceIndex > -1) {
          setHoverItems(
            update(displayFields, {
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
    [displayFields, setStopDrop]
  )

  // Exsiting Item move complete
  const handleMoveItemComplete = useCallback(
    sourceIndex => {
      if (sourceIndex !== undefined) {
        const tabIndex = fields.findIndex(f => f.code === activeTab)
        const updateFields = {
          ...hoverItems.reduce((a, { sortOrder }, index) => {
            a[sortOrder - 1] = {
              sortOrder: { $set: index + 1 }
            }
            return a
          }, {})
        }
        if (tabIndex > -1) {
          const updateData = update(fields, {
            [tabIndex]: {
              childs: updateFields
            }
          })

          setFields(fields =>
            update(fields, {
              [tabIndex]: {
                childs: {
                  $set: sortDataBySortOrder(updateData[tabIndex].childs)
                }
              }
            })
          )
          setDisplayFields(f => sortDataBySortOrder(update(f, updateFields)))
        } else if (!activeTab && !tabs.length) {
          setFields(fields => sortDataBySortOrder(update(fields, updateFields)))
          setDisplayFields(f => sortDataBySortOrder(update(f, updateFields)))
        }
      }
    },
    [activeTab, fields, hoverItems, setDisplayFields, setFields, tabs]
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
        activeTab,
        setDisplayFields
      })
    },
    [setFields, fields, activeTab, setDisplayFields]
  )

  const handleUpdateWidth = useCallback(
    (code, value) => {
      updateFieldValueByKey({
        fields,
        key: 'width',
        code,
        value,
        setFields,
        activeTab,
        setDisplayFields
      })
    },
    [setFields, fields, activeTab, setDisplayFields]
  )

  const handleResizeEnable = code => e => {
    e.stopPropagation()
    setResizeEnable(code)
  }

  return (
    <Scrollbars onClick={() => setResizeEnable(null)}>
      <Spacing variant={0} paddingVert={2} paddingHor={2}>
        <Grid container spacing={2} ref={containerRef}>
          {hoverItems.map((item, index) =>
            [customFieldTypes.json, customFieldTypes.internal].includes(
              item.type
            ) ? (
              <React.Fragment
                key={`drop-null-field-${item.code}`}
              ></React.Fragment>
            ) : item.isPreview ? (
              <Grid key={`drop-preivew`} xs={tabs.length ? 4 : 3} item></Grid>
            ) : (
              <CustomFieldItem
                key={`drop-custom-field-type-${item.code}`}
                width={item.width || 1}
                item={item}
                index={index}
                onMoveItemHover={handleMoveItemHover}
                onMoveItemComplete={handleMoveItemComplete}
                actions={actions}
                onUpdateLabel={handleUpdateLabel}
                isTabs={!!tabs.length}
                containerWidth={containerRef.current?.clientWidth || 1125}
                isResizeEnable={item.code === resizeEnable}
                onResizeEnable={handleResizeEnable(item.code)}
                onUpdateWidth={handleUpdateWidth}
              />
            )
          )}
        </Grid>
      </Spacing>
    </Scrollbars>
  )
}

export default RightContent
