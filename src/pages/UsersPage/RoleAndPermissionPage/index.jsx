import { Link, Route, Routes } from 'react-router-dom'
import { Grid, makeStyles } from '@material-ui/core'

import { BlueButton } from 'components/buttons'
import { routes } from 'constants/routes'
import Container from 'components/containers/Container'
import RolesListing from './RolesListing'
import {
  useAddRoleMutation,
  useDeleteRoleMutation,
  useLazyGetRolesQuery,
  useUpdateRoleMutation
} from 'api/roleApi'
import { BIG_LIMIT } from 'constants/app'
import AddEditRole from './AddEditRole'
import useNotifyAnalyzer from 'hooks/useNotifyAnalyzer'
import { notifyLabels } from 'constants/notifyAnalyzer'
import apiCacheKeys from 'constants/apiCacheKeys'
import Groups from './Groups'
import { useEffect, useState } from 'react'
import useDeterminePermissions from 'hooks/useDeterminePermissions'
import { permissionGroupNames } from 'constants/permissionGroups'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'
import { RoleDeleteModal, SideModal } from 'components/modals'
import { parseToAbsolutePath } from 'utils/urlUtils'
import { statusValues } from 'constants/commonOptions'
import exceptionNames from 'constants/beExceptionNames'
import { _get } from 'utils/lodash'

const useStyles = makeStyles(({ palette, type }) => ({
  addRoleButton: {
    marginRight: '17px'
  },
  containerRoot: {
    height: 'calc(100vh - 176px)',
    background: palette[type].body.background
  },
  leftContentRoot: {
    borderRight: `1px solid ${palette[type].sideModal.content.border}`
  },
  modalHeader: {
    borderBottom: `1px solid ${palette[type].sideModal.content.border}`
  }
}))

const RoleAndPermissionPage = () => {
  const classes = useStyles()
  const [activeRole, setActiveRole] = useState({})
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteModalData, setDeleteModalData] = useState()
  const roleLibraryPermission = useDeterminePermissions(
    permissionGroupNames.role
  )

  const [getRoles, { data: roles }] = useLazyGetRolesQuery()
  const [, post] = useAddRoleMutation({ fixedCacheKey: apiCacheKeys.role.add })
  const [, put] = useUpdateRoleMutation({
    fixedCacheKey: apiCacheKeys.role.update
  })
  const [, del] = useDeleteRoleMutation({
    fixedCacheKey: apiCacheKeys.role.delete
  })

  const fetcher = (params = {}) => {
    getRoles({ limit: BIG_LIMIT, status: statusValues.active, ...params })
  }

  useEffect(() => {
    if (!roles.length) {
      fetcher()
    }
    //eslint-disable-next-line
  }, [])

  const handleError = ({ error }) => {
    if (
      error.code === 422 &&
      error.exception === exceptionNames.rolesUpdateErrorException
    ) {
      setDeleteModalOpen(true)
      setDeleteModalData(_get(error, 'data.users', []))
    }
  }

  useNotifyAnalyzer({
    entityName: 'Role',
    watchArray: [post, put, del],
    labels: [notifyLabels.add, notifyLabels.update, notifyLabels.delete],
    onError: handleError,
    hideErrorNotification:
      _get(del, 'error.code') === 422 &&
      _get(del, 'error.exception') === exceptionNames.rolesUpdateErrorException
  })

  const handleSelectRole = role => {
    setActiveRole(role)
  }

  const handleCloseModal = () => {
    setDeleteModalData()
    setDeleteModalOpen(false)
  }

  return (
    <SideModal
      width="100%"
      title="Roles And Permissions"
      closeLink={parseToAbsolutePath(routes.users.list)}
      headerRestComponent={
        <>
          {roleLibraryPermission.create && (
            <BlueButton
              className={`hvr-radial-out ${classes.addRoleButton}`}
              component={Link}
              to={routes.users.toRoleAndPermAdd()}
              iconClassName={getIconClassName(iconNames.add)}
            >
              Add Role
            </BlueButton>
          )}
        </>
      }
      headerClassName={classes.modalHeader}
    >
      <Container variant={0} cols="3-11" rootClassName={classes.containerRoot}>
        <Grid item className={classes.leftContentRoot}>
          <RolesListing
            roleData={roles}
            activeRole={activeRole}
            onSelectRole={handleSelectRole}
            roleLibraryPermission={roleLibraryPermission}
            fetcher={fetcher}
          />
        </Grid>
        {activeRole?.id && (
          <Groups
            activeRole={activeRole}
            roleLibraryPermission={roleLibraryPermission}
          />
        )}
      </Container>
      <Routes>
        {roleLibraryPermission.create && (
          <Route path={routes.users.roleAndPermAdd} element={<AddEditRole />} />
        )}
        {roleLibraryPermission.update && (
          <Route
            path={routes.users.roleAndPermEdit}
            element={<AddEditRole />}
          />
        )}
      </Routes>
      {isDeleteModalOpen && (
        <RoleDeleteModal
          open={isDeleteModalOpen}
          onClose={handleCloseModal}
          data={deleteModalData}
          // isFetching={}
        />
      )}
    </SideModal>
  )
}

export default RoleAndPermissionPage
