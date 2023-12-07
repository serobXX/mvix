import { Fragment } from 'react'
import { Grid, makeStyles } from '@material-ui/core'

import { BlueButton, WhiteButton } from 'components/buttons'
import { profileCardEditors } from 'constants/detailView'
import iconNames from 'constants/iconNames'
import { getIconClassName } from 'utils/iconUtils'
import ProfileList from './ProfileList'
import classNames from 'classnames'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: 30,
    justifyContent: 'space-between'
  },
  listRoot: ({ isEditAll, isSmallVariant }) => ({
    marginBottom: isSmallVariant ? 0 : isEditAll ? 25 : 35,
    ...(isSmallVariant ? { padding: 0 } : {})
  }),
  actionRoot: {
    gap: 16
  }
}))

const MiddleContent = ({
  list,
  isEditAll,
  editName,
  actionButtons,
  onEditField,
  showEditor,
  renderEditors,
  editors,
  onEditAllDisabled,
  onSave,
  hideFormActions,
  onlyProfileList,
  showEditorWithReadOnly,
  middleContentRootClassName,
  variant
}) => {
  const isSmallVariant = variant === 'small'
  const classes = useStyles({ isEditAll, isSmallVariant })

  return (
    <div className={classNames(classes.root, middleContentRootClassName)}>
      <ProfileList
        list={list}
        editName={editName}
        onEditField={onEditField}
        profileCardEditor={profileCardEditors.list}
        editors={editors}
        showEditor={showEditor}
        renderEditors={renderEditors}
        isEditAll={isEditAll}
        rootClassName={classes.listRoot}
        onlyProfileList={onlyProfileList}
        showEditorWithReadOnly={showEditorWithReadOnly}
      />
      {!hideFormActions &&
        (isEditAll || !!editName ? (
          <Grid
            container
            justifyContent="center"
            className={classes.actionRoot}
          >
            <WhiteButton
              variant="danger"
              iconClassName={getIconClassName(iconNames.cancel)}
              onClick={onEditAllDisabled}
            >
              Cancel
            </WhiteButton>
            <BlueButton
              onClick={onSave}
              iconClassName={getIconClassName(iconNames.save)}
            >
              Save
            </BlueButton>
          </Grid>
        ) : (
          <Grid
            container
            spacing={2}
            flexDirection="column"
            justifyContent="center"
          >
            {actionButtons.map(
              ({ isFilled = false, icon, text, onClick, render }, index) => (
                <Fragment key={`account-title-action-${index}`}>
                  {render ||
                    (isFilled ? (
                      <BlueButton onClick={onClick} iconClassName={icon}>
                        {text}
                      </BlueButton>
                    ) : (
                      <WhiteButton onClick={onClick} iconClassName={icon}>
                        {text}
                      </WhiteButton>
                    ))}
                </Fragment>
              )
            )}
          </Grid>
        ))}
    </div>
  )
}

export default MiddleContent
