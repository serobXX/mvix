import { useCallback, useMemo, useRef } from 'react'
import { makeStyles } from '@material-ui/core'
import { Link, Route, Routes } from 'react-router-dom'

import PageContainer from 'components/PageContainer'
import { BlueButton, WhiteButton } from 'components/buttons'
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
import { getColumns, getCommonActions } from './config'
import { tagEntityType } from 'constants/tagConstants'
import customFieldNames from 'constants/customFieldNames'
import {
  useAddProductMutation,
  useBulkDeleteProductsMutation,
  useBulkUpdateProductsMutation,
  useDeleteProductMutation,
  useLazyGetProductsQuery,
  useRestoreProductMutation,
  useUpdateProductMutation
} from 'api/productApi'
import AddEditProduct from './AddEditProduct'
import useUser from 'hooks/useUser'
import { ADMINISTRATOR } from 'constants/roleConstants'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'
import { getTitleBasedOnEntity } from 'utils/customFieldUtils'
import DetailView from './DetailView'
import useFilterPreference from 'hooks/useFilterPreference'
import { filterEntityValues } from 'constants/filterPreference'
import useLibraryCommonActions from 'hooks/useLibraryCommonActions'
import { removeAbsolutePath } from 'utils/urlUtils'
import SolutionSet from './SolutionSet'

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    marginBottom: spacing(2)
  },
  addBtn: {
    marginRight: '17px'
  }
}))

const hideColumnsOnly = [
  customFieldNames.productName,
  customFieldNames.productPrice
]

const titleColumnDef = {
  headerName: 'Name',
  field: customFieldNames.productName
}
const redirectToViewPage = ({ id }) =>
  routes.products.toView(id, tableViews.list)

const transformTitleValue = data =>
  getTitleBasedOnEntity(entityValues.product, data)

const ProductPage = () => {
  const classes = useStyles()
  const permission = useDeterminePermissions(permissionGroupNames.product)
  const solutionSetPermission = useDeterminePermissions(
    permissionGroupNames.solutionSet
  )
  const tableRef = useRef()
  const { showConfirmation } = useConfirmation()
  const selectedRows = useRowSelection()
  const { role } = useUser()

  const [getItems] = useLazyGetProductsQuery()
  const [, post] = useAddProductMutation({
    fixedCacheKey: apiCacheKeys.product.add
  })
  const [updateItem, put] = useUpdateProductMutation({
    fixedCacheKey: apiCacheKeys.product.update
  })
  const [deleteItem, del] = useDeleteProductMutation({
    fixedCacheKey: apiCacheKeys.product.delete
  })
  const [bulkDeleteItems] = useBulkDeleteProductsMutation({
    fixedCacheKey: apiCacheKeys.product.delete
  })
  const [bulkUpdateItems] = useBulkUpdateProductsMutation({
    fixedCacheKey: apiCacheKeys.product.update
  })
  const { data: layout, isFetching } = useGetCustomFieldsByEntityQuery({
    entityType: entityValues.product
  })
  const [restoreProduct, restore] = useRestoreProductMutation()

  const initialColumns = useMemo(() => getColumns(), [])

  const {
    staticFilterModel,
    setFilterModel,
    viewToolPanel,
    handleSaveFilter,
    selectedFilter,
    clearSelectedFilter
  } = useFilterPreference({
    entity: filterEntityValues.product
  })

  const sidebarToolPanels = useMemo(() => [viewToolPanel], [viewToolPanel])

  const {
    modalRender,
    actions: extraActions,
    onOpenUpdateModal
  } = useLibraryCommonActions({
    parentUrl: removeAbsolutePath(routes.contacts.list),
    entityType: entityValues.product,
    permission,
    updateItem,
    tableRef,
    bulkUpdateItems,
    layout,
    hideTask: true,
    hideOwner: true
  })

  const { columns, filters, editors } = useCustomFieldTableConfig({
    initialColumns,
    layout,
    tagEntityType: tagEntityType.product,
    permissionGroupName: permissionPageGroups.product,
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
    entityName: 'Product',
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
          customFields[customFieldNames.productName]
        ),
        () => deleteItem(id)
      )
    },
    [showConfirmation, deleteItem]
  )

  const handleBulkDelete = useCallback(() => {
    const rows = tableRef.current.getSelectedRows()
    showConfirmation(getBulkDeleteConfirmationMessage('Products'), () =>
      bulkDeleteItems({
        ids: rows.map(({ id }) => id)
      })
    )
  }, [showConfirmation, bulkDeleteItems])

  const handleRestore = useCallback(
    (_, { id, customFields }) => {
      showConfirmation(
        getRestoreConfirmationMessage(
          customFields[customFieldNames?.productName]
        ),
        () => restoreProduct(id)
      )
    },
    [restoreProduct, showConfirmation]
  )

  const actions = useMemo(
    () => [
      {
        label: 'View',
        to: ({ id }) => routes.products.toView(id, tableViews.list),
        render: permission.read
      },
      {
        label: 'Edit',
        to: ({ id }) => routes.products.toEdit(id, tableViews.list),
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
      const { id, newCustomFields, status, tag } = data

      updateItem(
        queryParamsHelper(
          {
            id,
            data: {
              customFields: newCustomFields,
              status,
              tag: convertArr(convertArr(tag, tagToChipObj), fromChipObj)
            }
          },
          ['customFields']
        )
      )
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
      pageTitle="Products"
      isShowSubHeaderComponent={false}
      ActionButtonsComponent={
        <>
          {solutionSetPermission.create && (
            <WhiteButton
              className={`hvr-radial-out ${classes.addBtn}`}
              component={Link}
              to={routes.products.solutionSet}
              iconClassName={getIconClassName(iconNames.solutionSet)}
              variant="info"
            >
              Solution Set
            </WhiteButton>
          )}
          {permission.create && (
            <BlueButton
              className={`hvr-radial-out ${classes.addBtn}`}
              component={Link}
              to={routes.products.toAdd(tableViews.list)}
              iconClassName={getIconClassName(iconNames.add)}
            >
              Add Product
            </BlueButton>
          )}
        </>
      }
      showActions={isMultipleSelected(selectedRows)}
      actions={commonActions}
    >
      <BaseTable
        entity={tableEntities.product}
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
        disabledRowActions={disabledActions}
        titleColumnDef={titleColumnDef}
        transformTitleValue={transformTitleValue}
        redirectToViewPage={redirectToViewPage}
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
            path={routes.products.add}
            element={<AddEditProduct layout={layout} />}
          />
        )}
        {permission.update && (
          <Route
            path={routes.products.edit}
            element={<AddEditProduct layout={layout} />}
          />
        )}
        {solutionSetPermission.create && (
          <Route
            path={routes.products.solutionSet}
            element={<SolutionSet layout={layout} />}
          />
        )}
        {permission.read && (
          <Route
            path={`${routes.products.view}/*`}
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
      </Routes>
      {modalRender}
    </PageContainer>
  )
}

export default ProductPage
