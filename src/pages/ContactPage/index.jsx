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
import { getColumns, getCommonActions, getEditors, getFilters } from './config'
import { tagEntityType } from 'constants/tagConstants'
import {
  useAddContactMutation,
  useBulkDeleteContactsMutation,
  useBulkUpdateContactsMutation,
  useDeleteContactMutation,
  useLazyGetContactsQuery,
  useRestoreContactMutation,
  useUpdateContactMutation
} from 'api/contactApi'
import AddEditContact from './AddEditContact'
import customFieldNames from 'constants/customFieldNames'
import useUser from 'hooks/useUser'
import { ADMINISTRATOR } from 'constants/roleConstants'
import iconNames from 'constants/iconNames'
import { getIconClassName } from 'utils/iconUtils'
import { getTitleBasedOnEntity } from 'utils/customFieldUtils'
import DetailView from './DetailView'
import useLibraryCommonActions from 'hooks/useLibraryCommonActions'
import { parseToAbsolutePath, removeAbsolutePath } from 'utils/urlUtils'
import AddEditActivity from 'pages/ActivityPage/AddEditActivity'
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

const sortMapping = {
  name: customFieldNames.firstName
}

const hideColumnsWithFilter = [
  customFieldNames.firstName,
  customFieldNames.lastName
]

const titleColumnDef = {
  headerName: 'Name',
  field: 'name',
  width: 240
}
const redirectToViewPage = ({ id }) =>
  routes.contacts.toView(id, tableViews.list)

const transformTitleValue = data =>
  getTitleBasedOnEntity(entityValues.contact, data)

const ContactPage = () => {
  const classes = useStyles()
  const permission = useDeterminePermissions(permissionGroupNames.contact)
  const activityPermission = useDeterminePermissions(
    permissionGroupNames.activity
  )
  const tableRef = useRef()
  const { showConfirmation } = useConfirmation()
  const selectedRows = useRowSelection()
  const { role } = useUser()

  const [getItems] = useLazyGetContactsQuery()
  const [, post] = useAddContactMutation({
    fixedCacheKey: apiCacheKeys.contact.add
  })
  const [updateItem, put] = useUpdateContactMutation({
    fixedCacheKey: apiCacheKeys.contact.update
  })
  const [deleteItem, del] = useDeleteContactMutation({
    fixedCacheKey: apiCacheKeys.contact.delete
  })
  const [bulkDeleteItems] = useBulkDeleteContactsMutation({
    fixedCacheKey: apiCacheKeys.contact.delete
  })
  const [bulkUpdateItems] = useBulkUpdateContactsMutation({
    fixedCacheKey: apiCacheKeys.contact.update
  })
  const { data: layout, isFetching } = useGetCustomFieldsByEntityQuery({
    entityType: entityValues.contact
  })
  const [restoreContact, restore] = useRestoreContactMutation()

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
    parentUrl: removeAbsolutePath(routes.contacts.list),
    entityType: entityValues.contact,
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
    entity: filterEntityValues.contact
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
    appendValueBeforeOn,
    hideColumnsWithFilter,
    tagEntityType: tagEntityType.contact,
    permissionGroupName: permissionPageGroups.contact
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
    entityName: 'Contact',
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
        getDeleteConfirmationMessage(customFields[customFieldNames.firstName]),
        () => deleteItem(id)
      )
    },
    [showConfirmation, deleteItem]
  )

  const handleBulkDelete = useCallback(() => {
    const rows = tableRef.current.getSelectedRows()
    showConfirmation(getBulkDeleteConfirmationMessage('Contacts'), () =>
      bulkDeleteItems({
        ids: rows.map(({ id }) => id)
      })
    )
  }, [showConfirmation, bulkDeleteItems])

  const handleRestore = useCallback(
    (_, { id, customFields }) => {
      showConfirmation(
        getRestoreConfirmationMessage(customFields[customFieldNames.firstName]),
        () => restoreContact(id)
      )
    },
    [restoreContact, showConfirmation]
  )

  const actions = useMemo(
    () => [
      {
        label: 'View',
        to: ({ id }) => routes.contacts.toView(id, tableViews.list),
        render: permission.read
      },
      {
        label: 'Edit',
        to: ({ id }) => routes.contacts.toEdit(id, tableViews.list),
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
    [permission, handleDelete, extraActions]
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
      const {
        id,
        accountId,
        newAccountId,
        newCustomFields,
        status,
        salutation,
        tag
      } = data

      updateItem({
        id,
        data: queryParamsHelper({
          accountId: newAccountId || accountId?.id,
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
      pageTitle="Contacts"
      isShowSubHeaderComponent={false}
      ActionButtonsComponent={
        <>
          {permission.create && (
            <BlueButton
              className={`hvr-radial-out ${classes.addBtn}`}
              component={Link}
              to={routes.contacts.toAdd(tableViews.list)}
              iconClassName={getIconClassName(iconNames.add)}
            >
              Add Contact
            </BlueButton>
          )}
        </>
      }
      showActions={isMultipleSelected(selectedRows)}
      actions={commonActions}
    >
      <BaseTable
        entity={tableEntities.contact}
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
        disabledRowActions={disabledActions}
        titleColumnDef={titleColumnDef}
        redirectToViewPage={redirectToViewPage}
        transformTitleValue={transformTitleValue}
        showProfilePicColumn
        sortMapping={sortMapping}
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
            path={routes.contacts.add}
            element={<AddEditContact layout={layout} />}
          />
        )}
        {permission.update && (
          <Route
            path={routes.contacts.edit}
            element={<AddEditContact layout={layout} />}
          />
        )}
        {permission.read && (
          <Route
            path={`${routes.contacts.view}/*`}
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
                closeLink={parseToAbsolutePath(routes.contacts.list)}
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

export default ContactPage
