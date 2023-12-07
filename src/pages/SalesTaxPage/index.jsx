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
import {
  useAddSalesTaxMutation,
  useDeleteSalesTaxMutation,
  useLazyGetSalesTaxesQuery,
  useUpdateSalesTaxMutation
} from 'api/salesTaxApi'
import AddEditSalesTax from './AddEditSalesTax'
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

const SalesTax = () => {
  const classes = useStyles()
  const permission = useDeterminePermissions(permissionGroupNames.salesTax)
  const tableRef = useRef()
  const { showConfirmation } = useConfirmation()
  const selectedRows = useRowSelection()

  const [getItems] = useLazyGetSalesTaxesQuery()
  const [, post] = useAddSalesTaxMutation({
    fixedCacheKey: apiCacheKeys.salesTax.add
  })
  const [updateItem, put] = useUpdateSalesTaxMutation({
    fixedCacheKey: apiCacheKeys.salesTax.update
  })
  const [deleteItem, del] = useDeleteSalesTaxMutation({
    fixedCacheKey: apiCacheKeys.salesTax.delete
  })

  const {
    staticFilterModel,
    setFilterModel,
    viewToolPanel,
    handleSaveFilter,
    selectedFilter,
    clearSelectedFilter
  } = useFilterPreference({
    entity: filterEntityValues.salesTax
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
    entityName: 'Sales Tax',
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
        to: ({ id }) => routes.salesTax.toEdit(id, tableViews.list),
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
        stateCode: data.stateCode,
        tax: data.tax
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
      pageTitle="Sales Taxes"
      isShowSubHeaderComponent={false}
      ActionButtonsComponent={
        <>
          {permission.create && (
            <BlueButton
              className={`hvr-radial-out ${classes.addBtn}`}
              component={Link}
              to={routes.salesTax.toAdd(tableViews.list)}
              iconClassName={getIconClassName(iconNames.add)}
            >
              Add Sales Tax
            </BlueButton>
          )}
        </>
      }
    >
      <BaseTable
        entity={tableEntities.salesTax}
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
      />
      <Routes>
        {permission.create && (
          <Route path={routes.salesTax.add} element={<AddEditSalesTax />} />
        )}
        {permission.update && (
          <Route path={routes.salesTax.edit} element={<AddEditSalesTax />} />
        )}
      </Routes>
    </PageContainer>
  )
}

export default SalesTax
