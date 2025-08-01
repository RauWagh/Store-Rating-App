import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  AppBar,
  Toolbar,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  Logout,
  Assignment,
  Schedule,
  CheckCircle,
  PlayArrow,
  Pause,
  Timer,
  Grade,
  School,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Mock data for exams
const mockUpcomingExams = [
  {
    id: 1,
    title: 'Mathematics Quiz',
    subject: 'Mathematics',
    date: '2024-01-15',
    time: '10:00 AM',
    duration: 60,
    status: 'upcoming',
    description: 'Algebra and Geometry',
  },
  {
    id: 2,
    title: 'Physics Midterm',
    subject: 'Physics',
    date: '2024-01-16',
    time: '2:00 PM',
    duration: 120,
    status: 'available',
    description: 'Mechanics and Thermodynamics',
  },
  {
    id: 3,
    title: 'Chemistry Lab Test',
    subject: 'Chemistry',
    date: '2024-01-14',
    time: '9:00 AM',
    duration: 90,
    status: 'missed',
    description: 'Organic Chemistry',
  },
];

const mockCompletedExams = [
  {
    id: 4,
    title: 'Biology Quiz',
    subject: 'Biology',
    date: '2024-01-10',
    score: 85,
    maxScore: 100,
    grade: 'A',
    duration: 45,
  },
  {
    id: 5,
    title: 'History Essay',
    subject: 'History',
    date: '2024-01-08',
    score: 78,
    maxScore: 100,
    grade: 'B+',
    duration: 90,
  },
];

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [upcomingExams] = useState(mockUpcomingExams);
  const [completedExams] = useState(mockCompletedExams);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleStartExam = (examId) => {
    // In a real app, this would navigate to the exam interface
    alert(`Starting exam ${examId}. In a real implementation, this would navigate to the exam interface.`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'success';
      case 'upcoming':
        return 'primary';
      case 'missed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available':
        return 'Available Now';
      case 'upcoming':
        return 'Upcoming';
      case 'missed':
        return 'Missed';
      default:
        return status;
    }
  };

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return '#4caf50';
    if (grade.startsWith('B')) return '#2196f3';
    if (grade.startsWith('C')) return '#ff9800';
    if (grade.startsWith('D')) return '#ff5722';
    return '#f44336';
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <AppBar position="static" sx={{ background: 'linear-gradient(45deg, #1976d2, #42a5f5)' }}>
        <Toolbar>
          <School sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Student Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">Welcome, {user?.fullName}</Typography>
            <IconButton
              size="large"
              edge="end"
              onClick={handleMenuOpen}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                {user?.fullName?.charAt(0) || 'S'}
              </Avatar>
            </IconButton>
          </Box>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Welcome Card */}
          <Grid item xs={12}>
            <Card sx={{ background: 'linear-gradient(45deg, #667eea, #764ba2)', color: 'white' }}>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  Welcome back, {user?.fullName}!
                </Typography>
                <Typography variant="h6">
                  You have {upcomingExams.filter(exam => exam.status === 'available').length} exams available to take
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Upcoming Exams */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Assignment />
                  Upcoming Exams
                </Typography>
                {upcomingExams.length === 0 ? (
                  <Alert severity="info">No upcoming exams scheduled.</Alert>
                ) : (
                  <List>
                    {upcomingExams.map((exam, index) => (
                      <React.Fragment key={exam.id}>
                        <ListItem
                          sx={{
                            border: 1,
                            borderColor: 'divider',
                            borderRadius: 2,
                            mb: 2,
                            flexDirection: 'column',
                            alignItems: 'stretch',
                          }}
                        >
                          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" component="div">
                                {exam.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                {exam.subject} • {exam.description}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Schedule fontSize="small" />
                                  <Typography variant="body2">
                                    {exam.date} at {exam.time}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Timer fontSize="small" />
                                  <Typography variant="body2">
                                    {exam.duration} minutes
                                  </Typography>
                                </Box>
                                <Chip
                                  label={getStatusText(exam.status)}
                                  color={getStatusColor(exam.status)}
                                  size="small"
                                />
                              </Box>
                            </Box>
                            <Box sx={{ ml: 2 }}>
                              {exam.status === 'available' ? (
                                <Button
                                  variant="contained"
                                  color="success"
                                  startIcon={<PlayArrow />}
                                  onClick={() => handleStartExam(exam.id)}
                                  sx={{ minWidth: 120 }}
                                >
                                  Start Exam
                                </Button>
                              ) : exam.status === 'upcoming' ? (
                                <Button
                                  variant="outlined"
                                  disabled
                                  startIcon={<Pause />}
                                  sx={{ minWidth: 120 }}
                                >
                                  Not Available
                                </Button>
                              ) : (
                                <Button
                                  variant="outlined"
                                  disabled
                                  color="error"
                                  sx={{ minWidth: 120 }}
                                >
                                  Missed
                                </Button>
                              )}
                            </Box>
                          </Box>
                        </ListItem>
                        {index < upcomingExams.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Stats */}
          <Grid item xs={12} md={4}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card sx={{ background: '#e8f5e8' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <CheckCircle sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
                    <Typography variant="h4" color="#4caf50">
                      {completedExams.length}
                    </Typography>
                    <Typography variant="body2">
                      Exams Completed
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card sx={{ background: '#e3f2fd' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Assignment sx={{ fontSize: 40, color: '#2196f3', mb: 1 }} />
                    <Typography variant="h4" color="#2196f3">
                      {upcomingExams.filter(exam => exam.status === 'available').length}
                    </Typography>
                    <Typography variant="body2">
                      Available Exams
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card sx={{ background: '#fff3e0' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Grade sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
                    <Typography variant="h4" color="#ff9800">
                      {completedExams.length > 0 
                        ? Math.round(completedExams.reduce((acc, exam) => acc + exam.score, 0) / completedExams.length)
                        : 0}%
                    </Typography>
                    <Typography variant="body2">
                      Average Score
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          {/* Recent Results */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Grade />
                  Recent Results
                </Typography>
                {completedExams.length === 0 ? (
                  <Alert severity="info">No exam results available yet.</Alert>
                ) : (
                  <List>
                    {completedExams.map((exam, index) => (
                      <React.Fragment key={exam.id}>
                        <ListItem
                          sx={{
                            border: 1,
                            borderColor: 'divider',
                            borderRadius: 2,
                            mb: 2,
                          }}
                        >
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6">{exam.title}</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                  <Chip
                                    label={exam.grade}
                                    sx={{
                                      backgroundColor: getGradeColor(exam.grade),
                                      color: 'white',
                                      fontWeight: 'bold',
                                    }}
                                  />
                                  <Typography variant="h6" sx={{ minWidth: 80, textAlign: 'right' }}>
                                    {exam.score}/{exam.maxScore}
                                  </Typography>
                                </Box>
                              </Box>
                            }
                            secondary={
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                  {exam.subject} • Completed on {exam.date}
                                </Typography>
                                <LinearProgress
                                  variant="determinate"
                                  value={(exam.score / exam.maxScore) * 100}
                                  sx={{
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: 'rgba(0,0,0,0.1)',
                                    '& .MuiLinearProgress-bar': {
                                      backgroundColor: getGradeColor(exam.grade),
                                    },
                                  }}
                                />
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < completedExams.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default StudentDashboard;