import { useCallback, useEffect, useMemo, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'

import { LibraryGridLoader } from 'components/loaders'
import ActivityRow from './ActivityRow'
import useDeterminePermissions from 'hooks/useDeterminePermissions'
import { permissionGroupNames } from 'constants/permissionGroups'
import {
  useDeleteActivityMutation,
  useLazyGetActivitiesQuery,
  useUpdateActivityMutation
} from 'api/activityApi'
import apiCacheKeys from 'constants/apiCacheKeys'
import useConfirmation from 'hooks/useConfirmation'
import { getDeleteConfirmationMessage } from 'utils/snackbarMessages'
import useNotifyAnalyzer from 'hooks/useNotifyAnalyzer'
import { notifyLabels } from 'constants/notifyAnalyzer'
import { BACKEND_DATE_FORMAT } from 'constants/dateTimeFormats'
import ActivityFilter from './ActivityFilter'
import Tooltip from 'components/Tooltip'
import { CircleIconButton } from 'components/buttons'
import classNames from 'classnames'
import { routes } from 'constants/routes'
import Scrollbars from 'components/Scrollbars'
import queryParamsHelper from 'utils/queryParamsHelper'
import handleBottomScroll from 'utils/handleBottomScroll'
import { getTitleBasedOnEntity } from 'utils/customFieldUtils'
import { _capitalize } from 'utils/lodash'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'
import GridCardBase from 'components/cards/GridCardBase'
import { themeTypes } from 'constants/ui'
import { activityTypeValues } from 'constants/activity'

const useStyles = makeStyles(({ type, typography, palette }) => ({
  titleRoot: {
    display: 'flex',
    gap: 10,
    alignItems: 'center'
  },
  addIcon: {
    ...typography.lightText[type],
    fontSize: 16,
    marginLeft: '-16px'
  },
  listRoot: {
    gap: 25,
    display: 'flex',
    flexDirection: 'column'
  },
  cardHeaderWrap: {
    width: 'fit-content'
  },
  cardWrapper: {
    height: 'auto'
  },
  cardContentWrap: {
    padding: 22
  },
  cardContentRoot: {
    backgroundColor:
      type === themeTypes.light
        ? '#f9fafc'
        : palette[type].tableLibrary.body.row.background
  }
}))

const ActivityCard = ({
  id,
  parentUrl = '/',
  entity,
  cardHeaderTextClasses,
  item = {}
}) => {
  const classes = useStyles()
  const permission = useDeterminePermissions(permissionGroupNames.activity)
  const { showConfirmation } = useConfirmation()
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [isInnerLoad, setInnerLoad] = useState(false)
  const [filterValues, setFilterValues] = useState({ type: 'upcoming' })

  const [getActivities, { isFetching, meta }] = useLazyGetActivitiesQuery()
  const [updateActivity, put] = useUpdateActivityMutation({
    fixedCacheKey: apiCacheKeys.activity.update
  })
  const [deleteActivity, del] = useDeleteActivityMutation()

  const fetcher = useCallback(
    async (params = {}) => {
      const query = queryParamsHelper(
        {
          relatedToEntity: entity,
          relatedToId: id,
          limit: 10,
          ...filterValues,
          ...params
        },
        ['activityStatus']
      )
      if (query.type === 'upcoming') {
        query.afterDate = moment().format(BACKEND_DATE_FORMAT)
      } else {
        query.beforeDate = moment()
          .subtract(1, 'day')
          .format(BACKEND_DATE_FORMAT)
      }
      delete query.type

      const { data: _data, meta: _meta } = await getActivities({
        ...query
      }).unwrap()

      setData(a => (_meta.currentPage === 1 ? [..._data] : [...a, ..._data]))
      setInnerLoad(false)
    },
    [getActivities, entity, id, filterValues]
  )

  useEffect(() => {
    fetcher()
    //eslint-disable-next-line
  }, [])

  useNotifyAnalyzer({
    fetcher,
    entityName: 'Activity',
    watchArray: [put, del],
    labels: [notifyLabels.update, notifyLabels.delete]
  })

  const handleDeleteActivity = useCallback(
    (_, { id }) => {
      showConfirmation(getDeleteConfirmationMessage('Activtiy'), () =>
        deleteActivity(id)
      )
    },
    [showConfirmation, deleteActivity]
  )

  const newItem = useMemo(
    () => ({
      relatedTo: item.createdBy,
      startedAt: `${moment(item.createdAt).format(
        BACKEND_DATE_FORMAT
      )} 00:00:00`,
      endedAt: `${moment(item.createdAt).format(
        BACKEND_DATE_FORMAT
      )}  23:59:59`,
      activityType: 'Task',
      activityStatus: 'Completed',
      priority: 'Normal',
      dueDate: moment(item.createdAt).format(BACKEND_DATE_FORMAT),
      subject: `New ${entity}`,
      relatedToEntity: 'Lead',
      description: `Created New ${entity}`,
      reminders: []
    }),
    [item, entity]
  )

  const handleAddActivityClick = useCallback(() => {
    navigate(routes.activity.toDetailAdd(parentUrl), {
      state: {
        relatedToEntity: entity,
        relatedToId: id,
        relatedToIdOption: {
          label: getTitleBasedOnEntity(entity, item),
          value: id
        },
        activityType: activityTypeValues.task
      }
    })
  }, [navigate, parentUrl, entity, id, item])

  const handleScrollEnd = useCallback(() => {
    if (!isFetching && meta?.currentPage < meta?.lastPage) {
      setInnerLoad(true)
      fetcher({
        page: meta?.currentPage + 1
      })
    }
  }, [fetcher, meta, isFetching])

  return (
    <GridCardBase
      title={`${_capitalize(filterValues.type)} Tasks`}
      removeScrollbar
      icon={false}
      headerWrapClassName={classes.cardHeaderWrap}
      contentRootClassName={classes.cardContentRoot}
      headerTextClasses={cardHeaderTextClasses}
      cardWrapperClassName={classes.cardWrapper}
      contentWrapClassName={classes.cardContentWrap}
      titleComponent={
        <div className={classes.titleRoot}>
          <ActivityFilter
            filterValues={filterValues}
            setFilterValues={setFilterValues}
            fetcher={fetcher}
          />

          <Tooltip title={`Add Task`} placement="top" arrow>
            <CircleIconButton
              className={classNames('hvr-grow', classes.addIcon)}
              onClick={handleAddActivityClick}
            >
              <i className={getIconClassName(iconNames.add2)} />
            </CircleIconButton>
          </Tooltip>
        </div>
      }
    >
      <Scrollbars
        autoHeight
        autoHeightMax="920px"
        onUpdate={handleBottomScroll(handleScrollEnd)}
      >
        {isFetching && !isInnerLoad ? (
          <LibraryGridLoader
            rows={4}
            cols={1}
            rectHeight={250}
            rectWidth={1070}
            footerHeight={0}
            maxWidth={1070}
          />
        ) : data.length ? (
          <div className={classes.listRoot}>
            {data.map(_item => (
              <ActivityRow
                key={`activity-row-${_item.id}`}
                item={_item}
                permission={permission}
                updateActivity={updateActivity}
                handleDeleteActivity={handleDeleteActivity}
                parentUrl={parentUrl}
              />
            ))}
            {isFetching && (
              <LibraryGridLoader
                rows={1}
                cols={1}
                rectHeight={250}
                rectWidth={1000}
                footerHeight={0}
                maxWidth={1000}
              />
            )}
          </div>
        ) : (
          <div className={classes.listRoot}>
            <ActivityRow item={newItem} />
          </div>
        )}
      </Scrollbars>
    </GridCardBase>
  )
}

export default ActivityCard
