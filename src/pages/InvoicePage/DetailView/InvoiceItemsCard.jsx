import { useCallback, useMemo, useState } from 'react'

import { ProductItemsCard } from 'components/cards'
import { getCustomFieldValueByCode } from 'utils/customFieldUtils'
import customFieldNames from 'constants/customFieldNames'
import { billingShippingToAddress } from 'utils/detailViewUtils'
import { calculateGrandTotal, calculateSubTotal } from 'utils/productItemUtils'
import iconNames from 'constants/iconNames'
import { getIconClassName } from 'utils/iconUtils'
import { RequestChangesModal } from 'components/modals'

const InvoiceItemsCard = ({
  item,
  onEditSubmit,
  onlyEdit,
  isSubmitClick,
  isResetClick,
  disabledEdit,
  addresses,
  account
}) => {
  const [isChangesModalOpen, setChangesModalOpen] = useState(false)
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
    ({ items, shipToMultiple, discount }) => {
      onEditSubmit({
        productItems: {
          discountPercent: discount,
          itemGroups: items.map(({ contactId, address, items: _items }) => ({
            ...(shipToMultiple ? { contactId } : {}),
            ...(shipToMultiple ? { address } : {}),
            items: _items.map(
              ({ productId, quantity, discount, tax, productPrice }) => ({
                productId: productId,
                quantity: quantity,
                discount: discount,
                taxPercent: shipToMultiple ? tax : 0,
                price: productPrice
              })
            )
          }))
        },
        [customFieldNames.shipToMultiple]: shipToMultiple
      })
    },
    [onEditSubmit]
  )

  const shippingAddress = useMemo(() => {
    const address = addresses || item?.customFields

    return address ? billingShippingToAddress(address)?.[1] : null
  }, [addresses, item])

  const actions = useMemo(
    () => [
      {
        label: 'Request Changes',
        icon: getIconClassName(iconNames.subject),
        onClick: () => setChangesModalOpen(true),
        render: !onlyEdit && !disabledEdit && !!item?.requestedChanges?.length
      }
    ],
    [onlyEdit, disabledEdit, item?.requestedChanges]
  )

  return (
    <>
      <ProductItemsCard
        title={onlyEdit ? 'Product Items' : item?.invoiceNumber}
        data={parsedData}
        onSubmit={handleSubmit}
        onlyEdit={onlyEdit}
        isSubmitClick={isSubmitClick}
        isResetClick={isResetClick}
        disabledEdit={onlyEdit ? false : disabledEdit}
        account={account}
        shippingAddress={shippingAddress}
        actions={actions}
      />
      <RequestChangesModal
        open={isChangesModalOpen}
        onClose={() => setChangesModalOpen(false)}
        items={item?.requestedChanges}
      />
    </>
  )
}

export default InvoiceItemsCard
