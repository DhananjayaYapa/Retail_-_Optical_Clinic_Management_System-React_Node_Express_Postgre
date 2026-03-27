import { combineReducers } from '@reduxjs/toolkit'
import authReducer from './auth.reducer'
import patientReducer from './patient.reducer'
import searchReducer from './search.reducer'
import alertReducer from './alert.reducer'

const rootReducer = combineReducers({
  auth: authReducer,
  patient: patientReducer,
  search: searchReducer,
  alert: alertReducer,
})

export default rootReducer
