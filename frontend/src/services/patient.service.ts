import { axiosPrivateInstance } from './index'
import type {
  HealthCardStatus,
  PatientApiRecord,
  PatientListApiResponse,
  PatientListItem,
  PatientListQueryParams,
  PatientListResponse,
} from '../utilities/models'
import { API_ROUTES } from '../utilities/constants'

const resolveHealthCardStatus = (patient: PatientApiRecord): HealthCardStatus => {
  const healthCardNumber = patient.insuranceInfo?.healthCardNumber
  const expiryDate = patient.insuranceInfo?.expiryDate

  if (!healthCardNumber) {
    return 'NOT_AVAILABLE'
  }

  if (!expiryDate) {
    return 'ACTIVE'
  }

  const today = new Date()
  const expiry = new Date(expiryDate)
  return expiry >= today ? 'ACTIVE' : 'EXPIRED'
}

const toPatientListItem = (patient: PatientApiRecord): PatientListItem => {
  const primaryPhone =
    patient.phoneNumbers.find((phone) => phone.isPrimary)?.phoneNumber ||
    patient.phoneNumbers[0]?.phoneNumber ||
    'N/A'

  return {
    id: patient.id,
    patientId: patient.patientCode,
    patientName: patient.fullName,
    dateOfBirth: patient.dateOfBirth,
    gender: patient.gender,
    phoneNumber: primaryPhone,
    healthCardNumber: patient.insuranceInfo?.healthCardNumber || 'N/A',
    healthCardStatus: resolveHealthCardStatus(patient),
    refDoctor: patient.insuranceInfo?.preferredDoctor || 'N/A',
  }
}

const normalizeListResponse = (response: PatientListApiResponse): PatientListResponse => {
  return {
    data: response.data.data.map(toPatientListItem),
    pagination: response.data.pagination,
  }
}

export const patientService = {
  async getPatients(params: PatientListQueryParams = {}): Promise<PatientListResponse> {
    const response = await axiosPrivateInstance.get<PatientListApiResponse>(API_ROUTES.PATIENTS, {
      params,
    })

    return normalizeListResponse(response.data)
  },
}
