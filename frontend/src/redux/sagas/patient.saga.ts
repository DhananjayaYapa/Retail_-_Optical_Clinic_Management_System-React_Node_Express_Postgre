import { call, put, takeLatest } from 'redux-saga/effects'
import { patientService } from '../../services'
import { PATIENT_ACTIONS, patientActions } from '../actions/patient.actions'
import { dispatchAlert } from '../../utilities/helpers/commonSaga'
import { PATIENT_ACTION_TYPES } from '../../utilities/constants'
import type {
  BranchListItem,
  CreatePatientPayload,
  PatientFullApiRecord,
  PatientListQueryParams,
  PatientListResponse,
  UpdatePatientPayload,
} from '../../utilities/models'

interface FetchPatientsAction {
  type: typeof PATIENT_ACTIONS.FETCH_LIST_REQUEST
  payload: PatientListQueryParams
}

interface CreatePatientAction {
  type: typeof PATIENT_ACTIONS.CREATE_REQUEST
  payload: CreatePatientPayload
}

interface FetchPatientByIdAction {
  type: typeof PATIENT_ACTIONS.FETCH_BY_ID_REQUEST
  payload: number
}

interface UpdatePatientAction {
  type: typeof PATIENT_ACTIONS.UPDATE_REQUEST
  payload: { id: number; data: UpdatePatientPayload }
}

function* fetchPatientsSaga(action: FetchPatientsAction): Generator {
  try {
    const data = (yield call(
      patientService.getPatients,
      action.payload || {}
    )) as PatientListResponse
    yield put(patientActions.fetchPatientsSuccess(data))
  } catch (error: unknown) {
    const message =
      (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
      'Failed to fetch patients'
    yield put(patientActions.fetchPatientsError(message))
    yield call(dispatchAlert, PATIENT_ACTION_TYPES.FETCH_PATIENTS, message, 'error')
  }
}

function* createPatientSaga(action: CreatePatientAction): Generator {
  try {
    yield call(patientService.createPatient, action.payload)
    yield put(patientActions.createPatientSuccess())
    yield call(
      dispatchAlert,
      PATIENT_ACTION_TYPES.CREATE_PATIENT,
      'Patient created successfully',
      'success'
    )
  } catch (error: unknown) {
    const message =
      (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
      'Failed to create patient'
    yield put(patientActions.createPatientError(message))
    yield call(dispatchAlert, PATIENT_ACTION_TYPES.CREATE_PATIENT, message, 'error')
  }
}

function* fetchBranchesSaga(): Generator {
  try {
    const data = (yield call(patientService.getBranches)) as BranchListItem[]
    yield put(patientActions.fetchBranchesSuccess(data))
  } catch (error: unknown) {
    const message =
      (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
      'Failed to fetch branches'
    yield put(patientActions.fetchBranchesError(message))
  }
}

function* fetchPatientByIdSaga(action: FetchPatientByIdAction): Generator {
  try {
    const data = (yield call(patientService.getPatientById, action.payload)) as PatientFullApiRecord
    yield put(patientActions.fetchPatientByIdSuccess(data))
  } catch (error: unknown) {
    const message =
      (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
      'Failed to fetch patient details'
    yield put(patientActions.fetchPatientByIdError(message))
  }
}

function* updatePatientSaga(action: UpdatePatientAction): Generator {
  try {
    yield call(patientService.updatePatient, action.payload.id, action.payload.data)
    yield put(patientActions.updatePatientSuccess())
    yield call(
      dispatchAlert,
      PATIENT_ACTION_TYPES.UPDATE_PATIENT,
      'Patient updated successfully',
      'success'
    )
  } catch (error: unknown) {
    const message =
      (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
      'Failed to update patient'
    yield put(patientActions.updatePatientError(message))
    yield call(dispatchAlert, PATIENT_ACTION_TYPES.UPDATE_PATIENT, message, 'error')
  }
}

export function* patientSaga() {
  yield takeLatest(PATIENT_ACTIONS.FETCH_LIST_REQUEST, fetchPatientsSaga)
  yield takeLatest(PATIENT_ACTIONS.CREATE_REQUEST, createPatientSaga)
  yield takeLatest(PATIENT_ACTIONS.FETCH_BRANCHES_REQUEST, fetchBranchesSaga)
  yield takeLatest(PATIENT_ACTIONS.FETCH_BY_ID_REQUEST, fetchPatientByIdSaga)
  yield takeLatest(PATIENT_ACTIONS.UPDATE_REQUEST, updatePatientSaga)
}
