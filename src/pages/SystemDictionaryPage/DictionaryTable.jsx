import { useCallback, useEffect, useMemo, useState } from 'react'
import ResizeObserver from 'react-resize-observer'
import { Box, Grid, makeStyles } from '@material-ui/core'

import { TablePaper } from 'components/paper'
import { LibraryGridLoader } from 'components/loaders'
import { EmptyPlaceholder } from 'components/placeholder'
import useConfirmation from 'hooks/useConfirmation'
import { getDeleteConfirmationMessage } from 'utils/snackbarMessages'
import { CheckboxSelectAll } from 'components/checkboxes'
import Scrollbars from 'components/Scrollbars'
import { permissionTypes } from 'constants/permissionGroups'
import useUserPermissionGroupsByType from 'hooks/useUserPermissionGroupsByType'
import TableLibraryFooter from 'components/tableLibrary/TableLibraryFooter'
import {
  paginationValuesByView,
  tagPaginationValuesByView
} from 'constants/library'
import { TagCard } from 'components/cards'
import { routes } from 'constants/routes'
import { statusValues } from 'constants/commonOptions'
import {
  subtabNames,
  subtabPermissions,
  subtabTitles
} from 'constants/systemDictionary'
import { sortDataBySortOrder } from 'utils/customFieldUtils'

const useStyles = makeStyles(
  ({ palette, type, fontSize, lineHeight, fontWeight }) => ({
    root: {
      width: '100%',
      height: '100%',
      boxShadow: 'none',
      position: 'relative'
    },
    tableWrapper: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    tableHead: {
      paddingLeft: 24,
      borderBottomWidth: 1,
      borderBottomStyle: 'solid',
      borderBottomColor: palette[type].tableLibrary.body.cell.border
    },
    headLabel: {
      marginLeft: '30px',
      fontSize: fontSize.secondary,
      lineHeight: lineHeight.primary,
      fontWeight: fontWeight.secondary,
      color: '#74809a'
    },
    filterIconRoot: {
      marginRight: '7px',
      padding: '8px 12px',
      color: '#afb7c7'
    },
    tableHeadCellCheckbox: {
      paddingBottom: '6px'
    },
    container: ({ cols }) => ({
      padding: '20px 0',
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      transition: '0.3s'
    }),
    loaderRoot: {
      padding: '20px 10px',
      paddingTop: 70
    },
    listRoot: {
      padding: '0px 10px',
      flexGrow: 1
    },
    emptyPlaceholderRoot: {
      height: '100%'
    }
  })
)

const DictionaryTable = ({
  fetcher,
  activeTab,
  activeSubtab,
  data,
  meta,
  isFetching,
  selectedList,
  params,
  setParams,
  onDeleteItem,
  onUpdateStatus
}) => {
  const { showConfirmation } = useConfirmation()
  const [cols, setCols] = useState(5)
  const [containerWidth, setContainerWidth] = useState(1800)
  const classes = useStyles({
    cols
  })

  const updateGroups = useUserPermissionGroupsByType(permissionTypes.update)
  const deleteGroups = useUserPermissionGroupsByType(permissionTypes.delete)

  const { perPage, count, currentPage, lastPage, total } = meta || {}
  const { selectedIds } = selectedList
  const tagsIds = data.map(({ id }) => id)
  const isAllSelected = tagsIds.every(id => selectedIds.includes(id))
  const isSubjectLineTab = activeSubtab === subtabNames.subjectLine

  useEffect(() => {
    if (containerWidth) {
      setCols(Math.floor(containerWidth / (isSubjectLineTab ? 700 : 350)))
    }
    //eslint-disable-next-line
  }, [activeSubtab])

  const handleDeleteItem = (_, { id, name }) => {
    showConfirmation(getDeleteConfirmationMessage(name), () => {
      onDeleteItem(id)
    })
  }

  const handleSelect = id => {
    selectedList.toggle(id)
  }

  const handleSelectAll = () => {
    selectedList.pageSelect()
  }

  const handleResize = ({ width }) => {
    setCols(Math.floor(width / (isSubjectLineTab ? 700 : 350)))
    setContainerWidth(width)
  }

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
    [fetcher, setParams]
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

  const parsedData = useMemo(() => {
    if (activeSubtab !== subtabNames.stages) {
      return data
    }
    return sortDataBySortOrder([...data])
  }, [data, activeSubtab])

  return isFetching || count ? (
    <TablePaper className={classes.root}>
      <div className={classes.tableWrapper}>
        {!isFetching && (
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            className={classes.tableHead}
          >
            <Grid item>
              <Box py={1.5}>
                <Grid container alignItems="center">
                  <Grid item>
                    <CheckboxSelectAll
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      indeterminate={!isAllSelected && !!selectedIds.length}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        )}
        <div className={classes.listRoot}>
          <Scrollbars
            autoHeight
            autoHeightMax={`calc(100vh - ${isFetching ? 332 : 382}px)`}
          >
            {isFetching ? (
              <div className={classes.loaderRoot}>
                <LibraryGridLoader
                  rows={Math.ceil((params?.limit || perPage || 50) / cols)}
                  cols={cols}
                  rectWidth={containerWidth / cols - 20}
                  rectHeight={55}
                  rowSpacing={65}
                  padding={10}
                  maxWidth={containerWidth}
                />
              </div>
            ) : (
              <Grid container className={classes.container}>
                {parsedData.map((item, index) => (
                  <Grid item key={`system-dictionary-${activeSubtab}-${index}`}>
                    <TagCard
                      id={item.id}
                      label={isSubjectLineTab ? item.subjectText : item.name}
                      status={item.status}
                      item={item}
                      editRoute={routes.systemDictionary.toEdit(
                        item.id,
                        activeTab,
                        activeSubtab
                      )}
                      onDelete={handleDeleteItem}
                      onUpdateStatus={onUpdateStatus}
                      selected={selectedIds.includes(item.id)}
                      onToggleSelect={handleSelect}
                      isMultiSelected={selectedIds.length > 1}
                      hideEdit={
                        !updateGroups.includes(subtabPermissions[activeSubtab])
                      }
                      hideDelete={
                        !deleteGroups.includes(subtabPermissions[activeSubtab])
                      }
                      hideStatus={isSubjectLineTab}
                      isDisabledFilter={item.status === statusValues.disabled}
                      labelMaxWidth={isSubjectLineTab ? 625 : 190}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Scrollbars>
        </div>
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
      </div>
      <ResizeObserver onResize={handleResize} />
    </TablePaper>
  ) : (
    <EmptyPlaceholder
      text={subtabTitles[activeSubtab]?.emptyPlaceholder || 'No saved items'}
      rootClassName={classes.emptyPlaceholderRoot}
    />
  )
}

export default DictionaryTable
