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

// --- Branch ---
export interface BranchListItem {
  id: number
  name: string
  code: string
  address: string | null
}

// --- Create Patient API Payload ---
export interface CreatePatientPayload {
  fullName: string
  dateOfBirth: string
  gender: Gender
  branchId: number
  address?: {
    addressLine1: string
    addressLine2?: string
    city?: string
    province?: string
    postalCode?: string
  }
  contactDetails: {
    phoneNumber: string
    businessPhone?: string
    additionalPhone?: string
  }
  emergencyContact?: {
    fullName: string
    relationship?: string
    contactNumber: string
    addressLine1?: string
    addressLine2?: string
    city?: string
  }
  insuranceInfo?: {
    healthCardNumber?: string
    healthCardVisionCode?: string
    expiryDate?: string
    preferredDoctor?: string
  }
  additionalInfo?: {
    guardian?: string
    referredBy?: string
    patientNote?: string
  }
}

export interface PatientEntryFormDto {
  // Patient Details
  title: FormFieldDto<string>
  firstName: FormFieldDto<string>
  lastName: FormFieldDto<string>
  middleName: FormFieldDto<string>
  dateOfBirth: FormFieldDto<string>
  gender: FormFieldDto<string>
  branch: FormFieldDto<string>
  // Address
  address1: FormFieldDto<string>
  address2: FormFieldDto<string>
  city: FormFieldDto<string>
  province: FormFieldDto<string>
  country: FormFieldDto<string>
  postalCode: FormFieldDto<string>
  // Contact Details
  phoneNumber: FormFieldDto<string>
  businessPhone: FormFieldDto<string>
  alternativePhone: FormFieldDto<string>
  email: FormFieldDto<string>
  // Emergency Contact
  emergencyFullName: FormFieldDto<string>
  emergencyRelationship: FormFieldDto<string>
  emergencyAddress1: FormFieldDto<string>
  emergencyAddress2: FormFieldDto<string>
  emergencyCity: FormFieldDto<string>
  emergencyContactNumber: FormFieldDto<string>
  // Insurance Details
  healthCardNumber: FormFieldDto<string>
  healthCardVisionCode: FormFieldDto<string>
  insuranceExpireDate: FormFieldDto<string>
  preferDoctor: FormFieldDto<string>
  // Additional Details
  guardian: FormFieldDto<string>
  referredBy: FormFieldDto<string>
  patientNote: FormFieldDto<string>
}
