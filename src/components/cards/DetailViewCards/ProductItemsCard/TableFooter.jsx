import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'
import { FormControlNumericInput } from 'components/formControls'
import { Text } from 'components/typography'
import iconNames, { iconTypes } from 'constants/iconNames'
import { parseCurrency } from 'utils/generalUtils'
import { getIconClassName } from 'utils/iconUtils'

const useStyles = makeStyles(({ palette, type, colors, typography }) => ({
  tableRoot: {
    borderCollapse: 'collapse',

    '& tfoot': {
      bottom: 0,
      background: palette[type].tableLibrary.body.row.background
    },
    '& td': {
      padding: '0px 10px',
      borderRight: `1px solid ${colors.highlight}`,

      '& $tableContentRoot': {
        borderBottom: `1px solid ${colors.highlight}`
      }
    },
    '& tr:first-child th:last-child, & tr td:last-child': {
      borderRight: 'none'
    },
    '& tfoot tr:first-child td:last-child': {
      '& $tableContentRoot': {
        borderTop: `1px solid ${colors.highlight}`
      }
    },
    '& tfoot tr:last-child td:first-child': {
      borderRight: 'none'
    },
    '& tbody': {
      maxHeight: 400
    }
  },
  tableContentRoot: {
    padding: '0px 0px'
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
  },
  tableFooterText: {
    ...typography.darkAccent[type],
    padding: '0px 0px',
    textAlign: 'right'
  },
  tableContentText: {
    ...typography.lightText[type],
    textAlign: 'center',
    lineHeight: '35px',
    height: 35
  },
  formControlRoot: {
    background: 'transparent'
  },
  addBtnsRoot: {
    display: 'flex',
    gap: 16
  },
  discountRoot: {
    display: 'flex',
    justifyContent: 'center'
  }
}))

const TableFooter = ({
  values,
  isEditAll,
  leftFooterComponent,
  handleAddRow,
  handleAddLocation,
  isMultipleShip = false,
  handleChange,
  onEnableEdit
}) => {
  const classes = useStyles()

  return (
    <table className={classes.tableRoot}>
      <thead>
        <tr>
          <td width={'43%'}></td>
          <td width={'40%'}></td>
          <td width={'12%'}></td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colSpan={2} className={classes.addBtnRow}>
            {isEditAll && (
              <div className={classes.addBtnsRoot}>
                {values.items?.length <= 1 && (
                  <div className={classes.addBtnRoot} onClick={handleAddRow}>
                    <i
                      className={getIconClassName(
                        iconNames.add,
                        iconTypes.solid
                      )}
                    />
                    <Text>Add Item</Text>
                  </div>
                )}
                {isMultipleShip && (
                  <div
                    className={classes.addBtnRoot}
                    onClick={handleAddLocation}
                  >
                    <i
                      className={getIconClassName(
                        iconNames.add,
                        iconTypes.solid
                      )}
                    />
                    <Text>Ship Location</Text>
                  </div>
                )}
              </div>
            )}
          </td>
          <td></td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={2}>
            <Text rootClassName={classes.tableFooterText}>Sub Total</Text>
          </td>
          <td>
            <div className={classes.tableContentRoot}>
              <Text rootClassName={classes.tableContentText}>
                {parseCurrency(values.subTotal.toFixed(2))}{' '}
              </Text>
            </div>
          </td>
        </tr>
        {!isMultipleShip && (
          <tr>
            <td colSpan={2}>
              <Text rootClassName={classes.tableFooterText}>
                {' '}
                Sales Tax (%)
              </Text>
            </td>
            <td>
              <div className={classes.tableContentRoot}>
                <Text rootClassName={classes.tableContentText}>
                  {`${values.tax.toFixed(2)}%`}
                </Text>
              </div>
            </td>
          </tr>
        )}
        <tr>
          <td colSpan={2}>
            <Text rootClassName={classes.tableFooterText}> Discount (%)</Text>
          </td>
          <td>
            <div
              className={classNames(
                classes.tableContentRoot,
                classes.discountRoot
              )}
            >
              {isEditAll ? (
                <FormControlNumericInput
                  name="discount"
                  onChange={handleChange}
                  value={values.discount || 0}
                  precision={1}
                  marginBottom={false}
                  min={0}
                  max={100}
                  formControlRootClass={classes.formControlRoot}
                  onlyInput
                  endAdornment={<Text>%</Text>}
                />
              ) : (
                <Text rootClassName={classes.tableContentText}>
                  {`${values.discount.toFixed(1)}%`}
                </Text>
              )}
            </div>
          </td>
        </tr>
        <tr>
          <td>
            {leftFooterComponent &&
              leftFooterComponent({ isEdit: isEditAll, onEnableEdit })}
          </td>
          <td>
            <Text rootClassName={classes.tableFooterText}>Grand Total</Text>
          </td>
          <td>
            <div className={classes.tableContentRoot}>
              <Text rootClassName={classes.tableContentText}>
                {parseCurrency(values.grandTotal.toFixed(2))}
              </Text>
            </div>
          </td>
        </tr>
      </tfoot>
    </table>
  )
}

export default TableFooter
