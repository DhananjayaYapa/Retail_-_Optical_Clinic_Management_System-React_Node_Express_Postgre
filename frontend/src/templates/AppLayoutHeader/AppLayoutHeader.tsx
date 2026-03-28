import SearchIcon from '@mui/icons-material/Search'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import SettingsIcon from '@mui/icons-material/Settings'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import {
  Link,
  Typography,
  Box,
  Breadcrumbs,
  TextField,
  InputAdornment,
  Stack,
  IconButton,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import { useState } from 'react'
import { useLocation, Link as RouterLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { APP_ROUTES } from '../../utilities/constants'
import { searchActions } from '../../redux/actions'
import type { RootState } from '../../redux/store'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'

const ROUTE_META: Record<string, { title: string; breadcrumb: string }> = {
  [APP_ROUTES.DASHBOARD]: { title: 'Dashboard', breadcrumb: 'Dashboard' },
  [APP_ROUTES.PATIENTS]: { title: 'Patients', breadcrumb: 'Patients' },
  [APP_ROUTES.APPOINTMENTS]: { title: 'Appointments', breadcrumb: 'Appointments' },
  [APP_ROUTES.EMR]: { title: 'EMR', breadcrumb: 'EMR' },
  [APP_ROUTES.BILLING]: { title: 'Billing', breadcrumb: 'Billing' },
  [APP_ROUTES.REPORTS]: { title: 'Reports', breadcrumb: 'Reports' },
  [APP_ROUTES.PROFILE]: { title: 'Profile', breadcrumb: 'Profile' },
}

const AppLayoutHeader = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const searchTerm = useSelector((state: RootState) => state.search.term)
  const pathname = location.pathname
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const meta = ROUTE_META[pathname] || { title: '', breadcrumb: '' }
  const isDashboard = pathname === APP_ROUTES.DASHBOARD

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: { xs: 'flex-start', sm: 'center' },
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        gap: 1,
        flexGrow: 1,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* Page Title */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: '18px',
            color: '#ffffff',
            lineHeight: 1.2,
          }}
        >
          {meta.title}
        </Typography>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'stretch', md: 'center' }}
          spacing={1}
          sx={{ mt: 0.5 }}
        >
          {/* Breadcrumb */}
          {!isDashboard && (
            <Breadcrumbs
              separator={<NavigateNextIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }} />}
              aria-label="breadcrumb"
            >
              <Link
                component={RouterLink}
                to={APP_ROUTES.DASHBOARD}
                underline="hover"
                sx={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}
              >
                Dashboard
              </Link>
              <Typography sx={{ fontSize: '12px', color: 'rgba(255,255,255,0.9)' }}>
                {meta.breadcrumb}
              </Typography>
            </Breadcrumbs>
          )}
        </Stack>
      </Box>

      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{
          width: { xs: '100%', sm: 'auto' },
          justifyContent: { xs: 'flex-start', sm: 'flex-end' },
          mr: { sm: 2 },
          flexWrap: 'wrap',
        }}
      >
        <TextField
          size="small"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => dispatch(searchActions.setSearch(e.target.value))}
          sx={{
            width: { xs: '100%', sm: 420 },
            '& .MuiOutlinedInput-root': {
              bgcolor: 'rgba(255,255,255,0.08)',
              color: '#fff',
              height: 34,
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255,255,255,0.2)',
            },
            '& .MuiInputBase-input::placeholder': {
              color: 'rgba(255,255,255,0.75)',
              opacity: 1,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'rgba(255,255,255,0.8)' }} fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <IconButton
          size="small"
          sx={{ color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 1 }}
        >
          <NotificationsNoneIcon fontSize="small" />
        </IconButton>
        <Button
          variant="outlined"
          size="small"
          startIcon={<WarningAmberIcon fontSize="small" />}
          sx={{ display: { xs: 'none', md: 'inline-flex' } }}
        >
          Switch/Lock User
        </Button>
        {/* Full buttons - visible on md+ screens */}
        <Button
          variant="outlined"
          size="small"
          startIcon={<WarningAmberIcon fontSize="small" />}
          sx={{ display: { xs: 'none', md: 'inline-flex' } }}
        >
          System Alert
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<SettingsIcon fontSize="small" />}
          sx={{ display: { xs: 'none', md: 'inline-flex' } }}
        >
          Setting
        </Button>

        {/* Overflow menu - visible on small screens only */}
        <IconButton
          size="small"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{
            display: { xs: 'inline-flex', md: 'none' },
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 1,
          }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          onClick={() => setAnchorEl(null)}
        >
          <MenuItem>
            <ListItemIcon>
              <WarningAmberIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Switch/Lock User</ListItemText>
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <WarningAmberIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>System Alert</ListItemText>
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Setting</ListItemText>
          </MenuItem>
        </Menu>
      </Stack>
    </Box>
  )
}

export default AppLayoutHeader
