import { useCallback, useMemo } from 'react'
import { makeStyles } from '@material-ui/core'
import { Route, Routes, useParams } from 'react-router-dom'

import GridLayout from 'components/GridLayout'
import {
  AddressCard,
  AttachmentCard,
  DetailTagCard,
  EntityActivityCard,
  InvoiceCard,
  LogTimelineCard,
  OpportunityCard,
  SummaryCard
} from 'components/cards'
import { parseToAbsolutePath, removeAbsolutePath } from 'utils/urlUtils'
import { routes } from 'constants/routes'
import {
  useAddAttachmentMutation,
  useDeleteAttachmentMutation,
  useGetAccountByIdQuery
} from 'api/accountApi'
import {
  getCustomFieldValueByCode,
  getTitleBasedOnEntity,
  parseBEValues
} from 'utils/customFieldUtils'
import { entityValues } from 'constants/customFields'
import { permissionGroupNames } from 'constants/permissionGroups'
import useDeterminePermissions from 'hooks/useDeterminePermissions'
import AddEditActivity from 'pages/ActivityPage/AddEditActivity'
import { _get } from 'utils/lodash'
import customFieldNames from 'constants/customFieldNames'
import { SideModal } from 'components/modals'
import ProfileCardDetails from './ProfileCardDetails'
import iconNames, { iconTypes } from 'constants/iconNames'
import { getIconClassName } from 'utils/iconUtils'
import PaymentProfile from './PaymentProfile'
import DemoCard from './DemoCard'
import TrainingCard from './TrainingCard'
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
  const activityPermission = useDeterminePermissions(
    permissionGroupNames.activity
  )
  const { data, isFetching } = useGetAccountByIdQuery(id, {
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
        x: 0,
        y: 17,
        w: 1,
        h: 16,
        i: 'summary_card'
      },
      {
        x: 4,
        y: 0,
        w: 1,
        h: 16,
        i: 'address_card'
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
        h: 20,
        i: 'entity_activity',
        autoHeight: true
      },
      {
        x: 1,
        y: 20,
        w: 3,
        h: 20,
        i: 'log_card',
        autoHeight: true
      },
      {
        x: 0,
        y: 33,
        w: 1,
        h: 25,
        i: 'invoice'
      },
      {
        x: 1,
        y: 40,
        w: 1,
        h: 26,
        i: 'payment_profile'
      },
      {
        x: 2,
        y: 40,
        w: 1,
        h: 32,
        i: 'demo',
        autoHeight: true
      },
      {
        x: 3,
        y: 40,
        w: 1,
        h: 32,
        i: 'training',
        autoHeight: true
      },
      {
        x: 4,
        y: 31,
        w: 1,
        h: 10,
        i: 'tag_card',
        autoHeight: true
      },
      {
        x: 4,
        y: 36,
        w: 1,
        h: 26,
        i: 'opportunity'
      }
    ],
    []
  )

  const handleEditSubmit = useCallback(
    ({ tag, ...values }) => {
      let data = {
        ...values
      }
      if (values.addressData) {
        let addresses = [
          ..._get(item, `customFields.${customFieldNames.addresses}`, [])
        ]
        addresses.splice(0, 1, values.addressData)
        data[customFieldNames.addresses] = addresses
      }
      delete data.address
      delete data.addressData

      if (data.avatar) {
        if (typeof data.avatar === 'string') {
          updateItem({
            id,
            data: { avatar: data.avatar }
          })
        } else {
          const formData = new FormData()
          formData.set('avatarFile', data.avatar[0])
          updateItem({
            id,
            data: formData
          })
        }
      } else {
        updateItem({
          id,
          data: {
            customFields: data,
            tag
          }
        })
      }
    },
    [updateItem, id, item]
  )

  const demographicsInterestList = useMemo(
    () => [
      {
        icon: getIconClassName(iconNames.leadSource, iconTypes.duotone),
        tooltip: 'Lead Source',
        name: customFieldNames.leadSource,
        formValue: getCustomFieldValueByCode(item, customFieldNames.leadSource)
          ?.id,
        value:
          getCustomFieldValueByCode(item, customFieldNames.leadSource)?.name ||
          'N/A'
      },
      {
        icon: getIconClassName(iconNames.industry, iconTypes.duotone),
        tooltip: 'Lead Industry',
        name: customFieldNames.leadIndustry,
        formValue: getCustomFieldValueByCode(
          item,
          customFieldNames.leadIndustry
        )?.id,
        value:
          getCustomFieldValueByCode(item, customFieldNames.leadIndustry)
            ?.name || 'N/A'
      },
      {
        icon: getIconClassName(iconNames.solution, iconTypes.duotone),
        tooltip: 'Solution Interest',
        name: customFieldNames.leadSolutionInterest,
        formValue: getCustomFieldValueByCode(
          item,
          customFieldNames.leadSolutionInterest
        )?.id,
        value:
          getCustomFieldValueByCode(item, customFieldNames.leadSolutionInterest)
            ?.name || 'N/A'
      }
    ],
    [item]
  )

  const cards = useMemo(
    () => ({
      profile_card: (
        <ProfileCardDetails
          isFetching={isFetching}
          item={isFetching ? {} : item}
          onEditSubmit={handleEditSubmit}
          layout={layout}
          opportunitiesData={item?.opportunities || []}
        />
      ),
      summary_card: (
        <SummaryCard
          title="Demographics & Interest"
          list={demographicsInterestList}
          layout={layout}
          onEditSubmit={handleEditSubmit}
          showEditorWithReadOnly
        />
      ),
      address_card: (
        <AddressCard
          name="addresses"
          value={_get(item, `customFields.${customFieldNames.addresses}`, [])}
          onEditSubmit={handleEditSubmit}
          permission={permission}
          showEditorWithReadOnly
        />
      ),
      entity_activity: (
        <EntityActivityCard
          id={id}
          entity={entityValues.account}
          parentUrl={removeAbsolutePath(routes.accounts.toView(id, view))}
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
      invoice: <InvoiceCard data={item?.invoices} />,
      opportunity: (
        <OpportunityCard
          data={item?.opportunities}
          parentUrl={removeAbsolutePath(routes.opportunities.toView(id, view))}
        />
      ),
      payment_profile: <PaymentProfile accountId={id} />,
      demo: <DemoCard accountId={id} />,
      training: <TrainingCard accountId={id} />,
      tag_card: (
        <DetailTagCard
          entity={tagEntityType.account}
          values={item?.tag}
          onChange={handleEditSubmit}
        />
      ),
      log_card: (
        <LogTimelineCard
          id={id}
          entity={entityValues.account}
          putReducer={putReducer}
          onlyLogs
        />
      )
    }),
    [
      view,
      isFetching,
      item,
      layout,
      permission,
      id,
      handleEditSubmit,
      demographicsInterestList,
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
      title={getTitleBasedOnEntity(entityValues.account, item)}
      headerClassName={classes.sideModalHeader}
      closeLink={parseToAbsolutePath(routes.accounts[view])}
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
        {activityPermission.update && (
          <Route
            path={routes.activity.detailEdit}
            element={
              <AddEditActivity
                closeLink={routes.accounts.toView(id, view)}
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
                closeLink={routes.accounts.toView(id, view)}
                fromDetailView
                hideRelatedFields
              />
            }
          />
        )}
      </Routes>
    </SideModal>
  )
}

export default DetailView
