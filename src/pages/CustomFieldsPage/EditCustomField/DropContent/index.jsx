import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDrop } from 'react-dnd'
import update from 'immutability-helper'

import Container from 'components/containers/Container'
import { createTab } from 'components/tabs/SideTabGroup'
import { customFieldTypes } from 'constants/customFields'
import { makeStyles } from '@material-ui/core'
import { CircularLoader } from 'components/loaders'
import {
  createCustomFieldItem,
  createCustomFieldTab,
  generateItemCode,
  generateTabCode,
  parseFromBEData,
  refreshSortOrder,
  sortDataBySortOrder
} from 'utils/customFieldUtils'
import { customFieldItemTypes } from 'constants/dnd'
import LeftContent from './LeftContent'
import useConfirmation from 'hooks/useConfirmation'
import { getDeleteConfirmationMessage } from 'utils/snackbarMessages'
import RightContent from './RightContent'
import { _get } from 'utils/lodash'
import FieldProperitesModal from '../FieldProperitesModal'

const useStyles = makeStyles(() => ({
  root: {
    gap: 0,
    position: 'relative'
  }
}))

const DropContent = ({
  data,
  isFetching,
  fields,
  setFields,
  resetFields = false,
  setResetFields
}) => {
  const [displayFields, setDisplayFields] = useState([])
  const [activeTab, setActiveTab] = useState(0)
  const [stopDrop, setStopDrop] = useState(false)
  const [hoverCode, setHoverCode] = useState()
  const [editPropertiesOpen, setEditPropertiesOpen] = useState(false)
  const [editPropertiesItem, setEditPropertiesItem] = useState()
  const classes = useStyles()

  const { showConfirmation } = useConfirmation()

  useEffect(() => {
    if (data.length) {
      const layout = parseFromBEData(data)
      setFields(layout)
      const firstTab = layout.find(({ type }) => type === customFieldTypes.tab)
      if (firstTab) {
        setActiveTab(firstTab.code)
        setDisplayFields(firstTab.childs)
      } else {
        setDisplayFields(layout)
      }
    }
    //eslint-disable-next-line
  }, [data])

  useEffect(() => {
    if (resetFields) {
      const firstTab = fields.find(({ type }) => type === customFieldTypes.tab)
      if (firstTab) {
        setActiveTab(firstTab.code)
        setDisplayFields(firstTab.childs)
      } else {
        setActiveTab(0)
        setDisplayFields(fields)
      }
      setResetFields(false)
    }
    //eslint-disable-next-line
  }, [resetFields, fields])

  const tabs = useMemo(() => {
    return sortDataBySortOrder(
      fields.filter(({ type }) => type === customFieldTypes.tab)
    ).map(({ name, code, sortOrder, tooltip, tooltipType }) => ({
      ...createTab(name, code, { tooltip, tooltipType }),
      sortOrder
    }))
  }, [fields])

  const handleChangeTab = (_, tab) => {
    setActiveTab(tab)
    setDisplayFields(fields.find(({ code }) => code === tab)?.childs || [])
  }

  const handleAddTab = useCallback(
    ({ code }) => {
      if (!code && !stopDrop) {
        const code = generateTabCode()
        setFields(f => [
          ...(tabs.length ? f : []),
          createCustomFieldTab({
            name: `Tab ${tabs.length + 1}`,
            code,
            sortOrder: tabs.length + 1,
            childs: tabs.length ? [] : f
          })
        ])
        if (!tabs.length) {
          setActiveTab(code)
        }
      } else {
        setStopDrop(false)
      }
    },
    [tabs, stopDrop, setFields]
  )

  const handleAddItem = useCallback(
    ({ code, type }) => {
      // Only new item add at any place
      if (!code && !stopDrop) {
        const previewIndex = displayFields.findIndex(
          ({ isPreview }) => isPreview
        )
        const code = generateItemCode()
        const tabIndex = fields.findIndex(({ code }) => code === activeTab)
        const childLen = displayFields.length

        const updateFields = {
          ...displayFields
            .slice(previewIndex > -1 ? previewIndex + 1 : childLen)
            .reduce((a, { sortOrder }) => {
              a[sortOrder - 1] = {
                sortOrder: { $set: sortOrder + 1 }
              }
              return a
            }, {}),
          $splice: [
            [0, 0],
            [
              previewIndex > -1 ? previewIndex : childLen,
              0,
              createCustomFieldItem(type, {
                name: `${type} ${childLen + 1}`,
                code,
                sortOrder: previewIndex > -1 ? previewIndex + 1 : childLen + 1
              })
            ]
          ]
        }

        // new item add in tab child
        if (tabs.length) {
          if (activeTab && tabIndex > -1) {
            const updatedFields = update(fields, {
              [tabIndex]: {
                childs: updateFields
              }
            })
            setFields(updatedFields)
            setDisplayFields(updatedFields[tabIndex].childs)
          }
        }
        // new item add outside tab
        else {
          const updatedData = update(fields, updateFields)
          setFields(updatedData)
          setDisplayFields(updatedData)
        }
      } else setStopDrop(false)
    },
    [fields, tabs, stopDrop, activeTab, displayFields, setFields]
  )

  const handleAdd = useCallback(
    e => {
      if (e.type === customFieldTypes.tab) {
        handleAddTab(e)
      } else {
        handleAddItem(e)
      }
    },
    [handleAddTab, handleAddItem]
  )

  const handleHoverItem = useCallback((item, monitor) => {
    if (!item.code) {
      let flag = 0
      _get(monitor, 'internalMonitor.registry.dropTargets', []).forEach(
        target => {
          if (
            target.spec.accept === customFieldItemTypes.ITEM &&
            target.monitor.isOver()
          ) {
            flag = 1
            return setHoverCode(target.spec.code)
          }
        }
      )
      if (flag === 0) setHoverCode(null)
    }
  }, [])

  const [{ isOver }, drop] = useDrop({
    accept: [customFieldItemTypes.TAB, customFieldItemTypes.ITEM],
    collect: monitor => ({
      isOver: monitor.isOver()
    }),
    hover: handleHoverItem,
    drop: handleAdd
  })

  useEffect(() => {
    if (isOver) {
      if (hoverCode) {
        const fieldIndex = displayFields.findIndex(f => f.code === hoverCode)
        const previewIndex = displayFields.findIndex(f => f.isPreview)
        if (fieldIndex > -1) {
          setDisplayFields(f =>
            update(f, {
              $splice: [
                [
                  previewIndex > -1 ? previewIndex : fieldIndex,
                  previewIndex > -1 ? 1 : 0
                ],
                [fieldIndex, 0, { isPreview: true }]
              ]
            })
          )
        }
      }
    } else {
      setHoverCode(undefined)
      setDisplayFields(f => f.filter(({ isPreview }) => !isPreview))
    }
    //eslint-disable-next-line
  }, [hoverCode, isOver])

  const handleDelete = useCallback(
    (_, { label, name, value, code, isItem }) => {
      showConfirmation(getDeleteConfirmationMessage(label || name), () => {
        if (isItem) {
          if (activeTab) {
            const tabIndex = fields.findIndex(item => item.code === activeTab)
            if (tabIndex > -1) {
              const updateData = update(fields, {
                [tabIndex]: {
                  childs: {
                    $set: refreshSortOrder(
                      fields[tabIndex].childs.filter(item => item.code !== code)
                    )
                  }
                }
              })
              setFields(updateData)
              setDisplayFields(updateData[tabIndex].childs)
            }
          } else {
            const updateData = refreshSortOrder(
              fields.filter(item => item.code !== code)
            )
            setFields(updateData)
            setDisplayFields(updateData)
          }
        } else {
          setFields(f =>
            refreshSortOrder(f.filter(item => item.code !== value))
          )
          if (value === activeTab) {
            setDisplayFields([])
            setActiveTab(0)
          }
        }
      })
    },
    [setFields, activeTab, showConfirmation, fields]
  )

  const handleEditProperties = (_, item) => {
    setEditPropertiesOpen(true)
    setEditPropertiesItem(item)
  }

  const handleCloseModal = () => {
    setEditPropertiesItem(null)
    setEditPropertiesOpen(false)
  }

  return (
    <>
      <Container
        cols={tabs.length ? '2-8' : '1'}
        rootClassName={classes.root}
        ref={drop}
      >
        {isFetching && <CircularLoader />}
        {tabs.length ? (
          <LeftContent
            tabs={tabs}
            value={activeTab}
            fields={fields}
            setFields={setFields}
            setStopDrop={setStopDrop}
            onChange={handleChangeTab}
            onDelete={handleDelete}
            onEditProperties={handleEditProperties}
          />
        ) : null}
        <RightContent
          displayFields={displayFields}
          tabs={tabs}
          setDisplayFields={setDisplayFields}
          setFields={setFields}
          setStopDrop={setStopDrop}
          activeTab={activeTab}
          fields={fields}
          onDelete={handleDelete}
          onEditProperties={handleEditProperties}
        />
      </Container>
      {editPropertiesOpen && (
        <FieldProperitesModal
          open={editPropertiesOpen}
          item={editPropertiesItem}
          onCloseModal={handleCloseModal}
          setFields={setFields}
          setDisplayFields={setDisplayFields}
          activeTab={activeTab}
          fields={fields}
        />
      )}
    </>
  )
}

export default DropContent
