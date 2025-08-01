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
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  TablePagination,
  InputAdornment,
} from '@mui/material';
import {
  Logout,
  Add,
  Edit,
  Delete,
  Search,
  FilterList,
  People,
  Assessment,
  Settings,
  School,
  AdminPanelSettings,
  Person,
  Security,
  GetApp,
  Visibility,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Mock data
const mockUsers = [
  {
    id: 1,
    username: 'john_doe',
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    role: 'student',
    status: 'active',
    lastLogin: '2024-01-15 09:30 AM',
    createdAt: '2024-01-01',
  },
  {
    id: 2,
    username: 'jane_smith',
    fullName: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'teacher',
    status: 'active',
    lastLogin: '2024-01-15 08:45 AM',
    createdAt: '2024-01-02',
  },
  {
    id: 3,
    username: 'bob_johnson',
    fullName: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    role: 'student',
    status: 'inactive',
    lastLogin: '2024-01-10 03:20 PM',
    createdAt: '2024-01-03',
  },
  {
    id: 4,
    username: 'alice_proctor',
    fullName: 'Alice Proctor',
    email: 'alice.proctor@example.com',
    role: 'proctor',
    status: 'active',
    lastLogin: '2024-01-15 07:15 AM',
    createdAt: '2024-01-04',
  },
];

const systemStats = [
  { name: 'Students', value: 150, color: '#1976d2' },
  { name: 'Teachers', value: 25, color: '#388e3c' },
  { name: 'Proctors', value: 8, color: '#7b1fa2' },
  { name: 'Admins', value: 3, color: '#f57c00' },
];

const activityData = [
  { date: '2024-01-10', logins: 45, exams: 8, submissions: 32 },
  { date: '2024-01-11', logins: 52, exams: 12, submissions: 48 },
  { date: '2024-01-12', logins: 38, exams: 6, submissions: 28 },
  { date: '2024-01-13', logins: 61, exams: 15, submissions: 55 },
  { date: '2024-01-14', logins: 43, exams: 9, submissions: 38 },
  { date: '2024-01-15', logins: 58, exams: 11, submissions: 42 },
];

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [users, setUsers] = useState(mockUsers);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [newUser, setNewUser] = useState({
    username: '',
    fullName: '',
    email: '',
    role: 'student',
    password: '',
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

  const handleCreateUser = () => {
    setEditingUser(null);
    setNewUser({
      username: '',
      fullName: '',
      email: '',
      role: 'student',
      password: '',
    });
    setOpenDialog(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setNewUser({
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      password: '',
    });
    setOpenDialog(true);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handleSaveUser = () => {
    if (editingUser) {
      // Update existing user
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...newUser }
          : user
      ));
    } else {
      // Create new user
      const newUserObj = {
        id: Date.now(),
        ...newUser,
        status: 'active',
        lastLogin: 'Never',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setUsers([...users, newUserObj]);
    }
    setOpenDialog(false);
  };

  const handleInputChange = (field, value) => {
    setNewUser(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return '#f57c00';
      case 'teacher':
        return '#388e3c';
      case 'proctor':
        return '#7b1fa2';
      case 'student':
        return '#1976d2';
      default:
        return '#757575';
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'success' : 'error';
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const paginatedUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const generateReport = () => {
    alert('Report generation feature to be implemented. This would export data as PDF/Excel.');
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );

  const sidebarItems = [
    { text: 'User Management', icon: <People />, tab: 0 },
    { text: 'System Reports', icon: <Assessment />, tab: 1 },
    { text: 'Platform Settings', icon: <Settings />, tab: 2 },
  ];

  return (
    <Box sx={{ flexGrow: 1, display: 'flex' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            position: 'relative',
          },
        }}
      >
        <Box sx={{ p: 2, textAlign: 'center', bgcolor: '#f57c00', color: 'white' }}>
          <AdminPanelSettings sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="h6">Admin Panel</Typography>
        </Box>
        <List>
          {sidebarItems.map((item, index) => (
            <ListItem
              button
              key={item.text}
              onClick={() => setCurrentTab(item.tab)}
              selected={currentTab === item.tab}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: '#fff3e0',
                  borderRight: '3px solid #f57c00',
                },
              }}
            >
              <ListItemIcon sx={{ color: currentTab === item.tab ? '#f57c00' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1 }}>
        {/* Header */}
        <AppBar position="static" sx={{ background: 'linear-gradient(45deg, #f57c00, #ff9800)' }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Admin Dashboard
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
                  {user?.fullName?.charAt(0) || 'A'}
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
              <Card sx={{ background: 'linear-gradient(45deg, #ff9800, #ffb74d)', color: 'white' }}>
                <CardContent>
                  <Typography variant="h4" gutterBottom>
                    Welcome back, {user?.fullName}!
                  </Typography>
                  <Typography variant="h6">
                    System Overview: {users.length} total users, {users.filter(u => u.status === 'active').length} active
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Tab 1: User Management */}
          <TabPanel value={currentTab} index={0}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5">User Management</Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleCreateUser}
                    sx={{ background: 'linear-gradient(45deg, #f57c00, #ff9800)' }}
                  >
                    Add New User
                  </Button>
                </Box>

                {/* Filters */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Role</InputLabel>
                      <Select
                        value={roleFilter}
                        label="Role"
                        onChange={(e) => setRoleFilter(e.target.value)}
                      >
                        <MenuItem value="all">All Roles</MenuItem>
                        <MenuItem value="student">Students</MenuItem>
                        <MenuItem value="teacher">Teachers</MenuItem>
                        <MenuItem value="proctor">Proctors</MenuItem>
                        <MenuItem value="admin">Admins</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={statusFilter}
                        label="Status"
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <MenuItem value="all">All Status</MenuItem>
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: 'grey.50' }}>
                        <TableCell><strong>Full Name</strong></TableCell>
                        <TableCell><strong>Username</strong></TableCell>
                        <TableCell><strong>Email</strong></TableCell>
                        <TableCell><strong>Role</strong></TableCell>
                        <TableCell><strong>Status</strong></TableCell>
                        <TableCell><strong>Last Login</strong></TableCell>
                        <TableCell><strong>Actions</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedUsers.map((user) => (
                        <TableRow key={user.id} hover>
                          <TableCell>
                            <Typography variant="subtitle2">{user.fullName}</Typography>
                          </TableCell>
                          <TableCell>{user.username}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Chip
                              label={user.role}
                              sx={{
                                backgroundColor: getRoleColor(user.role),
                                color: 'white',
                                textTransform: 'capitalize',
                              }}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={user.status}
                              color={getStatusColor(user.status)}
                              size="small"
                              sx={{ textTransform: 'capitalize' }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {user.lastLogin}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <IconButton
                                size="small"
                                onClick={() => handleEditUser(user)}
                                color="primary"
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteUser(user.id)}
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

                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={filteredUsers.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />

                {filteredUsers.length === 0 && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    No users found matching the current filters.
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabPanel>

          {/* Tab 2: System Reports */}
          <TabPanel value={currentTab} index={1}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h5">System Reports</Typography>
                      <Button
                        variant="contained"
                        startIcon={<GetApp />}
                        onClick={generateReport}
                        sx={{ background: 'linear-gradient(45deg, #f57c00, #ff9800)' }}
                      >
                        Generate Report
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* User Distribution */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>User Distribution by Role</Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={systemStats}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {systemStats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>

              {/* Activity Trends */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Daily Activity</Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={activityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="logins" fill="#1976d2" name="Logins" />
                        <Bar dataKey="exams" fill="#388e3c" name="Exams Created" />
                        <Bar dataKey="submissions" fill="#f57c00" name="Submissions" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Tab 3: Platform Settings */}
          <TabPanel value={currentTab} index={2}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>Platform Settings</Typography>
                <Alert severity="info">
                  Platform configuration settings would be implemented here. This could include:
                  system maintenance, backup settings, email configurations, security policies, etc.
                </Alert>
              </CardContent>
            </Card>
          </TabPanel>
        </Container>
      </Box>

      {/* Create/Edit User Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingUser ? 'Edit User' : 'Create New User'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Full Name"
              value={newUser.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Username"
              value={newUser.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Email"
              type="email"
              value={newUser.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              fullWidth
              required
            />
            <FormControl fullWidth required>
              <InputLabel>Role</InputLabel>
              <Select
                value={newUser.role}
                label="Role"
                onChange={(e) => handleInputChange('role', e.target.value)}
              >
                <MenuItem value="student">Student</MenuItem>
                <MenuItem value="teacher">Teacher</MenuItem>
                <MenuItem value="proctor">Proctor</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label={editingUser ? "New Password (leave blank to keep current)" : "Password"}
              type="password"
              value={newUser.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              fullWidth
              required={!editingUser}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSaveUser}
            variant="contained"
            disabled={!newUser.fullName || !newUser.username || !newUser.email || (!editingUser && !newUser.password)}
          >
            {editingUser ? 'Update' : 'Create'} User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;