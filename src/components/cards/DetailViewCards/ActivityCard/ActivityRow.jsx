import { useCallback, useMemo, useState } from 'react'
import { Grid, makeStyles } from '@material-ui/core'
import classNames from 'classnames'

import Container from 'components/containers/Container'
import { Text } from 'components/typography'
import {
  activityStatusOptions,
  priorityOptions,
  reminderTypeOptions
} from 'constants/activity'
import { _get } from 'utils/lodash'
import moment from 'moment'
import {
  DATE_TIME_VIEW_FORMAT,
  NORMAL_DATE_FORMAT,
  NORMAL_DATE_TIME_AP_FORMAT
} from 'constants/dateTimeFormats'
import { BACKEND_DATE_TIME_FORMAT } from 'constants/dateTimeFormats'
import { BACKEND_DATE_FORMAT } from 'constants/dateTimeFormats'
import { DATE_VIEW_FORMAT } from 'constants/dateTimeFormats'
import TableLibraryActionDropdown from 'components/tableLibrary/TableLibraryActionDropdown'
import { routes } from 'constants/routes'
import { Card } from 'components/cards'
import {
  FormControlDatePicker,
  FormControlDateTimeRangePicker,
  FormControlReactSelect
} from 'components/formControls'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'
import { parseActivityPayloadForNewData } from 'pages/ActivityPage/BaseComponent/config'

const useStyles = makeStyles(
  ({ palette, typography, type, fontSize, lineHeight }) => ({
    cardRoot: {
      padding: '20px 30px',
      boxShadow: palette[type].pages.dashboard.card.boxShadow
    },
    title: {
      ...typography.darkAccent[type],
      fontSize: fontSize.big,
      lineHeight: lineHeight.big,
      textTransform: 'capitalize'
    },
    iconRoot: {
      display: 'flex',
      gap: 20,
      alignItems: 'center',
      margin: '10px 0px',
      '& i': {
        ...typography.lightText[type],
        fontSize: 18,
        marginLeft: 3
      },
      '& p': {
        ...typography.darkText[type],
        fontSize: fontSize.primary,
        lineHeight: lineHeight.primary
      }
    },
    titleRoot: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    },
    chip: {
      marginTop: 4,
      borderRadius: 20,
      marginRight: 8,
      display: 'grid',
      placeItems: 'center',
      '& i': {
        ...typography.darkText[type],
        fontSize: 16
      }
    },
    rightSideRoot: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    },
    dueDateText: {
      ...typography.darkText[type]
    },
    actionIconBtn: {
      marginLeft: 5
    },
    header: {
      marginBottom: 16
    },
    descriptionRoot: {
      display: 'flex',
      gap: 20,
      marginBottom: 10,
      '& i': {
        ...typography.darkText[type],
        fontSize: 16,
        marginLeft: 3
      }
    },
    dropdownContainer: {
      width: 130
    },
    dropdownRoot: {
      background: 'transparent',
      '& fieldset': {
        border: 'none'
      },
      '& .react-select__single-value input': {
        ...typography.darkText[type],
        fontSize: fontSize.primary,
        lineHeight: lineHeight.primary
      }
    },
    dropdownColor: ({ activityStatusColor }) => ({
      '& .react-select__single-value input': {
        color: activityStatusColor,
        fontSize: fontSize.primary,
        lineHeight: lineHeight.primary
      }
    }),
    descriptionText: {
      whiteSpace: 'pre',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      '-webkit-line-clamp': 2,
      '-webkit-box-orient': 'vertical',
      transition: '0.3s display'
    },
    fullDescription: {
      display: 'block'
    }
  })
)

const editableNames = {
  dueDate: 'dueDate',
  date: 'date'
}

const ActivityRow = ({
  item,
  permission,
  updateActivity,
  handleDeleteActivity,
  parentUrl
}) => {
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [editableName, setEditableName] = useState()
  const [values, setValues] = useState({})
  const activityStatus = useMemo(
    () =>
      activityStatusOptions.find(
        ({ value }) => value === item.activityStatus
      ) || {},
    [item.activityStatus]
  )

  const classes = useStyles({
    activityStatusColor: activityStatus?.color
  })

  const actionLinks = useMemo(
    () => [
      {
        label: 'Edit',
        to: ({ id }) => routes.activity.toDetailEdit(parentUrl, id),
        render: permission?.update
      },
      {
        label: 'Delete',
        icon: getIconClassName(iconNames.delete),
        clickAction: handleDeleteActivity,
        render: permission?.delete
      }
    ],
    [permission, handleDeleteActivity, parentUrl]
  )

  const handleChange = ({ target: { name, value } }) => {
    if (value !== item.activityStatus) {
      updateActivity(
        parseActivityPayloadForNewData(item, {
          [name]: value
        })
      ).unwrap()
    }
    setEditableName()
  }

  const handleEnabledField = field => () => {
    if (updateActivity) {
      if (field === editableNames.date) {
        setValues({
          startedAt: moment(item.startedAt, BACKEND_DATE_TIME_FORMAT).format(
            NORMAL_DATE_TIME_AP_FORMAT
          ),
          endedAt: moment(item.endedAt, BACKEND_DATE_TIME_FORMAT).format(
            NORMAL_DATE_TIME_AP_FORMAT
          )
        })
      }
      setEditableName(field)
    }
  }

  const handleChangeValues = ({ target: { name, value } }) => {
    setValues(v => ({
      ...v,
      [name]: value
    }))
  }

  const handleBlurValues = useCallback(() => {
    updateActivity(
      parseActivityPayloadForNewData(item, {
        ...values,
        startedAt: moment(values.startedAt, NORMAL_DATE_TIME_AP_FORMAT).format(
          BACKEND_DATE_TIME_FORMAT
        ),
        endedAt: moment(values.endedAt, NORMAL_DATE_TIME_AP_FORMAT).format(
          BACKEND_DATE_TIME_FORMAT
        )
      })
    ).unwrap()
    setEditableName()
  }, [values, updateActivity, item])

  return (
    <Card rootClassName={classes.cardRoot}>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        wrap="wrap"
        className={classes.header}
      >
        <div className={classes.titleRoot}>
          <div className={classes.chip}>
            <i className={getIconClassName(iconNames.subject)} />
          </div>
          <Text rootClassName={classes.title}>{item.subject}</Text>
        </div>
        <div className={classes.rightSideRoot}>
          <FormControlReactSelect
            name="activityStatus"
            value={item.activityStatus}
            options={activityStatusOptions}
            onChange={handleChange}
            formControlContainerClass={classes.dropdownContainer}
            formControlRootClass={classNames(
              classes.dropdownRoot,
              classes.dropdownColor
            )}
            withPortal
            marginBottom={false}
            readOnly={!updateActivity}
          />
          <Text>Due:</Text>
          {editableName === editableNames.dueDate ? (
            <FormControlDatePicker
              name="dueDate"
              value={moment(item.dueDate, BACKEND_DATE_FORMAT).format(
                NORMAL_DATE_FORMAT
              )}
              onChange={handleChange}
              onBlur={() => setEditableName()}
              marginBottom={false}
              autoFocus
              withPortal
            />
          ) : (
            <>
              <Text onClick={handleEnabledField(editableNames.dueDate)}>
                <i className={getIconClassName(iconNames.date)} />
              </Text>

              <Text
                rootClassName={classes.dueDateText}
                onClick={handleEnabledField(editableNames.dueDate)}
              >
                {moment(item.dueDate, BACKEND_DATE_FORMAT).format(
                  DATE_VIEW_FORMAT
                )}
              </Text>
            </>
          )}
          <TableLibraryActionDropdown
            actionLinks={actionLinks}
            data={item}
            iconButtonClassName={classes.actionIconBtn}
          />
        </div>
      </Grid>
      <div className={classes.descriptionRoot}>
        <i className={getIconClassName(iconNames.description)} />
        <div>
          <Text
            rootClassName={classNames(classes.descriptionText, {
              [classes.fullDescription]: showFullDescription
            })}
            onClick={() => setShowFullDescription(s => !s)}
          >
            {item.description}
          </Text>
        </div>
      </div>
      <Container cols="2-3-1">
        <div className={classes.iconRoot}>
          <i className={getIconClassName(iconNames.salesPerson)} />
          <Text>
            {`${_get(item, 'relatedTo.firstName', '')} ${_get(
              item,
              'relatedTo.lastName',
              ''
            )}`}
          </Text>
        </div>
        <div className={classes.iconRoot}>
          {editableName === editableNames.date ? (
            <FormControlDateTimeRangePicker
              startDateTimeName="startedAt"
              endDateTimeName="endedAt"
              values={values}
              onChange={handleChangeValues}
              onBlurAll={handleBlurValues}
              marginBottom={false}
              autoFocus
              isSingleField
              fullWidth
              withPortal
            />
          ) : (
            <>
              <i
                className={getIconClassName(iconNames.date)}
                onClick={handleEnabledField(editableNames.date)}
              />

              <Text onClick={handleEnabledField(editableNames.date)}>
                {item.startedAt || item.endedAt
                  ? `${moment(item.startedAt, BACKEND_DATE_TIME_FORMAT).format(
                      DATE_TIME_VIEW_FORMAT
                    )} - ${moment(
                      item.endedAt,
                      BACKEND_DATE_TIME_FORMAT
                    ).format(DATE_TIME_VIEW_FORMAT)}`
                  : '-----'}
              </Text>
            </>
          )}
        </div>
        <div className={classes.iconRoot}>
          <i className={getIconClassName(iconNames.activityPriority)} />
          <FormControlReactSelect
            name="priority"
            value={item.priority}
            options={priorityOptions}
            onChange={handleChange}
            formControlContainerClass={classes.dropdownContainer}
            formControlRootClass={classes.dropdownRoot}
            marginBottom={false}
            readOnly={!updateActivity}
            withPortal
          />
        </div>
      </Container>
      {!!item?.reminders?.length && (
        <div className={classes.iconRoot}>
          <i className={getIconClassName(iconNames.reminder)} />
          <div>
            {item.reminders.map(
              ({ reminderTime, reminderType, reminderUnit }, index) => (
                <Text key={`reminder-${index}`}>
                  {`Reminder set for ${reminderTime} ${reminderUnit} before ${moment(
                    item.dueDate,
                    BACKEND_DATE_FORMAT
                  ).format(DATE_VIEW_FORMAT)} via ${
                    reminderTypeOptions.find(
                      ({ value }) => value === reminderType
                    )?.label || reminderType
                  }`}
                </Text>
              )
            )}
          </div>
        </div>
      )}
    </Card>
  )
}

export default ActivityRow
