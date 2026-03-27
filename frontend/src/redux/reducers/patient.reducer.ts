import type {
  BranchListItem,
  PatientFullApiRecord,
  PatientListItem,
  PatientListResponse,
  PaginationMeta,
} from '../../utilities/models'
import { PATIENT_ACTIONS } from '../actions/patient.actions'

export interface PatientState {
  rows: PatientListItem[]
  pagination: PaginationMeta
  isLoading: boolean
  isCreating: boolean
  isUpdating: boolean
  isFetchingPatient: boolean
  editingPatient: PatientFullApiRecord | null
  branches: BranchListItem[]
  error: string | null
}

const initialState: PatientState = {
  rows: [],
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isFetchingPatient: false,
  editingPatient: null,
  branches: [],
  error: null,
}

interface PatientAction {
  type: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any
}

const patientReducer = (
  state: PatientState = initialState,
  action: PatientAction
): PatientState => {
  switch (action.type) {
    case PATIENT_ACTIONS.FETCH_LIST_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case PATIENT_ACTIONS.FETCH_LIST_SUCCESS: {
      const payload = action.payload as PatientListResponse
      return {
        ...state,
        isLoading: false,
        rows: payload.data,
        pagination: payload.pagination,
      }
    }
    case PATIENT_ACTIONS.FETCH_LIST_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload as string,
      }
    case PATIENT_ACTIONS.CREATE_REQUEST:
      return {
        ...state,
        isCreating: true,
        error: null,
      }
    case PATIENT_ACTIONS.CREATE_SUCCESS:
      return {
        ...state,
        isCreating: false,
      }
    case PATIENT_ACTIONS.CREATE_ERROR:
      return {
        ...state,
        isCreating: false,
        error: action.payload as string,
      }
    case PATIENT_ACTIONS.FETCH_BRANCHES_SUCCESS:
      return {
        ...state,
        branches: action.payload as BranchListItem[],
      }
    case PATIENT_ACTIONS.FETCH_BY_ID_REQUEST:
      return {
        ...state,
        isFetchingPatient: true,
        editingPatient: null,
        error: null,
      }
    case PATIENT_ACTIONS.FETCH_BY_ID_SUCCESS:
      return {
        ...state,
        isFetchingPatient: false,
        editingPatient: action.payload as PatientFullApiRecord,
      }
    case PATIENT_ACTIONS.FETCH_BY_ID_ERROR:
      return {
        ...state,
        isFetchingPatient: false,
        error: action.payload as string,
      }
    case PATIENT_ACTIONS.UPDATE_REQUEST:
      return {
        ...state,
        isUpdating: true,
        error: null,
      }
    case PATIENT_ACTIONS.UPDATE_SUCCESS:
      return {
        ...state,
        isUpdating: false,
        editingPatient: null,
      }
    case PATIENT_ACTIONS.UPDATE_ERROR:
      return {
        ...state,
        isUpdating: false,
        error: action.payload as string,
      }
    default:
      return state
  }
}

export default patientReducer
