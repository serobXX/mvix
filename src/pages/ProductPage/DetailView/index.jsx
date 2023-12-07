import { useCallback, useMemo } from 'react'
import { makeStyles } from '@material-ui/core'
import { useParams } from 'react-router-dom'

import GridLayout from 'components/GridLayout'
import {
  AttachmentCard,
  DetailTagCard,
  InvoiceCard,
  LogTimelineCard
} from 'components/cards'
import { parseToAbsolutePath } from 'utils/urlUtils'
import { routes } from 'constants/routes'
import {
  useAddAttachmentMutation,
  useDeleteAttachmentMutation,
  useGetProductByIdQuery
} from 'api/productApi'
import { getTitleBasedOnEntity } from 'utils/customFieldUtils'
import { entityValues } from 'constants/customFields'
import { SideModal } from 'components/modals'
import ProfileCardDetails from './ProfileCardDetails'
import ProductDescriptionCard from './ProductDescriptionCard'
import { tagEntityType } from 'constants/tagConstants'

const useStyles = makeStyles(({ type, palette }) => ({
  sideModalHeader: {
    padding: '17px 24px',
    borderBottom: `1px solid ${palette[type].sideModal.content.border}`
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    background: palette[type].body.background,
    borderLeft: `2px solid ${palette[type].sideModal.content.border}`,
    borderRight: `2px solid ${palette[type].sideModal.content.border}`,
    padding: 20,
    paddingRight: 6
  }
}))

const DetailView = ({ layout, updateItem, permission, putReducer }) => {
  const { id, view } = useParams()
  const classes = useStyles()
  const { data: item, isFetching } = useGetProductByIdQuery(id, {
    refetchOnMountOrArgChange: true
  })

  const [addAttachment, postAttachment] = useAddAttachmentMutation()
  const [deleteAttachment, delAttachment] = useDeleteAttachmentMutation()

  const positions = useMemo(
    () => [
      {
        x: 0,
        y: 0,
        w: 1,
        h: 17,
        i: 'profile_card',
        autoHeight: true
      },
      {
        x: 4,
        y: 0,
        w: 1,
        h: 15,
        i: 'attachments'
      },
      {
        x: 1,
        y: 0,
        w: 3,
        h: 30,
        i: 'details',
        autoHeight: true
      },
      {
        x: 0,
        y: 17,
        w: 1,
        h: 25,
        i: 'invoice'
      },
      {
        x: 4,
        y: 15,
        w: 1,
        h: 10,
        i: 'tag_card',
        autoHeight: true
      },
      {
        x: 1,
        y: 30,
        w: 3,
        h: 20,
        i: 'log_card',
        autoHeight: true
      }
    ],
    []
  )

  const handleEditSubmit = useCallback(
    ({ status, tag, ...values }) => {
      let data = {
        ...values
      }

      updateItem({
        id,
        data: {
          status: status || item.status,
          customFields: data,
          tag
        }
      })
    },
    [updateItem, id, item]
  )

  const invoiceQueryParams = useMemo(
    () => ({
      product: id
    }),
    [id]
  )

  const cards = useMemo(
    () => ({
      profile_card: (
        <ProfileCardDetails
          item={isFetching ? {} : item}
          onEditSubmit={handleEditSubmit}
          layout={layout}
          permission={permission}
        />
      ),
      attachments: (
        <AttachmentCard
          parentId={id}
          addAttachment={addAttachment}
          deleteAttachment={deleteAttachment}
          post={postAttachment}
          del={delAttachment}
          items={item?.attachments}
        />
      ),
      invoice: <InvoiceCard isServerSide queryParams={invoiceQueryParams} />,
      details: (
        <ProductDescriptionCard
          item={item}
          onEditSubmit={handleEditSubmit}
          layout={layout}
          permission={permission}
        />
      ),
      tag_card: (
        <DetailTagCard
          entity={tagEntityType.product}
          values={item?.tag}
          onChange={handleEditSubmit}
        />
      ),
      log_card: (
        <LogTimelineCard
          id={id}
          entity={entityValues.product}
          putReducer={putReducer}
          onlyLogs
        />
      )
    }),
    [
      isFetching,
      item,
      layout,
      permission,
      id,
      handleEditSubmit,
      addAttachment,
      delAttachment,
      deleteAttachment,
      postAttachment,
      invoiceQueryParams,
      putReducer
    ]
  )

  return (
    <SideModal
      width={'100%'}
      title={getTitleBasedOnEntity(entityValues.product, item)}
      headerClassName={classes.sideModalHeader}
      closeLink={parseToAbsolutePath(routes.products[view])}
    >
      <div className={classes.container}>
        <GridLayout
          positions={positions}
          cards={cards}
          disableDragging
          gridWidth={1800}
        />
      </div>
    </SideModal>
  )
}

export default DetailView
