import { useCallback } from 'react'
import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'
import { Draggable } from 'react-beautiful-dnd'

import {
  FormControlAutocomplete,
  FormControlNumericInput
} from 'components/formControls'
import Icon from 'components/icons/Icon'
import { Text, TextWithTooltip } from 'components/typography'
import customFieldNames from 'constants/customFieldNames'
import iconNames from 'constants/iconNames'
import update from 'immutability-helper'
import { getProductOptions } from 'utils/autocompleteOptions'
import { parseCurrency } from 'utils/generalUtils'
import { getIconClassName } from 'utils/iconUtils'
import { _get } from 'utils/lodash'
import PortalAwareItem from 'components/PortalAwareItem'
import { tableColumnsWidth } from 'utils/productItemUtils'

const useStyles = makeStyles(({ typography, type, fontSize, colors }) => ({
  root: {
    position: 'relative',
    '&:hover $dragHandler': {
      opacity: 1
    },
    '& td': {
      padding: '0px 10px'
    }
  },
  tableContentRoot: {
    // padding: '8px 0px',
    borderBottom: `1px solid ${colors.highlight}`
  },
  tableContentText: {
    ...typography.lightText[type],
    textAlign: 'center',
    lineHeight: '35px',
    height: 35
  },
  productName: {
    textAlign: 'left',
    padding: '0px 10px !important',
    width: 'fit-content'
  },
  deleteIcon: {
    position: 'absolute',
    right: '10px',
    '& i': {
      fontSize: fontSize.big,
      width: 'auto',
      color: '#f84b6a',
      opacity: '0.7',
      transitionDuration: '0.3s',
      '&:hover, &:focus': {
        opacity: 1
      }
    }
  },
  rowTotalEditMode: {
    display: 'flex',
    gap: 13,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dragHandler: {
    position: 'absolute',
    left: '-10px',
    top: 5,
    opacity: 0.3,
    transitionDuration: '0.3s',
    cursor: 'grab',

    '& i': {
      color: typography.lightText[type].color,
      fontSize: 24
    }
  },
  draggingItem: {
    opacity: 0
  },
  formControlRoot: {
    background: 'transparent'
  },
  discountRoot: {
    display: 'flex',
    justifyContent: 'center'
  },
  productPriceRoot: {
    display: 'flex',
    justifyContent: 'center'
  }
}))

const transformData = (data, field) => {
  return data.map(d => {
    return {
      customFields: d.customFields,
      label: _get(d, `customFields.${field}`, ''),
      value: d.id,
      isCustomProduct: d.isCustomProduct
    }
  })
}

const portal = document.createElement('div')
document.body.appendChild(portal)

const Row = ({
  item,
  index,
  isEditAll = false,
  getNameByKey = f => f,
  handleBlur,
  setValues = f => f,
  values,
  isMultipleShip,
  parentIndex,
  calculateFields,
  onRemoveRow = f => f,
  errors,
  touched,
  isSalesTax = true
}) => {
  const classes = useStyles()

  const getValueByKey = useCallback(
    (values, index, name) => _get(values, getNameByKey(index, name), ''),
    [getNameByKey]
  )

  const handleChangeProduct = index => e => {
    const {
      target: { customFields, value, isCustomProduct }
    } = e

    const { subTotal, total } = calculateFields(
      {
        productPrice: Number(
          _get(customFields, customFieldNames.productPrice, 0)
        )
      },
      index
    )

    setValues(
      update(values, {
        items: {
          [parentIndex]: {
            items: {
              [index]: {
                productId: {
                  $set: value
                },
                productCode: {
                  $set: value
                },
                productPrice: {
                  $set: Number(
                    _get(customFields, customFieldNames.productPrice, 0)
                  )
                },
                isCustomProduct: {
                  $set: isCustomProduct
                },
                tax: {
                  $set: isSalesTax
                    ? Number(
                        _get(
                          values,
                          `items.${parentIndex}.items.${index}.tax`,
                          0
                        )
                      )
                    : 0
                },
                subTotal: {
                  $set: subTotal
                },
                total: {
                  $set: total
                }
              }
            }
          }
        }
      })
    )
  }

  const handleChangeRow =
    index =>
    ({ target: { name, value } }) => {
      const productPrice =
        name === getNameByKey(index, 'productPrice')
          ? value
          : getValueByKey(values, index, 'productPrice')
      const quantity =
        name === getNameByKey(index, 'quantity')
          ? value
          : getValueByKey(values, index, 'quantity')
      const discount =
        name === getNameByKey(index, 'discount')
          ? value
          : getValueByKey(values, index, 'discount')
      const { subTotal, total } = calculateFields(
        { productPrice, quantity, discount },
        index
      )
      setValues(
        update(values, {
          items: {
            [parentIndex]: {
              items: {
                [index]: {
                  productPrice: {
                    $set: productPrice
                  },
                  quantity: {
                    $set: quantity
                  },
                  discount: {
                    $set: discount
                  },
                  tax: {
                    $set: isSalesTax
                      ? Number(
                          _get(
                            values,
                            `items.${parentIndex}.items.${index}.tax`,
                            0
                          )
                        )
                      : 0
                  },
                  subTotal: {
                    $set: subTotal
                  },
                  total: {
                    $set: total
                  }
                }
              }
            }
          }
        })
      )
    }

  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <PortalAwareItem
          provided={provided}
          snapshot={snapshot}
          portal={portal}
          component="tr"
          className={classes.root}
          isCustomDragHandle
        >
          <td width={`${tableColumnsWidth.productCode}%`}>
            {isEditAll && (
              <div
                className={classes.dragHandler}
                {...provided.dragHandleProps}
              >
                <i className={getIconClassName(iconNames.dragHandler)} />
              </div>
            )}
            <div className={classes.tableContentRoot}>
              {isEditAll ? (
                <FormControlAutocomplete
                  name={'productCode'}
                  value={item.productCode}
                  onChange={handleChangeProduct(index)}
                  onBlur={handleBlur}
                  getOptions={getProductOptions(
                    [customFieldNames.productCode, 'id'],
                    transformData
                  )}
                  marginBottom={false}
                  initialFetchValue={item.productCode}
                  fullWidth
                  withPortal
                  formControlRootClass={classes.formControlRoot}
                />
              ) : (
                <TextWithTooltip
                  maxWidth={120}
                  rootClassName={classes.tableContentText}
                >
                  {item.productCodeName}
                </TextWithTooltip>
              )}
            </div>
          </td>
          <td
            width={`${
              isMultipleShip
                ? tableColumnsWidth.productNameMulti
                : tableColumnsWidth.productName
            }%`}
          >
            <div className={classes.tableContentRoot}>
              {isEditAll ? (
                <FormControlAutocomplete
                  name={'productId'}
                  value={item.productId}
                  error={getValueByKey(errors, index, 'productId')}
                  touched={getValueByKey(touched, index, 'productId') || false}
                  onChange={handleChangeProduct(index)}
                  onBlur={handleBlur}
                  getOptions={getProductOptions(null, transformData)}
                  marginBottom={false}
                  initialFetchValue={item.productId}
                  fullWidth
                  withPortal
                  formControlRootClass={classes.formControlRoot}
                  hideErrorText
                />
              ) : (
                <TextWithTooltip
                  rootClassName={classNames(
                    classes.tableContentText,
                    classes.productName
                  )}
                  maxWidth={430}
                >
                  {item.productName}
                </TextWithTooltip>
              )}
            </div>
          </td>
          <td width={`${tableColumnsWidth.price}%`}>
            <div
              className={classNames(
                classes.tableContentRoot,
                classes.productPriceRoot
              )}
            >
              {isEditAll && item.isCustomProduct ? (
                <FormControlNumericInput
                  name={getNameByKey(index, 'productPrice')}
                  value={item.productPrice}
                  error={getValueByKey(errors, index, 'productPrice')}
                  touched={
                    getValueByKey(touched, index, 'productPrice') || false
                  }
                  onChange={handleChangeRow(index)}
                  onBlur={handleBlur}
                  min={0}
                  max={100}
                  precision={2}
                  marginBottom={false}
                  formControlRootClass={classes.formControlRoot}
                  startAdornment={<Text>$</Text>}
                  onlyInput
                />
              ) : (
                <Text rootClassName={classes.tableContentText}>
                  {parseCurrency(item.productPrice.toFixed(2))}
                </Text>
              )}
            </div>
          </td>
          <td width={`${tableColumnsWidth.qty}%`}>
            <div className={classes.tableContentRoot}>
              {isEditAll ? (
                <FormControlNumericInput
                  name={getNameByKey(index, 'quantity')}
                  value={item.quantity}
                  error={getValueByKey(errors, index, 'quantity')}
                  touched={getValueByKey(touched, index, 'quantity') || false}
                  onChange={handleChangeRow(index)}
                  onBlur={handleBlur}
                  min={1}
                  precision={0}
                  marginBottom={false}
                  fullWidth
                  formControlRootClass={classes.formControlRoot}
                />
              ) : (
                <Text rootClassName={classes.tableContentText}>
                  {item.quantity}
                </Text>
              )}
            </div>
          </td>
          <td width={`${tableColumnsWidth.subTotal}%`}>
            <div className={classes.tableContentRoot}>
              <Text rootClassName={classes.tableContentText}>
                {parseCurrency((item.subTotal || 0).toFixed(2))}
              </Text>
            </div>
          </td>
          {isMultipleShip && (
            <td width={`${tableColumnsWidth.tax}%`}>
              <div className={classes.tableContentRoot}>
                <Text rootClassName={classes.tableContentText}>
                  {`${(item.tax || 0).toFixed(2)}%`}
                </Text>
              </div>
            </td>
          )}
          <td width={`${tableColumnsWidth.disc}%`}>
            <div
              className={classNames(
                classes.tableContentRoot,
                classes.discountRoot
              )}
            >
              {isEditAll ? (
                <FormControlNumericInput
                  name={getNameByKey(index, 'discount')}
                  value={item.discount}
                  error={getValueByKey(errors, index, 'discount')}
                  touched={getValueByKey(touched, index, 'discount') || false}
                  onChange={handleChangeRow(index)}
                  onBlur={handleBlur}
                  min={0}
                  max={100}
                  precision={2}
                  marginBottom={false}
                  formControlRootClass={classes.formControlRoot}
                  startAdornment={<Text>$</Text>}
                  onlyInput
                />
              ) : (
                <Text rootClassName={classes.tableContentText}>
                  {parseCurrency((item.discount || 0).toFixed(1))}
                </Text>
              )}
            </div>
          </td>
          <td width={`${tableColumnsWidth.total}%`}>
            <div
              className={classNames(classes.tableContentRoot, {
                [classes.rowTotalEditMode]: isEditAll
              })}
            >
              <Text rootClassName={classes.tableContentText}>
                {parseCurrency(item.total.toFixed(2))}
              </Text>
              {isEditAll &&
                values?.items &&
                values?.items.reduce((a, b) => a + b.items.length, 0) > 1 && (
                  <div className={classes.deleteIcon}>
                    <Icon
                      icon={getIconClassName(iconNames.delete)}
                      onClick={() => onRemoveRow(parentIndex, index)}
                    />
                  </div>
                )}
            </div>
          </td>
        </PortalAwareItem>
      )}
    </Draggable>
  )
}

export default Row
