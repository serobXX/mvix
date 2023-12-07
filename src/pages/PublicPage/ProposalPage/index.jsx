import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import FroalaPreview from 'components/FroalaPreview'
import { CircularLoader } from 'components/loaders'
import { _get } from 'utils/lodash'
import {
  useLazyGetPublicProposalQuery,
  useRequestChangesPublicEntityMutation
} from 'api/publicApi'
import { froalaActionNames, froalaEntityNames } from 'constants/froalaConstants'
import { convertToProductItems } from 'utils/froalaPlaceholder'
import {
  getCustomFieldValueByCode,
  getTitleBasedOnEntity
} from 'utils/customFieldUtils'
import customFieldNames from 'constants/customFieldNames'
import { EmptyPlaceholder } from 'components/placeholder'
import { AdditionalEstimateModal } from 'components/modals/PublicModals'
import { entityValues } from 'constants/customFields'
import useNotifyAnalyzer from 'hooks/useNotifyAnalyzer'
import useSnackbar from 'hooks/useSnackbar'

const ProposalPage = () => {
  const { token } = useParams()
  const [isAdditionalModalOpen, setAdditionalModalOpen] = useState(false)
  const { showSnackbar } = useSnackbar()

  const [getProposal, { data: proposal, isFetching, error }] =
    useLazyGetPublicProposalQuery()
  const [requestChangesProposal, requestChangedReducer] =
    useRequestChangesPublicEntityMutation()

  useEffect(() => {
    document.body.style.background = '#fff'
    document.body.style.height = '100vh'
  }, [])

  const fetcher = useCallback(() => {
    getProposal(token)
  }, [getProposal, token])

  useEffect(() => {
    if (token) {
      fetcher()
    }
    //eslint-disable-next-line
  }, [token])

  const handleSuccess = reducer => {
    if (reducer.endpointName === 'requestChangesPublicEntity') {
      setAdditionalModalOpen(false)
      showSnackbar('Additional Estimates changes Submitted', 'success')
    }
  }

  const handleError = reducer => {
    if (reducer.endpointName === 'requestChangesPublicEntity') {
      showSnackbar('Additional Estimates changes not Submitted', 'error')
    }
  }

  useNotifyAnalyzer({
    fetcher,
    hideNotification: true,
    watchArray: [requestChangedReducer],
    onSuccess: handleSuccess,
    onError: handleError
  })

  const handleOpenLink = useCallback(() => {
    if (proposal?.appointmentLink) {
      window.open(proposal.appointmentLink, '_blank')
    }
  }, [proposal?.appointmentLink])

  const actionList = useMemo(
    () => [
      {
        name: froalaActionNames.scheduleMeeting,
        onClick: handleOpenLink
      },
      {
        name: froalaActionNames.additionalEstimate,
        onClick: () => setAdditionalModalOpen(true)
      }
    ],
    [handleOpenLink]
  )

  const placeholderData = useMemo(() => {
    return _get(proposal, 'estimates', []).map(
      ({ account, contact, opportunity, itemGroups, ...estimate }) => ({
        account,
        contact,
        opportunity,
        estimate,
        productItems: convertToProductItems({ itemGroups, ...estimate }),
        isMultipleShip: getCustomFieldValueByCode(
          estimate,
          customFieldNames.shipToMultiple
        )
      })
    )
  }, [proposal])

  const showError = useMemo(
    () =>
      error?.code < 200 ||
      error?.code > 299 ||
      proposal?.isExpied ||
      proposal?.status === 'Accepted',
    [proposal, error?.code]
  )

  const additionalEstimateValue = useMemo(
    () => ({
      subject: `${getTitleBasedOnEntity(
        entityValues.account,
        placeholderData?.[0]?.account
      )} | Need additional Estimates`
    }),
    [placeholderData]
  )

  const handleSubmitAdditional = useCallback(
    values => {
      requestChangesProposal({
        entity: 'Proposal',
        token,
        ...values
      })
    },
    [requestChangesProposal, token]
  )

  return (
    <>
      {isFetching && <CircularLoader />}
      {showError ? (
        <EmptyPlaceholder text={'Link Expired'} fullHeight />
      ) : (
        <FroalaPreview
          value={_get(proposal, 'template.template', '')}
          previewPlaceholder
          placeholderData={placeholderData}
          entity={froalaEntityNames.proposal}
          dynamicActions={actionList}
        />
      )}
      {isAdditionalModalOpen && (
        <AdditionalEstimateModal
          open={isAdditionalModalOpen}
          onClose={() => setAdditionalModalOpen(false)}
          onSubmit={handleSubmitAdditional}
          initialValues={additionalEstimateValue}
        />
      )}
    </>
  )
}

export default ProposalPage
