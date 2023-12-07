import { useCallback, useEffect, useMemo, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'

import HoverOverDropdownButton from 'components/buttons/HoverOverDropdownButton'
import GridCardBase from 'components/cards/GridCardBase'
import { getCustomFieldValueByCode } from 'utils/customFieldUtils'
import { entityValues } from 'constants/customFields'
import { getIconClassName } from 'utils/iconUtils'
import iconNames from 'constants/iconNames'
import customFieldNames from 'constants/customFieldNames'
import { routes, tableViews } from 'constants/routes'
import { useGetCustomFieldsByEntityQuery } from 'api/customFieldApi'
import { LibraryGridLoader } from 'components/loaders'
import { useNavigate } from 'react-router-dom'
import { removeAbsolutePath } from 'utils/urlUtils'
import {
  useGetOpportunityProposalsQuery,
  useUpdateOpportunityProposalMutation
} from 'api/opportunityApi'
import useNotifyAnalyzer from 'hooks/useNotifyAnalyzer'
import { notifyLabels } from 'constants/notifyAnalyzer'
import Scrollbars from 'components/Scrollbars'
import RowCard from './RowCard'
import update from 'utils/immutability'
import Container from 'components/containers/Container'
import Tooltip from 'components/Tooltip'
import { CircleIconButton } from 'components/buttons'
import {
  ComposeEmailModal,
  PublicLinkModal,
  TemplateModal
} from 'components/modals'
import { froalaEntityNames } from 'constants/froalaConstants'
import { placeholderStaticCodes } from 'constants/froalaPlaceholder'
import { parsePublicLink } from 'utils/appUtils'

const useStyles = makeStyles(
  ({ typography, type, colors, fontSize, lineHeight, palette }) => ({
    cardWrapper: {
      height: 'auto'
    },
    hoverOverActionButton: {
      color: typography.darkText[type].color,
      height: 42,
      fontSize: '1rem'
    },
    footerTextRoot: {
      display: 'flex',
      gap: 5,
      '& p:first-child': {
        fontStyle: 'italic'
      }
    },
    addEstimateRoot: {
      border: `2px dashed ${colors.highlight}`,
      borderRadius: 4
    },
    addEstimateInner: {
      height: '273px',
      width: '239px',
      display: 'grid',
      placeItems: 'center'
    },
    addEstimateIcon: {
      color: colors.highlight,
      fontSize: 35
    },
    cardFooterText: {
      ...typography.darkText[type],
      fontSize: fontSize.secondary,
      lineHeight: lineHeight.secondary
    },
    cardInactive: {
      opacity: '0.6'
    },
    contentRoot: {
      display: 'flex',
      flexWrap: 'nowrap',
      gap: 16,
      paddingRight: 10
    },
    cardContentRoot: {
      width: 238
    },
    actionIcon: {
      ...typography.darkText[type],
      fontSize: 16,
      border: `1px solid ${palette[type].sideModal.content.border}`,
      height: 42,
      width: 42
    },
    actionHoverCard: {
      width: 150
    }
  })
)

const ProposalCard = ({
  title = 'Proposal',
  opportunityId,
  estimates,
  item,
  isRefetch
}) => {
  const classes = useStyles()
  const navigate = useNavigate()
  const [hoverEstimates, setHoverEstimates] = useState([])
  const [composeEmailModal, setComposeEmailModal] = useState(false)
  const [isPublicLinkModalOpen, setPublicLinkModalOpen] = useState(false)
  const [selectTemplateModal, setSelectTemplateModal] = useState(false)

  const {
    data: proposals,
    isFetching,
    refetch
  } = useGetOpportunityProposalsQuery(opportunityId)
  const [updateProposal, put] = useUpdateOpportunityProposalMutation()

  const { data: estimateLayout, isFetching: layoutFetching } =
    useGetCustomFieldsByEntityQuery({
      entityType: entityValues.estimate
    })

  useEffect(() => {
    if (isRefetch) refetch()
    //eslint-disable-next-line
  }, [isRefetch])

  const proposalEstimates = useMemo(() => {
    if (!proposals?.estimates) return []

    return proposals?.estimates.map(({ id }) => id)
  }, [proposals])

  const [selectedEstimates, notSelectedEstimates] = useMemo(() => {
    let _selected = [],
      _notSelected = []

    estimates &&
      estimates.forEach(estimate => {
        if (proposalEstimates.includes(estimate.id)) {
          _selected.push(estimate)
        } else _notSelected.push(estimate)
      })

    _selected = _selected.sort(
      (a, b) =>
        proposalEstimates.indexOf(a.id) - proposalEstimates.indexOf(b.id)
    )

    return [_selected, _notSelected]
  }, [estimates, proposalEstimates])

  useEffect(() => {
    setHoverEstimates(selectedEstimates)
  }, [selectedEstimates])

  useNotifyAnalyzer({
    entityName: 'Proposal',
    watchArray: [put],
    labels: [notifyLabels.update]
  })

  const dropdownItems = useMemo(
    () => [
      {
        label: 'Download (PDF)',
        icon: getIconClassName(iconNames.download)
      },
      {
        label: 'Templates',
        icon: getIconClassName(iconNames.template),
        onClick: () => setSelectTemplateModal(true)
      }
    ],
    []
  )

  const handleAddEstimate = () => {
    navigate(
      routes.estimates.toDetailAdd(
        removeAbsolutePath(
          routes.opportunities.toView(opportunityId, tableViews.list)
        )
      ),
      {
        state: {
          accountId: item?.account?.id,
          contactId: getCustomFieldValueByCode(
            item,
            customFieldNames.contactName
          )?.id,
          opportunityId: opportunityId
        }
      }
    )
  }

  const handleToggleEstimate = useCallback(
    ({ target: { name, value } }) => {
      let _estimates = proposalEstimates
      if (value) {
        _estimates.unshift(Number(name))
      } else {
        const index = _estimates.findIndex(id => id === Number(name))

        if (index > -1) {
          _estimates.splice(index, 1)
        }
      }
      updateProposal({
        id: proposals?.id,
        data: {
          estimates: _estimates,
          templateId: proposals.template?.id
        }
      })
    },
    [proposalEstimates, proposals, updateProposal]
  )

  const handleItemHover = useCallback(
    (sourceIndex, destinationIndex, sourceItem) => {
      if (destinationIndex > -1) {
        if (sourceIndex > -1) {
          setHoverEstimates(
            update(selectedEstimates, {
              $splice: [
                [sourceIndex, 1],
                [destinationIndex, 0, sourceItem]
              ]
            })
          )
        }
      }
    },
    [selectedEstimates]
  )

  const handleItemDropped = useCallback(() => {
    updateProposal({
      id: proposals?.id,
      data: {
        estimates: hoverEstimates.map(({ id }) => id),
        templateId: proposals.template?.id
      }
    })
  }, [updateProposal, proposals, hoverEstimates])

  const renderEstimate = useCallback(
    (estimate, index) => {
      const isChecked = proposalEstimates.includes(estimate.id)
      return (
        <RowCard
          key={`proposal-${opportunityId}-${estimate.id}`}
          item={estimate}
          estimateLayout={estimateLayout}
          opportunityId={opportunityId}
          classes={classes}
          isSelected={isChecked}
          index={index}
          disabled={isChecked ? proposalEstimates?.length <= 1 : false}
          onToggleEstimate={handleToggleEstimate}
          onItemHover={handleItemHover}
          onItemDropped={handleItemDropped}
        />
      )
    },
    [
      opportunityId,
      estimateLayout,
      proposalEstimates,
      handleToggleEstimate,
      classes,
      handleItemHover,
      handleItemDropped
    ]
  )

  const handleOpenPreview = useCallback(() => {
    window.open(
      `${window.location.origin}${routes.preview.toProposal(opportunityId)}`,
      '_blank',
      'rel=noopener noreferrer'
    )
  }, [opportunityId])

  const handleChangeTemplate = useCallback(
    ({ id }) => {
      updateProposal({
        id: proposals?.id,
        data: {
          estimates: proposals.estimates.map(({ id }) => id),
          templateId: id
        }
      })
      setSelectTemplateModal(false)
    },
    [updateProposal, proposals]
  )

  const iconButtonComponent = useMemo(
    () => (
      <Container cols={'4'}>
        <Tooltip arrow title={'Preview Proposal'} placement="top">
          <CircleIconButton
            className={classNames('hvr-grow', classes.actionIcon)}
            onClick={handleOpenPreview}
          >
            <i className={getIconClassName(iconNames.preview)} />
          </CircleIconButton>
        </Tooltip>
        <Tooltip arrow title={'Send Proposal'} placement="top">
          <CircleIconButton
            className={classNames('hvr-grow', classes.actionIcon)}
            onClick={() => setComposeEmailModal(true)}
          >
            <i className={getIconClassName(iconNames.email)} />
          </CircleIconButton>
        </Tooltip>
        <Tooltip arrow title={'Proposal Link'} placement="top">
          <CircleIconButton
            className={classNames('hvr-grow', classes.actionIcon)}
            onClick={() => setPublicLinkModalOpen(true)}
          >
            <i className={getIconClassName(iconNames.proposal)} />
          </CircleIconButton>
        </Tooltip>
        <HoverOverDropdownButton
          iconButtonClassName={classes.hoverOverActionButton}
          items={dropdownItems}
        />
      </Container>
    ),
    [
      classes.actionIcon,
      classes.hoverOverActionButton,
      dropdownItems,
      handleOpenPreview
    ]
  )

  const emailItem = useMemo(
    () => ({
      ...item,
      proposal: {
        [placeholderStaticCodes.proposalLink]:
          !!proposals?.publicToken?.length &&
          parsePublicLink(
            routes.public.toProposal(proposals?.publicToken?.[0]?.token)
          )
      }
    }),
    [item, proposals?.publicToken]
  )

  return (
    <>
      <GridCardBase
        title={title}
        removeScrollbar
        cardWrapperClassName={classes.cardWrapper}
        dropdown={false}
        iconButtonComponent={iconButtonComponent}
      >
        {layoutFetching || isFetching ? (
          <LibraryGridLoader
            cols={4}
            rows={1}
            rectHeight={272}
            rectWidth={240}
            maxWidth={1050}
            footerHeight={0}
            rowSpacing={272}
          />
        ) : (
          <Scrollbars renderHorizontalScroll autoHeight autoHeightMax="275px">
            <div className={classes.contentRoot}>
              {hoverEstimates.map((estimate, index) =>
                renderEstimate(estimate, index)
              )}
              {notSelectedEstimates.map((estimate, index) =>
                renderEstimate(estimate, index, false)
              )}
              <div
                className={classes.addEstimateRoot}
                onClick={handleAddEstimate}
              >
                <div className={classes.addEstimateInner}>
                  <i
                    className={classNames(
                      getIconClassName(iconNames.add2),
                      classes.addEstimateIcon
                    )}
                  />
                </div>
              </div>
            </div>
          </Scrollbars>
        )}
      </GridCardBase>
      <PublicLinkModal
        open={isPublicLinkModalOpen}
        onClose={() => setPublicLinkModalOpen(false)}
        tokenList={proposals?.publicToken || []}
        transformLink={token =>
          parsePublicLink(routes.public.toProposal(token))
        }
        modalTitle={'Proposal Link'}
        entityType={'Proposal'}
        entityId={proposals?.id}
      />
      {composeEmailModal && (
        <ComposeEmailModal
          open={composeEmailModal}
          onClose={() => setComposeEmailModal(false)}
          hideRelatedFields
          entity={entityValues.opportunity}
          froalaEntity={froalaEntityNames.proposalEmail}
          entityId={opportunityId}
          entityRecord={emailItem}
          isValidateAppointmentLink
        />
      )}
      <TemplateModal
        open={selectTemplateModal}
        onClose={() => setSelectTemplateModal(false)}
        onSelect={handleChangeTemplate}
        selectedTemplateId={proposals?.template?.id}
      />
    </>
  )
}

export default ProposalCard
