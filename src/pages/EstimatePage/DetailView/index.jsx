import { useCallback, useMemo } from 'react'
import { makeStyles } from '@material-ui/core'
import { useParams } from 'react-router-dom'

import GridLayout from 'components/GridLayout'
import {
  AddressCard,
  AttachmentCard,
  DetailTagCard,
  LogTimelineCard
} from 'components/cards'
import { parseToAbsolutePath } from 'utils/urlUtils'
import { routes } from 'constants/routes'
import {
  useAddAttachmentMutation,
  useDeleteAttachmentMutation,
  useGetEstimateByIdQuery
} from 'api/estimateApi'
import { getTitleBasedOnEntity, parseBEValues } from 'utils/customFieldUtils'
import { entityValues } from 'constants/customFields'
import { SideModal } from 'components/modals'
import ProfileCardDetails from './ProfileCardDetails'
import EstimateItemsCard from './EstimateItemsCard'
import { tagEntityType } from 'constants/tagConstants'
import {
  addressToBillingShipping,
  billingShippingToAddress
} from 'utils/detailViewUtils'

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
  const { data, isFetching } = useGetEstimateByIdQuery(id, {
    refetchOnMountOrArgChange: true
  })

  const [addAttachment, postAttachment] = useAddAttachmentMutation()
  const [deleteAttachment, delAttachment] = useDeleteAttachmentMutation()

  const item = useMemo(() => {
    if (data?.customFields) {
      return {
        ...data,
        customFields: parseBEValues(layout, data.customFields)
      }
    }
    return data
  }, [data, layout])

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
        h: 16,
        i: 'address_card',
        autoHeight: true
      },
      {
        x: 4,
        y: 26,
        w: 1,
        h: 15,
        i: 'attachments'
      },
      {
        x: 1,
        y: 0,
        w: 3,
        h: 35,
        i: 'product_items',
        autoHeight: true
      },
      {
        x: 4,
        y: 16,
        w: 1,
        h: 10,
        i: 'tag_card',
        autoHeight: true
      },
      {
        x: 1,
        y: 50,
        w: 3,
        h: 20,
        i: 'log_card',
        autoHeight: true
      }
    ],
    []
  )

  const handleEditSubmit = useCallback(
    ({
      accountId,
      opportunityId,
      contactId,
      productItems,
      estimateValidityDuration,
      tag,
      ...values
    }) => {
      let data = {
        ...values
      }
      if (values.addressData) {
        let addresses = billingShippingToAddress(item?.customFields)
        addresses.splice(0, 1, values.addressData)
        data = {
          ...data,
          ...addressToBillingShipping(addresses)
        }
      }
      delete data.address
      delete data.addressData

      updateItem({
        id,
        data: {
          ...(accountId ? { accountId } : {}),
          ...(opportunityId ? { opportunityId } : {}),
          ...(contactId ? { contactId } : {}),
          ...(productItems ? productItems : {}),
          ...(estimateValidityDuration ? { estimateValidityDuration } : {}),
          customFields: data,
          ...(tag ? { tag } : {})
        }
      })
    },
    [updateItem, id, item]
  )

  const cards = useMemo(
    () => ({
      profile_card: (
        <ProfileCardDetails
          item={isFetching ? {} : item}
          onEditSubmit={handleEditSubmit}
          layout={layout}
          isFetching={isFetching}
          id={id}
        />
      ),
      address_card: (
        <AddressCard
          name="addresses"
          values={item?.customFields}
          onEditSubmit={handleEditSubmit}
          permission={permission}
          showEditorWithReadOnly
          onlyBillingAndShipping
          accountId={item?.account?.id}
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
      product_items: (
        <EstimateItemsCard
          item={item}
          layout={layout}
          permission={permission}
          onEditSubmit={handleEditSubmit}
          account={item?.account}
        />
      ),
      tag_card: (
        <DetailTagCard
          entity={tagEntityType.estimate}
          values={item?.tag}
          onChange={handleEditSubmit}
        />
      ),
      log_card: (
        <LogTimelineCard
          id={id}
          entity={entityValues.estimate}
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
      putReducer
    ]
  )

  return (
    <SideModal
      width={'100%'}
      title={getTitleBasedOnEntity(entityValues.estimate, item)}
      headerClassName={classes.sideModalHeader}
      closeLink={parseToAbsolutePath(routes.estimates[view])}
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
