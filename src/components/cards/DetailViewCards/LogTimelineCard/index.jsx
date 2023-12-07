import { useCallback, useEffect, useMemo, useState } from 'react'
import { Grid, makeStyles } from '@material-ui/core'

import { LogTimelineLoader } from 'components/loaders'
import { EmptyPlaceholder } from 'components/placeholder'
import TimelineCard from './TimelineCard'
import { useLazyGetLogsQuery } from 'api/logApi'
import queryParamsHelper from 'utils/queryParamsHelper'
import handleBottomScroll from 'utils/handleBottomScroll'
import Scrollbars from 'components/Scrollbars'
import Accordion from 'components/Accordion'

const useStyles = makeStyles(({ palette, type, typography, fontSize }) => ({
  cardWrapper: {
    width: '100%',
    height: 'auto'
  },
  accordionRoot: {
    background: palette[type].pages.dashboard.card.background,
    boxShadow: palette[type].pages.dashboard.card.boxShadow,
    paddingTop: 12,
    border: 'none',
    borderRadius: 4
  },
  accordionHeader: {
    background: 'transparent',
    padding: '0px 27px',
    marginBottom: 6,
    borderBottom: `5px solid ${palette[type].pages.dashboard.card.background} !important`
  },
  accordionContent: {
    border: '5px solid ' + palette[type].pages.dashboard.card.background,
    borderTop: 'none',
    borderRightWidth: '4px',
    backgroundColor: palette[type].tableLibrary.body.row.background
  },
  accordionTitle: {
    ...typography.darkText[type],
    fontSize: fontSize.secondary,
    lineHeight: '1.667em'
  },
  listRoot: ({ height }) => ({
    padding: 10,
    height,

    '&:before, &:after': {
      content: "''",
      display: 'table'
    }
  })
}))

const COLS = 4

const LogTimelineCard = ({ id, entity, putReducer, staticLogs }) => {
  const [openIndexes, setOpenIndexes] = useState([])
  const [data, setData] = useState([])
  const classes = useStyles({ height: Math.ceil(data.length / COLS) * 145 })
  const [isInnerLoad, setInnerLoad] = useState(false)

  const [getLogs, { isFetching, meta }] = useLazyGetLogsQuery()

  const fetcher = useCallback(
    async (params = {}) => {
      const { data: _data, meta: _meta } = await getLogs({
        entity,
        entityId: id,
        params: queryParamsHelper({ limit: 20, ...params })
      }).unwrap()

      setData(a => (_meta.currentPage === 1 ? [..._data] : [...a, ..._data]))
      setInnerLoad(false)
    },
    [getLogs, entity, id]
  )

  useEffect(() => {
    fetcher()
    //eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (putReducer?.isSuccess) {
      setData([])
      fetcher()
    }
    //eslint-disable-next-line
  }, [putReducer])

  const handleOpen = useCallback(
    index => () => {
      setOpenIndexes(indexes =>
        indexes.includes(index)
          ? indexes.filter(n => n !== index)
          : [...indexes, index]
      )
    },
    []
  )

  const handleScrollEnd = useCallback(() => {
    if (!isFetching && meta?.currentPage < meta?.lastPage) {
      setInnerLoad(true)
      fetcher({
        page: meta?.currentPage + 1
      })
    }
  }, [fetcher, meta, isFetching])

  const modifiedData = useMemo(() => {
    if (!staticLogs) return data
    return [...staticLogs, ...data].sort((a, b) =>
      a.createdAt < b.createdAt ? 1 : -1
    )
  }, [staticLogs, data])

  return (
    <Grid item className={classes.cardWrapper}>
      <Accordion
        title="Timeline Logs"
        rootClassName={classes.accordionRoot}
        summaryRootClassName={classes.accordionHeader}
        contentClass={classes.accordionContent}
        titleClasName={classes.accordionTitle}
      >
        <Scrollbars
          autoHeight
          autoHeightMax="600px"
          onUpdate={handleBottomScroll(handleScrollEnd)}
        >
          {isFetching && !isInnerLoad ? (
            <LogTimelineLoader />
          ) : modifiedData.length ? (
            <div className={classes.listRoot}>
              {modifiedData.map((item, index) => (
                <TimelineCard
                  key={`log-timeline-${index}`}
                  item={item}
                  index={index}
                  isLast={index + 1 === modifiedData.length}
                  open={openIndexes.includes(index) ? true : undefined}
                  onOpen={handleOpen(index)}
                  entity={entity}
                  cols={COLS}
                />
              ))}
              {isFetching && <LogTimelineLoader />}
            </div>
          ) : (
            <EmptyPlaceholder
              variant="small"
              text={'No Timeline Logs'}
              fullHeight
            />
          )}
        </Scrollbars>
      </Accordion>
    </Grid>
  )
}

export default LogTimelineCard
