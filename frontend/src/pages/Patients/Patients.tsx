import AddIcon from '@mui/icons-material/Add'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert, Box, Collapse, LinearProgress } from '@mui/material'
import { PageHeader, PatientFilters, PatientTable } from '../../components'
import type {
  PatientFilterFormDto,
  PatientFilterOptions,
  PatientListItem,
} from '../../utilities/models'
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
  const { rows, isLoading } = useSelector((state: RootState) => state.patient)
  const searchTerm = useSelector((state: RootState) => state.search.term)
  const alert = useSelector((state: RootState) => state.alert.fetchPatients)
  const [filters, setFilters] = useState<PatientFilterFormDto>(INITIAL_FILTER_STATE)

  useEffect(() => {
    dispatch(patientActions.fetchPatients({ page: 1, limit: 100 }))
  }, [dispatch])

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
    // Create form implementation will be added in the next step.
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
