import { useMemo } from 'react'

import { ProductItemsCard as ItemsCard } from 'components/cards'
import customFieldNames from 'constants/customFieldNames'
import { getCustomFieldValueByCode } from 'utils/customFieldUtils'
import { calculateGrandTotal, calculateSubTotal } from 'utils/productItemUtils'
import { _isNotEmpty } from 'utils/lodash'

const ProductItemsCard = ({ itemGroup, item }) => {
  const parsedData = useMemo(
    () =>
      item
        ? {
            items: _isNotEmpty(itemGroup)
              ? [itemGroup].map(({ contact, address, items: _items }) => ({
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
    [item, itemGroup]
  )
  return (
    <ItemsCard
      title={'Items'}
      data={parsedData}
      disabledEdit
      hideFooter
      hideShipToMultiple
    />
  )
}

export default ProductItemsCard
