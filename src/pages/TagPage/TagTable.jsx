import { useCallback, useState } from 'react'
import ResizeObserver from 'react-resize-observer'
import { Box, Grid, makeStyles } from '@material-ui/core'

import { TablePaper } from 'components/paper'
import { LibraryGridLoader } from 'components/loaders'
import { EmptyPlaceholder } from 'components/placeholder'
import useConfirmation from 'hooks/useConfirmation'
import { getDeleteConfirmationMessage } from 'utils/snackbarMessages'
import { CheckboxSelectAll } from 'components/checkboxes'
import Scrollbars from 'components/Scrollbars'
import { TagCard } from 'components/cards'
import { routes } from 'constants/routes'
import { defaultTag } from 'constants/chipsColorPalette'
import Tooltip from 'components/Tooltip'
import classNames from 'classnames'
import iconNames from 'constants/iconNames'
import { getIconClassName } from 'utils/iconUtils'

const useStyles = makeStyles(
  ({ palette, type, fontSize, lineHeight, fontWeight, typography }) => ({
    root: {
      width: '100%',
      boxShadow: 'none',
      position: 'relative'
    },
    tableWrapper: {
      minHeight: 'calc(100vh - 250px)'
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
    tagsContainer: ({ cols }) => ({
      padding: '20px 0',
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      transition: '0.3s'
    }),
    loaderRoot: {
      padding: '20px 10px',
      paddingTop: 70
    },
    tagIcon: {
      ...typography.lightText[type],
      fontSize: fontSize.bigger,
      lineHeight: lineHeight.big
    }
  })
)

const TagTable = ({
  data,
  meta,
  isFetching,
  selectedList,
  permissions,
  params,
  deleteItem
}) => {
  const { showConfirmation } = useConfirmation()
  const [cols, setCols] = useState(5)
  const [containerWidth, setContainerWidth] = useState(1800)
  const classes = useStyles({
    cols
  })

  const { perPage, count } = meta
  const { selectedIds } = selectedList
  const tagsIds = data.map(({ id }) => id)
  const isAllSelected = tagsIds.every(id => selectedIds.includes(id))

  const handleDeleteItem = (_, { id, tag }) => {
    showConfirmation(getDeleteConfirmationMessage(tag), () => {
      deleteItem(id)
    })
  }

  const handleSelect = id => {
    selectedList.toggle(id)
  }

  const handleSelectAll = () => {
    selectedList.pageSelect()
  }

  const handleResize = ({ width }) => {
    setCols(Math.floor(width / 350))
    setContainerWidth(width)
  }

  const rightComponent = useCallback(
    ({ entityType }) => (
      <Tooltip title={entityType} arrow placement="top">
        <i
          className={classNames(
            getIconClassName(iconNames.tag),
            classes.tagIcon
          )}
        />
      </Tooltip>
    ),
    [classes.tagIcon]
  )

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
        <Scrollbars
          autoHeight
          autoHeightMax={`calc(100vh - ${isFetching ? 250 : 270}px)`}
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
            <Grid container className={classes.tagsContainer}>
              {data.map(tag => (
                <Grid item key={`tag-${tag.id}`}>
                  <TagCard
                    id={tag.id}
                    label={tag.tag}
                    borderColor={
                      tag.backgroundColor || defaultTag.backgroundColor
                    }
                    item={tag}
                    editRoute={routes.tags.toEdit(tag.id)}
                    onDelete={handleDeleteItem}
                    selected={selectedIds.includes(tag.id)}
                    onToggleSelect={handleSelect}
                    isMultiSelected={selectedIds.length > 1}
                    hideEdit={!permissions.update}
                    hideDelete={!permissions.delete}
                    hideStatus
                    rightComponent={rightComponent(tag)}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Scrollbars>
      </div>
      <ResizeObserver onResize={handleResize} />
    </TablePaper>
  ) : (
    <EmptyPlaceholder text={'No saved tags'} />
  )
}

export default TagTable
