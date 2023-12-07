import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'
import {
  useAddPaymentProfileMutation,
  useDeletePaymentProfileMutation,
  useLazyGetPaymentProfilesQuery,
  useUpdatePaymentProfileMutation
} from 'api/paymentProfile'
import ListBaseCard from 'components/cards/DetailViewCards/ListBaseCard'
import apiCacheKeys from 'constants/apiCacheKeys'
import { getDeleteConfirmationMessage } from 'utils/snackbarMessages'
import useConfirmation from 'hooks/useConfirmation'
import AddEditModal from './AddEditModal'
import useNotifyAnalyzer from 'hooks/useNotifyAnalyzer'
import { notifyLabels } from 'constants/notifyAnalyzer'

const PaymentProfile = ({ accountId }) => {
  const { showConfirmation } = useConfirmation()
  const [openModal, setOpenModal] = useState(false)
  const [modalItem, setModalItem] = useState()
  const [profileData, setProfileData] = useState([])

  const [getPaymentProfiles, { data, isFetching, meta }] =
    useLazyGetPaymentProfilesQuery()
  const [addItem, post] = useAddPaymentProfileMutation({
    fixedCacheKey: apiCacheKeys.paymentProfile.add
  })
  const [updateItem, put] = useUpdatePaymentProfileMutation({
    fixedCacheKey: apiCacheKeys.paymentProfile.update
  })
  const [deleteItem, del] = useDeletePaymentProfileMutation({
    fixedCacheKey: apiCacheKeys.paymentProfile.delete
  })

  const fetcher = useCallback(
    params => {
      getPaymentProfiles({
        limit: 10,
        ...params,
        accountId
      })
    },
    [getPaymentProfiles, accountId]
  )

  useEffect(() => {
    fetcher()
    //eslint-disable-next-line
  }, [])

  useNotifyAnalyzer({
    fetcher,
    entityName: 'Payment Profile',
    watchArray: [post, put, del],
    labels: [notifyLabels.add, notifyLabels.update, notifyLabels.delete]
  })

  const handleFetchMore = useCallback(() => {
    if (!isFetching && meta.currentPage < meta.lastPage) {
      fetcher({
        page: meta.currentPage + 1
      })
    }
  }, [fetcher, isFetching, meta])

  const rowItems = useMemo(
    () => [
      {
        icon: getIconClassName(iconNames.paymentProfile),
        name: 'paymentName',
        tooltip: 'Payment Profile Name'
      },
      {
        icon: getIconClassName(iconNames.paymentMethod),
        name: 'paymentMethod',
        tooltip: 'Payment Method'
      },
      {
        icon: getIconClassName(iconNames.paymentAddress),
        name: 'billingStreetAddress',
        tooltip: 'Billing Street Address',
        fullWidth: true
      },
      {
        icon: getIconClassName(iconNames.paymentCity),
        name: 'billingCity',
        tooltip: 'Billing City'
      },
      {
        icon: getIconClassName(iconNames.paymentState),
        name: 'billingState',
        tooltip: 'Billing State'
      },
      {
        icon: getIconClassName(iconNames.paymentZipCode),
        name: 'billingPostalCode',
        tooltip: 'Billing Zip'
      },
      {
        icon: getIconClassName(iconNames.paymentCountry),
        name: 'billingCountry',
        tooltip: 'Billing Country'
      }
    ],
    []
  )

  useEffect(() => {
    if (data) {
      setProfileData(d => [
        ...(meta?.currentPage !== 1 ? d : []),
        ...data.map(
          ({
            id,
            paymentName,
            paymentMethod,
            billingStreetAddress,
            billingCity,
            billingState,
            billingPostalCode,
            billingCountry
          }) => ({
            id,
            paymentName,
            paymentMethod,
            billingStreetAddress,
            billingCity,
            billingState,
            billingPostalCode,
            billingCountry
          })
        )
      ])
    }
    //eslint-disable-next-line
  }, [data])

  const handleDelete = useCallback(
    ({ id, paymentName }) => {
      showConfirmation(getDeleteConfirmationMessage(paymentName), () =>
        deleteItem(id)
      )
    },
    [showConfirmation, deleteItem]
  )

  const handleEdit = useCallback(item => {
    setModalItem(item)
    setOpenModal(true)
  }, [])

  const rowActions = useMemo(
    () => [
      {
        label: 'Edit',
        icon: getIconClassName(iconNames.edit),
        onClick: handleEdit
      },
      {
        label: 'Delete',
        icon: getIconClassName(iconNames.delete),
        onClick: handleDelete
      }
    ],
    [handleDelete, handleEdit]
  )

  const actions = useMemo(
    () => [
      {
        label: 'Create New',
        icon: getIconClassName(iconNames.add),
        onClick: () => setOpenModal(true)
      }
    ],
    []
  )

  const handleCloseModal = useCallback(() => {
    setModalItem()
    setOpenModal(false)
  }, [])

  return (
    <>
      <ListBaseCard
        title="Payment Profile"
        titleIcon={getIconClassName(iconNames.paymentProfile)}
        rowItems={rowItems}
        data={profileData}
        emptyText="No Associated Payment Profiles"
        emptyRequestText="Click to Add a Payment Profile"
        onRequestTextClick={() => setOpenModal(true)}
        rowActions={rowActions}
        actions={actions}
        isLoading={isFetching}
        onFetchMore={handleFetchMore}
      />
      {openModal && (
        <AddEditModal
          isModalOpen={openModal}
          accountId={accountId}
          onCloseModal={handleCloseModal}
          onAddItem={addItem}
          onUpdateItem={updateItem}
          item={modalItem}
          post={post}
          put={put}
        />
      )}
    </>
  )
}

export default PaymentProfile
