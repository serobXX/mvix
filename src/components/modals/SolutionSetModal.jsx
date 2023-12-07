import React, { useCallback, useEffect } from 'react'
import { DefaultModal } from 'components/modals'
import { useLazyGetSolutionSetsQuery } from 'api/solutionSetApi'
import BasePaginate from 'components/BasePaginate'
import { makeStyles } from '@material-ui/core'
import Scrollbars from 'components/Scrollbars'
import { TextWithTooltip } from 'components/typography'
import { EmptyPlaceholder } from 'components/placeholder'
import classNames from 'classnames'
import UserPic from 'components/UserPic'
import { SolutionLoader } from 'components/loaders'

const useStyles = makeStyles(({ palette, type, typography }) => ({
  modalFooter: {
    justifyContent: 'center'
  },
  dialogContentRoot: {
    padding: '10px 0px'
  },
  rowRoot: {
    padding: '10px 20px',
    borderBottom: `1px solid ${palette[type].pages.dashboard.card.background}`,
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    cursor: 'pointer',

    '&:hover': {
      background: palette[type].pages.dashboard.card.background
    }
  },
  emptyPlaceholder: {
    height: 300
  },
  rowTitle: {
    ...typography.darkAccent[type]
  }
}))

const SolutionSetModal = ({ open, onClose, onSelect }) => {
  const classes = useStyles()
  const [getItems, { data, meta, isFetching }] = useLazyGetSolutionSetsQuery()

  const fetcher = useCallback(
    (params = {}) => {
      getItems({
        limit: 10,
        ...params
      })
    },
    [getItems]
  )

  useEffect(() => {
    if (open) {
      fetcher()
    }
    //eslint-disable-next-line
  }, [open])

  const handleChangePage = useCallback(
    ({ selected }) => {
      fetcher({ page: selected + 1 })
    },
    [fetcher]
  )

  return (
    <DefaultModal
      modalTitle={'Select a Solution'}
      open={open}
      onCloseModal={onClose}
      maxWidth="xs"
      withActions={meta && meta.lastPage > 1}
      actions={
        <BasePaginate
          page={meta?.currentPage}
          pageCount={meta?.lastPage}
          onPageChange={handleChangePage}
        />
      }
      footerClassName={classes.modalFooter}
      useDialogContent={false}
    >
      <Scrollbars autoHeight autoHeightMin={'min(450px, calc(100vh - 200px))'}>
        <div className={classes.dialogContentRoot}>
          {isFetching ? (
            <SolutionLoader />
          ) : !data?.length ? (
            <EmptyPlaceholder
              rootClassName={classes.emptyPlaceholder}
              fullHeight
              text={'No Records Found'}
            />
          ) : (
            data.map(item => (
              <div
                className={classNames(classes.rowRoot)}
                key={`solution-set-${item.id}`}
                onClick={() => onSelect(item)}
              >
                <UserPic userName={item.name} showJdenticonIcon noStatus />
                <TextWithTooltip
                  maxWidth={340}
                  rootClassName={classes.rowTitle}
                >
                  {item.name}
                </TextWithTooltip>
              </div>
            ))
          )}
        </div>
      </Scrollbars>
    </DefaultModal>
  )
}

export default SolutionSetModal
