import type { PatientEntryFormDto, PatientFilterFormDto } from '../models'
import type { FormFieldDto } from '../helpers/controlledFormValidator'

// --- Options ---

export const TITLE_OPTIONS = ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.']
export const GENDER_OPTIONS = ['MALE', 'FEMALE', 'OTHER']
export const RELATIONSHIP_OPTIONS = [
  'Spouse',
  'Parent',
  'Child',
  'Sibling',
  'Guardian',
  'Friend',
  'Other',
]

export const AGE_RANGE_OPTIONS = [
  { value: '', label: 'All Ages' },
  { value: '0-12', label: '0-12' },
  { value: '13-18', label: '13-18' },
  { value: '19-35', label: '19-35' },
  { value: '36-50', label: '36-50' },
  { value: '51-65', label: '51-65' },
  { value: '66+', label: '66+' },
]

export const PHONE_TYPES = {
  MOBILE: 'MOBILE',
  BUSINESS: 'BUSINESS',
  ADDITIONAL: 'ADDITIONAL',
} as const

export const USER_STATUS = {
  ALL: 'ALL',
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const

export const HEALTH_CARD_STATUS = {
  ALL: 'ALL',
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
  NOT_AVAILABLE: 'NOT_AVAILABLE',
} as const

// --- Dummy Data ---

export const DUMMY_VISITS = [
  { date: '2026-03-15', doctor: 'Dr. Smith', reason: 'Routine Eye Exam' },
  { date: '2026-01-22', doctor: 'Dr. Johnson', reason: 'Contact Lens Fitting' },
  { date: '2025-11-08', doctor: 'Dr. Smith', reason: 'Follow-up Visit' },
  { date: '2025-08-30', doctor: 'Dr. Patel', reason: 'Glaucoma Screening' },
]

// --- Fetch Defaults ---

export const DEFAULT_FETCH_PARAMS = { page: 1, limit: 100, includeDeleted: true } as const

// --- Form Styling ---

export const outlineSx = {
  border: 1,
  borderColor: 'divider',
  borderRadius: 2,
  p: 2,
}

// --- Form Initial States ---

const _field = (
  isRequired = false,
  validator = 'text',
  extra: Record<string, unknown> = {}
): FormFieldDto<string> => ({
  value: '',
  validator,
  isRequired,
  error: null,
  disable: false,
  ...extra,
})

export const INITIAL_FILTER_STATE: PatientFilterFormDto = {
  firstName: _field(),
  lastName: _field(),
  ageRange: _field(),
  doctor: _field(),
  healthCardNumber: _field(),
  gender: _field(false, 'text'),
  userStatus: _field(false, 'text'),
  healthCardStatus: _field(false, 'text'),
}

// Override defaults for radio groups
INITIAL_FILTER_STATE.gender.value = 'MALE'
INITIAL_FILTER_STATE.userStatus.value = USER_STATUS.ALL
INITIAL_FILTER_STATE.healthCardStatus.value = HEALTH_CARD_STATUS.ALL

export const INITIAL_ENTRY_STATE: PatientEntryFormDto = {
  title: _field(),
  firstName: _field(true, 'text', { minLength: 3 }),
  lastName: _field(true, 'text', { minLength: 3 }),
  middleName: _field(),
  dateOfBirth: _field(true, 'date', { pastOnly: true }),
  gender: _field(true, 'select'),
  branch: _field(true, 'select'),
  address1: _field(true),
  address2: _field(),
  city: _field(true),
  province: _field(true),
  country: _field(),
  postalCode: _field(true),
  phoneNumber: _field(true, 'phone', { digitCount: 10 }),
  businessPhone: _field(false, 'phone', { digitCount: 10 }),
  alternativePhone: _field(false, 'phone', { digitCount: 10 }),
  email: _field(false, 'email'),
  emergencyFullName: _field(),
  emergencyRelationship: _field(),
  emergencyAddress1: _field(),
  emergencyAddress2: _field(),
  emergencyCity: _field(),
  emergencyContactNumber: _field(false, 'phone', { digitCount: 10 }),
  healthCardNumber: _field(),
  healthCardVisionCode: _field(),
  insuranceExpireDate: _field(false, 'date'),
  preferDoctor: _field(),
  guardian: _field(),
  referredBy: _field(),
  patientNote: _field(),
}

// --- Shared Section Props Interface ---

export interface PatientSectionProps {
  formData: PatientEntryFormDto
  onInputHandleChange: (property: keyof PatientEntryFormDto, value: string) => void
  onInputFocus: (property: keyof PatientEntryFormDto) => void
}
