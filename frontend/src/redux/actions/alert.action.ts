import { COMMON_ACTION_TYPES, PATIENT_ACTION_TYPES } from '../../utilities/constants'

const clearFetchPatientsAlert = () => ({
  type: PATIENT_ACTION_TYPES.FETCH_PATIENTS + COMMON_ACTION_TYPES.CLEAR_ALERT,
})

const clearCreatePatientAlert = () => ({
  type: PATIENT_ACTION_TYPES.CREATE_PATIENT + COMMON_ACTION_TYPES.CLEAR_ALERT,
})

const clearUpdatePatientAlert = () => ({
  type: PATIENT_ACTION_TYPES.UPDATE_PATIENT + COMMON_ACTION_TYPES.CLEAR_ALERT,
})

const clearDeletePatientAlert = () => ({
  type: PATIENT_ACTION_TYPES.DELETE_PATIENT + COMMON_ACTION_TYPES.CLEAR_ALERT,
})

const clearRestorePatientAlert = () => ({
  type: PATIENT_ACTION_TYPES.RESTORE_PATIENT + COMMON_ACTION_TYPES.CLEAR_ALERT,
})

export const alertActions = {
  clearFetchPatientsAlert,
  clearCreatePatientAlert,
  clearUpdatePatientAlert,
  clearDeletePatientAlert,
  clearRestorePatientAlert,
}
