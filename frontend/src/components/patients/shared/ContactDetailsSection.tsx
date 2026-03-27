import { useState } from 'react'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import {
  Box,
  Divider,
  FormControlLabel,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  Tooltip,
  Typography,
} from '@mui/material'
import { FormRow, SectionHeader } from './FormComponents'
import { outlineSx, type PatientSectionProps, RELATIONSHIP_OPTIONS } from './formConstants'

type ContactView = 'personal' | 'emergency' | 'both'

const ContactDetailsSection = ({
  formData,
  onInputHandleChange,
  onInputFocus,
}: PatientSectionProps) => {
  const [contactView, setContactView] = useState<ContactView>('both')
  const [isCopied, setIsCopied] = useState(false)

  const handleCopyAddress = () => {
    onInputHandleChange('emergencyAddress1', formData.address1.value)
    onInputHandleChange('emergencyAddress2', formData.address2.value)
    onInputHandleChange('emergencyCity', formData.city.value)
    setIsCopied(true)
  }

  const handleResetAddress = () => {
    onInputHandleChange('emergencyAddress1', '')
    onInputHandleChange('emergencyAddress2', '')
    onInputHandleChange('emergencyCity', '')
    setIsCopied(false)
  }

  const showPersonal = contactView === 'personal' || contactView === 'both'
  const showEmergency = contactView === 'emergency' || contactView === 'both'

  return (
    <Box sx={{ ...outlineSx, height: '100%' }}>
      {/* Radio toggle */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Typography variant="subtitle1" fontWeight={700}>
          Contact Details
        </Typography>
        <RadioGroup
          row
          value={contactView}
          onChange={(e) => setContactView(e.target.value as ContactView)}
          sx={{ ml: 'auto' }}
        >
          <FormControlLabel
            value="personal"
            control={<Radio size="small" />}
            label={<Typography variant="body2">Personal</Typography>}
          />
          <FormControlLabel
            value="emergency"
            control={<Radio size="small" />}
            label={<Typography variant="body2">Emergency</Typography>}
          />
          <FormControlLabel
            value="both"
            control={<Radio size="small" />}
            label={<Typography variant="body2">Both</Typography>}
          />
        </RadioGroup>
      </Box>
      <Divider sx={{ mb: 1.5 }} />

      {/* Personal Contact */}
      {showPersonal && (
        <>
          {contactView === 'both' && <SectionHeader title="Personal" />}

          <FormRow
            label="Phone Number"
            field={formData.phoneNumber}
            property="phoneNumber"
            onInputHandleChange={onInputHandleChange}
            onInputFocus={onInputFocus}
          />

          <FormRow
            label="Business Phone"
            field={formData.businessPhone}
            property="businessPhone"
            onInputHandleChange={onInputHandleChange}
            onInputFocus={onInputFocus}
          />

          <FormRow
            label="Alt. Phone"
            field={formData.alternativePhone}
            property="alternativePhone"
            onInputHandleChange={onInputHandleChange}
            onInputFocus={onInputFocus}
          />

          <FormRow
            label="Email"
            field={formData.email}
            property="email"
            onInputHandleChange={onInputHandleChange}
            onInputFocus={onInputFocus}
            type="email"
          />
        </>
      )}

      {/* Emergency Contact */}
      {showEmergency && (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 1 }}>
            <Typography variant="subtitle1" fontWeight={700}>
              Emergency Contact
            </Typography>
            {contactView === 'both' && (
              <Box sx={{ ml: 'auto', display: 'flex', gap: 0.5 }}>
                <Tooltip title="Copy address from patient details">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={handleCopyAddress}
                    disabled={isCopied}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                {isCopied && (
                  <Tooltip title="Reset copied address">
                    <IconButton size="small" color="warning" onClick={handleResetAddress}>
                      <RestartAltIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            )}
          </Box>
          <Divider sx={{ mb: 1.5 }} />

          <FormRow
            label="Full Name"
            field={formData.emergencyFullName}
            property="emergencyFullName"
            onInputHandleChange={onInputHandleChange}
            onInputFocus={onInputFocus}
          />

          <FormRow
            label="Relationship"
            field={formData.emergencyRelationship}
            property="emergencyRelationship"
            onInputHandleChange={onInputHandleChange}
            onInputFocus={onInputFocus}
            select
          >
            <MenuItem value="">Select</MenuItem>
            {RELATIONSHIP_OPTIONS.map((r) => (
              <MenuItem key={r} value={r}>
                {r}
              </MenuItem>
            ))}
          </FormRow>

          <FormRow
            label="Address 1"
            field={formData.emergencyAddress1}
            property="emergencyAddress1"
            onInputHandleChange={onInputHandleChange}
            onInputFocus={onInputFocus}
            highlight={isCopied}
          />

          <FormRow
            label="Address 2"
            field={formData.emergencyAddress2}
            property="emergencyAddress2"
            onInputHandleChange={onInputHandleChange}
            onInputFocus={onInputFocus}
            highlight={isCopied}
          />

          <FormRow
            label="City"
            field={formData.emergencyCity}
            property="emergencyCity"
            onInputHandleChange={onInputHandleChange}
            onInputFocus={onInputFocus}
            highlight={isCopied}
          />

          <FormRow
            label="Contact No."
            field={formData.emergencyContactNumber}
            property="emergencyContactNumber"
            onInputHandleChange={onInputHandleChange}
            onInputFocus={onInputFocus}
          />
        </>
      )}
    </Box>
  )
}

export default ContactDetailsSection
