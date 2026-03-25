import { createTheme, alpha } from '@mui/material/styles'

// Finance theme colors - Dark + Green
const primaryGreen = '#22c55e'
const darkBackground = '#0d0931'
const surfaceBackground = '#1a1445'

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: primaryGreen,
      light: '#4ade80',
      dark: '#16a34a',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#8b5cf6',
      light: '#a78bfa',
      dark: '#7c3aed',
    },
    background: {
      default: darkBackground,
      paper: surfaceBackground,
    },
    success: {
      main: '#22c55e',
      light: '#4ade80',
      dark: '#16a34a',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    info: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
      disabled: 'rgba(255, 255, 255, 0.5)',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: `${primaryGreen} ${darkBackground}`,
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            width: 8,
            height: 8,
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 8,
            backgroundColor: alpha(primaryGreen, 0.4),
          },
          '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          padding: '8px 20px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: `0 4px 12px ${alpha(primaryGreen, 0.4)}`,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: `linear-gradient(135deg, ${alpha(surfaceBackground, 0.9)} 0%, ${alpha(darkBackground, 0.8)} 100%)`,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha('#ffffff', 0.1)}`,
          borderRadius: 16,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: alpha(primaryGreen, 0.5),
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: primaryGreen,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: `linear-gradient(135deg, ${surfaceBackground} 0%, ${darkBackground} 100%)`,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha('#ffffff', 0.1)}`,
          borderRadius: 16,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: `linear-gradient(180deg, ${surfaceBackground} 0%, ${darkBackground} 100%)`,
          borderRight: `1px solid ${alpha('#ffffff', 0.1)}`,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: `linear-gradient(90deg, ${darkBackground} 0%, ${surfaceBackground} 100%)`,
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${alpha('#ffffff', 0.1)}`,
          boxShadow: 'none',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${alpha('#ffffff', 0.08)}`,
        },
        head: {
          fontWeight: 600,
          backgroundColor: alpha(surfaceBackground, 0.8),
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
})

// Glass surface effect helper
export const glassSurface = {
  background: `linear-gradient(135deg, ${alpha(surfaceBackground, 0.9)} 0%, ${alpha(darkBackground, 0.8)} 100%)`,
  backdropFilter: 'blur(10px)',
  border: `1px solid ${alpha('#ffffff', 0.1)}`,
  borderRadius: 16,
}
