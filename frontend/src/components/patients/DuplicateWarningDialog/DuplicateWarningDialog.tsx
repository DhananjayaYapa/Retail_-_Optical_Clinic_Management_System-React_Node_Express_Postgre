import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import type { DuplicatePatientWarning } from '../../../utilities/models'

interface DuplicateWarningDialogProps {
  open: boolean
  warning: DuplicatePatientWarning | null
  isSubmitting: boolean
  onOverride: () => void
  onCancel: () => void
}

const DuplicateWarningDialog = ({
  open,
  warning,
  isSubmitting,
  onOverride,
  onCancel,
}: DuplicateWarningDialogProps) => {
  const existing = warning?.existingPatient

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1, color: '#f59e0b' }}
      >
        <WarningAmberIcon /> Duplicate Patient Warning
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 2 }}>
          A patient with the same details already exists at this branch. Are you sure you want to
          continue?
        </Typography>
        {existing && (
          <Box
            sx={{
              p: 2,
              borderRadius: 1,
              bgcolor: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 1, color: '#f59e0b' }}>
              Existing Patient
            </Typography>
            <Typography variant="body2">
              <strong>Patient ID:</strong> {existing.patientCode}
            </Typography>
            <Typography variant="body2">
              <strong>Name:</strong> {existing.fullName}
            </Typography>
            <Typography variant="body2">
              <strong>DOB:</strong> {new Date(existing.dateOfBirth).toLocaleDateString()}
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={onOverride} variant="contained" color="warning" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Continue Anyway'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DuplicateWarningDialog
