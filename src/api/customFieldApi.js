import { createAppApi } from '../api.js'
import apiTags from 'constants/apiTags'
import { BIG_LIMIT } from 'constants/app.js'
import { entityValues } from 'constants/customFields.js'
import {
  createSuccessInvalidator,
  injectGetApiMiddleware,
  injectLazyGetApiMiddleware
} from 'utils/apiUtils.js'

export const customFieldApi = createAppApi(
  'customFieldReducer',
  {
    endpoints: builder => ({
      getCustomFieldsByEntity: builder.query({
        query: params => ({
          url: '/customField',
          method: 'GET',
          params: {
            ...params,
            entityType: params.entityType || entityValues.lead,
            limit: params.limit || BIG_LIMIT
          }
        }),
        providesTags: [apiTags.customField]
      }),
      updateCustomFieldsByEntity: builder.mutation({
        query: body => ({
          url: `/customField/bulk`,
          method: 'POST',
          body
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.customField])
      }),
      getCustomFieldSettings: builder.query({
        query: () => ({ url: '/customFields/settings' })
      })
    })
  },
  {
    tagTypes: [apiTags.customField]
  }
)

export const useGetCustomFieldsByEntityQuery = injectGetApiMiddleware(
  customFieldApi.useGetCustomFieldsByEntityQuery
)
export const useLazyGetCustomFieldsByEntityQuery = injectLazyGetApiMiddleware(
  customFieldApi.useLazyGetCustomFieldsByEntityQuery
)

export const {
  useUpdateCustomFieldsByEntityMutation,
  useGetCustomFieldSettingsQuery,
  useLazyGetCustomFieldSettingsQuery
} = customFieldApi
