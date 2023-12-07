import { useCallback, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'
import update from 'immutability-helper'

import {
  FormControlAutocomplete,
  FormControlSelectLocations
} from 'components/formControls'
import { Text } from 'components/typography'
import customFieldNames from 'constants/customFieldNames'
import { _get } from 'utils/lodash'
import { getOptionsByFieldAndEntity } from 'utils/autocompleteOptions'
import { optionEntity } from 'constants/autocompleteOptions'
import Container from 'components/containers/Container'
import { getTitleBasedOnEntity } from 'utils/customFieldUtils'
import { entityValues } from 'constants/customFields'
import Row from './Row'
import { transformAddress } from 'utils/detailViewUtils'
import { getIconClassName } from 'utils/iconUtils'
import iconNames, { iconTypes } from 'constants/iconNames'
import {
  calculateGrandTotal,
  calculateSubTotal,
  tableColumnsWidth
} from 'utils/productItemUtils'
import { Droppable } from 'react-beautiful-dnd'
import { DETAIL_PRODUCT_ITEM_TYPE } from 'constants/dnd'

const useStyles = makeStyles(
  ({ palette, colors, type, typography, fontSize, lineHeight }) => ({
    tableRoot: {
      borderCollapse: 'collapse',
      width: '100%',

      '& th': {
        padding: '0px 10px',
        borderRight: `1px solid ${colors.highlight}`,
        position: 'sticky',
        top: 0,
        background: palette[type].tableLibrary.body.row.background,

        '& $tableHeadRoot': {
          borderBottom: `3px solid ${colors.highlight}`
        }
      },
      '& td': {
        padding: '0px 10px',
        borderRight: `1px solid ${colors.highlight}`
      },
      '& tr:first-child th:last-child, & tr td:last-child': {
        borderRight: 'none'
      },
      // '& tbody tr:last-child td': {
      //   '& $tableContentRoot': {
      //     borderBottom: 'none'
      //   }
      // },
      '& tbody': {
        maxHeight: 400
      }
    },
    tableHeadRoot: {
      padding: '5px 0px'
    },
    tableHeadText: {
      ...typography.darkAccent[type],
      fontSize: fontSize.small,
      lineHeight: lineHeight.small
    },
    productName: {
      textAlign: 'left',
      padding: '0px 10px !important',
      width: 'fit-content'
    },
    tableMargin: {
      marginBottom: 60,
      '& th': {
        '& $tableHeadRoot': {
          borderTop: `3px solid ${colors.highlight}`
        }
      }
    },
    multiShipContainer: {
      padding: '16px 10px',
      paddingTop: 0
    },
    multiShipText: {
      padding: '6px 0px'
    },
    fieldMarginTop: {
      marginTop: 10
    },
    addBtnRow: {
      height: 52
    },
    addBtnRoot: {
      cursor: 'pointer',
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      '& i': {
        color: colors.highlight,
        fontSize: 16
      }
    }
  })
)

const transformDataContact = data => {
  return data.map(d => ({
    customFields: d.customFields,
    label: getTitleBasedOnEntity(entityValues.contact, d),
    value: d.id
  }))
}

const TableRowContent = ({
  values,
  errors,
  touched,
  setValues,
  handleBlur,
  items,
  isEditAll,
  onRemoveRow,
  index: parentIndex,
  isMultipleShip,
  salesTaxData,
  accountId,
  isSalesTax = true,
  onAddRow = f => f,
  hideShipToMultiple
}) => {
  const classes = useStyles({ isMultipleShip })
  const [addressOptions, setAddressOptions] = useState([])

  const getParentNameByKey = useCallback(
    name => `items.${parentIndex}.${name}`,
    [parentIndex]
  )

  const getNameByKey = useCallback(
    (index, name) => `items.${parentIndex}.items.${index}.${name}`,
    [parentIndex]
  )

  const calculateFields = useCallback(
    ({ productPrice, quantity, tax, discount }, index) => {
      const item = _get(values, `items.${parentIndex}.items.${index}`, {})
      const subTotal = calculateSubTotal(
        productPrice || productPrice === 0 ? productPrice : item?.productPrice,
        quantity || item?.quantity
      )
      const total = calculateGrandTotal(
        subTotal,
        isMultipleShip && isSalesTax ? tax || item?.tax : 0,
        discount || item?.discount
      )

      return {
        subTotal,
        total
      }
    },
    [values, parentIndex, isMultipleShip, isSalesTax]
  )

  const handleChangeContact = e => {
    const {
      target: { customFields, value }
    } = e
    const addresses = customFields[customFieldNames.addresses]
    const shipAddress =
      !!addresses?.length &&
      (addresses.find(({ isShip }) => isShip) || addresses[0])

    setAddressOptions(
      addresses?.length
        ? addresses.map(
            ({
              address1,
              address2,
              placeId,
              latitude,
              longitude,
              ...rest
            }) => ({
              label: `${address1}, ${address2}`,
              value: placeId || `lat_lng_${latitude}_${longitude}`,
              val: placeId || `lat_lng_${latitude}_${longitude}`,
              address: {
                ...rest,
                address1,
                address2,
                placeId,
                latitude,
                longitude
              }
            })
          )
        : []
    )
    const salesTax = (isSalesTax &&
      salesTaxData.find(
        ({ stateCode }) => stateCode === shipAddress.stateShort
      )) || { tax: 0 }
    const _itemsData = items.map((_, index) => {
      const { total } = calculateFields({ tax: salesTax.tax }, index)
      return {
        tax: {
          $set: Number(salesTax.tax)
        },
        total: {
          $set: total
        }
      }
    })

    setValues(
      update(values, {
        items: {
          [parentIndex]: {
            contactId: {
              $set: value
            },
            addressId: {
              $set: shipAddress
                ? shipAddress?.placeId ||
                  `lat_lng_${shipAddress.latitude}_${shipAddress.longitude}`
                : ''
            },
            address: {
              $set: shipAddress
            },
            taxId: {
              $set: salesTax.id
            },
            items: _itemsData
          }
        }
      })
    )
  }

  const handleChangeAddress = e => {
    const {
      target: { address, value }
    } = e

    const salesTax = (isSalesTax &&
      salesTaxData.find(
        ({ stateCode }) => stateCode === address.stateShort
      )) || { tax: 0 }
    const _itemsData = items.map((_, index) => {
      const { total } = calculateFields({ tax: salesTax.tax }, index)
      return {
        tax: {
          $set: Number(salesTax.tax)
        },
        total: {
          $set: total
        }
      }
    })

    setValues(
      update(values, {
        items: {
          [parentIndex]: {
            addressId: {
              $set: value
            },
            address: {
              $set: address
            },
            taxId: {
              $set: salesTax.id
            },
            items: _itemsData
          }
        }
      })
    )
  }

  const transformAddressData = useCallback(
    data => ({
      label: `${data.formattedAddress}`,
      value: data.placeId || `lat_lng_${data.latitude}_${data.longitude}`,
      val: data.placeId || `lat_lng_${data.latitude}_${data.longitude}`,
      address: transformAddress(data.formattedAddress, data)
    }),
    []
  )

  return (
    <div>
      {isMultipleShip && !hideShipToMultiple && (
        <Container cols="1-2" rootClassName={classes.multiShipContainer}>
          <FormControlAutocomplete
            label={isEditAll ? 'Contact' : ''}
            name={getParentNameByKey(`contactId`)}
            value={_get(values, getParentNameByKey(`contactId`))}
            onChange={handleChangeContact}
            onBlur={handleBlur}
            getOptions={getOptionsByFieldAndEntity({
              field: [customFieldNames.firstName, 'id'],
              entity: optionEntity.contact,
              transformData: transformDataContact,
              passIdForNumber: true,
              options: { accountId }
            })}
            initialFetchValue={_get(values, getParentNameByKey(`contactId`))}
            fullWidth
            withPortal
            marginBottom
            readOnlyWithoutSelection={!isEditAll}
            formControlContainerClass={classNames({
              [classes.fieldMarginTop]: !isEditAll
            })}
          />
          <FormControlSelectLocations
            label={isEditAll ? 'Address' : ''}
            name={getParentNameByKey('addressId')}
            value={_get(values, getParentNameByKey(`addressId`))}
            error={_get(errors, getParentNameByKey(`addressId`))}
            touched={_get(touched, getParentNameByKey(`addressId`))}
            onChange={handleChangeAddress}
            transformData={transformAddressData}
            onBlur={handleBlur}
            staticOptions={addressOptions}
            fullWidth
            withPortal
            marginBottom
            readOnlyWithoutSelection={!isEditAll}
            formControlContainerClass={classNames({
              [classes.fieldMarginTop]: !isEditAll
            })}
          />
        </Container>
      )}
      <table
        className={classNames(classes.tableRoot, {
          [classes.tableMargin]: isMultipleShip
        })}
      >
        <thead>
          <tr>
            <th width={`${tableColumnsWidth.productCode}%`}>
              <div className={classes.tableHeadRoot}>
                <Text rootClassName={classes.tableHeadText}>Product SKU</Text>
              </div>
            </th>
            <th
              width={`${
                isMultipleShip
                  ? tableColumnsWidth.productNameMulti
                  : tableColumnsWidth.productName
              }%`}
            >
              <div className={classes.tableHeadRoot}>
                <Text
                  rootClassName={classNames(
                    classes.tableHeadText,
                    classes.productName
                  )}
                >
                  Product Name
                </Text>
              </div>
            </th>
            <th width={`${tableColumnsWidth.price}%`}>
              <div className={classes.tableHeadRoot}>
                <Text rootClassName={classes.tableHeadText}>List Price</Text>
              </div>
            </th>
            <th width={`${tableColumnsWidth.qty}%`}>
              <div className={classes.tableHeadRoot}>
                <Text rootClassName={classes.tableHeadText}>Qty</Text>
              </div>
            </th>
            <th width={`${tableColumnsWidth.subTotal}%`}>
              <div className={classes.tableHeadRoot}>
                <Text rootClassName={classes.tableHeadText}>Sub Total</Text>
              </div>
            </th>
            {isMultipleShip && (
              <th width={`${tableColumnsWidth.tax}%`}>
                <div className={classes.tableHeadRoot}>
                  <Text rootClassName={classes.tableHeadText}>Tax</Text>
                </div>
              </th>
            )}
            <th width={`${tableColumnsWidth.disc}%`}>
              <div className={classes.tableHeadRoot}>
                <Text rootClassName={classes.tableHeadText}>Disc ($)</Text>
              </div>
            </th>
            <th width={`${tableColumnsWidth.total}%`}>
              <div className={classes.tableHeadRoot}>
                <Text rootClassName={classes.tableHeadText}>Total</Text>
              </div>
            </th>
          </tr>
        </thead>
        <Droppable
          droppableId={String(parentIndex)}
          type={DETAIL_PRODUCT_ITEM_TYPE}
        >
          {provided => (
            <tbody {...provided.droppableProps} ref={provided.innerRef}>
              {!!items?.length &&
                items.map((item, index) => (
                  <Row
                    key={`product-items-${item.id}`}
                    item={item}
                    index={index}
                    parentIndex={parentIndex}
                    isEditAll={isEditAll}
                    getNameByKey={getNameByKey}
                    handleBlur={handleBlur}
                    setValues={setValues}
                    values={values}
                    isMultipleShip={isMultipleShip}
                    calculateFields={calculateFields}
                    onRemoveRow={onRemoveRow}
                    errors={errors}
                    touched={touched}
                    isSalesTax={isSalesTax}
                  />
                ))}
              {provided.placeholder}

              {isEditAll && values.items?.length > 1 && (
                <tr>
                  <td colSpan={7} className={classes.addBtnRow}>
                    <div className={classes.addBtnRoot} onClick={onAddRow}>
                      <i
                        className={getIconClassName(
                          iconNames.add,
                          iconTypes.solid
                        )}
                      />
                      <Text>Add New Line Item</Text>
                    </div>
                  </td>
                  <td></td>
                </tr>
              )}
            </tbody>
          )}
        </Droppable>
      </table>
    </div>
  )
}

export default TableRowContent
