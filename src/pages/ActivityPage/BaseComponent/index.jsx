import { useCallback, useMemo, useRef } from 'react'
import { makeStyles } from '@material-ui/core'
import { Link, Route, Routes } from 'react-router-dom'

import PageContainer from 'components/PageContainer'
import { BlueButton } from 'components/buttons'
import { permissionGroupNames } from 'constants/permissionGroups'
import { routes, tableViews } from 'constants/routes'
import useDeterminePermissions from 'hooks/useDeterminePermissions'
import AddEditActivity from '../AddEditActivity'
import {
  useAddActivityMutation,
  useBulkDeleteActivitiesMutation,
  useDeleteActivityMutation,
  useLazyGetActivitiesQuery,
  useUpdateActivityMutation
} from 'api/activityApi'
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
import {
  getEditors,
  getFilters,
  getColumns,
  parseActivityPayloadForNewData
} from './config'
import iconNames from 'constants/iconNames'
import { getIconClassName } from 'utils/iconUtils'
import { parseToAbsolutePath } from 'utils/urlUtils'
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

const titleColumnDef = {
  headerName: 'Subject',
  field: 'subject',
  width: 180
}

const BaseComponent = ({
  title = 'Activities',
  queryParams,
  hideAddButton = false,
  hideAddRoute = false,
  rootRoute,
  hideStatusOptions
}) => {
  const classes = useStyles()
  const activityPermission = useDeterminePermissions(
    permissionGroupNames.activity
  )
  const tableRef = useRef()
  const { showConfirmation } = useConfirmation()
  const selectedRows = useRowSelection()

  const [getItems] = useLazyGetActivitiesQuery()
  const [, post] = useAddActivityMutation({
    fixedCacheKey: apiCacheKeys.activity.add
  })
  const [updateItem, put] = useUpdateActivityMutation({
    fixedCacheKey: apiCacheKeys.activity.update
  })
  const [deleteItem, del] = useDeleteActivityMutation({
    fixedCacheKey: apiCacheKeys.activity.delete
  })
  const [bulkDeleteItems] = useBulkDeleteActivitiesMutation({
    fixedCacheKey: apiCacheKeys.activity.delete
  })

  const {
    staticFilterModel,
    setFilterModel,
    viewToolPanel,
    handleSaveFilter,
    selectedFilter,
    clearSelectedFilter
  } = useFilterPreference({
    entity: filterEntityValues.activity
  })

  const sidebarToolPanels = useMemo(() => [viewToolPanel], [viewToolPanel])

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
    entityName: 'Activity',
    watchArray: [post, put, del],
    labels: [notifyLabels.add, notifyLabels.update, notifyLabels.delete]
  })

  const fetcher = useCallback(
    async params => {
      const data = await getItems({
        ...params,
        ...queryParams
      }).unwrap()
      return data
    },
    [getItems, queryParams]
  )

  const columns = useMemo(() => getColumns(), [])

  const handleDelete = useCallback(
    (event, { id, name }) => {
      showConfirmation(getDeleteConfirmationMessage(name), () => deleteItem(id))
    },
    [showConfirmation, deleteItem]
  )

  const actions = useMemo(
    () => [
      {
        label: 'Edit',
        to: ({ id }) => routes.activity.toEdit(rootRoute, id),
        render: activityPermission.update
      },
      {
        label: 'Delete',
        clickAction: handleDelete,
        icon: getIconClassName(iconNames.delete),
        render: activityPermission.delete
      }
    ],
    [activityPermission, handleDelete, rootRoute]
  )

  const handleBulkDelete = useCallback(() => {
    showConfirmation(getBulkDeleteConfirmationMessage('Activties'), () => {
      const rows = tableRef.current.getSelectedRows()
      if (rows.length) {
        bulkDeleteItems(rows.map(({ id }) => id))
      }
    })
  }, [bulkDeleteItems, showConfirmation])

  const commonActions = useMemo(
    () => [
      {
        label: 'Delete Activties',
        icon: getIconClassName(iconNames.delete),
        clickAction: handleBulkDelete,
        render: activityPermission.delete
      }
    ],
    [activityPermission.delete, handleBulkDelete]
  )

  const filters = useMemo(
    () => getFilters(hideStatusOptions),
    [hideStatusOptions]
  )

  const editors = useMemo(() => getEditors(), [])

  const handleCellValueChanged = useCallback(
    event => {
      const { data, refresh } = event
      updateItem(
        parseActivityPayloadForNewData(data, {
          relatedTo: data.changedRelatedTo || data.relatedTo?.id
        })
      )
        .unwrap()
        .catch(err => {
          refresh()
        })
    },
    [updateItem]
  )

  return (
    <PageContainer
      pageTitle={title}
      isShowSubHeaderComponent={false}
      ActionButtonsComponent={
        <>
          {activityPermission.create && !hideAddButton && (
            <BlueButton
              className={`hvr-radial-out ${classes.addBtn}`}
              component={Link}
              to={routes.activity.toAdd(tableViews.list)}
              iconClassName={getIconClassName(iconNames.add)}
            >
              Add Activity
            </BlueButton>
          )}
        </>
      }
      showActions={isMultipleSelected(selectedRows)}
      actions={commonActions}
    >
      <BaseTable
        entity={tableEntities.activity}
        columns={columns}
        fetcher={fetcher}
        rowActions={actions}
        selectedRows={selectedRows}
        pagination={true}
        filters={filters}
        editors={editors}
        hideEditors={!activityPermission.update}
        ref={tableRef}
        onCellValueChanged={handleCellValueChanged}
        titleColumnDef={titleColumnDef}
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
        {activityPermission.create && !hideAddRoute && (
          <Route
            path={routes.activity.add}
            element={
              <AddEditActivity
                closeLink={rootRoute && parseToAbsolutePath(rootRoute)}
              />
            }
          />
        )}
        {activityPermission.update && (
          <Route
            path={routes.activity.edit}
            element={
              <AddEditActivity
                closeLink={rootRoute && parseToAbsolutePath(rootRoute)}
              />
            }
          />
        )}
      </Routes>
    </PageContainer>
  )
}

export default BaseComponent
