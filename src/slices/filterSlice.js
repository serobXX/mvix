import { createSlice } from '@reduxjs/toolkit'
import update from 'immutability-helper'

import { filterInitialState } from 'constants/filter'
import { buildGlobalResetReducer } from 'utils/storeUtils'

const initialState = filterInitialState

export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    updateFilter: (state, action) => {
      return update(state, {
        [action.payload.entity]: { $set: action.payload.data }
      })
    },
    resetFilter: (state, action) => {
      return update(state, {
        [action.payload.entity]: { $set: initialState[action.payload.entity] }
      })
    }
  },
  extraReducers: builder => buildGlobalResetReducer(builder, initialState)
})

export const { updateFilter, resetFilter } = filterSlice.actions

export default filterSlice.reducer
