import { Grid, makeStyles } from '@material-ui/core'
import classNames from 'classnames'
import UserPic from 'components/UserPic'
import HoverOverDropdownButton from 'components/buttons/HoverOverDropdownButton'
import { BaseChip } from 'components/chips'
import { Text, TextWithTooltip } from 'components/typography'
import { profileCardEditors } from 'constants/detailView'
import iconNames from 'constants/iconNames'
import { useMemo } from 'react'
import {
  getDarkenColorFromRgb,
  getLightenColorFromRgb,
  getRandomColor
} from 'utils/color'
import { getIconClassName } from 'utils/iconUtils'
import ProfileList from './ProfileList'

const useStyles = makeStyles(
  ({ typography, type, fontSize, palette, lineHeight }) => ({
    root: ({ isSmallVariant }) => ({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: isSmallVariant ? 12 : 25
    }),
    hoverOverActionButton: {
      color: typography.darkText[type].color,
      transition: '0.3s opacity, 0.3s visibility',
      fontSize: '1rem'
    },
    picWrap: {
      position: 'relative',
      cursor: 'pointer'
    },
    picAvatar: {
      width: 75,
      height: 75,
      fontSize: 27,
      color: palette[type].detailPage.profileCard.avatar.color
    },
    titleText: {
      ...typography.darkText[type],
      fontSize: fontSize.big,
      lineHeight: lineHeight.big,
      textAlign: 'center',
      marginBottom: 0
    },
    subTextEditorRoot: {
      marginTop: 5
    },
    subTitleRoot: {
      display: 'flex',
      alignItems: 'center',
      gap: 5,
      marginTop: '-5px'
    },
    subTitleText: {
      ...typography.lightText[type],
      fontSize: fontSize.small,
      lineHeight: lineHeight.small,
      fontStyle: 'italic',
      textAlign: 'center'
    },
    subTitleTextBold: {
      fontWeight: 700
    },
    picRoot: ({ isSmallVariant }) => ({
      marginTop: isSmallVariant ? 5 : 25,
      marginBottom: 5,
      width: '100%',
      display: 'flex',
      justifyContent: 'center'
    }),
    listRoot: {
      marginTop: 16,
      marginBottom: '-8px'
    },
    lowOpacity: {
      opacity: '0.6'
    },
    topChipRoot: {
      maxWidth: 255
    }
  })
)

const TopContent = ({
  title,
  avatarText,
  avatar,
  subTitleLabel,
  subTitle,
  topChipValue,
  topChipIcon,
  isEditAll = false,
  topComponent,
  isAvatarEditable = true,
  isJdenticonIcon = false,
  showEditor,
  renderEditors,
  onEditAll,
  onEditField,
  onAvatarClick,
  onlyEdit = false,
  list,
  editName,
  editors,
  topChipProps,
  showEditorWithReadOnly = false,
  hideTitle,
  isAvatarActive,
  isTopChipActive,
  hideProfileIcon,
  hideActions,
  noEdit,
  actions: parentActions,
  variant,
  topChipComponent,
  actionProps
}) => {
  const isSmallVariant = variant === 'small'
  const classes = useStyles({ isEditAll, isSmallVariant })

  const actions = useMemo(
    () => [
      {
        label: 'Edit',
        icon: getIconClassName(iconNames.edit),
        onClick: onEditAll,
        render: !noEdit
      },
      ...(parentActions || [])
    ],
    [onEditAll, noEdit, parentActions]
  )

  const chipRender = useMemo(() => {
    const randomColor = getRandomColor()
    return (
      <BaseChip
        label={topChipValue}
        iconClassName={topChipIcon}
        rootClassName={classes.topChipRoot}
        color={topChipProps?.color || getDarkenColorFromRgb(randomColor, 0.5)}
        backgroundColor={
          topChipProps?.backgroundColor ||
          topChipProps?.background ||
          getLightenColorFromRgb(randomColor, 0.5)
        }
        iconColor={
          topChipProps?.color || getDarkenColorFromRgb(randomColor, 0.5)
        }
        onDoubleClick={onEditField(profileCardEditors.topChip)}
        className={classNames({
          [classes.lowOpacity]: !isTopChipActive
        })}
      />
    )
  }, [
    topChipValue,
    topChipIcon,
    onEditField,
    topChipProps,
    isTopChipActive,
    classes.lowOpacity,
    classes.topChipRoot
  ])

  return (
    <div className={classes.root}>
      {topComponent || (
        <Grid container justifyContent="space-between" alignItems="center">
          {topChipComponent ||
            (showEditor(profileCardEditors.topChip, undefined, false)
              ? renderEditors(profileCardEditors.topChip)
              : chipRender)}
          {!onlyEdit && !hideActions && (
            <HoverOverDropdownButton
              iconButtonClassName={classes.hoverOverActionButton}
              items={actions}
              {...(actionProps || {})}
            />
          )}
        </Grid>
      )}

      <ProfileList
        list={list}
        editName={editName}
        onEditField={onEditField}
        profileCardEditor={profileCardEditors.beforeTitleList}
        editors={editors}
        showEditor={showEditor}
        renderEditors={renderEditors}
        isEditAll={isEditAll}
        rootClassName={classes.listRoot}
        showEditorWithReadOnly={showEditorWithReadOnly}
      />

      {!hideTitle && (
        <>
          {!hideProfileIcon && (
            <div className={classes.picRoot}>
              {(showEditorWithReadOnly || !isEditAll) && (
                <div
                  className={classNames(classes.picWrap, {
                    [classes.lowOpacity]: !isAvatarActive
                  })}
                  onClick={onAvatarClick}
                >
                  <UserPic
                    userName={avatarText || title}
                    imgSrc={avatar}
                    noStatus
                    avatarClassName={classes.picAvatar}
                    isPrintDouble
                    showJdenticonIcon={isJdenticonIcon}
                    jdenticonIconSize={'75px'}
                  />
                </div>
              )}
            </div>
          )}
          {!title && !showEditor(profileCardEditors.title) ? null : (
            <div onDoubleClick={onEditField(profileCardEditors.title)}>
              {showEditor(profileCardEditors.title) ? (
                renderEditors(
                  profileCardEditors.title,
                  null,
                  null,
                  !showEditorWithReadOnly ||
                    showEditor(profileCardEditors.title, undefined, false)
                )
              ) : (
                <TextWithTooltip
                  rootClassName={classes.titleText}
                  maxWidth={280}
                >
                  {title}
                </TextWithTooltip>
              )}
            </div>
          )}
          {!subTitleLabel &&
          !subTitle &&
          !showEditor(profileCardEditors.subTitle) ? null : (
            <div
              onDoubleClick={onEditField(profileCardEditors.subTitle)}
              className={classNames({
                [classes.subTextEditorRoot]: showEditorWithReadOnly
              })}
            >
              {showEditor(profileCardEditors.subTitle) ? (
                renderEditors(
                  profileCardEditors.subTitle,
                  null,
                  null,
                  !showEditorWithReadOnly ||
                    showEditor(profileCardEditors.subTitle, undefined, false)
                )
              ) : (
                <div className={classes.subTitleRoot}>
                  {subTitleLabel && (
                    <Text rootClassName={classes.subTitleText} maxWidth={250}>
                      {`${subTitleLabel}:`}
                    </Text>
                  )}
                  <TextWithTooltip
                    rootClassName={classNames(classes.subTitleText, {
                      [classes.subTitleTextBold]: !!subTitleLabel
                    })}
                    maxWidth={250}
                  >
                    {subTitle}
                  </TextWithTooltip>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default TopContent
