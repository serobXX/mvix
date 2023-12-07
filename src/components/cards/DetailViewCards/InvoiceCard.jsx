import React, { useCallback, useEffect, useMemo, useState } from 'react'
import moment from 'moment'

import ListBaseCard from './ListBaseCard'
import { getIconClassName } from 'utils/iconUtils'
import iconNames, { iconTypes } from 'constants/iconNames'
import { parseCurrency } from 'utils/generalUtils'
import { DATE_VIEW_FORMAT } from 'constants/dateTimeFormats'
import { BaseChip } from 'components/chips'
import { convertToPluralize } from 'utils/pluralize'
import {
  getDarkenColorFromRgb,
  getLightenColorFromRgb,
  getRandomColor
} from 'utils/color'
import { useLazyGetInvoicesQuery } from 'api/invoiceApi'

const InvoiceCard = ({ data, isServerSide = false, queryParams }) => {
  const [invoiceData, setInvoiceData] = useState([])
  const [getInvoices, { data: invoices, isFetching, meta }] =
    useLazyGetInvoicesQuery()

  const fetcher = useCallback(
    (params = {}) => {
      getInvoices({
        ...queryParams,
        ...params
      })
    },
    [getInvoices, queryParams]
  )

  useEffect(() => {
    if (isServerSide) {
      fetcher()
    }
    //eslint-disable-next-line
  }, [isServerSide])

  const handleFetchMore = useCallback(() => {
    if (!isFetching && meta.currentPage < meta.lastPage && isServerSide) {
      fetcher({
        page: meta.currentPage + 1
      })
    }
  }, [fetcher, isFetching, meta, isServerSide])

  const rowItems = useMemo(
    () => [
      {
        icon: getIconClassName(iconNames.invoice, iconTypes.duotone),
        name: 'invoiceNumber',
        tooltip: 'Invoice Number'
      },
      {
        icon: getIconClassName(iconNames.date, iconTypes.duotone),
        name: 'date',
        tooltip: 'Created Date'
      },
      {
        icon: getIconClassName(iconNames.totalSales, iconTypes.duotone),
        name: 'invoiceTotal',
        tooltip: 'Invoice Total'
      },
      {
        render: value => {
          const randomColor = getRandomColor()
          return (
            <BaseChip
              label={value}
              iconClassName={getIconClassName(iconNames.clock)}
              color={getDarkenColorFromRgb(randomColor, 0.5)}
              backgroundColor={getLightenColorFromRgb(randomColor, 0.5)}
              iconColor={getDarkenColorFromRgb(randomColor, 0.5)}
            />
          )
        },
        name: 'invoiceStatus'
      },
      {
        icon: getIconClassName(iconNames.totalSales, iconTypes.duotone),
        name: 'invoiceBalance',
        tooltip: 'Balance Due'
      },

      {
        icon: getIconClassName(iconNames.date, iconTypes.duotone),
        name: 'dueDate',
        tooltip: 'Due Date'
      }
    ],
    []
  )

  useEffect(() => {
    if (isServerSide ? data : invoices) {
      setInvoiceData(d => [
        ...(isServerSide && meta?.currentPage !== 1 ? d : []),
        ...(isServerSide ? invoices : data).map(item => ({
          invoiceNumber: item.invoiceNumber,
          invoiceTotal: parseCurrency(item.grandTotal),
          invoiceBalance: parseCurrency(item.balanceDue),
          date: moment(item.createdAt).format(DATE_VIEW_FORMAT),
          dueDate:
            item.dueDate && moment(item.dueDate).format(DATE_VIEW_FORMAT),
          invoiceStatus: item.status,
          grandTotal: item.grandTotal
        }))
      ])
    }
    //eslint-disable-next-line
  }, [data, invoices])

  const invoiceTotal = useMemo(
    () => invoiceData.reduce((a, b) => a + Number(b.grandTotal), 0).toFixed(2),
    [invoiceData]
  )

  return (
    <ListBaseCard
      title="Invoices"
      titleIcon={getIconClassName(iconNames.invoice, iconTypes.duotone)}
      rowItems={rowItems}
      data={invoiceData}
      showFooter
      footerLeftText={`${invoiceData.length} ${convertToPluralize(
        'Invoice',
        invoiceData.length
      )}`}
      footerRightText={parseCurrency(invoiceTotal)}
      emptyText="No Associated Invoice"
      isLoading={isFetching}
      onFetchMore={handleFetchMore}
    />
  )
}

InvoiceCard.defaultProps = {
  data: []
}

export default InvoiceCard
