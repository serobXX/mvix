import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'
import { BlueButton } from 'components/buttons'
import CancelButton from 'components/buttons/CancelButton'
import GridCardBase from 'components/cards/GridCardBase'
import Spacing from 'components/containers/Spacing'
import { FormControlEmailEditor } from 'components/formControls'
import Icon from 'components/icons/Icon'
import { froalaEntityNames } from 'constants/froalaConstants'
import iconNames from 'constants/iconNames'
import { requiredField } from 'constants/validationMessages'
import { useCallback, useEffect, useState } from 'react'
import { getIconClassName } from 'utils/iconUtils'

const useStyles = makeStyles(({ palette, type, colors }) => ({
  cardRoot: {
    display: 'flex',
    flexDirection: 'column',
    boxShadow: palette[type].pages.dashboard.card.boxShadow
  },
  cardContentRoot: {
    flexGrow: 1
  },
  footerRoot: {
    paddingRight: 25,
    gridColumnGap: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'absolute',
    top: 0,
    left: 0,
    paddingTop: 10,
    paddingBottom: 6
  },
  emailContainer: {
    '& .fr-view': {
      height: 308,
      border: 'none !important',
      background: 'transparent'
    },
    '& .fr-wrapper': {
      borderRadius: '0px !important',
      border: 'none !important',
      '& .fr-view': {
        height: 240
      }
    },
    '& .fr-bottom': {
      borderRadius: '0px !important',
      border: 'none !important'
    }
  },
  emptyEditor: {
    color: colors.error
  }
}))

const emailConfig = { toolbarBottom: true }

const EmailSignatureCard = ({ user, onUpdateUser, isEnableEdit, isFaded }) => {
  const [isEdit, setEdit] = useState(false)
  const [values, setValues] = useState({})
  const [error, setError] = useState()
  const classes = useStyles()

  useEffect(() => {
    if (isEnableEdit) {
      setEdit(true)
    }
  }, [isEnableEdit])

  useEffect(() => {
    setValues({ userSignature: user?.userSignature || '' })
  }, [user?.userSignature])

  const handleChange = useCallback(({ target: { value } }) => {
    setValues({ userSignature: value })
    if (!value) {
      setError(requiredField)
    } else setError()
  }, [])

  const handleCancel = () => {
    setEdit(false)
    setError()
    setValues({ userSignature: user?.userSignature || '' })
  }

  const handleSubmit = () => {
    onUpdateUser({
      ...values
    })
    setEdit(false)
  }
  return (
    <>
      <GridCardBase
        title={'Email Signature'}
        dropdown={false}
        rootClassName={classes.cardRoot}
        contentRootClassName={classes.cardContentRoot}
        removeScrollbar
        icon={!isEdit}
        iconButtonComponent={
          <Icon
            icon={getIconClassName(iconNames.edit3)}
            color="light"
            onClick={() => setEdit(true)}
          />
        }
        removeSidePaddings
        isFaded={!isEdit && isFaded}
        headerTextClasses={[
          classNames({
            [classes.emptyEditor]: !user?.userSignature
          })
        ]}
      >
        <FormControlEmailEditor
          name="userSignature"
          value={values.userSignature}
          error={error}
          touched
          onChange={handleChange}
          fullWidth
          marginBottom={false}
          hidePlaceholder
          config={emailConfig}
          formControlContainerClass={classes.emailContainer}
          readOnly={!isEdit}
          hideAttachment
          hideTemplate
          entity={froalaEntityNames.emailSign}
          isEdit
        />
      </GridCardBase>
      {isEdit && (
        <Spacing variant={0} paddingVert={1} rootClassName={classes.footerRoot}>
          {!isEnableEdit && <CancelButton onClick={handleCancel} />}
          <BlueButton
            onClick={handleSubmit}
            iconClassName={getIconClassName(iconNames.save)}
            disabled={!values.userSignature || !!error}
          >
            {'Save'}
          </BlueButton>
        </Spacing>
      )}
    </>
  )
}

export default EmailSignatureCard
