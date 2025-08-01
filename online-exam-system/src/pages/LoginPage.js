import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import {
  School,
  Person,
  AdminPanelSettings,
  Security,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { IconButton, InputAdornment } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const roleConfig = {
  student: {
    label: 'Student',
    icon: <School />,
    color: '#1976d2',
    description: 'Access exams and view results',
  },
  teacher: {
    label: 'Teacher',
    icon: <Person />,
    color: '#388e3c',
    description: 'Create and manage exams',
  },
  admin: {
    label: 'Admin',
    icon: <AdminPanelSettings />,
    color: '#f57c00',
    description: 'System administration',
  },
  proctor: {
    label: 'Proctor',
    icon: <Security />,
    color: '#7b1fa2',
    description: 'Monitor examinations',
  },
};

const LoginPage = () => {
  const [selectedRole, setSelectedRole] = useState('student');
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated && user) {
      const roleRedirects = {
        student: '/student',
        teacher: '/teacher',
        admin: '/admin',
        proctor: '/proctor',
      };
      navigate(roleRedirects[user.role] || '/login');
    }
  }, [isAuthenticated, user, navigate]);

  const handleRoleChange = (event, newRole) => {
    if (newRole !== null) {
      setSelectedRole(newRole);
      setError('');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!credentials.username || !credentials.password) {
      setError('Please enter both username and password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await login(credentials, selectedRole);
      
      if (result.success) {
        const roleRedirects = {
          student: '/student',
          teacher: '/teacher',
          admin: '/admin',
          proctor: '/proctor',
        };
        navigate(roleRedirects[selectedRole]);
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={10}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box sx={{ p: 4 }}>
            {/* Header */}
            <Box textAlign="center" mb={4}>
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Online Examination System
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Select your role and sign in to continue
              </Typography>
            </Box>

            {/* Role Selection */}
            <Box mb={4}>
              <Typography variant="h6" gutterBottom textAlign="center">
                Choose Your Role
              </Typography>
              <Grid container spacing={2} justifyContent="center">
                {Object.entries(roleConfig).map(([role, config]) => (
                  <Grid item xs={6} sm={3} key={role}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        border: selectedRole === role ? 2 : 1,
                        borderColor: selectedRole === role ? config.color : 'divider',
                        backgroundColor: selectedRole === role ? `${config.color}10` : 'transparent',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 3,
                        },
                      }}
                      onClick={() => setSelectedRole(role)}
                    >
                      <CardContent sx={{ textAlign: 'center', p: 2 }}>
                        <Box
                          sx={{
                            color: config.color,
                            mb: 1,
                            '& svg': { fontSize: 40 },
                          }}
                        >
                          {config.icon}
                        </Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {config.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {config.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto' }}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <TextField
                fullWidth
                label="Username"
                name="username"
                value={credentials.username}
                onChange={handleInputChange}
                margin="normal"
                variant="outlined"
                disabled={isLoading}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={handleInputChange}
                margin="normal"
                variant="outlined"
                disabled={isLoading}
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
                }}
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  background: `linear-gradient(45deg, ${roleConfig[selectedRole].color}, ${roleConfig[selectedRole].color}aa)`,
                  '&:hover': {
                    background: `linear-gradient(45deg, ${roleConfig[selectedRole].color}dd, ${roleConfig[selectedRole].color})`,
                  },
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  `Sign In as ${roleConfig[selectedRole].label}`
                )}
              </Button>
            </Box>

            {/* Demo Credentials */}
            <Box mt={4} p={2} bgcolor="grey.50" borderRadius={2}>
              <Typography variant="subtitle2" gutterBottom textAlign="center">
                Demo Credentials (for testing)
              </Typography>
              <Typography variant="caption" display="block" textAlign="center">
                Username: demo | Password: demo123
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;