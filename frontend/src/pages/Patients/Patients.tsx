import { Paper, Typography } from '@mui/material'

const Patients = () => {
  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
        Patient Management
      </Typography>
      <Typography color="text.secondary">
        Patient listing, registration, and profile flows will be implemented in this module.
      </Typography>
    </Paper>
  )
}

export default Patients
