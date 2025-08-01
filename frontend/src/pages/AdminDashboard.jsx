import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 'student',
    studentId: '',
    department: '',
    password: '',
    status: 'active'
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch users and reports
      const [usersResponse, reportsResponse] = await Promise.all([
        axios.get('/api/admin/users'),
        axios.get('/api/admin/reports')
      ]);
      
      setUsers(usersResponse.data || []);
      setReports(reportsResponse.data || {});
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
      // Mock data for development
      setUsers([
        {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
          role: 'student',
          studentId: 'ST001',
          department: 'Computer Science',
          status: 'active',
          lastLogin: '2024-01-18T10:30:00Z',
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          role: 'teacher',
          employeeId: 'TC001',
          department: 'Mathematics',
          status: 'active',
          lastLogin: '2024-01-18T09:15:00Z',
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 3,
          name: 'Mike Johnson',
          email: 'mike.johnson@example.com',
          role: 'proctor',
          employeeId: 'PR001',
          department: 'Administration',
          status: 'active',
          lastLogin: '2024-01-17T16:45:00Z',
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 4,
          name: 'Sarah Wilson',
          email: 'sarah.wilson@example.com',
          role: 'student',
          studentId: 'ST002',
          department: 'Physics',
          status: 'inactive',
          lastLogin: '2024-01-15T14:20:00Z',
          createdAt: '2024-01-01T00:00:00Z'
        }
      ]);
      
      setReports({
        totalUsers: 256,
        activeUsers: 234,
        totalExams: 45,
        ongoingExams: 3,
        systemUsage: {
          dailyActiveUsers: 180,
          weeklyActiveUsers: 220,
          monthlyActiveUsers: 245
        },
        usersByRole: {
          students: 200,
          teachers: 35,
          proctors: 15,
          admins: 6
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      // Validate form
      if (!userForm.name || !userForm.email || !userForm.role) {
        setError('Please fill in all required fields');
        return;
      }

      const newUser = {
        ...userForm,
        id: Date.now(), // Temporary ID
        lastLogin: null,
        createdAt: new Date().toISOString()
      };

      if (editingUser) {
        // Update existing user
        setUsers(users.map(u => u.id === editingUser.id ? { ...newUser, id: editingUser.id } : u));
        setEditingUser(null);
      } else {
        // Create new user
        setUsers([...users, newUser]);
      }

      // Reset form
      setUserForm({
        name: '',
        email: '',
        role: 'student',
        studentId: '',
        department: '',
        password: '',
        status: 'active'
      });
      setShowUserForm(false);
      setError('');
    } catch (error) {
      setError('Failed to create user');
    }
  };

  const handleEditUser = (user) => {
    setUserForm({
      name: user.name,
      email: user.email,
      role: user.role,
      studentId: user.studentId || '',
      department: user.department || '',
      password: '',
      status: user.status
    });
    setEditingUser(user);
    setShowUserForm(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        setUsers(users.filter(user => user.id !== userId));
      } catch (error) {
        setError('Failed to delete user');
      }
    }
  };

  const handleStatusToggle = async (userId) => {
    try {
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
          : user
      ));
    } catch (error) {
      setError('Failed to update user status');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFilteredAndSortedUsers = () => {
    let filtered = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (user.studentId && user.studentId.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesRole = filterRole === 'all' || user.role === filterRole;
      return matchesSearch && matchesRole;
    });

    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const filteredUsers = getFilteredAndSortedUsers();

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="user-info">
            <div className="user-avatar">👨‍💼</div>
            <div className="user-details">
              <h2>Welcome, {user?.name || 'Admin'}</h2>
              <p className="user-role">Administrator Dashboard</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="dashboard-nav">
        <button 
          className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button 
          className={`nav-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 User Management
        </button>
        <button 
          className={`nav-tab ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          📈 Reports
        </button>
      </nav>

      {/* Main Content */}
      <main className="dashboard-content">
        {error && <div className="error-message">{error}</div>}

        {activeTab === 'dashboard' && (
          <div className="dashboard-overview">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <h3>{reports.totalUsers || 0}</h3>
                  <p>Total Users</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-info">
                  <h3>{reports.activeUsers || 0}</h3>
                  <p>Active Users</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📝</div>
                <div className="stat-info">
                  <h3>{reports.totalExams || 0}</h3>
                  <p>Total Exams</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🔄</div>
                <div className="stat-info">
                  <h3>{reports.ongoingExams || 0}</h3>
                  <p>Ongoing Exams</p>
                </div>
              </div>
            </div>

            <div className="charts-section">
              <div className="chart-card">
                <h3>User Activity</h3>
                <div className="activity-stats">
                  <div className="activity-item">
                    <span className="label">Daily Active Users</span>
                    <span className="value">{reports.systemUsage?.dailyActiveUsers || 0}</span>
                  </div>
                  <div className="activity-item">
                    <span className="label">Weekly Active Users</span>
                    <span className="value">{reports.systemUsage?.weeklyActiveUsers || 0}</span>
                  </div>
                  <div className="activity-item">
                    <span className="label">Monthly Active Users</span>
                    <span className="value">{reports.systemUsage?.monthlyActiveUsers || 0}</span>
                  </div>
                </div>
              </div>

              <div className="chart-card">
                <h3>Users by Role</h3>
                <div className="role-stats">
                  <div className="role-item">
                    <span className="role-label students">Students</span>
                    <span className="role-value">{reports.usersByRole?.students || 0}</span>
                  </div>
                  <div className="role-item">
                    <span className="role-label teachers">Teachers</span>
                    <span className="role-value">{reports.usersByRole?.teachers || 0}</span>
                  </div>
                  <div className="role-item">
                    <span className="role-label proctors">Proctors</span>
                    <span className="role-value">{reports.usersByRole?.proctors || 0}</span>
                  </div>
                  <div className="role-item">
                    <span className="role-label admins">Admins</span>
                    <span className="role-value">{reports.usersByRole?.admins || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="recent-activity-section">
              <h3>Recent User Activity</h3>
              <div className="activity-list">
                {users.slice(0, 5).map(user => (
                  <div key={user.id} className="activity-item">
                    <div className="activity-info">
                      <h5>{user.name} ({user.role})</h5>
                      <p>Last login: {formatDateTime(user.lastLogin)}</p>
                    </div>
                    <div className="activity-status">
                      <span className={`status ${user.status}`}>
                        {user.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="user-management">
            <div className="users-header">
              <h3>User Management</h3>
              <button 
                className="create-user-btn"
                onClick={() => {
                  setShowUserForm(true);
                  setEditingUser(null);
                  setUserForm({
                    name: '',
                    email: '',
                    role: 'student',
                    studentId: '',
                    department: '',
                    password: '',
                    status: 'active'
                  });
                }}
              >
                + Add New User
              </button>
            </div>

            <div className="users-filters">
              <div className="search-filter">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <div className="role-filter">
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Roles</option>
                  <option value="student">Students</option>
                  <option value="teacher">Teachers</option>
                  <option value="proctor">Proctors</option>
                  <option value="admin">Admins</option>
                </select>
              </div>
              <div className="sort-filter">
                <select
                  value={`${sortField}-${sortDirection}`}
                  onChange={(e) => {
                    const [field, direction] = e.target.value.split('-');
                    setSortField(field);
                    setSortDirection(direction);
                  }}
                  className="filter-select"
                >
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="role-asc">Role (A-Z)</option>
                  <option value="role-desc">Role (Z-A)</option>
                  <option value="status-asc">Status (A-Z)</option>
                  <option value="status-desc">Status (Z-A)</option>
                </select>
              </div>
            </div>

            {showUserForm && (
              <div className="user-form-container">
                <form onSubmit={handleCreateUser} className="user-form">
                  <div className="form-header">
                    <h4>{editingUser ? 'Edit User' : 'Add New User'}</h4>
                    <button 
                      type="button" 
                      className="close-btn"
                      onClick={() => {
                        setShowUserForm(false);
                        setEditingUser(null);
                      }}
                    >
                      ×
                    </button>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        value={userForm.name}
                        onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                        placeholder="Enter full name"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Email *</label>
                      <input
                        type="email"
                        value={userForm.email}
                        onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                        placeholder="Enter email address"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Role *</label>
                      <select
                        value={userForm.role}
                        onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                        required
                      >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="proctor">Proctor</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Department</label>
                      <input
                        type="text"
                        value={userForm.department}
                        onChange={(e) => setUserForm({...userForm, department: e.target.value})}
                        placeholder="Enter department"
                      />
                    </div>

                    {userForm.role === 'student' && (
                      <div className="form-group">
                        <label>Student ID</label>
                        <input
                          type="text"
                          value={userForm.studentId}
                          onChange={(e) => setUserForm({...userForm, studentId: e.target.value})}
                          placeholder="Enter student ID"
                        />
                      </div>
                    )}

                    <div className="form-group">
                      <label>Status</label>
                      <select
                        value={userForm.status}
                        onChange={(e) => setUserForm({...userForm, status: e.target.value})}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>

                    <div className="form-group full-width">
                      <label>Password {editingUser ? '(leave blank to keep current)' : '*'}</label>
                      <input
                        type="password"
                        value={userForm.password}
                        onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                        placeholder="Enter password"
                        required={!editingUser}
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="button" className="cancel-btn" onClick={() => setShowUserForm(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="submit-btn">
                      {editingUser ? 'Update User' : 'Create User'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Last Login</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-info">
                          <div className="user-name">{user.name}</div>
                          {user.studentId && (
                            <div className="user-id">{user.studentId}</div>
                          )}
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.role}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>{user.department}</td>
                      <td>
                        <span className={`status ${user.status}`}>
                          {user.status}
                        </span>
                      </td>
                      <td>{formatDateTime(user.lastLogin)}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="edit-btn"
                            onClick={() => handleEditUser(user)}
                            title="Edit User"
                          >
                            ✏️
                          </button>
                          <button 
                            className="status-btn"
                            onClick={() => handleStatusToggle(user.id)}
                            title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                          >
                            {user.status === 'active' ? '🔒' : '🔓'}
                          </button>
                          <button 
                            className="delete-btn"
                            onClick={() => handleDeleteUser(user.id)}
                            title="Delete User"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="no-users">
                <p>No users found matching your criteria</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="reports-section">
            <h3>System Reports</h3>
            
            <div className="reports-grid">
              <div className="report-card">
                <h4>User Statistics</h4>
                <div className="report-content">
                  <p><strong>Total Registered Users:</strong> {reports.totalUsers}</p>
                  <p><strong>Active Users:</strong> {reports.activeUsers}</p>
                  <p><strong>Inactive Users:</strong> {(reports.totalUsers || 0) - (reports.activeUsers || 0)}</p>
                  <p><strong>New Users This Month:</strong> 15</p>
                </div>
              </div>

              <div className="report-card">
                <h4>Exam Statistics</h4>
                <div className="report-content">
                  <p><strong>Total Exams Created:</strong> {reports.totalExams}</p>
                  <p><strong>Ongoing Exams:</strong> {reports.ongoingExams}</p>
                  <p><strong>Completed Exams:</strong> {(reports.totalExams || 0) - (reports.ongoingExams || 0)}</p>
                  <p><strong>Average Exam Duration:</strong> 90 minutes</p>
                </div>
              </div>

              <div className="report-card">
                <h4>System Usage</h4>
                <div className="report-content">
                  <p><strong>Daily Active Users:</strong> {reports.systemUsage?.dailyActiveUsers}</p>
                  <p><strong>Peak Usage Hour:</strong> 10:00 AM - 11:00 AM</p>
                  <p><strong>Average Session Duration:</strong> 45 minutes</p>
                  <p><strong>System Uptime:</strong> 99.8%</p>
                </div>
              </div>

              <div className="report-card">
                <h4>Security & Monitoring</h4>
                <div className="report-content">
                  <p><strong>Failed Login Attempts:</strong> 12 (last 24h)</p>
                  <p><strong>Suspicious Activities:</strong> 2 flagged</p>
                  <p><strong>Data Backups:</strong> Daily (Last: Today 2:00 AM)</p>
                  <p><strong>System Health:</strong> Excellent</p>
                </div>
              </div>
            </div>

            <div className="export-section">
              <h4>Export Reports</h4>
              <div className="export-buttons">
                <button className="export-btn">📊 Export User Report</button>
                <button className="export-btn">📈 Export Usage Analytics</button>
                <button className="export-btn">🔒 Export Security Log</button>
                <button className="export-btn">📝 Export Exam Statistics</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
