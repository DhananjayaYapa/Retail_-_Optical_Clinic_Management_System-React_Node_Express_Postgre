import { useSelector } from 'react-redux'
import { Paper, Typography } from '@mui/material'
import type { RootState } from '../../redux/store'

const Profile = () => {
  const user = useSelector((state: RootState) => state.auth.user)

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
        Profile
      </Typography>
      <Typography color="text.secondary">Logged in as: {user?.email ?? 'N/A'}</Typography>
    </Paper>
  )
}

export default Profile
