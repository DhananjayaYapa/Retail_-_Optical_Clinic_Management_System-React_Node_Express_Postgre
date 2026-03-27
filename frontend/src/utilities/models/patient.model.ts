import type { FormFieldDto } from '../helpers/controlledFormValidator'

export type Gender = 'MALE' | 'FEMALE' | 'OTHER'

export type HealthCardStatus = 'ACTIVE' | 'EXPIRED' | 'NOT_AVAILABLE'

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PatientListQueryParams {
  page?: number
  limit?: number
  search?: string
  branchId?: number
  gender?: Gender
  includeDeleted?: boolean
  sortBy?: 'createdAt' | 'updatedAt' | 'registrationDate' | 'fullName'
  sortOrder?: 'asc' | 'desc'
}

export interface PatientPhone {
  id: number
  phoneType: 'MOBILE' | 'BUSINESS' | 'ADDITIONAL'
  phoneNumber: string
  isPrimary: boolean
}

export interface PatientInsuranceInfo {
  healthCardNumber?: string | null
  expiryDate?: string | null
  preferredDoctor?: string | null
}

export interface PatientApiRecord {
  id: number
  patientCode: string
  fullName: string
  dateOfBirth: string
  gender: Gender
  phoneNumbers: PatientPhone[]
  insuranceInfo?: PatientInsuranceInfo | null
}

export interface PatientListApiResponse {
  success: boolean
  message: string
  data: {
    data: PatientApiRecord[]
    pagination: PaginationMeta
  }
}

export interface PatientListResponse {
  data: PatientListItem[]
  pagination: PaginationMeta
}

export interface PatientListItem {
  id: number
  patientId: string
  patientName: string
  dateOfBirth: string
  gender: Gender
  phoneNumber: string
  healthCardNumber: string
  healthCardStatus: HealthCardStatus
  refDoctor: string
}

export interface PatientFilterFormDto {
  firstName: FormFieldDto<string>
  lastName: FormFieldDto<string>
  ageRange: FormFieldDto<string>
  doctor: FormFieldDto<string>
  healthCardNumber: FormFieldDto<string>
  gender: FormFieldDto<string>
  userStatus: FormFieldDto<string>
  healthCardStatus: FormFieldDto<string>
}

export interface PatientFilterOptions {
  firstNames: string[]
  lastNames: string[]
  doctors: string[]
  healthCardNumbers: string[]
}
