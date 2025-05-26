import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Link,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  useTheme,
  alpha
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import MovieIcon from '@mui/icons-material/Movie';
import axios from 'axios';

const GradientBackground = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `linear-gradient(135deg, 
    ${alpha(theme.palette.secondary.main, 0.8)} 0%, 
    ${alpha(theme.palette.primary.main, 0.8)} 50%,
    ${alpha('#1a237e', 0.8)} 100%)`,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("/movie-pattern.png")',
    opacity: 0.1,
    animation: 'moveBackground 20s linear infinite',
  },
  '@keyframes moveBackground': {
    '0%': {
      backgroundPosition: '0 0',
    },
    '100%': {
      backgroundPosition: '100% 100%',
    },
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  background: alpha(theme.palette.background.paper, 0.9),
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 'bold',
  background: `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
      },
    },
    '&.Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderWidth: '2px',
      },
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1.5),
  borderRadius: '8px',
  textTransform: 'none',
  fontSize: '1.1rem',
  background: `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
  '&:hover': {
    background: `linear-gradient(45deg, ${theme.palette.secondary.dark}, ${theme.palette.primary.dark})`,
  },
}));

const Register = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { register, error: authError } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error when user types
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const success = await register(formData.username, formData.email, formData.password);
      if (success) {
        navigate('/');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground>
      <Container maxWidth="sm">
        <StyledPaper elevation={3}>
          <LogoContainer>
            <MovieIcon sx={{ fontSize: 40, color: theme.palette.secondary.main }} />
            <LogoText>CineFlex</LogoText>
          </LogoContainer>
          
          <Typography component="h1" variant="h4" gutterBottom>
            Join CineFlex
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Create your account to start exploring movies and shows
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <StyledTextField
              required
              fullWidth
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={formData.username}
              onChange={handleChange}
              InputProps={{
                sx: { borderRadius: 2 }
              }}
            />
            <StyledTextField
              required
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              InputProps={{
                sx: { borderRadius: 2 }
              }}
            />
            <StyledTextField
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 }
              }}
            />
            <StyledTextField
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 }
              }}
            />
            <StyledButton
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
            </StyledButton>
            <Grid container justifyContent="center">
              <Grid item>
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate('/login')}
                  sx={{
                    color: theme.palette.secondary.main,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Already have an account? Sign In
                </Link>
              </Grid>
            </Grid>
          </Box>
        </StyledPaper>
      </Container>
    </GradientBackground>
  );
};

export default Register; 