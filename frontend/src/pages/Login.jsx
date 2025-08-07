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
      localStorage.setItem('jwt', response.token);
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
      localStorage.setItem('jwt', response.token);
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

  const handleForgotPassword = async () => {
    if (!email) {
      return handleResponse('Please enter your email address to reset your password.', true);
    }
    try {
      // This is where you would call your backend API to send a password reset link.
      // For now, we'll simulate a success message.
            console.log(`Password reset requested for email: ${email}`);
      handleResponse('If an account with that email exists, a password reset link has been sent.', false);
    } catch (apiError) {
      const errorMessage = apiError.response?.data?.message || 'Password reset failed. Please try again later.';
      handleResponse(errorMessage, true);
    }
  };

  return (
    <Box 
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")',
        perspective: '1000px', // Added for 3D effect
      }}
    >
      <Container maxWidth="xs" sx={{ py: 4, display: 'flex', alignItems: 'center' }}>
        <Paper 
          elevation={10} 
          sx={{ 
            width: '100%',
            
            transition: 'transform 0.8s, height 0.9s',
            transformStyle: 'preserve-3d',
            position: 'relative',
            height: isLoginView ? '600px' : '830px', // Adjust height based on content
            transform: isLoginView ? 'rotateY(0deg)' : 'rotateY(180deg)',
          }}
        >
          {/* Login Form (Front of the card) */}
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              p: 4,
              boxSizing: 'border-box',
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 'bold',
                  color: '#2c3e50',
                  fontFamily: '"Trebuchet MS", sans-serif',
                  letterSpacing: '1px',
                  mb: 1
                }}
              >
                ECOSTORE
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#34495e',
                  mb: 2
                }}
              >
                Time to go green. Welcome!
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
              <TextField
                label="Email"
                autoComplete="email"
                variant="outlined"
                fullWidth
                margin="dense"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiInputLabel-root': { position: 'relative', transform: 'none', color: '#000', fontWeight: 'bold', fontSize: '1rem', mb: -1 },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '25px',
                    backgroundColor: '#fff',
                    '& fieldset': { borderColor: '#000' },
                    '&:hover fieldset': { borderColor: '#000' },
                    '&.Mui-focused fieldset': { borderColor: '#000' },
                  }
                }}
              />
              <TextField
                label="Password"
                autoComplete="current-password"
                variant="outlined"
                fullWidth
                margin="dense"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiInputLabel-root': { position: 'relative', transform: 'none', color: '#000', fontWeight: 'bold', fontSize: '1rem', mb: -1 },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '25px',
                    backgroundColor: '#fff',
                    '& fieldset': { borderColor: '#000' },
                    '&:hover fieldset': { borderColor: '#000' },
                    '&.Mui-focused fieldset': { borderColor: '#000' },
                  }
                }}
              />
              <Button
                variant="contained" 
                fullWidth 
                sx={{ 
                  mt: 2, 
                  py: 1.5,
                  borderRadius: '25px',
                  backgroundColor: '#006400',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  fontSize: '1rem',
                  '&:hover': {
                    backgroundColor: '#005000',
                    boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.2)',
                  },
                }}
                type="submit"
              >
                Log In
              </Button>
              <Typography 
                variant="body2" 
                align="center" 
                sx={{ 
                  mt: 2, 
                  cursor: 'pointer',
                  color: '#3498db',
                  fontWeight: 'bold',
                  '&:hover': {
                    textDecoration: 'underline',
                    color: '#2980b9',
                  },
                }} 
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </Typography>
              <Button 
                variant="text" 
                fullWidth 
                onClick={handleAdminLogin}
                sx={{ 
                  mt: 1.5,
                  color: '#3498db',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  borderRadius: '25px',
                  '&:hover': {
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                  },
                }}
              >
                Login as Admin (Demo)
              </Button>
              <Button 
                variant="text" 
                fullWidth 
                onClick={() => setIsLoginView(false)}
                sx={{ 
                  mt: 2, 
                  color: '#3498db',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  borderRadius: '25px',
                  '&:hover': {
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                  },
                }} 
              >
                Don't have an account? Sign Up
              </Button>
            </Box>
          </Box>

          {/* Signup Form (Back of the card) */}
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              p: 4,
              boxSizing: 'border-box',
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 'bold',
                  color: '#2c3e50',
                  fontFamily: '"Trebuchet MS", sans-serif',
                  letterSpacing: '1px',
                  mb: 1
                }}
              >
                Create an Account
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#34495e',
                  mb: 2
                }}
              >
                Ready to make a difference? Sign up in seconds.
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSignup} sx={{ mt: 2 }}>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                margin="dense"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiInputLabel-root': { position: 'relative', transform: 'none', color: '#000', fontWeight: 'bold', fontSize: '1rem', mb: -1 },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '25px',
                    backgroundColor: '#fff',
                    '& fieldset': { borderColor: '#000' },
                    '&:hover fieldset': { borderColor: '#000' },
                    '&.Mui-focused fieldset': { borderColor: '#000' },
                  }
                }}
              />
              <TextField
                label="Email"
                autoComplete="email"
                variant="outlined"
                fullWidth
                margin="dense"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiInputLabel-root': { position: 'relative', transform: 'none', color: '#000', fontWeight: 'bold', fontSize: '1rem', mb: -1 },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '25px',
                    backgroundColor: '#fff',
                    '& fieldset': { borderColor: '#000' },
                    '&:hover fieldset': { borderColor: '#000' },
                    '&.Mui-focused fieldset': { borderColor: '#000' },
                  }
                }}
              />
              <TextField
                label="Password"
                autoComplete="current-password"
                variant="outlined"
                fullWidth
                margin="dense"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiInputLabel-root': { position: 'relative', transform: 'none', color: '#000', fontWeight: 'bold', fontSize: '1rem', mb: -1 },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '25px',
                    backgroundColor: '#fff',
                    '& fieldset': { borderColor: '#000' },
                    '&:hover fieldset': { borderColor: '#000' },
                    '&.Mui-focused fieldset': { borderColor: '#000' },
                  }
                }}
              />
              <TextField
                label="Age"
                variant="outlined"
                fullWidth
                margin="dense"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiInputLabel-root': { position: 'relative', transform: 'none', color: '#000', fontWeight: 'bold', fontSize: '1rem', mb: -1 },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '25px',
                    backgroundColor: '#fff',
                    '& fieldset': { borderColor: '#000' },
                    '&:hover fieldset': { borderColor: '#000' },
                    '&.Mui-focused fieldset': { borderColor: '#000' },
                  }
                }}
              />
              <TextField
                label="Phone Number"
                variant="outlined"
                fullWidth
                margin="dense"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiInputLabel-root': { position: 'relative', transform: 'none', color: '#000', fontWeight: 'bold', fontSize: '1rem', mb: -1 },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '25px',
                    backgroundColor: '#fff',
                    '& fieldset': { borderColor: '#000' },
                    '&:hover fieldset': { borderColor: '#000' },
                    '&.Mui-focused fieldset': { borderColor: '#000' },
                  }
                }}
              />
              <TextField
                label="Date of Birth"
                variant="outlined"
                fullWidth
                margin="dense"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiInputLabel-root': { position: 'relative', transform: 'none', color: '#000', fontWeight: 'bold', fontSize: '1rem', mb: -1 },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '25px',
                    backgroundColor: '#fff',
                    '& fieldset': { borderColor: '#000' },
                    '&:hover fieldset': { borderColor: '#000' },
                    '&.Mui-focused fieldset': { borderColor: '#000' },
                  }
                }}
              />
              <Button
                variant="contained" 
                fullWidth 
                sx={{ 
                  mt: 2, 
                  py: 1.5,
                  borderRadius: '25px',
                  backgroundColor: '#006400',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  fontSize: '1rem',
                  '&:hover': {
                    backgroundColor: '#005000',
                    boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.2)',
                  },
                }}
                type="submit"
              >
                Sign Up
              </Button>
              <Button 
                variant="text" 
                fullWidth 
                onClick={() => setIsLoginView(true)}
                sx={{ 
                  mt: 2, 
                  color: '#3498db',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  borderRadius: '25px',
                  '&:hover': {
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                  },
                }} 
              >
                Already have an account? Log In
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={error ? 'error' : 'success'} sx={{ width: '100%' }}>
          {error || success}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Login;