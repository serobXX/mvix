import { createAppApi } from '../api.js'
import apiTags from 'constants/apiTags'

export const authApi = createAppApi(
  'authReducer',
  {
    endpoints: builder => ({
      getMe: builder.query({
        query: () => '/me',
        providesTags: [apiTags.me]
      }),
      updateMe: builder.mutation({
        query: data => ({
          url: '/me',
          method: 'PUT',
          body: data
        })
      }),
      refreshToken: builder.mutation({
        query: () => ({
          url: '/refresh',
          method: 'POST'
        })
      }),
      socialLogin: builder.mutation({
        query: data => ({
          url: '/socialLogin',
          method: 'POST',
          body: data
        })
      }),
      logout: builder.mutation({
        query: () => ({
          url: '/logout',
          method: 'POST'
        })
      })
    })
  },
  {
    tagTypes: [apiTags.me]
  }
)

export const {
  useGetMeQuery,
  useLazyGetMeQuery,
  useUpdateMeMutation,
  useSocialLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation
} = authApi
