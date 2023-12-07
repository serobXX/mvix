import { useCallback, useMemo, useRef, useState } from 'react'

import { makeStyles } from '@material-ui/core'
import PageContainer from 'components/PageContainer'
import BaseTable from 'components/tableLibrary/BaseTable'
import iconNames from 'constants/iconNames'
import { tableEntities } from 'constants/library'
import { getIconClassName } from 'utils/iconUtils'
import { useLazyGetEmailsQuery } from 'api/emailApi'
import { getColumns, getFilters } from './config'
import useFilterPreference from 'hooks/useFilterPreference'
import { filterEntityValues } from 'constants/filterPreference'
import { BlueButton } from 'components/buttons'
import { ComposeEmailModal } from 'components/modals'
import useDeterminePermissions from 'hooks/useDeterminePermissions'
import { permissionGroupNames } from 'constants/permissionGroups'
import { useGetOauthQuery } from 'api/configApi'
import { oauthServiceName } from 'constants/oauthConstants'

const useStyles = makeStyles(() => ({
  addBtn: {
    marginRight: '17px'
  }
}))

const transformTitleValue = ({ subject }) => subject

const EmailPage = () => {
  const classes = useStyles()
  const permission = useDeterminePermissions(permissionGroupNames.email)
  const [isModalOpen, setModalOpen] = useState(false)
  const [viewEmailId, setViewEmailId] = useState()
  const tableRef = useRef()

  const { data: oauth, isFetching } = useGetOauthQuery(oauthServiceName.gmail)
  const [getItems] = useLazyGetEmailsQuery()

  const {
    staticFilterModel,
    setFilterModel,
    viewToolPanel,
    handleSaveFilter,
    selectedFilter,
    clearSelectedFilter
  } = useFilterPreference({
    entity: filterEntityValues.email
  })

  const redirectToViewPage = useCallback(({ id }) => {
    setModalOpen(true)
    setViewEmailId(id)
  }, [])

  const titleColumnDef = useMemo(
    () => ({
      headerName: 'Subject',
      field: 'subject',
      cellRendererParams: {
        linkView: true,
        onClick: (_, data) => redirectToViewPage(data)
      }
    }),
    [redirectToViewPage]
  )

  const sidebarToolPanels = useMemo(() => [viewToolPanel], [viewToolPanel])
  const columns = useMemo(() => getColumns(), [])
  const filters = useMemo(() => getFilters(), [])

  const fetcher = useCallback(
    async (params = {}) => {
      if (!!oauth?.length) {
        const data = await getItems({
          ...params,
          tokenId: [...oauth].reverse()?.[0]?.id
        }).unwrap()
        return data
      }
      return {
        data: [],
        meta: { currentPage: 1, total: 0 }
      }
    },
    [getItems, oauth]
  )

  const handleRefetch = useCallback(() => {
    if (tableRef.current) {
      tableRef.current.refresh()
    }
  }, [])

  const actions = useCallback(
    data => [
      {
        label: 'View',
        clickAction: () => redirectToViewPage(data)
      }
    ],
    [redirectToViewPage]
  )

  const handleCloseModal = () => {
    setModalOpen(false)
    setViewEmailId()
  }

  return (
    <PageContainer
      pageTitle="Emails"
      isShowSubHeaderComponent={false}
      ActionButtonsComponent={
        <>
          {permission.create && (
            <BlueButton
              className={`hvr-radial-out ${classes.addBtn}`}
              iconClassName={getIconClassName(iconNames.email)}
              onClick={() => setModalOpen(true)}
            >
              Compose an Email
            </BlueButton>
          )}
        </>
      }
    >
      <BaseTable
        entity={tableEntities.email}
        isLoading={isFetching}
        columns={columns}
        fetcher={fetcher}
        rowActions={actions}
        pagination={true}
        filters={filters}
        ref={tableRef}
        titleColumnDef={titleColumnDef}
        transformTitleValue={transformTitleValue}
        defaultColShow={10}
        showJdenticonIcon
        showProfilePicColumn
        sidebarToolPanels={sidebarToolPanels}
        onFilterChanged={setFilterModel}
        filterData={staticFilterModel}
        saveFilterItem={selectedFilter}
        onSaveFilter={handleSaveFilter}
        clearSelectedFilter={clearSelectedFilter}
      />
      {isModalOpen && permission.create && (
        <ComposeEmailModal
          open={isModalOpen}
          onClose={handleCloseModal}
          fetcher={handleRefetch}
          id={viewEmailId}
        />
      )}
    </PageContainer>
  )
}

export default EmailPage
