import { useEffect } from 'react'
import {
  useDeletePreferenceMutation,
  useLazyGetPreferencesQuery
} from 'api/preferenceApi'
import Spacing from 'components/containers/Spacing'
import Scrollbars from 'components/Scrollbars'
import { makeStyles } from '@material-ui/core'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'
import { TextWithTooltip } from 'components/typography'
import { CircleIconButton } from 'components/buttons'
import apiCacheKeys from 'constants/apiCacheKeys'
import useConfirmation from 'hooks/useConfirmation'
import { getDeleteConfirmationMessage } from 'utils/snackbarMessages'
import { Card } from 'components/cards'
import Container from 'components/containers/Container'
import { EmptyPlaceholder } from 'components/placeholder'

const useStyles = makeStyles(
  ({ palette, type, typography, fontSize, lineHeight, colors }) => ({
    root: {
      padding: '16px 32px 16px 16px'
    },
    rowRoot: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '5px 5px 5px 15px',
      background: palette[type].tableLibrary.body.row.background,
      cursor: 'pointer'
    },
    rowTextRoot: {
      flexGrow: 1,
      display: 'flex'
    },
    rowText: {
      ...typography.darkText[type],
      fontSize: fontSize.primary,
      lineHeight: lineHeight.primary
    },
    iconBtnRoot: {
      display: 'flex'
    },
    iconButton: {
      '& i': {
        color: typography.lightText[type].color,
        fontSize: 18
      }
    },
    emptyIcon: {
      color: colors.light
    },
    emptyText: {
      fontSize: fontSize.secondary,
      lineHeight: lineHeight.secondary,
      color: colors.light
    }
  })
)

const FilterViewSidebar = ({
  entity,
  selectedFilter,
  onApplyFilter = f => f,
  api,
  closePanel
}) => {
  const classes = useStyles()
  const [getPreferences, { data }] = useLazyGetPreferencesQuery()
  const [deleteItem] = useDeletePreferenceMutation({
    fixedCacheKey: apiCacheKeys.preference.delete
  })

  const { showConfirmation } = useConfirmation()

  useEffect(() => {
    getPreferences({
      entity
    })
    //eslint-disable-next-line
  }, [])

  const handleDelete =
    ({ id, name }) =>
    e => {
      e.stopPropagation()
      showConfirmation(getDeleteConfirmationMessage(name), () => {
        if (selectedFilter?.id === id) {
          onApplyFilter()
        }
        deleteItem(id)
      })
    }

  const handleViewFilter = item => () => {
    onApplyFilter(item)
    api && api.closeToolPanel()
    closePanel && closePanel()
  }

  return (
    <Scrollbars>
      <Spacing rootClassName={classes.root}>
        <Container cols="1">
          {!!data?.length ? (
            data.map(item => (
              <Card
                key={`table-filter-view-${item.id}`}
                rootClassName={classes.rowRoot}
                onClick={handleViewFilter(item)}
              >
                <div className={classes.rowTextRoot}>
                  <TextWithTooltip
                    maxWidth={190}
                    rootClassName={classes.rowText}
                  >
                    {item.name}
                  </TextWithTooltip>
                </div>
                <div className={classes.iconBtnRoot}>
                  <CircleIconButton
                    className={classes.iconButton}
                    onClick={handleDelete(item)}
                  >
                    <i className={getIconClassName(iconNames.delete)} />
                  </CircleIconButton>
                </div>
              </Card>
            ))
          ) : (
            <EmptyPlaceholder
              text="No Saved Views"
              iconClassName={classes.emptyIcon}
              textClassName={classes.emptyText}
            />
          )}
        </Container>
      </Spacing>
    </Scrollbars>
  )
}

export default FilterViewSidebar
