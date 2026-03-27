import AddIcon from '@mui/icons-material/Add'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert, Box, Collapse, LinearProgress } from '@mui/material'

import { PageHeader, PatientEntryForm, PatientFilters, PatientTable } from '../../components'
import type {
  CreatePatientPayload,
  PatientEntryFormDto,
  PatientFilterFormDto,
  PatientFilterOptions,
  PatientListItem,
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

const Patients = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { rows, isLoading, isCreating, branches } = useSelector((state: RootState) => state.patient)
  const searchTerm = useSelector((state: RootState) => state.search.term)
  const alert = useSelector((state: RootState) => state.alert.fetchPatients)
  const createAlert = useSelector((state: RootState) => state.alert.createPatient)
  const [filters, setFilters] = useState<PatientFilterFormDto>(INITIAL_FILTER_STATE)
  const [showEntryForm, setShowEntryForm] = useState(false)
  const [entryFormData, setEntryFormData] = useState<PatientEntryFormDto>(INITIAL_ENTRY_STATE)
  const prevCreateAlertRef = useRef(createAlert)

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

  const handleUpdate = (patient: PatientListItem) => {
    void patient
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
      <PatientTable rows={filteredRows} onUpdate={handleUpdate} />
    </Box>
  )
}

export default Patients
