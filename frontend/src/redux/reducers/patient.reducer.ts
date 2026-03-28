import { COMMON_ACTION_TYPES, PATIENT_ACTION_TYPES } from '../../utilities/constants'

const INITIAL_STATE = {
  fetchPatients: {
    isLoading: false,
    data: [],
    error: null,
  },
  createPatient: {
    isLoading: false,
    data: [],
    error: null,
    success: false,
  },
  fetchPatientById: {
    isLoading: false,
    data: null,
    error: null,
  },
  updatePatient: {
    isLoading: false,
    data: [],
    error: null,
    success: false,
  },
  deletePatient: {
    isLoading: false,
    data: [],
    error: null,
    success: false,
  },
  restorePatient: {
    isLoading: false,
    data: [],
    error: null,
    success: false,
  },
  fetchBranches: {
    isLoading: false,
    data: [],
    error: null,
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  duplicateWarning: null as any,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const patientReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    // FETCH PATIENTS
    case PATIENT_ACTION_TYPES.FETCH_PATIENTS + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        fetchPatients: {
          ...state.fetchPatients,
          isLoading: true,
          error: null,
        },
      }
    case PATIENT_ACTION_TYPES.FETCH_PATIENTS + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        fetchPatients: {
          isLoading: false,
          data: action.data,
          error: null,
        },
      }
    case PATIENT_ACTION_TYPES.FETCH_PATIENTS + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        fetchPatients: {
          isLoading: false,
          data: [],
          error: action.error,
        },
      }

    // CREATE PATIENT
    case PATIENT_ACTION_TYPES.CREATE_PATIENT + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        createPatient: {
          ...state.createPatient,
          isLoading: true,
          error: null,
          success: false,
        },
        duplicateWarning: null,
      }
    case PATIENT_ACTION_TYPES.CREATE_PATIENT + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        createPatient: {
          isLoading: false,
          data: action.data,
          error: null,
          success: true,
        },
      }
    case PATIENT_ACTION_TYPES.CREATE_PATIENT + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        createPatient: {
          isLoading: false,
          data: [],
          error: action.error,
          success: false,
        },
      }
    case PATIENT_ACTION_TYPES.CREATE_PATIENT + COMMON_ACTION_TYPES.CLEAR:
      return {
        ...state,
        createPatient: {
          isLoading: false,
          data: [],
          error: null,
          success: false,
        },
      }

    // FETCH PATIENT BY ID
    case PATIENT_ACTION_TYPES.FETCH_PATIENT_BY_ID + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        fetchPatientById: {
          isLoading: true,
          data: null,
          error: null,
        },
      }
    case PATIENT_ACTION_TYPES.FETCH_PATIENT_BY_ID + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        fetchPatientById: {
          isLoading: false,
          data: action.data,
          error: null,
        },
      }
    case PATIENT_ACTION_TYPES.FETCH_PATIENT_BY_ID + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        fetchPatientById: {
          isLoading: false,
          data: null,
          error: action.error,
        },
      }

    // UPDATE PATIENT
    case PATIENT_ACTION_TYPES.UPDATE_PATIENT + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        updatePatient: {
          ...state.updatePatient,
          isLoading: true,
          error: null,
          success: false,
        },
        duplicateWarning: null,
      }
    case PATIENT_ACTION_TYPES.UPDATE_PATIENT + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        updatePatient: {
          isLoading: false,
          data: action.data,
          error: null,
          success: true,
        },
      }
    case PATIENT_ACTION_TYPES.UPDATE_PATIENT + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        updatePatient: {
          isLoading: false,
          data: [],
          error: action.error,
          success: false,
        },
      }
    case PATIENT_ACTION_TYPES.UPDATE_PATIENT + COMMON_ACTION_TYPES.CLEAR:
      return {
        ...state,
        updatePatient: {
          isLoading: false,
          data: [],
          error: null,
          success: false,
        },
      }

    // DELETE PATIENT
    case PATIENT_ACTION_TYPES.DELETE_PATIENT + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        deletePatient: {
          ...state.deletePatient,
          isLoading: true,
          error: null,
          success: false,
        },
      }
    case PATIENT_ACTION_TYPES.DELETE_PATIENT + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        deletePatient: {
          isLoading: false,
          data: action.data,
          error: null,
          success: true,
        },
      }
    case PATIENT_ACTION_TYPES.DELETE_PATIENT + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        deletePatient: {
          isLoading: false,
          data: [],
          error: action.error,
          success: false,
        },
      }

    // RESTORE PATIENT
    case PATIENT_ACTION_TYPES.RESTORE_PATIENT + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        restorePatient: {
          ...state.restorePatient,
          isLoading: true,
          error: null,
          success: false,
        },
      }
    case PATIENT_ACTION_TYPES.RESTORE_PATIENT + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        restorePatient: {
          isLoading: false,
          data: action.data,
          error: null,
          success: true,
        },
      }
    case PATIENT_ACTION_TYPES.RESTORE_PATIENT + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        restorePatient: {
          isLoading: false,
          data: [],
          error: action.error,
          success: false,
        },
      }

    // FETCH BRANCHES
    case PATIENT_ACTION_TYPES.FETCH_BRANCHES + COMMON_ACTION_TYPES.REQUEST:
      return {
        ...state,
        fetchBranches: {
          ...state.fetchBranches,
          isLoading: true,
          error: null,
        },
      }
    case PATIENT_ACTION_TYPES.FETCH_BRANCHES + COMMON_ACTION_TYPES.SUCCESS:
      return {
        ...state,
        fetchBranches: {
          isLoading: false,
          data: action.data,
          error: null,
        },
      }
    case PATIENT_ACTION_TYPES.FETCH_BRANCHES + COMMON_ACTION_TYPES.ERROR:
      return {
        ...state,
        fetchBranches: {
          isLoading: false,
          data: [],
          error: action.error,
        },
      }

    // DUPLICATE WARNING
    case PATIENT_ACTION_TYPES.DUPLICATE_WARNING:
      return {
        ...state,
        createPatient: {
          ...state.createPatient,
          isLoading: false,
          success: false,
        },
        updatePatient: {
          ...state.updatePatient,
          isLoading: false,
          success: false,
        },
        duplicateWarning: action.payload,
      }
    case PATIENT_ACTION_TYPES.DUPLICATE_WARNING + COMMON_ACTION_TYPES.CLEAR:
      return {
        ...state,
        duplicateWarning: null,
      }

    default:
      return state
  }
}

export default patientReducer
