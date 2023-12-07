import { useCallback, useEffect, useMemo, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'
import { useFormik } from 'formik'

import CustomField from 'components/formControls/FormControlCustomField/CustomField'
import { BlueButton, WhiteButton } from 'components/buttons'
import HoverOverDropdownButton from 'components/buttons/HoverOverDropdownButton'
import GridCardBase from 'components/cards/GridCardBase'
import Spacing from 'components/containers/Spacing'
import customFieldNames from 'constants/customFieldNames'
import { customFieldTypes } from 'constants/customFields'
import iconNames, { iconTypes } from 'constants/iconNames'
import {
  createYupSchema,
  getCustomFieldValueByCode,
  getFieldFromCustomFieldCode
} from 'utils/customFieldUtils'
import { getIconClassName } from 'utils/iconUtils'
import { titleCase } from 'title-case'
import Yup from 'utils/yup'
import { FroalaWysiwygEditor } from 'components/formControls'

const useStyles = makeStyles(
  ({ palette, type, typography, colors, lineHeight, fontSize }) => ({
    cardRoot: {
      boxShadow: palette[type].pages.dashboard.card.boxShadow
    },
    scrollbarRoot: {
      height: '680px !important'
    },
    contentWrap: {
      padding: '8px 0px'
    },
    hoverOverActionButton: {
      padding: '5px 12px',
      color: typography.darkText[type].color,
      marginRight: '-9px',
      transition: '0.3s opacity, 0.3s visibility'
    },
    footerRoot: {
      paddingRight: 25,
      gridColumnGap: 16,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      position: 'absolute',
      top: 7,
      left: 0,
      background: palette[type].card.background
    },
    row: {
      padding: '8px 22px',
      display: 'flex',
      alignItems: 'flex-start'
    },
    icon: {
      color: colors.highlight,
      fontSize: 22,
      marginRight: 16,
      marginTop: 3,
      width: 25,
      height: 25
    },
    text: {
      ...typography.darkText[type],
      fontSize: fontSize.primary,
      lineHeight: lineHeight.primary,
      whiteSpace: 'pre-line'
    },
    productDescription: {
      minHeight: '560px !important'
    },
    fullWidthText: {
      flexGrow: 1
    },
    readOnlyField: {
      marginTop: 10
    },
    descriptionField: {
      '& .fr-wrapper .fr-element, & .fr-code, & > .fr-view': {
        height: `500px !important`
      },
      '& .fr-wrapper .fr-element, & .fr-code': {
        cursor: 'auto'
      }
    }
  })
)

const initialValues = {
  [customFieldNames.productName]: '',
  [customFieldNames.productDescription]: ''
}

const ProductDescriptionCard = ({
  item,
  layout,
  onEditSubmit,
  onlyEdit,
  isSubmitClick,
  isResetClick
}) => {
  const classes = useStyles()
  const [editAll, setEditAll] = useState(false)

  const validationSchema = useMemo(() => {
    const names = [
      customFieldNames.productName,
      customFieldNames.productDescription
    ]
    const filteredFields = layout.filter(({ code }) => names.includes(code))

    return Yup.object().shape({
      ...filteredFields.reduce(createYupSchema, {})
    })
  }, [layout])

  const onSubmit = useCallback(
    values => {
      onEditSubmit(values)
      !onlyEdit && setEditAll(false)
    },
    [onEditSubmit, onlyEdit]
  )

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setValues,
    handleSubmit
  } = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit
  })

  const loadValues = useCallback(() => {
    setValues({
      [customFieldNames.productName]: getCustomFieldValueByCode(
        item,
        customFieldNames.productName
      ),
      [customFieldNames.productDescription]: getCustomFieldValueByCode(
        item,
        customFieldNames.productDescription
      )
    })
  }, [setValues, item])

  useEffect(() => {
    loadValues()
    //eslint-disable-next-line
  }, [item])

  useEffect(() => {
    if (isSubmitClick) {
      handleSubmit()
    }
    //eslint-disable-next-line
  }, [isSubmitClick])

  useEffect(() => {
    if (isResetClick) {
      loadValues()
    }
    //eslint-disable-next-line
  }, [isResetClick])

  const handleEnableEdit = useMemo(
    () => () => {
      setEditAll(true)
    },
    []
  )

  const handleEditAllEnable = () => {
    setEditAll(true)
  }

  useEffect(() => {
    if (onlyEdit) {
      handleEditAllEnable()
    }
    //eslint-disable-next-line
  }, [onlyEdit])

  const handleEditAllDisable = () => {
    if (!onlyEdit) {
      setEditAll(false)
      loadValues()
    }
  }

  const renderEditor = useCallback(
    name => {
      const field = getFieldFromCustomFieldCode(layout, name)
      const Component =
        name === customFieldNames.productDescription
          ? FroalaWysiwygEditor
          : CustomField

      return (
        !!field && (
          <Component
            type={field.type}
            label={editAll ? titleCase(field.name) : ''}
            name={name}
            value={values?.[name]}
            onChange={handleChange}
            onBlur={handleBlur}
            lookupType={field.lookupType}
            options={field.options}
            tooltip={field.tooltip}
            tooltipType={field.tooltipType}
            property={field.property}
            withPortal
            autoFocus
            fullHeight={field.type === customFieldTypes.textarea}
            formControlContainerClass={classNames({
              [classes.readOnlyField]: !editAll,
              [classes.descriptionField]:
                field.type === customFieldTypes.textarea
            })}
            formControlInputClass={classNames({
              [classes.productDescription]:
                field.type === customFieldTypes.textarea && onlyEdit
            })}
            startAdornmentIcon={
              field.type !== customFieldTypes.textarea &&
              getIconClassName(iconNames.product, iconTypes.duotone)
            }
            error={errors[name]}
            touched={touched[name]}
            readOnlyWithoutSelection={!editAll}
            onDoubleClick={handleEnableEdit}
            fullWidth
            isRequired={field.isRequired}
            hidePlaceholder
          />
        )
      )
    },
    [
      layout,
      values,
      handleChange,
      handleBlur,
      classes,
      errors,
      touched,
      editAll,
      handleEnableEdit,
      onlyEdit
    ]
  )

  return (
    <>
      <GridCardBase
        title="Details"
        dropdown={false}
        rootClassName={classes.cardRoot}
        removeScrollbar
        contentWrapClassName={classes.contentWrap}
        iconButtonComponent={
          <HoverOverDropdownButton
            iconButtonClassName={classes.hoverOverActionButton}
            items={[
              {
                label: 'Edit',
                icon: getIconClassName(iconNames.edit),
                onClick: handleEditAllEnable
              }
            ]}
          />
        }
        icon={!onlyEdit}
      >
        <div>
          <div className={classes.row}>
            {renderEditor(customFieldNames.productName)}
          </div>
          <div className={classes.row}>
            {renderEditor(customFieldNames.productDescription)}
          </div>
        </div>
      </GridCardBase>
      {editAll && !onlyEdit && (
        <Spacing variant={0} paddingVert={1} rootClassName={classes.footerRoot}>
          <WhiteButton
            variant="danger"
            iconClassName={getIconClassName(iconNames.cancel)}
            onClick={handleEditAllDisable}
          >
            Cancel
          </WhiteButton>
          <BlueButton
            onClick={handleSubmit}
            iconClassName={getIconClassName(iconNames.save)}
          >
            Save
          </BlueButton>
        </Spacing>
      )}
    </>
  )
}

export default ProductDescriptionCard
