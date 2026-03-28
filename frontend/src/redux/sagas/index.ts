import { all, takeEvery } from 'redux-saga/effects'
import patientSaga from './patient.saga'
import { handleAlertWithAutoClear } from '../../utilities/helpers/commonSaga'
import { COMMON_ACTION_TYPES } from '../../utilities/constants'
import type { AlertActionDto } from '../../utilities/models'

function* watchAlerts() {
  yield takeEvery(
    (action: { type: string }) => action.type.endsWith(COMMON_ACTION_TYPES.SET_ALERT_REQ),
    handleAlertWithAutoClear as (action: AlertActionDto) => Generator
  )
}

export default function* rootSaga() {
  yield all([patientSaga(), watchAlerts()])
}
