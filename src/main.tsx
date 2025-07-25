import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import App from './App';
import theme from './theme'; // Our custom theme
// You might have a global CSS file, e.g., './index.css' or './styles/global.css'
// import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* Applies baseline MUI styles and dark mode background */}
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
