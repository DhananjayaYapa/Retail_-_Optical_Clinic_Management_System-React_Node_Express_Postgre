import { axiosPrivateInstance } from './index'
import type {
  BranchListItem,
  CreatePatientPayload,
  HealthCardStatus,
  PatientApiRecord,
  PatientFullApiRecord,
  PatientFullApiResponse,
  PatientListApiResponse,
  PatientListItem,
  PatientListQueryParams,
  PatientListResponse,
  UpdatePatientPayload,
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
    deletedAt: patient.deletedAt,
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

  async createPatient(payload: CreatePatientPayload) {
    const response = await axiosPrivateInstance.post(API_ROUTES.PATIENTS, payload)
    return response.data
  },

  async getPatientById(id: number): Promise<PatientFullApiRecord> {
    const response = await axiosPrivateInstance.get<PatientFullApiResponse>(
      `${API_ROUTES.PATIENTS}/${id}`,
      { params: { includeDeleted: true } }
    )
    return response.data.data
  },

  async updatePatient(id: number, payload: UpdatePatientPayload) {
    const response = await axiosPrivateInstance.patch(`${API_ROUTES.PATIENTS}/${id}`, payload)
    return response.data
  },

  async getBranches(): Promise<BranchListItem[]> {
    const response = await axiosPrivateInstance.get(API_ROUTES.BRANCHES, {
      params: { limit: 100 },
    })
    return response.data.data.data as BranchListItem[]
  },

  async deletePatient(id: number, reason: string) {
    const response = await axiosPrivateInstance.delete(`${API_ROUTES.PATIENTS}/${id}`, {
      data: { reason },
    })
    return response.data
  },

  async restorePatient(id: number) {
    const response = await axiosPrivateInstance.post(`${API_ROUTES.PATIENTS}/${id}/restore`)
    return response.data
  },
}
