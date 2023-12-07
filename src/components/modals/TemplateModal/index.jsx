import { useCallback, useEffect, useState, useMemo } from 'react'
import { Grid, makeStyles } from '@material-ui/core'

import { DefaultModal } from '..'
import { useLazyGetTemplatesQuery } from 'api/templateApi'
import Scrollbars from 'components/Scrollbars'
import BasePaginate from 'components/BasePaginate'
import { TemplateCard } from 'components/cards'
import { templateEntityValues } from 'constants/templateConstants'
import { LibraryGridLoader } from 'components/loaders'
import { EmptyPlaceholder } from 'components/placeholder'
import { ToggleTab } from 'components/tabs'
import useUser from 'hooks/useUser'

const useStyles = makeStyles(() => ({
  container: {
    overflow: 'hidden',
    gridColumnGap: '40px'
  },
  stretch: {
    gridColumnStart: 1,
    gridColumnEnd: 3,

    '& *::-webkit-scrollbar': {
      width: '0px'
    }
  },
  items: {
    minHeight: '300px',
    marginTop: 20,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gridColumnGap: '20px',
    gridRowGap: '20px',
    paddingRight: 23
  },
  imageCard: {
    height: '245px'
  },
  pagination: {
    display: 'flex',
    justifyContent: 'flex-end',
    margin: '15px 0px 10px 0px'
  },
  itemLoader: {
    marginTop: 20
  },
  emptyPlaceHolderRoot: {
    height: 'min(540px, calc(100vh - 250px))'
  },
  tabsRoot: {
    display: 'flex',
    justifyContent: 'center'
  }
}))

const tabConstants = {
  MY: 'my',
  SHARED: 'shared',
  SYSTEM: 'system'
}

const tabOptions = [
  {
    label: 'My Templates',
    value: tabConstants.MY
  },
  {
    label: 'Shared by Others',
    value: tabConstants.SHARED
  },
  {
    label: 'System Templates',
    value: tabConstants.SYSTEM
  }
]

const TemplateModal = ({
  open,
  modalTitle = 'Select Template',
  onSelect,
  onClose,
  selectedTemplateId,
  entity = templateEntityValues.proposal
}) => {
  const classes = useStyles()
  const [selectedId, setSelectedId] = useState()
  const [page, setPage] = useState(1)
  const [selectedGroup, setSelectedGroup] = useState(tabConstants.MY)

  const { role } = useUser()
  const [getTemplates, { data, meta, isFetching }] = useLazyGetTemplatesQuery()

  const fetcher = useCallback(
    (params = {}) => {
      getTemplates({
        limit: 6,
        entity,
        ...(!role?.isSystem && entity === templateEntityValues.email
          ? { group: selectedGroup }
          : {}),
        ...params
      })
    },
    [getTemplates, entity, selectedGroup, role?.isSystem]
  )

  const handleChangePage = useCallback(
    ({ selected }) => {
      fetcher({
        page: selected + 1
      })

      setPage(selected + 1)
    },
    [fetcher]
  )

  useEffect(() => {
    if (open) {
      fetcher()
    }
    //eslint-disable-next-line
  }, [open])

  useEffect(() => {
    setSelectedId(selectedTemplateId)
  }, [selectedTemplateId])

  const onSelectImage = useCallback(event => {
    setSelectedId(event.target.value)
  }, [])

  const handleSave = useCallback(() => {
    if (selectedId) {
      const template = data.find(({ id }) => id === selectedId)
      onSelect(template ? template : { id: selectedId })
    }
  }, [selectedId, onSelect, data])

  const renderItems = useMemo(() => {
    if (data.length > 0) {
      return data.map(({ name, thumbImage, id }) => (
        <TemplateCard
          key={`template-${id}`}
          className={classes.imageCard}
          title={name}
          src={thumbImage}
          id={id}
          onSelectImage={onSelectImage}
          isSelect={selectedId === id}
          name={name}
        />
      ))
    }
    return null
  }, [classes.imageCard, data, onSelectImage, selectedId])

  const handleChangeTab = (_, tab) => {
    setSelectedGroup(tab)
    fetcher({
      page: 1,
      group: tab
    })
  }

  return (
    <DefaultModal
      open={open}
      onCloseModal={onClose}
      onClickSave={handleSave}
      modalTitle={modalTitle}
      maxWidth="lg"
      buttonPrimaryText="Select"
    >
      <Grid container direction="column" className={classes.container}>
        {!role?.isSystem && entity === templateEntityValues.email && (
          <div className={classes.tabsRoot}>
            <ToggleTab
              tabs={tabOptions}
              value={selectedGroup}
              onChange={handleChangeTab}
            />
          </div>
        )}
        <div className={classes.stretch}>
          <Scrollbars
            autoHeight
            autoHeightMax="calc(100vh - 290px)"
            style={{ height: 540 }}
          >
            {isFetching ? (
              <div className={classes.itemLoader}>
                <LibraryGridLoader
                  rows={2}
                  cols={3}
                  rectWidth={333}
                  rectHeight={245}
                  rowSpacing={245}
                  maxWidth={1050}
                />
              </div>
            ) : data.length > 0 ? (
              <div className={classes.items}>{renderItems}</div>
            ) : (
              <EmptyPlaceholder
                text={'No Templates Found'}
                rootClassName={classes.emptyPlaceHolderRoot}
              />
            )}
          </Scrollbars>
        </div>
        {data.length > 0 && (
          <div className={classes.pagination}>
            <BasePaginate
              page={page}
              pageCount={meta?.lastPage || 0}
              onPageChange={handleChangePage}
            />
          </div>
        )}
      </Grid>
    </DefaultModal>
  )
}

export default TemplateModal
