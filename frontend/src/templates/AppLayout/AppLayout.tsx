import React, { useState } from 'react'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PatientsIcon,
  EventNote as AppointmentsIcon,
  Description as EmrIcon,
  ReceiptLong as BillingIcon,
  Assessment as ReportIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material'
import { authActions } from '../../redux/actions/index'
import type { RootState } from '../../redux/store/index'
import {
  APP_ROUTES,
  APP_NAME,
  DRAWER_WIDTH,
  DRAWER_COLLAPSED_WIDTH,
  FEATURES,
} from '../../utilities/constants'
import { usePermission } from '../../utilities/hooks/usePermission'
import type { FeatureKey } from '../../utilities/constants/permissions.config'
import { AppLayoutHeader } from '../index'
import styles from './AppLayout.module.scss'

interface NavItem {
  label: string
  path: string
  icon: React.ReactNode
  feature: FeatureKey
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    path: APP_ROUTES.DASHBOARD,
    icon: <DashboardIcon />,
    feature: FEATURES.NAV_DASHBOARD,
  },
  {
    label: 'Patients',
    path: APP_ROUTES.PATIENTS,
    icon: <PatientsIcon />,
    feature: FEATURES.NAV_PATIENTS,
  },
  {
    label: 'Appointments',
    path: APP_ROUTES.APPOINTMENTS,
    icon: <AppointmentsIcon />,
    feature: FEATURES.NAV_APPOINTMENTS,
  },
  {
    label: 'EMR',
    path: APP_ROUTES.EMR,
    icon: <EmrIcon />,
    feature: FEATURES.NAV_EMR,
  },
  {
    label: 'Billing',
    path: APP_ROUTES.BILLING,
    icon: <BillingIcon />,
    feature: FEATURES.NAV_BILLING,
  },
  {
    label: 'Reports',
    path: APP_ROUTES.REPORTS,
    icon: <ReportIcon />,
    feature: FEATURES.NAV_REPORTS,
  },
  {
    label: 'Profile',
    path: APP_ROUTES.PROFILE,
    icon: <PersonIcon />,
    feature: FEATURES.NAV_PROFILE,
  },
]

const NavItemGuard = ({ item, children }: { item: NavItem; children: React.ReactNode }) => {
  const allowed = usePermission(item.feature)
  return allowed ? <>{children}</> : null
}

interface AppLayoutProps {
  children: React.ReactNode
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const user = useSelector((state: RootState) => state.auth.user)

  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen)
    } else {
      setCollapsed(!collapsed)
    }
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    handleMenuClose()
    dispatch(authActions.logout())
    navigate(APP_ROUTES.LOGIN)
  }

  const drawerWidth = collapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH

  const drawerContent = (
    <Box className={styles.drawerContent}>
      {/* Logo Section */}
      <Box className={styles.logoSection}>
        <PatientsIcon sx={{ fontSize: 32, color: 'primary.main' }} />
        {!collapsed && (
          <Typography variant="h6" fontWeight={600} sx={{ ml: 1 }}>
            {APP_NAME}
          </Typography>
        )}
        {!isMobile && (
          <IconButton onClick={handleDrawerToggle} size="small" sx={{ ml: 'auto' }}>
            <ChevronLeftIcon
              sx={{
                transform: collapsed ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.3s',
              }}
            />
          </IconButton>
        )}
      </Box>

      {/* Navigation */}
      <List sx={{ flex: 1, pt: 2 }}>
        {navItems.map((item) => (
          <NavItemGuard key={item.path} item={item}>
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                component={RouterLink}
                to={item.path}
                selected={location.pathname === item.path}
                sx={{
                  minHeight: 48,
                  justifyContent: collapsed ? 'center' : 'initial',
                  px: 2.5,
                  borderRadius: 2,
                  mx: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    bgcolor: 'rgba(34, 197, 94, 0.15)',
                    color: 'primary.main',
                    '& .MuiListItemIcon-root': {
                      color: 'primary.main',
                    },
                    '&:hover': {
                      bgcolor: 'rgba(34, 197, 94, 0.25)',
                    },
                  },
                }}
                onClick={() => isMobile && setMobileOpen(false)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: collapsed ? 0 : 2,
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!collapsed && <ListItemText primary={item.label} />}
              </ListItemButton>
            </ListItem>
          </NavItemGuard>
        ))}
      </List>

      {/* User Section */}
      <Box className={styles.userSection}>
        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </Avatar>
        {!collapsed && (
          <Box sx={{ ml: 1, overflow: 'hidden' }}>
            <Typography variant="body2" fontWeight={500} noWrap>
              {user?.name || 'User'}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {user?.email || ''}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'rgba(13, 9, 49, 0.9)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <AppLayoutHeader />

          {/* User Menu */}
          <IconButton onClick={handleMenuOpen}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem
              onClick={() => {
                handleMenuClose()
                navigate(APP_ROUTES.PROFILE)
              }}
            >
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              background: 'linear-gradient(180deg, #0d0931 0%, #1a1445 100%)',
              borderRight: '1px solid rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              background: 'linear-gradient(180deg, #0d0931 0%, #16a34a 200%)',
              borderRight: '1px solid rgba(255, 255, 255, 0.1)',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              overflowX: 'hidden',
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: '64px',
          height: 'calc(100vh - 64px)',
          overflow: 'auto',
          overscrollBehavior: 'none',
          WebkitOverflowScrolling: 'auto',
          background: 'linear-gradient(135deg, #0d0931 0%, #1a1445 50%, #0d0931 100%)',
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

export default AppLayout
