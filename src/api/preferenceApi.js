import { createAppApi } from '../api.js'
import apiTags from 'constants/apiTags'
import { filterEntityValues } from 'constants/filterPreference.js'
import { createSuccessInvalidator } from 'utils/apiUtils.js'

export const preferenceApi = createAppApi(
  'preferenceReducer',
  {
    endpoints: builder => ({
      getPreferences: builder.query({
        query: ({ entity, ...params }) => ({
          url: '/preference',
          method: 'GET',
          params: {
            ...params,
            entity: entity || filterEntityValues.lead
          }
        }),
        providesTags: [apiTags.preference]
      }),
      addPreference: builder.mutation({
        query: body => ({
          url: `/preference`,
          method: 'POST',
          body
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.preference])
      }),
      getPreferenceById: builder.query({
        query: id => `/preference/${id}`,
        providesTags: [apiTags.preference]
      }),
      updatePreference: builder.mutation({
        query: ({ id, data }) => ({
          url: `/preference/${id}`,
          method: 'PUT',
          body: data
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.preference])
      }),
      deletePreference: builder.mutation({
        query: id => ({
          url: `/preference/${id}`,
          method: 'DELETE'
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.preference])
      })
    })
  },
  {
    tagTypes: [apiTags.preference]
  }
)

export const {
  useGetPreferencesQuery,
  useLazyGetPreferencesQuery,
  useAddPreferenceMutation,
  useGetPreferenceByIdQuery,
  useLazyGetPreferenceByIdQuery,
  useUpdatePreferenceMutation,
  useDeletePreferenceMutation
} = preferenceApi
