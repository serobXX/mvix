import React, { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { useGetOpportunityProposalsQuery } from 'api/opportunityApi'
import FroalaPreview from 'components/FroalaPreview'
import { CircularLoader } from 'components/loaders'
import { _get } from 'utils/lodash'
import { froalaEntityNames } from 'constants/froalaConstants'
import { convertToProductItems } from 'utils/froalaPlaceholder'
import { getCustomFieldValueByCode } from 'utils/customFieldUtils'
import customFieldNames from 'constants/customFieldNames'

const ProposalPreview = () => {
  const { id } = useParams()

  const { data: proposal, isFetching } = useGetOpportunityProposalsQuery(id)

  useEffect(() => {
    document.body.style.background = '#fff'
    document.body.style.height = '100vh'
  }, [])

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

  return (
    <>
      {isFetching && <CircularLoader />}
      <FroalaPreview
        value={_get(proposal, 'template.template', '')}
        previewPlaceholder
        placeholderData={placeholderData}
        entity={froalaEntityNames.proposal}
      />
    </>
  )
}

export default ProposalPreview
