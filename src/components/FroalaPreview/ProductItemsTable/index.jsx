import { useMemo } from 'react'
import classNames from 'classnames'

import Table from './Table'
import Footer from './Footer'
import './_productItemsTable.scss'

const staticItem = {
  items: [
    {
      contact: `\${item.contact}`,
      address: `\${item.address}`,
      items: [
        {
          productCode: `\${item.productCode}`,
          productPrice: 0,
          productName: `\${item.productName}`,
          discount: 0,
          quantity: 1,
          subTotal: 0,
          tax: 0,
          total: 0
        }
      ]
    }
  ],
  subTotal: 0,
  discount: 0,
  tax: 0,
  grandTotal: 0
}

const ProductItemsTable = ({
  item,
  isStatic = false,
  isMultipleShip = false
}) => {
  const items = useMemo(
    () => (isStatic ? staticItem.items : item?.items),
    [isStatic, item?.items]
  )

  return (
    <div
      className={classNames('product-items-table__container', {
        'static-options': isStatic
      })}
    >
      {items &&
        items.map(({ contact, address, items }, index) => (
          <div key={`product-item-table-${index}`}>
            {isMultipleShip && (
              <div className="table-header__root">
                {/* <div className="table-header__contact">Contact: {contact}</div> */}
                <div className="table-header__address">Address: {address}</div>
              </div>
            )}
            <Table
              isMultipleShip={isMultipleShip}
              items={items}
              index={index}
            />
          </div>
        ))}

      <Footer
        item={isStatic ? staticItem : item}
        isMultipleShip={isMultipleShip}
      />
    </div>
  )
}

export default ProductItemsTable
