import { makeStyles } from '@material-ui/core'

import { TextWithTooltip } from 'components/typography'
import GridCardBase from '../GridCardBase'
import classNames from 'classnames'
import Tooltip from 'components/Tooltip'
import { useCallback, useEffect, useState } from 'react'
import { getFieldFromCustomFieldCode } from 'utils/customFieldUtils'
import CustomField from 'components/formControls/FormControlCustomField/CustomField'
import HoverOverDropdownButton from 'components/buttons/HoverOverDropdownButton'
import { BlueButton, WhiteButton } from 'components/buttons'
import Spacing from 'components/containers/Spacing'
import { getIconClassName } from 'utils/iconUtils'
import iconNames, { iconTypes } from 'constants/iconNames'
import { titleCase } from 'title-case'

const useStyles = makeStyles(
  ({ palette, typography, type, lineHeight, colors, fontSize }) => ({
    cardRoot: {
      boxShadow: palette[type].pages.dashboard.card.boxShadow
    },
    scrollbarRoot: {
      height: '326px !important'
    },
    contentWrap: {
      padding: '8px 0px'
    },
    row: {
      padding: '12px 22px',
      display: 'flex',
      alignItems: 'center',
      borderBottom: `1px solid ${palette[type].detailPage.profileCard.footer.border}`
    },
    icon: {
      color: colors.highlight,
      fontSize: 22,
      marginRight: 16,
      width: 25,
      height: 25
    },
    text: {
      ...typography.darkText[type],
      fontSize: fontSize.primary,
      lineHeight: lineHeight.primary
    },
    hoverOverActionButton: {
      fontSize: '1rem',
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
    formControlEnable: {
      marginTop: 0
    }
  })
)

const SummaryCard = ({
  title,
  list = [],
  layout = [],
  onEditSubmit = f => f,
  showEditorWithReadOnly = false
}) => {
  const classes = useStyles()
  const [editName, setEditName] = useState()
  const [editAll, setEditAll] = useState(false)
  const [values, setValues] = useState({})

  const loadValues = () => {
    setValues(
      list.reduce((a, b) => {
        a[b.name] = b.formValue
        return a
      }, {})
    )
  }

  useEffect(() => {
    if (showEditorWithReadOnly) {
      loadValues()
    }
    //eslint-disable-next-line
  }, [list, showEditorWithReadOnly])

  const handleEnableEdit = (name, value) => () => {
    setEditName(name)
    setValues({
      [name]: value
    })
  }

  const handleEditAllEnable = () => {
    setEditAll(true)
    loadValues()
  }

  const handleEditAllDisable = () => {
    setEditAll(false)
    setValues({})
    loadValues()
  }

  const handleChange = useCallback(({ target: { name, value } }) => {
    setValues(v => ({
      ...v,
      [name]: value
    }))
  }, [])

  const handleBlur = useCallback(() => {
    if (!editAll) {
      onEditSubmit(values)
      setEditName()
      !showEditorWithReadOnly && setValues({})
    }
  }, [onEditSubmit, values, editAll, showEditorWithReadOnly])

  const handleSubmit = useCallback(() => {
    onEditSubmit(values)
    setEditAll(false)
  }, [onEditSubmit, values])

  const renderEditor = useCallback(
    (name, icon) => {
      const field = getFieldFromCustomFieldCode(layout, name)
      const isEnable = !showEditorWithReadOnly || editName === name || editAll

      return field ? (
        <CustomField
          type={field.type}
          label={isEnable ? titleCase(field.name) : ''}
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
          autoFocus={isEnable && !editAll}
          readOnlyWithoutSelection={!isEnable}
          startAdornmentIcon={icon}
          formControlContainerClass={classNames({
            [classes.formControlEnable]: isEnable
          })}
          isRequired={field.isRequired}
        />
      ) : null
    },
    [
      layout,
      values,
      handleChange,
      handleBlur,
      showEditorWithReadOnly,
      editAll,
      editName,
      classes
    ]
  )

  return (
    <>
      <GridCardBase
        title={title}
        dropdown={false}
        rootClassName={classes.cardRoot}
        scrollbarRootClassName={classes.scrollbarRoot}
        contentWrapClassName={classes.contentWrap}
        iconButtonComponent={
          <HoverOverDropdownButton
            iconButtonClassName={classes.hoverOverActionButton}
            items={[
              {
                label: 'Edit',
                icon: getIconClassName(iconNames.edit, iconTypes.duotone),
                onClick: handleEditAllEnable
              }
            ]}
          />
        }
      >
        {list.map(({ icon, value, formValue, name, tooltip }, index) => (
          <div
            className={classes.row}
            key={`summary-card-item-${index}`}
            onDoubleClick={handleEnableEdit(name, formValue)}
          >
            {name === editName || editAll || showEditorWithReadOnly ? (
              renderEditor(name, icon)
            ) : (
              <>
                <Tooltip
                  title={tooltip}
                  arrow
                  placement="top"
                  disableHoverListener={!tooltip}
                >
                  <i className={classNames(icon, classes.icon)} />
                </Tooltip>

                <TextWithTooltip rootClassName={classes.text} maxWidth={200}>
                  {value}
                </TextWithTooltip>
              </>
            )}
          </div>
        ))}
      </GridCardBase>
      {editAll && (
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

export default SummaryCard
