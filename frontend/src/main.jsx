import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // darker green
      light: '#4caf50',
      dark: '#1b5e20'
    },
    secondary: {
      main: '#ff9800', // orange for contrast with green
      light: '#ffb74d',
      dark: '#f57c00'
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c'
    },
    background: {
      default: '#f9fafb',
      paper: '#ffffff'
    }
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'sans-serif'
    ].join(','),
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.5px'
    },
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.25px'
    },
    h5: {
      fontWeight: 600
    },
    h6: {
      fontWeight: 600
    },
    button: {
      fontWeight: 600,
      textTransform: 'none'
    }
  },
  shape: {
    borderRadius: 8
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '10px 20px',
          boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)'
        },
        containedPrimary: {
          '&:hover': {
            boxShadow: '0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          borderRadius: '12px'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px'
        }
      }
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
