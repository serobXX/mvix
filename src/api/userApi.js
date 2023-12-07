import { createAppApi } from '../api.js'
import apiTags from 'constants/apiTags'
import {
  injectGetApiMiddleware,
  injectLazyGetApiMiddleware
} from 'utils/apiUtils.js'

export const userApi = createAppApi(
  'userReducer',
  {
    endpoints: builder => ({
      getUsers: builder.query({
        query: params => ({
          url: '/user',
          method: 'GET',
          params
        }),
        providesTags: [apiTags.user]
      }),
      addUser: builder.mutation({
        query: body => ({
          url: `/user`,
          method: 'POST',
          body
        })
      }),
      getUserById: builder.query({
        query: id => `/user/${id}`
      }),
      updateUser: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `/user/${id}`,
          method: 'PUT',
          body
        })
      })
    })
  },
  {
    tagTypes: [apiTags.user]
  }
)

export const useGetUsersQuery = injectGetApiMiddleware(userApi.useGetUsersQuery)
export const useLazyGetUsersQuery = injectLazyGetApiMiddleware(
  userApi.useLazyGetUsersQuery
)

export const {
  useAddUserMutation,
  useGetUserByIdQuery,
  useLazyGetUserByIdQuery,
  useUpdateUserMutation
} = userApi
