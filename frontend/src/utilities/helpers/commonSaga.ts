import { delay, put } from 'redux-saga/effects'
import { ALERT_CONFIGS, COMMON_ACTION_TYPES } from '../constants'
import type { AlertActionDto } from '../models'

export function* dispatchAlert(
  actionType: string,
  message: string,
  severity: 'success' | 'error' | 'warning' | 'info'
) {
  yield put({
    type: actionType + COMMON_ACTION_TYPES.SET_ALERT_REQ,
    message,
    severity,
    autoClear: true,
    timeout: ALERT_CONFIGS.TIMEOUT,
  })
}

export function* handleAlertWithAutoClear(action: AlertActionDto) {
  try {
    const actionPrefix = action.type.replace(COMMON_ACTION_TYPES.SET_ALERT_REQ, '')

    const setAlert: AlertActionDto = {
      type: actionPrefix + COMMON_ACTION_TYPES.SET_ALERT,
      message: action.message,
      severity: action.severity,
    }
    yield put(setAlert)
  } finally {
    if (action.autoClear) {
      yield delay(action.timeout ?? ALERT_CONFIGS.TIMEOUT)
      const actionPrefix = action.type.replace(COMMON_ACTION_TYPES.SET_ALERT_REQ, '')
      yield put({ type: actionPrefix + COMMON_ACTION_TYPES.CLEAR_ALERT })
    }
  }
}
