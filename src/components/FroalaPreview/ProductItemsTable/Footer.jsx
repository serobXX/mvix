import classNames from 'classnames'
import { parseCurrency } from 'utils/generalUtils'

const Footer = ({ item, isMultipleShip }) => {
  return (
    <table className="product-items-footer__container">
      <thead>
        <tr>
          <td width={'43%'}></td>
          <td width={'40%'}></td>
          <td width={'12%'}></td>
        </tr>
      </thead>
      <tfoot>
        <tr>
          <td colSpan={2}>
            <div className="footer-text">Sub Total</div>
          </td>
          <td>
            <div
              className={classNames('table-content-text', {
                'table-content-border-top': isMultipleShip
              })}
            >
              {parseCurrency((item?.subTotal || 0).toFixed(2))}
            </div>
          </td>
        </tr>
        <tr>
          <td colSpan={2}>
            <div className="footer-text">Discount (%)</div>
          </td>
          <td>
            <div className="table-content-text">
              {`${(item?.discount || 0).toFixed(1)}%`}
            </div>
          </td>
        </tr>
        {!isMultipleShip && (
          <tr>
            <td colSpan={2}>
              <div className="footer-text">Sales Tax (%)</div>
            </td>
            <td>
              <div className="table-content-text">
                {parseCurrency((item?.tax || 0).toFixed(2))}
              </div>
            </td>
          </tr>
        )}
        <tr>
          <td colSpan={2}>
            <div className="footer-text">Grand Total</div>
          </td>
          <td>
            <div className="table-content-text">
              {parseCurrency((item?.grandTotal || 0).toFixed(2))}
            </div>
          </td>
        </tr>
      </tfoot>
    </table>
  )
}

export default Footer
