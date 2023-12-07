import { useCallback, useMemo, useRef } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import { makeStyles } from '@material-ui/core'

import PageContainer from 'components/PageContainer'
import { permissionGroupNames } from 'constants/permissionGroups'
import useDeterminePermissions from 'hooks/useDeterminePermissions'
import apiCacheKeys from 'constants/apiCacheKeys'
import { tableEntities } from 'constants/library'
import useNotifyAnalyzer from 'hooks/useNotifyAnalyzer'
import BaseTable from 'components/tableLibrary/BaseTable'
import { notifyLabels } from 'constants/notifyAnalyzer'
import { getDeleteConfirmationMessage } from 'utils/snackbarMessages'
import useConfirmation from 'hooks/useConfirmation'
import { getColumns, getEditors, getFilters } from './config'
import {
  useAddInvoiceMutation,
  useDeleteInvoiceMutation,
  useLazyGetInvoicesQuery,
  useUpdateInvoiceMutation
} from 'api/invoiceApi'
import queryParamsHelper from 'utils/queryParamsHelper'
import { routes, tableViews } from 'constants/routes'
import useUser from 'hooks/useUser'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'
import useFilterPreference from 'hooks/useFilterPreference'
import { filterEntityValues } from 'constants/filterPreference'
import DetailView from './DetailView'
import { BlueButton } from 'components/buttons'
import AddEditInvoice from './AddEditInvoice'
import { invoiceFilterStatusOptions } from 'constants/invoiceConstants'

const useStyles = makeStyles(() => ({
  addBtn: {
    marginRight: '17px'
  }
}))

const titleColumnDef = {
  headerName: 'Invoice Number',
  field: 'invoiceNumber'
}
const redirectToViewPage = ({ id }) =>
  routes.invoices.toView(id, tableViews.list)

const transformTitleValue = data => data.invoiceNumber

const InvoicePage = () => {
  const permission = useDeterminePermissions(permissionGroupNames.invoice)
  const tableRef = useRef()
  const { showConfirmation } = useConfirmation()
  const { role } = useUser()
  const classes = useStyles()

  const [getItems] = useLazyGetInvoicesQuery()
  const [, post] = useAddInvoiceMutation({
    fixedCacheKey: apiCacheKeys.invoice.add
  })
  const [updateItem, put] = useUpdateInvoiceMutation({
    fixedCacheKey: apiCacheKeys.invoice.update
  })
  const [deleteItem, del] = useDeleteInvoiceMutation({
    fixedCacheKey: apiCacheKeys.invoice.delete
  })

  const refreshTable = useCallback(() => {
    if (tableRef.current) {
      tableRef.current.refresh({
        page: 1
      })
    }
  }, [])

  const {
    staticFilterModel,
    setFilterModel,
    viewToolPanel,
    handleSaveFilter,
    selectedFilter,
    clearSelectedFilter
  } = useFilterPreference({
    entity: filterEntityValues.invoice
  })

  const sidebarToolPanels = useMemo(() => [viewToolPanel], [viewToolPanel])

  const columns = useMemo(() => getColumns(), [])
  const filters = useMemo(() => getFilters(role), [role])
  const editors = useMemo(() => getEditors(), [])

  useNotifyAnalyzer({
    fetcher: refreshTable,
    entityName: 'Invoice',
    watchArray: [post, put, del],
    labels: [notifyLabels.add, notifyLabels.update, notifyLabels.delete]
  })

  const fetcher = useCallback(
    async params => {
      const data = await getItems({
        status: invoiceFilterStatusOptions.map(({ value }) => value).join(','),
        ...params
      }).unwrap()
      return data
    },
    [getItems]
  )

  const handleDelete = useCallback(
    (event, { id }) => {
      showConfirmation(getDeleteConfirmationMessage('Invoice'), () =>
        deleteItem(id)
      )
    },
    [showConfirmation, deleteItem]
  )

  const actions = useMemo(
    () => [
      {
        label: 'Edit',
        to: ({ id }) => routes.invoices.toEdit(id, tableViews.list),
        render: permission.update
      },
      {
        label: 'Delete',
        clickAction: handleDelete,
        icon: getIconClassName(iconNames.delete),
        render: permission.delete
      }
    ],
    [permission, handleDelete]
  )

  const handleCellValueChanged = useCallback(
    event => {
      const { data, refresh } = event
      const { id, payment_term, status, dueDate } = data

      updateItem({
        id,
        data: queryParamsHelper({
          paymentTerm: payment_term,
          status,
          dueDate
        })
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
      pageTitle="Invoices"
      isShowSubHeaderComponent={false}
      ActionButtonsComponent={
        <>
          {permission.create && (
            <BlueButton
              className={`hvr-radial-out ${classes.addBtn}`}
              component={Link}
              to={routes.invoices.toAdd(tableViews.list)}
              iconClassName={getIconClassName(iconNames.add)}
            >
              Create Invoice
            </BlueButton>
          )}
        </>
      }
    >
      <BaseTable
        entity={tableEntities.invoice}
        columns={columns}
        fetcher={fetcher}
        rowActions={actions}
        pagination={true}
        filters={filters}
        editors={editors}
        hideEditors={!permission.update}
        ref={tableRef}
        onCellValueChanged={handleCellValueChanged}
        titleColumnDef={titleColumnDef}
        redirectToViewPage={redirectToViewPage}
        transformTitleValue={transformTitleValue}
        showProfilePicColumn
        showJdenticonIcon
        sidebarToolPanels={sidebarToolPanels}
        onFilterChanged={setFilterModel}
        filterData={staticFilterModel}
        saveFilterItem={selectedFilter}
        onSaveFilter={handleSaveFilter}
        clearSelectedFilter={clearSelectedFilter}
      />
      <Routes>
        {permission.create && (
          <Route path={routes.invoices.add} element={<AddEditInvoice />} />
        )}
        {permission.update && (
          <Route path={routes.invoices.edit} element={<AddEditInvoice />} />
        )}
        {permission.read && (
          <Route
            path={`${routes.invoices.view}/*`}
            element={
              <DetailView
                updateItem={updateItem}
                permission={permission}
                putReducer={put}
              />
            }
          />
        )}
      </Routes>
    </PageContainer>
  )
}

export default InvoicePage
