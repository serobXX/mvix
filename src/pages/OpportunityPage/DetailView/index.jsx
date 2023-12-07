import { useCallback, useEffect, useMemo } from 'react'
import { Route, Routes, useParams } from 'react-router-dom'
import { makeStyles } from '@material-ui/core'

import GridLayout from 'components/GridLayout'
import {
  AttachmentCard,
  DetailTagCard,
  EntityActivityCard,
  LogTimelineCard,
  OpportunityStageCard,
  ProposalCard
} from 'components/cards'
import { parseToAbsolutePath, removeAbsolutePath } from 'utils/urlUtils'
import { routes } from 'constants/routes'
import {
  getCustomFieldValueByCode,
  getTitleBasedOnEntity,
  parseBEValues
} from 'utils/customFieldUtils'
import { entityValues } from 'constants/customFields'
import { permissionGroupNames } from 'constants/permissionGroups'
import useDeterminePermissions from 'hooks/useDeterminePermissions'
import AddEditActivity from 'pages/ActivityPage/AddEditActivity'
import {
  useAddAttachmentMutation,
  useDeleteAttachmentMutation,
  useGetOpportunityByIdQuery,
  useGetProposalStatsQuery
} from 'api/opportunityApi'
import AddEditEstimate from 'pages/EstimatePage/AddEditEstimate'
import queryParamsHelper from 'utils/queryParamsHelper'
import { SideModal } from 'components/modals'
import { tagEntityType } from 'constants/tagConstants'
import ProfileCardDetails from './ProfileCardDetails'
import customFieldNames from 'constants/customFieldNames'
import {
  useAddEstimateMutation,
  useUpdateEstimateMutation
} from 'api/estimateApi'
import apiCacheKeys from 'constants/apiCacheKeys'

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

const DetailView = ({ layout, updateItem, putReducer }) => {
  const { id, view } = useParams()
  const classes = useStyles()
  const activityPermission = useDeterminePermissions(
    permissionGroupNames.activity
  )
  const estimatePermission = useDeterminePermissions(
    permissionGroupNames.estimate
  )
  const { data, isFetching, refetch } = useGetOpportunityByIdQuery(id, {
    refetchOnMountOrArgChange: true
  })

  const { data: proposalStats } = useGetProposalStatsQuery(id)

  const [addAttachment, postAttachment] = useAddAttachmentMutation()
  const [deleteAttachment, delAttachment] = useDeleteAttachmentMutation()

  const [, postEstimate] = useAddEstimateMutation({
    fixedCacheKey: apiCacheKeys.estimate.add
  })
  const [, putEstimate] = useUpdateEstimateMutation({
    fixedCacheKey: apiCacheKeys.estimate.update
  })

  useEffect(() => {
    if (postEstimate.isSuccess || putEstimate.isSuccess) {
      refetch()
    }
    //eslint-disable-next-line
  }, [postEstimate, putEstimate])

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
        h: 27,
        i: 'profile_card',
        autoHeight: true
      },
      {
        x: 1,
        y: 0,
        w: 4,
        h: 4,
        i: 'stage_card'
      },
      {
        x: 1,
        y: 14,
        w: 3,
        h: 20,
        i: 'entity_activity',
        autoHeight: true
      },
      {
        x: 1,
        y: 34,
        w: 3,
        h: 20,
        i: 'log_card',
        autoHeight: true
      },
      {
        x: 4,
        y: 4,
        w: 1,
        h: 15,
        i: 'attachments'
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
        y: 4,
        w: 3,
        h: 10,
        i: 'proposal_card',
        autoHeight: true
      }
    ],
    []
  )

  const handleEditSubmit = useCallback(
    (
      {
        stageId,
        expectingClosingDate,
        accountId,
        expectedRevenue,
        opportunityName,
        tag,
        followupEmailSubject,
        followupEmailBody,
        ...values
      },
      successMessage
    ) => {
      let data = {
        ...values
      }

      updateItem({
        id,
        data: queryParamsHelper({
          customFields: data,
          stageId,
          expectingClosingDate,
          accountId,
          expectedRevenue,
          opportunityName,
          tag,
          followupEmailSubject,
          followupEmailBody
        }),
        successMessage
      })
    },
    [updateItem, id]
  )

  const proposalLogs = useMemo(() => {
    return (
      proposalStats &&
      proposalStats.map(({ clickedAt }) => ({
        newValue: 'Opened',
        logType: 'proposal',
        createdAt: clickedAt
      }))
    )
  }, [proposalStats])

  const cards = useMemo(
    () => ({
      profile_card: (
        <ProfileCardDetails
          isFetching={isFetching}
          item={item}
          onEditSubmit={handleEditSubmit}
          layout={layout}
          id={id}
          view={view}
        />
      ),
      entity_activity: (
        <EntityActivityCard
          id={id}
          entity={entityValues.opportunity}
          parentUrl={removeAbsolutePath(routes.opportunities.toView(id, view))}
          item={item}
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
      tag_card: (
        <DetailTagCard
          entity={tagEntityType.opportunity}
          values={item?.tag}
          onChange={handleEditSubmit}
        />
      ),
      stage_card: (
        <OpportunityStageCard
          stages={item?.stageLog || []}
          currentStage={item?.stage}
          closedAt={item?.closedAt}
          closedDuration={item?.totalDuration}
          closedLostReason={getCustomFieldValueByCode(
            item,
            `${customFieldNames.lostReason}.name`
          )}
          onChange={handleEditSubmit}
          layout={layout}
          item={item}
        />
      ),
      log_card: (
        <LogTimelineCard
          id={id}
          entity={entityValues.opportunity}
          putReducer={putReducer}
          staticLogs={proposalLogs}
          onlyLogs
        />
      ),
      proposal_card: (
        <ProposalCard
          opportunityId={id}
          estimates={item?.estimates}
          item={item}
          isRefetch={postEstimate.isSuccess || putEstimate.isSuccess}
        />
      )
    }),
    [
      view,
      item,
      layout,
      id,
      handleEditSubmit,
      addAttachment,
      deleteAttachment,
      postAttachment,
      delAttachment,
      isFetching,
      putReducer,
      postEstimate.isSuccess,
      putEstimate.isSuccess,
      proposalLogs
    ]
  )

  return (
    <SideModal
      width={'100%'}
      title={getTitleBasedOnEntity(entityValues.opportunity, item)}
      headerClassName={classes.sideModalHeader}
      closeLink={parseToAbsolutePath(routes.opportunities[view])}
    >
      <div className={classes.container}>
        <GridLayout
          positions={positions}
          cards={cards}
          disableDragging
          gridWidth={1800}
        />
        <Routes>
          {activityPermission.update && (
            <Route
              path={routes.activity.detailEdit}
              element={
                <AddEditActivity
                  closeLink={routes.opportunities.toView(id, view)}
                  fromDetailView
                  hideRelatedFields
                />
              }
            />
          )}
          {activityPermission.create && (
            <Route
              path={routes.activity.detailAdd}
              element={
                <AddEditActivity
                  closeLink={routes.opportunities.toView(id, view)}
                  fromDetailView
                  hideRelatedFields
                />
              }
            />
          )}
          {estimatePermission.create && (
            <Route
              path={routes.estimates.detailAdd}
              element={
                <AddEditEstimate
                  closeLink={routes.opportunities.toView(id, view)}
                  loadLayout
                  fromDetailView
                />
              }
            />
          )}
          {estimatePermission.update && (
            <Route
              path={routes.estimates.detailEdit}
              element={
                <AddEditEstimate
                  closeLink={routes.opportunities.toView(id, view)}
                  loadLayout
                  fromDetailView
                />
              }
            />
          )}
          {estimatePermission.create && (
            <Route
              path={routes.estimates.detailClone}
              element={
                <AddEditEstimate
                  closeLink={routes.opportunities.toView(id, view)}
                  loadLayout
                  fromDetailView
                  isClone
                />
              }
            />
          )}
        </Routes>
      </div>
    </SideModal>
  )
}

export default DetailView
