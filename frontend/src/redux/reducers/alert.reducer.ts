import { COMMON_ACTION_TYPES, PATIENT_ACTION_TYPES } from '../../utilities/constants'

interface AlertItem {
  message: string
  severity: 'success' | 'error' | 'warning' | 'info'
}

export interface AlertState {
  fetchPatients: AlertItem | null
  createPatient: AlertItem | null
}

const initialState: AlertState = {
  fetchPatients: null,
  createPatient: null,
}

interface AlertAction {
  type: string
  message?: string
  severity?: 'success' | 'error' | 'warning' | 'info'
}

const alertReducer = (state: AlertState = initialState, action: AlertAction): AlertState => {
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
    default:
      return state
  }
}

export default alertReducer
