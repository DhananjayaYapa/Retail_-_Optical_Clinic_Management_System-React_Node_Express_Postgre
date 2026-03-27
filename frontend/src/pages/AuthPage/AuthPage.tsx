import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { authActions } from '../../redux/actions'
import { APP_ROUTES } from '../../utilities/constants'
import type { AppDispatch } from '../../redux/store'

const AuthPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const [email, setEmail] = useState('admin@clinic.local')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const onLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required')
      return
    }

    setError(null)

    const result = await dispatch(
      authActions.login({
        email: email.trim().toLowerCase(),
        password,
      })
    )

    if (!result.success) {
      setError(result.message)
      return
    }

    navigate(APP_ROUTES.DASHBOARD)
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 2 }}>
      <Paper sx={{ width: '100%', maxWidth: 420, p: 3, borderRadius: 2 }}>
        <Stack spacing={2}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Clinic Login
          </Typography>
          <Typography color="text.secondary">Base setup login screen.</Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            fullWidth
          />
          <TextField
            label="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            fullWidth
          />

          <Button variant="contained" onClick={onLogin}>
            Login
          </Button>
        </Stack>
      </Paper>
    </Box>
  )
}

export default AuthPage
