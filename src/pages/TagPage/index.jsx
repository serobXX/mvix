import { makeStyles } from '@material-ui/core'
import { Link, Route, Routes } from 'react-router-dom'

import PageContainer from 'components/PageContainer'
import { BlueButton } from 'components/buttons'
import { permissionGroupNames } from 'constants/permissionGroups'
import { routes, tableViews } from 'constants/routes'
import useDeterminePermissions from 'hooks/useDeterminePermissions'
import {
  useAddTagMutation,
  useBulkDeleteTagsMutation,
  useDeleteTagMutation,
  useLazyGetTagsQuery,
  useUpdateTagMutation
} from 'api/tagApi'
import { useCallback, useEffect, useMemo, useState } from 'react'
import useSelectedList from 'hooks/useSelectedList'
import useIds from 'hooks/useIds'
import TagTable from './TagTable'
import TableLibraryFooter from 'components/tableLibrary/TableLibraryFooter'
import {
  paginationValuesByView,
  tagPaginationValuesByView
} from 'constants/library'
import useFilter from 'hooks/useFilter'
import entityConstants from 'constants/entityConstants'
import TagFilter from './TagFilter'
import queryParamsHelper from 'utils/queryParamsHelper'
import AddEditTag from './AddEditTag'
import apiCacheKeys from 'constants/apiCacheKeys'
import useNotifyAnalyzer from 'hooks/useNotifyAnalyzer'
import { notifyLabels } from 'constants/notifyAnalyzer'
import useConfirmation from 'hooks/useConfirmation'
import { getBulkDeleteConfirmationMessage } from 'utils/snackbarMessages'
import iconNames from 'constants/iconNames'
import { getIconClassName } from 'utils/iconUtils'
import { filterEntityValues } from 'constants/filterPreference'
import useFilterPreference from 'hooks/useFilterPreference'

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    marginBottom: spacing(2)
  },
  addBtn: {
    marginRight: '17px'
  }
}))

const TagPage = () => {
  const classes = useStyles()
  const [params, setParams] = useState({
    limit: 100
  })
  const { showConfirmation } = useConfirmation()

  const {
    staticFilterModel,
    setFilterModel,
    viewToolPanel,
    handleSaveFilter,
    selectedFilter,
    clearSelectedFilter
  } = useFilterPreference({
    entity: filterEntityValues.tag
  })

  const [filterValues, updateFilter, resetFilter] = useFilter(
    entityConstants.TagLibrary,
    {},
    setFilterModel
  )

  const tagPermission = useDeterminePermissions(permissionGroupNames.tag)

  const [getTags, { data, isFetching, meta = {} }] = useLazyGetTagsQuery()
  const { perPage, count, currentPage, lastPage, total } = meta

  const [, post] = useAddTagMutation({
    fixedCacheKey: apiCacheKeys.tag.add
  })
  const [, put] = useUpdateTagMutation({
    fixedCacheKey: apiCacheKeys.tag.update
  })
  const [deleteItem, del] = useDeleteTagMutation({
    fixedCacheKey: apiCacheKeys.tag.delete
  })
  const [bulkDelete] = useBulkDeleteTagsMutation({
    fixedCacheKey: apiCacheKeys.tag.delete
  })

  const tagsIds = useIds(data)
  const selectedList = useSelectedList(tagsIds)

  const fetcher = useCallback(
    _params => {
      getTags(
        queryParamsHelper(
          {
            limit: 100,
            page: 1,
            ...params,
            ...filterValues,
            ..._params
          },
          ['entityType']
        )
      )
    },
    [getTags, params, filterValues]
  )

  useEffect(() => {
    fetcher()

    return () => {
      resetFilter()
    }
    //eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (staticFilterModel) {
      fetcher(staticFilterModel)
      updateFilter(staticFilterModel)
    }
    //eslint-disable-next-line
  }, [staticFilterModel])

  useNotifyAnalyzer({
    entityName: 'Tag',
    watchArray: [post, put, del],
    labels: [notifyLabels.add, notifyLabels.update, notifyLabels.delete],
    onSuccess: selectedList.clear
  })

  const handleChangePage = useCallback(
    ({ selected }) => {
      fetcher({
        page: selected + 1,
        limit: perPage
      })
      selectedList.clear()
    },
    [perPage, fetcher, selectedList]
  )

  const handleChangeRowsPerPage = useCallback(
    limit => {
      fetcher({
        page: 1,
        limit
      })
      setParams(p => ({
        ...p,
        limit
      }))
    },
    [fetcher]
  )

  const handlePressJumper = useCallback(
    ({ target: { value }, key }) => {
      const page = Number.parseInt(value)

      if (key === 'Enter' && page <= lastPage) {
        fetcher({
          page,
          limit: perPage
        })
      }
    },
    [perPage, lastPage, fetcher]
  )

  const handleBulkDelete = useCallback(() => {
    showConfirmation(getBulkDeleteConfirmationMessage('tags'), () => {
      bulkDelete(selectedList.selectedIds)
    })
  }, [bulkDelete, selectedList, showConfirmation])

  const handleResetFilter = useCallback(() => {
    resetFilter()
    clearSelectedFilter()
  }, [resetFilter, clearSelectedFilter])

  const sidePanels = useMemo(
    () => [
      {
        icon: getIconClassName(iconNames.tableViews),
        label: viewToolPanel?.labelDefault || 'Views',
        component: viewToolPanel?.toolPanel,
        componentProps: {
          ...(viewToolPanel?.toolPanelParams || {})
        }
      },
      {
        icon: getIconClassName(iconNames.filter),
        label: 'Filters',
        component: TagFilter,
        componentProps: {
          filterValues,
          updateFilter,
          handleResetFilter,
          fetcher,
          onSaveFilter: handleSaveFilter,
          selectedFilter
        },
        panelWidth: 350
      }
    ],
    [
      filterValues,
      updateFilter,
      fetcher,
      viewToolPanel,
      handleSaveFilter,
      selectedFilter,
      handleResetFilter
    ]
  )

  const commonActions = useMemo(
    () => [
      {
        label: 'Delete Tags',
        icon: getIconClassName(iconNames.delete),
        clickAction: handleBulkDelete,
        render: tagPermission.delete
      }
    ],
    [tagPermission.delete, handleBulkDelete]
  )

  return (
    <PageContainer
      pageTitle="Tags"
      isShowSubHeaderComponent={false}
      pageContainerClassName={classes.root}
      ActionButtonsComponent={
        <>
          {tagPermission.create && (
            <BlueButton
              className={`hvr-radial-out ${classes.addBtn}`}
              component={Link}
              to={routes.tags.toAdd(tableViews.list)}
              iconClassName={getIconClassName(iconNames.add)}
            >
              Add Tag
            </BlueButton>
          )}
        </>
      }
      FooterComponent={
        <>
          {!isFetching && count && (
            <TableLibraryFooter
              page={currentPage}
              pageCount={lastPage}
              onPageChange={handleChangePage}
              onPressJumper={handlePressJumper}
              perPage={perPage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              perPageOptions={
                tagPaginationValuesByView[paginationValuesByView.listView]
              }
              totalCount={total}
            />
          )}
        </>
      }
      showSidebar
      sidePanels={sidePanels}
      showActions={selectedList.selectedIds.length > 1}
      actions={commonActions}
    >
      <TagTable
        data={data}
        meta={meta}
        isFetching={isFetching}
        selectedList={selectedList}
        permissions={tagPermission}
        fetcher={fetcher}
        params={params}
        setParams={setParams}
        deleteItem={deleteItem}
      />

      <Routes>
        {tagPermission.create && (
          <Route path={routes.tags.add} element={<AddEditTag />} />
        )}
        {tagPermission.update && (
          <Route path={routes.tags.edit} element={<AddEditTag />} />
        )}
      </Routes>
    </PageContainer>
  )
}

export default TagPage
