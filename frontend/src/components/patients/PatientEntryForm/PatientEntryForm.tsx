import CloseIcon from '@mui/icons-material/Close'
import SaveIcon from '@mui/icons-material/Save'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
} from '@mui/material'
import type { BranchListItem, PatientEntryFormDto } from '../../../utilities/models'
import {
  PatientDetailsSection,
  ContactDetailsSection,
  InsuranceAdditionalSection,
} from '../../shared'

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
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center' }}>
        New Patient Registration
        <IconButton size="small" onClick={onCancel} sx={{ ml: 'auto' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <PatientDetailsSection
              formData={formData}
              branches={branches}
              onInputHandleChange={onInputHandleChange}
              onInputFocus={onInputFocus}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <ContactDetailsSection
              formData={formData}
              onInputHandleChange={onInputHandleChange}
              onInputFocus={onInputFocus}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <InsuranceAdditionalSection
              formData={formData}
              onInputHandleChange={onInputHandleChange}
              onInputFocus={onInputFocus}
            />
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
