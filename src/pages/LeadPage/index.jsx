import { useCallback, useMemo, useRef, useState } from 'react'
import { hexToRgb, makeStyles } from '@material-ui/core'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'

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
  getConvertConfirmationMessage,
  getDeleteConfirmationMessage,
  getRestoreConfirmationMessage
} from 'utils/snackbarMessages'
import useConfirmation from 'hooks/useConfirmation'
import { isMultipleSelected } from 'utils/libraryUtils'
import useRowSelection from 'hooks/useRowSelection'
import { convertArr, fromChipObj, tagToChipObj } from 'utils/select'
import queryParamsHelper from 'utils/queryParamsHelper'
import {
  useAddLeadMutation,
  useBulkDeleteLeadsMutation,
  useBulkUpdateLeadsMutation,
  useConvertToContactAccountMutation,
  useDeleteLeadMutation,
  useLazyGetLeadsQuery,
  useRestoreLeadMutation,
  useUpdateLeadMutation
} from 'api/leadApi'
import AddEditLead from './AddEditLead'
import { useGetCustomFieldsByEntityQuery } from 'api/customFieldApi'
import { entityValues } from 'constants/customFields'
import useCustomFieldTableConfig from 'hooks/useCustomFieldTableConfig'
import { getColumns, getCommonActions, getFilters } from './config'
import { tagEntityType } from 'constants/tagConstants'
import customFieldNames from 'constants/customFieldNames'
import useUser from 'hooks/useUser'
import { ADMINISTRATOR } from 'constants/roleConstants'
import exceptionNames from 'constants/beExceptionNames'
import { _get } from 'utils/lodash'
import DetailView from './DetailView'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'
import { getTitleBasedOnEntity } from 'utils/customFieldUtils'
import ChipColumn from 'components/tableColumns/ChipColumn'
import { conflictActionNames, leadStatusColors } from 'constants/leadConstants'
import {
  getDarkenColorFromRgb,
  getLightenColorFromRgb,
  getRandomColor
} from 'utils/color'
import { parseToAbsolutePath, removeAbsolutePath } from 'utils/urlUtils'
import AddEditActivity from 'pages/ActivityPage/AddEditActivity'
import useLibraryCommonActions from 'hooks/useLibraryCommonActions'
import { filterEntityValues } from 'constants/filterPreference'
import useFilterPreference from 'hooks/useFilterPreference'
import { ConvertConflictModal } from 'components/modals'

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    marginBottom: spacing(2)
  },
  addBtn: {
    marginRight: '17px'
  },
  confirmationBtnLabel: {
    whiteSpace: 'nowrap'
  },
  confirmationBtnRoot: {
    padding: '0px 3px'
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
const redirectToViewPage = ({ id }) => routes.leads.toView(id, tableViews.list)

const transformTitleValue = data =>
  getTitleBasedOnEntity(entityValues.lead, data)

const LeadPage = () => {
  const classes = useStyles()
  const permission = useDeterminePermissions(permissionGroupNames.lead)
  const activityPermission = useDeterminePermissions(
    permissionGroupNames.activity
  )
  const tableRef = useRef()
  const [convertId, setConvertId] = useState()
  const [isConflictModalOpen, setConflictModalOpen] = useState(false)
  const [conflictData, setConflictData] = useState()
  const { showConfirmation } = useConfirmation()
  const selectedRows = useRowSelection()
  const { role } = useUser()
  const navigate = useNavigate()

  const [getItems] = useLazyGetLeadsQuery()
  const [, post] = useAddLeadMutation({
    fixedCacheKey: apiCacheKeys.lead.add
  })
  const [updateItem, put] = useUpdateLeadMutation({
    fixedCacheKey: apiCacheKeys.lead.update
  })
  const [deleteItem, del] = useDeleteLeadMutation({
    fixedCacheKey: apiCacheKeys.lead.delete
  })
  const [bulkDeleteItems] = useBulkDeleteLeadsMutation({
    fixedCacheKey: apiCacheKeys.lead.delete
  })
  const [bulkUpdateItems] = useBulkUpdateLeadsMutation({
    fixedCacheKey: apiCacheKeys.lead.update
  })
  const [convertToItem, convertTo] = useConvertToContactAccountMutation({
    fixedCacheKey: apiCacheKeys.lead.convertTo
  })
  const { data: layout, isFetching } = useGetCustomFieldsByEntityQuery({
    entityType: entityValues.lead
  })
  const [restoreLead, restore] = useRestoreLeadMutation()

  const {
    actions: extraActions,
    modalRender,
    onOpenUpdateModal
  } = useLibraryCommonActions({
    parentUrl: removeAbsolutePath(routes.leads.list),
    entityType: entityValues.lead,
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
    entity: filterEntityValues.lead
  })

  const handleConvertConfirm = useCallback(
    ({
      actionAccount,
      accountCustomFields,
      actionContact,
      contactCustomFields,
      actionOpportunity,
      opportunityCustomFields,
      selectedOpportunityId,
      doNotCreateOpportunity
    }) => {
      const data = {
        actionAccount,
        actionContact,
        actionOpportunity,
        doNotCreateOpportunity,
        ...(actionAccount === conflictActionNames.addToExisting
          ? { accountCustomFields: queryParamsHelper(accountCustomFields) }
          : {}),
        ...(actionContact === conflictActionNames.addToExisting
          ? { contactCustomFields: queryParamsHelper(contactCustomFields) }
          : {}),
        ...(actionOpportunity === conflictActionNames.addToExisting
          ? { selectedOpportunityId }
          : !doNotCreateOpportunity
          ? {
              opportunityCustomFields: {
                ...opportunityCustomFields,
                contactAuthority: opportunityCustomFields?.contactAuthority
                  ? opportunityCustomFields.contactAuthority.map(
                      ({ value }) => value
                    )
                  : []
              }
            }
          : {})
      }
      convertToItem({
        id: convertId,
        body: data
      })
    },
    [convertId, convertToItem]
  )

  const appendValueBeforeOn = useMemo(
    () => [
      {
        code: customFieldNames.firstName,
        name: 'salutation'
      }
    ],
    []
  )

  const initialColumns = useMemo(() => getColumns(), [])
  const initialFilters = useMemo(() => getFilters(), [])

  const getColumnDef = useCallback(({ code }) => {
    if (code === customFieldNames.leadStatus) {
      return {
        cellRenderer: ChipColumn,
        cellRendererParams: {
          getProps: data => {
            const leadStatus = _get(
              data,
              `customFields.${customFieldNames.leadStatus}.name`,
              ''
            )
            const randomColor = hexToRgb(getRandomColor())
            return {
              label: leadStatus,
              backgroundColor:
                leadStatusColors[leadStatus]?.background ||
                getLightenColorFromRgb(randomColor, 0.5),
              color:
                leadStatusColors[leadStatus]?.color ||
                getDarkenColorFromRgb(randomColor, 0.5),
              iconClassName: getIconClassName(iconNames.leadStatus)
            }
          }
        }
      }
    }
    return {}
  }, [])

  const { columns, filters, editors } = useCustomFieldTableConfig({
    initialColumns,
    initialFilters,
    layout,
    appendValueBeforeOn,
    tagEntityType: tagEntityType.lead,
    permissionGroupName: permissionPageGroups.lead,
    hideColumnsWithFilter,
    getColumnDef
  })

  const refreshTable = useCallback(() => {
    if (tableRef.current) {
      tableRef.current.refresh({
        page: 1
      })
    }
  }, [])

  const handleError = reducer => {
    if (
      reducer?.error?.code === 409 &&
      reducer?.error?.exception === exceptionNames.convertLeadErrorException
    ) {
      setConflictModalOpen(true)
      setConflictData(_get(reducer, 'error.data'))
    }
  }

  const handleSuccess = reducer => {
    selectedRows.clearSelectedRows()
    setConvertId()
    setConflictData()
    setConflictModalOpen(false)
    if (
      reducer.endpointName === convertTo.endpointName &&
      reducer?.data?.accountId
    ) {
      navigate(routes.accounts.toView(reducer?.data?.accountId))
    }
  }

  useNotifyAnalyzer({
    fetcher: refreshTable,
    onSuccess: handleSuccess,
    onError: handleError,
    entityName: 'Lead',
    watchArray: [post, put, del, convertTo, restore],
    labels: [
      notifyLabels.add,
      notifyLabels.update,
      notifyLabels.delete,
      notifyLabels.convert,
      notifyLabels.restore
    ],
    hideNotification: convertTo.isSuccess || convertTo.isError
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

  const handleConvert = useCallback(
    (event, { id, customFields = {} }) => {
      showConfirmation(
        getConvertConfirmationMessage(customFields[customFieldNames.firstName]),
        () => {
          convertToItem({ id })
          setConvertId(id)
        }
      )
    },
    [showConfirmation, convertToItem]
  )

  const handleBulkDelete = useCallback(() => {
    const rows = tableRef.current.getSelectedRows()
    showConfirmation(getBulkDeleteConfirmationMessage('Leads'), () =>
      bulkDeleteItems({
        ids: rows.map(({ id }) => id)
      })
    )
  }, [showConfirmation, bulkDeleteItems])

  const handleRestore = useCallback(
    (_, { id, customFields }) => {
      showConfirmation(
        getRestoreConfirmationMessage(customFields[customFieldNames.firstName]),
        () => restoreLead(id)
      )
    },
    [restoreLead, showConfirmation]
  )

  const actions = useMemo(
    () => [
      {
        label: 'View',
        to: ({ id }) => routes.leads.toView(id, tableViews.list),
        render: permission.read
      },
      {
        label: 'Edit',
        to: ({ id }) => routes.leads.toEdit(id, tableViews.list),
        render: permission.update
      },
      ...extraActions,
      {
        label: 'Convert',
        clickAction: handleConvert
      },
      {
        label: 'Delete',
        clickAction: handleDelete,
        icon: getIconClassName(iconNames.delete),
        render: permission.delete
      }
    ],
    [permission, handleDelete, handleConvert, extraActions]
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

  const sidebarToolPanels = useMemo(() => [viewToolPanel], [viewToolPanel])

  const handleCloseModal = () => {
    setConflictModalOpen(false)
    setConvertId()
    setConflictData()
  }

  return (
    <PageContainer
      pageTitle="Leads"
      isShowSubHeaderComponent={false}
      ActionButtonsComponent={
        <>
          {permission.create && (
            <BlueButton
              className={`hvr-radial-out ${classes.addBtn}`}
              component={Link}
              to={routes.leads.toAdd(tableViews.list)}
              iconClassName={getIconClassName(iconNames.add)}
            >
              Add Lead
            </BlueButton>
          )}
        </>
      }
      showActions={isMultipleSelected(selectedRows)}
      actions={commonActions}
    >
      <BaseTable
        entity={tableEntities.lead}
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
            path={routes.leads.add}
            element={<AddEditLead layout={layout} />}
          />
        )}
        {permission.update && (
          <Route
            path={routes.leads.edit}
            element={<AddEditLead layout={layout} />}
          />
        )}
        {permission.read && (
          <Route
            path={`${routes.leads.view}/*`}
            element={
              <DetailView
                layout={layout}
                updateItem={updateItem}
                permission={permission}
                onConvert={handleConvert}
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
                closeLink={parseToAbsolutePath(routes.leads.list)}
                fromDetailView
                hideRelatedFields
              />
            }
          />
        )}
      </Routes>
      {modalRender}
      {isConflictModalOpen && (
        <ConvertConflictModal
          title="Convert Lead"
          open={isConflictModalOpen}
          data={conflictData}
          onClose={handleCloseModal}
          onConvert={handleConvertConfirm}
        />
      )}
    </PageContainer>
  )
}

export default LeadPage
