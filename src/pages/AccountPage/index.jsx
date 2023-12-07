import { useCallback, useMemo, useRef } from 'react'
import { makeStyles } from '@material-ui/core'
import { Link, Route, Routes } from 'react-router-dom'

import PageContainer from 'components/PageContainer'
import { BlueButton } from 'components/buttons'
import {
  permissionGroupNames,
  permissionPageGroups,
  permissionTypes
} from 'constants/permissionGroups'
import { routes, tableViews } from 'constants/routes'
import useDeterminePermissions from 'hooks/useDeterminePermissions'
import apiCacheKeys from 'constants/apiCacheKeys'
import { tableEntities } from 'constants/library'
import useNotifyAnalyzer from 'hooks/useNotifyAnalyzer'
import BaseTable from 'components/tableLibrary/BaseTable'
import { notifyLabels } from 'constants/notifyAnalyzer'
import {
  getBulkDeleteConfirmationMessage,
  getDeleteConfirmationMessage,
  getRestoreConfirmationMessage
} from 'utils/snackbarMessages'
import useConfirmation from 'hooks/useConfirmation'
import { isMultipleSelected } from 'utils/libraryUtils'
import useRowSelection from 'hooks/useRowSelection'
import { convertArr, fromChipObj, tagToChipObj } from 'utils/select'
import queryParamsHelper from 'utils/queryParamsHelper'
import { useGetCustomFieldsByEntityQuery } from 'api/customFieldApi'
import { entityValues } from 'constants/customFields'
import useCustomFieldTableConfig from 'hooks/useCustomFieldTableConfig'
import { getColumns, getCommonActions } from './config'
import { tagEntityType } from 'constants/tagConstants'
import {
  useAddAccountMutation,
  useBulkDeleteAccountsMutation,
  useBulkUpdateAccountsMutation,
  useDeleteAccountMutation,
  useLazyGetAccountsQuery,
  useRestoreAccountMutation,
  useUpdateAccountMutation
} from 'api/accountApi'
import AddEditAccount from './AddEditAccount'
import customFieldNames from 'constants/customFieldNames'
import { ADMINISTRATOR } from 'constants/roleConstants'
import useUser from 'hooks/useUser'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'
import { getTitleBasedOnEntity } from 'utils/customFieldUtils'
import { parseToAbsolutePath, removeAbsolutePath } from 'utils/urlUtils'
import AddEditActivity from 'pages/ActivityPage/AddEditActivity'
import useLibraryCommonActions from 'hooks/useLibraryCommonActions'
import DetailView from './DetailView'
import useUserPermissionGroupsByType from 'hooks/useUserPermissionGroupsByType'
import AddEditOpportunity from 'pages/OpportunityPage/AddEditOpportunity'
import AddEditEstimate from 'pages/EstimatePage/AddEditEstimate'
import useFilterPreference from 'hooks/useFilterPreference'
import { filterEntityValues } from 'constants/filterPreference'
import AddEditInvoice from 'pages/InvoicePage/AddEditInvoice'

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    marginBottom: spacing(2)
  },
  addBtn: {
    marginRight: '17px'
  }
}))

const hideColumnsOnly = [customFieldNames.accountName]

const titleColumnDef = {
  headerName: 'Name',
  field: customFieldNames.accountName
}
const redirectToViewPage = ({ id }) =>
  routes.accounts.toView(id, tableViews.list)

const transformTitleValue = data =>
  getTitleBasedOnEntity(entityValues.account, data)

const AccountPage = () => {
  const classes = useStyles()
  const permission = useDeterminePermissions(permissionGroupNames.account)
  const createGroups = useUserPermissionGroupsByType(permissionTypes.create)
  const activityPermission = useDeterminePermissions(
    permissionGroupNames.activity
  )
  const tableRef = useRef()
  const { showConfirmation } = useConfirmation()
  const selectedRows = useRowSelection()
  const { role } = useUser()

  const [getItems] = useLazyGetAccountsQuery()
  const [, post] = useAddAccountMutation({
    fixedCacheKey: apiCacheKeys.account.add
  })
  const [updateItem, put] = useUpdateAccountMutation({
    fixedCacheKey: apiCacheKeys.account.update
  })
  const [deleteItem, del] = useDeleteAccountMutation({
    fixedCacheKey: apiCacheKeys.account.delete
  })
  const [bulkDeleteItems] = useBulkDeleteAccountsMutation({
    fixedCacheKey: apiCacheKeys.account.delete
  })
  const [bulkUpdateItems] = useBulkUpdateAccountsMutation({
    fixedCacheKey: apiCacheKeys.account.update
  })
  const { data: layout, isFetching } = useGetCustomFieldsByEntityQuery({
    entityType: entityValues.account
  })
  const [restoreAccount, restore] = useRestoreAccountMutation()

  const appendValueBeforeOn = useMemo(
    () => [
      {
        code: customFieldNames.firstName,
        name: 'salutation'
      }
    ],
    []
  )

  const {
    actions: extraActions,
    modalRender,
    onOpenUpdateModal
  } = useLibraryCommonActions({
    parentUrl: removeAbsolutePath(routes.accounts.list),
    entityType: entityValues.account,
    permission,
    updateItem,
    tableRef,
    bulkUpdateItems,
    layout
  })

  const {
    staticFilterModel,
    setFilterModel,
    viewToolPanel,
    handleSaveFilter,
    selectedFilter,
    clearSelectedFilter
  } = useFilterPreference({
    entity: filterEntityValues.account
  })

  const sidebarToolPanels = useMemo(() => [viewToolPanel], [viewToolPanel])
  const initialColumns = useMemo(() => getColumns(), [])

  const { columns, filters, editors } = useCustomFieldTableConfig({
    initialColumns,
    layout,
    appendValueBeforeOn,
    tagEntityType: tagEntityType.account,
    permissionGroupName: permissionPageGroups.account,
    hideColumnsOnly
  })

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
    entityName: 'Account',
    watchArray: [post, put, del, restore],
    labels: [
      notifyLabels.add,
      notifyLabels.update,
      notifyLabels.delete,
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
      showConfirmation(
        getDeleteConfirmationMessage(
          customFields[customFieldNames.accountName]
        ),
        () => deleteItem(id)
      )
    },
    [showConfirmation, deleteItem]
  )

  const handleBulkDelete = useCallback(() => {
    const rows = tableRef.current.getSelectedRows()
    showConfirmation(getBulkDeleteConfirmationMessage('Accounts'), () =>
      bulkDeleteItems({
        ids: rows.map(({ id }) => id)
      })
    )
  }, [showConfirmation, bulkDeleteItems])

  const handleRestore = useCallback(
    (_, { id, customFields }) => {
      showConfirmation(
        getRestoreConfirmationMessage(
          customFields[customFieldNames.accountName]
        ),
        () => restoreAccount(id)
      )
    },
    [restoreAccount, showConfirmation]
  )

  const actions = useMemo(
    () => [
      {
        label: 'View',
        to: ({ id }) => routes.accounts.toView(id, tableViews.list),
        render: permission.read
      },
      {
        label: 'Edit',
        to: ({ id }) => routes.accounts.toEdit(id, tableViews.list),
        render: permission.update
      },
      ...extraActions,
      {
        label: 'Create an Opportunity',
        to: data => ({
          pathname: routes.opportunities.toLibraryAdd(routes.accounts.list),
          data: {
            accountId: data.id
          }
        }),
        render: createGroups.includes(permissionGroupNames.opportunity)
      },
      {
        label: 'Create an Estimate',
        to: data => ({
          pathname: routes.estimates.toLibraryAdd(routes.accounts.list),
          data: {
            accountId: data.id
          }
        }),
        render: createGroups.includes(permissionGroupNames.estimate)
      },
      {
        label: 'Create an Invoice',
        to: data => ({
          pathname: routes.invoices.toLibraryAdd(routes.accounts.list),
          data: {
            accountId: data.id
          }
        }),
        render: createGroups.includes(permissionGroupNames.invoice)
      },
      {
        label: 'Delete',
        clickAction: handleDelete,
        icon: getIconClassName(iconNames.delete),
        render: permission.delete
      }
    ],
    [permission, handleDelete, extraActions, createGroups]
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

  const handleCellValueChanged = useCallback(
    event => {
      const { data, refresh } = event
      const { id, newCustomFields, status, salutation, tag } = data

      updateItem({
        id,
        data: queryParamsHelper({
          id,
          customFields: newCustomFields,
          salutation,
          status,
          tag: convertArr(convertArr(tag, tagToChipObj), fromChipObj)
        })
      })
        .unwrap()
        .catch(err => {
          refresh()
        })
    },
    [updateItem]
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
    [handleBulkDelete, permission, handleOpenUpdateModal]
  )

  return (
    <PageContainer
      pageTitle="Accounts"
      isShowSubHeaderComponent={false}
      ActionButtonsComponent={
        <>
          {permission.create && (
            <BlueButton
              className={`hvr-radial-out ${classes.addBtn}`}
              component={Link}
              to={routes.accounts.toAdd(tableViews.list)}
              iconClassName={getIconClassName(iconNames.add)}
            >
              Add Account
            </BlueButton>
          )}
        </>
      }
      showActions={isMultipleSelected(selectedRows)}
      actions={commonActions}
    >
      <BaseTable
        entity={tableEntities.account}
        columns={columns}
        fetcher={fetcher}
        rowActions={actions}
        disabledRowActions={disabledActions}
        selectedRows={selectedRows}
        pagination={true}
        filters={filters}
        editors={editors}
        hideEditors={!permission.update}
        ref={tableRef}
        onCellValueChanged={handleCellValueChanged}
        isLoading={isFetching}
        titleColumnDef={titleColumnDef}
        redirectToViewPage={redirectToViewPage}
        transformTitleValue={transformTitleValue}
        showProfilePicColumn
        defaultColShow={10}
        sidebarToolPanels={sidebarToolPanels}
        onFilterChanged={setFilterModel}
        filterData={staticFilterModel}
        saveFilterItem={selectedFilter}
        onSaveFilter={handleSaveFilter}
        clearSelectedFilter={clearSelectedFilter}
      />
      <Routes>
        {permission.create && (
          <Route
            path={routes.accounts.add}
            element={<AddEditAccount layout={layout} />}
          />
        )}
        {permission.update && (
          <Route
            path={routes.accounts.edit}
            element={<AddEditAccount layout={layout} />}
          />
        )}

        {permission.read && (
          <Route
            path={`${routes.accounts.view}/*`}
            element={
              <DetailView
                layout={layout}
                updateItem={updateItem}
                permission={permission}
                putReducer={put}
              />
            }
          />
        )}

        {activityPermission.update && (
          <Route
            path={routes.activity.libraryAdd}
            element={
              <AddEditActivity
                closeLink={parseToAbsolutePath(routes.accounts.list)}
                fromDetailView
                hideRelatedFields
              />
            }
          />
        )}

        {createGroups.includes(permissionGroupNames.opportunity) && (
          <Route
            path={routes.opportunities.libraryAdd}
            element={
              <AddEditOpportunity
                closeLink={parseToAbsolutePath(routes.accounts.list)}
                fromDetailView
                loadLayout
              />
            }
          />
        )}
        {createGroups.includes(permissionGroupNames.estimate) && (
          <Route
            path={routes.estimates.libraryAdd}
            element={
              <AddEditEstimate
                closeLink={parseToAbsolutePath(routes.accounts.list)}
                fromDetailView
                loadLayout
              />
            }
          />
        )}
        {createGroups.includes(permissionGroupNames.invoice) && (
          <Route
            path={routes.invoices.libraryAdd}
            element={
              <AddEditInvoice
                closeLink={parseToAbsolutePath(routes.accounts.list)}
                fromDetailView
              />
            }
          />
        )}
      </Routes>
      {modalRender}
    </PageContainer>
  )
}

export default AccountPage
