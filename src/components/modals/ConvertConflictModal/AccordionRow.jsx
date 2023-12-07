import { useMemo, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'

import Accordion from 'components/Accordion'
import { FormControlCheckbox, FormControlRadio } from 'components/formControls'
import { Text, TextWithTooltip } from 'components/typography'
import { Card } from 'components/cards'
import Spacing from 'components/containers/Spacing'
import { _get } from 'utils/lodash'
import { conflictActionNames } from 'constants/leadConstants'

const useStyles = makeStyles(({ palette, typography, type, colors }) => ({
  headerTitle: {
    ...typography.darkAccent[type],
    width: 100,
    paddingTop: 11
  },
  headerTitleNoActions: {
    paddingTop: 0
  },
  headerMiddleRoot: {
    display: 'grid',
    flexWrap: 'nowrap',
    gridTemplateColumns: '1fr 30px 1fr',
    width: '100%'
  },
  radioRoot: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0px 10px',
    gap: 5,
    paddingBottom: 5,
    height: 'fit-content'
  },
  centerText: {
    ...typography.darkText[type],
    paddingTop: 11
  },
  headerCardArr: {
    padding: '0px 20px'
  },
  title1Root: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    borderBottom: `1px solid ${palette[type].sideModal.content.border}`,
    padding: '10px 0px',
    '& p': {
      ...typography.darkText[type]
    },
    '& i': {
      color: colors.highlight,
      fontSize: 16
    }
  },
  headerCard: {
    padding: '10px 20px',
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    '& p': {
      ...typography.darkText[type]
    },
    '& i': {
      color: colors.highlight,
      fontSize: 16
    }
  },
  summaryContent: {
    alignItems: 'flex-start',
    display: 'grid',
    gridTemplateColumns: '108px auto'
  },
  rowRoot: {
    display: 'grid',
    width: '100%',
    gridTemplateColumns: '108px 1fr 1fr',
    alignItems: 'center'
  },
  rowTitleRoot: {
    width: 100,
    marginRight: 8
  },
  rowTitle: {
    ...typography.lightAccent[type]
  },
  accordionContent: {
    flexDirection: 'column'
  },
  leftOption: {
    borderRight: `1px solid ${palette[type].sideModal.content.border}`
  },
  rightOption: {
    paddingLeft: 14
  },
  checkboxRoot: {
    paddingLeft: 10
  },
  existingListRoot: {
    marginLeft: 118,
    width: 422
  }
}))

const AccordionRow = ({
  title,
  actionName,
  fieldName,
  values,
  list,
  handleChange,
  title1,
  title2,
  icon1,
  icon2,
  hideExisting = false,
  disabledExisting = false,
  hideTitle2 = false,
  showTitle2CheckBox = false,
  title2CheckboxText,
  title2CheckboxName,
  createNewOptionsRender,
  existingList,
  hideActions = false,
  hideHeader = false
}) => {
  const classes = useStyles()
  const [open, setOpen] = useState(true)

  const headerComponent = useMemo(
    () => (
      <>
        <div className={classes.radioRoot}>
          {!hideActions && (
            <FormControlRadio
              name={actionName}
              label="Choose Existing"
              value={conflictActionNames.addToExisting}
              checked={values[actionName] === conflictActionNames.addToExisting}
              onChange={handleChange}
              fullWidth
              marginBottom={false}
              disabled={hideExisting || disabledExisting}
            />
          )}

          <Card rootClassName={classes.headerCard}>
            {!hideExisting && icon1 && <i className={icon1} />}
            <Text>{hideExisting ? 'No Matches' : title1}</Text>
          </Card>
        </div>
        <Text rootClassName={classes.centerText}>-OR-</Text>
        <div className={classes.radioRoot}>
          {!hideActions && (
            <FormControlRadio
              name={actionName}
              label="Create New"
              value={conflictActionNames.createNew}
              checked={values[actionName] === conflictActionNames.createNew}
              onChange={handleChange}
              fullWidth
              marginBottom={false}
            />
          )}

          {!hideTitle2 && (
            <Card rootClassName={classes.headerCard}>
              {icon2 && <i className={icon2} />}
              <Text>{title2}</Text>
            </Card>
          )}
          {showTitle2CheckBox && (
            <FormControlCheckbox
              name={title2CheckboxName}
              value={values[title2CheckboxName]}
              label={title2CheckboxText}
              onChange={handleChange}
              disabled={values[actionName] !== conflictActionNames.createNew}
              rootClassName={classes.checkboxRoot}
            />
          )}
        </div>
      </>
    ),
    [
      classes,
      actionName,
      values,
      handleChange,
      title1,
      title2,
      hideExisting,
      disabledExisting,
      icon1,
      icon2,
      hideTitle2,
      showTitle2CheckBox,
      title2CheckboxName,
      title2CheckboxText,
      hideActions
    ]
  )

  const isAccordionEnabled = useMemo(
    () =>
      hideActions ||
      (values[actionName] === conflictActionNames.addToExisting &&
        (list || existingList)) ||
      (values[actionName] === conflictActionNames.createNew &&
        !!createNewOptionsRender &&
        !values[title2CheckboxName]),
    [
      hideActions,
      values,
      list,
      existingList,
      actionName,
      createNewOptionsRender,
      title2CheckboxName
    ]
  )

  return (
    <Spacing>
      <Accordion
        open={isAccordionEnabled && open}
        toggle={() => isAccordionEnabled && setOpen(o => !o)}
        title={title}
        titleClasName={classNames(classes.headerTitle, {
          [classes.headerTitleNoActions]: hideActions
        })}
        headerComponent={!hideHeader && headerComponent}
        headerComponentClass={classes.headerMiddleRoot}
        summaryContentClassName={classes.summaryContent}
        contentClass={classes.accordionContent}
      >
        {existingList
          ? existingList.map(({ label, value }) => (
              <div
                className={classes.existingListRoot}
                key={`existing-list-${value}`}
              >
                <FormControlRadio
                  name={`${fieldName}`}
                  label={label || '-----'}
                  value={value}
                  checked={!!value && value === _get(values, `${fieldName}`)}
                  onChange={handleChange}
                  fullWidth
                  marginBottom={false}
                  disabled={!value}
                />
              </div>
            ))
          : list
          ? list.map(({ label, name, options }) => (
              <div key={`${fieldName}-${name}`} className={classes.rowRoot}>
                <div className={classes.rowTitleRoot}>
                  <TextWithTooltip
                    rootClassName={classes.rowTitleText}
                    maxWidth={100}
                  >
                    {label}
                  </TextWithTooltip>
                </div>
                {options.map((opt, index) => (
                  <div
                    className={classNames(classes.radioRoot, {
                      [classes.leftOption]: index === 0,
                      [classes.rightOption]: index === 1
                    })}
                    key={`${fieldName}-${name}-${opt.value}-${index}`}
                  >
                    <FormControlRadio
                      name={`${fieldName}.${name}`}
                      label={opt.label || '----'}
                      value={opt.value}
                      checked={
                        !!opt.value &&
                        opt.value === _get(values, `${fieldName}.${name}`)
                      }
                      onChange={handleChange}
                      fullWidth
                      marginBottom={false}
                      disabled={!opt.value}
                    />
                  </div>
                ))}
              </div>
            ))
          : createNewOptionsRender}
      </Accordion>
    </Spacing>
  )
}

export default AccordionRow
