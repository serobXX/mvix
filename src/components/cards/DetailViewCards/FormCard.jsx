import { makeStyles } from '@material-ui/core'
import CustomFieldForm from 'components/CustomFieldForm'

import GridCardBase from '../GridCardBase'
import { salutationOptions } from 'constants/commonOptions'
import customFieldNames from 'constants/customFieldNames'
import { FormControlReactSelect } from 'components/formControls'
import { useCallback, useEffect, useMemo, useState } from 'react'
import useCustomFieldFormConfig from 'hooks/useCustomFieldFormConfig'
import Spacing from 'components/containers/Spacing'
import { BlueButton, WhiteButton } from 'components/buttons'
import { convertArr, tagToChipObj } from 'utils/select'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'

const useStyles = makeStyles(({ palette, type }) => ({
  cardRoot: {
    display: 'flex',
    flexDirection: 'column'
  },
  cardContentRoot: {
    flexGrow: 1
  },
  cardContentWrap: {
    height: '100%',
    flexDirection: 'row'
  },
  salutationRoot: {
    width: 90
  },
  footerRoot: {
    paddingRight: 25,
    gridColumnGap: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    background: palette[type].secondary
  },
  formWrapper: ({ isEdit }) => ({
    height: isEdit ? 'calc(100% - 50px)' : '100%'
  })
}))

const FormCard = ({
  id,
  layout,
  getItem,
  item,
  post,
  put,
  addItem,
  updateItem,
  transformItem: transformData = f => {},
  permissionGroupName,
  permission,
  cols = 3
}) => {
  const [isEdit, setEdit] = useState(false)
  const classes = useStyles({ isEdit })

  const transformItem = useCallback(
    item => ({
      salutation: item.salutation,
      ...transformData(item)
    }),
    [transformData]
  )

  const {
    isSubmitting,
    setSubmitting,
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset
  } = useCustomFieldFormConfig({
    id,
    layout,
    item,
    updateItem,
    addItem,
    post,
    put,
    transformItem
  })

  useEffect(() => {
    if (post.isSuccess || put.isSuccess) {
      setSubmitting(false)
      getItem(id)
      closeEdit()
    } else if (post.isError || put.isError) {
      setSubmitting(false)
    }
    // eslint-disable-next-line
  }, [post, put])

  const staticFieldsOnComponents = useMemo(
    () => [
      {
        component: FormControlReactSelect,
        name: 'salutation',
        code: customFieldNames.firstName,
        props: {
          options: salutationOptions,
          formControlContainerClass: classes.salutationRoot
        }
      }
    ],
    [classes.salutationRoot]
  )

  const closeEdit = useCallback(() => {
    handleReset()
    setEdit(false)
  }, [handleReset])

  const parsedItem = useMemo(
    () => ({
      ...item,
      tag: convertArr(item?.tag, tagToChipObj)
    }),
    [item]
  )

  return (
    <GridCardBase
      dropdown={false}
      removeSidePaddings
      removeScrollbar
      rootClassName={classes.cardRoot}
      contentRootClassName={classes.cardContentRoot}
      contentWrapClassName={classes.cardContentWrap}
    >
      <CustomFieldForm
        fields={layout}
        name="customFields"
        values={isEdit ? values : parsedItem}
        isEdit
        permissionGroupName={permissionGroupName}
        staticFieldsOn={staticFieldsOnComponents}
        errors={errors}
        touched={touched}
        handleChange={handleChange}
        handleBlur={handleBlur}
        disabled={!isEdit}
        isUpperTab={true}
        cols={cols}
        handleDoubleClick={() => permission.update && setEdit(true)}
        wrapperClassName={classes.formWrapper}
      />
      {isEdit && (
        <Spacing variant={0} paddingVert={1} rootClassName={classes.footerRoot}>
          <WhiteButton
            variant="danger"
            onClick={closeEdit}
            iconClassName={getIconClassName(iconNames.cancel)}
          >
            Cancel
          </WhiteButton>
          <BlueButton
            onClick={handleSubmit}
            iconClassName={getIconClassName(iconNames.save)}
            disabled={isSubmitting}
          >
            Save
          </BlueButton>
        </Spacing>
      )}
    </GridCardBase>
  )
}

export default FormCard
