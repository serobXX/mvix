import { useCallback, useMemo, useRef } from 'react'
import { makeStyles } from '@material-ui/core'
import { Link, Route, Routes } from 'react-router-dom'

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
import { getDeleteConfirmationMessage } from 'utils/snackbarMessages'
import useConfirmation from 'hooks/useConfirmation'
import useRowSelection from 'hooks/useRowSelection'
import { getEditors, getFilters, getColumns } from './config'
import iconNames from 'constants/iconNames'
import { getIconClassName } from 'utils/iconUtils'
import useFilterPreference from 'hooks/useFilterPreference'
import { filterEntityValues } from 'constants/filterPreference'
import {
  useAddReminderMutation,
  useDeleteReminderMutation,
  useLazyGetRemindersQuery,
  useUpdateReminderMutation
} from 'api/reminderApi'
import AddEditReminder from './AddEditReminder'
import { relatedEntityIcons } from 'constants/reminderConstants'

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    marginBottom: spacing(2)
  },
  addBtn: {
    marginRight: '17px'
  }
}))

const titleColumnDef = {
  headerName: 'Name',
  field: 'name',
  width: 300
}

const redirectToViewPage = ({ id }) =>
  routes.reminder.toEdit(id, tableViews.list)

const transformTitleValue = data => data.name

const getProfileIcon = ({ relatedEntity }) => {
  return getIconClassName(relatedEntityIcons[relatedEntity])
}

const ReminderPage = () => {
  const classes = useStyles()
  const permission = useDeterminePermissions(permissionGroupNames.reminder)
  const tableRef = useRef()
  const { showConfirmation } = useConfirmation()
  const selectedRows = useRowSelection()

  const [getItems] = useLazyGetRemindersQuery()
  const [, post] = useAddReminderMutation({
    fixedCacheKey: apiCacheKeys.reminder.add
  })
  const [updateItem, put] = useUpdateReminderMutation({
    fixedCacheKey: apiCacheKeys.reminder.update
  })
  const [deleteItem, del] = useDeleteReminderMutation({
    fixedCacheKey: apiCacheKeys.reminder.delete
  })

  const {
    staticFilterModel,
    setFilterModel,
    viewToolPanel,
    handleSaveFilter,
    selectedFilter,
    clearSelectedFilter
  } = useFilterPreference({
    entity: filterEntityValues.reminder
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
    entityName: 'Reminder',
    watchArray: [post, put, del],
    labels: [notifyLabels.add, notifyLabels.update, notifyLabels.delete]
  })

  const fetcher = useCallback(
    async params => {
      const data = await getItems(params).unwrap()
      return data
    },
    [getItems]
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
        to: ({ id }) => routes.reminder.toEdit(id, tableViews.list),
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

  const filters = useMemo(() => getFilters(), [])

  const editors = useMemo(() => getEditors(), [])

  const handleCellValueChanged = useCallback(
    event => {
      const { data, refresh } = event
      updateItem({
        id: data.id,
        data: {
          name: data.name,
          relatedEntity: data.relatedEntity,
          remindEntity: data.remindEntity,
          sender: data.sender,
          subject: data.subject,
          status: data.status,
          remindDays: data.remindDays,
          remindType: data.remindType
        }
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
      pageTitle="Reminders"
      isShowSubHeaderComponent={false}
      ActionButtonsComponent={
        <>
          {permission.create && (
            <BlueButton
              className={`hvr-radial-out ${classes.addBtn}`}
              component={Link}
              to={routes.reminder.toAdd(tableViews.list)}
              iconClassName={getIconClassName(iconNames.add)}
            >
              Add Reminder
            </BlueButton>
          )}
        </>
      }
    >
      <BaseTable
        entity={tableEntities.reminder}
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
        sidebarToolPanels={sidebarToolPanels}
        onFilterChanged={setFilterModel}
        filterData={staticFilterModel}
        saveFilterItem={selectedFilter}
        onSaveFilter={handleSaveFilter}
        clearSelectedFilter={clearSelectedFilter}
        redirectToViewPage={redirectToViewPage}
        showProfilePicColumn
        transformTitleValue={transformTitleValue}
        titleColumnDef={titleColumnDef}
        defaultColShow={9}
        profileIcon={getProfileIcon}
      />
      <Routes>
        {permission.create && (
          <Route path={routes.reminder.add} element={<AddEditReminder />} />
        )}
        {permission.update && (
          <Route path={routes.reminder.edit} element={<AddEditReminder />} />
        )}
      </Routes>
    </PageContainer>
  )
}

export default ReminderPage
