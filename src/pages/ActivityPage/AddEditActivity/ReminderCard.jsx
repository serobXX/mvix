import { useCallback } from 'react'
import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'

import { _get } from 'utils/lodash'
import { marginBottom } from 'utils/styles'
import {
  FormControlNumericInput,
  FormControlReactSelect
} from 'components/formControls'
import { reminderTypeOptions, reminderUnitOptions } from 'constants/activity'
import Container from 'components/containers/Container'
import Spacing from 'components/containers/Spacing'
import { Text } from 'components/typography'
import { simulateEvent } from 'utils/formik'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'
import GridCardBase from 'components/cards/GridCardBase'

const useStyles = makeStyles(
  ({ spacing, palette, typography, type, fontSize }) => ({
    rowRoot: {
      gridTemplateColumns: '2fr 2fr 2fr 1fr !important',
      ...marginBottom(2, spacing)
    },
    rowAction: {
      gap: '10px !important',
      paddingTop: '5px',

      '& i': {
        ...typography.darkAccent[type],
        fontSize: 18,
        cursor: 'pointer'
      }
    },
    disabledButton: {
      cursor: 'unset !important',
      opacity: '0.5'
    },
    headerRoot: {
      fontSize: fontSize.primary,
      backgroundColor: palette[type].card.greyHeader.background,
      borderBottom: `1px solid ${palette[type].pages.adminSettings.content.border}`,
      padding: '8px 16px',
      gridTemplateColumns: '2fr 2fr 2fr 1fr !important',
      marginTop: '-10px',
      marginLeft: '-16px',
      width: 'calc(100% + 36px)'
    },
    contentRoot: {
      padding: '8px 0px',
      margin: 0
    },
    noRowAddIcon: {
      ...typography.darkAccent[type],
      paddingTop: '5px',
      fontSize: '18px',
      gridColumnStart: 8,
      gridColumnEnd: 10,
      cursor: 'pointer'
    },
    cardWrapper: {
      width: '100%',
      cursor: 'default'
    },
    cardRoot: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: '25px 18px',
      overflow: 'hidden',
      boxShadow: palette[type].pages.dashboard.card.boxShadow
    },
    cardContentRoot: {
      background: 'transparent',
      border: 'none'
    },
    scrollbarRoot: {
      height: '505px !important'
    }
  })
)

const ReminderCard = ({
  name,
  values,
  errors,
  touched,
  handleChange,
  handleBlur
}) => {
  const classes = useStyles()
  const handleAddRow = useCallback(() => {
    const newItems = [
      ...values,
      {
        reminderType: 'email',
        reminderUnit: 'minutes',
        reminderTime: ''
      }
    ]

    handleChange(simulateEvent(name, newItems))
  }, [values, handleChange, name])

  const handleRemoveRow = useCallback(
    index => () => {
      const newItems = [...values]
      newItems.splice(index, 1)

      handleChange(simulateEvent(name, newItems))
    },
    [values, handleChange, name]
  )

  const handleChangeItem = useCallback(
    index =>
      ({ target: { name: fieldName, value } }) => {
        handleChange(simulateEvent(`${name}.${index}.${fieldName}`, value))
      },
    [handleChange, name]
  )

  const handleBlurItem = useCallback(
    index =>
      ({ target: { name: fieldName, value } }) => {
        handleBlur(simulateEvent(`${name}.${index}.${fieldName}`, value))
      },
    [handleBlur, name]
  )

  return (
    <GridCardBase
      cardWrapperClassName={classes.cardWrapper}
      rootClassName={classes.cardRoot}
      contentRootClassName={classes.cardContentRoot}
      scrollbarRootClassName={classes.scrollbarRoot}
      removeSidePaddings
    >
      <Spacing>
        <Spacing>
          <Container rootClassName={classes.headerRoot}>
            <Text>Type</Text>
            <Text>Time</Text>
            <Text>Unit</Text>
            <Text></Text>
          </Container>
        </Spacing>
        <Spacing rootClassName={classes.contentRoot}>
          {values.length ? (
            values.map((item, index) => (
              <Container
                key={`reminders-row-${index}`}
                rootClassName={classes.rowRoot}
                isFormContainer
              >
                <FormControlReactSelect
                  name="reminderType"
                  value={item.reminderType}
                  onChange={handleChangeItem(index)}
                  error={_get(errors, `${index}.reminderType`, '')}
                  touched={_get(touched, `${index}.reminderType`, false)}
                  onBlur={handleBlurItem(index)}
                  options={reminderTypeOptions}
                  fullWidth
                  marginBottom={false}
                  isRequired
                />

                <FormControlNumericInput
                  name="reminderTime"
                  value={item.reminderTime}
                  onChange={handleChangeItem(index)}
                  error={_get(errors, `${index}.reminderTime`, '')}
                  touched={_get(touched, `${index}.reminderTime`, false)}
                  onBlur={handleBlurItem(index)}
                  marginBottom={false}
                  fullWidth
                  isRequired
                />
                <FormControlReactSelect
                  name="reminderUnit"
                  value={item.reminderUnit}
                  onChange={handleChangeItem(index)}
                  error={_get(errors, `${index}.reminderUnit`, '')}
                  touched={_get(touched, `${index}.reminderUnit`, false)}
                  onBlur={handleBlurItem(index)}
                  options={reminderUnitOptions}
                  fullWidth
                  marginBottom={false}
                  isRequired
                />

                <Container cols="2" rootClassName={classes.rowAction}>
                  <i
                    className={getIconClassName(iconNames.add2)}
                    onClick={handleAddRow}
                  />
                  <i
                    className={getIconClassName(iconNames.remove2)}
                    onClick={handleRemoveRow(index)}
                  />
                </Container>
              </Container>
            ))
          ) : (
            <Container rootClassName={classes.rowRoot}>
              <i
                className={classNames(
                  getIconClassName(iconNames.add2),
                  classes.noRowAddIcon
                )}
                onClick={handleAddRow}
              />
            </Container>
          )}
        </Spacing>
      </Spacing>
    </GridCardBase>
  )
}

ReminderCard.defaultProps = {
  values: [],
  errors: [],
  touched: [],
  handleChange: f => f,
  handleBlur: f => f
}

export default ReminderCard
