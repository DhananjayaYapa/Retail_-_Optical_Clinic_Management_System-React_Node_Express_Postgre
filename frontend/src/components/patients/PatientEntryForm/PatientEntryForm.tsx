import { type ReactNode, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import SaveIcon from '@mui/icons-material/Save'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import type { BranchListItem, PatientEntryFormDto } from '../../../utilities/models'
import type { FormFieldDto } from '../../../utilities/helpers/controlledFormValidator'

interface PatientEntryFormProps {
  open: boolean
  formData: PatientEntryFormDto
  isSubmitting?: boolean
  branches?: BranchListItem[]
  onInputHandleChange: (property: keyof PatientEntryFormDto, value: string) => void
  onInputFocus: (property: keyof PatientEntryFormDto) => void
  onSave: () => void
  onCancel: () => void
}

const TITLE_OPTIONS = ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.']
const GENDER_OPTIONS = ['MALE', 'FEMALE', 'OTHER']
const RELATIONSHIP_OPTIONS = ['Spouse', 'Parent', 'Child', 'Sibling', 'Guardian', 'Friend', 'Other']

const SectionHeader = ({ title }: { title: string }) => (
  <>
    <Typography variant="subtitle1" fontWeight={700} sx={{ mt: 2, mb: 1 }}>
      {title}
    </Typography>
    <Divider sx={{ mb: 1.5 }} />
  </>
)

const outlineSx = {
  border: 1,
  borderColor: 'divider',
  borderRadius: 2,
  p: 2,
}

interface FormRowProps {
  label: string
  field: FormFieldDto<string>
  property: keyof PatientEntryFormDto
  onInputHandleChange: (property: keyof PatientEntryFormDto, value: string) => void
  onInputFocus: (property: keyof PatientEntryFormDto) => void
  type?: string
  select?: boolean
  multiline?: boolean
  rows?: number
  highlight?: boolean
  children?: ReactNode
}

const FormRow = ({
  label,
  field,
  property,
  onInputHandleChange,
  onInputFocus,
  type,
  select,
  multiline,
  rows,
  highlight,
  children,
}: FormRowProps) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5, gap: 1 }}>
    <Typography
      variant="body2"
      sx={{
        minWidth: 120,
        pt: 0.8,
        textAlign: 'left',
        whiteSpace: 'nowrap',
        color: 'text.secondary',
        fontWeight: 500,
      }}
    >
      {label}
      {field.isRequired && (
        <Typography component="span" color="error.main" sx={{ ml: 0.3 }}>
          *
        </Typography>
      )}
      {' :'}
    </Typography>
    <TextField
      fullWidth
      size="small"
      type={type}
      select={select}
      multiline={multiline}
      rows={rows}
      InputLabelProps={type === 'date' ? { shrink: true } : undefined}
      value={field.value}
      error={!!field.error}
      helperText={field.error}
      disabled={field.disable}
      onFocus={() => onInputFocus(property)}
      onChange={(e) => onInputHandleChange(property, e.target.value)}
      sx={
        highlight
          ? {
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(34, 197, 94, 0.08)',
                transition: 'background-color 0.3s',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'success.main',
                },
              },
            }
          : undefined
      }
    >
      {children}
    </TextField>
  </Box>
)

const PatientEntryForm = ({
  open,
  formData,
  isSubmitting,
  branches = [],
  onInputHandleChange,
  onInputFocus,
  onSave,
  onCancel,
}: PatientEntryFormProps) => {
  type ContactView = 'personal' | 'emergency' | 'both'
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
    <Dialog open={open} onClose={onCancel} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center' }}>
        New Patient Registration
        <IconButton size="small" onClick={onCancel} sx={{ ml: 'auto' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {/* 3-column horizontal layout */}
        <Grid container spacing={3}>
          {/* ===== COLUMN 1: Patient Details + Address ===== */}
          <Grid item xs={12} md={4}>
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
          </Grid>

          {/* ===== COLUMN 2: Contact Details + Emergency Contact ===== */}
          <Grid item xs={12} md={4}>
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
          </Grid>

          {/* ===== COLUMN 3: Insurance Details + Additional Details ===== */}
          <Grid item xs={12} md={4}>
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
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={onSave}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Patient'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default PatientEntryForm
