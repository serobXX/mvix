import { useCallback, useMemo, useRef, useState } from 'react'
import { Route, Routes } from 'react-router-dom'

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
import {
  useAddInvoiceMutation,
  useDeleteInvoiceMutation,
  useLazyGetInvoicesQuery,
  useUpdateInvoiceMutation
} from 'api/invoiceApi'
import { routes, tableViews } from 'constants/routes'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'
import useFilterPreference from 'hooks/useFilterPreference'
import { filterEntityValues } from 'constants/filterPreference'
import { invoiceStatusValues } from 'constants/invoiceConstants'
import { getInvoiceColumns, getInvoiceFilters } from 'utils/invoiceUtils'
import DetailView from 'pages/InvoicePage/DetailView'
import { parseToAbsolutePath } from 'utils/urlUtils'
import { ReadyToShipModal } from 'components/modals'

const titleColumnDef = {
  headerName: 'Invoice Number',
  field: 'invoiceNumber'
}
const redirectToViewPage = ({ id }) =>
  routes.shipping.toView(id, tableViews.list)

const transformTitleValue = data => data.invoiceNumber

const ShippingPage = () => {
  const permission = useDeterminePermissions(permissionGroupNames.shipping)
  const tableRef = useRef()
  const [isShipModalOpen, setShipModalOpen] = useState(false)
  const [shipModalData, setShipModalData] = useState()
  const { showConfirmation } = useConfirmation()

  const [getItems] = useLazyGetInvoicesQuery()
  const [updateItem, post] = useAddInvoiceMutation({
    fixedCacheKey: apiCacheKeys.invoice.add
  })
  const [, put] = useUpdateInvoiceMutation({
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
    entity: filterEntityValues.shipping
  })

  const sidebarToolPanels = useMemo(() => [viewToolPanel], [viewToolPanel])

  const columns = useMemo(() => getInvoiceColumns(), [])
  const filters = useMemo(
    () =>
      getInvoiceFilters({
        hideStatus: true,
        invoiceParams: {
          status: invoiceStatusValues.approvedForFullfilment
        }
      }),
    []
  )

  useNotifyAnalyzer({
    fetcher: refreshTable,
    entityName: 'Invoice',
    watchArray: [post, put, del],
    labels: [notifyLabels.add, notifyLabels.update, notifyLabels.delete]
  })

  const fetcher = useCallback(
    async params => {
      const data = await getItems({
        ...params,
        status: invoiceStatusValues.approvedForFullfilment
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
        label: 'Ready to Ship',
        clickAction: (_, data) => {
          setShipModalData(data)
          setShipModalOpen(true)
        },
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

  const handleCloseModal = () => {
    setShipModalData()
    setShipModalOpen(false)
  }

  const handleSuccesShip = () => {
    handleCloseModal()
    refreshTable()
  }

  return (
    <PageContainer pageTitle="Shipping" isShowSubHeaderComponent={false}>
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
            path={`${routes.shipping.view}/*`}
            element={
              <DetailView
                updateItem={updateItem}
                permission={permission}
                putReducer={put}
                closeLink={parseToAbsolutePath(routes.shipping.list)}
              />
            }
          />
        )}
      </Routes>
      {isShipModalOpen && (
        <ReadyToShipModal
          open={isShipModalOpen}
          onClose={handleCloseModal}
          data={shipModalData}
          onSuccess={handleSuccesShip}
        />
      )}
    </PageContainer>
  )
}

export default ShippingPage
