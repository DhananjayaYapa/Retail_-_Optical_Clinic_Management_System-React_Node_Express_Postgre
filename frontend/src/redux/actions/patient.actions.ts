import type {
  CreatePatientPayload,
  DuplicatePatientWarning,
  PatientListQueryParams,
  UpdatePatientPayload,
} from '../../utilities/models'
import { PATIENT_ACTION_TYPES, COMMON_ACTION_TYPES } from '../../utilities/constants'

// FETCH PATIENTS
const fetchPatientsRequest = (params?: PatientListQueryParams) => ({
  type: PATIENT_ACTION_TYPES.FETCH_PATIENTS + COMMON_ACTION_TYPES.REQUEST,
  params,
})

// CREATE PATIENT
const createPatientRequest = (payload: CreatePatientPayload) => ({
  type: PATIENT_ACTION_TYPES.CREATE_PATIENT + COMMON_ACTION_TYPES.REQUEST,
  payload,
})

export const clearCreatePatientState = () => ({
  type: PATIENT_ACTION_TYPES.CREATE_PATIENT + COMMON_ACTION_TYPES.CLEAR,
})

// FETCH PATIENT BY ID
const fetchPatientByIdRequest = (payload: number) => ({
  type: PATIENT_ACTION_TYPES.FETCH_PATIENT_BY_ID + COMMON_ACTION_TYPES.REQUEST,
  payload,
})

// UPDATE PATIENT
const updatePatientRequest = (payload: { id: number; data: UpdatePatientPayload }) => ({
  type: PATIENT_ACTION_TYPES.UPDATE_PATIENT + COMMON_ACTION_TYPES.REQUEST,
  payload,
})

export const clearUpdatePatientState = () => ({
  type: PATIENT_ACTION_TYPES.UPDATE_PATIENT + COMMON_ACTION_TYPES.CLEAR,
})

// DELETE PATIENT
const deletePatientRequest = (payload: { id: number; reason: string }) => ({
  type: PATIENT_ACTION_TYPES.DELETE_PATIENT + COMMON_ACTION_TYPES.REQUEST,
  payload,
})

// RESTORE PATIENT
const restorePatientRequest = (payload: number) => ({
  type: PATIENT_ACTION_TYPES.RESTORE_PATIENT + COMMON_ACTION_TYPES.REQUEST,
  payload,
})

// FETCH BRANCHES
const fetchBranchesRequest = () => ({
  type: PATIENT_ACTION_TYPES.FETCH_BRANCHES + COMMON_ACTION_TYPES.REQUEST,
})

// DUPLICATE WARNING
const duplicateWarning = (payload: DuplicatePatientWarning) => ({
  type: PATIENT_ACTION_TYPES.DUPLICATE_WARNING,
  payload,
})

export const clearDuplicateWarning = () => ({
  type: PATIENT_ACTION_TYPES.DUPLICATE_WARNING + COMMON_ACTION_TYPES.CLEAR,
})

export const patientActions = {
  fetchPatientsRequest,
  createPatientRequest,
  clearCreatePatientState,
  fetchPatientByIdRequest,
  updatePatientRequest,
  clearUpdatePatientState,
  deletePatientRequest,
  restorePatientRequest,
  fetchBranchesRequest,
  duplicateWarning,
  clearDuplicateWarning,
}
