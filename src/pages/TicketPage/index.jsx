import { useCallback, useMemo, useRef } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import { makeStyles } from '@material-ui/core'
import PageContainer from 'components/PageContainer'
import { BlueButton } from 'components/buttons'
import { permissionGroupNames } from 'constants/permissionGroups'
import { routes, tableViews } from 'constants/routes'
import useDeterminePermissions from 'hooks/useDeterminePermissions'
import apiCacheKeys from 'constants/apiCacheKeys'
import { tableEntities } from 'constants/library'
import useNotifyAnalyzer from 'hooks/useNotifyAnalyzer'
import BaseTable from 'components/tableLibrary/BaseTable'
import { notifyLabels } from 'constants/notifyAnalyzer'
import { isMultipleSelected } from 'utils/libraryUtils'
import useRowSelection from 'hooks/useRowSelection'
import { getColumns, getCommonActions, getFilters } from './config'
import iconNames from 'constants/iconNames'
import { getIconClassName } from 'utils/iconUtils'
import useLibraryCommonActions from 'hooks/useLibraryCommonActions'
import { removeAbsolutePath } from 'utils/urlUtils'
import AddEditTicket from './AddEditTicket'
import {
  useAddTicketMutation,
  useBulkDeleteTicketsMutation,
  useBulkUpdateTicketsMutation,
  useDeleteTicketMutation,
  useLazyGetTicketsQuery,
  useRestoreTicketMutation,
  useUpdateTicketMutation
} from 'api/ticketApi'
import {
  getBulkDeleteConfirmationMessage,
  getDeleteConfirmationMessage,
  getRestoreConfirmationMessage
} from 'utils/snackbarMessages'
import useConfirmation from 'hooks/useConfirmation'
import useFilterPreference from 'hooks/useFilterPreference'
import { filterEntityValues } from 'constants/filterPreference'
import { entityValues } from 'constants/customFields'
import { ADMINISTRATOR } from 'constants/roleConstants'
import useUser from 'hooks/useUser'

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    marginBottom: spacing(2)
  },
  addBtn: {
    marginRight: '17px'
  }
}))

const TicketPage = () => {
  const classes = useStyles()
  const permission = useDeterminePermissions(permissionGroupNames.ticket)

  const tableRef = useRef()
  const { showConfirmation } = useConfirmation()
  const selectedRows = useRowSelection()
  const { role } = useUser()

  const [getItems] = useLazyGetTicketsQuery()
  const [, post] = useAddTicketMutation({
    fixedCacheKey: apiCacheKeys.ticket.add
  })
  const [updateItem, put] = useUpdateTicketMutation({
    fixedCacheKey: apiCacheKeys.ticket.update
  })
  const [deleteItem, del] = useDeleteTicketMutation({
    fixedCacheKey: apiCacheKeys.ticket.delete
  })
  const [bulkDeleteItems] = useBulkDeleteTicketsMutation({
    fixedCacheKey: apiCacheKeys.ticket.delete
  })
  const [bulkUpdateItems] = useBulkUpdateTicketsMutation({
    fixedCacheKey: apiCacheKeys.ticket.update
  })
  const [restoreTicket, restore] = useRestoreTicketMutation()

  const {
    actions: extraActions,
    modalRender,
    onOpenUpdateModal
  } = useLibraryCommonActions({
    hideTask: true,
    parentUrl: removeAbsolutePath(routes.tickets.open),
    entityType: entityValues.ticket,
    permission,
    bulkUpdateItems,
    updateItem,
    tableRef
  })
  const { viewToolPanel } = useFilterPreference({
    entity: filterEntityValues.ticket
  })

  const sidebarToolPanels = useMemo(() => [viewToolPanel], [viewToolPanel])

  const columns = useMemo(getColumns, [])

  const filters = useMemo(getFilters, [])

  const refreshTable = useCallback(() => {
    if (tableRef.current) {
      tableRef.current.refresh({
        page: 1
      })
    }
  }, [])

  useNotifyAnalyzer({
    fetcher: refreshTable,
    onSuccess: selectedRows.clearSelectedRows,
    entityName: 'Ticket',
    watchArray: [post, del, put, restore],
    labels: [
      notifyLabels.add,
      notifyLabels.delete,
      notifyLabels.update,
      notifyLabels.restore
    ]
  })

  const fetcher = useCallback(
    async params => {
      const data = await getItems(params).unwrap()
      return data
    },
    [getItems]
  )

  const handleDelete = useCallback(
    (event, { id, customFields = {} }) => {
      showConfirmation(getDeleteConfirmationMessage('Ticket'), () =>
        deleteItem(id)
      )
    },
    [showConfirmation, deleteItem]
  )

  const handleBulkDelete = useCallback(() => {
    const rows = tableRef.current.getSelectedRows()
    showConfirmation(getBulkDeleteConfirmationMessage('Tickets'), () =>
      bulkDeleteItems({
        ids: rows.map(({ id }) => id)
      })
    )
  }, [showConfirmation, bulkDeleteItems])

  const handleRestore = useCallback(
    (_, { id }) => {
      showConfirmation(getRestoreConfirmationMessage(), () => restoreTicket(id))
    },
    [restoreTicket, showConfirmation]
  )

  const actions = useMemo(
    () => [
      {
        label: 'Edit',
        to: ({ id }) => routes.tickets.toEdit(routes.tickets.open, id),
        render: permission.update
      },
      ...extraActions,
      {
        label: 'Delete',
        clickAction: handleDelete,
        icon: getIconClassName(iconNames.delete),
        render: permission.delete
      }
    ],
    [permission, extraActions, handleDelete]
  )

  const disabledActions = useMemo(
    () => [
      {
        label: 'Restore',
        clickAction: handleRestore,
        render: role?.name === ADMINISTRATOR
      }
    ],
    [role, handleRestore]
  )

  const handleOpenUpdateModal = useCallback(
    values => () => {
      const rows = tableRef.current.getSelectedRows()
      onOpenUpdateModal({
        ...values,
        ids: rows.map(({ id }) => id)
      })
    },
    [onOpenUpdateModal]
  )

  const commonActions = useMemo(
    () => getCommonActions(handleBulkDelete, handleOpenUpdateModal, permission),
    [handleBulkDelete, handleOpenUpdateModal, permission]
  )

  return (
    <PageContainer
      pageTitle="Tickets"
      isShowSubHeaderComponent={false}
      ActionButtonsComponent={
        <>
          {permission.create && (
            <BlueButton
              className={`hvr-radial-out ${classes.addBtn}`}
              component={Link}
              to={routes.tickets.toAdd(tableViews.list)}
              iconClassName={getIconClassName(iconNames.add)}
            >
              Add Ticket
            </BlueButton>
          )}
        </>
      }
      showActions={isMultipleSelected(selectedRows)}
      actions={commonActions}
    >
      <BaseTable
        entity={tableEntities.ticket}
        columns={columns}
        fetcher={fetcher}
        rowActions={actions}
        selectedRows={selectedRows}
        pagination={true}
        filters={filters}
        hideEditors={!permission.update}
        ref={tableRef}
        disabledRowActions={disabledActions}
        sidebarToolPanels={sidebarToolPanels}
      />
      <Routes>
        {permission.create && (
          <Route path={routes.tickets.add} element={<AddEditTicket />} />
        )}
        {permission.update && (
          <Route path={routes.tickets.edit} element={<AddEditTicket />} />
        )}
      </Routes>
      {modalRender}
    </PageContainer>
  )
}

export default TicketPage
