import { call, put, takeLatest } from 'redux-saga/effects'
import { patientService } from '../../services'
import { PATIENT_ACTIONS, patientActions } from '../actions/patient.actions'
import { dispatchAlert } from '../../utilities/helpers/commonSaga'
import { PATIENT_ACTION_TYPES } from '../../utilities/constants'
import type { PatientListQueryParams, PatientListResponse } from '../../utilities/models'

interface FetchPatientsAction {
  type: typeof PATIENT_ACTIONS.FETCH_LIST_REQUEST
  payload: PatientListQueryParams
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

export function* patientSaga() {
  yield takeLatest(PATIENT_ACTIONS.FETCH_LIST_REQUEST, fetchPatientsSaga)
}
