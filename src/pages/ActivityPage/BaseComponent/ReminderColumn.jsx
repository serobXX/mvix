import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'

import { MaterialPopup } from 'components/Popup'
import { Text } from 'components/typography'
import { reminderTypeOptions } from 'constants/activity'
import iconNames from 'constants/iconNames'
import { getIconClassName } from 'utils/iconUtils'
import { convertToPluralize } from 'utils/pluralize'

const useStyles = makeStyles(({ typography, type }) => ({
  root: {
    padding: 10
  },
  icon: {
    ...typography.lightAccent[type],
    fontSize: 18
  }
}))

const ReminderColumn = ({ value }) => {
  const classes = useStyles()
  return value?.length ? (
    <MaterialPopup
      trigger={
        <i
          className={classNames(
            getIconClassName(iconNames.reminder),
            classes.icon
          )}
        />
      }
    >
      <div className={classes.root}>
        {value.map(({ reminderType, reminderUnit, reminderTime }, index) => (
          <Text key={`reminder-value-${index}`}>
            {`${convertToPluralize(
              `${reminderTime} ${reminderUnit}`,
              reminderTime
            )} via ${
              reminderTypeOptions.find(({ value }) => value === reminderType)
                ?.label
            }`}
          </Text>
        ))}
      </div>
    </MaterialPopup>
  ) : (
    <Text> N/A </Text>
  )
}

export default ReminderColumn
