import { useCallback, useMemo, useRef } from 'react'
import { makeStyles } from '@material-ui/core'
import { Link, Route, Routes } from 'react-router-dom'

import PageContainer from 'components/PageContainer'
import { BlueButton } from 'components/buttons'
import BaseTable from 'components/tableLibrary/BaseTable'
import { tableEntities } from 'constants/library'
import { permissionGroupNames } from 'constants/permissionGroups'
import { routes, tableViews } from 'constants/routes'
import useDeterminePermissions from 'hooks/useDeterminePermissions'
import { getColumns, getEditors, getFilters } from './config'
import apiCacheKeys from 'constants/apiCacheKeys'
import useNotifyAnalyzer from 'hooks/useNotifyAnalyzer'
import { notifyLabels } from 'constants/notifyAnalyzer'
import {
  useAddPaymentMutation,
  useLazyGetPaymentsQuery,
  useUpdatePaymentMutation
} from 'api/paymentApi'
import AddEditPayment from './AddEditPayment'
import { getIconClassName } from 'utils/iconUtils'
import iconNames, { iconTypes } from 'constants/iconNames'
import useFilterPreference from 'hooks/useFilterPreference'
import { filterEntityValues } from 'constants/filterPreference'
import useRowSelection from 'hooks/useRowSelection'
import {
  creditCardTypeIcons,
  paymentMethodIcons,
  paymentMethodValues,
  paymentProcessorIcons
} from 'constants/payment'

const useStyles = makeStyles(() => ({
  userAddBtn: {
    marginRight: '17px'
  }
}))

const titleColumnDef = {
  headerName: 'Name',
  field: 'paymentName'
}
const redirectToViewPage = ({ id }) =>
  routes.payments.toView(id, tableViews.list)

const getProfileIcon = ({
  paymentMethod,
  creditCardType,
  paymentProcessor
}) => {
  if (
    paymentMethod === paymentMethodValues.creditCard &&
    creditCardTypeIcons[creditCardType]
  ) {
    return getIconClassName(
      creditCardTypeIcons[creditCardType],
      iconTypes.brands
    )
  } else if (
    paymentMethod === paymentMethodValues.other &&
    paymentProcessorIcons[paymentProcessor]
  ) {
    return getIconClassName(
      paymentProcessorIcons[paymentProcessor],
      iconTypes.brands
    )
  }
  return getIconClassName(paymentMethodIcons[paymentMethod], iconTypes.solid)
}

const PaymentPage = () => {
  const classes = useStyles()
  const tableRef = useRef()
  const selectedRows = useRowSelection()

  const permission = useDeterminePermissions(permissionGroupNames.payment)

  const [getItems] = useLazyGetPaymentsQuery()
  const [, post] = useAddPaymentMutation({
    fixedCacheKey: apiCacheKeys.payment.add
  })
  const [updateItem, put] = useUpdatePaymentMutation({
    fixedCacheKey: apiCacheKeys.payment.update
  })

  const actions = useMemo(
    () => [
      {
        label: 'Edit',
        to: ({ id }) => routes.payments.toEdit(id, tableViews.list),
        render: permission.update
      }
    ],
    [permission]
  )

  const {
    staticFilterModel,
    setFilterModel,
    viewToolPanel,
    handleSaveFilter,
    selectedFilter,
    clearSelectedFilter
  } = useFilterPreference({
    entity: filterEntityValues.payment
  })

  const sidebarToolPanels = useMemo(() => [viewToolPanel], [viewToolPanel])

  const columns = useMemo(getColumns, [])

  const filters = useMemo(getFilters, [])

  const editors = useMemo(getEditors, [])

  const fetcher = useCallback(
    async params => {
      const data = await getItems(params).unwrap()
      return data
    },
    [getItems]
  )

  const refreshTable = useCallback(() => {
    if (tableRef.current) {
      tableRef.current.refresh({
        page: 1
      })
    }
  }, [])

  useNotifyAnalyzer({
    fetcher: refreshTable,
    entityName: 'Payment',
    watchArray: [post, put],
    labels: [notifyLabels.add, notifyLabels.update]
  })

  const handleCellValueChanged = useCallback(
    event => {
      const { data, refresh } = event
      const {
        id,
        account,
        accountId,
        invoice,
        invoiceId,
        paymentMethod,
        paymentDate,
        receivedBy
      } = data

      updateItem({
        id,
        accountId: accountId || account?.id,
        invoiceId: invoiceId || invoice?.id,
        paymentMethod,
        paymentDate,
        receivedBy: typeof receivedBy === 'object' ? receivedBy?.id : receivedBy
      })
        .unwrap()
        .catch(err => {
          refresh()
        })
    },
    [updateItem]
  )

  return (
    <PageContainer
      pageTitle="Payment"
      isShowSubHeaderComponent={false}
      ActionButtonsComponent={
        <>
          {permission.create && (
            <BlueButton
              className={`hvr-radial-out ${classes.userAddBtn}`}
              component={Link}
              to={routes.payments.toAdd(tableViews.list)}
              iconClassName={getIconClassName(iconNames.add)}
            >
              Add Payment
            </BlueButton>
          )}
        </>
      }
    >
      <BaseTable
        entity={tableEntities.payment}
        columns={columns}
        fetcher={fetcher}
        rowActions={actions}
        pagination={true}
        filters={filters}
        hideEditors={!permission.update}
        editors={editors}
        selectedRows={selectedRows}
        ref={tableRef}
        onCellValueChanged={handleCellValueChanged}
        sidebarToolPanels={sidebarToolPanels}
        onFilterChanged={setFilterModel}
        filterData={staticFilterModel}
        saveFilterItem={selectedFilter}
        onSaveFilter={handleSaveFilter}
        clearSelectedFilter={clearSelectedFilter}
        titleColumnDef={titleColumnDef}
        redirectToViewPage={redirectToViewPage}
        showProfilePicColumn
        profileIcon={getProfileIcon}
      />
      <Routes>
        {permission.create && (
          <Route path={routes.payments.add} element={<AddEditPayment />} />
        )}
        {permission.update && (
          <Route path={routes.payments.edit} element={<AddEditPayment />} />
        )}
      </Routes>
    </PageContainer>
  )
}

export default PaymentPage
