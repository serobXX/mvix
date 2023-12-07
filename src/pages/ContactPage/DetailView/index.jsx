import { useCallback, useMemo } from 'react'
import { makeStyles } from '@material-ui/core'
import { Route, Routes, useParams } from 'react-router-dom'

import GridLayout from 'components/GridLayout'
import {
  AddressCard,
  AttachmentCard,
  DetailTagCard,
  EntityActivityCard,
  LogTimelineCard,
  SummaryCard
} from 'components/cards'
import { parseToAbsolutePath, removeAbsolutePath } from 'utils/urlUtils'
import { routes } from 'constants/routes'
import {
  useAddAttachmentMutation,
  useDeleteAttachmentMutation,
  useGetContactByIdQuery
} from 'api/contactApi'
import {
  getCustomFieldValueByCode,
  getTitleBasedOnEntity,
  parseBEValues
} from 'utils/customFieldUtils'
import { entityValues } from 'constants/customFields'
import { permissionGroupNames } from 'constants/permissionGroups'
import useDeterminePermissions from 'hooks/useDeterminePermissions'
import AddEditActivity from 'pages/ActivityPage/AddEditActivity'
import customFieldNames from 'constants/customFieldNames'
import { getIconClassName } from 'utils/iconUtils'
import iconNames, { iconTypes } from 'constants/iconNames'
import { SideModal } from 'components/modals'
import ProfileCardDetails from './ProfileCardDetails'
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
  const { data, isFetching } = useGetContactByIdQuery(id, {
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
        h: 26,
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
        x: 4,
        y: 31,
        w: 1,
        h: 5,
        i: 'tag_card',
        autoHeight: true
      }
    ],
    []
  )

  const handleEditSubmit = useCallback(
    ({ tag, ...values }) => {
      let data = {
        ...values
      }
      if (data[customFieldNames.contactAuthority]) {
        data[customFieldNames.contactAuthority] = Array.isArray(
          data[customFieldNames.contactAuthority]
        )
          ? data[customFieldNames.contactAuthority].map(({ value }) => value)
          : data[customFieldNames.contactAuthority]
      }
      if (values.addressData) {
        let addresses = [
          ...getCustomFieldValueByCode(item, customFieldNames.addresses, [])
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
          data: { customFields: data, tag }
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
        formValue: getCustomFieldValueByCode(
          item,
          `${customFieldNames.leadSource}.id`
        ),
        value: getCustomFieldValueByCode(
          item,
          `${customFieldNames.leadSource}.name`,
          'N/A'
        )
      },
      {
        icon: getIconClassName(iconNames.industry, iconTypes.duotone),
        tooltip: 'Lead Industry',
        name: customFieldNames.leadIndustry,
        formValue: getCustomFieldValueByCode(
          item,
          `${customFieldNames.leadIndustry}.id`
        ),
        value: getCustomFieldValueByCode(
          item,
          `${customFieldNames.leadIndustry}.name`,
          'N/A'
        )
      },
      {
        icon: getIconClassName(iconNames.solution, iconTypes.duotone),
        tooltip: 'Solution Interest',
        name: customFieldNames.leadSolutionInterest,
        formValue: getCustomFieldValueByCode(
          item,
          `${customFieldNames.leadSolutionInterest}.id`
        ),
        value: getCustomFieldValueByCode(
          item,
          `${customFieldNames.leadSolutionInterest}.name`,
          'N/A'
        )
      }
    ],
    [item]
  )

  const cards = useMemo(
    () => ({
      profile_card: (
        <ProfileCardDetails
          item={isFetching ? {} : item}
          onEditSubmit={handleEditSubmit}
          layout={layout}
          isFetching={isFetching}
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
          value={getCustomFieldValueByCode(
            item,
            customFieldNames.addresses,
            []
          )}
          onEditSubmit={handleEditSubmit}
          permission={permission}
          showEditorWithReadOnly
        />
      ),
      entity_activity: (
        <EntityActivityCard
          id={id}
          entity={entityValues.contact}
          parentUrl={removeAbsolutePath(routes.contacts.toView(id, view))}
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
          entity={tagEntityType.contact}
          values={item?.tag}
          onChange={handleEditSubmit}
        />
      ),
      log_card: (
        <LogTimelineCard
          id={id}
          entity={entityValues.contact}
          putReducer={putReducer}
          onlyLogs
        />
      )
    }),
    [
      view,
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
      isFetching,
      putReducer
    ]
  )

  return (
    <SideModal
      width={'100%'}
      title={getTitleBasedOnEntity(entityValues.contact, item)}
      headerClassName={classes.sideModalHeader}
      closeLink={parseToAbsolutePath(routes.contacts[view])}
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
                closeLink={routes.contacts.toView(id, view)}
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
                closeLink={routes.contacts.toView(id, view)}
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
