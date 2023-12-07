import { useCallback, useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core'

import { LibraryGridLoader } from 'components/loaders'
import useDeterminePermissions from 'hooks/useDeterminePermissions'
import { permissionGroupNames } from 'constants/permissionGroups'
import Tooltip from 'components/Tooltip'
import { CircleIconButton } from 'components/buttons'
import classNames from 'classnames'
import Scrollbars from 'components/Scrollbars'
import queryParamsHelper from 'utils/queryParamsHelper'
import handleBottomScroll from 'utils/handleBottomScroll'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'
import { useLazyGetEmailsQuery } from 'api/emailApi'
import EmailRow from './EmailRow'
import { EmptyPlaceholder } from 'components/placeholder'
import { ComposeEmailModal } from 'components/modals'
import { useGetOauthQuery } from 'api/configApi'
import { oauthServiceName } from 'constants/oauthConstants'
import GridCardBase from 'components/cards/GridCardBase'
import { themeTypes } from 'constants/ui'

const useStyles = makeStyles(({ type, typography, palette }) => ({
  addIcon: {
    ...typography.lightText[type],
    fontSize: 16,
    marginLeft: 5
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

const EmailCard = ({ id, entity, item, cardHeaderTextClasses }) => {
  const classes = useStyles()
  const [data, setData] = useState([])
  const [isInnerLoad, setInnerLoad] = useState(false)
  const [composeEmailModal, setComposeEmailModal] = useState(false)
  const [viewEmailId, setViewEmailId] = useState()
  const permission = useDeterminePermissions(permissionGroupNames.email)

  const { data: oauth, isFetching: oauthFetching } = useGetOauthQuery(
    oauthServiceName.gmail
  )
  const [getItems, { isFetching, meta }] = useLazyGetEmailsQuery()

  const fetcher = useCallback(
    async (params = {}) => {
      if (!!oauth?.length) {
        const query = queryParamsHelper({
          relatedToEntity: entity,
          relatedToId: id,
          tokenId: [...oauth].reverse()?.[0]?.id,
          limit: 10,
          ...params
        })

        const { data: _data, meta: _meta } = await getItems({
          ...query
        }).unwrap()

        setData(a => (_meta.currentPage === 1 ? [..._data] : [...a, ..._data]))
        setInnerLoad(false)
      }
    },
    [getItems, entity, id, oauth]
  )

  useEffect(() => {
    if (!!oauth?.length) {
      fetcher()
    }
    //eslint-disable-next-line
  }, [oauth])

  const handleScrollEnd = useCallback(() => {
    if (!isFetching && !oauthFetching && meta?.currentPage < meta?.lastPage) {
      setInnerLoad(true)
      fetcher({
        page: meta?.currentPage + 1
      })
    }
  }, [fetcher, meta, isFetching, oauthFetching])

  const handleViewEmail = useCallback(id => {
    setViewEmailId(id)
    setComposeEmailModal(true)
  }, [])

  const handleCloseModal = () => {
    setComposeEmailModal(false)
    setViewEmailId()
  }

  return (
    <GridCardBase
      title={'Emails'}
      removeScrollbar
      icon={false}
      headerWrapClassName={classes.cardHeaderWrap}
      contentRootClassName={classes.cardContentRoot}
      headerTextClasses={cardHeaderTextClasses}
      cardWrapperClassName={classes.cardWrapper}
      contentWrapClassName={classes.cardContentWrap}
      titleComponent={
        <Tooltip title={`Compose an Email`} placement="top" arrow>
          <CircleIconButton
            className={classNames(classes.addIcon)}
            onClick={() => setComposeEmailModal(true)}
          >
            <i className={getIconClassName(iconNames.add2)} />
          </CircleIconButton>
        </Tooltip>
      }
    >
      <Scrollbars
        autoHeight
        autoHeightMax="920px"
        onUpdate={handleBottomScroll(handleScrollEnd)}
      >
        {(isFetching || oauthFetching) && !isInnerLoad ? (
          <LibraryGridLoader
            rows={4}
            cols={1}
            rectHeight={200}
            rectWidth={1070}
            footerHeight={0}
            maxWidth={1070}
          />
        ) : data.length ? (
          <div className={classes.listRoot}>
            {data.map(_item => (
              <EmailRow
                key={`email-row-${_item.id}`}
                item={_item}
                onView={handleViewEmail}
              />
            ))}
            {isFetching && (
              <LibraryGridLoader
                rows={1}
                cols={1}
                rectHeight={200}
                rectWidth={1000}
                footerHeight={0}
                maxWidth={1000}
              />
            )}
          </div>
        ) : (
          <div className={classes.listRoot}>
            <EmptyPlaceholder
              variant="small"
              text="No Email Sent"
              requestText="Click to Compose an Email"
              onClick={() => setComposeEmailModal(true)}
            />
          </div>
        )}
      </Scrollbars>
      {composeEmailModal && permission.create && (
        <ComposeEmailModal
          open={composeEmailModal}
          onClose={handleCloseModal}
          fetcher={fetcher}
          id={viewEmailId}
          hideRelatedFields
          entity={entity}
          entityId={id}
          entityRecord={item}
        />
      )}
    </GridCardBase>
  )
}

export default EmailCard
