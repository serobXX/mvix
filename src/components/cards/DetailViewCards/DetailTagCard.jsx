import { useCallback, useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'

import GridCardBase from '../GridCardBase'
import { TagChip } from 'components/chips'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'
import { FormControlSelectTag } from 'components/formControls'
import { convertArr, fromChipObj, tagToChipObj } from 'utils/select'
import Icon from 'components/icons/Icon'
import { EmptyPlaceholder } from 'components/placeholder'

const useStyles = makeStyles(
  ({ palette, type, typography, fontSize, lineHeight, colors }) => ({
    cardRoot: {
      display: 'flex',
      flexDirection: 'column',
      boxShadow: palette[type].pages.dashboard.card.boxShadow
    },
    cardContentRoot: {
      flexGrow: 1
    },
    cardContentWrap: {
      height: '100%',
      padding: '16px 16px',
      flexDirection: 'row',
      gap: 16
    },
    tagChipRoot: {
      gap: 16,
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: 10
    },
    tagChipLabel: {
      lineHeight: '16px'
    },
    tagChipDeleteIcon: {
      height: 12,
      width: 12,
      fontSize: 12,
      display: 'grid',
      placeItems: 'center'
    },
    addIcon: {
      ...typography.darkText[type],
      fontSize: fontSize.big
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

const DetailTagCard = ({
  entity,
  values,
  onChange,
  onlyEdit,
  isSubmitClick,
  isResetClick
}) => {
  const classes = useStyles()
  const [tags, setTags] = useState([])
  const [isEdit, setEdit] = useState(false)

  useEffect(() => {
    if (onlyEdit) {
      setEdit(true)
      setTags(convertArr(values, tagToChipObj))
    }
  }, [onlyEdit, values])

  useEffect(() => {
    if (isSubmitClick) {
      onChange({
        tag: convertArr(tags, fromChipObj)
      })
    }
    //eslint-disable-next-line
  }, [isSubmitClick])

  useEffect(() => {
    if (isResetClick) {
      setTags(convertArr(values, tagToChipObj))
    }
    //eslint-disable-next-line
  }, [isResetClick])

  const handleChange = useCallback(
    ({ target: { value } }) => {
      if (onlyEdit) {
        setTags(value)
      } else {
        onChange({
          tag: [...values, ...convertArr(value, fromChipObj)]
        })
        setEdit(false)
      }
    },
    [onChange, values, onlyEdit]
  )

  const handleDeleteTag = useCallback(
    ({ id }) =>
      () => {
        onChange({
          tag: values.filter(({ id: tagId }) => tagId !== id)
        })
      },
    [onChange, values]
  )

  return (
    <GridCardBase
      dropdown={false}
      title={'Tags'}
      iconButtonComponent={
        !isEdit && (
          <Icon
            icon={getIconClassName(iconNames.gridCardAdd)}
            onClick={() => setEdit(true)}
            className={classes.addIcon}
          />
        )
      }
      removeScrollbar
      rootClassName={classes.cardRoot}
      contentRootClassName={classes.cardContentRoot}
      contentWrapClassName={classes.cardContentWrap}
    >
      {!onlyEdit && values?.length ? (
        values.map((tag, index) => (
          <TagChip
            key={`${entity}-tag-${index}`}
            tag={tag}
            deleteIcon={
              <i
                style={{ color: tag.textColor }}
                className={classNames(
                  getIconClassName(iconNames.cancel),
                  classes.tagChipDeleteIcon
                )}
              />
            }
            onDelete={handleDeleteTag(tag)}
            classes={{
              root: classes.tagChipRoot,
              label: classes.tagChipLabel
            }}
          />
        ))
      ) : isEdit ? null : (
        <EmptyPlaceholder
          text="No Tag Assigned"
          requestText="Click to Add Tags"
          variant="small"
          fullHeight
          onClick={() => setEdit(true)}
        />
      )}
      {isEdit && (
        <FormControlSelectTag
          entityType={entity}
          name="tag"
          onChange={handleChange}
          onBlur={() => !onlyEdit && setEdit(false)}
          label="Add Tag"
          values={onlyEdit ? tags : undefined}
          marginBottom={false}
          hideOptions={onlyEdit ? [] : values.map(({ id }) => id)}
          fullWidth
          autoFocus={!onlyEdit}
          withPortal
        />
      )}
    </GridCardBase>
  )
}

export default DetailTagCard
