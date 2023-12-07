import { useCallback, useEffect, useMemo, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import { Route, Routes, useParams } from 'react-router-dom'

import GridLayout from 'components/GridLayout'
import {
  AddressCard,
  AttachmentCard,
  LogTimelineCard,
  PaymentCard,
  TermAndConditionCard
} from 'components/cards'
import { parseToAbsolutePath, removeAbsolutePath } from 'utils/urlUtils'
import { routes } from 'constants/routes'
import { ConflictModal, SideModal } from 'components/modals'
import ProfileCardDetails from './ProfileCardDetails'
import {
  useGetInvoiceByIdQuery,
  useAddAttachmentMutation,
  useDeleteAttachmentMutation
} from 'api/invoiceApi'
import InvoiceItemsCard from './InvoiceItemsCard'
import useDeterminePermissions from 'hooks/useDeterminePermissions'
import { permissionGroupNames } from 'constants/permissionGroups'
import AddEditPayment from 'pages/PaymentPage/AddEditPayment'
import { entityValues } from 'constants/customFields'
import {
  addressToBillingShipping,
  billingShippingToAddress,
  transformToConflictAddress
} from 'utils/detailViewUtils'
import exceptionNames from 'constants/beExceptionNames'

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

const DetailView = ({ updateItem, permission, putReducer, closeLink }) => {
  const { id, view } = useParams()
  const classes = useStyles()
  const [isConflictModalOpen, setConflictModalOpen] = useState(false)
  const [conflictData, setConflictData] = useState()
  const [conflictStaticData, setConflictStaticData] = useState()
  const paymentPermission = useDeterminePermissions(
    permissionGroupNames.payment
  )
  const { data, isFetching, refetch } = useGetInvoiceByIdQuery(id, {
    refetchOnMountOrArgChange: true
  })

  const [addAttachment, postAttachment] = useAddAttachmentMutation()
  const [deleteAttachment, delAttachment] = useDeleteAttachmentMutation()

  const handleConflictClose = () => {
    setConflictModalOpen(false)
    setConflictData()
    setConflictStaticData()
  }

  useEffect(() => {
    if (
      putReducer.isError &&
      putReducer.error?.code === 422 &&
      putReducer.error?.exception ===
        exceptionNames.changedAddressErrorException
    ) {
      setConflictData(transformToConflictAddress(putReducer.error?.data))
      setConflictModalOpen(true)
    } else if (putReducer.isSuccess) {
      handleConflictClose()
    }
  }, [putReducer])

  const conflictDefaultValues = useMemo(() => {
    if (isConflictModalOpen && conflictData) {
      return conflictData.reduce((a, { fieldName, list }) => {
        a[fieldName] = list.reduce((x, { name, options }) => {
          x[name] = options[1]?.value
          return x
        }, {})
        return a
      }, {})
    }
  }, [conflictData, isConflictModalOpen])

  const positions = useMemo(
    () => [
      {
        x: 0,
        y: 0,
        w: 1,
        h: 29.5,
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
        y: 16,
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
        x: 1,
        y: 35,
        w: 3,
        h: 15,
        i: 'term_condition',
        autoHeight: true
      },
      {
        x: 0,
        y: 30,
        w: 1,
        h: 25,
        i: 'payment_card'
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
    values => {
      let {
        accountId,
        opportunityId,
        contactId,
        productItems,
        termsAndConditions,
        addressData,
        ownerId,
        status,
        ...customFields
      } = values

      setConflictStaticData(values)

      if (addressData) {
        let addresses = billingShippingToAddress(data?.customFields)
        addresses.splice(0, 1, addressData)
        customFields = {
          ...customFields,
          ...addressToBillingShipping(addresses)
        }
      }

      updateItem({
        id,
        data: {
          ...(accountId ? { accountId } : {}),
          ...(opportunityId ? { opportunityId } : {}),
          ...(contactId ? { contactId } : {}),
          ...(status ? { status } : {}),
          ...(ownerId ? { ownerId } : {}),
          ...(productItems ? productItems : {}),
          ...(termsAndConditions ? { termsAndConditions } : {}),
          customFields
        }
      })
    },
    [updateItem, id, data]
  )

  const handleConflictConfirm = values => {
    handleEditSubmit({
      ...conflictStaticData,
      ...values?.customFields
    })
  }

  const cards = useMemo(
    () => ({
      profile_card: (
        <ProfileCardDetails
          item={isFetching ? {} : data}
          onEditSubmit={handleEditSubmit}
          isFetching={isFetching}
          id={id}
        />
      ),
      address_card: (
        <AddressCard
          name="addresses"
          values={data?.customFields}
          onEditSubmit={handleEditSubmit}
          permission={permission}
          showEditorWithReadOnly
          onlyBillingAndShipping
        />
      ),
      attachments: (
        <AttachmentCard
          parentId={id}
          addAttachment={addAttachment}
          deleteAttachment={deleteAttachment}
          post={postAttachment}
          del={delAttachment}
          items={data?.attachments}
        />
      ),
      product_items: (
        <InvoiceItemsCard
          item={data}
          onEditSubmit={handleEditSubmit}
          account={data?.account}
        />
      ),
      term_condition: (
        <TermAndConditionCard
          name="termsAndConditions"
          text={data?.termsAndConditions}
          onSubmit={handleEditSubmit}
        />
      ),
      payment_card: (
        <PaymentCard
          data={data?.payments}
          invoiceId={id}
          accountId={data?.account?.id}
          balanceDue={data?.balanceDue}
          parentUrl={removeAbsolutePath(routes.invoices.toView(id, view))}
          permission={paymentPermission}
          fetcher={refetch}
        />
      ),
      log_card: (
        <LogTimelineCard
          id={id}
          entity={entityValues.invoice}
          putReducer={putReducer}
          onlyLogs
        />
      )
    }),
    [
      isFetching,
      data,
      permission,
      id,
      handleEditSubmit,
      addAttachment,
      delAttachment,
      deleteAttachment,
      postAttachment,
      view,
      paymentPermission,
      refetch,
      putReducer
    ]
  )

  return (
    <SideModal
      width={'100%'}
      title={data?.invoiceNumber}
      headerClassName={classes.sideModalHeader}
      closeLink={closeLink || parseToAbsolutePath(routes.invoices[view])}
    >
      <div className={classes.container}>
        <GridLayout
          positions={positions}
          cards={cards}
          disableDragging
          gridWidth={1800}
        />
      </div>
      <Routes>
        {paymentPermission.create && (
          <Route
            path={routes.payments.detailAdd}
            element={
              <AddEditPayment
                closeLink={routes.invoices.toView(id, view)}
                fromDetailView
              />
            }
          />
        )}
      </Routes>
      {isConflictModalOpen && (
        <ConflictModal
          title="Address Conflict"
          open={isConflictModalOpen}
          data={conflictData}
          values={conflictDefaultValues}
          onClose={handleConflictClose}
          onSubmit={handleConflictConfirm}
        />
      )}
    </SideModal>
  )
}

export default DetailView
