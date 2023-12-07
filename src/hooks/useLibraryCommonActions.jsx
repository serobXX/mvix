import { useCallback, useMemo, useState } from 'react'
import useDeterminePermissions from './useDeterminePermissions'
import { permissionGroupNames } from 'constants/permissionGroups'
import { useAddActivityMutation } from 'api/activityApi'
import apiCacheKeys from 'constants/apiCacheKeys'
import useNotifyAnalyzer from './useNotifyAnalyzer'
import { notifyLabels } from 'constants/notifyAnalyzer'
import { routes } from 'constants/routes'
import {
  getOwnerBasedOnEntity,
  getTitleBasedOnEntity
} from 'utils/customFieldUtils'
import UpdateFieldModal from 'components/modals/UpdateFieldModal'

const useLibraryCommonActions = ({
  parentUrl,
  entityType,
  permission,
  updateItem,
  tableRef,
  bulkUpdateItems,
  layout,
  hideTask,
  hideOwner,
  hideTag
}) => {
  const activityPermission = useDeterminePermissions(
    permissionGroupNames.activity
  )
  const [openUpdateModal, setOpenUpdateModal] = useState(false)
  const [updateModalData, setUpdateModalData] = useState({
    field: 'tag',
    value: '',
    data: {}
  })

  const [, postActivity] = useAddActivityMutation({
    fixedCacheKey: apiCacheKeys.activity.add
  })

  useNotifyAnalyzer({
    entityName: 'Activity',
    watchArray: [postActivity],
    labels: [notifyLabels.add]
  })

  const actions = useMemo(
    () => [
      ...(hideTask
        ? []
        : [
            {
              label: 'Add Task',
              to: data => ({
                pathname: routes.activity.toLibraryAdd(parentUrl),
                data: {
                  relatedToEntity: entityType,
                  relatedToId: data.id,
                  relatedToIdOption: {
                    label: getTitleBasedOnEntity(entityType, data),
                    value: data.id
                  },
                  activityType: 'Task'
                }
              }),
              render: activityPermission.create
            }
          ]),
      ...(hideTag
        ? []
        : [
            {
              label: 'Add Tags',
              clickAction: (e, data) => {
                setUpdateModalData({
                  field: 'tag',
                  value: data.tag,
                  data: data,
                  title: 'Add Tags'
                })
                setOpenUpdateModal(true)
              },
              render: permission.update
            }
          ]),
      ...(hideOwner
        ? []
        : [
            {
              label: 'Change Owner',
              clickAction: (e, data) => {
                setUpdateModalData({
                  field: 'owner',
                  value: getOwnerBasedOnEntity(entityType, data)?.id,
                  data: data,
                  title: 'Add Owner'
                })
                setOpenUpdateModal(true)
              },
              render: permission.update
            }
          ])
    ],
    [
      permission,
      activityPermission,
      parentUrl,
      entityType,
      hideOwner,
      hideTag,
      hideTask
    ]
  )

  const handleCloseUpdateModal = useCallback(() => {
    setUpdateModalData({})
    setOpenUpdateModal(false)
  }, [])

  const handleSubmitUpdateModal = useCallback(
    values => {
      if (updateModalData.isBulk) {
        bulkUpdateItems({
          ids: updateModalData?.ids,
          data: {
            ...values
          }
        })
          .unwrap()
          .then(() => {
            handleCloseUpdateModal()
            tableRef.current && tableRef.current.refresh()
          })
      } else {
        updateItem({
          id: updateModalData?.data?.id,
          data: {
            ...values
          }
        })
          .unwrap()
          .then(() => {
            handleCloseUpdateModal()
            tableRef.current && tableRef.current.refresh()
          })
      }
    },
    [
      updateItem,
      updateModalData,
      tableRef,
      handleCloseUpdateModal,
      bulkUpdateItems
    ]
  )

  const handleOpenUpdateModal = useCallback(
    ({ field, title, isCustomField, ids }) => {
      setUpdateModalData({
        field,
        title,
        isBulk: true,
        ids,
        isCustomField
      })
      setOpenUpdateModal(true)
    },
    []
  )

  return useMemo(
    () => ({
      actions,
      modalRender: openUpdateModal && (
        <UpdateFieldModal
          open={openUpdateModal}
          onSubmit={handleSubmitUpdateModal}
          onClose={handleCloseUpdateModal}
          entityType={entityType}
          layout={layout}
          {...updateModalData}
        />
      ),
      onOpenUpdateModal: handleOpenUpdateModal
    }),
    [
      actions,
      entityType,
      handleSubmitUpdateModal,
      handleCloseUpdateModal,
      updateModalData,
      openUpdateModal,
      handleOpenUpdateModal,
      layout
    ]
  )
}

export default useLibraryCommonActions
