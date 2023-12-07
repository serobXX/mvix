import { Grid, makeStyles } from '@material-ui/core'
import classNames from 'classnames'
import { MaterialPopup } from 'components/Popup'
import Container from 'components/containers/Container'
import { Text, TextWithTooltip } from 'components/typography'
import iconNames from 'constants/iconNames'
import { useCallback } from 'react'
import { getIconClassName } from 'utils/iconUtils'
import { _get } from 'utils/lodash'

const useStyles = makeStyles(
  ({ typography, colors, type, fontSize, lineHeight }) => ({
    listRoot: ({ onlyProfileList }) => ({
      width: '100%',
      alignSelf: 'center',
      padding: onlyProfileList ? 0 : '0px 13px 0px 18px'
    }),
    listValueIcon: {
      fontSize: 20,
      lineHeight: lineHeight.big,
      color: colors.highlight,
      marginRight: 10,
      minWidth: 25,
      width: 25,
      height: 30,
      textAlign: 'center'
    },
    listTitle: {
      ...typography.darkAccent[type],
      fontSize: fontSize.primary,
      lineHeight: lineHeight.primary,
      marginRight: 5
    },
    listValueNoDataText: {
      ...typography.darkText[type],
      fontSize: fontSize.primary,
      lineHeight: lineHeight.primary,
      flexGrow: 1,
      textAlign: 'left'
    },
    listCenterContent: {
      flexGrow: 1,
      display: 'flex'
    },
    listCenterContentSingle: {
      gridColumnStart: 1,
      gridColumnEnd: 3,
      padding: '0px 13px 0px 18px'
    },
    listValueText: {
      ...typography.darkText[type],
      fontSize: fontSize.primary,
      lineHeight: lineHeight.primary
    },
    ellipsisIcon: {
      marginLeft: 8,
      color: typography.darkText[type].color,
      fontSize: 22,
      cursor: 'pointer'
    },
    editorEllipsisIcon: {
      marginTop: 10
    },
    popupListRoot: {
      width: 'fit-content',
      alignSelf: 'center',
      padding: 16
    },
    editorFullWidth: {
      marginLeft: '-18px',
      width: 'calc(100% + 30px) !important',
      maxWidth: 'calc(100% + 30px)',
      marginRight: '-13px'
    }
  })
)

const ProfileList = ({
  list,
  editName,
  onEditField = f => f => f,
  profileCardEditor,
  editors,
  showEditor,
  renderEditors,
  isEditAll,
  rootClassName,
  onlyProfileList,
  showEditorWithReadOnly
}) => {
  const classes = useStyles({ onlyProfileList })

  const renderMoreInfo = useCallback(
    (_values, index, icon, isEmail, to) => (
      <MaterialPopup
        on="click"
        hasArrow
        trigger={
          <i
            className={classNames(
              getIconClassName(iconNames.moreInfo),
              classes.ellipsisIcon
            )}
          />
        }
      >
        <Container
          cols="1"
          rootClassName={classes.popupListRoot}
          isFormContainer
        >
          {_values.map((v, i) =>
            i === 0 ? null : (
              <Grid
                container
                key={`profile-list-${index}-${i}`}
                wrap="nowrap"
                onDoubleClick={onEditField(profileCardEditor, index, i)}
                alignItems="center"
              >
                {icon && (
                  <i className={classNames(icon, classes.listValueIcon)} />
                )}
                {(editName === `${profileCardEditor}-${index}-${i}` ||
                  isEditAll ||
                  showEditorWithReadOnly) &&
                !!_get(editors, `${profileCardEditor}.${index}`) &&
                !_get(
                  editors,
                  `${profileCardEditor}.${index}.isSingleEditor`
                ) ? (
                  renderEditors(
                    profileCardEditor,
                    index,
                    i,
                    !showEditorWithReadOnly ||
                      editName === `${profileCardEditor}-${index}-${i}` ||
                      isEditAll
                  )
                ) : (
                  <Text
                    rootClassName={classes.listValueText}
                    to={isEmail ? `mailto:${v}` : to || null}
                    data={v}
                  >
                    {v?.title || v || '-----'}
                  </Text>
                )}
              </Grid>
            )
          )}
        </Container>
      </MaterialPopup>
    ),
    [
      classes,
      onEditField,
      renderEditors,
      isEditAll,
      editName,
      editors,
      profileCardEditor,
      showEditorWithReadOnly
    ]
  )

  return list && !!list.length ? (
    <Container
      cols={onlyProfileList ? 2 : '1'}
      rootClassName={classNames(classes.listRoot, rootClassName)}
      isFormContainer
    >
      {list.map(
        (
          {
            icon,
            value,
            values: _values,
            render,
            noData = false,
            isEmail = false,
            title: _title,
            to,
            multiline = false,
            rightSideRender
          },
          index
        ) => (
          <Grid
            container
            key={`profile-list-${profileCardEditor}-${index}`}
            wrap="nowrap"
            onDoubleClick={onEditField(profileCardEditor, index)}
            alignItems={multiline ? 'flex-start' : 'center'}
            className={classNames({
              [classes.listCenterContentSingle]: _get(
                editors,
                `${profileCardEditor}.${index}.isSingleColumn`
              )
            })}
          >
            {icon &&
              (!showEditorWithReadOnly ||
                !showEditor(profileCardEditor, index)) && (
                <i className={classNames(icon, classes.listValueIcon)} />
              )}
            {_title && (
              <Text rootClassName={classes.listTitle}>{`${_title}: `}</Text>
            )}
            {showEditor(profileCardEditor, index) ? (
              <div
                className={classNames(classes.listCenterContent, {
                  [classes.editorFullWidth]: _get(
                    editors,
                    `${profileCardEditor}.${index}.fullWidth`,
                    false
                  )
                })}
              >
                {renderEditors(
                  profileCardEditor,
                  index,
                  null,
                  !showEditorWithReadOnly ||
                    showEditor(profileCardEditor, index, false)
                )}
              </div>
            ) : noData || (!render && !value && !_values?.length) ? (
              <Text rootClassName={classes.listValueNoDataText}>{'-----'}</Text>
            ) : (
              <div className={classes.listCenterContent}>
                {render ||
                  (multiline ? (
                    <Text
                      rootClassName={classes.listValueText}
                      to={
                        isEmail ? `mailto:${value || _values?.[0]}` : to || null
                      }
                      data={value || _values?.[0]}
                    >
                      {value || _values?.[0]?.title || _values?.[0] || '-----'}
                    </Text>
                  ) : (
                    <TextWithTooltip
                      rootClassName={classes.listValueText}
                      to={
                        isEmail ? `mailto:${value || _values?.[0]}` : to || null
                      }
                      data={value || _values?.[0]}
                      maxWidth={199}
                    >
                      {value || _values?.[0]?.title || _values?.[0] || '-----'}
                    </TextWithTooltip>
                  ))}
              </div>
            )}
            <div
              className={classNames({
                [classes.editorEllipsisIcon]: showEditor(
                  profileCardEditor,
                  index
                )
              })}
            >
              {rightSideRender ||
                (_values?.length > 1 &&
                  renderMoreInfo(_values, index, icon, isEmail, to))}
            </div>
          </Grid>
        )
      )}
    </Container>
  ) : null
}

export default ProfileList
