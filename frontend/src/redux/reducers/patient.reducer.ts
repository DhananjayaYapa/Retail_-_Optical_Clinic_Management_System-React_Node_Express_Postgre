import type { PatientListItem, PatientListResponse, PaginationMeta } from '../../utilities/models'
import { PATIENT_ACTIONS } from '../actions/patient.actions'

export interface PatientState {
  rows: PatientListItem[]
  pagination: PaginationMeta
  isLoading: boolean
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
  error: null,
}

interface PatientAction {
  type: string
  payload?: PatientListResponse | string
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
    default:
      return state
  }
}

export default patientReducer
