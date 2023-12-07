import { useCallback, useContext, useEffect, useState } from 'react'
import { Grid, makeStyles } from '@material-ui/core'

import { Card } from 'components/cards'
import AvatarUploadModal from './AvatarUploadModal'
import EditComponent from './EditComponent'
import useProfileCardForm from 'hooks/useProfileCardForm'
import TopContent from './TopContent'
import MiddleContent from './MiddleContent'
import BottomContent from './BottomContent'
import ProfileCardContext from './context'
import { CircularLoader } from 'components/loaders'
import { _get, _isEmpty, _pick } from 'utils/lodash'
import PropTypes from 'constants/propTypes'
import classNames from 'classnames'

const useStyles = makeStyles(({ type, palette, colors }) => ({
  cardWrapper: {
    width: '100%',
    cursor: 'default'
  },
  cardRoot: ({ variant }) => ({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '25px 18px',
    paddingTop: variant === 'small' ? 15 : 25,
    overflow: 'hidden',
    boxShadow: palette[type].pages.dashboard.card.boxShadow
  })
}))

const ProfileCard = ({
  title,
  avatar,
  avatarText,
  subTitleLabel,
  subTitle,
  topChipValue,
  topChipIcon,
  topChipProps,
  topComponent,
  actionButtons = [],
  displayList = [],
  beforeTitleList = [],
  owner,
  footerComponent,
  editors = {},
  onEditSubmit = f => f,
  layout,
  isAvatarEditable = true,
  isJdenticonIcon,
  onlyEdit,
  hideFormActions = false,
  hideHeader = false,
  onlyProfileList = false,
  initialValue,
  initialValidationSchema,
  hideOwnerIcon = false,
  footerRootClassName,
  isSubmitClick,
  isResetClick,
  isFetching,
  hideTitle,
  showEditorWithReadOnly,
  middleContentRootClassName,
  isEditAllFields = true,
  isAvatarActive = true,
  onAvatarClick,
  isTopChipActive = true,
  returnDataOnBlur = false,
  onBlur,
  disabledFields,
  isAdd,
  hideProfileIcon = false,
  hideActions = false,
  noEdit = false,
  actions,
  variant,
  topChipComponent,
  cardRootClassName,
  onChangeFormValid,
  actionProps
}) => {
  const [editName, setEditName] = useState('')
  const [editEditor, setEditEditor] = useState({})
  const [isEditAll, setEditAll] = useState(false)
  const [avatarUploadModal, setAvatarUploadModal] = useState(false)
  const [staticValues, setStaticValues] = useState({})
  const classes = useStyles({ variant })
  const { setForm } = useContext(ProfileCardContext)

  const loadValues = useCallback(() => {
    let _values = {}
    Object.values(editors).forEach(editor => {
      if (Array.isArray(editor)) {
        editor.forEach(e => {
          if (e?.name) _values[e.name] = e.value
          else if (e?.values) {
            _values = {
              ..._values,
              ...e.values
            }
          }
        })
      } else if (editor?.name) {
        _values[editor.name] = editor.value
      }
    })

    setStaticValues(_values)
  }, [editors])

  const handleEditAllDisable = useCallback(() => {
    if (!onlyEdit) {
      setEditAll(false)
      showEditorWithReadOnly ? loadValues() : setStaticValues({})
      setEditName(null)
      setEditEditor({})
    }
  }, [onlyEdit, showEditorWithReadOnly, loadValues])

  const onSubmit = useCallback(
    values => {
      onEditSubmit(values)
      handleEditAllDisable()
    },
    [onEditSubmit, handleEditAllDisable]
  )

  const {
    values,
    setFieldValue,
    errors,
    touched,
    handleSubmit,
    handleReset,
    handleBlur: handleBlurField,
    validateField,
    setFieldTouched,
    validateForm,
    isValid
  } = useProfileCardForm({
    layout,
    values: staticValues,
    onSubmit,
    initialValue,
    initialValidationSchema,
    isAdd
  })

  useEffect(() => {
    validateForm()
    //eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (onChangeFormValid) {
      onChangeFormValid(isValid)
    }
    //eslint-disable-next-line
  }, [isValid])

  useEffect(() => {
    setForm({
      handleSubmit,
      handleReset
    })
    //eslint-disable-next-line
  }, [handleSubmit, handleReset])

  useEffect(() => {
    if (isSubmitClick) {
      handleSubmit()
    }
    //eslint-disable-next-line
  }, [isSubmitClick])

  useEffect(() => {
    if (isResetClick) {
      handleReset()
    }
    //eslint-disable-next-line
  }, [isResetClick])

  useEffect(() => {
    if (showEditorWithReadOnly) {
      loadValues()
    }
    //eslint-disable-next-line
  }, [showEditorWithReadOnly, editors])

  const handleEditAllEnable = useCallback(() => {
    if (!noEdit) {
      setEditAll(true)
      loadValues()
    }
  }, [loadValues, noEdit])

  useEffect(() => {
    if (onlyEdit) {
      handleEditAllEnable()
    }
    //eslint-disable-next-line
  }, [onlyEdit, editors])

  const handleUploadAvatar = avatar => {
    onEditSubmit({ avatar })
    setAvatarUploadModal(false)
  }

  const showEditor = useCallback(
    (name, index, checkReadOnly = true) => {
      if (index >= 0) {
        return (
          (editName === `${name}-${index}` ||
            isEditAll ||
            (checkReadOnly ? showEditorWithReadOnly : false)) &&
          !!editors[name]?.[index]
        )
      }
      return (
        (editName === name ||
          isEditAll ||
          (checkReadOnly ? showEditorWithReadOnly : false)) &&
        !!editors[name] &&
        !noEdit
      )
    },
    [editName, editors, isEditAll, showEditorWithReadOnly, noEdit]
  )

  const handleEditFieldEnable = useCallback(
    (_editName, index, innerIndex) => e => {
      e.stopPropagation()
      if (isEditAllFields) {
        handleEditAllEnable()
      } else if (!isEditAll && showEditor(_editName, index)) {
        setEditName(
          _editName +
            (index >= 0
              ? `-${index}` + (innerIndex >= 0 ? `-${innerIndex}` : '')
              : '')
        )
        setEditEditor(
          _get(editors, `${_editName}${index >= 0 ? `.${index}` : ''}`)
        )
        if (!showEditorWithReadOnly) {
          const editor = editors[_editName] || {}
          if (Array.isArray(editor)) {
            setStaticValues({
              ...editor.reduce((a, b) => {
                if (b?.name) a[b.name] = b.value
                else if (b?.values) {
                  a = {
                    ...a,
                    ...b.values
                  }
                }
                return a
              }, {})
            })
          } else {
            const { name, value } = editor
            setStaticValues(
              name
                ? {
                    [name]: value
                  }
                : {}
            )
          }
        }
      }
    },
    [
      isEditAll,
      editors,
      showEditorWithReadOnly,
      showEditor,
      isEditAllFields,
      handleEditAllEnable
    ]
  )

  const handleBlur = useCallback(
    e => {
      handleBlurField(e)
      returnDataOnBlur && onBlur && onBlur(values)
    },
    [handleBlurField, returnDataOnBlur, onBlur, values]
  )

  const handleChange = useCallback(
    editor =>
      ({ target: { name, value } }) => {
        setFieldValue(name, value)
        if (editor.blurOnChange && !isEditAll) {
          setEditName()
          onEditSubmit({
            ...values,
            [name]: value
          })
          setStaticValues({})
        }
      },
    [values, isEditAll, onEditSubmit, setFieldValue]
  )

  const renderEditors = useCallback(
    (name, index, innerIndex, isEnable = true) => (
      <EditComponent
        name={name}
        index={index}
        innerIndex={innerIndex}
        editors={editors}
        handleChange={handleChange(editors[name])}
        values={values}
        handleBlur={handleBlur}
        layout={layout}
        autoFocus={isEnable && !isEditAll}
        errors={errors || {}}
        touched={touched || {}}
        isWidthAuto={onlyProfileList}
        readOnlyWithoutSelection={!isEnable}
        hideLabel={!isEnable}
        disabledFields={disabledFields}
      />
    ),
    [
      onlyProfileList,
      editors,
      handleChange,
      values,
      handleBlur,
      layout,
      isEditAll,
      errors,
      touched,
      disabledFields
    ]
  )

  const handleSaveValues = useCallback(async () => {
    if (isEditAll) {
      handleSubmit()
    } else if (editEditor && editName) {
      await new Promise(async resolve => {
        try {
          await Promise.all(
            (Object.keys(editEditor.values) || [editEditor.name]).map(
              async name => {
                await validateField(name)
                await setFieldTouched(name)
              }
            )
          )
          resolve()
        } catch (err) {
          resolve()
        }
      })
      if (_isEmpty(errors)) {
        setEditName()
        if (
          editEditor &&
          (editEditor.values
            ? !!Object.entries(editEditor.values).some(
                ([key, value]) => (value || '') !== (values[key] || '')
              )
            : editEditor.value !== values[editEditor.name])
        ) {
          onEditSubmit({
            ...(editEditor.values
              ? _pick(values, Object.keys(editEditor.values))
              : _pick(values, editEditor.name))
          })
        }
        !showEditorWithReadOnly && setStaticValues({})
      }
    }
  }, [
    handleSubmit,
    isEditAll,
    editName,
    validateField,
    errors,
    editEditor,
    values,
    showEditorWithReadOnly,
    onEditSubmit,
    setFieldTouched
  ])

  const handleAvatarClick = useCallback(() => {
    if (isAvatarEditable) {
      setAvatarUploadModal(true)
    }
    onAvatarClick && onAvatarClick()
  }, [onAvatarClick, isAvatarEditable])

  return (
    <Grid item className={classes.cardWrapper}>
      <Card
        rootClassName={classNames(classes.cardRoot, cardRootClassName)}
        dropdown={false}
        icon={false}
      >
        {isFetching && <CircularLoader />}
        {!hideHeader && (
          <TopContent
            title={title}
            avatarText={avatarText}
            avatar={avatar}
            subTitleLabel={subTitleLabel}
            subTitle={subTitle}
            topChipValue={topChipValue}
            topChipIcon={topChipIcon}
            topChipProps={topChipProps}
            isEditAll={isEditAll}
            topComponent={topComponent}
            isAvatarEditable={isAvatarEditable}
            isJdenticonIcon={isJdenticonIcon}
            showEditor={showEditor}
            renderEditors={renderEditors}
            onEditAll={handleEditAllEnable}
            onEditField={handleEditFieldEnable}
            onAvatarClick={handleAvatarClick}
            onlyEdit={onlyEdit}
            editName={editName}
            editors={editors}
            list={beforeTitleList}
            showEditorWithReadOnly={showEditorWithReadOnly}
            hideTitle={hideTitle}
            isAvatarActive={isAvatarActive}
            isTopChipActive={isTopChipActive}
            hideProfileIcon={hideProfileIcon}
            hideActions={hideActions}
            noEdit={noEdit}
            actions={actions}
            variant={variant}
            topChipComponent={topChipComponent}
            actionProps={actionProps}
          />
        )}

        <MiddleContent
          list={displayList}
          isEditAll={isEditAll}
          editName={editName}
          actionButtons={actionButtons}
          onEditField={handleEditFieldEnable}
          showEditor={showEditor}
          renderEditors={renderEditors}
          editors={editors}
          onEditAllDisabled={handleEditAllDisable}
          onSave={handleSaveValues}
          hideFormActions={hideFormActions}
          onlyProfileList={onlyProfileList}
          showEditorWithReadOnly={showEditorWithReadOnly}
          middleContentRootClassName={middleContentRootClassName}
          variant={variant}
        />

        <BottomContent
          owner={owner}
          footerComponent={footerComponent}
          showEditor={showEditor}
          renderEditors={renderEditors}
          onEditField={handleEditFieldEnable}
          hideOwnerIcon={hideOwnerIcon}
          rootClassName={footerRootClassName}
          showEditorWithReadOnly={showEditorWithReadOnly}
          variant={variant}
        />
      </Card>
      {avatarUploadModal && (
        <AvatarUploadModal
          open={avatarUploadModal}
          onUpload={handleUploadAvatar}
          onClose={() => setAvatarUploadModal(false)}
        />
      )}
    </Grid>
  )
}

ProfileCard.propType = {
  variant: PropTypes.oneOf(['regular', 'small'])
}

ProfileCard.defaultProps = {
  layout: [],
  editors: {}
}

export default ProfileCard
