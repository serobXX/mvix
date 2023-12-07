import { useCallback, useMemo, useRef } from 'react'
import { makeStyles } from '@material-ui/core'
import { Link, Route, Routes } from 'react-router-dom'

import {
  useAddLicenseMutation,
  useBulkDeleteLicenseMutation,
  useDeleteLicenseMutation,
  useLazyGetLicensesQuery,
  useUpdateLicenseMutation
} from 'api/licenseApi'
import PageContainer from 'components/PageContainer'
import { BlueButton } from 'components/buttons'
import BaseTable from 'components/tableLibrary/BaseTable'
import { tableEntities } from 'constants/library'
import { permissionGroupNames } from 'constants/permissionGroups'
import { routes, tableViews } from 'constants/routes'
import useDeterminePermissions from 'hooks/useDeterminePermissions'
import { getColumns } from './columnConfig'
import AddEditLicense from './AddEditLicense'
import apiCacheKeys from 'constants/apiCacheKeys'
import useNotifyAnalyzer from 'hooks/useNotifyAnalyzer'
import { notifyLabels } from 'constants/notifyAnalyzer'
import useRowSelection from 'hooks/useRowSelection'
import useConfirmation from 'hooks/useConfirmation'
import {
  getBulkDeleteConfirmationMessage,
  getDeleteConfirmationMessage
} from 'utils/snackbarMessages'
import { isMultipleSelected } from 'utils/libraryUtils'
import {
  FormControlAutocomplete,
  FormControlInput,
  FormControlNumericInput,
  FormControlReactSelect,
  FormControlSelectTag
} from 'components/formControls'
import { getOptions, transformDataByValueName } from 'utils/autocompleteOptions'
import { licenseTypeOptions } from 'constants/licenseContants'
import { chipObjToTag, convertArr, tagToChipObj } from 'utils/select'
import { fromChipObj } from 'utils/select'
import { _isEqual } from 'utils/lodash'
import { tagEntityType } from 'constants/tagConstants'
import { filterStatusOptions } from 'constants/commonOptions'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'
import useFilterPreference from 'hooks/useFilterPreference'
import { filterEntityValues } from 'constants/filterPreference'

const useStyles = makeStyles(() => ({
  userAddBtn: {
    marginRight: '17px'
  }
}))

const LicensePage = () => {
  const classes = useStyles()
  const tableRef = useRef()
  const selectedRows = useRowSelection()
  const { showConfirmation } = useConfirmation()

  const licensePermission = useDeterminePermissions(
    permissionGroupNames.license
  )

  const [getLicenses] = useLazyGetLicensesQuery()
  const [, post] = useAddLicenseMutation({
    fixedCacheKey: apiCacheKeys.license.add
  })
  const [updateLicense, put] = useUpdateLicenseMutation({
    fixedCacheKey: apiCacheKeys.license.update
  })
  const [deleteItem, del] = useDeleteLicenseMutation({
    fixedCacheKey: apiCacheKeys.license.delete
  })
  const [bulkDeleteItems] = useBulkDeleteLicenseMutation({
    fixedCacheKey: apiCacheKeys.license.delete
  })

  const handleDelete = useCallback(
    (event, { id, name }) => {
      showConfirmation(getDeleteConfirmationMessage(name), () => deleteItem(id))
    },
    [showConfirmation, deleteItem]
  )

  const {
    staticFilterModel,
    setFilterModel,
    viewToolPanel,
    handleSaveFilter,
    selectedFilter,
    clearSelectedFilter
  } = useFilterPreference({
    entity: filterEntityValues.license
  })

  const sidebarToolPanels = useMemo(() => [viewToolPanel], [viewToolPanel])

  const actions = useMemo(
    () => [
      {
        label: 'Edit',
        to: ({ id }) => routes.licenses.toEdit(id, tableViews.list),
        render: licensePermission.update
      },
      {
        label: 'Delete',
        clickAction: handleDelete,
        icon: getIconClassName(iconNames.delete),
        render: licensePermission.delete
      }
    ],
    [licensePermission, handleDelete]
  )

  const getOptionsByField = useCallback(
    field => async (value, params) => {
      return getOptions({
        fetcher: getLicenses,
        params,
        value,
        field,
        transformData: transformDataByValueName
      })
    },
    [getLicenses]
  )

  const columns = useMemo(() => getColumns(), [])

  const filters = useMemo(
    () => [
      {
        field: 'name',
        filter: FormControlAutocomplete,
        filterProps: {
          getOptions: getOptionsByField('name'),
          withPortal: true,
          isClearable: true,
          isCreatable: true
        }
      },
      {
        field: 'licenseType',
        filter: FormControlReactSelect,
        filterProps: {
          options: licenseTypeOptions,
          withPortal: true,
          isClearable: true,
          isMulti: true,
          isMultiSelection: true,
          fixedHeight: true
        }
      },
      {
        field: 'licenseDurationInMonth',
        filter: FormControlNumericInput,
        filterProps: {
          max: 20,
          isNullable: true
        }
      },
      {
        field: 'status',
        filter: FormControlReactSelect,
        filterProps: {
          options: filterStatusOptions,
          isMulti: true,
          withPortal: true,
          isClearable: true
        }
      },
      {
        field: 'tag',
        filter: FormControlSelectTag,
        filterProps: {
          withPortal: true,
          isMultiSelection: true,
          hasDynamicChipsCreation: false,
          fixedHeight: true,
          entityType: tagEntityType.license
        }
      }
    ],
    [getOptionsByField]
  )

  const editors = useMemo(
    () => [
      {
        field: 'name',
        cellEditor: FormControlInput
      },
      {
        field: 'licenseType',
        cellEditor: FormControlReactSelect,
        cellEditorProps: {
          options: licenseTypeOptions,
          withPortal: true,
          isInput: false
        }
      },
      {
        field: 'licenseDurationInMonth',
        cellEditor: FormControlNumericInput,
        cellEditorProps: {
          convertToString: true
        }
      },
      {
        field: 'tag',
        cellEditor: FormControlSelectTag,
        cellEditorProps: {
          isMultiSelection: true,
          withPortal: true,
          entityType: tagEntityType.license
        },
        valueGetter: params => convertArr(params.data?.tag, tagToChipObj),
        valueSetter: params => {
          if (
            params.newValue &&
            !_isEqual(
              convertArr(params.newValue, chipObjToTag),
              params.data.tag
            )
          ) {
            params.data.tag = convertArr(params.newValue, chipObjToTag)
            return true
          }
          return false
        }
      }
    ],
    []
  )

  const fetcher = useCallback(
    async params => {
      const data = await getLicenses(params).unwrap()
      return data
    },
    [getLicenses]
  )

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
    entityName: 'License',
    watchArray: [post, put, del],
    labels: [notifyLabels.add, notifyLabels.update, notifyLabels.delete]
  })

  const handleBulkDelete = useCallback(() => {
    showConfirmation(getBulkDeleteConfirmationMessage('License'), () => {
      const rows = tableRef.current.getSelectedRows()
      if (rows.length) {
        bulkDeleteItems(rows.map(({ id }) => id))
      }
    })
  }, [bulkDeleteItems, showConfirmation])

  const commonActions = useMemo(
    () => [
      {
        label: 'Delete Licenses',
        icon: getIconClassName(iconNames.delete),
        clickAction: handleBulkDelete,
        render: licensePermission.delete
      }
    ],
    [licensePermission.delete, handleBulkDelete]
  )

  const handleCellValueChanged = useCallback(
    event => {
      const { data, refresh } = event
      const { id, name, licenseType, licenseDurationInMonth, tag } = data

      updateLicense({
        id,
        name,
        licenseType,
        licenseDurationInMonth,
        tag: convertArr(convertArr(tag, tagToChipObj), fromChipObj)
      })
        .unwrap()
        .catch(err => {
          refresh()
        })
    },
    [updateLicense]
  )

  return (
    <PageContainer
      pageTitle="Licenses"
      isShowSubHeaderComponent={false}
      ActionButtonsComponent={
        <>
          {licensePermission.create && (
            <BlueButton
              className={`hvr-radial-out ${classes.userAddBtn}`}
              component={Link}
              to={routes.licenses.toAdd(tableViews.list)}
              iconClassName={getIconClassName(iconNames.add)}
            >
              Add License
            </BlueButton>
          )}
        </>
      }
      showActions={isMultipleSelected(selectedRows)}
      actions={commonActions}
    >
      <BaseTable
        entity={tableEntities.license}
        columns={columns}
        selectedRows={selectedRows}
        fetcher={fetcher}
        rowActions={actions}
        pagination={true}
        filters={filters}
        hideEditors={!licensePermission.update}
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
        {licensePermission.create && (
          <Route path={routes.licenses.add} element={<AddEditLicense />} />
        )}
        {licensePermission.update && (
          <Route path={routes.licenses.edit} element={<AddEditLicense />} />
        )}
      </Routes>
    </PageContainer>
  )
}

export default LicensePage
