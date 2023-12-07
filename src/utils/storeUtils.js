import { resetAll } from '../store/actions'

//add this into extraReducer to reset the state at logout
export const buildGlobalResetReducer = (builder, initialState) =>
  builder.addCase(resetAll, () => initialState)
