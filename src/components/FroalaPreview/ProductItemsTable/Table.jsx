import classNames from 'classnames'

import { tableColumnsWidth } from 'utils/productItemUtils'
import './_productItemsTable.scss'
import { parseCurrency } from 'utils/generalUtils'

const Table = ({ items, index: parentIndex, isMultipleShip = true }) => {
  return (
    <div className={'product-items-table__root'}>
      <table
        className={classNames('product-items-table__table', {
          'table-multi-ship': isMultipleShip
        })}
      >
        <thead>
          <tr>
            <th width={`${tableColumnsWidth.productCode}%`}>
              <div className="table-header-text">Product SKU</div>
            </th>
            <th
              width={`${
                isMultipleShip
                  ? tableColumnsWidth.productNameMulti
                  : tableColumnsWidth.productName
              }%`}
            >
              <div className="table-header-text">Product Name</div>
            </th>
            <th width={`${tableColumnsWidth.price}%`}>
              <div className="table-header-text">List Price</div>
            </th>
            <th width={`${tableColumnsWidth.qty}%`}>
              <div className="table-header-text">Qty</div>
            </th>
            <th width={`${tableColumnsWidth.subTotal}%`}>
              <div className="table-header-text">Sub Total</div>
            </th>
            <th width={`${tableColumnsWidth.disc}%`}>
              <div className="table-header-text">Disc ($)</div>
            </th>
            {isMultipleShip && (
              <th width={`${tableColumnsWidth.tax}%`}>
                <div className="table-header-text">Tax</div>
              </th>
            )}
            <th width={`${tableColumnsWidth.total}%`}>
              <div className="table-header-text">Total</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {items &&
            items.map(
              (
                {
                  productCode,
                  productName,
                  productPrice,
                  discount,
                  tax,
                  subTotal,
                  total,
                  quantity
                },
                index
              ) => (
                <tr key={`item-list-${parentIndex}-${index}`}>
                  <td width={`${tableColumnsWidth.productCode}%`}>
                    <div className="table-content-text">{productCode}</div>
                  </td>
                  <td
                    width={`${
                      isMultipleShip
                        ? tableColumnsWidth.productNameMulti
                        : tableColumnsWidth.productName
                    }%`}
                  >
                    <div className="table-content-text">{productName}</div>
                  </td>
                  <td width={`${tableColumnsWidth.price}%`}>
                    <div className="table-content-text">
                      {parseCurrency(productPrice.toFixed(2))}
                    </div>
                  </td>
                  <td width={`${tableColumnsWidth.qty}%`}>
                    <div className="table-content-text">{quantity}</div>
                  </td>
                  <td width={`${tableColumnsWidth.subTotal}%`}>
                    <div className="table-content-text">
                      {parseCurrency(subTotal.toFixed(2))}
                    </div>
                  </td>
                  <td width={`${tableColumnsWidth.disc}%`}>
                    <div className="table-content-text">
                      {parseCurrency((discount || 0).toFixed(1))}
                    </div>
                  </td>
                  {isMultipleShip && (
                    <td width={`${tableColumnsWidth.tax}%`}>
                      <div className="table-content-text">
                        {`${(tax || 0).toFixed(2)}%`}
                      </div>
                    </td>
                  )}
                  <td width={`${tableColumnsWidth.total}%`}>
                    <div className="table-content-text">
                      {parseCurrency(total.toFixed(2))}
                    </div>
                  </td>
                </tr>
              )
            )}
        </tbody>
      </table>
    </div>
  )
}

export default Table
