import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './ProctorDashboard.css';

const ProctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [ongoingExams, setOngoingExams] = useState([]);
  const [activeStudents, setActiveStudents] = useState([]);
  const [flaggedActivities, setFlaggedActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedExam, setSelectedExam] = useState(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
    // Set up real-time updates
    const interval = setInterval(fetchDashboardData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch ongoing exams and active students
      const [examsResponse, studentsResponse, activitiesResponse] = await Promise.all([
        axios.get('/api/proctor/ongoing-exams'),
        axios.get('/api/proctor/active-students'),
        axios.get('/api/proctor/flagged-activities')
      ]);
      
      setOngoingExams(examsResponse.data || []);
      setActiveStudents(studentsResponse.data || []);
      setFlaggedActivities(activitiesResponse.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
      // Mock data for development
      setOngoingExams([
        {
          id: 1,
          title: 'Mathematics Final Exam',
          subject: 'Mathematics',
          startTime: '2024-01-20T10:00:00Z',
          endTime: '2024-01-20T12:00:00Z',
          duration: 120,
          activeStudents: 45,
          teacher: 'Dr. Smith',
          status: 'active'
        },
        {
          id: 2,
          title: 'Physics Quiz',
          subject: 'Physics',
          startTime: '2024-01-20T14:00:00Z',
          endTime: '2024-01-20T15:00:00Z',
          duration: 60,
          activeStudents: 32,
          teacher: 'Prof. Johnson',
          status: 'active'
        }
      ]);
      
      setActiveStudents([
        {
          id: 1,
          name: 'John Doe',
          studentId: 'ST001',
          examId: 1,
          examTitle: 'Mathematics Final Exam',
          joinedAt: '2024-01-20T10:05:00Z',
          lastActivity: '2024-01-20T10:30:00Z',
          status: 'active',
          suspiciousActivity: 0,
          webcamActive: true,
          screenActive: true
        },
        {
          id: 2,
          name: 'Jane Smith',
          studentId: 'ST002',
          examId: 1,
          examTitle: 'Mathematics Final Exam',
          joinedAt: '2024-01-20T10:02:00Z',
          lastActivity: '2024-01-20T10:29:00Z',
          status: 'active',
          suspiciousActivity: 1,
          webcamActive: true,
          screenActive: true
        },
        {
          id: 3,
          name: 'Mike Johnson',
          studentId: 'ST003',
          examId: 2,
          examTitle: 'Physics Quiz',
          joinedAt: '2024-01-20T14:01:00Z',
          lastActivity: '2024-01-20T14:15:00Z',
          status: 'warning',
          suspiciousActivity: 2,
          webcamActive: false,
          screenActive: true
        }
      ]);
      
      setFlaggedActivities([
        {
          id: 1,
          studentName: 'Jane Smith',
          studentId: 'ST002',
          examTitle: 'Mathematics Final Exam',
          activity: 'Multiple tab switches detected',
          timestamp: '2024-01-20T10:25:00Z',
          severity: 'medium',
          status: 'pending'
        },
        {
          id: 2,
          studentName: 'Mike Johnson',
          studentId: 'ST003',
          examTitle: 'Physics Quiz',
          activity: 'Webcam disconnected',
          timestamp: '2024-01-20T14:10:00Z',
          severity: 'high',
          status: 'pending'
        },
        {
          id: 3,
          studentName: 'Sarah Wilson',
          studentId: 'ST004',
          examTitle: 'Mathematics Final Exam',
          activity: 'Copy-paste detected',
          timestamp: '2024-01-20T10:20:00Z',
          severity: 'high',
          status: 'reviewed'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleStartMonitoring = (examId) => {
    setSelectedExam(examId);
    setIsMonitoring(true);
    setActiveTab('monitoring');
  };

  const handleStopMonitoring = () => {
    setIsMonitoring(false);
    setSelectedExam(null);
  };

  const handleFlagActivity = async (studentId, activityType) => {
    try {
      const student = activeStudents.find(s => s.id === studentId);
      const newActivity = {
        id: Date.now(),
        studentName: student.name,
        studentId: student.studentId,
        examTitle: student.examTitle,
        activity: activityType,
        timestamp: new Date().toISOString(),
        severity: 'medium',
        status: 'pending'
      };
      
      setFlaggedActivities([newActivity, ...flaggedActivities]);
      
      // Update student's suspicious activity count
      setActiveStudents(activeStudents.map(s => 
        s.id === studentId 
          ? { ...s, suspiciousActivity: s.suspiciousActivity + 1, status: 'warning' }
          : s
      ));
    } catch (error) {
      setError('Failed to flag activity');
    }
  };

  const handleResolveActivity = async (activityId, action) => {
    try {
      setFlaggedActivities(flaggedActivities.map(activity => 
        activity.id === activityId 
          ? { ...activity, status: action }
          : activity
      ));
    } catch (error) {
      setError('Failed to resolve activity');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatDateTime = (dateString) => {
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

  const getTimeRemaining = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;
    
    if (diff <= 0) return 'Ended';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m remaining`;
  };

  const getMonitoredStudents = () => {
    return selectedExam 
      ? activeStudents.filter(student => student.examId === selectedExam)
      : [];
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="proctor-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="user-info">
            <div className="user-avatar">👀</div>
            <div className="user-details">
              <h2>Welcome, {user?.name || 'Proctor'}</h2>
              <p className="user-role">Proctor Dashboard</p>
            </div>
          </div>
          <div className="header-actions">
            {isMonitoring && (
              <button className="stop-monitoring-btn" onClick={handleStopMonitoring}>
                🛑 Stop Monitoring
              </button>
            )}
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
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
          className={`nav-tab ${activeTab === 'monitoring' ? 'active' : ''}`}
          onClick={() => setActiveTab('monitoring')}
        >
          📹 Live Monitoring
        </button>
        <button 
          className={`nav-tab ${activeTab === 'activities' ? 'active' : ''}`}
          onClick={() => setActiveTab('activities')}
        >
          🚩 Flagged Activities
        </button>
      </nav>

      {/* Main Content */}
      <main className="dashboard-content">
        {error && <div className="error-message">{error}</div>}

        {activeTab === 'dashboard' && (
          <div className="dashboard-overview">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📝</div>
                <div className="stat-info">
                  <h3>{ongoingExams.length}</h3>
                  <p>Ongoing Exams</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <h3>{activeStudents.length}</h3>
                  <p>Active Students</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🚩</div>
                <div className="stat-info">
                  <h3>{flaggedActivities.filter(a => a.status === 'pending').length}</h3>
                  <p>Pending Flags</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⚠️</div>
                <div className="stat-info">
                  <h3>{activeStudents.filter(s => s.status === 'warning').length}</h3>
                  <p>Students at Risk</p>
                </div>
              </div>
            </div>

            <div className="ongoing-exams-section">
              <h3>Ongoing Exams</h3>
              {ongoingExams.length === 0 ? (
                <div className="no-exams">
                  <p>No ongoing exams at the moment</p>
                </div>
              ) : (
                <div className="exams-grid">
                  {ongoingExams.map(exam => (
                    <div key={exam.id} className="exam-card">
                      <div className="exam-header">
                        <h4>{exam.title}</h4>
                        <span className="exam-subject">{exam.subject}</span>
                      </div>
                      <div className="exam-details">
                        <p><strong>Teacher:</strong> {exam.teacher}</p>
                        <p><strong>Duration:</strong> {exam.duration} minutes</p>
                        <p><strong>Active Students:</strong> {exam.activeStudents}</p>
                        <p><strong>Time Remaining:</strong> {getTimeRemaining(exam.endTime)}</p>
                      </div>
                      <button 
                        className="monitor-btn"
                        onClick={() => handleStartMonitoring(exam.id)}
                      >
                        🔍 Start Monitoring
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="recent-activities-section">
              <h3>Recent Activities</h3>
              <div className="activities-list">
                {flaggedActivities.slice(0, 5).map(activity => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-info">
                      <h5>{activity.studentName} - {activity.activity}</h5>
                      <p>{activity.examTitle} • {formatDateTime(activity.timestamp)}</p>
                    </div>
                    <div className="activity-status">
                      <span className={`severity ${activity.severity}`}>
                        {activity.severity}
                      </span>
                      <span className={`status ${activity.status}`}>
                        {activity.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'monitoring' && (
          <div className="monitoring-section">
            {!isMonitoring ? (
              <div className="select-exam">
                <h3>Select an Exam to Monitor</h3>
                <div className="exam-selection-grid">
                  {ongoingExams.map(exam => (
                    <div key={exam.id} className="exam-selection-card">
                      <h4>{exam.title}</h4>
                      <p>{exam.activeStudents} active students</p>
                      <button 
                        className="select-btn"
                        onClick={() => handleStartMonitoring(exam.id)}
                      >
                        Start Monitoring
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="live-monitoring">
                <div className="monitoring-header">
                  <h3>Live Monitoring - {ongoingExams.find(e => e.id === selectedExam)?.title}</h3>
                  <div className="monitoring-controls">
                    <span className="live-indicator">🔴 LIVE</span>
                    <button className="refresh-btn" onClick={fetchDashboardData}>
                      🔄 Refresh
                    </button>
                  </div>
                </div>

                <div className="students-grid">
                  {getMonitoredStudents().map(student => (
                    <div key={student.id} className={`student-monitor ${student.status}`}>
                      <div className="student-header">
                        <h5>{student.name}</h5>
                        <span className="student-id">{student.studentId}</span>
                        <div className="status-indicators">
                          <span className={`indicator ${student.webcamActive ? 'active' : 'inactive'}`}>
                            📹 {student.webcamActive ? 'ON' : 'OFF'}
                          </span>
                          <span className={`indicator ${student.screenActive ? 'active' : 'inactive'}`}>
                            🖥️ {student.screenActive ? 'ON' : 'OFF'}
                          </span>
                        </div>
                      </div>

                      <div className="webcam-feed">
                        {student.webcamActive ? (
                          <div className="video-placeholder">
                            <p>📹 Live Video Feed</p>
                            <small>Student webcam active</small>
                          </div>
                        ) : (
                          <div className="video-placeholder offline">
                            <p>📹 No Video</p>
                            <small>Webcam disconnected</small>
                          </div>
                        )}
                      </div>

                      <div className="student-info">
                        <p><strong>Joined:</strong> {formatDateTime(student.joinedAt)}</p>
                        <p><strong>Last Activity:</strong> {formatDateTime(student.lastActivity)}</p>
                        <p><strong>Suspicious Activities:</strong> {student.suspiciousActivity}</p>
                      </div>

                      <div className="monitoring-actions">
                        <button 
                          className="flag-btn"
                          onClick={() => handleFlagActivity(student.id, 'Unusual behavior observed')}
                        >
                          🚩 Flag Activity
                        </button>
                        <button 
                          className="message-btn"
                          onClick={() => alert('Messaging feature coming soon')}
                        >
                          💬 Message
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'activities' && (
          <div className="activities-section">
            <h3>Flagged Activities</h3>
            
            <div className="activities-filters">
              <select className="filter-select">
                <option value="all">All Activities</option>
                <option value="pending">Pending Review</option>
                <option value="reviewed">Reviewed</option>
                <option value="dismissed">Dismissed</option>
              </select>
              <select className="filter-select">
                <option value="all">All Severity</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="activities-table">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Exam</th>
                    <th>Activity</th>
                    <th>Timestamp</th>
                    <th>Severity</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {flaggedActivities.map(activity => (
                    <tr key={activity.id}>
                      <td>
                        <div className="student-info">
                          <div className="student-name">{activity.studentName}</div>
                          <div className="student-id">{activity.studentId}</div>
                        </div>
                      </td>
                      <td>{activity.examTitle}</td>
                      <td>{activity.activity}</td>
                      <td>{formatDateTime(activity.timestamp)}</td>
                      <td>
                        <span className={`severity ${activity.severity}`}>
                          {activity.severity}
                        </span>
                      </td>
                      <td>
                        <span className={`status ${activity.status}`}>
                          {activity.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          {activity.status === 'pending' && (
                            <>
                              <button 
                                className="review-btn"
                                onClick={() => handleResolveActivity(activity.id, 'reviewed')}
                              >
                                ✅ Review
                              </button>
                              <button 
                                className="dismiss-btn"
                                onClick={() => handleResolveActivity(activity.id, 'dismissed')}
                              >
                                ❌ Dismiss
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProctorDashboard;