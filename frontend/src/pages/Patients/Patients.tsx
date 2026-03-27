import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert, Box, Collapse, IconButton, LinearProgress } from '@mui/material'

import {
  PageHeader,
  PatientEntryForm,
  PatientFilters,
  PatientProfile,
  PatientTable,
  PatientUpdateForm,
} from '../../components'
import type {
  CreatePatientPayload,
  PatientEntryFormDto,
  PatientFilterFormDto,
  PatientFilterOptions,
  PatientFullApiRecord,
  PatientListItem,
  UpdatePatientPayload,
} from '../../utilities/models'
import { validateControlledFormData } from '../../utilities/helpers/controlledFormValidator'
import { patientActions } from '../../redux/actions'
import type { AppDispatch, RootState } from '../../redux/store'

const INITIAL_FILTER_STATE: PatientFilterFormDto = {
  firstName: { value: '', validator: 'text', isRequired: false, error: null, disable: false },
  lastName: { value: '', validator: 'text', isRequired: false, error: null, disable: false },
  ageRange: { value: '', validator: 'text', isRequired: false, error: null, disable: false },
  doctor: { value: '', validator: 'text', isRequired: false, error: null, disable: false },
  healthCardNumber: {
    value: '',
    validator: 'text',
    isRequired: false,
    error: null,
    disable: false,
  },
  gender: { value: 'ALL', validator: 'text', isRequired: false, error: null, disable: false },
  userStatus: { value: 'ALL', validator: 'text', isRequired: false, error: null, disable: false },
  healthCardStatus: {
    value: 'ALL',
    validator: 'text',
    isRequired: false,
    error: null,
    disable: false,
  },
}

const _field = (
  isRequired = false,
  validator = 'text',
  extra: Record<string, unknown> = {}
): {
  value: string
  validator: string
  isRequired: boolean
  error: null
  disable: false
  [key: string]: unknown
} => ({
  value: '',
  validator,
  isRequired,
  error: null,
  disable: false,
  ...extra,
})

const INITIAL_ENTRY_STATE: PatientEntryFormDto = {
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

const calculateAge = (dob: string): number => {
  const birth = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

const matchesAgeRange = (dob: string, range: string): boolean => {
  if (!range) return true
  const age = calculateAge(dob)
  if (range === '66+') return age >= 66
  const [min, max] = range.split('-').map(Number)
  return age >= min && age <= max
}

const parseFullName = (
  fullName: string
): { title: string; firstName: string; middleName: string; lastName: string } => {
  const titles = ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.']
  const parts = fullName.trim().split(/\s+/)
  let title = ''
  if (parts.length > 0 && titles.includes(parts[0])) {
    title = parts.shift()!
  }
  const firstName = parts.shift() || ''
  const lastName = parts.pop() || ''
  const middleName = parts.join(' ')
  return { title, firstName, middleName, lastName }
}

const mapPatientToFormData = (patient: PatientFullApiRecord): PatientEntryFormDto => {
  const { title, firstName, middleName, lastName } = parseFullName(patient.fullName)
  const setVal = (
    base: PatientEntryFormDto[keyof PatientEntryFormDto],
    value: string
  ): PatientEntryFormDto[keyof PatientEntryFormDto] => ({ ...base, value })

  const mobile = patient.phoneNumbers.find((p) => p.isPrimary || p.phoneType === 'MOBILE')
  const business = patient.phoneNumbers.find((p) => p.phoneType === 'BUSINESS')
  const additional = patient.phoneNumbers.find((p) => p.phoneType === 'ADDITIONAL')

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

const Patients = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { rows, isLoading, isCreating, isUpdating, isFetchingPatient, editingPatient, branches } =
    useSelector((state: RootState) => state.patient)
  const searchTerm = useSelector((state: RootState) => state.search.term)
  const alert = useSelector((state: RootState) => state.alert.fetchPatients)
  const createAlert = useSelector((state: RootState) => state.alert.createPatient)
  const updateAlert = useSelector((state: RootState) => state.alert.updatePatient)
  const [filters, setFilters] = useState<PatientFilterFormDto>(INITIAL_FILTER_STATE)
  const [showEntryForm, setShowEntryForm] = useState(false)
  const [entryFormData, setEntryFormData] = useState<PatientEntryFormDto>(INITIAL_ENTRY_STATE)
  const [showUpdateForm, setShowUpdateForm] = useState(false)
  const [updateFormData, setUpdateFormData] = useState<PatientEntryFormDto>(INITIAL_ENTRY_STATE)
  const [editingPatientId, setEditingPatientId] = useState<number | null>(null)
  const [showProfile, setShowProfile] = useState(false)
  const prevCreateAlertRef = useRef(createAlert)
  const prevUpdateAlertRef = useRef(updateAlert)

  useEffect(() => {
    dispatch(patientActions.fetchPatients({ page: 1, limit: 100 }))
    dispatch(patientActions.fetchBranches())
  }, [dispatch])

  // Watch createAlert — on success, close dialog, reset form, re-fetch list
  useEffect(() => {
    if (
      createAlert &&
      createAlert.severity === 'success' &&
      prevCreateAlertRef.current !== createAlert
    ) {
      setShowEntryForm(false)
      setEntryFormData(INITIAL_ENTRY_STATE)
      dispatch(patientActions.fetchPatients({ page: 1, limit: 100 }))
    }
    prevCreateAlertRef.current = createAlert
  }, [createAlert, dispatch])

  // Watch updateAlert — on success, close dialog, reset form, re-fetch list
  useEffect(() => {
    if (
      updateAlert &&
      updateAlert.severity === 'success' &&
      prevUpdateAlertRef.current !== updateAlert
    ) {
      setShowUpdateForm(false)
      setUpdateFormData(INITIAL_ENTRY_STATE)
      setEditingPatientId(null)
      dispatch(patientActions.fetchPatients({ page: 1, limit: 100 }))
    }
    prevUpdateAlertRef.current = updateAlert
  }, [updateAlert, dispatch])

  // Populate update form when editingPatient is fetched
  useEffect(() => {
    if (!editingPatient) return
    setUpdateFormData(mapPatientToFormData(editingPatient))
  }, [editingPatient])

  const filterOptions = useMemo<PatientFilterOptions>(() => {
    const firstNames = new Set<string>()
    const lastNames = new Set<string>()
    const doctors = new Set<string>()
    const healthCards = new Set<string>()

    rows.forEach((row) => {
      const [first, ...rest] = row.patientName.trim().split(' ')
      if (first) {
        firstNames.add(first)
      }
      const last = rest.join(' ').trim()
      if (last) {
        lastNames.add(last)
      }
      if (row.refDoctor && row.refDoctor !== 'N/A') {
        doctors.add(row.refDoctor)
      }
      if (row.healthCardNumber && row.healthCardNumber !== 'N/A') {
        healthCards.add(row.healthCardNumber)
      }
    })

    return {
      firstNames: Array.from(firstNames).sort(),
      lastNames: Array.from(lastNames).sort(),
      doctors: Array.from(doctors).sort(),
      healthCardNumbers: Array.from(healthCards).sort(),
    }
  }, [rows])

  const onInputHandleChange = (property: keyof PatientFilterFormDto, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [property]: {
        ...prev[property],
        value,
      },
    }))
  }

  const handleInputFocus = (property: keyof PatientFilterFormDto) => {
    setFilters((prev) => ({
      ...prev,
      [property]: {
        ...prev[property],
        error: null,
      },
    }))
  }

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTER_STATE)
  }

  const onEntryInputHandleChange = (property: keyof PatientEntryFormDto, value: string) => {
    setEntryFormData((prev) => ({
      ...prev,
      [property]: {
        ...prev[property],
        value,
      },
    }))
  }

  const handleEntryInputFocus = (property: keyof PatientEntryFormDto) => {
    setEntryFormData((prev) => ({
      ...prev,
      [property]: {
        ...prev[property],
        error: null,
      },
    }))
  }

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      // Header search bar: text search across name, patient ID, phone
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        const searchable = [row.patientName, row.patientId, row.phoneNumber].join(' ').toLowerCase()
        if (!searchable.includes(term)) return false
      }

      // First name filter
      if (filters.firstName.value) {
        const first = row.patientName.trim().split(' ')[0] || ''
        if (first !== filters.firstName.value) return false
      }

      // Last name filter
      if (filters.lastName.value) {
        const parts = row.patientName.trim().split(' ')
        const last = parts.slice(1).join(' ').trim()
        if (last !== filters.lastName.value) return false
      }

      // Age range
      if (filters.ageRange.value && !matchesAgeRange(row.dateOfBirth, filters.ageRange.value))
        return false

      // Doctor
      if (filters.doctor.value && row.refDoctor !== filters.doctor.value) return false

      // Health card number
      if (filters.healthCardNumber.value && row.healthCardNumber !== filters.healthCardNumber.value)
        return false

      // Gender
      if (filters.gender.value !== 'ALL' && row.gender !== filters.gender.value) return false

      // Health card status
      if (
        filters.healthCardStatus.value !== 'ALL' &&
        row.healthCardStatus !== filters.healthCardStatus.value
      )
        return false

      return true
    })
  }, [rows, filters, searchTerm])

  const handleAddNewPatient = () => {
    setEntryFormData(INITIAL_ENTRY_STATE)
    setShowEntryForm(true)
  }

  const handleCancelEntry = () => {
    setShowEntryForm(false)
    setEntryFormData(INITIAL_ENTRY_STATE)
  }

  const handleSavePatient = async () => {
    const [validatedData, isValid] = await validateControlledFormData(entryFormData)
    setEntryFormData(validatedData as PatientEntryFormDto)

    if (!isValid) return

    const fd = validatedData as PatientEntryFormDto

    // Build fullName from title + firstName + middleName + lastName
    const nameParts = [
      fd.title.value,
      fd.firstName.value,
      fd.middleName.value,
      fd.lastName.value,
    ].filter(Boolean)
    const fullName = nameParts.join(' ')

    const payload: CreatePatientPayload = {
      fullName,
      dateOfBirth: fd.dateOfBirth.value,
      gender: fd.gender.value as CreatePatientPayload['gender'],
      branchId: Number(fd.branch.value),
      address: {
        addressLine1: fd.address1.value,
        addressLine2: fd.address2.value || undefined,
        city: fd.city.value || undefined,
        province: fd.province.value || undefined,
        postalCode: fd.postalCode.value || undefined,
      },
      contactDetails: {
        phoneNumber: fd.phoneNumber.value,
        businessPhone: fd.businessPhone.value || undefined,
        additionalPhone: fd.alternativePhone.value || undefined,
      },
    }

    // Emergency contact (only if name and number provided)
    if (fd.emergencyFullName.value && fd.emergencyContactNumber.value) {
      payload.emergencyContact = {
        fullName: fd.emergencyFullName.value,
        relationship: fd.emergencyRelationship.value || undefined,
        contactNumber: fd.emergencyContactNumber.value,
        addressLine1: fd.emergencyAddress1.value || undefined,
        addressLine2: fd.emergencyAddress2.value || undefined,
        city: fd.emergencyCity.value || undefined,
      }
    }

    // Insurance info (only if any field has value)
    if (
      fd.healthCardNumber.value ||
      fd.healthCardVisionCode.value ||
      fd.insuranceExpireDate.value ||
      fd.preferDoctor.value
    ) {
      payload.insuranceInfo = {
        healthCardNumber: fd.healthCardNumber.value || undefined,
        healthCardVisionCode: fd.healthCardVisionCode.value || undefined,
        expiryDate: fd.insuranceExpireDate.value || undefined,
        preferredDoctor: fd.preferDoctor.value || undefined,
      }
    }

    // Additional info (only if any field has value)
    if (fd.guardian.value || fd.referredBy.value || fd.patientNote.value) {
      payload.additionalInfo = {
        guardian: fd.guardian.value || undefined,
        referredBy: fd.referredBy.value || undefined,
        patientNote: fd.patientNote.value || undefined,
      }
    }

    dispatch(patientActions.createPatient(payload))
  }

  const handleRowClick = (patient: PatientListItem) => {
    setShowProfile(true)
    dispatch(patientActions.fetchPatientById(patient.id))
  }

  const handleCloseProfile = () => {
    setShowProfile(false)
  }

  const handleUpdate = (patient: PatientListItem) => {
    setEditingPatientId(patient.id)
    setShowUpdateForm(true)
    dispatch(patientActions.fetchPatientById(patient.id))
  }

  const onUpdateInputHandleChange = (property: keyof PatientEntryFormDto, value: string) => {
    setUpdateFormData((prev) => ({
      ...prev,
      [property]: {
        ...prev[property],
        value,
      },
    }))
  }

  const handleUpdateInputFocus = (property: keyof PatientEntryFormDto) => {
    setUpdateFormData((prev) => ({
      ...prev,
      [property]: {
        ...prev[property],
        error: null,
      },
    }))
  }

  const handleCancelUpdate = () => {
    setShowUpdateForm(false)
    setUpdateFormData(INITIAL_ENTRY_STATE)
    setEditingPatientId(null)
  }

  const handleSaveUpdate = async () => {
    const [validatedData, isValid] = await validateControlledFormData(updateFormData)
    setUpdateFormData(validatedData as PatientEntryFormDto)

    if (!isValid || !editingPatientId) return

    const fd = validatedData as PatientEntryFormDto

    const nameParts = [
      fd.title.value,
      fd.firstName.value,
      fd.middleName.value,
      fd.lastName.value,
    ].filter(Boolean)
    const fullName = nameParts.join(' ')

    const payload: UpdatePatientPayload = {
      fullName,
      dateOfBirth: fd.dateOfBirth.value,
      gender: fd.gender.value as UpdatePatientPayload['gender'],
      branchId: Number(fd.branch.value),
      address: fd.address1.value
        ? {
            addressLine1: fd.address1.value,
            addressLine2: fd.address2.value || undefined,
            city: fd.city.value || undefined,
            province: fd.province.value || undefined,
            postalCode: fd.postalCode.value || undefined,
          }
        : null,
      contactDetails: {
        phoneNumber: fd.phoneNumber.value || undefined,
        businessPhone: fd.businessPhone.value || undefined,
        additionalPhone: fd.alternativePhone.value || undefined,
      },
    }

    if (fd.emergencyFullName.value && fd.emergencyContactNumber.value) {
      payload.emergencyContact = {
        fullName: fd.emergencyFullName.value,
        relationship: fd.emergencyRelationship.value || undefined,
        contactNumber: fd.emergencyContactNumber.value,
        addressLine1: fd.emergencyAddress1.value || undefined,
        addressLine2: fd.emergencyAddress2.value || undefined,
        city: fd.emergencyCity.value || undefined,
      }
    } else {
      payload.emergencyContact = null
    }

    if (
      fd.healthCardNumber.value ||
      fd.healthCardVisionCode.value ||
      fd.insuranceExpireDate.value ||
      fd.preferDoctor.value
    ) {
      payload.insuranceInfo = {
        healthCardNumber: fd.healthCardNumber.value || undefined,
        healthCardVisionCode: fd.healthCardVisionCode.value || undefined,
        expiryDate: fd.insuranceExpireDate.value || undefined,
        preferredDoctor: fd.preferDoctor.value || undefined,
      }
    } else {
      payload.insuranceInfo = null
    }

    if (fd.guardian.value || fd.referredBy.value || fd.patientNote.value) {
      payload.additionalInfo = {
        guardian: fd.guardian.value || undefined,
        referredBy: fd.referredBy.value || undefined,
        patientNote: fd.patientNote.value || undefined,
      }
    } else {
      payload.additionalInfo = null
    }

    dispatch(patientActions.updatePatient(editingPatientId, payload))
  }

  return (
    <Box>
      <PageHeader
        title="Patients"
        subtitle="Manage patient list and registration"
        actionLabel="Add New Patient"
        actionIcon={<AddIcon />}
        onAction={handleAddNewPatient}
      />

      <PatientFilters
        filters={filters}
        options={filterOptions}
        onInputHandleChange={onInputHandleChange}
        onInputFocus={handleInputFocus}
        onReset={handleResetFilters}
      />

      <PatientEntryForm
        open={showEntryForm}
        formData={entryFormData}
        isSubmitting={isCreating}
        branches={branches}
        onInputHandleChange={onEntryInputHandleChange}
        onInputFocus={handleEntryInputFocus}
        onSave={handleSavePatient}
        onCancel={handleCancelEntry}
      />

      <PatientUpdateForm
        open={showUpdateForm}
        formData={updateFormData}
        isSubmitting={isUpdating}
        isLoading={isFetchingPatient}
        branches={branches}
        onInputHandleChange={onUpdateInputHandleChange}
        onInputFocus={handleUpdateInputFocus}
        onSave={handleSaveUpdate}
        onCancel={handleCancelUpdate}
      />

      <Collapse in={!!updateAlert}>
        {updateAlert && (
          <Alert severity={updateAlert.severity} sx={{ mb: 2 }}>
            {updateAlert.message}
          </Alert>
        )}
      </Collapse>

      <Collapse in={!!createAlert}>
        {createAlert && (
          <Alert severity={createAlert.severity} sx={{ mb: 2 }}>
            {createAlert.message}
          </Alert>
        )}
      </Collapse>

      <Collapse in={!!alert}>
        {alert && (
          <Alert severity={alert.severity} sx={{ mb: 2 }}>
            {alert.message}
          </Alert>
        )}
      </Collapse>

      {isLoading && <LinearProgress sx={{ mb: 1 }} />}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          flexDirection: { xs: 'column', lg: 'row' },
        }}
      >
        <Box sx={{ flex: showProfile ? 1 : 1, minWidth: 0 }}>
          <PatientTable rows={filteredRows} onUpdate={handleUpdate} onRowClick={handleRowClick} />
        </Box>
        {showProfile && (
          <Box
            sx={{
              flex: 2,
              minWidth: 0,
              position: 'relative',
              overflowX: 'auto',
            }}
          >
            <IconButton
              size="small"
              onClick={handleCloseProfile}
              sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
            {editingPatient ? (
              <PatientProfile patient={editingPatient} />
            ) : (
              <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>Loading...</Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default Patients
