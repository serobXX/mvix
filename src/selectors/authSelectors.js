import { createSelector } from '@reduxjs/toolkit'
import { authApi } from 'api/authApi'

export const getMeSelector = createSelector(
  authApi.endpoints.getMe.select(null),
  user => user
)
