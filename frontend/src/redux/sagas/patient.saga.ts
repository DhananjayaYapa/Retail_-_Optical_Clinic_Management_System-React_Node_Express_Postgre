/* eslint-disable @typescript-eslint/no-explicit-any */
import { call, put, takeEvery } from 'redux-saga/effects'
import { patientService } from '../../services'
import { PATIENT_ACTION_TYPES, COMMON_ACTION_TYPES } from '../../utilities/constants'
import { dispatchAlert } from '../../utilities/helpers/commonSaga'
import type { CreatePatientPayload, UpdatePatientPayload } from '../../utilities/models'

// FETCH PATIENTS
function* fetchPatientsSaga(action: { type: string; params: any }) {
  try {
    // @ts-expect-error generator yield type
    const response = yield call(patientService.getPatients, action.params || {})
    yield put({
      type: PATIENT_ACTION_TYPES.FETCH_PATIENTS + COMMON_ACTION_TYPES.SUCCESS,
      data: response,
    })
  } catch (error: any) {
    yield put({
      type: PATIENT_ACTION_TYPES.FETCH_PATIENTS + COMMON_ACTION_TYPES.ERROR,
      error,
    })
    const backendMessage =
      error?.response?.data?.message || error?.response?.data?.error || error?.message
    yield* dispatchAlert(PATIENT_ACTION_TYPES.FETCH_PATIENTS, backendMessage, 'error')
  }
}

// CREATE PATIENT
function* createPatientSaga(action: { type: string; payload: CreatePatientPayload }) {
  try {
    // @ts-expect-error generator yield type
    const response = yield call(patientService.createPatient, action.payload)
    yield put({
      type: PATIENT_ACTION_TYPES.CREATE_PATIENT + COMMON_ACTION_TYPES.SUCCESS,
      data: response,
    })
    yield* dispatchAlert(
      PATIENT_ACTION_TYPES.CREATE_PATIENT,
      response.message || 'Patient created successfully',
      'success'
    )
    yield put({
      type: PATIENT_ACTION_TYPES.FETCH_PATIENTS + COMMON_ACTION_TYPES.REQUEST,
      params: { includeDeleted: true },
    })
  } catch (error: any) {
    const isDuplicate =
      error?.response?.status === 409 &&
      error?.response?.data?.errors?.[0]?.code === 'DUPLICATE_PATIENT'

    if (isDuplicate) {
      yield put({
        type: PATIENT_ACTION_TYPES.DUPLICATE_WARNING,
        payload: {
          existingPatient: error.response.data.errors[0].existingPatient,
          mode: 'create',
          payload: action.payload,
        },
      })
      return
    }

    yield put({
      type: PATIENT_ACTION_TYPES.CREATE_PATIENT + COMMON_ACTION_TYPES.ERROR,
      error,
    })
    const backendMessage =
      error?.response?.data?.message || error?.response?.data?.error || error?.message
    yield* dispatchAlert(PATIENT_ACTION_TYPES.CREATE_PATIENT, backendMessage, 'error')
  }
}

// FETCH PATIENT BY ID
function* fetchPatientByIdSaga(action: { type: string; payload: number }) {
  try {
    // @ts-expect-error generator yield type
    const response = yield call(patientService.getPatientById, action.payload)
    yield put({
      type: PATIENT_ACTION_TYPES.FETCH_PATIENT_BY_ID + COMMON_ACTION_TYPES.SUCCESS,
      data: response,
    })
  } catch (error: any) {
    yield put({
      type: PATIENT_ACTION_TYPES.FETCH_PATIENT_BY_ID + COMMON_ACTION_TYPES.ERROR,
      error,
    })
  }
}

// UPDATE PATIENT
function* updatePatientSaga(action: {
  type: string
  payload: { id: number; data: UpdatePatientPayload }
}) {
  try {
    // @ts-expect-error generator yield type
    const response = yield call(
      patientService.updatePatient,
      action.payload.id,
      action.payload.data
    )
    yield put({
      type: PATIENT_ACTION_TYPES.UPDATE_PATIENT + COMMON_ACTION_TYPES.SUCCESS,
      data: response,
    })
    yield* dispatchAlert(
      PATIENT_ACTION_TYPES.UPDATE_PATIENT,
      response.message || 'Patient updated successfully',
      'success'
    )
    yield put({
      type: PATIENT_ACTION_TYPES.FETCH_PATIENTS + COMMON_ACTION_TYPES.REQUEST,
      params: { includeDeleted: true },
    })
  } catch (error: any) {
    const isDuplicate =
      error?.response?.status === 409 &&
      error?.response?.data?.errors?.[0]?.code === 'DUPLICATE_PATIENT'

    if (isDuplicate) {
      yield put({
        type: PATIENT_ACTION_TYPES.DUPLICATE_WARNING,
        payload: {
          existingPatient: error.response.data.errors[0].existingPatient,
          mode: 'update',
          payload: action.payload.data,
          patientId: action.payload.id,
        },
      })
      return
    }

    yield put({
      type: PATIENT_ACTION_TYPES.UPDATE_PATIENT + COMMON_ACTION_TYPES.ERROR,
      error,
    })
    const backendMessage =
      error?.response?.data?.message || error?.response?.data?.error || error?.message
    yield* dispatchAlert(PATIENT_ACTION_TYPES.UPDATE_PATIENT, backendMessage, 'error')
  }
}

// DELETE PATIENT
function* deletePatientSaga(action: { type: string; payload: { id: number; reason: string } }) {
  try {
    // @ts-expect-error generator yield type
    const response = yield call(
      patientService.deletePatient,
      action.payload.id,
      action.payload.reason
    )
    yield put({
      type: PATIENT_ACTION_TYPES.DELETE_PATIENT + COMMON_ACTION_TYPES.SUCCESS,
      data: response,
    })
    yield* dispatchAlert(
      PATIENT_ACTION_TYPES.DELETE_PATIENT,
      response.message || 'Patient deleted successfully',
      'success'
    )
    yield put({
      type: PATIENT_ACTION_TYPES.FETCH_PATIENTS + COMMON_ACTION_TYPES.REQUEST,
      params: { includeDeleted: true },
    })
  } catch (error: any) {
    yield put({
      type: PATIENT_ACTION_TYPES.DELETE_PATIENT + COMMON_ACTION_TYPES.ERROR,
      error,
    })
    const backendMessage =
      error?.response?.data?.message || error?.response?.data?.error || error?.message
    yield* dispatchAlert(PATIENT_ACTION_TYPES.DELETE_PATIENT, backendMessage, 'error')
  }
}

// RESTORE PATIENT
function* restorePatientSaga(action: { type: string; payload: number }) {
  try {
    // @ts-expect-error generator yield type
    const response = yield call(patientService.restorePatient, action.payload)
    yield put({
      type: PATIENT_ACTION_TYPES.RESTORE_PATIENT + COMMON_ACTION_TYPES.SUCCESS,
      data: response,
    })
    yield* dispatchAlert(
      PATIENT_ACTION_TYPES.RESTORE_PATIENT,
      response.message || 'Patient restored successfully',
      'success'
    )
    yield put({
      type: PATIENT_ACTION_TYPES.FETCH_PATIENTS + COMMON_ACTION_TYPES.REQUEST,
      params: { includeDeleted: true },
    })
  } catch (error: any) {
    yield put({
      type: PATIENT_ACTION_TYPES.RESTORE_PATIENT + COMMON_ACTION_TYPES.ERROR,
      error,
    })
    const backendMessage =
      error?.response?.data?.message || error?.response?.data?.error || error?.message
    yield* dispatchAlert(PATIENT_ACTION_TYPES.RESTORE_PATIENT, backendMessage, 'error')
  }
}

// FETCH BRANCHES
function* fetchBranchesSaga() {
  try {
    // @ts-expect-error generator yield type
    const response = yield call(patientService.getBranches)
    yield put({
      type: PATIENT_ACTION_TYPES.FETCH_BRANCHES + COMMON_ACTION_TYPES.SUCCESS,
      data: response,
    })
  } catch (error: any) {
    yield put({
      type: PATIENT_ACTION_TYPES.FETCH_BRANCHES + COMMON_ACTION_TYPES.ERROR,
      error,
    })
  }
}

export default function* patientSaga() {
  yield takeEvery(
    PATIENT_ACTION_TYPES.FETCH_PATIENTS + COMMON_ACTION_TYPES.REQUEST,
    fetchPatientsSaga
  )
  yield takeEvery(
    PATIENT_ACTION_TYPES.CREATE_PATIENT + COMMON_ACTION_TYPES.REQUEST,
    createPatientSaga
  )
  yield takeEvery(
    PATIENT_ACTION_TYPES.FETCH_PATIENT_BY_ID + COMMON_ACTION_TYPES.REQUEST,
    fetchPatientByIdSaga
  )
  yield takeEvery(
    PATIENT_ACTION_TYPES.UPDATE_PATIENT + COMMON_ACTION_TYPES.REQUEST,
    updatePatientSaga
  )
  yield takeEvery(
    PATIENT_ACTION_TYPES.DELETE_PATIENT + COMMON_ACTION_TYPES.REQUEST,
    deletePatientSaga
  )
  yield takeEvery(
    PATIENT_ACTION_TYPES.RESTORE_PATIENT + COMMON_ACTION_TYPES.REQUEST,
    restorePatientSaga
  )
  yield takeEvery(
    PATIENT_ACTION_TYPES.FETCH_BRANCHES + COMMON_ACTION_TYPES.REQUEST,
    fetchBranchesSaga
  )
}
