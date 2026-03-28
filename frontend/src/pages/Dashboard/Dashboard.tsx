import { Paper, Typography } from '@mui/material'

const Dashboard = () => {
  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
        Dashboard
      </Typography>
      <Typography color="text.secondary">
        Clinic overview widgets will be integrated here.
      </Typography>
    </Paper>
  )
}

export default Dashboard
