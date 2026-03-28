import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material'
import { useEffect, useState } from 'react'

interface DeleteConfirmDialogProps {
  open: boolean
  patientName: string
  isSubmitting: boolean
  variant?: 'delete' | 'disable'
  onConfirm: (reason: string) => void
  onCancel: () => void
}

const DeleteConfirmDialog = ({
  open,
  patientName,
  isSubmitting,
  variant = 'delete',
  onConfirm,
  onCancel,
}: DeleteConfirmDialogProps) => {
  const [reason, setReason] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setReason('')
      setError(null)
    }
  }, [open])

  const label = variant === 'disable' ? 'Deactivate' : 'Delete'

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError('Reason is required')
      return
    }
    onConfirm(reason.trim())
  }

  const handleClose = () => {
    onCancel()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>{label} Patient</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Are you sure you want to {label.toLowerCase()} <strong>{patientName}</strong>? This action
          will deactivate the patient record. Please provide a reason below.
        </DialogContentText>
        <TextField
          autoFocus
          fullWidth
          multiline
          minRows={2}
          maxRows={4}
          label={`Reason for ${label.toLowerCase()}`}
          value={reason}
          onChange={(e) => {
            setReason(e.target.value)
            if (error) setError(null)
          }}
          error={!!error}
          helperText={error}
          disabled={isSubmitting}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleConfirm} variant="contained" color="error" disabled={isSubmitting}>
          {isSubmitting ? `${label === 'Deactivate' ? 'Deactivating' : 'Deleting'}...` : label}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteConfirmDialog
