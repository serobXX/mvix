import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useDrop } from 'react-dnd'
import { Link } from 'react-router-dom'
import { Paper, makeStyles, Grid } from '@material-ui/core'
import classNames from 'classnames'
import update from 'immutability-helper'

import { MaterialPopup } from 'components/Popup'
import { CircleIconButton } from 'components/buttons'
import {
  FormControlInput,
  FormControlNumericInput
} from 'components/formControls'
import { Text, TextWithTooltip } from 'components/typography'
import ActionDropdownButton from 'components/buttons/ActionDropdownButton'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'
import FormFooterLayout from 'components/footerLayout/FormFooterLayout'
import queryParamsHelper from 'utils/queryParamsHelper'

const useStyles = makeStyles(
  ({ colors, palette, type, fontSize, lineHeight, fontWeight }) => ({
    root: {
      padding: '25px',
      marginBottom: '15px',
      border: `1px solid ${palette[type].groupCard.border}`,
      borderLeft: '5px solid #3983ff',
      backgroundColor: palette[type].groupCard.background,
      borderRadius: '7px',
      boxShadow: `0 1px 4px 0 ${palette[type].groupCard.shadow}`,
      display: 'flex',
      alignItems: 'center'
    },
    groupTitle: {
      fontSize: fontSize.secondary,
      fontWeight: fontWeight.bold,
      lineHeight: lineHeight.secondary,
      color: palette[type].groupCard.titleColor,
      cursor: 'pointer'
    },
    groupTitleNotEditable: {
      cursor: 'unset'
    },
    groupItemsWrapper: {
      width: 325
    },
    groupItemsContainer: {
      padding: '10px 15px'
    },
    itemsLabel: {
      fontSize: fontSize.primary,
      lineHeight: lineHeight.primary,
      fontWeight: fontWeight.bold,
      color: palette[type].groupCard.item.label,
      marginTop: 10,
      width: 'fit-content'
    },
    itemsLabelUnderline: {
      textDecoration: 'underline',
      textDecorationStyle: 'dotted',
      textDecorationColor: colors.highlight,
      textUnderlineOffset: '2px',
      '&:hover': {
        cursor: 'pointer',
        textDecorationStyle: 'solid'
      }
    },
    popupRoot: {
      zIndex: 1399
    },
    userPermissionsDropdownContainer: {
      width: '400px'
    },
    userPermissionsDropdown: {},
    groupItemRoot: {
      flex: 1,
      paddingRight: 20
    },
    groupRow: {
      display: 'flex',
      padding: '5px 0px'
    },
    groupItemsWrap: {
      borderBottom: `1px solid ${palette[type].sideModal.content.border}`
    },
    groupItemLabel: {
      lineHeight: '42px',
      width: 'fit-content'
    },
    groupItemDelete: {
      fontSize: '16px',
      color: '#d35e37'
    },
    popupContent: {
      padding: '10px 5px 10px 15px'
    },
    popupText: {
      flexGrow: 1
    },
    qtyFormControl: {
      width: 60
    },
    footerRoot: {
      padding: '10px 10px 5px 0px'
    }
  })
)

const SolutionSetCard = ({
  rootClassName,
  title,
  itemsCount,
  itemsLabel,
  color,
  dropItemType,
  onMoveItem,
  onChangeGroupTitle,
  useActionDropdown,
  actionLink,
  isEditable,
  hideItemCount,
  actionDropdownOn = 'hover',
  actionList,
  itemList,
  onRemoveItem,
  item,
  onUpdate
}) => {
  const classes = useStyles()
  const [groupTitle, setGroupTitle] = useState(title)
  const [editTitle, setEditTitle] = useState(false)
  const [qtyValues, setQtyValues] = useState([])
  const [qtyEdited, setQtyEdited] = useState(false)

  const [{ isOver }, drop] = useDrop({
    accept: dropItemType || '',
    drop: e => onMoveItem(item, e),
    collect: monitor => ({
      isOver: monitor.isOver()
    })
  })

  useEffect(() => {
    setQtyValues(itemList.map(({ id, quantity }) => ({ id, quantity })))
  }, [itemList])

  const handleInputChange = useCallback(({ currentTarget }) => {
    setGroupTitle(currentTarget.value)
  }, [])

  const handleChangeTitle = useCallback(() => {
    setEditTitle(false)
    if (title !== groupTitle) {
      onChangeGroupTitle(item, groupTitle)
    }
  }, [item, groupTitle, onChangeGroupTitle, title])

  const handleEnterKeyPress = useCallback(
    event => {
      if (event.key === 'Enter') {
        handleChangeTitle()
      }
    },
    [handleChangeTitle]
  )

  const handleFocus = useCallback(() => {
    setGroupTitle(title)
    setEditTitle(true)
  }, [title])

  const handleBlur = useCallback(() => {
    handleChangeTitle()
  }, [handleChangeTitle])

  const handleChangeQty = useCallback(
    index => value => {
      setQtyValues(
        update(qtyValues, {
          [index]: {
            quantity: {
              $set: value
            }
          }
        })
      )
      setQtyEdited(true)
    },
    [qtyValues]
  )

  const handleCancelQty = () => {
    setQtyEdited(false)
    setQtyValues(itemList.map(({ id, quantity }) => ({ id, quantity })))
  }

  const handleSaveQty = () => {
    const qtys = qtyValues.reduce((a, b) => {
      a[b.id] = b.quantity
      return a
    }, {})
    onUpdate(item.id, {
      name: item.name,
      items: item.items.map(({ product, ..._item }) =>
        queryParamsHelper({
          ..._item,
          quantity: qtys[product.id],
          productId: product.id
        })
      )
    })
    setQtyEdited(false)
  }

  return (
    <Paper
      style={{
        borderLeftColor: color,
        borderRightColor: isOver ? color : '',
        borderTopColor: isOver ? color : '',
        borderBottomColor: isOver ? color : ''
      }}
      className={[classes.root, rootClassName].join(' ')}
      ref={drop}
    >
      <div className={classes.groupItemRoot}>
        <div
          onClick={() => {
            if (isEditable) {
              setEditTitle(true)
            }
          }}
          onKeyDown={handleEnterKeyPress}
        >
          {isEditable && editTitle ? (
            <FormControlInput
              autoFocus
              onFocus={handleFocus}
              onBlur={handleBlur}
              value={groupTitle}
              onChange={handleInputChange}
            />
          ) : (
            <Text
              rootClassName={classNames(classes.groupTitle, {
                [classes.groupTitleNotEditable]: !isEditable
              })}
            >
              {title}
            </Text>
          )}
        </div>
        {!hideItemCount && (
          <MaterialPopup
            disabled={itemsCount < 1}
            position="bottom left"
            on="hover"
            open={qtyEdited || undefined}
            trigger={
              <Text
                rootClassName={classNames(
                  classes.itemsLabel,
                  classes.itemsLabelUnderline
                )}
              >
                {itemsCount} {itemsLabel}
              </Text>
            }
            style={{
              width: '325px',
              borderRadius: '6px',
              animation: 'fade-in 200ms'
            }}
            contentClassName={classes.popupContent}
            withPortal
          >
            {itemList.map((_item, index) => (
              <Grid
                key={`group-item-${index}`}
                container
                className={classNames(classes.groupRow, {
                  [classes.groupItemsWrap]: index !== itemList.length - 1
                })}
                alignItems="center"
              >
                <Grid item className={classes.popupText}>
                  <TextWithTooltip
                    maxWidth={260}
                    rootClassName={classes.groupItemLabel}
                  >
                    {_item.title}
                  </TextWithTooltip>
                </Grid>

                <Grid item>
                  <FormControlNumericInput
                    placeholder="Qty"
                    value={qtyValues?.[index]?.quantity}
                    onChange={handleChangeQty(index)}
                    min={1}
                    marginBottom={false}
                    formControlContainerClass={classes.qtyFormControl}
                  />
                </Grid>

                {onRemoveItem && (
                  <Grid item className={classes.deleteIconWrapper}>
                    <CircleIconButton
                      className={classes.groupItemDelete}
                      onClick={() => onRemoveItem(item, _item)}
                    >
                      <i className={getIconClassName(iconNames.delete)} />
                    </CircleIconButton>
                  </Grid>
                )}
              </Grid>
            ))}
            {qtyEdited && (
              <FormFooterLayout
                resetLabel="Cancel"
                resetIconName={getIconClassName(iconNames.cancel)}
                submitIconName={getIconClassName(iconNames.save)}
                submitLabel="Save"
                onReset={handleCancelQty}
                onSubmit={handleSaveQty}
                rootClassName={classes.footerRoot}
              />
            )}
          </MaterialPopup>
        )}
      </div>
      {useActionDropdown ? (
        <ActionDropdownButton on={actionDropdownOn} actionLinks={actionList} />
      ) : (
        <CircleIconButton
          className={classNames('hvr-grow')}
          disabled={itemsCount < 1}
          component={Link}
          to={{
            pathname: actionLink,
            state: {
              name: title
            }
          }}
        >
          <i className={getIconClassName(iconNames.moreInfo)} />
        </CircleIconButton>
      )}
    </Paper>
  )
}

SolutionSetCard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  classes: PropTypes.object.isRequired,
  rootClassName: PropTypes.string,
  title: PropTypes.string,
  itemsCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  itemsLabel: PropTypes.string,
  color: PropTypes.string,
  dropItemType: PropTypes.string,
  onMoveItem: PropTypes.func,
  onChangeGroupTitle: PropTypes.func,
  useActionDropdown: PropTypes.bool,
  actionLink: PropTypes.string,
  isEditable: PropTypes.bool,
  hideItemCount: PropTypes.bool
}

SolutionSetCard.defaultProps = {
  rootClassName: '',
  title: '',
  itemsCount: 0,
  itemsLabel: 'Items',
  useActionDropdown: true,
  actionLink: '',
  isEditable: true,
  color: '#3983ff',
  dropItemType: '',
  onMoveItem: f => f,
  onChangeGroupTitle: f => f,
  hideItemCount: false,
  itemList: [],
  onDeleteItem: f => f
}

export default SolutionSetCard
