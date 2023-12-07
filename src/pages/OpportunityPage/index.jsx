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
  getDeleteConfirmationMessage
} from 'utils/snackbarMessages'
import useConfirmation from 'hooks/useConfirmation'
import { isMultipleSelected } from 'utils/libraryUtils'
import useRowSelection from 'hooks/useRowSelection'
import { convertArr, fromChipObj, tagToChipObj } from 'utils/select'
import queryParamsHelper from 'utils/queryParamsHelper'
import { useGetCustomFieldsByEntityQuery } from 'api/customFieldApi'
import { entityValues } from 'constants/customFields'
import useCustomFieldTableConfig from 'hooks/useCustomFieldTableConfig'
import { getColumns, getCommonActions, getEditors, getFilters } from './config'
import { tagEntityType } from 'constants/tagConstants'
import customFieldNames from 'constants/customFieldNames'
import {
  useAddOpportunityMutation,
  useBulkDeleteOpportunitiesMutation,
  useBulkUpdateOpportunitiesMutation,
  useDeleteOpportunityMutation,
  useLazyGetOpportunitiesQuery,
  useUpdateOpportunityMutation
} from 'api/opportunityApi'
import AddEditOpportunity from './AddEditOpportunity'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'
import DetailView from './DetailView'
import {
  getCustomFieldValueByCode,
  getTitleBasedOnEntity
} from 'utils/customFieldUtils'
import useLibraryCommonActions from 'hooks/useLibraryCommonActions'
import { parseToAbsolutePath, removeAbsolutePath } from 'utils/urlUtils'
import AddEditActivity from 'pages/ActivityPage/AddEditActivity'
import AddEditEstimate from 'pages/EstimatePage/AddEditEstimate'
import useUserPermissionGroupsByType from 'hooks/useUserPermissionGroupsByType'
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

const hideColumnsOnly = [customFieldNames.opportunityName]

const titleColumnDef = {
  headerName: 'Name',
  field: customFieldNames.opportunityName
}
const redirectToViewPage = ({ id }) =>
  routes.opportunities.toView(id, tableViews.list)

const transformTitleValue = data =>
  getTitleBasedOnEntity(entityValues.opportunity, data)

const OpportunityPage = () => {
  const classes = useStyles()
  const permission = useDeterminePermissions(permissionGroupNames.opportunity)
  const activityPermission = useDeterminePermissions(
    permissionGroupNames.activity
  )
  const createGroups = useUserPermissionGroupsByType(permissionTypes.create)
  const tableRef = useRef()
  const { showConfirmation } = useConfirmation()
  const selectedRows = useRowSelection()

  const [getItems] = useLazyGetOpportunitiesQuery()
  const [, post] = useAddOpportunityMutation({
    fixedCacheKey: apiCacheKeys.opportunity.add
  })
  const [updateItem, put] = useUpdateOpportunityMutation({
    fixedCacheKey: apiCacheKeys.opportunity.update
  })
  const [deleteItem, del] = useDeleteOpportunityMutation({
    fixedCacheKey: apiCacheKeys.opportunity.delete
  })
  const [bulkDeleteItems] = useBulkDeleteOpportunitiesMutation({
    fixedCacheKey: apiCacheKeys.opportunity.delete
  })
  const [bulkUpdateItems] = useBulkUpdateOpportunitiesMutation({
    fixedCacheKey: apiCacheKeys.opportunity.update
  })
  const { data: layout, isFetching } = useGetCustomFieldsByEntityQuery({
    entityType: entityValues.opportunity
  })

  const {
    actions: extraActions,
    modalRender,
    onOpenUpdateModal
  } = useLibraryCommonActions({
    parentUrl: removeAbsolutePath(routes.opportunities.list),
    entityType: entityValues.opportunity,
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
    entity: filterEntityValues.opportunity
  })

  const sidebarToolPanels = useMemo(() => [viewToolPanel], [viewToolPanel])

  const initialColumns = useMemo(() => getColumns(), [])
  const initialFilters = useMemo(() => getFilters(), [])
  const initialEditors = useMemo(() => getEditors(), [])

  const { columns, filters, editors } = useCustomFieldTableConfig({
    initialColumns,
    initialFilters,
    initialEditors,
    layout,
    hideColumnsOnly,
    tagEntityType: tagEntityType.opportunity,
    permissionGroupName: permissionPageGroups.opportunity
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
    entityName: 'Opportunity',
    watchArray: [post, put, del],
    labels: [notifyLabels.add, notifyLabels.update, notifyLabels.delete],
    successMessage: put?.data?.successMessage
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
        getDeleteConfirmationMessage(customFields[customFieldNames.firstName]),
        () => deleteItem(id)
      )
    },
    [showConfirmation, deleteItem]
  )

  const handleBulkDelete = useCallback(() => {
    const rows = tableRef.current.getSelectedRows()
    showConfirmation(getBulkDeleteConfirmationMessage('Opportunities'), () =>
      bulkDeleteItems({
        ids: rows.map(({ id }) => id)
      })
    )
  }, [showConfirmation, bulkDeleteItems])

  const actions = useMemo(
    () => [
      {
        label: 'View',
        to: ({ id }) => routes.opportunities.toView(id, tableViews.list),
        render: permission.read
      },
      {
        label: 'Edit',
        to: ({ id }) => routes.opportunities.toEdit(id, tableViews.list),
        render: permission.update
      },
      ...extraActions,
      {
        label: 'Create an Estimate',
        to: data => ({
          pathname: routes.estimates.toLibraryAdd(routes.opportunities.list),
          data: {
            opportunityId: data.id,
            accountId: data.account?.id,
            contactId: getCustomFieldValueByCode(
              data,
              customFieldNames.contactName
            )?.id
          }
        }),
        render: createGroups.includes(permissionGroupNames.estimate)
      },
      {
        label: 'Create an Invoice',
        to: data => ({
          pathname: routes.invoices.toLibraryAdd(routes.opportunities.list),
          data: {
            opportunityId: data.id,
            accountId: data.account?.id,
            contactId: getCustomFieldValueByCode(
              data,
              customFieldNames.contactName
            )?.id
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

  const handleCellValueChanged = useCallback(
    event => {
      const { data, refresh } = event
      const { id, newCustomFields, status, stageId, accountId, tag } = data

      updateItem({
        id,
        data: queryParamsHelper({
          customFields: newCustomFields,
          status,
          tag: convertArr(convertArr(tag, tagToChipObj), fromChipObj),
          stageId,
          accountId
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
      pageTitle="Opportunities"
      isShowSubHeaderComponent={false}
      ActionButtonsComponent={
        <>
          {permission.create && (
            <BlueButton
              className={`hvr-radial-out ${classes.addBtn}`}
              component={Link}
              to={routes.opportunities.toAdd(tableViews.list)}
              iconClassName={getIconClassName(iconNames.add)}
            >
              Add Opportunity
            </BlueButton>
          )}
        </>
      }
      showActions={isMultipleSelected(selectedRows)}
      actions={commonActions}
    >
      <BaseTable
        entity={tableEntities.opportunity}
        columns={columns}
        fetcher={fetcher}
        rowActions={actions}
        selectedRows={selectedRows}
        pagination={true}
        filters={filters}
        editors={permission.update && editors}
        hideEditors={!permission.update}
        ref={tableRef}
        onCellValueChanged={handleCellValueChanged}
        isLoading={isFetching}
        titleColumnDef={titleColumnDef}
        redirectToViewPage={redirectToViewPage}
        transformTitleValue={transformTitleValue}
        showProfilePicColumn
        showJdenticonIcon
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
            path={routes.opportunities.add}
            element={<AddEditOpportunity layout={layout} />}
          />
        )}
        {permission.update && (
          <Route
            path={routes.opportunities.edit}
            element={<AddEditOpportunity layout={layout} />}
          />
        )}
        {permission.read && (
          <Route
            path={`${routes.opportunities.view}/*`}
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
                closeLink={parseToAbsolutePath(routes.opportunities.list)}
                fromDetailView
                hideRelatedFields
              />
            }
          />
        )}
        {createGroups.includes(permissionGroupNames.estimate) && (
          <Route
            path={routes.estimates.libraryAdd}
            element={
              <AddEditEstimate
                closeLink={parseToAbsolutePath(routes.opportunities.list)}
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
                closeLink={parseToAbsolutePath(routes.opportunities.list)}
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

export default OpportunityPage
