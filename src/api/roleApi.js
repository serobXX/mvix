import { createAppApi } from '../api.js'
import apiTags from 'constants/apiTags'
import {
  createSuccessInvalidator,
  injectGetApiMiddleware,
  injectLazyGetApiMiddleware
} from 'utils/apiUtils.js'

export const roleApi = createAppApi(
  'roleReducer',
  {
    endpoints: builder => ({
      getRoles: builder.query({
        query: params => ({
          url: '/role',
          method: 'GET',
          params
        }),
        providesTags: [apiTags.role]
      }),
      addRole: builder.mutation({
        query: body => ({
          url: `/role`,
          method: 'POST',
          body
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.role])
      }),
      getRoleById: builder.query({
        query: id => `/role/${id}`
      }),
      updateRole: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `/role/${id}`,
          method: 'PUT',
          body
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.role])
      }),
      deleteRole: builder.mutation({
        query: id => ({
          url: `/role/${id}`,
          method: 'DELETE'
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.role])
      }),
      getRolePermissions: builder.query({
        query: id => `/role/${id}/permission`,
        providesTags: [apiTags.permission]
      }),
      updateRolePermissions: builder.mutation({
        query: ({ id, permissions }) => ({
          url: `/role/${id}/permission`,
          method: 'PUT',
          body: permissions
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.permission])
      })
    })
  },
  {
    tagTypes: [apiTags.role, apiTags.permission]
  }
)

export const useGetRolesQuery = injectGetApiMiddleware(roleApi.useGetRolesQuery)
export const useLazyGetRolesQuery = injectLazyGetApiMiddleware(
  roleApi.useLazyGetRolesQuery
)

export const {
  useAddRoleMutation,
  useGetRoleByIdQuery,
  useLazyGetRoleByIdQuery,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetRolePermissionsQuery,
  useLazyGetRolePermissionsQuery,
  useUpdateRolePermissionsMutation
} = roleApi
