import { Link, Typography, Box, Breadcrumbs } from '@mui/material'
import { useLocation, Link as RouterLink } from 'react-router-dom'
import { APP_ROUTES } from '../../utilities/constants'
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
  const pathname = location.pathname

  const meta = ROUTE_META[pathname] || { title: '', breadcrumb: '' }
  const isDashboard = pathname === APP_ROUTES.DASHBOARD

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flexGrow: 1 }}>
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

      {/* Breadcrumb */}
      {!isDashboard && (
        <Breadcrumbs
          separator={<NavigateNextIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }} />}
          aria-label="breadcrumb"
          sx={{ mt: 0.5 }}
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
    </Box>
  )
}

export default AppLayoutHeader
