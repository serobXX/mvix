import { createAppApi } from '../api.js'
import apiTags from 'constants/apiTags'
import {
  injectGetApiMiddleware,
  injectLazyGetApiMiddleware
} from 'utils/apiUtils.js'

export const packageProfileApi = createAppApi(
  'packageProfileReducer',
  {
    endpoints: builder => ({
      getPackageProfiles: builder.query({
        query: params => ({
          url: '/package_profile',
          method: 'GET',
          params
        }),
        providesTags: [apiTags.packageProfile]
      }),
      addPackageProfile: builder.mutation({
        query: body => ({
          url: `/package_profile`,
          method: 'POST',
          body
        })
      }),
      getPackageProfileById: builder.query({
        query: id => `/package_profile/${id}`
      }),
      updatePackageProfile: builder.mutation({
        query: ({ id, data }) => ({
          url: `/package_profile/${id}`,
          method: 'PUT',
          body: data
        })
      }),
      deletePackageProfile: builder.mutation({
        query: id => ({
          url: `/package_profile/${id}`,
          method: 'DELETE'
        })
      }),
      bulkDeletePackageProfile: builder.mutation({
        queryFn: async (ids, _queryApi, _extraOptions, fetchWithBQ) => {
          const result = await Promise.all(
            ids.map(id =>
              fetchWithBQ({
                url: `/package_profile/${id}`,
                method: 'DELETE'
              })
            )
          )
          const isSuccess = result.find(({ error }) => !error)
          if (isSuccess) {
            return { data: {} }
          } else {
            return {
              error: result[0]?.error
            }
          }
        }
      })
    })
  },
  {
    tagTypes: [apiTags.packageProfile]
  }
)

export const useGetPackageProfilesQuery = injectGetApiMiddleware(
  packageProfileApi.useGetPackageProfilesQuery
)
export const useLazyGetPackageProfilesQuery = injectLazyGetApiMiddleware(
  packageProfileApi.useLazyGetPackageProfilesQuery
)

export const {
  useAddPackageProfileMutation,
  useGetPackageProfileByIdQuery,
  useLazyGetPackageProfileByIdQuery,
  useUpdatePackageProfileMutation,
  useDeletePackageProfileMutation,
  useBulkDeletePackageProfileMutation
} = packageProfileApi
