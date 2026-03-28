import { Box, MenuItem } from '@mui/material'
import type { BranchListItem } from '../../utilities/models'
import {
  GENDER_OPTIONS,
  outlineSx,
  type PatientSectionProps,
  TITLE_OPTIONS,
} from '../../utilities/constants/patient.constants'
import { FormRow, SectionHeader } from './FormComponents'

interface PatientDetailsSectionProps extends PatientSectionProps {
  branches?: BranchListItem[]
}

const PatientDetailsSection = ({
  formData,
  branches = [],
  onInputHandleChange,
  onInputFocus,
}: PatientDetailsSectionProps) => (
  <Box sx={{ ...outlineSx, height: '100%' }}>
    <SectionHeader title="Patient Details" />

    <FormRow
      label="Title"
      field={formData.title}
      property="title"
      onInputHandleChange={onInputHandleChange}
      onInputFocus={onInputFocus}
      select
    >
      <MenuItem value="">Select</MenuItem>
      {TITLE_OPTIONS.map((t) => (
        <MenuItem key={t} value={t}>
          {t}
        </MenuItem>
      ))}
    </FormRow>

    <FormRow
      label="First Name"
      field={formData.firstName}
      property="firstName"
      onInputHandleChange={onInputHandleChange}
      onInputFocus={onInputFocus}
    />

    <FormRow
      label="Last Name"
      field={formData.lastName}
      property="lastName"
      onInputHandleChange={onInputHandleChange}
      onInputFocus={onInputFocus}
    />

    <FormRow
      label="Middle Name"
      field={formData.middleName}
      property="middleName"
      onInputHandleChange={onInputHandleChange}
      onInputFocus={onInputFocus}
    />

    <FormRow
      label="Date of Birth"
      field={formData.dateOfBirth}
      property="dateOfBirth"
      onInputHandleChange={onInputHandleChange}
      onInputFocus={onInputFocus}
      type="date"
    />

    <FormRow
      label="Gender"
      field={formData.gender}
      property="gender"
      onInputHandleChange={onInputHandleChange}
      onInputFocus={onInputFocus}
      select
    >
      <MenuItem value="">Select</MenuItem>
      {GENDER_OPTIONS.map((g) => (
        <MenuItem key={g} value={g}>
          {g.charAt(0) + g.slice(1).toLowerCase()}
        </MenuItem>
      ))}
    </FormRow>

    <FormRow
      label="Branch"
      field={formData.branch}
      property="branch"
      onInputHandleChange={onInputHandleChange}
      onInputFocus={onInputFocus}
      select
    >
      <MenuItem value="">Select</MenuItem>
      {branches.map((b) => (
        <MenuItem key={b.id} value={String(b.id)}>
          {b.name}
        </MenuItem>
      ))}
    </FormRow>

    <SectionHeader title="Address" />

    <FormRow
      label="Address 1"
      field={formData.address1}
      property="address1"
      onInputHandleChange={onInputHandleChange}
      onInputFocus={onInputFocus}
    />

    <FormRow
      label="Address 2"
      field={formData.address2}
      property="address2"
      onInputHandleChange={onInputHandleChange}
      onInputFocus={onInputFocus}
    />

    <FormRow
      label="City"
      field={formData.city}
      property="city"
      onInputHandleChange={onInputHandleChange}
      onInputFocus={onInputFocus}
    />

    <FormRow
      label="Province"
      field={formData.province}
      property="province"
      onInputHandleChange={onInputHandleChange}
      onInputFocus={onInputFocus}
    />

    <FormRow
      label="Country"
      field={formData.country}
      property="country"
      onInputHandleChange={onInputHandleChange}
      onInputFocus={onInputFocus}
    />

    <FormRow
      label="Postal Code"
      field={formData.postalCode}
      property="postalCode"
      onInputHandleChange={onInputHandleChange}
      onInputFocus={onInputFocus}
    />
  </Box>
)

export default PatientDetailsSection
