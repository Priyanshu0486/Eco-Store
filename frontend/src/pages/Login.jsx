import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Box,
  Alert,
  Snackbar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { loginUser, signupUser } from '../utils/api'; // Import the loginUser function

function Login({ setUser }) {
  const [isLoginView, setIsLoginView] = useState(true);

  // Form state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  // UI state
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const navigate = useNavigate();

  const handleResponse = (message, isError = false) => {
    if (isError) {
      setError(message);
      setSuccess('');
    } else {
      setSuccess(message);
      setError('');
    }
    setSnackbarOpen(true);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return handleResponse('Please fill in all fields', true);
    }
    try {
      const response = await loginUser({ email, password });
      localStorage.setItem('ecoToken', response.token);
      const userData = {
        id: response.id,
        username: response.username,
        email: response.email,
        role: response.role,
        loggedIn: true
      };
      localStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);
      navigate(response.role === 'ROLE_ADMIN' ? '/admin' : '/eco-store');
    } catch (apiError) {
      const errorMessage = apiError.response?.data?.message || 'Login failed. Please check your credentials.';
      handleResponse(errorMessage, true);
    }
  };

  const handleAdminLogin = async () => {
    // Use hardcoded admin credentials
    const adminEmail = 'admin@ecostore.com';
    const adminPassword = 'adminpassword';

    // Set state to show credentials in fields (optional)
    setEmail(adminEmail);
    setPassword(adminPassword);

    // Directly call the login logic
    try {
      const response = await loginUser({ email: adminEmail, password: adminPassword });
      localStorage.setItem('ecoToken', response.token);
      const userData = {
        id: response.id,
        username: response.username,
        email: response.email,
        role: response.role,
        loggedIn: true
      };
      localStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);

      // Redirect based on role
      if (response.role === 'ROLE_ADMIN') {
        navigate('/admin');
      } else {
        handleResponse('Logged in, but not as an admin.', true);
        navigate('/eco-store');
      }
    } catch (apiError) {
      const errorMessage = apiError.response?.data?.message || 'Admin login failed.';
      handleResponse(errorMessage, true);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!username || !email || !password || !age || !phoneNumber || !dateOfBirth) {
      return handleResponse('Please fill in all fields', true);
    }
    try {
      // HTML date input already returns YYYY-MM-DD format, no need to reverse
      const signupData = { username, email, password, age: parseInt(age), phoneNumber, dateOfBirth };
      console.log('Sending signup data:', signupData);
      const response = await signupUser(signupData);
      handleResponse(response.message, false);
      setIsLoginView(true); // Switch to login view on successful signup
    } catch (apiError) {
      const errorMessage = apiError.response?.data?.message || 'Signup failed. Please try again.';
      handleResponse(errorMessage, true);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom color="primary">
          {isLoginView ? 'Login to EcoStore' : 'Create an Account'}
        </Typography>
        <Typography variant="body1" align="center" paragraph color="text.secondary">
          {isLoginView ? 'Access your eco-shopping dashboard and rewards' : 'Join us in making sustainable shopping accessible'}
        </Typography>

        <Box component="form" onSubmit={isLoginView ? handleLogin : handleSignup} sx={{ mt: 2 }}>
          {!isLoginView && (
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          )}
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            autoComplete="current-password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {!isLoginView && (
            <>
              <TextField
                label="Age"
                variant="outlined"
                fullWidth
                margin="normal"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
              <TextField
                label="Phone Number"
                variant="outlined"
                fullWidth
                margin="normal"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <TextField
                label="Date of Birth"
                variant="outlined"
                fullWidth
                margin="normal"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </>
          )}

          <Button
            type="submit"
            variant="contained"
            color="success"
            fullWidth
            sx={{ mt: 2, py: 1.5 }}
          >
            {isLoginView ? 'Log In' : 'Sign Up'}
          </Button>
          {isLoginView && (
            <Button 
              variant="text" 
              fullWidth 
              onClick={handleAdminLogin}
              sx={{ mt: 1.5 }}
            >
              Login as Admin (Demo)
            </Button>
          )}

          <Typography variant="body2" align="center" sx={{ mt: 2, cursor: 'pointer' }} onClick={() => setIsLoginView(!isLoginView)}>
            {isLoginView ? "Don't have an account? Sign Up" : 'Already have an account? Log In'}
          </Typography>
        </Box>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={error ? 'error' : 'success'}
          elevation={6}
          variant="filled"
        >
          {error || success}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Login; 