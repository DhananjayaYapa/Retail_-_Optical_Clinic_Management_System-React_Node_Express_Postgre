import type {
  BranchListItem,
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
    default:
      return state
  }
}

export default patientReducer
