import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
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
import Avatar from '@mui/material/Avatar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'; // Or a different icon for signup
import useAuthStore from '../store/authStore';
import { signupUser, SignupData } from '../services/authService';
import { APP_NAME } from '../../constants';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUserAndToken, setLoading, setError, isLoading, error: authError, isAuthenticated } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard', { replace: true }); // Redirect if already logged in
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== passwordConfirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const signupData: SignupData = { name, email, password, passwordConfirm, provider: 'email' };
      const response = await signupUser(signupData);
      setUserAndToken(response.data.user, response.token);
      navigate('/dashboard'); // Redirect to dashboard on successful signup
    } catch (err: any) {
      // err should be an Error object from authService
      setError(err.message || 'Failed to sign up. Please try again.');
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
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon /> {/* Consider PersonAddIcon or similar for signup */}
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign Up for {APP_NAME}
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
            id="name"
            label="Full Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password (min. 8 characters)"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="passwordConfirm"
            label="Confirm Password"
            type="password"
            id="passwordConfirm"
            autoComplete="new-password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            disabled={isLoading}
            error={authError === 'Passwords do not match.'}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Typography variant="body2">
                Already have an account?{' '}
                <RouterLink to="/login" style={{ color: 'inherit', textDecoration: 'underline' }}>
                  Login
                </RouterLink>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>
       {/* TODO: Add OAuth signup buttons (Google, Apple) if implementing */}
    </Container>
  );
};

export default SignupPage;
