import { useCallback, useMemo, useRef } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import { makeStyles } from '@material-ui/core'

import AddEditUser from 'pages/UsersPage/AddEditUser'
import { routes } from 'constants/routes'
import PageContainer from 'components/PageContainer'
import BaseTable from 'components/tableLibrary/BaseTable'
import { tableEntities } from 'constants/library'
import {
  useAddUserMutation,
  useLazyGetUsersQuery,
  useUpdateUserMutation
} from 'api/userApi'
import { getColumns } from './columnConfig'
import { BlueButton, WhiteButton } from 'components/buttons'
import useDeterminePermissions from 'hooks/useDeterminePermissions'
import { permissionGroupNames } from 'constants/permissionGroups'
import useNotifyAnalyzer from 'hooks/useNotifyAnalyzer'
import { notifyLabels } from 'constants/notifyAnalyzer'
import apiCacheKeys from 'constants/apiCacheKeys'
import { tableViews } from 'constants/routes'
import {
  CheckboxSwitcher,
  FormControlAutocomplete,
  FormControlInput,
  FormControlReactSelect
} from 'components/formControls'
import { useGetRolesQuery } from 'api/roleApi'
import { BIG_LIMIT } from 'constants/app'
import { statusOptions, statusValues } from 'constants/commonOptions'
import { statusReturnValues } from 'constants/commonOptions'
import { getOptions, transformDataByValueName } from 'utils/autocompleteOptions'
import iconNames from 'constants/iconNames'
import { getIconClassName } from 'utils/iconUtils'
import RoleAndPermissionPage from './RoleAndPermissionPage'
import useFilterPreference from 'hooks/useFilterPreference'
import { filterEntityValues } from 'constants/filterPreference'

const useStyles = makeStyles(() => ({
  userAddBtn: {
    marginRight: '17px'
  }
}))

const sortMapping = {
  name: 'firstName',
  role_id: 'role'
}

const titleColumnDef = {
  headerName: 'Name',
  field: 'name'
}

const transformTitleValue = data => {
  return `${data.firstName} ${data.lastName}`
}

const UsersPage = () => {
  const classes = useStyles()
  const tableRef = useRef()
  const userPermission = useDeterminePermissions(permissionGroupNames.user)
  const rolePermission = useDeterminePermissions(permissionGroupNames.role)

  const [getUsers] = useLazyGetUsersQuery()
  const [, post] = useAddUserMutation({
    fixedCacheKey: apiCacheKeys.user.add
  })
  const [updateUser, put] = useUpdateUserMutation({
    fixedCacheKey: apiCacheKeys.user.update
  })

  const { data: roles, isLoading: roleLoading } = useGetRolesQuery({
    limit: BIG_LIMIT,
    status: statusValues.active
  })

  const transformedRoles = useMemo(
    () => roles.map(({ name: label, id: value }) => ({ label, value })),
    [roles]
  )

  const {
    staticFilterModel,
    setFilterModel,
    viewToolPanel,
    handleSaveFilter,
    selectedFilter,
    clearSelectedFilter
  } = useFilterPreference({
    entity: filterEntityValues.user
  })

  const sidebarToolPanels = useMemo(() => [viewToolPanel], [viewToolPanel])

  const getOptionsByField = useCallback(
    field => async (value, params) => {
      return getOptions({
        fetcher: getUsers,
        params,
        value,
        field,
        transformData: transformDataByValueName
      })
    },
    [getUsers]
  )

  const actions = useMemo(
    () => [
      {
        label: 'Edit',
        to: ({ id }) => routes.users.toEdit(id, tableViews.list),
        render: userPermission.update
      }
    ],
    [userPermission]
  )

  const columns = useMemo(() => getColumns(), [])

  const filters = useMemo(
    () => [
      {
        field: 'name',
        filters: [
          {
            field: 'firstName',
            filter: FormControlAutocomplete,
            headerName: 'First Name',
            filterProps: {
              getOptions: getOptionsByField('firstName'),
              withPortal: true,
              isClearable: true,
              isCreatable: true
            }
          },
          {
            field: 'lastName',
            filter: FormControlAutocomplete,
            headerName: 'Last Name',
            filterProps: {
              getOptions: getOptionsByField('lastName'),
              withPortal: true,
              isClearable: true,
              isCreatable: true
            }
          }
        ]
      },
      {
        field: 'email',
        filter: FormControlAutocomplete,
        filterProps: {
          getOptions: getOptionsByField('email'),
          withPortal: true,
          isClearable: true,
          isCreatable: true
        }
      },
      {
        field: 'role_id',
        filter: FormControlReactSelect,
        filterProps: {
          options: transformedRoles,
          isLoading: roleLoading,
          withPortal: true,
          isClearable: true,
          isMulti: true,
          isMultiSelection: true,
          fixedHeight: true
        }
      },
      {
        field: 'status',
        filter: FormControlReactSelect,
        filterProps: {
          options: statusOptions,
          withPortal: true,
          isClearable: true,
          isMulti: true
        }
      }
    ],
    [transformedRoles, roleLoading, getOptionsByField]
  )

  const editors = useMemo(
    () => [
      {
        field: 'name',
        cellEditors: [
          {
            field: 'firstName',
            cellEditor: FormControlInput,
            headerName: 'First Name'
          },
          {
            field: 'lastName',
            cellEditor: FormControlInput,
            headerName: 'Last Name'
          }
        ]
      },
      {
        field: 'email',
        cellEditor: FormControlInput
      },
      {
        field: 'role_id',
        cellEditor: FormControlReactSelect,
        cellEditorProps: {
          options: transformedRoles,
          isLoading: roleLoading,
          withPortal: true,
          isInput: false
        },
        valueGetter: params => params.data?.role?.id,
        valueSetter: params => {
          if (params.newValue) {
            params.data.roleId = params.newValue
            return true
          }
          return false
        }
      },
      {
        field: 'status',
        cellEditor: CheckboxSwitcher,
        cellEditorProps: {
          returnValues: statusReturnValues,
          isInput: false
        }
      }
    ],
    [transformedRoles, roleLoading]
  )

  const fetcher = useCallback(
    async params => {
      const data = await getUsers(params).unwrap()
      return data
    },
    [getUsers]
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
    entityName: 'User',
    watchArray: [post, put],
    labels: [notifyLabels.add, notifyLabels.update]
  })

  const handleCellValueChanged = event => {
    const { data, refresh } = event
    const { id, roleId, role, firstName, lastName, email, status } = data

    updateUser({
      id,
      firstName,
      lastName,
      email,
      status,
      roleId: roleId || role?.id
    })
      .unwrap()
      .catch(err => {
        refresh()
      })
  }

  return (
    <PageContainer
      pageTitle="Users"
      isShowSubHeaderComponent={false}
      ActionButtonsComponent={
        <>
          {rolePermission.read && (
            <WhiteButton
              className={`hvr-radial-out ${classes.userAddBtn}`}
              component={Link}
              to={routes.users.toRoleAndPerm()}
              iconClassName={getIconClassName(iconNames.roleAndPermission)}
            >
              Roles & Permissions
            </WhiteButton>
          )}
          {userPermission.create && (
            <BlueButton
              className={`hvr-radial-out ${classes.userAddBtn}`}
              component={Link}
              to={routes.users.toAdd()}
              iconClassName={getIconClassName(iconNames.add)}
            >
              Add User
            </BlueButton>
          )}
        </>
      }
    >
      <BaseTable
        entity={tableEntities.user}
        columns={columns}
        fetcher={fetcher}
        rowActions={actions}
        pagination={true}
        filters={filters}
        editors={editors}
        hideEditors={!userPermission.update}
        ref={tableRef}
        rowHeight={70}
        onCellValueChanged={handleCellValueChanged}
        sortMapping={sortMapping}
        titleColumnDef={titleColumnDef}
        transformTitleValue={transformTitleValue}
        showProfilePicColumn
        sidebarToolPanels={sidebarToolPanels}
        onFilterChanged={setFilterModel}
        filterData={staticFilterModel}
        saveFilterItem={selectedFilter}
        onSaveFilter={handleSaveFilter}
        clearSelectedFilter={clearSelectedFilter}
      />
      <Routes>
        {userPermission.create && (
          <Route path={routes.users.add} element={<AddEditUser />} />
        )}
        {userPermission.update && (
          <Route path={routes.users.edit} element={<AddEditUser />} />
        )}
        {rolePermission.read && (
          <Route
            path={`${routes.users.roleAndPerm}/*`}
            element={<RoleAndPermissionPage />}
          />
        )}
      </Routes>
    </PageContainer>
  )
}

export default UsersPage
