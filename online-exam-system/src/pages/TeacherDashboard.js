import React, { useState } from 'react';
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
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  ListItemIcon,
  Fab,
} from '@mui/material';
import {
  Logout,
  Add,
  Edit,
  Delete,
  Visibility,
  Assignment,
  People,
  BarChart,
  School,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Mock data
const mockExams = [
  {
    id: 1,
    title: 'Mathematics Quiz',
    subject: 'Mathematics',
    date: '2024-01-15',
    time: '10:00 AM',
    duration: 60,
    status: 'published',
    studentsEnrolled: 25,
    submitted: 18,
  },
  {
    id: 2,
    title: 'Physics Midterm',
    subject: 'Physics',
    date: '2024-01-16',
    time: '2:00 PM',
    duration: 120,
    status: 'draft',
    studentsEnrolled: 30,
    submitted: 0,
  },
];

const mockSubmissions = [
  {
    id: 1,
    examTitle: 'Mathematics Quiz',
    studentName: 'John Doe',
    submitTime: '2024-01-15 10:45 AM',
    score: 85,
    maxScore: 100,
    grade: 'A',
  },
  {
    id: 2,
    examTitle: 'Mathematics Quiz',
    studentName: 'Jane Smith',
    submitTime: '2024-01-15 10:38 AM',
    score: 92,
    maxScore: 100,
    grade: 'A',
  },
  {
    id: 3,
    examTitle: 'Mathematics Quiz',
    studentName: 'Bob Johnson',
    submitTime: '2024-01-15 10:52 AM',
    score: 78,
    maxScore: 100,
    grade: 'B+',
  },
];

const performanceData = [
  { exam: 'Math Quiz', average: 85, submissions: 18 },
  { exam: 'Science Test', average: 78, submissions: 22 },
  { exam: 'History Essay', average: 82, submissions: 20 },
];

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [exams, setExams] = useState(mockExams);
  const [submissions] = useState(mockSubmissions);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [newExam, setNewExam] = useState({
    title: '',
    subject: '',
    date: '',
    time: '',
    duration: '',
    description: '',
  });

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

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleCreateExam = () => {
    setEditingExam(null);
    setNewExam({
      title: '',
      subject: '',
      date: '',
      time: '',
      duration: '',
      description: '',
    });
    setOpenDialog(true);
  };

  const handleEditExam = (exam) => {
    setEditingExam(exam);
    setNewExam({
      title: exam.title,
      subject: exam.subject,
      date: exam.date,
      time: exam.time,
      duration: exam.duration.toString(),
      description: exam.description || '',
    });
    setOpenDialog(true);
  };

  const handleDeleteExam = (examId) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      setExams(exams.filter(exam => exam.id !== examId));
    }
  };

  const handleSaveExam = () => {
    if (editingExam) {
      // Update existing exam
      setExams(exams.map(exam => 
        exam.id === editingExam.id 
          ? { ...exam, ...newExam, duration: parseInt(newExam.duration) }
          : exam
      ));
    } else {
      // Create new exam
      const newExamObj = {
        id: Date.now(),
        ...newExam,
        duration: parseInt(newExam.duration),
        status: 'draft',
        studentsEnrolled: 0,
        submitted: 0,
      };
      setExams([...exams, newExamObj]);
    }
    setOpenDialog(false);
  };

  const handleInputChange = (field, value) => {
    setNewExam(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'success';
      case 'draft':
        return 'warning';
      case 'completed':
        return 'info';
      default:
        return 'default';
    }
  };

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return '#4caf50';
    if (grade.startsWith('B')) return '#2196f3';
    if (grade.startsWith('C')) return '#ff9800';
    if (grade.startsWith('D')) return '#ff5722';
    return '#f44336';
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <AppBar position="static" sx={{ background: 'linear-gradient(45deg, #388e3c, #66bb6a)' }}>
        <Toolbar>
          <School sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Teacher Dashboard
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
                {user?.fullName?.charAt(0) || 'T'}
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
        {/* Welcome Card */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <Card sx={{ background: 'linear-gradient(45deg, #4caf50, #81c784)', color: 'white' }}>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  Welcome back, {user?.fullName}!
                </Typography>
                <Typography variant="h6">
                  You have {exams.length} exams and {submissions.length} recent submissions to review
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: '#e8f5e8' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Assignment sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
                <Typography variant="h4" color="#4caf50">
                  {exams.length}
                </Typography>
                <Typography variant="body2">
                  Total Exams
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: '#e3f2fd' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <People sx={{ fontSize: 40, color: '#2196f3', mb: 1 }} />
                <Typography variant="h4" color="#2196f3">
                  {submissions.length}
                </Typography>
                <Typography variant="body2">
                  Submissions
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: '#fff3e0' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <BarChart sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
                <Typography variant="h4" color="#ff9800">
                  {submissions.length > 0 
                    ? Math.round(submissions.reduce((acc, sub) => acc + sub.score, 0) / submissions.length)
                    : 0}%
                </Typography>
                <Typography variant="body2">
                  Average Score
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: '#fce4ec' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Visibility sx={{ fontSize: 40, color: '#e91e63', mb: 1 }} />
                <Typography variant="h4" color="#e91e63">
                  {exams.filter(exam => exam.status === 'published').length}
                </Typography>
                <Typography variant="body2">
                  Active Exams
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Content with Tabs */}
        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={currentTab} onChange={handleTabChange}>
              <Tab label="Manage Exams" />
              <Tab label="View Submissions" />
              <Tab label="Performance Analytics" />
            </Tabs>
          </Box>

          {/* Tab 1: Manage Exams */}
          <TabPanel value={currentTab} index={0}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">Exam Management</Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleCreateExam}
                  sx={{ background: 'linear-gradient(45deg, #4caf50, #66bb6a)' }}
                >
                  Create New Exam
                </Button>
              </Box>

              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'grey.50' }}>
                      <TableCell><strong>Title</strong></TableCell>
                      <TableCell><strong>Subject</strong></TableCell>
                      <TableCell><strong>Date & Time</strong></TableCell>
                      <TableCell><strong>Duration</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                      <TableCell><strong>Enrolled/Submitted</strong></TableCell>
                      <TableCell><strong>Actions</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {exams.map((exam) => (
                      <TableRow key={exam.id} hover>
                        <TableCell>
                          <Typography variant="subtitle2">{exam.title}</Typography>
                        </TableCell>
                        <TableCell>{exam.subject}</TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {exam.date}
                            <br />
                            <Typography variant="caption" color="text.secondary">
                              {exam.time}
                            </Typography>
                          </Typography>
                        </TableCell>
                        <TableCell>{exam.duration} min</TableCell>
                        <TableCell>
                          <Chip
                            label={exam.status}
                            color={getStatusColor(exam.status)}
                            size="small"
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </TableCell>
                        <TableCell>
                          {exam.studentsEnrolled}/{exam.submitted}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleEditExam(exam)}
                              color="primary"
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteExam(exam.id)}
                              color="error"
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {exams.length === 0 && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  No exams created yet. Click "Create New Exam" to get started.
                </Alert>
              )}
            </CardContent>
          </TabPanel>

          {/* Tab 2: View Submissions */}
          <TabPanel value={currentTab} index={1}>
            <CardContent>
              <Typography variant="h5" gutterBottom>Student Submissions</Typography>
              
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'grey.50' }}>
                      <TableCell><strong>Student Name</strong></TableCell>
                      <TableCell><strong>Exam</strong></TableCell>
                      <TableCell><strong>Submit Time</strong></TableCell>
                      <TableCell><strong>Score</strong></TableCell>
                      <TableCell><strong>Grade</strong></TableCell>
                      <TableCell><strong>Actions</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {submissions.map((submission) => (
                      <TableRow key={submission.id} hover>
                        <TableCell>
                          <Typography variant="subtitle2">{submission.studentName}</Typography>
                        </TableCell>
                        <TableCell>{submission.examTitle}</TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {submission.submitTime}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {submission.score}/{submission.maxScore}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={submission.grade}
                            sx={{
                              backgroundColor: getGradeColor(submission.grade),
                              color: 'white',
                              fontWeight: 'bold',
                            }}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            startIcon={<Visibility />}
                            onClick={() => alert('View detailed submission - feature to be implemented')}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {submissions.length === 0 && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  No submissions yet. Students will appear here after completing exams.
                </Alert>
              )}
            </CardContent>
          </TabPanel>

          {/* Tab 3: Performance Analytics */}
          <TabPanel value={currentTab} index={2}>
            <CardContent>
              <Typography variant="h5" gutterBottom>Performance Analytics</Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Average Scores by Exam</Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <RechartsBarChart data={performanceData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="exam" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="average" fill="#4caf50" />
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Submission Trends</Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={performanceData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="exam" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="submissions" stroke="#2196f3" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </TabPanel>
        </Card>
      </Container>

      {/* Create/Edit Exam Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingExam ? 'Edit Exam' : 'Create New Exam'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Exam Title"
              value={newExam.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Subject"
              value={newExam.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Date"
              type="date"
              value={newExam.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Time"
              type="time"
              value={newExam.time}
              onChange={(e) => handleInputChange('time', e.target.value)}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Duration (minutes)"
              type="number"
              value={newExam.duration}
              onChange={(e) => handleInputChange('duration', e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={newExam.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              fullWidth
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSaveExam}
            variant="contained"
            disabled={!newExam.title || !newExam.subject || !newExam.date || !newExam.time || !newExam.duration}
          >
            {editingExam ? 'Update' : 'Create'} Exam
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeacherDashboard;