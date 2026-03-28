import { COMMON_ACTION_TYPES, PATIENT_ACTION_TYPES } from '../../utilities/constants'
import type { AlertActionDto, AlertState } from '../../utilities/models'

const initialState: AlertState = {
  fetchPatients: null,
  createPatient: null,
  updatePatient: null,
  deletePatient: null,
  restorePatient: null,
}

const alertReducer = (state: AlertState = initialState, action: AlertActionDto): AlertState => {
  switch (action.type) {
    case PATIENT_ACTION_TYPES.FETCH_PATIENTS + COMMON_ACTION_TYPES.SET_ALERT:
      return {
        ...state,
        fetchPatients: {
          message: action.message || '',
          severity: action.severity || 'error',
        },
      }
    case PATIENT_ACTION_TYPES.FETCH_PATIENTS + COMMON_ACTION_TYPES.CLEAR_ALERT:
      return {
        ...state,
        fetchPatients: null,
      }
    case PATIENT_ACTION_TYPES.CREATE_PATIENT + COMMON_ACTION_TYPES.SET_ALERT:
      return {
        ...state,
        createPatient: {
          message: action.message || '',
          severity: action.severity || 'error',
        },
      }
    case PATIENT_ACTION_TYPES.CREATE_PATIENT + COMMON_ACTION_TYPES.CLEAR_ALERT:
      return {
        ...state,
        createPatient: null,
      }
    case PATIENT_ACTION_TYPES.UPDATE_PATIENT + COMMON_ACTION_TYPES.SET_ALERT:
      return {
        ...state,
        updatePatient: {
          message: action.message || '',
          severity: action.severity || 'error',
        },
      }
    case PATIENT_ACTION_TYPES.UPDATE_PATIENT + COMMON_ACTION_TYPES.CLEAR_ALERT:
      return {
        ...state,
        updatePatient: null,
      }
    case PATIENT_ACTION_TYPES.DELETE_PATIENT + COMMON_ACTION_TYPES.SET_ALERT:
      return {
        ...state,
        deletePatient: {
          message: action.message || '',
          severity: action.severity || 'error',
        },
      }
    case PATIENT_ACTION_TYPES.DELETE_PATIENT + COMMON_ACTION_TYPES.CLEAR_ALERT:
      return {
        ...state,
        deletePatient: null,
      }
    case PATIENT_ACTION_TYPES.RESTORE_PATIENT + COMMON_ACTION_TYPES.SET_ALERT:
      return {
        ...state,
        restorePatient: {
          message: action.message || '',
          severity: action.severity || 'error',
        },
      }
    case PATIENT_ACTION_TYPES.RESTORE_PATIENT + COMMON_ACTION_TYPES.CLEAR_ALERT:
      return {
        ...state,
        restorePatient: null,
      }
    default:
      return state
  }
}

export default alertReducer
