import { useCallback, useMemo, useRef, useState } from 'react'
import { Route, Routes } from 'react-router-dom'

import BaseTable from 'components/tableLibrary/BaseTable'
import { tableEntities } from 'constants/library'
import { routes, tableViews } from 'constants/routes'
import {
  useBulkUpdateInvoicesMutation,
  useDeleteInvoiceMutation,
  useLazyGetInvoicesQuery,
  useUpdateInvoiceMutation
} from 'api/invoiceApi'
import { permissionGroupNames } from 'constants/permissionGroups'
import useDeterminePermissions from 'hooks/useDeterminePermissions'
import { invoiceStatusValues } from 'constants/invoiceConstants'
import useNotifyAnalyzer from 'hooks/useNotifyAnalyzer'
import { _get } from 'utils/lodash'
import useRowSelection from 'hooks/useRowSelection'
import { isMultipleSelected } from 'utils/libraryUtils'
import { InvoiceAcceptModal } from 'components/modals/PublicModals'
import { getDeleteConfirmationMessage } from 'utils/snackbarMessages'
import useConfirmation from 'hooks/useConfirmation'
import { notifyLabels } from 'constants/notifyAnalyzer'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'
import useSnackbar from 'hooks/useSnackbar'
import exceptionNames from 'constants/beExceptionNames'
import { convertToFormData } from 'utils/apiUtils'
import queryParamsHelper from 'utils/queryParamsHelper'
import PageContainer from 'components/PageContainer'
import { getInvoiceColumns, getInvoiceFilters } from 'utils/invoiceUtils'
import useFilterPreference from 'hooks/useFilterPreference'
import { filterEntityValues } from 'constants/filterPreference'
import DetailView from 'pages/InvoicePage/DetailView'
import { parseToAbsolutePath } from 'utils/urlUtils'

const titleColumnDef = {
  headerName: 'Invoice Number',
  field: 'invoiceNumber'
}
const redirectToViewPage = ({ id }) => routes.order.toView(id, tableViews.list)

const transformTitleValue = data => data.invoiceNumber

const OrdersList = () => {
  const [isApprovedModalOpen, setApprovedModalOpen] = useState(false)
  const [approveItemId, setApproveItemId] = useState()
  const permission = useDeterminePermissions(permissionGroupNames.invoice)
  const tableRef = useRef()
  const selectedRows = useRowSelection()
  const { showConfirmation } = useConfirmation()
  const { showSnackbar } = useSnackbar()

  const [getItems] = useLazyGetInvoicesQuery()
  const [updateItem, put] = useUpdateInvoiceMutation({
    fixedCacheKey: 'invoiceApproved'
  })
  const [deleteItem, del] = useDeleteInvoiceMutation({
    fixedCacheKey: 'invoiceDelete'
  })
  const [bulkUpdate] = useBulkUpdateInvoicesMutation({
    fixedCacheKey: 'invoiceApproved'
  })

  const {
    staticFilterModel,
    setFilterModel,
    viewToolPanel,
    handleSaveFilter,
    selectedFilter,
    clearSelectedFilter
  } = useFilterPreference({
    entity: filterEntityValues.order
  })

  const sidebarToolPanels = useMemo(() => [viewToolPanel], [viewToolPanel])

  const refreshTable = useCallback(() => {
    if (tableRef.current) {
      tableRef.current.refresh({
        page: 1
      })
    }
  }, [])

  const columns = useMemo(() => getInvoiceColumns(), [])
  const filters = useMemo(
    () =>
      getInvoiceFilters({
        hideStatus: true,
        invoiceParams: {
          status: [
            invoiceStatusValues.termsAccepted,
            invoiceStatusValues.paymentCompleted
          ].join(',')
        }
      }),
    []
  )

  const handleError = ({ error }) => {
    if (
      error.code === 422 &&
      error.message.includes('Order cannot be Approved')
    ) {
      setApprovedModalOpen(true)
    } else if (
      error.exception === exceptionNames.modelBulkUpdateErrorException
    ) {
      showSnackbar('Some of the Invoice not Approved for Fullfilment', 'error')
      refreshTable()
      selectedRows.clearSelectedRows()
    }
  }

  const handleSuccess = () => {
    selectedRows.clearSelectedRows()
    setApproveItemId()
    setApprovedModalOpen(false)
  }

  useNotifyAnalyzer({
    fetcher: refreshTable,
    entityName: 'Invoice',
    watchArray: [put],
    successMessage: 'Invoice Approved for Fullfilment',
    errorMessage: _get(put, 'error.message'),
    hideErrorNotification:
      _get(put, 'error.exception') ===
      exceptionNames.modelBulkUpdateErrorException,
    onError: handleError,
    onSuccess: handleSuccess
  })

  useNotifyAnalyzer({
    fetcher: refreshTable,
    entityName: 'Invoice',
    watchArray: [del],
    labels: [notifyLabels.delete],
    onSuccess: selectedRows.clearSelectedRows
  })

  const fetcher = useCallback(
    async params => {
      const data = await getItems({
        ...params,
        status: [
          invoiceStatusValues.termsAccepted,
          invoiceStatusValues.paymentCompleted
        ].join(',')
      }).unwrap()
      return data
    },
    [getItems]
  )

  const handleApproved = useCallback(
    (_, { id }) => {
      updateItem({
        id,
        data: {
          status: invoiceStatusValues.approvedForFullfilment
        }
      })
      setApproveItemId(id)
    },
    [updateItem]
  )

  const handleBulkApproved = useCallback(() => {
    const rows = tableRef.current.getSelectedRows()
    if (!!rows?.length) {
      bulkUpdate({
        ids: rows.map(({ id }) => id),
        data: {
          status: invoiceStatusValues.approvedForFullfilment
        }
      })
    }
  }, [bulkUpdate])

  const handleDelete = useCallback(
    (event, { id }) => {
      showConfirmation(getDeleteConfirmationMessage('Invoice'), () =>
        deleteItem(id)
      )
    },
    [showConfirmation, deleteItem]
  )

  const handleApproveForModal = useCallback(
    ({ poNumber, poFile }) => {
      const data = convertToFormData(
        queryParamsHelper({
          clientPO: poNumber,
          poFile,
          status: invoiceStatusValues.approvedForFullfilment
        })
      )

      updateItem({
        id: approveItemId,
        data
      })
    },
    [updateItem, approveItemId]
  )

  const actions = useMemo(
    () => [
      {
        label: 'Approve for Fullfilment',
        clickAction: handleApproved,
        render: permission.update
      },
      {
        label: 'Delete',
        clickAction: handleDelete,
        icon: getIconClassName(iconNames.delete),
        render: permission.delete
      }
    ],
    [permission, handleApproved, handleDelete]
  )

  const commonActions = useMemo(
    () => [
      {
        label: 'Approve for Fullfilment',
        clickAction: handleBulkApproved,
        render: permission.update
      }
    ],
    [handleBulkApproved, permission]
  )

  const handleCloseModal = () => {
    setApprovedModalOpen(false)
    setApproveItemId()
  }

  return (
    <PageContainer
      pageTitle="Ready for Approvals"
      isShowSubHeaderComponent={false}
      actions={commonActions}
      showActions={isMultipleSelected(selectedRows)}
    >
      <BaseTable
        entity={tableEntities.invoice}
        columns={columns}
        fetcher={fetcher}
        rowActions={actions}
        pagination={true}
        filters={filters}
        ref={tableRef}
        titleColumnDef={titleColumnDef}
        redirectToViewPage={redirectToViewPage}
        transformTitleValue={transformTitleValue}
        showProfilePicColumn
        showJdenticonIcon
        selectedRows={selectedRows}
        sidebarToolPanels={sidebarToolPanels}
        onFilterChanged={setFilterModel}
        filterData={staticFilterModel}
        saveFilterItem={selectedFilter}
        onSaveFilter={handleSaveFilter}
        clearSelectedFilter={clearSelectedFilter}
      />
      <Routes>
        {permission.read && (
          <Route
            path={`${routes.order.view}/*`}
            element={
              <DetailView
                updateItem={updateItem}
                permission={permission}
                putReducer={put}
                closeLink={parseToAbsolutePath(routes.order.list)}
              />
            }
          />
        )}
      </Routes>
      {isApprovedModalOpen && (
        <InvoiceAcceptModal
          title={'Approve Invoice'}
          open={isApprovedModalOpen}
          onClose={handleCloseModal}
          onSave={handleApproveForModal}
          buttonPrimaryText="Approve"
        />
      )}
    </PageContainer>
  )
}

export default OrdersList
