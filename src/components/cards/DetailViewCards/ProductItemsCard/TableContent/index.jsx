import React, { useCallback } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'

import TableRowContent from './TableRowContent'
import update from 'utils/immutability'
import { simulateEvent } from 'utils/formik'
import { _get } from 'utils/lodash'
import useConfirmation from 'hooks/useConfirmation'
import customFieldNames from 'constants/customFieldNames'
import { getCustomFieldValueByCode } from 'utils/customFieldUtils'

const TableContent = ({
  values,
  errors,
  touched,
  setValues,
  handleBlur,
  isEditAll,
  onRemoveRow,
  isMultipleShip,
  handleChange,
  account,
  onAddRow,
  salesTaxData,
  hideShipToMultiple
}) => {
  const { showConfirmation } = useConfirmation()
  const handleDragEnd = useCallback(
    async ({ source, destination }) => {
      if (source.droppableId !== destination.droppableId) {
        let items = [...values.items]
        const sourcParentIndex = source.droppableId
        const destParentIndex = destination.droppableId
        const sourceItem = _get(
          values,
          `items.${sourcParentIndex}.items.${source.index}`
        )

        if (sourceItem) {
          try {
            // remove from source
            items = await new Promise((resolve, reject) => {
              if (items?.[sourcParentIndex]?.items?.length === 1) {
                showConfirmation(
                  'Are you sure you want to remove this item, this will also remove the Ship Location?',
                  () => {
                    resolve(
                      update(items, {
                        $splice: [[sourcParentIndex, 1]]
                      })
                    )
                  },
                  reject
                )
              } else {
                resolve(
                  update(items, {
                    [sourcParentIndex]: {
                      items: {
                        $splice: [[source.index, 1]]
                      }
                    }
                  })
                )
              }
            })

            // add to destination
            items = update(items, {
              [destParentIndex]: {
                items: {
                  $splice: [
                    [destination.index, 0],
                    [destination.index, 0, sourceItem]
                  ]
                }
              }
            })
            handleChange(simulateEvent('items', items))
          } catch (err) {}
        }
      } else {
        const parentIndex = source.droppableId
        const sourceItem = _get(
          values,
          `items.${parentIndex}.items.${source.index}`
        )
        if (sourceItem) {
          const items = update([...values.items], {
            [parentIndex]: {
              items: {
                $splice: [
                  [source.index, 1],
                  [destination.index, 0, sourceItem]
                ]
              }
            }
          })
          handleChange(simulateEvent('items', items))
        }
      }
    },
    [values, handleChange, showConfirmation]
  )

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      {values.items.map((item, index) => (
        <TableRowContent
          key={`multiple-product-address-${index}`}
          values={values}
          errors={errors}
          touched={touched}
          setValues={setValues}
          handleBlur={handleBlur}
          items={item.items}
          index={index}
          isEditAll={isEditAll}
          onRemoveRow={onRemoveRow}
          isMultipleShip={isMultipleShip}
          handleChange={handleChange}
          salesTaxData={salesTaxData}
          accountId={account?.id}
          isSalesTax={
            getCustomFieldValueByCode(
              account,
              customFieldNames.accountSalesTax
            ) !== false
          }
          onAddRow={onAddRow(index)}
          hideShipToMultiple={hideShipToMultiple}
        />
      ))}
    </DragDropContext>
  )
}

export default TableContent
