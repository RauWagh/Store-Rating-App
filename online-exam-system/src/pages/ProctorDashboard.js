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
  Tab,
  Tabs,
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
  List,
  ListItem,
  ListItemText,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Divider,
} from '@mui/material';
import {
  Logout,
  Videocam,
  Warning,
  Flag,
  Visibility,
  Security,
  School,
  Timer,
  Person,
  Stop,
  PlayArrow,
  VolumeUp,
  VolumeOff,
  Fullscreen,
  FullscreenExit,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Mock data for active exams and students
const mockActiveExams = [
  {
    id: 1,
    title: 'Mathematics Quiz',
    subject: 'Mathematics',
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    duration: 60,
    activeStudents: 8,
    totalStudents: 12,
    status: 'ongoing',
  },
  {
    id: 2,
    title: 'Physics Midterm',
    subject: 'Physics',
    startTime: '2:00 PM',
    endTime: '4:00 PM',
    duration: 120,
    activeStudents: 15,
    totalStudents: 18,
    status: 'upcoming',
  },
];

const mockStudentFeeds = [
  {
    id: 1,
    studentName: 'John Doe',
    studentId: 'STD001',
    examTitle: 'Mathematics Quiz',
    status: 'active',
    timeRemaining: 45,
    flags: 0,
    lastActivity: '2 mins ago',
    suspicious: false,
  },
  {
    id: 2,
    studentName: 'Jane Smith',
    studentId: 'STD002',
    examTitle: 'Mathematics Quiz',
    status: 'active',
    timeRemaining: 42,
    flags: 1,
    lastActivity: '1 min ago',
    suspicious: true,
  },
  {
    id: 3,
    studentName: 'Bob Johnson',
    studentId: 'STD003',
    examTitle: 'Mathematics Quiz',
    status: 'active',
    timeRemaining: 38,
    flags: 0,
    lastActivity: '30 secs ago',
    suspicious: false,
  },
  {
    id: 4,
    studentName: 'Alice Brown',
    studentId: 'STD004',
    examTitle: 'Mathematics Quiz',
    status: 'active',
    timeRemaining: 50,
    flags: 2,
    lastActivity: '3 mins ago',
    suspicious: true,
  },
];

const mockActivityLogs = [
  {
    id: 1,
    timestamp: '10:15 AM',
    studentName: 'Jane Smith',
    activity: 'Multiple browser tabs detected',
    severity: 'high',
    action: 'flagged',
  },
  {
    id: 2,
    timestamp: '10:12 AM',
    studentName: 'Alice Brown',
    activity: 'Left exam window',
    severity: 'medium',
    action: 'warning sent',
  },
  {
    id: 3,
    timestamp: '10:08 AM',
    studentName: 'John Doe',
    activity: 'Started exam',
    severity: 'info',
    action: 'logged',
  },
];

const ProctorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [activeExams] = useState(mockActiveExams);
  const [studentFeeds, setStudentFeeds] = useState(mockStudentFeeds);
  const [activityLogs, setActivityLogs] = useState(mockActivityLogs);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openFlagDialog, setOpenFlagDialog] = useState(false);
  const [flagReason, setFlagReason] = useState('');
  const [flagType, setFlagType] = useState('suspicious');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);

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

  const handleFlagStudent = (student) => {
    setSelectedStudent(student);
    setOpenFlagDialog(true);
  };

  const handleSubmitFlag = () => {
    if (selectedStudent && flagReason) {
      // Update student flags
      setStudentFeeds(prev => prev.map(student => 
        student.id === selectedStudent.id 
          ? { ...student, flags: student.flags + 1, suspicious: true }
          : student
      ));

      // Add to activity log
      const newLog = {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        studentName: selectedStudent.studentName,
        activity: flagReason,
        severity: flagType === 'violation' ? 'high' : 'medium',
        action: 'flagged by proctor',
      };
      setActivityLogs(prev => [newLog, ...prev]);

      setOpenFlagDialog(false);
      setFlagReason('');
      setSelectedStudent(null);
    }
  };

  const handleEndMonitoring = (studentId) => {
    if (window.confirm('Are you sure you want to end monitoring for this student?')) {
      setStudentFeeds(prev => prev.map(student => 
        student.id === studentId 
          ? { ...student, status: 'ended' }
          : student
      ));
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return '#f44336';
      case 'medium':
        return '#ff9800';
      case 'info':
        return '#2196f3';
      default:
        return '#757575';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'ended':
        return 'error';
      case 'paused':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatTimeRemaining = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );

  // Mock webcam feed component
  const WebcamFeed = ({ student, size = 'small' }) => (
    <Card 
      sx={{ 
        position: 'relative',
        aspectRatio: '4/3',
        backgroundColor: '#000',
        border: student.suspicious ? '2px solid #f44336' : '1px solid #ddd',
        '&:hover': {
          boxShadow: 3,
        },
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          backgroundColor: '#333',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          position: 'relative',
        }}
      >
        <Videocam sx={{ fontSize: 40, opacity: 0.5 }} />
        
        {/* Student info overlay */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
            color: 'white',
            p: 1,
          }}
        >
          <Typography variant="caption" display="block">
            {student.studentName}
          </Typography>
          <Typography variant="caption" display="block">
            {student.studentId}
          </Typography>
        </Box>

        {/* Status indicators */}
        {student.suspicious && (
          <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
            <Badge badgeContent={student.flags} color="error">
              <Warning sx={{ color: '#f44336' }} />
            </Badge>
          </Box>
        )}

        {/* Recording indicator */}
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#f44336',
              animation: 'pulse 1.5s infinite',
              '@keyframes pulse': {
                '0%': { opacity: 1 },
                '50%': { opacity: 0.5 },
                '100%': { opacity: 1 },
              },
            }}
          />
          <Typography variant="caption" sx={{ fontSize: 10 }}>
            REC
          </Typography>
        </Box>
      </Box>
    </Card>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <AppBar position="static" sx={{ background: 'linear-gradient(45deg, #7b1fa2, #ba68c8)' }}>
        <Toolbar>
          <Security sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Proctor Dashboard
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
                {user?.fullName?.charAt(0) || 'P'}
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

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {/* Welcome Card */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <Card sx={{ background: 'linear-gradient(45deg, #9c27b0, #e1bee7)', color: 'white' }}>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  Welcome back, {user?.fullName}!
                </Typography>
                <Typography variant="h6">
                  Currently monitoring {studentFeeds.filter(s => s.status === 'active').length} active students across {activeExams.filter(e => e.status === 'ongoing').length} ongoing exams
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: '#f3e5f5' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <School sx={{ fontSize: 40, color: '#7b1fa2', mb: 1 }} />
                <Typography variant="h4" color="#7b1fa2">
                  {activeExams.filter(e => e.status === 'ongoing').length}
                </Typography>
                <Typography variant="body2">
                  Active Exams
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: '#e8f5e8' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Person sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
                <Typography variant="h4" color="#4caf50">
                  {studentFeeds.filter(s => s.status === 'active').length}
                </Typography>
                <Typography variant="body2">
                  Students Online
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: '#fff3e0' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Warning sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
                <Typography variant="h4" color="#ff9800">
                  {studentFeeds.filter(s => s.suspicious).length}
                </Typography>
                <Typography variant="body2">
                  Flagged Students
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: '#ffebee' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Flag sx={{ fontSize: 40, color: '#f44336', mb: 1 }} />
                <Typography variant="h4" color="#f44336">
                  {studentFeeds.reduce((total, s) => total + s.flags, 0)}
                </Typography>
                <Typography variant="body2">
                  Total Flags
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Content with Tabs */}
        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={currentTab} onChange={handleTabChange}>
              <Tab label="Live Monitoring" />
              <Tab label="Activity Logs" />
              <Tab label="Exam Overview" />
            </Tabs>
          </Box>

          {/* Tab 1: Live Monitoring */}
          <TabPanel value={currentTab} index={0}>
            <CardContent>
              <Typography variant="h5" gutterBottom>Live Student Monitoring</Typography>
              
              <Grid container spacing={3}>
                {studentFeeds.filter(s => s.status === 'active').map((student) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={student.id}>
                    <Card variant="outlined">
                      <WebcamFeed student={student} />
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle2" noWrap>
                            {student.studentName}
                          </Typography>
                          <Chip
                            label={student.status}
                            color={getStatusColor(student.status)}
                            size="small"
                          />
                        </Box>
                        
                        <Typography variant="caption" color="text.secondary" display="block">
                          Exam: {student.examTitle}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1 }}>
                          <Timer fontSize="small" />
                          <Typography variant="caption">
                            {formatTimeRemaining(student.timeRemaining)} remaining
                          </Typography>
                        </Box>
                        
                        {student.flags > 0 && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Warning fontSize="small" color="warning" />
                            <Typography variant="caption" color="warning.main">
                              {student.flags} flag(s)
                            </Typography>
                          </Box>
                        )}
                        
                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            color="warning"
                            startIcon={<Flag />}
                            onClick={() => handleFlagStudent(student)}
                            fullWidth
                          >
                            Flag
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            startIcon={<Stop />}
                            onClick={() => handleEndMonitoring(student.id)}
                            fullWidth
                          >
                            End
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {studentFeeds.filter(s => s.status === 'active').length === 0 && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  No active students to monitor at the moment.
                </Alert>
              )}
            </CardContent>
          </TabPanel>

          {/* Tab 2: Activity Logs */}
          <TabPanel value={currentTab} index={1}>
            <CardContent>
              <Typography variant="h5" gutterBottom>Real-time Activity Logs</Typography>
              
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'grey.50' }}>
                      <TableCell><strong>Time</strong></TableCell>
                      <TableCell><strong>Student</strong></TableCell>
                      <TableCell><strong>Activity</strong></TableCell>
                      <TableCell><strong>Severity</strong></TableCell>
                      <TableCell><strong>Action Taken</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activityLogs.map((log) => (
                      <TableRow key={log.id} hover>
                        <TableCell>
                          <Typography variant="body2">{log.timestamp}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">{log.studentName}</Typography>
                        </TableCell>
                        <TableCell>{log.activity}</TableCell>
                        <TableCell>
                          <Chip
                            label={log.severity}
                            sx={{
                              backgroundColor: getSeverityColor(log.severity),
                              color: 'white',
                              textTransform: 'uppercase',
                              fontSize: 10,
                            }}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {log.action}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {activityLogs.length === 0 && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  No activity logs recorded yet.
                </Alert>
              )}
            </CardContent>
          </TabPanel>

          {/* Tab 3: Exam Overview */}
          <TabPanel value={currentTab} index={2}>
            <CardContent>
              <Typography variant="h5" gutterBottom>Exam Overview</Typography>
              
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'grey.50' }}>
                      <TableCell><strong>Exam Title</strong></TableCell>
                      <TableCell><strong>Subject</strong></TableCell>
                      <TableCell><strong>Time</strong></TableCell>
                      <TableCell><strong>Duration</strong></TableCell>
                      <TableCell><strong>Students</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activeExams.map((exam) => (
                      <TableRow key={exam.id} hover>
                        <TableCell>
                          <Typography variant="subtitle2">{exam.title}</Typography>
                        </TableCell>
                        <TableCell>{exam.subject}</TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {exam.startTime} - {exam.endTime}
                          </Typography>
                        </TableCell>
                        <TableCell>{exam.duration} min</TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {exam.activeStudents}/{exam.totalStudents} active
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={exam.status}
                            color={exam.status === 'ongoing' ? 'success' : 'primary'}
                            size="small"
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </TabPanel>
        </Card>
      </Container>

      {/* Flag Student Dialog */}
      <Dialog open={openFlagDialog} onClose={() => setOpenFlagDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Flag Suspicious Activity
        </DialogTitle>
        <DialogContent>
          {selectedStudent && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1">
                Student: {selectedStudent.studentName} ({selectedStudent.studentId})
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Exam: {selectedStudent.examTitle}
              </Typography>
            </Box>
          )}
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Flag Type</InputLabel>
            <Select
              value={flagType}
              label="Flag Type"
              onChange={(e) => setFlagType(e.target.value)}
            >
              <MenuItem value="suspicious">Suspicious Behavior</MenuItem>
              <MenuItem value="violation">Policy Violation</MenuItem>
              <MenuItem value="technical">Technical Issue</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            label="Reason for Flag"
            multiline
            rows={3}
            value={flagReason}
            onChange={(e) => setFlagReason(e.target.value)}
            placeholder="Describe the suspicious activity or violation..."
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFlagDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSubmitFlag}
            variant="contained"
            color="warning"
            disabled={!flagReason.trim()}
          >
            Submit Flag
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProctorDashboard;