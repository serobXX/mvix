import { useCallback, useMemo, useRef } from 'react'
import { makeStyles } from '@material-ui/core'
import { Link, Route, Routes } from 'react-router-dom'

import PageContainer from 'components/PageContainer'
import { BlueButton } from 'components/buttons'
import {
  permissionGroupNames,
  permissionPageGroups
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
import {
  useAddEstimateMutation,
  useBulkDeleteEstimatesMutation,
  useBulkUpdateEstimatesMutation,
  useCreateInvoiceMutation,
  useDeleteEstimateMutation,
  useLazyGetEstimatesQuery,
  useUpdateEstimateMutation
} from 'api/estimateApi'
import AddEditEstimate from './AddEditEstimate'
import { estimateStatusValues } from 'constants/estimate'
import useUser from 'hooks/useUser'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'
import customFieldNames from 'constants/customFieldNames'
import { getTitleBasedOnEntity } from 'utils/customFieldUtils'
import DetailView from './DetailView'
import AddEditActivity from 'pages/ActivityPage/AddEditActivity'
import useLibraryCommonActions from 'hooks/useLibraryCommonActions'
import { parseToAbsolutePath, removeAbsolutePath } from 'utils/urlUtils'
import useFilterPreference from 'hooks/useFilterPreference'
import { filterEntityValues } from 'constants/filterPreference'

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    marginBottom: spacing(2)
  },
  addBtn: {
    marginRight: '17px'
  }
}))

const hideColumnsOnly = [customFieldNames.estimateName]

const titleColumnDef = {
  headerName: 'Name',
  field: customFieldNames.estimateName
}
const redirectToViewPage = ({ id }) =>
  routes.estimates.toView(id, tableViews.list)

const transformTitleValue = data =>
  getTitleBasedOnEntity(entityValues.estimate, data)

const EstimatePage = () => {
  const classes = useStyles()
  const permission = useDeterminePermissions(permissionGroupNames.estimate)
  const activityPermission = useDeterminePermissions(
    permissionGroupNames.activity
  )
  const tableRef = useRef()
  const { showConfirmation } = useConfirmation()
  const selectedRows = useRowSelection()
  const { role } = useUser()

  const [getItems] = useLazyGetEstimatesQuery()
  const [, post] = useAddEstimateMutation({
    fixedCacheKey: apiCacheKeys.estimate.add
  })
  const [updateItem, put] = useUpdateEstimateMutation({
    fixedCacheKey: apiCacheKeys.estimate.update
  })
  const [deleteItem, del] = useDeleteEstimateMutation({
    fixedCacheKey: apiCacheKeys.estimate.delete
  })
  const [bulkDeleteItems] = useBulkDeleteEstimatesMutation({
    fixedCacheKey: apiCacheKeys.estimate.delete
  })
  const [bulkUpdateItems] = useBulkUpdateEstimatesMutation({
    fixedCacheKey: apiCacheKeys.estimate.update
  })
  const { data: layout, isFetching } = useGetCustomFieldsByEntityQuery({
    entityType: entityValues.estimate
  })
  const [createInvoice, invoiceReducer] = useCreateInvoiceMutation({
    fixedCacheKey: apiCacheKeys.invoice.add
  })

  const {
    actions: extraActions,
    modalRender,
    onOpenUpdateModal
  } = useLibraryCommonActions({
    parentUrl: removeAbsolutePath(routes.estimates.list),
    entityType: entityValues.estimate,
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
    entity: filterEntityValues.estimate
  })

  const sidebarToolPanels = useMemo(() => [viewToolPanel], [viewToolPanel])

  const initialColumns = useMemo(() => getColumns(), [])
  const initialEditors = useMemo(() => getEditors(), [])
  const initialFilters = useMemo(() => getFilters(role), [role])

  const { columns, filters, editors } = useCustomFieldTableConfig({
    initialColumns,
    initialFilters,
    initialEditors,
    layout,
    tagEntityType: tagEntityType.estimate,
    permissionGroupName: permissionPageGroups.estimate,
    hideStatusField: true,
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
    entityName: 'Estimate',
    watchArray: [post, put, del],
    labels: [notifyLabels.add, notifyLabels.update, notifyLabels.delete]
  })

  useNotifyAnalyzer({
    fetcher: refreshTable,
    onSuccess: selectedRows.clearSelectedRows,
    entityName: 'Invoice',
    watchArray: [invoiceReducer],
    labels: [notifyLabels.add]
  })

  const fetcher = useCallback(
    async params => {
      const data = await getItems(params).unwrap()
      return data
    },
    [getItems]
  )

  const handleDelete = useCallback(
    (event, { id, estimateName = '' }) => {
      showConfirmation(getDeleteConfirmationMessage(estimateName), () =>
        deleteItem(id)
      )
    },
    [showConfirmation, deleteItem]
  )

  const handleBulkDelete = useCallback(() => {
    const rows = tableRef.current.getSelectedRows()
    showConfirmation(getBulkDeleteConfirmationMessage('Estimates'), () =>
      bulkDeleteItems({
        ids: rows.map(({ id }) => id)
      })
    )
  }, [showConfirmation, bulkDeleteItems])

  const handleAcceptEstimate = useCallback(
    (_, { id }) => {
      createInvoice({ id }).unwrap()
    },
    [createInvoice]
  )

  const actions = useCallback(
    ({ status }) => [
      {
        label: 'View',
        to: ({ id }) => routes.estimates.toView(id, tableViews.list),
        render: permission.read
      },
      {
        label: 'Edit',
        to: ({ id }) => routes.estimates.toEdit(id, tableViews.list),
        render: permission.update
      },
      ...extraActions,
      {
        label: 'Create an Invoice',
        clickAction: handleAcceptEstimate,
        render: permission.update && status !== estimateStatusValues.accepted
      },
      {
        label: 'Delete',
        clickAction: handleDelete,
        icon: getIconClassName(iconNames.delete),
        render: permission.delete
      }
    ],
    [permission, handleDelete, handleAcceptEstimate, extraActions]
  )

  const handleCellValueChanged = useCallback(
    event => {
      const { data, refresh } = event
      const {
        id,
        estimateName,
        newCustomFields,
        status,
        estimateValidityDuration,
        tag,
        accountId,
        contactId,
        opportunityId
      } = data

      updateItem({
        id,
        data: queryParamsHelper({
          estimateName,
          customFields: newCustomFields,
          estimateValidityDuration,
          status,
          tag: convertArr(convertArr(tag, tagToChipObj), fromChipObj),
          accountId,
          contactId,
          opportunityId
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
      pageTitle="Estimates"
      isShowSubHeaderComponent={false}
      ActionButtonsComponent={
        <>
          {permission.create && (
            <BlueButton
              className={`hvr-radial-out ${classes.addBtn}`}
              component={Link}
              to={routes.estimates.toAdd(tableViews.list)}
              iconClassName={getIconClassName(iconNames.add)}
            >
              Add Estimate
            </BlueButton>
          )}
        </>
      }
      showActions={isMultipleSelected(selectedRows)}
      actions={commonActions}
    >
      <BaseTable
        entity={tableEntities.estimate}
        columns={columns}
        fetcher={fetcher}
        rowActions={actions}
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
            path={routes.estimates.add}
            element={<AddEditEstimate layout={layout} />}
          />
        )}
        {permission.update && (
          <Route
            path={routes.estimates.edit}
            element={<AddEditEstimate layout={layout} />}
          />
        )}

        {permission.read && (
          <Route
            path={`${routes.estimates.view}/*`}
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
                closeLink={parseToAbsolutePath(routes.estimates.list)}
                fromDetailView
                hideRelatedFields
              />
            }
          />
        )}
      </Routes>
      {modalRender}
    </PageContainer>
  )
}

export default EstimatePage
