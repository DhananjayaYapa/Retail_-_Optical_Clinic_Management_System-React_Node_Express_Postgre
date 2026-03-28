import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { authActions } from '../../redux/actions'
import { APP_ROUTES } from '../../utilities/constants'
import type { AppDispatch } from '../../redux/store'
import loginBg from '../../assets/images/login-bg.svg'

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
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        bgcolor: '#0d0931',
        p: 2,
      }}
    >
      {/* SVG background */}
      <Box
        component="img"
        src={loginBg}
        alt=""
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          pointerEvents: 'none',
        }}
      />

      <Box
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: 1100,
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Paper
          elevation={8}
          sx={{
            width: '100%',
            maxWidth: 420,
            p: 4,
            borderRadius: 3,
            bgcolor: 'rgba(13, 9, 49, 0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(123, 163, 224, 0.2)',
          }}
        >
          <Stack spacing={2.5}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Clinic Login
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Sign in to access the clinic management system.
            </Typography>

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

            <Button variant="contained" size="large" onClick={onLogin}>
              Login
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Box>
  )
}

export default AuthPage
