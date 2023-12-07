import { useCallback, useMemo } from 'react'
import { Grid, Paper, makeStyles } from '@material-ui/core'

import TableLibraryActionDropdown from 'components/tableLibrary/TableLibraryActionDropdown'
import { TextWithTooltip } from 'components/typography'
import { Checkbox } from 'components/checkboxes'
import classNames from 'classnames'
import { CheckboxSwitcher } from 'components/formControls'
import { statusReturnValues, statusValues } from 'constants/commonOptions'
import PropTypes from 'constants/propTypes'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'

const useStyles = makeStyles(
  ({ palette, type, fontSize, lineHeight, fontWeight }) => ({
    root: ({ tagBGColor }) => ({
      padding: 10,
      margin: '5px 10px',
      borderRadius: 6,
      borderLeft: '5px solid #3983ff',
      border: `1px solid ${palette[type].tagCard.border}`,
      backgroundColor: palette[type].tagCard.background,
      boxShadow: `0 2px 4px 0 ${palette[type].tagCard.shadow}`,
      borderLeftColor: tagBGColor,
      minHeight: 57,
      display: 'grid'
    }),
    checkboxWrap: {
      marginRight: 20
    },
    label: {
      fontSize: fontSize.primary,
      fontWeight: fontWeight.bold,
      lineHeight: lineHeight.primary,
      color: palette[type].tagCard.label.color
    },
    actionBtn: {
      minWidth: '61px',
      paddingLeft: '10px',
      paddingRight: '10px',
      color: palette[type].tagCard.button.color,
      boxShadow: '0 1px 0 0 rgba(216, 222, 234, 0.5)',

      '&:hover': {
        borderColor: '#1c5dca',
        backgroundColor: '#1c5dca',
        color: '#fff'
      }
    },
    actionRoot: {
      opacity: 0,
      visibility: 'hidden',
      transition: '0.3s',
      marginRight: '-30px',

      '$root:hover &': {
        opacity: 1,
        visibility: 'visible',
        marginRight: '0px'
      }
    },
    active: {
      opacity: 1,
      visibility: 'visible',
      marginRight: '0px'
    },
    iconButton: {
      padding: '6px 12px'
    },
    inactiveCard: {
      opacity: '0.6'
    }
  })
)

const TagCard = ({
  id,
  label,
  status,
  borderColor,
  item,
  editRoute,
  onEdit,
  onDelete,
  onUpdateStatus,
  selected,
  onToggleSelect,
  isMultiSelected,
  isDisabledFilter,
  hideEdit,
  hideDelete,
  hideStatus,
  actions,
  rightComponent,
  labelMaxWidth
}) => {
  const classes = useStyles({
    tagBGColor: borderColor
  })

  const handleClickSelect = useCallback(() => {
    onToggleSelect(id)
  }, [id, onToggleSelect])

  const actionLinks = useMemo(() => {
    if (actions) {
      return actions
    }
    return [
      {
        label: 'Edit',
        to: editRoute,
        clickAction: onEdit,
        render: !hideEdit
      },
      { divider: true },
      {
        label: 'Delete',
        icon: getIconClassName(iconNames.delete),
        clickAction: onDelete,
        render: !hideDelete
      }
    ]
  }, [actions, hideEdit, onDelete, hideDelete, editRoute, onEdit])

  return (
    <Paper
      className={classNames(classes.root, {
        [classes.inactiveCard]:
          status !== statusValues.active || isDisabledFilter
      })}
    >
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Grid container alignItems="center">
            <Grid item className={classes.checkboxWrap}>
              <Checkbox
                checked={selected}
                disabled={isDisabledFilter}
                onChange={handleClickSelect}
              />
            </Grid>
            <Grid item>
              <TextWithTooltip
                rootClassName={classes.label}
                maxWidth={labelMaxWidth}
              >
                {label}
              </TextWithTooltip>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container alignItems="center">
            {rightComponent}
            {!hideStatus && !isDisabledFilter && (
              <Grid item>
                <CheckboxSwitcher
                  returnValues={statusReturnValues}
                  value={status}
                  name="status"
                  onChange={onUpdateStatus(item)}
                  disabled={hideEdit}
                />
              </Grid>
            )}
            {!isDisabledFilter && (
              <Grid
                item
                className={classNames(classes.actionRoot, {
                  [classes.active]: !isMultiSelected && selected
                })}
              >
                <TableLibraryActionDropdown
                  actionLinks={actionLinks}
                  data={item}
                  iconButtonClassName={classes.iconButton}
                />
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  )
}

TagCard.propTypes = {
  id: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  status: PropTypes.statusField,
  borderColor: PropTypes.string,
  item: PropTypes.object,
  editRoute: PropTypes.string,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onUpdateStatus: PropTypes.func,
  selected: PropTypes.bool,
  onToggleSelect: PropTypes.func,
  isMultiSelected: PropTypes.bool,
  isDisabledFilter: PropTypes.bool,
  hideEdit: PropTypes.bool,
  hideDelete: PropTypes.bool,
  hideStatus: PropTypes.bool,
  actions: PropTypes.array
}

TagCard.defaultProps = {
  selected: false,
  onToggleSelect: f => f,
  onUpdateStatus: f => f,
  isMultiSelected: false,
  isDisabledFilter: false,
  hideEdit: false,
  hideDelete: false,
  hideStatus: false,
  status: statusValues.active,
  labelMaxWidth: 190
}

export default TagCard
