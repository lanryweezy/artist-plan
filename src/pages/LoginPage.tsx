import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import useAuthStore from '../store/authStore';
import { loginUser, LoginData } from '../services/authService'; // Import LoginData
import { APP_NAME } from '../../constants-safe';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUserAndToken, setLoading, setError, isLoading, error: authError, isAuthenticated } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const from = location.state?.from?.pathname || '/dashboard'; // Redirect path after login

  useEffect(() => {
    if (isAuthenticated()) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const loginData: LoginData = { email, password, provider: 'email' };
      const response = await loginUser(loginData);
      setUserAndToken(response.data.user, response.token);
      navigate(from, { replace: true }); // Redirect to intended page or dashboard
    } catch (err: any) {
      // err should be an Error object from authService
      setError(err.message || 'Failed to login. Please check your credentials.');
    }
    // setLoading(false) is handled by setUserAndToken or setError in the store
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={6}
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: (theme) => theme.spacing(3, 4),
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login to {APP_NAME}
        </Typography>
        {authError && (
          <Alert severity="error" sx={{ width: '100%', mt: 2, mb: 1 }}>
            {authError}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            error={!!authError} // Highlight field if there was a general auth error
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            error={!!authError} // Highlight field if there was a general auth error
          />
          {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>
          <Grid container>
            <Grid item xs>
              {/* <Link href="#" variant="body2">
                Forgot password?
              </Link> */}
            </Grid>
            <Grid item>
              <Typography variant="body2">
                Don&apos;t have an account?{' '}
                <RouterLink to="/signup" style={{ color: 'inherit', textDecoration: 'underline' }}>
                  Sign Up
                </RouterLink>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      {/* TODO: Add OAuth login buttons (Google, Apple) if implementing */}
    </Container>
  );
};

export default LoginPage;
