import { Box } from '@mui/material'
import { outlineSx, type PatientSectionProps } from '../../utilities/constants/patient.constants'
import { FormRow, SectionHeader } from './FormComponents'

const InsuranceAdditionalSection = ({
  formData,
  onInputHandleChange,
  onInputFocus,
}: PatientSectionProps) => (
  <>
    <Box sx={{ ...outlineSx, mb: 2 }}>
      <SectionHeader title="Insurance Details" />

      <FormRow
        label="Health Card No."
        field={formData.healthCardNumber}
        property="healthCardNumber"
        onInputHandleChange={onInputHandleChange}
        onInputFocus={onInputFocus}
      />

      <FormRow
        label="Vision Code"
        field={formData.healthCardVisionCode}
        property="healthCardVisionCode"
        onInputHandleChange={onInputHandleChange}
        onInputFocus={onInputFocus}
      />

      <FormRow
        label="Expire Date"
        field={formData.insuranceExpireDate}
        property="insuranceExpireDate"
        onInputHandleChange={onInputHandleChange}
        onInputFocus={onInputFocus}
        type="date"
      />

      <FormRow
        label="Prefer Doctor"
        field={formData.preferDoctor}
        property="preferDoctor"
        onInputHandleChange={onInputHandleChange}
        onInputFocus={onInputFocus}
      />
    </Box>

    <Box sx={outlineSx}>
      <SectionHeader title="Additional Details" />

      <FormRow
        label="Guardian"
        field={formData.guardian}
        property="guardian"
        onInputHandleChange={onInputHandleChange}
        onInputFocus={onInputFocus}
      />

      <FormRow
        label="Referred By"
        field={formData.referredBy}
        property="referredBy"
        onInputHandleChange={onInputHandleChange}
        onInputFocus={onInputFocus}
      />

      <FormRow
        label="Patient Note"
        field={formData.patientNote}
        property="patientNote"
        onInputHandleChange={onInputHandleChange}
        onInputFocus={onInputFocus}
        multiline
        rows={3}
      />
    </Box>
  </>
)

export default InsuranceAdditionalSection
