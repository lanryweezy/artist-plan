import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { deepPurple, amber } from '@mui/material/colors';

// A custom theme for this app
let theme = createTheme({
  palette: {
    mode: 'dark', // Enables dark mode
    primary: {
      main: deepPurple[400], // A modern, sleek purple
    },
    secondary: {
      main: amber[600], // A contrasting accent color
    },
    background: {
      default: '#1a1a2e', // Dark blue/purple background
      paper: '#2a2a4e',   // Slightly lighter for paper elements like Cards, Modals
    },
    text: {
      primary: '#e0e0e0', // Light grey for primary text
      secondary: '#b0b0b0', // Slightly darker grey for secondary text
    },
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
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    button: {
      textTransform: 'none', // Keep button text case as defined
      fontWeight: 600,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#2a2a4e', // Match paper background or slightly different
          boxShadow: 'none', // Sleeker look without heavy shadows
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1f1f3a', // Slightly different dark shade for drawer
          borderRight: '1px solid #3a3a5e',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Slightly more rounded buttons
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: deepPurple[500],
          },
        },
        containedSecondary: {
          '&:hover': {
            backgroundColor: amber[700],
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12, // More rounded cards
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)', // Subtle shadow
        },
      },
    },
    MuiTextField: {
        defaultProps: {
            variant: 'outlined', // Consistent text field style
        },
        styleOverrides: {
            root: {
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        // borderColor: '#4a4a6a', // Custom border color
                    },
                    '&:hover fieldset': {
                        // borderColor: deepPurple[300],
                    },
                    // '&.Mui-focused fieldset': {
                    //   borderColor: deepPurple[400],
                    // },
                },
            },
        },
    },
    MuiListItemButton: { // For navigation items
        styleOverrides: {
            root: {
                '&.Mui-selected': {
                    backgroundColor: deepPurple[700] + ' !important', // Ensure override
                    color: '#fff',
                    '& .MuiListItemIcon-root': {
                        color: '#fff',
                    },
                },
                '&:hover': {
                    backgroundColor: deepPurple[600] + '40', // Purple with some transparency
                },
            },
        },
    },
  },
});

theme = responsiveFontSizes(theme); // Make typography responsive

export default theme;
