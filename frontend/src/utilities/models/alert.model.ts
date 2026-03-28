export interface AlertActionDto {
  type: string
  message?: string
  severity?: 'success' | 'error' | 'warning' | 'info'
  autoClear?: boolean
  timeout?: number
}

export interface AlertDto {
  message: string
  severity: 'success' | 'error' | 'warning' | 'info'
}

export interface AlertState {
  fetchPatients: AlertDto | null
  createPatient: AlertDto | null
  updatePatient: AlertDto | null
  deletePatient: AlertDto | null
  restorePatient: AlertDto | null
}
