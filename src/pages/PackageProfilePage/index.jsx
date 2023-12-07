import { useCallback, useMemo, useRef } from 'react'
import { makeStyles } from '@material-ui/core'
import { Link, Route, Routes } from 'react-router-dom'

import PageContainer from 'components/PageContainer'
import { BlueButton } from 'components/buttons'
import { routes, tableViews } from 'constants/routes'
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
import AddEditPackageProfile from './AddEditPackageProfile'
import useFilterPreference from 'hooks/useFilterPreference'
import { filterEntityValues } from 'constants/filterPreference'
import {
  useAddPackageProfileMutation,
  useDeletePackageProfileMutation,
  useLazyGetPackageProfilesQuery,
  useUpdatePackageProfileMutation
} from 'api/packageProfileApi'

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    marginBottom: spacing(2)
  },
  addBtn: {
    marginRight: '17px'
  }
}))

const PackageProfilePage = () => {
  const classes = useStyles()
  const tableRef = useRef()
  const { showConfirmation } = useConfirmation()
  const selectedRows = useRowSelection()

  const [getItems] = useLazyGetPackageProfilesQuery()
  const [, post] = useAddPackageProfileMutation({
    fixedCacheKey: apiCacheKeys.packageProfile.add
  })
  const [updateItem, put] = useUpdatePackageProfileMutation({
    fixedCacheKey: apiCacheKeys.packageProfile.update
  })
  const [deleteItem, del] = useDeletePackageProfileMutation({
    fixedCacheKey: apiCacheKeys.packageProfile.delete
  })

  const {
    staticFilterModel,
    setFilterModel,
    viewToolPanel,
    handleSaveFilter,
    selectedFilter,
    clearSelectedFilter
  } = useFilterPreference({
    entity: filterEntityValues.packageProfile
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
    entityName: 'Shipment Package Profile',
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
        to: ({ id }) => routes.packageProfile.toEdit(id, tableViews.list)
      },
      {
        label: 'Delete',
        clickAction: handleDelete,
        icon: getIconClassName(iconNames.delete)
      }
    ],
    [handleDelete]
  )

  const filters = useMemo(() => getFilters(), [])

  const editors = useMemo(() => getEditors(), [])

  const handleCellValueChanged = useCallback(
    event => {
      const { data, refresh } = event
      const {
        id,
        length,
        width,
        height,
        distanceUnit,
        weight,
        massUnit,
        name
      } = data
      updateItem({
        id,
        data: {
          length,
          width,
          height,
          distanceUnit,
          weight,
          massUnit,
          name
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
      pageTitle="Shipment Package Profiles"
      isShowSubHeaderComponent={false}
      ActionButtonsComponent={
        <>
          <BlueButton
            className={`hvr-radial-out ${classes.addBtn}`}
            component={Link}
            to={routes.packageProfile.toAdd(tableViews.list)}
            iconClassName={getIconClassName(iconNames.add)}
          >
            Add Package Profile
          </BlueButton>
        </>
      }
    >
      <BaseTable
        entity={tableEntities.packageProfile}
        columns={columns}
        fetcher={fetcher}
        rowActions={actions}
        selectedRows={selectedRows}
        pagination={true}
        filters={filters}
        editors={editors}
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
        <Route
          path={routes.packageProfile.add}
          element={<AddEditPackageProfile />}
        />
        <Route
          path={routes.packageProfile.edit}
          element={<AddEditPackageProfile />}
        />
      </Routes>
    </PageContainer>
  )
}

export default PackageProfilePage
