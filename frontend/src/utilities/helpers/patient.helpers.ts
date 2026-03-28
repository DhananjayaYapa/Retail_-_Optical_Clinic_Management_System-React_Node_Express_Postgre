import type { HealthCardStatus, PatientEntryFormDto, PatientFullApiRecord } from '../models'
import { INITIAL_ENTRY_STATE, PHONE_TYPES, TITLE_OPTIONS } from '../constants/patient.constants'

// --- Age ---

export const calculateAge = (dob: string): number => {
  const birth = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

export const matchesAgeRange = (dob: string, range: string): boolean => {
  if (!range) return true
  const age = calculateAge(dob)
  if (range === '66+') return age >= 66
  const [min, max] = range.split('-').map(Number)
  return age >= min && age <= max
}

// --- Name Parsing ---

export const parseFullName = (
  fullName: string
): { title: string; firstName: string; middleName: string; lastName: string } => {
  const parts = fullName.trim().split(/\s+/)
  let title = ''
  if (parts.length > 0 && TITLE_OPTIONS.includes(parts[0])) {
    title = parts.shift()!
  }
  const firstName = parts.shift() || ''
  const lastName = parts.pop() || ''
  const middleName = parts.join(' ')
  return { title, firstName, middleName, lastName }
}

export const getInitials = (fullName: string): string => {
  const parts = fullName.trim().split(/\s+/)
  const filtered = parts.filter((p) => !TITLE_OPTIONS.includes(p))
  const first = filtered[0]?.[0] || ''
  const last = filtered.length > 1 ? filtered[filtered.length - 1][0] : ''
  return (first + last).toUpperCase()
}

export const getDisplayName = (fullName: string): string => {
  const parts = fullName.trim().split(/\s+/)
  const filtered = parts.filter((p) => !TITLE_OPTIONS.includes(p))
  const first = filtered[0] || ''
  const last = filtered.length > 1 ? filtered[filtered.length - 1] : ''
  return [first, last].filter(Boolean).join(' ')
}

// --- Health Card ---

export const getHealthCardColor = (status: HealthCardStatus): 'success' | 'warning' | 'default' => {
  if (status === 'ACTIVE') return 'success'
  if (status === 'EXPIRED') return 'warning'
  return 'default'
}

// --- Form Mapping ---

export const mapPatientToFormData = (patient: PatientFullApiRecord): PatientEntryFormDto => {
  const { title, firstName, middleName, lastName } = parseFullName(patient.fullName)
  const setVal = (
    base: PatientEntryFormDto[keyof PatientEntryFormDto],
    value: string
  ): PatientEntryFormDto[keyof PatientEntryFormDto] => ({ ...base, value })

  const mobile = patient.phoneNumbers.find((p) => p.isPrimary || p.phoneType === PHONE_TYPES.MOBILE)
  const business = patient.phoneNumbers.find((p) => p.phoneType === PHONE_TYPES.BUSINESS)
  const additional = patient.phoneNumbers.find((p) => p.phoneType === PHONE_TYPES.ADDITIONAL)

  const base = { ...INITIAL_ENTRY_STATE }
  return {
    ...base,
    title: setVal(base.title, title),
    firstName: setVal(base.firstName, firstName),
    lastName: setVal(base.lastName, lastName),
    middleName: setVal(base.middleName, middleName),
    dateOfBirth: setVal(base.dateOfBirth, patient.dateOfBirth.split('T')[0]),
    gender: setVal(base.gender, patient.gender),
    branch: setVal(base.branch, String(patient.branchId)),
    address1: setVal(base.address1, patient.address?.addressLine1 || ''),
    address2: setVal(base.address2, patient.address?.addressLine2 || ''),
    city: setVal(base.city, patient.address?.city || ''),
    province: setVal(base.province, patient.address?.province || ''),
    country: setVal(base.country, ''),
    postalCode: setVal(base.postalCode, patient.address?.postalCode || ''),
    phoneNumber: setVal(base.phoneNumber, mobile?.phoneNumber || ''),
    businessPhone: setVal(base.businessPhone, business?.phoneNumber || ''),
    alternativePhone: setVal(base.alternativePhone, additional?.phoneNumber || ''),
    email: setVal(base.email, ''),
    emergencyFullName: setVal(base.emergencyFullName, patient.emergencyContact?.fullName || ''),
    emergencyRelationship: setVal(
      base.emergencyRelationship,
      patient.emergencyContact?.relationship || ''
    ),
    emergencyAddress1: setVal(base.emergencyAddress1, patient.emergencyContact?.addressLine1 || ''),
    emergencyAddress2: setVal(base.emergencyAddress2, patient.emergencyContact?.addressLine2 || ''),
    emergencyCity: setVal(base.emergencyCity, patient.emergencyContact?.city || ''),
    emergencyContactNumber: setVal(
      base.emergencyContactNumber,
      patient.emergencyContact?.contactNumber || ''
    ),
    healthCardNumber: setVal(base.healthCardNumber, patient.insuranceInfo?.healthCardNumber || ''),
    healthCardVisionCode: setVal(
      base.healthCardVisionCode,
      patient.insuranceInfo?.healthCardVisionCode || ''
    ),
    insuranceExpireDate: setVal(
      base.insuranceExpireDate,
      patient.insuranceInfo?.expiryDate ? patient.insuranceInfo.expiryDate.split('T')[0] : ''
    ),
    preferDoctor: setVal(base.preferDoctor, patient.insuranceInfo?.preferredDoctor || ''),
    guardian: setVal(base.guardian, patient.additionalInfo?.guardian || ''),
    referredBy: setVal(base.referredBy, patient.additionalInfo?.referredBy || ''),
    patientNote: setVal(base.patientNote, patient.additionalInfo?.patientNote || ''),
  }
}
