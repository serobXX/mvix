import { useCallback, useEffect, useMemo, useState } from 'react'
import moment from 'moment'

import { ProductItemsCard } from 'components/cards'
import { entityValues } from 'constants/customFields'
import {
  getCustomFieldValueByCode,
  getTitleBasedOnEntity
} from 'utils/customFieldUtils'
import { Text } from 'components/typography'
import {
  BACKEND_DATE_FORMAT,
  DATE_VIEW_FORMAT
} from 'constants/dateTimeFormats'
import { makeStyles } from '@material-ui/core'
import customFieldNames from 'constants/customFieldNames'
import { FormControlDatePicker } from 'components/formControls'
import { billingShippingToAddress } from 'utils/detailViewUtils'
import { calculateGrandTotal, calculateSubTotal } from 'utils/productItemUtils'

const useStyles = makeStyles(({ typography, type }) => ({
  leftFooterLine1: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',

    '& p': {
      ...typography.lightText[type]
    }
  },
  boldText: {
    color: `${typography.darkAccent[type].color} !important`,
    fontSize: `${typography.darkAccent[type].fontSize} !important`,
    fontWeight: `${typography.darkAccent[type].fontWeight} !important`,
    lineHeight: `${typography.darkAccent[type].lineHeight} !important`,

    '&:hover': {
      fontStyle: 'italic'
    }
  }
}))

const EstimateItemsCard = ({
  item,
  onEditSubmit,
  onlyEdit,
  isSubmitClick,
  isResetClick,
  addresses,
  account,
  onChangeFormValid
}) => {
  const classes = useStyles()
  const [validDuration, setValidDuration] = useState(
    moment().add(30, 'days').format(DATE_VIEW_FORMAT)
  )

  useEffect(() => {
    setValidDuration(
      moment(
        item?.estimateValidityDuration ||
          moment(item?.createdAt).add(30, 'days').format(BACKEND_DATE_FORMAT),
        BACKEND_DATE_FORMAT
      ).format(DATE_VIEW_FORMAT)
    )
    //eslint-disable-next-line
  }, [item?.estimateValidityDuration])

  const handleChangeDuration = useCallback(({ target: { value } }) => {
    setValidDuration(value)
  }, [])

  const leftFooterComponent = useCallback(
    ({ isEdit, onEnableEdit }) => (
      <>
        <div className={classes.leftFooterLine1}>
          <Text rootClassName={classes.boldText}>Valid Until:</Text>
          {isEdit ? (
            <FormControlDatePicker
              value={validDuration}
              onChange={handleChangeDuration}
              marginBottom={false}
              maskValue={DATE_VIEW_FORMAT}
            />
          ) : (
            <Text onDoubleClick={onEnableEdit}>{validDuration}</Text>
          )}
        </div>
        {/* <Text color="highlight">
          Email partners@mvix.com or call 866.310.4923 for any assistance.
        </Text> */}
      </>
    ),
    [classes, handleChangeDuration, validDuration]
  )

  const parsedData = useMemo(
    () =>
      item
        ? {
            items: item?.itemGroups
              ? item.itemGroups.map(({ contact, address, items: _items }) => ({
                  contactId: contact?.id,
                  address,
                  items: _items.map(
                    ({ discount, taxPercent, quantity, product, price }) => {
                      const subTotal = calculateSubTotal(
                        Number(price) ||
                          getCustomFieldValueByCode(
                            product,
                            customFieldNames.productPrice,
                            0
                          ),
                        quantity
                      )
                      return {
                        productCode: product.id,
                        productCodeName: getCustomFieldValueByCode(
                          product,
                          customFieldNames.productCode,
                          ''
                        ),
                        productName: getCustomFieldValueByCode(
                          product,
                          customFieldNames.productName,
                          ''
                        ),
                        productPrice:
                          Number(price) ||
                          getCustomFieldValueByCode(
                            product,
                            customFieldNames.productPrice,
                            0
                          ),
                        isCustomProduct: product?.isCustomProduct,
                        discount: Number(discount || 0),
                        quantity: Number(quantity),
                        subTotal,
                        tax: Number(taxPercent || 0),
                        total: calculateGrandTotal(
                          subTotal,
                          Boolean(
                            getCustomFieldValueByCode(
                              item,
                              customFieldNames.shipToMultiple
                            )
                          )
                            ? taxPercent
                            : 0,
                          discount
                        ),
                        productId: product.id
                      }
                    }
                  )
                }))
              : [],
            subTotal: Number(item?.subTotal),
            tax: Number(item?.taxPercent || 0),
            discount: Number(item?.discountPercent || 0),
            grandTotal: Number(item?.grandTotal),
            shipToMultiple: Boolean(
              getCustomFieldValueByCode(item, customFieldNames.shipToMultiple)
            )
          }
        : {},
    [item]
  )

  const handleSubmit = useCallback(
    ({ shipToMultiple, items, discount }) => {
      onEditSubmit({
        productItems: {
          discountPercent: discount,
          itemGroups: items.map(({ contactId, address, items: _items }) => ({
            ...(shipToMultiple ? { contactId } : {}),
            ...(shipToMultiple ? { address } : {}),
            items: _items.map(
              ({ productId, productPrice, quantity, discount, tax }) => ({
                productId: productId,
                quantity: quantity,
                discount: discount,
                taxPercent: shipToMultiple ? tax : 0,
                price: productPrice
              })
            )
          }))
        },
        estimateValidityDuration: moment(
          validDuration,
          DATE_VIEW_FORMAT
        ).format(BACKEND_DATE_FORMAT),
        [customFieldNames.shipToMultiple]: shipToMultiple
      })
    },
    [onEditSubmit, validDuration]
  )

  const shippingAddress = useMemo(() => {
    const address = addresses || item?.customFields

    return address ? billingShippingToAddress(address)?.[1] : null
  }, [addresses, item])

  return (
    <ProductItemsCard
      title={
        onlyEdit
          ? 'Product Items'
          : getTitleBasedOnEntity(entityValues.estimate, item)
      }
      leftFooterComponent={leftFooterComponent}
      data={parsedData}
      onSubmit={handleSubmit}
      onlyEdit={onlyEdit}
      isSubmitClick={isSubmitClick}
      isResetClick={isResetClick}
      account={account}
      shippingAddress={shippingAddress}
      onChangeFormValid={onChangeFormValid}
    />
  )
}

export default EstimateItemsCard
