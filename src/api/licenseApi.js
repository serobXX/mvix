import { createAppApi } from '../api.js'
import apiTags from 'constants/apiTags'
import {
  injectGetApiMiddleware,
  injectLazyGetApiMiddleware
} from 'utils/apiUtils.js'

export const licenseApi = createAppApi(
  'licenseReducer',
  {
    endpoints: builder => ({
      getLicenses: builder.query({
        query: params => ({
          url: '/license',
          method: 'GET',
          params
        }),
        providesTags: [apiTags.license]
      }),
      addLicense: builder.mutation({
        query: body => ({
          url: `/license`,
          method: 'POST',
          body
        })
      }),
      getLicenseById: builder.query({
        query: id => `/license/${id}`
      }),
      updateLicense: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `/license/${id}`,
          method: 'PUT',
          body
        })
      }),
      deleteLicense: builder.mutation({
        query: id => ({
          url: `/license/${id}`,
          method: 'DELETE'
        })
      }),
      bulkDeleteLicense: builder.mutation({
        queryFn: async (ids, _queryApi, _extraOptions, fetchWithBQ) => {
          const result = await Promise.all(
            ids.map(id =>
              fetchWithBQ({
                url: `/license/${id}`,
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
    tagTypes: [apiTags.license]
  }
)

export const useGetLicensesQuery = injectGetApiMiddleware(
  licenseApi.useGetLicensesQuery
)
export const useLazyGetLicensesQuery = injectLazyGetApiMiddleware(
  licenseApi.useLazyGetLicensesQuery
)

export const {
  useAddLicenseMutation,
  useGetLicenseByIdQuery,
  useLazyGetLicenseByIdQuery,
  useUpdateLicenseMutation,
  useDeleteLicenseMutation,
  useBulkDeleteLicenseMutation
} = licenseApi
