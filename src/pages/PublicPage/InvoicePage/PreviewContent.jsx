import { useMemo, useState } from 'react'
import { Button, makeStyles } from '@material-ui/core'
import classNames from 'classnames'
import jsPDF from 'jspdf'
import moment from 'moment'

import { getCustomFieldValueByCode } from 'utils/customFieldUtils'
import { convertToProductItems } from 'utils/froalaPlaceholder'
import customFieldNames from 'constants/customFieldNames'
import { parseCurrency } from 'utils/generalUtils'
import { CircleIconButton } from 'components/buttons'
import FroalaPreview from 'components/FroalaPreview'
import { froalaEntityNames } from 'constants/froalaConstants'
import {
  InvoiceAcceptModal,
  RequestChangesModal
} from 'components/modals/PublicModals'
import { convertToFormData } from 'utils/apiUtils'
import queryParamsHelper from 'utils/queryParamsHelper'
import useNotifyAnalyzer from 'hooks/useNotifyAnalyzer'
import {
  useAcceptPublicEntityMutation,
  useRequestChangesPublicEntityMutation
} from 'api/publicApi'
import {
  BACKEND_DATE_FORMAT,
  DATE_VIEW_FORMAT
} from 'constants/dateTimeFormats'
import useSnackbar from 'hooks/useSnackbar'
import { _get } from 'utils/lodash'
import { getIconClassName } from 'utils/iconUtils'
import iconNames, { iconTypes } from 'constants/iconNames'
import { paymentTermValues } from 'constants/invoiceConstants'

const useStyles = makeStyles(() => ({
  previewRoot: {
    flexGrow: 1,
    position: 'relative'
  },
  header: {
    position: 'sticky',
    top: 65,
    left: 0,
    width: '100%',
    background: '#fff',
    '@media screen and (max-width: 1200px)': {
      top: 50
    }
  },
  notificationHeaderContainer: {
    width: '100%',
    maxWidth: 950,
    margin: '0px auto',
    color: '#502801',
    fontSize: '0.875em'
  },
  notificationHeaderRoot: {
    background: '#ffd8b2',
    padding: '0.5em 10px'
  },
  header2Root: {
    background: '#f9f9f9',
    padding: '0.7em 10px'
  },
  header2Container: {
    width: '100%',
    maxWidth: 950,
    margin: '0px auto',
    '& h3': {
      fontWeight: 400,
      margin: 0,
      fontSize: '1.1em'
    }
  },
  header2Bal: {
    fontSize: '0.9em',
    margin: 0,
    color: '#df7508',
    marginBottom: 10
  },
  header2ContentRoot: {
    display: 'flex',
    flexWrap: 'nowrap',
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',

    '@media screen and (max-width: 600px)': {
      flexDirection: 'column',
      gap: 10
    }
  },
  header2LeftContent: {
    display: 'flex',
    gap: 30
  },
  header2RightContent: {
    display: 'flex',
    gap: 20,
    justifyContent: 'flex-end'
  },
  leftContentTitle: {
    fontSize: '0.8em',
    color: '#5D678A',
    margin: 0,
    lineHeight: '1.7em'
  },
  leftContentValue: {
    fontSize: '0.9em',
    margin: 0,
    lineHeight: '1em'
  },
  rightContentBtn: {
    border: '1px solid #eee',
    fontSize: '1em',
    color: '#646464'
  },
  ribbonRoot: {
    width: 96,
    height: 94,
    overflow: 'hidden',
    position: 'absolute',
    top: '-4px',
    left: '-5px'
  },
  ribbonMain: {
    textAlign: 'center',
    color: '#fff',
    top: '24px',
    left: '-31px',
    width: '135px',
    padding: '3px',
    position: 'relative',
    transform: 'rotate(-45deg)',
    background: '#54a355',
    borderColor: '#356635',

    '&:before, &:after': {
      content: '""',
      borderTop: '5px solid transparent',
      borderLeft: '5px solid',
      borderLeftColor: 'inherit',
      borderRight: '5px solid transparent',
      borderBottom: '5px solid',
      borderBottomColor: 'inherit',
      position: 'absolute',
      top: '21px',
      transform: 'rotate(-45deg)'
    },
    '&:before': {
      left: 0,
      borderLeft: '2px solid transparent',
      color: '#2e8fda'
    },
    '&:after': {
      right: '-9px',
      left: '129px',
      borderBottom: '3px solid transparent',
      color: '#2e8fda'
    }
  },
  ribbonOutstanding: {
    background: '#5675cf',
    borderColor: '#354266'
  },
  ribbonPast: {
    background: '#cf5656',
    borderColor: '#663535'
  },
  ribbonPaid: {
    background: '#54a355',
    borderColor: '#356635'
  },
  notificationPaynow: {
    color: '#3214f7',
    textDecoration: 'underline',
    paddingLeft: 5,
    cursor: 'pointer'
  },
  primaryActionBtn: {
    background: '#1b75dc',
    color: '#fff',
    textTransform: 'capitalize',
    fontSize: '0.875em',
    '&:hover': {
      background: '#1760b3'
    }
  },
  actionBtn: {
    textTransform: 'capitalize'
  }
}))

const PreviewContent = ({ invoice, token, fetcher, onPayClick }) => {
  const classes = useStyles()
  const { showSnackbar } = useSnackbar()
  const [changesModalOpen, setChangesModalOpen] = useState(false)
  const [isAcceptModalOpen, setAcceptModalOpen] = useState(false)

  const [acceptInvoice, acceptReducer] = useAcceptPublicEntityMutation()
  const [requestChangesInvoice, requestChangedReducer] =
    useRequestChangesPublicEntityMutation()

  const handleSuccess = reducer => {
    if (reducer.endpointName === 'acceptPublicEntity') {
      setAcceptModalOpen(false)
      showSnackbar('Invoice Accepted', 'success')
    } else {
      setChangesModalOpen(false)
      showSnackbar('Requested Changes Submitted', 'success')
    }
  }

  const handleError = reducer => {
    if (reducer.endpointName === 'acceptPublicEntity') {
      showSnackbar('Invoice not Accepted', 'error')
    } else {
      showSnackbar('Requested Changes not Submitted', 'error')
    }
  }

  useNotifyAnalyzer({
    fetcher,
    hideNotification: true,
    watchArray: [acceptReducer, requestChangedReducer],
    onSuccess: handleSuccess,
    onError: handleError
  })

  const placeholderData = useMemo(() => {
    const { account, clientAdmin, opportunity, itemGroups, ..._invoice } =
      invoice || {}
    return {
      account,
      contact: clientAdmin,
      opportunity,
      invoice: _invoice,
      productItems: convertToProductItems({ itemGroups, ..._invoice }),
      isMultipleShip: getCustomFieldValueByCode(
        _invoice,
        customFieldNames.shipToMultiple
      )
    }
  }, [invoice])

  const handleDownloadPdf = () => {
    const doc = new jsPDF('p', 'px', [950, 1342])

    doc.html(document.querySelector('.fr-view'), {
      callback(doc) {
        doc.save(invoice?.invoiceNumber)
      },
      x: 30,
      y: 10
    })
  }

  const handleAcceptInvoice = values => {
    acceptInvoice(
      convertToFormData(
        queryParamsHelper({
          entity: 'Invoice',
          token,
          ...values
        })
      )
    )
  }

  const handleRequestChanges = values => {
    requestChangesInvoice({
      entity: 'Invoice',
      token,
      ...values
    })
  }

  return (
    <>
      <div className={classNames(classes.header, 'no-print')}>
        {invoice?.balanceDue > 0 &&
          invoice?.payment_term === paymentTermValues.prepay && (
            <div className={classes.notificationHeaderRoot}>
              <div className={classes.notificationHeaderContainer}>
                <span>
                  Total Payable Amount via Online Payments:{' '}
                  {parseCurrency(Number(invoice?.grandTotal).toFixed(2))}
                </span>
                <span
                  className={classes.notificationPaynow}
                  onClick={onPayClick}
                >
                  Pay Now
                </span>
              </div>
            </div>
          )}
        <div className={classes.header2Root}>
          <div className={classes.header2Container}>
            <h3>
              {parseCurrency((Number(invoice?.balanceDue) || 0).toFixed(2))}
            </h3>
            <p className={classes.header2Bal}>Balance Due</p>
            <div className={classes.header2ContentRoot}>
              <div className={classes.header2LeftContent}>
                <div>
                  <p className={classes.leftContentTitle}>Invoice #:</p>
                  <p className={classes.leftContentValue}>
                    {invoice?.invoiceNumber || ''}
                  </p>
                </div>
                <div>
                  <p className={classes.leftContentTitle}>Due Date:</p>
                  <p className={classes.leftContentValue}>
                    {invoice?.dueDate
                      ? moment(invoice?.dueDate, BACKEND_DATE_FORMAT).format(
                          DATE_VIEW_FORMAT
                        )
                      : '----'}
                  </p>
                </div>
              </div>
              <div className={classes.header2RightContent}>
                <CircleIconButton
                  className={classes.rightContentBtn}
                  onClick={() => window.print()}
                >
                  <i
                    className={getIconClassName(
                      iconNames.print,
                      iconTypes.solid
                    )}
                  />
                </CircleIconButton>
                <CircleIconButton
                  className={classes.rightContentBtn}
                  onClick={handleDownloadPdf}
                >
                  <i className={getIconClassName(iconNames.download)} />
                </CircleIconButton>
                {invoice?.balanceDue > 0 &&
                  invoice?.payment_term === paymentTermValues.prepay && (
                    <Button
                      variant="contained"
                      className={classes.primaryActionBtn}
                      disableRipple
                      disableElevation
                      onClick={onPayClick}
                    >
                      Pay Now
                    </Button>
                  )}
                {invoice?.payment_term !== paymentTermValues.prepay && (
                  <>
                    <Button
                      variant="contained"
                      className={classes.actionBtn}
                      disableRipple
                      disableElevation
                      onClick={() => setChangesModalOpen(true)}
                    >
                      Request Changes
                    </Button>
                    <Button
                      variant="contained"
                      className={classes.primaryActionBtn}
                      disableRipple
                      disableElevation
                      onClick={() => setAcceptModalOpen(true)}
                    >
                      Accept
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={classes.previewRoot}>
        <FroalaPreview
          value={_get(invoice, 'defaultTemplate.template', '')}
          previewPlaceholder
          placeholderData={placeholderData}
          entity={froalaEntityNames.invoice}
          isContainerWrap
          renderContent={
            <div className={classNames(classes.ribbonRoot, 'no-print')}>
              <div
                className={classNames(classes.ribbonMain, {
                  [classes.ribbonPaid]: invoice?.balanceDue <= 0,
                  [classes.ribbonPast]: moment(
                    invoice?.dueDate,
                    BACKEND_DATE_FORMAT
                  ).isBefore(moment()),
                  [classes.ribbonOutstanding]: moment(
                    invoice?.dueDate,
                    BACKEND_DATE_FORMAT
                  ).isAfter(moment())
                })}
              >
                {invoice?.balanceDue <= 0
                  ? 'Paid'
                  : invoice?.dueDate &&
                    moment(invoice?.dueDate, BACKEND_DATE_FORMAT).isBefore(
                      moment()
                    )
                  ? 'Past Due'
                  : 'Outstanding'}
              </div>
            </div>
          }
        />
      </div>
      {isAcceptModalOpen && (
        <InvoiceAcceptModal
          open={isAcceptModalOpen}
          onClose={() => setAcceptModalOpen(false)}
          onSave={handleAcceptInvoice}
        />
      )}
      {changesModalOpen && (
        <RequestChangesModal
          open={changesModalOpen}
          onClose={() => setChangesModalOpen(false)}
          onSave={handleRequestChanges}
        />
      )}
    </>
  )
}

export default PreviewContent
