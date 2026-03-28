import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert, Box, Collapse, IconButton, LinearProgress } from '@mui/material'

import {
  DeleteConfirmDialog,
  DuplicateWarningDialog,
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
import { matchesAgeRange, mapPatientToFormData } from '../../utilities/helpers/patient.helpers'
import {
  DEFAULT_FETCH_PARAMS,
  INITIAL_ENTRY_STATE,
  INITIAL_FILTER_STATE,
} from '../../utilities/constants/patient.constants'
import { FEATURES } from '../../utilities/constants'
import { usePermissions } from '../../utilities/helpers'
import { patientActions } from '../../redux/actions'
import type { AppDispatch, RootState } from '../../redux/store'

const Patients = () => {
  const dispatch = useDispatch<AppDispatch>()
  const permissions = usePermissions({
    canCreate: FEATURES.PATIENT_CREATE,
    canUpdate: FEATURES.PATIENT_UPDATE,
    canDelete: FEATURES.PATIENT_DELETE,
    canRestore: FEATURES.PATIENT_RESTORE,
  })
  const fetchPatientsState = useSelector((state: RootState) => state.patient.fetchPatients)
  const createPatientState = useSelector((state: RootState) => state.patient.createPatient)
  const fetchPatientByIdState = useSelector((state: RootState) => state.patient.fetchPatientById)
  const updatePatientState = useSelector((state: RootState) => state.patient.updatePatient)
  const deletePatientState = useSelector((state: RootState) => state.patient.deletePatient)
  const fetchBranchesState = useSelector((state: RootState) => state.patient.fetchBranches)
  const duplicateWarning = useSelector((state: RootState) => state.patient.duplicateWarning)
  const searchTerm = useSelector((state: RootState) => state.search.term)
  const alert = useSelector((state: RootState) => state.alert.fetchPatients)
  const createAlert = useSelector((state: RootState) => state.alert.createPatient)
  const updateAlert = useSelector((state: RootState) => state.alert.updatePatient)
  const deleteAlert = useSelector((state: RootState) => state.alert.deletePatient)
  const restoreAlert = useSelector((state: RootState) => state.alert.restorePatient)

  const rows = useMemo<PatientListItem[]>(
    () => fetchPatientsState.data?.data || [],
    [fetchPatientsState.data]
  )
  const isLoading = fetchPatientsState.isLoading
  const branches = useMemo(() => fetchBranchesState.data || [], [fetchBranchesState.data])
  const editingPatient = fetchPatientByIdState.data
  const [filters, setFilters] = useState<PatientFilterFormDto>(INITIAL_FILTER_STATE)
  const [showEntryForm, setShowEntryForm] = useState(false)
  const [entryFormData, setEntryFormData] = useState<PatientEntryFormDto>(INITIAL_ENTRY_STATE)
  const [showUpdateForm, setShowUpdateForm] = useState(false)
  const [updateFormData, setUpdateFormData] = useState<PatientEntryFormDto>(INITIAL_ENTRY_STATE)
  const [editingPatientId, setEditingPatientId] = useState<number | null>(null)
  const [showProfile, setShowProfile] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteDialogVariant, setDeleteDialogVariant] = useState<'delete' | 'disable'>('delete')
  const [deletingPatientId, setDeletingPatientId] = useState<number | null>(null)
  const [deletingPatientName, setDeletingPatientName] = useState('')
  const prevCreateAlertRef = useRef(createAlert)
  const prevUpdateAlertRef = useRef(updateAlert)
  const prevDeleteAlertRef = useRef(deleteAlert)
  const prevRestoreAlertRef = useRef(restoreAlert)

  useEffect(() => {
    dispatch(patientActions.fetchPatientsRequest(DEFAULT_FETCH_PARAMS))
    dispatch(patientActions.fetchBranchesRequest())
  }, [dispatch])

  // Watch createAlert — on success, close dialog, reset form
  useEffect(() => {
    if (
      createAlert &&
      createAlert.severity === 'success' &&
      prevCreateAlertRef.current !== createAlert
    ) {
      setShowEntryForm(false)
      setEntryFormData(INITIAL_ENTRY_STATE)
    }
    prevCreateAlertRef.current = createAlert
  }, [createAlert])

  // Watch updateAlert — on success, close dialog, reset form
  useEffect(() => {
    if (
      updateAlert &&
      updateAlert.severity === 'success' &&
      prevUpdateAlertRef.current !== updateAlert
    ) {
      setShowUpdateForm(false)
      setUpdateFormData(INITIAL_ENTRY_STATE)
      setEditingPatientId(null)
    }
    prevUpdateAlertRef.current = updateAlert
  }, [updateAlert])

  // Watch deleteAlert — on success, close dialog, refresh profile
  useEffect(() => {
    if (
      deleteAlert &&
      deleteAlert.severity === 'success' &&
      prevDeleteAlertRef.current !== deleteAlert
    ) {
      setShowDeleteDialog(false)
      setDeletingPatientId(null)
      setDeletingPatientName('')
      if (editingPatient) {
        dispatch(patientActions.fetchPatientByIdRequest(editingPatient.id))
      }
    }
    prevDeleteAlertRef.current = deleteAlert
  }, [deleteAlert, dispatch, editingPatient])

  // Watch restoreAlert — on success, refresh profile
  useEffect(() => {
    if (
      restoreAlert &&
      restoreAlert.severity === 'success' &&
      prevRestoreAlertRef.current !== restoreAlert
    ) {
      if (editingPatient) {
        dispatch(patientActions.fetchPatientByIdRequest(editingPatient.id))
      }
    }
    prevRestoreAlertRef.current = restoreAlert
  }, [restoreAlert, dispatch, editingPatient])

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

      // User status
      if (filters.userStatus.value === 'ACTIVE' && row.deletedAt) return false
      if (filters.userStatus.value === 'INACTIVE' && !row.deletedAt) return false

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

    dispatch(patientActions.createPatientRequest(payload))
  }

  const handleRowClick = (patient: PatientListItem) => {
    setShowProfile(true)
    dispatch(patientActions.fetchPatientByIdRequest(patient.id))
  }

  const handleCloseProfile = () => {
    setShowProfile(false)
  }

  const handleUpdate = (patient: PatientListItem) => {
    setEditingPatientId(patient.id)
    setShowUpdateForm(true)
    dispatch(patientActions.fetchPatientByIdRequest(patient.id))
  }

  const handleDeleteConfirm = (reason: string) => {
    if (deletingPatientId) {
      dispatch(patientActions.deletePatientRequest({ id: deletingPatientId, reason }))
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false)
    setDeletingPatientId(null)
    setDeletingPatientName('')
  }

  const handleToggleStatus = (patient: PatientFullApiRecord) => {
    if (patient.deletedAt) {
      dispatch(patientActions.restorePatientRequest(patient.id))
    } else {
      setDeletingPatientId(patient.id)
      setDeletingPatientName(patient.fullName)
      setDeleteDialogVariant('disable')
      setShowDeleteDialog(true)
    }
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

    dispatch(patientActions.updatePatientRequest({ id: editingPatientId, data: payload }))
  }

  const handleDuplicateOverride = () => {
    if (!duplicateWarning) return
    if (duplicateWarning.mode === 'create') {
      const payload = duplicateWarning.payload as CreatePatientPayload
      dispatch(patientActions.createPatientRequest({ ...payload, duplicateOverride: true }))
    } else {
      const payload = duplicateWarning.payload as UpdatePatientPayload
      dispatch(
        patientActions.updatePatientRequest({
          id: duplicateWarning.patientId!,
          data: { ...payload, duplicateOverride: true },
        })
      )
    }
  }

  const handleDuplicateCancel = () => {
    dispatch(patientActions.clearDuplicateWarning())
  }

  return (
    <Box>
      <PageHeader
        title="Patients"
        subtitle="Manage patient list and registration"
        {...(permissions.canCreate && {
          actionLabel: 'Add New Patient',
          actionIcon: <AddIcon />,
          onAction: handleAddNewPatient,
        })}
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
        isSubmitting={createPatientState.isLoading}
        branches={branches}
        onInputHandleChange={onEntryInputHandleChange}
        onInputFocus={handleEntryInputFocus}
        onSave={handleSavePatient}
        onCancel={handleCancelEntry}
      />

      <PatientUpdateForm
        open={showUpdateForm}
        formData={updateFormData}
        isSubmitting={updatePatientState.isLoading}
        isLoading={fetchPatientByIdState.isLoading}
        branches={branches}
        onInputHandleChange={onUpdateInputHandleChange}
        onInputFocus={handleUpdateInputFocus}
        onSave={handleSaveUpdate}
        onCancel={handleCancelUpdate}
      />

      <DeleteConfirmDialog
        open={showDeleteDialog}
        patientName={deletingPatientName}
        isSubmitting={deletePatientState.isLoading}
        variant={deleteDialogVariant}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      <DuplicateWarningDialog
        open={!!duplicateWarning}
        warning={duplicateWarning}
        isSubmitting={createPatientState.isLoading || updatePatientState.isLoading}
        onOverride={handleDuplicateOverride}
        onCancel={handleDuplicateCancel}
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

      <Collapse in={!!deleteAlert}>
        {deleteAlert && (
          <Alert severity={deleteAlert.severity} sx={{ mb: 2 }}>
            {deleteAlert.message}
          </Alert>
        )}
      </Collapse>

      <Collapse in={!!restoreAlert}>
        {restoreAlert && (
          <Alert severity={restoreAlert.severity} sx={{ mb: 2 }}>
            {restoreAlert.message}
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
          <PatientTable
            rows={filteredRows}
            onUpdate={handleUpdate}
            onRowClick={handleRowClick}
            canUpdate={permissions.canUpdate}
          />
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
              <PatientProfile
                patient={editingPatient}
                onToggleStatus={handleToggleStatus}
                canToggleStatus={permissions.canDelete}
              />
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
